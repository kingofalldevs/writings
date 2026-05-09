import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Book, Library, ArrowLeft, BookOpen, User, ExternalLink, Share2, Sparkles, Sun, Moon, Coffee, ChevronDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

import LandingFooter from './landing/LandingFooter';

const AuthorPortfolio = ({ authorUsername }) => {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedWork, setSelectedWork] = useState(null);
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const docRef = doc(db, 'portfolios', authorUsername.toLowerCase());
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          
          const allWorks = data.works;
          const folders = allWorks.filter(w => w.type === 'folder');
          const documents = allWorks.filter(w => w.type === 'document');

          // Helper to get all documents inside a folder recursively
          const getDocsInFolder = (folderId) => {
            let docs = documents.filter(d => d.parentId === folderId);
            const subFolders = folders.filter(f => f.parentId === folderId);
            
            subFolders.forEach(sub => {
              docs = [...docs, ...getDocsInFolder(sub.id)];
            });
            
            return docs;
          };

          // Only show folders that don't have a parent folder in the collection
          const topLevelFolders = folders.filter(f => 
            !f.parentId || !folders.some(parent => parent.id === f.parentId)
          );

          const books = topLevelFolders.map(folder => {
            const children = getDocsInFolder(folder.id)
              .sort((a, b) => (a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0));
            
            const combinedContent = children.map(c => c.content).join('\n\n');
            
            return {
              id: folder.id,
              name: folder.name,
              content: combinedContent,
              children: children,
              childCount: children.length,
              type: 'book'
            };
          }).filter(book => book.content.trim().length > 0);

          setPortfolio({ ...data, works: books });
        } else {
          setError("This author hasn't published their portfolio yet.");
        }
      } catch (err) {
        console.error(err);
        setError("Could not load the author's portfolio.");
      } finally {
        setLoading(false);
      }
    };

    if (authorUsername) {
      fetchPortfolio();
    }
  }, [authorUsername]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-foreground">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground p-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-12 rounded-4xl max-w-md"
        >
          <Library size={64} className="mx-auto mb-8 text-accent opacity-20" />
          <h2 className="text-3xl font-bold mb-4 font-serif">Portfolio Not Found</h2>
          <p className="text-muted mb-8 leading-relaxed">{error}</p>
          <a href="/" className="px-8 py-4 bg-accent text-background rounded-full font-bold hover:opacity-90 transition-all inline-block shadow-lg shadow-accent/20">
            Back to Home
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-accent selection:text-background">
      {/* Navigation - Landing Style */}
      <div className={`fixed top-0 left-0 right-0 z-[100] flex justify-center pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isScrolled ? 'p-6' : 'p-0'}`}>
        <nav className={`w-full flex items-center justify-between pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isScrolled 
            ? 'max-w-[1200px] px-8 py-4 bg-background/60 backdrop-blur-2xl rounded-[32px] border border-foreground/10 shadow-2xl' 
            : 'max-w-full px-12 py-6 bg-transparent border-transparent'
        }`}>
          {/* Left: Author Name as Logo */}
          <div 
            onClick={() => setSelectedWork(null)}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="transition-transform group-hover:scale-110">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 12H18L15 21L9 3L6 12H2" className="stroke-accent" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tighter text-foreground">{portfolio.authorName}</span>
          </div>

          <div className="hidden md:flex items-center gap-10">
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-6">
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

            <a
              href="/"
              className="hidden sm:block bg-transparent border-none text-sm font-medium text-foreground/60 cursor-pointer transition-opacity hover:opacity-100 no-underline"
            >
              Crescendo App
            </a>
            <a
              href="/"
              className="px-6 py-2.5 rounded-full border border-foreground/10 bg-foreground/5 text-foreground text-sm font-semibold cursor-pointer transition-all hover:bg-foreground/[0.08] hover:border-foreground/25 no-underline shadow-sm"
            >
              Start Writing
            </a>
          </div>
        </nav>
      </div>

      <AnimatePresence mode="wait">
        {selectedWork ? (
          <motion.div 
            key="reader"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed inset-0 z-[110] bg-background overflow-y-auto pt-20 custom-scrollbar"
          >
            <div className={`fixed top-0 left-0 right-0 z-[120] flex justify-center p-6`}>
              <nav className={`w-full max-w-[1200px] px-8 py-4 bg-background/60 backdrop-blur-2xl rounded-[32px] border border-foreground/10 shadow-2xl flex items-center justify-between`}>
                <button 
                  onClick={() => setSelectedWork(null)}
                  className="flex items-center gap-3 px-6 py-2 rounded-full hover:bg-foreground/5 transition-all group"
                >
                  <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                  <span className="text-xs font-bold tracking-widest uppercase">Back to Library</span>
                </button>
                <div className="flex-1 text-center hidden md:block">
                  <span className="text-sm font-serif italic opacity-50 truncate max-w-[300px] inline-block">Reading: {selectedWork.name}</span>
                </div>
                <div className="flex items-center gap-4">
                   <button className="p-3 rounded-full hover:bg-foreground/5 transition-all">
                    <Share2 size={18} className="opacity-50" />
                   </button>
                </div>
              </nav>
            </div>

            <article className="max-w-3xl mx-auto px-8 py-24 md:py-32">
              <header className="mb-32 text-center mt-20">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h1 className="text-5xl md:text-7xl font-bold mb-8 font-serif leading-tight tracking-tight text-foreground">
                    {selectedWork.name || 'Untitled'}
                  </h1>
                  <div className="flex items-center justify-center gap-4 text-muted mb-16">
                    <div className="w-8 h-[1px] bg-foreground/10" />
                    <span className="text-sm font-bold tracking-widest uppercase">{portfolio.authorName}</span>
                    <div className="w-8 h-[1px] bg-foreground/10" />
                  </div>

                  {/* Table of Contents */}
                  <div className="max-w-md mx-auto p-10 glass rounded-3xl border border-foreground/5 text-left">
                    <h3 className="text-xs font-bold tracking-[0.3em] uppercase opacity-40 mb-8 text-center">Table of Contents</h3>
                    <div className="space-y-4">
                       {selectedWork.children.map((chapter, idx) => (
                         <a 
                          key={chapter.id} 
                          href={`#chapter-${idx}`}
                          className="flex items-baseline justify-between group no-underline"
                         >
                           <span className="text-sm font-serif italic opacity-60 group-hover:opacity-100 group-hover:text-accent transition-all">
                             {idx + 1}. {chapter.name}
                           </span>
                           <div className="flex-1 border-b border-dotted border-foreground/10 mx-4 translate-y-[-4px]" />
                           <span className="text-[10px] font-bold opacity-30 group-hover:opacity-100 transition-all">CH {idx + 1}</span>
                         </a>
                       ))}
                    </div>
                  </div>
                </motion.div>
              </header>
              
              <div className="prose-container font-serif text-xl md:text-2xl leading-[2.2] text-foreground/90 selection:bg-accent/20">
                {selectedWork.children.map((chapter, idx) => (
                  <section 
                    key={chapter.id} 
                    id={`chapter-${idx}`}
                    className="mb-32 animate-fade-in"
                  >
                    <div className="flex flex-col items-center mb-16 opacity-30">
                       <span className="text-xs font-bold tracking-[0.5em] uppercase mb-4">Chapter {idx + 1}</span>
                       <h2 className="text-2xl font-serif italic">{chapter.name}</h2>
                       <div className="w-12 h-[1px] bg-foreground mt-8" />
                    </div>
                    <div className="whitespace-pre-wrap">
                      {chapter.content}
                    </div>
                  </section>
                ))}
              </div>

               <LandingFooter />
            </article>
          </motion.div>
        ) : (
          <motion.div 
            key="library"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-40"
          >
            {/* Simple Text Hero */}
            <section className="max-w-4xl mx-auto px-8 mb-32 text-center">
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.8 }}
               >
                  <h1 className="text-5xl md:text-7xl font-bold mb-10 font-serif tracking-tight leading-[1.1]">
                    {portfolio.authorName}
                  </h1>
                  <p className="text-xl md:text-2xl text-foreground/80 font-serif italic mb-12 leading-relaxed">
                    "{portfolio.bio || "Crafting narratives at the intersection of architecture, philosophy, and the quiet moments of the everyday."}"
                  </p>
                  <div className="flex flex-col items-center gap-6">
                    <div className="h-[1px] w-12 bg-accent/30" />
                    <div className="max-w-2xl">
                      <p className="text-xs font-bold tracking-[0.4em] uppercase opacity-40 mb-4">Inspirations & Influence</p>
                      <p className="text-sm leading-relaxed text-muted">
                        {portfolio.inspirations || "Inspired by the minimalist lines of mid-century design, the complex structures of classical music, and the raw beauty of the natural world."}
                      </p>
                    </div>
                  </div>
               </motion.div>
            </section>

            {/* Book Grid */}
            <section className="max-w-7xl mx-auto px-8 py-32">
               <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
                  <div className="max-w-xl">
                    <p className="text-xs font-bold tracking-[0.3em] uppercase opacity-40 mb-4">Library of {portfolio.authorName}</p>
                    <h2 className="text-5xl md:text-6xl font-bold mb-6 font-serif tracking-tight">Selected Works</h2>
                    <div className="h-1 w-24 bg-accent rounded-full" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold tracking-widest uppercase opacity-30">{portfolio.works.length} Volumes</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
                  {portfolio.works.map((work, idx) => (
                    <motion.div 
                      key={work.id || idx}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={() => setSelectedWork(work)}
                      className="group cursor-pointer"
                    >
                      {/* Premium Book Card */}
                      <div className="aspect-[3/4] relative rounded-lg overflow-hidden glass border border-foreground/10 mb-8 shadow-2xl group-hover:-translate-y-4 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]">
                         {/* Spine Highlight */}
                         <div className="absolute top-0 left-0 w-8 h-full bg-foreground/5 border-r border-foreground/5 z-10" />
                         
                         {/* Cover Content */}
                         <div className="absolute inset-0 p-12 pl-16 flex flex-col justify-between">
                            <div>
                               <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-10 group-hover:bg-accent group-hover:text-background transition-colors duration-500">
                                  <Book size={20} />
                               </div>
                               <h3 className="text-3xl md:text-4xl font-bold font-serif leading-[1.1] tracking-tight group-hover:text-accent transition-colors duration-500 line-clamp-4">
                                  {work.name || 'Untitled'}
                               </h3>
                            </div>
                            
                            <div className="space-y-6">
                               <div className="h-[1px] w-full bg-foreground/10 group-hover:w-full transition-all duration-700" />
                               <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold tracking-widest uppercase opacity-40">{work.childCount} Chapters</span>
                                  <span className="text-[10px] font-bold tracking-widest uppercase opacity-40">
                                    {Math.max(1, Math.ceil(work.content?.split(' ').length / 250))} MIN
                                  </span>
                               </div>
                            </div>
                         </div>

                         {/* Hover Overlay */}
                         <div className="absolute inset-0 bg-accent opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700" />
                         
                         {/* Text Snippet on hover */}
                         <div className="absolute inset-x-12 bottom-24 p-6 glass rounded-2xl translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 delay-100 pointer-events-none">
                            <p className="text-xs italic leading-relaxed line-clamp-3 opacity-70">
                               {work.content?.substring(0, 200)}...
                            </p>
                         </div>
                      </div>

                      <div className="flex items-center justify-between group-hover:px-2 transition-all duration-500">
                         <h4 className="font-bold text-sm tracking-tight">{work.name || 'Untitled'}</h4>
                         <div className="flex items-center gap-2 text-accent opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-4 group-hover:translate-x-0">
                            <span className="text-[10px] font-bold tracking-widest uppercase">Open</span>
                            <ExternalLink size={12} />
                         </div>
                      </div>
                    </motion.div>
                  ))}
               </div>

               {portfolio.works.length === 0 && (
                 <div className="text-center py-40 border-2 border-dashed border-foreground/10 rounded-[4rem]">
                   <p className="text-2xl font-serif italic text-muted mb-8">No volumes have been released yet.</p>
                   <a href="/" className="text-accent font-bold hover:underline">Start the first draft →</a>
                 </div>
               )}
            </section>

            <LandingFooter />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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

export default AuthorPortfolio;
