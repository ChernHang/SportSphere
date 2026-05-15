/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import BottomNav from './components/layout/BottomNav';
import Dashboard from './pages/Dashboard';
import Schedule from './pages/Schedule';
import MatchDetails from './pages/MatchDetails';
import Watchlist from './pages/Watchlist';
import BroadcastGuide from './pages/BroadcastGuide';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-on-surface">
        <Navbar />
        <main className="pt-20 pb-24 px-4 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/match/:id" element={<MatchDetails />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/broadcast" element={<BroadcastGuide />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </Router>
  );
}
