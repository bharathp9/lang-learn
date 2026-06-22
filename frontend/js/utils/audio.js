// Audio utilities - Playback and TTS fallback

export class AudioPlayer {
    constructor() {
        this.currentAudio = null;
    }

    async playUrl(url) {
        return new Promise((resolve, reject) => {
            if (this.currentAudio) {
                this.currentAudio.pause();
            }
            
            const audio = new Audio(url);
            this.currentAudio = audio;
            
            audio.onended = resolve;
            audio.onerror = () => {
                // Fallback to browser TTS
                this.fallbackTTS(audio.dataset.text || '', 'te').then(resolve).catch(reject);
            };
            
            audio.play().catch(() => {
                // If audio fails, try TTS
                this.fallbackTTS(audio.dataset.text || '', 'te').then(resolve).catch(reject);
            });
        });
    }

    async playWord(word) {
        // Try pre-generated audio first
        const audioUrl = `http://187.77.131.116:8000/api/audio/${word.id}`;
        try {
            await this.playUrl(audioUrl);
        } catch {
            // Fallback to browser TTS
            await this.fallbackTTS(word.telugu, 'te');
        }
    }

    fallbackTTS(text, lang = 'te') {
        return new Promise((resolve, reject) => {
            if (!('speechSynthesis' in window)) {
                reject(new Error('TTS not supported'));
                return;
            }
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang === 'te' ? 'te-IN' : 'en-US';
            utterance.rate = 0.8;
            utterance.onend = resolve;
            utterance.onerror = reject;
            speechSynthesis.speak(utterance);
        });
    }

    stop() {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio = null;
        }
        speechSynthesis.cancel();
    }
}

export const audioPlayer = new AudioPlayer();
