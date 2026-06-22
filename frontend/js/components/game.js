// Game Page - Main game container with different game types

import { audioPlayer } from '../utils/audio.js';
import { speechRecognizer } from '../utils/speech.js';

export async function GamePage(app) {
    const { gameType, lessonId } = app.pageParams || {};
    const user = app.currentUser;
    
    let words = [];
    
    // Load words based on game type
    if (gameType === 'review') {
        try {
            const reviewData = await app.api.getReviewWords(user.token);
            words = reviewData.words;
        } catch {
            words = [];
        }
    } else if (lessonId) {
        try {
            const lesson = await app.api.getLesson(lessonId, user.token);
            words = lesson.vocabulary;
        } catch {
            words = [];
        }
    }
    
    if (words.length === 0) {
        return `
        <div class="min-h-screen bg-light flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl shadow-xl p-8 text-center max-w-md">
                <div class="text-6xl mb-4">😅</div>
                <h2 class="text-2xl font-bold text-dark mb-2">No words to practice!</h2>
                <p class="text-gray-600 mb-6">Complete some lessons first or come back later for review.</p>
                <button onclick="window.app.navigate('home')" 
                    class="gradient-bg text-white font-bold py-3 px-8 rounded-xl">
                    Go Home
                </button>
            </div>
        </div>
        `;
    }

    return `
    <div class="min-h-screen bg-light" id="game-container">
        <!-- Game Header -->
        <header class="gradient-bg text-white p-4">
            <div class="max-w-4xl mx-auto flex items-center justify-between">
                <button onclick="window.exitGame()" class="p-2 bg-white/20 rounded-lg hover:bg-white/30">
                    ✕ Exit
                </button>
                <div class="text-center">
                    <h2 class="font-bold text-lg">${getGameTitle(gameType)}</h2>
                    <div class="text-sm opacity-90">Score: <span id="game-score">0</span></div>
                </div>
                <div class="text-right">
                    <div class="text-sm opacity-90">XP: +<span id="game-xp">0</span></div>
                </div>
            </div>
        </header>

        <!-- Progress Bar -->
        <div class="max-w-4xl mx-auto px-4 py-2">
            <div class="w-full bg-gray-200 rounded-full h-2">
                <div id="game-progress" class="progress-bar gradient-bg h-2 rounded-full" style="width: 0%"></div>
            </div>
            <div class="text-right text-sm text-gray-500 mt-1">
                <span id="current-word">1</span> / <span id="total-words">${words.length}</span>
            </div>
        </div>

        <!-- Game Area -->
        <div class="max-w-4xl mx-auto p-4">
            <div id="game-area" class="bg-white rounded-3xl shadow-xl p-6 min-h-[400px]">
                ${renderGameContent(gameType, words, 0)}
            </div>
        </div>

        <!-- Result Modal (hidden) -->
        <div id="result-modal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 hidden z-50">
            <div class="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center bounce-in">
                <div id="result-emoji" class="text-6xl mb-4">🎉</div>
                <h2 id="result-title" class="text-2xl font-bold text-dark mb-2">Great Job!</h2>
                <p id="result-message" class="text-gray-600 mb-4">You earned 50 XP!</p>
                <div id="result-stats" class="grid grid-cols-3 gap-4 mb-6">
                    <div class="bg-gray-100 rounded-xl p-3">
                        <div class="text-2xl font-bold text-primary" id="result-score">0</div>
                        <div class="text-xs text-gray-500">Score</div>
                    </div>
                    <div class="bg-gray-100 rounded-xl p-3">
                        <div class="text-2xl font-bold text-success" id="result-correct">0</div>
                        <div class="text-xs text-gray-500">Correct</div>
                    </div>
                    <div class="bg-gray-100 rounded-xl p-3">
                        <div class="text-2xl font-bold text-accent" id="result-xp">0</div>
                        <div class="text-xs text-gray-500">XP</div>
                    </div>
                </div>
                <div class="flex gap-3">
                    <button onclick="window.exitGame()" 
                        class="flex-1 bg-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-300">
                        Home
                    </button>
                    <button onclick="window.restartGame()" 
                        class="flex-1 gradient-bg text-white font-bold py-3 rounded-xl hover:opacity-90">
                        Play Again
                    </button>
                </div>
            </div>
        </div>
    </div>
    `;
}

function getGameTitle(gameType) {
    const titles = {
        'word-match': '🎯 Word Match',
        'listen-repeat': '🎤 Listen & Repeat',
        'picture-match': '🖼️ Picture Match',
        'fill-blank': '✏️ Fill the Blank',
        'speed-round': '⚡ Speed Round',
        'review': '🔄 Review',
    };
    return titles[gameType] || '🎮 Practice';
}

function renderGameContent(gameType, words, index) {
    const word = words[index];
    if (!word) return '';
    
    switch (gameType) {
        case 'word-match':
            return renderWordMatch(word, words, index);
        case 'listen-repeat':
            return renderListenRepeat(word);
        case 'speed-round':
            return renderSpeedRound(word, words, index);
        case 'review':
            return renderWordMatch(word, words, index);
        default:
            return renderWordMatch(word, words, index);
    }
}

function renderWordMatch(word, allWords, currentIndex) {
    // Generate 3 wrong options + 1 correct
    const otherWords = allWords.filter(w => w.id !== word.id);
    const shuffled = [...otherWords].sort(() => Math.random() - 0.5);
    const wrongOptions = shuffled.slice(0, 3);
    const options = [...wrongOptions.map(w => ({ text: w.english, correct: false })), 
                     { text: word.english, correct: true }]
                     .sort(() => Math.random() - 0.5);
    
    return `
    <div class="text-center">
        <p class="text-gray-500 mb-4">What does this word mean?</p>
        <div class="mb-8">
            <div class="text-5xl font-bold text-primary mb-2">${word.telugu}</div>
            <div class="text-xl text-gray-500">${word.transliteration}</div>
            <button onclick="window.playCurrentWord()" 
                class="mt-4 px-6 py-2 bg-secondary text-white rounded-full hover:bg-secondary/80 transition-all">
                🔊 Listen
            </button>
        </div>
        <div class="grid grid-cols-2 gap-4">
            ${options.map((opt, i) => `
                <button onclick="window.handleAnswer(${opt.correct}, this)" 
                    class="word-option bg-gray-100 hover:bg-gray-200 rounded-2xl p-6 text-lg font-bold text-dark transition-all border-2 border-transparent">
                    ${opt.text}
                </button>
            `).join('')}
        </div>
    </div>
    `;
}

function renderListenRepeat(word) {
    return `
    <div class="text-center">
        <p class="text-gray-500 mb-4">Listen and repeat the word!</p>
        <div class="mb-8">
            <div class="text-6xl mb-4">🔊</div>
            <button onclick="window.playCurrentWord()" 
                class="gradient-bg text-white font-bold py-4 px-8 rounded-2xl text-xl hover:opacity-90 pulse-glow">
                Play Sound
            </button>
        </div>
        <div id="speaking-area" class="mb-8">
            <p class="text-gray-500 mb-4">Now speak the word:</p>
            <button onclick="window.startSpeaking()" 
                class="bg-success text-white font-bold py-4 px-8 rounded-2xl text-xl hover:opacity-90">
                🎤 Start Speaking
            </button>
            <div id="speaking-feedback" class="mt-4 hidden">
                <div class="speaking-wave justify-center">
                    <span></span><span></span><span></span><span></span><span></span>
                </div>
                <p class="text-gray-500 mt-2">Listening...</p>
            </div>
        </div>
        <div id="speak-result" class="hidden">
            <div class="text-4xl mb-2" id="speak-emoji"></div>
            <p class="text-lg font-bold" id="speak-text"></p>
            <button onclick="window.nextWord()" 
                class="mt-4 gradient-bg text-white font-bold py-3 px-8 rounded-xl">
                Next Word →
            </button>
        </div>
        <div class="mt-6 p-4 bg-gray-100 rounded-xl">
            <p class="text-sm text-gray-500">Hint: <span class="font-bold text-dark">${word.transliteration}</span></p>
            <p class="text-sm text-gray-500">Meaning: <span class="font-bold text-dark">${word.english}</span></p>
        </div>
    </div>
    `;
}

function renderSpeedRound(word, allWords, currentIndex) {
    const otherWords = allWords.filter(w => w.id !== word.id);
    const shuffled = [...otherWords].sort(() => Math.random() - 0.5);
    const wrongOptions = shuffled.slice(0, 3);
    const options = [...wrongOptions.map(w => ({ text: w.english, correct: false })), 
                     { text: word.english, correct: true }]
                     .sort(() => Math.random() - 0.5);
    
    return `
    <div class="text-center">
        <!-- Timer -->
        <div class="mb-4 flex justify-center">
            <svg width="60" height="60" class="transform -rotate-90">
                <circle cx="30" cy="30" r="25" fill="none" stroke="#eee" stroke-width="6"/>
                <circle id="timer-circle" cx="30" cy="30" r="25" fill="none" stroke="#FF6B35" stroke-width="6" 
                    class="timer-ring" style="stroke-dashoffset: 0"/>
            </svg>
            <div class="absolute flex items-center justify-center" style="width: 60px; height: 60px;">
                <span id="timer-text" class="text-xl font-bold text-dark">60</span>
            </div>
        </div>
        
        <p class="text-gray-500 mb-2">Quick! What does this mean?</p>
        <div class="text-5xl font-bold text-primary mb-6">${word.telugu}</div>
        
        <div class="grid grid-cols-2 gap-3">
            ${options.map((opt, i) => `
                <button onclick="window.handleSpeedAnswer(${opt.correct}, this)" 
                    class="speed-option bg-gray-100 hover:bg-gray-200 rounded-xl p-4 text-base font-bold text-dark transition-all">
                    ${opt.text}
                </button>
            `).join('')}
        </div>
    </div>
    `;
}

// Game state
window.gameState = {
    words: [],
    currentIndex: 0,
    score: 0,
    xp: 0,
    correct: 0,
    gameType: '',
    sessionId: null,
    timerInterval: null,
    timeLeft: 60,
};

window.initGame = function(words, gameType) {
    window.gameState = {
        words,
        currentIndex: 0,
        score: 0,
        xp: 0,
        correct: 0,
        gameType,
        sessionId: null,
        timerInterval: null,
        timeLeft: 60,
    };
    
    if (gameType === 'speed-round') {
        window.startSpeedTimer();
    }
};

window.playCurrentWord = async function() {
    const word = window.gameState.words[window.gameState.currentIndex];
    if (word) {
        await audioPlayer.playWord(word);
    }
};

window.handleAnswer = async function(correct, btnElement) {
    const buttons = document.querySelectorAll('.word-option');
    buttons.forEach(btn => {
        btn.disabled = true;
        btn.classList.remove('hover:bg-gray-200');
    });
    
    if (correct) {
        btnElement.classList.remove('bg-gray-100', 'border-transparent');
        btnElement.classList.add('bg-success', 'text-white', 'border-success');
        window.gameState.score += 10;
        window.gameState.xp += 10;
        window.gameState.correct++;
    } else {
        btnElement.classList.remove('bg-gray-100', 'border-transparent');
        btnElement.classList.add('bg-red-500', 'text-white');
        // Highlight correct answer
        buttons.forEach(btn => {
            if (btn.dataset.correct === 'true') {
                btn.classList.add('bg-success', 'text-white');
            }
        });
    }
    
    // Update UI
    document.getElementById('game-score').textContent = window.gameState.score;
    document.getElementById('game-xp').textContent = window.gameState.xp;
    
    // Next word after delay
    setTimeout(() => {
        window.gameState.currentIndex++;
        if (window.gameState.currentIndex >= window.gameState.words.length) {
            window.showResults();
        } else {
            window.renderNextWord();
        }
    }, 1000);
};

window.startSpeaking = async function() {
    const feedback = document.getElementById('speaking-feedback');
    const result = document.getElementById('speak-result');
    feedback.classList.remove('hidden');
    result.classList.add('hidden');
    
    try {
        const word = window.gameState.words[window.gameState.currentIndex];
        const recognitionResult = await speechRecognizer.listen(word.telugu, 'te-IN');
        
        feedback.classList.add('hidden');
        result.classList.remove('hidden');
        
        if (recognitionResult.success) {
            document.getElementById('speak-emoji').textContent = '🎉';
            document.getElementById('speak-text').textContent = 'Great pronunciation!';
            document.getElementById('speak-text').className = 'text-lg font-bold text-success';
            window.gameState.score += 15;
            window.gameState.xp += 15;
            window.gameState.correct++;
        } else {
            document.getElementById('speak-emoji').textContent = '😊';
            document.getElementById('speak-text').textContent = `You said: "${recognitionResult.transcript}" - Keep practicing!`;
            document.getElementById('speak-text').className = 'text-lg font-bold text-accent';
            window.gameState.xp += 5;
        }
        
        document.getElementById('game-score').textContent = window.gameState.score;
        document.getElementById('game-xp').textContent = window.gameState.xp;
    } catch (error) {
        feedback.classList.add('hidden');
        result.classList.remove('hidden');
        document.getElementById('speak-emoji').textContent = '🔇';
        document.getElementById('speak-text').textContent = 'Could not hear you. Try again!';
        document.getElementById('speak-text').className = 'text-lg font-bold text-gray-500';
    }
};

window.nextWord = function() {
    window.gameState.currentIndex++;
    if (window.gameState.currentIndex >= window.gameState.words.length) {
        window.showResults();
    } else {
        window.renderNextWord();
    }
};

window.renderNextWord = function() {
    const gameArea = document.getElementById('game-area');
    const state = window.gameState;
    const word = state.words[state.currentIndex];
    
    document.getElementById('current-word').textContent = state.currentIndex + 1;
    document.getElementById('game-progress').style.width = 
        `${((state.currentIndex + 1) / state.words.length) * 100}%`;
    
    gameArea.innerHTML = renderGameContent(state.gameType, state.words, state.currentIndex);
};

window.startSpeedTimer = function() {
    window.gameState.timeLeft = 60;
    const timerText = document.getElementById('timer-text');
    const timerCircle = document.getElementById('timer-circle');
    
    window.gameState.timerInterval = setInterval(() => {
        window.gameState.timeLeft--;
        timerText.textContent = window.gameState.timeLeft;
        
        const offset = 283 - (283 * window.gameState.timeLeft / 60);
        timerCircle.style.strokeDashoffset = offset;
        
        if (window.gameState.timeLeft <= 0) {
            clearInterval(window.gameState.timerInterval);
            window.showResults();
        }
    }, 1000);
};

window.handleSpeedAnswer = function(correct, btn) {
    if (correct) {
        btn.classList.add('bg-success', 'text-white');
        window.gameState.score += 10;
        window.gameState.xp += 10;
        window.gameState.correct++;
    } else {
        btn.classList.add('bg-red-500', 'text-white');
    }
    
    document.getElementById('game-score').textContent = window.gameState.score;
    document.getElementById('game-xp').textContent = window.gameState.xp;
    
    setTimeout(() => {
        window.gameState.currentIndex++;
        if (window.gameState.currentIndex < window.gameState.words.length && window.gameState.timeLeft > 0) {
            window.renderNextWord();
        } else {
            window.showResults();
        }
    }, 500);
};

window.showResults = function() {
    if (window.gameState.timerInterval) {
        clearInterval(window.gameState.timerInterval);
    }
    
    const modal = document.getElementById('result-modal');
    modal.classList.remove('hidden');
    
    document.getElementById('result-score').textContent = window.gameState.score;
    document.getElementById('result-correct').textContent = window.gameState.correct;
    document.getElementById('result-xp').textContent = window.gameState.xp;
    
    // Confetti for good performance
    if (window.gameState.correct >= window.gameState.words.length * 0.7) {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
        });
    }
    
    // Submit results to backend
    window.submitGameResults();
};

window.submitGameResults = async function() {
    try {
        const user = window.app.currentUser;
        await window.app.api.submitPractice(
            window.gameState.words.map((w, i) => ({
                word_id: w.id,
                correct: i < window.gameState.correct,
                game_type: window.gameState.gameType,
            })),
            user.token
        );
    } catch (error) {
        console.error('Failed to submit results:', error);
    }
};

window.exitGame = function() {
    if (window.gameState.timerInterval) {
        clearInterval(window.gameState.timerInterval);
    }
    window.app.navigate('home');
};

window.restartGame = function() {
    document.getElementById('result-modal').classList.add('hidden');
    window.initGame(window.gameState.words, window.gameState.gameType);
    window.renderNextWord();
};
