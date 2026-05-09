import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';

const SubscriptionContext = createContext(null);

export const SubscriptionProvider = ({ children }) => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    // Listen to user's subscription in real-time
    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (snap) => {
      if (snap.exists()) {
        setSubscription(snap.data()?.subscription || null);
      } else {
        setSubscription(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const isActive = subscription?.status === 'active' || subscription?.status === 'trialing';
  const plan = subscription?.plan || null; // 'zen' | 'crescendo' | 'purist' | null

  return (
    <SubscriptionContext.Provider value={{ subscription, loading, isActive, plan }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => useContext(SubscriptionContext);
