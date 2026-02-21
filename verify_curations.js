const fs = require('fs');

// Load questions
eval(fs.readFileSync('./questions-data.js', 'utf8'));

// Load curations from app.js
const appCode = fs.readFileSync('./app.js', 'utf8');
const curationsMatch = appCode.match(/const curations = \{([\s\S]*?)\};/);
if (!curationsMatch) {
  console.log('Could not extract curations');
  process.exit(1);
}

const curations = {};
const lines = curationsMatch[1].split('\n');
for (const line of lines) {
  const match = line.match(/(\d+):\s*\[(.*?)\]/);
  if (match) {
    const id = parseInt(match[1]);
    const answers = match[2].split(',').map(a => a.trim().replace(/'/g, ''));
    curations[id] = answers;
  }
}

let errors = [];

// Check each question
for (const q of allQuestions) {
  if (!curations[q.id]) continue; // Skip if no curation
  
  const correct = q.answers[0].toLowerCase().replace(/[()]/g, '').trim();
  const wrongAnswers = curations[q.id];
  
  for (let i = 0; i < wrongAnswers.length; i++) {
    const wrong = wrongAnswers[i].toLowerCase().replace(/[()]/g, '').trim();
    
    // Check if correct answer appears in wrong answers
    if (wrong === correct) {
      errors.push(`Q${q.id}: DUPLICATE - Correct answer "${q.answers[0]}" appears in wrong answers`);
    }
    
    // Check for duplicates in wrong answers
    for (let j = i + 1; j < wrongAnswers.length; j++) {
      const wrong2 = wrongAnswers[j].toLowerCase().replace(/[()]/g, '').trim();
      if (wrong === wrong2) {
        errors.push(`Q${q.id}: DUPLICATE WRONG ANSWER - "${wrongAnswers[i]}" appears twice`);
      }
    }
  }
}

if (errors.length === 0) {
  console.log('✓ All 105 questions verified - no duplicates found');
} else {
  console.log(`\n❌ Found ${errors.length} errors:\n`);
  errors.forEach(e => console.log(e));
}
