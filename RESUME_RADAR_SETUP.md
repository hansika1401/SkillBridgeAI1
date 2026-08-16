# ResumeRadar Setup Guide

## Overview
ResumeRadar is a real-time resume analyzer that uses AI to provide keyword matching, ATS compatibility scoring, and enhanced bullet point suggestions.

## Features Implemented
✅ File upload for PDF/TXT resumes  
✅ Job description input  
✅ Firebase Storage integration  
✅ Real-time analysis with loading states  
✅ Results display with progress bars  
✅ Copy-to-clipboard functionality  
✅ Save analysis versions to Firestore  
✅ Responsive design with Tailwind CSS  

## Setup Instructions

### 1. Install Firebase Functions Dependencies
```bash
cd functions
npm install
```

### 2. Set Omnidim AI API Key
For Firebase Functions:
```bash
firebase functions:config:set omnidim.key="YOUR_OMNIDIM_API_KEY"
```

For local development, create a `.env.local` file:
```bash
OMNIDIM_API_KEY=your_omnidim_api_key_here
```

### 3. Deploy Firebase Functions
```bash
firebase deploy --only functions
```

### 4. Deploy Firestore Rules and Storage Rules
```bash
firebase deploy --only firestore:rules,storage
```

### 5. Access the Application
Navigate to `/resume-radar` in your application to use the ResumeRadar feature.

## Firebase Configuration

### Storage Rules
- Users can only upload resumes to their own folder: `/resumes/{userId}/`
- Authentication required for all operations

### Firestore Rules
- Resume analysis versions stored at: `/users/{userId}/resumeRadarVersions/{versionId}`
- Only authenticated users can access their own data

### Cloud Function
- `analyzeResume`: Processes resume text and job description using Omnidim AI
- Returns keyword match percentage, ATS score, and rewritten bullet points

## Usage Flow

1. **Upload Resume**: User uploads PDF or TXT file
2. **Job Description**: User pastes target job description
3. **Analysis**: Click "Analyze Resume" to process
4. **Results**: View keyword match, ATS score, and enhanced bullet points
5. **Save**: Optionally save analysis version to history

## API Integration

The system uses Omnidim AI for:
- Keyword matching analysis
- ATS compatibility scoring
- Bullet point enhancement

Available through both:
- Firebase Cloud Functions (production)
- Next.js API routes (development/fallback)

## Security Features

- User authentication required
- File uploads restricted to user's own folder
- Firestore data isolated by user ID
- Omnidim AI API key secured in Firebase Functions config

## Development Notes

- Mock data is available in the API route for testing without Omnidim AI
- Firebase Functions provide production-ready AI analysis
- All UI components use existing design system
- Responsive design works on mobile and desktop

## Environment Variables Required

```bash
# Firebase Functions Config
firebase functions:config:set omnidim.key="your_omnidim_api_key"

# For local development (.env.local)
OMNIDIM_API_KEY="your_omnidim_api_key"
```

## Deployment Checklist

- [ ] Firebase project configured
- [ ] Omnidim AI API key set in Functions config
- [ ] Functions deployed
- [ ] Firestore rules deployed
- [ ] Storage rules deployed
- [ ] Application tested with real resume files
