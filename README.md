# N-400 Civics Practice Web App

A web-based app for practicing the original 100 USCIS civics questions (pre-2021). Works in Safari, Chrome, Firefox, and Edge on iPhone, iPad, Mac, Android, and Windows. Designed for the N-400 naturalization interview with text-to-speech, weighted random question selection, and progress tracking.

## Features

- **All 100 Original USCIS Civics Questions**: Complete question set with acceptable answers
- **Text-to-Speech**: Automatic TTS for each question with play/stop controls
- **Flexible Answer Input**: Type answers freely or choose from 4 options
- **Weighted Random Selection**: Questions with lower accuracy appear more frequently
- **Progress Tracking**: Real-time stats on overall accuracy and per-question performance
- **Local Storage**: Progress saved to browser via localStorage (works offline, no internet required)
- **Minimalist Design**: Clean, focused UI with patriotic color scheme (#1B3A6B navy)
- **Cross-Platform**: Works on iPhone, iPad, Android, Mac, Windows—any device with a modern browser

## Quick Start

1. **Open `index.html` in any browser**
   - Safari, Chrome, Firefox, Edge all work
   - On mobile: open the file or bookmark it for easy access

2. **Optional: Add to Home Screen**
   - iPhone/iPad: Tap Share → Add to Home Screen
   - Android: Tap menu → Install app

That's it! No installation, no internet, no apps needed.

## Project Structure

```
C:/Projects/N400/
├── index.html                     # Main HTML page
├── styles.css                     # Styling (minimalist, responsive)
├── app.js                         # Main application logic
├── questions-data.js              # All 100 USCIS civics questions
├── README.md                      # This file
└── QUICKSTART.md                  # 5-minute quick start guide
```

## Usage

### Starting Practice
1. Open `index.html` in your browser
2. Tap "Start Practice"
3. Question appears with category and number
4. Tap "Read Question" to hear the question spoken aloud
5. Either type your answer or tap "Show me 4 choices"

### Answering Questions

**Text Mode (Default)**:
- Type your answer in the input field
- Press Enter or tap "Submit Answer"
- Case-insensitive matching (answers are normalized)

**Multiple Choice Mode**:
- Tap "Show me 4 choices"
- Tap one of 4 answer cards to select
- Auto-submits immediately

### Feedback
- **Correct**: ✅ symbol, green background
- **Incorrect**: ❌ symbol, shows correct answer, red background
- Tap "Next Question" to continue

### Checking Progress
- Tap "My Progress" from home screen
- See overall accuracy and practice count
- View per-question stats with accuracy bars
- Questions grouped by category
- Color coding: 🟢 ≥70%, 🟡 40–69%, 🔴 <40%, ⚫ not yet asked

## How It Works

### Weighted Random Selection

Questions are selected with priority based on accuracy:

| Accuracy | Weight | Priority |
|----------|--------|----------|
| Never asked | 3× | High (resurface frequently) |
| <50% accuracy | 2× | Medium |
| ≥50% accuracy | 1× | Normal |

This ensures weak areas get more practice.

### Answer Matching

Answers are matched **case-insensitive and whitespace-trimmed**. A user answer is correct if it matches any acceptable answer for the question.

**Example**:
- Question: "What is the supreme law of the land?"
- Acceptable: ["The Constitution", "the Constitution"]
- User can type: "the constitution", "THE CONSTITUTION", "Constitution", etc.

### Progress Persistence

Progress is saved automatically to your browser's localStorage:
- Stays forever on the same device/browser
- Separate progress for each browser/device
- Lost if you clear browser cache/cookies

**To Reset Progress**: Open DevTools (F12) → Application → localStorage → Delete `n400_progress`

## Tech Stack

- **HTML5** - Structure
- **CSS3** - Styling (dark mode support, responsive)
- **JavaScript (Vanilla)** - No frameworks, ~300 lines of app logic
- **Web Speech API** - Text-to-speech (built into modern browsers)
- **localStorage** - Client-side persistence

## Browser Support

| Browser | iPhone | iPad | Android | Mac/Windows |
|---------|--------|------|---------|-------------|
| Safari | ✅ | ✅ | - | ✅ |
| Chrome | ✅ | ✅ | ✅ | ✅ |
| Firefox | ✅ | ✅ | ✅ | ✅ |
| Edge | - | - | ✅ | ✅ |

**Text-to-Speech (TTS)** works in all modern browsers. Some older browsers may not support it.

## Design Language

- **Background**: System default (white on light mode, dark on dark mode)
- **Accent Color**: Deep navy `#1B3A6B` (RGB: 27, 58, 107)
- **Typography**: System fonts (-apple-system, Segoe UI, Helvetica)
- **Spacing**: 16px padding standard, 8px card radius
- **Icons**: Unicode emoji only
- **Responsive**: Works perfectly on mobile and desktop

## Deployment Options

### Option 1: Local File (Simplest)
1. Save all files together in a folder
2. Open `index.html` in your browser
3. Works offline, no server needed

### Option 2: Web Server
```bash
cd /path/to/N400
python -m http.server 8000
# Visit http://localhost:8000
```

### Option 3: Cloud Hosting (Free)
- GitHub Pages
- Netlify
- Vercel
- Firebase Hosting

Upload the 4 files (index.html, styles.css, app.js, questions-data.js) and get a live URL.

## Offline Usage

The app works completely offline:
1. Load it once in your browser
2. Close the browser/app
3. Open it again without internet
4. Everything works including TTS (uses device speech engine)

Progress is stored locally and doesn't require internet.

## Mobile Installation

### iPhone/iPad (Safari)
1. Open `index.html` in Safari
2. Tap Share button
3. Tap "Add to Home Screen"
4. Choose a name (e.g., "N-400 Practice")
5. Tap Add

Now it appears as an app icon on your home screen and opens like an app.

### Android (Chrome)
1. Open `index.html` in Chrome
2. Tap the menu (three dots)
3. Tap "Install app" or "Add to Home Screen"
4. Choose a name
5. Tap Install

## Troubleshooting

### No TTS Sound
- Check browser has permission to use microphone speakers
- Try in a different browser (Chrome/Firefox usually most reliable)
- Ensure device volume is on

### Progress Not Saving
- Check if localStorage is enabled (usually is by default)
- Try in a different browser
- Clear browser cache and try again

### Answers Not Being Recognized
- Answers are case-insensitive ("answer", "ANSWER", "Answer" all work)
- Extra spaces are trimmed ("  answer  " works)
- If still failing, check the acceptable answers in the question data

### Mobile App Won't Open
- If using Safari's "Add to Home Screen", it's a web app shortcut
- It needs internet or needs to have been loaded before
- You can also just bookmark and use from Safari directly

## Features & Limitations

### ✅ Included
- All 100 original USCIS civics questions
- Text-to-speech for every question
- Text input and multiple choice modes
- Progress tracking per question
- Overall accuracy calculation
- Weighted random selection
- Offline-first (works without internet)
- Works on any device with a browser

### ⚠️ Not Included
- Spaced repetition (refresh page to reset questions)
- Study modes (questions in order, etc.)
- Bookmarking/flagging questions
- Cloud sync across devices
- User accounts/authentication
- Mobile apps (it's a web app—no installation needed)

## Interview Tips

1. **Daily Practice** - Spend 10-15 minutes daily
2. **Focus on Weak Areas** - App shows harder questions more often
3. **Speak Aloud** - Don't just type; practice saying answers
4. **Speed** - Try to answer within 2-3 seconds
5. **Categories** - Check "My Progress" to identify weak categories
6. **Review** - Go back to questions you got wrong

## Notes

- No external dependencies (no npm, no frameworks)
- No ads, no tracking, no data collection
- Completely free and open-source
- Questions are hardcoded (no network calls)
- Works offline once loaded
- Minimal file size (~50KB total)

## Future Enhancements (Optional)

- Reset progress button
- Study modes (sequential, category filtering)
- Spaced repetition algorithm
- Dark mode toggle
- Keyboard shortcuts
- Mobile app versions (React Native)

---

**Good luck on your N-400 interview on 3/17! 🇺🇸**
