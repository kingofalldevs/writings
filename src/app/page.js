'use client';
import { useLandingNav } from '@/hooks/useLandingNav';
import LandingPage from '@/components/LandingPage';
import AuthModal from '@/components/AuthModal';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { nav, isAuthOpen, setIsAuthOpen } = useLandingNav();
  const { user } = useAuth();

  return (
    <>
      <LandingPage
        user={user}
        onAccount={nav.onAccount}
        onStart={nav.onStart}
        onPricing={nav.onPricing}
        onAria={nav.onAria}
        onPhilosophy={nav.onPhilosophy}
        onTerms={nav.onTerms}
        onPrivacy={nav.onPrivacy}
        onRefund={nav.onRefund}
      />
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onTerms={nav.onTerms}
        onPrivacy={nav.onPrivacy}
      />
    </>
  );
}
