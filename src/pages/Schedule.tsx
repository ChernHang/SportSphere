import { useState, useEffect } from 'react';
import { Calendar, Filter, Globe, ChevronRight, Zap, AlertTriangle, BookOpen, Sparkles, Bell, Plus, Star, TrendingUp, Radio } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { mockMatches } from '../data/mockMatches';
import { geminiService } from '../services/geminiService';
import { cn } from '../lib/utils';

export default function Schedule() {
  const { date } = useParams();
  const navigate = useNavigate();
  const [predictions, setPredictions] = useState<Record<string, any>>({});
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Synchronized States with localStorage & other dashboards
  const [favoriteMatches, setFavoriteMatches] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('favorite_matches') || '[]');
    } catch {
      return [];
    }
  });

  const [notifyIds, setNotifyIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('sportsphere_notified') || '[]');
    } catch {
      return [];
    }
  });

  // Schedule filtering states
  const [selectedDate, setSelectedDate] = useState(date || '2026-05-21'); 
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'football' | 'basketball' | 'tennis' | 'f1' | 'esports'>('All');
  const [regionFilter, setRegionFilter] = useState<'All' | 'Global' | 'USA' | 'Europe'>('All');
  const [onlyLive, setOnlyLive] = useState(false);

  useEffect(() => {
    if (date && date !== selectedDate) {
      setSelectedDate(date);
    }
  }, [date]);

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    navigate(`/schedule/${newDate}`);
    showToast(`Redirecting to schedule: ${newDate}`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const analyzeMatch = async (match: any) => {
    const matchId = match.id;

    // Check 12-hour cache first
    const cacheKey = `sportsphere_match_pred_${matchId}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < 43200000) {
          setPredictions(prev => ({ ...prev, [matchId]: data }));
          showToast(`Retrieved AI prediction for ${match.teamA} vs ${match.teamB}`);
          return;
        }
      } catch (e) {
        console.error("Failed to read match prediction cache:", e);
      }
    }

    setLoadingStates(prev => ({ ...prev, [matchId]: true }));
    try {
      const data = await geminiService.predictExcitement({
        teamA: match.teamA,
        teamB: match.teamB,
        rankings: 'Top 10 vs Top 12',
        form: 'WWDLW vs LWWWD',
        stage: match.tournament,
        history: 'Fierce cross-town derby rivalry'
      });
      
      setPredictions(prev => ({ ...prev, [matchId]: data }));
      
      // Save to 12-hour cache
      localStorage.setItem(cacheKey, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
      showToast(`Excitement analysis computed for ${match.teamA} vs ${match.teamB}!`);
    } catch (error) {
      console.error("Match predictor issue:", error);
      showToast("Prediction calculation failed. Please retry.");
    } finally {
      setLoadingStates(prev => ({ ...prev, [matchId]: false }));
    }
  };

  const toggleMustWatch = (matchId: string, matchName: string) => {
    let updated;
    if (favoriteMatches.includes(matchId)) {
      updated = favoriteMatches.filter(id => id !== matchId);
      showToast(`Removed "${matchName}" from Watchlist priorities.`);
    } else {
      updated = [...favoriteMatches, matchId];
      showToast(`Pinned "${matchName}" to Watchlist Priorities!`);
    }
    setFavoriteMatches(updated);
    localStorage.setItem('favorite_matches', JSON.stringify(updated));
    window.dispatchEvent(new Event('favorite_matches_updated'));
  };

  const addDynamicNotification = (title: string, sub: string) => {
    try {
      const raw = localStorage.getItem('sportsphere_notifications') || '[]';
      const notifs = JSON.parse(raw);
      const newNotif = {
        id: String(Date.now() + Math.random()),
        title,
        desc: sub,
        sub,
        label: 'ALERT ACTIVE',
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

  const toggleNotify = (matchId: string, matchName: string) => {
    let updated;
    const isNotify = notifyIds.includes(matchId);
    if (isNotify) {
      updated = notifyIds.filter(id => id !== matchId);
      showToast(`Muted kickoff alerts for ${matchName}`);
    } else {
      updated = [...notifyIds, matchId];
      showToast(`Unmuted kickoff alerts for ${matchName}!`);
      addDynamicNotification(
        'SCHEDULE KICKOFF SUBSCRIPTION',
        `Interactive kickoff alert subscription has activated for: ${matchName}!`
      );
    }
    setNotifyIds(updated);
    localStorage.setItem('sportsphere_notified', JSON.stringify(updated));
  };

  // Filter mock matches
  const filteredMatches = mockMatches.filter(match => {
    // 1. Date filter
    const matchDate = match.date || '2026-05-21';
    if (matchDate !== selectedDate) return false;

    // 2. Only Live filter
    if (onlyLive && match.startTime !== 'LIVE') return false;

    // 3. Category filter
    if (categoryFilter !== 'All' && match.genre !== categoryFilter) return false;

    // 4. Region filter
    if (regionFilter !== 'All' && match.region !== regionFilter) return false;

    return true;
  });

  const getWeekName = (dateStr: string) => {
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const d = new Date(dateStr);
    return days[d.getDay()];
  };

  const dateMapping = [
    { label: 'MON 18', value: '2026-05-18' },
    { label: 'TUE 19', value: '2026-05-19' },
    { label: 'WED 20', value: '2026-05-20' },
    { label: 'THU 21', value: '2026-05-21' },
    { label: 'FRI 22', value: '2026-05-22' },
    { label: 'SAT 23', value: '2026-05-23' },
    { label: 'SUN 24', value: '2026-05-24' }
  ];

  return (
    <div className="space-y-8 pb-32">
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

      {/* Header and Date Selection Block */}
      <section className="mt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white mb-1">Sports Schedule</h1>
            <p className="text-xs text-on-surface-variant font-medium">Auto-converted to your local zone (GMT-5). Click any date or use the calendar.</p>
          </div>
          
          {/* Integrated Calendar Date Select */}
          <div className="flex items-center gap-2 bg-surface-container-high border border-outline-variant px-4 py-2.5 rounded-2xl cursor-pointer hover:border-primary/50 transition-all text-xs font-bold text-sky-400 self-start">
            <Calendar className="w-4 h-4 text-primary shrink-0" />
            <span>Select Date:</span>
            <input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => {
                if (e.target.value) {
                  handleDateChange(e.target.value);
                }
              }}
              className="bg-transparent border-none text-sky-450 outline-none cursor-pointer font-bold focus:outline-none"
            />
          </div>
        </div>

        {/* 7-day row selection dates */}
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar py-2.5">
          {dateMapping.map((dateObj) => {
            const isSelected = selectedDate === dateObj.value;
            return (
              <button 
                key={dateObj.value}
                onClick={() => handleDateChange(dateObj.value)}
                className={cn(
                  "flex flex-col items-center justify-center min-w-[70px] py-4 rounded-2xl border transition-all duration-300 relative overflow-hidden group cursor-pointer",
                  isSelected
                    ? "bg-primary text-on-primary-container border-transparent shadow-[0_0_20px_rgba(56,189,248,0.4)]" 
                    : "bg-surface-container-low text-on-surface-variant border-white/5 hover:border-primary/40 hover:text-white"
                )}
              >
                {isSelected && (
                  <span className="absolute inset-x-0 bottom-0 h-1 bg-white"></span>
                )}
                <span className="text-[10px] font-bold uppercase">{dateObj.label.split(' ')[0]}</span>
                <span className="text-xl font-extrabold mt-0.5">{dateObj.label.split(' ')[1]}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Filters Area */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-5 bg-surface-container-low border border-white/5 rounded-3xl">
        <div className="flex gap-3 flex-wrap">
          {/* Sports style dropdown */}
          <div className="relative group">
            <select 
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value as any);
                showToast(`Filter sports type: ${e.target.value}`);
              }}
              className="appearance-none bg-surface-container-high border border-outline-variant text-on-surface rounded-full pl-6 pr-10 py-2.5 focus:border-primary focus:ring-0 text-xs font-black cursor-pointer uppercase tracking-wider"
            >
              <option value="All">🏆 All Sports</option>
              <option value="football">⚽ Football</option>
              <option value="basketball">🏀 Basketball</option>
              <option value="tennis">🎾 Tennis</option>
              <option value="f1">🏎️ Formula 1</option>
              <option value="esports">🎮 eSports</option>
            </select>
            <Filter className="w-3.5 h-3.5 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant" />
          </div>

          {/* Region selectivity */}
          <div className="relative group">
            <select 
              value={regionFilter}
              onChange={(e) => {
                setRegionFilter(e.target.value as any);
                showToast(`Filter territory: ${e.target.value}`);
              }}
              className="appearance-none bg-surface-container-high border border-outline-variant text-on-surface rounded-full pl-6 pr-10 py-2.5 focus:border-primary focus:ring-0 text-xs font-black cursor-pointer uppercase tracking-wider"
            >
              <option value="All">🌎 Global Region</option>
              <option value="USA">🇺🇸 United States</option>
              <option value="Europe">🇪🇺 Europe</option>
            </select>
            <Globe className="w-3.5 h-3.5 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant" />
          </div>
        </div>

        {/* ONLY LIVE Toggle Switcer */}
        <div className="flex items-center gap-4 bg-surface-container-high border border-white/5 px-5 py-2.5 rounded-full select-none">
          <span className="text-xs font-black uppercase tracking-wider text-on-surface-variant">📡 Only Show Live</span>
          <div className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={onlyLive}
              onChange={(e) => {
                setOnlyLive(e.target.checked);
                showToast(e.target.checked ? "Activated filter: Live Matches exclusively" : "Removed exclusive live filter");
              }}
            />
            <div className="w-11 h-6 bg-slate-800 rounded-full peer peer-focus:outline-none peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-350 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </div>
        </div>
      </section>

      {/* Main Schedule Matches List Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12 space-y-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-3">
              {onlyLive ? (
                <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full">
                  <Radio className="w-4 h-4 text-red-500 animate-pulse" />
                  <span className="text-xs font-black text-red-400 uppercase tracking-widest">Global Live Matrix</span>
                </div>
              ) : (
                <h2 className="text-lg font-black uppercase tracking-wider text-sky-400">Matches Queue ({filteredMatches.length})</h2>
              )}
            </div>
            <div className="h-px flex-1 bg-white/5"></div>
          </div>
          
          {filteredMatches.length === 0 ? (
            <div className={cn(
              "rounded-[2rem] p-16 text-center flex flex-col items-center justify-center border transition-all",
              onlyLive 
                ? "bg-red-950/10 border-red-500/20" 
                : "bg-slate-900/40 border-white/5"
            )}>
              {onlyLive ? (
                <Radio className="w-16 h-16 text-red-500/20 mb-4 animate-ping" />
              ) : (
                <Star className="w-16 h-16 text-sky-400/20 mb-4 animate-bounce" />
              )}
              <h3 className="text-xl font-bold text-white">{onlyLive ? 'No Live Broadcasts Active' : 'No Matches Found'}</h3>
              <p className="text-xs text-on-surface-variant max-w-sm mt-1.5 leading-relaxed">
                {onlyLive 
                  ? `There are currently no live events transmitting for your current filter on ${selectedDate}. Switch back to "All" to see the full schedule.` 
                  : `There are currently no events registered matching your filter configurations for ${selectedDate}. Select another date above or adjust the filter selectors!`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredMatches.map((match) => {
                const matchName = `${match.teamA} vs ${match.teamB}`;
                const isPinned = favoriteMatches.includes(match.id);
                const isNotified = notifyIds.includes(match.id);
                const isLive = match.startTime === 'LIVE';

                return (
                  <div key={match.id} className="glass-card rounded-3xl p-6 group hover:border-primary/30 transition-all duration-300 bg-slate-900/40 border border-white/5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          {isLive ? (
                            <span className="bg-red-500/20 text-red-400 text-[9px] px-2.5 py-1 rounded-full flex items-center gap-1 font-extrabold uppercase animate-pulse border border-red-500/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-400 live-pulse"></span>
                              LIVE NOW
                            </span>
                          ) : (
                            <span className="text-sky-400 text-[10px] font-black uppercase bg-sky-500/10 px-2 py-0.5 rounded-md border border-sky-500/20">{match.startTime}</span>
                          )}
                          <span className="text-on-surface-variant text-[10px] font-bold uppercase tracking-wider">• {match.tournament} • {match.league}</span>
                        </div>
                        <span className="text-[10px] bg-white/[0.03] text-on-surface-variant px-3 py-1 rounded-full font-bold uppercase">{match.region || 'Global'}</span>
                      </div>
                      
                      <div className="flex items-center justify-around py-6 border-b border-white/5">
                        {/* Team A Logo */}
                        <div className="flex flex-col items-center gap-2 max-w-[125px] flex-1">
                          <div className="w-14 h-14 bg-surface-container-high rounded-full border border-white/10 flex items-center justify-center overflow-hidden p-1.5 bg-white/[0.05] group-hover:scale-105 transition-transform duration-300">
                             {match.logoA ? (
                               <img src={match.logoA} className={cn("w-full h-full", match.isIndividual ? "object-cover rounded-full" : "object-contain p-0.5")} alt={match.teamA} referrerPolicy="no-referrer" />
                             ) : (
                               <span className="font-extrabold text-[#38bdf8] italic text-lg">{match.teamA.slice(0, 2)}</span>
                             )}
                          </div>
                          <span className="font-bold text-xs tracking-tight text-center line-clamp-1 truncate block w-full">{match.teamA}</span>
                        </div>
                        
                        {/* Scores / VS */}
                        <div className="flex flex-col items-center px-4 self-center shrink-0">
                          <span className={cn("text-2xl font-black tracking-widest text-center", isLive ? "text-teal-400" : "text-white")}>
                            {match.score === 'VS' ? 'VS' : match.score}
                          </span>
                          {isLive && <span className="text-teal-400 text-[9px] font-black uppercase mt-1 animate-pulse">In Progress</span>}
                        </div>

                        {/* Team B Logo */}
                        <div className="flex flex-col items-center gap-2 max-w-[125px] flex-1">
                          <div className="w-14 h-14 bg-surface-container-high rounded-full border border-white/10 flex items-center justify-center overflow-hidden p-1.5 bg-white/[0.05] group-hover:scale-105 transition-transform duration-300">
                             {match.logoB ? (
                               <img src={match.logoB} className={cn("w-full h-full", match.isIndividual ? "object-cover rounded-full" : "object-contain p-0.5")} alt={match.teamB} referrerPolicy="no-referrer" />
                             ) : (
                               <span className="font-extrabold text-[#38bdf8] italic text-lg">{match.teamB.slice(0, 2)}</span>
                             )}
                          </div>
                          <span className="font-bold text-xs tracking-tight text-center line-clamp-1 truncate block w-full">{match.teamB}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-2 flex flex-col gap-4">
                      {/* Predictive story expansion analysis */}
                      <div className="space-y-4">
                        <button 
                          onClick={() => analyzeMatch(match)}
                          disabled={loadingStates[match.id]}
                          className="w-full flex items-center justify-center gap-2 py-2.5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-400/20 rounded-xl text-xs font-bold transition-all shadow-[0_0_12px_rgba(56,189,248,0.05)] cursor-pointer"
                        >
                          <Zap className={cn("w-3.5 h-3.5", loadingStates[match.id] && "animate-spin")} />
                          {loadingStates[match.id] ? 'Analyzing Excitement...' : 'Analyse Match Excitement'}
                        </button>
                        
                        <AnimatePresence>
                          {(loadingStates[match.id] || predictions[match.id]) && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              {loadingStates[match.id] ? (
                                <div className="flex items-center gap-2 py-3 bg-white/5 rounded-xl px-3 border border-white/5 animate-pulse">
                                  <Sparkles className="w-4 h-4 text-sky-400 animate-spin" />
                                  <span className="text-[10px] text-sky-450 font-bold">AI crunching lineups...</span>
                                </div>
                              ) : predictions[match.id] && (
                                <div className="space-y-3 pt-2 bg-sky-500/5 p-3 rounded-xl border border-sky-500/15">
                                  <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[9px] text-on-surface-variant uppercase font-bold tracking-widest">Excitement Meter</span>
                                      <span className="text-xs font-bold text-sky-400">{predictions[match.id].excitementScore}/10</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-sky-400 rounded-full" 
                                        style={{ width: `${predictions[match.id].excitementScore * 10}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                  <div className="flex gap-1.5 flex-wrap">
                                    <div className="bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded text-[9px] font-bold flex items-center gap-1">
                                      <TrendingUp className="w-2.5 h-2.5 text-sky-450" />
                                      {predictions[match.id].competitiveness}
                                    </div>
                                    <div className={cn(
                                      "px-2 py-0.5 rounded text-[9px] font-bold flex items-center gap-1 border",
                                      predictions[match.id].upsetPotential.toLowerCase() === 'high' 
                                        ? "bg-amber-500/10 border-amber-500/25 text-amber-400" 
                                        : "bg-surface-container border-white/5 text-on-surface-variant"
                                    )}>
                                      <AlertTriangle className="w-2.5 h-2.5" />
                                      Upset: {predictions[match.id].upsetPotential}
                                    </div>
                                  </div>
                                  <div className="p-2.5 bg-black/30 rounded-lg border border-white/5">
                                    <div className="flex items-center gap-1 mb-1 text-sky-450">
                                      <BookOpen className="w-3 h-3 text-sky-400" />
                                      <span className="text-[9px] font-bold uppercase tracking-wider text-sky-400">Storyline</span>
                                    </div>
                                    <p className="text-[10px] text-on-surface-variant leading-relaxed font-medium">
                                      {predictions[match.id].storyline}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Interactive alert & pin togglers */}
                      <div className="flex items-center justify-between border-t border-white/5 pt-4">
                        <button 
                          onClick={() => toggleNotify(match.id, matchName)}
                          className={cn(
                            "text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all active:scale-95 border cursor-pointer",
                            isNotified
                              ? "bg-amber-500/10 border-amber-500/25 text-amber-300"
                              : "text-on-surface-variant border-transparent hover:text-primary hover:bg-white/[0.02]"
                          )}
                          title="Set Kickoff Reminder alert"
                        >
                          <Bell className={cn("w-3.5 h-3.5", isNotified && "fill-amber-400 text-amber-400")} />
                          {isNotified ? 'Kickoff Armed' : 'Set Alert'}
                        </button>
                        
                        <button 
                          onClick={() => toggleMustWatch(match.id, matchName)}
                          className={cn(
                            "text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all active:scale-95 border cursor-pointer",
                            isPinned
                              ? "bg-sky-500/10 border-sky-500/25 text-sky-450"
                              : "text-on-surface-variant border-transparent hover:text-primary hover:bg-white/[0.02]"
                          )}
                          title="Pin to Watchlist Priorites"
                        >
                          <Star className={cn("w-3.5 h-3.5", isPinned && "fill-sky-400 text-sky-400")} />
                          {isPinned ? 'Pinned Watch' : 'Pin/Watch'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
