# Backend tests - TDD approach

import pytest
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

from main import app
from database import Base, get_db

# Test database
TEST_DATABASE_URL = "sqlite+aiosqlite:///./test.db"
test_engine = create_async_engine(TEST_DATABASE_URL, echo=False)
test_session = async_sessionmaker(test_engine, class_=AsyncSession, expire_on_commit=False)


async def override_get_db():
    async with test_session() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(autouse=True)
async def setup_db():
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest.mark.asyncio
async def test_health_check():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/health")
        assert response.status_code == 200
        assert response.json()["status"] == "ok"


@pytest.mark.asyncio
async def test_register_user():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post("/api/auth/register", json={
            "username": "testkid",
            "display_name": "Test Kid",
            "avatar_emoji": "🦁",
        })
        assert response.status_code == 200
        data = response.json()
        assert data["user"]["username"] == "testkid"
        assert "token" in data


@pytest.mark.asyncio
async def test_login_user():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Register first
        reg_response = await client.post("/api/auth/register", json={
            "username": "loginkid",
            "display_name": "Login Kid",
        })
        token = reg_response.json()["token"]

        # Login
        response = await client.post("/api/auth/login", params={"username": "loginkid"})
        assert response.status_code == 200
        assert response.json()["token"] == token


@pytest.mark.asyncio
async def test_list_lessons():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/lessons/")
        assert response.status_code == 200
        assert isinstance(response.json(), list)
