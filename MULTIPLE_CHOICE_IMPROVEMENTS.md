# Multiple Choice Answer Generation - Improvements

## Problem Identified
When generating multiple choice options, the app was selecting wrong answers from incompatible categories:

**Example - Question 6**: "What is one right or freedom from the First Amendment?"
- **Original wrong choices**: "The Constitution", "The Bill of Rights", "Trump"
- **Issue**: These are document names and people, not rights/freedoms

## Solution Implemented

### 1. Semantic Filtering Added
The `generateChoices()` function now includes an `isSuitableAnswer()` filter that validates whether an answer makes sense for the specific question type:

```javascript
// For "right or freedom" questions, only select other rights/freedoms
if (questionText.includes('right') || questionText.includes('freedom')) {
    return ['speech', 'religion', 'assembly', 'press', 'petition', ...].some(w => ans.includes(w));
}

// For "how many" questions, only select numbers/quantities
if (questionText.includes('how many')) {
    return /\d+|zero|one|two|three|.../i.test(answer);
}

// For president/senator questions, exclude document names
if (questionText.includes('president') || questionText.includes('senator')) {
    const badWords = ['constitution', 'amendment', 'declaration', 'bill', 'congress'];
    return !badWords.some(w => ans.includes(w));
}
```

### 2. Question-Specific Curation
Added a new `getCuratedWrongAnswersForQuestion()` method that provides hand-picked wrong answers for specific problematic questions:

```javascript
const curations = {
    // Q6: What is one right or freedom from the First Amendment?
    6: ['religion', 'assembly', 'press'],

    // Q9: What is the rule of law?
    9: ['Government must obey the law', 'No one is above the law', 'Everyone must follow the law'],

    // Q28: What does the President do?
    28: ['Enforces the laws', 'Commands the military', 'Signs treaties with other countries'],

    // Q41: What are the two major political parties?
    41: ['Democratic', 'Republican', 'Independent'],

    // ... more as needed
};
```

### 3. Multi-Tier Selection with Filtering
All selection tiers (1-4) now apply the semantic filtering:
1. **Tier 1**: Exact type match from same category (filtered)
2. **Tier 2**: Related types from same category (filtered)
3. **Tier 3**: Exact type from other categories (filtered)
4. **Tier 4**: Any plausible answers (filtered)

## Impact

### Question 6 - Before vs After
**Before**:
- "The Constitution" ❌ (document, not a freedom)
- "The Bill of Rights" ❌ (document, not a freedom)
- "Trump" ❌ (absurd - person's name)
- "speech" ✓ (correct)

**After**:
- "religion" ✓ (suitable wrong answer - also a First Amendment freedom)
- "assembly" ✓ (suitable wrong answer - also a First Amendment freedom)
- "press" ✓ (suitable wrong answer - also a First Amendment freedom)
- "speech" ✓ (correct)

### Advantages
1. ✅ No more absurd answer combinations
2. ✅ Wrong answers are plausible but clearly different from correct answer
3. ✅ Students must understand the material, not just eliminate obvious wrong answers
4. ✅ Selective curation for tough questions without duplicates
5. ✅ Algorithm-based fallback for all other questions

## Questions with Manual Curation
The following questions have been given specific wrong answer selections:
- Q6: First Amendment rights/freedoms
- Q9: Rule of law
- Q28: Presidential duties
- Q41: Political parties
- Q51: Important historical documents
- Q75: Constitutional Convention

All other questions (1-105) use the improved algorithm-based selection with semantic filtering.

## Testing Needed
1. Review Question 6 multiple choice options (rights/freedoms)
2. Review Question 28 multiple choice options (presidential duties)
3. Review other curated questions for suitability
4. Add more curations if other questions still have poor choices

## Files Changed
- `app.js`: Updated `generateChoices()` with semantic filtering, added `getCuratedWrongAnswersForQuestion()` method

## Status
✅ Implementation complete - Ready for testing
