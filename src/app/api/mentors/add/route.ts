import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { db } from '@/ai/server/data';
import { addDoc, collection } from 'firebase/firestore';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'anon';
  const rl = rateLimit(`mentors:add:${ip}`, { limit: 20, windowMs: 60_000 });
  if (!rl.allowed) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });

  const adminHeader = req.headers.get('x-admin-token') || '';
  const adminEnv = process.env.ADMIN_TOKEN || '';
  if (!adminEnv || adminHeader !== adminEnv) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { name, skills = [], location = '', available = true, bio = '', avatar = '' } = body ?? {};
    if (!name || !Array.isArray(skills) || !skills.length) {
      return NextResponse.json({ error: 'name and skills[] are required' }, { status: 400 });
    }
    const ref = await addDoc(collection(db, 'mentors'), { name, skills, location, available, bio, avatar });
    return NextResponse.json({ id: ref.id, name, skills, location, available, bio, avatar }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}
