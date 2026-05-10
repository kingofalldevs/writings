import React from 'react';
import { motion } from 'framer-motion';
import LandingNav from './landing/LandingNav';
import LandingFooter from './landing/LandingFooter';

const AriaPage = ({ onStart, onBack, onPricing, onAria, onPhilosophy, onTerms, onPrivacy }) => {
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
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">Aria AI Assistant</h1>
          <p className="text-lg opacity-60 mb-12 leading-relaxed">Your research, enlightened.</p>

          <div className="space-y-12 opacity-80 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold mb-4">Proactive Intelligence</h2>
              <p>Aria doesn't wait for questions. She analyzes your writing in real-time to suggest relevant citations and connections, serving as a proactive research partner that lives within your OS.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">Cognitive Flow</h2>
              <p>Designed to expand your thinking, not replace it. Aria acts as a second brain that grows with your research journey, stepping in only when she has a meaningful contribution to make.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">Natural Dialogue</h2>
              <p>Chat naturally about your work. Aria understands the nuance of academic and creative contexts perfectly, providing the structural integrity of a world-class research department.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">Private Intelligence</h2>
              <p>Privacy is the bedrock of deep work. Aria processes your most sensitive research within the secure confines of your Living OS. Your data is your own, used only to enhance your local intelligence and never to train external models.</p>
            </section>
          </div>
        </motion.div>
      </div>

      <LandingFooter onTerms={onTerms} onPrivacy={onPrivacy} />
    </div>
  );
};

export default AriaPage;
