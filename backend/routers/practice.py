# Practice router - Game sessions and word practice

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import datetime, timedelta

from database import get_db
from models import User, UserProgress, Vocabulary, GameSession
from schemas import (
    PracticeSubmission, GameSessionCreate, GameSessionComplete,
    GameSessionResponse, WordPracticeResult,
)
from routers.auth import get_current_user
from services.spaced_repetition import update_sm2
from services.gamification import add_xp, check_achievements

router = APIRouter()


@router.post("/session")
async def start_session(
    data: GameSessionCreate,
    token: str = Depends(lambda: ...),
    db: AsyncSession = Depends(get_db),
):
    user = await get_current_user(token, db)
    session = GameSession(user_id=user.id, game_type=data.game_type)
    db.add(session)
    await db.flush()
    await db.refresh(session)
    return {"session_id": session.id, "started_at": session.started_at}


@router.put("/session/{session_id}")
async def complete_session(
    session_id: int,
    data: GameSessionComplete,
    token: str = Depends(lambda: ...),
    db: AsyncSession = Depends(get_db),
):
    user = await get_current_user(token, db)
    result = await db.execute(
        select(GameSession).where(
            GameSession.id == session_id,
            GameSession.user_id == user.id,
        )
    )
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    session.score = data.score
    session.xp_earned = data.xp_earned
    session.words_practiced = data.words_practiced
    session.completed_at = datetime.utcnow()

    # Add XP to user
    await add_xp(db, user, data.xp_earned)

    # Check for new achievements
    new_achievements = await check_achievements(db, user)

    return {
        "xp_earned": data.xp_earned,
        "total_xp": user.xp,
        "level": user.level,
        "new_achievements": new_achievements,
    }


@router.post("/word")
async def practice_word(
    data: PracticeSubmission,
    token: str = Depends(lambda: ...),
    db: AsyncSession = Depends(get_db),
):
    user = await get_current_user(token, db)
    total_xp = 0
    results = []

    for result in data.results:
        # Get or create progress
        progress_result = await db.execute(
            select(UserProgress).where(
                UserProgress.user_id == user.id,
                UserProgress.word_id == result.word_id,
            )
        )
        progress = progress_result.scalar_one_or_none()

        if not progress:
            progress = UserProgress(user_id=user.id, word_id=result.word_id)
            db.add(progress)

        # Update progress
        progress.times_practiced += 1
        if result.correct:
            progress.times_correct += 1
            total_xp += 10
        else:
            total_xp += 1  # Participation XP

        # Update spaced repetition
        quality = 5 if result.correct else 2  # SM-2 quality scale
        update_sm2(progress, quality)
        progress.last_practiced = datetime.utcnow()

        results.append({
            "word_id": result.word_id,
            "correct": result.correct,
            "mastery_level": progress.mastery_level,
        })

    # Add XP
    if total_xp > 0:
        await add_xp(db, user, total_xp)

    return {"xp_earned": total_xp, "results": results}


@router.get("/review")
async def get_review_words(
    limit: int = 20,
    token: str = Depends(lambda: ...),
    db: AsyncSession = Depends(get_db),
):
    user = await get_current_user(token, db)
    now = datetime.utcnow()

    result = await db.execute(
        select(Vocabulary, UserProgress)
        .join(UserProgress, UserProgress.word_id == Vocabulary.id)
        .where(
            UserProgress.user_id == user.id,
            UserProgress.next_review <= now,
        )
        .order_by(UserProgress.next_review)
        .limit(limit)
    )
    rows = result.all()

    words = []
    for vocab, progress in rows:
        words.append({
            "id": vocab.id,
            "telugu": vocab.telugu,
            "english": vocab.english,
            "transliteration": vocab.transliteration,
            "audio_url": vocab.audio_url,
            "mastery_level": progress.mastery_level,
        })

    return {"words": words, "count": len(words)}
