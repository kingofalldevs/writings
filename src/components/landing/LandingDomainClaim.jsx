'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Globe, Lock } from 'lucide-react';

const LandingDomainClaim = ({ onStart }) => {
  const [handle, setHandle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onStart) onStart();
  };

  return (
    <section className="relative w-full py-24 md:py-40 px-6 md:px-12 z-10 max-w-[1300px] mx-auto overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        
        {/* Left Column: Description & Form */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-accent" />
            <span className="text-accent text-sm font-bold tracking-[0.3em] uppercase">Identity</span>
          </div>
          
          <div className="space-y-6">
            <h2 className="font-bold tracking-tightest font-sans text-[clamp(40px,5vw,64px)] leading-[0.9] text-foreground">
              Secure your <br/>
              <span className="italic font-serif opacity-40">digital home.</span>
            </h2>
            <p className="text-foreground/60 text-lg md:text-xl leading-relaxed max-w-lg font-light">
              Claim your unique space on the web. Every Writings author receives a personalized subdomain to showcase their portfolio with zero configuration and infinite elegance.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="relative group max-w-md">
            <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center bg-foreground/[0.03] border border-foreground/10 rounded-2xl p-1.5 focus-within:border-accent/40 focus-within:bg-foreground/[0.05] transition-all duration-500">
              <div className="flex-1 flex items-center pl-4 pr-2">
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                  placeholder="ellen"
                  className="w-full bg-transparent border-none outline-none text-lg font-bold text-foreground placeholder:text-foreground/10 py-3"
                />
                <span className="text-lg font-bold text-foreground/60 pr-4">
                  .writings.page
                </span>
              </div>
              <button 
                type="submit"
                className="bg-accent text-background px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-accent/10"
              >
                Secure
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <p className="mt-4 text-[10px] font-bold tracking-widest uppercase opacity-30 ml-2 italic">
              Short handles are going fast · Secure yours now
            </p>
          </form>
        </motion.div>

        {/* Right Column: Visual Image */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative group"
        >
          {/* Accent Glow */}
          <div className="absolute -inset-10 bg-accent/5 rounded-[40px] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <div className="relative overflow-hidden transition-transform duration-700 group-hover:scale-[1.05]">
            <img 
              src="/images/domain-mockup.png" 
              alt="Ellen's Writings Domain" 
              className="w-full h-auto block"
            />
          </div>
          
        </motion.div>

      </div>
    </section>
  );
};

export default LandingDomainClaim;
