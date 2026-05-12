'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Globe, Edit3, Sparkles, User } from 'lucide-react';
import LandingNav from './landing/LandingNav';
import LandingFooter from './landing/LandingFooter';
import { db } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp, getDocs, collection, query } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

const PortfolioEditor = ({ user, onBack, onStart, showNotif }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [formData, setFormData] = useState({
    authorName: '',
    username: '',
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
    socialMedium: ''
  });

  useEffect(() => {
    const fetchExisting = async () => {
      if (!user) return;
      try {
        const defaultUsername = user.displayName?.split(' ')[0]?.toLowerCase() || user.email?.split('@')[0]?.toLowerCase() || 'author';
        const docRef = doc(db, 'portfolios', defaultUsername);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            authorName: data.authorName || user.displayName || '',
            username: data.username || defaultUsername,
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
            socialMedium: data.socialMedium || ''
          });
        } else {
          setFormData({
            authorName: user.displayName || '',
            username: defaultUsername,
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
            socialMedium: ''
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
        resolve(canvas.toDataURL('image/jpeg', 0.6)); // Compress to JPEG with 0.6 quality
      };
    });
  };

  const handlePublish = async () => {
    if (!user) return;
    setPublishing(true);
    try {
      const worksSnapshot = await getDocs(query(collection(db, 'users', user.uid, 'works')));
      const works = worksSnapshot.docs.map(d => ({ ...d.data(), id: d.id }));

      await setDoc(doc(db, 'portfolios', formData.username.toLowerCase()), {
        uid: user.uid,
        authorName: formData.authorName,
        username: formData.username.toLowerCase(),
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
        works: works,
        timestamp: serverTimestamp()
      });
      
      showNotif("Portfolio Live", "Your changes have been published successfully.", "success");
    } catch (err) {
      console.error(err);
      showNotif("Publish Failed", "Something went wrong. Please try again.", "error");
    } finally {
      setPublishing(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-background text-foreground">
      <motion.div 
        animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full"
      />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <LandingNav 
        user={user} 
        onStart={onStart} 
        onHomeClick={() => router.push('/')}
        onAccountClick={() => router.push('/account')}
        onPricingClick={() => router.push('/pricing')}
        onAriaClick={() => router.push('/aria')}
        onPhilosophyClick={() => router.push('/philosophy')}
      />

      <main className="flex-grow pt-32 px-8 pb-32">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8">
            <div className="flex items-center gap-4">
              <button onClick={onBack} className="p-3 rounded-full hover:bg-foreground/5 transition-all">
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-4xl font-bold font-serif tracking-tight">Edit Portfolio</h1>
                <p className="opacity-50 text-sm mt-1">Customize how the world sees your work.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
               <button 
                onClick={() => window.open(`/author/${formData.username}`, '_blank')}
                className="flex items-center gap-2 px-6 py-3 rounded-full border border-foreground/10 hover:bg-foreground/5 transition-all text-sm font-bold"
               >
                 <Globe size={18} />
                 View Live
               </button>
               <button 
                onClick={handlePublish}
                disabled={publishing}
                className="flex items-center gap-2 px-8 py-3 rounded-full bg-accent text-background font-bold text-sm shadow-xl shadow-accent/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
               >
                 {publishing ? 'Publishing...' : 'Publish Changes'}
                 <Save size={18} />
               </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,0.8fr] gap-16">
            {/* Editor Side */}
            <div className="space-y-12">
               <section className="space-y-6">
                 <div className="flex items-center gap-2 text-accent">
                   <Edit3 size={18} />
                   <h2 className="text-xs font-bold tracking-[0.3em] uppercase">Core Profile</h2>
                 </div>
                 
                  <div className="space-y-8 p-8 rounded-4xl border border-foreground/5 bg-card/30 backdrop-blur-sm">
                     {/* Profile Photo Upload */}
                     <div className="flex flex-col md:flex-row items-center gap-8 mb-4 pb-8 border-b border-foreground/5">
                        <div className="relative group">
                          <div className="w-24 h-24 rounded-full bg-foreground/5 overflow-hidden border border-foreground/10 flex items-center justify-center">
                             {formData.profileImage ? (
                               <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                             ) : (
                               <User size={32} className="opacity-20" />
                             )}
                          </div>
                          <label className="absolute inset-0 flex items-center justify-center bg-background/80 opacity-0 group-hover:opacity-100 transition-all cursor-pointer rounded-full">
                             <span className="text-[10px] font-bold uppercase tracking-widest">Change</span>
                             <input 
                               type="file" 
                               accept="image/*" 
                               className="hidden" 
                               onChange={(e) => {
                                 const file = e.target.files[0];
                                 if (file) {
                                   const reader = new FileReader();
                                   reader.onloadend = async () => {
                                     const compressed = await compressImage(reader.result, 400, 400);
                                     setFormData(prev => ({ ...prev, profileImage: compressed }));
                                   };
                                   reader.readAsDataURL(file);
                                 }
                               }}
                             />
                          </label>
                        </div>
                        <div className="flex-grow text-center md:text-left">
                           <h3 className="text-sm font-bold tracking-tight mb-1">Profile Photograph</h3>
                           <p className="text-xs opacity-40">Add a professional portrait to build trust with your readers.</p>
                           {formData.profileImage && (
                             <button 
                               onClick={() => setFormData(prev => ({ ...prev, profileImage: '' }))}
                               className="text-[10px] font-bold text-red-500 uppercase tracking-widest mt-3 hover:underline"
                             >
                               Remove Photo
                             </button>
                           )}
                        </div>
                     </div>

                     {/* Banner Photo Upload */}
                     <div className="flex flex-col gap-6 mb-4 pb-8 border-b border-foreground/5">
                        <div className="flex-grow">
                           <h3 className="text-sm font-bold tracking-tight mb-1">Portfolio Banner</h3>
                           <p className="text-xs opacity-40 text-left">This image will appear at the top of your portfolio behind your profile picture.</p>
                        </div>
                        <div className="relative group w-full h-40 rounded-3xl bg-foreground/5 overflow-hidden border border-foreground/10 flex items-center justify-center">
                           {formData.bannerImage ? (
                             <img src={formData.bannerImage} alt="Banner" className="w-full h-full object-cover" />
                           ) : (
                             <div className="flex flex-col items-center gap-2 opacity-20">
                               <Sparkles size={32} />
                               <span className="text-[10px] font-bold uppercase tracking-widest">No Banner Set</span>
                             </div>
                           )}
                           <label className="absolute inset-0 flex items-center justify-center bg-background/80 opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                              <span className="text-[10px] font-bold uppercase tracking-widest">Change Banner Image</span>
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = async () => {
                                      const compressed = await compressImage(reader.result, 1600, 900);
                                      setFormData(prev => ({ ...prev, bannerImage: compressed }));
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                           </label>
                           {formData.bannerImage && (
                             <button 
                               onClick={() => setFormData(prev => ({ ...prev, bannerImage: '' }))}
                               className="absolute top-4 right-4 p-2 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all z-20"
                             >
                               <span className="text-[10px] font-bold uppercase tracking-widest px-2">Remove</span>
                             </button>
                           )}
                        </div>
                     </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-xs font-bold opacity-30 uppercase tracking-widest ml-1">Author Name</label>
                        <input 
                          type="text"
                          value={formData.authorName}
                          onChange={(e) => setFormData({...formData, authorName: e.target.value})}
                          className="w-full bg-foreground/5 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-accent/50 transition-all font-serif text-lg"
                          placeholder="Your Pen Name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold opacity-30 uppercase tracking-widest ml-1">Unique Handle (URL)</label>
                        <div className="relative">
                          <span className="absolute left-6 top-1/2 -translate-y-1/2 opacity-30 text-sm font-mono">writings.page/?author=</span>
                          <input 
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({...formData, username: e.target.value.replace(/[^a-z0-9]/gi, '').toLowerCase()})}
                            className="w-full bg-foreground/5 border-none rounded-2xl px-6 py-4 pl-[160px] outline-none focus:ring-2 ring-accent/50 transition-all font-mono text-sm"
                            placeholder="username"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold opacity-30 uppercase tracking-widest ml-1">Bio (One-liner)</label>
                      <textarea 
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        className="w-full bg-foreground/5 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-accent/50 transition-all font-serif text-lg h-24 resize-none"
                        placeholder="Crafting narratives at the intersection of..."
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold opacity-30 uppercase tracking-widest ml-1">Inspirations</label>
                      <textarea 
                        value={formData.inspirations}
                        onChange={(e) => setFormData({...formData, inspirations: e.target.value})}
                        className="w-full bg-foreground/5 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-accent/50 transition-all text-sm leading-relaxed h-32 resize-none"
                        placeholder="Inspired by the minimalist lines of..."
                      />
                    </div>
                 </div>
               </section>

               <section className="space-y-6">
                 <div className="flex items-center gap-2 text-accent">
                   <Sparkles size={18} />
                   <h2 className="text-xs font-bold tracking-[0.3em] uppercase">Visual Identity</h2>
                 </div>
                 
                 <div className="space-y-8 p-8 rounded-4xl border border-foreground/5 bg-card/30 backdrop-blur-sm">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-2">
                       <label className="text-xs font-bold opacity-30 uppercase tracking-widest ml-1">Typography</label>
                       <div className="flex p-1 bg-foreground/5 rounded-xl gap-1">
                         <button 
                           onClick={() => setFormData({...formData, themeFont: 'serif'})}
                           className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${formData.themeFont === 'serif' ? 'bg-background text-foreground shadow-sm' : 'opacity-40'}`}
                         >
                           Classic Serif
                         </button>
                         <button 
                           onClick={() => setFormData({...formData, themeFont: 'sans'})}
                           className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${formData.themeFont === 'sans' ? 'bg-background text-foreground shadow-sm' : 'opacity-40'}`}
                         >
                           Modern Sans
                         </button>
                       </div>
                     </div>
                     
                     <div className="space-y-2">
                       <label className="text-xs font-bold opacity-30 uppercase tracking-widest ml-1">Accent Color</label>
                       <div className="flex items-center gap-3">
                         <input 
                           type="color"
                           value={formData.accentColor}
                           onChange={(e) => setFormData({...formData, accentColor: e.target.value})}
                           className="w-12 h-12 rounded-xl bg-transparent border-none cursor-pointer p-0 overflow-hidden"
                         />
                         <input 
                           type="text"
                           value={formData.accentColor}
                           onChange={(e) => setFormData({...formData, accentColor: e.target.value})}
                           className="flex-1 bg-foreground/5 border-none rounded-xl px-4 py-2.5 outline-none font-mono text-xs uppercase"
                         />
                       </div>
                     </div>
                   </div>
                 </div>
               </section>

               <section className="space-y-6">
                 <div className="flex items-center gap-2 text-accent">
                   <Globe size={18} />
                   <h2 className="text-xs font-bold tracking-[0.3em] uppercase">Social Presence</h2>
                 </div>
                 
                 <div className="space-y-6 p-8 rounded-4xl border border-foreground/5 bg-card/30 backdrop-blur-sm">
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     <div className="space-y-2">
                       <label className="text-xs font-bold opacity-30 uppercase tracking-widest ml-1">X (Twitter)</label>
                       <input 
                         type="text"
                         value={formData.socialTwitter}
                         onChange={(e) => setFormData({...formData, socialTwitter: e.target.value})}
                         className="w-full bg-foreground/5 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-accent/50 transition-all text-sm"
                         placeholder="@username"
                       />
                     </div>
                     <div className="space-y-2">
                       <label className="text-xs font-bold opacity-30 uppercase tracking-widest ml-1">Substack</label>
                       <input 
                         type="text"
                         value={formData.socialSubstack}
                         onChange={(e) => setFormData({...formData, socialSubstack: e.target.value})}
                         className="w-full bg-foreground/5 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-accent/50 transition-all text-sm"
                         placeholder="name.substack.com"
                       />
                     </div>
                     <div className="space-y-2">
                       <label className="text-xs font-bold opacity-30 uppercase tracking-widest ml-1">Website</label>
                       <input 
                         type="text"
                         value={formData.socialWeb}
                         onChange={(e) => setFormData({...formData, socialWeb: e.target.value})}
                         className="w-full bg-foreground/5 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-accent/50 transition-all text-sm"
                         placeholder="yourdomain.com"
                       />
                     </div>
                     <div className="space-y-2">
                       <label className="text-xs font-bold opacity-30 uppercase tracking-widest ml-1">LinkedIn</label>
                       <input 
                         type="text"
                         value={formData.socialLinkedin}
                         onChange={(e) => setFormData({...formData, socialLinkedin: e.target.value})}
                         className="w-full bg-foreground/5 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-accent/50 transition-all text-sm"
                         placeholder="linkedin.com/in/username"
                       />
                     </div>
                     <div className="space-y-2">
                       <label className="text-xs font-bold opacity-30 uppercase tracking-widest ml-1">Medium</label>
                       <input 
                         type="text"
                         value={formData.socialMedium}
                         onChange={(e) => setFormData({...formData, socialMedium: e.target.value})}
                         className="w-full bg-foreground/5 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-accent/50 transition-all text-sm"
                         placeholder="medium.com/@username"
                       />
                     </div>
                   </div>
                 </div>
               </section>
            </div>

            {/* Preview Side */}
            <div className="hidden lg:block">
               <div className="sticky top-40 space-y-6">
                 <div className="flex items-center gap-2 text-accent">
                   <Sparkles size={18} />
                   <h2 className="text-xs font-bold tracking-[0.3em] uppercase">Live Preview</h2>
                 </div>
                 
                 <div className="rounded-4xl border border-foreground/10 bg-background overflow-hidden aspect-[3/4] relative flex flex-col shadow-2xl">
                    {/* Banner Preview */}
                    <div className="w-full h-32 bg-foreground/5 relative overflow-hidden">
                       {formData.bannerImage && (
                         <img src={formData.bannerImage} alt="Banner Preview" className="w-full h-full object-cover" />
                       )}
                       <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60" />
                    </div>

                    <div className="p-12 text-center flex-grow flex flex-col justify-start items-center -mt-16 relative z-10" style={{ fontFamily: formData.themeFont === 'serif' ? "'Playfair Display', serif" : 'sans-serif' }}>
                       {formData.profileImage && (
                         <div className="w-24 h-24 rounded-full overflow-hidden mb-6 mx-auto border-4 border-background shadow-lg">
                            <img src={formData.profileImage} alt="Preview" className="w-full h-full object-cover" />
                         </div>
                       )}

                      <p className="text-xl text-foreground font-serif italic mb-8 leading-relaxed max-w-sm mx-auto">
                        "{formData.bio || 'Your bio will appear here...'}"
                      </p>
                      <div className="flex flex-col items-center gap-4">
                        <div className="h-[1px] w-8" style={{ backgroundColor: formData.accentColor, opacity: 0.3 }} />
                        <div className="max-w-xs">
                          <p className="text-[10px] font-bold tracking-[0.4em] uppercase opacity-40 mb-2">Inspirations</p>
                          <p className="text-[10px] leading-relaxed text-muted line-clamp-3">
                            {formData.inspirations || 'Your inspirations will appear here...'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Fake Browser Nav */}
                    <div className="p-4 border-t border-foreground/5 flex items-center justify-center gap-4">
                        <div className="w-2 h-2 rounded-full opacity-20" style={{ backgroundColor: formData.accentColor }} />
                        <div className="w-2 h-2 rounded-full opacity-20" style={{ backgroundColor: formData.accentColor }} />
                        <div className="w-2 h-2 rounded-full opacity-20" style={{ backgroundColor: formData.accentColor }} />
                    </div>

                    <div className="absolute inset-0 border-[12px] border-foreground/5 rounded-4xl pointer-events-none" />
                 </div>
               </div>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter 
        onTerms={() => router.push('/terms')} 
        onPrivacy={() => router.push('/privacy')} 
        onRefund={() => router.push('/refund')} 
      />
    </div>
  );
};

export default PortfolioEditor;
