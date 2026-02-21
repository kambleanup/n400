// N-400 Civics Practice - Main Application Logic

class N400App {
    constructor() {
        this.currentView = 'home';
        this.currentQuestion = null;
        this.progress = {};
        this.isSpeaking = false;
        this.showingChoices = false;
        this.selectedChoice = null;
        this.isListening = false;
        this.recognizedText = '';
        this.speechRecognition = this.initSpeechRecognition();

        this.initializeProgress();
        this.setupEventListeners();
        this.render();
    }

    // Initialize Web Speech API with Indian English support
    initSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return null;

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-IN'; // Indian English locale
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            this.isListening = true;
            this.recognizedText = '';
            this.render();
        };

        recognition.onresult = (event) => {
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    this.recognizedText = transcript;
                } else {
                    interimTranscript += transcript;
                }
            }
            this.render();
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            this.isListening = false;
            this.render();
        };

        recognition.onend = () => {
            this.isListening = false;
            this.render();
        };

        return recognition;
    }

    // Initialize progress from localStorage
    initializeProgress() {
        const stored = localStorage.getItem('n400_progress');
        if (stored) {
            this.progress = JSON.parse(stored);
        } else {
            allQuestions.forEach(q => {
                this.progress[q.id] = { asked: 0, correct: 0 };
            });
        }
    }

    // Save progress to localStorage
    saveProgress() {
        localStorage.setItem('n400_progress', JSON.stringify(this.progress));
    }

    // Setup event listeners
    setupEventListeners() {
        // These will be set up in render methods
    }

    // Get next question with weighted random selection
    getNextQuestion() {
        const weights = allQuestions.map(q => {
            const p = this.progress[q.id];
            if (p.asked === 0) return 3; // Never asked: 3x weight
            const accuracy = p.correct / p.asked;
            if (accuracy < 0.5) return 2; // <50% accuracy: 2x weight
            return 1; // >= 50% accuracy: 1x weight
        });

        const totalWeight = weights.reduce((a, b) => a + b, 0);
        let random = Math.random() * totalWeight;

        for (let i = 0; i < allQuestions.length; i++) {
            random -= weights[i];
            if (random <= 0) {
                return allQuestions[i];
            }
        }

        return allQuestions[0];
    }

    // Generate 4 choice options
    generateChoices(correctAnswer) {
        const allAnswers = allQuestions.flatMap(q => q.answers);
        const wrongAnswers = allAnswers.filter(a =>
            a.toLowerCase().trim() !== correctAnswer.toLowerCase().trim()
        );

        // Shuffle and pick 3 random wrong answers
        const shuffled = wrongAnswers.sort(() => Math.random() - 0.5);
        const choices = [correctAnswer, ...shuffled.slice(0, 3)];

        return choices.sort(() => Math.random() - 0.5);
    }

    // Check if answer is correct (with flexible matching)
    isAnswerCorrect(userAnswer, question) {
        const normalized = this.normalizeAnswer(userAnswer);
        return question.answers.some(answer => {
            const expectedNormalized = this.normalizeAnswer(answer);
            return this.fuzzyMatch(normalized, expectedNormalized);
        });
    }

    // Normalize answer for flexible matching (including Indian English phonetics)
    normalizeAnswer(text) {
        if (!text) return '';

        text = text.toLowerCase().trim();

        // Remove extra punctuation and spaces
        text = text.replace(/[.,;:-]/g, ' ');
        text = text.replace(/\s+/g, ' ').trim();

        // Handle Indian English phonetic variations
        const indianEnglishVariations = {
            'd': 'th', // "this" might sound like "dis"
            'f': 'v',  // "very" might sound like "fery"
            'z': 's',  // "constitution" variations
            'ain': 'ine', // "main" vs "mine"
            'our': 'or', // "four" vs "for"
            'ay': 'ei', // "way" vs "wei"
        };

        Object.entries(indianEnglishVariations).forEach(([variant, standard]) => {
            text = text.replace(new RegExp(variant, 'g'), standard);
        });

        // Replace common abbreviations with full words
        const abbreviations = {
            'ct': 'court',
            'rep': 'representative',
            'sens': 'senators',
            'sen': 'senator',
            'pres': 'president',
            'amb': 'ambassador',
            'sec': 'secretary',
            'u.s.': 'united states',
            'us': 'united states',
            'dept': 'department',
            'gov': 'government',
            'approx': 'approximately',
            'nr': 'northern',
            'sr': 'senior',
            'jr': 'junior',
            'ave': 'avenue',
            'st': 'saint'
        };

        Object.entries(abbreviations).forEach(([abbr, full]) => {
            text = text.replace(new RegExp('\\b' + abbr + '\\b', 'g'), full);
        });

        // Replace month names with numbers
        const months = {
            'january': '1', 'jan': '1',
            'february': '2', 'feb': '2',
            'march': '3', 'mar': '3',
            'april': '4', 'apr': '4',
            'may': '5',
            'june': '6', 'jun': '6',
            'july': '7', 'jul': '7',
            'august': '8', 'aug': '8',
            'september': '9', 'sept': '9', 'sep': '9',
            'october': '10', 'oct': '10',
            'november': '11', 'nov': '11',
            'december': '12', 'dec': '12'
        };

        Object.entries(months).forEach(([month, num]) => {
            text = text.replace(new RegExp('\\b' + month + '\\b', 'g'), num);
        });

        // Remove ordinal suffixes (15th, 21st, 3rd, etc)
        text = text.replace(/(\d+)(st|nd|rd|th)\b/g, '$1');

        // Normalize number words (one, two, three, etc)
        const numberWords = {
            'zero': '0', 'one': '1', 'two': '2', 'three': '3', 'four': '4',
            'five': '5', 'six': '6', 'seven': '7', 'eight': '8', 'nine': '9',
            'ten': '10', 'eleven': '11', 'twelve': '12', 'thirteen': '13',
            'fourteen': '14', 'fifteen': '15', 'sixteen': '16', 'seventeen': '17',
            'eighteen': '18', 'nineteen': '19', 'twenty': '20', 'thirty': '30',
            'forty': '40', 'fifty': '50', 'hundred': '100', 'thousand': '1000'
        };

        Object.entries(numberWords).forEach(([word, num]) => {
            text = text.replace(new RegExp('\\b' + word + '\\b', 'g'), num);
        });

        return text;
    }

    // Fuzzy matching - allows for word order variations and partial matches
    fuzzyMatch(userText, expectedText) {
        // Exact match after normalization
        if (userText === expectedText) return true;

        // Split into words and check if all expected words are in user answer
        const userWords = userText.split(/\s+/).filter(w => w);
        const expectedWords = expectedText.split(/\s+/).filter(w => w);

        // If user provided all the key words (regardless of order)
        if (expectedWords.length > 0 && userWords.length > 0) {
            const matchedWords = expectedWords.filter(word =>
                userWords.some(userWord =>
                    userWord.includes(word) || word.includes(userWord)
                )
            );

            // Accept if at least 80% of expected words are in user answer
            if (matchedWords.length >= expectedWords.length * 0.8) {
                return true;
            }
        }

        return false;
    }

    // Text to speech
    speak(text) {
        if (!('speechSynthesis' in window)) {
            alert('Text-to-speech not supported in your browser');
            return;
        }

        if (this.isSpeaking) {
            window.speechSynthesis.cancel();
            this.isSpeaking = false;
            this.render();
            return;
        }

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        utterance.lang = 'en-US';

        utterance.onstart = () => {
            this.isSpeaking = true;
            this.render();
        };

        utterance.onend = () => {
            this.isSpeaking = false;
            this.render();
        };

        utterance.onerror = () => {
            this.isSpeaking = false;
        };

        window.speechSynthesis.speak(utterance);
    }

    // View: Home
    renderHome() {
        return `
            <div id="homeView" class="view active">
                <div class="app-header">
                    <div class="app-icon">📚</div>
                    <h1 class="app-title">N-400 Civics Practice</h1>
                    <p class="app-subtitle">Good luck on your interview! 🇺🇸</p>
                </div>
                <div class="button-group">
                    <button class="btn-primary" onclick="app.startQuiz()">
                        ▶️ Start Practice
                    </button>
                    <button class="btn-secondary" onclick="app.showProgress()">
                        📊 My Progress
                    </button>
                </div>
            </div>
        `;
    }

    // View: Quiz
    renderQuiz() {
        if (!this.currentQuestion) {
            this.currentQuestion = this.getNextQuestion();
        }

        const progress = this.progress[this.currentQuestion.id];
        const speakerIcon = this.isSpeaking ? '⏹️' : '🔊';

        let answerHTML = '';
        if (!this.showingChoices) {
            const microphoneButtonHTML = this.speechRecognition ? `
                <button class="mic-button ${this.isListening ? 'listening' : ''}"
                        onclick="app.toggleVoiceInput()"
                        title="Click and speak your answer">
                    ${this.isListening ? '🎤 Listening...' : '🎤 Speak Answer'}
                </button>
            ` : '';

            const recognizedHTML = this.recognizedText ? `
                <div class="recognized-text">
                    <strong>I heard:</strong> "${this.recognizedText}"
                    <button class="confirm-button" onclick="app.confirmVoiceAnswer()">✓ Correct</button>
                    <button class="retake-button" onclick="app.retakeVoiceAnswer()">↻ Re-record</button>
                </div>
            ` : '';

            answerHTML = `
                <div class="input-group">
                    <input type="text" class="answer-input" id="answerInput"
                           placeholder="Type your answer..."
                           onkeypress="if(event.key==='Enter') app.submitAnswer()">
                    <div style="display: flex; gap: 8px;">
                        <button class="submit-button" style="flex: 1;" onclick="app.submitAnswer()">
                            Submit Answer
                        </button>
                        ${microphoneButtonHTML}
                    </div>
                    <button class="choices-toggle" onclick="app.toggleChoices()">
                        Show me 4 choices
                    </button>
                </div>
                ${recognizedHTML}
            `;
        } else {
            const choices = this.generateChoices(this.currentQuestion.answers[0]);
            answerHTML = `
                <div class="choices-container active">
                    ${choices.map(choice => `
                        <button class="choice-button ${this.selectedChoice === choice ? 'selected' : ''}"
                                onclick="app.selectChoice('${choice.replace(/'/g, "\\'")}')">
                            ${choice}
                        </button>
                    `).join('')}
                </div>
                ${this.selectedChoice ? `
                    <button class="submit-button" style="margin-top: 16px;" onclick="app.submitSelectedChoice()">
                        Submit Answer
                    </button>
                ` : ''}
            `;
        }

        return `
            <div id="quizView" class="view active">
                <div class="quiz-header">
                    <div class="quiz-meta">
                        <span>Question ${this.currentQuestion.id} of ${allQuestions.length}</span>
                        <span class="category-chip">${this.currentQuestion.category}</span>
                    </div>
                </div>
                <div class="quiz-content">
                    <div class="question-text">${this.escapeHtml(this.currentQuestion.text)}</div>

                    <button class="tts-button" onclick="app.speakQuestion()">
                        <span class="speaker-icon">${speakerIcon}</span>
                        ${this.isSpeaking ? 'Stop' : 'Read Question'}
                    </button>

                    <div class="answer-section">
                        ${answerHTML}
                    </div>
                </div>
            </div>
            <div id="feedbackOverlay" class="feedback-overlay"></div>
        `;
    }

    // View: Progress
    renderProgress() {
        const stats = this.getStats();
        const grouped = this.groupQuestionsByCategory();

        let categoriesHTML = '';
        for (const [category, questions] of Object.entries(grouped)) {
            const categoryHTML = questions.map(q => {
                const p = this.progress[q.id];
                const accuracy = p.asked === 0 ? 0 : p.correct / p.asked;
                const accuracyPercent = Math.round(accuracy * 100);
                let barClass = 'bar-gray';
                let accuracyClass = 'accuracy-never';

                if (p.asked === 0) {
                    barClass = 'bar-gray';
                    accuracyClass = 'accuracy-never';
                } else if (accuracy >= 0.7) {
                    barClass = 'bar-green';
                    accuracyClass = 'accuracy-70';
                } else if (accuracy >= 0.4) {
                    barClass = 'bar-orange';
                    accuracyClass = 'accuracy-40';
                } else {
                    barClass = 'bar-red';
                    accuracyClass = 'accuracy-0';
                }

                return `
                    <div class="question-row">
                        <div class="question-row-header">
                            <div class="question-row-text">
                                ${q.id}. ${this.escapeHtml(q.text)}
                            </div>
                            <div class="question-row-stats">
                                <div class="accuracy-percentage ${accuracyClass}">
                                    ${p.asked === 0 ? '—' : accuracyPercent + '%'}
                                </div>
                            </div>
                        </div>
                        ${p.asked > 0 ? `
                            <div class="question-row-meta">
                                ${p.correct}/${p.asked} correct
                            </div>
                            <div class="accuracy-bar">
                                <div class="accuracy-bar-fill ${barClass}" style="width: ${accuracy * 100}%"></div>
                            </div>
                        ` : ''}
                    </div>
                `;
            }).join('');

            categoriesHTML += `
                <div class="category-section">
                    <div class="category-title">${category}</div>
                    ${categoryHTML}
                </div>
            `;
        }

        return `
            <div id="progressView" class="view active">
                <div class="progress-header">
                    <button class="back-button" onclick="app.showHome()">← Back</button>
                </div>

                <div class="stats-summary">
                    <div class="stat-row">
                        <div class="stat-item">
                            <div class="stat-label">Questions Practiced</div>
                            <div class="stat-value">${stats.totalAsked}/${allQuestions.length}</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-label">Accuracy</div>
                            <div class="stat-value accuracy-${stats.totalAsked === 0 ? 'never' : stats.accuracy >= 0.7 ? '70' : stats.accuracy >= 0.4 ? '40' : '0'}">
                                ${Math.round(stats.accuracy * 100)}%
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    ${categoriesHTML}
                </div>
            </div>
        `;
    }

    // Group questions by category
    groupQuestionsByCategory() {
        const grouped = {};
        allQuestions.forEach(q => {
            if (!grouped[q.category]) {
                grouped[q.category] = [];
            }
            grouped[q.category].push(q);
        });

        // Sort categories and questions
        const sorted = {};
        Object.keys(grouped).sort().forEach(key => {
            sorted[key] = grouped[key].sort((a, b) => a.id - b.id);
        });

        return sorted;
    }

    // Get overall stats
    getStats() {
        let totalAsked = 0;
        let totalCorrect = 0;

        allQuestions.forEach(q => {
            const p = this.progress[q.id];
            totalAsked += p.asked;
            totalCorrect += p.correct;
        });

        const accuracy = totalAsked === 0 ? 0 : totalCorrect / totalAsked;
        return { totalAsked, totalCorrect, accuracy };
    }

    // Show feedback
    showFeedback(isCorrect, correctAnswer) {
        const feedbackClass = isCorrect ? 'feedback-correct' : 'feedback-incorrect';
        const icon = isCorrect ? '✅' : '❌';
        const title = isCorrect ? 'Correct!' : 'Incorrect';

        let feedbackHTML = `
            <div class="feedback-card ${feedbackClass}">
                <div class="feedback-icon">${icon}</div>
                <div class="feedback-title">${title}</div>
        `;

        if (!isCorrect) {
            feedbackHTML += `
                <div class="correct-answer-box">
                    <div class="correct-answer-label">Correct answer:</div>
                    <div class="correct-answer-text">${this.escapeHtml(correctAnswer)}</div>
                </div>
            `;
        }

        feedbackHTML += `
                <button class="feedback-button" onclick="app.nextQuestion()">
                    Next Question
                </button>
            </div>
        `;

        document.getElementById('feedbackOverlay').innerHTML = feedbackHTML;
        document.getElementById('feedbackOverlay').classList.add('active');
    }

    // Escape HTML for security
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Action: Start Quiz
    startQuiz() {
        this.currentView = 'quiz';
        this.currentQuestion = this.getNextQuestion();
        this.showingChoices = false;
        this.render();
        setTimeout(() => {
            this.speak(this.currentQuestion.text);
            document.getElementById('answerInput')?.focus();
        }, 200);
    }

    // Action: Show Progress
    showProgress() {
        this.currentView = 'progress';
        this.render();
    }

    // Action: Show Home
    showHome() {
        this.currentView = 'home';
        this.showingChoices = false;
        window.speechSynthesis.cancel();
        this.isSpeaking = false;
        this.render();
    }

    // Action: Speak Question
    speakQuestion() {
        this.speak(this.currentQuestion.text);
    }

    // Action: Toggle Choices View
    toggleChoices() {
        this.showingChoices = !this.showingChoices;
        this.render();
        if (this.showingChoices) {
            setTimeout(() => {
                document.querySelector('.choice-button')?.focus();
            }, 100);
        }
    }

    // Action: Toggle Voice Input
    toggleVoiceInput() {
        if (!this.speechRecognition) {
            alert('Voice input not supported in your browser. Please use Chrome, Firefox, Safari, or Edge.');
            return;
        }

        if (this.isListening) {
            this.speechRecognition.stop();
            this.isListening = false;
        } else {
            this.recognizedText = '';
            this.speechRecognition.start();
        }
        this.render();
    }

    // Action: Confirm Voice Answer
    confirmVoiceAnswer() {
        if (this.recognizedText) {
            document.getElementById('answerInput').value = this.recognizedText;
            this.recognizedText = '';
            this.submitAnswer();
        }
    }

    // Action: Retake Voice Answer
    retakeVoiceAnswer() {
        this.recognizedText = '';
        this.isListening = false;
        this.render();
        setTimeout(() => {
            this.toggleVoiceInput();
        }, 200);
    }

    // Action: Select Choice (mark as selected, don't submit yet)
    selectChoice(answer) {
        this.selectedChoice = answer;
        this.render();
    }

    // Action: Submit Selected Choice
    submitSelectedChoice() {
        const answer = this.selectedChoice;
        if (!answer) return;

        const isCorrect = this.isAnswerCorrect(answer, this.currentQuestion);

        // Update progress
        this.progress[this.currentQuestion.id].asked++;
        if (isCorrect) {
            this.progress[this.currentQuestion.id].correct++;
        }
        this.saveProgress();

        // Show feedback
        const correctAnswer = this.currentQuestion.answers.join(' or ');
        this.showFeedback(isCorrect, correctAnswer);
    }

    // Action: Submit Answer
    submitAnswer() {
        const input = document.getElementById('answerInput');
        if (!input) return;

        const userAnswer = input.value.trim();
        if (!userAnswer) return;

        const isCorrect = this.isAnswerCorrect(userAnswer, this.currentQuestion);

        // Update progress
        this.progress[this.currentQuestion.id].asked++;
        if (isCorrect) {
            this.progress[this.currentQuestion.id].correct++;
        }
        this.saveProgress();

        // Show feedback
        const correctAnswer = this.currentQuestion.answers.join(' or ');
        this.showFeedback(isCorrect, correctAnswer);
    }

    // Action: Next Question
    nextQuestion() {
        this.currentQuestion = this.getNextQuestion();
        this.showingChoices = false;
        this.selectedChoice = null;
        window.speechSynthesis.cancel();
        this.isSpeaking = false;

        this.render();

        setTimeout(() => {
            this.speak(this.currentQuestion.text);
            const input = document.getElementById('answerInput');
            if (input) {
                input.value = '';
                input.focus();
            }
        }, 200);
    }

    // Main render function
    render() {
        const app = document.getElementById('app');

        let html = '';
        if (this.currentView === 'home') {
            html = this.renderHome();
        } else if (this.currentView === 'quiz') {
            html = this.renderQuiz();
        } else if (this.currentView === 'progress') {
            html = this.renderProgress();
        }

        app.innerHTML = html;
    }
}

// Initialize app when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new N400App();
});
