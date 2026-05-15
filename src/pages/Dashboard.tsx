import { useState, useEffect } from 'react';
import { Radio, Users, Trophy, Star, Sparkles, Plus, Bell, Play, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { geminiService } from '../services/geminiService';
import { Recommendation, UserPreferences } from '../types';
import { mockMatches } from '../data/mockMatches';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const fetchRecommendations = async () => {
    setLoadingAi(true);
    try {
      const userPrefs: UserPreferences = {
        favouriteSports: ['Football', 'Basketball'],
        favouriteTeams: ['Real Madrid', 'Lakers']
      };
      const data = await geminiService.recommendGames(userPrefs, mockMatches);
      setRecommendations(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="space-y-8 pb-32">
      {/* Bento Grid Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Live Matches', value: '24', icon: Radio, sub: 'Active tournaments' },
          { label: 'Your Teams', value: '3', icon: Users, sub: 'Playing today' },
          { label: 'Major Finals', value: '02', icon: Trophy, sub: 'Critical', alert: true },
          { label: 'Watchlist', value: '18', icon: Star, sub: 'Pinned events', fill: true },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6 rounded-2xl flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-on-surface-variant text-xs font-bold uppercase tracking-widest">{stat.label}</span>
              <stat.icon className="text-primary w-5 h-5" fill={stat.fill ? "currentColor" : "none"} />
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className={stat.alert ? "text-3xl font-bold flex items-center gap-2 text-on-surface" : "text-3xl font-bold text-primary"}>
                {stat.value}
              </span>
              {stat.alert && <span className="bg-secondary-container text-on-secondary-container text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Critical</span>}
            </div>
            <p className="text-xs text-on-surface-variant mt-1">{stat.sub}</p>
          </div>
        ))}
      </section>

      {/* Categories */}
      <nav className="flex items-center gap-4 overflow-x-auto pb-2 no-scrollbar ">
        {['Football', 'Basketball', 'Tennis', 'Formula 1', 'Cricket', 'eSports'].map((cat, i) => (
          <button key={i} className={`flex-shrink-0 px-6 py-2 rounded-full font-bold transition-all transition-all ${i === 0 ? 'bg-primary text-on-primary-container' : 'bg-surface-container-high text-on-surface-variant hover:text-primary'}`}>
            {cat}
          </button>
        ))}
      </nav>

      {/* Recommendations engine */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Recommended Matches
          </h3>
          <button 
            onClick={fetchRecommendations}
            disabled={loadingAi}
            className="text-primary text-sm font-bold hover:underline disabled:opacity-50"
          >
            {loadingAi ? 'Calculating...' : 'Recommend Games Tonight'}
          </button>
        </div>

        <AnimatePresence>
          {loadingAi && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass-card p-8 rounded-2xl flex flex-col items-center justify-center text-center space-y-4"
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-primary">Generating Insights...</p>
                <p className="text-xs text-on-surface-variant">Analyzing your interests and tonight's line-up</p>
              </div>
            </motion.div>
          )}

          {recommendations && !loadingAi && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {recommendations.map((rec, i) => (
                <div key={i} className="glass-card p-5 rounded-2xl group transition-all duration-300">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-lg">{rec.match}</h4>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-primary font-bold uppercase">Hype</span>
                      <div className="w-12 h-1.5 bg-surface-container rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${rec.hypeLevel * 10}%` }}></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-on-surface-variant mb-4 min-h-[40px] leading-relaxed">
                    {rec.reason}
                  </p>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-primary text-on-primary text-sm font-bold py-2 rounded-xl active:scale-95 transition-all">Watch Live</button>
                    <button className="px-3 border border-primary/20 text-primary rounded-xl hover:bg-primary/10 transition-all">
                      <Bell className="w-4 h-4" />
                    </button>
                    <button className="px-3 border border-white/10 text-on-surface-variant rounded-xl hover:bg-white/5 transition-all">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Main Match Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockMatches.map((match) => (
          <article key={match.id} className="glass-card rounded-2xl overflow-hidden group">
            <div className="relative h-48 w-full overflow-hidden">
              <img 
                alt={`${match.teamA} vs ${match.teamB}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                src={`https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800`} 
              />
              {match.startTime === 'LIVE' && (
                <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2 py-1 bg-error-container/90 rounded-lg text-white font-bold text-[10px]">
                  <span className="w-2 h-2 rounded-full bg-error live-pulse"></span>
                  LIVE
                </div>
              )}
              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] text-on-surface font-bold uppercase tracking-widest border border-white/10">
                {match.tournament}
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-center mb-6">
                <div className="flex flex-col items-center gap-2 flex-1">
                   <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center border border-white/5">
                    <Shield className="w-6 h-6 text-white" />
                   </div>
                   <span className="font-bold text-sm text-center">{match.teamA}</span>
                </div>
                
                <div className="flex flex-col items-center px-4">
                  <span className="text-2xl font-bold text-primary">{match.score}</span>
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant">{match.startTime}</span>
                </div>

                <div className="flex flex-col items-center gap-2 flex-1">
                   <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center border border-white/5">
                    <Shield className="w-6 h-6 text-white" />
                   </div>
                   <span className="font-bold text-sm text-center">{match.teamB}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Link 
                  to={`/match/${match.id}`}
                  className="flex-1 bg-primary text-on-primary text-center font-bold py-2 rounded-xl active:scale-95 transition-all text-sm"
                >
                  Match Insights
                </Link>
                <button className="w-10 flex items-center justify-center border border-primary/20 text-primary rounded-xl hover:bg-primary/10 transition-all">
                  <Star className="w-4 h-4" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Watchlist Insights */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">
        <div className="lg:col-span-8 glass-card rounded-3xl p-6 flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1">
            <span className="text-secondary font-bold uppercase text-[10px] tracking-[0.2em] mb-2 block">Breaking News</span>
            <h2 className="text-2xl font-bold mb-2">Transfer Window Closes: Final Hour Highlights</h2>
            <p className="text-on-surface-variant mb-6 text-sm">See all the last-minute deals that happened in the final 60 minutes of the summer window. Expert analysis and team grades included.</p>
            <button className="px-6 py-2 bg-surface-container-high border border-white/10 rounded-xl font-bold hover:bg-white/5 transition-all text-sm">Read Full Report</button>
          </div>
          <div className="w-full md:w-64 h-48 rounded-xl overflow-hidden">
            <img 
              alt="Sports News" 
              className="w-full h-full object-cover" 
              src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=600" 
            />
          </div>
        </div>

        <div className="lg:col-span-4 glass-card rounded-3xl p-6 bg-primary-container/10 border-primary-container/20">
          <h3 className="text-xl font-bold text-primary mb-6">Watchlist Insights</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-surface-variant flex items-center justify-center">
                <Radio className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-bold text-sm">UFC 300: Main Event</p>
                <p className="text-xs text-on-surface-variant">Added by 12.5k fans today</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-surface-variant flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-bold text-sm">Wimbledon Quarter Finals</p>
                <p className="text-xs text-on-surface-variant">Alert set for 14:00 GMT</p>
              </div>
            </div>
          </div>
          <button className="w-full mt-8 py-3 bg-primary text-on-primary-container font-bold rounded-xl active:scale-95 transition-all text-sm">View All Watchlist</button>
        </div>
      </section>
    </div>
  );
}
