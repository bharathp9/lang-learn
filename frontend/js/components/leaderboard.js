// Leaderboard Page

export async function LeaderboardPage(app) {
    let leaderboard = [];
    
    try {
        leaderboard = await app.api.getLeaderboard();
    } catch (error) {
        console.error('Failed to load leaderboard:', error);
    }

    return `
    <div class="min-h-screen bg-light">
        <!-- Header -->
        <header class="gradient-bg text-white p-4">
            <div class="max-w-4xl mx-auto flex items-center gap-4">
                <button onclick="window.app.navigate('home')" class="p-2 bg-white/20 rounded-lg hover:bg-white/30">
                    ← Back
                </button>
                <h2 class="font-bold text-lg">🏆 Leaderboard</h2>
            </div>
        </header>

        <div class="max-w-4xl mx-auto p-4">
            <!-- Top 3 Podium -->
            ${leaderboard.length >= 3 ? `
            <div class="flex items-end justify-center gap-4 mb-8">
                <!-- 2nd Place -->
                <div class="text-center">
                    <div class="text-4xl mb-2">${leaderboard[1].avatar_emoji}</div>
                    <div class="bg-gray-300 rounded-t-xl p-4 w-24 h-28 flex flex-col items-center justify-end">
                        <div class="font-bold text-white">${leaderboard[1].display_name}</div>
                        <div class="text-white/80 text-sm">${leaderboard[1].xp} XP</div>
                    </div>
                    <div class="bg-gray-400 text-white font-bold py-2 rounded-b-xl">2</div>
                </div>
                <!-- 1st Place -->
                <div class="text-center">
                    <div class="text-5xl mb-2">${leaderboard[0].avatar_emoji}</div>
                    <div class="bg-accent rounded-t-xl p-4 w-28 h-36 flex flex-col items-center justify-end">
                        <div class="font-bold text-dark">${leaderboard[0].display_name}</div>
                        <div class="text-dark/80 text-sm">${leaderboard[0].xp} XP</div>
                    </div>
                    <div class="bg-yellow-500 text-white font-bold py-2 rounded-b-xl">👑 1</div>
                </div>
                <!-- 3rd Place -->
                <div class="text-center">
                    <div class="text-4xl mb-2">${leaderboard[2].avatar_emoji}</div>
                    <div class="bg-amber-700 rounded-t-xl p-4 w-24 h-24 flex flex-col items-center justify-end">
                        <div class="font-bold text-white">${leaderboard[2].display_name}</div>
                        <div class="text-white/80 text-sm">${leaderboard[2].xp} XP</div>
                    </div>
                    <div class="bg-amber-800 text-white font-bold py-2 rounded-b-xl">3</div>
                </div>
            </div>
            ` : ''}

            <!-- Full List -->
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
                ${leaderboard.map((entry, index) => `
                <div class="flex items-center gap-4 p-4 ${index < leaderboard.length - 1 ? 'border-b border-gray-100' : ''} 
                    ${entry.username === app.currentUser.username ? 'bg-primary/5' : ''}">
                    <div class="w-8 text-center font-bold ${index < 3 ? 'text-accent' : 'text-gray-400'}">
                        ${index + 1}
                    </div>
                    <div class="text-2xl">${entry.avatar_emoji}</div>
                    <div class="flex-1">
                        <div class="font-bold text-dark">${entry.display_name}</div>
                        <div class="text-sm text-gray-500">Level ${entry.level}</div>
                    </div>
                    <div class="text-right">
                        <div class="font-bold text-primary">${entry.xp} XP</div>
                        ${entry.streak > 0 ? `<div class="text-xs text-accent">🔥 ${entry.streak}</div>` : ''}
                    </div>
                </div>
                `).join('')}
                
                ${leaderboard.length === 0 ? `
                <div class="p-8 text-center text-gray-500">
                    <div class="text-4xl mb-2">🏆</div>
                    <p>No players yet. Be the first!</p>
                </div>
                ` : ''}
            </div>
        </div>
    </div>
    `;
}
