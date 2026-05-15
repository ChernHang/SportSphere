import { useState, FormEvent, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { supabase } from '../../lib/supabase';
import { Mail, Lock, LogIn, ShieldCheck, ChevronLeft, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';

export default function AdminLoginPage() {
  const { signInWithEmail, signUpWithEmail, user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const adminColor = "#2eb774";

  // Redirect if already admin
  useEffect(() => {
    if (user && !authLoading && !loading) {
      if (isAdmin) {
        navigate('/admin/dashboard');
      } else if (!isSignUp) {
        // Only show access denied if they aren't currently signing up/initializing
        setError("Access Denied: Your account does not have administrative privileges.");
      }
    }
  }, [user, isAdmin, authLoading, loading, navigate, isSignUp]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isSignUp) {
        const { data, error: authError } = await signUpWithEmail(email, password);
        if (authError) throw authError;

        if (data?.user) {
          console.log('[AdminLogin] User created, waiting for profile trigger...');
          // Small delay to allow database trigger to create the profile record
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Force admin role for this specific registration request in the portal
          const { error: profileError } = await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', data.user.id);
          
          if (profileError) {
             console.error('Failed to set admin role:', profileError);
          } else {
             console.log('[AdminLogin] Admin role successfully assigned');
             // Refresh page or trigger auth state change to reflect new role
             window.location.reload(); 
          }
        }
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
    <div className="fixed inset-0 bg-[#0a0f0d] flex items-center justify-center p-4 z-[100] overflow-y-auto transition-colors duration-700">
      {/* Matrix-like green glow background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#2eb774_0%,transparent_50%)] animate-pulse"></div>
        <div className="grid grid-cols-12 h-full w-full gap-4 p-4 opacity-5">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="h-full border-l border-[#2eb774]"></div>
          ))}
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-[#2eb774] to-emerald-400 rounded-[3rem] blur opacity-20 transition-opacity duration-500 group-hover:opacity-40"></div>
        
        <div className="relative glass-card bg-black/60 backdrop-blur-3xl rounded-[3rem] p-10 border-[#2eb774]/20 shadow-[0_0_80px_rgba(46,183,116,0.15)]">
          <div className="flex justify-between items-center mb-10">
            <Link 
              to="/login" 
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#2eb774]/60 hover:text-[#2eb774] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Member Access
            </Link>
            <div className="flex items-center gap-2 bg-[#2eb774]/10 px-4 py-1.5 rounded-full border border-[#2eb774]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2eb774] animate-pulse"></span>
              <span className="text-[9px] font-black uppercase text-[#2eb774] tracking-[0.2em]">Secure Node</span>
            </div>
          </div>

          <div className="text-center space-y-4 mb-10">
            <div className="w-20 h-20 bg-[#2eb774]/10 rounded-[2rem] flex items-center justify-center mx-auto border border-[#2eb774]/30 shadow-[0_0_40px_rgba(46,183,116,0.2)]">
              <ShieldCheck className="w-10 h-10 text-[#2eb774]" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tighter uppercase mb-1 italic">Administrative Portal</h1>
              <div className="flex items-center justify-center gap-2">
                <Terminal className="w-3 h-3 text-[#2eb774]/50" />
                <p className="text-[10px] text-[#2eb774]/50 font-mono uppercase tracking-[0.3em]">Restricted Management Environment</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2eb774]/40 group-focus-within:text-[#2eb774] transition-colors" />
                <input 
                  type="email" 
                  placeholder="Admin Identifier"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-[#2eb774]/50 focus:ring-1 focus:ring-[#2eb774]/20 transition-all text-white font-mono text-sm"
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2eb774]/40 group-focus-within:text-[#2eb774] transition-colors" />
                <input 
                  type="password" 
                  placeholder="Encryption Key"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-[#2eb774]/50 focus:ring-1 focus:ring-[#2eb774]/20 transition-all text-white font-mono text-sm"
                />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-error/10 border border-error/20 p-4 rounded-xl"
                >
                  <p className="text-[10px] font-black text-error uppercase tracking-widest leading-tight">
                    Access Denied: {error}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#2eb774] text-black py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-[0_0_50px_rgba(46,183,116,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  {isSignUp ? 'Initialize Admin' : 'Request Clearance'}
                </>
              )}
            </button>
          </form>

          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full mt-10 text-[10px] font-black text-[#2eb774] uppercase tracking-widest hover:underline transition-all opacity-60 hover:opacity-100"
          >
            {isSignUp ? 'Return to Authentication' : 'Request Administrative Deployment'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
