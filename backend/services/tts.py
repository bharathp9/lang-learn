# TTS Service - Text to Speech generation for Telugu

import asyncio
from pathlib import Path
from gtts import gTTS

AUDIO_DIR = Path(__file__).parent.parent / "data" / "audio"
AUDIO_DIR.mkdir(parents=True, exist_ok=True)


async def generate_tts(text: str, lang: str = "te") -> Path:
    """Generate TTS audio file. Returns path to audio file."""
    # Create a safe filename from text
    safe_name = "".join(c if c.isalnum() else "_" for c in text[:50])
    filename = f"tts_{safe_name}.mp3"
    filepath = AUDIO_DIR / filename

    if not filepath.exists():
        # gTTS is synchronous, run in thread
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, _sync_tts, text, lang, str(filepath))

    return filepath


def _sync_tts(text: str, lang: str, filepath: str):
    """Synchronous TTS generation."""
    tts = gTTS(text=text, lang=lang, slow=True)
    tts.save(filepath)


async def generate_all_vocabulary_audio(vocabulary_list: list):
    """Generate audio for a list of vocabulary items.
    Each item should have 'id', 'telugu' keys."""
    for item in vocabulary_list:
        filepath = AUDIO_DIR / f"word_{item['id']}.mp3"
        if not filepath.exists():
            try:
                await generate_tts(item['telugu'], 'te')
            except Exception as e:
                print(f"Failed to generate audio for {item['telugu']}: {e}")
