'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Folder, Plus, Globe, Clock, LayoutDashboard, Search } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

const Dashboard = ({ user, onCreateArticle, onCreateStory, onOpenWork, onPortfolio }) => {
  const [works, setWorks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) {
      const q = query(
        collection(db, 'users', user.uid, 'works'),
        orderBy('timestamp', 'desc')
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const worksData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Filter to only show root level items (documents or folders) for the dashboard view
        // Or perhaps just all top-level items that represent a "Work"
        // Let's show folders that represent Stories, and documents that have no parentId
        const dashboardWorks = worksData.filter(w => !w.parentId);
        
        setWorks(dashboardWorks);
      });
      return () => unsubscribe();
    }
  }, [user]);

  const filteredWorks = works.filter(work => 
    work.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background overflow-y-auto w-full">
      <div className="max-w-6xl mx-auto px-6 md:px-12 pt-24 pb-32">
        
        {/* Header Section */}
        <div className="mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-serif font-medium tracking-tight mb-4 text-foreground/90"
          >
            Welcome back, {user?.displayName?.split(' ')[0] || 'Writer'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-foreground/60 text-lg"
          >
            What are we creating today?
          </motion.p>
        </div>

        {/* Creation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={onCreateArticle}
            className="group relative bg-foreground/[0.03] p-8 rounded-3xl cursor-pointer overflow-hidden border border-foreground/5 hover:border-accent/30 transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <FileText size={24} className="text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-2">New Article</h3>
              <p className="text-foreground/60 leading-relaxed">
                A clean, single-document editor perfect for essays, blog posts, or short forms.
              </p>
            </div>
            <div className="absolute top-8 right-8 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
              <Plus size={16} className="text-accent" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={onCreateStory}
            className="group relative bg-foreground/[0.03] p-8 rounded-3xl cursor-pointer overflow-hidden border border-foreground/5 hover:border-accent/30 transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <Folder size={24} className="text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-2">New Story</h3>
              <p className="text-foreground/60 leading-relaxed">
                A comprehensive workspace with structured folders for chapters and characters.
              </p>
            </div>
            <div className="absolute top-8 right-8 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
              <Plus size={16} className="text-accent" />
            </div>
          </motion.div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold">Past Works</h2>
            <div className="px-3 py-1 rounded-full bg-foreground/5 text-xs font-bold tracking-widest uppercase opacity-60">
              {filteredWorks.length} Items
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 group-focus-within:opacity-100 transition-opacity" />
              <input 
                type="text"
                placeholder="Search works..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-64 bg-foreground/[0.03] border border-foreground/10 rounded-full py-2.5 pl-11 pr-4 text-sm outline-none transition-all placeholder:opacity-40 focus:border-accent/30"
              />
            </div>
            <button
              onClick={onPortfolio}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-foreground text-background font-bold text-sm tracking-wide hover:scale-105 transition-transform"
            >
              <Globe size={16} />
              Portfolio
            </button>
          </div>
        </div>

        {/* Works Grid */}
        {filteredWorks.length === 0 ? (
          <div className="bg-foreground/[0.03] rounded-3xl p-16 text-center border border-foreground/5 flex flex-col items-center justify-center">
            <LayoutDashboard size={48} className="opacity-20 mb-6" />
            <h3 className="text-xl font-bold mb-2 opacity-60">No works found</h3>
            <p className="text-foreground/40">Create a new article or story to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWorks.map((work, index) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * Math.min(index, 5) }}
                key={work.id}
                onClick={() => onOpenWork(work)}
                className="group p-6 rounded-2xl border border-foreground/10 hover:border-accent/40 bg-foreground/[0.02] hover:bg-accent/[0.02] transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${work.type === 'folder' ? 'bg-accent/10 text-accent' : 'bg-foreground/5 text-foreground'}`}>
                    {work.type === 'folder' ? <Folder size={20} /> : <FileText size={20} />}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs opacity-40 font-medium">
                    <Clock size={12} />
                    {work.timestamp?.toDate ? work.timestamp.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Just now'}
                  </div>
                </div>
                <h4 className="font-bold text-lg truncate mb-1">{work.name}</h4>
                <p className="text-sm opacity-50 capitalize">{work.type}</p>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;
