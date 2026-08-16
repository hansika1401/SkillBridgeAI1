import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { logAIResponse } from '@/ai/server/logger';
import { omnidimAI } from '@/ai/omnidim-helper';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'anon';
  const rl = rateLimit(`chat:${ip}`, { limit: 30, windowMs: 60_000 });
  if (!rl.allowed) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });

  try {
    const { message, userId } = await req.json();
    if (!message || typeof message !== 'string') {
      const error = 'Invalid body. Expect { message: string, userId?: string }';
      await logAIResponse({ route: 'chat', userId: userId ?? null, ip, request: { message }, error });
      return NextResponse.json({ error }, { status: 400 });
    }

    // Use Omnidim AI with fallback to mock responses
    const reply = await omnidimAI.chat({
      messages: [
        { 
          role: 'system', 
          content: 'You are an AI Career Coach for SkillBridge. Help students with career, learning path, resume, or project advice. Keep tone friendly, motivating, and concise.' 
        },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
    });

    await logAIResponse({ route: 'chat', userId: userId ?? null, ip, request: { message }, response: { reply } });
    return NextResponse.json({ reply });
  } catch (e: any) {
    await logAIResponse({ route: 'chat', userId: null, ip, request: null, error: e?.message || 'Server error' });
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}
