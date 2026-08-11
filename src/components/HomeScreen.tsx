import React, { useState } from 'react';
import { AlertTriangle, MapPin, Clock, ShieldAlert, ChevronRight, Eye, PhoneCall, CheckCircle } from 'lucide-react';
import { Incident, Language, Severity } from '../types';
import { getTranslation } from '../i18n';

interface HomeScreenProps {
  incidents: Incident[];
  onOpenReport: () => void;
  onSelectIncident: (incident: Incident) => void;
  lang: Language;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  incidents,
  onOpenReport,
  onSelectIncident,
  lang,
}) => {
  const t = getTranslation(lang);
  const [filterSeverity, setFilterSeverity] = useState<string>('All');

  // Stats calculation
  const totalToday = incidents.length;
  const criticalCount = incidents.filter((i) => i.severity === 'Critical').length;
  const resolvedCount = incidents.filter((i) => i.status === 'Resolved').length;

  // Filtered list
  const filteredIncidents = incidents.filter((i) => {
    if (filterSeverity === 'Critical') return i.severity === 'Critical';
    return true;
  });

  const getSeverityBadge = (severity: Severity) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Low':
      default:
        return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Hero Section — Prominent Emergency Report Action */}
      <section className="bg-gradient-to-b from-sky-50 via-white to-sky-50/30 rounded-3xl p-6 sm:p-10 border border-sky-100 shadow-sm text-center relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-100 border border-red-200 text-red-800 text-xs sm:text-sm font-semibold">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
            <span>Emergency Reporting Available 24/7</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight">
            {t.quickReportHeroTitle}
          </h2>

          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            {t.quickReportHeroSub}
          </p>

          {/* Big Touch-Friendly Emergency Button */}
          <div className="pt-2">
            <button
              id="hero-report-emergency-btn"
              onClick={onOpenReport}
              className="w-full sm:w-auto min-w-[280px] py-4 px-8 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-lg sm:text-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 cursor-pointer mx-auto group"
            >
              <AlertTriangle className="w-7 h-7 group-hover:scale-110 transition-transform" />
              <span>{t.reportNowButton}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Summary Strip */}
      <section className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              {t.todaySummaryTitle}
            </h3>
            <p className="text-xs text-gray-500">
              Live updates from local citizens and response teams
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-center">
              <span className="text-xs text-gray-500 block font-medium">{t.incidentsReported}</span>
              <span className="text-lg font-black text-gray-900">{totalToday}</span>
            </div>
            <div className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-red-50 border border-red-200 text-center">
              <span className="text-xs text-red-700 block font-medium">{t.criticalIncidents}</span>
              <span className="text-lg font-black text-red-700">{criticalCount}</span>
            </div>
            <div className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-green-50 border border-green-200 text-center">
              <span className="text-xs text-green-700 block font-medium">{t.resolvedIncidents}</span>
              <span className="text-lg font-black text-green-700">{resolvedCount}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Incidents Feed */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{t.recentFeedTitle}</h3>
            <p className="text-xs text-gray-500">Tap any report to view AI safety guidance and status</p>
          </div>

          <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setFilterSeverity('All')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                filterSeverity === 'All' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t.filterAll}
            </button>
            <button
              onClick={() => setFilterSeverity('Critical')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                filterSeverity === 'Critical' ? 'bg-red-600 text-white shadow-2xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t.filterCritical}
            </button>
          </div>
        </div>

        {filteredIncidents.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-200 space-y-3">
            <ShieldAlert className="w-12 h-12 text-gray-400 mx-auto" />
            <p className="text-gray-600 font-medium">{t.noIncidentsYet}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredIncidents.map((incident) => {
              const titleText = lang === 'te' ? incident.titleTe : incident.titleEn;

              return (
                <div
                  key={incident.id}
                  id={`incident-card-${incident.id}`}
                  onClick={() => onSelectIncident(incident)}
                  className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    {/* Badge & Time */}
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getSeverityBadge(incident.severity)}`}>
                        {incident.severity === 'Critical' ? t.severityCritical : 
                         incident.severity === 'High' ? t.severityHigh : 
                         incident.severity === 'Medium' ? t.severityMedium : t.severityLow}
                      </span>

                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{incident.timestamp}</span>
                      </div>
                    </div>

                    {/* Photo + Title */}
                    <div className="flex items-start gap-3">
                      {incident.photoUrl && (
                        <img
                          src={incident.photoUrl}
                          alt={incident.type}
                          className="w-16 h-16 rounded-xl object-cover shrink-0 border border-gray-100"
                        />
                      )}
                      <div className="space-y-1">
                        <h4 className="text-base font-bold text-gray-900 group-hover:text-sky-700 transition-colors line-clamp-2">
                          {titleText || incident.description}
                        </h4>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="truncate">{incident.location}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer Card Row */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="px-2.5 py-0.5 rounded-md bg-gray-100 font-semibold text-gray-700">
                      {incident.type}
                    </span>

                    <span className="text-sky-700 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>View AI Guidance</span>
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
