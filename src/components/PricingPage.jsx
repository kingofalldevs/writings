import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Sparkles, Zap } from 'lucide-react';
import LandingNav from './landing/LandingNav';
import LandingFooter from './landing/LandingFooter';
import { useAuth } from '../context/AuthContext';

const plans = [
  {
    id: 'zen',
    name: 'Zen',
    price: 3,
    description: 'Everything you need to start your writing practice.',
    features: [
      'Minimalist Living OS Editor',
      'Scrivener-style Binder',
      'Binaural Focus Tracks',
      'Aria AI (50 queries/day)',
      'Single Device Sync',
    ],
    cta: 'Start Writing',
    highlight: false,
  },
  {
    id: 'writings',
    name: 'Writings',
    price: 8,
    description: 'The full Living OS experience for deep thinkers.',
    features: [
      'Everything in Zen',
      'Unlimited Aria AI Assistant',
      'Full Binaural Audio Library',
      'PDF Research Extraction',
      'Author Portfolio & Publishing',
      'Cross-platform Sync',
    ],
    cta: 'Start Writing',
    highlight: true,
  },
  {
    id: 'purist',
    name: 'Purist',
    price: 15,
    description: 'For serious writers who demand the absolute best.',
    features: [
      'Everything in Writings',
      'Priority AI Response',
      'Exclusive Beta Features',
      'Priority Support',
      'Founding Member Badge',
      'Early Access to New Tools',
    ],
    cta: 'Go Purist',
    highlight: false,
  },
];

const PricingPage = ({ onStart, onBack }) => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [trialMode, setTrialMode] = useState(true); // true = 7-day trial, false = pay now
  const [loadingPlan, setLoadingPlan] = useState(null);
  const { user } = useAuth();

  const getPrice = (plan) => {
    if (billingCycle === 'yearly') return Math.round(plan.price * 0.8);
    return plan.price;
  };

  const handleCheckout = async (plan) => {
    if (!user) {
      onStart(); // opens auth modal
      return;
    }

    setLoadingPlan(plan.id);
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan.id,
          userEmail: user.email,
          userName: user.displayName || '',
          trial: trialMode,
        }),
      });

      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        alert('Failed to start checkout. Please try again.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}>
      <LandingNav onStart={onStart} onPricingClick={() => {}} onHomeClick={onBack} />

      <main className="flex-grow flex flex-col items-center py-32 px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 w-full max-w-4xl"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <div style={{
            display: 'inline-block',
            padding: '8px 16px',
            borderRadius: '8px',
            backgroundColor: 'rgba(var(--accent-rgb), 0.08)',
            marginBottom: '24px'
          }}>
            <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.2em', color: 'var(--accent-color)' }}>
              PRICING FOR FLOW
            </span>
          </div>

          <h1 className="font-medium tracking-tight mb-8" style={{ fontSize: 'clamp(44px, 7vw, 84px)', lineHeight: 1.05 }}>
            Invest in your <br />
            <span style={{ color: 'var(--accent-color)' }}>cognitive peak.</span>
          </h1>

          <p style={{ fontSize: '18px', opacity: 0.5, maxWidth: '540px', margin: '0 auto 40px', fontWeight: 300 }}>
            No free tier. No compromises. Every plan includes the full Living OS and a 7-day free trial.
          </p>

          {/* Trial / Pay Now toggle */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '32px',
            padding: '16px 24px',
            borderRadius: '16px',
            backgroundColor: 'rgba(var(--accent-rgb), 0.04)',
            border: '1px solid var(--border-color)',
          }}>
            <button
              onClick={() => setTrialMode(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 20px', borderRadius: '100px', fontSize: '14px', fontWeight: 600,
                transition: 'all 0.3s ease', border: 'none', cursor: 'pointer',
                backgroundColor: trialMode ? 'var(--accent-color)' : 'transparent',
                color: trialMode ? 'var(--bg-color)' : 'var(--text-color)',
                opacity: trialMode ? 1 : 0.5,
              }}
            >
              <Sparkles size={14} />
              7-day free trial
            </button>
            <button
              onClick={() => setTrialMode(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 20px', borderRadius: '100px', fontSize: '14px', fontWeight: 600,
                transition: 'all 0.3s ease', border: 'none', cursor: 'pointer',
                backgroundColor: !trialMode ? 'var(--accent-color)' : 'transparent',
                color: !trialMode ? 'var(--bg-color)' : 'var(--text-color)',
                opacity: !trialMode ? 1 : 0.5,
              }}
            >
              <Zap size={14} />
              Pay now, skip trial
            </button>
          </div>

          {/* Monthly / Yearly toggle */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '4px', padding: '6px',
            borderRadius: '100px', backgroundColor: 'rgba(var(--accent-rgb), 0.05)',
            border: '1px solid var(--border-color)', width: 'fit-content', margin: '0 auto'
          }}>
            {['monthly', 'yearly'].map((cycle) => (
              <button
                key={cycle}
                onClick={() => setBillingCycle(cycle)}
                style={{
                  padding: '12px 28px', borderRadius: '100px', fontSize: '14px', fontWeight: 600,
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)', border: 'none', cursor: 'pointer',
                  backgroundColor: billingCycle === cycle ? 'var(--card-bg)' : 'transparent',
                  color: 'var(--text-color)',
                  boxShadow: billingCycle === cycle ? '0 8px 16px rgba(0,0,0,0.08)' : 'none',
                  opacity: billingCycle === cycle ? 1 : 0.5,
                  minWidth: '140px'
                }}
              >
                {cycle.charAt(0).toUpperCase() + cycle.slice(1)}
                {cycle === 'yearly' && (
                  <span style={{ color: 'var(--accent-color)', marginLeft: '6px', fontSize: '12px' }}>-20%</span>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Plan cards */}
        <div style={{
          width: '100%', maxWidth: '1200px',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px', padding: '20px 0'
        }}>
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{
                background: plan.highlight ? 'rgba(var(--accent-rgb), 0.03)' : 'var(--card-bg)',
                border: plan.highlight ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                borderRadius: '32px', padding: '64px 48px 48px 48px',
                display: 'flex', flexDirection: 'column', gap: '40px',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative', height: '100%'
              }}
            >
              {plan.highlight && (
                <div style={{
                  position: 'absolute', top: '-16px', left: '50%', transform: 'translateX(-50%)',
                  padding: '8px 20px', borderRadius: '100px', fontSize: '11px', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.15em',
                  backgroundColor: 'var(--accent-color)', color: 'var(--bg-color)',
                  boxShadow: '0 8px 20px rgba(var(--accent-rgb), 0.25)', zIndex: 10
                }}>
                  Most Popular
                </div>
              )}

              <div>
                <h3 className="text-2xl font-bold mb-3">{plan.name}</h3>
                <p className="text-[15px] opacity-60 leading-relaxed">{plan.description}</p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold tracking-tight">${getPrice(plan)}</span>
                <span className="text-sm opacity-40 font-medium">/month</span>
              </div>

              {trialMode && (
                <div style={{
                  padding: '10px 16px', borderRadius: '10px',
                  backgroundColor: 'rgba(var(--accent-rgb), 0.06)',
                  border: '1px solid rgba(var(--accent-rgb), 0.15)',
                  fontSize: '13px', color: 'var(--accent-color)', fontWeight: 500
                }}>
                  ✦ 7 days free — cancel anytime before being charged
                </div>
              )}

              <div className="flex flex-col gap-5 py-8 border-y border-[var(--border-color)]">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check size={18} className="text-[var(--accent-color)] mt-0.5" />
                    <span className="text-[15px] opacity-80">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleCheckout(plan)}
                disabled={loadingPlan === plan.id}
                className="w-full rounded-full font-bold transition-all duration-300 flex items-center justify-center gap-3 group/btn"
                style={{
                  padding: '22px 0',
                  backgroundColor: plan.highlight ? 'var(--text-color)' : 'rgba(var(--accent-rgb), 0.03)',
                  color: plan.highlight ? 'var(--bg-color)' : 'var(--text-color)',
                  border: plan.highlight ? 'none' : '1.5px solid var(--border-color)',
                  cursor: loadingPlan === plan.id ? 'wait' : 'pointer',
                  fontSize: '15px', letterSpacing: '0.04em',
                  boxShadow: plan.highlight ? '0 12px 24px rgba(0,0,0,0.1)' : 'none',
                  opacity: loadingPlan === plan.id ? 0.7 : 1,
                }}
                onMouseEnter={e => {
                  if (loadingPlan) return;
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
                {loadingPlan === plan.id ? (
                  <span>Preparing checkout...</span>
                ) : (
                  <>
                    <span>{trialMode ? 'Start Free Trial' : plan.cta}</span>
                    <ArrowRight size={18} className="group-hover/btn:translate-x-1.5 transition-transform duration-300" />
                  </>
                )}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Trust note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ marginTop: '48px', fontSize: '13px', opacity: 0.35, textAlign: 'center' }}
        >
          Payments processed securely by Dodo Payments · Cancel anytime · No hidden fees
        </motion.p>
      </main>

      <LandingFooter />
    </div>
  );
};

export default PricingPage;
