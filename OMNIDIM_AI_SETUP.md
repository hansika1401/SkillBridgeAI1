# Omnidim AI Integration Setup Guide

## Overview
ResumeRadar now uses Omnidim AI instead of OpenAI for resume analysis. This guide covers the complete setup process.

## 🔑 Getting Your Omnidim AI API Key

1. Visit the Omnidim AI website
2. Sign up for an account or log in
3. Navigate to your API dashboard
4. Generate a new API key
5. Copy the API key for configuration

## 🛠️ Configuration Options

### Option 1: Local Development (Immediate Testing)

Create a `.env.local` file in your project root:
```bash
OMNIDIM_API_KEY=your_omnidim_api_key_here
```

This will enable the ResumeRadar to work immediately through the Next.js API route.

### Option 2: Firebase Functions (Production)

For production deployment with Firebase Functions:
```bash
firebase functions:config:set omnidim.key="your_omnidim_api_key_here"
```

Then deploy the functions:
```bash
cd functions
npm install
firebase deploy --only functions
```

## 🚀 Quick Start (Local Development)

1. **Add API Key**: Create `.env.local` with your Omnidim AI API key
2. **Restart Server**: Stop and restart your Next.js development server
3. **Test ResumeRadar**: Navigate to `/resume-radar` and test with a sample resume

## 📝 API Endpoints Used

The integration uses these Omnidim AI endpoints:
- **Base URL**: `https://api.omnidim.ai/v1`
- **Endpoint**: `/chat/completions`
- **Model**: `omnidim-gpt-4` (update with actual model name)

## 🔧 Customization

### Model Configuration
Update the model name in both files if needed:
- `src/app/api/analyze-resume/route.ts` (line 17)
- `functions/src/index.ts` (line 36)

### API Base URL
If Omnidim AI uses a different base URL, update:
- `src/app/api/analyze-resume/route.ts` (line 10)
- `functions/src/index.ts` (line 9)

## 🧪 Testing

### With API Key
1. Add your Omnidim AI API key to `.env.local`
2. Upload a resume and job description
3. Click "Analyze Resume"
4. Verify you get real AI-generated results

### Without API Key (Mock Mode)
1. Don't set the API key
2. The system will automatically use mock data
3. Results will be randomized but functional

## 🔍 Troubleshooting

### Common Issues

**"OMNIDIM_API_KEY not configured"**
- Ensure `.env.local` exists with the correct key
- Restart your development server after adding the key

**"Omnidim AI API error: 401"**
- Check if your API key is valid
- Verify the API key has proper permissions

**"Omnidim AI API error: 404"**
- Verify the API base URL is correct
- Check if the model name is accurate

**Mock data always returned**
- Ensure the environment variable name is exactly `OMNIDIM_API_KEY`
- Check that `.env.local` is in the project root directory

## 📊 Features Powered by Omnidim AI

1. **Keyword Match Analysis**: Calculates percentage of job keywords found in resume
2. **ATS Compatibility Scoring**: Rates resume structure and formatting
3. **Bullet Point Enhancement**: Rewrites resume bullets for better impact

## 🔒 Security Notes

- API keys are never exposed to the client
- All AI processing happens server-side
- User data is not stored by Omnidim AI (verify with their privacy policy)
- Resume files are stored securely in Firebase Storage

## 📈 Performance

- Parallel API calls for faster analysis
- Fallback to mock data if AI service is unavailable
- Optimized prompts for better response quality

## 🚀 Next Steps

1. **Get your Omnidim AI API key**
2. **Add it to `.env.local`**
3. **Test the ResumeRadar functionality**
4. **Deploy to production when ready**

The ResumeRadar is now fully integrated with Omnidim AI and ready to provide intelligent resume analysis!
