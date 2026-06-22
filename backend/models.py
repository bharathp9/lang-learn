# Database models

from sqlalchemy import Column, Integer, String, DateTime, Date, ForeignKey, Text, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    display_name = Column(String(100), nullable=False)
    avatar_emoji = Column(String(10), default="🦁")
    xp = Column(Integer, default=0)
    level = Column(Integer, default=1)
    streak = Column(Integer, default=0)
    last_practice_date = Column(Date, nullable=True)
    auth_token = Column(String(64), unique=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    progress = relationship("UserProgress", back_populates="user", cascade="all, delete-orphan")
    game_sessions = relationship("GameSession", back_populates="user", cascade="all, delete-orphan")
    achievements = relationship("UserAchievement", back_populates="user", cascade="all, delete-orphan")


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    day_number = Column(Integer, nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(50), nullable=False)
    order_index = Column(Integer, nullable=False)

    vocabulary = relationship("Vocabulary", back_populates="lesson", cascade="all, delete-orphan")


class Vocabulary(Base):
    __tablename__ = "vocabulary"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    telugu = Column(String(200), nullable=False)
    english = Column(String(200), nullable=False)
    transliteration = Column(String(200), nullable=False)
    audio_url = Column(String(500), nullable=True)
    category = Column(String(50), nullable=False)
    difficulty = Column(Integer, default=1)

    lesson = relationship("Lesson", back_populates="vocabulary")
    progress = relationship("UserProgress", back_populates="word", cascade="all, delete-orphan")


class UserProgress(Base):
    __tablename__ = "user_progress"
    __table_args__ = (UniqueConstraint("user_id", "word_id"),)

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    word_id = Column(Integer, ForeignKey("vocabulary.id"), nullable=False)
    times_practiced = Column(Integer, default=0)
    times_correct = Column(Integer, default=0)
    last_practiced = Column(DateTime, nullable=True)
    next_review = Column(DateTime, nullable=True)
    mastery_level = Column(Integer, default=0)  # 0=new, 1=learning, 2=review, 3=mastered
    ease_factor = Column(Integer, default=250)  # SM-2 ease factor (x100)
    interval = Column(Integer, default=0)  # days until next review
    repetitions = Column(Integer, default=0)

    user = relationship("User", back_populates="progress")
    word = relationship("Vocabulary", back_populates="progress")


class GameSession(Base):
    __tablename__ = "game_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    game_type = Column(String(50), nullable=False)
    score = Column(Integer, default=0)
    xp_earned = Column(Integer, default=0)
    words_practiced = Column(Integer, default=0)
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="game_sessions")


class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, nullable=False)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    icon_emoji = Column(String(10), default="🏆")

    users = relationship("UserAchievement", back_populates="achievement", cascade="all, delete-orphan")


class UserAchievement(Base):
    __tablename__ = "user_achievements"
    __table_args__ = (UniqueConstraint("user_id", "achievement_id"),)

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    achievement_id = Column(Integer, ForeignKey("achievements.id"), primary_key=True)
    earned_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="achievements")
    achievement = relationship("Achievement", back_populates="users")
