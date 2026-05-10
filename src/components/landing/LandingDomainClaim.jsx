import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck } from 'lucide-react';

const LandingDomainClaim = () => {
  const [handle, setHandle] = useState('');

  return (
    <section className="relative w-full flex flex-col items-center py-32 px-8 z-10 max-w-[1200px] mx-auto overflow-hidden">
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <ShieldCheck className="w-5 h-5 text-accent" />
          <span className="text-accent text-sm font-medium tracking-widest uppercase">Identity</span>
        </div>
        <h2 className="font-medium tracking-tight mb-4 font-sans text-[clamp(32px,4vw,48px)] leading-[1.1] text-foreground">
          Secure your page
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full max-w-xl relative"
      >
        <div className="relative group">
          <div className="relative flex items-center bg-foreground/[0.02] border border-foreground/10 rounded-xl p-2 pl-6 focus-within:border-accent/40 transition-all duration-300">
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
              placeholder="yourname"
              className="flex-1 bg-transparent border-none outline-none text-xl font-light text-foreground placeholder:text-foreground/20 py-4"
            />
            <div className="flex items-center gap-4">
              <span className="text-xl font-light text-foreground/40 pr-4 border-r border-foreground/10">
                .writings.page
              </span>
              <button className="bg-accent text-background px-6 py-4 rounded-lg font-medium flex items-center gap-2 transition-all">
                Secure
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.6 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-center mt-8 text-foreground font-light text-lg tracking-wide italic"
        >
          short handles are going fast secure now
        </motion.p>
      </motion.div>
    </section>
  );
};

export default LandingDomainClaim;
