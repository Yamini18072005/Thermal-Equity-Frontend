import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataService } from '../services/dataService';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { InteractiveMap } from '../components/map/InteractiveMap';
import { MapPin, Search, ArrowRight, X, ShieldAlert } from 'lucide-react';
import { LocationData, RiskLevel } from '../types';

export const RiskMapPage: React.FC = () => {
  const navigate = useNavigate();
  const allScores = DataService.getAllRiskScores();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('All');
  const [selectedLoc, setSelectedLoc] = useState<LocationData | null>(allScores[0].location);

  // Extract unique districts
  const districts = ['All', ...Array.from(new Set(allScores.map(s => s.location.district)))];

  // Filtered scores
  const filteredScores = allScores.filter(s => {
    const matchesSearch =
      s.location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.location.district.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDistrict = selectedDistrict === 'All' || s.location.district === selectedDistrict;

    const matchesRisk = selectedRiskFilter === 'All' || s.classification === selectedRiskFilter;

    return matchesSearch && matchesDistrict && matchesRisk;
  });

  const activeScoreObj = selectedLoc
    ? allScores.find(s => s.locationId === selectedLoc.id) || allScores[0]
    : allScores[0];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-cyan-400" />
            <span>Interactive Environmental Risk Map</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Full spatial workspace combining surface temperature, PM2.5, vegetation canopy, and vulnerability overlays.
          </p>
        </div>

        {/* Status info */}
        <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1E3E62]/60 border border-slate-700/60">
            <span className="w-2 h-2 rounded-full bg-emerald-400 live-pulse-dot" />
            <span>{filteredScores.length} Wards Scored</span>
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 bg-[#1E3E62]/40 border border-slate-700/50 p-3 rounded-xl">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search ward or location..."
            className="w-full bg-[#0B192C] border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* District Filter */}
        <div>
          <select
            value={selectedDistrict}
            onChange={e => setSelectedDistrict(e.target.value)}
            className="w-full bg-[#0B192C] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="All">All Districts</option>
            {districts.filter(d => d !== 'All').map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Risk Level Filter */}
        <div>
          <select
            value={selectedRiskFilter}
            onChange={e => setSelectedRiskFilter(e.target.value)}
            className="w-full bg-[#0B192C] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="All">All Risk Levels</option>
            <option value="Extreme">Extreme Risk (80-100)</option>
            <option value="High">High Risk (60-79)</option>
            <option value="Moderate">Moderate Risk (30-59)</option>
            <option value="Low">Low Risk (0-29)</option>
          </select>
        </div>

        {/* Reset Filters */}
        <div className="flex items-center justify-end">
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedDistrict('All');
              setSelectedRiskFilter('All');
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Map Surface (3 cols) */}
        <div className="lg:col-span-3">
          <Card className="p-2">
            <InteractiveMap
              selectedLocationId={selectedLoc?.id}
              onSelectLocation={loc => setSelectedLoc(loc)}
              heightClass="h-[600px]"
            />
          </Card>
        </div>

        {/* Right Side: Location Rankings & Detail Drawer */}
        <div className="space-y-4">
          {/* Location Drawer */}
          {selectedLoc && (
            <Card
              title={
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-100">{selectedLoc.name}</span>
                  <button onClick={() => setSelectedLoc(null)} className="text-slate-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              }
              subtitle={selectedLoc.district}
            >
              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-center justify-between bg-[#0B192C] p-2.5 rounded-lg border border-slate-800">
                  <span>Risk Score</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-mono text-base text-slate-100">{activeScoreObj.score}/100</span>
                    <Badge level={activeScoreObj.classification} />
                  </div>
                </div>

                <p className="text-[11px] leading-relaxed text-slate-300">
                  {selectedLoc.description}
                </p>

                <div className="space-y-1 pt-1">
                  <p className="font-semibold text-slate-200">Top Drivers:</p>
                  {activeScoreObj.mainDrivers.slice(0, 3).map((d, i) => (
                    <div key={i} className="flex justify-between text-[11px] text-slate-400">
                      <span>• {d.factorName}</span>
                      <span className="font-mono text-cyan-400 font-bold">{d.contributionPercent}%</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => navigate(`/locations/${selectedLoc.id}`)}
                  className="w-full py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center justify-center gap-1 transition-colors mt-2"
                >
                  <span>Open Full Location Brief</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </Card>
          )}

          {/* Location Ranking Panel */}
          <Card title="Ranked Wards" subtitle={`Showing ${filteredScores.length} matching locations`}>
            <div className="max-h-[380px] overflow-y-auto space-y-2 pr-1">
              {filteredScores.map((s, idx) => (
                <div
                  key={s.locationId}
                  onClick={() => setSelectedLoc(s.location)}
                  className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                    selectedLoc?.id === s.locationId
                      ? 'bg-cyan-950/80 border-cyan-500 text-white'
                      : 'bg-[#0B192C]/70 border-slate-800 hover:bg-slate-800/50 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold font-mono text-slate-400">#{idx + 1}</span>
                      <span className="font-bold text-xs">{s.location.name}</span>
                    </div>
                    <span className="font-mono font-bold text-xs">{s.score}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                    <span className="truncate">{s.location.district}</span>
                    <Badge level={s.classification} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
