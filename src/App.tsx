import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { ToastContainer } from './components/common/ToastContainer';
import { PasteEmailModal } from './components/modals/PasteEmailModal';
import { AddEditApplicationModal } from './components/modals/AddEditApplicationModal';
import { ApplicationDetailModal } from './components/modals/ApplicationDetailModal';
import { AnalysisProgressModal } from './components/modals/AnalysisProgressModal';
import { OverviewPage } from './components/pages/OverviewPage';
import { InboxPage } from './components/pages/InboxPage';
import { TrackerPage } from './components/pages/TrackerPage';
import { ScamProtectionPage } from './components/pages/ScamProtectionPage';
import { RemindersPage } from './components/pages/RemindersPage';
import { AnalyticsPage } from './components/pages/AnalyticsPage';
import { SettingsPage } from './components/pages/SettingsPage';
import { LoginPage } from './components/auth/LoginPage';
import { Application } from './types';

const MainLayout: React.FC = () => {
  const { 
    activeTab, 
    applications, 
    selectedAppId, 
    setSelectedAppId,
    currentUser
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [appToEdit, setAppToEdit] = useState<Application | null>(null);
  const [appForDetail, setAppForDetail] = useState<Application | null>(null);

  useEffect(() => {
    if (selectedAppId) {
      const found = applications.find(a => a.id === selectedAppId);
      if (found) {
        setAppForDetail(found);
      }
    }
  }, [selectedAppId, applications]);

  const handleOpenAdd = () => {
    setAppToEdit(null);
    setIsAddEditModalOpen(true);
  };

  const handleOpenEdit = (app: Application) => {
    setAppToEdit(app);
    setIsAddEditModalOpen(true);
  };

  const handleOpenDetail = (app: Application) => {
    setAppForDetail(app);
  };

  const handleCloseDetail = () => {
    setAppForDetail(null);
    setSelectedAppId(null);
  };

  // If not authenticated, show LoginPage
  if (!currentUser) {
    return (
      <>
        <LoginPage />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Top Header */}
      <Header onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 flex w-full">
        
        {/* Persistent Sidebar */}
        <Sidebar
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[calc(100vh-61px)]">
          {activeTab === 'overview' && (
            <OverviewPage
              onOpenAddModal={handleOpenAdd}
              onOpenPasteModal={() => setIsPasteModalOpen(true)}
            />
          )}

          {activeTab === 'inbox' && (
            <InboxPage
              onOpenPasteModal={() => setIsPasteModalOpen(true)}
            />
          )}

          {activeTab === 'tracker' && (
            <TrackerPage
              onOpenAddModal={handleOpenAdd}
              onOpenEditModal={handleOpenEdit}
              onOpenDetailModal={handleOpenDetail}
            />
          )}

          {activeTab === 'scam' && <ScamProtectionPage />}

          {activeTab === 'reminders' && <RemindersPage />}

          {activeTab === 'analytics' && <AnalyticsPage />}

          {activeTab === 'settings' && <SettingsPage />}
        </main>

      </div>

      {/* Dialog Modals */}
      <PasteEmailModal
        isOpen={isPasteModalOpen}
        onClose={() => setIsPasteModalOpen(false)}
      />

      <AddEditApplicationModal
        isOpen={isAddEditModalOpen}
        applicationToEdit={appToEdit}
        onClose={() => {
          setIsAddEditModalOpen(false);
          setAppToEdit(null);
        }}
      />

      <ApplicationDetailModal
        app={appForDetail}
        onClose={handleCloseDetail}
      />

      <AnalysisProgressModal />

      {/* Toast notifications */}
      <ToastContainer />

    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
};

export default App;
