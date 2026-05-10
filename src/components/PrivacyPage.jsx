import React from 'react';
import { motion } from 'framer-motion';
import LandingNav from './landing/LandingNav';
import LandingFooter from './landing/LandingFooter';

const PrivacyPage = ({ onBack, onPricing, onAria, onPhilosophy, onTerms, onPrivacy, onStart }) => {
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
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">Privacy Policy</h1>
          <p className="text-lg opacity-60 mb-12 leading-relaxed">Last Updated: May 2026</p>

          <div className="space-y-12 opacity-80 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold mb-4">1. Data Collection</h2>
              <p>We collect minimal information required to provide our services: email addresses for authentication and your writing content to enable cloud sync and Ideabase features.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">2. Use of Data</h2>
              <p>Your data is used solely to provide you with the best experience like (syncing documents between devices, ideabase features etc). We do not sell your personal information or your writing content to third parties.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">3. AI Features - Optional to User</h2>
              <p>When using Aria (AI Assistant), context from your documents may be processed by AI models to provide assistance. This data is not used to train global AI models.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">4. Security</h2>
              <p>We implement industry-standard security measures to protect your data..</p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">5. Your Rights</h2>
              <p>You have the right to access, export, or delete your data at any time through the account settings or by contacting our support team.</p>
            </section>
          </div>
        </motion.div>
      </div>

      <LandingFooter onTerms={onTerms} onPrivacy={onPrivacy} />
    </div>
  );
};

export default PrivacyPage;
