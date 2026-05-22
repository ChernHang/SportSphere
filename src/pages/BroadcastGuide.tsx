import { mockMatches } from '../data/mockMatches';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Globe, ChevronRight, Zap, Play, ExternalLink, ShieldCheck, TrendingDown, Layers, Smartphone, Tv, Laptop, Sparkles, Radio, Check, X, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { geminiService } from '../services/geminiService';
import { cn } from '../lib/utils';
import regeneratedImage1779435259953 from '../assets/images/regenerated_image_1779435259953.jpg';

export default function BroadcastGuide() {
  const [searchParams] = useSearchParams();
  const [recommendation, setRecommendation] = useState<Record<string, string>>({});
  const [loadingAi, setLoadingAi] = useState<Record<string, boolean>>({});
  const [country, setCountry] = useState('United Kingdom');
  const [device, setDevice] = useState('Smart TV & Mobile');
  const [categoryChoice, setCategoryChoice] = useState('All');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  
  useEffect(() => {
    const q = searchParams.get('search');
    if (q) setSearchTerm(q);
  }, [searchParams]);
  
  // Custom states
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'Paid' | 'Free'>('Paid');
  const [visitingPlatform, setVisitingPlatform] = useState<string | null>(null);

  const [preferredPlatform, setPreferredPlatform] = useState(() => {
    return localStorage.getItem('sportsphere_preferred_platform') || 'Sky Sports';
  });
  const [showComparison, setShowComparison] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const findBestStream = async (matchName: string) => {
    setLoadingAi(p => ({ ...p, [matchName]: true }));
    try {
      const data = await geminiService.findStreaming(
        country,
        device,
        matchName,
        ['Sky Sports', 'ESPN+', 'beIN SPORTS', 'DAZN', 'TNT Sports', 'YouTube TV']
      );
      setRecommendation(p => ({ ...p, [matchName]: data.recommendation }));
      showToast(`Found broadcast for ${matchName}!`);
    } catch (error) {
      console.error(error);
      showToast("Analytic discovery failed. Please retry.");
    } finally {
      setLoadingAi(p => ({ ...p, [matchName]: false }));
    }
  };

  const handleSavePref = (platform: string) => {
    setPreferredPlatform(platform);
    localStorage.setItem('sportsphere_preferred_platform', platform);
    showToast(`Set "${platform}" as your default broadcaster!`);
  };

  const handleVisitPlatform = (platform: string) => {
    setVisitingPlatform(platform);
    showToast(`Negotiating digital stream link with ${platform}...`);
    setTimeout(() => {
      setVisitingPlatform(null);
      showToast(`Connected to legal ${platform} lobby. Video initialized!`);
    }, 2800);
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-medium text-on-surface"
            />
          </div>
        </div>

        {/* Dynamic Selectors for custom search */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-6 bg-surface-container-low border border-white/5 rounded-3xl relative z-10">
          <div>
            <label className="block text-[10px] text-on-surface-variant uppercase font-black tracking-widest mb-2">Region / Territory</label>
            <select 
              value={country} 
              onChange={(e) => setCountry(e.target.value)}
              className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-3 rounded-xl text-xs font-bold text-sky-400 focus:outline-none focus:border-primary"
            >
              <option value="United Kingdom">United Kingdom (UK)</option>
              <option value="United States">United States (USA)</option>
              <option value="Spain">Spain (ES)</option>
              <option value="Germany">Germany (DE)</option>
              <option value="Canada">Canada (CA)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-on-surface-variant uppercase font-black tracking-widest mb-2">Streaming Device</label>
            <select 
              value={device} 
              onChange={(e) => setDevice(e.target.value)}
              className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-3 rounded-xl text-xs font-bold text-sky-400 focus:outline-none focus:border-primary"
            >
              <option value="Smart TV & Mobile">Smart TV & Mobile App</option>
              <option value="Desktop Web Browser">Desktop Web Browser</option>
              <option value="Apple TV / Console">Apple TV / Game Console</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-on-surface-variant uppercase font-black tracking-widest mb-2">Category of Sports Event</label>
            <select 
              value={categoryChoice} 
              onChange={(e) => setCategoryChoice(e.target.value)}
              className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-3 rounded-xl text-xs font-bold text-sky-400 focus:outline-none focus:border-primary"
            >
              <option value="All">All Categories</option>
              <option value="football">Football</option>
              <option value="basketball">Basketball</option>
              <option value="tennis">Tennis</option>
              <option value="f1">Formula 1</option>
              <option value="esports">eSports</option>
            </select>
          </div>
        </div>

        <div className="space-y-6">
          {mockMatches.filter(m => {
              const matchesCategory = categoryChoice === 'All' || m.genre === categoryChoice;
              const term = searchTerm.toLowerCase();
              const matchesSearch = term === '' || 
                  m.teamA.toLowerCase().includes(term) || 
                  m.teamB.toLowerCase().includes(term) ||
                  m.tournament.toLowerCase().includes(term);
              return matchesCategory && matchesSearch;
          }).map(match => (
            <div key={match.id} className="glass-card rounded-3xl p-6 border border-white/5 flex flex-col md:flex-row gap-6 items-center md:items-start group">
              <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden shrink-0 relative bg-surface-container">
                <img 
                  src={match.banner || regeneratedImage1779435259953} 
                  alt={`${match.teamA} vs ${match.teamB}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {match.startTime === 'LIVE' && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded flex items-center gap-1.5">
                     <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span> LIVE
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-4 text-center md:text-left w-full relative">
                <div>
                  <h3 className="text-2xl font-black text-white">{match.teamA} vs {match.teamB}</h3>
                  <p className="text-sm font-bold text-sky-400">{match.tournament} • {match.date || 'Today'}</p>
                </div>
                
                <AnimatePresence>
                  {recommendation[match.teamA] && (
                    <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} className="bg-sky-500/10 border border-sky-400/20 p-4 rounded-xl text-sm font-medium text-sky-100 flex flex-col gap-2">
                      <div>
                        <Sparkles className="w-4 h-4 text-sky-400 inline mr-2" />
                        {recommendation[match.teamA]}
                      </div>
                      <div className="bg-surface-container border border-white/5 p-3 rounded-lg flex items-center justify-between">
                         <span className="text-xs text-on-surface-variant font-bold uppercase">Recommended Platform</span>
                         <span className="text-sm font-black text-white px-3 py-1 bg-primary/20 rounded border border-primary/30">
                            {recommendation[match.teamA].includes('Sky') ? 'Sky Sports' : recommendation[match.teamA].includes('ESPN') ? 'ESPN+' : recommendation[match.teamA].includes('beIN') ? 'beIN SPORTS' : 'DAZN'}
                         </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button 
                    onClick={() => findBestStream(match.teamA)}
                    disabled={loadingAi[match.teamA]}
                    className="bg-primary hover:bg-sky-450 text-on-primary-container px-6 py-3 rounded-xl font-bold transition-all shadow-lg text-xs flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    <Zap className={cn("w-4 h-4", loadingAi[match.teamA] && "animate-spin")} />
                    {loadingAi[match.teamA] ? 'Analyzing Broadcasts...' : 'Find Best Streaming Option'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Platform List */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-white">Popular Platforms</h3>
          <div className="flex gap-2">
            {(['All', 'Paid', 'Free'] as const).map((filter) => (
               <button 
                 key={filter} 
                 onClick={() => {
                   setActiveFilter(filter);
                   showToast(`Filtering broadcasters by style: ${filter}`);
                 }}
                 className={cn(
                   "px-6 py-2 rounded-full text-xs font-bold transition-all border",
                   activeFilter === filter 
                     ? "bg-sky-500/10 text-sky-400 border-sky-500/30" 
                     : "bg-surface-container-high text-on-surface-variant border-outline-variant hover:border-white/10"
                 )}
               >
                 {filter}
               </button>
            ))}
          </div>
        </div>
 
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'DAZN', color: '#F8F8F8', text: 'black', tag: 'Global', desc: 'Boxing & MMA', type: 'Paid', url: 'https://www.dazn.com' },
            { name: 'ESPN+', color: '#FF0000', text: 'white', tag: 'USA', desc: 'NBA & MLB', type: 'Paid', url: 'https://plus.espn.com' },
            { name: 'YouTube', color: '#000000', text: '#FF0000', tag: 'Free Tier', desc: 'Highlights & Clips', type: 'Free', url: 'https://youtube.com' },
            { name: 'beIN', color: '#4D004D', text: '#FFD700', tag: 'MENA/FR', desc: 'Champions League', type: 'Paid', url: 'https://beinsports.com' },
          ]
          .filter(p => activeFilter === 'All' || (activeFilter === 'Paid' && p.type === 'Paid') || (activeFilter === 'Free' && p.type === 'Free'))
          .map((platform, i) => (
            <div key={i} className="glass-card rounded-2xl p-6 group hover:border-sky-500/30 transition-all duration-300 flex flex-col justify-between min-h-[280px] bg-slate-900/30 border border-white/5">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg italic tracking-tighter shadow-lg border border-white/10"
                    style={{ backgroundColor: platform.color, color: platform.text }}
                  >
                    {platform.name === 'YouTube' ? <Play className="fill-red-650 text-red-650 animate-bounce" /> : platform.name}
                  </div>
                  <span className="text-[10px] bg-sky-500/15 text-sky-400 border border-sky-400/20 px-3 py-1 rounded-full uppercase font-black">
                    {platform.tag}
                  </span>
                </div>
                <h4 className="font-bold text-lg mb-2 text-white">{platform.desc}</h4>
                <div className="flex gap-3 mb-6 opacity-40 group-hover:opacity-100 transition-opacity text-sky-400">
                  <Smartphone className="w-4 h-4" />
                  <Tv className="w-4 h-4" />
                  <Laptop className="w-4 h-4" />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="pt-4 border-t border-white/5">
                   <span className="text-[10px] text-on-surface-variant font-bold uppercase mb-2 block">Currently Live</span>
                   <div className="flex items-center gap-2 text-xs font-bold text-teal-400">
                      <span className="w-2 h-2 rounded-full bg-teal-400 live-pulse animate-ping"></span>
                      Event in progress
                   </div>
                </div>
                <a 
                  href={platform.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => handleVisitPlatform(platform.name)}
                  className="w-full py-3 rounded-xl bg-surface-container-highest border border-white/5 font-bold text-xs group-hover:bg-sky-500 group-hover:text-on-primary-container transition-all flex items-center justify-center gap-2 active:scale-95 text-white"
                >
                  Visit Platform
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
 
      {/* Comparison Banner */}
      <section className="relative rounded-[2.5rem] overflow-hidden p-8 lg:p-12 border border-sky-500/15 shadow-2xl bg-sky-950/10 flex flex-col gap-12">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 via-background to-background z-0"></div>
        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto space-y-8">
          <h2 className="text-5xl font-black text-white leading-tight">Confused about which subscription to get?</h2>
          <p className="text-on-surface-variant text-xl leading-relaxed font-medium">Our smart comparison tool analyzes your favorite teams and leagues to find the most cost-effective platform bundle for your region.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => {
                setShowComparison(true);
                showToast("Platform comparison matrix activated!");
              }}
              className="px-10 py-5 bg-primary hover:bg-sky-450 text-on-primary-container font-black rounded-2xl shadow-[0_0_30px_rgba(56,189,248,0.4)] hover:scale-105 transition-transform text-sm uppercase tracking-widest active:scale-95"
            >
              Start Comparison
            </button>
            <button 
              onClick={() => {
                setShowComparison(true);
                showToast("Opening latency and subscription rates specs table...");
              }}
              className="px-10 py-5 border border-outline-variant text-on-surface hover:text-sky-400 font-black rounded-2xl hover:bg-white/5 transition-colors text-sm uppercase tracking-widest active:scale-95"
            >
              See Pricing Table
            </button>
          </div>
        </div>

        {/* Side-by-Side Comparison Matrix */}
        <div className="relative z-10 w-full">
          <AnimatePresence>
            {showComparison && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-surface-container-low rounded-3xl p-8 border border-white/10 space-y-6 overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div>
                    <h3 className="text-2xl font-black text-on-surface">Compare Platform Specs Side-by-Side</h3>
                    <p className="text-xs text-on-surface-variant mt-1">Get precise breakdowns of monthly cost, feed delays, resolutions and device compliance.</p>
                  </div>
                  <span className="bg-sky-500/15 text-sky-400 border border-sky-400/20 px-3 py-1 rounded-full text-[10px] font-bold">Latency Adjusted</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-[10px] uppercase font-black text-on-surface-variant tracking-wider">
                        <th className="pb-4 pr-4">Provider</th>
                        <th className="pb-4 px-4 text-center">Monthly Fee</th>
                        <th className="pb-4 px-4 text-center">Latency Delay</th>
                        <th className="pb-4 px-4 text-center">Max Res</th>
                        <th className="pb-4 px-4 text-center">Multi device support</th>
                        <th className="pb-4 pl-4 text-right">Tailoring</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {[
                        { name: 'Sky Sports', price: '£22.00', latency: '4.2s (Ultra-low)', res: '4K UHD', multi: 'Yes (3 Screens)' },
                        { name: 'ESPN+', price: '$10.99', latency: '8.1s (Medium)', res: '1080p HD', multi: 'Yes (5 Screens)' },
                        { name: 'beIN SPORTS', price: '€14.99', latency: '5.5s (Low)', res: '1080p HD', multi: 'Yes (2 Screens)' },
                        { name: 'DAZN', price: '$19.99', latency: '12.0s', res: '1080p HD', multi: 'Yes (2 Screens)' },
                        { name: 'TNT Sports', price: '£29.99', latency: '6.0s (Low)', res: '4K UHD', multi: 'Yes (4 Screens)' }
                      ].map((row) => (
                        <tr key={row.name} className="hover:bg-white/5 transition-colors">
                          <td className="py-4 pr-4 font-black text-on-surface">
                            {row.name}
                            {preferredPlatform === row.name && (
                              <span className="ml-2 inline-block bg-primary/20 text-primary border border-primary/20 rounded px-1.5 py-0.5 text-[9px] font-bold">
                                PREFERRED
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-4 text-center font-mono text-xs">{row.price}</td>
                          <td className="py-4 px-4 text-center text-xs text-sky-400 font-bold">{row.latency}</td>
                          <td className="py-4 px-4 text-center text-xs text-on-surface-variant">{row.res}</td>
                          <td className="py-4 px-4 text-center text-xs text-on-surface-variant">{row.multi}</td>
                          <td className="py-4 pl-4 text-right">
                            <button 
                              onClick={() => handleSavePref(row.name)}
                              className={cn(
                                "px-3 py-1.5 text-[10px] font-bold uppercase rounded-lg active:scale-95 transition-all border",
                                preferredPlatform === row.name 
                                  ? "bg-sky-500/10 text-sky-400 border-sky-400/40" 
                                  : "bg-surface-container hover:bg-white/5 text-on-surface-variant border-transparent"
                              )}
                            >
                              {preferredPlatform === row.name ? 'Preferred' : 'Set default'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Feature Cards Grid (Moved to bottom of section) */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-white/5 mt-8">
          {[
            { icon: Zap, label: 'Save 30%', sub: 'On annual bundles' },
            { icon: ShieldCheck, label: 'Verified Links', sub: 'Safe & Secure' },
            { icon: Layers, label: 'Global Coverage', sub: '40+ Platforms' },
            { icon: Radio, label: 'Live Data', sub: 'Updated instantly' }
          ].map((feature, i) => (
            <div key={i} className="glass-card p-8 rounded-3xl border border-white/5 text-center flex flex-col items-center gap-3 bg-slate-900/40">
              <feature.icon className="text-sky-400 w-10 h-10 animate-pulse" />
              <div>
                <h5 className="font-black text-lg text-white">{feature.label}</h5>
                <p className="text-xs text-on-surface-variant font-medium">{feature.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Visiting platform lobby buffer loader overlay */}
      <AnimatePresence>
        {visitingPlatform && (
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
                  <Play className="w-6 h-6 text-sky-450 fill-sky-450 animate-pulse" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Redirecting to verified broadcast lobby...</h3>
                <p className="text-xs text-on-surface-variant mt-2 font-medium">Securing authorized streaming pipeline on <span className="font-bold text-sky-400 block mt-1">{visitingPlatform}</span></p>
                <button
                  onClick={() => setVisitingPlatform(null)}
                  className="mt-6 px-4 py-2 border border-white/10 hover:bg-white/5 rounded-xl text-xs text-on-surface-variant font-bold transition-all"
                >
                  Cancel Connection
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Interactive Toast alerts */}
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
