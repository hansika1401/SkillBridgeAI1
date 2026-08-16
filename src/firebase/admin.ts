import { getApps, initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { firebaseConfig } from '@/firebase/config';

function getCredential() {
  // Prefer explicit service account if provided
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (raw) {
    try {
      // Allow base64-encoded or plain JSON
      const json = JSON.parse(Buffer.from(raw, raw.trim().startsWith('{') ? 'utf8' : 'base64').toString('utf8'));
      return cert(json as any);
    } catch {
      // Fall through to application default
    }
  }
  // Otherwise rely on ADC via GOOGLE_APPLICATION_CREDENTIALS or environment
  return applicationDefault();
}

// Initialize Admin SDK once per server runtime
const adminApp = getApps().length ? getApps()[0] : initializeApp({
  credential: getCredential(),
  // Ensure projectId is set even if ADC doesn't provide it
  projectId: process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT || firebaseConfig.projectId,
});

export const adminDb = getFirestore(adminApp);
