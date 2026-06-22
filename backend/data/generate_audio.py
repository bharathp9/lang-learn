# Generate TTS audio for all vocabulary words in the seed data
# Run from backend/ directory: python data/generate_audio.py

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from gtts import gTTS
from pathlib import Path

AUDIO_DIR = Path(__file__).parent / "audio"
AUDIO_DIR.mkdir(parents=True, exist_ok=True)

# All vocabulary words extracted from seed.py
vocabulary = [
    # Lesson 1 - Vowels (Day 1)
    (1, "అ"), (2, "ఆ"), (3, "ఇ"), (4, "ఈ"), (5, "ఉ"), (6, "ఊ"),
    (7, "ఋ"), (8, "ఎ"), (9, "ఏ"), (10, "ఐ"), (11, "ఒ"), (12, "ఓ"),
    (13, "ఔ"), (14, "అం"), (15, "అః"),
    # Lesson 2 - Consonants Part 1 (Day 2)
    (16, "క"), (17, "ఖ"), (18, "గ"), (19, "ఘ"), (20, "ఙ"),
    (21, "చ"), (22, "ఛ"), (23, "జ"), (24, "ఝ"), (25, "ఞ"),
    # Lesson 3 - Greetings (Day 3)
    (26, "నమస్కారం"), (27, "శుభోదయం"), (28, "శుభ మధ్యాహ్నం"),
    (29, "శుభ సాయంత్రం"), (30, "శుభ రాత్రి"), (31, "వీడ్కోలు"),
    (32, "తిరిగి కలుద్దాం"), (33, "ఎలా ఉన్నారు?"), (34, "బాగున్నాను"),
    (35, "మీరు ఎలా ఉన్నారు?"),
    # Lesson 4 - Introductions (Day 4)
    (36, "నా పేరు"), (37, "నేను"), (38, "మీరు"), (39, "నువ్వు"),
    (40, "ఆయన"), (41, "ఆమె"), (42, "ఇది"), (43, "అది"),
    (44, "ఎక్కడ?"), (45, "ఎవరు?"),
    # Lesson 5 - Numbers 1-10 (Day 5)
    (46, "ఒకటి"), (47, "రెండు"), (48, "మూడు"), (49, "నాలుగు"),
    (50, "ఐదు"), (51, "ఆరు"), (52, "ఏడు"), (53, "ఎనిమిది"),
    (54, "తొమ్మిది"), (55, "పది"),
    # Lesson 6 - Courtesy Words (Day 6)
    (56, "ధన్యవాదాలు"), (57, "దయచేసి"), (58, "క్షమించండి"),
    (59, "అవును"), (60, "కాదు"), (61, "సరే"),
    (62, "ఇవ్వండి"), (63, "తీసుకోండి"), (64, "రండి"), (65, "వెళ్ళండి"),
    # Lesson 8 - Family Members (Day 8)
    (66, "తండ్రి"), (67, "తల్లి"), (68, "అన్నది"), (69, "అక్క"),
    (70, "తమ్ముడు"), (71, "చెల్లెలు"), (72, "నాన్న"), (73, "అమ్మ"),
    (74, "తాత"), (75, "నాన్నమ్మ"),
    # Lesson 9 - Food Items (Day 9)
    (76, "అన్నం"), (77, "నీరు"), (78, "పాలు"), (79, "టీ"),
    (80, "కాఫీ"), (81, "రొట్టె"), (82, "పప్పు"), (83, "కూర"),
    (84, "పండ్లు"), (85, "బాణలు"),
    # Lesson 10 - Colors (Day 10)
    (86, "ఎరుపు"), (87, "నీలం"), (88, "పచ్చ"), (89, "తెలుపు"),
    (90, "నలుపు"), (91, "పసుపు"), (92, "నారింజ"),
    (93, "గులాబి"), (94, "బూడిద"), (95, "గోధుమ"),
    # Lesson 11 - Body Parts (Day 11)
    (96, "తల"), (97, "జుట్టు"), (98, "ముఖం"), (99, "కళ్ళు"),
    (100, "చెవులు"), (101, "ముక్కు"), (102, "నోరు"),
    (103, "చేతులు"), (104, "కాళ్ళు"), (105, "వేలు"),
    # Lesson 12 - Common Verbs (Day 12)
    (106, "తిను"), (107, "తాగు"), (108, "వెళ్ళు"), (109, "రా"),
    (110, "చూడు"), (111, "విను"), (112, "చెప్పు"), (113, "చేయి"),
    (114, "రాయి"), (115, "చదువు"),
    # Lesson 13 - Simple Sentences (Day 13)
    (116, "నేను తింటాను"), (117, "నేను తాగుతాను"),
    (118, "నేను వెళ్తాను"), (119, "నేను వస్తాను"),
    (120, "నేను చదువుతాను"), (121, "నీరు తాగాలి"),
    (122, "అన్నం తినాలి"), (123, "ఎలా ఉన్నావు?"),
    (124, "బాగున్నావా?"), (125, "ఇక్కడ రా"),
]


def generate_audio(word_id: int, telugu_text: str) -> bool:
    """Generate TTS audio file for a single word. Returns True on success."""
    output_file = AUDIO_DIR / f"word_{word_id}.mp3"

    if output_file.exists():
        return True  # Already exists

    try:
        tts = gTTS(text=telugu_text, lang="te", slow=False)
        tts.save(str(output_file))
        return True
    except Exception as e:
        print(f"  ERROR word_{word_id} ({telugu_text}): {e}")
        return False


def main():
    print(f"Generating TTS audio for {len(vocabulary)} vocabulary words...")
    print(f"Output directory: {AUDIO_DIR}")
    print()

    success = 0
    failed = 0
    skipped = 0

    for word_id, telugu_text in vocabulary:
        output_file = AUDIO_DIR / f"word_{word_id}.mp3"

        if output_file.exists():
            skipped += 1
            continue

        if generate_audio(word_id, telugu_text):
            success += 1
            print(f"  OK word_{word_id}: {telugu_text}")
        else:
            failed += 1

        # Progress indicator
        total_done = success + failed + skipped
        if total_done % 25 == 0:
            print(f"  --- Progress: {total_done}/{len(vocabulary)} ---")

    print()
    print(f"=== Results ===")
    print(f"  Generated: {success}")
    print(f"  Skipped (already exist): {skipped}")
    print(f"  Failed: {failed}")
    print(f"  Total: {len(vocabulary)}")

    # Verify files
    audio_files = list(AUDIO_DIR.glob("word_*.mp3"))
    print(f"  Audio files on disk: {len(audio_files)}")
    total_size_mb = sum(f.stat().st_size for f in audio_files) / (1024 * 1024)
    print(f"  Total size: {total_size_mb:.1f} MB")


if __name__ == "__main__":
    main()
