'use server';

/**
 * @fileOverview An AI career coach that answers questions about skills needed for specific roles.
 *
 * - aiInteractiveCareerCoach - A function that handles the career coaching process.
 * - AIInteractiveCareerCoachInput - The input type for the aiInteractiveCareerCoach function.
 * - AIInteractiveCareerCoachOutput - The return type for the aiInteractiveCareerCoach function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIInteractiveCareerCoachInputSchema = z.object({
  query: z.string().describe('The question about skills needed for a specific role.'),
});
export type AIInteractiveCareerCoachInput = z.infer<
  typeof AIInteractiveCareerCoachInputSchema
>;

const AIInteractiveCareerCoachOutputSchema = z.object({
  answer: z.string().describe('The answer to the question.'),
});
export type AIInteractiveCareerCoachOutput = z.infer<
  typeof AIInteractiveCareerCoachOutputSchema
>;

export async function aiInteractiveCareerCoach(
  input: AIInteractiveCareerCoachInput
): Promise<AIInteractiveCareerCoachOutput> {
  return aiInteractiveCareerCoachFlow(input);
}

const analyzeSkillsPrompt = ai.definePrompt({
  name: 'analyzeSkillsPrompt',
  input: {schema: AIInteractiveCareerCoachInputSchema},
  output: {schema: AIInteractiveCareerCoachOutputSchema},
  prompt: `You are an AI career coach. Answer the following question about skills needed for a specific role:

Question: {{{query}}}

Answer: `,
});

const aiInteractiveCareerCoachFlow = ai.defineFlow(
  {
    name: 'aiInteractiveCareerCoachFlow',
    inputSchema: AIInteractiveCareerCoachInputSchema,
    outputSchema: AIInteractiveCareerCoachOutputSchema,
  },
  async input => {
    const {output} = await analyzeSkillsPrompt(input);
    return output!;
  }
);
