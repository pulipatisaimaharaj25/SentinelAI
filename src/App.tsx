import React, { useState } from 'react';
import { Header } from './components/Header';
import { OnboardingModal } from './components/OnboardingModal';
import { HomeScreen } from './components/HomeScreen';
import { ReportEmergencyModal } from './components/ReportEmergencyModal';
import { IncidentResultModal } from './components/IncidentResultModal';
import { MissingPersonPage } from './components/MissingPersonPage';
import { FloodWeatherPage } from './components/FloodWeatherPage';
import { CommunityDashboard } from './components/CommunityDashboard';
import { AnalyticsPage } from './components/AnalyticsPage';
import { AboutPage } from './components/AboutPage';

import { ActiveTab, Language, Incident, MissingPerson, ActivityLog, IncidentStatus } from './types';
import { initialIncidents, initialMissingPersons, initialActivityLogs } from './data/mockData';

export default function App() {
  const [currentTab, setCurrentTab] = useState<ActiveTab>('home');
  const [lang, setLang] = useState<Language>('en');

  // Data states
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [missingPersons, setMissingPersons] = useState<MissingPerson[]>(initialMissingPersons);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(initialActivityLogs);

  // Modals
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(true);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'te' : 'en'));
  };

  const handleAddNewIncident = (newIncident: Incident) => {
    setIncidents((prev) => [newIncident, ...prev]);

    // Append to activity log
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      time: nowTime,
      textEn: `${newIncident.type} reported near ${newIncident.location} — Severity: ${newIncident.severity}`,
      textTe: `${newIncident.location} సమీపంలో ${newIncident.type} నివేదించబడింది — తీవ్రత: ${newIncident.severity}`,
      severity: newIncident.severity,
    };

    setActivityLogs((prev) => [newLog, ...prev]);
    setSelectedIncident(newIncident);
  };

  const handleUpdateIncidentStatus = (id: string, newStatus: IncidentStatus) => {
    setIncidents((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
    );

    const targetIncident = incidents.find((i) => i.id === id);
    if (targetIncident) {
      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const updateLog: ActivityLog = {
        id: `log-${Date.now()}`,
        time: nowTime,
        textEn: `Status for ${targetIncident.type} at ${targetIncident.location} updated to "${newStatus}"`,
        textTe: `${targetIncident.location} వద్ద ${targetIncident.type} యొక్క స్థితి "${newStatus}" కి మార్చబడింది`,
        severity: targetIncident.severity,
      };
      setActivityLogs((prev) => [updateLog, ...prev]);
    }
  };

  const handleAddMissingPerson = (newPerson: MissingPerson) => {
    setMissingPersons((prev) => [newPerson, ...prev]);
  };

  const handleUpdateMissingPersonStatus = (id: string, newStatus: 'Searching' | 'Found') => {
    setMissingPersons((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-sky-200 selection:text-sky-900 flex flex-col">
      {/* App Navigation Header */}
      <Header
        currentTab={currentTab}
        onTabChange={(tab) => {
          if (tab === 'report') {
            setIsReportModalOpen(true);
          } else {
            setCurrentTab(tab);
          }
        }}
        lang={lang}
        onToggleLang={toggleLanguage}
        onOpenReport={() => setIsReportModalOpen(true)}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {currentTab === 'home' && (
          <HomeScreen
            incidents={incidents}
            onOpenReport={() => setIsReportModalOpen(true)}
            onSelectIncident={(incident) => setSelectedIncident(incident)}
            lang={lang}
          />
        )}

        {currentTab === 'missing' && (
          <MissingPersonPage
            missingPersons={missingPersons}
            onAddMissingPerson={handleAddMissingPerson}
            onUpdateStatus={handleUpdateMissingPersonStatus}
            lang={lang}
          />
        )}

        {currentTab === 'weather' && <FloodWeatherPage lang={lang} />}

        {currentTab === 'dashboard' && (
          <CommunityDashboard
            incidents={incidents}
            activityLogs={activityLogs}
            onUpdateIncidentStatus={handleUpdateIncidentStatus}
            onSelectIncident={(incident) => setSelectedIncident(incident)}
            lang={lang}
          />
        )}

        {currentTab === 'analytics' && <AnalyticsPage incidents={incidents} lang={lang} />}

        {currentTab === 'about' && <AboutPage lang={lang} />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 SentinelAI — Public Safety Assistant. Powered by Google Gemini AI.</p>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsOnboardingOpen(true)}
              className="text-sky-700 hover:underline cursor-pointer font-semibold"
            >
              How It Works
            </button>
            <a href="tel:112" className="text-red-600 font-bold hover:underline">
              Emergency Helpline 112
            </a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        lang={lang}
        onToggleLang={toggleLanguage}
      />

      <ReportEmergencyModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmitSuccess={handleAddNewIncident}
        lang={lang}
      />

      <IncidentResultModal
        incident={selectedIncident}
        onClose={() => setSelectedIncident(null)}
        onNavigateDashboard={() => {
          setSelectedIncident(null);
          setCurrentTab('dashboard');
        }}
        lang={lang}
      />
    </div>
  );
}
