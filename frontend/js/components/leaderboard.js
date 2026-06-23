// Leaderboard Page

export async function LeaderboardPage(app) {
    let leaderboard = [];
    let loading = true;
    
    try {
        leaderboard = await app.api.getLeaderboard();
        loading = false;
    } catch (error) {
        console.error('Failed to load leaderboard:', error);
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
                <h2 class="font-bold text-base sm:text-lg">🏆 Leaderboard</h2>
            </div>
        </header>

        <div class="max-w-4xl mx-auto p-4">
            ${loading ? `
            <!-- Loading Skeleton -->
            <div class="space-y-3">
                ${[1,2,3,4,5].map(i => `
                    <div class="bg-white rounded-xl shadow p-4">
                        <div class="flex items-center gap-4">
                            <div class="w-8 h-5 skeleton"></div>
                            <div class="w-10 h-10 rounded-full skeleton"></div>
                            <div class="flex-1">
                                <div class="h-5 w-24 skeleton mb-1"></div>
                                <div class="h-4 w-16 skeleton"></div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            ` : leaderboard.length >= 3 ? `
            <!-- Top 3 Podium -->
            <div class="flex items-end justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
                <!-- 2nd Place -->
                <div class="text-center flex-1 max-w-[100px] sm:max-w-none">
                    <div class="text-3xl sm:text-4xl mb-2">${leaderboard[1].avatar_emoji}</div>
                    <div class="bg-gray-300 rounded-t-xl p-2 sm:p-4 h-24 sm:h-28 flex flex-col items-center justify-end">
                        <div class="font-bold text-white text-xs sm:text-sm truncate w-full">${leaderboard[1].display_name}</div>
                        <div class="text-white/80 text-xs">${leaderboard[1].xp} XP</div>
                    </div>
                    <div class="bg-gray-400 text-white font-bold py-1 sm:py-2 rounded-b-xl text-sm">2</div>
                </div>
                <!-- 1st Place -->
                <div class="text-center flex-1 max-w-[120px] sm:max-w-none">
                    <div class="text-4xl sm:text-5xl mb-2">👑</div>
                    <div class="bg-accent rounded-t-xl p-2 sm:p-4 h-32 sm:h-36 flex flex-col items-center justify-end">
                        <div class="font-bold text-dark text-xs sm:text-sm truncate w-full">${leaderboard[0].display_name}</div>
                        <div class="text-dark/80 text-xs">${leaderboard[0].xp} XP</div>
                    </div>
                    <div class="bg-yellow-500 text-white font-bold py-1 sm:py-2 rounded-b-xl text-sm">1</div>
                </div>
                <!-- 3rd Place -->
                <div class="text-center flex-1 max-w-[100px] sm:max-w-none">
                    <div class="text-3xl sm:text-4xl mb-2">${leaderboard[2].avatar_emoji}</div>
                    <div class="bg-amber-700 rounded-t-xl p-2 sm:p-4 h-20 sm:h-24 flex flex-col items-center justify-end">
                        <div class="font-bold text-white text-xs sm:text-sm truncate w-full">${leaderboard[2].display_name}</div>
                        <div class="text-white/80 text-xs">${leaderboard[2].xp} XP</div>
                    </div>
                    <div class="bg-amber-800 text-white font-bold py-1 sm:py-2 rounded-b-xl text-sm">3</div>
                </div>
            </div>
            ` : ''}

            <!-- Full List -->
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
                ${leaderboard.map((entry, index) => `
                <div class="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 ${index < leaderboard.length - 1 ? 'border-b border-gray-100' : ''} 
                    ${entry.username === app.currentUser.username ? 'bg-primary/5' : ''} transition-colors">
                    <div class="w-6 sm:w-8 text-center font-bold ${index < 3 ? 'text-accent' : 'text-gray-400'} text-sm sm:text-base">
                        ${index + 1}
                    </div>
                    <div class="text-xl sm:text-2xl flex-shrink-0">${entry.avatar_emoji}</div>
                    <div class="flex-1 min-w-0">
                        <div class="font-bold text-dark text-sm sm:text-base truncate">${entry.display_name}</div>
                        <div class="text-xs sm:text-sm text-gray-500">Level ${entry.level}</div>
                    </div>
                    <div class="text-right flex-shrink-0">
                        <div class="font-bold text-primary text-sm sm:text-base">${entry.xp} XP</div>
                        ${entry.streak > 0 ? `<div class="text-xs text-accent">🔥 ${entry.streak}</div>` : ''}
                    </div>
                </div>
                `).join('')}
                
                ${leaderboard.length === 0 ? `
                <div class="p-8 text-center text-gray-500 empty-state">
                    <div class="text-5xl mb-4">🏆</div>
                    <h4 class="font-bold text-lg text-dark mb-2">No players yet!</h4>
                    <p class="text-sm">Be the first to start learning!</p>
                </div>
                ` : ''}
            </div>
        </div>
    </div>
    `;
}
