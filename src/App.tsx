import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AgentProvider } from './context/AgentContext';

// Components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ParticleBackground } from './components/3d/ParticleBackground';

// Modals
import { ControlCenterModal } from './components/modals/ControlCenterModal';
import { ActivityLedgerModal } from './components/modals/ActivityLedgerModal';
import { ComparePricesModal } from './components/modals/ComparePricesModal';
import { CheckoutModal } from './components/modals/CheckoutModal';
import { OnboardingModal } from './components/modals/OnboardingModal';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { AgentWorkspacePage } from './pages/AgentWorkspacePage';
import { LandingPage } from './pages/LandingPage';
import { SavedBundlesPage } from './pages/SavedBundlesPage';
import { MerchantAnalyticsPage } from './pages/MerchantAnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { PitchStudioPage } from './pages/PitchStudioPage';

export function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <AgentProvider>
          <div className="min-h-screen flex flex-col bg-[#05060b] text-[#eef0f8] relative overflow-x-hidden selection:bg-[#5b8cff]/30">
            {/* Interactive Particle Starfield */}
            <ParticleBackground />

            {/* Global Full-Width Navbar */}
            <Navbar />

            {/* Main Application Routes — Opens Dashboard as Default Hub */}
            <main className="flex-1 relative z-10 w-full">
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/overview" element={<LandingPage />} />
                <Route path="/agent" element={<AgentWorkspacePage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/pitch" element={<PitchStudioPage />} />
                <Route path="/bundles" element={<SavedBundlesPage />} />
                <Route path="/analytics" element={<MerchantAnalyticsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            {/* Global Modals */}
            <ControlCenterModal />
            <ActivityLedgerModal />
            <ComparePricesModal />
            <CheckoutModal />
            <OnboardingModal />

            {/* Global Footer */}
            <Footer />
          </div>
        </AgentProvider>
      </AuthProvider>
    </HashRouter>
  );
}

export default App;
