import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DataService } from '../services/dataService';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import { RiskTrendChart } from '../components/visualizations/RiskTrendChart';
import {
  MapPin,
  Thermometer,
  Wind,
  Droplets,
  Sun,
  ShieldCheck,
  Share2,
  Download,
  Eye,
  ArrowLeft,
  Sparkles,
  Info,
  Building2,
  TreePine,
  LifeBuoy
} from 'lucide-react';

export const LocationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const locationId = id || 'manali-ennore';
  const loc = DataService.getLocationById(locationId) || DataService.getLocations()[0];
  const scoreObj = DataService.getRiskScore(loc.id);
  const reading = DataService.getEnvironmentalReading(loc.id);

  const [historyTab, setHistoryTab] = useState<'7 days' | '30 days' | '90 days'>('7 days');
  const [isWatching, setIsWatching] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E3E62] border border-cyan-500 text-slate-100 text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Back button & Location Header */}
      <div>
        <button
          onClick={() => navigate('/locations')}
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 mb-3 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Wards Directory</span>
        </button>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#1E3E62]/40 border border-slate-700/60 p-6 rounded-2xl">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold text-slate-100">{loc.name}</h1>
              <Badge level={scoreObj.classification} />
            </div>
            <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{loc.district}</span>
              <span>•</span>
              <span className="font-mono text-xs text-slate-300">Lat: {loc.coordinates.lat}, Lng: {loc.coordinates.lng}</span>
            </p>
          </div>

          {/* Quick Score Highlight & Actions */}
          <div className="flex items-center gap-4">
            <div className="text-right border-r border-slate-700 pr-4">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Thermal Equity Score</span>
              <span className="text-3xl font-black font-mono text-cyan-400">{scoreObj.score} <span className="text-xs font-normal text-slate-400">/ 100</span></span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsWatching(!isWatching);
                  showToast(isWatching ? `Removed ${loc.name} from watch queue` : `Added ${loc.name} to municipal watch queue`);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                  isWatching
                    ? 'bg-cyan-600 text-white border-cyan-500'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>{isWatching ? 'Watching' : 'Watch Location'}</span>
              </button>

              <button
                onClick={() => showToast(`Generated printable executive summary brief for ${loc.name}`)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                title="Share Brief"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => showToast(`Exported full telemetry dataset for ${loc.name}`)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                title="Export Summary"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Environmental Parameters Grid */}
      <Card
        title="Current Environmental Telemetry Matrix"
        subtitle={`Recorded at ${reading.timestamp.split('T')[1].substring(0, 5)} IST via ${reading.sourceTag}`}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 font-mono">
          <div className="p-3 rounded-xl bg-[#0B192C] border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
              <Thermometer className="w-3.5 h-3.5 text-orange-400" /> Temperature
            </span>
            <p className="text-xl font-extrabold text-slate-100 mt-1">{reading.temperature}°C</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Feels like {reading.feelsLike}°C</p>
          </div>

          <div className="p-3 rounded-xl bg-[#0B192C] border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
              <Wind className="w-3.5 h-3.5 text-rose-400" /> PM2.5 Exposure
            </span>
            <p className="text-xl font-extrabold text-rose-400 mt-1">{reading.pm25} <span className="text-xs font-normal">µg/m³</span></p>
            <p className="text-[10px] text-slate-400 mt-0.5">AQI Equivalent: High</p>
          </div>

          <div className="p-3 rounded-xl bg-[#0B192C] border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-teal-400" /> Relative Humidity
            </span>
            <p className="text-xl font-extrabold text-teal-300 mt-1">{reading.humidity}%</p>
            <p className="text-[10px] text-slate-400 mt-0.5">High Sweat Inefficiency</p>
          </div>

          <div className="p-3 rounded-xl bg-[#0B192C] border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
              <Sun className="w-3.5 h-3.5 text-amber-400" /> Solar UV Index
            </span>
            <p className="text-xl font-extrabold text-amber-300 mt-1">{reading.uvIndex}</p>
            <p className="text-[10px] text-amber-400 mt-0.5">Extreme Irradiance</p>
          </div>

          <div className="p-3 rounded-xl bg-[#0B192C] border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
              <Wind className="w-3.5 h-3.5 text-cyan-400" /> Wind Velocity
            </span>
            <p className="text-xl font-extrabold text-cyan-300 mt-1">{reading.windSpeed} <span className="text-xs font-normal">km/h</span></p>
            <p className="text-[10px] text-slate-400 mt-0.5">Low Dispersion</p>
          </div>
        </div>

        {/* Secondary gases */}
        <div className="mt-3 pt-3 border-t border-slate-800 grid grid-cols-3 gap-4 text-xs font-mono text-slate-400">
          <div>CO: <span className="text-slate-200 font-bold">{reading.co} ppm</span></div>
          <div>NO₂: <span className="text-slate-200 font-bold">{reading.no2} ppb</span></div>
          <div>O₃: <span className="text-slate-200 font-bold">{reading.o3} ppb</span></div>
        </div>
      </Card>

      {/* Explainable AI Risk Driver Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card
            title="Explainable Risk Drivers (SHAP Breakdown)"
            subtitle="Quantitative contribution breakdown showing how each environmental & demographic factor drives this score."
          >
            <div className="space-y-5">
              {scoreObj.mainDrivers.map((driver, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[#0B192C]/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-100">{driver.factorName}</span>
                      <Badge level={driver.severity} />
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-slate-400">{driver.currentRawValue} {driver.unit}</span>
                      <span className="font-bold text-cyan-400">+{driver.contributionPercent}% contribution</span>
                    </div>
                  </div>

                  <ProgressBar value={driver.contributionPercent} max={40} color={driver.severity === 'Extreme' ? 'rose' : driver.severity === 'High' ? 'orange' : 'amber'} showPercent={false} />

                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {driver.plainLanguageExplanation}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Model Metadata & Context */}
        <div className="space-y-6">
          <Card title="Model Metadata & Trust">
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Model Confidence</span>
                <span className="font-mono font-bold text-emerald-400">{scoreObj.confidencePercent}%</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Data Freshness</span>
                <span className="font-mono text-slate-200">15 mins ago</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Data Source</span>
                <span className="font-mono text-slate-200 text-right">{reading.sourceTag}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Calculation Method</span>
                <span className="font-mono text-cyan-400">Deterministic Baseline</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400 space-y-1 mt-3">
                <p className="font-semibold text-slate-300 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-cyan-400" /> Limitations
                </p>
                <p>{scoreObj.limitations}</p>
              </div>
            </div>
          </Card>

          {/* Nearby Resilience Infrastructure Context */}
          <Card title="Nearby Resilience Context">
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#0B192C] border border-slate-800">
                <LifeBuoy className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <p className="font-bold text-slate-200">Cooling Center Access</p>
                  <p className="text-[11px] text-slate-400">{loc.coolingAccessScore}% of ward residents within 10 min walk</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#0B192C] border border-slate-800">
                <TreePine className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <p className="font-bold text-slate-200">Green Space Coverage</p>
                  <p className="text-[11px] text-slate-400">{Math.round(loc.vegetationNdvi * 100)}% tree canopy (NDVI index)</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#0B192C] border border-slate-800">
                <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <p className="font-bold text-slate-200">Built-Up Concrete Density</p>
                  <p className="text-[11px] text-slate-400">{loc.builtUpDensity}% imperious surface cover</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Historical Trend */}
      <Card
        title="Historical Risk Score Trend"
        subtitle={`Retrospective analysis for ${loc.name}`}
        action={
          <div className="flex items-center gap-1 bg-[#0B192C] p-1 rounded-lg border border-slate-800 text-xs">
            {(['7 days', '30 days', '90 days'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setHistoryTab(tab)}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  historyTab === tab ? 'bg-cyan-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        }
      >
        <RiskTrendChart timeRange={historyTab} locationName={loc.name} />
      </Card>
    </div>
  );
};
