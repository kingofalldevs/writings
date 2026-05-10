import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Wind, Sun, Coffee, ArrowRight } from 'lucide-react';
import LandingNav from './landing/LandingNav';
import LandingFooter from './landing/LandingFooter';

const PhilosophyPage = ({ onStart, onBack, onPricing, onAria }) => {
  const pillars = [
    {
      icon: Leaf,
      title: "Digital Minimalism",
      description: "We believe in stripping away the noise. Writings is designed to be a silent partner, providing exactly what you need and nothing more."
    },
    {
      icon: Wind,
      title: "Cognitive Flow",
      description: "Our tools are built to induce and maintain the state of flow. We respect the fragility of deep focus and protect it at all costs."
    },
    {
      icon: Sun,
      title: "Human-Centric AI",
      description: "AI should expand the human mind, not replace it. Our intelligence layers are designed to be proactive yet humble."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}>
      <LandingNav 
        onStart={onStart} 
        onHomeClick={onBack} 
        onPricingClick={onPricing} 
        onAriaClick={onAria}
      />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-40 px-8 flex flex-col items-center text-center relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 max-w-4xl"
          >
            <div 
              style={{ 
                display: 'inline-block',
                padding: '8px 16px',
                borderRadius: '100px',
                backgroundColor: 'rgba(var(--accent-rgb), 0.08)',
                color: 'var(--accent-color)',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.15em',
                marginBottom: '32px'
              }}
            >
              OUR MANIFESTO
            </div>
            <h1 
              className="font-medium tracking-tight mb-10" 
              style={{ fontSize: 'clamp(48px, 8vw, 90px)', lineHeight: 1.1 }}
            >
              A Living OS for the <br />
              <span style={{ color: 'var(--accent-color)', fontStyle: 'italic' }}>Modern Scholar.</span>
            </h1>
            <p style={{ fontSize: '22px', opacity: 0.6, maxWidth: '700px', margin: '0 auto', fontWeight: 300, lineHeight: 1.6 }}>
              In an age of infinite distraction, we build for depth. Writings is a return to intentionality, a sanctuary for those who seek to master their craft.
            </p>
          </motion.div>
        </section>

        {/* Pillars Grid */}
        <section className="py-32 px-8 flex justify-center">
          <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-16">
            {pillars.map((pillar, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}
              >
                <div 
                  style={{ 
                    width: '64px', 
                    height: '64px', 
                    borderRadius: '20px', 
                    backgroundColor: 'rgba(var(--accent-rgb), 0.05)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'var(--accent-color)'
                  }}
                >
                  <pillar.icon size={32} strokeWidth={1.5} />
                </div>
                <h3 style={{ fontSize: '24px', fontWeight: 500 }}>{pillar.title}</h3>
                <p style={{ fontSize: '16px', opacity: 0.5, lineHeight: 1.8, fontWeight: 300 }}>
                  {pillar.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Deep Dive Section */}
        <section className="py-40 px-8 flex justify-center border-t" style={{ borderColor: 'var(--border-color)' }}>
          <div className="max-w-3xl w-full flex flex-col gap-24 text-center">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', alignItems: 'center' }}>
              <h2 style={{ fontSize: '40px', fontWeight: 500, letterSpacing: '-0.02em' }}>The Architecture of Focus.</h2>
              <p style={{ fontSize: '20px', lineHeight: 1.8, opacity: 0.7, fontWeight: 300 }}>
                Writings was born from a simple realization: the tools we use to think shouldn't be the ones that distract us. We've spent years obsessing over the "tactile" feel of digital space—the way music should sit in the background, the way a font should read on a late-night study session, and the way an AI should suggest a connection without breaking your train of thought.
              </p>
              <p style={{ fontSize: '20px', lineHeight: 1.8, opacity: 0.7, fontWeight: 300 }}>
                Every pixel in the Living OS is optimized for **low-entropy interaction**. This means less energy spent on navigation and more energy spent on synthesis. We don't want you to "use" Writings; we want you to inhabit it.
              </p>
            </div>

            <div 
              style={{ 
                padding: '60px', 
                borderRadius: '40px', 
                backgroundColor: 'rgba(var(--accent-rgb), 0.03)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '32px',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              <Coffee size={40} className="text-[var(--accent-color)] opacity-50" />
              <h3 style={{ fontSize: '28px', fontWeight: 500 }}>Ready to change how you work?</h3>
              <p style={{ opacity: 0.6, fontWeight: 300, fontSize: '18px' }}>Join a community of scholars who have found their flow.</p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onStart}
                style={{ 
                  padding: '22px 56px', 
                  borderRadius: '100px', 
                  backgroundColor: 'var(--text-color)', 
                  color: 'var(--bg-color)', 
                  border: 'none', 
                  fontSize: '16px', 
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <span>Enter the Living OS</span>
                <ArrowRight size={20} />
              </motion.button>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
};

export default PhilosophyPage;
