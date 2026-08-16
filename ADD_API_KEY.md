# 🔑 Add Google AI API Key

## Quick Setup Instructions

### Step 1: Create .env.local file
In your project root folder (`c:\Users\Harshwardhan\skillbridgeai\`), create a file named `.env.local` with this content:

```
GOOGLE_API_KEY=AIzaSyDJe9qtDWUR1_x-cxcDbnhzgi8C7ZzTDgw
```

### Step 2: Restart the server
After saving the file, restart your development server:
1. Stop the current server (Ctrl+C in terminal)
2. Run: `npm run dev`

### Step 3: Test the AI Career Coach
1. Go to http://localhost:9002
2. Scroll down to "Meet Your AI Career Coach 🤖" section
3. Try asking: "What skills do I need for a Data Analyst role?"

## ✅ What This Enables
- **AI Career Coach** - Interactive chat for career guidance
- **Skill Gap Analysis** - Identifies missing skills
- **Learning Path Generation** - Creates personalized roadmaps
- **All AI-powered features** in the dashboard

## 🔧 Troubleshooting
If AI features don't work:
1. Verify the `.env.local` file exists in the project root
2. Check that the API key is correctly formatted
3. Restart the development server
4. Check browser console for any errors

Your API key is now ready to power the AI Career Coach! 🚀
