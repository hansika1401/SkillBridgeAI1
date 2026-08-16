import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/ai/server/data';
import { collection, getDocs } from 'firebase/firestore';
import { rateLimit } from '@/lib/rate-limit';

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'anon';
  const rl = rateLimit(`mentors:${ip}`, { limit: 60, windowMs: 60_000 });
  if (!rl.allowed) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });

  try {
    const snaps = await getDocs(collection(db, 'mentors'));
    const mentors = snaps.docs.map(d => ({ id: d.id, ...d.data() }));
    return NextResponse.json({ mentors });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}
