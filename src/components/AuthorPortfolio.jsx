'use client';
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, getDoc, getDocs, collection, query } from 'firebase/firestore';
import { Library, ArrowLeft, ArrowRight, BookOpen, Share2, Sun, Moon, Coffee, Link as LinkIcon, Mail, Edit3, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

import LandingFooter from './landing/LandingFooter';

const IconTwitter = ({ size = 24, className = '', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 4.075H5.059z" />
  </svg>
);

const IconLinkedIn = ({ size = 24, className = '', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const IconSubstack = ({ size = 24, className = '', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
    <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
  </svg>
);

const IconMedium = ({ size = 24, className = '', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
    <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
  </svg>
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



  const processPortfolioData = (data) => {
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
    const topLevelDocs = documents.filter(d => !d.parentId && d.section !== 'blog');
    const topLevelBlogs = documents.filter(d => !d.parentId && d.section === 'blog');

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
      childCount: 1
    }));

    const blogs = topLevelBlogs.map(doc => ({
      ...doc,
      type: 'blog',
      childCount: 1
    }));

    return { ...data, stories, articles, blogs };
  };

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (initialData) {
        setPortfolio(processPortfolioData(initialData));
        setLoading(false);
        return;
      }
      
      try {
        const docRef = doc(db, 'portfolios', authorUsername.toLowerCase());
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPortfolio(processPortfolioData(docSnap.data()));
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
    <div className="min-h-screen flex flex-col bg-background text-foreground font-serif selection:bg-accent/20">
      {/* Refined Navigation */}
      <nav className="w-full px-8 md:px-16 py-8 flex flex-col md:flex-row items-center justify-between border-b border-foreground/5 sticky top-0 z-[100] bg-background/90 backdrop-blur-md">
        <h2 className="text-2xl font-medium tracking-wide">{portfolio.authorName}</h2>
        <div className="flex gap-10 text-[10px] font-sans font-bold uppercase tracking-[0.25em] mt-6 md:mt-0 opacity-70">
          <a href="#works-section" className="hover:text-accent hover:opacity-100 transition-all">Selected Works</a>
          <a href="#about-section" className="hover:text-accent hover:opacity-100 transition-all">Author</a>
          <a href="#connect-section" className="hover:text-accent hover:opacity-100 transition-all">Correspondence</a>
        </div>
      </nav>

      <div className="flex-grow max-w-[1400px] mx-auto w-full px-8 py-20 md:py-32">
        {/* Magazine-Style Hero */}
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-16 lg:gap-24 mb-40">
          <div className="space-y-10 max-w-3xl text-center lg:text-left flex-1">
            <div className="flex items-center gap-4 justify-center lg:justify-start opacity-50">
               <div className="w-12 h-[1px] bg-foreground" />
               <span className="text-[10px] font-sans font-bold uppercase tracking-[0.3em]">Volume I</span>
            </div>
            <h1 className="text-7xl md:text-[8rem] leading-[0.9] tracking-tighter font-normal">
              {portfolio.authorName}
              <span className="inline-block ml-2 text-6xl" style={{ color: accentColor }}>.</span>
            </h1>
            <p className="text-2xl md:text-4xl italic opacity-80 leading-normal max-w-2xl font-light">
              {portfolio.profession || portfolio.bio || 'Crafting literary narratives at the intersection of observation and imagination.'}
            </p>
          </div>
          {portfolio.profileImage && (
            <div className="relative flex-shrink-0 w-64 h-80 md:w-[400px] md:h-[500px]">
              {/* Elegant framing */}
              <div className="absolute inset-0 border border-foreground/20 translate-x-4 translate-y-4 md:translate-x-6 md:translate-y-6" />
              <img src={portfolio.profileImage} className="absolute inset-0 w-full h-full object-cover shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000" alt={portfolio.authorName} />
            </div>
          )}
        </div>
        
        {/* Works Section - Table of Contents Style */}
        <div id="works-section" className="space-y-40">
          {['stories', 'articles', 'blog'].map(section => (portfolio[section] || []).length > 0 && (
            <div key={section} className="space-y-20">
              <div className="flex flex-col items-center text-center space-y-4">
                <span className="text-[10px] font-sans font-bold uppercase tracking-[0.4em] opacity-40">Section</span>
                <h2 className="text-4xl md:text-5xl italic capitalize">{section === 'stories' ? 'Books & Stories' : section}</h2>
                <div className="w-12 h-[1px] mt-4" style={{ backgroundColor: accentColor }} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {(portfolio[section] || []).map((work, i) => (
                  <motion.div 
                    key={work.id || i} 
                    onClick={() => setSelectedWork(work)}
                    whileHover={{ y: -8 }}
                    className="group cursor-pointer flex flex-col justify-between p-10 md:p-12 border border-foreground/10 hover:border-foreground/40 transition-all duration-500 min-h-[300px] relative overflow-hidden bg-background/50 backdrop-blur-sm"
                  >
                     <div className="absolute inset-0 bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                     
                     <div className="space-y-8 relative z-10">
                       <div className="flex justify-between items-start">
                         <span className="text-[10px] font-sans font-bold uppercase tracking-widest opacity-40">
                           No. 0{i+1}
                         </span>
                       </div>
                       <h3 className="text-3xl md:text-4xl font-medium tracking-tight leading-[1.1]">
                         {work.name}
                       </h3>
                       {work.content && (
                         <p className="text-sm font-sans opacity-60 leading-relaxed line-clamp-3">
                           {work.content.replace(/[#*`>\-]/g, '').trim().substring(0, 150)}...
                         </p>
                       )}
                     </div>
                     
                     <div className="pt-8 mt-8 border-t border-foreground/10 flex justify-between items-center relative z-10">
                         <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] opacity-40 group-hover:opacity-100 transition-opacity" style={{ color: accentColor }}>
                           Read Piece
                         </span>
                         <span className="opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0" style={{ color: accentColor }}>
                           →
                         </span>
                     </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Philosophy - Elegant Quote */}
        {portfolio.inspirations && (
           <div id="about-section" className="mt-48 pt-32 border-t border-foreground/10 max-w-4xl mx-auto text-center relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-background flex items-center justify-center">
                 <svg className="w-8 h-8 opacity-20" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/></svg>
              </div>
              <p className="text-3xl md:text-5xl italic leading-[1.4] tracking-tight text-foreground/90">
                {portfolio.inspirations}
              </p>
           </div>
        )}
      </div>
    </div>
  );

  const renderMinimalistTemplate = () => (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <nav className="fixed top-0 inset-x-0 p-8 md:px-16 flex items-center justify-between z-[100] text-white">
        <span className="text-xl font-medium tracking-tight drop-shadow-md">{portfolio.authorName}</span>
        <div className="flex items-center gap-8 text-xs font-medium tracking-wide drop-shadow-md">
           <a href="#works" className="hover:opacity-70 transition-all">Works</a>
           <a href="#info" className="hover:opacity-70 transition-all">Info</a>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative w-full h-[60vh] md:h-[70vh] min-h-[500px] mb-32 md:mb-48">
        {/* Banner Background */}
        {portfolio.bannerImage ? (
          <img src={portfolio.bannerImage} className="absolute inset-0 w-full h-full object-cover" alt="Banner" />
        ) : (
          <div className="absolute inset-0 bg-foreground/10" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Content Container */}
        <div className="absolute inset-0 flex items-end">
          <div className="w-full max-w-7xl mx-auto px-8 md:px-16 flex flex-col md:flex-row items-start md:items-end gap-8 md:gap-16 translate-y-1/3 md:translate-y-1/4">
            {/* Profile Picture in a Box */}
            {portfolio.profileImage ? (
               <div className="w-48 h-64 md:w-64 md:h-80 bg-background p-2 md:p-3 shadow-2xl flex-shrink-0">
                 <img src={portfolio.profileImage} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Author" />
               </div>
            ) : (
               <div className="w-48 h-64 md:w-64 md:h-80 bg-background p-2 md:p-3 shadow-2xl flex-shrink-0 flex items-center justify-center">
                 <span className="opacity-20 text-xs uppercase tracking-widest text-foreground">No Photo</span>
               </div>
            )}
            
            {/* Author Info */}
            <div className="flex-grow text-white pb-8 z-10 hidden md:block -translate-y-1/3 md:-translate-y-1/4">
               <h1 className="text-5xl md:text-7xl lg:text-[6rem] font-bold tracking-tighter leading-[0.9] mb-6 drop-shadow-lg">
                 {portfolio.authorName}
               </h1>
               <p className="text-xl md:text-3xl font-light opacity-90 max-w-2xl leading-snug drop-shadow-md">
                 {portfolio.profession || portfolio.bio || 'Author & Writer'}
               </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Author Info (since it overlaps weirdly on small screens in the hero) */}
      <div className="md:hidden px-8 mb-24 space-y-4">
         <h1 className="text-5xl font-bold tracking-tighter leading-none">
           {portfolio.authorName}
         </h1>
         <p className="text-xl font-light opacity-60">
           {portfolio.profession || portfolio.bio || 'Author & Writer'}
         </p>
      </div>

      {/* Main Content */}
      <div className="px-8 md:px-16 pb-32 max-w-7xl mx-auto space-y-40">
        {/* Works */}
        <div id="works" className="space-y-24">
          {['stories', 'articles', 'blog'].map((section) => {
            const sectionWorks = portfolio[section] || [];
            if (sectionWorks.length === 0) return null;
            return (
              <div key={section} className="space-y-12">
                <div className="flex items-center gap-6">
                  <h3 className="text-2xl md:text-3xl font-medium tracking-tight capitalize">{section === 'stories' ? 'Books & Stories' : section}</h3>
                  <div className="flex-grow h-[1px] bg-foreground/10" />
                  <span className="text-xs uppercase tracking-widest opacity-40">{sectionWorks.length} items</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {sectionWorks.map((work, i) => (
                    <motion.div 
                      key={work.id || i} 
                      onClick={() => setSelectedWork(work)}
                      whileHover={{ y: -4 }}
                      className="group cursor-pointer bg-foreground/5 hover:bg-foreground hover:text-background p-8 md:p-10 transition-all duration-300 flex flex-col justify-between min-h-[300px]"
                    >
                      <div className="space-y-6">
                        <span className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-40 group-hover:opacity-60 block" style={{ color: accentColor }}>
                          No. {(i+1).toString().padStart(2, '0')}
                        </span>
                        <h4 className="text-2xl md:text-3xl font-medium tracking-tight leading-snug">
                          {work.name}
                        </h4>
                        {work.content && (
                          <p className="text-sm opacity-60 line-clamp-3 leading-relaxed">
                            {work.content.replace(/[#*`>\-]/g, '').trim()}
                          </p>
                        )}
                      </div>
                      
                      <div className="mt-12 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <span className="text-[10px] uppercase tracking-widest font-bold">Read Piece</span>
                         <ArrowRight size={20} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Philosophy */}
        {portfolio.inspirations && (
           <div id="info" className="p-10 md:p-20 bg-foreground/5 relative overflow-hidden group">
              <div className="absolute left-0 top-0 bottom-0 w-2 transition-all duration-500 group-hover:w-4" style={{ backgroundColor: accentColor }} />
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-40 mb-8 block">Concept</span>
              <p className="text-2xl md:text-4xl font-light leading-tight tracking-tight">
                "{portfolio.inspirations}"
              </p>
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
            <div className="absolute inset-0 opacity-60">
              {portfolio.bannerImage && <img src={portfolio.bannerImage} className="w-full h-full object-cover" />}
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-foreground/40 via-foreground/90 to-foreground" />
            
            <div className="relative z-10 flex justify-between items-start mb-20">
               <div className="w-40 h-40 md:w-52 md:h-52 rounded-full overflow-hidden border-2 border-background/20">
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
                  {portfolio.profession || portfolio.bio || 'Creative Writer & Author'}
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
        <div className="w-full lg:w-[55%] p-8 md:p-16 xl:p-24 space-y-24">
          {['stories', 'articles', 'blog'].map(section => (portfolio[section] || []).length > 0 && (
            <div key={section} className="space-y-8">
              <div className="inline-block px-6 py-3 rounded-none border-2 border-foreground uppercase text-sm font-bold tracking-widest">
                {section === 'blog' ? 'Blog' : section === 'articles' ? 'Articles' : 'Books & Stories'}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(portfolio[section] || []).map((work, i) => (
                  <motion.div 
                    key={work.id || i} 
                    onClick={() => setSelectedWork(work)}
                    whileHover={{ y: -3 }}
                    className="group p-8 bg-foreground/5 hover:bg-foreground hover:text-background transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[240px] relative overflow-hidden"
                  >
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-[0.3em] opacity-30 block mb-6">
                        {section === 'blog' ? 'Blog Post' : section === 'articles' ? 'Article' : 'Story'}
                      </span>
                      <h3 className="text-2xl md:text-3xl font-black tracking-tight leading-tight group-hover:text-accent transition-colors">
                        {work.name}
                      </h3>
                      {work.content && (
                        <p className="text-sm opacity-50 group-hover:opacity-70 line-clamp-2 leading-relaxed mt-4">
                          {work.content.replace(/[#*`>\-]/g, '').trim().substring(0, 100)}…
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-8">
                      <span className="text-[9px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-60 transition-opacity">Read</span>
                      <ArrowRight size={20} className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </div>
                    {/* Bottom accent bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] w-0 group-hover:w-full transition-all duration-500" style={{ backgroundColor: accentColor }} />
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCinematicTemplate = () => (
    <div className="min-h-screen bg-background text-foreground font-serif selection:bg-foreground/20">
      <nav className="fixed top-0 inset-x-0 p-8 flex items-center justify-between z-[100] text-foreground">
        <span className="text-2xl font-light tracking-wider">{portfolio.authorName}</span>
        <div className="flex items-center gap-12 text-[10px] font-sans uppercase tracking-[0.4em] font-bold">
           <a href="#works" className="hover:opacity-50 transition-opacity">Chronicles</a>
           <a href="#info" className="hover:opacity-50 transition-opacity">Epilogue</a>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative w-full h-screen flex flex-col items-center justify-center text-center">
        {portfolio.bannerImage ? (
           <div className="absolute inset-0 bg-fixed bg-cover bg-center" style={{ backgroundImage: `url(${portfolio.bannerImage})` }}>
              <div className="absolute inset-0 bg-background/80" />
           </div>
        ) : (
           <div className="absolute inset-0 bg-background" />
        )}
        
        <div className="relative z-10 max-w-5xl px-8 flex flex-col items-center space-y-12 text-foreground">
           <div className="w-1/2 h-[1px] bg-foreground/20 mb-12" />
           <span className="text-[10px] font-sans uppercase tracking-[0.6em] font-bold opacity-60">A Narrative Journey</span>
           <h1 className="text-7xl md:text-[9rem] font-light italic leading-[0.8] tracking-tighter drop-shadow-2xl">
             {portfolio.authorName}
           </h1>
           <p className="text-xl md:text-2xl font-sans font-light opacity-70 tracking-widest uppercase max-w-2xl mt-12">
             {portfolio.profession || portfolio.bio || 'Author & Writer'}
           </p>
           <div className="w-1/2 h-[1px] bg-foreground/20 mt-12" />
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-8 md:px-16 py-32 space-y-48 text-foreground">
        <div id="works" className="space-y-40">
          {['stories', 'articles', 'blog'].map((section) => {
            const sectionWorks = portfolio[section] || [];
            if (sectionWorks.length === 0) return null;
            return (
              <div key={section} className="space-y-24">
                <div className="text-center space-y-8">
                  <span className="text-[10px] font-sans uppercase tracking-[0.5em] font-bold opacity-40">Chapter // {section}</span>
                  <h2 className="text-5xl md:text-7xl font-light italic">{section === 'stories' ? 'Books & Stories' : section}</h2>
                </div>
                
                <div className="grid grid-cols-1 gap-24">
                  {sectionWorks.map((work, i) => (
                    <motion.div 
                      key={work.id || i} 
                      onClick={() => setSelectedWork(work)}
                      whileHover={{ scale: 1.02 }}
                      className="group cursor-pointer relative h-[60vh] min-h-[500px] flex items-center justify-center text-center overflow-hidden"
                    >
                      {/* Fake parallax container for each work */}
                      <div className="absolute inset-0 bg-foreground/5 group-hover:bg-foreground/10 transition-colors duration-1000" />
                      <div className="absolute top-8 left-8 right-8 bottom-8 border border-foreground/10 group-hover:border-foreground/30 transition-colors duration-1000" />
                      
                      <div className="relative z-10 px-8 md:px-24 space-y-12">
                         <span className="text-6xl md:text-8xl font-sans font-bold opacity-10">
                           {(i+1).toString().padStart(2, '0')}
                         </span>
                         <h3 className="text-4xl md:text-6xl font-light italic tracking-tight">
                           {work.name}
                         </h3>
                         {work.content && (
                           <p className="text-lg font-sans font-light opacity-60 line-clamp-3 leading-relaxed max-w-3xl mx-auto">
                             {work.content.replace(/[#*`>\-]/g, '').trim()}
                           </p>
                         )}
                         <div className="pt-12 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                           <span className="text-[10px] font-sans uppercase tracking-[0.4em] font-bold border-b border-foreground pb-2">Enter Tale</span>
                         </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {portfolio.inspirations && (
           <div id="info" className="py-48 flex flex-col items-center text-center space-y-16 border-t border-foreground/10 relative">
              {portfolio.profileImage && (
                 <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden mb-12 shadow-2xl shadow-foreground/20">
                   <img src={portfolio.profileImage} className="w-full h-full object-cover grayscale" />
                 </div>
              )}
              <span className="text-[10px] font-sans uppercase tracking-[0.5em] font-bold opacity-40">The Epilogue</span>
              <p className="text-3xl md:text-6xl font-light italic leading-tight tracking-tight max-w-4xl">
                "{portfolio.inspirations}"
              </p>
           </div>
        )}
      </div>
    </div>
  );

  const renderEditorialTemplate = () => (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-foreground selection:text-background">
      <nav className="w-full px-8 md:px-12 py-10 flex items-end justify-between border-b border-foreground/10">
        <div>
          <h2 className="text-3xl md:text-4xl font-light tracking-tighter">{portfolio.authorName}</h2>
        </div>
        <div className="flex gap-12 text-[10px] uppercase tracking-[0.2em] font-bold">
           <a href="#works" className="hover:opacity-50 transition-all">Curated Works</a>
           <a href="#info" className="hover:opacity-50 transition-all">Philosophy</a>
        </div>
      </nav>

      <div className="max-w-[1400px] mx-auto px-8 md:px-12 pt-12 pb-24">
        {/* Editorial Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24 items-center mb-48">
           <div className="lg:col-span-5 space-y-12 order-2 lg:order-1">
             <h1 className="text-6xl md:text-[7rem] font-light leading-[0.9] tracking-tighter">
               {portfolio.authorName.split(' ').map((name, i) => (
                 <span key={i} className="block">{name}</span>
               ))}
             </h1>
             <p className="text-xl md:text-2xl font-serif italic opacity-70 max-w-md">
               {portfolio.profession || portfolio.bio || 'Curator of literary experiences.'}
             </p>
           </div>
           
           <div className="lg:col-span-7 order-1 lg:order-2 h-[50vh] lg:h-[80vh] w-full relative">
             {portfolio.bannerImage ? (
                <img src={portfolio.bannerImage} className="absolute inset-0 w-full h-full object-cover" />
             ) : (
                <div className="absolute inset-0 bg-foreground/5" />
             )}
             <div className="absolute -bottom-12 -left-12 w-48 h-64 md:w-64 md:h-80 bg-background p-4 shadow-xl hidden md:block z-10">
               {portfolio.profileImage ? (
                 <img src={portfolio.profileImage} className="w-full h-full object-cover grayscale" />
               ) : (
                 <div className="w-full h-full bg-foreground/5" />
               )}
             </div>
           </div>
        </div>

        {/* Works - Asymmetrical Grid */}
        <div id="works" className="space-y-48">
          {['stories', 'articles', 'blog'].map((section) => {
            const sectionWorks = portfolio[section] || [];
            if (sectionWorks.length === 0) return null;
            return (
              <div key={section} className="space-y-24 border-t border-foreground/10 pt-24">
                <div className="flex items-center gap-12">
                   <h2 className="text-4xl md:text-6xl font-light tracking-tighter capitalize">{section === 'stories' ? 'Books & Stories' : section}</h2>
                   <span className="text-xs font-bold uppercase tracking-[0.3em] opacity-30 mt-4">Selected</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-24 gap-x-12 md:gap-x-24">
                  {sectionWorks.map((work, i) => {
                    // Asymmetrical styling
                    const isEven = i % 2 === 0;
                    return (
                      <motion.div 
                        key={work.id || i} 
                        onClick={() => setSelectedWork(work)}
                        className={`group cursor-pointer flex flex-col ${isEven ? 'md:mt-0' : 'md:mt-32'}`}
                      >
                         <div className="aspect-[3/4] w-full bg-foreground/5 mb-8 relative overflow-hidden flex items-center justify-center">
                            <span className="text-[12rem] font-light opacity-5 group-hover:scale-110 transition-transform duration-1000">
                              {(i+1)}
                            </span>
                            <div className="absolute inset-0 bg-transparent group-hover:bg-foreground/5 transition-colors duration-500" />
                            <div className="absolute bottom-8 right-8 w-12 h-12 rounded-full border border-foreground/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm">
                              <ArrowRight size={16} />
                            </div>
                         </div>
                         <div className="space-y-4 max-w-md">
                           <h3 className="text-2xl md:text-3xl font-medium tracking-tight">
                             {work.name}
                           </h3>
                           {work.content && (
                             <p className="text-sm opacity-60 line-clamp-2 leading-relaxed">
                               {work.content.replace(/[#*`>\-]/g, '').trim()}
                             </p>
                           )}
                         </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Philosophy */}
        {portfolio.inspirations && (
           <div id="info" className="mt-48 py-32 border-t border-foreground/10 grid grid-cols-1 md:grid-cols-3 gap-16">
              <div className="md:col-span-1">
                 <span className="text-[9px] uppercase tracking-[0.4em] font-bold opacity-40">Philosophy</span>
              </div>
              <div className="md:col-span-2">
                 <p className="text-3xl md:text-5xl font-light leading-[1.3] tracking-tight">
                   "{portfolio.inspirations}"
                 </p>
              </div>
           </div>
        )}
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
             portfolio.templateId === 'cinematic' ? renderCinematicTemplate() :
             portfolio.templateId === 'editorial' ? renderEditorialTemplate() :
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
                      Connect <br/>
                      <span className="italic font-serif opacity-40">with me.</span>
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
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-[500px]"
                  >
                     {[
                       { id: 'socialTwitter', label: 'Twitter', icon: IconTwitter, prefix: 'twitter.com/' },
                       { id: 'socialLinkedin', label: 'LinkedIn', icon: IconLinkedIn, prefix: 'linkedin.com/in/' },
                       { id: 'socialMedium', label: 'Medium', icon: IconMedium, prefix: 'medium.com/@' },
                       { id: 'socialSubstack', label: 'Substack', icon: IconSubstack, prefix: '' },
                       { id: 'socialWeb', label: 'Website', icon: LinkIcon, prefix: '' }
                     ].filter(s => portfolio[s.id]).map(social => (
                       <a
                         key={social.id}
                         href={portfolio[social.id].startsWith('http') ? portfolio[social.id] : `https://${social.prefix}${portfolio[social.id].replace('@','')}`}
                         target="_blank"
                         className="group relative flex flex-col justify-between p-8 bg-foreground/[0.03] hover:bg-foreground hover:text-background transition-all duration-300 overflow-hidden min-h-[140px]"
                       >
                         <span className="text-[9px] font-bold tracking-[0.3em] uppercase opacity-30 group-hover:opacity-60 transition-opacity">{social.label}</span>
                         <div className="flex items-end justify-between mt-6">
                           <span className="text-xl font-bold tracking-tight">
                             {portfolio[social.id].includes('/') ? (portfolio[social.id].split('/').pop() || 'Visit') : portfolio[social.id]}
                           </span>
                           <social.icon size={18} className="opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ color: accentColor }} />
                         </div>
                         <div className="absolute bottom-0 left-0 right-0 h-[2px] w-0 group-hover:w-full transition-all duration-500" style={{ backgroundColor: accentColor }} />
                       </a>
                     ))}

                     {portfolio.email && (
                       <a
                         href={`mailto:${portfolio.email}`}
                         className="group relative flex flex-col justify-between p-8 bg-foreground/[0.03] hover:bg-foreground hover:text-background transition-all duration-300 overflow-hidden min-h-[140px] sm:col-span-2"
                       >
                         <span className="text-[9px] font-bold tracking-[0.3em] uppercase opacity-30 group-hover:opacity-60 transition-opacity">Email</span>
                         <div className="flex items-end justify-between mt-6">
                           <span className="text-2xl font-bold tracking-tight">Say Hello →</span>
                           <Mail size={20} className="opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ color: accentColor }} />
                         </div>
                         <div className="absolute bottom-0 left-0 right-0 h-[2px] w-0 group-hover:w-full transition-all duration-500" style={{ backgroundColor: accentColor }} />
                       </a>
                     )}
                  </motion.div>
               </div>
            </section>

            {/* Blog Section */}
            {portfolio.blogs && portfolio.blogs.length > 0 && (
              <section id="blog-section" className="border-t border-foreground/5 py-32">
                <div className="max-w-7xl mx-auto px-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex items-end justify-between mb-16"
                  >
                    <div>
                      <p className="text-[10px] font-bold tracking-[0.5em] uppercase opacity-20 mb-4">Writing</p>
                      <h2 className="text-5xl md:text-7xl font-bold tracking-tight leading-none">
                        From the <span className="italic font-serif opacity-40">blog.</span>
                      </h2>
                    </div>
                    <span className="text-sm opacity-30 font-medium">{portfolio.blogs.length} post{portfolio.blogs.length !== 1 ? 's' : ''}</span>
                  </motion.div>

                  <div className="flex gap-6 overflow-x-auto pb-6 -mx-2 px-2" style={{ scrollbarWidth: 'none' }}>
                    {portfolio.blogs.map((post, i) => {
                      const wordCount = post.content ? post.content.trim().split(/\s+/).length : 0;
                      const readTime = Math.max(1, Math.ceil(wordCount / 200));
                      const excerpt = post.content ? post.content.replace(/[#*`>\-]/g, '').trim().slice(0, 160) : '';
                      const dateStr = post.timestamp?.seconds
                        ? new Date(post.timestamp.seconds * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                        : '';

                      return (
                        <motion.div
                          key={post.id}
                          initial={{ opacity: 0, y: 24 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.07 * Math.min(i, 6) }}
                          onClick={() => setSelectedWork(post)}
                          className="group flex-shrink-0 cursor-pointer"
                          style={{ width: '320px' }}
                        >
                          <div
                            className="relative flex flex-col justify-between h-[440px] rounded-none border border-foreground/10 hover:border-foreground/30 p-10 transition-all duration-500 overflow-hidden"
                            style={{ backgroundColor: 'var(--bg-secondary, rgba(255,255,255,0.02))' }}
                          >
                            {/* Accent stripe */}
                            <div
                              className="absolute top-0 left-0 right-0 h-[2px] w-0 group-hover:w-full transition-all duration-700"
                              style={{ backgroundColor: accentColor }}
                            />

                            <div>
                              {dateStr && (
                                <p className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-30 mb-8">{dateStr}</p>
                              )}
                              <h3 className="text-2xl font-bold leading-tight mb-5 group-hover:opacity-70 transition-opacity">
                                {post.name}
                              </h3>
                              {excerpt && (
                                <p className="text-sm opacity-40 leading-relaxed line-clamp-4">
                                  {excerpt}{excerpt.length === 160 ? '…' : ''}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center justify-between mt-8">
                              <span className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-25">
                                {readTime} min read
                              </span>
                              <ArrowRight
                                size={18}
                                className="opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500"
                                style={{ color: accentColor }}
                              />
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

            <LandingFooter onTerms={nav.onTerms} onPrivacy={nav.onPrivacy} onRefund={nav.onRefund} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthorPortfolio;
