import React, { useState, useEffect } from 'react';
import { BarChart3, Sparkles, RefreshCw, AlertCircle, TrendingUp, Clock, Lightbulb, ShieldAlert } from 'lucide-react';
import { Incident, Language, InsightCard } from '../types';
import { getTranslation } from '../i18n';

interface AnalyticsPageProps {
  incidents: Incident[];
  lang: Language;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ incidents, lang }) => {
  const t = getTranslation(lang);

  const [insights, setInsights] = useState<{ en: InsightCard[]; te: InsightCard[] }>({
    en: [],
    te: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/generate-analytics-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incidents }),
      });

      const data = await res.json();
      setInsights({
        en: data.insightsEn || [],
        te: data.insightsTe || [],
      });
    } catch (err) {
      console.error('Analytics fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [incidents.length]);

  const activeInsights = lang === 'te' ? insights.te : insights.en;

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-700 to-sky-700 rounded-3xl p-6 sm:p-8 text-white space-y-2 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-xs">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black">{t.analyticsTitle}</h2>
            <p className="text-emerald-100 text-xs sm:text-sm">{t.analyticsSubtitle}</p>
          </div>
        </div>
      </div>

      {/* Control Row */}
      <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Gemini AI Analyzing {incidents.length} session reports</span>
        </div>

        <button
          onClick={fetchAnalytics}
          disabled={isLoading}
          className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
          id="refresh-analytics-btn"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Analyzing...' : t.generateInsightsBtn}</span>
        </button>
      </div>

      {/* Insight Cards Grid */}
      <div className="space-y-4">
        {activeInsights.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-gray-200 space-y-3">
            <Lightbulb className="w-12 h-12 text-gray-400 mx-auto" />
            <p className="text-gray-600 font-medium">{t.noDataForAnalytics}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeInsights.map((card, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
                id={`insight-card-${idx}`}
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                    {idx === 0 ? <TrendingUp className="w-6 h-6" /> :
                     idx === 1 ? <Clock className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
                  </div>

                  <h3 className="text-lg font-black text-gray-900">{card.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
                    {card.detail}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-100">
                  <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider block mb-1">
                    AI Authority Recommendation:
                  </span>
                  <p className="text-xs font-semibold text-emerald-950">{card.suggestion}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
