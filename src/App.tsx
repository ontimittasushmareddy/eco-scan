/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { ActionConfirmModal } from './components/ActionConfirmModal';
import { LandingView } from './components/LandingView';
import { ScannerView } from './components/ScannerView';
import { LocationsView } from './components/LocationsView';
import { ImpactView } from './components/ImpactView';
import { CommunityView } from './components/CommunityView';
import { HistoryView } from './components/HistoryView';
import { ProfileView } from './components/ProfileView';
import { AdminView } from './components/AdminView';
import { PersonalizedRecommendations } from './components/PersonalizedRecommendations';

const MainContent: React.FC = () => {
  const { currentView } = useApp();

  return (
    <main className="min-h-screen bg-slate-50/50 flex flex-col justify-between">
      <div>
        <Navbar />

        {currentView === 'landing' && (
          <div>
            <LandingView />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
              <PersonalizedRecommendations />
            </div>
          </div>
        )}

        {currentView === 'scanner' && (
          <div className="space-y-8">
            <ScannerView />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
              <PersonalizedRecommendations />
            </div>
          </div>
        )}

        {currentView === 'locations' && <LocationsView />}

        {currentView === 'impact' && (
          <div className="space-y-8">
            <ImpactView />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
              <PersonalizedRecommendations />
            </div>
          </div>
        )}

        {currentView === 'community' && <CommunityView />}

        {currentView === 'history' && <HistoryView />}

        {currentView === 'profile' && <ProfileView />}

        {currentView === 'admin' && <AdminView />}
      </div>

      <Footer />
      <ActionConfirmModal />
      <ToastContainer />
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
