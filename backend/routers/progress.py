# Progress router - User stats, leaderboard, achievements

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List

from database import get_db
from models import User, UserProgress, Achievement, UserAchievement
from schemas import UserStats, LeaderboardEntry, AchievementResponse
from routers.auth import get_current_user

router = APIRouter()


@router.get("/{user_id}", response_model=UserStats)
async def get_user_stats(
    user_id: int,
    token: str = Depends(lambda: ...),
    db: AsyncSession = Depends(get_db),
):
    user = await get_current_user(token, db)

    # Count words learned (practiced at least once)
    learned_result = await db.execute(
        select(func.count(UserProgress.id)).where(
            UserProgress.user_id == user.id,
            UserProgress.times_practiced > 0,
        )
    )
    words_learned = learned_result.scalar()

    # Count words mastered
    mastered_result = await db.execute(
        select(func.count(UserProgress.id)).where(
            UserProgress.user_id == user.id,
            UserProgress.mastery_level >= 3,
        )
    )
    words_mastered = mastered_result.scalar()

    # Count practice sessions
    sessions_result = await db.execute(
        select(func.count(UserProgress.id)).where(
            UserProgress.user_id == user.id,
        )
    )
    total_sessions = sessions_result.scalar()

    # Get rank
    rank_result = await db.execute(
        select(func.count(User.id)).where(User.xp > user.xp)
    )
    rank = rank_result.scalar() + 1

    return UserStats(
        xp=user.xp,
        level=user.level,
        streak=user.streak,
        words_learned=words_learned,
        words_mastered=words_mastered,
        total_practice_sessions=total_sessions,
        current_rank=rank,
    )


@router.get("/leaderboard/weekly", response_model=List[LeaderboardEntry])
async def get_leaderboard(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(User).order_by(User.xp.desc()).limit(20)
    )
    users = result.scalars().all()

    entries = []
    for i, user in enumerate(users):
        entries.append(LeaderboardEntry(
            rank=i + 1,
            username=user.username,
            display_name=user.display_name,
            avatar_emoji=user.avatar_emoji,
            xp=user.xp,
            level=user.level,
            streak=user.streak,
        ))
    return entries


@router.get("/achievements/{user_id}", response_model=List[AchievementResponse])
async def get_achievements(
    user_id: int,
    token: str = Depends(lambda: ...),
    db: AsyncSession = Depends(get_db),
):
    user = await get_current_user(token, db)

    # Get all achievements
    all_result = await db.execute(select(Achievement))
    all_achievements = all_result.scalars().all()

    # Get user's earned achievements
    earned_result = await db.execute(
        select(UserAchievement).where(UserAchievement.user_id == user.id)
    )
    earned = {ua.achievement_id: ua for ua in earned_result.scalars().all()}

    responses = []
    for ach in all_achievements:
        e = earned.get(ach.id)
        responses.append(AchievementResponse(
            code=ach.code,
            name=ach.name,
            description=ach.description,
            icon_emoji=ach.icon_emoji,
            earned_at=e.earned_at if e else None,
            earned=e is not None,
        ))
    return responses
