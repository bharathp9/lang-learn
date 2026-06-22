# Spaced Repetition Service - SM-2 Algorithm
# Based on SuperMemo SM-2 algorithm for optimal review timing

from datetime import datetime, timedelta


def update_sm2(progress, quality: int):
    """
    Update SM-2 spaced repetition parameters.
    Quality: 0-5 scale (0=complete blackout, 5=perfect response)
    """
    # Clamp quality
    quality = max(0, min(5, quality))

    # Update ease factor
    old_ef = progress.ease_factor / 100.0
    new_ef = old_ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    progress.ease_factor = max(130, int(new_ef * 100))  # Min EF = 1.3

    if quality < 3:
        # Incorrect response - reset repetitions
        progress.repetitions = 0
        progress.interval = 0
        if progress.mastery_level > 0:
            progress.mastery_level = 1  # Back to learning
    else:
        # Correct response
        progress.repetitions += 1

        if progress.repetitions == 1:
            progress.interval = 1
        elif progress.repetitions == 2:
            progress.interval = 6
        else:
            progress.interval = int(progress.interval * (progress.ease_factor / 100.0))

        # Update mastery level
        if progress.repetitions >= 1 and progress.repetitions < 3:
            progress.mastery_level = 1  # Learning
        elif progress.repetitions >= 3 and progress.repetitions < 5:
            progress.mastery_level = 2  # Review
        elif progress.repetitions >= 5:
            progress.mastery_level = 3  # Mastered

    # Set next review date
    if progress.interval > 0:
        progress.next_review = datetime.utcnow() + timedelta(days=progress.interval)
    else:
        progress.next_review = datetime.utcnow() + timedelta(hours=1)  # Retry in 1 hour
