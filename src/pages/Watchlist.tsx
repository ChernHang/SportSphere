import React, { useState, useEffect } from 'react';
import { Star, Bell, Shield, Radio, Trophy, Sparkles, Share2, Heart, History, Trash2, Smartphone, Calendar, Search, Newspaper, Zap, ChevronRight, MessageSquare, Plus, Volume2, VolumeX, Save, Copy, Check, X, Film, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { geminiService } from '../services/geminiService';
import { cn } from '../lib/utils';
import { mockMatches } from '../data/mockMatches';

interface SavedDigest {
  id: string;
  text: string;
  timestamp: number;
  sports: string[];
}

export default function Watchlist() {
  const [digest, setDigest] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  
  // Custom preference sliders/inputs
  const [prefSports, setPrefSports] = useState<string[]>(['Football', 'Basketball']);
  const [customTeams, setCustomTeams] = useState('Real Madrid, GSW, Lakers');

  // Interactive local states
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [connectingLiveMatch, setConnectingLiveMatch] = useState<string | null>(null);
  
  // Custom Alerts set state
  const [activeAlerts, setActiveAlerts] = useState<Record<string, boolean>>({});

  // Dynamic clearable notification logs synced with localStorage
  const [notificationLogs, setNotificationLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('sportsphere_notifications');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      { id: '1', label: 'MATCH STARTING', time: '2m ago', title: 'Liverpool vs Real Madrid', sub: 'Watch live on Stadium 1', icon: Radio, mType: 'primary' },
      { id: '2', label: 'GOAL UPDATE', time: '15m ago', title: 'Man City 2-1 Chelsea', sub: 'Haaland scores highlight brace', icon: Shield, mType: 'secondary' },
    ];
  });

  // Watchlist Favorites state
  const [favoriteMatches, setFavoriteMatches] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('favorite_matches') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handleUpdateNotifications = () => {
      try {
        const saved = localStorage.getItem('sportsphere_notifications');
        if (saved) setNotificationLogs(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    };
    const handleUpdateFavorites = () => {
      try {
        setFavoriteMatches(JSON.parse(localStorage.getItem('favorite_matches') || '[]'));
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener('sportsphere_notifications_updated', handleUpdateNotifications);
    window.addEventListener('favorite_matches_updated', handleUpdateFavorites);
    window.addEventListener('storage', handleUpdateNotifications);
    window.addEventListener('storage', handleUpdateFavorites);
    return () => {
      window.removeEventListener('sportsphere_notifications_updated', handleUpdateNotifications);
      window.removeEventListener('favorite_matches_updated', handleUpdateFavorites);
      window.removeEventListener('storage', handleUpdateNotifications);
      window.removeEventListener('storage', handleUpdateFavorites);
    };
  }, []);

  // Saved Teams lists
  const [savedTeamsList, setSavedTeamsList] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sportsphere_watchlist_teams');
      return saved ? JSON.parse(saved) : ['Manchester City', 'Golden State Warriors'];
    } catch {
      return ['Manchester City', 'Golden State Warriors'];
    }
  });

  // Speech synthesis states
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechInstance, setSpeechInstance] = useState<SpeechSynthesisUtterance | null>(null);

  // Saved digests with 7-day automatic expiry
  const [savedDigests, setSavedDigests] = useState<SavedDigest[]>(() => {
    try {
      const raw = localStorage.getItem('sportsphere_saved_digests');
      if (raw) {
        const parsed: SavedDigest[] = JSON.parse(raw);
        // 7 days in milliseconds = 604,800,000
        const now = Date.now();
        const filtered = parsed.filter(item => now - item.timestamp < 604800000);
        return filtered;
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleAddNewTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) {
      showToast("Please enter a valid team name.");
      return;
    }
    const updated = [...savedTeamsList, newTeamName.trim()];
    setSavedTeamsList(updated);
    localStorage.setItem('sportsphere_watchlist_teams', JSON.stringify(updated));
    showToast(`Added "${newTeamName.trim()}" to Saved Teams!`);
    setNewTeamName('');
    setShowAddTeamModal(false);
  };

  const handleRemoveTeam = (teamName: string) => {
    const updated = savedTeamsList.filter(name => name !== teamName);
    setSavedTeamsList(updated);
    localStorage.setItem('sportsphere_watchlist_teams', JSON.stringify(updated));
    showToast(`Removed "${teamName}" from Saved Teams.`);
  };

  const handleRemoveFavorite = (matchId: string, matchName: string) => {
    const updated = favoriteMatches.filter(id => id !== matchId);
    setFavoriteMatches(updated);
    localStorage.setItem('favorite_matches', JSON.stringify(updated));
    showToast(`Removed "${matchName}" from your watchlist.`);
    window.dispatchEvent(new Event('favorite_matches_updated'));
  };

  const getStreamUrlForMatch = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('real madrid') || t.includes('man city') || t.includes('champions league') || t.includes('football') || t.includes('liverpool') || t.includes('chelsea') || t.includes('arsenal')) {
      return 'https://www.skysports.com/football';
    }
    if (t.includes('lakers') || t.includes('celtics') || t.includes('nba') || t.includes('basketball') || t.includes('suns') || t.includes('warriors')) {
      return 'https://plus.espn.com';
    }
    if (t.includes('verstappen') || t.includes('hamilton') || t.includes('monaco') || t.includes('f1') || t.includes('gp') || t.includes('racing')) {
      return 'https://f1tv.formula1.com';
    }
    if (t.includes('djokovic') || t.includes('alcaraz') || t.includes('sinner') || t.includes('medvedev') || t.includes('wimbledon') || t.includes('french open') || t.includes('tennis')) {
      return 'https://www.tennischannel.com';
    }
    return 'https://www.dazn.com';
  };

  const handleWatchStreamSim = (matchTitle: string) => {
    setConnectingLiveMatch(matchTitle);
    showToast(`Opening digital video stream for ${matchTitle}...`);
    setTimeout(() => {
      setConnectingLiveMatch(null);
      showToast(`Redirecting you to the official live broadcaster...`);
      const targetUrl = getStreamUrlForMatch(matchTitle);
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }, 2000);
  };

  const addDynamicNotification = (title: string, sub: string, label: string = 'REMINDER SET') => {
    try {
      const raw = localStorage.getItem('sportsphere_notifications') || '[]';
      const notifs = JSON.parse(raw);
      const newNotif = {
        id: String(Date.now() + Math.random()),
        title,
        desc: sub, // Navbar
        sub,       // Watchlist
        label,
        time: 'Just now',
        read: false,
        mType: 'primary',
        path: '/broadcast'
      };
      const updated = [newNotif, ...notifs];
      localStorage.setItem('sportsphere_notifications', JSON.stringify(updated));
      setNotificationLogs(updated);
      window.dispatchEvent(new Event('sportsphere_notifications_updated'));
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleAlertState = (matchLabel: string) => {
    setActiveAlerts(prev => {
      const next = { ...prev, [matchLabel]: !prev[matchLabel] };
      if (next[matchLabel]) {
        showToast(`Alert registered! We'll notify you on Match kickoff.`);
        addDynamicNotification(
          'MATCH REMINDER ALERT',
          `You have set an active reminder for kickoff of: ${matchLabel}!`,
          'REMINDER SET'
        );
      } else {
        showToast(`Alert canceled for ${matchLabel}.`);
      }
      return next;
    });
  };

  const handleClearNotifications = () => {
    setNotificationLogs([]);
    localStorage.setItem('sportsphere_notifications', JSON.stringify([]));
    window.dispatchEvent(new Event('sportsphere_notifications_updated'));
    showToast("Cleared all offline notification log history.");
  };

  const handleDismissNotification = (id: string, name: string) => {
    const next = notificationLogs.filter(n => n.id !== id);
    setNotificationLogs(next);
    localStorage.setItem('sportsphere_notifications', JSON.stringify(next));
    window.dispatchEvent(new Event('sportsphere_notifications_updated'));
    showToast(`Dismissed alert: ${name}`);
  };

  const generateDigest = async () => {
    setLoadingAi(true);
    setDigest(null);
    try {
      const data = await geminiService.generateDigest({
        favouriteSports: prefSports,
        favouriteTeams: customTeams.split(',').map(s => s.trim()),
        results: 'Real Madrid clinched a critical 2-1 win over Manchester City; Lakers narrowly lost to Denver Nuggets in overtime.',
        upcoming: 'Golden State Warriors face critical clash with Phoenix Suns tonight at 10 PM. El Clasico preview builds up.',
        news: 'Fascinating transfer developments reported for leading strikers. Record attendance set at Wembley Stadium.'
      });
      setDigest(data.digest);
    } catch (error) {
      console.error("Digest generation failed:", error);
    } finally {
      setLoadingAi(false);
    }
  };

  const handleReadAloud = () => {
    if (!digest) return;
    
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const cleanText = digest.replace(/[*#_~`-]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
    };
    
    setIsSpeaking(true);
    setSpeechInstance(utterance);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleSaveDigest = () => {
    if (!digest) return;
    const newDigest: SavedDigest = {
      id: Math.random().toString(36).substr(2, 9),
      text: digest,
      timestamp: Date.now(),
      sports: [...prefSports]
    };

    const updated = [newDigest, ...savedDigests];
    setSavedDigests(updated);
    localStorage.setItem('sportsphere_saved_digests', JSON.stringify(updated));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleDeleteSaved = (id: string) => {
    const updated = savedDigests.filter(item => item.id !== id);
    setSavedDigests(updated);
    localStorage.setItem('sportsphere_saved_digests', JSON.stringify(updated));
  };

  const handleCopyToClipboard = () => {
    if (!digest) return;
    navigator.clipboard.writeText(digest);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleSport = (sport: string) => {
    if (prefSports.includes(sport)) {
      setPrefSports(prefSports.filter(s => s !== sport));
    } else {
      setPrefSports([...prefSports, sport]);
    }
  };

  return (
    <div className="space-y-12 pb-32">
      <header className="pt-6">
        <h1 className="text-4xl font-black mb-2">My Activity</h1>
        <p className="text-on-surface-variant font-medium">Manage your watchlist, teams, and personalized AI digests with 7-day offline logs.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-12">
          {/* Upcoming Matches */}
          <section className="space-y-6">
             <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                  <Star className="w-5 h-5 text-sky-400" />
                  Upcoming Watched Matchups
                </h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockMatches.filter(m => favoriteMatches.includes(m.id)).length === 0 ? (
                <div className="col-span-1 md:col-span-2 glass-card rounded-3xl p-12 text-center flex flex-col items-center justify-center border border-white/5 bg-slate-900/40">
                  <Star className="w-12 h-12 text-sky-500/50 mb-4 animate-pulse" />
                  <h4 className="text-lg font-black text-white">Your Watchlist Priority Queue is Empty</h4>
                  <p className="text-xs text-on-surface-variant max-w-sm mt-1 leading-relaxed">
                    Pin upcoming matches from the home Dashboard or click the Pin button on the Schedule dashboard to track real-time score feeds, streaming links, and AI recommendations.
                  </p>
                </div>
              ) : (
                mockMatches.filter(m => favoriteMatches.includes(m.id)).map((m) => {
                  const matchKey = `${m.teamA} vs ${m.teamB}`;
                  const isAlertActive = activeAlerts[matchKey];
                  const isLive = m.startTime === 'LIVE';
                  return (
                    <div key={m.id} className="glass-card rounded-2xl p-6 hover:translate-y-[-4px] transition-all duration-300 relative group overflow-hidden border border-white/5 bg-slate-900/40">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                          <span className={cn(
                            "px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border bg-sky-500/10 text-sky-400 border-sky-400/20"
                          )}>
                            {m.tournament} • {m.league}
                          </span>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => showToast(`Share link generated for ${matchKey}!`)}
                              className="text-on-surface-variant hover:text-sky-450 transition-all p-1"
                              title="Share match link"
                            >
                              <Share2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleRemoveFavorite(m.id, matchKey)}
                              className="text-on-surface-variant hover:text-red-400 transition-all p-1"
                              title="Remove from watchlist"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-around py-4">
                          <div className="text-center space-y-2 max-w-[125px]">
                            <div className="w-14 h-14 bg-surface-container-highest rounded-full flex items-center justify-center border border-white/10 shadow-lg group-hover:scale-105 transition-transform duration-350 overflow-hidden p-1.5 bg-white/[0.05]">
                              {m.logoA ? (
                                <img 
                                  src={m.logoA} 
                                  alt={m.teamA} 
                                  className={cn(
                                    "w-full h-full",
                                    m.isIndividual ? "object-cover rounded-full" : "object-contain p-0.5"
                                  )} 
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <Shield className="w-8 h-8 text-sky-450" />
                              )}
                            </div>
                            <span className="text-xs font-black text-white block truncate">{m.teamA}</span>
                          </div>
                          
                          <div className="text-center">
                            <p className="text-[10px] font-black text-on-surface-variant uppercase mb-1">{isLive ? 'LIVE NOW' : 'NEXT UP'}</p>
                            <div className={cn("text-xl font-black", isLive ? "text-teal-400 flex items-center gap-2 justify-center" : "text-sky-450")}>
                              {isLive && <span className="w-2 h-2 rounded-full bg-teal-400 live-pulse animate-ping"></span>}
                              {isLive ? m.score : m.startTime}
                            </div>
                          </div>
                          
                          <div className="text-center space-y-2 max-w-[125px]">
                            <div className="w-14 h-14 bg-surface-container-highest rounded-full flex items-center justify-center border border-white/10 shadow-lg group-hover:scale-105 transition-transform duration-350 overflow-hidden p-1.5 bg-white/[0.05]">
                              {m.logoB ? (
                                <img 
                                  src={m.logoB} 
                                  alt={m.teamB} 
                                  className={cn(
                                    "w-full h-full",
                                    m.isIndividual ? "object-cover rounded-full" : "object-contain p-0.5"
                                  )} 
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <Shield className="w-8 h-8 text-sky-450" />
                              )}
                            </div>
                            <span className="text-xs font-black text-white block truncate">{m.teamB}</span>
                          </div>
                        </div>

                        {isLive ? (
                          <button 
                            onClick={() => handleWatchStreamSim(matchKey)}
                            className="w-full py-3 mt-6 rounded-xl font-black text-xs transition-all uppercase tracking-widest border border-teal-500/30 text-teal-400 bg-teal-500/10 hover:bg-teal-500/20 active:scale-[0.98]"
                          >
                            Watch Low-Latency Stream
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleToggleAlertState(matchKey)}
                            className={cn(
                              "w-full py-3 mt-6 rounded-xl font-black text-xs transition-all uppercase tracking-widest active:scale-[0.98]",
                              isAlertActive 
                                ? "bg-amber-500/25 border border-amber-500/40 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.1)]" 
                                : "bg-sky-500 text-on-primary-container hover:bg-sky-450 shadow-lg"
                            )}
                          >
                            {isAlertActive ? '✓ Alert Activated' : 'Set Event Alert'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
             </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
           <section className="glass-card rounded-3xl p-8 border border-white/5 bg-slate-900/20">
              <h3 className="text-xs font-black text-on-surface-variant uppercase tracking-[0.3em] mb-6">Saved Teams</h3>
              
              {savedTeamsList.length === 0 ? (
                <div className="p-6 text-center text-xs text-on-surface-variant border border-dashed border-white/10 rounded-2xl">
                  No saved teams yet. Click add below!
                </div>
              ) : (
                <div className="space-y-3">
                  {savedTeamsList.map((teamName, i) => (
                    <div 
                      key={i} 
                      className="flex items-center justify-between p-3.5 bg-surface-container/50 rounded-2xl border border-white/5 hover:border-sky-500/30 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center border border-white/10 group-hover:border-sky-500/40">
                            <Shield className="w-5 h-5 text-sky-400" />
                         </div>
                         <span className="text-sm font-bold text-white leading-none">{teamName}</span>
                      </div>
                      <button 
                        onClick={() => handleRemoveTeam(teamName)}
                        className="p-1 text-on-surface-variant hover:text-red-400 transition-colors"
                        title="Delete team"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button 
                onClick={() => setShowAddTeamModal(true)}
                className="w-full mt-6 py-3 border border-dashed border-sky-500/20 rounded-xl text-xs font-bold text-sky-450 hover:text-sky-400 flex items-center justify-center gap-2 hover:bg-sky-500/5 transition-all"
              >
                 <Plus className="w-4 h-4" />
                 Add More Teams
              </button>
           </section>

           <section className="glass-card rounded-3xl p-8 border border-white/5 bg-slate-900/20">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-xl font-bold flex items-center gap-3 text-white">
                   <Bell className="w-6 h-6 text-sky-400" />
                   Notifications
                 </h3>
                 {notificationLogs.length > 0 && (
                   <button 
                     onClick={handleClearNotifications}
                     className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:underline"
                   >
                     Clear
                   </button>
                 )}
              </div>
              
              {notificationLogs.length === 0 ? (
                <div className="py-12 text-center text-xs text-on-surface-variant space-y-2">
                  <Check className="w-8 h-8 text-emerald-400 mx-auto" />
                  <p className="font-bold">All Caught Up!</p>
                  <p className="opacity-60">You have checked every matching update.</p>
                </div>
              ) : (
                <div className="space-y-8 before:absolute before:left-[43px] before:top-24 before:bottom-12 before:w-[2px] before:bg-white/5 relative">
                   {notificationLogs.map((n) => (
                     <div key={n.id} className="flex gap-6 relative group">
                        <button 
                          onClick={() => handleDismissNotification(n.id, n.title)}
                          className={cn(
                            "w-8 h-8 rounded-full bg-background border-2 z-10 flex items-center justify-center flex-shrink-0 transition-transform active:scale-90",
                            n.mType === 'primary' ? "border-sky-455 text-sky-455" : "border-teal-455 text-teal-455"
                          )}
                          title="Dismiss notification"
                        >
                           {n.mType === 'primary' ? <span className="w-2 h-2 rounded-full bg-sky-400 live-pulse animate-ping"></span> : <Check className="w-3.5 h-3.5" />}
                        </button>
                        <div className="space-y-1 flex-1">
                           <div className="flex justify-between items-center mb-1">
                              <span className={cn("text-[10px] font-black uppercase tracking-widest", n.mType === 'primary' ? "text-sky-400" : "text-teal-400")}>{n.label}</span>
                              <span className="text-[10px] text-on-surface-variant font-bold opacity-40">{n.time}</span>
                           </div>
                           <h4 className="font-bold text-sm text-white">{n.title}</h4>
                           <p className="text-xs text-on-surface-variant leading-relaxed">{n.sub}</p>
                        </div>
                     </div>
                   ))}
                </div>
              )}
              
              {notificationLogs.length > 0 && (
                <button 
                  onClick={handleClearNotifications}
                  className="w-full mt-10 py-4 bg-surface-container-high rounded-xl border border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface hover:text-sky-450 hover:bg-white/5 transition-all"
                >
                  Clear Logs History
                </button>
              )}
           </section>
        </aside>
      </div>

      {/* Connection simulator buffer overlay */}
      <AnimatePresence>
        {connectingLiveMatch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-6 text-center"
          >
            <div className="space-y-6 max-w-sm">
              <div className="relative w-16 h-16 mx-auto">
                <div className="w-16 h-16 rounded-full border-4 border-sky-500/20 border-t-sky-400 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Film className="w-6 h-6 text-sky-400 animate-pulse animate-bounce" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Connecting satellitary broadcast feeds...</h3>
                <p className="text-xs text-on-surface-variant mt-2">Locking dual regional coverage decoders for <span className="font-bold text-sky-450 block mt-1">{connectingLiveMatch}</span></p>
                <button
                  onClick={() => setConnectingLiveMatch(null)}
                  className="mt-6 px-4 py-2 border border-white/10 hover:bg-white/5 rounded-xl text-xs text-on-surface-variant font-bold transition-all"
                >
                  Cancel Connect
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Team builder Form Modal */}
      <AnimatePresence>
        {showAddTeamModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-surface-container border border-sky-400/25 max-w-md w-full rounded-[2rem] p-8 relative"
            >
              <button
                type="button"
                onClick={() => setShowAddTeamModal(false)}
                className="absolute top-6 right-6 p-1.5 hover:bg-white/10 rounded-full transition-all text-on-surface-variant"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-2xl font-black text-white mb-2">Track New Team</h3>
              <p className="text-xs text-on-surface-variant mb-6">Add teams to your watchlist registry to custom rank dynamic AI Sports digests tonight.</p>

              <form onSubmit={handleAddNewTeam} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-[10px] text-on-surface-variant uppercase font-black tracking-wider">Team Title</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                      placeholder="e.g. Real Madrid, Warriors, Red Bull Racing"
                      className="w-full bg-background/50 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sky-400 text-sky-300 font-bold"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddTeamModal(false)}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-on-surface hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-sky-500 hover:bg-sky-450 rounded-xl text-xs font-bold text-on-primary-container tracking-wider uppercase transition-all shadow-lg shadow-sky-550/10"
                  >
                    Add Tracked Team
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Interactive Toast feedback */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 bg-sky-950/90 text-sky-200 border border-sky-500/30 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3"
          >
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
            <span className="text-xs font-black">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
