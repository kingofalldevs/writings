import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const reviews = [
  {
    name: "Alex Rivera",
    role: "Senior Research Fellow, MIT",
    content: "Writings has completely transformed how I handle deep research. The distraction-free environment is unlike anything I've used before.",
    rating: 5
  },
  {
    name: "Sarah Chen",
    role: "Product Designer @ Linear",
    content: "The aesthetic excellence of this OS is unmatched. It feels less like an app and more like a focused extension of my own mind.",
    rating: 5
  },
  {
    name: "James Wilson",
    role: "PhD Candidate, Stanford",
    content: "The integrated binaural beats and AI tutor (Aria) make it the ultimate study companion. My productivity has peaked.",
    rating: 5
  }
];

const LandingReviews = () => {
  return (
    <section className="relative w-full px-6 md:px-8 flex flex-col items-center py-20 md:py-32 overflow-hidden">


      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16 md:mb-24"
      >
        <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4em', color: 'var(--accent-color)', marginBottom: '24px', display: 'block' }}>Institutional Proof</span>
        <h2 
          className="font-medium tracking-tight" 
          style={{ fontSize: 'clamp(28px, 5vw, 56px)', color: 'var(--text-color)', lineHeight: 1.1 }}
        >
          Built for those who demand <span style={{ color: 'var(--accent-color)' }}>excellence</span>.
        </h2>
      </motion.div>

      <div 
        className="w-full max-w-[1200px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {reviews.map((review, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.8 }}
            className="group p-8 md:p-10 flex flex-col gap-8 relative transition-all duration-300 h-full rounded-[32px]"
            style={{ 
              background: 'var(--foreground-002)', 
              border: '1px solid var(--border-color)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--accent-color)';
              e.currentTarget.style.background = 'var(--foreground-004)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.background = 'var(--foreground-002)';
            }}
          >
            <div className="flex justify-between items-start">
              <div className="flex gap-1.5" style={{ gap: '6px', display: 'flex' }}>
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="var(--accent-color)" stroke="none" />
                ))}
              </div>
              <Quote 
                size={40} 
                style={{ color: 'var(--accent-color)', transform: 'rotate(180deg)', opacity: 0.08, transition: 'opacity 0.3s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = 0.2}
                onMouseLeave={e => e.currentTarget.style.opacity = 0.08}
              />
            </div>

            <p style={{ 
              fontSize: '18px', 
              fontWeight: 300, 
              lineHeight: 1.7, 
              color: 'var(--text-color)', 
              opacity: 0.9, 
              fontStyle: 'italic',
              fontFamily: "'Outfit', sans-serif"
            }}>
              "{review.content}"
            </p>

            <div className="mt-auto flex flex-col gap-1.5">
              <span style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text-color)' }}>{review.name}</span>
              <span style={{ fontSize: '14px', opacity: 0.5, color: 'var(--text-color)', letterSpacing: '0.02em' }}>{review.role}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default LandingReviews;
