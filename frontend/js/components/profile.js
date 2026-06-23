// Profile Page - User stats and achievements

export async function ProfilePage(app) {
    const user = app.currentUser;
    
    let stats = null;
    let achievements = [];
    let loading = true;
    
    try {
        [stats, achievements] = await Promise.all([
            app.api.getUserStats(user.id, user.token),
            app.api.getAchievements(user.id, user.token)
        ]);
        loading = false;
    } catch (error) {
        console.error('Failed to load profile:', error);
        loading = false;
    }

    return `
    <div class="min-h-screen bg-light">
        <!-- Header -->
        <header class="gradient-bg text-white p-3 sm:p-4 shadow-lg">
            <div class="max-w-4xl mx-auto flex items-center gap-3 sm:gap-4">
                <button onclick="window.app.navigate('home')" class="p-2 bg-white/20 rounded-lg hover:bg-white/30 btn-hover touch-target">
                    ← Back
                </button>
                <h2 class="font-bold text-base sm:text-lg">My Profile</h2>
            </div>
        </header>

        <div class="max-w-4xl mx-auto p-4">
            <!-- Profile Card -->
            <div class="bg-white rounded-3xl shadow-xl p-6 sm:p-8 mb-6 text-center slide-up">
                <div class="text-5xl sm:text-6xl mb-4">${user.avatar_emoji}</div>
                <h1 class="text-xl sm:text-2xl font-bold text-dark mb-1">${user.display_name}</h1>
                <p class="text-gray-500 text-sm sm:text-base">@${user.username}</p>
                
                <div class="flex justify-center gap-4 sm:gap-8 mt-6">
                    <div class="stat-card">
                        <div class="text-2xl sm:text-3xl font-bold text-primary">${user.level}</div>
                        <div class="text-xs sm:text-sm text-gray-500">Level</div>
                    </div>
                    <div class="stat-card">
                        <div class="text-2xl sm:text-3xl font-bold text-accent">${user.xp}</div>
                        <div class="text-xs sm:text-sm text-gray-500">Total XP</div>
                    </div>
                    <div class="stat-card">
                        <div class="text-2xl sm:text-3xl font-bold text-success">${user.streak}</div>
                        <div class="text-xs sm:text-sm text-gray-500">Day Streak ${user.streak > 0 ? '🔥' : ''}</div>
                    </div>
                </div>
            </div>

            <!-- Stats Grid -->
            ${loading ? `
            <div class="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
                ${[1,2,3,4].map(() => `
                    <div class="bg-white rounded-2xl shadow p-4 sm:p-6">
                        <div class="h-8 w-12 skeleton mb-2"></div>
                        <div class="h-4 w-20 skeleton"></div>
                    </div>
                `).join('')}
            </div>
            ` : stats ? `
            <div class="grid grid-cols-2 gap-3 sm:gap-4 mb-6 stagger-children">
                <div class="bg-white rounded-2xl shadow p-4 sm:p-6 text-center">
                    <div class="text-2xl sm:text-3xl font-bold text-primary">${stats.words_learned}</div>
                    <div class="text-gray-500 text-xs sm:text-sm">Words Learned</div>
                </div>
                <div class="bg-white rounded-2xl shadow p-4 sm:p-6 text-center">
                    <div class="text-2xl sm:text-3xl font-bold text-success">${stats.words_mastered}</div>
                    <div class="text-gray-500 text-xs sm:text-sm">Words Mastered</div>
                </div>
                <div class="bg-white rounded-2xl shadow p-4 sm:p-6 text-center">
                    <div class="text-2xl sm:text-3xl font-bold text-accent">${stats.total_practice_sessions}</div>
                    <div class="text-gray-500 text-xs sm:text-sm">Practice Sessions</div>
                </div>
                <div class="bg-white rounded-2xl shadow p-4 sm:p-6 text-center">
                    <div class="text-2xl sm:text-3xl font-bold text-secondary">#${stats.current_rank}</div>
                    <div class="text-gray-500 text-xs sm:text-sm">Rank</div>
                </div>
            </div>
            ` : ''}

            <!-- Achievements -->
            <h3 class="font-bold text-lg sm:text-xl text-dark mb-4">🏆 Achievements</h3>
            
            ${achievements.length === 0 ? `
            <div class="bg-white rounded-2xl shadow-lg p-8 text-center empty-state">
                <div class="text-5xl mb-4">🏅</div>
                <h4 class="font-bold text-lg text-dark mb-2">No achievements yet!</h4>
                <p class="text-gray-500 text-sm">Start practicing to earn your first achievement.</p>
            </div>
            ` : `
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 stagger-children">
                ${achievements.map(ach => `
                <div class="bg-white rounded-xl shadow p-3 sm:p-4 text-center ${ach.earned ? '' : 'opacity-40'} transition-all hover:shadow-md">
                    <div class="text-2xl sm:text-3xl mb-2">${ach.icon_emoji}</div>
                    <div class="text-xs sm:text-sm font-bold text-dark truncate">${ach.name}</div>
                    <div class="text-xs text-gray-500 truncate">${ach.description || ''}</div>
                    ${ach.earned ? '<div class="text-xs text-success mt-1 font-bold">✓ Earned</div>' : '<div class="text-xs text-gray-400 mt-1">🔒 Locked</div>'}
                </div>
                `).join('')}
            </div>
            `}
        </div>
    </div>
    `;
}
