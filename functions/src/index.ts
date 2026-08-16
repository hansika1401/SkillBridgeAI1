import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin
admin.initializeApp();

// Omnidim AI configuration
const OMNIDIM_API_KEY = functions.config().omnidim?.key || process.env.OMNIDIM_API_KEY;
const OMNIDIM_BASE_URL = 'https://api.omnidim.ai/v1'; // Update with actual Omnidim API URL

interface AnalyzeResumeRequest {
  resumeText: string;
  jobDescription: string;
  resumeUrl?: string;
}

interface AnalyzeResumeResponse {
  keywordMatch: number;
  atsScore: number;
  rewrittenBullets: string[];
}

// Helper function to call Omnidim AI API
async function callOmnidimAI(prompt: string, maxTokens: number = 500, temperature: number = 0.1): Promise<string> {
  if (!OMNIDIM_API_KEY) {
    throw new Error('OMNIDIM_API_KEY not configured');
  }

  const response = await fetch(`${OMNIDIM_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OMNIDIM_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'omnidim-gpt-4', // Update with actual Omnidim model name
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens,
      temperature: temperature,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Omnidim AI API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content?.trim() || '';
}

export const analyzeResume = functions.https.onCall(
  async (data: AnalyzeResumeRequest, context: any): Promise<AnalyzeResumeResponse> => {
    // Verify authentication
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'The function must be called while authenticated.'
      );
    }

    const { resumeText, jobDescription } = data;

    if (!resumeText || !jobDescription) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Resume text and job description are required.'
      );
    }

    try {
      // Analyze keyword match
      const keywordMatchPrompt = `
        Analyze the following resume and job description to calculate a keyword match percentage.
        
        Job Description:
        ${jobDescription}
        
        Resume:
        ${resumeText}
        
        Calculate what percentage of important keywords from the job description appear in the resume.
        Return only a number between 0 and 100.
      `;

      const keywordResponse = await callOmnidimAI(keywordMatchPrompt, 10, 0.1);
      const keywordMatch = parseInt(keywordResponse || '0');

      // Analyze ATS compatibility
      const atsPrompt = `
        Analyze the following resume for ATS (Applicant Tracking System) compatibility.
        Consider factors like:
        - Clear section headers
        - Standard formatting
        - Proper use of keywords
        - Readable structure
        - Appropriate file format considerations
        
        Resume:
        ${resumeText}
        
        Rate the ATS compatibility on a scale of 0-100. Return only the number.
      `;

      const atsResponse = await callOmnidimAI(atsPrompt, 10, 0.1);
      const atsScore = parseInt(atsResponse || '0');

      // Generate rewritten bullet points
      const bulletPrompt = `
        Analyze the following resume and rewrite the bullet points to be more impactful and ATS-friendly.
        Focus on:
        - Using action verbs
        - Including quantifiable results
        - Incorporating relevant keywords from the job description
        - Making achievements more compelling
        
        Job Description:
        ${jobDescription}
        
        Resume:
        ${resumeText}
        
        Return exactly 5 improved bullet points, each on a new line, without numbering or bullet symbols.
      `;

      const bulletResponse = await callOmnidimAI(bulletPrompt, 500, 0.3);
      const rewrittenBullets = bulletResponse
        .split('\n')
        .filter((bullet: string) => bullet.trim().length > 0)
        .slice(0, 5);

      return {
        keywordMatch: Math.max(0, Math.min(100, keywordMatch)),
        atsScore: Math.max(0, Math.min(100, atsScore)),
        rewrittenBullets,
      };
    } catch (error) {
      console.error('Omnidim AI API error:', error);
      throw new functions.https.HttpsError(
        'internal',
        'Failed to analyze resume. Please try again.'
      );
    }
  }
);
