'use client';
import { useLandingNav } from '@/hooks/useLandingNav';
import AriaPage from '@/components/AriaPage';
import AuthModal from '@/components/AuthModal';

export default function AriaRoute() {
  const { nav, isAuthOpen, setIsAuthOpen } = useLandingNav();

  return (
    <>
      <AriaPage
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
