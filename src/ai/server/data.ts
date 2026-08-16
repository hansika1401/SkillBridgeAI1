import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, getDoc, collection, query, where, limit, getDocs } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const db = getFirestore(app);

export type UserProfile = {
  skills?: string[];
  goal?: string;
  [k: string]: any;
};

export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const ref = doc(db, 'users', userId);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as UserProfile) : null;
  } catch {
    return null;
  }
}

type Mentor = { id: string; name?: string; skills?: string[]; available?: boolean; [k: string]: any };

export async function matchMentors(requiredSkills: string[], take: number = 5): Promise<Mentor[]> {
  if (!requiredSkills?.length) return [];
  try {
    const mentorsCol = collection(db, 'mentors');
    const q = query(mentorsCol, where('skills', 'array-contains-any', requiredSkills), limit(Math.max(take, 1)));
    const snaps = await getDocs(q);
    const list: Mentor[] = [];
    snaps.forEach(s => {
      const data = s.data() as any;
      if (data?.available !== false) {
        list.push({ id: s.id, ...data });
      }
    });
    // Rank by overlap count
    return list
      .map(m => ({ m, score: (m.skills || []).filter(s => requiredSkills.includes(s)).length }))
      .sort((a, b) => b.score - a.score)
      .map(x => x.m)
      .slice(0, take);
  } catch {
    return [];
  }
}
