import React, { useState } from 'react';
import { DataService } from '../services/dataService';
import { Card } from '../components/common/Card';
import { Settings, Save, CheckCircle2, Sliders, Bell, Globe } from 'lucide-react';
import { UserPreferences } from '../types';

export const SettingsPage: React.FC = () => {
  const [prefs, setPrefs] = useState<UserPreferences>(DataService.getPreferences());
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  const locations = DataService.getLocations();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    DataService.updatePreferences(prefs);
    setToastNotice('Dashboard preferences updated and saved locally');
    setTimeout(() => setToastNotice(null), 3000);
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
            <Settings className="w-6 h-6 text-cyan-400" />
            <span>Dashboard Preferences & Settings</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure system units, alert thresholds, AI features, and localized workspace defaults.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-cyan-950/50"
        >
          <Save className="w-4 h-4" />
          <span>Save Preferences</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Unit & Display Settings */}
        <Card title="Display & Unit Preferences">
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Temperature Unit</label>
              <select
                value={prefs.temperatureUnit}
                onChange={e => setPrefs({ ...prefs, temperatureUnit: e.target.value as any })}
                className="w-full bg-[#0B192C] border border-slate-700 rounded-lg p-2 text-slate-100 focus:border-cyan-500"
              >
                <option value="Celsius">Celsius (°C)</option>
                <option value="Fahrenheit">Fahrenheit (°F)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Default Workspace Location</label>
              <select
                value={prefs.defaultLocationId}
                onChange={e => setPrefs({ ...prefs, defaultLocationId: e.target.value })}
                className="w-full bg-[#0B192C] border border-slate-700 rounded-lg p-2 text-slate-100 focus:border-cyan-500"
              >
                {locations.map(l => (
                  <option key={l.id} value={l.id}>{l.name} ({l.district})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Language</label>
              <select
                value={prefs.language}
                onChange={e => setPrefs({ ...prefs, language: e.target.value as any })}
                className="w-full bg-[#0B192C] border border-slate-700 rounded-lg p-2 text-slate-100 focus:border-cyan-500"
              >
                <option value="English">English</option>
                <option value="Tamil">Tamil (தமிழ்)</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Feature Toggles */}
        <Card title="Notification & AI Toggles">
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B192C] border border-slate-800">
              <div>
                <p className="font-semibold text-slate-200">Critical Alert Notifications</p>
                <p className="text-[10px] text-slate-400">Receive popover alerts for extreme threshold crosses.</p>
              </div>
              <input
                type="checkbox"
                checked={prefs.enableCriticalAlerts}
                onChange={e => setPrefs({ ...prefs, enableCriticalAlerts: e.target.checked })}
                className="w-4 h-4 accent-cyan-500 rounded"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B192C] border border-slate-800">
              <div>
                <p className="font-semibold text-slate-200">AI Field Notes</p>
                <p className="text-[10px] text-slate-400">Display automated natural-language narrative summaries.</p>
              </div>
              <input
                type="checkbox"
                checked={prefs.enableAiFieldNotes}
                onChange={e => setPrefs({ ...prefs, enableAiFieldNotes: e.target.checked })}
                className="w-4 h-4 accent-cyan-500 rounded"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B192C] border border-slate-800">
              <div>
                <p className="font-semibold text-slate-200">Include Simulated Layers</p>
                <p className="text-[10px] text-slate-400">Allow What-If intervention overlays in map views.</p>
              </div>
              <input
                type="checkbox"
                checked={prefs.includeSimulatedLayers}
                onChange={e => setPrefs({ ...prefs, includeSimulatedLayers: e.target.checked })}
                className="w-4 h-4 accent-cyan-500 rounded"
              />
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
};
