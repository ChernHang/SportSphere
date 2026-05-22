/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthProvider';
import AuthGate from './components/auth/AuthGate';

import LoginPage from './components/auth/LoginPage';
import UserLayout from './components/layout/UserLayout';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* User Application Portal */}
          <Route path="/*" element={
            <AuthGate>
              <UserLayout />
            </AuthGate>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
