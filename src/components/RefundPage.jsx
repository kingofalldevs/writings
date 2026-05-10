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
              <h2 className="text-xl font-bold mb-4">1. General Refund Policy</h2>
              <p>We stand behind our product and your satisfaction with it is important to us. However, because our product is a digital good delivered via Internet download we generally offer no refunds.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">2. Subscription Cancellations</h2>
              <p>You may cancel your subscription at any time. Your cancellation will take effect at the end of the current paid term. If you have any questions or are unsatisfied with the product, please contact us.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">3. Exceptions</h2>
              <p>Refund requests made within 14 days of your original purchase may be considered on a case-by-case basis and granted at the sole discretion of our team. No refunds will be provided after 14 days from the original purchase.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">4. Contact Us</h2>
              <p>If you would like to request a refund, please contact our support team with your account details and the reason for your request.</p>
            </section>
          </div>
        </motion.div>
      </div>

      <LandingFooter onTerms={onTerms} onPrivacy={onPrivacy} onRefund={onRefund} />
    </div>
  );
};

export default RefundPage;
