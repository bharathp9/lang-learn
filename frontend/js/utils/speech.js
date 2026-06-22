// Speech Recognition utilities

export class SpeechRecognizer {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.supported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
        
        if (this.supported) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.maxAlternatives = 5;
        }
    }

    isSupported() {
        return this.supported;
    }

    async listen(expectedText = null, language = 'te-IN') {
        return new Promise((resolve, reject) => {
            if (!this.supported) {
                reject(new Error('Speech recognition not supported'));
                return;
            }

            this.recognition.lang = language;
            this.recognition.maxAlternatives = 5;
            
            this.recognition.onresult = (event) => {
                const results = [];
                for (let i = 0; i < event.results[0].length; i++) {
                    results.push({
                        transcript: event.results[0][i].transcript,
                        confidence: event.results[0][i].confidence,
                    });
                }
                
                // Check if any result matches expected text
                let match = false;
                let bestMatch = null;
                
                if (expectedText) {
                    for (const result of results) {
                        const similarity = this.calculateSimilarity(
                            result.transcript.toLowerCase(),
                            expectedText.toLowerCase()
                        );
                        if (similarity > 0.6) {
                            match = true;
                            bestMatch = result;
                            break;
                        }
                    }
                }
                
                resolve({
                    success: match || !expectedText,
                    results,
                    bestMatch,
                    transcript: results[0]?.transcript || '',
                });
            };

            this.recognition.onerror = (event) => {
                reject(new Error(`Speech recognition error: ${event.error}`));
            };

            this.recognition.onend = () => {
                this.isListening = false;
            };

            this.isListening = true;
            this.recognition.start();
        });
    }

    stop() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
            this.isListening = false;
        }
    }

    // Simple similarity check (Levenshtein-based)
    calculateSimilarity(str1, str2) {
        const len1 = str1.length;
        const len2 = str2.length;
        const matrix = [];

        for (let i = 0; i <= len1; i++) {
            matrix[i] = [i];
        }
        for (let j = 0; j <= len2; j++) {
            matrix[0][j] = j;
        }

        for (let i = 1; i <= len1; i++) {
            for (let j = 1; j <= len2; j++) {
                const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j - 1] + cost
                );
            }
        }

        const distance = matrix[len1][len2];
        return 1 - distance / Math.max(len1, len2);
    }
}

export const speechRecognizer = new SpeechRecognizer();
