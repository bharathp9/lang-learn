#!/bin/bash
# VPS Deployment Script for LangLearn Backend
# Run this on the VPS (187.77.131.116) as root
# Usage: ssh root@187.77.131.116 'bash -s' < deploy_vps.sh

set -e

APP_DIR="/opt/langlearn"
BACKEND_DIR="$APP_DIR/backend"

echo "=== LangLearn VPS Deployment ==="

# 1. System setup
echo "--- System setup ---"
apt-get update -y
apt-get install -y python3 python3-pip python3-venv nginx ffmpeg curl git
mkdir -p /var/log/nginx

# 2. Create app directory
echo "--- Setting up directories ---"
mkdir -p $APP_DIR
mkdir -p $BACKEND_DIR/data/audio

# 3. Copy backend files (assumes files are in current dir)
echo "--- Deploying backend files ---"
cp -r backend/* $BACKEND_DIR/
cp backend/.env $BACKEND_DIR/ 2>/dev/null || true

# 4. Python virtual environment
echo "--- Installing Python dependencies ---"
cd $BACKEND_DIR
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# 5. Generate audio files
echo "--- Generating TTS audio ---"
python data/generate_audio.py

# 6. Seed database
echo "--- Seeding database ---"
python -c "
import asyncio
from database import engine, Base, async_session
from data.seed import seed_database

async def main():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    async with async_session() as session:
        await seed_database(session)
    print('DB ready')

asyncio.run(main())
"

# 7. Create systemd service
echo "--- Creating systemd service ---"
cat > /etc/systemd/system/langlearn.service << 'EOF'
[Unit]
Description=Telugu Learning App Backend
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/langlearn/backend
ExecStart=/opt/langlearn/backend/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000 --workers 2 --log-level info
Restart=always
RestartSec=5
Environment=PATH=/opt/langlearn/backend/venv/bin:/usr/local/bin:/usr/bin:/bin

[Install]
WantedBy=multi-user.target
EOF

# 8. Configure nginx
echo "--- Configuring nginx ---"
cp $BACKEND_DIR/nginx.conf /etc/nginx/sites-available/langlearn
ln -sf /etc/nginx/sites-available/langlearn /etc/nginx/sites-enabled/langlearn
rm -f /etc/nginx/sites-enabled/default
nginx -t

# 9. Start services
echo "--- Starting services ---"
systemctl daemon-reload
systemctl enable langlearn
systemctl restart langlearn
systemctl restart nginx

# 10. Wait and test
sleep 3
echo "--- Testing ---"
curl -s http://localhost:8000/api/health
echo ""
curl -s http://localhost:8000/api/lessons/ | head -c 200
echo ""

echo ""
echo "=== Deployment complete! ==="
echo "API: http://187.77.131.116:8000"
echo "Health: http://187.77.131.116:8000/api/health"
echo "Docs: http://187.77.131.116:8000/docs"
