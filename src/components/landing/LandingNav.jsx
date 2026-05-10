import React, { useState, useEffect } from 'react';
import { ChevronDown, Moon, Sun, Coffee, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const LandingNav = ({ user, onAccountClick, onStart, onPricingClick, onAriaClick, onPhilosophyClick, onHomeClick }) => {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`fixed top-0 left-0 right-0 z-[100] flex justify-center pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isScrolled ? 'p-6' : 'p-0'}`}>
      <nav className={`w-full flex items-center justify-between pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isScrolled 
          ? 'max-w-[1200px] px-8 py-4 bg-background/80 backdrop-blur-xl rounded-2xl border border-foreground/10' 
          : 'max-w-full px-8 md:px-12 py-6 bg-transparent border-transparent'
      }`}>
        {/* Left: Logo */}
        <div 
          onClick={onHomeClick}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="transition-transform group-hover:scale-110">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 12H18L15 21L9 3L6 12H2" className="stroke-accent" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">Writings</span>
        </div>

        {/* Center: Main Links */}
        <div className="hidden lg:flex items-center gap-10">
          <NavLink label="Philosophy" hasChevron onClick={onPhilosophyClick} />
          <div className="flex items-center gap-2">
            <NavLink label="Aria AI" onClick={onAriaClick} />
            <span className="px-2 py-0.5 rounded-md bg-accent text-background text-[10px] font-bold tracking-widest uppercase">Beta</span>
          </div>
          <NavLink label="Pricing" onClick={onPricingClick} />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 md:gap-6">
          <div className="hidden sm:flex items-center p-1 rounded-full border border-foreground/10 bg-foreground/5 gap-0.5">
            <ThemeIcon 
              active={theme === 'light'} 
              onClick={() => toggleTheme('light')} 
              icon={<Sun size={14} />} 
            />
            <ThemeIcon 
              active={theme === 'sepia'} 
              onClick={() => toggleTheme('sepia')} 
              icon={<Coffee size={14} />} 
            />
            <ThemeIcon 
              active={theme === 'dark'} 
              onClick={() => toggleTheme('dark')} 
              icon={<Moon size={14} />} 
            />
          </div>

          <div className="flex items-center gap-2">
            {!user && (
              <button
                onClick={onStart}
                className="hidden sm:block bg-transparent border-none text-sm font-medium text-foreground/60 cursor-pointer transition-opacity hover:opacity-100"
              >
                Sign In
              </button>
            )}
            <button
              onClick={onStart}
              className="px-5 md:px-6 py-2.5 rounded-full border border-foreground/10 bg-foreground/5 text-foreground text-sm font-semibold cursor-pointer transition-all hover:bg-foreground/[0.08] hover:border-foreground/25"
            >
              {user ? 'Dashboard' : 'Get Started'}
            </button>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex lg:hidden items-center justify-center w-10 h-10 rounded-full border border-foreground/10 bg-foreground/5 text-foreground transition-transform hover:scale-110 active:scale-95"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-background/40 backdrop-blur-sm z-[90] lg:hidden"
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute top-full left-0 right-0 mt-4 mx-6 p-8 rounded-[2.5rem] glass border border-foreground/10 shadow-2xl pointer-events-auto lg:hidden z-[100]"
            >
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-6">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-30">Explore</span>
                  <div className="flex flex-col gap-5">
                    <MobileNavLink label="Philosophy" onClick={() => { onPhilosophyClick(); setIsMobileMenuOpen(false); }} />
                    <MobileNavLink label="Aria AI Beta" onClick={() => { onAriaClick(); setIsMobileMenuOpen(false); }} />
                    <MobileNavLink label="Pricing & Plans" onClick={() => { onPricingClick(); setIsMobileMenuOpen(false); }} />
                  </div>
                </div>

                <div className="pt-8 border-t border-foreground/10 flex flex-col gap-6">
                   <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-30">Theme</span>
                      <div className="flex items-center p-1 rounded-full border border-foreground/10 bg-foreground/5 gap-0.5">
                        <ThemeIcon active={theme === 'light'} onClick={() => toggleTheme('light')} icon={<Sun size={14} />} />
                        <ThemeIcon active={theme === 'sepia'} onClick={() => toggleTheme('sepia')} icon={<Coffee size={14} />} />
                        <ThemeIcon active={theme === 'dark'} onClick={() => toggleTheme('dark')} icon={<Moon size={14} />} />
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const MobileNavLink = ({ label, onClick }) => (
  <div 
    onClick={onClick}
    className="text-lg font-medium text-foreground/70 hover:text-foreground transition-colors cursor-pointer"
  >
    {label}
  </div>
);

const ThemeIcon = ({ active, onClick, icon }) => (
  <button
    onClick={onClick}
    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
      active ? 'bg-accent text-background opacity-100' : 'bg-transparent text-muted opacity-60 hover:opacity-100'
    }`}
  >
    {icon}
  </button>
);

const NavLink = ({ label, hasChevron, onClick }) => (
  <div
    onClick={onClick}
    className="flex items-center gap-1 cursor-pointer text-sm font-medium text-foreground/55 transition-opacity hover:opacity-100"
  >
    <span>{label}</span>
    {hasChevron && <ChevronDown size={13} className="opacity-50" />}
  </div>
);

export default LandingNav;
