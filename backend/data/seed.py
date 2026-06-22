# Seed data - Initial database content for Telugu learning

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from models import Lesson, Vocabulary, Achievement
from services.gamification import DEFAULT_ACHIEVEMENTS, init_achievements


async def seed_database(db: AsyncSession):
    """Seed database with initial lessons, vocabulary, and achievements."""
    # Check if already seeded
    result = await db.execute(select(Lesson).limit(1))
    if result.scalar_one_or_none():
        print("Database already seeded.")
        return

    # Seed achievements
    await init_achievements(db)

    # Seed lessons and vocabulary
    lessons_data = [
        # Week 1: Foundations
        {
            "day_number": 1,
            "title": "Telugu Vowels (అచ్చులు)",
            "description": "Learn the 16 Telugu vowels - the foundation of the language",
            "category": "alphabet",
            "order_index": 1,
            "words": [
                {"telugu": "అ", "english": "a", "transliteration": "a", "category": "vowel", "difficulty": 1},
                {"telugu": "ఆ", "english": "aa", "transliteration": "ā", "category": "vowel", "difficulty": 1},
                {"telugu": "ఇ", "english": "i", "transliteration": "i", "category": "vowel", "difficulty": 1},
                {"telugu": "ఈ", "english": "ee", "transliteration": "ī", "category": "vowel", "difficulty": 1},
                {"telugu": "ఉ", "english": "u", "transliteration": "u", "category": "vowel", "difficulty": 1},
                {"telugu": "ఊ", "english": "oo", "transliteration": "ū", "category": "vowel", "difficulty": 1},
                {"telugu": "ఋ", "english": "ru", "transliteration": "ṛ", "category": "vowel", "difficulty": 2},
                {"telugu": "ఎ", "english": "e", "transliteration": "e", "category": "vowel", "difficulty": 1},
                {"telugu": "ఏ", "english": "ae", "transliteration": "ē", "category": "vowel", "difficulty": 1},
                {"telugu": "ఐ", "english": "ai", "transliteration": "ai", "category": "vowel", "difficulty": 1},
                {"telugu": "ఒ", "english": "o", "transliteration": "o", "category": "vowel", "difficulty": 1},
                {"telugu": "ఓ", "english": "oa", "transliteration": "ō", "category": "vowel", "difficulty": 1},
                {"telugu": "ఔ", "english": "au", "transliteration": "au", "category": "vowel", "difficulty": 1},
                {"telugu": "అం", "english": "am", "transliteration": "aṁ", "category": "vowel", "difficulty": 2},
                {"telugu": "అః", "english": "ah", "transliteration": "aḥ", "category": "vowel", "difficulty": 2},
            ],
        },
        {
            "day_number": 2,
            "title": "Telugu Consonants - Part 1 (హల్లులు)",
            "description": "First group of Telugu consonants",
            "category": "alphabet",
            "order_index": 2,
            "words": [
                {"telugu": "క", "english": "ka", "transliteration": "ka", "category": "consonant", "difficulty": 1},
                {"telugu": "ఖ", "english": "kha", "transliteration": "kha", "category": "consonant", "difficulty": 1},
                {"telugu": "గ", "english": "ga", "transliteration": "ga", "category": "consonant", "difficulty": 1},
                {"telugu": "ఘ", "english": "gha", "transliteration": "gha", "category": "consonant", "difficulty": 1},
                {"telugu": "ఙ", "english": "nga", "transliteration": "ṅa", "category": "consonant", "difficulty": 2},
                {"telugu": "చ", "english": "cha", "transliteration": "ca", "category": "consonant", "difficulty": 1},
                {"telugu": "ఛ", "english": "chha", "transliteration": "cha", "category": "consonant", "difficulty": 1},
                {"telugu": "జ", "english": "ja", "transliteration": "ja", "category": "consonant", "difficulty": 1},
                {"telugu": "ఝ", "english": "jha", "transliteration": "jha", "category": "consonant", "difficulty": 1},
                {"telugu": "ఞ", "english": "nya", "transliteration": "ña", "category": "consonant", "difficulty": 2},
            ],
        },
        {
            "day_number": 3,
            "title": "Greetings (శుభాకాంక్షలు)",
            "description": "Learn to greet people in Telugu",
            "category": "greetings",
            "order_index": 3,
            "words": [
                {"telugu": "నమస్కారం", "english": "Hello / Greetings", "transliteration": "namaskāram", "category": "greeting", "difficulty": 1},
                {"telugu": "శుభోదయం", "english": "Good morning", "transliteration": "śubhōdayaṁ", "category": "greeting", "difficulty": 1},
                {"telugu": "శుభ మధ్యాహ్నం", "english": "Good afternoon", "transliteration": "śubha madhyāhnaṁ", "category": "greeting", "difficulty": 2},
                {"telugu": "శుభ సాయంత్రం", "english": "Good evening", "transliteration": "śubha sāyantraṁ", "category": "greeting", "difficulty": 2},
                {"telugu": "శుభ రాత్రి", "english": "Good night", "transliteration": "śubha rātri", "category": "greeting", "difficulty": 1},
                {"telugu": "వీడ్కోలు", "english": "Goodbye", "transliteration": "vīḍkōlu", "category": "greeting", "difficulty": 1},
                {"telugu": "తిరిగి కలుద్దాం", "english": "See you again", "transliteration": "tirigi kaluddāṁ", "category": "greeting", "difficulty": 2},
                {"telugu": "ఎలా ఉన్నారు?", "english": "How are you? (formal)", "transliteration": "elā unnāru?", "category": "greeting", "difficulty": 1},
                {"telugu": "బాగున్నాను", "english": "I am fine", "transliteration": "bāgunnānu", "category": "greeting", "difficulty": 1},
                {"telugu": "మీరు ఎలా ఉన్నారు?", "english": "How are you? (respectful)", "transliteration": "mīru elā unnāru?", "category": "greeting", "difficulty": 2},
            ],
        },
        {
            "day_number": 4,
            "title": "Introductions (పరిచయం)",
            "description": "Introduce yourself in Telugu",
            "category": "introductions",
            "order_index": 4,
            "words": [
                {"telugu": "నా పేరు", "english": "My name is", "transliteration": "nā pēru", "category": "introduction", "difficulty": 1},
                {"telugu": "నేను", "english": "I am", "transliteration": "nēnu", "category": "introduction", "difficulty": 1},
                {"telugu": "మీరు", "english": "You (respectful)", "transliteration": "mīru", "category": "introduction", "difficulty": 1},
                {"telugu": "నువ్వు", "english": "You (informal)", "transliteration": "nuvvu", "category": "introduction", "difficulty": 1},
                {"telugu": "ఆయన", "english": "He / Sir", "transliteration": "āyana", "category": "introduction", "difficulty": 1},
                {"telugu": "ఆమె", "english": "She / Madam", "transliteration": "āme", "category": "introduction", "difficulty": 1},
                {"telugu": "ఇది", "english": "This", "transliteration": "idi", "category": "introduction", "difficulty": 1},
                {"telugu": "అది", "english": "That", "transliteration": "adi", "category": "introduction", "difficulty": 1},
                {"telugu": "ఎక్కడ?", "english": "Where?", "transliteration": "ekkaḍa?", "category": "introduction", "difficulty": 1},
                {"telugu": "ఎవరు?", "english": "Who?", "transliteration": "evaru?", "category": "introduction", "difficulty": 1},
            ],
        },
        {
            "day_number": 5,
            "title": "Numbers 1-10 (సంఖ్యలు)",
            "description": "Count from 1 to 10 in Telugu",
            "category": "numbers",
            "order_index": 5,
            "words": [
                {"telugu": "ఒకటి", "english": "One (1)", "transliteration": "okaṭi", "category": "number", "difficulty": 1},
                {"telugu": "రెండు", "english": "Two (2)", "transliteration": "reṇḍu", "category": "number", "difficulty": 1},
                {"telugu": "మూడు", "english": "Three (3)", "transliteration": "mūḍu", "category": "number", "difficulty": 1},
                {"telugu": "నాలుగు", "english": "Four (4)", "transliteration": "nālugu", "category": "number", "difficulty": 1},
                {"telugu": "ఐదు", "english": "Five (5)", "transliteration": "aidu", "category": "number", "difficulty": 1},
                {"telugu": "ఆరు", "english": "Six (6)", "transliteration": "āru", "category": "number", "difficulty": 1},
                {"telugu": "ఏడు", "english": "Seven (7)", "transliteration": "ēḍu", "category": "number", "difficulty": 1},
                {"telugu": "ఎనిమిది", "english": "Eight (8)", "transliteration": "enimidi", "category": "number", "difficulty": 1},
                {"telugu": "తొమ్మిది", "english": "Nine (9)", "transliteration": "tommidi", "category": "number", "difficulty": 1},
                {"telugu": "పది", "english": "Ten (10)", "transliteration": "padi", "category": "number", "difficulty": 1},
            ],
        },
        {
            "day_number": 6,
            "title": "Courtesy Words (మర్యాద పదాలు)",
            "description": "Polite words for daily conversation",
            "category": "courtesy",
            "order_index": 6,
            "words": [
                {"telugu": "ధన్యవాదాలు", "english": "Thank you", "transliteration": "dhan'yavādālu", "category": "courtesy", "difficulty": 1},
                {"telugu": "దయచేసి", "english": "Please", "transliteration": "dayacēsi", "category": "courtesy", "difficulty": 1},
                {"telugu": "క్షమించండి", "english": "Sorry / Excuse me", "transliteration": "kṣamiñcaṇḍi", "category": "courtesy", "difficulty": 1},
                {"telugu": "అవును", "english": "Yes", "transliteration": "avunu", "category": "courtesy", "difficulty": 1},
                {"telugu": "కాదు", "english": "No", "transliteration": "kādu", "category": "courtesy", "difficulty": 1},
                {"telugu": "సరే", "english": "Okay / Alright", "transliteration": "sarē", "category": "courtesy", "difficulty": 1},
                {"telugu": "ఇవ్వండి", "english": "Give (please)", "transliteration": "ivvaṇḍi", "category": "courtesy", "difficulty": 1},
                {"telugu": "తీసుకోండి", "english": "Take (please)", "transliteration": "tīsukōṇḍi", "category": "courtesy", "difficulty": 1},
                {"telugu": "రండి", "english": "Come (please)", "transliteration": "raṇḍi", "category": "courtesy", "difficulty": 1},
                {"telugu": "వెళ్ళండి", "english": "Go (please)", "transliteration": "veḷḷaṇḍi", "category": "courtesy", "difficulty": 1},
            ],
        },
        {
            "day_number": 7,
            "title": "Week 1 Review",
            "description": "Review all words from Week 1",
            "category": "review",
            "order_index": 7,
            "words": [],  # Review pulls from previous lessons
        },
        # Week 2: Building Blocks
        {
            "day_number": 8,
            "title": "Family Members (కుటుంబ సభ్యులు)",
            "description": "Learn to talk about your family",
            "category": "family",
            "order_index": 8,
            "words": [
                {"telugu": "తండ్రి", "english": "Father", "transliteration": "taṇḍri", "category": "family", "difficulty": 1},
                {"telugu": "తల్లి", "english": "Mother", "transliteration": "talli", "category": "family", "difficulty": 1},
                {"telugu": "అన్నది", "english": "Elder brother", "transliteration": "annadi", "category": "family", "difficulty": 1},
                {"telugu": "అక్క", "english": "Elder sister", "transliteration": "akka", "category": "family", "difficulty": 1},
                {"telugu": "తమ్ముడు", "english": "Younger brother", "transliteration": "tammudu", "category": "family", "difficulty": 1},
                {"telugu": "చెల్లెలు", "english": "Younger sister", "transliteration": "chellelu", "category": "family", "difficulty": 1},
                {"telugu": "నాన్న", "english": "Dad (informal)", "transliteration": "nānna", "category": "family", "difficulty": 1},
                {"telugu": "అమ్మ", "english": "Mom (informal)", "transliteration": "amma", "category": "family", "difficulty": 1},
                {"telugu": "తాత", "english": "Grandfather", "transliteration": "tāta", "category": "family", "difficulty": 1},
                {"telugu": "నాన్నమ్మ", "english": "Grandmother", "transliteration": "nānnam'ma", "category": "family", "difficulty": 1},
            ],
        },
        {
            "day_number": 9,
            "title": "Food Items (ఆహారాలు)",
            "description": "Common food and drink words",
            "category": "food",
            "order_index": 9,
            "words": [
                {"telugu": "అన్నం", "english": "Rice / Food", "transliteration": "annaṁ", "category": "food", "difficulty": 1},
                {"telugu": "నీరు", "english": "Water", "transliteration": "nīru", "category": "food", "difficulty": 1},
                {"telugu": "పాలు", "english": "Milk", "transliteration": "pālu", "category": "food", "difficulty": 1},
                {"telugu": "టీ", "english": "Tea", "transliteration": "ṭī", "category": "food", "difficulty": 1},
                {"telugu": "కాఫీ", "english": "Coffee", "transliteration": "kāphī", "category": "food", "difficulty": 1},
                {"telugu": "రొట్టె", "english": "Bread / Roti", "transliteration": "roṭṭe", "category": "food", "difficulty": 1},
                {"telugu": "పప్పు", "english": "Dal / Lentils", "transliteration": "pappu", "category": "food", "difficulty": 1},
                {"telugu": "కూర", "english": "Vegetable curry", "transliteration": "kūra", "category": "food", "difficulty": 1},
                {"telugu": "పండ్లు", "english": "Fruits", "transliteration": "paṇḍlu", "category": "food", "difficulty": 1},
                {"telugu": "బాణలు", "english": "Banana", "transliteration": "bāṇalu", "category": "food", "difficulty": 1},
            ],
        },
        {
            "day_number": 10,
            "title": "Colors (రంగులు)",
            "description": "Learn colors in Telugu",
            "category": "colors",
            "order_index": 10,
            "words": [
                {"telugu": "ఎరుపు", "english": "Red", "transliteration": "erupu", "category": "color", "difficulty": 1},
                {"telugu": "నీలం", "english": "Blue", "transliteration": "nīlaṁ", "category": "color", "difficulty": 1},
                {"telugu": "పచ్చ", "english": "Green", "transliteration": "pacca", "category": "color", "difficulty": 1},
                {"telugu": "తెలుపు", "english": "White", "transliteration": "telupu", "category": "color", "difficulty": 1},
                {"telugu": "నలుపు", "english": "Black", "transliteration": "nalupu", "category": "color", "difficulty": 1},
                {"telugu": "పసుపు", "english": "Yellow", "transliteration": "pasupu", "category": "color", "difficulty": 1},
                {"telugu": "నారింజ", "english": "Orange", "transliteration": "nāriñja", "category": "color", "difficulty": 1},
                {"telugu": "గులాబి", "english": "Pink", "transliteration": "gulābi", "category": "color", "difficulty": 1},
                {"telugu": "బూడిద", "english": "Grey", "transliteration": "būdida", "category": "color", "difficulty": 1},
                {"telugu": "గోధుమ", "english": "Brown", "transliteration": "gōdhuma", "category": "color", "difficulty": 1},
            ],
        },
        {
            "day_number": 11,
            "title": "Body Parts (శరీర భాగాలు)",
            "description": "Name parts of the body in Telugu",
            "category": "body",
            "order_index": 11,
            "words": [
                {"telugu": "తల", "english": "Head", "transliteration": "tala", "category": "body", "difficulty": 1},
                {"telugu": "జుట్టు", "english": "Hair", "transliteration": "juṭṭu", "category": "body", "difficulty": 1},
                {"telugu": "ముఖం", "english": "Face", "transliteration": "mukhaṁ", "category": "body", "difficulty": 1},
                {"telugu": "కళ్ళు", "english": "Eyes", "transliteration": "kaḷḷu", "category": "body", "difficulty": 1},
                {"telugu": "చెవులు", "english": "Ears", "transliteration": "chevalu", "category": "body", "difficulty": 1},
                {"telugu": "ముక్కు", "english": "Nose", "transliteration": "mukku", "category": "body", "difficulty": 1},
                {"telugu": "నోరు", "english": "Mouth", "transliteration": "nōru", "category": "body", "difficulty": 1},
                {"telugu": "చేతులు", "english": "Hands", "transliteration": "cētulu", "category": "body", "difficulty": 1},
                {"telugu": "కాళ్ళు", "english": "Legs / Feet", "transliteration": "kāḷḷu", "category": "body", "difficulty": 1},
                {"telugu": "వేలు", "english": "Finger", "transliteration": "vēlu", "category": "body", "difficulty": 1},
            ],
        },
        {
            "day_number": 12,
            "title": "Common Verbs (క్రియలు)",
            "description": "Essential action words",
            "category": "verbs",
            "order_index": 12,
            "words": [
                {"telugu": "తిను", "english": "Eat", "transliteration": "tinu", "category": "verb", "difficulty": 1},
                {"telugu": "తాగు", "english": "Drink", "transliteration": "tāgu", "category": "verb", "difficulty": 1},
                {"telugu": "వెళ్ళు", "english": "Go", "transliteration": "veḷḷu", "category": "verb", "difficulty": 1},
                {"telugu": "రా", "english": "Come", "transliteration": "rā", "category": "verb", "difficulty": 1},
                {"telugu": "చూడు", "english": "See / Look", "transliteration": "cūḍu", "category": "verb", "difficulty": 1},
                {"telugu": "విను", "english": "Listen / Hear", "transliteration": "vinu", "category": "verb", "difficulty": 1},
                {"telugu": "చెప్పు", "english": "Tell / Say", "transliteration": "cheppu", "category": "verb", "difficulty": 1},
                {"telugu": "చేయి", "english": "Do / Make", "transliteration": "cēyi", "category": "verb", "difficulty": 1},
                {"telugu": "రాయి", "english": "Write", "transliteration": "rāyi", "category": "verb", "difficulty": 1},
                {"telugu": "చదువు", "english": "Read / Study", "transliteration": "caduvu", "category": "verb", "difficulty": 1},
            ],
        },
        {
            "day_number": 13,
            "title": "Simple Sentences",
            "description": "Form basic sentences in Telugu",
            "category": "sentences",
            "order_index": 13,
            "words": [
                {"telugu": "నేను తింటాను", "english": "I eat", "transliteration": "nēnu tiṇṭānu", "category": "sentence", "difficulty": 2},
                {"telugu": "నేను తాగుతాను", "english": "I drink", "transliteration": "nēnu tāgutānu", "category": "sentence", "difficulty": 2},
                {"telugu": "నేను వెళ్తాను", "english": "I go", "transliteration": "nēnu veḷtānu", "category": "sentence", "difficulty": 2},
                {"telugu": "నేను వస్తాను", "english": "I come", "transliteration": "nēnu vastānu", "category": "sentence", "difficulty": 2},
                {"telugu": "నేను చదువుతాను", "english": "I study", "transliteration": "nēnu caduvutānu", "category": "sentence", "difficulty": 2},
                {"telugu": "నీరు తాగాలి", "english": "Want to drink water", "transliteration": "nīru tāgāli", "category": "sentence", "difficulty": 2},
                {"telugu": "అన్నం తినాలి", "english": "Want to eat food", "transliteration": "annaṁ tināli", "category": "sentence", "difficulty": 2},
                {"telugu": "ఎలా ఉన్నావు?", "english": "How are you? (informal)", "transliteration": "elā unnāvu?", "category": "sentence", "difficulty": 2},
                {"telugu": "బాగున్నావా?", "english": "Are you okay?", "transliteration": "bāgunnāvā?", "category": "sentence", "difficulty": 2},
                {"telugu": "ఇక్కడ రా", "english": "Come here", "transliteration": "ikkaḍa rā", "category": "sentence", "difficulty": 2},
            ],
        },
        {
            "day_number": 14,
            "title": "Week 2 Review",
            "description": "Review all words from Week 2",
            "category": "review",
            "order_index": 14,
            "words": [],
        },
    ]

    # Insert lessons and vocabulary
    for lesson_data in lessons_data:
        words = lesson_data.pop("words")
        lesson = Lesson(**lesson_data)
        db.add(lesson)
        await db.flush()

        for word_data in words:
            word_data["lesson_id"] = lesson.id
            db.add(Vocabulary(**word_data))

    await db.commit()
    print(f"Seeded {len(lessons_data)} lessons with vocabulary.")
