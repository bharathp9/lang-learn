// API Client - Backend communication

const API_BASE = 'http://187.77.131.116:8000';

export class API {
    constructor() {
        this.baseUrl = API_BASE;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        const response = await fetch(url, config);
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        return response.json();
    }

    // Auth
    async register(username, displayName, avatar = '🦁') {
        return this.request('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, display_name: displayName, avatar_emoji: avatar }),
        });
    }

    async login(username) {
        return this.request(`/api/auth/login?username=${encodeURIComponent(username)}`, {
            method: 'POST',
        });
    }

    // Lessons
    async getLessons() {
        return this.request('/api/lessons/');
    }

    async getLesson(lessonId, token) {
        return this.request(`/api/lessons/${lessonId}?token=${token}`);
    }

    // Practice
    async submitPractice(results, token) {
        return this.request('/api/practice/word', {
            method: 'POST',
            body: JSON.stringify({ results }),
            headers: { 'Authorization': `Bearer ${token}` },
        });
    }

    async startSession(gameType, token) {
        return this.request('/api/practice/session', {
            method: 'POST',
            body: JSON.stringify({ game_type: gameType }),
            headers: { 'Authorization': `Bearer ${token}` },
        });
    }

    async completeSession(sessionId, score, xpEarned, wordsPracticed, token) {
        return this.request(`/api/practice/session/${sessionId}`, {
            method: 'PUT',
            body: JSON.stringify({
                score,
                xp_earned: xpEarned,
                words_practiced: wordsPracticed,
            }),
            headers: { 'Authorization': `Bearer ${token}` },
        });
    }

    async getReviewWords(token, limit = 20) {
        return this.request(`/api/practice/review?limit=${limit}&token=${token}`);
    }

    // Progress
    async getUserStats(userId, token) {
        return this.request(`/api/progress/${userId}?token=${token}`);
    }

    async getLeaderboard() {
        return this.request('/api/progress/leaderboard/weekly');
    }

    async getAchievements(userId, token) {
        return this.request(`/api/progress/achievements/${userId}?token=${token}`);
    }

    // Audio
    static getAudioUrl(wordId) {
        return `${API_BASE}/api/audio/${wordId}`;
    }
}
