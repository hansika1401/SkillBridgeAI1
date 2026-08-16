import { db } from './data';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

export async function logAIResponse(params: {
  route: string;
  userId?: string | null;
  ip?: string | null;
  request: any;
  response?: any;
  error?: string | null;
}) {
  try {
    const docRef = collection(db, 'aiResponses');
    await addDoc(docRef, {
      route: params.route,
      userId: params.userId || null,
      ip: params.ip || null,
      provider: 'genkit/gemini-2.5-flash',
      request: params.request,
      response: params.response ?? null,
      error: params.error ?? null,
      createdAt: serverTimestamp(),
    });
  } catch {
    // Swallow logging failures
  }
}
