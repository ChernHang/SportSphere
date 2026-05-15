import { useState } from 'react';
import { Search, Globe, ChevronRight, Zap, Play, ExternalLink, ShieldCheck, TrendingDown, Layers, Smartphone, Tv, Laptop, Sparkles, Radio } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { geminiService } from '../services/geminiService';
import { cn } from '../lib/utils';

export default function BroadcastGuide() {
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const findBestStream = async () => {
    setLoadingAi(true);
    try {
      const data = await geminiService.findStreaming(
        'United Kingdom',
        'iPhone 15 Pro, Smart TV',
        'Liverpool vs Arsenal',
        ['Sky Sports', 'BT Sport', 'beIN CONNECT', 'Now TV']
      );
      setRecommendation(data.recommendation);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="space-y-12 pb-32">
      <section className="pt-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="space-y-2 max-w-xl">
            <h1 className="text-5xl font-black tracking-tight text-on-surface">Broadcast Guide</h1>
            <p className="text-on-surface-variant font-medium">Find where your team is playing tonight across 40+ global streaming platforms.</p>
          </div>
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search matches, leagues, or platforms..."
              className="w-full bg-surface-container-low border border-outline-variant rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-medium text-on-surface"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 glass-card rounded-3xl overflow-hidden group cursor-pointer relative min-h-[380px] border border-white/5 shadow-2xl">
            <div className="absolute inset-0 z-0">
              <img 
                src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=1200" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                alt="Match"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-background/40 to-transparent"></div>
            </div>
            
            <div className="absolute top-6 left-6 flex gap-2">
              <div className="bg-secondary-container text-on-secondary-container px-4 py-1 rounded-full flex items-center gap-2 font-black text-xs">
                <span className="w-2 h-2 bg-white rounded-full live-pulse"></span> LIVE
              </div>
              <div className="bg-background/60 backdrop-blur-md text-on-surface px-4 py-1 rounded-full font-bold text-xs border border-white/10">
                Premier League
              </div>
            </div>

            <div className="absolute bottom-0 left-0 p-10 w-full">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                  <h3 className="text-4xl font-black text-white leading-none">Liverpool vs Arsenal</h3>
                  <p className="text-on-surface-variant max-w-sm font-medium">Streaming live on Sky Sports & beIN CONNECT. 2.4M people watching right now.</p>
                </div>
                <button 
                  onClick={findBestStream}
                  disabled={loadingAi}
                  className="bg-primary text-on-primary-container px-8 py-4 rounded-2xl font-black hover:shadow-[0_0_30px_rgba(56,189,248,0.5)] transition-all flex items-center gap-3 disabled:opacity-50"
                >
                  <Zap className={cn("w-5 h-5", loadingAi && "animate-spin")} />
                  {loadingAi ? 'AI Analyzing...' : 'Find Best Streaming Option'}
                </button>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 glass-card rounded-3xl p-8 flex flex-col justify-between border-primary/20 relative overflow-hidden">
             <div className="absolute -right-8 -top-8 text-primary/5">
                <Globe className="w-48 h-48" />
             </div>
             
             <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="text-primary font-black text-[10px] uppercase tracking-[0.3em]">Global Reach</span>
                  <Globe className="w-5 h-5 text-primary" />
                </div>
                <h4 className="text-2xl font-bold leading-tight">ESPN+ Expansion Tracker</h4>
                <p className="text-on-surface-variant text-sm leading-relaxed">Now available in 14 new territories with exclusive La Liga coverage starting this weekend.</p>
             </div>

             <div className="space-y-6 relative z-10">
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-on-surface-variant text-[10px] uppercase font-bold">User Growth</span>
                    <span className="text-primary font-black">+24%</span>
                  </div>
                  <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[85%] rounded-full shadow-[0_0_15px_rgba(56,189,248,0.6)]"></div>
                  </div>
                </div>
                <button className="w-full py-4 rounded-2xl border border-primary text-primary font-black text-xs hover:bg-primary/5 transition-all uppercase tracking-widest">Compare Subscription</button>
             </div>
          </div>
        </div>
      </section>

      {/* AI Recommendation Result */}
      <AnimatePresence>
        {recommendation && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-card rounded-3xl p-8 bg-primary-container/5 border-primary/20 relative">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Sparkles className="w-16 h-16 text-primary" />
              </div>
              <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                <div className="p-4 bg-primary/20 rounded-2xl">
                  <Tv className="w-10 h-10 text-primary" />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-2xl font-bold text-primary">Recommended Streaming Option</h3>
                      <div className="bg-primary/20 text-primary px-3 py-1 rounded-lg text-[10px] font-black uppercase">Ultra HD</div>
                    </div>
                    <p className="text-on-surface-variant leading-relaxed italic">
                      "{recommendation}"
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-4 pt-4 border-t border-white/5">
                     <div className="flex items-center gap-2 text-on-surface-variant">
                        <Smartphone className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Mobile App</span>
                     </div>
                     <div className="flex items-center gap-2 text-on-surface-variant">
                        <Tv className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Smart TV</span>
                     </div>
                     <div className="flex items-center gap-2 text-on-surface-variant">
                        <Laptop className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Web Portal</span>
                     </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button className="bg-primary text-on-primary-container px-8 py-3 rounded-xl font-bold text-sm shadow-lg hover:scale-105 transition-transform flex items-center gap-2">
                       Open Platform <ExternalLink className="w-4 h-4" />
                    </button>
                    <button className="px-8 py-3 border border-white/10 rounded-xl font-bold text-sm hover:bg-white/5 transition-colors">
                      Compare Platforms
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Platform List */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold">Popular Platforms</h3>
          <div className="flex gap-2">
            {['All', 'Sports Only', 'Free'].map((filter, i) => (
               <button key={i} className={cn(
                 "px-6 py-2 rounded-full text-xs font-bold transition-all border",
                 i === 0 ? "bg-primary/10 text-primary border-primary/20" : "bg-surface-container-high text-on-surface-variant border-outline-variant hover:border-primary/40"
               )}>
                 {filter}
               </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'DAZN', color: '#F8F8F8', text: 'black', tag: 'Global', desc: 'Boxing & MMA', icon: 'sports_mma' },
            { name: 'ESPN+', color: '#FF0000', text: 'white', tag: 'USA', desc: 'NBA & MLB', icon: 'sports_basketball' },
            { name: 'YouTube', color: '#FFFFFF', text: 'red-600', tag: 'Free Tier', desc: 'Highlights & Clips', icon: 'play_circle' },
            { name: 'beIN', color: '#4D004D', text: '#FFD700', tag: 'MENA/FR', desc: 'Champions League', icon: 'sports_soccer' },
          ].map((platform, i) => (
            <div key={i} className="glass-card rounded-2xl p-6 group hover:border-primary/30 transition-all duration-300 flex flex-col justify-between min-h-[280px]">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg italic tracking-tighter shadow-lg"
                    style={{ backgroundColor: platform.color, color: platform.text }}
                  >
                    {platform.name === 'YouTube' ? <Play className="fill-red-600 text-red-600" /> : platform.name}
                  </div>
                  <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full uppercase font-black">
                    {platform.tag}
                  </span>
                </div>
                <h4 className="font-bold text-lg mb-2">{platform.desc}</h4>
                <div className="flex gap-3 mb-6 opacity-40 group-hover:opacity-100 transition-opacity">
                  <Smartphone className="w-4 h-4" />
                  <Tv className="w-4 h-4" />
                  <Laptop className="w-4 h-4" />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="pt-4 border-t border-white/5">
                   <p className="text-[10px] text-on-surface-variant font-bold uppercase mb-2">Currently Live</p>
                   <div className="flex items-center gap-2 text-xs font-bold">
                      <span className="w-2 h-2 rounded-full bg-secondary live-pulse"></span>
                      Event in progress
                   </div>
                </div>
                <button className="w-full py-3 rounded-xl bg-surface-container-highest font-bold text-xs group-hover:bg-primary group-hover:text-on-primary-container transition-all flex items-center justify-center gap-2">
                  Visit Platform
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Banner */}
      <section className="relative rounded-[2.5rem] overflow-hidden p-12 lg:p-20 border border-primary/20 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background z-0"></div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-5xl font-black text-white leading-tight">Confused about which subscription to get?</h2>
            <p className="text-on-surface-variant text-xl leading-relaxed max-w-lg font-medium">Our smart comparison tool analyzes your favorite teams and leagues to find the most cost-effective platform bundle for your region.</p>
            <div className="flex flex-wrap gap-4">
              <button className="px-10 py-5 bg-primary text-on-primary-container font-black rounded-2xl shadow-[0_0_30px_rgba(56,189,248,0.4)] hover:scale-105 transition-transform text-sm uppercase tracking-widest">Start Comparison</button>
              <button className="px-10 py-5 border border-outline-variant text-on-surface font-black rounded-2xl hover:bg-white/5 transition-colors text-sm uppercase tracking-widest">See Pricing</button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Zap, label: 'Save 30%', sub: 'On annual bundles' },
              { icon: ShieldCheck, label: 'Verified Links', sub: 'Safe & Secure' },
              { icon: Layers, label: 'Global Coverage', sub: '40+ Platforms' },
              { icon: Radio, label: 'Live Data', sub: 'Updated instantly' }
            ].map((feature, i) => (
              <div key={i} className="glass-card p-8 rounded-3xl border-white/5 text-center flex flex-col items-center gap-3">
                <feature.icon className="text-primary w-10 h-10" />
                <div>
                  <h5 className="font-black text-lg">{feature.label}</h5>
                  <p className="text-xs text-on-surface-variant font-medium">{feature.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
