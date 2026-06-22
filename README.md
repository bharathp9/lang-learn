# LangLearn - Multi-Language Learning App

LangLearn is a gamified web app for language learning (starting with Telugu), designed primarily for ages 10-15. The app teaches vocabulary, phrases, and simple sentences through interactive games with spaced repetition, XP/leveling, achievements, and a leaderboard.

## Architecture

```
Frontend (GitHub Pages)  -->  Backend (VPS:187.77.131.116)
     Static HTML/CSS/JS         FastAPI + SQLite + nginx
```

| Layer | Tech | Host |
|-------|------|------|
| Frontend | Vanilla JS + Tailwind CSS | GitHub Pages |
| Backend | FastAPI (Python 3.11) | VPS (187.77.131.116:8000) |
| Database | SQLite (aiosqlite) | VPS local disk |
| Audio | gTTS (Google TTS) | Generated on-demand, stored in `/app/data/audio/` |
| Proxy | nginx | VPS (port 80) |
| Container | Docker | VPS |

## Project Structure

```
lang-learn/
├── backend/
│   ├── main.py                 # FastAPI app, CORS, router registration
│   ├── database.py             # SQLAlchemy async engine + session
│   ├── models.py               # DB models (6 tables)
│   ├── schemas.py              # Pydantic schemas
│   ├── routers/
│   │   ├── auth.py             # /api/auth - register, login
│   │   ├── lessons.py          # /api/lessons - list, detail, today
│   │   ├── practice.py         # /api/practice - word practice, games, review
│   │   ├── progress.py         # /api/progress - stats, leaderboard, achievements
│   │   └── audio.py            # /api/audio - TTS endpoints
│   ├── services/
│   │   ├── gamification.py     # XP, levels, 15 achievements
│   │   ├── spaced_repetition.py# SM-2 algorithm
│   │   └── tts.py              # gTTS wrapper
│   ├── data/
│   │   └── seed.py             # 14 lessons, 130+ vocabulary words
│   ├── tests/
│   │   └── test_basic.py       # Pytest tests
│   ├── requirements.txt        # Python dependencies
│   ├── Dockerfile              # Docker image (python:3.11-slim)
│   ├── nginx.conf              # Reverse proxy config
│   └── start.sh                # Init script: seed DB + start uvicorn
├── frontend/
│   ├── index.html              # Single-page app shell
│   ├── css/                    # Tailwind + custom styles
│   ├── js/
│   │   ├── api.js              # API client (fetch wrapper)
│   │   ├── app.js              # Router (6 pages)
│   │   ├── components/         # Page components (login, home, game, lesson, profile, leaderboard)
│   │   └── utils/              # Storage, audio player, speech recognizer
│   └── .github/workflows/
│       └── deploy.yml          # GitHub Actions: deploy to Pages on push
└── README.md                   # This file
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login (returns token) |
| GET | `/api/lessons/` | List all lessons |
| GET | `/api/lessons/:id` | Lesson detail with vocabulary |
| GET | `/api/lessons/today` | Today's recommended lesson |
| POST | `/api/practice/word` | Submit practice results |
| POST | `/api/practice/session` | Start game session |
| PUT | `/api/practice/session/:id` | Complete game session |
| GET | `/api/practice/review` | Get review words (SM-2) |
| GET | `/api/progress/:userId` | User stats |
| GET | `/api/progress/leaderboard/weekly` | Weekly leaderboard |
| GET | `/api/progress/achievements/:userId` | User achievements |
| GET | `/api/audio/:wordId` | Generate/stream TTS audio |
| GET | `/api/health` | Health check |

## Setup

### Backend (VPS)

```bash
# Clone repo
git clone https://github.com/bharathp9/lang-learn.git
cd lang-learn/backend

# Option A: Docker
docker build -t telugu-api .
docker run -d --name telugu-api -p 8000:8000 \
  -v telugu-data:/app/data telugu-api

# Option B: Direct (with python 3.11+)
pip install -r requirements.txt
chmod +x start.sh
./start.sh
```

### Nginx (VPS)

```bash
sudo cp nginx.conf /etc/nginx/sites-available/telugu
sudo ln -s /etc/nginx/sites-available/telugu /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### SSL (optional, recommended)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### Frontend

```bash
cd frontend
# Just push to main branch - GitHub Actions auto-deploys to GitHub Pages
# Or serve locally with any static server:
npx serve .
```

### Deployment Config

- GitHub repo: Pages source = GitHub Actions
- API_BASE in `frontend/js/api.js` points to VPS IP: `http://187.77.131.116:8000`
- After nginx setup, update API_BASE to `http://187.77.131.116/api` (port 80)

## Content

- **14 lessons** (Week 1-2 complete): vowels, consonants, greetings, introductions, numbers, courtesy words, family, food, colors, body parts, verbs, sentences
- **130+ vocabulary words** with Telugu script, transliteration, English translation
- **3 game types**: word match, listen & repeat, speed round
- **15 achievements** with XP/leveling system
- **SM-2 spaced repetition** for review scheduling

## Development

```bash
# Backend tests
cd backend
pip install pytest pytest-asyncio httpx
pytest tests/

# Run backend locally
uvicorn main:app --reload --port 8000

# Frontend - just open index.html or use any static server
cd frontend
python -m http.server 3000
```

## Cost Estimate

| Item | Cost |
|------|------|
| GitHub Pages | Free |
| VPS (if using existing) | $0 |
| GitHub repo | Free |
| Total | ~$0 |
