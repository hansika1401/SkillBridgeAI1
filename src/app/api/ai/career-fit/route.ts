import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { careerFit, skillGap } from '@/ai/server/aiService';
import { fetchUserProfile, matchMentors } from '@/ai/server/data';
import { logAIResponse } from '@/ai/server/logger';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'anon';
  const rl = rateLimit(`career-fit:${ip}`);
  if (!rl.allowed) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });

  try {
    const body = await req.json();
    let { skills, goal, experienceYears, userId } = body ?? {} as any;
    if ((!Array.isArray(skills) || !goal) && userId) {
      const profile = await fetchUserProfile(userId);
      skills = Array.isArray(skills) ? skills : (profile?.skills ?? []);
      goal = goal || profile?.goal;
    }
    if (!Array.isArray(skills) || !goal) {
      const error = 'Invalid body. Expect { skills: string[], goal: string, experienceYears?: number, userId?: string }';
      await logAIResponse({ route: 'career-fit', userId: userId ?? null, ip, request: body, error });
      return NextResponse.json({ error }, { status: 400 });
    }

    const fit = await careerFit({ skills, goal, experienceYears });
    const gap = await skillGap({ skills, goal });
    const mentors = await matchMentors(gap.missingSkills ?? [], 5);
    const response = { ...fit, missingSkills: gap.missingSkills, mentors };
    await logAIResponse({ route: 'career-fit', userId: userId ?? null, ip, request: { skills, goal, experienceYears }, response });
    return NextResponse.json(response);
  } catch (e: any) {
    await logAIResponse({ route: 'career-fit', userId: null, ip, request: null, error: e?.message || 'Server error' });
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}
