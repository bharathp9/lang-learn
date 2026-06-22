// Lesson Page - View lesson content and start practice

export async function LessonPage(app) {
    const { lessonId } = app.pageParams || {};
    const user = app.currentUser;
    
    let lesson = null;
    try {
        lesson = await app.api.getLesson(lessonId, user.token);
    } catch {
        return `<div class="min-h-screen flex items-center justify-center">
            <div class="text-center">
                <div class="text-6xl mb-4">😕</div>
                <h2 class="text-xl font-bold">Lesson not found</h2>
                <button onclick="window.app.navigate('home')" class="mt-4 gradient-bg text-white px-6 py-2 rounded-xl">Go Home</button>
            </div>
        </div>`;
    }

    return `
    <div class="min-h-screen bg-light">
        <!-- Header -->
        <header class="gradient-bg text-white p-4">
            <div class="max-w-4xl mx-auto flex items-center gap-4">
                <button onclick="window.app.navigate('home')" class="p-2 bg-white/20 rounded-lg hover:bg-white/30">
                    ← Back
                </button>
                <div>
                    <h2 class="font-bold text-lg">Day ${lesson.day_number}</h2>
                    <p class="text-sm opacity-90">${lesson.title}</p>
                </div>
            </div>
        </header>

        <div class="max-w-4xl mx-auto p-4">
            <!-- Lesson Info -->
            <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <h1 class="text-2xl font-bold text-dark mb-2">${lesson.title}</h1>
                <p class="text-gray-600">${lesson.description || ''}</p>
                <div class="flex items-center gap-4 mt-4">
                    <span class="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold">
                        ${lesson.vocabulary.length} words
                    </span>
                    <span class="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-bold">
                        ${lesson.category}
                    </span>
                </div>
            </div>

            <!-- Word List -->
            <h3 class="font-bold text-lg text-dark mb-4">Words in this lesson:</h3>
            <div class="grid gap-3 mb-6">
                ${lesson.vocabulary.map(word => `
                <div class="bg-white rounded-xl shadow p-4 flex items-center gap-4">
                    <button onclick="window.playWord(${word.id})" 
                        class="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center text-white text-xl hover:opacity-90">
                        🔊
                    </button>
                    <div class="flex-1">
                        <div class="text-2xl font-bold text-dark">${word.telugu}</div>
                        <div class="text-sm text-gray-500">${word.transliteration}</div>
                    </div>
                    <div class="text-right">
                        <div class="font-bold text-primary">${word.english}</div>
                        ${word.mastery_level >= 3 ? '<span class="text-success text-sm">✓ Mastered</span>' : 
                          word.mastery_level >= 1 ? '<span class="text-accent text-sm">Learning</span>' : 
                          '<span class="text-gray-400 text-sm">New</span>'}
                    </div>
                </div>
                `).join('')}
            </div>

            <!-- Practice Buttons -->
            <div class="grid grid-cols-2 gap-4">
                <button onclick="window.app.navigate('game', {gameType: 'word-match', lessonId: ${lesson.id}})" 
                    class="bg-white rounded-2xl shadow-lg p-6 card-hover text-center">
                    <div class="text-4xl mb-2">🎯</div>
                    <h4 class="font-bold text-dark">Word Match</h4>
                    <p class="text-gray-500 text-sm">Match Telugu to English</p>
                </button>
                <button onclick="window.app.navigate('game', {gameType: 'listen-repeat', lessonId: ${lesson.id}})" 
                    class="bg-white rounded-2xl shadow-lg p-6 card-hover text-center">
                    <div class="text-4xl mb-2">🎤</div>
                    <h4 class="font-bold text-dark">Listen & Repeat</h4>
                    <p class="text-gray-500 text-sm">Practice pronunciation</p>
                </button>
                <button onclick="window.app.navigate('game', {gameType: 'speed-round', lessonId: ${lesson.id}})" 
                    class="bg-white rounded-2xl shadow-lg p-6 card-hover text-center">
                    <div class="text-4xl mb-2">⚡</div>
                    <h4 class="font-bold text-dark">Speed Round</h4>
                    <p class="text-gray-500 text-sm">60 second challenge</p>
                </button>
                <button onclick="window.app.navigate('game', {gameType: 'review', lessonId: ${lesson.id}})" 
                    class="bg-white rounded-2xl shadow-lg p-6 card-hover text-center">
                    <div class="text-4xl mb-2">🔄</div>
                    <h4 class="font-bold text-dark">Review All</h4>
                    <p class="text-gray-500 text-sm">Practice all words</p>
                </button>
            </div>
        </div>
    </div>
    `;
}

window.playWord = async function(wordId) {
    const { audioPlayer } = await import('../utils/audio.js');
    audioPlayer.playUrl(`http://187.77.131.116:8000/api/audio/${wordId}`);
};
