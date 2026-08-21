import React, { useState } from 'react';
import { Bell, CheckCircle2, ShieldAlert, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DataService } from '../../services/dataService';
import { AlertItem } from '../../types';

export const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [alerts, setAlerts] = useState<AlertItem[]>(DataService.getAlerts());

  const activeAlerts = alerts.filter(a => a.status === 'active');

  const handleAcknowledge = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = DataService.acknowledgeAlert(id);
    setAlerts([...updated]);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-slate-300 hover:text-slate-100 hover:bg-slate-800 transition-colors"
        aria-label="Notification center"
      >
        <Bell className="w-5 h-5 text-cyan-400" />
        {activeAlerts.length > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center font-mono animate-pulse">
            {activeAlerts.length}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 z-50 w-80 sm:w-96 bg-[#1E3E62] border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden text-xs text-slate-200 animate-fadeIn">
            {/* Header */}
            <div className="p-3 border-b border-slate-700/60 bg-[#0B192C] flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-slate-100">Environmental Alerts</span>
              </div>
              <span className="text-[10px] text-cyan-400 font-mono">
                {activeAlerts.length} Active
              </span>
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-800">
              {activeAlerts.length === 0 ? (
                <div className="p-6 text-center text-slate-400 space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <p>All active alerts acknowledged</p>
                </div>
              ) : (
                activeAlerts.map(alert => (
                  <div key={alert.id} className="p-3 hover:bg-slate-800/50 transition-colors space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 font-bold text-slate-100 text-xs">
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span className="truncate">{alert.title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">
                        {alert.timestamp.split('T')[1].substring(0, 5)}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-300 line-clamp-2">{alert.publicAction}</p>

                    <div className="flex justify-between items-center pt-1 text-[10px]">
                      <span className="text-slate-400">{alert.district}</span>
                      <button
                        onClick={e => handleAcknowledge(alert.id, e)}
                        className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700/50 hover:bg-cyan-900 transition-colors font-medium"
                      >
                        Acknowledge
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer link */}
            <Link
              to="/alerts"
              onClick={() => setIsOpen(false)}
              className="p-2.5 bg-[#0B192C] border-t border-slate-700/60 block text-center text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center justify-center gap-1"
            >
              <span>Manage all alerts in Alert Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </>
      )}
    </div>
  );
};
