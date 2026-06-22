# Telugu Learning App - Backend
# FastAPI + SQLite backend for language learning

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from database import engine, Base
from routers import auth, lessons, practice, progress, audio


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Shutdown: cleanup
    await engine.dispose()


app = FastAPI(
    title="Telugu Learning API",
    description="Backend API for Telugu language learning app for kids",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS - allow GitHub Pages frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://bharathp9.github.io",
        "http://187.77.131.116:8000",
        "http://187.77.131.116",
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(lessons.router, prefix="/api/lessons", tags=["lessons"])
app.include_router(practice.router, prefix="/api/practice", tags=["practice"])
app.include_router(progress.router, prefix="/api/progress", tags=["progress"])
app.include_router(audio.router, prefix="/api/audio", tags=["audio"])


@app.get("/api/health")
async def health_check():
    return {"status": "ok", "app": "telugu-learning-api"}
