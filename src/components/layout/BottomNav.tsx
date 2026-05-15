import { Radio, Calendar, Star, Antenna } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';

export default function BottomNav() {
  const location = useLocation();

  const navItems = [
    { icon: Radio, label: 'Live', path: '/' },
    { icon: Calendar, label: 'Schedule', path: '/schedule' },
    { icon: Star, label: 'Watchlist', path: '/watchlist' },
    { icon: Antenna, label: 'Broadcast', path: '/broadcast' },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-50 bg-background/90 backdrop-blur-xl border-t border-white/5 rounded-t-xl shadow-[0_-4px_20px_rgba(0,0,0,0.5)] flex justify-around items-center h-20 px-2 pb-safe">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center transition-all active:scale-90",
              isActive ? "text-primary font-bold bg-primary/10 rounded-xl px-4 py-1" : "text-on-surface-variant hover:text-primary"
            )}
          >
            <item.icon className={cn("w-6 h-6", isActive && "fill-primary")} />
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
