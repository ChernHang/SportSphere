import { useState, FormEvent, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { supabase } from '../../lib/supabase';
import { Mail, Lock, LogIn, Sparkles, UserPlus, Fingerprint, ShieldCheck, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';

export default function LoginPage() {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, signInAsGuest, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle automatic redirect if user is already logged in
  useEffect(() => {
    if (user && !loading) {
      if (isAdmin) {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [user, isAdmin, loading, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isSignUp) {
        const { error: authError } = await signUpWithEmail(email, password);
        if (authError) throw authError;
      } else {
        const { error: authError } = await signInWithEmail(email, password);
        if (authError) throw authError;
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center p-4 z-[100] overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative"
      >
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-primary/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-secondary/10 rounded-full blur-[100px] animate-pulse delay-700"></div>

        <div className="glass-card relative bg-surface-container/60 backdrop-blur-3xl rounded-[3rem] p-10 border-white/5 shadow-2xl">
          <div className="text-center space-y-6 mb-10">
            <div className="inline-flex items-center gap-3 bg-white/5 px-6 py-2 rounded-full border border-white/10">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-on-surface">Member Access Port</span>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-4xl font-black text-on-surface tracking-tighter italic uppercase text-primary">SportSphere</h1>
              <p className="text-on-surface-variant font-medium text-sm tracking-tight">Your personalized AI sports companion</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant group-focus-within:text-primary transition-colors" />
                <input 
                  type="email" 
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-surface-container-low border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary/50 transition-all text-on-surface font-medium"
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant group-focus-within:text-primary transition-colors" />
                <input 
                  type="password" 
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-surface-container-low border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary/50 transition-all text-on-surface font-medium"
                />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-error/10 border border-error/20 p-4 rounded-xl flex items-center gap-3"
                >
                  <Fingerprint className="w-4 h-4 text-error shrink-0" />
                  <p className="text-[10px] font-black text-error uppercase tracking-widest">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-on-primary-container py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-on-primary-container/20 border-t-on-primary-container rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  {isSignUp ? 'Establish Identity' : 'Authenticate Match'}
                </>
              )}
            </button>
          </form>

          <div className="mt-8 space-y-4">
             <div className="relative">
               <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
               <div className="relative flex justify-center text-[10px] font-black uppercase"><span className="bg-surface-container px-4 text-on-surface-variant tracking-widest">Third Party Auth</span></div>
             </div>

             <div className="grid grid-cols-2 gap-4">
               <button 
                 onClick={signInWithGoogle}
                 className="bg-white/5 border border-white/5 py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all active:scale-95 group"
               >
                 <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4 group-hover:scale-110 transition-transform" alt="Google" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-on-surface">Google</span>
               </button>
               <button 
                 onClick={signInAsGuest}
                 className="bg-white/5 border border-white/5 py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all active:scale-95 group"
               >
                 <UserPlus className="w-4 h-4 text-on-surface-variant group-hover:scale-110 transition-transform" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-on-surface">Guest</span>
               </button>
             </div>
          </div>

          <div className="mt-10 flex flex-col items-center gap-4">
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline transition-all"
            >
              {isSignUp ? 'Return to Login' : 'Create New Account'}
            </button>
            <Link 
              to="/admin/login"
              className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest hover:text-[#2eb774] transition-all flex items-center gap-2 pb-2"
            >
              <ShieldCheck className="w-3 h-3" />
              Administrative Portal
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ChevronRight(props: any) {
  return (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
