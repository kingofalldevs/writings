import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Headphones, Coffee } from 'lucide-react';

const floatingCupsConfig = [
  { size: 48, top: '15%', left: '12%', duration: 15, delay: 0 },
  { size: 64, top: '20%', left: '82%', duration: 20, delay: 2 },
  { size: 40, top: '65%', left: '8%', duration: 18, delay: 1 },
  { size: 56, top: '70%', left: '85%', duration: 22, delay: 3 },
  { size: 36, top: '40%', left: '92%', duration: 16, delay: 4 },
  { size: 44, top: '85%', left: '25%', duration: 19, delay: 1.5 },
];

const phrases = [
  "Reading and Writing.",
  "Deep Focus.",
  "Creative Flow."
];

const LandingHero = ({ onStart }) => {
  const [text, setText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex % phrases.length];
    let timeout;

    if (isDeleting) {
      timeout = setTimeout(() => {
        setText(prev => prev.substring(0, prev.length - 1));
        if (text.length <= 1) {
          setIsDeleting(false);
          setPhraseIndex(prev => prev + 1);
        }
      }, 40);
    } else {
      if (text === currentPhrase) {
        timeout = setTimeout(() => setIsDeleting(true), 2500);
      } else {
        timeout = setTimeout(() => {
          setText(currentPhrase.substring(0, text.length + 1));
        }, 100);
      }
    }
    return () => clearTimeout(timeout);
  }, [text, isDeleting, phraseIndex]);

  return (
    <main className="relative z-10 flex flex-col items-center text-center px-8 w-full max-w-[1400px] pt-32 pb-20">
      {/* Floating 2D Cups */}
      {floatingCupsConfig.map((config, index) => (
        <motion.div
          key={`cup-${index}`}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, -15, 0],
            rotate: [0, 10, -10, 0],
            opacity: 0.85
          }}
          transition={{
            y: { duration: config.duration, repeat: Infinity, ease: "easeInOut", delay: config.delay },
            x: { duration: config.duration * 1.2, repeat: Infinity, ease: "easeInOut", delay: config.delay },
            rotate: { duration: config.duration * 1.5, repeat: Infinity, ease: "easeInOut", delay: config.delay },
            opacity: { duration: 2, ease: "easeOut" }
          }}
          className="absolute rounded-full bg-[#72B9AA] flex items-center justify-center -z-10 pointer-events-none blur-[3px]"
          style={{
            top: config.top,
            left: config.left,
            width: `${config.size}px`,
            height: `${config.size}px`,
          }}
        >
          <Coffee
            color="#F2EFE8"
            size={config.size * 0.45}
            strokeWidth={2.5}
          />
        </motion.div>
      ))}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, cubicBezier: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center mb-20"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="mb-6 px-4 py-1.5 rounded-full border border-accent/20 bg-accent/5 text-accent text-[11px] font-bold tracking-[0.2em] uppercase"
        >
          For Writers
        </motion.div>
        <h1 className="font-medium tracking-[-0.02em] leading-[1.1] mb-8 font-sans text-foreground text-[clamp(32px,4.5vw,72px)]">
          Turn passive writings into <br className="hidden md:block" />
          <span className="text-accent">job-ready professional portfolios</span>
        </h1>
        <p className="font-light uppercase opacity-80 text-lg tracking-[0.25em] text-accent">
          Write . Publish . Advance
        </p>
      </motion.div>

      {/* Call to Action Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2, cubicBezier: [0.16, 1, 0.3, 1] }}
      >
        <button
          onClick={onStart}
          className="group relative overflow-hidden flex items-center gap-3 px-12 py-5 rounded-full bg-accent text-background text-lg font-semibold transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] border border-accent/20"
        >
          <span>Start Your Journey</span>
          <ArrowRight
            size={22}
            className="transition-transform group-hover:translate-x-1"
          />
        </button>
      </motion.div>

    </main>
  );
};

export default LandingHero;
