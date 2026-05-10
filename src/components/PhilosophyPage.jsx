import React from 'react';
import { motion } from 'framer-motion';
import LandingNav from './landing/LandingNav';
import LandingFooter from './landing/LandingFooter';

const PhilosophyPage = ({ onStart, onBack, onPricing, onAria, onPhilosophy, onTerms, onPrivacy, onRefund }) => {
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
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">Our Philosophy</h1>
          <p className="text-lg opacity-60 mb-12 leading-relaxed">A Living OS for the Modern Scholar.</p>

          <div className="space-y-12 opacity-80 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold mb-4">Digital Minimalism</h2>
              <p>We believe in stripping away the noise. Writings is designed to be a silent partner, providing exactly what you need and nothing more. In an age of infinite distraction, we build for depth.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">Cognitive Flow</h2>
              <p>Our tools are built to induce and maintain the state of flow. We respect the fragility of deep focus and protect it at all costs. Every pixel in the Living OS is optimized for low-entropy interaction.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">Human-Centric AI</h2>
              <p>AI should expand the human mind, not replace it. Our intelligence layers are designed to be proactive yet humble, ensuring that you remain the architect of your ideas.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">The Architecture of Focus</h2>
              <p>Writings was born from a simple realization: the tools we use to think shouldn't be the ones that distract us. We've spent years obsessing over the "tactile" feel of digital space—the way music should sit in the background, the way a font should read on a late-night study session, and the way an AI should suggest a connection without breaking your train of thought.</p>
            </section>
          </div>
        </motion.div>
      </div>

      <LandingFooter onTerms={onTerms} onPrivacy={onPrivacy} onRefund={onRefund} />
    </div>
  );
};

export default PhilosophyPage;
