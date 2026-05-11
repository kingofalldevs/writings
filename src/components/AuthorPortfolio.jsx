'use client';
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Book, Library, ArrowLeft, BookOpen, User, ExternalLink, Share2, Sparkles, Sun, Moon, Coffee, ChevronDown, Link as LinkIcon, Mail, Edit3 } from 'lucide-react';
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

const AuthorPortfolio = ({ authorUsername, initialData }) => {
  const router = useRouter();
  const [portfolio, setPortfolio] = useState(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState(null);
  const [selectedWork, setSelectedWork] = useState(null);
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
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

  useEffect(() => {
    if (initialData) return; // Skip if we already have data from SSR
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
          
          const allWorks = data.works || [];
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
          }).filter(s => s.content.trim().length > 0);

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

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-accent selection:text-background" style={{ fontFamily }}>
      {/* Navigation - Floating Glass Style */}
      <div className="absolute top-0 left-0 w-full flex justify-center p-0 z-[100] bg-background/30 backdrop-blur-lg border-b border-foreground/5">
        <nav className="w-full max-w-full px-12 py-8 flex items-center justify-between">
          {/* Left: Author Name as Logo */}
          <div 
            onClick={() => setSelectedWork(null)}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="transition-transform group-hover:scale-110">
              <svg width="32" height="24" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 5c5-4 13-4 14 0s9 4 14 0" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12c5-4 13-4 14 0s9 4 14 0" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 19c5-4 13-4 14 0s9 4 14 0" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tighter text-foreground">{portfolio.authorName}</span>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-6">
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

            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  const el = document.getElementById('works-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-2.5 rounded-full text-foreground hover:opacity-70 text-sm font-semibold cursor-pointer transition-all"
              >
                My Works
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('connect-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-2.5 rounded-full bg-foreground text-background text-sm font-semibold cursor-pointer transition-all hover:opacity-90 shadow-xl shadow-foreground/5"
              >
                Let's Connect
              </button>
            </div>
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
              <nav className={`w-full max-w-[1200px] px-8 py-4 bg-background/60 backdrop-blur-2xl rounded-2xl border border-foreground/10 flex items-center justify-between`}>
                <button 
                  onClick={() => setSelectedWork(null)}
                  className="flex items-center gap-3 px-6 py-2 rounded-full hover:bg-foreground/5 transition-all group"
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
                  <div className="max-w-md mx-auto p-10 rounded-3xl border border-foreground/5 bg-foreground/[0.02] text-left">
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
                </motion.div>
              </header>
              
              <div className="prose-container text-xl md:text-2xl leading-[2.2] text-foreground/90 selection:bg-accent/20">
                {selectedWork.children.map((chapter, idx) => (
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
                ))}
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
            {/* Customizable Hero */}
            <section className="relative mb-8">
               {/* Banner Image Container */}
               <div className="absolute top-0 left-0 w-full h-[50vh] min-h-[400px] overflow-hidden z-0">
                  {portfolio.bannerImage ? (
                    <img src={portfolio.bannerImage} alt="Banner" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-foreground/[0.03]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-background" />
               </div>

               <div className="max-w-4xl mx-auto px-8 pt-40 md:pt-64 text-center relative z-10">
                 <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.8 }}
                 >
                    {portfolio.profileImage && (
                      <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-40 h-40 md:w-56 md:h-56 mx-auto mb-10 rounded-full overflow-hidden border-4 border-background shadow-2xl relative z-20"
                      >
                        <img 
                          src={portfolio.profileImage} 
                          alt={portfolio.authorName} 
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                    )}

                  <p className="text-2xl md:text-4xl text-foreground font-serif italic mb-10 leading-[1.6] max-w-3xl mx-auto tracking-tight">
                    "{portfolio.bio || "Crafting narratives at the intersection of architecture, philosophy, and the quiet moments of the everyday."}"
                  </p>
                  
                  {/* Category Tabs */}
                  <div className="flex items-center justify-center gap-8 md:gap-16 mt-12 border-b border-foreground/5 pb-8">
                    {['stories', 'articles', 'blog'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`relative py-2 text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase transition-all ${
                          activeTab === tab ? 'text-foreground' : 'text-foreground/30 hover:text-foreground/60'
                        }`}
                      >
                        {tab}
                        {activeTab === tab && (
                          <motion.div 
                            layoutId="activeTab"
                            className="absolute -bottom-[33px] left-0 right-0 h-[2px] z-10" 
                            style={{ backgroundColor: accentColor }} 
                          />
                        )}
                      </button>
                    ))}
                  </div>
                  
                  <div className="mt-2 text-center">
                    <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-1">Selected Works</h2>
                    <p className="text-[9px] font-bold tracking-[0.4em] uppercase opacity-20 mb-4">
                      {(portfolio[activeTab] || []).length} {activeTab}
                    </p>
                    <div className="h-px w-8 mx-auto opacity-20" style={{ backgroundColor: accentColor }} />
                  </div>
               </motion.div>
            </div>
         </section>

            {/* Book Grid */}
            <section id="works-section" className="max-w-7xl mx-auto px-8 pt-4 pb-32">

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
                  {(portfolio[activeTab] || []).length > 0 ? (
                    (portfolio[activeTab] || []).map((work, idx) => (
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
                        <div className="aspect-[3/4] relative rounded-lg overflow-hidden border border-foreground/10 mb-8 bg-foreground/[0.01] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]">
                           {/* Spine Highlight */}
                           <div className="absolute top-0 left-0 w-8 h-full bg-foreground/5 border-r border-foreground/5 z-10" />
                           
                           {/* Cover Content */}
                           <div className="absolute inset-0 p-12 pl-16 flex flex-col justify-between">
                              <div>
                                 <div className="w-10 h-10 rounded-lg bg-foreground/5 flex items-center justify-center mb-10 group-hover:text-background transition-colors duration-500" style={{ '--hover-bg': accentColor }}>
                                    {activeTab === 'stories' ? <Library size={20} /> : <BookOpen size={20} />}
                                 </div>
                                 <h3 className="text-3xl md:text-4xl font-bold leading-[1.1] tracking-tight group-hover:opacity-70 transition-opacity duration-500 line-clamp-4">
                                    {work.name || 'Untitled'}
                                  </h3>
                              </div>
                              
                              <div className="space-y-6">
                                 <div className="h-[1px] w-full bg-foreground/10 group-hover:w-full transition-all duration-700" />
                                 <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold tracking-widest uppercase opacity-40">
                                      {activeTab === 'stories' ? `${work.childCount} Chapters` : 'Article'}
                                    </span>
                                    <span className="text-[10px] font-bold tracking-widest uppercase opacity-40">
                                      {Math.max(1, Math.ceil((work.content || '').split(' ').length / 250))} MIN
                                    </span>
                                 </div>
                              </div>
                           </div>

                           {/* Hover Overlay */}
                           <div className="absolute inset-0 bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>
                        
                        <div className="flex items-center justify-between px-2">
                           <div>
                              <p className="text-[10px] font-bold tracking-widest uppercase opacity-30 mb-1">{work.type}</p>
                              <p className="text-sm font-medium opacity-60 group-hover:opacity-100 transition-opacity">Read {activeTab === 'stories' ? 'Collection' : 'Piece'} →</p>
                           </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full py-32 text-center opacity-30">
                      <p className="text-xs font-bold tracking-[0.4em] uppercase">No {activeTab} published yet</p>
                    </div>
                  )}
               </div>
            </section>

            {/* Connect Section - Refined Flat Style */}
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
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col w-full lg:w-[400px]"
                  >
                     {portfolio.socialTwitter && (
                       <a 
                         href={`https://twitter.com/${portfolio.socialTwitter.replace('@','')}`} 
                         target="_blank" 
                         className="group flex items-center justify-between py-8 border-b border-foreground/5 hover:border-foreground/20 transition-all relative"
                       >
                         <span className="text-[9px] font-bold tracking-[0.3em] uppercase opacity-30">Twitter</span>
                         <div className="flex items-center gap-4">
                            <span className="text-lg font-medium tracking-tight group-hover:-translate-x-2 transition-transform duration-500">@{portfolio.socialTwitter.replace('@','')}</span>
                            <Share2 size={16} className="opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-4 group-hover:translate-x-0" style={{ color: accentColor }} />
                         </div>
                         <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-foreground/20 group-hover:w-full transition-all duration-700" />
                       </a>
                     )}
                     {portfolio.socialLinkedin && (
                       <a 
                         href={`https://${portfolio.socialLinkedin}`} 
                         target="_blank" 
                         className="group flex items-center justify-between py-8 border-b border-foreground/5 hover:border-foreground/20 transition-all relative"
                       >
                         <span className="text-[9px] font-bold tracking-[0.3em] uppercase opacity-30">LinkedIn</span>
                         <div className="flex items-center gap-4">
                            <span className="text-lg font-medium tracking-tight group-hover:-translate-x-2 transition-transform duration-500">{portfolio.socialLinkedin.split('/in/')[1] || 'Profile'}</span>
                            <LinkedinIcon size={16} className="opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-4 group-hover:translate-x-0" style={{ color: accentColor }} />
                         </div>
                         <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-foreground/20 group-hover:w-full transition-all duration-700" />
                       </a>
                     )}
                     {portfolio.socialMedium && (
                       <a 
                         href={`https://${portfolio.socialMedium}`} 
                         target="_blank" 
                         className="group flex items-center justify-between py-8 border-b border-foreground/5 hover:border-foreground/20 transition-all relative"
                       >
                         <span className="text-[9px] font-bold tracking-[0.3em] uppercase opacity-30">Medium</span>
                         <div className="flex items-center gap-4">
                            <span className="text-lg font-medium tracking-tight group-hover:-translate-x-2 transition-transform duration-500">{portfolio.socialMedium.split('@')[1] || 'Read More'}</span>
                            <Edit3 size={16} className="opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-4 group-hover:translate-x-0" style={{ color: accentColor }} />
                         </div>
                         <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-foreground/20 group-hover:w-full transition-all duration-700" />
                       </a>
                     )}
                     {portfolio.socialSubstack && (
                       <a 
                         href={`https://${portfolio.socialSubstack}`} 
                         target="_blank" 
                         className="group flex items-center justify-between py-8 border-b border-foreground/5 hover:border-foreground/20 transition-all relative"
                       >
                         <span className="text-[9px] font-bold tracking-[0.3em] uppercase opacity-30">Substack</span>
                         <div className="flex items-center gap-4">
                            <span className="text-lg font-medium tracking-tight group-hover:-translate-x-2 transition-transform duration-500">{portfolio.socialSubstack.split('.')[0]}</span>
                            <Mail size={16} className="opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-4 group-hover:translate-x-0" style={{ color: accentColor }} />
                         </div>
                         <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-foreground/20 group-hover:w-full transition-all duration-700" />
                       </a>
                     )}
                     {portfolio.socialWeb && (
                       <a 
                         href={`https://${portfolio.socialWeb}`} 
                         target="_blank" 
                         className="group flex items-center justify-between py-8 border-b border-foreground/5 hover:border-foreground/20 transition-all relative"
                       >
                         <span className="text-[9px] font-bold tracking-[0.3em] uppercase opacity-30">Digital Home</span>
                         <div className="flex items-center gap-4">
                            <span className="text-lg font-medium tracking-tight group-hover:-translate-x-2 transition-transform duration-500">Visit Site</span>
                            <LinkIcon size={16} className="opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-4 group-hover:translate-x-0" style={{ color: accentColor }} />
                         </div>
                         <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-foreground/20 group-hover:w-full transition-all duration-700" />
                       </a>
                     )}
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
