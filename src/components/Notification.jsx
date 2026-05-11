'use client';
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

const Notification = ({ message, type = 'success', onClose, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle2 className="text-accent" size={20} />,
    error: <AlertCircle className="text-red-500" size={20} />,
    info: <CheckCircle2 className="text-blue-500" size={20} />
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className="fixed bottom-8 right-8 z-[1000] flex items-center gap-4 px-6 py-4 rounded-2xl bg-background border border-foreground/10 shadow-2xl min-w-[320px]"
    >
      <div className="flex-shrink-0">
        {icons[type]}
      </div>
      <div className="flex-grow">
        <p className="text-sm font-medium leading-tight">{message}</p>
      </div>
      <button 
        onClick={onClose}
        className="flex-shrink-0 p-1 rounded-full hover:bg-foreground/5 opacity-40 hover:opacity-100 transition-all"
      >
        <X size={16} />
      </button>
      
      {/* Progress Bar */}
      <motion.div 
        initial={{ width: '100%' }}
        animate={{ width: 0 }}
        transition={{ duration: duration / 1000, ease: "linear" }}
        className="absolute bottom-0 left-0 h-0.5 bg-accent/20 rounded-full"
      />
    </motion.div>
  );
};

export default Notification;
