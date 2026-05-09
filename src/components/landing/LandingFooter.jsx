import React from 'react';
import { motion } from 'framer-motion';


const LandingFooter = () => {
  return (
    <footer className="w-full flex flex-col items-center z-10 overflow-hidden pt-24 pb-12 px-8">

      {/* Main Footer Content */}
      <div className="w-full max-w-[1200px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 pt-16 border-t border-foreground/10">
        {/* Brand & Mission */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
              <path d="M2 12h4l3-9 5 18 3-9h5"/>
            </svg>
            <span className="text-xl font-bold tracking-tight">Crescendo</span>
          </div>
          <p className="text-sm font-light leading-relaxed opacity-70 max-w-[240px]">
            The minimalist operating system for deep work, research, and cognitive excellence. Designed for flow.
          </p>
        </div>

        {/* Links Column 1 */}
        <div className="flex flex-col gap-6">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent opacity-60">Product</span>
          <div className="flex flex-col gap-4">
            <FooterLink label="Living OS" />
            <FooterLink label="Aria AI Tutor" />
            <FooterLink label="Zen Tracks" />
          </div>
        </div>

        {/* Links Column 2 */}
        <div className="flex flex-col gap-6">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent opacity-60">Company</span>
          <div className="flex flex-col gap-4">
            <FooterLink label="Philosophy" />
            <FooterLink label="Manifesto" />
            <FooterLink label="Privacy Policy" />
          </div>
        </div>

        {/* Newsletter / CTA */}
        <div className="flex flex-col gap-6">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent opacity-60">Newsletter</span>
          <div className="flex flex-col gap-4">
            <p className="text-sm font-light opacity-70">Stay updated with our latest focus tools.</p>
            <div className="relative flex items-center group">
              <input 
                type="email" 
                placeholder="Email address" 
                className="w-full bg-transparent border-none border-b border-foreground/10 py-2 text-sm outline-none text-foreground transition-colors group-focus-within:border-accent"
              />
              <button className="absolute right-0 text-accent border-none bg-transparent cursor-pointer hover:scale-110 transition-transform">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="w-full max-w-[1200px] flex flex-col sm:flex-row justify-between items-center gap-6 mt-20 pt-8 border-t border-accent/10">
        <p className="text-[12px] font-light opacity-40">© 2026 Crescendo Inc. All rights reserved.</p>
        <div className="flex gap-8">
          <FooterBottomLink label="Terms of Service" />
          <FooterBottomLink label="Security" />
          <FooterBottomLink label="Cookies" />
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ label }) => (
  <a href="#" className="text-sm font-light opacity-60 no-underline transition-all hover:opacity-100 hover:text-accent">
    {label}
  </a>
);

const FooterBottomLink = ({ label }) => (
  <a href="#" className="text-[12px] opacity-40 no-underline transition-opacity hover:opacity-100">
    {label}
  </a>
);

export default LandingFooter;

