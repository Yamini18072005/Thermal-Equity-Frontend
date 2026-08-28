import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  Flame,
  Users,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  MapPin,
  ArrowUpRight,
  TrendingUp,
  Info
} from 'lucide-react';
import { DataService } from '../services/dataService';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { InteractiveMap } from '../components/map/InteractiveMap';
import { BurdenDonutChart } from '../components/visualizations/BurdenDonutChart';
import { RiskTrendChart } from '../components/visualizations/RiskTrendChart';
import { LocationData } from '../types';

export const OverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const context = useOutletContext<{ timeRange?: string }>();
  const timeRange = context?.timeRange || 'Today';

  const summary = DataService.getDashboardSummary();
  const scores = DataService.getAllRiskScores().sort((a, b) => b.score - a.score);

  const [selectedLoc, setSelectedLoc] = useState<LocationData>(
    DataService.getLocationById('manali-ennore') || scores[0].location
  );

  const selectedScore = DataService.getRiskScore(selectedLoc.id);
  const selectedReading = DataService.getEnvironmentalReading(selectedLoc.id);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-100 tracking-tight">
              Where exposure meets inequity.
            </h1>
            <Badge level="Demo Live View" variant="mode" />
          </div>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            A current, explainable view of environmental burden across the Chennai Metropolitan Region. Use it to move from signal to a first action.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/risk-map')}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-cyan-950/50 transition-all"
          >
            <MapPin className="w-4 h-4" />
            <span>Open Full Risk Map</span>
          </button>
        </div>
      </div>

      {/* 4 Core KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Region Burden */}
        <Card className="border-cyan-900/40 bg-gradient-to-br from-[#1E3E62] to-[#0D253A]">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Region Burden</span>
            <Flame className="w-5 h-5 text-orange-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-100 font-mono">{summary.regionBurdenScore}</span>
            <span className="text-xs font-semibold text-slate-400">/ 100</span>
            <Badge level="High Risk" className="ml-auto" />
          </div>
          <p className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>{summary.scoreChange}</span>
          </p>
        </Card>

        {/* KPI 2: People Exposed */}
        <Card className="border-slate-700/60">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">People Exposed</span>
            <Users className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-100 font-mono">{summary.peopleExposed}</span>
            <span className="text-xs text-slate-400">residents</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Estimated affected population in high-burden wards
          </p>
        </Card>

        {/* KPI 3: Critical Zones */}
        <Card className="border-rose-900/30">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Critical Zones</span>
            <AlertTriangle className="w-5 h-5 text-rose-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-300 font-mono">{summary.criticalZonesCount}</span>
            <span className="text-xs text-slate-400">locations</span>
          </div>
          <p className="text-[11px] text-rose-400 mt-2">
            Requiring immediate municipal mitigation
          </p>
        </Card>

        {/* KPI 4: Model Confidence */}
        <Card className="border-slate-700/60">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Model Confidence</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-100 font-mono">{summary.modelConfidence}%</span>
            <span className="text-xs text-slate-400">quality rating</span>
          </div>
          <p className="text-[11px] text-emerald-400 mt-2">
            Based on CPCB & IMD telemetry feeds
          </p>
        </Card>
      </div>

      {/* Main Spatial Map Section */}
      <Card
        title="Combined burden by zone"
        subtitle="Estimated surface heat, air quality, vegetation and social vulnerability across Chennai Metropolitan Area."
        action={
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 live-pulse-dot" />
            <span>Updated 09:30 AM IST</span>
          </div>
        }
      >
        <InteractiveMap
          selectedLocationId={selectedLoc.id}
          onSelectLocation={loc => setSelectedLoc(loc)}
          heightClass="h-[480px]"
        />
      </Card>

      {/* Selected Location Highlight Card (PRD Example: Manali-Ennore) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card
            title={
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-slate-100">{selectedLoc.name} Focus Analysis</span>
                <Badge level={selectedScore.classification} />
              </div>
            }
            subtitle={`${selectedLoc.district} — Score ${selectedScore.score}/100`}
            action={
              <button
                onClick={() => navigate(`/locations/${selectedLoc.id}`)}
                className="px-3 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-700/50 hover:bg-cyan-900 transition-colors text-xs font-semibold flex items-center gap-1"
              >
                <span>View Full Details</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            }
          >
            <div className="space-y-5">
              {/* Key Environmental Readings Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 p-3.5 rounded-xl bg-[#0B192C] border border-slate-800">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Temperature</p>
                  <p className="text-base font-bold font-mono text-orange-400">{selectedReading.temperature}°C</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">PM2.5</p>
                  <p className="text-base font-bold font-mono text-rose-400">{selectedReading.pm25} µg/m³</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Humidity</p>
                  <p className="text-base font-bold font-mono text-teal-400">{selectedReading.humidity}%</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">UV Index</p>
                  <p className="text-base font-bold font-mono text-amber-400">{selectedReading.uvIndex}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Cooling Access</p>
                  <p className="text-base font-bold font-mono text-cyan-400">{selectedLoc.coolingAccessScore}%</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Vegetation (NDVI)</p>
                  <p className="text-base font-bold font-mono text-emerald-400">{Math.round(selectedLoc.vegetationNdvi * 100)}%</p>
                </div>
              </div>

              {/* AI Field Note Banner (Clearly Labeled as specified in PRD) */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-teal-950/80 via-slate-900 to-cyan-950/80 border border-teal-600/40 space-y-1.5 shadow-md">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-400" />
                  <span className="text-xs font-bold text-teal-300 uppercase tracking-wider">AI-Generated Field Note</span>
                  <span className="text-[10px] font-mono text-slate-400 ml-auto">Confidence: {selectedScore.confidencePercent}%</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed italic">
                  "{selectedScore.aiFieldNote}"
                </p>
              </div>

              {/* 7-Day Trend Chart */}
              <RiskTrendChart timeRange={timeRange} locationName={selectedLoc.name} />
            </div>
          </Card>
        </div>

        {/* Right Side: Burden Donut Profile */}
        <div className="space-y-6">
          <Card
            title="What is driving risk?"
            subtitle="Factor contribution distribution across regional exposure."
          >
            <BurdenDonutChart />
          </Card>

          {/* Model Transparency Quick Disclaimer */}
          <div className="p-3.5 rounded-xl bg-[#1E3E62]/40 border border-slate-700/50 text-xs text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
              <Info className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Decision Support Disclaimer</span>
            </div>
            <p className="text-[11px]">
              Scores are calculated via deterministic baseline formula (50% Exposure, 30% Vulnerability, 20% Access Deficit). Values are decision-support estimates.
            </p>
          </div>
        </div>
      </div>

      {/* Priority Queue Section: Ranked Locations Table */}
      <Card
        title="Priority Action Queue"
        subtitle="Monitored locations ranked by cumulative risk score and vulnerable population."
        action={
          <button
            onClick={() => navigate('/locations')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
          >
            <span>View All Wards</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B192C]/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Location Name</th>
                <th className="py-3 px-4">District</th>
                <th className="py-3 px-4">Risk Score</th>
                <th className="py-3 px-4">Classification</th>
                <th className="py-3 px-4">Exposed Pop</th>
                <th className="py-3 px-4">Primary Driver</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {scores.map((s, idx) => (
                <tr
                  key={s.locationId}
                  className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                  onClick={() => navigate(`/locations/${s.locationId}`)}
                >
                  <td className="py-3 px-4 font-bold text-slate-400">#{idx + 1}</td>
                  <td className="py-3 px-4 font-sans font-bold text-slate-100">{s.location.name}</td>
                  <td className="py-3 px-4 font-sans text-slate-300 text-[11px]">{s.location.district}</td>
                  <td className="py-3 px-4 font-bold text-slate-100">{s.score} / 100</td>
                  <td className="py-3 px-4 font-sans">
                    <Badge level={s.classification} />
                  </td>
                  <td className="py-3 px-4 text-slate-300">{s.location.population.toLocaleString()}</td>
                  <td className="py-3 px-4 font-sans text-slate-300 text-[11px]">
                    {s.mainDrivers[0]?.factorName} ({s.mainDrivers[0]?.contributionPercent}%)
                  </td>
                  <td className="py-3 px-4 text-right font-sans">
                    <button className="text-cyan-400 hover:text-cyan-300 text-xs font-semibold">Inspect &rarr;</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
