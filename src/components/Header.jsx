import React from 'react';
import { Upload, Sparkles, Menu, LogOut, User, Sun, Moon, Coffee, FilePlus, Library, Music, Columns, Share2, ExternalLink, Globe, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import * as pdfjsLib from 'pdfjs-dist';

// More reliable worker setup for Vite
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

  const Header = ({ 
    onUpload, 
    onShare,
    canShare,
    onToggleAI, 
    isAIOpen, 
    onTogglePlayer, 
    isPlayerVisible, 
    onLogoClick, 
    user, 
    onLogout, 
    onAccount,
    onPortfolioEditor,
    onQuickPublish,
    onSignIn,
    onToggleLibrary,
    onToggleBinder,
    isBinderOpen,
    onPricing
  }) => {
    const { theme, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const fileInputRef = React.useRef(null);
    const menuRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const extractTextFromPDF = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n\n';
    }

    return fullText;
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === 'application/pdf') {
        try {
          const text = await extractTextFromPDF(file);
          onUpload(text);
        } catch (error) {
          console.error('Error parsing PDF:', error);
          alert('Failed to parse PDF. Please try a different file.');
        }
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          onUpload(e.target.result);
        };
        reader.readAsText(file);
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full h-16 px-4 md:px-8 flex items-center justify-between z-50 bg-background border-b border-foreground/5">
      <div 
        className="flex items-center gap-2 md:gap-3 cursor-pointer group shrink-0" 
        onClick={onLogoClick}
      >
        <div className="flex items-center justify-center w-6 h-6 transition-transform group-hover:scale-110">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 7C6 5 9 9 12 7C15 5 18 9 20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 12C6 10 9 14 12 12C15 10 18 14 20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 17C6 15 9 19 12 17C15 15 18 19 20 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
        <span className="text-lg md:text-xl font-medium tracking-tight">Writings</span>
      </div>

      <div className="flex items-center gap-2 md:gap-4 flex-1 justify-start ml-4 md:ml-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleBinder}
          className={`p-2 rounded-xl transition-all duration-300 ${
            isBinderOpen 
              ? 'bg-accent/10 text-accent' 
              : 'text-muted hover:bg-foreground/5'
          }`}
          title={isBinderOpen ? "Hide Ideabase" : "Show Ideabase"}
        >
          <Columns size={18} />
        </motion.button>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept=".txt,.md,.pdf" 
          className="hidden" 
        />

        <div className="relative flex items-center gap-2" ref={menuRef}>
          {user && (
            <div className="flex items-center gap-2 mr-1 md:mr-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  console.log("Current User Subscription:", user?.subscription);
                  onPricing();
                }}
                className="flex items-center gap-2 px-3 md:px-5 py-2 md:py-2.5 rounded-full bg-accent/10 text-accent hover:bg-accent/20 transition-all text-[10px] md:text-[11px] font-bold tracking-widest uppercase"
                title={(user?.subscription?.status === 'active' || user?.subscription?.status === 'pro') ? "Manage Subscription" : "Upgrade Plan"}
              >
                <Sparkles size={14} />
                <span className="hidden sm:inline">{(user?.subscription?.status === 'active' || user?.subscription?.status === 'pro') ? 'Pro' : 'Upgrade'}</span>
                {! (user?.subscription?.status === 'active' || user?.subscription?.status === 'pro') && <span className="sm:hidden text-[9px]">UP</span>}
                {(user?.subscription?.status === 'active' || user?.subscription?.status === 'pro') && <span className="sm:hidden text-[9px]">PRO</span>}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onQuickPublish}
                className="flex items-center gap-2 px-3 md:px-5 py-2 md:py-2.5 rounded-full bg-accent text-background transition-all text-[10px] md:text-[11px] font-bold tracking-widest uppercase"
                title="Instant Publish to Portfolio"
              >
                <Globe size={14} />
                <span className="hidden sm:inline">Publish</span>
              </motion.button>
            </div>
          )}

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-3 rounded-full hover:bg-foreground/5 transition-all border border-transparent hover:border-foreground/10 text-foreground"
          >
            <Menu size={20} />
          </button>

              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-3 w-72 rounded-2xl shadow-2xl glass overflow-hidden z-[100]"
                  >
                {user && (
                  <div 
                    onClick={() => {
                      setIsMenuOpen(false);
                      onAccount();
                    }}
                    className="p-5 border-b border-foreground/10 hover:bg-foreground/5 cursor-pointer transition-all"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-bold truncate max-w-[200px]">
                        {user.displayName || user.email?.split('@')[0]}
                      </span>
                      <span className="text-[11px] opacity-50 truncate max-w-[200px] mt-0.5">
                        {user.email}
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-4 border-b border-foreground/10 flex items-center justify-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      onToggleAI();
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center justify-center w-10 h-10 rounded-full cursor-pointer transition-all duration-300 ${
                      isAIOpen 
                        ? 'bg-accent text-background shadow-[0_10px_20px_-5px_rgba(var(--accent-rgb),0.4)]' 
                        : 'bg-accent/10 text-accent hover:bg-accent/20'
                    }`}
                    title={isAIOpen ? "Close Aria" : "Ask Aria"}
                  >
                    <Sparkles size={18} fill={isAIOpen ? 'currentColor' : 'none'} />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      onTogglePlayer();
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center justify-center w-10 h-10 rounded-full cursor-pointer transition-all duration-300 ${
                      isPlayerVisible 
                        ? 'bg-accent text-background shadow-[0_10px_20px_-5px_rgba(var(--accent-rgb),0.4)]' 
                        : 'bg-accent/10 text-accent hover:bg-accent/20'
                    }`}
                    title={isPlayerVisible ? "Close Player" : "Open Player"}
                  >
                    <Music size={18} />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(var(--accent-rgb), 0.05)' }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      handleUploadClick();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center justify-center w-10 h-10 rounded-full border border-foreground/10 bg-foreground/5 text-foreground transition-all shadow-sm"
                    title="Upload Document (.txt, .md, .pdf)"
                  >
                    <Upload size={18} />
                  </motion.button>

                  {user && canShare && (
                    <motion.button
                      whileHover={{ scale: 1.1, backgroundColor: 'rgba(var(--accent-rgb), 0.05)' }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        onShare();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center justify-center w-10 h-10 rounded-full border border-foreground/10 bg-foreground/5 text-foreground transition-all shadow-sm"
                      title="Share as Novel"
                    >
                      <Share2 size={18} />
                    </motion.button>
                  )}
                </div>

                <div className="p-3 border-b border-foreground/10 flex justify-center">
                  <div className="flex items-center p-1 rounded-full border border-foreground/10 bg-foreground/5 gap-0.5">
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
                </div>

                <div className="p-2">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onPortfolioEditor();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-foreground/5 transition-all text-sm font-semibold"
                  >
                    <Palette size={16} className="opacity-60" />
                    Manage Portfolio
                  </button>

                  {!user && (
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        onSignIn();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-foreground/5 transition-all text-sm font-semibold"
                    >
                      <User size={16} className="opacity-60" />
                      Sign In
                    </button>
                  )}
                  
                  {user && (
                    <>
                      <div className="my-1 border-t border-foreground/10"></div>
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          onLogout();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-500 transition-all text-sm font-semibold"
                      >
                        <LogOut size={16} className="opacity-60" />
                        Sign Out
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

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

export default Header;
