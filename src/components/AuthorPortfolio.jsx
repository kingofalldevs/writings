'use client';
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, getDoc, getDocs, collection, query } from 'firebase/firestore';
import { Library, ArrowLeft, ArrowRight, BookOpen, Share2, Sun, Moon, Coffee, Link as LinkIcon, Mail, Edit3, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

import LandingFooter from './landing/LandingFooter';

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

const LinkedinIcon = (props) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const AuthorPortfolio = ({ authorUsername, initialData }) => {
  const router = useRouter();
  const [portfolio, setPortfolio] = useState(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState(null);
  const [selectedWork, setSelectedWork] = useState(null);
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('stories'); // stories, articles, blog

  const nav = {
    onStart: () => router.push('/dashboard'),
    onBack: () => router.push('/'),
    onPricing: () => router.push('/pricing'),
    onAria: () => router.push('/aria'),
    onPhilosophy: () => router.push('/philosophy'),
    onTerms: () => router.push('/terms'),
    onPrivacy: () => router.push('/privacy'),
    onRefund: () => router.push('/refund'),
  };



  useEffect(() => {
    const fetchPortfolio = async () => {
      if (initialData) {
        setLoading(false);
        return;
      }
      
      try {
        const docRef = doc(db, 'portfolios', authorUsername.toLowerCase());
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          
          // 1. Fetch LIVE works from the user's collection using their UID
          let allWorks = [];
          if (data.uid) {
            try {
              const worksSnapshot = await getDocs(query(collection(db, 'users', data.uid, 'works')));
              allWorks = worksSnapshot.docs.map(d => ({ ...d.data(), id: d.id }));
            } catch (worksErr) {
              console.warn("Could not fetch live works, falling back to snapshot:", worksErr);
              allWorks = data.works || [];
            }
          } else {
            allWorks = data.works || [];
          }

          const folders = allWorks.filter(w => w.type === 'folder');
          const documents = allWorks.filter(w => w.type === 'document');

          const getDocsInFolder = (folderId) => {
            let docs = documents.filter(d => d.parentId === folderId);
            const subFolders = folders.filter(f => f.parentId === folderId);
            subFolders.forEach(sub => {
              docs = [...docs, ...getDocsInFolder(sub.id)];
            });
            return docs;
          };

          const topLevelFolders = folders.filter(f => !f.parentId);
          const topLevelDocs = documents.filter(d => !d.parentId);

          const stories = topLevelFolders.map(folder => {
            const children = getDocsInFolder(folder.id)
              .sort((a, b) => (a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0));
            const combinedContent = children.map(c => c.content).join('\n\n');
            return {
              id: folder.id,
              name: folder.name,
              content: combinedContent,
              children: children,
              childCount: children.length,
              type: 'story'
            };
          }).filter(s => s.content && s.content.trim().length > 0);

          const articles = topLevelDocs.map(doc => ({
             ...doc,
             type: 'article',
             childCount: 1 // Single document
          }));

          setPortfolio({ 
            ...data, 
            stories: stories,
            articles: articles,
            blog: [] // For now
          });
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
          <a href="/" className="px-8 py-4 bg-accent text-background rounded-full font-bold hover:opacity-90 transition-all inline-block">
            Back to Home
          </a>
        </motion.div>
      </div>
    );
  }

  const accentColor = portfolio.accentColor || '#72B9AA';
  const fontFamily = portfolio.themeFont === 'sans' ? 'sans-serif' : "'Playfair Display', serif";

  const renderClassicTemplate = () => (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#2C2C2A] dark:bg-[#1A1A1A] dark:text-[#EAEAEA]">
      {/* Editorial Header */}
      <nav className="w-full px-8 md:px-16 py-12 flex flex-col md:flex-row items-center justify-between border-b border-foreground/10 sticky top-0 z-[100] bg-inherit">
        <h2 className="text-3xl md:text-4xl font-serif italic tracking-tight">{portfolio.authorName}</h2>
        <div className="flex gap-12 text-[11px] font-medium uppercase tracking-[0.2em] mt-6 md:mt-0">
          <a href="#works-section" className="hover:text-accent transition-colors">Selected Works</a>
          <a href="#about-section" className="hover:text-accent transition-colors">Author</a>
          <a href="#connect-section" className="hover:text-accent transition-colors">Correspondence</a>
        </div>
      </nav>

      <div className="flex-grow max-w-6xl mx-auto w-full px-8 py-24">
        {/* Editorial Hero */}
        <div className="flex flex-col md:flex-row items-center gap-16 md:gap-24 mb-32">
          {portfolio.profileImage ? (
            <div className="w-48 h-64 md:w-72 md:h-96 relative flex-shrink-0 group">
              <div className="absolute inset-0 bg-accent/10 translate-x-4 translate-y-4 rounded-none transition-transform group-hover:translate-x-6 group-hover:translate-y-6" style={{ backgroundColor: accentColor }} />
              <img src={portfolio.profileImage} className="w-full h-full object-cover rounded-none relative z-10 grayscale group-hover:grayscale-0 transition-all duration-700" alt={portfolio.authorName} />
            </div>
          ) : (
             <div className="w-16 h-[1px] bg-foreground/20" />
          )}
          <div className="space-y-8 max-w-2xl text-center md:text-left">
            <h1 className="text-6xl md:text-8xl font-serif leading-[1.1] tracking-tight">{portfolio.authorName}</h1>
            <p className="text-xl md:text-3xl font-serif italic opacity-70 leading-relaxed border-l-2 pl-6" style={{ borderColor: accentColor }}>
              {portfolio.bio || 'Crafting literary narratives...'}
            </p>
          </div>
        </div>
        
        {/* Works Section - Literary Grid */}
        <div id="works-section" className="space-y-32">
          {['stories', 'articles', 'blog'].map(section => (portfolio[section] || []).length > 0 && (
            <div key={section} className="space-y-16">
              <div className="flex items-center gap-6">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">The {section}</span>
                <div className="flex-grow h-[1px] bg-foreground/10" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
                {(portfolio[section] || []).map((work, i) => (
                  <motion.div 
                    key={work.id || i} 
                    onClick={() => setSelectedWork(work)}
                    whileHover={{ y: -4 }}
                    className="group cursor-pointer flex gap-8"
                  >
                     <div className="w-12 pt-2 flex flex-col items-center gap-4">
                       <span className="text-xl font-serif italic text-foreground/30 group-hover:text-foreground transition-colors">0{i+1}</span>
                       <div className="w-[1px] h-full bg-foreground/10 group-hover:bg-accent transition-colors" style={{ backgroundColor: accentColor }} />
                     </div>
                     <div className="space-y-6">
                       <h3 className="text-3xl md:text-4xl font-serif leading-tight group-hover:text-accent transition-colors">
                         {work.name}
                       </h3>
                       <p className="text-base md:text-lg opacity-60 leading-relaxed font-serif line-clamp-3">
                         {work.content?.substring(0, 180)}...
                       </p>
                       <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-foreground/40">
                         <span>Read Piece</span>
                         <div className="w-4 h-[1px] bg-foreground/40 group-hover:w-8 group-hover:bg-accent transition-all" />
                       </div>
                     </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Philosophy */}
        {portfolio.inspirations && (
           <div id="about-section" className="mt-40 pt-24 border-t border-foreground/10 max-w-3xl mx-auto text-center space-y-12">
              <div className="w-8 h-8 mx-auto opacity-20">
                 <svg viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/></svg>
              </div>
              <p className="text-3xl md:text-4xl font-serif italic leading-relaxed">
                {portfolio.inspirations}
              </p>
           </div>
        )}
      </div>
    </div>
  );

  const renderMinimalistTemplate = () => (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <nav className="fixed top-0 inset-x-0 p-8 flex items-center justify-between z-[100] mix-blend-difference text-white">
        <span className="text-2xl font-medium tracking-tighter">{portfolio.authorName}</span>
        <div className="flex items-center gap-8 text-xs font-medium tracking-wide">
           <a href="#works" className="hover:opacity-50 transition-opacity">Index</a>
           <a href="#connect" className="hover:opacity-50 transition-opacity">Info</a>
        </div>
      </nav>

      <div className="pt-[30vh] px-8 md:px-24 pb-32 max-w-[1400px] mx-auto">
        {/* Extreme Minimalist Hero */}
        <div className="max-w-4xl space-y-12 mb-40">
           <h1 className="text-[12vw] md:text-[8rem] font-medium leading-[0.85] tracking-tighter">
             {portfolio.authorName}
             <span className="inline-block w-4 h-4 md:w-8 md:h-8 rounded-full ml-4 md:ml-8 translate-y-[-10px] md:translate-y-[-20px]" style={{ backgroundColor: accentColor }} />
           </h1>
           <p className="text-2xl md:text-4xl max-w-2xl font-light leading-tight opacity-70">
             {portfolio.bio || 'Author & Writer'}
           </p>
        </div>

        {/* Gallery Works */}
        <div id="works" className="space-y-40">
          {['stories', 'articles', 'blog'].map((section) => (portfolio[section] || []).length > 0 && (
            <div key={section} className="border-t border-foreground text-foreground">
              <div className="py-6 flex justify-between items-center opacity-40">
                <span className="text-sm uppercase tracking-widest">{section}</span>
                <span className="text-sm">{(portfolio[section] || []).length} items</span>
              </div>
              <div className="grid grid-cols-1 border-t border-foreground">
                {(portfolio[section] || []).map((work, i) => (
                  <motion.div 
                    key={work.id || i} 
                    onClick={() => setSelectedWork(work)}
                    className="group border-b border-foreground flex flex-col md:flex-row items-baseline justify-between py-12 md:py-16 cursor-pointer hover:pl-8 transition-all duration-500"
                  >
                    <h3 className="text-5xl md:text-7xl font-medium tracking-tighter transition-colors" style={{ color: 'inherit' }}>
                      {work.name}
                    </h3>
                    <div className="flex items-center gap-12 mt-6 md:mt-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <span className="text-sm uppercase tracking-widest">Read</span>
                      <ArrowRight size={24} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {portfolio.profileImage && (
           <div className="mt-40 grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
              <div className="aspect-[3/4] bg-foreground/5 relative overflow-hidden">
                 <img src={portfolio.profileImage} className="w-full h-full object-cover mix-blend-luminosity hover:mix-blend-normal transition-all duration-1000" />
              </div>
              {portfolio.inspirations && (
                <div className="space-y-8">
                  <span className="text-sm uppercase tracking-widest opacity-40">Concept</span>
                  <p className="text-3xl md:text-5xl font-light leading-tight">
                    "{portfolio.inspirations}"
                  </p>
                </div>
              )}
           </div>
        )}
      </div>
    </div>
  );

  const renderModernTemplate = () => (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Column Wrapper - Ensures background stretches the full height */}
        <div className="w-full lg:w-[45%] bg-foreground text-background relative">
          
          {/* Sticky Inner Container */}
          <div className="lg:sticky lg:top-0 min-h-screen p-8 md:p-16 flex flex-col justify-between overflow-hidden relative">
            <div className="absolute inset-0 opacity-30 mix-blend-overlay">
              {portfolio.bannerImage && <img src={portfolio.bannerImage} className="w-full h-full object-cover" />}
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-foreground/10 via-foreground/80 to-foreground" />
            
            <div className="relative z-10 flex justify-between items-start mb-20">
               <div className="w-16 h-16 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-background/20">
                 {portfolio.profileImage ? <img src={portfolio.profileImage} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-background/10" />}
               </div>
               <span className="text-xs font-bold tracking-[0.2em] uppercase px-4 py-2 bg-background text-foreground rounded-none">
                 Portfolio
               </span>
            </div>

            <div className="relative z-10 space-y-12 pb-12">
              <div>
                <h1 className="text-[5rem] md:text-[8rem] lg:text-[7rem] font-black uppercase tracking-tighter leading-[0.8] mb-8 break-words" style={{ color: accentColor }}>
                  {portfolio.authorName}
                </h1>
                <p className="text-xl md:text-2xl font-medium max-w-md opacity-80 leading-snug">
                  {portfolio.bio || 'Creative Writer & Author'}
                </p>
              </div>

              {/* Writer's Extended Bio / Philosophy moved to fill the empty space */}
              {portfolio.inspirations && (
                 <div className="pt-12 border-t border-background/20">
                    <span className="text-xs font-bold uppercase tracking-widest opacity-40 block mb-6">Vision & Philosophy</span>
                    <p className="text-2xl md:text-3xl font-serif italic text-background/90 leading-tight">
                      "{portfolio.inspirations}"
                    </p>
                 </div>
              )}
            </div>
          </div>
        </div>

        {/* Scrolling Right Panel */}
        <div className="w-full lg:w-[55%] p-8 md:p-16 xl:p-24 space-y-32">
          {['stories', 'articles', 'blog'].map(section => (portfolio[section] || []).length > 0 && (
            <div key={section} className="space-y-12">
              <div className="inline-block px-6 py-3 rounded-none border-2 border-foreground uppercase text-sm font-bold tracking-widest">
                {section}
              </div>
              <div className="space-y-6">
                {(portfolio[section] || []).map((work, i) => (
                  <motion.div 
                    key={work.id || i} 
                    onClick={() => setSelectedWork(work)}
                    whileHover={{ scale: 1.02 }}
                    className="p-8 md:p-12 rounded-none bg-foreground/5 hover:bg-foreground hover:text-background transition-all duration-300 cursor-pointer group"
                  >
                    <div className="flex justify-between items-start gap-8 mb-6">
                      <h3 className="text-3xl md:text-5xl font-black tracking-tight leading-none group-hover:text-accent transition-colors">
                        {work.name}
                      </h3>
                      <ArrowRight size={32} className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </div>
                    <p className="text-lg opacity-60 group-hover:opacity-80 line-clamp-3 leading-relaxed">
                      {work.content?.substring(0, 150)}...
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground overflow-clip selection:bg-accent selection:text-background" style={{ fontFamily }}>
      {/* Settings Panel (Floating Toggle) */}
      <div className="fixed bottom-8 right-8 z-[200] flex flex-col gap-4">
         <div className="p-1 rounded-full bg-background/80 backdrop-blur-xl border border-foreground/10 shadow-2xl flex flex-col gap-1">
            <ThemeIcon active={theme === 'light'} onClick={() => toggleTheme('light')} icon={<Sun size={14} />} />
            <ThemeIcon active={theme === 'sepia'} onClick={() => toggleTheme('sepia')} icon={<Coffee size={14} />} />
            <ThemeIcon active={theme === 'dark'} onClick={() => toggleTheme('dark')} icon={<Moon size={14} />} />
         </div>
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
              <nav className={`w-full max-w-[1200px] px-8 py-4 bg-background/60 backdrop-blur-2xl rounded-none border border-foreground/10 flex items-center justify-between shadow-2xl shadow-black/5`}>
                <button 
                  onClick={() => setSelectedWork(null)}
                  className="flex items-center gap-3 px-6 py-2 rounded-none hover:bg-foreground/5 transition-all group"
                >
                  <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                  <span className="text-xs font-bold tracking-widest uppercase">Back to Library</span>
                </button>
                <div className="flex-1 text-center hidden md:block">
                  <span className="text-sm italic opacity-50 truncate max-w-[300px] inline-block">Reading: {selectedWork.name}</span>
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
                  <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight text-foreground">
                    {selectedWork.name || 'Untitled'}
                  </h1>
                  <div className="flex items-center justify-center gap-4 text-muted mb-16">
                    <div className="w-8 h-[1px] opacity-20" style={{ backgroundColor: accentColor }} />
                    <span className="text-sm font-bold tracking-widest uppercase">{portfolio.authorName}</span>
                    <div className="w-8 h-[1px] opacity-20" style={{ backgroundColor: accentColor }} />
                  </div>

                  {/* Table of Contents */}
                  {selectedWork.children?.length > 0 && (
                    <div className="max-w-md mx-auto p-10 rounded-none border border-foreground/5 bg-foreground/[0.02] text-left">
                      <h3 className="text-xs font-bold tracking-[0.3em] uppercase opacity-40 mb-8 text-center">Table of Contents</h3>
                      <div className="space-y-4">
                         {selectedWork.children.map((chapter, idx) => (
                           <a 
                            key={chapter.id} 
                            href={`#chapter-${idx}`}
                            className="flex items-baseline justify-between group no-underline"
                           >
                             <span className="text-sm italic opacity-60 group-hover:opacity-100 transition-all">
                               {idx + 1}. {chapter.name}
                             </span>
                             <div className="flex-1 border-b border-dotted border-foreground/10 mx-4 translate-y-[-4px]" />
                             <span className="text-[10px] font-bold opacity-30 group-hover:opacity-100 transition-all">CH {idx + 1}</span>
                           </a>
                         ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </header>
              
              <div className="prose-container text-xl md:text-2xl leading-[2.2] text-foreground/90 selection:bg-accent/20">
                {selectedWork.children?.length > 0 ? (
                  selectedWork.children.map((chapter, idx) => (
                    <section 
                      key={chapter.id} 
                      id={`chapter-${idx}`}
                      className="mb-32 animate-fade-in"
                    >
                      <div className="flex flex-col items-center mb-16 opacity-30">
                         <span className="text-xs font-bold tracking-[0.5em] uppercase mb-4">Chapter {idx + 1}</span>
                         <h2 className="text-2xl italic">{chapter.name}</h2>
                         <div className="w-12 h-[1px] mt-8" style={{ backgroundColor: accentColor }} />
                      </div>
                      <div className="whitespace-pre-wrap">
                        {chapter.content}
                      </div>
                    </section>
                  ))
                ) : (
                  <div className="whitespace-pre-wrap">
                    {selectedWork.content}
                  </div>
                )}
              </div>

               <LandingFooter onTerms={nav.onTerms} onPrivacy={nav.onPrivacy} onRefund={nav.onRefund} />
            </article>
          </motion.div>
        ) : (
          <motion.div 
            key="library"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className=""
          >
            {portfolio.templateId === 'minimalist' ? renderMinimalistTemplate() : 
             portfolio.templateId === 'modern' ? renderModernTemplate() : 
             renderClassicTemplate()}

            {/* Global Connect Section (Unified across templates for consistency) */}
            <section id="connect-section" className="max-w-7xl mx-auto px-8 py-48 border-t border-foreground/5">
               <div className="flex flex-col lg:flex-row items-start justify-between gap-24">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-2xl"
                  >
                    <p className="text-[10px] font-bold tracking-[0.5em] uppercase opacity-20 mb-10">Collaboration</p>
                    <h2 className="text-6xl md:text-9xl font-bold tracking-tightest mb-8 leading-[0.85]">
                      Let's create <br/>
                      <span className="italic font-serif opacity-40">together.</span>
                    </h2>
                    <p className="text-2xl font-serif italic text-foreground/40 mt-12 max-w-lg">
                      Interested in collaborating on a narrative project or have a story to tell? Let's connect.
                    </p>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col w-full lg:w-[450px]"
                  >
                     {[
                       { id: 'socialTwitter', label: 'Twitter', icon: Share2, prefix: 'twitter.com/' },
                       { id: 'socialLinkedin', label: 'LinkedIn', icon: LinkedinIcon, prefix: '' },
                       { id: 'socialMedium', label: 'Medium', icon: Edit3, prefix: '' },
                       { id: 'socialSubstack', label: 'Substack', icon: Mail, prefix: '' },
                       { id: 'socialWeb', label: 'Website', icon: LinkIcon, prefix: '' }
                     ].map(social => portfolio[social.id] && (
                       <a 
                         key={social.id}
                         href={portfolio[social.id].startsWith('http') ? portfolio[social.id] : `https://${social.prefix}${portfolio[social.id].replace('@','')}`} 
                         target="_blank" 
                         className="group flex items-center justify-between py-10 border-b border-foreground/5 hover:border-foreground/20 transition-all relative"
                       >
                         <span className="text-[9px] font-bold tracking-[0.3em] uppercase opacity-30">{social.label}</span>
                         <div className="flex items-center gap-6">
                            <span className="text-xl font-medium tracking-tight group-hover:-translate-x-2 transition-transform duration-500">
                              {portfolio[social.id].includes('/') ? (portfolio[social.id].split('/').pop() || 'Visit') : portfolio[social.id]}
                            </span>
                            <social.icon size={18} className="opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-4 group-hover:translate-x-0" style={{ color: accentColor }} />
                         </div>
                         <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-foreground/20 group-hover:w-full transition-all duration-700" />
                       </a>
                     ))}
                     
                     <a 
                       href={`mailto:${portfolio.email || ''}`}
                       className="group flex items-center justify-between py-10 border-b border-foreground/5 hover:border-foreground/20 transition-all relative"
                     >
                       <span className="text-[9px] font-bold tracking-[0.3em] uppercase opacity-30">Email</span>
                       <div className="flex items-center gap-6">
                          <span className="text-xl font-medium tracking-tight group-hover:-translate-x-2 transition-transform duration-500">Say Hello</span>
                          <Mail size={18} className="opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-4 group-hover:translate-x-0" style={{ color: accentColor }} />
                       </div>
                       <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-foreground/20 group-hover:w-full transition-all duration-700" />
                     </a>
                  </motion.div>
               </div>
            </section>

            <LandingFooter onTerms={nav.onTerms} onPrivacy={nav.onPrivacy} onRefund={nav.onRefund} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthorPortfolio;
