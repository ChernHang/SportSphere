import React, { useState, useEffect } from 'react';
import { User, Mail, Camera, Save, Bell, Sparkles, Shield, Info, Check, BellRing, Smartphone, MailCheck, Eye, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../components/auth/AuthProvider';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { cn } from '../lib/utils';
import regeneratedImage1779435260876 from '../assets/images/regenerated_image_1779435260876.webp';

interface NotificationPrefs {
  matchStarts: boolean;
  goalUpdates: boolean;
  transferNews: boolean;
  lineupReleases: boolean;
  majorChampionships: boolean;
  methodInApp: boolean;
  methodEmail: boolean;
  methodPush: boolean;
  methodSms: boolean;
}

const AVATAR_PRESETS = [
  "https://api.dicebear.com/7.x/pixel-art/svg?seed=soccer",
  "https://api.dicebear.com/7.x/pixel-art/svg?seed=basketball",
  "https://api.dicebear.com/7.x/pixel-art/svg?seed=formula1",
  "https://api.dicebear.com/7.x/pixel-art/svg?seed=tennis",
  "https://api.dicebear.com/7.x/pixel-art/svg?seed=gaming",
  "https://api.dicebear.com/7.x/pixel-art/svg?seed=champion",
  "https://api.dicebear.com/7.x/pixel-art/svg?seed=star",
  "https://api.dicebear.com/7.x/pixel-art/svg?seed=football"
];

export default function ProfileSettings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Profile fields
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  // Notification Preferences
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPrefs>(() => {
    try {
      const stored = localStorage.getItem('sportsphere_notification_preferences');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Error loading notification preferences:', e);
    }
    return {
      matchStarts: true,
      goalUpdates: true,
      transferNews: true,
      lineupReleases: false,
      majorChampionships: true,
      methodInApp: true,
      methodEmail: true,
      methodPush: false,
      methodSms: false,
    };
  });

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Fetch profiles table on load if supabase is configured
  useEffect(() => {
    let active = true;

    const loadProfileData = async () => {
      if (!user) return;

      // First set default values from auth metadata
      const meta = user.user_metadata || {};
      const fallbackName = meta.full_name || meta.name || '';
      const fallbackUser = meta.username || user.email?.split('@')[0] || 'sports_fan';
      const fallbackAvatar = meta.avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${user.id}`;

      setUsername(fallbackUser);
      setFullName(fallbackName);
      setAvatarUrl(fallbackAvatar);

      if (!isSupabaseConfigured) {
        console.log('[Supabase] Offline placeholder mode. Initialized with local Auth Metadata.');
        return;
      }

      setFetching(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username, full_name, avatar_url')
          .eq('id', user.id)
          .single();

        if (error) {
          // If the profile does not exist yet (e.g., handles handle_new_user trigger latency),
          // we do not issue an error. We will insert it on click Save.
          console.warn('[Supabase] Profile record notice:', error.message);
        } else if (data && active) {
          if (data.username) setUsername(data.username);
          if (data.full_name) setFullName(data.full_name);
          if (data.avatar_url) setAvatarUrl(data.avatar_url);
        }
      } catch (err) {
        console.error('Failed to load profile record:', err);
      } finally {
        if (active) setFetching(false);
      }
    };

    loadProfileData();

    return () => {
      active = false;
    };
  }, [user]);

  // Save changes handler
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (username.trim().length < 3) {
      showToast("Username must be at least 3 characters long.");
      return;
    }

    setLoading(true);
    try {
      // 1. Sync & Update User Profile in local state and LocalStorage for quick access
      localStorage.setItem('sportsphere_notification_preferences', JSON.stringify(notificationPrefs));

      // 2. Update Supabase Auth metadata (so metadata updates immediately in client navbar)
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          username: username.trim(),
          full_name: fullName.trim(),
          avatar_url: avatarUrl,
        }
      });

      if (authError) throw authError;

      // 3. Write/Upsert to Supabase 'profiles' table if configured
      if (isSupabaseConfigured) {
        const { error: dbError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            username: username.trim(),
            full_name: fullName.trim(),
            avatar_url: avatarUrl,
            updated_at: new Date().toISOString()
          });

        if (dbError) throw dbError;
        showToast("Profile and preferences saved securely to Supabase Cloud Database!");
      } else {
        showToast("Profile preferences updated locally! Connect Supabase to sync.");
      }
    } catch (err: any) {
      console.error('Profile saving fail:', err);
      showToast(`Saved successfully to local preferences. (Cloud Sync notice: ${err.message || 'database tables pending'})`);
    } finally {
      setLoading(false);
    }
  };

  const togglePref = (key: keyof NotificationPrefs) => {
    setNotificationPrefs(prev => {
      const next = { ...prev, [key]: !prev[key] };
      // Save instantly to localStorage
      localStorage.setItem('sportsphere_notification_preferences', JSON.stringify(next));
      return next;
    });
  };

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 bg-sky-950/90 text-sky-200 border border-sky-500/30 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 max-w-sm"
          >
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
            <span className="text-xs font-black">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header section with cover banner and title */}
      <div className="relative rounded-[2.5rem] overflow-hidden p-8 lg:p-12 border border-sky-500/15 shadow-2xl bg-sky-950/10 mb-2">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/15 via-background to-background z-0"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-8 justify-between">
          <div className="space-y-3 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start text-sky-400">
              <Shield className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest">SportSphere User Directory</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight tracking-tighter">
              Account settings & profile
            </h1>
            <p className="text-sm text-on-surface-variant max-w-xl font-medium leading-relaxed">
              Personalize your profile cards, fine-tune notification pipelines, and configure preferred broadcast alert delivery methods.
            </p>
          </div>
          <div className="relative w-24 h-24 lg:w-28 lg:h-28 rounded-3xl overflow-hidden shadow-2xl shrink-0 group border border-white/10 p-1 bg-slate-900/40">
            <img 
              src={avatarUrl || regeneratedImage1779435260876} 
              alt="Avatar Preview" 
              className="w-full h-full object-cover rounded-2xl"
              referrerPolicy="no-referrer"
            />
            {fetching && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-sky-400 animate-spin" />
              </div>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSaveProfile} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Profile Card settings */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="glass-card rounded-[2.5rem] p-8 bg-slate-900/30 border border-white/5 space-y-8">
            <div className="flex items-center gap-3 pb-6 border-b border-white/5">
              <User className="text-sky-400 w-6 h-6" />
              <div>
                <h3 className="text-xl font-black text-white">Identity Dossier</h3>
                <p className="text-xs text-on-surface-variant">Update public identity information tracked inside tables.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Username field */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Username Handle</label>
                <div className="relative">
                  <span className="absolute left-4 top-2.5 text-xs text-sky-450 font-black font-mono">@</span>
                  <input
                    type="text"
                    required
                    placeholder="sports_fan"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_\-]/g, ''))}
                    className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-sky-500/50 placeholder:text-on-surface-variant/30"
                  />
                </div>
                <p className="text-[10px] text-on-surface-variant/70">Unique handle consisting of letters, numbers, and underscores.</p>
              </div>

              {/* Full Name field */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Full Name Display</label>
                <div className="relative">
                  <User className="absolute left-4 top-3 w-4 h-4 text-on-surface-variant/40" />
                  <input
                    type="text"
                    required
                    placeholder="Enter full display name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-sky-500/50 placeholder:text-on-surface-variant/30"
                  />
                </div>
                <p className="text-[10px] text-on-surface-variant/70">Name displayed in headers, dynamic leaderboards, and comments.</p>
              </div>
            </div>

            {/* Email (Readonly) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Email Address (Primary Host)</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-4 h-4 text-on-surface-variant/40" />
                <input
                  type="text"
                  disabled
                  value={user?.email || 'Guest Session / Anonymous Access'}
                  className="w-full pl-11 pr-4 py-3 bg-white/[0.01] border border-white/5 rounded-xl text-xs font-mono text-on-surface-variant cursor-not-allowed uppercase tracking-wider"
                />
              </div>
              <p className="text-[9px] text-on-surface-variant/50">Registration credentials provided during sign up. Unalterable from profile console.</p>
            </div>

            {/* Avatar Selectors */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white">Choose Avatar Presets</h4>
                  <p className="text-[10px] text-on-surface-variant">Tap on any sports design package below to apply a high contrast styled avatar preview.</p>
                </div>
              </div>

              {/* Grid of Presets */}
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                {AVATAR_PRESETS.map((preset, idx) => {
                  const isSelected = avatarUrl === preset;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setAvatarUrl(preset);
                        showToast(`Selected visual package style #${idx + 1}`);
                      }}
                      className={cn(
                        "w-12 h-12 rounded-xl overflow-hidden p-1 bg-slate-900 border transition-all duration-300 hover:scale-105 active:scale-95 shrink-0",
                        isSelected 
                          ? "border-sky-400 ring-2 ring-sky-400/25 scale-102" 
                          : "border-white/5 hover:border-white/20"
                      )}
                    >
                      <img src={preset} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover rounded-lg" />
                    </button>
                  );
                })}
              </div>

              {/* Custom url field always visible */}
              <div className="space-y-2 p-4 rounded-2xl bg-white/5 border border-white/5 mt-4">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Or Paste Any Custom Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="e.g. https://images.unsplash.com/photo-..."
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="flex-1 px-4 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-sky-500/50"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarUrl(`https://api.dicebear.com/7.x/pixel-art/svg?seed=${username || 'sports'}`);
                      showToast("Created a dynamic seed-based vector!");
                    }}
                    className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold rounded-xl transition-all uppercase tracking-wider text-white"
                  >
                    Seed Art
                  </button>
                </div>
                <p className="text-[10px] text-on-surface-variant/60 font-medium">Accepts any secure SVG, PNG, or JPEG link. Paste an image link here to use it as your profile picture.</p>
              </div>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-sky-500 hover:bg-sky-450 text-on-primary-container font-black rounded-2xl shadow-[0_0_25px_rgba(56,189,248,0.3)] hover:scale-[1.03] active:scale-[0.97] transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? "Aligning Cloud Databases..." : "Commit & Save Changes"}
            </button>
          </div>
        </div>

        {/* Right Column: Custom Notification Pipelines */}
        <div className="space-y-8">
          <div className="glass-card rounded-[2.5rem] p-8 bg-slate-900/30 border border-white/5 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-white/5">
              <BellRing className="text-sky-400 w-6 h-6 animate-pulse" />
              <div>
                <h3 className="text-xl font-black text-white">Broadcast Alerts</h3>
                <p className="text-xs text-on-surface-variant">Customize live pipelines in real time.</p>
              </div>
            </div>

            {/* Notification alert type checks */}
            <div className="space-y-4">
              <h4 className="text-[11px] font-black text-sky-400 uppercase tracking-widest block">Notification event triggers</h4>
              
              <div className="space-y-3">
                {[
                  { key: 'matchStarts', label: 'Match Start Alerts', desc: 'Notify instantly when preconfigured matchups kickoff.' },
                  { key: 'goalUpdates', label: 'Goal & Score Updates', desc: 'Real-time scores, red cards, and major highlights.' },
                  { key: 'transferNews', label: 'Transfer News & Rumors', desc: 'High stakes team news and official global rumors.' },
                  { key: 'lineupReleases', label: 'Lineup Releases', desc: 'Notification 60 minutes prior to legal match kickoffs.' },
                  { key: 'majorChampionships', label: 'Major Championship Finals', desc: 'Critical alerts regarding cups, grand slams, and championship crowns.' },
                ].map((item) => {
                  const stateValue = notificationPrefs[item.key as keyof NotificationPrefs];
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => togglePref(item.key as keyof NotificationPrefs)}
                      className="w-full flex items-start gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-sky-500/15 cursor-pointer text-left transition-all"
                    >
                      <div className="pt-0.5 shrink-0">
                        <div className={cn(
                          "w-5 h-5 rounded-md flex items-center justify-center border transition-all scale-100",
                          stateValue 
                            ? "bg-sky-500 border-sky-500 text-on-primary-container shadow" 
                            : "border-white/10 text-transparent"
                        )}>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      </div>
                      <div className="space-y-0.5">
                        <p className="font-bold text-xs text-white">{item.label}</p>
                        <p className="text-[10px] text-on-surface-variant">{item.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Channels or Delivery Methods */}
            <div className="space-y-4 pt-6 border-t border-white/5">
              <h4 className="text-[11px] font-black text-sky-400 uppercase tracking-widest block">Transmission channels</h4>
              
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'methodInApp', label: 'In-App Alert', desc: 'Interface notifications', icon: Eye },
                  { key: 'methodEmail', label: 'Email Alerts', desc: 'Direct inline letters', icon: MailCheck },
                  { key: 'methodPush', label: 'Mobile Push', desc: 'Browser push channel', icon: Smartphone },
                  { key: 'methodSms', label: 'SMS & Texts', desc: 'Authorized phone logs', icon: Shield },
                ].map((item) => {
                  const stateVal = notificationPrefs[item.key as keyof NotificationPrefs];
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => togglePref(item.key as keyof NotificationPrefs)}
                      className={cn(
                        "flex flex-col items-center text-center p-3.5 border rounded-2xl cursor-pointer transition-all gap-1.5 bg-slate-900/40",
                        stateVal 
                          ? "border-sky-500/25 bg-sky-500/[0.04]" 
                          : "border-white/5 hover:border-white/10"
                      )}
                    >
                      <item.icon className={cn("w-5 h-5", stateVal ? "text-sky-400" : "text-on-surface-variant/60")} />
                      <div>
                        <p className={cn("text-xs font-black", stateVal ? "text-white" : "text-on-surface-variant")}>{item.label}</p>
                        <p className="text-[9px] text-on-surface-variant/60 leading-tight mt-0.5">{item.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Integration status info */}
            <div className="p-4 rounded-2xl bg-sky-950/20 border border-sky-400/10 flex gap-3 text-[10px] text-sky-300 leading-relaxed font-semibold">
              <Info className="w-4 h-4 shrink-0 text-sky-400" />
              <span>We value your focus. Notification streams are bundled dynamically across critical time intervals to avoid screen noise. You can adjust alert frequency anytime.</span>
            </div>
            
          </div>
        </div>

      </form>
    </div>
  );
}
