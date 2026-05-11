'use client';
import { useLandingNav } from '@/hooks/useLandingNav';
import PhilosophyPage from '@/components/PhilosophyPage';
import AuthModal from '@/components/AuthModal';

export default function PhilosophyRoute() {
  const { nav, isAuthOpen, setIsAuthOpen } = useLandingNav();

  return (
    <>
      <PhilosophyPage
        onStart={nav.onStart}
        onBack={nav.onBack}
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
