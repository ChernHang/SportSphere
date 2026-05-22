import React, { useState, useEffect } from 'react';
import { Radio, Users, Trophy, Star, Sparkles, Plus, Bell, Play, Shield, X, Info, Clock, Check, ExternalLink, Trash2, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { geminiService } from '../services/geminiService';
import { Recommendation, UserPreferences } from '../types';
import { mockMatches } from '../data/mockMatches';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import regeneratedImage1779435998636 from '../assets/images/regenerated_image_1779435998636.jpg';

export default function Dashboard() {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [watchlistFlags, setWatchlistFlags] = useState<Record<string, boolean>>({});
  const [reminderFlags, setReminderFlags] = useState<Record<string, boolean>>({});
  
  // Dynamic user-triggered systems
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isConnectingStream, setIsConnectingStream] = useState<string | null>(null);
  const [showTransferReport, setShowTransferReport] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Clickable Bento Stats Modals State
  const [showLiveMatchesModal, setShowLiveMatchesModal] = useState(false);
  const [showYourTeamsModal, setShowYourTeamsModal] = useState(false);
  const [showMajorFinalsModal, setShowMajorFinalsModal] = useState(false);
  const [showWatchlistModal, setShowWatchlistModal] = useState(false);
  
  const [savedTeamsList, setSavedTeamsList] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sportsphere_watchlist_teams');
      return saved ? JSON.parse(saved) : ['Manchester City', 'Golden State Warriors'];
    } catch {
      return ['Manchester City', 'Golden State Warriors'];
    }
  });

  const [newTeamName, setNewTeamName] = useState('');

  const handleAddTeamInline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) {
      showToast("Please enter a valid team name.");
      return;
    }
    const trimmed = newTeamName.trim();
    if (savedTeamsList.some(t => t.toLowerCase() === trimmed.toLowerCase())) {
      showToast(`"${trimmed}" is already tracked.`);
      return;
    }
    const updated = [...savedTeamsList, trimmed];
    setSavedTeamsList(updated);
    localStorage.setItem('sportsphere_watchlist_teams', JSON.stringify(updated));
    showToast(`Added "${trimmed}" to Saved Teams!`);
    setNewTeamName('');
  };

  const handleRemoveTeamInline = (nameToRemove: string) => {
    const updated = savedTeamsList.filter(name => name !== nameToRemove);
    setSavedTeamsList(updated);
    localStorage.setItem('sportsphere_watchlist_teams', JSON.stringify(updated));
    showToast(`Removed "${nameToRemove}" from Saved Teams.`);
  };
  
  // Real-time Favorite/Watchlist items synced in localStorage with MatchDetails.tsx & Watchlist.tsx
  const [favoriteMatches, setFavoriteMatches] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('favorite_matches') || '[]');
    } catch {
      return [];
    }
  });

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const toggleFavoriteMatch = (matchId: string, matchName?: string) => {
    let updated;
    const displayName = matchName || `Match #${matchId}`;
    if (favoriteMatches.includes(matchId)) {
      updated = favoriteMatches.filter(id => id !== matchId);
      showToast(`Removed "${displayName}" from your Watched Matches`);
    } else {
      updated = [...favoriteMatches, matchId];
      showToast(`Pinned "${displayName}" to your Watched Matches!`);
    }
    setFavoriteMatches(updated);
    localStorage.setItem('favorite_matches', JSON.stringify(updated));
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

  const simulateStreamClick = (title: string) => {
    setIsConnectingStream(title);
    showToast(`Establishing secure low-latency broadcast hook for ${title}...`);
    setTimeout(() => {
      setIsConnectingStream(null);
      showToast(`Connected successfully! Redirecting you to the live broadcast...`);
      const targetUrl = getStreamUrlForMatch(title);
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }, 2000);
  };

  useEffect(() => {
    // Load recommendations from cache if under 6 hours old
    const cachedData = localStorage.getItem('sportsphere_game_recs');
    if (cachedData) {
      try {
        const { data, timestamp } = JSON.parse(cachedData);
        // 6 hours in milliseconds = 6 * 1000 * 60 * 60
        if (Date.now() - timestamp < 21600000) {
          setRecommendations(data.recommendations || data);
        }
      } catch (err) {
        console.error("Cache parsing issue:", err);
      }
    }
  }, []);

  const fetchRecommendations = async () => {
    setLoadingAi(true);
    try {
      const userPrefs: UserPreferences = {
        favouriteSports: ['Football', 'Basketball', 'f1'],
        favouriteTeams: ['Real Madrid', 'Lakers', 'Hamilton']
      };
      const response = await geminiService.recommendGames(userPrefs, mockMatches);
      const data = response.recommendations || response;
      setRecommendations(data as any);
      // Cache recommendations with timestamp
      localStorage.setItem('sportsphere_game_recs', JSON.stringify({
        data,
        timestamp: Date.now()
      }));
      showToast("Fresh recommendations compiled successfully!");
    } catch (error) {
      console.error(error);
      showToast("Unable to compile recommendations right now.");
    } finally {
      setLoadingAi(false);
    }
  };

  const toggleWatchlist = (matchName: string) => {
    setWatchlistFlags(prev => {
      const updated = { ...prev, [matchName]: !prev[matchName] };
      if (updated[matchName]) {
        showToast(`Pinned "${matchName}" to watch priorities`);
      } else {
        showToast(`Unpinned "${matchName}"`);
      }
      return updated;
    });
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
      window.dispatchEvent(new Event('sportsphere_notifications_updated'));
    } catch (e) {
      console.error(e);
    }
  };

  const toggleReminder = (matchName: string) => {
    setReminderFlags(prev => {
      const updated = { ...prev, [matchName]: !prev[matchName] };
      if (updated[matchName]) {
        showToast(`Subscribed! Interactive Alert set for "${matchName}"`);
        addDynamicNotification(
          'MATCH REMINDER ALERT',
          `You have set an active reminder for kickoff of: ${matchName}!`,
          'REMINDER SET'
        );
      } else {
        showToast(`Alert disabled for "${matchName}"`);
      }
      return updated;
    });
  };

  // Dynamically filter mock matches list based on categories
  const filteredMatches = mockMatches.filter(match => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Football') return match.genre === 'football';
    if (activeCategory === 'Basketball') return match.genre === 'basketball';
    if (activeCategory === 'Formula 1') return match.genre === 'f1';
    if (activeCategory === 'Tennis') return match.genre === 'tennis';
    if (activeCategory === 'eSports') return match.genre === 'esports';
    return false;
  });

  return (
    <div className="space-y-8 pb-32">
      {/* Dynamic Toast System */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 bg-sky-950/90 text-sky-200 border border-sky-500/30 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3"
          >
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
            <span className="text-xs font-bold">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stream Buffer Loading Overlay */}
      <AnimatePresence>
        {isConnectingStream && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 text-center"
          >
            <div className="space-y-6 max-w-sm">
              <div className="relative w-16 h-16 mx-auto">
                <div className="w-16 h-16 rounded-full border-4 border-sky-500/20 border-t-sky-400 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="w-6 h-6 text-sky-400 fill-sky-400 animate-pulse" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Stream Syncing...</h3>
                <p className="text-xs text-on-surface-variant mt-2">Connecting to low-latency satellites to prepare streaming options for <span className="font-bold text-sky-450 block mt-1">{isConnectingStream}</span></p>
                <button
                  onClick={() => setIsConnectingStream(null)}
                  className="mt-6 px-4 py-2 border border-white/10 hover:bg-white/5 rounded-xl text-xs text-on-surface-variant font-bold transition-all"
                >
                  Cancel Connection
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bento Grid Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            label: 'Live Matches', 
            value: '24', 
            icon: Radio, 
            sub: 'Active tournaments',
            action: () => {
              setShowLiveMatchesModal(true);
              showToast("Opening Live Matches Grid...");
            }
          },
          { 
            label: 'Your Teams', 
            value: String(savedTeamsList.length), 
            icon: Users, 
            sub: 'Playing today',
            action: () => {
              setShowYourTeamsModal(true);
              showToast("Opening Your Managed Teams...");
            }
          },
          { 
            label: 'Major Finals', 
            value: '02', 
            icon: Trophy, 
            sub: 'Critical overview', 
            alert: true,
            action: () => {
              setShowMajorFinalsModal(true);
              showToast("Opening Championship Finals...");
            }
          },
          { 
            label: 'Watchlist', 
            value: String(favoriteMatches.length), 
            icon: Star, 
            sub: 'Pinned event queue', 
            fill: true,
            action: () => {
              setShowWatchlistModal(true);
              showToast("Opening Watchlist Panel...");
            }
          },
        ].map((stat, i) => (
          <button 
            key={i} 
            onClick={stat.action}
            className="glass-card p-6 rounded-2xl flex flex-col justify-between text-left cursor-pointer hover:border-sky-500/35 hover:bg-sky-500/[0.02] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 w-full group outline-none focus:ring-1 focus:ring-sky-500/30"
          >
            <div className="flex justify-between items-start w-full">
              <span className="text-on-surface-variant text-xs font-bold uppercase tracking-widest group-hover:text-white transition-colors">{stat.label}</span>
              <stat.icon className="text-sky-400 w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill={stat.fill ? "currentColor" : "none"} />
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className={stat.alert ? "text-3xl font-bold flex items-center gap-2 text-white" : "text-3xl font-bold text-primary group-hover:text-sky-400 transition-colors"}>
                {stat.value}
              </span>
              {stat.alert && <span className="bg-secondary-container text-on-secondary-container text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Critical</span>}
            </div>
            <p className="text-xs text-on-surface-variant mt-1">{stat.sub}</p>
          </button>
        ))}
      </section>

      {/* Categories */}
      <nav className="flex items-center gap-4 overflow-x-auto pb-2 no-scrollbar ">
        {['All', 'Football', 'Basketball', 'Formula 1', 'Tennis', 'eSports'].map((cat, i) => (
          <button 
            key={i} 
            onClick={() => {
              setActiveCategory(cat);
              showToast(`Filtered feed by: ${cat}`);
            }}
            className={cn(
              "flex-shrink-0 px-6 py-2 rounded-full font-bold transition-all text-xs",
              activeCategory === cat 
                ? "bg-primary text-on-primary-container shadow-[0_0_15px_rgba(56,189,248,0.35)]" 
                : "bg-surface-container-high text-on-surface-variant hover:text-primary hover:bg-white/5"
            )}
          >
            {cat}
          </button>
        ))}
      </nav>

      {/* Recommendations engine */}
      <section className="border border-sky-500/20 rounded-3xl p-6 bg-slate-950/20 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Sparkles className="w-32 h-32 text-sky-400" />
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2 text-on-surface">
              <Sparkles className="w-5 h-5 text-sky-450 animate-bounce" />
              AI Smart Match Discovery
              <span className="bg-sky-500/10 text-sky-400 border border-sky-500/25 rounded-md px-2 py-0.5 text-[9px] font-bold">
                6H CACHED
              </span>
            </h3>
            <p className="text-xs text-on-surface-variant mt-1">Personalized game matching based on your sports profile</p>
          </div>
          <button 
            onClick={fetchRecommendations}
            disabled={loadingAi}
            className="bg-primary/10 border border-primary/30 text-primary hover:bg-primary/25 text-xs font-bold px-5 py-2.5 rounded-xl transition-all disabled:opacity-50"
          >
            {loadingAi ? 'Analyzing Lines...' : 'Recommend Games Tonight'}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {loadingAi && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-8 rounded-2xl flex flex-col items-center justify-center text-center space-y-4"
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-4 border-sky-500/20 border-t-sky-400 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-sky-400 animate-pulse" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-sky-400 text-sm">Generating Recommendations...</p>
                <p className="text-xs text-on-surface-variant">Cross-referencing your teams, standings, and global broadcasts...</p>
              </div>
            </motion.div>
          )}

          {!recommendations && !loadingAi && (
            <div className="py-12 text-center text-on-surface-variant space-y-3 relative z-10 bg-slate-900/10 rounded-2xl border border-white/5">
              <Sparkles className="w-8 h-8 text-sky-500/40 mx-auto" />
              <p className="text-sm font-medium">Click "Recommend Games Tonight" to generate insights</p>
            </div>
          )}

          {recommendations && !loadingAi && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10"
            >
              {recommendations.map((rec, i) => {
                const hypeColor = rec.hypeLevel >= 8 ? "bg-emerald-500" : rec.hypeLevel >= 5 ? "bg-sky-400" : "bg-amber-400";
                return (
                  <div key={i} className="glass-card p-5 rounded-2xl group transition-all duration-300 relative border border-white/5 hover:border-sky-500/30 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <h4 className="font-bold text-base leading-snug group-hover:text-sky-400 transition-colors">{rec.match}</h4>
                        <div className="flex flex-col items-end shrink-0">
                          <span className="text-[9px] text-sky-400 font-bold uppercase tracking-wider mb-1">HYPE {rec.hypeLevel * 10}%</span>
                          <div className="w-16 h-1.5 bg-surface-container rounded-full overflow-hidden">
                            <div className={`h-full ${hypeColor} rounded-full`} style={{ width: `${rec.hypeLevel * 10}%` }}></div>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-on-surface-variant mb-6 min-h-[50px] leading-relaxed">
                        {rec.reason}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => simulateStreamClick(rec.match)}
                        className="flex-1 bg-primary hover:bg-opacity-95 text-on-primary text-xs font-bold py-2.5 rounded-xl active:scale-95 transition-all"
                      >
                        Watch Live
                      </button>
                      <button 
                        onClick={() => toggleReminder(rec.match)}
                        className={cn(
                          "px-3 border text-xs rounded-xl active:scale-95 transition-all flex items-center justify-center",
                          reminderFlags[rec.match] 
                            ? "bg-amber-500/20 border-amber-500/40 text-amber-400" 
                            : "border-primary/20 text-primary hover:bg-primary/10"
                        )}
                        title={reminderFlags[rec.match] ? "Reminder set!" : "Set reminder"}
                      >
                        <Bell className={cn("w-4 h-4", reminderFlags[rec.match] && "fill-amber-400")} />
                      </button>
                      <button 
                        onClick={() => toggleWatchlist(rec.match)}
                        className={cn(
                          "px-3 border text-xs rounded-xl active:scale-95 transition-all flex items-center justify-center",
                          watchlistFlags[rec.match] 
                            ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400" 
                            : "border-white/10 text-on-surface-variant hover:bg-white/5"
                        )}
                        title={watchlistFlags[rec.match] ? "In Watchlist" : "Pin to watchlist"}
                      >
                        <Star className={cn("w-4 h-4", watchlistFlags[rec.match] && "fill-emerald-400 text-emerald-400")} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Main Match Cards */}
      <h3 className="text-xl font-bold text-on-surface flex items-center gap-2">
        <Trophy className="w-5 h-5 text-sky-400" />
        {activeCategory === 'All' ? 'Tonight\'s Major Matchups' : `${activeCategory} Events`}
      </h3>
      
      <AnimatePresence mode="wait">
        {filteredMatches.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-12 text-center rounded-3xl bg-surface-container/50 border border-white/5 space-y-4"
          >
            <Clock className="w-12 h-12 text-on-surface-variant/40 mx-auto" />
            <div className="space-y-1">
              <p className="text-base font-bold text-on-surface">No Live Scheduled {activeCategory} Matches</p>
              <p className="text-xs text-on-surface-variant max-w-md mx-auto">There are no upcoming or live events registered for this category right now. Check our broadcast schedule registry for upcoming dates.</p>
            </div>
            <button 
              onClick={() => navigate('/broadcast')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary-container font-bold text-xs rounded-xl hover:scale-102 transition-all shadow-lg"
            >
              Browse Broadcasters Matrix
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ) : (
          <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredMatches.map((match) => {
              const isFavorited = favoriteMatches.includes(match.id);
              return (
                <article key={match.id} className="glass-card rounded-2xl overflow-hidden group border border-white/5 flex flex-col justify-between">
                  <div className="relative h-48 w-full overflow-hidden">
                    <img 
                      alt={`${match.teamA} vs ${match.teamB}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      src={match.banner || (match.genre === 'f1' 
                        ? "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=600" 
                        : match.genre === 'basketball'
                          ? "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=600"
                          : "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800")}
                      referrerPolicy="no-referrer"
                    />
                    {match.startTime === 'LIVE' && (
                      <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2 py-1 bg-red-550/90 border border-red-500/20 backdrop-blur-md rounded-lg text-white font-bold text-[10px]">
                        <span className="w-2 h-2 rounded-full bg-red-400 live-pulse animate-ping"></span>
                        LIVE
                      </div>
                    )}
                    <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] text-on-surface font-bold uppercase tracking-widest border border-white/10">
                      {match.tournament}
                    </div>
                  </div>
                  
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex flex-col items-center gap-2 flex-1">
                        <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center border border-white/5 overflow-hidden group-hover:border-primary/20 transition-all p-1">
                          {match.logoA ? (
                            <img 
                              src={match.logoA} 
                              alt={match.teamA} 
                              className={cn(
                                "w-full h-full",
                                match.isIndividual ? "object-cover rounded-full" : "object-contain p-1 bg-white/[0.05] rounded-lg"
                              )} 
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <Shield className="w-6 h-6 text-sky-400" />
                          )}
                        </div>
                        <span className="font-bold text-sm text-center line-clamp-1">{match.teamA}</span>
                      </div>
                      
                      <div className="flex flex-col items-center px-4">
                        <span className="text-2xl font-black text-white">{match.score}</span>
                        <span className="text-[10px] uppercase font-bold text-on-surface-variant">{match.startTime}</span>
                      </div>

                      <div className="flex flex-col items-center gap-2 flex-1">
                        <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center border border-white/5 overflow-hidden group-hover:border-primary/20 transition-all p-1">
                          {match.logoB ? (
                            <img 
                              src={match.logoB} 
                              alt={match.teamB} 
                              className={cn(
                                "w-full h-full",
                                match.isIndividual ? "object-cover rounded-full" : "object-contain p-1 bg-white/[0.05] rounded-lg"
                              )} 
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <Shield className="w-6 h-6 text-sky-400" />
                          )}
                        </div>
                        <span className="font-bold text-sm text-center line-clamp-1">{match.teamB}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link 
                        to={`/match/${match.id}`}
                        className="flex-1 bg-surface-container-high border border-white/5 hover:border-sky-500/20 text-on-surface hover:text-sky-450 text-center font-bold py-2 rounded-xl active:scale-95 transition-all text-xs flex items-center justify-center gap-1.5"
                      >
                        Match Insights
                      </Link>
                      <button 
                        onClick={() => toggleFavoriteMatch(match.id, `${match.teamA} vs ${match.teamB}`)}
                        className={cn(
                          "w-10 h-9 flex items-center justify-center border rounded-xl active:scale-95 transition-all",
                          isFavorited 
                            ? "bg-amber-500/10 border-amber-500/30 text-amber-400" 
                            : "border-white/5 hover:border-white/15 text-on-surface-variant hover:text-amber-400"
                        )}
                        title={isFavorited ? "Remove from Watchlist" : "Pin to Watchlist"}
                      >
                        <Star className={cn("w-4 h-4", isFavorited && "fill-amber-400")} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </motion.section>
        )}
      </AnimatePresence>

      {/* Watchlist Insights */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">
        <div className="lg:col-span-8 glass-card rounded-3xl p-6 flex flex-col md:flex-row gap-6 items-center border border-white/5">
          <div className="flex-1">
            <span className="text-secondary font-bold uppercase text-[10px] tracking-[0.2em] mb-2 block">Breaking News</span>
            <h1 className="text-2xl font-black text-white leading-tight mb-2">Transfer Window Closes: Final Hour Highlights</h1>
            <p className="text-on-surface-variant mb-6 text-sm">See all the last-minute deals that happened in the final 60 minutes of the summer window. Expert analysis and team grades included.</p>
            <button 
              onClick={() => {
                setShowTransferReport(true);
                showToast("Opening Deadline Day Report...");
              }}
              className="px-6 py-2.5 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-400/20 text-sky-450 hover:text-sky-400 rounded-xl font-bold transition-all text-xs"
            >
              Read Full Report
            </button>
          </div>
          <div className="w-full md:w-64 h-48 rounded-2xl overflow-hidden border border-white/10 shrink-0">
            <img 
              alt="Sports News" 
              className="w-full h-full object-cover hover:scale-103 transition-transform duration-500" 
              src={regeneratedImage1779435998636} 
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        <div className="lg:col-span-4 glass-card rounded-3xl p-6 bg-sky-500/5 border border-sky-500/15">
          <h3 className="text-xl font-bold text-sky-400 mb-6 flex items-center gap-2">
            <Star className="w-5 h-5 text-sky-400" />
            Watchlist Insights
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-surface-container flex items-center justify-center">
                <Radio className="w-5 h-5 text-sky-400" />
              </div>
              <div>
                <p className="font-bold text-sm">UFC 300: Main Event</p>
                <p className="text-xs text-on-surface-variant">Added by 12.5k fans today</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-surface-container flex items-center justify-center">
                <Bell className="w-5 h-5 text-sky-400" />
              </div>
              <div>
                <p className="font-bold text-sm">Wimbledon Quarter Finals</p>
                <p className="text-xs text-on-surface-variant">Alert set for 14:00 GMT</p>
              </div>
            </div>
          </div>
          <button 
            onClick={() => navigate('/watchlist')}
            className="w-full mt-8 py-3 bg-primary text-on-primary-container font-bold rounded-xl active:scale-95 hover:shadow-lg transition-all text-xs uppercase tracking-wider"
          >
            View All Watchlist
          </button>
        </div>
      </section>

      {/* Interactive Transfer Window Report Popup Drawer */}
      <AnimatePresence>
        {showTransferReport && (
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
              className="bg-surface-container border border-sky-500/20 max-w-2xl w-full rounded-[2.5rem] p-8 relative flex flex-col max-h-[85vh] overflow-hidden"
            >
              <button
                onClick={() => setShowTransferReport(false)}
                className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-all"
              >
                <X className="w-5 h-5 text-on-surface" />
              </button>

              <div className="space-y-2 mb-6">
                <span className="bg-sky-500/15 text-sky-400 border border-sky-400/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                  EXCLUSIVE GRID INSIGHTS
                </span>
                <h2 className="text-3xl font-black text-white">Transfer Window Deadline Recap</h2>
                <p className="text-xs text-on-surface-variant leading-relaxed">Reviewing the multi-million dollar deals finalized in the final hour of the transfer window.</p>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                <div className="bg-black/30 p-5 rounded-2xl space-y-4 border border-white/5">
                  <h3 className="text-xs uppercase font-black text-sky-400 tracking-wider flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Finalized Key Transfers
                  </h3>
                  
                  <div className="space-y-3.5">
                    {[
                      { player: 'Kylian Mbappé', from: 'Paris SG', to: 'Real Madrid', price: 'Free Transfer', rating: 'A+' },
                      { player: 'Declan Rice', from: 'West Ham', to: 'Arsenal', price: '£105.0M', rating: 'A' },
                      { player: 'Jude Bellingham', from: 'Dortmund', to: 'Real Madrid', price: '€103.0M', rating: 'A+' },
                      { player: 'Harry Kane', from: 'Tottenham', to: 'Bayern Munich', price: '€100.0M', rating: 'A-' }
                    ].map((deal, index) => (
                      <div key={index} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                        <div className="space-y-0.5">
                          <p className="font-bold text-xs text-white">{deal.player}</p>
                          <p className="text-[10px] text-on-surface-variant">{deal.from} ➔ <span className="font-bold text-sky-400">{deal.to}</span></p>
                        </div>
                        <div className="text-right space-y-0.5">
                          <p className="font-mono text-xs font-bold text-sky-450">{deal.price}</p>
                          <span className="inline-block bg-sky-550/15 text-sky-405 border border-sky-455/10 rounded px-1.5 py-0.2 text-[9px] font-black">{deal.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xs uppercase font-black text-on-surface-variant tracking-wider flex items-center gap-2">
                    <Info className="w-4 h-4 text-sky-450" /> Spending Dynamics (Estimated Total)
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-center">
                      <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">La Liga Spend</p>
                      <h4 className="text-2xl font-black text-sky-400 mt-1">€485M</h4>
                      <div className="w-full bg-white/5 h-1 rounded-full mt-2 overflow-hidden">
                        <div className="bg-sky-400 h-full w-[80%] rounded-full"></div>
                      </div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-center">
                      <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">Premier League Spend</p>
                      <h4 className="text-2xl font-black text-sky-400 mt-1">£1.2B</h4>
                      <div className="w-full bg-white/5 h-1 rounded-full mt-2 overflow-hidden">
                        <div className="bg-sky-400 h-full w-[95%] rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-white/5 flex gap-3">
                <button
                  onClick={() => {
                    setShowTransferReport(false);
                    navigate('/broadcast');
                  }}
                  className="flex-1 py-3 bg-sky-500 text-on-primary-container font-bold rounded-xl active:scale-95 text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  Find Live Stream Outlets
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setShowTransferReport(false)}
                  className="px-6 py-3 border border-white/10 hover:bg-white/5 text-on-surface font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live Matches Modal */}
      <AnimatePresence>
        {showLiveMatchesModal && (
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
              className="bg-surface-container border border-sky-400/25 max-w-xl w-full rounded-[2rem] p-8 relative flex flex-col max-h-[85vh] overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setShowLiveMatchesModal(false)}
                className="absolute top-6 right-6 p-1.5 hover:bg-white/10 rounded-full transition-all text-on-surface-variant"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-2 mb-6">
                <span className="bg-sky-500/15 text-sky-400 border border-sky-400/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-block">
                  LIVE STREAM FEED STATUS
                </span>
                <h3 className="text-2xl font-black text-white">Live Broadcast Streaming Queue</h3>
                <p className="text-xs text-on-surface-variant">Real-time dynamic coverage pipelines active across the globe.</p>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                {[
                  { teamA: 'Real Madrid', teamB: 'Man City', tournament: 'Champions League', score: '2 - 1', detail: 'Min 65’ - Fierce Champions League battle', genre: 'football' },
                  { teamA: 'M. Verstappen', teamB: 'L. Hamilton', tournament: 'Monaco GP', score: 'LAP 42/78', detail: 'Formula 1 pinnacle main race action', genre: 'f1' },
                  { teamA: 'S. Tsitsipas', teamB: 'C. Alcaraz', tournament: 'Wimbledon Cup', score: '6-4, 5-7, 2-1', detail: 'Court 1 - High level quarterfinals', genre: 'tennis' },
                  { teamA: 'London Ravens', teamB: 'Tokyo Shōguns', tournament: 'Call of Duty League', score: '2 - 0', detail: 'eSports championship Grand bracket', genre: 'esports' }
                ].map((event, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/5 p-4 rounded-xl border border-white/5 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 live-pulse animate-ping"></span>
                        <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider">{event.tournament}</span>
                      </div>
                      <p className="font-bold text-sm text-white">{event.teamA} <span className="text-sky-400 font-mono text-xs">{event.score}</span> {event.teamB}</p>
                      <p className="text-[10px] text-on-surface-variant">{event.detail}</p>
                    </div>
                    <button 
                      onClick={() => {
                        setShowLiveMatchesModal(false);
                        simulateStreamClick(`${event.teamA} vs ${event.teamB}`);
                      }}
                      className="self-stretch sm:self-auto bg-sky-500 hover:bg-sky-450 text-on-primary-container px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1 shrink-0"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      Stream Feed
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowLiveMatchesModal(false);
                    navigate('/schedule');
                  }}
                  className="flex-1 py-3 bg-surface-container-high border border-white/10 text-on-surface font-bold rounded-xl text-xs uppercase tracking-wider transition-all hover:bg-white/5 flex items-center justify-center gap-1.5"
                >
                  <Calendar className="w-4 h-4" />
                  View Full Sports Schedule
                </button>
                <button
                  type="button"
                  onClick={() => setShowLiveMatchesModal(false)}
                  className="px-6 py-3 border border-white/10 hover:bg-white/5 text-on-surface font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Your Teams Modal */}
      <AnimatePresence>
        {showYourTeamsModal && (
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
              className="bg-surface-container border border-sky-400/25 max-w-md w-full rounded-[2rem] p-8 relative flex flex-col max-h-[85vh] overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setShowYourTeamsModal(false)}
                className="absolute top-6 right-6 p-1.5 hover:bg-white/10 rounded-full transition-all text-on-surface-variant"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-2 mb-6">
                <span className="bg-sky-500/15 text-sky-400 border border-sky-400/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-block">
                  DYNAMIC CLUBS MANAGER
                </span>
                <h3 className="text-2xl font-black text-white">Your Tracked Clubs & Athletes</h3>
                <p className="text-xs text-on-surface-variant">Manage and pin teams to compile custom AI briefings night after night.</p>
              </div>

              {/* Add New Team Inline Form */}
              <form onSubmit={handleAddTeamInline} className="flex gap-2 mb-6">
                <input
                  type="text"
                  required
                  placeholder="e.g. Manchester City, Lakers, Red Bull..."
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500 placeholder:text-on-surface-variant/40"
                />
                <button
                  type="submit"
                  className="bg-sky-500/20 hover:bg-sky-500/25 text-sky-400 border border-sky-400/30 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" /> Track Club
                </button>
              </form>

              <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                {savedTeamsList.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-white/5 rounded-2xl">
                    <p className="text-xs text-on-surface-variant">No tracked teams found. Add your favorite club above!</p>
                  </div>
                ) : (
                  savedTeamsList.map((teamName, i) => {
                    // Match playing simulation
                    const isPlayingToday = mockMatches.some(
                      m => m.teamA.toLowerCase() === teamName.toLowerCase() || m.teamB.toLowerCase() === teamName.toLowerCase()
                    );
                    return (
                      <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5 hover:border-sky-500/15 transition-all">
                        <div className="space-y-0.5">
                          <p className="font-bold text-sm text-white">{teamName}</p>
                          <p className="text-[10px] text-on-surface-variant flex items-center gap-1.5">
                            {isPlayingToday ? (
                              <>
                                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                                <span className="text-emerald-400 font-bold uppercase">Playing Today</span>
                              </>
                            ) : (
                              <>
                                <span className="w-1.5 h-1.5 bg-on-surface-variant/40 rounded-full"></span>
                                <span>No Active Match Today</span>
                              </>
                            )}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveTeamInline(teamName)}
                          className="p-2 text-on-surface-variant hover:text-red-400 transition-colors cursor-pointer"
                          title={`Stop tracking ${teamName}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowYourTeamsModal(false);
                    navigate('/watchlist');
                  }}
                  className="flex-1 py-3 bg-surface-container-high border border-white/10 text-on-surface font-bold rounded-xl text-xs uppercase tracking-wider transition-all hover:bg-white/5 text-center text-white"
                >
                  Manage On Watchlist Hub
                </button>
                <button
                  type="button"
                  onClick={() => setShowYourTeamsModal(false)}
                  className="px-6 py-3 border border-white/10 hover:bg-white/5 text-on-surface font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Major Finals Modal */}
      <AnimatePresence>
        {showMajorFinalsModal && (
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
              className="bg-surface-container border border-sky-400/25 max-w-xl w-full rounded-[2rem] p-8 relative flex flex-col max-h-[85vh] overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setShowMajorFinalsModal(false)}
                className="absolute top-6 right-6 p-1.5 hover:bg-white/10 rounded-full transition-all text-on-surface-variant"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-2 mb-6">
                <span className="bg-amber-500/15 text-amber-400 border border-amber-400/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-block">
                  CHAMPIONSHIP OVERVIEW
                </span>
                <h3 className="text-2xl font-black text-white">Championship Finals Spotlight</h3>
                <p className="text-xs text-on-surface-variant">The pinnacle events of the season where history is written.</p>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                {[
                  { title: 'Champions League Final', tA: 'Real Madrid', tB: 'Borussia Dortmund', time: 'Tomorrow at 20:00', venue: 'Wembley Stadium, London', active: false, alertKey: 'uCL_Final' },
                  { title: 'NBA Finals Game 7', tA: 'Golden State Warriors', tB: 'Boston Celtics', time: 'LIVE NOW - Q3 04:12', venue: 'TD Garden, Boston', active: true, alertKey: 'nba_Final' }
                ].map((final, idx) => {
                  const isChecked = !!reminderFlags[final.alertKey || final.title];
                  return (
                    <div key={idx} className="bg-white/5 p-5 rounded-2xl border border-white/5 space-y-4 hover:border-amber-500/20 transition-all">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="inline-block bg-amber-500/10 text-amber-400 border border-amber-500/25 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded">
                            🏆 HIGH STAKES
                          </span>
                          <h4 className="font-bold text-base text-white mt-1.5">{final.title}</h4>
                        </div>
                        {final.active ? (
                          <span className="bg-red-500/15 text-red-400 border border-red-500/20 text-[10px] px-2 py-0.5 rounded-full font-black animate-pulse uppercase tracking-wider">
                            ACTIVE LIVE
                          </span>
                        ) : (
                          <span className="bg-white/5 text-on-surface-variant text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                            UPCOMING
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between bg-black/25 p-3 rounded-xl border border-white/5">
                        <div className="text-center flex-1">
                          <p className="font-bold text-xs text-white line-clamp-1">{final.tA}</p>
                          <p className="text-[9px] text-on-surface-variant uppercase mt-0.5">Contender</p>
                        </div>
                        <div className="text-center font-black text-amber-400 text-xs px-2 shrink-0">VS</div>
                        <div className="text-center flex-1">
                          <p className="font-bold text-xs text-white line-clamp-1">{final.tB}</p>
                          <p className="text-[9px] text-on-surface-variant uppercase mt-0.5">Contender</p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-1">
                        <div className="space-y-0.5">
                          <p className="text-xs text-white font-bold">{final.time}</p>
                          <p className="text-[10px] text-on-surface-variant">{final.venue}</p>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto shrink-0">
                          {final.active ? (
                            <button
                              onClick={() => {
                                setShowMajorFinalsModal(false);
                                simulateStreamClick(`${final.tA} vs ${final.tB}`);
                              }}
                              className="flex-1 sm:flex-none py-2 px-4 bg-sky-500 hover:bg-sky-450 text-on-primary font-bold rounded-lg text-[10px] tracking-wider uppercase transition-all flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Play className="w-3 h-3 fill-current" />
                              Tune In
                            </button>
                          ) : (
                            <button
                              onClick={() => toggleReminder(final.alertKey || final.title)}
                              className={cn(
                                "flex-1 sm:flex-none py-2 px-4 border rounded-lg text-[10px] tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 font-bold cursor-pointer",
                                isChecked 
                                  ? "bg-amber-500/20 border-amber-500/40 text-amber-300" 
                                  : "border-sky-500/30 text-sky-400 hover:bg-sky-500/10"
                              )}
                            >
                              <Bell className="w-3 h-3" />
                              {isChecked ? '✓ Alert Armed' : 'Set Event Alert'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowMajorFinalsModal(false)}
                  className="px-8 py-3 border border-white/10 hover:bg-white/5 text-on-surface font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Watchlist Modal */}
      <AnimatePresence>
        {showWatchlistModal && (
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
              className="bg-surface-container border border-sky-400/25 max-w-xl w-full rounded-[2rem] p-8 relative flex flex-col max-h-[85vh] overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setShowWatchlistModal(false)}
                className="absolute top-6 right-6 p-1.5 hover:bg-white/10 rounded-full transition-all text-on-surface-variant"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-2 mb-6">
                <span className="bg-sky-500/15 text-sky-400 border border-sky-400/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-block">
                  MONITORED MATCH QUEUE
                </span>
                <h3 className="text-2xl font-black text-white">Your Match Watchlist Queue</h3>
                <p className="text-xs text-on-surface-variant">Real-time status of matchups you have favorited or pinned.</p>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                {favoriteMatches.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl space-y-4">
                    <Star className="w-12 h-12 text-on-surface-variant/30 mx-auto" />
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-white">Your Watchlist is Empty</p>
                      <p className="text-xs text-on-surface-variant max-w-sm mx-auto">Click the Star icon on major matchups below to easily keep tabs on active scores and live streaming options.</p>
                    </div>
                  </div>
                ) : (
                  mockMatches
                    .filter(m => favoriteMatches.includes(m.id))
                    .map((match) => (
                      <div key={match.id} className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5 gap-4">
                        <div className="space-y-1">
                          <span className="text-[9px] bg-sky-500/10 text-sky-400 border border-sky-400/20 rounded px-1.5 py-0.2 select-none uppercase font-black tracking-widest">{match.tournament}</span>
                          <h4 className="font-bold text-sm text-white mt-1">{match.teamA} <span className="text-sky-455 font-mono">{match.score}</span> {match.teamB}</h4>
                          <p className="text-[10px] text-on-surface-variant">Broadcasting Status: <span className="font-semibold text-teal-400">{match.startTime === 'LIVE' ? 'LIVE NOW' : `Kicks off at ${match.startTime}`}</span></p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setShowWatchlistModal(false);
                              simulateStreamClick(`${match.teamA} vs ${match.teamB}`);
                            }}
                            className="bg-sky-500 hover:bg-sky-450 text-on-primary-container p-2 rounded-lg text-xs font-bold active:scale-90 transition-all cursor-pointer"
                            title="Stream Match"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                          </button>
                          <button
                            onClick={() => {
                              toggleFavoriteMatch(match.id, `${match.teamA} vs ${match.teamB}`);
                            }}
                            className="p-2 text-amber-400 hover:text-white transition-colors cursor-pointer"
                            title="Remove from Watchlist"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowWatchlistModal(false);
                    navigate('/watchlist');
                  }}
                  className="flex-1 py-3 bg-sky-500 text-on-primary-container font-black rounded-xl text-xs uppercase tracking-wider transition-all hover:bg-sky-450 text-center shadow-lg"
                >
                  Open Complete Watchlist Hub
                </button>
                <button
                  type="button"
                  onClick={() => setShowWatchlistModal(false)}
                  className="px-6 py-3 border border-white/10 hover:bg-white/5 text-on-surface font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
