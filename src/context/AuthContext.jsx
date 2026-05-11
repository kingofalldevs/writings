'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        // Fetch extra profile data (like subscription) from Firestore
        const { getFirestore, doc, onSnapshot } = await import('firebase/firestore');
        const db = getFirestore();
        const unsubDoc = onSnapshot(doc(db, 'users', authUser.uid), async (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUser({ ...authUser, ...data });
          } else {
            // Create the user document so the Webhook can find them by email
            const { setDoc } = await import('firebase/firestore');
            await setDoc(doc(db, 'users', authUser.uid), {
              email: authUser.email,
              displayName: authUser.displayName,
              createdAt: new Date().toISOString()
            }, { merge: true });
            
            setUser(authUser);
          }
          setLoading(false);
        });
        return () => {
          unsubDoc();
        };
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    return signInWithPopup(auth, provider);
  };

  const value = {
    user,
    signup,
    login,
    logout,
    loginWithGoogle,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
