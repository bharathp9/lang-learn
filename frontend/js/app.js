// Main App - Entry point and routing

import { API } from './api.js';
import { Storage } from './utils/storage.js';

// Pages
import { LoginPage } from './components/login.js';
import { HomePage } from './components/home.js';
import { LessonPage } from './components/lesson.js';
import { GamePage } from './components/game.js';
import { ProfilePage } from './components/profile.js';
import { LeaderboardPage } from './components/leaderboard.js';

class App {
    constructor() {
        this.api = new API();
        this.storage = new Storage();
        this.currentUser = this.storage.getUser();
        this.currentPage = 'login';
    }

    async init() {
        // Check if user is logged in
        if (this.currentUser && this.currentUser.token) {
            this.currentPage = 'home';
        }
        this.render();
    }

    navigate(page, params = {}) {
        this.currentPage = page;
        this.pageParams = params;
        this.render();
        window.scrollTo(0, 0);
    }

    render() {
        const app = document.getElementById('app');
        
        switch (this.currentPage) {
            case 'login':
                app.innerHTML = LoginPage(this);
                break;
            case 'home':
                app.innerHTML = HomePage(this);
                break;
            case 'lesson':
                app.innerHTML = LessonPage(this);
                break;
            case 'game':
                app.innerHTML = GamePage(this);
                break;
            case 'profile':
                app.innerHTML = ProfilePage(this);
                break;
            case 'leaderboard':
                app.innerHTML = LeaderboardPage(this);
                break;
            default:
                app.innerHTML = HomePage(this);
        }
    }

    async handleLogin(username) {
        try {
            const result = await this.api.login(username);
            this.currentUser = result.user;
            this.currentUser.token = result.token;
            this.storage.setUser(this.currentUser);
            this.navigate('home');
        } catch (error) {
            alert('Login failed. Try registering first!');
        }
    }

    async handleRegister(username, displayName, avatar) {
        try {
            const result = await this.api.register(username, displayName, avatar);
            this.currentUser = result.user;
            this.currentUser.token = result.token;
            this.storage.setUser(this.currentUser);
            this.navigate('home');
        } catch (error) {
            alert('Registration failed. Username might be taken.');
        }
    }

    handleLogout() {
        this.storage.clearUser();
        this.currentUser = null;
        this.navigate('login');
    }
}

// Initialize app
const app = new App();
app.init();

// Make app globally accessible for onclick handlers
window.app = app;
