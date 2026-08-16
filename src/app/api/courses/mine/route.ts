import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/ai/server/data';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { rateLimit } from '@/lib/rate-limit';

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'anon';
  const rl = rateLimit(`courses:mine:${ip}`, { limit: 60, windowMs: 60_000 });
  if (!rl.allowed) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

    // Try to read purchased course IDs from the user document (real-time friendly)
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    const purchasedIds: string[] = (userSnap.exists() && Array.isArray((userSnap.data() as any)?.purchasedCourseIds))
      ? (userSnap.data() as any).purchasedCourseIds
      : [];

    let purchases: Array<{ id: string; courseId: string; status: string }>; 
    if (purchasedIds.length > 0) {
      purchases = purchasedIds.map((cid, i) => ({ id: `user-${i}`, courseId: cid, status: 'success' }));
    } else {
      // Fallback to purchases collection if user doc has no list yet
      const purchasesSnap = await getDocs(query(collection(db, 'purchases'), where('userId', '==', userId)));
      purchases = purchasesSnap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
    }

    // Catalog of known courses (expandable)
    const catalog: Record<string, any> = {
      placement_100: {
        id: 'placement_100',
        title: '100% Placement Course',
        price: 4999,
        description: 'Job-ready training with mentor guidance and guaranteed placement support.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      },
      python_placement: {
        id: 'python_placement',
        title: 'Python Career Accelerator (100% Placement Support)',
        price: 4599,
        description: 'Master Python with projects, interviews, and dedicated mentor support.',
        videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw',
      },
      cloud_placement: {
        id: 'cloud_placement',
        title: 'Cloud Engineer Bootcamp (100% Placement Support)',
        price: 5299,
        description: 'Hands-on AWS/GCP labs, DevOps, and interview prep with mentors.',
        videoUrl: 'https://www.youtube.com/embed/kGx5Q7EwC1A',
      },
      uiux_placement: {
        id: 'uiux_placement',
        title: 'UI/UX Designer Pro Track (100% Placement Support)',
        price: 4899,
        description: 'Design systems, Figma mastery, and portfolio with mentor reviews.',
        videoUrl: 'https://www.youtube.com/embed/c9Wg6Cb_YlU',
      },
      data_analyst_placement: {
        id: 'data_analyst_placement',
        title: 'Data Analyst FastTrack (100% Placement Support)',
        price: 5499,
        description: 'SQL, Excel, BI tools, and case interviews with mentor backing.',
        videoUrl: 'https://www.youtube.com/embed/mla9j2d7W0k',
      },
    };

    const courses = purchases
      .filter(p => p.status === 'success')
      .map(p => ({ ...catalog[p.courseId], purchaseId: p.id, progress: 0 }));

    return NextResponse.json({ courses });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}
