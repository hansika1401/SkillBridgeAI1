'use server';

/**
 * @fileOverview AI-powered skill gap analysis flow.
 *
 * - analyzeSkillGaps - A function that analyzes a user's profile and identifies skill gaps.
 * - AnalyzeSkillGapsInput - The input type for the analyzeSkillGaps function.
 * - AnalyzeSkillGapsOutput - The return type for the analyzeSkillGaps function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSkillGapsInputSchema = z.object({
  profileDescription: z
    .string()
    .describe("A detailed description of the user's skills, education, and experience."),
  desiredJob: z.string().describe('The user’s desired job or career path.'),
});
export type AnalyzeSkillGapsInput = z.infer<typeof AnalyzeSkillGapsInputSchema>;

const AnalyzeSkillGapsOutputSchema = z.object({
  skillGaps: z
    .array(z.string())
    .describe('A list of skills the user is missing to achieve their desired job.'),
  recommendedLearningPaths: z
    .array(z.string())
    .describe('Recommended learning paths to acquire the missing skills.'),
  relatedSkills: z
    .array(z.string())
    .describe('A list of skills related to the user')
});
export type AnalyzeSkillGapsOutput = z.infer<typeof AnalyzeSkillGapsOutputSchema>;

export async function analyzeSkillGaps(input: AnalyzeSkillGapsInput): Promise<AnalyzeSkillGapsOutput> {
  return analyzeSkillGapsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSkillGapsPrompt',
  input: {schema: AnalyzeSkillGapsInputSchema},
  output: {schema: AnalyzeSkillGapsOutputSchema},
  prompt: `You are an AI career coach. A student will provide you with their profile description and their desired job.

You will analyze their profile and identify skill gaps that they need to fill to achieve their desired job.  You will respond with a list of skill gaps, recommended learning paths, and skills related to the user.

Profile Description: {{{profileDescription}}}
Desired Job: {{{desiredJob}}}

Consider these constraints:
*   Do not provide a generic response.  The response needs to be highly specific to the student.  For example, if the student is missing SQL skills, be specific about what type of SQL skills they are missing (e.g. writing SQL queries, designing schemas, etc.).
*   The student is very busy and can only focus on a few things at a time.  Do not provide a list of more than 5 skill gaps, 5 recommended learning paths, and 5 related skills.
*   The student does not have infinite time or money.  Consider free options first.  For example, if the student needs to learn Python, recommend free online courses first before recommending expensive bootcamps.
`,
});

const analyzeSkillGapsFlow = ai.defineFlow(
  {
    name: 'analyzeSkillGapsFlow',
    inputSchema: AnalyzeSkillGapsInputSchema,
    outputSchema: AnalyzeSkillGapsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
