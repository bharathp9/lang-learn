// Local Storage utilities

export class Storage {
    getUser() {
        const data = localStorage.getItem('langlearn_user');
        return data ? JSON.parse(data) : null;
    }

    setUser(user) {
        localStorage.setItem('langlearn_user', JSON.stringify(user));
    }

    clearUser() {
        localStorage.removeItem('langlearn_user');
    }

    // Session progress (offline support)
    getSessionProgress() {
        const data = sessionStorage.getItem('langlearn_session');
        return data ? JSON.parse(data) : { xpEarned: 0, wordsPracticed: [] };
    }

    setSessionProgress(progress) {
        sessionStorage.setItem('langlearn_session', JSON.stringify(progress));
    }

    // Cache lessons locally
    getCachedLessons() {
        const data = localStorage.getItem('langlearn_lessons');
        return data ? JSON.parse(data) : null;
    }

    setCachedLessons(lessons) {
        localStorage.setItem('langlearn_lessons', JSON.stringify(lessons));
    }
}
