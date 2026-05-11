'use client';
import { useLandingNav } from '@/hooks/useLandingNav';
import PricingPage from '@/components/PricingPage';
import AuthModal from '@/components/AuthModal';

export default function PricingRoute() {
  const { nav, isAuthOpen, setIsAuthOpen } = useLandingNav();

  return (
    <>
      <PricingPage
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
