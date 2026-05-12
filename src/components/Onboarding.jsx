'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ArrowRight, Sparkles, CheckCircle2, User, BookOpen } from 'lucide-react';
import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

const Onboarding = ({ user, onComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    authorName: user?.displayName || '',
    bio: '',
    inspirations: '',
    handle: '',
  });

  // Pre-fill handle from localStorage if claimed on landing page
  useEffect(() => {
    const pending = localStorage.getItem('pending_handle');
    if (pending) {
      setFormData(prev => ({ ...prev, handle: pending }));
    }
  }, []);

  const [availability, setAvailability] = useState({
    checked: false,
    available: false,
    loading: false
  });

  // Check handle availability as they type
  useEffect(() => {
    if (formData.handle.length < 3) {
      setAvailability({ checked: false, available: false, loading: false });
      return;
    }

    const timer = setTimeout(async () => {
      setAvailability(prev => ({ ...prev, loading: true }));
      try {
        const cleanHandle = formData.handle.toLowerCase().trim();
        const docRef = doc(db, 'portfolios', cleanHandle);
        const docSnap = await getDoc(docRef);
        
        setAvailability({
          checked: true,
          available: !docSnap.exists() || (docSnap.exists() && docSnap.data().uid === user.uid),
          loading: false
        });
      } catch (err) {
        console.error("Error checking handle:", err);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.handle, user.uid]);

  const handleNext = () => {
    if (step === 1 && (!formData.authorName || !formData.bio)) {
      setError('Please fill in your name and a short bio.');
      return;
    }
    setError('');
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    if (!availability.available) {
      setError('This handle is not available.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const cleanHandle = formData.handle.toLowerCase().trim();
      
      // 1. Update User Document
      await updateDoc(doc(db, 'users', user.uid), {
        username: cleanHandle,
        displayName: formData.authorName,
        onboardingCompleted: true,
        updatedAt: serverTimestamp()
      });

      // 2. Create/Update Portfolio Document
      await setDoc(doc(db, 'portfolios', cleanHandle), {
        uid: user.uid,
        authorName: formData.authorName,
        username: cleanHandle,
        bio: formData.bio,
        inspirations: formData.inspirations,
        themeFont: 'serif',
        accentColor: '#72B9AA',
        works: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      setStep(3); // Success step
      localStorage.removeItem('pending_handle');
      setTimeout(() => {
        onComplete();
      }, 2000);

    } catch (err) {
      console.error("Onboarding error:", err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 font-sans">
      <div className="max-w-xl w-full">
        
        {/* Progress Bar */}
        <div className="flex gap-2 mb-12">
          {[1, 2, 3].map((s) => (
            <div 
              key={s} 
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= s ? 'bg-white' : 'bg-white/10'}`} 
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h1 className="text-4xl font-bold font-serif tracking-tight">The Writer's Identity</h1>
                <p className="text-white/40">How should the world address you?</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/30">Display Name</label>
                  <input 
                    type="text"
                    value={formData.authorName}
                    onChange={(e) => setFormData({...formData, authorName: e.target.value})}
                    placeholder="Your pen name"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-white/30 transition-all text-xl font-serif"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/30">Short Bio</label>
                  <textarea 
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    placeholder="Crafting narratives at the intersection of..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-white/30 transition-all h-32 resize-none leading-relaxed"
                  />
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <button 
                  onClick={handleNext}
                  className="w-full bg-white text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Continue
                  <ArrowRight size={20} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h1 className="text-4xl font-bold font-serif tracking-tight">Claim Your Territory</h1>
                <p className="text-white/40">Your unique address on the digital frontier.</p>
              </div>

              <div className="space-y-6">
                <div className="relative group">
                  <input 
                    type="text"
                    value={formData.handle}
                    onChange={(e) => setFormData({...formData, handle: e.target.value.replace(/[^a-z0-9]/gi, '').toLowerCase()})}
                    placeholder="your-handle"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-6 pr-40 outline-none focus:border-white/30 transition-all text-2xl font-mono"
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-3">
                    <span className="text-white/20 font-mono">.writings.page</span>
                    {availability.loading ? (
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : availability.checked && (
                      availability.available ? (
                        <CheckCircle2 size={20} className="text-green-500" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                      )
                    )}
                  </div>
                </div>

                {availability.checked && !availability.available && (
                  <p className="text-red-400 text-sm">This handle is already taken. Try something else.</p>
                )}

                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                  <div className="flex items-center gap-3 text-white/40">
                    <Globe size={16} />
                    <span className="text-xs font-bold uppercase tracking-widest">Premium Feature</span>
                  </div>
                  <p className="text-sm leading-relaxed text-white/70">
                    Your handle creates a dedicated space for your readers. You can change this later, but your current links will break.
                  </p>
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <div className="flex gap-4">
                  <button 
                    onClick={() => setStep(1)}
                    className="flex-1 bg-white/5 border border-white/10 text-white font-bold py-4 rounded-2xl hover:bg-white/10 transition-all"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleSubmit}
                    disabled={loading || !availability.available}
                    className="flex-[2] bg-white text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
                  >
                    {loading ? 'Securing Domain...' : 'Complete Setup'}
                    <Sparkles size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-8 py-12"
            >
              <div className="relative mx-auto w-24 h-24">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="w-24 h-24 bg-white rounded-full flex items-center justify-center"
                >
                  <CheckCircle2 size={48} className="text-black" />
                </motion.div>
                <motion.div 
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-white rounded-full -z-10"
                />
              </div>

              <div className="space-y-2">
                <h1 className="text-4xl font-bold font-serif">Welcome Home.</h1>
                <p className="text-white/40">Your corner of the internet is ready at</p>
                <p className="text-xl font-mono text-white/80">{formData.handle}.writings.page</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default Onboarding;
