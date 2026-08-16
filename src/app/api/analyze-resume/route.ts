import { NextRequest, NextResponse } from 'next/server';

// Helper function to call Omnidim AI API
async function callOmnidimAI(prompt: string, maxTokens: number = 500, temperature: number = 0.1): Promise<string> {
  const apiKey = process.env.OMNIDIM_API_KEY;
  if (!apiKey) {
    throw new Error('OMNIDIM_API_KEY not configured');
  }

  const response = await fetch('https://api.omnidim.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
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

export async function POST(request: NextRequest) {
  try {
    const { resumeText, jobDescription, resumeUrl } = await request.json();

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { error: 'Resume text and job description are required' },
        { status: 400 }
      );
    }

    // Check if Omnidim AI is configured, otherwise use mock data
    const omnidimApiKey = process.env.OMNIDIM_API_KEY;
    
    if (!omnidimApiKey) {
      // Return mock data if API key is not configured
      const mockResult = {
        keywordMatch: Math.floor(Math.random() * 40) + 60, // 60-100%
        atsScore: Math.floor(Math.random() * 30) + 70, // 70-100%
        rewrittenBullets: [
          "Enhanced project management efficiency by 25% through implementation of agile methodologies and cross-functional team coordination",
          "Collaborated with cross-functional teams to deliver high-impact features 30% faster than industry benchmarks",
          "Developed and maintained scalable web applications serving 10,000+ daily active users with 99.9% uptime",
          "Led technical initiatives that reduced system response time by 40% and improved overall user experience",
          "Mentored junior developers and established coding standards that increased team productivity by 20%"
        ]
      };

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      return NextResponse.json(mockResult);
    }

    try {
      // Use Omnidim AI for actual analysis
      const keywordMatchPrompt = `
        Analyze the following resume and job description to calculate a keyword match percentage.
        
        Job Description:
        ${jobDescription}
        
        Resume:
        ${resumeText}
        
        Calculate what percentage of important keywords from the job description appear in the resume.
        Return only a number between 0 and 100.
      `;

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

      // Execute all prompts in parallel for better performance
      const [keywordResponse, atsResponse, bulletResponse] = await Promise.all([
        callOmnidimAI(keywordMatchPrompt, 10, 0.1),
        callOmnidimAI(atsPrompt, 10, 0.1),
        callOmnidimAI(bulletPrompt, 500, 0.3)
      ]);

      const keywordMatch = Math.max(0, Math.min(100, parseInt(keywordResponse || '0')));
      const atsScore = Math.max(0, Math.min(100, parseInt(atsResponse || '0')));
      const rewrittenBullets = bulletResponse
        .split('\n')
        .filter(bullet => bullet.trim().length > 0)
        .slice(0, 5);

      return NextResponse.json({
        keywordMatch,
        atsScore,
        rewrittenBullets,
      });

    } catch (aiError) {
      console.error('Omnidim AI error:', aiError);
      // Fallback to mock data if AI fails
      const fallbackResult = {
        keywordMatch: Math.floor(Math.random() * 40) + 60,
        atsScore: Math.floor(Math.random() * 30) + 70,
        rewrittenBullets: [
          "Enhanced project management efficiency by 25% through implementation of agile methodologies and cross-functional team coordination",
          "Collaborated with cross-functional teams to deliver high-impact features 30% faster than industry benchmarks",
          "Developed and maintained scalable web applications serving 10,000+ daily active users with 99.9% uptime",
          "Led technical initiatives that reduced system response time by 40% and improved overall user experience",
          "Mentored junior developers and established coding standards that increased team productivity by 20%"
        ]
      };
      return NextResponse.json(fallbackResult);
    }

  } catch (error) {
    console.error('Resume analysis error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
