import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { trendingSkills } from '@/ai/server/aiService';

export async function GET(request: Request) {
  const ip = (request.headers.get('x-forwarded-for')) || 'anon';
  const rl = rateLimit(`trending-skills:${ip}`);
  if (!rl.allowed) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });

  try {
    const data = await trendingSkills();
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}
