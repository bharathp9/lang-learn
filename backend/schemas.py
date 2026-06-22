# Pydantic schemas for request/response validation

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, date


# --- User schemas ---

class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    display_name: str = Field(..., min_length=1, max_length=100)
    avatar_emoji: str = "🦁"


class UserResponse(BaseModel):
    id: int
    username: str
    display_name: str
    avatar_emoji: str
    xp: int
    level: int
    streak: int
    last_practice_date: Optional[date]
    created_at: datetime

    class Config:
        from_attributes = True


class UserStats(BaseModel):
    xp: int
    level: int
    streak: int
    words_learned: int
    words_mastered: int
    total_practice_sessions: int
    current_rank: int


class TokenResponse(BaseModel):
    token: str
    user: UserResponse


# --- Lesson schemas ---

class VocabResponse(BaseModel):
    id: int
    telugu: str
    english: str
    transliteration: str
    audio_url: Optional[str]
    category: str
    difficulty: int
    mastery_level: Optional[int] = None

    class Config:
        from_attributes = True


class LessonResponse(BaseModel):
    id: int
    day_number: int
    title: str
    description: Optional[str]
    category: str
    vocabulary: List[VocabResponse]

    class Config:
        from_attributes = True


class LessonSummary(BaseModel):
    id: int
    day_number: int
    title: str
    description: Optional[str]
    category: str
    word_count: int

    class Config:
        from_attributes = True


# --- Practice schemas ---

class WordPracticeResult(BaseModel):
    word_id: int
    correct: bool
    game_type: str


class PracticeSubmission(BaseModel):
    results: List[WordPracticeResult]


class GameSessionCreate(BaseModel):
    game_type: str


class GameSessionComplete(BaseModel):
    score: int
    xp_earned: int
    words_practiced: int


class GameSessionResponse(BaseModel):
    id: int
    game_type: str
    score: int
    xp_earned: int
    words_practiced: int
    started_at: datetime
    completed_at: Optional[datetime]

    class Config:
        from_attributes = True


# --- Progress schemas ---

class LeaderboardEntry(BaseModel):
    rank: int
    username: str
    display_name: str
    avatar_emoji: str
    xp: int
    level: int
    streak: int


class AchievementResponse(BaseModel):
    code: str
    name: str
    description: Optional[str]
    icon_emoji: str
    earned_at: Optional[datetime] = None
    earned: bool = False

    class Config:
        from_attributes = True


# --- Audio schemas ---

class TTSRequest(BaseModel):
    text: str
    lang: str = "te"
