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
        this.currentChoices = null; // Store choices so they don't regenerate
        this.choicesGenerated = false; // Flag to track if choices have been generated
        this.recentQuestions = []; // Track last 5 questions to avoid repeats
        this.speechRecognition = this.initSpeechRecognition();

        this.initializeProgress();
        this.setupEventListeners();
        this.render();
    }

    // Initialize Web Speech API with Indian English support (Safari compatible)
    initSpeechRecognition() {
        // Support for different browsers
        const SpeechRecognition = window.SpeechRecognition ||
                                 window.webkitSpeechRecognition ||
                                 window.mozSpeechRecognition ||
                                 window.msSpeechRecognition;

        if (!SpeechRecognition) {
            console.warn('Speech Recognition not supported in this browser');
            return null;
        }

        try {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = true;
            // Try Indian English first, but en-US works better on iOS
            recognition.lang = 'en-US'; // Use en-US for better iOS compatibility
            recognition.maxAlternatives = 1;

            recognition.onstart = () => {
                this.isListening = true;
                this.recognizedText = '';
                this.render();
            };

            recognition.onresult = (event) => {
                let interimTranscript = '';
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript.trim();
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript + ' ';
                    } else {
                        interimTranscript += transcript;
                    }
                }

                if (finalTranscript.trim()) {
                    this.recognizedText = finalTranscript.trim();
                    console.log('Recognized:', this.recognizedText);
                }
                this.render();
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                if (event.error === 'no-speech') {
                    alert('No speech detected. Please try again and speak clearly.');
                } else if (event.error === 'network') {
                    alert('Network error. Please try again.');
                }
                this.isListening = false;
                this.recognizedText = '';
                this.render();
            };

            recognition.onend = () => {
                this.isListening = false;
                this.render();
            };

            return recognition;
        } catch (error) {
            console.error('Error initializing speech recognition:', error);
            return null;
        }
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

    // Get next question with weighted selection + avoid repeats + category balancing
    getNextQuestion() {
        // Group questions by category
        const categories = {};
        allQuestions.forEach(q => {
            if (!categories[q.category]) {
                categories[q.category] = [];
            }
            categories[q.category].push(q);
        });

        // Find category with fewest recent questions (ensure all categories get practiced)
        const categoryRecency = {};
        Object.keys(categories).forEach(cat => {
            categoryRecency[cat] = categories[cat].filter(q =>
                this.recentQuestions.includes(q.id)
            ).length;
        });

        // Sort categories by how many recent questions they have (ascending)
        // Pick from the category with fewest recent questions
        const sortedCategories = Object.keys(categoryRecency).sort((a, b) =>
            categoryRecency[a] - categoryRecency[b]
        );

        // Try to find a question from the least-recently-used category
        for (const category of sortedCategories) {
            const candidateQuestions = categories[category].filter(q =>
                !this.recentQuestions.includes(q.id)
            );

            if (candidateQuestions.length > 0) {
                // Apply weighted selection within this category
                const weights = candidateQuestions.map(q => {
                    const p = this.progress[q.id];
                    if (p.asked === 0) return 3; // Never asked: 3x weight
                    const accuracy = p.correct / p.asked;
                    if (accuracy < 0.5) return 2; // <50% accuracy: 2x weight
                    return 1; // >= 50% accuracy: 1x weight
                });

                const totalWeight = weights.reduce((a, b) => a + b, 0);
                let random = Math.random() * totalWeight;

                for (let i = 0; i < candidateQuestions.length; i++) {
                    random -= weights[i];
                    if (random <= 0) {
                        const selectedQuestion = candidateQuestions[i];

                        // Add to recent questions list
                        this.recentQuestions.push(selectedQuestion.id);
                        // Keep only last 10 questions
                        if (this.recentQuestions.length > 10) {
                            this.recentQuestions.shift();
                        }

                        console.log('DEBUG: Selected Q' + selectedQuestion.id + ' (' + category + '), Recent: ' + this.recentQuestions.join(','));
                        return selectedQuestion;
                    }
                }
            }
        }

        // Fallback (shouldn't reach here): clear recent history and try again
        this.recentQuestions = [];
        return this.getNextQuestion();
    }

    // Classify answer type for better choice selection (more granular)
    classifyAnswerType(answer) {
        const a = answer.toLowerCase().trim();

        // Numbers (including number words)
        if (/^\d+$/.test(a) || /^(zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|hundred|thousand)$/i.test(a)) {
            return 'number';
        }

        // Time durations (years, terms, etc)
        if (/\b(year|years|month|months|week|weeks|day|days|hour|hours|minute|minutes|term|terms)\b/i.test(a)) {
            return 'duration';
        }

        // Rivers and water features
        if (/\b(river|river|ocean|lake|sea|beach|gulf|strait|canal)\b/i.test(a)) {
            return 'water';
        }

        // US States and territories
        if (/\b(state|territory|district|county|region)\b/i.test(a) ||
            /^(texas|california|florida|new york|pennsylvania|ohio|georgia|north carolina|michigan|new jersey|virginia|washington|massachusetts|arizona|tennessee|missouri|maryland|wisconsin|colorado|minnesota|south carolina|alabama|louisiana|kentucky|oregon|oklahoma|connecticut|utah|iowa|nevada|arkansas|mississippi|kansas|new mexico|nebraska|idaho|hawaii|new hampshire|maine|montana|rhode island|delaware|south dakota|north dakota|alaska|vermont|wyoming)$/i.test(answer)) {
            return 'state';
        }

        // Cities and capitals (single or double capitalized words)
        if (/^[A-Z][a-z]+(\s[A-Z][a-z]+)?$/.test(answer) && !/\b(amendment|congress|court|bill|law|act|declaration|constitution|republic|union|nation|government|senate|house|branch)\b/i.test(a)) {
            // Check if it looks like a city (proper noun format, not a government term)
            return 'city';
        }

        // Government actions/functions (what something does)
        if (/\b(reviews|makes|defines|protects|resolves|explains|signs|vetoes|appoints|advises|enforces|enacts)\b/i.test(a) ||
            /\b(laws|rights|government|powers|treaties|bills|decisions|disputes)\b/i.test(a)) {
            return 'function';
        }

        // Government/Documents (bill, law, amendment, constitution, etc)
        if (/\b(bill|act|law|amendment|constitution|declaration|charter|treaty|document|proclamation|congress|court|branch|senate|house|republic|union)\b/i.test(a)) {
            return 'document';
        }

        // Government roles/titles
        if (/\b(president|senator|representative|judge|justice|governor|mayor|ambassador|general|secretary|attorney|speaker|chief)\b/i.test(a)) {
            return 'title';
        }

        // Native American tribes
        if (/\b(apache|cherokee|navajo|sioux|lakota|crow|choctaw|seminole|mohegan|oneida|huron|shawnee|blackfeet|arawak|chippewa)\b/i.test(a)) {
            return 'tribe';
        }

        // Default
        return 'concept';
    }

    // Generate 4 choice options with smarter selection
    seededRandom(seed) {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }

    generateChoices(correctAnswer) {
        const questionId = this.currentQuestion.id;
        const currentCat = this.currentQuestion.category;
        const seed = questionId * 12345;
        const correctType = this.classifyAnswerType(correctAnswer);
        const questionText = this.currentQuestion.text.toLowerCase();

        // Get curated wrong answers if available for this specific question
        const curatedWrongs = this.getCuratedWrongAnswersForQuestion(questionId, correctAnswer);
        if (curatedWrongs && curatedWrongs.length >= 3) {
            const selectedWrongAnswers = curatedWrongs.slice(0, 3);
            const choices = [correctAnswer, ...selectedWrongAnswers];
            choices.sort((a, b) => {
                const randA = this.seededRandom(seed + a.charCodeAt(0));
                const randB = this.seededRandom(seed + b.charCodeAt(0));
                return randA - randB;
            });
            return choices;
        }

        // Smart multi-tier selection with better filtering
        let wrongAnswers = [];

        // Filter for answers that make semantic sense for this question
        const isSuitableAnswer = (answer) => {
            const ans = answer.toLowerCase().trim();

            // For "right or freedom" questions, only select other rights/freedoms
            if (questionText.includes('right') || questionText.includes('freedom')) {
                const rightsFreedoms = ['speech', 'religion', 'assembly', 'press', 'petition', 'petition the government',
                    'freedom', 'right', 'liberty', 'bear arms', 'vote', 'voting', 'privacy', 'due process'];
                return rightsFreedoms.some(w => ans.includes(w));
            }

            // For questions about numbers/counts, exclude obviously wrong categories
            if (questionText.includes('how many') || questionText.includes('how much')) {
                return /\b\d+\b|zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|hundred|thousand|million/i.test(answer);
            }

            // For "What is the X branch" questions, only government entities
            if (questionText.includes('branch of government') || questionText.includes('branch of the government')) {
                const branches = ['supreme court', 'senate', 'house of representatives', 'congress', 'executive', 'judicial', 'legislative'];
                return branches.some(w => ans.toLowerCase().includes(w));
            }

            // For "What does the X branch do" questions, only actions/functions
            if ((questionText.includes('does the') || questionText.includes('does the')) &&
                (questionText.includes('branch') || questionText.includes('do'))) {
                const badWords = ['amendment', 'constitution', 'declaration', 'bill of rights', 'year', 'years'];
                return !badWords.some(w => ans.toLowerCase().includes(w));
            }

            // For questions about presidents, people, etc.
            if (questionText.includes('president') || questionText.includes('senator') || questionText.includes('representative')) {
                // Exclude document names and abstract concepts
                const badWords = ['constitution', 'amendment', 'declaration', 'bill', 'congress', 'republic', 'union', 'years', 'year'];
                return !badWords.some(w => ans.includes(w));
            }

            // For geography questions, avoid non-geographic answers
            if (questionText.includes('capital') || questionText.includes('state') || questionText.includes('city') ||
                questionText.includes('river') || questionText.includes('ocean') || questionText.includes('border')) {
                const badWords = ['amendment', 'law', 'act', 'president', 'senator', 'year', 'years'];
                return !badWords.some(w => ans.includes(w));
            }

            // For history questions, avoid document names as answers
            if (questionText.includes('war') || questionText.includes('fought') || questionText.includes('declared')) {
                const badWords = ['constitution', 'amendment', 'declaration of independence', 'bill of rights', 'year', 'years'];
                return !badWords.some(w => ans.includes(w));
            }

            // Default: exclude obviously wrong categories
            const alwaysBad = ['constitution', 'amendment'];
            return !alwaysBad.some(w => ans.includes(w));
        };

        // Tier 1: Exact type match from same category
        const tier1 = allQuestions
            .filter(q => q.category === currentCat && q.id !== questionId)
            .flatMap(q => q.answers)
            .filter(a => a.toLowerCase().trim() !== correctAnswer.toLowerCase().trim())
            .filter(a => this.classifyAnswerType(a) === correctType)
            .filter(a => isSuitableAnswer(a));

        if (tier1.length >= 3) {
            wrongAnswers = tier1;
        } else {
            // Tier 2: Related types from same category
            const relatedTypes = this.getRelatedTypes(correctType);
            const tier2 = allQuestions
                .filter(q => q.category === currentCat && q.id !== questionId)
                .flatMap(q => q.answers)
                .filter(a => a.toLowerCase().trim() !== correctAnswer.toLowerCase().trim())
                .filter(a => relatedTypes.includes(this.classifyAnswerType(a)))
                .filter(a => isSuitableAnswer(a));

            wrongAnswers = [...tier1, ...tier2];

            if (wrongAnswers.length < 3) {
                // Tier 3: Exact type match from other categories
                const tier3 = allQuestions
                    .filter(q => q.category !== currentCat)
                    .flatMap(q => q.answers)
                    .filter(a => a.toLowerCase().trim() !== correctAnswer.toLowerCase().trim())
                    .filter(a => this.classifyAnswerType(a) === correctType)
                    .filter(a => isSuitableAnswer(a));

                wrongAnswers = [...wrongAnswers, ...tier3];
            }

            if (wrongAnswers.length < 3) {
                // Tier 4: Any plausible answers (with semantic filtering)
                const tier4 = allQuestions
                    .flatMap(q => q.answers)
                    .filter(a => a.toLowerCase().trim() !== correctAnswer.toLowerCase().trim())
                    .filter(a => !wrongAnswers.includes(a))
                    .filter(a => isSuitableAnswer(a));

                wrongAnswers = [...wrongAnswers, ...tier4];
            }
        }

        // Remove duplicates and short answers
        wrongAnswers = [...new Set(wrongAnswers)];
        wrongAnswers = wrongAnswers.filter(a => a.length > 2);

        // Deterministic sort using seeded random
        wrongAnswers.sort((a, b) => {
            const randA = this.seededRandom(seed + a.charCodeAt(0));
            const randB = this.seededRandom(seed + b.charCodeAt(0));
            return randA - randB;
        });

        const selectedWrongAnswers = wrongAnswers.slice(0, 3);

        const choices = [correctAnswer, ...selectedWrongAnswers];

        // Deterministic final shuffle
        choices.sort((a, b) => {
            const randA = this.seededRandom(seed + a.charCodeAt(0));
            const randB = this.seededRandom(seed + b.charCodeAt(0));
            return randA - randB;
        });

        return choices;
    }

    // Get related types for better fallback (city and state are both geography, etc)
    getRelatedTypes(answerType) {
        const typeGroups = {
            'city': ['state', 'water', 'city'],
            'state': ['city', 'state', 'water'],
            'water': ['state', 'city', 'water'],
            'number': ['duration', 'number'],
            'duration': ['number', 'duration'],
            'title': ['document', 'title', 'function'],
            'document': ['title', 'document'],
            'function': ['title', 'function'],
            'tribe': ['city', 'state'],
            'name': ['title', 'name'],
        };

        return typeGroups[answerType] || [answerType];
    }

    // COMPREHENSIVE TYPE-MATCHED CURATIONS for all 105 questions
    // RULE: Wrong answers must be same TYPE as correct answer
    // CRITICAL: Filter out any answer that is also acceptable for this question
    getCuratedWrongAnswersForQuestion(questionId, correctAnswer) {
        const question = allQuestions.find(q => q.id === questionId);
        const acceptableAnswers = question ? question.answers.map(a => a.toLowerCase().trim()) : [];

        const curations = {
            // Q1-5: Documents and foundational concepts
            1: ['the Declaration of Independence', 'the Bill of Rights', 'the Articles of Confederation'],
            2: ['lists all federal laws', 'outlines the court system', 'establishes the presidency'],
            3: ['In God We Trust', 'E Pluribus Unum', 'Out of Many, One'],
            4: ['a law from Congress', 'a presidential executive order', 'a Supreme Court ruling'],
            5: ['the Constitution', 'the Magna Carta', 'the Mayflower Compact'],

            // Q6-12: Rights, freedoms, and concepts
            6: ['freedom of speech', 'freedom of association', 'right to petition'],
            7: ['26', '28', '30'],
            8: ['proclaimed our freedom', 'established our independence', 'asserted our liberty'],
            9: ['equality', 'justice', 'security'], // Different concepts (not Declaration rights)
            10: ['You must practice a religion', 'Government provides religion', 'Religion is mandatory'],
            11: ['communist economy', 'socialist economy', 'command economy'],
            12: ['No one is above the law', 'Some leaders are exempt', 'The President makes the rules'],

            // Q13-17: Government branches and structure
            13: ['the Senate', 'the House of Representatives', 'the Supreme Court'],
            14: ['checks and balances', 'separation of powers', 'judicial review'],
            15: ['the Vice President', 'the Secretary of State', 'the Speaker of the House'],
            16: ['the Senate', 'the House of Representatives', 'the Supreme Court'],
            17: ['the Senate and House', 'Congress as a whole', 'the legislature'],

            // Q18-27: Numbers, times, and counts
            18: ['99', '101', '98'],
            19: ['four', 'eight', 'two'],
            20: ['Ted Cruz', 'Dianne Feinstein', 'Chuck Schumer'], // Texas senator + other state senators
            21: ['434', '436', '400'],
            22: ['four', 'six', 'four'],
            23: ['John Carter', 'Alexandria Ocasio-Cortez', 'Adam Schiff'], // Texas rep + other state reps
            24: ['all voters in their state', 'all people of their district', 'all registered voters'],
            25: ['state history', 'geographic size', 'economic importance'],
            26: ['six', 'eight', 'two'],
            27: ['December', 'October', 'January'],

            // Q28-40: Government officials and positions
            28: ['Barack Obama', 'George W. Bush', 'Bill Clinton'],
            29: ['Mike Pence', 'Tim Walz', 'Kamala Harris'],
            30: ['the Senate President', 'the President Pro Tempore', 'Congress itself'],
            31: ['the Senate President', 'the President Pro Tempore', 'the Chief Justice'],
            32: ['the Secretary of Defense', 'the Attorney General', 'the Vice President'],
            33: ['the Vice President', 'Congress', 'the Supreme Court'],
            34: ['the Vice President', 'Congress', 'the Senate'],
            35: ['makes the laws', 'enforces the laws', 'interprets the laws'],
            36: ['Secretary of the Interior', 'Secretary of State', 'Attorney General'],
            37: ['makes federal laws', 'enforces the laws', 'collects taxes'],
            38: ['the Federal Appeals Court', 'the Court of Appeals', 'the District Court'],
            39: ['eight', '11', '10'],
            40: ['Clarence Thomas', 'Samuel Alito', 'Elena Kagan'],

            // Q41-47: Powers and political parties
            41: ['to create an army', 'to make treaties', 'to declare war'],
            42: ['provide education', 'issue licenses', 'protect citizens'],
            43: ['Rick Perry', 'Ron DeSantis', 'Gavin Newsom'], // Former TX governor + other state governors
            44: ['Houston', 'Denver', 'Sacramento'], // Texas largest city (not capital) + other state capitals
            45: ['Green and Libertarian', 'Independent and Socialist', 'Federalist and Whig'],
            46: ['Green', 'Libertarian', 'Socialist'],
            47: ['Paul Ryan', 'John Boehner', 'Newt Gingrich'],

            // Q48-57: Rights, responsibilities, voting
            48: ['You don\'t have to pay a poll tax', 'Any citizen can vote', 'A male citizen can vote'],
            49: ['vote in federal elections', 'run for federal office', 'hold elected office'],
            50: ['run for federal office', 'vote in elections', 'serve on a jury'],
            51: ['freedom of assembly', 'freedom of petition', 'freedom of the press'],
            52: ['the flag', 'the Constitution', 'our country'],
            53: ['obey the laws', 'defend the Constitution', 'support the President'],
            54: ['sixteen', '21', '25'],
            55: ['vote', 'join a political party', 'volunteer for campaigns'],
            56: ['May 15', 'March 15', 'June 15'],
            57: ['before age 18', 'at age 21', 'at age 25'],

            // Q58-70: Colonial period and founding fathers
            58: ['religious freedom', 'economic opportunity', 'political liberty'],
            59: ['Native Americans', 'Africans', 'Europeans'],
            60: ['people from Africa', 'Native Americans', 'Europeans'],
            61: ['because of high taxes', 'because they lacked representation', 'because of British soldiers'],
            62: ['Benjamin Franklin', 'John Adams', 'James Madison'],
            63: ['July 4, 1775', 'July 4, 1787', 'January 1, 1776'],
            64: ['Massachusetts, Connecticut, New Hampshire', 'New York, Pennsylvania, New Jersey', 'Maryland, Delaware, Virginia'],
            65: ['the Bill of Rights was written', 'the Declaration was adopted', 'the Articles were signed'],
            66: ['1776', '1789', '1791'],
            67: ['Alexander Hamilton', 'James Madison', 'George Washington'],
            68: ['diplomat', 'inventor', 'Founding Father'],
            69: ['Benjamin Franklin', 'Thomas Jefferson', 'John Adams'],
            70: ['George Washington', 'James Madison', 'Benjamin Franklin'],

            // Q71-82: Wars and conflicts
            71: ['Florida Territory', 'Oregon Territory', 'Alaska Territory'],
            72: ['War of 1812', 'Mexican-American War', 'Spanish-American War'],
            73: ['the War of 1812', 'the Revolutionary War', 'the Mexican-American War'],
            74: ['states\' rights', 'economic competition', 'westward expansion'],
            75: ['preserved the Union', 'defeated the Confederacy', 'abolished slavery'],
            76: ['freed all slaves immediately', 'freed slaves in Border States', 'freed slaves in Northern states'],
            77: ['fought for civil rights', 'advocated for education', 'led a social movement'],
            78: ['World War II', 'the Korean War', 'the Vietnam War'],
            79: ['Theodore Roosevelt', 'William McKinley', 'Woodrow Wilson'],
            80: ['Herbert Hoover', 'Dwight Eisenhower', 'Harry Truman'],
            81: ['Japan and Italy', 'Germany and Japan', 'Germany and Italy'],
            82: ['World War I', 'the Korean War', 'the Vietnam War'],

            // Q83-87: Modern history and movements
            83: ['Communism', 'Socialism', 'Totalitarianism'],
            84: ['Women\'s suffrage', 'Civil rights', 'Labor rights'],
            85: ['led the civil rights movement', 'fought for equality', 'advocated for justice'],
            86: ['attacked the Pentagon', 'destroyed the World Trade Center', 'hijacked planes'],
            87: ['Navajo', 'Cherokee', 'Sioux'],

            // Q88-100: Geography and symbols
            88: ['Missouri River', 'Mississippi River', 'Colorado River'],
            89: ['Atlantic Ocean', 'Arctic Ocean', 'Indian Ocean'],
            90: ['Atlantic Ocean', 'Arctic Ocean', 'Southern Ocean'],
            91: ['U.S. Virgin Islands', 'Puerto Rico', 'Guam'],
            92: ['Montana', 'Washington', 'Minnesota'],
            93: ['Arizona', 'New Mexico', 'California'],
            94: ['New York', 'Philadelphia', 'Boston'],
            95: ['Ellis Island', 'Governor\'s Island', 'Bedloe\'s Island'],
            96: ['because there are 50 states', 'because of 13 presidents', 'because there were 13 colonies'],
            97: ['because there are 50 states', 'because there were 50 territories', 'for the 50 presidents'],
            98: ['Yankee Doodle', 'America the Beautiful', 'God Bless America'],
            99: ['June 4', 'August 4', 'September 4'],
            100: ['Thanksgiving', 'Christmas', 'New Year\'s Day'],

            // Q101-105: Texas specific
            101: ['Greg Abbott', 'Dan Patrick', 'John Carter'], // TX Gov + Lt. Gov + Representative (NOT senators)
            102: ['Kay Granger', 'Lloyd Doggett', 'Marc Veasey'],
            103: ['Houston', 'Dallas', 'San Antonio'],
            104: ['1836', '1861', '1876'],
            105: ['Brazos River', 'Colorado River', 'Trinity River'],
        };

        let result = curations[questionId] || null;

        // CRITICAL FIX: Filter out any curated answer that's also an acceptable answer
        // This prevents duplicates in multiple choice
        if (result && Array.isArray(result)) {
            result = result.filter(curatedAnswer => {
                const curatedLower = curatedAnswer.toLowerCase().trim();
                return !acceptableAnswers.includes(curatedLower);
            });
        }

        return result || null;
    }

    // Legacy method for compatibility (now disabled)
    getCuratedWrongAnswers(questionId, correctAnswer) {
        return null; // Disabled - use getCuratedWrongAnswersForQuestion instead
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

        // Articles and common words to ignore in matching
        const ignoreWords = ['the', 'a', 'an', 'and', 'or', 'is', 'of', 'in', 'by'];

        // Split into words, filter out articles/common words
        const userWords = userText.split(/\s+/).filter(w => w && !ignoreWords.includes(w));
        const expectedWords = expectedText.split(/\s+/).filter(w => w && !ignoreWords.includes(w));

        // Exact match after filtering common words
        if (userWords.join(' ') === expectedWords.join(' ')) {
            return true;
        }

        // Check if all content words from expected are in user answer (more lenient)
        if (expectedWords.length > 0 && userWords.length > 0) {
            const matchedWords = expectedWords.filter(word =>
                userWords.some(userWord =>
                    userWord.includes(word) || word.includes(userWord)
                )
            );

            // Accept if user provided all key content words (ignoring articles)
            // Or accept if user provided at least 70% of key content words
            const exactKeyMatch = matchedWords.length === expectedWords.length;
            const partialMatch = matchedWords.length >= expectedWords.length * 0.7;

            if (exactKeyMatch || partialMatch) {
                console.log('DEBUG fuzzyMatch: "' + userText + '" matches "' + expectedText + '"');
                return true;
            }
        }

        // Allow single word matches for specific answers
        if (userWords.length === 1 && expectedWords.length >= 1) {
            const userWord = userWords[0];
            const exactWordMatch = expectedWords.some(w => w === userWord);
            if (exactWordMatch) {
                console.log('DEBUG fuzzyMatch: "' + userText + '" single-word matches "' + expectedText + '"');
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
            // Use stored choices (don't regenerate - keeps them stable)
            const choices = this.currentChoices || [];

            // DEBUG: Log what's happening with selectedChoice
            if (choices.length > 0) {
                console.log('DEBUG renderQuiz: selectedChoice =', this.selectedChoice);
                console.log('DEBUG renderQuiz: choices =', choices);
            }

            answerHTML = `
                <div class="choices-container active">
                    ${choices.map((choice, index) => {
                        const isSelected = this.selectedChoice &&
                                         this.selectedChoice.toLowerCase().trim() === choice.toLowerCase().trim();
                        if (isSelected) {
                            console.log('DEBUG: Button ' + index + ' marked as selected:', choice);
                        }
                        return `<button class="choice-button ${isSelected ? 'selected' : ''}"
                                data-choice-index="${index}"
                                type="button">
                            ${this.escapeHtml(choice)}
                        </button>`;
                    }).join('')}
                </div>
                <button class="submit-button" style="margin-top: 16px;" onclick="app.submitSelectedChoice()">
                    Submit Answer
                </button>
            `;

            // Attach choice listeners after rendering - use longer delay for iOS
            setTimeout(() => {
                this.attachChoiceListeners();
            }, 100);
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
        // Reset all state for fresh start
        this.currentView = 'quiz';
        this.currentQuestion = null; // Will be set in renderQuiz
        this.showingChoices = false;
        this.selectedChoice = null;
        this.currentChoices = null;
        this.choicesGenerated = false;
        this.recognizedText = '';
        this.isListening = false;
        window.speechSynthesis.cancel();
        this.isSpeaking = false;

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
        if (!this.showingChoices) {
            // FIRST TIME: generate choices (only once per question)
            this.selectedChoice = null;
            this.currentChoices = this.generateChoices(this.currentQuestion.answers[0]);
            this.choicesGenerated = true;
        }
        this.showingChoices = !this.showingChoices;

        // CRITICAL: Always clear selectedChoice when showing choices to prevent pre-selection
        if (this.showingChoices) {
            this.selectedChoice = null;
        }

        this.render();

        // Attach event listeners AFTER render completes - longer delay for iOS reliability
        if (this.showingChoices) {
            setTimeout(() => {
                this.attachChoiceListeners();
                // Remove any 'selected' class that may have been applied
                document.querySelectorAll('.choice-button.selected').forEach(btn => {
                    btn.classList.remove('selected');
                });
                // Don't auto-focus first button - prevents iOS showing default selection
            }, 150);
        }
    }

    // Attach event listeners to choice buttons
    attachChoiceListeners() {
        const buttons = document.querySelectorAll('.choice-button');
        console.log('DEBUG: attachChoiceListeners found ' + buttons.length + ' buttons');

        buttons.forEach(button => {
            // Remove any existing listeners by cloning (clean slate)
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);

            // Add fresh listener
            newButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const index = parseInt(newButton.dataset.choiceIndex, 10);
                console.log('DEBUG: Choice clicked, index=' + index);
                if (this.currentChoices && this.currentChoices[index]) {
                    const choice = this.currentChoices[index];
                    console.log('DEBUG: Selecting choice: ' + choice);
                    this.selectChoice(choice);
                } else {
                    console.log('DEBUG: ERROR - currentChoices or index invalid');
                }
            });
        });
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

    // Action: Select Choice (mark as selected, don't submit yet) - can unselect by clicking again
    selectChoice(answer) {
        if (!answer) return;

        // If clicking the same choice again, unselect it
        if (this.selectedChoice && this.selectedChoice.toLowerCase().trim() === answer.toLowerCase().trim()) {
            this.selectedChoice = null;
            this.render(); // Full re-render to show/hide submit button and update styles
            setTimeout(() => {
                this.attachChoiceListeners();
            }, 50);
            return;
        }

        this.selectedChoice = answer;
        this.render(); // Full re-render to show/hide submit button and update styles
        setTimeout(() => {
            this.attachChoiceListeners();
        }, 50);
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
        // Close feedback overlay
        const overlay = document.getElementById('feedbackOverlay');
        if (overlay) {
            overlay.classList.remove('active');
        }

        this.currentQuestion = this.getNextQuestion();
        this.showingChoices = false;
        this.selectedChoice = null;
        this.currentChoices = null; // Reset choices for new question
        this.choicesGenerated = false; // Reset flag so new choices are generated
        this.recognizedText = ''; // Reset voice input
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
