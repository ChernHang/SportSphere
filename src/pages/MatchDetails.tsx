import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Shield, Timer, Tv, Cast, Bell, Share2, PlayCircle, History, Info, ChevronLeft, Sparkles, Copy, MessageSquare, Heart, Radio } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { mockMatches } from '../data/mockMatches';
import { geminiService } from '../services/geminiService';
import { Match } from '../types';
import { cn } from '../lib/utils';

export default function MatchDetails() {
  const { id } = useParams();
  const [match, setMatch] = useState<Match | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeVariant, setActiveVariant] = useState<string>('default');
  const [isFavorited, setIsFavorited] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'timeline' | 'stats' | 'lineups'>('timeline');

  useEffect(() => {
    const found = mockMatches.find(m => m.id === id);
    if (found) {
      setMatch(found);
      // Load favorite status
      const savedFavorites = JSON.parse(localStorage.getItem('favorite_matches') || '[]');
      if (savedFavorites.includes(found.id)) {
        setIsFavorited(true);
      }
      // Load cached summary if exists
      const cachedSumm = localStorage.getItem(`summary_${found.id}`);
      if (cachedSumm) {
        setSummary(cachedSumm);
      }
    }
  }, [id]);

  const generateSummary = async (variant: string = 'default') => {
    if (!match) return;
    setLoadingAi(true);
    setActiveVariant(variant);
    try {
      const data = await geminiService.generateSummary({
        teamA: match.teamA,
        teamB: match.teamB,
        tournament: match.tournament,
        score: match.score,
        events: match.events.join(', ')
      }, variant);
      setSummary(data.summary);
      localStorage.setItem(`summary_${match.id}`, data.summary);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingAi(false);
    }
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

  const handleOpenStream = () => {
    if (!match) return;
    const matchName = `${match.teamA} vs ${match.teamB}`;
    const targetUrl = getStreamUrlForMatch(matchName);
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const toggleFavorite = () => {
    if (!match) return;
    const savedFavorites = JSON.parse(localStorage.getItem('favorite_matches') || '[]');
    let updated;
    if (savedFavorites.includes(match.id)) {
      updated = savedFavorites.filter((fid: string) => fid !== match.id);
      setIsFavorited(false);
    } else {
      updated = [...savedFavorites, match.id];
      setIsFavorited(true);
    }
    localStorage.setItem('favorite_matches', JSON.stringify(updated));
    window.dispatchEvent(new Event('favorite_matches_updated'));
  };

  const copyToClipboard = () => {
    if (summary) {
      navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = (platform: string) => {
    setShareSuccess(true);
    setTimeout(() => {
      setShareSuccess(false);
      setShowShareModal(false);
    }, 1500);
  };

  if (!match) return <div className="p-8 text-center bg-background min-h-screen text-on-surface">Match not found</div>;

  return (
    <div className="space-y-8 pb-32">
      {/* Back Button */}
      <Link to="/" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-all">
        <ChevronLeft className="w-5 h-5" />
        <span className="font-bold">Back to Dashboard</span>
      </Link>

      {/* Scoreboard Header */}
      <section className="relative overflow-hidden rounded-3xl bg-surface-container-low border border-white/5 p-12">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 opacity-30"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
          {/* Team 1 */}
          <div className="flex items-center gap-8 order-2 md:order-1">
            <div className="text-right">
              <h2 className="text-3xl font-bold text-on-surface tracking-tight">{match.teamA}</h2>
              <p className="text-xs text-on-surface-variant uppercase font-bold tracking-widest mt-1">Home Team</p>
            </div>
            <div className="w-20 h-20 bg-surface-container-highest rounded-2xl flex items-center justify-center border border-white/10 shadow-xl overflow-hidden p-2.5 bg-white/[0.05]">
               {match.logoA ? (
                 <img src={match.logoA} className={cn("w-full h-full", match.isIndividual ? "object-cover rounded-full scale-105" : "object-contain p-1")} alt={match.teamA} referrerPolicy="no-referrer" />
               ) : (
                 <Shield className="w-10 h-10 text-primary" />
               )}
            </div>
          </div>

          {/* Live Score Center */}
          <div className="flex flex-col items-center gap-4 order-1 md:order-2">
            <div className="px-4 py-1 bg-secondary-container rounded-full flex items-center gap-2 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-white live-pulse"></span>
              <span className="text-xs font-bold text-white tracking-widest">LIVE 72'</span>
            </div>
            <div className="flex items-center gap-8">
              <span className="text-6xl font-black text-white neon-glow">{match.score.split(' - ')[0] || '0'}</span>
              <span className="text-4xl font-black text-on-surface-variant opacity-30">:</span>
              <span className="text-6xl font-black text-white neon-glow">{match.score.split(' - ')[1] || '0'}</span>
            </div>
            <p className="text-xs font-bold text-primary-container uppercase tracking-[0.3em]">{match.tournament}</p>
          </div>

          {/* Team 2 */}
          <div className="flex items-center gap-8 order-3 md:order-3">
             <div className="w-20 h-20 bg-surface-container-highest rounded-2xl flex items-center justify-center border border-white/10 shadow-xl overflow-hidden p-2.5 bg-white/[0.05]">
               {match.logoB ? (
                 <img src={match.logoB} className={cn("w-full h-full", match.isIndividual ? "object-cover rounded-full scale-105" : "object-contain p-1")} alt={match.teamB} referrerPolicy="no-referrer" />
               ) : (
                 <Shield className="w-10 h-10 text-primary" />
               )}
            </div>
            <div className="text-left">
              <h2 className="text-3xl font-bold text-on-surface tracking-tight">{match.teamB}</h2>
              <p className="text-xs text-on-surface-variant uppercase font-bold tracking-widest mt-1">Away Team</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-8">
           {/* Summary Generator */}
           <section className="glass-card rounded-2xl p-8 relative overflow-hidden group border border-sky-500/20 shadow-[0_0_25px_rgba(56,189,248,0.05)]">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Sparkles className="w-24 h-24 text-sky-400" />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-2xl font-bold text-on-surface">Match Summary</h3>
                    <span className="bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-full px-2 py-0.5 text-[10px] font-bold flex items-center gap-1 shrink-0">
                      <Sparkles className="w-2.5 h-2.5" />
                      AI INSIGHTS
                    </span>
                  </div>
                  <p className="text-sm text-on-surface-variant font-medium">Generate of customize professional match analysis report</p>
                </div>
                <button 
                  onClick={() => generateSummary('default')}
                  disabled={loadingAi}
                  className="bg-primary hover:bg-opacity-90 text-on-primary px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 active:scale-95 transition-all shadow-[0_0_20px_rgba(56,189,248,0.3)] disabled:opacity-50"
                >
                  <Sparkles className={cn("w-4 h-4", loadingAi && activeVariant === 'default' && "animate-spin")} />
                  {loadingAi && activeVariant === 'default' ? 'Generating...' : 'Generate Match Summary'}
                </button>
              </div>

              {/* Loader visual as per guidelines */}
              {loadingAi && (
                <div className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-3 bg-black/40 border border-sky-500/20 animate-pulse">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full border-4 border-sky-500/20 border-t-sky-400 animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-sky-400 animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-bold text-sky-400 text-sm">Generating Insights...</p>
                    <p className="text-[10px] text-on-surface-variant">Writing sports commentator report based on the timeline</p>
                  </div>
                </div>
              )}

              <AnimatePresence>
                {summary && !loadingAi && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="space-y-4"
                  >
                    <div className="bg-surface-container p-6 rounded-2xl border border-white/10 relative">
                      <div className="absolute top-2 right-4 text-[10px] font-mono text-sky-400/50 flex items-center gap-1 select-none">
                        <span>Editable Report</span>
                      </div>
                      
                      <textarea 
                        value={summary}
                        onChange={(e) => {
                          setSummary(e.target.value);
                          localStorage.setItem(`summary_${match.id}`, e.target.value);
                        }}
                        className="w-full min-h-[140px] bg-transparent border-none focus:outline-none focus:ring-0 text-sm leading-relaxed text-on-surface-variant resize-y pr-4"
                        placeholder="Customize report text here..."
                      />
                      
                      <div className="flex justify-end gap-3 mt-4 border-t border-white/5 pt-4">
                        <button 
                          onClick={copyToClipboard}
                          className="flex items-center gap-2 text-xs font-bold text-sky-400 hover:bg-sky-500/10 px-4 py-2 rounded-lg transition-all"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          {copied ? 'Copied!' : 'Copy Summary'}
                        </button>
                        <button 
                          onClick={() => setShowShareModal(true)}
                          className="flex items-center gap-2 text-xs font-bold text-on-surface-variant hover:bg-white/5 px-4 py-2 rounded-lg transition-all"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          Share
                        </button>
                        <button 
                          onClick={toggleFavorite}
                          className={cn(
                            "flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-lg transition-all",
                            isFavorited ? "text-amber-400 bg-amber-500/10" : "text-on-surface-variant hover:bg-white/5"
                          )}
                        >
                          <Heart className={cn("w-3.5 h-3.5", isFavorited && "fill-amber-400 text-amber-400")} />
                          {isFavorited ? 'Favorited' : 'Favorite'}
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-wrap items-center">
                      <span className="text-xs text-on-surface-variant font-bold mr-2 uppercase tracking-wider text-[10px]">Tones:</span>
                      <button 
                        onClick={() => generateSummary('short')}
                        className={cn(
                          "px-4 py-2 rounded-full text-[10px] font-bold uppercase transition-all border",
                          activeVariant === 'short' 
                            ? "bg-sky-500/20 text-sky-400 border-sky-400/40 shadow-[0_0_12px_rgba(56,189,248,0.2)]" 
                            : "bg-surface-container-high text-on-surface-variant border-transparent hover:text-primary"
                        )}
                      >
                        Generate Short Version
                      </button>
                      <button 
                        onClick={() => generateSummary('fan')}
                        className={cn(
                          "px-4 py-2 rounded-full text-[10px] font-bold uppercase transition-all border",
                          activeVariant === 'fan' 
                            ? "bg-sky-500/20 text-sky-400 border-sky-400/40 shadow-[0_0_12px_rgba(56,189,248,0.2)]" 
                            : "bg-surface-container-high text-on-surface-variant border-transparent hover:text-primary"
                        )}
                      >
                        Generate Fan Version
                      </button>
                      <button 
                        onClick={() => generateSummary('neutral')}
                        className={cn(
                          "px-4 py-2 rounded-full text-[10px] font-bold uppercase transition-all border",
                          activeVariant === 'neutral' 
                            ? "bg-sky-500/20 text-sky-400 border-sky-400/40 shadow-[0_0_12px_rgba(56,189,248,0.2)]" 
                            : "bg-surface-container-high text-on-surface-variant border-transparent hover:text-primary"
                        )}
                      >
                        Generate Neutral Analyst Version
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>

          {/* Timeline & Commentary */}
          <div className="bg-surface-container-low rounded-2xl border border-white/5 overflow-hidden">
            <div className="flex border-b border-white/10">
              <button onClick={() => setActiveTab('timeline')} className={cn("px-8 py-5 text-sm font-bold transition-all", activeTab === 'timeline' ? "text-primary border-b-2 border-primary" : "text-on-surface-variant hover:text-primary")}>Timeline</button>
              <button onClick={() => setActiveTab('stats')} className={cn("px-8 py-5 text-sm font-bold transition-all", activeTab === 'stats' ? "text-primary border-b-2 border-primary" : "text-on-surface-variant hover:text-primary")}>Stats</button>
              <button onClick={() => setActiveTab('lineups')} className={cn("px-8 py-5 text-sm font-bold transition-all", activeTab === 'lineups' ? "text-primary border-b-2 border-primary" : "text-on-surface-variant hover:text-primary")}>Lineups</button>
            </div>
            
            <div className="p-8 space-y-8">
              {activeTab === 'timeline' && (
                <>
                  {match.events.map((event, i) => (
                    <div key={i} className="flex gap-6 border-l-2 border-primary/20 pl-8 relative">
                      <div className={cn(
                        "absolute -left-[11px] top-0 w-5 h-5 rounded-full flex items-center justify-center",
                        event.includes('GOAL') ? "bg-secondary text-on-secondary" : "bg-primary text-on-primary"
                      )}>
                        {event.includes('GOAL') ? <Shield className="w-3 h-3" /> : <History className="w-3 h-3" />}
                      </div>
                      <div className="space-y-1">
                        <span className={cn("text-xs font-black uppercase tracking-widest", event.includes('GOAL') ? "text-secondary" : "text-primary")}>
                          {event.split(' ')[0]} {event.split(' ')[1]}
                        </span>
                        <p className="text-sm font-medium leading-relaxed">{event.substring(event.indexOf('-') + 1 || 0)}</p>
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex gap-6 border-l-2 border-white/5 pl-8 relative pb-4">
                    <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-surface-container-highest border border-white/10 flex items-center justify-center">
                      <Info className="w-3 h-3 text-on-surface-variant" />
                    </div>
                    <div className="space-y-1">
                        <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant">58' - Yellow Card</span>
                        <p className="text-sm font-medium text-on-surface-variant">K. Schmidt cautioned for a reckless tackle near the halfway line.</p>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'stats' && (
                <div className="space-y-6">
                  <h4 className="text-lg font-bold text-white mb-4">Match Statistics</h4>
                  <div className="space-y-4">
                    {[
                      { label: "Possession", a: "54%", b: "46%" },
                      { label: "Shots on Target", a: "7", b: "4" },
                      { label: "Corners", a: "5", b: "2" },
                      { label: "Fouls", a: "11", b: "9" }
                    ].map((stat, i) => (
                      <div key={i} className="flex flex-col gap-2">
                        <div className="flex justify-between text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                          <span>{stat.a}</span>
                          <span>{stat.label}</span>
                          <span>{stat.b}</span>
                        </div>
                        <div className="h-2 flex rounded-full overflow-hidden bg-surface-container-highest">
                          <div className="bg-primary h-full" style={{ width: stat.a }}></div>
                          <div className="bg-secondary h-full" style={{ width: stat.b }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'lineups' && (
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-4">{match.teamA} Lineup</h4>
                    <ul className="space-y-3">
                      {["1. Ederson (GK)", "2. K. Walker", "3. R. Dias", "16. Rodri", "17. K. De Bruyne", "9. E. Haaland"].map((player, i) => (
                        <li key={i} className="text-sm text-on-surface-variant flex items-center gap-3">
                          <span className="w-6 h-6 rounded bg-surface-container flex items-center justify-center text-xs font-bold">{player.split('.')[0]}</span>
                          {player.split('. ')[1]}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-4">{match.teamB} Lineup</h4>
                    <ul className="space-y-3">
                      {["1. Alisson (GK)", "4. V. van Dijk", "66. T. Alexander-Arnold", "10. A. Mac Allister", "11. M. Salah", "9. D. Nunez"].map((player, i) => (
                        <li key={i} className="text-sm text-on-surface-variant flex items-center gap-3">
                          <span className="w-6 h-6 rounded bg-surface-container flex items-center justify-center text-xs font-bold">{player.split('.')[0]}</span>
                          {player.split('. ')[1]}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
           <div className="glass-card rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <PlayCircle className="w-6 h-6 text-primary" />
                Broadcasting
              </h3>
              <div className="space-y-6">
                <button 
                  onClick={handleOpenStream}
                  className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold flex items-center justify-center gap-3 active:scale-95 transition-all shadow-[0_0_20px_rgba(56,189,248,0.2)]"
                >
                  <PlayCircle className="w-6 h-6" />
                  Open Stream
                </button>
                <div className="space-y-4">
                   {[
                     { name: 'Sky Sports Main Event', icon: Tv, color: 'text-secondary' },
                     { name: 'SportSphere Radio', icon: Radio, color: 'text-primary' },
                   ].map((platform, i) => (
                     <div key={i} className="flex items-center gap-4 p-4 bg-surface-container-high rounded-xl border border-white/5">
                        <platform.icon className={cn("w-6 h-6", platform.color)} />
                        <span className="text-sm font-bold">{platform.name}</span>
                     </div>
                   ))}
                </div>
              </div>
           </div>

           <div className="glass-card rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-tertiary-container" />
                Social Feed
              </h3>
              <div className="flex flex-wrap gap-2">
                {['#RAVvJET', '#PremierLeague', '#CarterShow', '#SundayFootball'].map((tag) => (
                  <span 
                    key={tag}
                    className="px-4 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-bold hover:bg-primary/20 cursor-pointer transition-all"
                  >
                    {tag}
                  </span>
                ))}
              </div>
           </div>
        </div>
      </div>

      {/* Share Modal Dialog */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
            id="share-modal-overlay"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-surface-container-low border border-white/10 rounded-3xl p-6 max-w-md w-full space-y-6 shadow-2xl relative"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xl font-bold text-on-surface">Share Match Summary</h4>
                  <p className="text-xs text-on-surface-variant font-medium mt-1">Spread the word about tonight's match breakdown</p>
                </div>
                <button 
                  onClick={() => setShowShareModal(false)}
                  className="text-on-surface-variant hover:text-white px-2 py-1 rounded bg-white/5 active:scale-95 text-xs font-bold"
                >
                  Close
                </button>
              </div>

              {shareSuccess ? (
                <div className="bg-sky-500/10 border border-sky-500/20 rounded-2xl p-6 text-center space-y-2">
                  <span className="text-lg font-bold text-sky-400">Successfully Shared!</span>
                  <p className="text-xs text-on-surface-variant">The match commentary has been matched and sent successfully.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-3 bg-surface-container rounded-xl text-xs max-h-[80px] overflow-y-auto text-on-surface-variant leading-relaxed select-all">
                    {summary}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { name: 'Twitter / X', icon: MessageSquare, color: 'hover:bg-sky-500/10 hover:text-sky-400' },
                      { name: 'WhatsApp', icon: Radio, color: 'hover:bg-emerald-500/10 hover:text-emerald-400' },
                      { name: 'Copy Link', icon: Copy, color: 'hover:bg-primary/10 hover:text-primary' }
                    ].map((plt) => (
                      <button 
                        key={plt.name}
                        onClick={() => handleShare(plt.name)}
                        className={cn(
                          "p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col items-center gap-2 text-xs font-semibold text-on-surface transition-all active:scale-95",
                          plt.color
                        )}
                      >
                        <plt.icon className="w-5 h-5 pointer-events-none" />
                        {plt.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
