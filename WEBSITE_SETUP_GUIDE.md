# SkillBridge AI - Website Setup Guide

## ✅ Current Status
Your SkillBridge AI website is **WORKING** and running successfully on `http://localhost:9002`

## 🚀 Quick Start
```bash
npm install
npm run dev
```
The website will be available at: http://localhost:9002

## 📋 What's Working

### ✅ Core Infrastructure
- **Next.js 15.3.3** with Turbopack for fast development
- **Firebase Integration** with proper configuration
- **TypeScript** setup with proper type checking
- **Tailwind CSS** for styling
- **Radix UI Components** for modern UI elements

### ✅ Key Features
- **Landing Page** with all sections loading properly
- **Authentication System** (`/auth` page working)
- **AI Integration** with Google Genkit and Gemini 2.5 Flash
- **Firebase Services** (Auth, Firestore, Storage)
- **API Routes** for AI functionality

### ✅ AI Capabilities
- **Interactive Career Coach** - AI-powered career guidance
- **Skill Gap Analysis** - Identifies missing skills for career goals
- **Learning Path Generation** - Creates personalized learning roadmaps
- **Resume Analysis** - AI-powered resume optimization
- **Project Ideas** - Generates project suggestions
- **Trending Skills** - Shows in-demand skills

## 🔧 Environment Setup

### Required Environment Variables
Create a `.env.local` file with:

```env
# Google AI (for Genkit integration)
GOOGLE_API_KEY=your_google_api_key_here

# Optional: Omnidim AI (alternative AI provider)
OMNIDIM_API_KEY=your_omnidim_api_key_here

# Firebase (automatically configured via firebase config)
# No additional env vars needed for Firebase
```

### Getting API Keys

1. **Google AI API Key**:
   - Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create a new API key
   - Add it to your `.env.local` file

2. **Omnidim AI** (Optional):
   - Contact Omnidim AI for API access
   - Add the key to `.env.local`

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   │   ├── ai/           # AI-powered endpoints
│   │   ├── auth/         # Authentication
│   │   └── ...
│   ├── auth/             # Auth pages
│   ├── dashboard/        # User dashboard
│   └── ...
├── components/            # React components
├── firebase/             # Firebase configuration
├── ai/                   # AI flows and services
└── lib/                  # Utilities
```

## 🔥 Firebase Configuration

### Current Setup
- **Project ID**: `studio-2807668976-c7652`
- **Services**: Auth, Firestore, Storage, Functions
- **Rules**: Properly configured for security

### Firebase Features
- **Authentication** - User signup/login
- **Firestore** - User profiles, learning paths, resume analysis
- **Storage** - File uploads (resumes, documents)
- **Functions** - Server-side AI processing

## 🤖 AI Integration Details

### Google Genkit Setup
- **Model**: `gemini-2.5-flash`
- **Flows**: Career coaching, skill analysis, learning paths
- **Rate Limiting**: Built-in protection against API abuse

### Available AI Endpoints
- `/api/ai/learning-path` - Generate learning roadmaps
- `/api/ai/skillgap` - Analyze skill gaps
- `/api/ai/career-fit` - Career compatibility analysis
- `/api/ai/project-ideas` - Project suggestions
- `/api/ai/trending-skills` - Industry skill trends
- `/api/analyze-resume` - Resume optimization

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run typecheck

# Linting
npm run lint

# Genkit development (AI flows)
npm run genkit:dev
```

## 🔍 Troubleshooting

### Common Issues

1. **AI Features Not Working**
   - Ensure `GOOGLE_API_KEY` is set in `.env.local`
   - Check API key permissions and quotas

2. **Firebase Errors**
   - Verify Firebase project configuration
   - Check Firestore rules and indexes

3. **Build Errors**
   - Run `npm run typecheck` to identify TypeScript issues
   - Check for missing dependencies

### Logs and Debugging
- Server logs appear in the terminal
- Browser console for client-side errors
- Firebase console for backend issues

## 📚 Documentation References

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Google AI Studio](https://aistudio.google.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🎯 Next Steps

1. **Add API Keys**: Set up your Google AI API key for full AI functionality
2. **Customize Content**: Update landing page content and branding
3. **Deploy**: Use Firebase Hosting or Vercel for production deployment
4. **Monitor**: Set up analytics and error tracking

---

**Status**: ✅ Website is fully functional and ready for development!
**Last Updated**: November 2024
