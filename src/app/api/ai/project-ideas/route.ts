import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { projectIdeas } from '@/ai/server/aiService';
import { logAIResponse } from '@/ai/server/logger';

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'anon';
  const rl = rateLimit(`project-ideas:${ip}`);
  if (!rl.allowed) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });

  try {
    const { searchParams } = new URL(req.url);
    const domain = searchParams.get('domain') || undefined;
    const level = (searchParams.get('level') as any) || undefined;
    const userId = searchParams.get('userId') || undefined;
    const data = await projectIdeas({ domain, level });
    await logAIResponse({ route: 'project-ideas', userId: userId ?? null, ip, request: { domain, level }, response: data });
    return NextResponse.json(data);
  } catch (e: any) {
    await logAIResponse({ route: 'project-ideas', userId: null, ip, request: null, error: e?.message || 'Server error' });
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}
