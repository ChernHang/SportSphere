import { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Settings, 
  Database, 
  Activity, 
  Lock, 
  Search, 
  UserPlus, 
  ShieldAlert, 
  MoreVertical,
  ChevronRight,
  Zap,
  Globe,
  LogOut,
  Trophy,
  Tv,
  BarChart3,
  FileText
} from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';
import { useAuth } from '../components/auth/AuthProvider';

interface UserProfile {
  id: string;
  full_name: string;
  username: string;
  role: string;
  avatar_url: string;
  updated_at: string;
}

export default function AdminDashboard() {
  const { signOut } = useAuth();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'matches' | 'streaming' | 'analytics' | 'settings' | 'logs'>('users');

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (data) setProfiles(data);
    setLoading(false);
  };

  const toggleAdmin = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);
    
    if (!error) {
      setProfiles(profiles.map(p => p.id === userId ? { ...p, role: newRole } : p));
    }
  };

  const filtered = profiles.filter(p => 
    p.full_name?.toLowerCase().includes(search.toLowerCase()) || 
    p.username?.toLowerCase().includes(search.toLowerCase())
  );

  const adminColor = "#2eb774";

  return (
    <div className="space-y-8 pb-32 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 pt-4">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="bg-[#2eb774]/10 p-3 rounded-[1.2rem] border border-[#2eb774]/20">
              <ShieldCheck className="w-8 h-8 text-[#2eb774]" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter uppercase italic">Control Panel</h1>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#2eb774] animate-pulse"></span>
                <p className="text-[10px] font-black uppercase text-[#2eb774] tracking-widest">System Operational • Root Access</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
            <button 
              onClick={() => signOut()}
              className="bg-error/10 text-error px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-error/20 transition-all flex items-center gap-2 border border-error/20"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-white/5 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all text-on-surface border border-white/5"
            >
              Exit Dashboard
            </button>
        </div>
      </header>

      {/* Admin Tabs */}
      <nav className="flex flex-wrap gap-2 bg-surface-container-low p-1.5 rounded-[1.5rem] w-full lg:w-fit border border-white/5">
        {[
          { id: 'users', label: 'Users', icon: Users },
          { id: 'matches', label: 'Matches', icon: Trophy },
          { id: 'streaming', label: 'Platforms', icon: Tv },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'settings', label: 'Config', icon: Settings },
          { id: 'logs', label: 'Logs', icon: Activity },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-3 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all white-space-nowrap",
              activeTab === tab.id 
                ? "bg-[#2eb774] text-black shadow-[0_0_20px_rgba(46,183,116,0.3)]" 
                : "text-on-surface-variant hover:text-white hover:bg-white/5"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </nav>

      {activeTab === 'users' && (
        <motion.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Network Population', value: profiles.length.toString(), icon: Users, accent: '#2eb774' },
              { label: 'Authorized Admins', value: profiles.filter(p => p.role === 'admin').length.toString(), icon: ShieldCheck, accent: '#2eb774' },
              { label: 'Platform Uptime', value: '100%', icon: Activity, accent: '#2eb774' },
              { label: 'Data Latency', value: '42ms', icon: Globe, accent: '#2eb774' },
            ].map((stat, i) => (
              <div key={i} className="glass-card p-6 rounded-[2rem] border-white/5 group hover:border-[#2eb774]/30 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[9px] font-black uppercase text-on-surface-variant tracking-[0.2em]">{stat.label}</span>
                  <div className="bg-[#2eb774]/10 p-2 rounded-xl group-hover:bg-[#2eb774]/20 transition-all">
                    <stat.icon className="w-4 h-4 text-[#2eb774]" />
                  </div>
                </div>
                <p className="text-4xl font-black tracking-tight">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* User List */}
          <div className="glass-card rounded-[3rem] overflow-hidden border-white/5 shadow-2xl">
            <div className="p-10 border-b border-white/5 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div>
                <h3 className="text-2xl font-black flex items-center gap-4 italic uppercase tracking-tighter">
                  User Management
                </h3>
                <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-[0.2em] mt-1">Identity & Access Management</p>
              </div>
              
              <div className="relative group w-full lg:w-96">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant group-focus-within:text-[#2eb774] transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search user ID, verify name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-surface-container-low border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:border-[#2eb774] transition-all text-sm font-medium"
                />
              </div>
            </div>

            <div className="overflow-x-auto px-4 pb-4">
              <table className="w-full border-separate border-spacing-y-2">
                <thead>
                  <tr>
                    <th className="text-left py-4 px-6 text-[9px] font-black text-on-surface-variant uppercase tracking-[0.3em]">Access Node</th>
                    <th className="text-left py-4 px-6 text-[9px] font-black text-on-surface-variant uppercase tracking-[0.3em]">Credentials</th>
                    <th className="text-left py-4 px-6 text-[9px] font-black text-on-surface-variant uppercase tracking-[0.3em]">Auth Status</th>
                    <th className="text-right py-4 px-6 text-[9px] font-black text-on-surface-variant uppercase tracking-[0.3em]">System Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="py-24 text-center">
                        <div className="w-12 h-12 border-4 border-[#2eb774]/20 border-t-[#2eb774] rounded-full animate-spin mx-auto shadow-[0_0_20px_rgba(46,183,116,0.2)]"></div>
                        <p className="text-[10px] font-black uppercase text-[#2eb774] tracking-[0.2em] mt-6">Decrypting Database...</p>
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-24 text-center space-y-6">
                        <ShieldAlert className="w-16 h-16 text-on-surface-variant mx-auto opacity-10" />
                        <p className="text-on-surface-variant font-bold text-sm tracking-tight">Zero system matches found for current query.</p>
                      </td>
                    </tr>
                  ) : filtered.map((profile) => (
                    <tr key={profile.id} className="group bg-white/[0.02] hover:bg-[#2eb774]/5 transition-all">
                      <td className="py-5 px-6 rounded-l-2xl border-y border-l border-white/5 group-hover:border-[#2eb774]/20 transition-all">
                        <div className="flex items-center gap-5">
                           <div className="relative">
                            <img 
                              src={profile.avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${profile.id}`} 
                              className="w-12 h-12 rounded-[1rem] bg-surface-container shadow-2xl transition-transform group-hover:scale-105"
                              alt={profile.full_name} 
                            />
                            {profile.role === 'admin' && (
                              <div className="absolute -top-2 -right-2 bg-[#2eb774] p-1 rounded-lg shadow-lg border border-white/20 scale-75">
                                <ShieldCheck className="w-3 h-3 text-black" />
                              </div>
                            )}
                           </div>
                           <div>
                             <p className="font-black text-sm tracking-tight text-on-surface group-hover:text-[#2eb774] transition-colors">{profile.full_name || 'Anonymous Interface'}</p>
                             <p className="text-[9px] text-on-surface-variant font-mono uppercase opacity-50 tracking-wider">Node: {profile.id.slice(0, 16)}...</p>
                           </div>
                        </div>
                      </td>
                      <td className="py-5 px-6 border-y border-white/5 group-hover:border-y-[#2eb774]/20 transition-all">
                         <p className="text-[11px] font-bold text-on-surface-variant">@{profile.username || 'null_entity'}</p>
                      </td>
                      <td className="py-5 px-6 border-y border-white/5 group-hover:border-y-[#2eb774]/20 transition-all">
                        <div className={cn(
                          "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-2 border",
                          profile.role === 'admin' ? "bg-[#2eb774]/10 text-[#2eb774] border-[#2eb774]/20 shadow-[0_0_15px_rgba(46,183,116,0.1)]" : "bg-white/5 text-on-surface-variant border-white/10"
                        )}>
                          <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", profile.role === 'admin' ? "bg-[#2eb774]" : "bg-white/20")}></span>
                          {profile.role === 'admin' ? 'Authorized Admin' : 'Standard Node'}
                        </div>
                      </td>
                      <td className="py-5 px-6 text-right rounded-r-2xl border-y border-r border-white/5 group-hover:border-[#2eb774]/20 transition-all">
                        <button 
                          onClick={() => toggleAdmin(profile.id, profile.role)}
                          className={cn(
                            "px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 border",
                            profile.role === 'admin' ? "bg-error/10 text-error border-error/20 hover:bg-error/20" : "bg-[#2eb774]/10 text-[#2eb774] border-[#2eb774]/30 hover:bg-[#2eb774]/20"
                          )}
                        >
                          {profile.role === 'admin' ? 'Revoke Clearence' : 'Grant Clearance'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.section>
      )}

      {activeTab === 'matches' && (
        <motion.section 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-[3rem] p-10 border-white/5 min-h-[500px]"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter">Match Management</h3>
              <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-[0.2em]">Live event controls</p>
            </div>
            <button className="bg-[#2eb774] text-black px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest">+ New Match</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] hover:border-[#2eb774]/30 transition-all space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                  <span className="text-[#2eb774]">Live Now</span>
                  <span className="text-on-surface-variant">ID: #M-902{i}</span>
                </div>
                <div className="flex justify-between items-center gap-4 py-4 border-y border-white/5">
                  <div className="text-center flex-1">
                    <div className="w-12 h-12 bg-surface-container rounded-full mx-auto mb-2"></div>
                    <p className="text-xs font-bold">LAL Layers</p>
                  </div>
                  <p className="text-2xl font-black italic">VS</p>
                  <div className="text-center flex-1">
                    <div className="w-12 h-12 bg-surface-container rounded-full mx-auto mb-2"></div>
                    <p className="text-xs font-bold">GYS Warriors</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-3 bg-white/5 rounded-xl text-[10px] font-black uppercase hover:bg-white/10 transition-all">Edit Details</button>
                  <button className="flex-1 py-3 bg-error/10 text-error rounded-xl text-[10px] font-black uppercase hover:bg-error/20 transition-all">Cancel</button>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {activeTab === 'streaming' && (
        <motion.section 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-[3rem] p-10 border-white/5 min-h-[500px]"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter">Streaming Platforms</h3>
              <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-[0.2em]">Broadcast Node Configuration</p>
            </div>
            <button className="bg-[#2eb774] text-black px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest">Add Platform</button>
          </div>
          
          <div className="space-y-4">
            {[
              { name: 'GlobalSports TV', status: 'Healthy', latency: '24ms', region: 'Global' },
              { name: 'UltraStream Max', status: 'Degraded', latency: '112ms', region: 'US-East' },
              { name: 'DirectSport AI', status: 'Healthy', latency: '42ms', region: 'Europe' },
            ].map((p, i) => (
              <div key={i} className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.04]">
                <div className="flex items-center gap-6">
                  <div className="bg-surface-container p-4 rounded-2xl">
                    <Tv className="w-6 h-6 text-[#2eb774]" />
                  </div>
                  <div>
                    <p className="text-lg font-black italic uppercase tracking-tight">{p.name}</p>
                    <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest">{p.region} • API v2.4</p>
                  </div>
                </div>
                <div className="flex items-center gap-12 text-right">
                  <div>
                    <p className="text-[10px] font-black uppercase text-on-surface-variant mb-1">Latency</p>
                    <p className="text-lg font-black">{p.latency}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-on-surface-variant mb-1">Status</p>
                    <div className="flex items-center gap-2 justify-end">
                      <span className={cn("w-2 h-2 rounded-full", p.status === 'Healthy' ? "bg-[#2eb774]" : "bg-error")}></span>
                      <p className={cn("text-xs font-black", p.status === 'Healthy' ? "text-[#2eb774]" : "text-error")}>{p.status}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {activeTab === 'analytics' && (
        <motion.section 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-[3rem] p-10 border-white/5 min-h-[500px] space-y-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter">Reports & Analytics</h3>
              <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-[0.2em]">System conversion & user growth</p>
            </div>
            <div className="flex gap-2">
              <button className="bg-white/5 px-4 py-2 rounded-xl text-[10px] font-black uppercase border border-white/5">Weekly</button>
              <button className="bg-[#2eb774] text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase border border-[#2eb774]/30">Monthly</button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 p-8 bg-white/[0.02] rounded-[3rem] border border-white/5">
               <div className="flex justify-between items-center mb-8">
                  <h4 className="text-sm font-black uppercase tracking-widest text-[#2eb774]">Engagement Index</h4>
                  <BarChart3 className="w-5 h-5 text-on-surface-variant" />
               </div>
               <div className="h-64 flex items-end gap-2">
                  {[40, 70, 45, 90, 65, 80, 50, 40, 85, 30, 60, 100].map((h, i) => (
                    <div key={i} className="flex-1 bg-[#2eb774]/20 rounded-t-lg hover:bg-[#2eb774] transition-all cursor-pointer relative group" style={{ height: `${h}%` }}>
                       <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black px-2 py-1 rounded text-[8px] font-black opacity-0 group-hover:opacity-100 transition-all">
                         {h}%
                       </div>
                    </div>
                  ))}
               </div>
               <div className="flex justify-between mt-4 text-[9px] font-black uppercase text-on-surface-variant tracking-[0.2em]">
                 <span>Jan</span>
                 <span>Dec</span>
               </div>
            </div>
            
            <div className="space-y-6">
              {[
                { label: 'Conversion Rate', val: '+12.4%', icon: Zap },
                { label: 'New Nodes', val: '2.4k', icon: Users },
                { label: 'DB Requests', val: '142M', icon: Database },
              ].map((m, i) => (
                <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl group hover:border-[#2eb774]/20 transition-all">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-[10px] font-black uppercase text-on-surface-variant tracking-widest">{m.label}</p>
                    <m.icon className="w-4 h-4 text-[#2eb774]" />
                  </div>
                  <p className="text-2xl font-black">{m.val}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {activeTab === 'settings' && (
        <motion.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-card rounded-[3rem] p-10 border-white/5 space-y-10 group hover:border-[#2eb774]/20 transition-all">
              <div>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2">Global System Parameters</h3>
                <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-[0.2em]">Application Environment Variables</p>
              </div>
              
              <div className="space-y-6">
                {[
                  { label: 'Maintenance Protocol', desc: 'Seal the platform for system upgrades. Only admins can pass.', status: 'Inactive', active: false },
                  { label: 'Public Indexing', desc: 'Allow search engines to map the match directory.', status: 'Active', active: true },
                  { label: 'Experimental AI Core', desc: 'Use GPT-4-Turbo for match analysis instead of standard models.', status: 'Active', active: true },
                  { label: 'Secure Sandbox Mode', desc: 'Force all match interactions through private test pools.', status: 'Inactive', active: false },
                ].map((setting, i) => (
                  <div key={i} className="flex items-center justify-between p-6 bg-white/[0.02] rounded-3xl border border-white/5 hover:bg-white/[0.04] transition-all">
                    <div className="space-y-1">
                      <p className="font-black text-sm uppercase tracking-tight">{setting.label}</p>
                      <p className="text-[11px] text-on-surface-variant font-medium max-w-sm">{setting.desc}</p>
                    </div>
                    <div className={cn(
                      "w-16 h-8 rounded-full p-1 cursor-pointer transition-all relative flex items-center",
                      setting.active ? "bg-[#2eb774]" : "bg-white/10"
                    )}>
                      <div className={cn(
                        "w-6 h-6 bg-white rounded-lg shadow-2xl transition-all duration-300",
                        setting.active ? "translate-x-8" : "translate-x-0"
                      )} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6">
                <button className="w-full py-4 bg-[#2eb774] text-black rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(46,183,116,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all">
                  Synchronize All Parameters
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="glass-card rounded-[3rem] p-10 bg-error/5 border-error/10 space-y-8">
              <div>
                <h3 className="text-xl font-black text-error italic uppercase tracking-tighter">Emergency Override</h3>
                <p className="text-[9px] text-error/60 font-black uppercase tracking-[0.2em]">Destructive Ops Only</p>
              </div>
              <p className="text-[11px] text-error/80 font-medium leading-relaxed italic">
                Commands in this selector bypass all system safety checks. Total data liquidation can happen here.
              </p>
              <div className="space-y-4 pt-4">
                <button className="w-full py-4 rounded-2xl border border-error/30 text-error font-black text-[10px] uppercase tracking-widest hover:bg-error/10 transition-all">Flush User Sessions</button>
                <button className="w-full py-4 rounded-2xl bg-error text-white font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">Liquidate Database</button>
              </div>
            </div>

            <div className="glass-card rounded-[3rem] p-10 border-white/5 space-y-6">
               <h3 className="text-[11px] font-black uppercase tracking-[0.2em]">Node Distribution</h3>
               <div className="space-y-4">
                 {[
                   { region: 'US-East-1', load: 88, color: 'bg-[#2eb774]' },
                   { region: 'EU-West-2', load: 42, color: 'bg-primary' },
                   { region: 'AS-South-1', load: 12, color: 'bg-secondary' },
                 ].map((node, i) => (
                   <div key={i} className="space-y-2">
                     <div className="flex justify-between text-[10px] font-bold text-on-surface-variant">
                       <span>{node.region}</span>
                       <span>{node.load}% Load</span>
                     </div>
                     <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                       <div className={cn("h-full rounded-full", node.color)} style={{ width: `${node.load}%` }} />
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </motion.section>
      )}

      {activeTab === 'logs' && (
        <motion.section 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-[3rem] p-10 border-white/5 min-h-[500px]"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter">Operational Logs</h3>
              <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-[0.2em]">Real-time system telemetry</p>
            </div>
            <button className="text-[10px] font-black uppercase text-[#2eb774] border border-[#2eb774]/30 px-4 py-2 rounded-xl bg-[#2eb774]/5">Clear Logs</button>
          </div>

          <div className="font-mono text-[11px] space-y-3 opacity-80">
            {[
              { time: '14:22:01', event: 'SYS_BOOT', msg: 'Admin authentication successful for Node #0342' },
              { time: '14:22:45', event: 'DB_SYNC', msg: 'Profiles table indexed in 12ms' },
              { time: '14:23:12', event: 'AUTH_WRN', msg: 'Failed login attempt detected from IP: 192.168.1.1' },
              { time: '14:24:05', event: 'SYS_UPDT', msg: 'UI definitions loaded with green theme color: #2eb774' },
              { time: '14:24:10', event: 'LOG_INIT', msg: 'Telemetery data streaming established...' },
            ].map((log, i) => (
              <div key={i} className="flex gap-6 border-b border-white/5 pb-2 hover:bg-white/[0.02] transition-colors rounded-lg group">
                <span className="text-[#2eb774] font-black shrink-0">[{log.time}]</span>
                <span className="text-secondary font-black shrink-0 w-20">{log.event}</span>
                <span className="text-on-surface group-hover:text-white transition-colors">{log.msg}</span>
              </div>
            ))}
            <div className="flex gap-2 items-center animate-pulse text-[#2eb774]">
              <span className="w-2 h-2 rounded-full bg-current"></span>
              <span>Waiting for system events...</span>
            </div>
          </div>
        </motion.section>
      )}
    </div>
  );
}
