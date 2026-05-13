'use client';
import { useState, useRef, useEffect } from 'react';
import { Upload, Sparkles, Menu, LogOut, User, Sun, Moon, Coffee, Music, Columns, Share2, Globe, Palette, LayoutDashboard, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import * as pdfjsLib from 'pdfjs-dist';

// pdfjsLib.GlobalWorkerOptions.workerSrc is set inside Header component to avoid SSR issues

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
  onToggleBinder,
  isBinderOpen,
  onPricing,
  currentView,
  onHome
}) => {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const fileInputRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    // Set PDF.js worker
    if (pdfjsLib && pdfjsLib.GlobalWorkerOptions) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib['version']}/build/pdf.worker.min.mjs`;
    }

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
      const pageText = textContent.items.map(item => item['str']).join(' ');
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
    <header className="fixed top-0 left-0 w-full h-20 px-6 md:px-12 flex items-center justify-between z-50 bg-background/80 backdrop-blur-2xl border-b border-foreground/10 shadow-sm transition-all duration-300">
      <div
        className={`flex items-center gap-2 md:gap-3 group shrink-0 ${currentView === 'dashboard' ? 'cursor-default' : 'cursor-pointer'}`}
        onClick={currentView === 'dashboard' ? undefined : onLogoClick}
      >
        <div className="flex items-center justify-center w-6 h-6 transition-transform group-hover:scale-110">
          <svg width="36" height="32" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 5c5-4 13-4 14 0s9 4 14 0" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 12c5-4 13-4 14 0s9 4 14 0" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 19c5-4 13-4 14 0s9 4 14 0" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span className="text-xl md:text-2xl font-bold tracking-tighter">Writings</span>
      </div>

      <div className="flex items-center gap-2 md:gap-4 flex-1 justify-start ml-4 md:ml-8">
        {currentView === 'editor' && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onHome}
            className="p-2 rounded-xl transition-all duration-300 text-muted hover:bg-foreground/5"
            title="Dashboard"
          >
            <LayoutDashboard size={18} />
          </motion.button>
        )}
        {(currentView === 'editor' || currentView === 'dashboard') && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleBinder}
            className={`p-2 rounded-xl transition-all duration-300 ${isBinderOpen
              ? 'bg-accent/10 text-accent'
              : 'text-muted hover:bg-foreground/5'
              }`}
            title={isBinderOpen ? "Hide Ideabase" : "Show Ideabase"}
          >
            <Columns size={18} />
          </motion.button>
        )}
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
                onClick={onQuickPublish}
                className="flex items-center gap-2 px-3 md:px-5 py-2 md:py-2.5 rounded-full bg-accent text-background transition-all text-[10px] md:text-[11px] font-bold tracking-widest uppercase"
                title="Instant Publish to Portfolio"
              >
                <Globe size={14} />
                <span className="hidden sm:inline">Publish</span>
              </motion.button>
            </div>
          )}

          {currentView !== 'dashboard' && (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-3 rounded-full hover:bg-foreground/5 transition-all border border-transparent hover:border-foreground/10 text-foreground"
            >
              <Menu size={20} />
            </button>
          )}

          <AnimatePresence>
            {isMenuOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsMenuOpen(false)}
                  className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[90] cursor-pointer"
                  style={{ top: 0, left: 0, width: '100vw', height: '100vh' }}
                />

                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                  className="fixed top-0 right-0 w-[320px] max-w-[85vw] h-screen bg-background/95 backdrop-blur-xl border-l border-foreground/10 shadow-2xl z-[100] flex flex-col"
                >
                  <div className="flex items-center justify-between p-6 border-b border-foreground/10">
                    <span className="font-serif font-bold text-xl tracking-tight">Menu</span>
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className="p-2 rounded-full hover:bg-foreground/5 transition-all text-foreground/60 hover:text-foreground"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto hide-scrollbar flex flex-col p-4">
                    {user && (
                      <div
                        onClick={() => {
                          setIsMenuOpen(false);
                          onAccount();
                        }}
                        className="p-4 mb-4 rounded-2xl border border-foreground/10 bg-foreground/[0.02] hover:bg-foreground/5 cursor-pointer transition-all flex flex-col"
                      >
                        <span className="text-sm font-bold truncate max-w-[200px]">
                          {user.displayName || user.email?.split('@')[0]}
                        </span>
                        <span className="text-[11px] opacity-50 truncate max-w-[200px] mt-0.5">
                          {user.email}
                        </span>
                      </div>
                    )}

                    <div className="grid grid-cols-4 gap-2 mb-6 px-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          onToggleAI();
                          setIsMenuOpen(false);
                        }}
                        className={`flex flex-col items-center justify-center gap-2 p-3 rounded-2xl transition-all ${isAIOpen
                          ? 'bg-accent text-background shadow-lg'
                          : 'bg-accent/5 text-accent hover:bg-accent/10'
                          }`}
                        title={isAIOpen ? "Close Aria" : "Ask Aria"}
                      >
                        <Sparkles size={18} fill={isAIOpen ? 'currentColor' : 'none'} />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          onTogglePlayer();
                          setIsMenuOpen(false);
                        }}
                        className={`flex flex-col items-center justify-center gap-2 p-3 rounded-2xl transition-all ${isPlayerVisible
                          ? 'bg-accent text-background shadow-lg'
                          : 'bg-accent/5 text-accent hover:bg-accent/10'
                          }`}
                        title={isPlayerVisible ? "Close Player" : "Open Player"}
                      >
                        <Music size={18} />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          handleUploadClick();
                          setIsMenuOpen(false);
                        }}
                        className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border border-foreground/10 bg-foreground/5 hover:bg-foreground/10 text-foreground transition-all"
                        title="Upload Document"
                      >
                        <Upload size={18} />
                      </motion.button>

                      {user && canShare ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            onShare();
                            setIsMenuOpen(false);
                          }}
                          className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border border-foreground/10 bg-foreground/5 hover:bg-foreground/10 text-foreground transition-all"
                          title="Share as Novel"
                        >
                          <Share2 size={18} />
                        </motion.button>
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border border-transparent opacity-0 pointer-events-none"></div>
                      )}
                    </div>

                    <div className="mb-6 px-2">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-muted mb-3 pl-2">Theme</div>
                      <div className="flex items-center p-1.5 rounded-2xl border border-foreground/10 bg-foreground/5 gap-1 justify-between">
                        <ThemeIcon
                          active={theme === 'light'}
                          onClick={() => toggleTheme('light')}
                          icon={<Sun size={16} />}
                        />
                        <ThemeIcon
                          active={theme === 'sepia'}
                          onClick={() => toggleTheme('sepia')}
                          icon={<Coffee size={16} />}
                        />
                        <ThemeIcon
                          active={theme === 'dark'}
                          onClick={() => toggleTheme('dark')}
                          icon={<Moon size={16} />}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 mt-auto">
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          onPortfolioEditor();
                        }}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-foreground/5 transition-all font-semibold border border-transparent hover:border-foreground/10"
                      >
                        <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center">
                          <Palette size={16} className="text-foreground" />
                        </div>
                        Manage Portfolio
                      </button>

                      {!user && (
                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            onSignIn();
                          }}
                          className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-foreground/5 transition-all font-semibold border border-transparent hover:border-foreground/10"
                        >
                          <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center">
                            <User size={16} className="text-foreground" />
                          </div>
                          Sign In
                        </button>
                      )}

                      {user && (
                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            onLogout();
                          }}
                          className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-red-500/10 text-red-500 transition-all font-semibold border border-transparent hover:border-red-500/10 mt-4"
                        >
                          <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                            <LogOut size={16} className="text-red-500" />
                          </div>
                          Sign Out
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              </>
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
    className={`flex-1 min-w-[3rem] h-10 rounded-xl flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${active ? 'bg-accent text-background shadow-md opacity-100' : 'bg-transparent text-muted opacity-60 hover:opacity-100 hover:bg-foreground/5'
      }`}
  >
    {icon}
  </button>
);

export default Header;
