import React from 'react';
import { motion } from 'framer-motion';
import { User, CreditCard, Shield, LogOut, ArrowLeft, Mail, Crown, Settings, Key, Receipt } from 'lucide-react';
import LandingNav from './landing/LandingNav';
import LandingFooter from './landing/LandingFooter';

const AccountPage = ({ user, onLogout, onBack, onStart }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <LandingNav 
        user={user}
        onAccountClick={() => {}}
        onStart={onStart} 
        onHomeClick={onBack} 
        onPricingClick={() => {}} 
      />

      <main className="flex-grow flex flex-col items-center py-32 px-8">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-5xl"
        >
          {/* Top Header */}
          <div className="flex items-center gap-6 mb-16">
            <button 
              onClick={onBack}
              className="p-3 rounded-full hover:bg-foreground/5 transition-all border border-foreground/5"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-4xl font-bold tracking-tight font-serif">Account Settings</h1>
              <p className="text-sm opacity-40 mt-1">Manage your identity, subscription, and security.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-12 items-start">
            {/* Left Column: Main Identity & Subscription */}
            <div className="space-y-8">
              {/* Profile Card */}
              <section className="p-10 rounded-2xl border border-foreground/10 bg-foreground/[0.01] transition-all">
                <div className="flex flex-col md:flex-row md:items-center gap-8 mb-10">
                  <div className="w-24 h-24 rounded-2xl bg-accent/5 flex items-center justify-center text-accent border border-accent/10">
                    <User size={48} strokeWidth={1.5} />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-3xl font-bold font-serif">{user?.displayName || user?.email?.split('@')[0]}</h2>
                    </div>
                    <div className="flex items-center gap-2 text-muted text-sm">
                      <Mail size={14} className="opacity-40" />
                      {user?.email}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 pt-10 border-t border-foreground/5">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-30">Display Name</p>
                    <p className="text-lg font-medium">{user?.displayName || 'Not set'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-30">Account ID</p>
                    <p className="text-xs font-mono opacity-40 truncate bg-foreground/5 px-3 py-1.5 rounded-lg inline-block">{user?.uid}</p>
                  </div>
                </div>
              </section>

              {/* Subscription Card */}
              <section className="p-10 rounded-2xl border border-foreground/10 bg-foreground/[0.01]">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-accent/10 rounded-xl text-accent border border-accent/5">
                      <Crown size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold font-serif">Subscription</h2>
                      <p className="text-xs opacity-40 mt-0.5 uppercase tracking-widest font-bold">
                        {user?.subscription?.status === 'active' ? 'Writings Pro' : 'Zen Plan'}
                      </p>
                    </div>
                  </div>
                  <span className={`px-5 py-2 rounded-full text-[11px] font-bold tracking-widest uppercase border ${
                    user?.subscription?.status === 'active' 
                      ? 'bg-accent/10 text-accent border-accent/20' 
                      : 'bg-foreground/5 text-muted border-foreground/5'
                  }`}>
                    {user?.subscription?.status === 'active' ? 'Premium Active' : 'Free Forever'}
                  </span>
                </div>
                
                <p className="text-foreground/70 mb-10 leading-relaxed max-w-xl">
                  {user?.subscription?.status === 'active' 
                    ? "Thank you for supporting meditative writing. Your Pro features are unlocked across all devices."
                    : "You're currently exploring the calm basics. Upgrade to Writings Pro for unlimited AI assistance, binaural soundscapes, and advanced manuscript exports."}
                </p>

                <div className="flex items-center gap-4">
                  <button 
                    onClick={onPricing}
                    className="px-8 py-4 rounded-full bg-accent text-background font-bold text-sm transition-all hover:opacity-90"
                  >
                    {user?.subscription?.status === 'active' ? 'Manage Subscription' : 'Explore Pro Plans'}
                  </button>
                  {user?.subscription?.status !== 'active' && (
                    <button className="px-8 py-4 rounded-full border border-foreground/10 hover:bg-foreground/5 transition-all text-sm font-bold">
                      View Benefits
                    </button>
                  )}
                </div>
              </section>
            </div>

            {/* Right Column: Sidebar Actions */}
            <div className="space-y-6">
              {/* Quick Actions Container */}
              <div className="p-8 rounded-2xl border border-foreground/10 space-y-8 bg-foreground/[0.01]">
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-30 mb-6">Privacy & Access</h3>
                  <div className="space-y-4">
                    <ActionButton 
                      icon={<Receipt size={16} />} 
                      label="Manage Billing" 
                      onClick={() => window.location.href = 'https://app.dodopayments.com/customer-portal'}
                    />
                    <ActionButton icon={<Key size={16} />} label="Reset Password" />
                    <ActionButton icon={<Shield size={16} />} label="Two-Factor Auth" />
                  </div>
                </div>

                <div className="pt-8 border-t border-foreground/5">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-30 mb-6">Danger Zone</h3>
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border border-red-500/10 bg-red-500/[0.03] text-red-500 text-sm font-bold hover:bg-red-500/10 transition-all"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              </div>

              {/* Need help? */}
              <div className="p-8 rounded-2xl border border-foreground/10 bg-foreground/[0.01] text-center">
                <p className="text-xs opacity-40 mb-4">Questions about your plan?</p>
                <a href="mailto:support@writings.page" className="text-xs font-bold text-accent hover:underline">Contact Support</a>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <LandingFooter />
    </div>
  );
};

const ActionButton = ({ icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between group px-4 py-3.5 rounded-xl hover:bg-foreground/5 transition-all"
  >
    <div className="flex items-center gap-3">
      <div className="opacity-40 group-hover:opacity-100 group-hover:text-accent transition-all">
        {icon}
      </div>
      <span className="text-sm font-semibold opacity-70 group-hover:opacity-100 transition-all">{label}</span>
    </div>
    <div className="opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
      <ArrowLeft size={14} className="rotate-180" />
    </div>
  </button>
);

export default AccountPage;
