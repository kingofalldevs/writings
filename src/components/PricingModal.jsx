'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, Sparkles, Zap, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const plans = [
  {
    id: 'free',
    name: 'Zen (Free)',
    price: 0,
    description: 'Start your practice.',
    features: ['Minimalist Editor', 'Binder', 'Binaural Audio', 'Aria AI (50/day)'],
    cta: 'Start Free',
    highlight: false,
  },
  {
    id: 'pro',
    name: 'Writings Pro',
    price: 10,
    description: 'Full creative toolkit.',
    features: ['Unlimited AI', 'Full Ideabase', 'Portfolio Publishing', 'PDF Extraction'],
    cta: 'Start Pro',
    highlight: true,
  },
];

const PricingModal = ({ isOpen, onClose }) => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [loadingPlan, setLoadingPlan] = useState(null);
  const { user } = useAuth();

  if (!isOpen) return null;

  const getPrice = (plan) => {
    if (plan.id === 'free') return 0;
    if (billingCycle === 'yearly') return 100;
    return 10;
  };

  const handleManageBilling = async () => {
    const customerId = user?.subscription?.customerId;
    
    setLoadingPlan('portal');
    try {
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          customerId,
          userEmail: user?.email 
        }),
      });

      const data = await response.json();
      if (data.portalUrl) {
        window.location.href = data.portalUrl;
      } else {
        throw new Error(data.error || 'Failed to generate portal link');
      }
    } catch (err) {
      console.error('Portal error:', err);
      alert('Unable to open billing portal. Please try again later.');
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleCheckout = async (plan) => {
    if (!user) return; // Should be logged in to see modal anyway

    setLoadingPlan(plan.id);
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan.id,
          userEmail: user.email,
          userName: user.displayName || '',
          trial: false,
        }),
      });

      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        // Show the real Polar error so we can debug it
        const msg = data.details || data.error || 'Failed to start checkout.';
        alert(`Checkout error: ${msg}`);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert(`Network error: ${err.message}`);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-3xl bg-background border border-foreground/10 shadow-2xl rounded-3xl p-8 max-h-[90vh] overflow-y-auto hide-scrollbar"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-foreground/5 transition-colors"
          >
            <X size={24} />
          </button>

          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold mb-4 tracking-tight">
              {user?.subscription?.status === 'active' ? 'Your Subscription' : 'Upgrade Your Practice'}
            </h2>
            <p className="text-muted text-lg mb-8">
              {user?.subscription?.status === 'active' 
                ? 'You are currently on the Writings Pro plan.' 
                : 'Unlock the full power of the Living OS.'}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              {/* Monthly / Yearly toggle */}
              <div className="flex items-center gap-1 p-1.5 rounded-full bg-accent/5 border border-foreground/10">
                {['monthly', 'yearly'].map((cycle) => (
                  <button
                    key={cycle}
                    onClick={() => setBillingCycle(cycle)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      billingCycle === cycle ? 'bg-foreground/5 shadow-sm text-foreground' : 'text-muted hover:text-foreground'
                    }`}
                  >
                    {cycle.charAt(0).toUpperCase() + cycle.slice(1)}
                    {cycle === 'yearly' && <span className="text-accent ml-1">-20%</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={`grid ${user?.subscription?.status === 'active' ? 'grid-cols-1 max-w-sm' : 'md:grid-cols-2 max-w-2xl'} gap-6 mx-auto`}>
            {plans
              .filter(p => user?.subscription?.status === 'active' ? p.id === 'pro' : true)
              .map((plan) => (
              <div
                key={plan.id}
                className={`relative flex flex-col p-6 rounded-2xl transition-all ${
                  plan.highlight 
                    ? 'border-2 border-accent bg-accent/5 shadow-lg' 
                    : 'border border-foreground/10 bg-background hover:border-accent/50'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-background text-[10px] font-bold uppercase tracking-wider rounded-full">
                    Most Popular
                  </div>
                )}
                
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p className="text-sm text-muted mb-6 h-10">{plan.description}</p>
                
                <div className="mb-6 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">${getPrice(plan)}</span>
                  <span className="text-sm text-muted">{billingCycle === 'yearly' && plan.id !== 'free' ? '/year' : '/mo'}</span>
                </div>

                <div className="flex-1 flex flex-col gap-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <Check size={16} className="text-accent shrink-0 mt-0.5" />
                      <span className="opacity-80">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    if (user?.subscription?.status === 'active' && plan.id === 'pro') {
                      handleManageBilling();
                      return;
                    }
                    plan.id !== 'free' && handleCheckout(plan);
                  }}
                  disabled={loadingPlan === plan.id || loadingPlan === 'portal' || (user && plan.id === 'free' && user?.subscription?.status !== 'active')}
                  className={`w-full py-3 rounded-full font-bold flex items-center justify-center gap-2 transition-all ${
                    plan.highlight
                      ? 'bg-text-color text-bg-color hover:scale-[1.02]'
                      : 'bg-accent/5 text-foreground hover:bg-accent/10 border border-foreground/10'
                  } ${(user && plan.id === 'free' && user?.subscription?.status !== 'active') ? 'opacity-50 cursor-default' : ''}`}
                  style={plan.highlight ? { backgroundColor: 'var(--text-color)', color: 'var(--bg-color)' } : {}}
                >
                  {loadingPlan === plan.id || (loadingPlan === 'portal' && plan.id === 'pro' && user?.subscription?.status === 'active') ? 'Loading...' : (
                    <>
                      {user && plan.id === 'free' && user?.subscription?.status !== 'active' ? 'Current Plan' : (
                        user?.subscription?.status === 'active' && plan.id === 'pro' ? 'Manage Subscription' : plan.cta
                      )}
                      {!(user && plan.id === 'free' && user?.subscription?.status !== 'active') && <ArrowRight size={16} />}
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
          
          <p className="text-center text-xs text-muted mt-8">Secure payments via Polar.sh. Cancel anytime.</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PricingModal;
