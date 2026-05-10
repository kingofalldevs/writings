import React from 'react';
import { motion } from 'framer-motion';
import LandingNav from './landing/LandingNav';
import LandingFooter from './landing/LandingFooter';

const RefundPage = ({ onStart, onBack, onPricing, onAria, onPhilosophy, onTerms, onPrivacy, onRefund }) => {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent/20 flex flex-col">
      <LandingNav 
        onStart={onStart} 
        onHomeClick={onBack} 
        onPricingClick={onPricing} 
        onAriaClick={onAria}
        onPhilosophyClick={onPhilosophy}
      />

      <div className="flex-grow max-w-3xl mx-auto px-6 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">Refund Policy</h1>
          <p className="text-lg opacity-60 mb-12 leading-relaxed">Last Updated: May 2026</p>

          <div className="space-y-12 opacity-80 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold mb-4">1. Satisfaction Guarantee</h2>
              <p>We stand behind our product and your satisfaction is extremely important to us. If you are not completely satisfied with Writings, we offer a guaranteed 50% refund on your recent purchase.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">2. Subscription Cancellations</h2>
              <p>You may cancel your subscription at any time. Your cancellation will take effect at the end of the current paid term. If you cancel and are unsatisfied, you may request the 50% refund for your most recent payment.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">3. Eligibility Window</h2>
              <p>Refund requests must be made within 30 days of your original purchase or latest subscription renewal. Refund requests outside of this window will not be accommodated.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">4. Contact Us</h2>
              <p>If you would like to request a refund, please contact our support team at <a href="mailto:support@writings.page" className="text-accent underline hover:opacity-80">support@writings.page</a> with your account details and let us know how we failed to meet your expectations.</p>
            </section>
          </div>
        </motion.div>
      </div>

      <LandingFooter onTerms={onTerms} onPrivacy={onPrivacy} onRefund={onRefund} />
    </div>
  );
};

export default RefundPage;
