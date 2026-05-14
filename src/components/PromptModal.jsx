'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileEdit, ArrowRight } from 'lucide-react';

const PromptModal = ({ isOpen, title, description, defaultValue, placeholder, submitText, onSave, onCancel }) => {
  const [value, setValue] = useState(defaultValue || '');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setValue(defaultValue || '');
      // Focus and select all text after a short delay for animation
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 100);
    }
  }, [isOpen, defaultValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onSave(value.trim());
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
        onClick={onCancel}
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
            <FileEdit size={32} style={{ color: 'var(--accent-color)' }} />
          </div>
          
          <h2 className="text-xl font-bold mb-2">{title}</h2>
          {description && <p className="text-sm opacity-60 mb-8">{description}</p>}
          {!description && <div className="mb-6"></div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border bg-white/50 dark:bg-black/20 focus:ring-2 focus:ring-accent outline-none transition-all font-medium text-center"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-color)' }}
              placeholder={placeholder || ''}
              required
            />

            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-4 rounded-2xl font-bold transition-all hover:bg-black/5 dark:hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-4 rounded-2xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                style={{ backgroundColor: 'var(--accent-color)', color: 'var(--bg-color)' }}
              >
                {submitText || 'Save'}
                <ArrowRight size={20} />
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default PromptModal;
