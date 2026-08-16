"use server";

import {
  careerCoach,
  CareerCoachInput,
  CareerCoachOutput,
} from '@/ai/omnidim-helper';
import {
  analyzeSkillGaps as analysisFlow,
  AnalyzeSkillGapsInput,
  AnalyzeSkillGapsOutput,
} from '@/ai/flows/ai-skill-gap-analysis';

// Updated to use Omnidim AI
export type AIInteractiveCareerCoachInput = CareerCoachInput;
export type AIInteractiveCareerCoachOutput = CareerCoachOutput;

export async function aiInteractiveCareerCoach(
  input: AIInteractiveCareerCoachInput
): Promise<AIInteractiveCareerCoachOutput> {
  try {
    const result = await careerCoach(input);
    return result;
  } catch (error) {
    console.error("Error in aiInteractiveCareerCoach:", error);
    const msg = error instanceof Error ? error.message : String(error);
    // Provide a friendly, actionable message without leaking secrets
    return { answer: `I'm here to help with your career questions! I can provide guidance on skills, learning paths, and career development. What would you like to know?` };
  }
}

export async function analyzeSkillGaps(
  input: AnalyzeSkillGapsInput
): Promise<AnalyzeSkillGapsOutput> {
  try {
    const result = await analysisFlow(input);
    return result;
  } catch (error) {
    console.error("Error in analyzeSkillGaps:", error);
    // Return empty arrays so UI can hide these sections gracefully
    return {
      skillGaps: [],
      recommendedLearningPaths: [],
      relatedSkills: [],
    };
  }
}

export async function myServerAction() {
  // your code here
}
