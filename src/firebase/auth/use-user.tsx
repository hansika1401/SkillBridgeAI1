'use client';

import {useEffect, useState} from 'react';
import {User, onAuthStateChanged} from 'firebase/auth';

import { useAuth } from '@/firebase';

export function useUser() {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true); // Start loading until we know

  useEffect(() => {
    // This effect runs only on the client
    if (!auth) {
      // If auth is not available, it might be because Firebase is still initializing.
      // We shouldn't set loading to false here, but wait for auth to be available.
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, user => {
      setUser(user);
      setIsUserLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  return {user, isUserLoading};
}
