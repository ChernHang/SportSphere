/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthProvider';
import AuthGate from './components/auth/AuthGate';
import Navbar from './components/layout/Navbar';
import BottomNav from './components/layout/BottomNav';
import Dashboard from './pages/Dashboard';
import Schedule from './pages/Schedule';
import MatchDetails from './pages/MatchDetails';
import Watchlist from './pages/Watchlist';
import BroadcastGuide from './pages/BroadcastGuide';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './components/auth/AdminRoute';

import LoginPage from './components/auth/LoginPage';
import AdminLoginPage from './components/auth/AdminLoginPage';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background text-on-surface">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            
            {/* Protected Routes */}
            <Route path="/*" element={
              <AuthGate>
                <>
                  <Navbar />
                  <main className="pt-20 pb-24 px-4 max-w-7xl mx-auto">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/schedule" element={<Schedule />} />
                      <Route path="/match/:id" element={<MatchDetails />} />
                      <Route path="/watchlist" element={<Watchlist />} />
                      <Route path="/broadcast" element={<BroadcastGuide />} />
                      
                      {/* Admin Protected Routes */}
                      <Route 
                        path="/admin" 
                        element={<AdminRoute><AdminDashboard /></AdminRoute>} 
                      />
                      <Route 
                        path="/admin/dashboard" 
                        element={<AdminRoute><AdminDashboard /></AdminRoute>} 
                      />
                    </Routes>
                  </main>
                  <BottomNav />
                </>
              </AuthGate>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}
