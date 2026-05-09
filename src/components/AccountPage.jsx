import React from 'react';
import { motion } from 'framer-motion';
import { User, CreditCard, Shield, LogOut, ArrowLeft, Mail, Crown } from 'lucide-react';
import LandingNav from './landing/LandingNav';
import LandingFooter from './landing/LandingFooter';

const AccountPage = ({ user, onLogout, onBack, onStart }) => {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}>
      <LandingNav 
        user={user}
        onAccountClick={() => {}}
        onStart={onStart} 
        onHomeClick={onBack} 
        onPricingClick={() => {}} 
      />

      <main className="flex-grow flex flex-col items-center py-32 px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl"
        >
          <div className="flex items-center gap-4 mb-12">
            <button 
              onClick={onBack}
              className="p-2 rounded-full hover:bg-foreground/5 transition-all"
              style={{ color: 'var(--text-color)' }}
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-4xl font-medium tracking-tight">Your Account</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Profile Section */}
            <div className="md:col-span-2 flex flex-col gap-8">
              <section 
                className="p-8 rounded-[32px] border border-foreground/10 bg-card/50 backdrop-blur-sm"
                style={{ border: '1px solid var(--border-color)' }}
              >
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                    <User size={40} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold">{user?.displayName || user?.email?.split('@')[0]}</h2>
                    <p className="opacity-50 flex items-center gap-2 mt-1">
                      <Mail size={14} />
                      {user?.email}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8 border-t border-foreground/5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-2">Display Name</p>
                    <p className="text-lg font-medium">{user?.displayName || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-2">Account ID</p>
                    <p className="text-sm font-mono opacity-60 truncate">{user?.uid}</p>
                  </div>
                </div>
              </section>

              <section 
                className="p-8 rounded-[32px] border border-foreground/10 bg-card/50 backdrop-blur-sm"
                style={{ border: '1px solid var(--border-color)' }}
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <Crown className="text-accent" size={24} />
                    <h2 className="text-xl font-semibold">Subscription</h2>
                  </div>
                  <span className="px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-bold tracking-tight">
                    Free Plan
                  </span>
                </div>
                
                <p className="opacity-60 mb-8 leading-relaxed">
                  You are currently on the Zen (Free) plan. Upgrade to Crescendo for unlimited AI assistance, binaural libraries, and PDF extraction.
                </p>

                <button 
                  onClick={() => {}} // Could link to pricing
                  className="px-8 py-4 rounded-full bg-foreground text-background font-bold text-sm hover:scale-105 transition-all"
                >
                  Explore Pro Plans
                </button>
              </section>
            </div>

            {/* Sidebar info */}
            <div className="flex flex-col gap-8">
              <section 
                className="p-8 rounded-[32px] border border-foreground/10 bg-card/50 backdrop-blur-sm"
                style={{ border: '1px solid var(--border-color)' }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard className="opacity-40" size={20} />
                  <h3 className="font-semibold">Billing</h3>
                </div>
                <p className="text-sm opacity-50 mb-6">Manage your payment methods and billing history.</p>
                <button className="text-sm font-bold text-accent hover:underline">Manage Billing</button>
              </section>

              <section 
                className="p-8 rounded-[32px] border border-foreground/10 bg-card/50 backdrop-blur-sm"
                style={{ border: '1px solid var(--border-color)' }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="opacity-40" size={20} />
                  <h3 className="font-semibold">Security</h3>
                </div>
                <p className="text-sm opacity-50 mb-6">Update your password and security settings.</p>
                <button className="text-sm font-bold text-accent hover:underline">Reset Password</button>
              </section>

              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-3 p-6 rounded-[32px] border border-red-500/20 bg-red-500/5 text-red-500 font-bold hover:bg-red-500/10 transition-all mt-auto"
              >
                <LogOut size={20} />
                Sign Out
              </button>
            </div>
          </div>
        </motion.div>
      </main>

      <LandingFooter />
    </div>
  );
};

export default AccountPage;
