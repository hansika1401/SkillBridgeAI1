import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { skillGap } from '@/ai/server/aiService';
import { fetchUserProfile, matchMentors } from '@/ai/server/data';
import { logAIResponse } from '@/ai/server/logger';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'anon';
  const rl = rateLimit(`skillgap:${ip}`);
  if (!rl.allowed) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });

  try {
    const body = await req.json();
    let { skills, goal, userId } = body ?? {} as any;

    if ((!Array.isArray(skills) || !goal) && userId) {
      const profile = await fetchUserProfile(userId);
      skills = Array.isArray(skills) ? skills : (profile?.skills ?? []);
      goal = goal || profile?.goal;
    }
    if (!Array.isArray(skills) || !goal) {
      const error = 'Invalid body. Expect { skills: string[], goal: string, userId?: string }';
      await logAIResponse({ route: 'skillgap', userId: userId ?? null, ip, request: body, error });
      return NextResponse.json({ error }, { status: 400 });
    }

    const data = await skillGap({ skills, goal });
    const mentors = await matchMentors(data.missingSkills ?? [], 5);
    const response = { ...data, mentors };
    await logAIResponse({ route: 'skillgap', userId: userId ?? null, ip, request: { skills, goal }, response });
    return NextResponse.json(response);
  } catch (e: any) {
    await logAIResponse({ route: 'skillgap', userId: null, ip, request: null, error: e?.message || 'Server error' });
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}
