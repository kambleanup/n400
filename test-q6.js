// Quick test for Q6 multiple choice generation
const fs = require('fs');

// Mock document for testing
global.document = {};

// Load questions data
eval(fs.readFileSync('./questions-data.js', 'utf8'));

// Load app code
const appCode = fs.readFileSync('./app.js', 'utf8')
    .replace('document.addEventListener', '// disabled');
eval(appCode);

// Create app instance
const app = new N400App();

// Manually set current question to Q6
const q6 = allQuestions.find(q => q.id === 6);
app.currentQuestion = q6;

console.log('\n🎯 Question 6 Test');
console.log(`Question: ${q6.text}`);
console.log(`Correct answers: ${q6.answers.join(', ')}`);

// Test with first correct answer
const choices = app.generateChoices(q6.answers[0]);
console.log(`\nGenerated multiple choice options:`);
choices.forEach((c, i) => {
    const isCorrect = q6.answers.includes(c) ? '✓ CORRECT' : '❌ wrong';
    console.log(`${i + 1}. ${c} ${isCorrect}`);
});

// Check if any wrong answer is absurd
const wrongChoices = choices.filter(c => !q6.answers.includes(c));
console.log(`\nWrong answers analysis:`);
wrongChoices.forEach(c => {
    const isSuitable = c.toLowerCase().includes('speech') || 
                      c.toLowerCase().includes('religion') ||
                      c.toLowerCase().includes('assembly') ||
                      c.toLowerCase().includes('press') ||
                      c.toLowerCase().includes('petition') ||
                      c.toLowerCase().includes('freedom');
    console.log(`"${c}" - ${isSuitable ? '✓ suitable' : '❌ unsuitable'}`);
});
