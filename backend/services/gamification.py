# Gamification service - XP, levels, achievements

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import datetime, date, timedelta

from models import User, Achievement, UserAchievement, UserProgress

# Level thresholds (XP required for each level)
LEVEL_XP = {
    1: 0,
    2: 100,
    3: 250,
    4: 500,
    5: 1000,
    6: 2000,
    7: 3500,
    8: 5500,
    9: 8000,
    10: 12000,
}

# Achievement definitions
DEFAULT_ACHIEVEMENTS = [
    {"code": "first_word", "name": "First Word!", "description": "Learned your first Telugu word", "icon_emoji": "🌟"},
    {"code": "ten_words", "name": "Word Collector", "description": "Learned 10 Telugu words", "icon_emoji": "📚"},
    {"code": "fifty_words", "name": "Vocabulary Builder", "description": "Learned 50 Telugu words", "icon_emoji": "🏗️"},
    {"code": "hundred_words", "name": "Century!", "description": "Learned 100 Telugu words", "icon_emoji": "💯"},
    {"code": "streak_3", "name": "On Fire!", "description": "3-day practice streak", "icon_emoji": "🔥"},
    {"code": "streak_7", "name": "Week Warrior", "description": "7-day practice streak", "icon_emoji": "⚡"},
    {"code": "streak_14", "name": "Unstoppable", "description": "14-day practice streak", "icon_emoji": "🚀"},
    {"code": "streak_30", "name": "Monthly Master", "description": "30-day practice streak", "icon_emoji": "👑"},
    {"code": "perfect_round", "name": "Perfect!", "description": "Got 100% in a speed round", "icon_emoji": "🎯"},
    {"code": "night_owl", "name": "Night Owl", "description": "Practiced after 9 PM", "icon_emoji": "🦉"},
    {"code": "early_bird", "name": "Early Bird", "description": "Practiced before 8 AM", "icon_emoji": "🐦"},
    {"code": "level_5", "name": "Rising Star", "description": "Reached level 5", "icon_emoji": "⭐"},
    {"code": "level_10", "name": "Telugu Master", "description": "Reached level 10", "icon_emoji": "🏆"},
    {"code": "review_50", "name": "Review Champion", "description": "Reviewed 50 words", "icon_emoji": "🔄"},
    {"code": "mastered_25", "name": "Quarter Master", "description": "Mastered 25 words", "icon_emoji": "🎓"},
]


def get_level_from_xp(xp: int) -> int:
    """Calculate level from XP."""
    level = 1
    for lvl, threshold in LEVEL_XP.items():
        if xp >= threshold:
            level = lvl
    return level


async def add_xp(db: AsyncSession, user: User, xp: int):
    """Add XP to user and update level and streak."""
    user.xp += xp
    user.level = get_level_from_xp(user.xp)

    # Update streak
    today = date.today()
    if user.last_practice_date:
        delta = (today - user.last_practice_date).days
        if delta == 1:
            user.streak += 1
        elif delta > 1:
            user.streak = 1  # Reset streak
    else:
        user.streak = 1

    user.last_practice_date = today
    await db.flush()


async def init_achievements(db: AsyncSession):
    """Initialize default achievements if they don't exist."""
    for ach_data in DEFAULT_ACHIEVEMENTS:
        result = await db.execute(
            select(Achievement).where(Achievement.code == ach_data["code"])
        )
        if not result.scalar_one_or_none():
            db.add(Achievement(**ach_data))
    await db.flush()


async def check_achievements(db: AsyncSession, user: User) -> list:
    """Check and award new achievements. Returns list of newly earned."""
    new_achievements = []

    # Map achievement codes to conditions
    stat_result = await db.execute(
        select(func.count(UserProgress.id)).where(
            UserProgress.user_id == user.id,
            UserProgress.times_practiced > 0,
        )
    )
    words_learned = stat_result.scalar()

    mastered_result = await db.execute(
        select(func.count(UserProgress.id)).where(
            UserProgress.user_id == user.id,
            UserProgress.mastery_level >= 3,
        )
    )
    words_mastered = mastered_result.scalar()

    review_result = await db.execute(
        select(func.count(UserProgress.id)).where(
            UserProgress.user_id == user.id,
            UserProgress.times_practiced >= 3,
        )
    )
    words_reviewed = review_result.scalar()

    conditions = {
        "first_word": words_learned >= 1,
        "ten_words": words_learned >= 10,
        "fifty_words": words_learned >= 50,
        "hundred_words": words_learned >= 100,
        "streak_3": user.streak >= 3,
        "streak_7": user.streak >= 7,
        "streak_14": user.streak >= 14,
        "streak_30": user.streak >= 30,
        "level_5": user.level >= 5,
        "level_10": user.level >= 10,
        "review_50": words_reviewed >= 50,
        "mastered_25": words_mastered >= 25,
    }

    # Check which achievements the user already has
    earned_result = await db.execute(
        select(UserAchievement.achievement_id).where(
            UserAchievement.user_id == user.id
        )
    )
    earned_ids = {row[0] for row in earned_result.all()}

    # Check all achievements
    all_result = await db.execute(select(Achievement))
    for ach in all_result.scalars().all():
        if ach.id not in earned_ids and conditions.get(ach.code, False):
            ua = UserAchievement(user_id=user.id, achievement_id=ach.id)
            db.add(ua)
            new_achievements.append({
                "code": ach.code,
                "name": ach.name,
                "icon_emoji": ach.icon_emoji,
            })

    await db.flush()
    return new_achievements
