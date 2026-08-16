import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { adminDb } from '@/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

// Simulated payment checkout
// Body: { userId: string, courseId: string, amount: number, card: { number: string, expiry: string, cvv: string } }
export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'anon';
  const rl = rateLimit(`checkout:${ip}`, { limit: 10, windowMs: 60_000 });
  if (!rl.allowed) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });

  try {
    const body = await req.json();
    const { userId, courseId, amount, card } = body ?? {};
    if (!userId || !courseId || typeof amount !== 'number' || !card) {
      return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
    }

    // Simulate basic card validation (no real processing)
    if (!/^\d{12,19}$/.test(card.number.replace(/\s|-/g, '')) || !/^\d{3,4}$/.test(card.cvv)) {
      return NextResponse.json({ error: 'Invalid card details' }, { status: 400 });
    }

    // Store purchase (server-side via Admin)
    const purchases = adminDb.collection('purchases');
    const docRef = await purchases.add({
      userId,
      courseId,
      amount,
      status: 'success',
      createdAt: FieldValue.serverTimestamp(),
    });

    // Update user's purchased course IDs (server-side via Admin)
    const userRef = adminDb.doc(`users/${userId}`);
    await userRef.set(
      { purchasedCourseIds: FieldValue.arrayUnion(courseId) },
      { merge: true }
    );

    return NextResponse.json({ id: docRef.id, status: 'success' });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}
