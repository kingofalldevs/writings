import React, { useState, useEffect } from 'react';
import { X, Headphones, FileText, Clock, Trash2 } from 'lucide-react';
import { tracks } from '../data/tracks';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const LibraryModal = ({ isOpen, onClose, onSelectTrack, currentTrackId, onSelectWork }) => {
  const [activeTab, setActiveTab] = useState('music'); // 'music' or 'works'
  const [works, setWorks] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user && isOpen && activeTab === 'works') {
      const q = query(
        collection(db, 'users', user.uid, 'works'),
        orderBy('timestamp', 'desc')
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const worksData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setWorks(worksData);
      });
      return () => unsubscribe();
    }
  }, [user, isOpen, activeTab]);

  const handleDeleteWork = async (e, workId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this work?')) {
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'works', workId));
      } catch (err) {
        console.error("Error deleting work:", err);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
          />

          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="glass rounded-3xl p-8 pointer-events-auto w-full max-w-[700px] max-h-[80vh] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight mb-2">Library</h2>
                  <div className="flex gap-4 mt-4">
                    <button 
                      onClick={() => setActiveTab('music')}
                      className={`text-sm font-bold pb-2 border-b-2 transition-all ${
                        activeTab === 'music' 
                          ? 'border-accent text-accent' 
                          : 'border-transparent text-foreground/40 hover:text-foreground/100'
                      }`}
                    >
                      Focus Music
                    </button>
                    <button 
                      onClick={() => setActiveTab('works')}
                      className={`text-sm font-bold pb-2 border-b-2 transition-all ${
                        activeTab === 'works' 
                          ? 'border-accent text-accent' 
                          : 'border-transparent text-foreground/40 hover:text-foreground/100'
                      }`}
                    >
                      My Works
                    </button>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-foreground/5 transition-colors opacity-50 hover:opacity-100">
                  <X size={24} />
                </button>
              </div>

              <div className="overflow-y-auto pr-2 custom-scrollbar flex-1">
                {activeTab === 'music' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {tracks.map(track => (
                      <button
                        key={track.id}
                        onClick={() => {
                          onSelectTrack(track);
                          onClose();
                        }}
                        className={`text-left p-6 rounded-2xl border transition-all hover:scale-[1.02] bg-foreground/[0.02] ${
                          currentTrackId === track.id ? 'border-accent' : 'border-foreground/10'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className={`font-bold text-lg ${currentTrackId === track.id ? 'text-accent' : 'text-foreground'}`}>
                            {track.name}
                          </span>
                          <Headphones size={16} className="opacity-40" />
                        </div>
                        <p className="text-sm opacity-60 leading-relaxed">{track.description}</p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {works.length === 0 ? (
                      <div className="py-20 text-center opacity-40">
                        <FileText size={48} className="mx-auto mb-4" />
                        <p>No saved works yet. Start typing to create one.</p>
                      </div>
                    ) : (
                      works.map(work => (
                        <div
                          key={work.id}
                          onClick={() => {
                            onSelectWork(work);
                            onClose();
                          }}
                          className="group flex items-center justify-between p-5 rounded-2xl border border-foreground/10 bg-foreground/[0.02] hover:border-accent/50 transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                              <FileText size={20} className="text-accent" />
                            </div>
                            <div>
                              <h3 className="font-bold">{work.name}</h3>
                              <div className="flex items-center gap-2 text-[11px] opacity-40 mt-0.5">
                                <Clock size={10} />
                                <span>{work.timestamp?.toDate().toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <button 
                            onClick={(e) => handleDeleteWork(e, work.id)}
                            className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-red-500 transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {activeTab === 'music' && (
                <p className="text-center mt-6 text-[11px] opacity-40">
                  Headphones strongly recommended for binaural effects.
                </p>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LibraryModal;
