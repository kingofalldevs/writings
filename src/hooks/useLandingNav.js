'use client';
import { useRouter } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

/**
 * Provides a consistent set of navigation callbacks for all landing pages.
 * Also manages the auth modal open state for "Get Started" / "Sign in" flows.
 */
export function useLandingNav() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Auto-redirect to dashboard if user is logged in
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const nav = {
    onStart:      useCallback(() => {
      if (user) {
        router.push('/dashboard');
      } else {
        setIsAuthOpen(true);
      }
    }, [user, router]),
    onBack:       useCallback(() => router.push('/'), [router]),
    onPricing:    useCallback(() => router.push('/pricing'), [router]),
    onAria:       useCallback(() => router.push('/aria'), [router]),
    onPhilosophy: useCallback(() => router.push('/philosophy'), [router]),
    onTerms:      useCallback(() => router.push('/terms'), [router]),
    onPrivacy:    useCallback(() => router.push('/privacy'), [router]),
    onRefund:     useCallback(() => router.push('/refund'), [router]),
    onAccount:    useCallback(() => router.push('/account'), [router]),
  };

  return { nav, isAuthOpen, setIsAuthOpen };
}
