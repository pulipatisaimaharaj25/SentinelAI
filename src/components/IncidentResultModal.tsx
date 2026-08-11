import React from 'react';
import { 
  CheckCircle2, AlertTriangle, ShieldCheck, Clock, MapPin, 
  ArrowRight, PhoneCall, Share2, Globe, HeartHandshake 
} from 'lucide-react';
import { Incident, Language, Severity } from '../types';
import { getTranslation } from '../i18n';

interface IncidentResultModalProps {
  incident: Incident | null;
  onClose: () => void;
  onNavigateDashboard: () => void;
  lang: Language;
}

export const IncidentResultModal: React.FC<IncidentResultModalProps> = ({
  incident,
  onClose,
  onNavigateDashboard,
  lang,
}) => {
  if (!incident) return null;

  const t = getTranslation(lang);

  const getSeverityBadge = (severity: Severity) => {
    switch (severity) {
      case 'Critical':
        return {
          bg: 'bg-red-100 text-red-800 border-red-300',
          title: t.severityCritical,
          desc: t.severityCriticalDesc,
        };
      case 'High':
        return {
          bg: 'bg-orange-100 text-orange-800 border-orange-300',
          title: t.severityHigh,
          desc: t.severityHighDesc,
        };
      case 'Medium':
        return {
          bg: 'bg-yellow-100 text-yellow-800 border-yellow-300',
          title: t.severityMedium,
          desc: t.severityMediumDesc,
        };
      case 'Low':
      default:
        return {
          bg: 'bg-green-100 text-green-800 border-green-300',
          title: t.severityLow,
          desc: t.severityLowDesc,
        };
    }
  };

  const badgeInfo = getSeverityBadge(incident.severity);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-gray-900/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div 
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden my-auto"
        id="incident-result-modal"
      >
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-sky-700 p-6 sm:p-8 text-white text-center relative">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-xs border border-white/30">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black">{t.resultTitle}</h3>
          <p className="text-emerald-100 text-xs sm:text-sm font-medium mt-1">
            Report ID: <span className="font-mono font-bold text-white">{incident.id}</span>
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Assessed Severity Badge */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-2 text-center">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
              {t.severityLabel}
            </span>
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-extrabold ${badgeInfo.bg}`}>
              <AlertTriangle className="w-4 h-4" />
              <span>{badgeInfo.title}</span>
            </div>
            <p className="text-xs font-medium text-gray-700">{badgeInfo.desc}</p>
          </div>

          {/* Bilingual Reassurance Message */}
          <div className="bg-sky-50 rounded-2xl p-5 border border-sky-200 space-y-3">
            <div className="flex items-center gap-2 text-sky-900 font-bold text-sm">
              <HeartHandshake className="w-5 h-5 text-sky-600 shrink-0" />
              <span>{t.reassuranceTitle}</span>
            </div>

            <div className="space-y-2 text-xs sm:text-sm text-gray-800 bg-white p-4 rounded-xl border border-sky-100 shadow-2xs">
              <p className="font-semibold text-sky-950">
                <strong>[English]</strong> {incident.reassuranceEn}
              </p>
              <div className="h-px bg-sky-100" />
              <p className="font-semibold text-sky-950">
                <strong>[తెలుగు]</strong> {incident.reassuranceTe}
              </p>
            </div>

            {incident.estimatedResponseTime && (
              <div className="flex items-center gap-2 text-xs text-sky-800 font-medium">
                <Clock className="w-4 h-4 text-sky-600" />
                <span>{t.estimatedResponseTime}: <strong>{incident.estimatedResponseTime}</strong></span>
              </div>
            )}
          </div>

          {/* Actionable Next Steps (Bilingual) */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{t.nextStepsTitle}</span>
            </h4>

            <div className="space-y-2">
              {incident.adviceEn?.map((adviceEnItem, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs sm:text-sm space-y-1">
                  <p className="font-bold text-gray-900">• {adviceEnItem}</p>
                  {incident.adviceTe?.[idx] && (
                    <p className="text-gray-600 text-xs pl-3">↳ {incident.adviceTe[idx]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Direct Call & Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm transition-all text-center cursor-pointer shadow-xs"
              id="result-back-home-btn"
            >
              {t.backToHome}
            </button>

            <button
              onClick={onNavigateDashboard}
              className="flex-1 py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-sm transition-all text-center cursor-pointer border border-gray-300"
              id="result-view-dashboard-btn"
            >
              {t.viewInDashboard}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
