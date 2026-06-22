# Lessons router

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List

from database import get_db
from models import Lesson, Vocabulary, UserProgress
from schemas import LessonResponse, LessonSummary, VocabResponse
from routers.auth import get_current_user

router = APIRouter()


@router.get("/", response_model=List[LessonSummary])
async def list_lessons(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Lesson).order_by(Lesson.order_index)
    )
    lessons = result.scalars().all()

    summaries = []
    for lesson in lessons:
        count_result = await db.execute(
            select(func.count(Vocabulary.id)).where(Vocabulary.lesson_id == lesson.id)
        )
        word_count = count_result.scalar()
        summaries.append(LessonSummary(
            id=lesson.id,
            day_number=lesson.day_number,
            title=lesson.title,
            description=lesson.description,
            category=lesson.category,
            word_count=word_count,
        ))
    return summaries


@router.get("/{lesson_id}", response_model=LessonResponse)
async def get_lesson(
    lesson_id: int,
    token: str = Query(...),
    db: AsyncSession = Depends(get_db),
):
    user = await get_current_user(token, db)

    # Get lesson
    result = await db.execute(select(Lesson).where(Lesson.id == lesson_id))
    lesson = result.scalar_one_or_none()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    # Get vocabulary with user progress
    vocab_result = await db.execute(
        select(Vocabulary).where(Vocabulary.lesson_id == lesson_id)
    )
    words = vocab_result.scalars().all()

    vocab_responses = []
    for word in words:
        progress_result = await db.execute(
            select(UserProgress).where(
                UserProgress.user_id == user.id,
                UserProgress.word_id == word.id,
            )
        )
        progress = progress_result.scalar_one_or_none()
        vocab_responses.append(VocabResponse(
            id=word.id,
            telugu=word.telugu,
            english=word.english,
            transliteration=word.transliteration,
            audio_url=word.audio_url,
            category=word.category,
            difficulty=word.difficulty,
            mastery_level=progress.mastery_level if progress else 0,
        ))

    return LessonResponse(
        id=lesson.id,
        day_number=lesson.day_number,
        title=lesson.title,
        description=lesson.description,
        category=lesson.category,
        vocabulary=vocab_responses,
    )


@router.get("/today/{user_id}", response_model=LessonResponse)
async def get_today_lesson(
    user_id: int,
    token: str = Query(...),
    db: AsyncSession = Depends(get_db),
):
    user = await get_current_user(token, db)
    # Determine which day the user is on based on progress
    result = await db.execute(
        select(func.min(Lesson.day_number)).where(
            Lesson.id.notin_(
                select(UserProgress.word_id).where(
                    UserProgress.user_id == user.id,
                    UserProgress.mastery_level >= 3,
                )
            )
        )
    )
    # Simplified: just return the first lesson for now
    result = await db.execute(
        select(Lesson).order_by(Lesson.order_index).limit(1)
    )
    lesson = result.scalar_one_or_none()
    if not lesson:
        raise HTTPException(status_code=404, detail="No lessons available")

    return await get_lesson(lesson.id, token, db)
