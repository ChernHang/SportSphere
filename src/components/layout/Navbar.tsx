import { Search, Bell, LogOut, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

export default function Navbar() {
  const { signOut, user, isAdmin } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className={cn(
      "fixed top-0 w-full z-50 backdrop-blur-lg border-b shadow-lg flex justify-between items-center px-6 h-16 transition-all duration-500",
      isAdmin 
        ? "bg-[#2eb774]/10 border-[#2eb774]/20 shadow-[0_4px_25px_rgba(46,183,116,0.15)]" 
        : "bg-background/80 border-white/10 shadow-[0_4px_20px_rgba(56,189,248,0.1)]"
    )}>
      <div className="flex items-center gap-3">
        <img 
          alt="SportSphere Logo" 
          className={cn("h-8 w-8 object-contain transition-all", isAdmin && "drop-shadow-[0_0_8px_#2eb774]")} 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPtUEGxRleNHcRUlBOSOAqRKOtP-rATJ-2xBPfqrPd-SNDos1g5ziLPPnswOBuVJt-vV6idOvRdLJ7mmpyeqsEoThqk_3UFo_ff1Zxhgbe3YnNOhfTFgltI4kSW8VjQ0hgbtMppXXzY-I29oZxUkCqwdJpcjyL9Jl5iGJmNzpCcs8RteeWg-7jhZet1xtPuotEz13L70okVLlf3UFM9H2Hpl128wLZHCT5bMkF84wae992xEtsEZINCcYmIAZFTwF-8-u-ch-dT2A" 
        />
        <Link 
          to={isAdmin ? "/admin/dashboard" : "/"} 
          className={cn(
            "font-bold text-2xl tracking-tighter transition-colors",
            isAdmin ? "text-[#2eb774]" : "text-primary"
          )}
        >
          SportSphere
        </Link>
        {isAdmin && (
          <div className="hidden sm:flex items-center gap-2 ml-4 px-3 py-1 bg-[#2eb774]/20 border border-[#2eb774]/30 rounded-full animate-in zoom-in slide-in-from-left-4">
            <ShieldCheck className="w-3 h-3 text-[#2eb774]" />
            <span className="text-[10px] font-black uppercase text-[#2eb774] tracking-widest">Admin Control</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-4 lg:gap-6">
        <button className={cn("transition-all hover:scale-110", isAdmin ? "text-[#2eb774]/70 hover:text-[#2eb774]" : "text-on-surface-variant hover:text-primary")}>
          <Search className="w-6 h-6" />
        </button>
        <button className={cn("transition-all hover:scale-110", isAdmin ? "text-[#2eb774]/70 hover:text-[#2eb774]" : "text-on-surface-variant hover:text-primary")}>
          <Bell className="w-6 h-6" />
        </button>
        
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className={cn(
              "h-10 w-10 rounded-xl border overflow-hidden transition-all active:scale-95",
              isAdmin 
                ? "bg-[#2eb774]/20 border-[#2eb774]/30 ring-[#2eb774]/10 hover:ring-4" 
                : "bg-surface-container-high border-outline-variant hover:ring-2 ring-primary/20"
            )}
          >
            <img 
              alt="User Profile" 
              src={user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${user?.id}`} 
              className="w-full h-full object-cover"
            />
          </button>

          <AnimatePresence>
            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowMenu(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className={cn(
                    "absolute right-0 mt-3 w-56 backdrop-blur-xl border rounded-[2rem] py-3 z-50 shadow-2xl overflow-hidden",
                    isAdmin ? "bg-black/90 border-[#2eb774]/20" : "glass-card border-white/10"
                  )}
                >
                  <div className={cn("px-5 py-3 border-b mb-2", isAdmin ? "border-[#2eb774]/10" : "border-white/5")}>
                    <p className="text-[10px] uppercase font-black tracking-[0.2em] text-on-surface-variant mb-1">Authenticated Node</p>
                    <p className={cn("text-xs truncate font-bold", isAdmin ? "text-[#2eb774]" : "text-on-surface")}>{user?.email || 'Guest User'}</p>
                    {isAdmin && (
                      <div className="mt-2 flex items-center gap-2 text-[9px] font-black uppercase text-[#2eb774] bg-[#2eb774]/10 px-3 py-1 rounded-lg border border-[#2eb774]/20 w-fit">
                        <ShieldCheck className="w-3 h-3" />
                        Root Access
                      </div>
                    )}
                  </div>

                  {isAdmin && (
                    <Link 
                      to="/admin/dashboard"
                      onClick={() => setShowMenu(false)}
                      className="w-full flex items-center gap-3 px-5 py-3 text-sm text-[#2eb774] hover:bg-[#2eb774]/10 transition-all font-bold group"
                    >
                      <ShieldCheck className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      Admin Control Panel
                    </Link>
                  )}

                  {!isAdmin && (
                     <Link 
                      to="/dashboard"
                      onClick={() => setShowMenu(false)}
                      className="w-full flex items-center gap-3 px-5 py-3 text-sm text-on-surface hover:bg-white/5 transition-all font-bold group"
                    >
                      <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform text-primary" />
                      My Dashboard
                    </Link>
                  )}

                  <button 
                    onClick={() => {
                      signOut();
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-5 py-3 text-sm text-error hover:bg-error/10 transition-all font-bold group mt-1"
                  >
                    <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    Terminate Session
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
