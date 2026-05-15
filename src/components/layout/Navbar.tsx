import { Search, Bell, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const { signOut, user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-white/10 shadow-[0_4px_20px_rgba(56,189,248,0.1)] flex justify-between items-center px-6 h-16">
      <div className="flex items-center gap-3">
        <img 
          alt="SportSphere Logo" 
          className="h-8 w-8 object-contain" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPtUEGxRleNHcRUlBOSOAqRKOtP-rATJ-2xBPfqrPd-SNDos1g5ziLPPnswOBuVJt-vV6idOvRdLJ7mmpyeqsEoThqk_3UFo_ff1Zxhgbe3YnNOhfTFgltI4kSW8VjQ0hgbtMppXXzY-I29oZxUkCqwdJpcjyL9Jl5iGJmNzpCcs8RteeWg-7jhZet1xtPuotEz13L70okVLlf3UFM9H2Hpl128wLZHCT5bMkF84wae992xEtsEZINCcYmIAZFTwF-8-u-ch-dT2A" 
        />
        <Link to="/" className="font-bold text-2xl text-primary tracking-tighter">SportSphere</Link>
      </div>
      
      <div className="flex items-center gap-4 lg:gap-6">
        <button className="text-on-surface-variant hover:text-primary transition-all">
          <Search className="w-6 h-6" />
        </button>
        <button className="text-on-surface-variant hover:text-primary transition-all">
          <Bell className="w-6 h-6" />
        </button>
        
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="h-9 w-9 rounded-full bg-surface-container-high border border-outline-variant overflow-hidden hover:ring-2 ring-primary/20 transition-all active:scale-95"
          >
            <img 
              alt="User Profile" 
              src={user?.user_metadata?.avatar_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuCpTNIiZAx_3eXpPw0yAWk0yKkB5kW2LhZ-KsS-PwBeRHWFKT2Vg1LhJmIncftiMGXmQkHNWGJHBvLHQC75IByZC_RQ9AJNqtyVo5XpmHnbiA3UewHyi84SxCwHyofnGPts_crQf42vJJWnbbXfn_kbLGbDR0rfGdNjoVBguEVIKILPE6yFyvHTx5hYhz7b05tNSB8krhd1Gl4_1Yf3VxNvr7_y1ZjdnhucitggVgUhD4q1ACqdwh9gqjZWITKki3sIjdpMNLxiFsQ"} 
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
                  className="absolute right-0 mt-2 w-48 glass-card border border-white/10 rounded-2xl py-2 z-50 shadow-2xl"
                >
                  <div className="px-4 py-2 border-b border-white/5 mb-2">
                    <p className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant">Account</p>
                    <p className="text-xs truncate font-medium text-on-surface">{user?.email || 'Guest User'}</p>
                  </div>
                  <button 
                    onClick={() => {
                      signOut();
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-error hover:bg-error/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="font-bold">Log Out</span>
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
