// Login Page Component

export function LoginPage(app) {
    return `
    <div class="min-h-screen gradient-bg flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-md bounce-in">
            <!-- Logo -->
            <div class="text-center mb-6 sm:mb-8">
                <h1 class="text-3xl sm:text-4xl font-bold text-primary mb-2">LangLearn</h1>
                <p class="text-gray-600 text-base sm:text-lg">Learn Telugu in 30 Days!</p>
                <div class="text-5xl sm:text-6xl mt-4">🇮🇳</div>
            </div>
            
            <!-- Avatar Selection -->
            <div class="mb-6">
                <label class="block text-sm font-bold text-gray-700 mb-2">Choose your avatar:</label>
                <div class="flex justify-center gap-2 sm:gap-3 flex-wrap" id="avatar-select">
                    ${['🦁', '🐯', '🐻', '🐼', '🐨', '🐸', '🦊', '🐰'].map((emoji, i) => `
                        <button onclick="window.selectAvatar('${emoji}')" 
                            class="avatar-btn text-2xl sm:text-3xl p-2 rounded-xl border-2 ${i === 0 ? 'border-primary bg-orange-50' : 'border-gray-200'} hover:border-primary transition-all btn-hover touch-target"
                            data-emoji="${emoji}">
                            ${emoji}
                        </button>
                    `).join('')}
                </div>
            </div>
            
            <!-- Register Form -->
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-1">Your Name</label>
                    <input type="text" id="display-name" placeholder="Enter your name" 
                        class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-base sm:text-lg transition-colors">
                </div>
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-1">Username</label>
                    <input type="text" id="username" placeholder="Choose a username" 
                        class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-base sm:text-lg transition-colors">
                </div>
                
                <button onclick="window.handleRegister()" 
                    class="w-full gradient-bg text-white font-bold py-3 sm:py-4 rounded-xl text-base sm:text-lg btn-hover shadow-lg touch-target">
                    Start Learning!
                </button>
                
                <div class="text-center text-gray-500 my-2">-- or --</div>
                
                <div>
                    <input type="text" id="login-username" placeholder="Enter existing username" 
                        class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-secondary focus:outline-none text-base sm:text-lg mb-3 transition-colors">
                    <button onclick="window.handleLogin()" 
                        class="w-full bg-secondary text-white font-bold py-3 sm:py-4 rounded-xl text-base sm:text-lg btn-hover shadow-lg touch-target">
                        Login
                    </button>
                </div>
            </div>
            
            <!-- Features -->
            <div class="mt-6 sm:mt-8 grid grid-cols-3 gap-2 text-center text-xs text-gray-500">
                <div class="p-2">
                    <div class="text-xl sm:text-2xl mb-1">🎮</div>
                    <div>Fun Games</div>
                </div>
                <div class="p-2">
                    <div class="text-xl sm:text-2xl mb-1">🎤</div>
                    <div>Speak & Learn</div>
                </div>
                <div class="p-2">
                    <div class="text-xl sm:text-2xl mb-1">🏆</div>
                    <div>Earn Rewards</div>
                </div>
            </div>
        </div>
    </div>
    `;
}

// Global handlers for login page
window.selectedAvatar = '🦁';

window.selectAvatar = function(emoji) {
    window.selectedAvatar = emoji;
    document.querySelectorAll('.avatar-btn').forEach(btn => {
        btn.classList.remove('border-primary', 'bg-orange-50');
        btn.classList.add('border-gray-200');
        if (btn.dataset.emoji === emoji) {
            btn.classList.add('border-primary', 'bg-orange-50');
            btn.classList.remove('border-gray-200');
        }
    });
};

window.handleRegister = async function() {
    const username = document.getElementById('username').value.trim();
    const displayName = document.getElementById('display-name').value.trim();
    
    if (!username || !displayName) {
        alert('Please enter both name and username!');
        return;
    }
    
    await window.app.handleRegister(username, displayName, window.selectedAvatar);
};

window.handleLogin = async function() {
    const username = document.getElementById('login-username').value.trim();
    if (!username) {
        alert('Please enter your username!');
        return;
    }
    await window.app.handleLogin(username);
};
