import React, { useState } from 'react';
import { 
  LayoutDashboard, Search, Filter, AlertTriangle, CheckCircle2, Clock, 
  MapPin, ShieldAlert, ArrowUpDown, ChevronDown, Activity, PhoneCall 
} from 'lucide-react';
import { Incident, ActivityLog, IncidentStatus, Severity, Language } from '../types';
import { getTranslation } from '../i18n';

interface CommunityDashboardProps {
  incidents: Incident[];
  activityLogs: ActivityLog[];
  onUpdateIncidentStatus: (id: string, newStatus: IncidentStatus) => void;
  onSelectIncident: (incident: Incident) => void;
  lang: Language;
}

export const CommunityDashboard: React.FC<CommunityDashboardProps> = ({
  incidents,
  activityLogs,
  onUpdateIncidentStatus,
  onSelectIncident,
  lang,
}) => {
  const t = getTranslation(lang);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Stats
  const totalToday = incidents.length;
  const criticalCount = incidents.filter((i) => i.severity === 'Critical').length;
  const resolvedCount = incidents.filter((i) => i.status === 'Resolved').length;

  // Filtered incidents
  const filteredIncidents = incidents.filter((i) => {
    const matchesSearch =
      i.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeverity = selectedSeverity === 'All' || i.severity === selectedSeverity;
    const matchesStatus = selectedStatus === 'All' || i.status === selectedStatus;

    return matchesSearch && matchesSeverity && matchesStatus;
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

  const getStatusBadge = (status: IncidentStatus) => {
    switch (status) {
      case 'Resolved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Help Dispatched':
        return 'bg-sky-100 text-sky-800 border-sky-300';
      case 'Under Review':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'New':
      default:
        return 'bg-purple-100 text-purple-800 border-purple-300';
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-sky-800 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white space-y-2 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-xs">
            <LayoutDashboard className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black">{t.dashboardTitle}</h2>
            <p className="text-sky-100 text-xs sm:text-sm">{t.dashboardSubtitle}</p>
          </div>
        </div>
      </div>

      {/* Summary Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">{t.totalIncidents}</span>
            <span className="text-2xl font-black text-gray-900 mt-1 block">{totalToday}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-100">
            <LayoutDashboard className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-red-600 uppercase tracking-wider block">{t.activeCritical}</span>
            <span className="text-2xl font-black text-red-700 mt-1 block">{criticalCount}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-700 flex items-center justify-center border border-red-100">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">{t.resolvedCount}</span>
            <span className="text-2xl font-black text-emerald-700 mt-1 block">{resolvedCount}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Table / Filter Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
        {/* Filters Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 text-xs sm:text-sm"
              id="dashboard-search-input"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="py-2.5 px-3 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 bg-white cursor-pointer"
              id="dashboard-severity-filter"
            >
              <option value="All">{t.allSeverities}</option>
              <option value="Critical">{t.severityCritical}</option>
              <option value="High">{t.severityHigh}</option>
              <option value="Medium">{t.severityMedium}</option>
              <option value="Low">{t.severityLow}</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="py-2.5 px-3 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 bg-white cursor-pointer"
              id="dashboard-status-filter"
            >
              <option value="All">{t.filterByStatus}</option>
              <option value="New">{t.statusNew}</option>
              <option value="Under Review">{t.statusUnderReview}</option>
              <option value="Help Dispatched">{t.statusHelpDispatched}</option>
              <option value="Resolved">{t.statusResolved}</option>
            </select>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="overflow-x-auto border border-gray-200 rounded-2xl">
          <table className="w-full text-left text-xs sm:text-sm" id="community-dashboard-table">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-4">{t.tableType}</th>
                <th className="p-4">{t.tableLocation}</th>
                <th className="p-4">{t.tableSeverity}</th>
                <th className="p-4">{t.tableStatus}</th>
                <th className="p-4">{t.tableTime}</th>
                <th className="p-4 text-right">{t.tableAction}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500 font-medium">
                    No matching incident reports found.
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((incident) => {
                  const title = lang === 'te' ? incident.titleTe : incident.titleEn;

                  return (
                    <tr 
                      key={incident.id} 
                      className="hover:bg-sky-50/50 transition-colors cursor-pointer group"
                      onClick={() => onSelectIncident(incident)}
                    >
                      <td className="p-4 font-bold text-gray-900 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-sky-600" />
                          <span>{incident.type}</span>
                        </div>
                      </td>

                      <td className="p-4 max-w-xs">
                        <p className="font-semibold text-gray-900 truncate">{title || incident.description}</p>
                        <p className="text-xs text-gray-500 truncate flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span>{incident.location}</span>
                        </p>
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getSeverityBadge(incident.severity)}`}>
                          {incident.severity}
                        </span>
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadge(incident.status)}`}>
                          {incident.status}
                        </span>
                      </td>

                      <td className="p-4 text-xs text-gray-500 whitespace-nowrap">
                        {incident.timestamp}
                      </td>

                      <td className="p-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={incident.status}
                          onChange={(e) => onUpdateIncidentStatus(incident.id, e.target.value as IncidentStatus)}
                          className="py-1 px-2 rounded-lg border border-gray-300 text-xs font-semibold bg-white cursor-pointer focus:ring-2 focus:ring-sky-500"
                          id={`update-status-select-${incident.id}`}
                        >
                          <option value="New">New</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Help Dispatched">Help Dispatched</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity Timeline */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Activity className="w-5 h-5 text-sky-600" />
          <span>{t.recentActivityTitle}</span>
        </h3>

        <div className="space-y-3">
          {activityLogs.map((log) => {
            const text = lang === 'te' ? log.textTe : log.textEn;

            return (
              <div 
                key={log.id} 
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs sm:text-sm"
              >
                <div className="p-1.5 rounded-lg bg-sky-100 text-sky-800 font-bold shrink-0">
                  <Clock className="w-4 h-4" />
                </div>

                <div className="flex-1 space-y-0.5">
                  <p className="font-semibold text-gray-900">{text}</p>
                  <span className="text-xs text-gray-500">{log.time}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
