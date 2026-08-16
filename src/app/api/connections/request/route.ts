import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { adminDb } from '@/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'anon';
  const rl = rateLimit(`connreq:${ip}`, { limit: 60, windowMs: 60_000 });
  if (!rl.allowed) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });

  try {
    const body = await req.json();
    const { userId, mentorId } = body ?? {};
    if (!userId || !mentorId) {
      return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
    }

    const col = adminDb.collection('connectionRequests');
    const docRef = await col.add({
      userId,
      mentorId,
      status: 'pending',
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ id: docRef.id, status: 'pending' });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}
