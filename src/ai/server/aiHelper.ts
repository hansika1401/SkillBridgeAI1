import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Skill gap from skills[] + goal
export type SkillGapInput = { skills: string[]; goal: string };
export type SkillGapOutput = { missingSkills: string[]; reason: string };

const skillGapPrompt = ai.definePrompt({
  name: 'skillGapPrompt',
  input: { schema: z.object({ skills: z.array(z.string()), goal: z.string() }) },
  output: { schema: z.object({ missingSkills: z.array(z.string()), reason: z.string() }) },
  prompt: `Act as an industry career coach.
User wants to become a {{{goal}}}.
They currently have skills: {{{skills}}}.
Compare to current industry expectations and return strict JSON with keys: "missingSkills" (array of skill names) and "reason" (one paragraph).`,
});

export async function analyzeSkillGap(input: SkillGapInput): Promise<SkillGapOutput> {
  const { output } = await skillGapPrompt({ skills: input.skills, goal: input.goal });
  return output!;
}

// Learning path from skills[] + goal (reuses existing flow-friendly format)
export type LearningPathInput = { skills: string[]; goal: string };
export type LearningPathOutput = { learningPath: string };

const learningPathPrompt = ai.definePrompt({
  name: 'learningPathPrompt',
  input: { schema: z.object({ skills: z.array(z.string()), goal: z.string() }) },
  output: { schema: z.object({ learningPath: z.string() }) },
  prompt: `Create a clear, time-phased learning roadmap for a learner who wants to become a {{{goal}}}.
Current skills: {{{skills}}}.
Structure into weeks with milestones, resources (free preferred), and practice tasks.
Return JSON with key "learningPath" as a markdown string.`,
});

export async function generateLearningPath(input: LearningPathInput): Promise<LearningPathOutput> {
  const { output } = await learningPathPrompt(input);
  return output!;
}

// Project ideas
export type ProjectIdeasInput = { domain?: string; level?: 'beginner'|'intermediate'|'advanced' };
export type ProjectIdeasOutput = { ideas: { title: string; description: string; skills: string[] }[] };

const projectIdeasPrompt = ai.definePrompt({
  name: 'projectIdeasPrompt',
  input: { schema: z.object({ domain: z.string().optional(), level: z.enum(['beginner','intermediate','advanced']).optional() }) },
  output: { schema: z.object({ ideas: z.array(z.object({ title: z.string(), description: z.string(), skills: z.array(z.string()) })) }) },
  prompt: `Suggest 5 hands-on project ideas${'${domain ? ` in ${domain}` : ""}'} for ${'${level ?? "beginner"}'} learners.
Each idea must include title, 2-sentence description, and 3-6 core skills.
Return JSON: { "ideas": [...] }.`,
});

export async function getProjectIdeas(input: ProjectIdeasInput): Promise<ProjectIdeasOutput> {
  const { output } = await projectIdeasPrompt(input as any);
  return output!;
}

// Career fit score
export type CareerFitInput = { skills: string[]; goal: string; experienceYears?: number };
export type CareerFitOutput = { readinessScore: number; explanation: string; keyGaps: string[] };

const careerFitPrompt = ai.definePrompt({
  name: 'careerFitPrompt',
  input: { schema: z.object({ skills: z.array(z.string()), goal: z.string(), experienceYears: z.number().optional() }) },
  output: { schema: z.object({ readinessScore: z.number(), explanation: z.string(), keyGaps: z.array(z.string()) }) },
  prompt: `Estimate readiness for role {{{goal}}} on a 0-100 scale.
Given skills: {{{skills}}} and years of experience: {{{experienceYears}}}.
Return JSON with keys: "readinessScore" (int), "explanation" (short), "keyGaps" (array).`,
});

export async function getCareerFit(input: CareerFitInput): Promise<CareerFitOutput> {
  const { output } = await careerFitPrompt(input);
  return output!;
}

// Trending skills
export type TrendingSkillsOutput = { skills: string[] };

const trendingSkillsPrompt = ai.definePrompt({
  name: 'trendingSkillsPrompt',
  input: { schema: z.object({}) },
  output: { schema: z.object({ skills: z.array(z.string()) }) },
  prompt: `List 10 trending tech skills across web, data, AI, cloud and mobile. Return JSON { "skills": [...] }.`,
});

export async function getTrendingSkills(): Promise<TrendingSkillsOutput> {
  const { output } = await trendingSkillsPrompt({});
  return output!;
}
