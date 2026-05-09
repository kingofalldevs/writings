import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Globe, Edit3, Sparkles } from 'lucide-react';
import LandingNav from './landing/LandingNav';
import LandingFooter from './landing/LandingFooter';
import { db } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp, getDocs, collection, query } from 'firebase/firestore';

const PortfolioEditor = ({ user, onBack, onStart }) => {
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [formData, setFormData] = useState({
    authorName: '',
    username: '',
    bio: '',
    inspirations: ''
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
            inspirations: data.inspirations || ''
          });
        } else {
          setFormData({
            authorName: user.displayName || '',
            username: defaultUsername,
            bio: '',
            inspirations: ''
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
        works: works,
        timestamp: serverTimestamp()
      });
      
      alert("Portfolio published successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to publish portfolio.");
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
      <LandingNav user={user} onStart={onStart} onHomeClick={onBack} onAccountClick={() => {}} onPricingClick={() => {}} />

      <main className="flex-grow pt-32 px-8 pb-32">
        <div className="max-w-5xl mx-auto">
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
                onClick={() => window.open(`/?author=${formData.username}`, '_blank')}
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Editor Side */}
            <div className="space-y-12">
               <section className="space-y-6">
                 <div className="flex items-center gap-2 text-accent">
                   <Edit3 size={18} />
                   <h2 className="text-xs font-bold tracking-[0.3em] uppercase">Hero Content</h2>
                 </div>
                 
                 <div className="space-y-8 p-8 rounded-4xl border border-foreground/5 bg-card/30 backdrop-blur-sm">
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
                      <label className="text-xs font-bold opacity-30 uppercase tracking-widest ml-1">Bio (One-liner)</label>
                      <textarea 
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        className="w-full bg-foreground/5 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-accent/50 transition-all font-serif text-lg h-32 resize-none"
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

                    <div className="space-y-2">
                      <label className="text-xs font-bold opacity-30 uppercase tracking-widest ml-1">Unique Handle (URL)</label>
                      <div className="relative">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 opacity-30 text-sm font-mono">crescendo.app/?author=</span>
                        <input 
                          type="text"
                          value={formData.username}
                          onChange={(e) => setFormData({...formData, username: e.target.value.replace(/[^a-z0-9]/gi, '').toLowerCase()})}
                          className="w-full bg-foreground/5 border-none rounded-2xl px-6 py-4 pl-[160px] outline-none focus:ring-2 ring-accent/50 transition-all font-mono text-sm"
                          placeholder="username"
                        />
                      </div>
                      <p className="text-[10px] opacity-30 ml-1">This will be your unique shareable link.</p>
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
                 
                 <div className="rounded-4xl border border-foreground/10 bg-background shadow-2xl overflow-hidden aspect-[4/5] relative">
                    <div className="p-12 text-center h-full flex flex-col justify-center items-center">
                       <h1 className="text-4xl font-bold mb-6 font-serif tracking-tight leading-tight">
                        {formData.authorName || 'Your Name'}
                      </h1>
                      <p className="text-lg text-foreground/80 font-serif italic mb-8 leading-relaxed max-w-sm">
                        "{formData.bio || 'Your bio will appear here...'}"
                      </p>
                      <div className="flex flex-col items-center gap-4">
                        <div className="h-[1px] w-8 bg-accent/30" />
                        <div className="max-w-xs">
                          <p className="text-[10px] font-bold tracking-[0.4em] uppercase opacity-40 mb-2">Inspirations</p>
                          <p className="text-[10px] leading-relaxed text-muted line-clamp-3">
                            {formData.inspirations || 'Your inspirations will appear here...'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="absolute inset-0 border-[12px] border-foreground/5 rounded-4xl pointer-events-none" />
                 </div>
               </div>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
};

export default PortfolioEditor;
