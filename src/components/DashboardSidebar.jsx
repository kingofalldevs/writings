'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Sparkles, LogOut, User, Sun, Moon, Coffee, Music, Share2, Palette, ChevronRight, Globe } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const DashboardSidebar = ({ 
  user, 
  onLogout, 
  onAccount, 
  onPortfolioEditor, 
  onPricing,
  onToggleAI,
  isAIOpen,
  onTogglePlayer,
  isPlayerVisible,
  onUpload,
  onShare,
  canShare,
  layout,
  isOpen = true
}) => {
  const { theme, toggleTheme } = useTheme();

  const isPro = user?.subscription?.status === 'active' || user?.subscription?.status === 'pro';

  // For the "under-nav" layout, we want it to be part of the flex flow but also sticky
  const sidebarClasses = layout === 'under-nav'
    ? "hidden lg:flex flex-col w-[260px] h-[calc(100vh-80px)] bg-background border-r border-foreground/5 sticky top-20 left-0 overflow-y-auto hide-scrollbar z-40 p-6 transition-all duration-300 ease-in-out"
    : "hidden lg:flex flex-col w-[280px] h-screen bg-background border-r border-foreground/5 sticky top-0 left-0 overflow-y-auto hide-scrollbar z-[60] p-6 transition-all duration-300 ease-in-out";

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div 
          initial={{ width: 0, opacity: 0, x: -20 }}
          animate={{ width: layout === 'under-nav' ? 260 : 280, opacity: 1, x: 0 }}
          exit={{ width: 0, opacity: 0, x: -20 }}
          transition={{ type: "spring", bounce: 0, duration: 0.3 }}
          className={sidebarClasses}
        >
          <div className="flex flex-col h-full gap-6 min-w-[212px]">
            
            {/* User Profile Section */}
            {user && (
              <motion.div 
                whileHover={{ y: -2 }}
                onClick={onAccount}
                className="group p-4 rounded-3xl bg-foreground/[0.03] border border-foreground/5 hover:border-accent/20 cursor-pointer transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                    <User size={20} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-bold truncate">{user.displayName || user.email?.split('@')[0]}</p>
                    <p className="text-[10px] opacity-40 truncate">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between px-1">
                   <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${isPro ? 'bg-accent/10 text-accent' : 'bg-foreground/5 opacity-40'}`}>
                    {isPro ? 'Pro Member' : 'Free Plan'}
                  </span>
                  <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            )}

            {/* Quick Actions Grid */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-30 mb-3 px-2">Workspace</div>
              <div className="grid grid-cols-1 gap-2">
                <ActionButton 
                  onClick={onToggleAI}
                  active={isAIOpen}
                  icon={<Sparkles size={18} fill={isAIOpen ? 'currentColor' : 'none'} />}
                  label="Aria AI"
                  accent
                />
              </div>
            </div>

            {/* Theme Selection */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-30 mb-3 px-2">Appearance</div>
              <div className="flex items-center p-1 rounded-2xl bg-foreground/[0.03] border border-foreground/5 gap-1">
                <ThemeIcon active={theme === 'light'} onClick={() => toggleTheme('light')} icon={<Sun size={14} />} />
                <ThemeIcon active={theme === 'sepia'} onClick={() => toggleTheme('sepia')} icon={<Coffee size={14} />} />
                <ThemeIcon active={theme === 'dark'} onClick={() => toggleTheme('dark')} icon={<Moon size={14} />} />
              </div>
            </div>

            {/* Navigation Links */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-30 mb-3 px-2">Portfolio</div>
              <div className="flex flex-col gap-1">
                <NavLink 
                  onClick={onPortfolioEditor}
                  icon={<Globe size={18} />}
                  label="Manage Portfolio"
                />
                {!isPro && (
                  <NavLink 
                    onClick={onPricing}
                    icon={<Sparkles size={18} className="text-accent" />}
                    label="Upgrade Pro"
                    highlight
                  />
                )}
              </div>
            </div>


          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ActionButton = ({ onClick, active, icon, label, accent }) => (
  <motion.button
    whileHover={{ y: -2 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl transition-all duration-300 border ${
      active 
        ? 'bg-accent text-background border-accent shadow-lg shadow-accent/20' 
        : accent 
          ? 'bg-accent/5 text-accent border-accent/10 hover:bg-accent/10'
          : 'bg-foreground/[0.03] border-foreground/5 hover:bg-foreground/[0.06] text-foreground'
    }`}
  >
    {icon}
    <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
  </motion.button>
);

const NavLink = ({ onClick, icon, label, highlight }) => (
  <motion.button
    whileHover={{ x: 4 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`w-full flex items-center gap-3 p-2.5 rounded-2xl transition-all duration-300 font-medium text-sm ${
      highlight 
        ? 'bg-accent/5 text-accent hover:bg-accent/10 border border-accent/10' 
        : 'hover:bg-foreground/5 border border-transparent hover:border-foreground/5'
    }`}
  >
    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${highlight ? 'bg-accent/10' : 'bg-foreground/5'}`}>
      {icon}
    </div>
    {label}
  </motion.button>
);

const ThemeIcon = ({ active, onClick, icon }) => (
  <button
    onClick={onClick}
    className={`flex-1 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
      active ? 'bg-background text-foreground shadow-sm' : 'text-foreground/40 hover:text-foreground/70'
    }`}
  >
    {icon}
  </button>
);

export default DashboardSidebar;
