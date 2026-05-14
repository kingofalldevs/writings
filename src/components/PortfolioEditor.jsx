'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, ArrowLeft, Globe, Edit3, Sparkles, User, Monitor, Smartphone, Check, ChevronRight, Mail, ExternalLink, Menu, X, Send } from 'lucide-react';
import { db } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp, getDocs, collection, query } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

const PortfolioEditor = ({ user, onBack, showNotif }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [viewMode, setViewMode] = useState('mobile'); 
  const [activeTab, setActiveTab] = useState('profile'); 
  const [formData, setFormData] = useState({
    authorName: '',
    username: '',
    profession: '',
    bio: '',
    inspirations: '',
    themeFont: 'serif',
    accentColor: '#72B9AA',
    profileImage: '',
    bannerImage: '',
    socialTwitter: '',
    socialSubstack: '',
    socialWeb: '',
    socialLinkedin: '',
    socialMedium: '',
    templateId: 'classic'
  });

  // Preview internal state (simulation)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userWorks, setUserWorks] = useState({ stories: [], articles: [], blog: [] });

  useEffect(() => {
    const fetchWorks = async () => {
      if (!user) return;
      try {
        const worksSnapshot = await getDocs(query(collection(db, 'users', user.uid, 'works')));
        const allWorks = worksSnapshot.docs.map(d => ({ ...d.data(), id: d.id }));
        
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

        const stories = folders.filter(f => !f.parentId).map(folder => {
          const children = getDocsInFolder(folder.id);
          return { ...folder, children, childCount: children.length };
        }).filter(s => s.childCount > 0);

        const articles = documents.filter(d => !d.parentId);

        setUserWorks({ stories, articles, blog: [] });
      } catch (err) {
        console.error("Error fetching works for preview:", err);
      }
    };
    fetchWorks();
  }, [user]);

  useEffect(() => {
    const fetchExisting = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const defaultUsername = user.displayName?.split(' ')[0]?.toLowerCase() || user.email?.split('@')[0]?.toLowerCase() || 'author';
        const docRef = doc(db, 'portfolios', defaultUsername);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            authorName: data.authorName || user.displayName || '',
            username: data.username || defaultUsername,
            profession: data.profession || '',
            bio: data.bio || '',
            inspirations: data.inspirations || '',
            themeFont: data.themeFont || 'serif',
            accentColor: data.accentColor || '#72B9AA',
            profileImage: data.profileImage || '',
            bannerImage: data.bannerImage || '',
            socialTwitter: data.socialTwitter || '',
            socialSubstack: data.socialSubstack || '',
            socialWeb: data.socialWeb || '',
            socialLinkedin: data.socialLinkedin || '',
            socialMedium: data.socialMedium || '',
            templateId: data.templateId || 'classic'
          });
        } else {
          setFormData({
            authorName: user.displayName || '',
            username: defaultUsername,
            profession: '',
            bio: '',
            inspirations: '',
            themeFont: 'serif',
            accentColor: '#72B9AA',
            profileImage: '',
            bannerImage: '',
            socialTwitter: '',
            socialSubstack: '',
            socialWeb: '',
            socialLinkedin: '',
            socialMedium: '',
            templateId: 'classic'
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchExisting();
  }, [user]);

  const compressImage = (base64Str, maxWidth = 1200, maxHeight = 800) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.6));
      };
    });
  };

  const handlePublish = async () => {
    if (!user) return;
    setPublishing(true);
    try {
      const cleanUsername = formData.username.toLowerCase().trim();
      const docRef = doc(db, 'portfolios', cleanUsername);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().uid !== user.uid) {
        showNotif("Handle Taken", "This handle is already secured by another writer.", "error");
        setPublishing(false);
        return;
      }
      const worksSnapshot = await getDocs(query(collection(db, 'users', user.uid, 'works')));
      const works = worksSnapshot.docs.map(d => ({ ...d.data(), id: d.id }));
      await setDoc(docRef, {
        uid: user.uid,
        authorName: formData.authorName,
        username: cleanUsername,
        profession: formData.profession,
        bio: formData.bio,
        inspirations: formData.inspirations,
        themeFont: formData.themeFont,
        accentColor: formData.accentColor,
        profileImage: formData.profileImage,
        bannerImage: formData.bannerImage,
        socialTwitter: formData.socialTwitter,
        socialSubstack: formData.socialSubstack,
        socialWeb: formData.socialWeb,
        socialLinkedin: formData.socialLinkedin,
        socialMedium: formData.socialMedium,
        templateId: formData.templateId,
        works: works,
        timestamp: serverTimestamp()
      }, { merge: true });

      const isLocal = typeof window !== 'undefined' && window.location.hostname === 'localhost';
      const displayUrl = isLocal ? `${cleanUsername}.localhost:3000` : `${cleanUsername}.writings.page`;
      showNotif("Portfolio Live", `Your portfolio is now live at ${displayUrl}`, "success");
    } catch (err) {
      console.error(err);
      showNotif("Publish Failed", "Something went wrong. Please try again.", "error");
    } finally {
      setPublishing(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-[#FDF8F1]">
      <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }} transition={{ duration: 2, repeat: Infinity }} className="w-10 h-10 border-2 border-black border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="h-screen flex bg-[#FDF8F1] overflow-hidden font-sans text-[#1A1A1A]">
      {/* Sidebar Editor */}
      <aside className="w-[450px] bg-white border-r border-black/10 flex flex-col h-full shadow-2xl relative z-50">
        <div className="p-8 pb-6">
          <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-black/60 hover:text-black transition-all mb-8">
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
          <h1 className="text-4xl font-serif font-bold tracking-tight mb-2">Editor</h1>
          <p className="text-sm text-black/70 font-medium">Design your professional writing portfolio.</p>
        </div>

        <div className="flex px-8 border-b border-black/10">
          {['profile', 'templates', 'design', 'social'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-4 px-4 text-[10px] font-bold uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-[#1A1A1A]' : 'text-black/30'}`}>
              {tab}
              {activeTab === tab && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />}
            </button>
          ))}
        </div>

        <div className="flex-grow overflow-y-auto custom-scrollbar p-8 space-y-10">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div key="profile" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-black/60">Author Name</label>
                  <input type="text" value={formData.authorName} onChange={(e) => setFormData({...formData, authorName: e.target.value})} className="w-full bg-black/[0.04] rounded-xl px-5 py-4 outline-none font-serif text-lg" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-black/60">Profession / Title</label>
                  <input type="text" value={formData.profession} onChange={(e) => setFormData({...formData, profession: e.target.value})} placeholder="e.g. Creative Writer & Author" className="w-full bg-black/[0.04] rounded-xl px-5 py-4 outline-none font-serif text-lg" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-black/60">Bio</label>
                  <textarea value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} className="w-full bg-black/[0.04] rounded-xl px-5 py-4 outline-none font-serif text-base h-32" />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase text-black/60">Profile & Banner</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative aspect-square rounded-2xl bg-black/[0.04] flex items-center justify-center border border-black/5 overflow-hidden">
                       {formData.profileImage ? <img src={formData.profileImage} className="w-full h-full object-cover" /> : <User size={24} className="opacity-20" />}
                       <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={async (e) => {
                         const file = e.target.files[0];
                         if (file) {
                           const reader = new FileReader();
                           reader.onloadend = async () => {
                             const compressed = await compressImage(reader.result, 400, 400);
                             setFormData(p => ({ ...p, profileImage: compressed }));
                           };
                           reader.readAsDataURL(file);
                         }
                       }} />
                    </div>
                    <div className="relative aspect-square rounded-2xl bg-black/[0.04] flex items-center justify-center border border-black/5 overflow-hidden">
                       {formData.bannerImage ? <img src={formData.bannerImage} className="w-full h-full object-cover" /> : <Globe size={24} className="opacity-20" />}
                       <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={async (e) => {
                         const file = e.target.files[0];
                         if (file) {
                           const reader = new FileReader();
                           reader.onloadend = async () => {
                             const compressed = await compressImage(reader.result, 1600, 900);
                             setFormData(p => ({ ...p, bannerImage: compressed }));
                           };
                           reader.readAsDataURL(file);
                         }
                       }} />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'templates' && (
              <motion.div key="templates" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                {[
                  { id: 'classic', label: 'Classic', desc: 'Centered, elegant, timeless.' },
                  { id: 'minimalist', label: 'Minimalist', desc: 'Focus on typography and whitespace.' },
                  { id: 'modern', label: 'Modern Bold', desc: 'Split-screen, high-impact cards.' },
                  { id: 'cinematic', label: 'Cinematic', desc: 'Deep, immersive, luxury storytelling.' },
                  { id: 'editorial', label: 'Editorial', desc: 'High-fashion, airy exhibition style.' }
                ].map(t => (
                  <button key={t.id} onClick={() => setFormData({...formData, templateId: t.id})} className={`w-full text-left p-6 rounded-2xl border-2 transition-all ${formData.templateId === t.id ? 'border-black bg-black/[0.02]' : 'border-black/5'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm">{t.label}</span>
                      {formData.templateId === t.id && <Check size={16} />}
                    </div>
                    <p className="text-[10px] text-black/40">{t.desc}</p>
                  </button>
                ))}
              </motion.div>
            )}

            {activeTab === 'design' && (
              <motion.div key="design" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase text-black/60">Accent Color</label>
                  <div className="flex items-center gap-4">
                    <input type="color" value={formData.accentColor} onChange={(e) => setFormData({...formData, accentColor: e.target.value})} className="w-12 h-12 rounded-full border-none p-0 overflow-hidden cursor-pointer" />
                    <input type="text" value={formData.accentColor} onChange={(e) => setFormData({...formData, accentColor: e.target.value})} className="bg-black/[0.04] rounded-lg px-4 py-2 font-mono text-xs uppercase" />
                  </div>
                </div>
                <div className="space-y-4">
                   <label className="text-[10px] font-bold uppercase text-black/60">Creative Philosophy</label>
                   <textarea value={formData.inspirations} onChange={(e) => setFormData({...formData, inspirations: e.target.value})} className="w-full bg-black/[0.04] rounded-xl px-5 py-4 outline-none text-sm h-32" placeholder="What drives your writing?" />
                </div>
              </motion.div>
            )}

            {activeTab === 'social' && (
              <motion.div key="social" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                {[
                  { id: 'socialTwitter', label: 'X (Twitter)', icon: <X size={14} /> },
                  { id: 'socialSubstack', label: 'Substack', icon: <Globe size={14} /> },
                  { id: 'socialLinkedin', label: 'LinkedIn', icon: <Globe size={14} /> },
                  { id: 'socialMedium', label: 'Medium', icon: <Globe size={14} /> },
                  { id: 'socialWeb', label: 'Website', icon: <Globe size={14} /> }
                ].map(s => (
                  <div key={s.id} className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-black/60 flex items-center gap-2">{s.icon}{s.label}</label>
                    <input type="text" value={formData[s.id]} onChange={(e) => setFormData({...formData, [s.id]: e.target.value})} className="w-full bg-black/[0.04] rounded-xl px-5 py-4 outline-none text-sm" placeholder="@username" />
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>

      {/* Preview Main */}
      <main className="flex-grow flex flex-col items-center justify-start relative overflow-hidden bg-[#FDF8F1]">
        <div className="w-full px-12 py-6 flex items-center justify-between sticky top-0 z-30 bg-[#FDF8F1]/80 backdrop-blur-md">
          <div className="w-1/3"></div>
          <div className="flex items-center gap-8 relative z-10">
            <button onClick={() => setViewMode('desktop')} className={`flex items-center gap-2 px-4 py-2 transition-all ${viewMode === 'desktop' ? 'opacity-100' : 'opacity-20'}`}><Monitor size={18} /><span className="text-sm font-bold">Desktop</span></button>
            <button onClick={() => setViewMode('mobile')} className={`flex items-center gap-2 px-4 py-2 transition-all ${viewMode === 'mobile' ? 'opacity-100' : 'opacity-20'}`}><Smartphone size={18} /><span className="text-sm font-bold">Mobile</span></button>
          </div>
          <div className="w-1/3 flex items-center justify-end gap-4">
            <button onClick={() => {
              const isLocal = window.location.hostname === 'localhost';
              const url = isLocal ? `http://${formData.username}.localhost:3000` : `https://${formData.username}.writings.page`;
              window.open(url, '_blank');
            }} className="px-4 py-2 rounded-full border border-black/10 text-[10px] font-bold uppercase">Live View</button>
            <button onClick={handlePublish} disabled={publishing} className="px-6 py-2 rounded-full bg-black text-[#FDF8F1] font-bold text-xs shadow-lg">{publishing ? '...' : 'Publish'}</button>
          </div>
        </div>

        <div className="flex-grow w-full flex items-center justify-center p-8 min-h-0">
          <div className={`transition-all duration-700 ${viewMode === 'mobile' ? 'w-[375px] h-[750px] max-h-full rounded-[3rem] border-[12px]' : 'w-[95%] max-w-[1200px] h-full max-h-[85vh] rounded-2xl border-t-[32px] border-x-[1px] border-b-[1px]'} border-[#1A1A1A] bg-white overflow-hidden relative shadow-2xl group`}>
            
            {/* Address Bar Simulation */}
            {viewMode === 'desktop' && <div className="absolute top-[-24px] left-4 flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" /><div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" /><div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" /></div>}
            {viewMode === 'mobile' && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-[100]" />}

            {/* Template Container */}
            <div className="absolute inset-0 overflow-y-auto bg-white custom-scrollbar" style={{ fontFamily: formData.themeFont === 'serif' ? "'Playfair Display', serif" : 'sans-serif' }}>
              
              {/* Preview Navbar */}
              <nav className={`w-full px-8 py-6 flex items-center justify-between sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-black/5`}>
                <span className="font-serif font-bold text-lg">{formData.authorName || 'Writer'}</span>
                {viewMode === 'mobile' ? (
                  <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2"><Menu size={20} /></button>
                ) : (
                  <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest opacity-60">
                    <a href="#works" className="hover:opacity-100">Works</a>
                    <a href="#about" className="hover:opacity-100">About</a>
                    <a href="#contact" className="hover:opacity-100">Contact</a>
                  </div>
                )}
              </nav>

              {/* Mobile Menu Overlay */}
              <AnimatePresence>
                {isMobileMenuOpen && viewMode === 'mobile' && (
                  <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="absolute inset-0 z-[100] bg-black text-white p-12 flex flex-col justify-between">
                    <button onClick={() => setIsMobileMenuOpen(false)} className="self-end p-2"><X size={24} /></button>
                    <div className="space-y-10">
                      {['Works', 'About', 'Contact'].map(item => <button key={item} className="block text-4xl font-serif font-bold">{item}</button>)}
                    </div>
                    <div className="flex gap-6 opacity-40 text-xs uppercase font-bold"><span>X</span><span>Newsletter</span></div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Template: Classic */}
              {formData.templateId === 'classic' && (
                <div className="text-center">
                  <div className="h-[40vh] bg-black/5 relative flex items-center justify-center overflow-hidden">
                    {formData.bannerImage && <img src={formData.bannerImage} className="w-full h-full object-cover" />}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white" />
                  </div>
                  <div className="px-8 -mt-20 relative z-10 space-y-12 pb-32">
                    {formData.profileImage && <div className={`${viewMode === 'mobile' ? 'w-24 h-24' : 'w-32 h-32'} rounded-full overflow-hidden mx-auto border-4 border-white shadow-xl`}><img src={formData.profileImage} className="w-full h-full object-cover" /></div>}
                    <h2 className={`${viewMode === 'mobile' ? 'text-3xl' : 'text-5xl'} font-bold`}>{formData.authorName || 'Your Name'}</h2>
                    <p className={`${viewMode === 'mobile' ? 'text-base' : 'text-xl'} italic opacity-60 max-w-xl mx-auto`}>"{formData.profession || formData.bio || 'Crafting narratives...'}"</p>
                    
                    {/* Works Sections */}
                    {['Stories', 'Articles', 'Blog'].map(section => {
                      const sectionKey = section.toLowerCase();
                      const works = userWorks[sectionKey] || [];
                      if (works.length === 0) return null;
                      return (
                        <div key={section} className="pt-20 space-y-12">
                          <div className="flex flex-col items-center gap-3">
                            <p className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-30">{section}</p>
                            <div className="h-[2px] w-8" style={{ backgroundColor: formData.accentColor }} />
                          </div>
                          <div className={`grid ${viewMode === 'mobile' ? 'grid-cols-1' : 'grid-cols-3'} gap-8`}>
                            {works.map((work, i) => (
                              <div key={work.id || i} className="group p-8 border border-black/5 rounded-2xl hover:bg-black/[0.02] transition-all text-left space-y-4">
                                 <div className="w-10 h-1 w-full bg-black/5 group-hover:bg-black/10 transition-colors" />
                                 <h3 className="text-xl font-bold line-clamp-2">{work.name}</h3>
                                 <p className="text-xs opacity-40 leading-relaxed line-clamp-2">
                                   {work.content ? work.content.substring(0, 100) + '...' : 'Exploring narratives...'}
                                 </p>
                                 <span className="text-[9px] font-bold uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">Read More <ChevronRight size={10} /></span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}

                    {formData.inspirations && (
                      <div className="pt-20 space-y-8 max-w-xl mx-auto">
                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-30">Philosophy</p>
                        <p className="text-xl italic opacity-80 leading-relaxed">
                          {formData.inspirations}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Template: Minimalist */}
              {formData.templateId === 'minimalist' && (
                <div className={`px-6 ${viewMode === 'mobile' ? 'pt-20 pb-20' : 'md:px-24 pt-40 pb-40'} space-y-40 bg-[#F9F9F9]`}>
                  {/* High-Impact Centered Hero */}
                  <div className="max-w-5xl mx-auto text-center space-y-16">
                    <div className="flex flex-col items-center gap-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-[1px] bg-black/20" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-black/40">Welcome to my portfolio</span>
                        <div className="w-12 h-[1px] bg-black/20" />
                      </div>
                      <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`${viewMode === 'mobile' ? 'text-6xl' : 'text-8xl md:text-[11rem]'} font-black tracking-tighter leading-[0.8] text-[#1A1A1A]`}
                      >
                        {formData.authorName || 'Writer'}<span style={{ color: formData.accentColor }}>.</span>
                      </motion.h2>
                    </div>

                    {formData.profileImage && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative inline-block"
                      >
                        <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden mx-auto border-4 border-white shadow-2xl relative z-10">
                          <img src={formData.profileImage} className="w-full h-full object-cover" alt="Profile" />
                        </div>
                        <div className="absolute -inset-4 rounded-full blur-2xl opacity-20" style={{ backgroundColor: formData.accentColor }} />
                      </motion.div>
                    )}
                    
                    <div className="max-w-3xl mx-auto space-y-8">
                      <div className="h-[2px] w-12 bg-black mx-auto" style={{ backgroundColor: formData.accentColor }} />
                      <p className={`${viewMode === 'mobile' ? 'text-xl' : 'text-3xl'} font-serif italic text-black/60 leading-relaxed`}>
                        {formData.profession || formData.bio || 'Crafting narratives at the intersection of human experience and digital evolution.'}
                      </p>
                    </div>
                  </div>

                  {/* Refined Curated Works */}
                  {['Stories', 'Articles', 'Blog'].map((section, idx) => {
                    const sectionKey = section.toLowerCase();
                    const works = userWorks[sectionKey] || [];
                    if (works.length === 0) return null;
                    return (
                      <div key={section} className="max-w-6xl mx-auto space-y-16">
                        <div className="flex items-center justify-between border-b border-black/10 pb-6">
                          <div className="flex items-center gap-4">
                            <span className="text-[10px] font-bold opacity-20">0{idx + 1}</span>
                            <h3 className="text-2xl font-black tracking-tight uppercase">{section}</h3>
                          </div>
                          <span className="text-[10px] font-mono opacity-20">SELECTED WORKS</span>
                        </div>
                        
                        <div className={`grid ${viewMode === 'mobile' ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3'} gap-x-12 gap-y-20`}>
                          {works.map((work, i) => (
                            <motion.div 
                              key={work.id || i} 
                              whileHover={{ y: -12 }}
                              className="group cursor-pointer"
                            >
                              <div className="aspect-[3/4] md:aspect-[3/3.8] bg-[#F3EEE2] rounded-lg overflow-hidden relative border border-black/[0.05] shadow-xl group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] transition-all duration-500 flex flex-col p-10 md:p-14">
                                  {/* Elegant Spine */}
                                  <div className="absolute inset-y-0 left-0 w-8 bg-black/[0.02] border-r border-black/[0.03]" />
                                  
                                  {/* Icon & Brand */}
                                  <div className="flex flex-col gap-8 relative z-10">
                                     <div className="w-12 h-12 md:w-16 md:h-16 bg-black/5 rounded-xl flex items-center justify-center">
                                        <div className="flex gap-1">
                                          <div className="w-0.5 h-5 md:h-6 bg-black/20 rounded-full" />
                                          <div className="w-0.5 h-5 md:h-6 bg-black/40 rounded-full" />
                                          <div className="w-0.5 h-5 md:h-6 bg-black/20 rounded-full rotate-12" />
                                        </div>
                                     </div>
                                  </div>

                                  {/* Title Area - Larger & More Impactful */}
                                  <div className="flex-grow flex flex-col justify-center py-12 relative z-10">
                                     <h4 className={`${viewMode === 'mobile' ? 'text-3xl' : 'text-4xl md:text-5xl'} font-black text-[#2A2A2A] leading-[1.05] tracking-tighter`}>
                                       {work.name}
                                     </h4>
                                     <div className="h-[2px] w-12 bg-black/10 mt-8 group-hover:w-20 group-hover:bg-black transition-all duration-500" style={{ backgroundColor: formData.accentColor }} />
                                  </div>

                                  {/* Bottom Meta - Refined */}
                                  <div className="pt-10 border-t border-black/[0.08] flex justify-between items-center relative z-10">
                                     <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-black/30">Volume</span>
                                        <span className="text-xs font-black text-black/60">0{i + 1}</span>
                                     </div>
                                     <div className="flex flex-col items-end gap-1">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-black/30">Time</span>
                                        <span className="text-xs font-black text-black/60">{Math.max(1, Math.ceil((work.content || '').split(' ').length / 250))} Min</span>
                                     </div>
                                  </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  
                  {formData.inspirations && (
                    <div className="max-w-4xl mx-auto pt-20 border-t border-black/5 text-center space-y-12">
                       <h3 className="text-xs font-bold tracking-[0.5em] uppercase opacity-20">Creative Philosophy</h3>
                       <p className="text-3xl md:text-5xl font-serif italic leading-tight text-black/80">
                         {formData.inspirations}
                       </p>
                    </div>
                  )}
                </div>
              )}

              {/* Template: Modern Bold */}
              {formData.templateId === 'modern' && (
                <div className="h-full">
                  <div className={`flex ${viewMode === 'mobile' ? 'flex-col' : 'flex-row'} min-h-full`}>
                    <div className={`${viewMode === 'mobile' ? 'w-full p-8' : 'w-1/2 p-24'} bg-black text-white flex flex-col justify-between min-h-[60vh] relative`}>
                      <div className="absolute inset-0 opacity-20 grayscale">{formData.bannerImage && <img src={formData.bannerImage} className="w-full h-full object-cover" />}</div>
                      <div className="relative z-10">
                        <div className="h-1 w-20 mb-12" style={{ backgroundColor: formData.accentColor }} />
                        <h2 className={`${viewMode === 'mobile' ? 'text-4xl leading-tight' : 'text-6xl md:text-9xl leading-[0.8]'} font-black uppercase tracking-tighter mb-12`}>{formData.authorName || 'Writer'}</h2>
                        <p className={`${viewMode === 'mobile' ? 'text-lg' : 'text-xl'} opacity-60 max-w-sm italic`}>"{formData.profession || formData.bio || 'Crafting...'}"</p>
                      </div>
                    </div>
                    <div className={`${viewMode === 'mobile' ? 'w-full p-8' : 'w-1/2 p-24'} bg-white space-y-32`}>
                      {['Stories', 'Articles', 'Blog'].map(section => {
                        const sectionKey = section.toLowerCase();
                        const works = userWorks[sectionKey] || [];
                        if (works.length === 0) return null;
                        return (
                          <div key={section} className="space-y-12">
                            <div className="flex items-center gap-4">
                              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-black/30 whitespace-nowrap">{section}</p>
                              <div className="h-[1px] flex-grow bg-black/5" />
                            </div>
                            <div className="grid grid-cols-1 gap-6">
                              {works.map((work, i) => (
                                <div key={work.id || i} className="p-10 bg-black/[0.02] rounded-[2rem] border border-black/5 group cursor-pointer hover:bg-black/[0.04] transition-all">
                                  <h3 className="text-3xl font-bold mb-4 tracking-tight">{work.name}</h3>
                                  <p className="text-sm opacity-50 mb-8 line-clamp-3">
                                    {work.content ? work.content.substring(0, 150) + '...' : 'A deep dive into narrative structure...'}
                                  </p>
                                  <button className="text-[10px] font-bold uppercase tracking-widest border-b-2 border-black pb-1">View Piece</button>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}

                      {formData.inspirations && (
                        <div className="p-10 bg-black text-white rounded-[2rem] space-y-6">
                           <p className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-40">Creative Philosophy</p>
                           <p className="text-xl font-serif italic">
                             {formData.inspirations}
                           </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Unified Contact Section */}
              <div id="contact" className={`px-6 md:px-24 py-24 md:py-40 bg-black text-white ${viewMode === 'mobile' ? 'space-y-12' : 'space-y-24'}`}>
                <div className="max-w-4xl mx-auto space-y-16 text-center flex flex-col items-center">
                  <div className="space-y-8 md:space-y-10 flex flex-col items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-[1px] bg-white/20" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/40">Connect</span>
                      <div className="w-10 h-[1px] bg-white/20" />
                    </div>
                    <h2 className={`${viewMode === 'mobile' ? 'text-3xl' : 'text-5xl md:text-6xl'} font-black tracking-tighter leading-none whitespace-nowrap`}>
                      Connect with me<span style={{ color: formData.accentColor }}>.</span>
                    </h2>
                    <p className={`${viewMode === 'mobile' ? 'text-lg' : 'text-2xl'} font-serif italic text-white/40 leading-relaxed max-w-2xl`}>
                      Currently open to new projects, collaborations, and narrative explorations.
                    </p>
                  </div>

                  <div className={`w-full ${viewMode === 'mobile' ? 'flex flex-row justify-center gap-4' : 'grid grid-cols-2 gap-4'}`}>
                    {[
                      { label: 'Email', value: user?.email || 'hello@example.com', icon: Mail, url: `mailto:${user?.email}` },
                      { label: 'Substack', value: formData.socialSubstack, icon: ExternalLink, url: formData.socialSubstack },
                      { label: 'X / Twitter', value: formData.socialTwitter, icon: Globe, url: formData.socialTwitter },
                      { label: 'LinkedIn', value: formData.socialLinkedin, icon: Globe, url: formData.socialLinkedin },
                      { label: 'Medium', value: formData.socialMedium, icon: ExternalLink, url: formData.socialMedium ? `https://medium.com/@${formData.socialMedium.replace('@','')}` : '' }
                    ].map((link, idx) => (link.value || link.label === 'Email') && (
                      <motion.a 
                        key={idx}
                        href={link.url}
                        target="_blank"
                        whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.05)' }}
                        className={`group flex items-center justify-center transition-all ${viewMode === 'mobile' ? 'w-14 h-14 rounded-full border border-white/10 bg-white/[0.02]' : 'justify-between p-8 rounded-2xl border border-white/5 bg-white/[0.02] text-left'}`}
                      >
                         <div className={`flex items-center ${viewMode === 'mobile' ? 'justify-center' : 'gap-6'}`}>
                           <div className={`${viewMode === 'mobile' ? 'w-full h-full' : 'w-12 h-12 rounded-full border border-white/10'} flex items-center justify-center group-hover:border-white transition-all`}>
                             <link.icon size={viewMode === 'mobile' ? 20 : 16} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                           </div>
                           
                           {viewMode !== 'mobile' && (
                             <div className="space-y-1">
                               <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">{link.label}</p>
                               <p className="text-base font-serif italic text-white/60 group-hover:text-white transition-colors">{link.value}</p>
                             </div>
                           )}
                         </div>
                         
                         {viewMode !== 'mobile' && (
                           <ChevronRight size={16} className="opacity-0 group-hover:opacity-40 transition-all -translate-x-4 group-hover:translate-x-0" />
                         )}
                      </motion.a>
                    ))}
                  </div>
                </div>

                <div className="pt-24 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-bold uppercase tracking-widest text-white/20">
                   <span>© 2024 {formData.authorName}</span>
                   <div className="flex gap-8">
                      <span>Privacy</span>
                      <span>Terms</span>
                   </div>
                </div>
              </div>

            </div>
            
            <div className="absolute inset-0 pointer-events-none border border-white/10 shadow-inner rounded-[inherit]" />
          </div>
        </div>

        {/* BG Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-black/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-black/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.1); }
      `}</style>
    </div>
  );
};

export default PortfolioEditor;
