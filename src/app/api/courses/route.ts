import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { db } from '@/ai/server/data';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

// GET /api/courses
// Returns available courses from Firestore. If none exist, seeds a default
// "100% Placement Course" and returns it.
export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'anon';
  const rl = rateLimit(`courses:list:${ip}`, { limit: 60, windowMs: 60_000 });
  if (!rl.allowed) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });

  try {
    const coursesCol = collection(db, 'courses');
    const snap = await getDocs(coursesCol);

    if (snap.empty) {
      // Seed default course
      const payload = {
        id: 'placement_100',
        title: '100% Placement Course',
        description: 'Get guaranteed placement with SkillBridge AI Coaching',
        price: 4999,
        placementGuarantee: true,
        createdAt: serverTimestamp(),
      };
      await addDoc(coursesCol, payload as any);
      return NextResponse.json({ courses: [payload] });
    }

    const courses = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
    return NextResponse.json({ courses });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}
