import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const features = [
  {
    title: "Minimal & Focused",
    description: "A serene digital environment designed to eliminate distractions and foster deep focus."
  },
  {
    title: "AI Brainstorming",
    description: "Collaborative intelligence that helps you connect ideas and expand your creative horizons."
  },
  {
    title: "Reading & Writing",
    description: "Optimized tools for the modern scholar, making consumption and creation effortless."
  },
  {
    title: "Creative Sounds",
    description: "Scientifically backed audio environments tailored for deep work and cognitive flow."
  }
];

const LandingCTA = ({ onStart }) => {
  return (
    <section className="relative w-full py-40 px-8 flex flex-col items-center overflow-hidden">


      <div className="w-full max-w-6xl flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h2 className="font-medium tracking-tight mb-6 font-sans text-[clamp(32px,5vw,64px)] text-foreground leading-[1.1]">
            Ready to reach your <br /> <span className="text-accent">peak performance?</span>
          </h2>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-24 w-full text-left">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col gap-4"
            >
              <div className="w-6 h-0.5 bg-accent opacity-30 mb-2" />
              <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="text-sm font-light leading-relaxed opacity-60 text-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="group flex items-center gap-3 px-12 py-5 rounded-full bg-foreground text-background text-base font-semibold cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] relative overflow-hidden active:scale-95 border-2 border-accent/20 hover:border-accent/50"
        >
          <span className="relative z-10">Sign in</span>
          <ArrowRight className="relative z-10" size={20} />
          
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </motion.button>
        
        <p className="mt-8 text-[12px] font-light opacity-40 uppercase tracking-[0.2em]">
          No credit card required • Instant access
        </p>
      </div>
    </section>
  );
};

export default LandingCTA;
