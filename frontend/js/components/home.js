// Home Page - Dashboard with lessons and daily progress

export async function HomePage(app) {
    const user = app.currentUser;
    
    // Fetch lessons
    let lessons = [];
    try {
        lessons = await app.api.getLessons();
        app.storage.setCachedLessons(lessons);
    } catch {
        lessons = app.storage.getCachedLessons() || [];
    }

    // Calculate progress
    const totalWords = lessons.reduce((sum, l) => sum + l.word_count, 0);
    const completedDays = lessons.filter(l => l.word_count === 0).length;

    return `
    <div class="min-h-screen bg-light">
        <!-- Header -->
        <header class="gradient-bg text-white p-4 shadow-lg">
            <div class="max-w-4xl mx-auto flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <span class="text-3xl">${user.avatar_emoji}</span>
                    <div>
                        <h2 class="font-bold text-lg">${user.display_name}</h2>
                        <div class="flex items-center gap-2 text-sm opacity-90">
                            <span>Level ${user.level}</span>
                            <span>•</span>
                            <span>${user.xp} XP</span>
                            ${user.streak > 0 ? `<span>•</span><span class="streak-fire">🔥 ${user.streak}</span>` : ''}
                        </div>
                    </div>
                </div>
                <div class="flex gap-2">
                    <button onclick="window.app.navigate('leaderboard')" class="p-2 bg-white/20 rounded-lg hover:bg-white/30">
                        🏆
                    </button>
                    <button onclick="window.app.navigate('profile')" class="p-2 bg-white/20 rounded-lg hover:bg-white/30">
                        👤
                    </button>
                    <button onclick="window.app.handleLogout()" class="p-2 bg-white/20 rounded-lg hover:bg-white/30">
                        🚪
                    </button>
                </div>
            </div>
        </header>

        <!-- Daily Goal Card -->
        <div class="max-w-4xl mx-auto p-4">
            <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="font-bold text-xl text-dark">Today's Goal</h3>
                    <span class="text-2xl">🎯</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-4 mb-2">
                    <div class="progress-bar gradient-bg h-4 rounded-full" style="width: ${Math.min(100, (user.xp % 100))}%"></div>
                </div>
                <p class="text-gray-600 text-sm">Earn ${100 - (user.xp % 100)} more XP to reach the next level!</p>
            </div>

            <!-- Quick Actions -->
            <div class="grid grid-cols-2 gap-4 mb-6">
                <button onclick="window.startQuickGame('word-match')" 
                    class="bg-white rounded-2xl shadow-lg p-6 card-hover text-left">
                    <div class="text-4xl mb-2">🎯</div>
                    <h4 class="font-bold text-lg text-dark">Word Match</h4>
                    <p class="text-gray-500 text-sm">Match Telugu to English</p>
                </button>
                <button onclick="window.startQuickGame('listen-repeat')" 
                    class="bg-white rounded-2xl shadow-lg p-6 card-hover text-left">
                    <div class="text-4xl mb-2">🎤</div>
                    <h4 class="font-bold text-lg text-dark">Listen & Repeat</h4>
                    <p class="text-gray-500 text-sm">Pronounce Telugu words</p>
                </button>
                <button onclick="window.startQuickGame('speed-round')" 
                    class="bg-white rounded-2xl shadow-lg p-6 card-hover text-left">
                    <div class="text-4xl mb-2">⚡</div>
                    <h4 class="font-bold text-lg text-dark">Speed Round</h4>
                    <p class="text-gray-500 text-sm">60 seconds challenge</p>
                </button>
                <button onclick="window.startReview()" 
                    class="bg-white rounded-2xl shadow-lg p-6 card-hover text-left">
                    <div class="text-4xl mb-2">🔄</div>
                    <h4 class="font-bold text-lg text-dark">Review</h4>
                    <p class="text-gray-500 text-sm">Practice weak words</p>
                </button>
            </div>

            <!-- Lessons Path -->
            <h3 class="font-bold text-xl text-dark mb-4">📚 30-Day Journey</h3>
            <div class="space-y-3">
                ${lessons.map((lesson, index) => {
                    const isUnlocked = index === 0 || lessons[index - 1]?.word_count === 0;
                    const isCompleted = lesson.word_count === 0;
                    const dayClass = isCompleted ? 'bg-success/10 border-success' : 
                                     isUnlocked ? 'bg-white border-primary card-hover cursor-pointer' : 
                                     'bg-gray-100 border-gray-200 opacity-60';
                    
                    return `
                    <div onclick="${isUnlocked && !isCompleted ? `window.app.navigate('lesson', {lessonId: ${lesson.id}})` : ''}" 
                        class="border-2 ${dayClass} rounded-2xl p-4 transition-all">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 rounded-xl ${isCompleted ? 'bg-success' : isUnlocked ? 'gradient-bg' : 'bg-gray-300'} 
                                flex items-center justify-center text-white font-bold text-lg">
                                ${isCompleted ? '✓' : lesson.day_number}
                            </div>
                            <div class="flex-1">
                                <h4 class="font-bold text-dark">${lesson.title}</h4>
                                <p class="text-gray-500 text-sm">${lesson.description || ''}</p>
                            </div>
                            <div class="text-right">
                                <span class="text-sm text-gray-400">${lesson.word_count} words</span>
                                ${!isUnlocked ? '<div class="text-xl">🔒</div>' : ''}
                            </div>
                        </div>
                    </div>
                    `;
                }).join('')}
            </div>
        </div>
    </div>
    `;
}

// Global handlers
window.startQuickGame = function(gameType) {
    window.app.navigate('game', { gameType, lessonId: 1 });
};

window.startReview = function() {
    window.app.navigate('game', { gameType: 'review' });
};
