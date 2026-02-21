# N400Practice - File Manifest

Complete list of all source files created for the N400 Civics Practice iOS app.

## Directory Structure

```
C:/Projects/N400/
├── README.md                          # Main project documentation
├── SETUP_GUIDE.md                     # Step-by-step setup instructions
├── FILE_MANIFEST.md                   # This file
├── setup-xcode-project.sh             # macOS setup helper script
├── N400Practice/                      # Main source code directory
│   ├── N400PracticeApp.swift          # App entry point (@main)
│   ├── Info.plist                     # iOS app configuration
│   ├── Models/
│   │   ├── CivicsQuestion.swift       # Question data model
│   │   └── QuizProgress.swift         # User progress tracking model
│   ├── Data/
│   │   └── QuestionsData.swift        # All 100 USCIS civics questions
│   ├── Services/
│   │   └── SpeechService.swift        # Text-to-speech wrapper
│   ├── ViewModels/
│   │   └── QuizViewModel.swift        # Quiz logic & state management
│   └── Views/
│       ├── HomeView.swift             # Home screen with navigation
│       ├── QuizView.swift             # Main quiz practice screen
│       ├── ChoicesView.swift          # Multiple choice picker
│       ├── FeedbackView.swift         # Answer feedback display
│       └── ProgressView.swift         # Progress statistics view
```

## File Descriptions

### Documentation
- **README.md** - Project overview, features, tech stack, and usage guide
- **SETUP_GUIDE.md** - Detailed step-by-step setup instructions for macOS
- **FILE_MANIFEST.md** - This file; comprehensive file listing and descriptions

### App Entry Point
- **N400PracticeApp.swift** - Main app struct with @main annotation; launches HomeView

### Models (Data Structures)
- **CivicsQuestion.swift** - Defines question structure with id, text, acceptableAnswers, category
- **QuizProgress.swift** - Tracks timesAsked, timesCorrect, and calculated accuracy for each question

### Data
- **QuestionsData.swift** - Hard-coded array of 100 CivicsQuestion objects with all questions and answers from original USCIS test

### Services
- **SpeechService.swift** - Singleton wrapper around AVSpeechSynthesizer for TTS; handles speak/stop with delegate callbacks

### ViewModels
- **QuizViewModel.swift** - Core quiz logic including:
  - Current question management
  - Weighted random question selection
  - Answer validation with case-insensitive matching
  - Multiple choice generation (4 options)
  - Progress persistence to UserDefaults
  - Overall and per-question statistics

### Views (SwiftUI)
- **HomeView.swift** - Entry screen with app title, navigation to Quiz and Progress
- **QuizView.swift** - Main quiz interface with:
  - Question display
  - TTS play button
  - Text input for free-text answers
  - Option to show 4-choice interface
  - Feedback overlay on answer submission
- **ChoicesView.swift** - Multiple choice interface with 4 tappable answer cards
- **FeedbackView.swift** - Modal showing correct/incorrect with correct answer revealed
- **ProgressView.swift** - Statistics dashboard with:
  - Overall accuracy and practice count
  - Per-question accuracy bars
  - Question list grouped by category
  - Color-coded accuracy levels

### Configuration
- **Info.plist** - iOS app manifest with bundle ID, deployment target, app name, etc.

## File Sizes (Approximate)

| File | Lines | Purpose |
|------|-------|---------|
| QuestionsData.swift | 500+ | 100 questions |
| README.md | 250+ | Documentation |
| SETUP_GUIDE.md | 350+ | Setup instructions |
| QuizViewModel.swift | 200+ | Core logic |
| QuizView.swift | 150+ | Main UI screen |
| ProgressView.swift | 200+ | Statistics screen |
| HomeView.swift | 60 | Home screen |
| ChoicesView.swift | 40 | Choice picker |
| FeedbackView.swift | 70 | Feedback modal |
| CivicsQuestion.swift | 15 | Data model |
| QuizProgress.swift | 15 | Data model |
| SpeechService.swift | 45 | TTS service |
| N400PracticeApp.swift | 10 | App entry |

## Total Files: 17 Swift/Config Files + 3 Documentation Files = 20 files

## Import Dependencies

### Swift Framework Imports
- `SwiftUI` - UI framework (all View files)
- `Foundation` - Core types (models, view models)
- `AVFoundation` - Text-to-speech (SpeechService)

### File Dependencies

```
N400PracticeApp.swift
└── HomeView

HomeView.swift
├── QuizView
└── ProgressView

QuizView.swift
├── QuizViewModel (imported)
├── ChoicesView
├── FeedbackView
└── SpeechService (imported)

ProgressView.swift
├── QuizViewModel (imported)
├── allCivicsQuestions (from QuestionsData)
└── QuestionProgressRow (sub-view)

ChoicesView.swift
└── (no dependencies)

FeedbackView.swift
└── (no dependencies)

QuizViewModel.swift
├── CivicsQuestion (from Models)
├── QuizProgress (from Models)
└── allCivicsQuestions (from QuestionsData)

SpeechService.swift
├── AVFoundation
└── (singleton pattern)

Models/CivicsQuestion.swift
└── (no dependencies)

Models/QuizProgress.swift
└── (no dependencies)

Data/QuestionsData.swift
├── Foundation
└── CivicsQuestion (from Models)
```

## Code Statistics

- **Total Swift Lines**: ~1,800+
- **Total Questions**: 100
- **Number of Views**: 5 main + 1 sub-view
- **Models**: 2
- **Services**: 1
- **ViewModels**: 1
- **Documentation Files**: 3

## Checklist for File Verification

When setting up in Xcode, verify each file:

### Models Group
- [ ] CivicsQuestion.swift - ~15 lines
- [ ] QuizProgress.swift - ~15 lines

### Data Group
- [ ] QuestionsData.swift - ~500 lines, starts with `let allCivicsQuestions: [CivicsQuestion]`

### Services Group
- [ ] SpeechService.swift - ~45 lines, class SpeechService

### ViewModels Group
- [ ] QuizViewModel.swift - ~200 lines, class QuizViewModel

### Views Group
- [ ] HomeView.swift - ~60 lines, struct HomeView
- [ ] QuizView.swift - ~150 lines, struct QuizView
- [ ] ChoicesView.swift - ~40 lines, struct ChoicesView
- [ ] FeedbackView.swift - ~70 lines, struct FeedbackView
- [ ] ProgressView.swift - ~200 lines, struct ProgressView

### Root Files
- [ ] N400PracticeApp.swift - ~10 lines, @main app struct
- [ ] Info.plist - XML configuration file

## Important Notes

1. **No Asset Files Required** - App uses only SF Symbols, no images needed
2. **No Core Data** - Progress stored in UserDefaults (JSON)
3. **No External Dependencies** - Uses only Apple frameworks
4. **All 100 Questions Embedded** - No network calls needed
5. **Dark Mode Support** - Uses `.systemBackground` for adaptive colors

## File Encoding

All Swift files use UTF-8 encoding. The Info.plist file uses XML with UTF-8 encoding.

## Version Information

- Swift Version: 5.9+
- iOS Deployment Target: iOS 16.0+
- Xcode Version: 14.0+
- SwiftUI: Native (no UIKit required)

---

For setup instructions, see **SETUP_GUIDE.md**
For usage information, see **README.md**
