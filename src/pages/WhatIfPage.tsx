import React, { useState } from 'react';
import { DataService } from '../services/dataService';
import { runWhatIfSimulation } from '../services/simulationEngine';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { WhatIfImpactChart } from '../components/visualizations/WhatIfImpactChart';
import { Sliders, RotateCcw, Save, Download, Info, CheckCircle2, TrendingDown, Users } from 'lucide-react';
import { InterventionParameters } from '../types';

export const WhatIfPage: React.FC = () => {
  const locations = DataService.getLocations();
  const [selectedLocId, setSelectedLocId] = useState('manali-ennore');

  const loc = DataService.getLocationById(selectedLocId) || locations[0];
  const reading = DataService.getEnvironmentalReading(selectedLocId);

  // Intervention Sliders State
  const [params, setParams] = useState<InterventionParameters>({
    treePlantingCoverage: 15,
    coolRoofAdoption: 25,
    coolingCenterCount: 4,
    shadedBusStops: 12,
    waterStations: 8,
    pm25MitigationPct: 20
  });

  const [toastNotice, setToastNotice] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(null), 3000);
  };

  // Dynamic simulation computation
  const simResult = runWhatIfSimulation(loc, reading, params);

  const handleReset = () => {
    setParams({
      treePlantingCoverage: 0,
      coolRoofAdoption: 0,
      coolingCenterCount: 0,
      shadedBusStops: 0,
      waterStations: 0,
      pm25MitigationPct: 0
    });
    showToast('Reset simulation parameters to zero baseline');
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
            <Sliders className="w-6 h-6 text-cyan-400" />
            <span>Intervention What-If Simulator</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Simulate hypothetical urban climate interventions and quantify projected risk score reduction before committing capital.
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-1.5 transition-colors border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Simulation</span>
          </button>
          <button
            onClick={() => showToast(`Saved scenario '${loc.name} Mitigation Plan 2026'`)}
            className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-md"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Scenario</span>
          </button>
          <button
            onClick={() => showToast(`Exported simulation brief for ${loc.name}`)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Export Scenario Summary"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mandatory Disclaimer (Specified in PRD) */}
      <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-600/40 text-xs text-amber-200 flex items-center gap-2">
        <Info className="w-4 h-4 text-amber-400 shrink-0" />
        <span className="font-semibold">Disclaimer:</span>
        <span className="text-amber-200/90">
          “Estimated simulation — not an official forecast. Actual outcomes depend on real-world engineering execution, weather timing, and factors outside the model scope.”
        </span>
      </div>

      {/* Target Location Selector */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-300">Select Target Ward:</span>
            <select
              value={selectedLocId}
              onChange={e => setSelectedLocId(e.target.value)}
              className="bg-[#0B192C] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 font-bold focus:outline-none focus:border-cyan-500"
            >
              {locations.map(l => (
                <option key={l.id} value={l.id}>{l.name} ({l.district})</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span>Baseline Risk: <strong className="text-rose-400 text-sm">{simResult.baselineScore}/100</strong></span>
            <span>Projected Risk: <strong className="text-emerald-400 text-sm">{simResult.projectedScore}/100</strong></span>
          </div>
        </div>
      </Card>

      {/* Main Simulator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Sliders & Controls */}
        <Card title="Intervention Controls" subtitle="Adjust parameter sliders to modify local microclimate features.">
          <div className="space-y-5 text-xs">
            {/* Slider 1: Tree Canopy */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-200">Urban Tree Canopy Coverage (+NDVI)</span>
                <span className="font-mono text-cyan-400">+{params.treePlantingCoverage}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={params.treePlantingCoverage}
                onChange={e => setParams({ ...params, treePlantingCoverage: Number(e.target.value) })}
                className="w-full accent-cyan-500 bg-slate-800 rounded-lg h-2"
              />
              <p className="text-[10px] text-slate-400">Increases street tree shade and lowers ambient surface heat.</p>
            </div>

            {/* Slider 2: Cool Roofs */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-200">Cool Roof Albedo Adoption</span>
                <span className="font-mono text-cyan-400">{params.coolRoofAdoption}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={params.coolRoofAdoption}
                onChange={e => setParams({ ...params, coolRoofAdoption: Number(e.target.value) })}
                className="w-full accent-cyan-500 bg-slate-800 rounded-lg h-2"
              />
              <p className="text-[10px] text-slate-400">Reduces concrete surface heat storage in dense residential wards.</p>
            </div>

            {/* Slider 3: Cooling Centers */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-200">New Public Resilience Cooling Centers</span>
                <span className="font-mono text-cyan-400">+{params.coolingCenterCount} centers</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={params.coolingCenterCount}
                onChange={e => setParams({ ...params, coolingCenterCount: Number(e.target.value) })}
                className="w-full accent-cyan-500 bg-slate-800 rounded-lg h-2"
              />
              <p className="text-[10px] text-slate-400">Provides air-conditioned daytime shelter access to vulnerable groups.</p>
            </div>

            {/* Slider 4: Shaded Bus Stops */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-200">Shaded & Mist-Cooled Transit Shelters</span>
                <span className="font-mono text-cyan-400">+{params.shadedBusStops} shelters</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={params.shadedBusStops}
                onChange={e => setParams({ ...params, shadedBusStops: Number(e.target.value) })}
                className="w-full accent-cyan-500 bg-slate-800 rounded-lg h-2"
              />
              <p className="text-[10px] text-slate-400">Protects transit commuters from direct daytime solar UV radiation.</p>
            </div>

            {/* Slider 5: Water Stations */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-200">Public Hydration Water Stations</span>
                <span className="font-mono text-cyan-400">+{params.waterStations} kiosks</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                value={params.waterStations}
                onChange={e => setParams({ ...params, waterStations: Number(e.target.value) })}
                className="w-full accent-cyan-500 bg-slate-800 rounded-lg h-2"
              />
              <p className="text-[10px] text-slate-400">Prevents acute outdoor worker dehydration during heatwaves.</p>
            </div>

            {/* Slider 6: PM2.5 Mitigation */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-200">PM2.5 Industrial Mitigation Control</span>
                <span className="font-mono text-cyan-400">-{params.pm25MitigationPct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={params.pm25MitigationPct}
                onChange={e => setParams({ ...params, pm25MitigationPct: Number(e.target.value) })}
                className="w-full accent-cyan-500 bg-slate-800 rounded-lg h-2"
              />
              <p className="text-[10px] text-slate-400">Enforces wet dust suppression & stack filtration controls.</p>
            </div>
          </div>
        </Card>

        {/* Right Column (2 cols): Projected Results & Impact Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Simulation KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-emerald-900/40 bg-gradient-to-br from-[#1E3E62] to-[#0D2A26]">
              <span className="text-xs font-semibold text-slate-300 uppercase">Projected Risk Score</span>
              <div className="mt-2 flex items-baseline gap-2 font-mono">
                <span className="text-3xl font-black text-emerald-300">{simResult.projectedScore}</span>
                <span className="text-xs text-slate-400">/ 100</span>
              </div>
              <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-mono">
                <TrendingDown className="w-3.5 h-3.5" />
                <span>-{simResult.scoreReduction} risk points reduced</span>
              </p>
            </Card>

            <Card>
              <span className="text-xs font-semibold text-slate-300 uppercase">Population Benefited</span>
              <div className="mt-2 flex items-baseline gap-2 font-mono">
                <span className="text-3xl font-black text-slate-100">{simResult.populationBenefited.toLocaleString()}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span>Vulnerable ward residents</span>
              </p>
            </Card>

            <Card>
              <span className="text-xs font-semibold text-slate-300 uppercase">Implementation Complexity</span>
              <div className="mt-2">
                <Badge level={simResult.implementationComplexity} />
              </div>
              <p className="text-[11px] text-slate-400 mt-2 font-mono">
                Timeline: {simResult.timelineEstimate}
              </p>
            </Card>
          </div>

          {/* Before / After Factor Breakdown Chart */}
          <Card
            title="Before vs After Factor Contribution Comparison"
            subtitle={`Impact of selected interventions on ${loc.name}'s risk drivers.`}
          >
            <WhatIfImpactChart data={simResult.beforeAfterDrivers} />
          </Card>

          {/* Simulation Summary Narrative */}
          <Card title="Simulation Impact Summary">
            <p className="text-xs text-slate-200 leading-relaxed bg-[#0B192C] p-4 rounded-xl border border-slate-800">
              {simResult.summary}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};
