# Auth router - Register and login for kids

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import secrets

from database import get_db
from models import User
from schemas import UserCreate, UserResponse, TokenResponse

router = APIRouter()


@router.post("/register", response_model=TokenResponse)
async def register(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    # Check if username exists
    result = await db.execute(select(User).where(User.username == user_data.username))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Username already taken")

    # Create user with simple token auth
    token = secrets.token_hex(32)
    user = User(
        username=user_data.username,
        display_name=user_data.display_name,
        avatar_emoji=user_data.avatar_emoji,
        auth_token=token,
    )
    db.add(user)
    await db.flush()
    await db.refresh(user)

    return TokenResponse(token=token, user=UserResponse.model_validate(user))


@router.post("/login", response_model=TokenResponse)
async def login(username: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.username == username))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return TokenResponse(token=user.auth_token, user=UserResponse.model_validate(user))


async def get_current_user(token: str, db: AsyncSession = Depends(get_db)) -> User:
    result = await db.execute(select(User).where(User.auth_token == token))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user
