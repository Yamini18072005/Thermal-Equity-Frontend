import React, { useState } from 'react';
import { DataService } from '../services/dataService';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Bell, CheckCircle2, ShieldAlert, Filter, Check } from 'lucide-react';
import { AlertItem, AlertStatus } from '../types';

export const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>(DataService.getAlerts());
  const [activeTab, setActiveTab] = useState<AlertStatus>('active');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(null), 3000);
  };

  const handleAcknowledge = (id: string) => {
    const updated = DataService.acknowledgeAlert(id);
    setAlerts([...updated]);
    showToast('Alert status updated to Acknowledged');
  };

  const handleResolve = (id: string) => {
    const updated = DataService.resolveAlert(id);
    setAlerts([...updated]);
    showToast('Alert status updated to Resolved');
  };

  // Filter logic
  const filtered = alerts.filter(a => {
    const matchesTab = a.status === activeTab;
    const matchesSeverity = severityFilter === 'All' || a.severity === severityFilter;
    return matchesTab && matchesSeverity;
  });

  const tabCounts = {
    active: alerts.filter(a => a.status === 'active').length,
    acknowledged: alerts.filter(a => a.status === 'acknowledged').length,
    resolved: alerts.filter(a => a.status === 'resolved').length
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast Notice */}
      {toastNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E3E62] border border-cyan-500 text-slate-100 text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastNotice}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Bell className="w-6 h-6 text-cyan-400" />
            <span>Alert Management Screen</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time threshold alert monitoring and emergency public action dispatch queue.
          </p>
        </div>
      </div>

      {/* Tabs & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1E3E62]/40 border border-slate-700/50 p-3 rounded-xl">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-[#0B192C] p-1 rounded-lg border border-slate-800 text-xs">
          {(['active', 'acknowledged', 'resolved'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-md capitalize font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === tab
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{tab}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] font-mono">
                {tabCounts[tab]}
              </span>
            </button>
          ))}
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={severityFilter}
            onChange={e => setSeverityFilter(e.target.value)}
            className="bg-[#0B192C] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="All">All Severities</option>
            <option value="Extreme">Extreme</option>
            <option value="High">High</option>
            <option value="Moderate">Moderate</option>
          </select>
        </div>
      </div>

      {/* Alert Cards List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <Card className="p-12 text-center text-slate-400 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-200">No {activeTab} alerts found</h3>
            <p className="text-xs max-w-md mx-auto">
              There are currently no alerts matching this filter criteria.
            </p>
          </Card>
        ) : (
          filtered.map(alert => (
            <Card key={alert.id} className="border-slate-700/80">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-700/60 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
                    <h3 className="text-base font-bold text-slate-100">{alert.title}</h3>
                    <Badge level={alert.severity} />
                  </div>
                  <p className="text-xs text-slate-400">
                    Location: <strong className="text-slate-200">{alert.locationName}</strong> ({alert.district}) • Issued: <span className="font-mono text-cyan-400">{alert.timestamp.split('T')[1].substring(0, 5)} IST</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Badge level={alert.type} variant="mode" />
                  <Badge level={alert.status} variant="status" />
                </div>
              </div>

              {/* Body details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 text-xs">
                <div>
                  <p className="font-semibold text-slate-400 uppercase text-[10px]">Trigger Factors:</p>
                  <div className="mt-1 space-y-1 font-mono">
                    {alert.triggerFactors.map((tf, i) => (
                      <span key={i} className="inline-block px-2 py-0.5 rounded bg-[#0B192C] border border-slate-800 text-slate-300 mr-1.5 mb-1">
                        {tf}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <p className="font-semibold text-slate-400 uppercase text-[10px]">Mandatory Public Action:</p>
                  <p className="p-2.5 rounded-lg bg-[#0B192C] border border-slate-800 text-slate-200 leading-relaxed">
                    {alert.publicAction}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end items-center gap-2 pt-3 mt-3 border-t border-slate-800">
                {alert.status === 'active' && (
                  <>
                    <button
                      onClick={() => handleAcknowledge(alert.id)}
                      className="px-3 py-1.5 rounded-lg bg-amber-950 text-amber-300 border border-amber-700/50 hover:bg-amber-900 transition-colors text-xs font-semibold"
                    >
                      Acknowledge Alert
                    </button>
                    <button
                      onClick={() => handleResolve(alert.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-700/50 hover:bg-emerald-900 transition-colors text-xs font-semibold flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Mark Resolved</span>
                    </button>
                  </>
                )}
                {alert.status === 'acknowledged' && (
                  <button
                    onClick={() => handleResolve(alert.id)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-700/50 hover:bg-emerald-900 transition-colors text-xs font-semibold flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Mark Resolved</span>
                  </button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
