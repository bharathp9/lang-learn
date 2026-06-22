// Profile Page - User stats and achievements

export async function ProfilePage(app) {
    const user = app.currentUser;
    
    let stats = null;
    let achievements = [];
    
    try {
        stats = await app.api.getUserStats(user.id, user.token);
        achievements = await app.api.getAchievements(user.id, user.token);
    } catch (error) {
        console.error('Failed to load profile:', error);
    }

    return `
    <div class="min-h-screen bg-light">
        <!-- Header -->
        <header class="gradient-bg text-white p-4">
            <div class="max-w-4xl mx-auto flex items-center gap-4">
                <button onclick="window.app.navigate('home')" class="p-2 bg-white/20 rounded-lg hover:bg-white/30">
                    ← Back
                </button>
                <h2 class="font-bold text-lg">My Profile</h2>
            </div>
        </header>

        <div class="max-w-4xl mx-auto p-4">
            <!-- Profile Card -->
            <div class="bg-white rounded-3xl shadow-xl p-8 mb-6 text-center">
                <div class="text-6xl mb-4">${user.avatar_emoji}</div>
                <h1 class="text-2xl font-bold text-dark mb-1">${user.display_name}</h1>
                <p class="text-gray-500">@${user.username}</p>
                
                <div class="flex justify-center gap-8 mt-6">
                    <div>
                        <div class="text-3xl font-bold text-primary">${user.level}</div>
                        <div class="text-sm text-gray-500">Level</div>
                    </div>
                    <div>
                        <div class="text-3xl font-bold text-accent">${user.xp}</div>
                        <div class="text-sm text-gray-500">Total XP</div>
                    </div>
                    <div>
                        <div class="text-3xl font-bold text-success">${user.streak}</div>
                        <div class="text-sm text-gray-500">Day Streak 🔥</div>
                    </div>
                </div>
            </div>

            <!-- Stats Grid -->
            ${stats ? `
            <div class="grid grid-cols-2 gap-4 mb-6">
                <div class="bg-white rounded-2xl shadow p-6 text-center">
                    <div class="text-3xl font-bold text-primary">${stats.words_learned}</div>
                    <div class="text-gray-500">Words Learned</div>
                </div>
                <div class="bg-white rounded-2xl shadow p-6 text-center">
                    <div class="text-3xl font-bold text-success">${stats.words_mastered}</div>
                    <div class="text-gray-500">Words Mastered</div>
                </div>
                <div class="bg-white rounded-2xl shadow p-6 text-center">
                    <div class="text-3xl font-bold text-accent">${stats.total_practice_sessions}</div>
                    <div class="text-gray-500">Practice Sessions</div>
                </div>
                <div class="bg-white rounded-2xl shadow p-6 text-center">
                    <div class="text-3xl font-bold text-secondary">#${stats.current_rank}</div>
                    <div class="text-gray-500">Rank</div>
                </div>
            </div>
            ` : ''}

            <!-- Achievements -->
            <h3 class="font-bold text-xl text-dark mb-4">🏆 Achievements</h3>
            <div class="grid grid-cols-3 gap-3">
                ${achievements.map(ach => `
                <div class="bg-white rounded-xl shadow p-4 text-center ${ach.earned ? '' : 'opacity-40'}">
                    <div class="text-3xl mb-2">${ach.icon_emoji}</div>
                    <div class="text-sm font-bold text-dark">${ach.name}</div>
                    <div class="text-xs text-gray-500">${ach.description || ''}</div>
                    ${ach.earned ? '<div class="text-xs text-success mt-1">✓ Earned</div>' : ''}
                </div>
                `).join('')}
            </div>
        </div>
    </div>
    `;
}
