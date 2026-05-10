import React from 'react';
import { motion } from 'framer-motion';
import { FileText, FileDown, Layers, ArrowRight } from 'lucide-react';

const integrations = [
  {
    name: 'Substack',
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 fill-[#FF6719]">
        <path d="M22.539 8.242H1.46V5.405h21.078v2.837zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
      </svg>
    ),
    description: 'Newsletter sync',
    color: '#FF6719'
  },
  {
    name: 'Medium',
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 fill-foreground">
        <path d="M13.54 12a6.8 6.8 0 11-6.77 6.82A6.77 6.77 0 0113.54 12zm7.42.33c0 3.54-1.51 6.42-3.38 6.42s-3.38-2.88-3.38-6.42 1.51-6.42 3.38-6.42 3.38 2.88 3.38 6.42zM24 12.15c0 3.16-.46 5.71-1 5.71s-1-2.55-1-5.71.46-5.71 1-5.71 1 2.55 1 5.71z" />
      </svg>
    ),
    description: 'Direct publishing',
    color: 'var(--foreground)'
  },
  {
    name: 'Wattpad',
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 fill-[#FF6127]">
        <path d="M11.999 0C5.373 0 0 5.373 0 12c0 6.627 5.373 12 12 12s12-5.373 12-12c0-6.627-5.373-12-12-12zm4.35 17.5l-4.35-2.5-4.35 2.5V8.5h8.7v9z" />
      </svg>
    ),
    description: 'Community reach',
    color: '#FF6127'
  },
  {
    name: 'PDF',
    icon: <FileDown className="w-8 h-8 text-red-500" />,
    description: 'Print-ready',
    color: '#ef4444'
  },
  {
    name: 'Word',
    icon: <FileText className="w-8 h-8 text-blue-600" />,
    description: 'Document export',
    color: '#2563eb'
  }
];

const LandingExport = () => {
  return (
    <section className="relative w-full py-32 px-8 z-10 flex flex-col items-center max-w-[1200px] mx-auto">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[400px] bg-accent/[0.03] rounded-full blur-[120px] -z-10" />

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h2 className="text-[clamp(32px,5vw,52px)] font-medium tracking-tight leading-tight mb-6">
          Export to your <span className="text-accent italic">workflow.</span>
        </h2>
        <p className="text-xl font-light opacity-60 max-w-2xl mx-auto leading-relaxed">
          Your writing shouldn't be trapped. Writings connects with the platforms you already use, making publishing as effortless as the writing process itself.
        </p>
      </motion.div>

      {/* Horizontal Cards Grid */}
      <div className="w-full grid grid-cols-2 md:grid-cols-5 gap-4 lg:gap-6">
        {integrations.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative flex flex-col items-center p-8 rounded-2xl border border-foreground/10 bg-foreground/[0.02] hover:bg-foreground/[0.04] transition-all duration-300"
          >
            <div className="mb-6 w-16 h-16 rounded-xl flex items-center justify-center transition-transform duration-500">
              {item.icon}
            </div>
            
            <h3 className="font-medium text-lg mb-1">{item.name}</h3>
            <p className="text-xs opacity-50 text-center font-light uppercase tracking-wider">{item.description}</p>
            
            {/* Hover Indicator */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight className="w-4 h-4 text-accent/40" />
            </div>
          </motion.div>
        ))}
      </div>

    </section>
  );
};

export default LandingExport;
