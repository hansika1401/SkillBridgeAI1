import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { db } from '@/ai/server/data';
import { collection, getDocs } from 'firebase/firestore';

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'anon';
  const rl = rateLimit(`connections:summary:${ip}`, { limit: 60, windowMs: 60_000 });
  if (!rl.allowed) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });

  try {
    const mentorsSnap = await getDocs(collection(db, 'mentors'));
    // Optional collections if present; otherwise defaults to 0
    let students = 0;
    let companies = 0;
    try {
      const sSnap = await getDocs(collection(db, 'students'));
      students = sSnap.size;
    } catch {}
    try {
      const cSnap = await getDocs(collection(db, 'companies'));
      companies = cSnap.size;
    } catch {}

    return NextResponse.json({ mentors: mentorsSnap.size, students, companies });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}
