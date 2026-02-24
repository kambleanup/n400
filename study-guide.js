// N-400 Civics Study Guide - Scoped Questions for 65+ Residents
// These are the 20 questions marked with an asterisk (*) that residents 65+ with 20+ years
// as permanent residents may study exclusively

const scopedQuestions = [
    {
        id: 6,
        question: "What is one right or freedom from the First Amendment?",
        category: "American Government",
        answers: [
            "speech",
            "religion",
            "assembly",
            "press",
            "petition the government"
        ]
    },
    {
        id: 11,
        question: "What is the economic system in the United States?",
        category: "American Government",
        answers: [
            "capitalist economy",
            "market economy"
        ]
    },
    {
        id: 13,
        question: "Name one branch or part of the government.",
        category: "American Government",
        answers: [
            "Congress",
            "legislative",
            "President",
            "executive",
            "the courts",
            "judicial"
        ]
    },
    {
        id: 17,
        question: "What are the two parts of the U.S. Congress?",
        category: "American Government",
        answers: [
            "the Senate and House of Representatives"
        ]
    },
    {
        id: 20,
        question: "Who is one of your state's U.S. Senators now?",
        category: "American Government",
        note: "Answers will vary based on your state",
        answers: [
            "Answers vary by state - consult uscis.gov/citizenship/testupdates"
        ]
    },
    {
        id: 27,
        question: "In what month do we vote for President?",
        category: "American Government",
        answers: [
            "November"
        ]
    },
    {
        id: 28,
        question: "What is the name of the President of the United States now?",
        category: "American Government",
        note: "Answer changes based on current presidency",
        answers: [
            "Consult uscis.gov/citizenship/testupdates for current answer"
        ]
    },
    {
        id: 44,
        question: "What is the capital of your state?",
        category: "American Government",
        note: "Answers vary by state",
        answers: [
            "Answers vary by state - consult uscis.gov/citizenship/testupdates"
        ]
    },
    {
        id: 45,
        question: "What are the two major political parties in the United States?",
        category: "American Government",
        answers: [
            "Democratic and Republican"
        ]
    },
    {
        id: 49,
        question: "What is one responsibility that is only for United States citizens?",
        category: "Rights and Responsibilities",
        answers: [
            "serve on a jury",
            "vote in a federal election"
        ]
    },
    {
        id: 54,
        question: "How old do citizens have to be to vote for President?",
        category: "Rights and Responsibilities",
        answers: [
            "eighteen (18) and older",
            "18 and older"
        ]
    },
    {
        id: 56,
        question: "When is the last day you can send in federal income tax forms?",
        category: "Rights and Responsibilities",
        answers: [
            "April 15"
        ]
    },
    {
        id: 70,
        question: "Who was the first President?",
        category: "American History",
        answers: [
            "(George) Washington",
            "George Washington"
        ]
    },
    {
        id: 75,
        question: "What was one important thing that Abraham Lincoln did?",
        category: "American History",
        answers: [
            "freed the slaves (Emancipation Proclamation)",
            "freed the slaves",
            "saved (or preserved) the Union",
            "led the United States during the Civil War"
        ]
    },
    {
        id: 78,
        question: "Name one war fought by the United States in the 1900s.",
        category: "American History",
        answers: [
            "World War I",
            "World War II",
            "Korean War",
            "Vietnam War",
            "(Persian) Gulf War"
        ]
    },
    {
        id: 85,
        question: "What did Martin Luther King, Jr. do?",
        category: "American History",
        answers: [
            "fought for civil rights",
            "worked for equality for all Americans"
        ]
    },
    {
        id: 94,
        question: "What is the capital of the United States?",
        category: "Integrated Civics",
        answers: [
            "Washington, D.C."
        ]
    },
    {
        id: 95,
        question: "Where is the Statue of Liberty?",
        category: "Integrated Civics",
        answers: [
            "New York (Harbor)",
            "Liberty Island",
            "New Jersey",
            "near New York City",
            "on the Hudson (River)"
        ]
    },
    {
        id: 97,
        question: "Why does the flag have 50 stars?",
        category: "Integrated Civics",
        answers: [
            "because there is one star for each state",
            "because each star represents a state",
            "because there are 50 states"
        ]
    },
    {
        id: 99,
        question: "When do we celebrate Independence Day?",
        category: "Integrated Civics",
        answers: [
            "July 4"
        ]
    }
];

// Helper function to get a specific scoped question
function getScopedQuestion(id) {
    return scopedQuestions.find(q => q.id === id);
}

// Helper function to get all scoped questions by category
function getScopedQuestionsByCategory(category) {
    return scopedQuestions.filter(q => q.category === category);
}
