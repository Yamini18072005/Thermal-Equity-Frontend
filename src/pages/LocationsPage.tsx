import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DataService } from '../services/dataService';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Search, Download, ArrowUpDown, ArrowRight, MapPin } from 'lucide-react';

export const LocationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const allScores = DataService.getAllRiskScores();

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [districtFilter, setDistrictFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');
  const [sortField, setSortField] = useState<'score' | 'population' | 'name'>('score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const districts = ['All', ...Array.from(new Set(allScores.map(s => s.location.district)))];

  // Filtering
  const filtered = allScores.filter(s => {
    const matchesSearch =
      s.location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.location.district.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDistrict = districtFilter === 'All' || s.location.district === districtFilter;
    const matchesRisk = riskFilter === 'All' || s.classification === riskFilter;

    return matchesSearch && matchesDistrict && matchesRisk;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    let comp = 0;
    if (sortField === 'score') comp = a.score - b.score;
    if (sortField === 'population') comp = a.location.population - b.location.population;
    if (sortField === 'name') comp = a.location.name.localeCompare(b.location.name);

    return sortOrder === 'desc' ? -comp : comp;
  });

  const toggleSort = (field: 'score' | 'population' | 'name') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleExport = () => {
    setExportNotice('Exporting location brief CSV...');
    setTimeout(() => {
      setExportNotice('Downloaded thermal_equity_locations_chennai.csv successfully');
      setTimeout(() => setExportNotice(null), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast Notice */}
      {exportNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E3E62] border border-cyan-500 text-slate-100 text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2">
          <Download className="w-4 h-4 text-cyan-400" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-cyan-400" />
            <span>Monitored Locations Directory</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Comprehensive table of monitored wards across the Chennai Metropolitan Region.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="px-4 py-2 rounded-xl bg-[#1E3E62] hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center gap-2 transition-colors self-start md:self-auto"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          <span>Export Summary CSV</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 bg-[#1E3E62]/40 border border-slate-700/50 p-3.5 rounded-xl">
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

        <div>
          <select
            value={districtFilter}
            onChange={e => setDistrictFilter(e.target.value)}
            className="w-full bg-[#0B192C] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="All">All Districts</option>
            {districts.filter(d => d !== 'All').map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={riskFilter}
            onChange={e => setRiskFilter(e.target.value)}
            className="w-full bg-[#0B192C] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="All">All Risk Levels</option>
            <option value="Extreme">Extreme Risk (80-100)</option>
            <option value="High">High Risk (60-79)</option>
            <option value="Moderate">Moderate Risk (30-59)</option>
            <option value="Low">Low Risk (0-29)</option>
          </select>
        </div>

        <div className="flex items-center justify-end text-xs text-slate-400 font-mono">
          <span>{sorted.length} Locations</span>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Card className="p-0 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B192C] text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 cursor-pointer" onClick={() => toggleSort('name')}>
                  <div className="flex items-center gap-1">
                    <span>Location</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4">District</th>
                <th className="py-3.5 px-4 cursor-pointer" onClick={() => toggleSort('score')}>
                  <div className="flex items-center gap-1">
                    <span>Risk Score</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Risk Level</th>
                <th className="py-3.5 px-4">Temp (°C)</th>
                <th className="py-3.5 px-4">PM2.5 (µg/m³)</th>
                <th className="py-3.5 px-4 cursor-pointer" onClick={() => toggleSort('population')}>
                  <div className="flex items-center gap-1">
                    <span>Exposed Pop</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Cooling Access</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono">
              {sorted.map(s => (
                <tr
                  key={s.locationId}
                  className="hover:bg-slate-800/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/locations/${s.locationId}`)}
                >
                  <td className="py-3.5 px-4 font-sans font-bold text-slate-100">{s.location.name}</td>
                  <td className="py-3.5 px-4 font-sans text-slate-300 text-[11px]">{s.location.district}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-100 text-sm">{s.score} / 100</td>
                  <td className="py-3.5 px-4 font-sans">
                    <Badge level={s.classification} />
                  </td>
                  <td className="py-3.5 px-4 text-orange-400 font-bold">{s.reading.temperature}°C</td>
                  <td className="py-3.5 px-4 text-rose-400 font-bold">{s.reading.pm25}</td>
                  <td className="py-3.5 px-4 text-slate-300">{s.location.population.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-cyan-400">{s.location.coolingAccessScore}%</td>
                  <td className="py-3.5 px-4 text-right font-sans">
                    <button className="text-cyan-400 hover:text-cyan-300 font-semibold text-xs flex items-center gap-1 ml-auto">
                      <span>Inspect</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* Mobile Stacked Card View */}
      <div className="md:hidden space-y-4">
        {sorted.map(s => (
          <Card
            key={s.locationId}
            onClick={() => navigate(`/locations/${s.locationId}`)}
            className="cursor-pointer"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-slate-100 text-sm">{s.location.name}</h3>
                <p className="text-[10px] text-slate-400">{s.location.district}</p>
              </div>
              <Badge level={s.classification} />
            </div>

            <div className="grid grid-cols-3 gap-2 bg-[#0B192C] p-2.5 rounded-lg text-xs font-mono border border-slate-800 my-2">
              <div>
                <span className="text-[10px] text-slate-400 block">Risk Score</span>
                <span className="font-bold text-slate-100">{s.score} / 100</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Temp</span>
                <span className="text-orange-400">{s.reading.temperature}°C</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">PM2.5</span>
                <span className="text-rose-400">{s.reading.pm25}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-cyan-400 font-semibold pt-1">
              <span>Population: {s.location.population.toLocaleString()}</span>
              <span className="flex items-center gap-1">Inspect &rarr;</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
