import { NextRequest, NextResponse } from 'next/server';
import { fetchUserProfile } from '@/ai/server/data';

function parseUserIdFromAuth(req: NextRequest): string | null {
  const auth = req.headers.get('authorization') || '';
  const parts = auth.split(' ');
  if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
    const token = parts[1];
    // Dev token format: dev.<userId>
    if (token.startsWith('dev.')) return token.slice(4);
  }
  return null;
}

export async function GET(req: NextRequest) {
  const userId = parseUserIdFromAuth(req);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const profile = await fetchUserProfile(userId);
  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }
  return NextResponse.json({ userId, ...profile });
}
