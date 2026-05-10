import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Focus, Sparkles, LineChart } from 'lucide-react';

import darkModeImg from '../../assets/screenshots/dark-mode.png';
import lightModeImg from '../../assets/screenshots/light-mode.png';
import sepiaModeImg from '../../assets/screenshots/sepia-mode.png';
import mobileShowcaseImg from '../../assets/screenshots/mobile-showcase.png';

const themes = {
  dark: { id: 'dark', name: 'Dark Mode', img: darkModeImg },
  light: { id: 'light', name: 'Light Mode', img: lightModeImg },
  sepia: { id: 'sepia', name: 'Sepia Mode', img: sepiaModeImg }
};

const LandingProduct = () => {
  const [activeTheme, setActiveTheme] = useState('dark');

  return (
    <section className="relative w-full flex flex-col items-center py-20 md:py-32 px-6 md:px-8 z-10 max-w-[1200px] mx-auto">

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-8 md:mb-16"
      >
        <h2 className="font-medium tracking-tight mb-4 md:mb-6 font-sans text-[clamp(32px,5vw,56px)] leading-[1.1] text-center text-foreground">
          Writings offers you a <span className="text-accent">Calm space for writing</span> <br className="hidden md:block" /> and one click - publish to portfolio.
        </h2>
        <p className="font-light opacity-70 max-w-3xl mx-auto text-foreground text-lg md:text-[22px] text-center leading-relaxed">
          Focus on what matters most—your writing. Writings provides a distraction-free Editor, an Ideabase and Binder to organize your thoughts, draft your chapters, and instantly share your finished work with the world.
        </p>
      </motion.div>

      {/* Theme Selector Tabs - Hidden on Mobile as per request */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="hidden md:flex gap-4 p-1.5 rounded-full mt-12 mb-14 bg-foreground/[0.03] border border-foreground/10"
      >
        {Object.values(themes).map((theme) => (
          <button
            key={theme.id}
            onClick={() => setActiveTheme(theme.id)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTheme === theme.id
              ? 'bg-accent text-background opacity-100'
              : 'bg-transparent text-foreground opacity-60 hover:opacity-100'
              }`}
          >
            {theme.name}
          </button>
        ))}
      </motion.div>

      {/* Interactive Screenshot Viewer (Desktop) */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2 }}
        className="hidden md:block w-full relative rounded-2xl overflow-hidden border border-foreground/10 aspect-video bg-black/40"
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={activeTheme}
            src={themes[activeTheme].img}
            alt={`${themes[activeTheme].name} Interface`}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
      </motion.div>

      {/* Specific Mobile Showcase Screenshot */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="md:hidden w-full max-w-[340px] relative rounded-[2.5rem] overflow-hidden border border-foreground/10 shadow-2xl"
      >
        <img
          src={mobileShowcaseImg}
          alt="Writings Mobile Interface"
          className="w-full h-auto block"
        />
      </motion.div>
    </section>
  );
};

export default LandingProduct;
