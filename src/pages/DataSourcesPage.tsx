import React, { useState } from 'react';
import { DataService } from '../services/dataService';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Database, RefreshCw, CheckCircle2, ShieldCheck } from 'lucide-react';
import { DataSource } from '../types';

export const DataSourcesPage: React.FC = () => {
  const [sources, setSources] = useState<DataSource[]>(DataService.getDataSources());
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  const handleSync = (id: string, name: string) => {
    setSyncingId(id);
    setTimeout(() => {
      const updated = DataService.triggerDataSourceSync(id);
      setSources([...updated]);
      setSyncingId(null);
      setToastNotice(`Successfully synchronized feed from ${name}`);
      setTimeout(() => setToastNotice(null), 3000);
    }, 1200);
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
            <Database className="w-6 h-6 text-cyan-400" />
            <span>Data Ingestion & Source Quality Monitor</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time synchronization status, spatial coverage, and telemetry quality metrics for external data feeds.
          </p>
        </div>
      </div>

      {/* Data Source Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sources.map(ds => (
          <Card key={ds.id} className="border-slate-700/80">
            <div className="flex items-start justify-between gap-3 border-b border-slate-700/60 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-100 text-sm">{ds.name}</h3>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5 font-mono">{ds.type} Feed</p>
              </div>

              <Badge level={ds.status} variant="status" />
            </div>

            <div className="grid grid-cols-2 gap-3 py-3 text-xs font-mono border-b border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Data Quality Rating</span>
                <span className="text-emerald-400 font-bold text-base">{ds.qualityRating}%</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Records Ingested</span>
                <span className="text-slate-200 font-bold text-base">{ds.recordsCount.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-3 space-y-1 text-xs text-slate-300">
              <p><strong className="text-slate-400">Coverage:</strong> {ds.coverage}</p>
              <p><strong className="text-slate-400">Frequency:</strong> {ds.updateFrequency}</p>
              <p className="font-mono text-[11px] text-slate-400 pt-1">
                Last Sync: {ds.lastSync.replace('T', ' ').substring(0, 19)} IST
              </p>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => handleSync(ds.id, ds.name)}
                disabled={syncingId === ds.id}
                className="px-3 py-1.5 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-700/50 hover:bg-cyan-900 transition-colors text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncingId === ds.id ? 'animate-spin text-cyan-400' : ''}`} />
                <span>{syncingId === ds.id ? 'Synchronizing...' : 'Trigger Sync'}</span>
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
