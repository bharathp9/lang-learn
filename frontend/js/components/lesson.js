// Lesson Page - View lesson content and start practice

import { sounds } from '../utils/sounds.js';

export async function LessonPage(app) {
    const { lessonId } = app.pageParams || {};
    const user = app.currentUser;
    
    let lesson = null;
    try {
        lesson = await app.api.getLesson(lessonId, user.token);
    } catch {
        return `<div class="min-h-screen flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl shadow-xl p-8 text-center max-w-md bounce-in empty-state">
                <div class="text-6xl mb-4">📭</div>
                <h2 class="text-xl font-bold text-dark mb-2">Lesson not found</h2>
                <p class="text-gray-500 mb-6">This lesson might not be available yet.</p>
                <button onclick="window.app.navigate('home')" class="gradient-bg text-white px-6 py-3 rounded-xl btn-hover touch-target">
                    Go Home
                </button>
            </div>
        </div>`;
    }

    return `
    <div class="min-h-screen bg-light">
        <!-- Header -->
        <header class="gradient-bg text-white p-3 sm:p-4 shadow-lg">
            <div class="max-w-4xl mx-auto flex items-center gap-3 sm:gap-4">
                <button onclick="window.app.navigate('home')" class="p-2 bg-white/20 rounded-lg hover:bg-white/30 btn-hover touch-target">
                    ← Back
                </button>
                <div class="min-w-0">
                    <h2 class="font-bold text-base sm:text-lg">Day ${lesson.day_number}</h2>
                    <p class="text-xs sm:text-sm opacity-90 truncate">${lesson.title}</p>
                </div>
            </div>
        </header>

        <div class="max-w-4xl mx-auto p-4">
            <!-- Lesson Info -->
            <div class="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6 slide-up">
                <h1 class="text-xl sm:text-2xl font-bold text-dark mb-2">${lesson.title}</h1>
                <p class="text-gray-600 text-sm sm:text-base">${lesson.description || ''}</p>
                <div class="flex items-center gap-3 sm:gap-4 mt-4 flex-wrap">
                    <span class="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs sm:text-sm font-bold">
                        ${lesson.vocabulary.length} words
                    </span>
                    <span class="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs sm:text-sm font-bold">
                        ${lesson.category}
                    </span>
                </div>
            </div>

            <!-- Word List -->
            <h3 class="font-bold text-base sm:text-lg text-dark mb-4">Words in this lesson:</h3>
            
            ${lesson.vocabulary.length === 0 ? `
            <div class="bg-white rounded-2xl shadow-lg p-8 text-center empty-state">
                <div class="text-5xl mb-4">📝</div>
                <h4 class="font-bold text-lg text-dark mb-2">No words yet!</h4>
                <p class="text-gray-500 text-sm">Words will appear here once added.</p>
            </div>
            ` : `
            <div class="grid gap-3 mb-6 stagger-children">
                ${lesson.vocabulary.map(word => `
                <div class="bg-white rounded-xl shadow p-3 sm:p-4 flex items-center gap-3 sm:p-4">
                    <button onclick="window.playWord(${word.id})" 
                        class="w-10 h-10 sm:w-12 sm:h-12 gradient-bg rounded-xl flex items-center justify-center text-white text-lg sm:text-xl btn-hover flex-shrink-0 touch-target">
                        🔊
                    </button>
                    <div class="flex-1 min-w-0">
                        <div class="text-xl sm:text-2xl font-bold text-dark truncate">${word.telugu}</div>
                        <div class="text-xs sm:text-sm text-gray-500 truncate">${word.transliteration}</div>
                    </div>
                    <div class="text-right flex-shrink-0">
                        <div class="font-bold text-primary text-sm sm:text-base">${word.english}</div>
                        ${word.mastery_level >= 3 ? '<span class="text-success text-xs sm:text-sm">✓ Mastered</span>' : 
                          word.mastery_level >= 1 ? '<span class="text-accent text-xs sm:text-sm">Learning</span>' : 
                          '<span class="text-gray-400 text-xs sm:text-sm">New</span>'}
                    </div>
                </div>
                `).join('')}
            </div>
            `}

            <!-- Practice Buttons -->
            <h3 class="font-bold text-base sm:text-lg text-dark mb-4">Practice Games:</h3>
            <div class="grid grid-cols-2 gap-3 sm:gap-4">
                <button onclick="window.app.navigate('game', {gameType: 'word-match', lessonId: ${lesson.id}})" 
                    class="bg-white rounded-2xl shadow-lg p-4 sm:p-6 card-hover text-center btn-hover touch-target">
                    <div class="text-3xl sm:text-4xl mb-2">🎯</div>
                    <h4 class="font-bold text-dark text-sm sm:text-base">Word Match</h4>
                    <p class="text-gray-500 text-xs">Match Telugu to English</p>
                </button>
                <button onclick="window.app.navigate('game', {gameType: 'listen-repeat', lessonId: ${lesson.id}})" 
                    class="bg-white rounded-2xl shadow-lg p-4 sm:p-6 card-hover text-center btn-hover touch-target">
                    <div class="text-3xl sm:text-4xl mb-2">🎤</div>
                    <h4 class="font-bold text-dark text-sm sm:text-base">Listen & Repeat</h4>
                    <p class="text-gray-500 text-xs">Practice pronunciation</p>
                </button>
                <button onclick="window.app.navigate('game', {gameType: 'speed-round', lessonId: ${lesson.id}})" 
                    class="bg-white rounded-2xl shadow-lg p-4 sm:p-6 card-hover text-center btn-hover touch-target">
                    <div class="text-3xl sm:text-4xl mb-2">⚡</div>
                    <h4 class="font-bold text-dark text-sm sm:text-base">Speed Round</h4>
                    <p class="text-gray-500 text-xs">60 second challenge</p>
                </button>
                <button onclick="window.app.navigate('game', {gameType: 'review', lessonId: ${lesson.id}})" 
                    class="bg-white rounded-2xl shadow-lg p-4 sm:p-6 card-hover text-center btn-hover touch-target">
                    <div class="text-3xl sm:text-4xl mb-2">🔄</div>
                    <h4 class="font-bold text-dark text-sm sm:text-base">Review All</h4>
                    <p class="text-gray-500 text-xs">Practice all words</p>
                </button>
            </div>
        </div>
    </div>
    `;
}

window.playWord = async function(wordId) {
    sounds.playTap();
    const { audioPlayer } = await import('../utils/audio.js');
    audioPlayer.playUrl(`http://187.77.131.116:8000/api/audio/${wordId}`);
};
