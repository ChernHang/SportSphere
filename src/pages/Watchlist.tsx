import { useState } from 'react';
import { Star, Bell, Shield, Radio, Trophy, Sparkles, Share2, Heart, History, Trash2, Smartphone, Calendar, Search, Newspaper, Zap, ChevronRight, MessageSquare, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { geminiService } from '../services/geminiService';
import { cn } from '../lib/utils';

export default function Watchlist() {
  const [digest, setDigest] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const generateDigest = async () => {
    setLoadingAi(true);
    try {
      const data = await geminiService.generateDigest({
        favouriteSports: ['Football', 'Basketball'],
        favouriteTeams: ['Real Madrid', 'Lakers', 'Warriors'],
        results: 'Real Madrid won 2-1 against Man City. Lakers lost to Nuggets.',
        upcoming: 'Warriors vs Suns tonight at 10 PM.',
        news: 'Transfer window closed with major deals. Mbappe scores brace.'
      });
      setDigest(data.digest);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="space-y-12 pb-32">
      <header className="pt-6">
        <h1 className="text-4xl font-black mb-2">My Activity</h1>
        <p className="text-on-surface-variant font-medium">Manage your watchlist, teams, and personalized AI digests.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-12">
          {/* AI Digest Section */}
          <section className="glass-card rounded-[2rem] p-8 border-l-8 border-primary relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Newspaper className="w-32 h-32 text-primary" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
               <div className="flex items-center gap-6">
                  <div className="p-5 bg-primary/20 rounded-2xl shadow-inner">
                    <Sparkles className="w-10 h-10 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-on-surface mb-1">Your AI Sports Digest</h2>
                    <p className="text-sm text-on-surface-variant font-medium max-w-sm">A personalized summary of news, results, and upcoming matches tailored just for you.</p>
                  </div>
               </div>
               <button 
                onClick={generateDigest}
                disabled={loadingAi}
                className="whitespace-nowrap bg-primary text-on-primary-container px-8 py-4 rounded-2xl font-bold flex items-center gap-3 active:scale-95 transition-all shadow-xl disabled:opacity-50"
               >
                 <Zap className={cn("w-5 h-5", loadingAi && "animate-spin")} />
                 {loadingAi ? 'Compiling Digest...' : 'Generate My Sports Digest'}
               </button>
            </div>

            <AnimatePresence>
              {digest && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-8 pt-8 border-t border-white/5 space-y-6"
                >
                  <div className="bg-surface-container/50 backdrop-blur-md p-8 rounded-3xl border border-white/5 shadow-2xl">
                     <div className="flex items-center justify-between mb-6">
                        <div className="flex gap-4">
                           <button className="text-[10px] font-black uppercase text-primary border-b-2 border-primary pb-1">Morning Digest</button>
                           <button className="text-[10px] font-black uppercase text-on-surface-variant hover:text-primary transition-all pb-1">Evening Preview</button>
                        </div>
                        <div className="flex gap-2">
                           <button className="p-2 hover:bg-white/5 rounded-lg transition-all text-on-surface-variant"><Share2 className="w-4 h-4" /></button>
                           <button className="p-2 hover:bg-white/5 rounded-lg transition-all text-on-surface-variant"><Star className="w-4 h-4" /></button>
                        </div>
                     </div>
                     <div className="prose prose-invert max-w-none">
                        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-on-surface-variant">
                          {digest}
                        </pre>
                     </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Upcoming Matches */}
          <section className="space-y-6">
             <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  Upcoming Watched Matches
                </h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { league: 'Premier League', tA: 'MCI', tB: 'LIV', time: 'TOMORROW 20:45', color: 'primary' },
                  { league: 'NBA Finals', tA: 'GSW', tB: 'BOS', time: 'Q3 04:12', color: 'secondary', live: true },
                ].map((m, i) => (
                  <div key={i} className="glass-card rounded-2xl p-6 hover:translate-y-[-4px] transition-all duration-300 relative group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-6">
                        <span className={cn(
                          "px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                          m.color === 'primary' ? "bg-primary/10 text-primary border-primary/20" : "bg-secondary/10 text-secondary border-secondary/20"
                        )}>
                          {m.league}
                        </span>
                        <div className="flex gap-2">
                          <button className="text-on-surface-variant hover:text-primary transition-all"><Share2 className="w-4 h-4" /></button>
                          <button className="text-on-surface-variant hover:text-error transition-all"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                      <div className="flex items-center justify-around py-4">
                        <div className="text-center space-y-2">
                          <div className="w-14 h-14 bg-surface-container-highest rounded-full flex items-center justify-center border border-white/10 shadow-lg">
                            <Shield className="w-8 h-8 opacity-60" />
                          </div>
                          <span className="text-xs font-black">{m.tA}</span>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] font-black text-on-surface-variant uppercase mb-1">{m.live ? 'LIVE NOW' : 'NEXT UP'}</p>
                          <div className={cn("text-2xl font-black", m.live ? "text-secondary flex items-center gap-2" : "text-primary")}>
                            {m.live && <span className="w-2 h-2 rounded-full bg-secondary live-pulse"></span>}
                            {m.time}
                          </div>
                        </div>
                        <div className="text-center space-y-2">
                          <div className="w-14 h-14 bg-surface-container-highest rounded-full flex items-center justify-center border border-white/10 shadow-lg">
                            <Shield className="w-8 h-8 opacity-60" />
                          </div>
                          <span className="text-xs font-black">{m.tB}</span>
                        </div>
                      </div>
                      <button className={cn(
                        "w-full py-3 mt-6 rounded-xl font-black text-xs transition-all uppercase tracking-widest",
                        m.live ? "border border-primary text-primary hover:bg-primary/10" : "bg-primary text-on-primary-container shadow-lg active:scale-95"
                      )}>
                        {m.live ? 'Watch Stream' : 'Set Alert'}
                      </button>
                    </div>
                  </div>
                ))}
             </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
           <section className="glass-card rounded-3xl p-8">
              <h3 className="text-xs font-black text-on-surface-variant uppercase tracking-[0.3em] mb-8">Saved Teams</h3>
              <div className="space-y-4">
                {[
                  { name: 'Manchester City', icon: Shield, color: 'text-primary' },
                  { name: 'Golden State Warriors', icon: Radio, color: 'text-primary' }
                ].map((team, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-surface-container/50 rounded-2xl border border-white/5 hover:border-primary/30 transition-all cursor-pointer group">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center border border-white/10 group-hover:border-primary/40">
                          <team.icon className={cn("w-5 h-5", team.color)} />
                       </div>
                       <span className="text-sm font-bold">{team.name}</span>
                    </div>
                    <Star className="w-4 h-4 text-primary fill-primary" />
                  </div>
                ))}
              </div>
              <button className="w-full mt-8 py-3 text-xs font-bold text-primary flex items-center justify-center gap-2 hover:underline transition-all">
                 <Plus className="w-4 h-4" />
                 Add More Teams
              </button>
           </section>

           <section className="glass-card rounded-3xl p-8">
              <h3 className="text-xl font-bold flex items-center gap-3 mb-8">
                <Bell className="w-6 h-6 text-primary" />
                Notifications
              </h3>
              <div className="space-y-8 before:absolute before:left-[43px] before:top-24 before:bottom-12 before:w-[2px] before:bg-white/5 relative">
                 {[
                   { label: 'MATCH STARTING', time: '2m ago', title: 'Liverpool vs Real Madrid', sub: 'Watch live on Stadium 1', icon: Radio, color: 'primary' },
                   { label: 'GOAL UPDATE', time: '15m ago', title: 'Man City 2-1 Chelsea', sub: 'Haaland scores highlight brace', icon: Shield, color: 'secondary' },
                 ].map((n, i) => (
                   <div key={i} className="flex gap-6 relative group">
                      <div className={cn(
                        "w-8 h-8 rounded-full bg-background border-2 z-10 flex items-center justify-center flex-shrink-0",
                        n.color === 'primary' ? "border-primary text-primary" : "border-secondary text-secondary"
                      )}>
                         {i === 0 ? <span className="w-2 h-2 rounded-full bg-primary live-pulse"></span> : <n.icon className="w-4 h-4" />}
                      </div>
                      <div className="space-y-1">
                         <div className="flex gap-4 items-center mb-1">
                            <span className={cn("text-[10px] font-black uppercase tracking-widest", n.color === 'primary' ? "text-primary" : "text-secondary")}>{n.label}</span>
                            <span className="text-[10px] text-on-surface-variant font-bold opacity-40">{n.time}</span>
                         </div>
                         <h4 className="font-bold text-sm">{n.title}</h4>
                         <p className="text-xs text-on-surface-variant leading-relaxed">{n.sub}</p>
                      </div>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-10 py-4 bg-surface-container-high rounded-xl border border-white/5 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/5 transition-all">
                All Activity History
              </button>
           </section>
        </aside>
      </div>
    </div>
  );
}
