#!/bin/bash
set -e

echo "=== Telugu Learning App - Startup ==="

# Create data directories if they don't exist
mkdir -p /app/data/audio

# Check if database exists, seed if not
DB_PATH="/app/data/telugu_learning.db"

if [ ! -f "$DB_PATH" ]; then
    echo "Database not found. Seeding database..."
    cd /app
    python -c "
import asyncio
from database import engine, Base, async_session
from data.seed import seed_database

async def main():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    async with async_session() as session:
        await seed_database(session)
    print('Database seeding complete.')

asyncio.run(main())
"
    echo "Seed complete."
else
    echo "Database already exists at $DB_PATH, skipping seed."
fi

# Generate audio files for all vocabulary words
echo "Generating TTS audio for vocabulary words..."
cd /app
python -c "
import asyncio
from database import engine, Base, async_session
from models import Vocabulary
from sqlalchemy import select
from gtts import gTTS
from pathlib import Path

AUDIO_DIR = Path('/app/data/audio')
AUDIO_DIR.mkdir(parents=True, exist_ok=True)

async def main():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    async with async_session() as session:
        result = await session.execute(select(Vocabulary))
        words = result.scalars().all()
        count = 0
        for word in words:
            audio_file = AUDIO_DIR / f'word_{word.id}.mp3'
            if not audio_file.exists():
                try:
                    tts = gTTS(text=word.telugu, lang='te', slow=False)
                    tts.save(str(audio_file))
                    count += 1
                except Exception as e:
                    print(f'Failed: word_{word.id}: {e}')
        print(f'Generated {count} audio files (total {len(words)} words)')

asyncio.run(main())
" || echo "Audio generation had errors, continuing..."

echo "Starting uvicorn..."
exec uvicorn main:app --host 0.0.0.0 --port 8000 --workers 1 --log-level info
