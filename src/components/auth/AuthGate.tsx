import { useEffect, ReactNode } from 'react';
import { useAuth } from './AuthProvider';
import { Sparkles, Settings, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { isSupabaseConfigured } from '../../lib/supabase';

import LoginPage from './LoginPage';

export default function AuthGate({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (!isSupabaseConfigured) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center p-6 z-[100]">
        <div className="glass-card p-8 rounded-[2rem] max-w-md w-full text-center space-y-6 border-primary/20">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
            <Settings className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-on-surface">Supabase Setup Required</h2>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              To enable guest access and database features, please add your Supabase credentials to the <b>Secrets</b> panel.
            </p>
          </div>
          <div className="bg-surface-container p-4 rounded-xl text-left space-y-3 border border-white/5">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-primary text-on-primary font-bold text-[10px] flex items-center justify-center mt-0.5">1</div>
              <p className="text-xs">Add <code className="text-primary font-mono bg-primary/5 px-1">VITE_SUPABASE_URL</code> to Secrets</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-primary text-on-primary font-bold text-[10px] flex items-center justify-center mt-0.5">2</div>
              <p className="text-xs">Add <code className="text-primary font-mono bg-primary/5 px-1">VITE_SUPABASE_ANON_KEY</code> to Secrets</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-primary text-on-primary font-bold text-[10px] flex items-center justify-center mt-0.5">3</div>
              <p className="text-xs">Enable <b>Anonymous Auth</b> in Supabase Settings</p>
            </div>
          </div>
          <p className="text-[10px] text-on-surface-variant italic">
            Check <b>SUPABASE_SETUP.md</b> in the file explorer for more details.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center space-y-6 z-[100]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="relative"
        >
          <div className="w-24 h-24 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
          </div>
        </motion.div>
        
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-primary tracking-tighter">SportSphere</h2>
          <p className="text-on-surface-variant text-sm animate-pulse">Initializing Secure Session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return <>{children}</>;
}
