import { Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import BottomNav from './BottomNav';

// Pages
import Dashboard from '../../pages/Dashboard';
import Schedule from '../../pages/Schedule';
import MatchDetails from '../../pages/MatchDetails';
import Watchlist from '../../pages/Watchlist';
import BroadcastGuide from '../../pages/BroadcastGuide';
import ProfileSettings from '../../pages/ProfileSettings';

export default function UserLayout() {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Navbar />
      <main className="pt-20 pb-24 px-4 max-w-7xl mx-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/schedule/:date" element={<Schedule />} />
          <Route path="/match/:id" element={<MatchDetails />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/broadcast" element={<BroadcastGuide />} />
          <Route path="/profile" element={<ProfileSettings />} />
          <Route path="/settings" element={<ProfileSettings />} />
          {/* Fallback to dashboard */}
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  );
}
