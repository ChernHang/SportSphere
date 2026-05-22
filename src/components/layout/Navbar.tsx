import { Search, Bell, LogOut, ShieldCheck, Sparkles, User, Settings, X, Play, ExternalLink, Radio, Check, Info, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { supabase } from '../../lib/supabase';
import { mockMatches } from '../../data/mockMatches';
import regeneratedImage1779435260876 from '../../assets/images/regenerated_image_1779435260876.webp';

const STATIC_SEARCH_ITEMS = [
  { id: 'p1', type: 'platform', title: 'Sky Sports Stream Lobby', subtitle: 'Formula 1 Live streams & Premier League coverage', path: '/broadcast', tag: 'Broadcaster' },
  { id: 'p2', type: 'platform', title: 'DAZN Stream Portal', subtitle: 'MMA, boxing night events & global matches', path: '/broadcast', tag: 'Broadcaster' },
  { id: 'p3', type: 'platform', title: 'beIN SPORTS French League', subtitle: 'Ligue 1 and UEFA Champions League legal broadcaster', path: '/broadcast', tag: 'Broadcaster' },
  { id: 'p4', type: 'platform', title: 'YouTube TV Free Clips', subtitle: 'Highlights reels, classic records, and live replays', path: '/broadcast', tag: 'Broadcaster' },
  { id: 'p5', type: 'team', title: 'Manchester City', subtitle: 'Track and pin football clubs, custom teams & groups', path: '/watchlist', tag: 'Clubs Hub' },
  { id: 'p6', type: 'team', title: 'Golden State Warriors', subtitle: 'Track and manage basketball clubs, dynamic analytics', path: '/watchlist', tag: 'Clubs Hub' }
];

export default function Navbar() {
  const { signOut, user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [dbUsername, setDbUsername] = useState<string | null>(null);
  const [dbAvatarUrl, setDbAvatarUrl] = useState<string | null>(null);
  
  // Custom States
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [notifications, setNotifications] = useState(() => {
    return [
      { id: 'n1', title: 'Monaco Grand Prix is Live!', desc: 'Streaming feed is secured via Sky Sports. Click to view.', time: 'Just now', read: false, path: '/broadcast' },
      { id: 'n2', title: 'Championship alert armed', desc: 'Alert is active for UCL Final: Real Madrid vs Dortmund.', time: '10 mins ago', read: false, path: '/dashboard' },
      { id: 'n3', title: 'Transfer Report release', desc: 'Gemini has compiled latest high stakes summer report.', time: '1 hour ago', read: true, path: '/dashboard' },
      { id: 'n4', title: 'Profile synchronized', desc: 'Successfully connected with Supabase user profiles.', time: '2 hours ago', read: true, path: '/profile' }
    ];
  });

  const navigate = useNavigate();

  // Load custom profile details in real-time on menu open or mount so it shows instantly
  useEffect(() => {
    if (!user) return;
    
    // Set initially from auth metadata
    const meta = user.user_metadata || {};
    setDbUsername(meta.username || user.email?.split('@')[0] || null);
    setDbAvatarUrl(meta.avatar_url || null);

    // Subscribe or query profiles table for changes
    const fetchLatestProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', user.id)
          .single();
        if (data && !error) {
          if (data.username) setDbUsername(data.username);
          if (data.avatar_url) setDbAvatarUrl(data.avatar_url);
        }
      } catch (err) {
        console.warn('Real-time profile fetch notice:', err);
      }
    };

    fetchLatestProfile();
    
    // Listen for auth profile changes or local actions
    const interval = setInterval(fetchLatestProfile, 5000);
    return () => clearInterval(interval);
  }, [user, showMenu]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
    setShowMenu(false);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleNotificationClick = (id: string, path: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    navigate(path);
    setShowNotifications(false);
    showToast("Redirected to corresponding alert context.");
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast("All active notifications marked as read!");
  };

  const clearNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
    showToast("Cleared alert from dashboard queue.");
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const searchItems = [
    ...mockMatches.map(m => ({
      id: m.id,
      type: 'match',
      title: `${m.teamA} vs ${m.teamB}`,
      subtitle: `${m.tournament} • ${m.startTime === 'LIVE' ? 'ACTIVE MATCH' : m.startTime}`,
      path: `/broadcast?search=${encodeURIComponent(m.teamA)}`,
      tag: m.startTime === 'LIVE' ? 'Live' : m.genre
    })),
    ...STATIC_SEARCH_ITEMS
  ];

  // Filter searchable elements
  const filteredSearchItems = searchQuery.trim() === ''
    ? searchItems.slice(0, 4) // Show standard elements as recommendation when empty
    : searchItems.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <header className={cn(
      "fixed top-0 w-full z-50 backdrop-blur-lg border-b shadow-lg flex justify-between items-center px-6 h-16 transition-all duration-500",
      "bg-background/80 border-white/10 shadow-[0_4px_20px_rgba(56,189,248,0.1)]"
    )}>
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-6 z-50 bg-sky-950/90 text-sky-200 border border-sky-500/30 px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 text-xs font-black"
          >
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3">
        <img 
          alt="SportSphere Logo" 
          className="h-8 w-8 object-contain transition-all" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPtUEGxRleNHcRUlBOSOAqRKOtP-rATJ-2xBPfqrPd-SNDos1g5ziLPPnswOBuVJt-vV6idOvRdLJ7mmpyeqsEoThqk_3UFo_ff1Zxhgbe3YnNOhfTFgltI4kSW8VjQ0hgbtMppXXzY-I29oZxUkCqwdJpcjyL9Jl5iGJmNzpCcs8RteeWg-7jhZet1xtPuotEz13L70okVLlf3UFM9H2Hpl128wLZHCT5bMkF84wae992xEtsEZINCcYmIAZFTwF-8-u-ch-dT2A" 
        />
        <Link 
          to="/" 
          className="font-bold text-2xl tracking-tighter transition-colors text-primary"
        >
          SportSphere
        </Link>
      </div>
      
      <div className="flex items-center gap-4 lg:gap-6">
        {/* Search Trigger Button */}
        <button 
          id="navbar-search-btn"
          onClick={() => setShowSearch(true)}
          className="transition-all hover:scale-110 text-on-surface-variant hover:text-primary p-2 rounded-xl hover:bg-white/5 cursor-pointer outline-none"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Notifications Dropdown Trigger */}
        <div className="relative">
          <button 
            id="navbar-notifications-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            className="transition-all hover:scale-110 text-on-surface-variant hover:text-primary p-2 rounded-xl hover:bg-white/5 relative cursor-pointer outline-none"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-slate-900 animate-pulse"></span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          <AnimatePresence>
            {showNotifications && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowNotifications(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-80 sm:w-96 backdrop-blur-xl border rounded-[2rem] py-4 z-50 shadow-2xl overflow-hidden glass-card border-white/10 p-5 bg-slate-950/95"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
                    <div>
                      <p className="text-[10px] uppercase font-black tracking-[0.2em] text-sky-400">Security & Match Alerts</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">{unreadCount} unread notices active</p>
                    </div>
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllAsRead}
                        className="text-[10px] bg-sky-500/10 text-sky-400 hover:bg-sky-500/15 border border-sky-400/20 px-2.5 py-1 rounded-lg font-bold transition-all"
                      >
                        Mark Read
                      </button>
                    )}
                  </div>

                  <div className="max-h-64 overflow-y-auto pr-1 space-y-2.5">
                    {notifications.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-xs text-on-surface-variant">Your notifications logs are all cleared.</p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div 
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif.id, notif.path)}
                          className={cn(
                            "p-3 rounded-xl border transition-all cursor-pointer flex justify-between gap-3 text-left",
                            notif.read 
                              ? "bg-white/[0.01] border-white/5 opacity-60 hover:opacity-100 hover:border-white/10" 
                              : "bg-sky-500/[0.03] border-sky-500/20 hover:border-sky-500/30"
                          )}
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {!notif.read && <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping"></span>}
                              <h5 className="font-bold text-xs text-white leading-tight">{notif.title}</h5>
                            </div>
                            <p className="text-[10px] text-on-surface-variant leading-relaxed">{notif.desc}</p>
                            <p className="text-[8px] text-on-surface-variant/40 mt-1 font-semibold">{notif.time}</p>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => clearNotification(notif.id, e)}
                            className="p-1 hover:text-red-400 text-on-surface-variant/50 shrink-0 transition-colors self-start cursor-pointer"
                            title="Clear Alert"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="pt-3.5 border-t border-white/5 mt-3 flex justify-between">
                    <button
                      onClick={() => {
                        setShowNotifications(false);
                        navigate('/settings');
                        showToast("Opening notification pipelines console...");
                      }}
                      className="text-[10px] text-sky-400 hover:text-sky-300 font-bold transition-all uppercase tracking-wider block"
                    >
                      Pipeline Settings
                    </button>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-[10px] text-on-surface-variant hover:text-white font-bold transition-all"
                    >
                      Close
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
        
        {/* Avatar Profile Pull Down Menu */}
        <div className="relative">
          <button 
            id="navbar-profile-btn"
            onClick={() => setShowMenu(!showMenu)}
            className="h-10 w-10 rounded-xl border overflow-hidden transition-all active:scale-95 bg-surface-container-high border-outline-variant hover:ring-2 ring-primary/20 cursor-pointer outline-none"
          >
            <img 
              alt="User Profile" 
              src={dbAvatarUrl || user?.user_metadata?.avatar_url || regeneratedImage1779435260876} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
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
                  className="absolute right-0 mt-3 w-56 backdrop-blur-xl border rounded-[2rem] py-3 z-50 shadow-2xl overflow-hidden glass-card border-white/10 bg-slate-950/95"
                >
                  <div className="px-5 py-3 border-b mb-2 border-white/5">
                    <p className="text-[10px] uppercase font-black tracking-[0.2em] text-on-surface-variant mb-1">User Handle</p>
                    <p className="text-xs truncate font-bold text-sky-400">@{dbUsername || user?.user_metadata?.username || user?.email?.split('@')[0] || 'Guest'}</p>
                    <p className="text-[9px] truncate font-medium text-on-surface-variant/70 mt-0.5">{user?.email || 'Anonymous guest'}</p>
                  </div>

                  <Link 
                    to="/dashboard"
                    onClick={() => setShowMenu(false)}
                    className="w-full flex items-center gap-3 px-5 py-3 text-sm text-on-surface hover:bg-white/5 transition-all font-bold group"
                  >
                    <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform text-primary" />
                    My Dashboard
                  </Link>

                  <Link 
                    to="/profile"
                    onClick={() => setShowMenu(false)}
                    className="w-full flex items-center gap-3 px-5 py-3 text-sm text-on-surface hover:bg-white/5 transition-all font-bold group"
                  >
                    <User className="w-4 h-4 group-hover:scale-110 transition-transform text-primary" />
                    Edit Profile
                  </Link>

                  <Link 
                    to="/settings"
                    onClick={() => setShowMenu(false)}
                    className="w-full flex items-center gap-3 px-5 py-3 text-sm text-on-surface hover:bg-white/5 transition-all font-bold group"
                  >
                    <Settings className="w-4 h-4 group-hover:spin-slow transition-transform text-primary" />
                    Preferences
                  </Link>

                  <button 
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-5 py-3 text-sm text-error hover:bg-error/10 transition-all font-bold group mt-1 border-t border-white/5 pt-3 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    Log Out
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Global Interactive Search Overlay */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-start justify-center p-6 pt-24"
          >
            {/* Click outside search container */}
            <div className="absolute inset-0 z-0" onClick={() => setShowSearch(false)} />

            <motion.div
              initial={{ y: -30, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: -30, scale: 0.98 }}
              className="relative z-10 w-full max-w-2xl bg-slate-950 border border-sky-400/25 rounded-[2.5rem] shadow-[0_10px_50px_rgba(56,189,248,0.15)] overflow-hidden p-6 flex flex-col"
            >
              {/* Header inside search block */}
              <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-4">
                <Search className="text-sky-400 w-5 h-5 shrink-0" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Query matches, teams, broadcasters, or stream channels..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-0 focus:outline-none focus:ring-0 text-white text-sm placeholder:text-on-surface-variant/40 font-semibold"
                />
                <button
                  onClick={() => setShowSearch(false)}
                  className="p-1.5 hover:bg-white/5 rounded-full text-on-surface-variant hover:text-white transition-all cursor-pointer"
                  title="Close Search"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Suggestions / Results */}
              <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[10px] font-black uppercase text-sky-400 tracking-wider">
                    {searchQuery.trim() === '' ? 'Recommended Searches' : `Matched Results (${filteredSearchItems.length})`}
                  </span>
                  {searchQuery.trim() !== '' && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="text-[10px] text-on-surface-variant hover:text-white transition-colors"
                    >
                      Clear input
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {filteredSearchItems.length === 0 ? (
                    <div className="text-center py-10 space-y-2">
                      <p className="text-xs text-on-surface-variant font-medium">No instant matches found for "{searchQuery}".</p>
                      <p className="text-[10px] text-on-surface-variant/50 max-w-sm mx-auto">Try typing broad terms like <span className="text-sky-400 font-bold">F1</span>, <span className="text-sky-400 font-bold">Wimbledon</span>, <span className="text-sky-400 font-bold">DAZN</span>, or <span className="text-sky-400 font-bold">City</span>.</p>
                    </div>
                  ) : (
                    filteredSearchItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setShowSearch(false);
                          setSearchQuery('');
                          navigate(item.path);
                          showToast(`Redirecting to: ${item.title}`);
                        }}
                        className="w-full text-left p-3.5 rounded-2xl bg-white/[0.02] hover:bg-sky-500/[0.03] border border-white/5 hover:border-sky-500/25 transition-all flex items-center justify-between gap-4 group cursor-pointer"
                      >
                        <div className="space-y-0.5">
                          <p className="font-bold text-xs text-white group-hover:text-sky-400 transition-colors">{item.title}</p>
                          <p className="text-[10px] text-on-surface-variant leading-relaxed">{item.subtitle}</p>
                        </div>
                        <div className="flex items-center gap-2shrink-0">
                          <span className="text-[9px] font-black uppercase tracking-wider bg-slate-900 border border-white/10 text-on-surface-variant px-2.5 py-1 rounded-full group-hover:border-sky-450/40 group-hover:text-sky-400 transition-colors">
                            {item.tag}
                          </span>
                          <Play className="w-3.5 h-3.5 text-on-surface-variant group-hover:text-sky-400 transition-colors shrink-0" />
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Informational Footer note */}
              <div className="pt-4 border-t border-white/5 mt-4 flex items-center gap-2.5 text-[9px] text-on-surface-variant/70 font-semibold leading-relaxed">
                <Info className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>Search results compile live matches and broadcaster locations instantly based on index records updated by Gemini Discovery pipelines.</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
