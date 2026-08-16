import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/ai/server/data';
import { doc, getDoc } from 'firebase/firestore';

export async function POST(req: NextRequest) {
  try {
    const { userId, email } = await req.json();
    if (!userId || !email) {
      return NextResponse.json({ error: 'userId and email are required' }, { status: 400 });
    }
    const ref = doc(db, 'users', userId);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const token = `dev.${userId}`;
    return NextResponse.json({ token });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}
