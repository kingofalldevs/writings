'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ArrowRight } from 'lucide-react';

const WorkNameModal = ({ isOpen, onSave }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim());
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-sm overflow-hidden rounded-3xl shadow-2xl border"
        style={{ 
          backgroundColor: 'var(--bg-color)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-color)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'rgba(var(--accent-rgb), 0.1)' }}>
            <FileText size={32} style={{ color: 'var(--accent-color)' }} />
          </div>
          
          <h2 className="text-xl font-bold mb-2">Name your work</h2>
          <p className="text-sm opacity-60 mb-8">What should we call this session?</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border bg-white/50 dark:bg-black/20 focus:ring-2 focus:ring-accent outline-none transition-all font-medium text-center"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-color)' }}
              placeholder="Study Session #1"
              required
            />

            <button
              type="submit"
              className="w-full py-4 rounded-2xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 mt-4 hover:scale-[1.02] active:scale-[0.98]"
              style={{ backgroundColor: 'var(--accent-color)', color: 'var(--bg-color)' }}
            >
              Start Writing
              <ArrowRight size={20} />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default WorkNameModal;
