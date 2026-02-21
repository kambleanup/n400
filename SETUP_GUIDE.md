# N400Practice - Complete Setup Guide

This guide walks you through setting up the N400 Civics Practice iOS app on macOS.

## Prerequisites

- macOS 11 or later
- Xcode 14.0 or later (available from App Store)
- iPhone or iPad for testing (optional, simulator works fine)
- An Apple ID (free personal development team works)

## Option 1: Quick Setup (Recommended)

### Step 1: Open Xcode and Create New Project

1. Launch **Xcode**
2. Select **File → New → Project**
3. Choose **iOS** tab, then select **App**
4. Click **Next**

### Step 2: Configure Project Settings

Fill in the following information:

| Field | Value |
|-------|-------|
| Product Name | `N400Practice` |
| Team | (Your personal team) |
| Organization Identifier | `com.n400practice` |
| Bundle Identifier | `com.n400practice.app` |
| Interface | **SwiftUI** |
| Language | **Swift** |
| Storage | (leave default) |

Click **Next** and save the project in your desired location.

### Step 3: Replace Files with Our Source Code

Xcode will create a basic project. Now replace the files:

1. **Delete default files** from the Xcode project (keep structure):
   - Delete the default `ContentView.swift`
   - Delete `N400PracticeApp.swift` (we'll replace it)

2. **Copy our source files** into Xcode project:

   From the `N400Practice/` directory in this repository, copy:
   - `N400PracticeApp.swift` → Root of project in Xcode
   - `Models/` folder → Drag into Xcode
   - `Data/` folder → Drag into Xcode
   - `Services/` folder → Drag into Xcode
   - `ViewModels/` folder → Drag into Xcode
   - `Views/` folder → Drag into Xcode

3. **In Xcode**, when dragging files:
   - ✅ Check "Copy items if needed"
   - ✅ Check "Create groups"
   - ✅ Select your target (N400Practice)
   - Click **Finish**

### Step 4: Verify Files in Xcode

Your file structure in Xcode should look like:

```
N400Practice (Project)
├── N400PracticeApp.swift
├── Models
│   ├── CivicsQuestion.swift
│   └── QuizProgress.swift
├── Data
│   └── QuestionsData.swift
├── Services
│   └── SpeechService.swift
├── ViewModels
│   └── QuizViewModel.swift
└── Views
    ├── HomeView.swift
    ├── QuizView.swift
    ├── ChoicesView.swift
    ├── FeedbackView.swift
    └── ProgressView.swift
```

### Step 5: Configure Build Settings

1. In Xcode, select the **N400Practice** project in the left sidebar
2. Select the **N400Practice** target
3. Go to the **Build Settings** tab
4. Search for "iOS Deployment Target"
5. Set it to **iOS 16.0** or later

### Step 6: Build and Run

1. Select **iPhone 15** as the target simulator (top-left of Xcode)
2. Press **Cmd+B** to build the project
   - You should see "Build Succeeded" in the build log
3. Press **Cmd+R** to run the app
4. The simulator should launch and show the home screen

---

## Option 2: Using Swift Package (Advanced)

If you prefer using Swift Package Manager:

### Step 1: Create Swift Package

```bash
cd /path/to/N400
swift package init --type executable
```

### Step 2: Update Package.swift

Replace the contents of `Package.swift` with:

```swift
import PackageDescription

let package = Package(
    name: "N400Practice",
    platforms: [
        .iOS(.v16)
    ],
    dependencies: [],
    targets: [
        .executableTarget(
            name: "N400Practice",
            dependencies: [],
            path: "N400Practice"
        )
    ]
)
```

### Step 3: Generate Xcode Project

```bash
swift package generate-xcodeproj
```

Then open `N400Practice.xcodeproj` in Xcode.

---

## Troubleshooting

### Build Error: "Cannot find 'allCivicsQuestions'"

**Solution**: Make sure `QuestionsData.swift` is in the **Data** group and is included in the target.

1. In Xcode, select `QuestionsData.swift`
2. In the **File Inspector** (right panel), ensure "N400Practice" is checked under Target Membership

### Build Error: "Xcode cannot find AVFoundation"

**Solution**: This is normal for previews. The import works at runtime. Ignore this if the build succeeds overall.

### Simulator Shows Blank Screen

**Solution**:
1. Press **Cmd+Shift+K** to clean the build folder
2. Press **Cmd+B** to rebuild
3. Press **Cmd+R** to run again

### App Crashes on Launch

**Solution**:
1. Check the Console output (Cmd+Shift+C)
2. Look for red error messages
3. Common fixes:
   - Ensure all Swift files are present
   - Check that file names match exactly
   - Verify imports are correct (no typos)

### "No development team set"

**Solution**:
1. Select the **N400Practice** project
2. Select the **N400Practice** target
3. Go to **Signing & Capabilities**
4. Select your personal Apple ID from the "Team" dropdown
5. Xcode will auto-generate a certificate

### App Won't Run on Physical Device

**Solution**:
1. Connect iPhone via USB or wireless
2. Select the device from the target selector (top-left)
3. Go to **Product → Build** (Cmd+B)
4. Go to **Product → Run** (Cmd+R)
5. Trust the app on your device when prompted

---

## Testing Checklist

After setup, verify the app works:

### Home Screen
- [ ] App launches without crash
- [ ] Title "N-400 Civics Practice" appears
- [ ] "Start Practice" button is visible
- [ ] "My Progress" button is visible

### Quiz Screen
- [ ] Questions load without crash
- [ ] Question text appears in large font
- [ ] "Read Question" button appears
- [ ] Audio plays when button tapped
- [ ] Text input field appears
- [ ] "Submit Answer" button works
- [ ] "Show me 4 choices" link toggles choice view

### Answer Submission
- [ ] Submitting correct answer shows ✅ (green)
- [ ] Submitting incorrect answer shows ❌ (red)
- [ ] Feedback shows correct answer
- [ ] "Next Question" loads new question
- [ ] New question is different from previous

### Multiple Choice Mode
- [ ] "Show me 4 choices" displays 4 buttons
- [ ] Options are different answers
- [ ] Tapping an option submits immediately
- [ ] Feedback works as in text mode

### Progress Tracking
- [ ] Answer 5+ questions in the quiz
- [ ] Go back to home and tap "My Progress"
- [ ] Overall accuracy is calculated correctly
- [ ] "Questions Practiced" count is accurate
- [ ] Per-question stats show in list
- [ ] Accuracy bars display colors (green/yellow/red)

### Persistence
- [ ] Complete a quiz and note your accuracy
- [ ] Force quit the app (Cmd+Q)
- [ ] Relaunch the app
- [ ] Go to "My Progress"
- [ ] Verify stats are unchanged (saved correctly)

---

## File Locations Reference

When importing files in Xcode:

### Models
- `Models/CivicsQuestion.swift`
- `Models/QuizProgress.swift`

### Data
- `Data/QuestionsData.swift`

### Services
- `Services/SpeechService.swift`

### ViewModels
- `ViewModels/QuizViewModel.swift`

### Views
- `Views/HomeView.swift`
- `Views/QuizView.swift`
- `Views/ChoicesView.swift`
- `Views/FeedbackView.swift`
- `Views/ProgressView.swift`

### Root
- `N400PracticeApp.swift`
- `Info.plist`

---

## Next Steps

Once the app is running:

1. **Test thoroughly** using the checklist above
2. **Practice a few questions** to ensure logic works
3. **Install on physical device** for real-world testing
4. **Share with wife** for actual N-400 practice sessions

---

## Support

If you encounter issues:

1. **Check the Console** (Cmd+Shift+C) for error messages
2. **Clean Build Folder** (Cmd+Shift+K) and rebuild
3. **Restart Xcode** if issues persist
4. **Review the README.md** for additional details

---

**Good luck with the setup! 🇺🇸**
