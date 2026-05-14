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

        const folders = allWorks.filter(w => w['type'] === 'folder');
        const documents = allWorks.filter(w => w['type'] === 'document');

        const getDocsInFolder = (folderId) => {
          let docs = documents.filter(d => d['parentId'] === folderId);
          const subFolders = folders.filter(f => f['parentId'] === folderId);
          subFolders.forEach(sub => {
            docs = [...docs, ...getDocsInFolder(sub['id'])];
          });
          return docs;
        };

        const stories = folders.filter(f => !f['parentId']).map(folder => {
          const children = getDocsInFolder(folder['id']);
          return { ...folder, children, childCount: children.length };
        }).filter(s => s['childCount'] > 0);

        const articles = documents.filter(d => !d['parentId']);

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
    <div className="h-screen bg-[#FDF8F1] overflow-hidden font-sans text-[#1A1A1A] flex justify-center">
      {/* Editor Center */}
      <div className="w-full max-w-4xl bg-white border-x border-black/10 flex flex-col h-full shadow-2xl relative z-50">
        <div className="p-8 pb-6 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-black/60 hover:text-black transition-all mb-8">
              <ArrowLeft size={14} /> Back to Dashboard
            </button>
            <h1 className="text-4xl font-serif font-bold tracking-tight mb-2">Editor</h1>
            <p className="text-sm text-black/70 font-medium">Design your professional writing portfolio.(Please make sure you fill all the fields)</p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => {
              const isLocal = window.location.hostname === 'localhost';
              const url = isLocal ? `http://${formData.username}.localhost:3000` : `https://${formData.username}.writings.page`;
              window.open(url, '_blank');
            }} className="px-6 py-3 rounded-full border border-black/10 text-[10px] font-bold uppercase hover:bg-black/5 transition-colors">Live View</button>
            <button onClick={handlePublish} disabled={publishing} className="px-8 py-3 rounded-full bg-black text-[#FDF8F1] font-bold text-xs shadow-lg hover:bg-black/80 transition-colors disabled:opacity-50">{publishing ? 'Publishing...' : 'Publish'}</button>
          </div>
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
                  <input type="text" value={formData.authorName} onChange={(e) => setFormData({ ...formData, authorName: e.target.value })} className="w-full bg-black/[0.02] border border-black rounded-xl px-5 py-4 outline-none font-serif text-lg transition-colors focus:bg-transparent" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-black/60">Profession / Title</label>
                  <input type="text" value={formData.profession} onChange={(e) => setFormData({ ...formData, profession: e.target.value })} placeholder="e.g. Creative Writer & Author" className="w-full bg-black/[0.02] border border-black rounded-xl px-5 py-4 outline-none font-serif text-lg transition-colors focus:bg-transparent" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-black/60">Bio</label>
                  <textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} className="w-full bg-black/[0.02] border border-black rounded-xl px-5 py-4 outline-none font-serif text-base h-32 transition-colors focus:bg-transparent" />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase text-black/60">Profile & Banner</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative aspect-square rounded-2xl bg-black/[0.04] flex items-center justify-center border border-black/5 overflow-hidden group">
                      {formData.profileImage ? <img src={formData.profileImage} className="w-full h-full object-cover group-hover:blur-sm transition-all duration-300" /> : <User size={24} className="opacity-20 group-hover:blur-sm transition-all duration-300" />}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-black/10">
                        <span className="text-white text-[10px] md:text-xs font-bold uppercase tracking-widest bg-black/50 px-3 py-1 rounded-full backdrop-blur-md text-center">Change Photo</span>
                      </div>
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={async (e) => {
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
                    <div className="relative aspect-square rounded-2xl bg-black/[0.04] flex items-center justify-center border border-black/5 overflow-hidden group">
                      {formData.bannerImage ? <img src={formData.bannerImage} className="w-full h-full object-cover group-hover:blur-sm transition-all duration-300" /> : <Globe size={24} className="opacity-20 group-hover:blur-sm transition-all duration-300" />}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-black/10">
                        <span className="text-white text-[10px] md:text-xs font-bold uppercase tracking-widest bg-black/50 px-3 py-1 rounded-full backdrop-blur-md text-center">Change Banner</span>
                      </div>
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={async (e) => {
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
                  <button key={t.id} onClick={() => setFormData({ ...formData, templateId: t.id })} className={`w-full text-left p-6 rounded-2xl border-2 transition-all ${formData.templateId === t.id ? 'border-black bg-black/[0.02]' : 'border-black/5'}`}>
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
                    <input type="color" value={formData.accentColor} onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })} className="w-12 h-12 rounded-full border-none p-0 overflow-hidden cursor-pointer" />
                    <input type="text" value={formData.accentColor} onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })} className="bg-black/[0.02] border border-black rounded-lg px-4 py-2 font-mono text-xs uppercase transition-colors focus:bg-transparent" />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase text-black/60">Creative Philosophy</label>
                  <textarea value={formData.inspirations} onChange={(e) => setFormData({ ...formData, inspirations: e.target.value })} className="w-full bg-black/[0.02] border border-black rounded-xl px-5 py-4 outline-none text-sm h-32 transition-colors focus:bg-transparent" placeholder="What drives your writing?" />
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
                    <input type="text" value={formData[s.id]} onChange={(e) => setFormData({ ...formData, [s.id]: e.target.value })} className="w-full bg-black/[0.02] border border-black rounded-xl px-5 py-4 outline-none text-sm transition-colors focus:bg-transparent" placeholder="@username" />
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

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
