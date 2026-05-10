import LandingHero from './landing/LandingHero';
import LandingNav from './landing/LandingNav';
import LandingProduct from './landing/LandingProduct';
import LandingExport from './landing/LandingExport';
import LandingReviews from './landing/LandingReviews';
import LandingCTA from './landing/LandingCTA';
import LandingFAQ from './landing/LandingFAQ';
import LandingFooter from './landing/LandingFooter';
import LandingDomainClaim from './landing/LandingDomainClaim';

const LandingPage = ({ user, onAccount, onStart, onPricing, onAria, onPhilosophy, onTerms, onPrivacy }) => {
  return (
    <div className="relative flex flex-col overflow-x-hidden bg-background min-h-screen w-screen">


      {/* Nav: fixed height at top */}
      <LandingNav 
        user={user}
        onAccountClick={onAccount}
        onStart={onStart} 
        onPricingClick={onPricing} 
        onAriaClick={onAria} 
        onPhilosophyClick={onPhilosophy}
        onHomeClick={() => {}} 
      />

      {/* Hero Section */}
      <div className="relative z-10 w-full flex flex-col items-center">
        <LandingHero onStart={onStart} />
      </div>

      {/* Start with Product Showcase Section */}
      <div className="relative z-10 w-full bg-foreground/[0.01]">
        <LandingProduct />
      </div>

      {/* Domain Claim Section */}
      <div className="relative z-10 w-full">
        <LandingDomainClaim onStart={onStart} />
      </div>

      {/* Export Workflow Section */}
      <div className="relative z-10 w-full">
        <LandingExport />
      </div>

      {/* Reviews Section */}
      <div className="relative z-10 w-full bg-foreground/[0.01]">
        <LandingReviews />
      </div>

      <div className="relative z-10 w-full">
        <LandingCTA onStart={onStart} />
      </div>

      {/* FAQ Section */}
      <div className="relative z-10 w-full bg-foreground/[0.01]">
        <LandingFAQ />
      </div>

      {/* Footer: fixed height at bottom */}
      <LandingFooter onTerms={onTerms} onPrivacy={onPrivacy} />
    </div>
  );
};

export default LandingPage;
