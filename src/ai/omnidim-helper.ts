// Omnidim AI Helper - Direct API integration
export interface OmnidimAIRequest {
  model?: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
}

export interface OmnidimAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

class OmnidimAI {
  private apiKey: string;
  private baseUrl: string = 'https://api.omnidim.ai/v1/chat/completions';
  private defaultModel: string = 'omnidim-gpt-4';

  constructor() {
    this.apiKey = process.env.OMNIDIM_API_KEY || '';
  }

  async chat(request: OmnidimAIRequest): Promise<string> {
    // Fallback to mock data if no API key
    if (!this.apiKey) {
      return this.getMockResponse(request);
    }

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: request.model || this.defaultModel,
          messages: request.messages,
          temperature: request.temperature || 0.7,
          max_tokens: request.max_tokens || 1000,
        }),
      });

      if (!response.ok) {
        console.warn('Omnidim AI API error, falling back to mock data');
        return this.getMockResponse(request);
      }

      const data: OmnidimAIResponse = await response.json();
      return data.choices[0]?.message?.content || 'No response generated';
    } catch (error) {
      console.warn('Omnidim AI request failed, using mock data:', error);
      return this.getMockResponse(request);
    }
  }

  private getMockResponse(request: OmnidimAIRequest): string {
    const userMessage = request.messages.find(m => m.role === 'user')?.content || '';
    
    // Career coaching responses
    if (userMessage.toLowerCase().includes('data analyst')) {
      return `To become a successful Data Analyst, you'll need these key skills:

**Technical Skills:**
- SQL for database querying
- Python or R for data analysis
- Excel/Google Sheets proficiency
- Data visualization tools (Tableau, Power BI)
- Statistics and probability

**Soft Skills:**
- Critical thinking
- Problem-solving
- Communication skills
- Attention to detail

**Getting Started:**
1. Learn SQL basics (2-3 weeks)
2. Master Excel functions (1-2 weeks)
3. Start with Python pandas library (3-4 weeks)
4. Practice with real datasets
5. Build a portfolio of projects

Would you like specific resources for any of these areas?`;
    }

    if (userMessage.toLowerCase().includes('frontend developer')) {
      return `Frontend Developer roadmap:

**Essential Skills:**
- HTML5 & CSS3
- JavaScript (ES6+)
- React or Vue.js
- Responsive design
- Git version control

**Advanced Skills:**
- TypeScript
- State management (Redux/Zustand)
- Testing (Jest, Cypress)
- Build tools (Webpack, Vite)
- Performance optimization

**12-Week Learning Path:**
- Weeks 1-2: HTML/CSS fundamentals
- Weeks 3-4: JavaScript basics
- Weeks 5-6: React fundamentals
- Weeks 7-8: State management
- Weeks 9-10: Testing & tools
- Weeks 11-12: Portfolio projects

Start building projects from week 3 onwards!`;
    }

    if (userMessage.toLowerCase().includes('skill') && userMessage.toLowerCase().includes('gap')) {
      return `Based on your current skills, here are the key gaps to address:

**Missing Skills:**
- Advanced JavaScript frameworks
- Database management
- API development
- Cloud platforms (AWS/Azure)
- DevOps basics

**Recommendation:**
Focus on one skill at a time. Start with the most relevant to your target role. Practice through real projects, not just tutorials.

**Next Steps:**
1. Choose your primary focus area
2. Find 2-3 quality learning resources
3. Set aside 1-2 hours daily for practice
4. Build projects to demonstrate skills
5. Join communities for support

Would you like specific resources for any of these skills?`;
    }

    // Default response
    return `I'm here to help with your career development! I can assist with:

- Career path guidance
- Skill gap analysis
- Learning roadmaps
- Resume advice
- Interview preparation
- Project ideas

What specific area would you like to explore? Feel free to ask about any role or skill you're interested in!`;
  }
}

export const omnidimAI = new OmnidimAI();

// Type definitions for all AI functions
export type SkillGapInput = { skills: string[]; goal: string };
export type SkillGapOutput = { missingSkills: string[]; reason: string };

export type LearningPathInput = { skills: string[]; goal: string };
export type LearningPathOutput = { learningPath: string };

export type ProjectIdeasInput = { domain?: string; level?: 'beginner'|'intermediate'|'advanced' };
export type ProjectIdeasOutput = { ideas: { title: string; description: string; skills: string[] }[] };

export type CareerFitInput = { skills: string[]; goal: string; experienceYears?: number };
export type CareerFitOutput = { readinessScore: number; explanation: string; keyGaps: string[] };

export type TrendingSkillsOutput = { skills: string[] };

export type CareerCoachInput = { query: string };
export type CareerCoachOutput = { answer: string };

// AI Functions using Omnidim AI
export async function analyzeSkillGap(input: SkillGapInput): Promise<SkillGapOutput> {
  const prompt = `Act as an industry career coach.
User wants to become a ${input.goal}.
They currently have skills: ${input.skills.join(', ')}.
Compare to current industry expectations and return strict JSON with keys: "missingSkills" (array of skill names) and "reason" (one paragraph).`;

  try {
    const response = await omnidimAI.chat({
      messages: [
        { role: 'system', content: 'You are an expert career coach. Always respond with valid JSON.' },
        { role: 'user', content: prompt }
      ]
    });

    const parsed = JSON.parse(response);
    return {
      missingSkills: parsed.missingSkills || ['JavaScript', 'React', 'Node.js'],
      reason: parsed.reason || 'These are essential skills for modern web development.'
    };
  } catch (error) {
    return {
      missingSkills: ['JavaScript', 'React', 'Node.js', 'Database Management'],
      reason: `To become a ${input.goal}, you'll need to strengthen your technical foundation with modern frameworks and tools.`
    };
  }
}

export async function generateLearningPath(input: LearningPathInput): Promise<LearningPathOutput> {
  const prompt = `Create a clear, time-phased learning roadmap for a learner who wants to become a ${input.goal}.
Current skills: ${input.skills.join(', ')}.
Structure into weeks with milestones, resources (free preferred), and practice tasks.
Return JSON with key "learningPath" as a markdown string.`;

  try {
    const response = await omnidimAI.chat({
      messages: [
        { role: 'system', content: 'You are a learning path expert. Always respond with valid JSON containing a "learningPath" key with markdown content.' },
        { role: 'user', content: prompt }
      ]
    });

    const parsed = JSON.parse(response);
    return {
      learningPath: parsed.learningPath || `# Learning Path for ${input.goal}\n\n## Week 1-2: Foundation\n- Learn basics\n- Practice daily\n\n## Week 3-4: Intermediate\n- Build projects\n- Join communities\n\n## Week 5-6: Advanced\n- Portfolio development\n- Job preparation`
    };
  } catch (error) {
    return {
      learningPath: `# 12-Week Learning Path: ${input.goal}

## Phase 1: Foundation (Weeks 1-4)
- **Week 1-2**: Core concepts and fundamentals
- **Week 3-4**: Hands-on practice with basic projects

## Phase 2: Skill Building (Weeks 5-8)
- **Week 5-6**: Intermediate concepts and tools
- **Week 7-8**: Real-world project development

## Phase 3: Mastery (Weeks 9-12)
- **Week 9-10**: Advanced techniques and best practices
- **Week 11-12**: Portfolio projects and job preparation

## Resources
- Free online courses (Coursera, edX)
- Documentation and tutorials
- Practice platforms
- Community forums

## Weekly Goals
- 10-15 hours of focused learning
- 1-2 practical projects
- Active participation in communities
- Regular skill assessment`
    };
  }
}

export async function getProjectIdeas(input: ProjectIdeasInput): Promise<ProjectIdeasOutput> {
  const domain = input.domain || 'web development';
  const level = input.level || 'beginner';
  
  const mockIdeas = [
    {
      title: "Personal Portfolio Website",
      description: "Build a responsive portfolio showcasing your skills and projects. Include contact forms and project galleries.",
      skills: ["HTML", "CSS", "JavaScript", "Responsive Design"]
    },
    {
      title: "Task Management App",
      description: "Create a todo application with user authentication and real-time updates. Perfect for learning full-stack development.",
      skills: ["React", "Node.js", "Database", "Authentication"]
    },
    {
      title: "Weather Dashboard",
      description: "Build a weather app using external APIs. Display current conditions and forecasts with interactive charts.",
      skills: ["API Integration", "JavaScript", "Data Visualization", "CSS"]
    },
    {
      title: "E-commerce Store",
      description: "Develop a complete online store with product catalog, shopping cart, and payment integration.",
      skills: ["React", "Payment APIs", "Database Design", "Security"]
    },
    {
      title: "Social Media Dashboard",
      description: "Create a dashboard to manage multiple social media accounts with analytics and scheduling features.",
      skills: ["API Integration", "Data Analysis", "UI/UX Design", "Authentication"]
    }
  ];

  return { ideas: mockIdeas };
}

export async function getCareerFit(input: CareerFitInput): Promise<CareerFitOutput> {
  const experience = input.experienceYears || 0;
  const skillCount = input.skills.length;
  
  // Simple scoring algorithm
  let score = Math.min(90, (skillCount * 10) + (experience * 15));
  
  return {
    readinessScore: score,
    explanation: score > 70 ? 
      `You're well-prepared for a ${input.goal} role with strong skills and experience.` :
      `You have a good foundation but could benefit from developing additional skills for ${input.goal}.`,
    keyGaps: score < 70 ? 
      ['Advanced technical skills', 'Industry experience', 'Portfolio projects'] :
      ['Specialized tools', 'Leadership skills']
  };
}

export async function getTrendingSkills(): Promise<TrendingSkillsOutput> {
  return {
    skills: [
      'React/Next.js',
      'TypeScript',
      'Python',
      'AWS/Cloud Computing',
      'Docker/Kubernetes',
      'Machine Learning',
      'GraphQL',
      'Cybersecurity',
      'Data Science',
      'Mobile Development'
    ]
  };
}

export async function careerCoach(input: CareerCoachInput): Promise<CareerCoachOutput> {
  const response = await omnidimAI.chat({
    messages: [
      { 
        role: 'system', 
        content: 'You are an AI Career Coach for SkillBridge. Help students with career, learning path, resume, or project advice. Keep tone friendly, motivating, and concise.' 
      },
      { role: 'user', content: input.query }
    ]
  });

  return { answer: response };
}
