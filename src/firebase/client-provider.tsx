'use client';

import React, { useState, useEffect } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { FirebaseStorage } from 'firebase/storage';
import { initializeFirebase } from '@/firebase';
import { FirebaseProvider } from './provider';

interface FirebaseClientProviderProps {
  children: React.ReactNode;
}

export const FirebaseClientProvider: React.FC<FirebaseClientProviderProps> = ({ children }) => {
  const [services, setServices] = useState<{
    firebaseApp: FirebaseApp;
    auth: Auth;
    firestore: Firestore;
    storage: FirebaseStorage;
  } | null>(null);

  useEffect(() => {
    // Firebase initialization is a client-side only operation.
    // This ensures it doesn't run during server-side rendering.
    const { firebaseApp, auth, firestore, storage } = initializeFirebase();
    setServices({ firebaseApp, auth, firestore, storage });
  }, []);

  if (!services) {
    // While services are initializing, you can render a loading state
    // or nothing to prevent server/client mismatch.
    return null; 
  }

  return (
    <FirebaseProvider
      firebaseApp={services.firebaseApp}
      auth={services.auth}
      firestore={services.firestore}
      storage={services.storage}
    >
      {children}
    </FirebaseProvider>
  );
};
