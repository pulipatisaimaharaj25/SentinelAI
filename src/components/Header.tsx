import React from 'react';
import { Shield, Phone, Globe, AlertTriangle, Users, CloudRain, LayoutDashboard, BarChart3, Info, Home } from 'lucide-react';
import { Language, ActiveTab } from '../types';
import { getTranslation } from '../i18n';

interface HeaderProps {
  currentTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  lang: Language;
  onToggleLang: () => void;
  onOpenReport: () => void;
  onOpenOnboarding: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  lang,
  onToggleLang,
  onOpenReport,
  onOpenOnboarding,
}) => {
  const t = getTranslation(lang);

  const navItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: t.home, icon: Home },
    { id: 'report', label: t.reportEmergency, icon: AlertTriangle },
    { id: 'missing', label: t.missingPersons, icon: Users },
    { id: 'weather', label: t.floodRisk, icon: CloudRain },
    { id: 'dashboard', label: t.communityDashboard, icon: LayoutDashboard },
    { id: 'analytics', label: t.analytics, icon: BarChart3 },
    { id: 'about', label: t.about, icon: Info },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-xs">
      {/* Top Banner Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
        {/* Logo & App Branding */}
        <div 
          className="flex items-center gap-3 cursor-pointer group select-none"
          onClick={() => onTabChange('home')}
        >
          <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-sm group-hover:bg-sky-700 transition-colors">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-gray-900 leading-tight">
                {t.appName}
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200 rounded-full">
                Public Safety
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              {t.staySafe}
            </p>
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Toggle Button (Visible on EVERY screen) */}
          <button
            id="header-lang-toggle"
            onClick={onToggleLang}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs sm:text-sm font-semibold transition-all shadow-2xs active:scale-95 cursor-pointer"
            title="Switch Language / భాషను మార్చండి"
          >
            <Globe className="w-4 h-4 text-sky-600 shrink-0" />
            <span className="font-bold">{lang === 'en' ? 'తెలుగు' : 'English'}</span>
          </button>

          {/* Quick Direct Call Button */}
          <a
            href="tel:112"
            id="header-call-112"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-xs active:scale-95"
          >
            <Phone className="w-4 h-4 fill-white" />
            <span>{t.emergencyCall}</span>
          </a>

          {/* Info Help Icon */}
          <button
            onClick={onOpenOnboarding}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
            title="App Info & Help"
            id="header-info-button"
          >
            <Info className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="bg-gray-50 border-t border-gray-100 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-1 sm:space-x-2 py-2 min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            const isReportBtn = item.id === 'report';

            if (isReportBtn) {
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={onOpenReport}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            }

            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-sky-100 text-sky-900 font-bold border border-sky-300'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-sky-700' : 'text-gray-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
