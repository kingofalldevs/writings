import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import LandingNav from './landing/LandingNav';
import LandingFooter from './landing/LandingFooter';

const plans = [
  {
    name: "Zen",
    price: "0",
    description: "Perfect for students and casual focus seekers.",
    features: [
      "Basic Minimalist Editor",
      "Standard Zen Tracks",
      "Limited Aria AI (10 queries/day)",
      "Single Device Sync"
    ],
    cta: "Get Started",
    highlight: false
  },
  {
    name: "Crescendo",
    price: "12",
    description: "The full Living OS experience for deep thinkers.",
    features: [
      "Everything in Zen",
      "Unlimited Aria AI Assistant",
      "Full Binaural Library",
      "PDF Research Extraction",
      "Cross-platform Sync"
    ],
    cta: "Start Free Trial",
    highlight: true
  },
  {
    name: "Purist",
    price: "99",
    description: "One-time payment for lifetime access to flow.",
    features: [
      "Everything in Crescendo",
      "Lifetime Updates",
      "Exclusive Beta Features",
      "Priority Support",
      "Founding Member Badge"
    ],
    cta: "Join the Legacy",
    highlight: false
  }
];

const PricingPage = ({ onStart, onBack }) => {
  const [billingCycle, setBillingCycle] = useState('monthly');

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}>
      <LandingNav onStart={onStart} onPricingClick={() => {}} onHomeClick={onBack} />

      <main className="flex-grow flex flex-col items-center py-32 px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-24 w-full max-w-4xl"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <div 
            style={{ 
              display: 'inline-block',
              padding: '8px 16px',
              borderRadius: '8px',
              backgroundColor: 'rgba(var(--accent-rgb), 0.08)',
              marginBottom: '24px'
            }}
          >
            <span style={{ fontSize: '12px', fontWeight: 700, uppercase: true, letterSpacing: '0.2em', color: 'var(--accent-color)' }}>PRICING FOR FLOW</span>
          </div>
          
          <h1 
            className="font-medium tracking-tight mb-8" 
            style={{ fontSize: 'clamp(44px, 7vw, 84px)', lineHeight: 1.05, color: 'var(--text-color)' }}
          >
            Invest in your <br /><span style={{ color: 'var(--accent-color)' }}>cognitive peak.</span>
          </h1>

          <p style={{ fontSize: '18px', opacity: 0.5, maxWidth: '540px', margin: '0 auto 48px auto', fontWeight: 300 }}>
            Choose the pace of your progress. All plans include our core minimalist Living OS and binaural audio library.
          </p>
          
          {/* Billing Toggle - Restructured to be balanced */}
          <div 
            style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px',
              borderRadius: '100px',
              backgroundColor: 'rgba(var(--accent-rgb), 0.05)',
              border: '1px solid var(--border-color)',
              width: 'fit-content',
              margin: '0 auto'
            }}
          >
            <button 
              onClick={() => setBillingCycle('monthly')}
              style={{ 
                padding: '12px 28px', 
                borderRadius: '100px', 
                fontSize: '14px', 
                fontWeight: 600,
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                backgroundColor: billingCycle === 'monthly' ? 'var(--card-bg)' : 'transparent',
                color: 'var(--text-color)',
                border: 'none',
                cursor: 'pointer',
                boxShadow: billingCycle === 'monthly' ? '0 8px 16px rgba(0,0,0,0.08)' : 'none',
                opacity: billingCycle === 'monthly' ? 1 : 0.5,
                minWidth: '140px'
              }}
            >
              Monthly
            </button>
            <button 
              onClick={() => setBillingCycle('yearly')}
              style={{ 
                padding: '12px 28px', 
                borderRadius: '100px', 
                fontSize: '14px', 
                fontWeight: 600,
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                backgroundColor: billingCycle === 'yearly' ? 'var(--card-bg)' : 'transparent',
                color: 'var(--text-color)',
                border: 'none',
                cursor: 'pointer',
                boxShadow: billingCycle === 'yearly' ? '0 8px 16px rgba(0,0,0,0.08)' : 'none',
                opacity: billingCycle === 'yearly' ? 1 : 0.5,
                minWidth: '140px'
              }}
            >
              Yearly <span style={{ color: 'var(--accent-color)', marginLeft: '6px', fontSize: '12px' }}>-20%</span>
            </button>
          </div>
        </motion.div>

        <div 
          style={{ 
            width: '100%',
            maxWidth: '1200px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px',
            padding: '20px 0'
          }}
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{ 
                background: plan.highlight ? 'rgba(var(--accent-rgb), 0.03)' : 'var(--card-bg)',
                border: plan.highlight ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                borderRadius: '32px',
                padding: '64px 48px 48px 48px',
                display: 'flex',
                flexDirection: 'column',
                gap: '40px',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative',
                height: '100%'
              }}
            >
              {plan.highlight && (
                <div 
                  style={{ 
                    position: 'absolute',
                    top: '-16px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    padding: '8px 20px',
                    borderRadius: '100px',
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    backgroundColor: 'var(--accent-color)',
                    color: 'var(--bg-color)',
                    boxShadow: '0 8px 20px rgba(var(--accent-rgb), 0.25)',
                    zIndex: 10
                  }}
                >
                  Most Popular
                </div>
              )}

              <div>
                <h3 className="text-2xl font-bold mb-3">{plan.name}</h3>
                <p className="text-[15px] opacity-60 leading-relaxed">{plan.description}</p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold tracking-tight">
                  ${plan.price === "99" ? plan.price : (billingCycle === 'yearly' ? Math.round(plan.price * 0.8) : plan.price)}
                </span>
                <span className="text-sm opacity-40 font-medium">{plan.price === "99" ? "once" : "/month"}</span>
              </div>

              <div className="flex flex-col gap-5 py-8 border-y border-[var(--border-color)]">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check size={18} className="text-[var(--accent-color)] mt-0.5" />
                    <span className="text-[15px] opacity-80">{feature}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={onStart}
                className={`w-full rounded-full font-bold transition-all duration-300 flex items-center justify-center gap-3 group/btn`}
                style={{ 
                  padding: '22px 0',
                  backgroundColor: plan.highlight ? 'var(--text-color)' : 'rgba(var(--accent-rgb), 0.03)',
                  color: plan.highlight ? 'var(--bg-color)' : 'var(--text-color)',
                  border: plan.highlight ? 'none' : '1.5px solid var(--border-color)',
                  cursor: 'pointer',
                  fontSize: '15px',
                  letterSpacing: '0.04em',
                  boxShadow: plan.highlight ? '0 12px 24px rgba(0,0,0,0.1)' : 'none',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={e => {
                  if (!plan.highlight) {
                    e.currentTarget.style.borderColor = 'var(--accent-color)';
                    e.currentTarget.style.backgroundColor = 'rgba(var(--accent-rgb), 0.06)';
                    e.currentTarget.style.color = 'var(--accent-color)';
                  } else {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 16px 32px rgba(0,0,0,0.15)';
                  }
                }}
                onMouseLeave={e => {
                  if (!plan.highlight) {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.backgroundColor = 'rgba(var(--accent-rgb), 0.03)';
                    e.currentTarget.style.color = 'var(--text-color)';
                  } else {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
                  }
                }}
              >
                <span>{plan.cta}</span>
                <ArrowRight size={18} className="group-hover/btn:translate-x-1.5 transition-transform duration-300" />
              </button>
            </motion.div>
          ))}
        </div>
      </main>

      <LandingFooter />
    </div>
  );
};

export default PricingPage;
