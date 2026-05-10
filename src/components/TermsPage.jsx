import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const TermsPage = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent/20">
      <div className="max-w-3xl mx-auto px-6 py-20 md:py-32">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 opacity-40 hover:opacity-100 transition-opacity mb-12 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">Terms of Service</h1>
          <p className="text-lg opacity-60 mb-12 leading-relaxed">Last Updated: May 2026</p>

          <div className="space-y-12 opacity-80 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold mb-4">1. Acceptance of Terms</h2>
              <p>By accessing or using Writings, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">2. Use of Service</h2>
              <p>Writings provides a distraction-free writing environment and portfolio publishing. You are responsible for maintaining the security of your account and for all activities that occur under your account.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">3. Content Ownership</h2>
              <p>You retain all rights to the content you create on Writings. By publishing a portfolio, you grant us a limited license to host and display your work as part of the service.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">4. Pro Subscription</h2>
              <p>Subscriptions are billed monthly or annually. You can cancel at any time. Refunds are handled in accordance with our billing policy.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">5. Limitation of Liability</h2>
              <p>Writings is provided "as is". We are not liable for any data loss or service interruptions. We recommend maintaining backups of your important work.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsPage;
