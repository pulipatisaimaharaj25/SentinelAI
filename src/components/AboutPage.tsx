import React, { useState } from 'react';
import { Info, Shield, CheckCircle2, ChevronDown, ChevronUp, AlertCircle, Sparkles, Rocket } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../i18n';

interface AboutPageProps {
  lang: Language;
}

export const AboutPage: React.FC<AboutPageProps> = ({ lang }) => {
  const t = getTranslation(lang);
  const [showTechnical, setShowTechnical] = useState<boolean>(false);

  return (
    <div className="space-y-6 sm:space-y-8 pb-12 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white space-y-2 text-center shadow-sm">
        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-white/20">
          <Shield className="w-9 h-9 text-white" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black">{t.aboutTitle}</h2>
        <p className="text-sky-100 text-xs sm:text-sm max-w-xl mx-auto">{t.aboutSubtitle}</p>
      </div>

      {/* How It Works (Simple 3 Steps) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
        <h3 className="text-xl font-black text-gray-900 border-b border-gray-100 pb-4">
          {t.howItWorksTitle}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-sky-50 border border-sky-100 space-y-2">
            <span className="w-8 h-8 rounded-xl bg-sky-600 text-white font-extrabold flex items-center justify-center text-sm">
              1
            </span>
            <h4 className="text-base font-bold text-gray-900">{t.step1How}</h4>
            <p className="text-xs text-gray-600 leading-relaxed">{t.step1HowDesc}</p>
          </div>

          <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-100 space-y-2">
            <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-sm">
              2
            </span>
            <h4 className="text-base font-bold text-gray-900">{t.step2How}</h4>
            <p className="text-xs text-gray-600 leading-relaxed">{t.step2HowDesc}</p>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-2">
            <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-extrabold flex items-center justify-center text-sm">
              3
            </span>
            <h4 className="text-base font-bold text-gray-900">{t.step3How}</h4>
            <p className="text-xs text-gray-600 leading-relaxed">{t.step3HowDesc}</p>
          </div>
        </div>
      </div>

      {/* Trust & Safety Disclaimer Note */}
      <div className="bg-amber-50 rounded-3xl p-6 border border-amber-200 flex items-start gap-4">
        <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-800 shrink-0">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-amber-900">{t.trustNoteTitle}</h4>
          <p className="text-xs sm:text-sm text-amber-900 font-medium leading-relaxed">
            {t.trustNoteBody}
          </p>
        </div>
      </div>

      {/* Expandable Technical AI Details Section */}
      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs">
        <button
          onClick={() => setShowTechnical(!showTechnical)}
          className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors cursor-pointer"
          id="toggle-technical-ai-btn"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-xl text-purple-700">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-gray-900">{t.learnMoreAiTitle}</h4>
          </div>
          {showTechnical ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
        </button>

        {showTechnical && (
          <div className="p-6 pt-0 border-t border-gray-100 text-xs sm:text-sm text-gray-700 leading-relaxed space-y-3 bg-purple-50/30">
            <p>{t.learnMoreAiDesc}</p>
            <div className="bg-white p-4 rounded-2xl border border-purple-100 space-y-2">
              <span className="font-bold text-purple-900 block">AI Perception-Reason-Action Architecture:</span>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li><strong>Multimodal Perception:</strong> Process visual evidence (photos) alongside freeform voice/text descriptions.</li>
                <li><strong>Severity Reasoning:</strong> Categorize threat levels (Critical, High, Medium, Low) based on potential life/property risk.</li>
                <li><strong>Bilingual Generation:</strong> Synthesize localized advice in English and Telugu concurrently for maximum accessibility.</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* What's Next / Future Roadmap */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Rocket className="w-5 h-5 text-sky-600" />
          <span>{t.futureRoadmapTitle}</span>
        </h3>

        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-sky-50 border border-sky-100 text-xs sm:text-sm text-sky-950 font-medium">
            <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <span>{t.roadmap1}</span>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-sky-50 border border-sky-100 text-xs sm:text-sm text-sky-950 font-medium">
            <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <span>{t.roadmap2}</span>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-sky-50 border border-sky-100 text-xs sm:text-sm text-sky-950 font-medium">
            <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <span>{t.roadmap3}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
