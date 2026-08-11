import React from 'react';
import { Shield, CheckCircle2, ArrowRight, Globe } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../i18n';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onToggleLang: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  lang,
  onToggleLang,
}) => {
  if (!isOpen) return null;

  const t = getTranslation(lang);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
        id="onboarding-modal-card"
      >
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-sky-600 to-sky-700 px-6 py-8 text-white text-center relative">
          <button
            onClick={onToggleLang}
            className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-semibold backdrop-blur-xs transition-colors cursor-pointer"
            id="onboarding-lang-toggle"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'తెలుగు' : 'English'}</span>
          </button>

          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-white/20 shadow-inner">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-black tracking-tight">{t.appName}</h2>
          <p className="text-sky-100 text-sm font-medium mt-1">{t.appTagline}</p>
        </div>

        {/* Content body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-bold text-gray-900">{t.welcomeTitle}</h3>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              {t.welcomeDesc}
            </p>
          </div>

          <div className="bg-sky-50 rounded-xl p-4 border border-sky-100 space-y-2.5">
            <div className="flex items-start gap-3 text-xs sm:text-sm text-sky-900">
              <CheckCircle2 className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
              <span><strong>Instant Reporting:</strong> Submit accidents, floods, or missing persons in 4 quick taps.</span>
            </div>
            <div className="flex items-start gap-3 text-xs sm:text-sm text-sky-900">
              <CheckCircle2 className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
              <span><strong>AI Safety Guidance:</strong> Get calm bilingual instructions in English and Telugu.</span>
            </div>
            <div className="flex items-start gap-3 text-xs sm:text-sm text-sky-900">
              <CheckCircle2 className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
              <span><strong>Community Protection:</strong> Real-time alert feed for local citizens and emergency authorities.</span>
            </div>
          </div>

          {/* Action button */}
          <button
            id="onboarding-get-started-btn"
            onClick={onClose}
            className="w-full py-3.5 px-6 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
          >
            <span>{t.getStarted}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
