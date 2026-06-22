# Audio router - TTS generation and audio file serving

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from pathlib import Path

from services.tts import generate_tts

router = APIRouter()

AUDIO_DIR = Path(__file__).parent.parent / "data" / "audio"
AUDIO_DIR.mkdir(parents=True, exist_ok=True)


@router.get("/{word_id}")
async def get_audio(word_id: int):
    """Get pre-generated audio file for a word."""
    audio_file = AUDIO_DIR / f"word_{word_id}.mp3"
    if audio_file.exists():
        return FileResponse(str(audio_file), media_type="audio/mpeg")
    raise HTTPException(status_code=404, detail="Audio not found")


@router.post("/tts")
async def generate_audio(text: str, lang: str = "te"):
    """Generate TTS audio for given text (admin use)."""
    try:
        audio_path = await generate_tts(text, lang)
        return {"audio_url": str(audio_path)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS generation failed: {str(e)}")
