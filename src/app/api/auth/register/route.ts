import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/ai/server/data';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      name,
      mobile,
      degree,
      college,
      email,
      password,
      confirmPassword,
      skills = [],
      goal = '',
    } = body ?? {};

    if (!email || !password || !confirmPassword) {
      return NextResponse.json({ error: 'email, password and confirmPassword are required' }, { status: 400 });
    }
    if (password !== confirmPassword) {
      return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
    }
    if (!name || !mobile || !degree || !college) {
      return NextResponse.json({ error: 'name, mobile, degree and college are required' }, { status: 400 });
    }

    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

    let finalUserId = userId;
    if (!finalUserId) {
      const docRef = await addDoc(collection(db, 'users'), {
        name,
        mobile,
        degree,
        college,
        email,
        passwordHash,
        skills,
        goal,
        createdAt: Date.now(),
      });
      finalUserId = docRef.id;
    } else {
      const ref = doc(db, 'users', finalUserId);
      await setDoc(ref, {
        name,
        mobile,
        degree,
        college,
        email,
        passwordHash,
        skills,
        goal,
        createdAt: Date.now(),
      }, { merge: true });
    }

    return NextResponse.json({ ok: true, user: { userId: finalUserId, name, mobile, degree, college, email, skills, goal } });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}
