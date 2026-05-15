import { ReactNode, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { ShieldAlert, ChevronLeft, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminRoute({ children }: { children: ReactNode }) {
  const { user, isAdmin, loading, signOut, role } = useAuth();

  useEffect(() => {
    if (user) {
      console.log(`[AdminRoute] Auth User: ${user.email}, Role: ${role}, Path: ${window.location.pathname}`);
    }
  }, [user, role]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    console.warn(`[AdminRoute] Access Denied. User: ${user?.email}, Role: ${role}`);
    return (
      <div className="fixed inset-0 bg-[#0a0f0d] flex items-center justify-center p-6 z-[100]">
        <div className="glass-card p-10 rounded-[3rem] max-w-lg w-full text-center space-y-6 border-[#2eb774]/20 shadow-[0_0_50px_rgba(46,183,116,0.1)]">
          <div className="w-20 h-20 bg-error/10 rounded-3xl flex items-center justify-center mx-auto shadow-2xl border border-error/20">
            <ShieldAlert className="w-10 h-10 text-error" />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Access Restricted</h2>
            <p className="text-[#2eb774]/60 text-sm font-medium leading-relaxed font-mono uppercase tracking-widest">
              Security clearance level mismatch. This sector requires root administrative credentials.
            </p>
          </div>
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/admin/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#2eb774] text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all shadow-[0_0_30px_rgba(46,183,116,0.2)]"
            >
              Secure Login
            </Link>
            <Link 
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/5 border border-white/10 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all text-white"
            >
              <ChevronLeft className="w-4 h-4" />
              Surface Level
            </Link>
          </div>
          <button 
            onClick={() => signOut()}
            className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-error transition-all"
          >
            Terminate Current Session
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
