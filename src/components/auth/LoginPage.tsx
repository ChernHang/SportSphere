import { useState, FormEvent } from 'react';
import { useAuth } from './AuthProvider';
import { Mail, Lock, LogIn, Sparkles, UserPlus, Fingerprint } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

export default function LoginPage() {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, signInAsGuest } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error: authError } = isSignUp 
        ? await signUpWithEmail(email, password)
        : await signInWithEmail(email, password);
      
      if (authError) throw authError;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center p-4 z-[100] overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-md rounded-[2.5rem] p-8 lg:p-10 border-primary/20 relative overflow-hidden"
      >
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[80px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/10 blur-[80px] -z-10"></div>

        <div className="text-center space-y-2 mb-10">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
             <img 
               alt="Logo" 
               className="h-8 w-8 object-contain" 
               src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPtUEGxRleNHcRUlBOSOAqRKOtP-rATJ-2xBPfqrPd-SNDos1g5ziLPPnswOBuVJt-vV6idOvRdLJ7mmpyeqsEoThqk_3UFo_ff1Zxhgbe3YnNOhfTFgltI4kSW8VjQ0hgbtMppXXzY-I29oZxUkCqwdJpcjyL9Jl5iGJmNzpCcs8RteeWg-7jhZet1xtPuotEz13L70okVLlf3UFM9H2Hpl128wLZHCT5bMkF84wae992xEtsEZINCcYmIAZFTwF-8-u-ch-dT2A" 
             />
          </div>
          <h1 className="text-3xl font-black text-on-surface tracking-tighter">Welcome to SportSphere</h1>
          <p className="text-on-surface-variant text-sm font-medium">Your personalized AI sports companion</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant group-focus-within:text-primary transition-colors" />
              <input 
                type="email" 
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-surface-container-low border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-medium"
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant group-focus-within:text-primary transition-colors" />
              <input 
                type="password" 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-surface-container-low border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-medium"
              />
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.p 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-xs text-error font-medium px-2"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-on-primary-container py-4 rounded-2xl font-black shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-on-primary-container/20 border-t-on-primary-container rounded-full animate-spin"></div>
            ) : (
              <>
                {isSignUp ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </>
            )}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
          <div className="relative flex justify-center text-[10px] uppercase font-black text-on-surface-variant tracking-[0.2em] bg-transparent"><span className="px-4 bg-[#1b2024]">OR</span></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => signInWithGoogle()}
            className="flex items-center justify-center gap-2 py-3 border border-white/5 bg-surface-container-low rounded-xl font-bold text-xs hover:bg-white/5 transition-all text-on-surface-variant hover:text-on-surface"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" alt="Google" />
            Google
          </button>
          <button 
            onClick={() => signInAsGuest()}
            className="flex items-center justify-center gap-2 py-3 border border-white/5 bg-surface-container-low rounded-xl font-bold text-xs hover:bg-white/5 transition-all text-on-surface-variant hover:text-on-surface"
          >
            <Sparkles className="w-4 h-4" />
            Guest
          </button>
        </div>

        <button 
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full mt-8 text-xs font-bold text-primary hover:underline transition-all flex items-center justify-center gap-2"
        >
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          <ChevronRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
}

// Helper icons that were missing in the imports
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
