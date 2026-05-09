import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Brain, Search, MessageSquare, ArrowRight } from 'lucide-react';
import LandingNav from './landing/LandingNav';
import LandingFooter from './landing/LandingFooter';

const AriaPage = ({ onStart, onBack }) => {
  const ariaFeatures = [
    {
      icon: <Sparkles size={24} />,
      title: "Proactive Intelligence",
      description: "Aria doesn't wait for questions. She analyzes your writing in real-time to suggest relevant citations and connections."
    },
    {
      icon: <Brain size={24} />,
      title: "Cognitive Flow",
      description: "Designed to expand your thinking, not replace it. Aria acts as a second brain that grows with your research journey."
    },
    {
      icon: <MessageSquare size={24} />,
      title: "Natural Dialogue",
      description: "Chat naturally about your work. Aria understands the nuance of academic and creative contexts perfectly."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}>
      <LandingNav onStart={onStart} onHomeClick={onBack} onAriaClick={() => {}} onPricingClick={() => {}} />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-32 px-8 flex flex-col items-center text-center relative overflow-hidden">
          {/* AI Glow Effect */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-[0.05] pointer-events-none"
            style={{ 
              background: 'radial-gradient(circle, var(--accent-color) 0%, transparent 70%)',
              filter: 'blur(60px)'
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 max-w-4xl"
          >
            <div 
              style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '100px',
                backgroundColor: 'rgba(var(--accent-rgb), 0.1)',
                color: 'var(--accent-color)',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                marginBottom: '32px'
              }}
            >
              <Sparkles size={14} />
              <span>MEET ARIA</span>
            </div>

            <h1 
              className="font-medium tracking-tight mb-8" 
              style={{ fontSize: 'clamp(48px, 8vw, 96px)', lineHeight: 1.05 }}
            >
              Your research, <br /><span style={{ color: 'var(--accent-color)' }}>enlightened.</span>
            </h1>

            <p style={{ fontSize: '20px', opacity: 0.6, maxWidth: '600px', margin: '0 auto 48px auto', fontWeight: 300, lineHeight: 1.6 }}>
              Aria is more than an AI. She is a proactive research partner that lives within your OS, anticipating your needs and illuminating connections you might have missed.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStart}
              style={{ 
                padding: '24px 56px',
                borderRadius: '100px',
                backgroundColor: 'var(--text-color)',
                color: 'var(--bg-color)',
                fontSize: '16px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                margin: '0 auto',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
              }}
            >
              <span>Experience Aria</span>
              <ArrowRight size={20} />
            </motion.button>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section className="py-64 px-8 flex justify-center">
          <div 
            style={{ 
              width: '100%',
              maxWidth: '1200px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '40px',
              marginTop: '80px'
            }}
          >
            {ariaFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                style={{ 
                  padding: '40px',
                  borderRadius: '32px',
                  backgroundColor: 'rgba(var(--accent-rgb), 0.02)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px'
                }}
              >
                <div 
                  style={{ 
                    width: '56px', 
                    height: '56px', 
                    borderRadius: '16px', 
                    backgroundColor: 'rgba(var(--accent-rgb), 0.1)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'var(--accent-color)'
                  }}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p style={{ fontSize: '15px', opacity: 0.6, lineHeight: 1.6, fontWeight: 300 }}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Interactive Demo Concept */}
        <section className="py-64 px-8 flex flex-col items-center" style={{ backgroundColor: 'rgba(var(--accent-rgb), 0.01)', borderTop: '1px solid var(--border-color)' }}>
          <div className="max-w-4xl w-full text-center mb-32" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div 
              style={{ 
                display: 'inline-block',
                padding: '6px 12px',
                borderRadius: '6px',
                backgroundColor: 'rgba(var(--accent-rgb), 0.08)',
                color: 'var(--accent-color)',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.15em',
                marginBottom: '24px'
              }}
            >
              SIDE-BY-SIDE
            </div>
            <h2 className="text-5xl font-medium mb-6 tracking-tight" style={{ textAlign: 'center' }}>Designed for Depth.</h2>
            <p className="opacity-50 max-w-2xl mx-auto text-lg font-light leading-relaxed" style={{ textAlign: 'center' }}>
              Aria integrates directly into your workspace, providing a proactive, side-by-side companion for your most complex research projects.
            </p>
          </div>
          
          <div 
            style={{ 
              width: '100%',
              maxWidth: '1100px',
              aspectRatio: '16/10',
              borderRadius: '32px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--card-bg)',
              boxShadow: '0 50px 120px rgba(0,0,0,0.12)',
              display: 'flex',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            {/* Window Controls Decor */}
            <div style={{ position: 'absolute', top: '24px', left: '24px', display: 'flex', gap: '8px', zIndex: 20 }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--text-color)', opacity: 0.1 }}></div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--text-color)', opacity: 0.1 }}></div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--text-color)', opacity: 0.1 }}></div>
            </div>

            <div style={{ flex: 1, padding: '80px 60px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ width: '60px', height: '6px', backgroundColor: 'var(--accent-color)', opacity: 0.2, marginBottom: '20px', borderRadius: '100px' }}></div>
              <div style={{ width: '100%', height: '14px', backgroundColor: 'var(--text-color)', opacity: 0.05, borderRadius: '4px' }}></div>
              <div style={{ width: '90%', height: '14px', backgroundColor: 'var(--text-color)', opacity: 0.05, borderRadius: '4px' }}></div>
              <div style={{ width: '95%', height: '14px', backgroundColor: 'var(--text-color)', opacity: 0.05, borderRadius: '4px' }}></div>
              <div style={{ width: '85%', height: '14px', backgroundColor: 'var(--text-color)', opacity: 0.05, borderRadius: '4px' }}></div>
              <div style={{ width: '40%', height: '14px', backgroundColor: 'var(--text-color)', opacity: 0.05, borderRadius: '4px', marginTop: '20px' }}></div>
            </div>

            <div 
              style={{ 
                width: '380px', 
                backgroundColor: 'rgba(var(--accent-rgb), 0.02)', 
                padding: '80px 40px 40px 40px', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '24px',
                borderLeft: '1px solid var(--border-color)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Sparkles size={16} className="text-[var(--accent-color)]" />
                <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', opacity: 0.5 }}>ARIA INSIGHT</span>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                style={{ 
                  padding: '24px', 
                  borderRadius: '20px', 
                  backgroundColor: 'var(--bg-color)', 
                  border: '1px solid var(--border-color)', 
                  boxShadow: '0 12px 24px rgba(0,0,0,0.06)',
                  position: 'relative'
                }}
              >
                <p style={{ fontSize: '14px', lineHeight: 1.6, opacity: 0.9, fontWeight: 300 }}>
                  "I've noticed you're exploring cognitive flow. You might find Csikszentmihalyi's 1990 study relevant to this chapter..."
                </p>
                
                <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                  <div style={{ padding: '4px 10px', borderRadius: '6px', backgroundColor: 'rgba(var(--accent-rgb), 0.1)', color: 'var(--accent-color)', fontSize: '10px', fontWeight: 700 }}>STUDY</div>
                  <div style={{ padding: '4px 10px', borderRadius: '6px', backgroundColor: 'rgba(var(--text-color), 0.05)', fontSize: '10px', fontWeight: 700 }}>CITATION</div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        {/* Narrative Description Section */}
        <section className="py-40 px-8 flex justify-center" style={{ backgroundColor: 'var(--bg-color)' }}>
          <div className="max-w-3xl w-full flex flex-col gap-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
            >
              <p style={{ fontSize: '24px', lineHeight: 1.8, opacity: 0.9, fontWeight: 300, fontStyle: 'italic', letterSpacing: '-0.01em' }}>
                "Aria is not just an interface; she is the connective tissue between your raw notes and your final breakthrough. By analyzing the underlying semantic structures of your research, she illuminates pathways that traditional search engines simply cannot see."
              </p>
              
              <div style={{ width: '60px', height: '1px', backgroundColor: 'var(--accent-color)', margin: '20px auto', opacity: 0.3 }}></div>

              <p style={{ fontSize: '19px', lineHeight: 1.9, opacity: 0.7, fontWeight: 300, letterSpacing: '0.01em' }}>
                We believe that the best AI is the one that respects your cognitive space. Aria is built to be proactive yet invisible, stepping in only when she has a meaningful contribution to make. This "quiet intelligence" ensures that you remain the architect of your ideas, while she provides the structural integrity of a world-class research department.
              </p>

              <p style={{ fontSize: '19px', lineHeight: 1.9, opacity: 0.7, fontWeight: 300, letterSpacing: '0.01em' }}>
                Privacy is the bedrock of deep work. Unlike traditional cloud-based models, Aria processes your most sensitive research within the secure confines of your Living OS. Your data is your own, used only to enhance your local intelligence and never to train external models. This is private intelligence for the modern scholar.
              </p>

              <p style={{ fontSize: '19px', lineHeight: 1.9, opacity: 0.7, fontWeight: 300, letterSpacing: '0.01em' }}>
                As you continue to build your knowledge base, Aria grows with you. She learns the nuances of your specific domain, becoming more intuitive and insightful over time. This isn't just about finding information; it's about fostering a collaborative relationship with an entity that understands the gravity of your creative and academic pursuits.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              style={{ marginTop: '48px', display: 'flex', justifyContent: 'center' }}
            >
              <button 
                onClick={onStart}
                style={{ 
                  padding: '22px 56px', 
                  borderRadius: '100px', 
                  backgroundColor: 'rgba(var(--accent-rgb), 0.1)', 
                  color: 'var(--accent-color)', 
                  border: '2px solid var(--accent-color)', 
                  fontSize: '16px', 
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = 'var(--accent-color)';
                  e.currentTarget.style.color = 'var(--bg-color)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'rgba(var(--accent-rgb), 0.1)';
                  e.currentTarget.style.color = 'var(--accent-color)';
                }}
              >
                Begin Your Journey with Aria
              </button>
            </motion.div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
};

export default AriaPage;
