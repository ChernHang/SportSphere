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

  useEffect(() => {
    const found = mockMatches.find(m => m.id === id);
    if (found) setMatch(found);
  }, [id]);

  const generateSummary = async () => {
    if (!match) return;
    setLoadingAi(true);
    try {
      const data = await geminiService.generateSummary({
        teamA: match.teamA,
        teamB: match.teamB,
        tournament: match.tournament,
        score: match.score,
        events: match.events.join(', ')
      });
      setSummary(data.summary);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingAi(false);
    }
  };

  const copyToClipboard = () => {
    if (summary) {
      navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!match) return <div className="p-8 text-center">Match not found</div>;

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
            <div className="w-20 h-20 bg-surface-container-highest rounded-2xl flex items-center justify-center border border-white/10 shadow-xl">
               <Shield className="w-10 h-10 text-primary" />
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
             <div className="w-20 h-20 bg-surface-container-highest rounded-2xl flex items-center justify-center border border-white/10 shadow-xl">
               <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${match.teamB}`} className="w-10 h-10 opacity-80" alt={match.teamB} />
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
           <section className="glass-card rounded-2xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Sparkles className="w-24 h-24 text-primary" />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-primary mb-1">Match Summary</h3>
                  <p className="text-sm text-on-surface-variant font-medium">Generate an AI-powered insights report</p>
                </div>
                <button 
                  onClick={generateSummary}
                  disabled={loadingAi}
                  className="bg-primary text-on-primary px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 active:scale-95 transition-all shadow-[0_0_20px_rgba(56,189,248,0.3)] disabled:opacity-50"
                >
                  <Sparkles className={cn("w-4 h-4", loadingAi && "animate-spin")} />
                  Generate Match Summary
                </button>
              </div>

              <AnimatePresence>
                {summary && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="bg-surface-container p-6 rounded-2xl border border-white/10">
                      <textarea 
                        readOnly 
                        value={summary}
                        className="w-full min-h-[120px] bg-transparent border-none focus:ring-0 text-sm leading-relaxed text-on-surface-variant resize-none"
                      />
                      <div className="flex justify-end gap-3 mt-4 border-t border-white/5 pt-4">
                        <button 
                          onClick={copyToClipboard}
                          className="flex items-center gap-2 text-xs font-bold text-primary hover:bg-primary/10 px-4 py-2 rounded-lg transition-all"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          {copied ? 'Copied!' : 'Copy Summary'}
                        </button>
                        <button className="flex items-center gap-2 text-xs font-bold text-on-surface-variant hover:bg-white/5 px-4 py-2 rounded-lg transition-all">
                          <Share2 className="w-3.5 h-3.5" />
                          Share
                        </button>
                        <button className="flex items-center gap-2 text-xs font-bold text-on-surface-variant hover:bg-white/5 px-4 py-2 rounded-lg transition-all">
                          <Heart className="w-3.5 h-3.5" />
                          Favorite
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <button className="px-4 py-2 bg-surface-container-high rounded-full text-[10px] font-bold uppercase hover:text-primary transition-all">Short Version</button>
                      <button className="px-4 py-2 bg-surface-container-high rounded-full text-[10px] font-bold uppercase hover:text-primary transition-all">Fan Version</button>
                      <button className="px-4 py-2 bg-surface-container-high rounded-full text-[10px] font-bold uppercase hover:text-primary transition-all">Neutral Analyst</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>

          {/* Timeline & Commentary */}
          <div className="bg-surface-container-low rounded-2xl border border-white/5 overflow-hidden">
            <div className="flex border-b border-white/10">
              <button className="px-8 py-5 text-sm font-bold text-primary border-b-2 border-primary">Timeline</button>
              <button className="px-8 py-5 text-sm font-bold text-on-surface-variant hover:text-primary transition-all">Stats</button>
              <button className="px-8 py-5 text-sm font-bold text-on-surface-variant hover:text-primary transition-all">Lineups</button>
            </div>
            
            <div className="p-8 space-y-8">
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
                <button className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold flex items-center justify-center gap-3 active:scale-95 transition-all shadow-[0_0_20px_rgba(56,189,248,0.2)]">
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
    </div>
  );
}
