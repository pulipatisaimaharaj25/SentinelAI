import React, { useState, useEffect } from 'react';
import { CloudRain, AlertTriangle, ShieldCheck, Phone, RefreshCw, Sparkles, Droplets, Waves, CheckCircle2 } from 'lucide-react';
import { WeatherRiskLevel, Language } from '../types';
import { getTranslation } from '../i18n';

interface FloodWeatherPageProps {
  lang: Language;
}

export const FloodWeatherPage: React.FC<FloodWeatherPageProps> = ({ lang }) => {
  const t = getTranslation(lang);

  const [riskLevel, setRiskLevel] = useState<WeatherRiskLevel>('Medium');
  const [weatherAdvice, setWeatherAdvice] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchAdvice = async (level: WeatherRiskLevel) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/generate-weather-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          riskLevel: level,
          location: 'Central Metro Region',
          weatherCondition: level === 'Severe' ? 'Heavy Downpour & Flash Flood Risk' : 'Monsoon Light-to-Moderate Rain',
        }),
      });

      const data = await res.json();
      setWeatherAdvice(data);
    } catch (err) {
      console.error('Weather advice fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvice(riskLevel);
  }, [riskLevel]);

  const getRiskBadgeStyle = (level: WeatherRiskLevel) => {
    switch (level) {
      case 'Severe':
        return 'bg-red-600 text-white border-red-700 shadow-md';
      case 'High':
        return 'bg-orange-500 text-white border-orange-600 shadow-sm';
      case 'Medium':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Low':
      default:
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
    }
  };

  const activeSummary = lang === 'te' ? weatherAdvice?.summaryTe : weatherAdvice?.summaryEn;
  const activeTips = lang === 'te' ? weatherAdvice?.tipsTe : weatherAdvice?.tipsEn;

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-blue-700 to-sky-700 rounded-3xl p-6 sm:p-8 text-white space-y-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-xs">
            <CloudRain className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black">{t.floodTitle}</h2>
            <p className="text-sky-100 text-xs sm:text-sm">{t.floodSubtitle}</p>
          </div>
        </div>
      </div>

      {/* Flood Risk Level Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
              {t.currentFloodRisk}
            </span>
            <p className="text-xs text-gray-500 mt-0.5">Select a risk scenario to preview live AI safety updates</p>
          </div>

          {/* Interactive Risk Selector Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {(['Low', 'Medium', 'High', 'Severe'] as WeatherRiskLevel[]).map((level) => (
              <button
                key={level}
                onClick={() => setRiskLevel(level)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer border ${
                  riskLevel === level
                    ? getRiskBadgeStyle(level)
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
                id={`risk-pill-${level.toLowerCase()}`}
              >
                {level === 'Low' ? t.riskLow :
                 level === 'Medium' ? t.riskMedium :
                 level === 'High' ? t.riskHigh : t.riskSevere}
              </button>
            ))}
          </div>
        </div>

        {/* Risk Level Highlight Box */}
        <div className="flex items-center gap-4 bg-sky-50/70 p-5 rounded-2xl border border-sky-100">
          <div className={`p-3.5 rounded-2xl border text-xl font-extrabold ${getRiskBadgeStyle(riskLevel)}`}>
            <Waves className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-bold text-sky-800 uppercase">Status Assessment</span>
            <h3 className="text-xl font-black text-gray-900">
              Today's Risk Level: <span className="underline decoration-sky-400">{riskLevel}</span>
            </h3>
            <p className="text-xs text-gray-600">
              {riskLevel === 'Low' && 'Water levels normal across all drainage basins.'}
              {riskLevel === 'Medium' && 'Moderate rainfall expected. Stay alert near low-lying roads.'}
              {riskLevel === 'High' && 'Significant accumulation in low areas. Avoid underpasses.'}
              {riskLevel === 'Severe' && 'Critical flood risk! Keep emergency kits prepared and stay indoors.'}
            </p>
          </div>
        </div>

        {/* AI Weather Advice Section */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-sky-600" />
              <span>{t.aiWeatherAdviceTitle}</span>
            </h4>

            <button
              onClick={() => fetchAdvice(riskLevel)}
              disabled={isLoading}
              className="p-2 text-sky-700 hover:bg-sky-50 rounded-xl transition-colors cursor-pointer text-xs font-bold flex items-center gap-1"
              id="refresh-weather-advice-btn"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          <div className="bg-sky-50 rounded-2xl p-5 border border-sky-200 space-y-4">
            <p className="text-sm font-bold text-sky-950 bg-white p-4 rounded-xl border border-sky-100 leading-relaxed">
              {activeSummary || 'Loading weather advice from Gemini AI...'}
            </p>

            <div className="space-y-2">
              <span className="text-xs font-bold text-sky-800 block">Practical Citizen Safety Tips:</span>
              {activeTips?.map((tip: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-800 bg-white p-3 rounded-xl border border-sky-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-medium">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Helplines Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Phone className="w-5 h-5 text-red-600" />
          <span>{t.emergencyHelplinesTitle}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <a
            href="tel:112"
            className="p-4 rounded-2xl bg-red-50 hover:bg-red-100 border border-red-200 transition-colors flex items-center justify-between group"
          >
            <div>
              <span className="text-xs text-red-700 font-semibold block">{t.disasterHelpline}</span>
              <span className="text-lg font-black text-red-900">112</span>
            </div>
            <Phone className="w-5 h-5 text-red-600 group-hover:scale-110 transition-transform" />
          </a>

          <a
            href="tel:100"
            className="p-4 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors flex items-center justify-between group"
          >
            <div>
              <span className="text-xs text-blue-700 font-semibold block">{t.policeHelpline}</span>
              <span className="text-lg font-black text-blue-900">100</span>
            </div>
            <Phone className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
          </a>

          <a
            href="tel:108"
            className="p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center justify-between group"
          >
            <div>
              <span className="text-xs text-emerald-700 font-semibold block">{t.ambulanceHelpline}</span>
              <span className="text-lg font-black text-emerald-900">108</span>
            </div>
            <Phone className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
          </a>

          <a
            href="tel:101"
            className="p-4 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors flex items-center justify-between group"
          >
            <div>
              <span className="text-xs text-amber-700 font-semibold block">{t.fireHelpline}</span>
              <span className="text-lg font-black text-amber-900">101</span>
            </div>
            <Phone className="w-5 h-5 text-amber-600 group-hover:scale-110 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
};
