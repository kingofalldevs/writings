import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const PrivacyPage = ({ onBack }) => {
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
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">Privacy Policy</h1>
          <p className="text-lg opacity-60 mb-12 leading-relaxed">Last Updated: May 2026</p>

          <div className="space-y-12 opacity-80 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold mb-4">1. Data Collection</h2>
              <p>We collect minimal information required to provide our services: email addresses for authentication and your writing content to enable cloud sync and Ideabase features.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">2. Use of Data</h2>
              <p>Your data is used solely to provide and improve Writings. We do not sell your personal information or your writing content to third parties.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">3. AI Features</h2>
              <p>When using Aria (AI Assistant), context from your documents may be processed by AI models to provide assistance. This data is not used to train global AI models.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">4. Security</h2>
              <p>We implement industry-standard security measures to protect your data. However, no method of transmission over the internet is 100% secure.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">5. Your Rights</h2>
              <p>You have the right to access, export, or delete your data at any time through the account settings or by contacting our support team.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPage;
