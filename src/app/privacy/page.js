'use client';
import { useLandingNav } from '@/hooks/useLandingNav';
import PrivacyPage from '@/components/PrivacyPage';
import AuthModal from '@/components/AuthModal';

export default function PrivacyRoute() {
  const { nav, isAuthOpen, setIsAuthOpen } = useLandingNav();

  return (
    <>
      <PrivacyPage
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
