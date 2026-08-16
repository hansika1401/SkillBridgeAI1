import { 
  analyzeSkillGap, 
  CareerFitInput, 
  getCareerFit, 
  getProjectIdeas, 
  getTrendingSkills, 
  generateLearningPath, 
  LearningPathInput, 
  ProjectIdeasInput 
} from '../omnidim-helper';

// In the future, integrate Firebase (mentor/user) here
// export async function fetchUserProfile(userId: string) { ... }
// export async function matchMentors(skills: string[]) { ... }

// Export named async functions instead of an object to avoid 'use server' restrictions propagating.
export async function skillGap(input: { skills: string[]; goal: string }) {
  return analyzeSkillGap(input);
}

export async function learningPath(input: LearningPathInput) {
  return generateLearningPath(input);
}

export async function projectIdeas(input: ProjectIdeasInput) {
  return getProjectIdeas(input);
}

export async function careerFit(input: CareerFitInput) {
  return getCareerFit(input);
}

export async function trendingSkills() {
  return getTrendingSkills();
}
