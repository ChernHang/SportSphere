import { useState } from 'react';
import { Calendar, Filter, Globe, ChevronRight, Zap, TrendingUp, AlertTriangle, BookOpen, Sparkles, Bell, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { mockMatches } from '../data/mockMatches';
import { geminiService } from '../services/geminiService';
import { cn } from '../lib/utils';

export default function Schedule() {
  const [selectedMatchForAi, setSelectedMatchForAi] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<any | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const analyzeMatch = async (match: any) => {
    setSelectedMatchForAi(match.id);
    setPrediction(null);
    setLoadingAi(true);
    try {
      const data = await geminiService.predictExcitement({
        teamA: match.teamA,
        teamB: match.teamB,
        rankings: 'Top 10 vs Top 15', // Mocked rankings
        form: 'WWDLW vs LWWWD', // Mocked form
        stage: match.league,
        history: 'Intense rivalry over 50 years'
      });
      setPrediction(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="space-y-8 pb-32">
      {/* Date Selector */}
      <section className="mt-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">Sports Schedule</h1>
          <span className="text-xs text-primary flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            Auto-converted to GMT-5
          </span>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
          {['MON 18', 'TUE 19', 'WED 20', 'THU 21', 'FRI 22', 'SAT 23', 'SUN 24'].map((day, i) => (
            <button 
              key={i} 
              className={cn(
                "flex flex-col items-center justify-center min-w-[64px] py-4 rounded-2xl glass-card transition-all",
                i === 3 ? "bg-primary text-on-primary-container border-none shadow-[0_0_15px_rgba(56,189,248,0.4)]" : "text-on-surface-variant hover:border-primary/40"
              )}
            >
              <span className="text-[10px] font-bold uppercase">{day.split(' ')[0]}</span>
              <span className="text-xl font-bold">{day.split(' ')[1]}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Filters */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex gap-2 flex-wrap">
          <div className="relative group">
            <select className="appearance-none bg-surface-container-high border border-outline-variant text-on-surface rounded-full px-6 py-2 pr-10 focus:border-primary focus:ring-0 text-sm font-bold">
              <option>All Sports</option>
              <option>Football</option>
              <option>Basketball</option>
              <option>Tennis</option>
            </select>
            <Filter className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant" />
          </div>
          <div className="relative group">
            <select className="appearance-none bg-surface-container-high border border-outline-variant text-on-surface rounded-full px-6 py-2 pr-10 focus:border-primary focus:ring-0 text-sm font-bold">
              <option>Global</option>
              <option>USA</option>
              <option>Europe</option>
            </select>
            <Globe className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold">Only Live</span>
          <div className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-12">
          {['Morning', 'Afternoon'].map((period) => (
             <section key={period}>
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-xl font-bold text-on-surface-variant">{period}</h2>
                <div className="h-px flex-1 bg-white/5"></div>
              </div>
              
              <div className="space-y-4">
                {mockMatches.slice(0, 2).map((match) => (
                  <div key={match.id} className="glass-card rounded-2xl p-6 group hover:border-primary/30 transition-all duration-300">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                           {match.startTime === 'LIVE' ? (
                             <span className="bg-secondary-container text-on-secondary-container text-[10px] px-2 py-0.5 rounded flex items-center gap-1 font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-white live-pulse"></span>
                                LIVE
                             </span>
                           ) : (
                             <span className="text-on-surface-variant text-[10px] font-bold">{match.startTime}</span>
                           )}
                           <span className="text-on-surface-variant text-[10px] font-bold">• {match.tournament} • {match.league}</span>
                        </div>
                        
                        <div className="flex items-center justify-between md:justify-start md:gap-16 py-4">
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-14 h-14 bg-surface-container rounded-full border border-white/5 flex items-center justify-center">
                               <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${match.teamA}`} className="w-8 h-8 opacity-80" alt={match.teamA} />
                            </div>
                            <span className="font-bold text-sm tracking-tight">{match.teamA}</span>
                          </div>
                          
                          <div className="flex flex-col items-center">
                            <span className="text-2xl font-bold text-primary tracking-widest">{match.score === 'VS' ? 'VS' : match.score}</span>
                            {match.startTime === 'LIVE' && <span className="text-on-surface-variant text-[10px] mt-1 font-bold">68'</span>}
                          </div>

                          <div className="flex flex-col items-center gap-2">
                            <div className="w-14 h-14 bg-surface-container rounded-full border border-white/5 flex items-center justify-center">
                               <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${match.teamB}`} className="w-8 h-8 opacity-80" alt={match.teamB} />
                            </div>
                            <span className="font-bold text-sm tracking-tight">{match.teamB}</span>
                          </div>
                        </div>
                      </div>

                      <div className="md:w-56 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-6 flex flex-col justify-between">
                        <div className="space-y-4">
                          <button 
                            onClick={() => analyzeMatch(match)}
                            className="w-full flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 rounded-xl text-xs font-bold text-primary hover:bg-primary/20 transition-all"
                          >
                            <Zap className="w-3.5 h-3.5" />
                            Analyse Match Excitement
                          </button>
                          
                          <AnimatePresence>
                            {selectedMatchForAi === match.id && (
                              <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                              >
                                {loadingAi ? (
                                  <div className="flex items-center gap-2 py-2">
                                    <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                                    <span className="text-[10px] text-on-surface-variant">Thinking...</span>
                                  </div>
                                ) : prediction && (
                                  <div className="space-y-3 pt-2">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] text-on-surface-variant uppercase font-bold">Excitement</span>
                                      <span className="text-xs font-bold text-primary">{prediction.excitementScore}/10</span>
                                    </div>
                                    <div className="flex gap-1.5">
                                      <div className={cn(
                                        "px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1",
                                        prediction.upsetPotential === 'high' ? "bg-error/20 text-error" : "bg-primary/20 text-primary"
                                      )}>
                                        <TrendingUp className="w-3 h-3" />
                                        {prediction.competitiveness}
                                      </div>
                                      <div className="bg-secondary/20 text-secondary px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                                        <AlertTriangle className="w-3 h-3" />
                                        Upset: {prediction.upsetPotential}
                                      </div>
                                    </div>
                                    <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                                      <div className="flex items-center gap-1.5 mb-1 text-primary">
                                        <BookOpen className="w-3 h-3" />
                                        <span className="text-[10px] font-bold uppercase">Storyline</span>
                                      </div>
                                      <p className="text-[10px] text-on-surface-variant leading-relaxed line-clamp-2">
                                        {prediction.storyline}
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <button className="text-on-surface-variant hover:text-primary transition-all">
                            <Bell className="w-4 h-4" />
                          </button>
                          <button className="text-on-surface-variant hover:text-primary transition-all">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-xs font-bold text-primary flex items-center gap-2 uppercase tracking-widest mb-6">
              <TrendingUp className="w-4 h-4" />
              Trending Games
            </h3>
            <div className="space-y-6">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center gap-4 p-2 rounded-xl hover:bg-white/5 transition-all cursor-pointer group">
                  <div className="flex -space-x-4">
                    <div className="w-10 h-10 rounded-full border-2 border-background overflow-hidden bg-surface-container">
                      <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=t${i}a`} alt="team" />
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-background overflow-hidden bg-surface-container">
                      <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=t${i}b`} alt="team" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold group-hover:text-primary transition-colors">Warriors vs Suns</p>
                    <p className="text-[10px] text-on-surface-variant">154K watching now</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-on-surface-variant group-hover:translate-x-1 transition-transform" />
                </div>
              ))}
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden h-48 group cursor-pointer border border-white/5">
             <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10"></div>
             <img 
               src="https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&q=80&w=600" 
               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
               alt="Super Bowl"
             />
             <div className="absolute bottom-4 left-4 z-20">
               <span className="text-[10px] font-bold bg-primary/20 text-primary px-2 py-0.5 rounded backdrop-blur-md mb-2 inline-block">AD • FEATURED EVENT</span>
               <h4 className="text-xl font-bold text-white">Super Bowl LVIII</h4>
               <p className="text-[10px] text-on-surface-variant">Get tickets & live stream access</p>
             </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
