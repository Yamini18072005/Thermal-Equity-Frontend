import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DataService } from '../services/dataService';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Flame, AlertTriangle, Layers, Info, ArrowRight, ShieldAlert } from 'lucide-react';

export const CompoundRisksPage: React.FC = () => {
  const navigate = useNavigate();
  const compoundRisks = DataService.getCompoundRisks();

  const extremeCount = compoundRisks.filter(cr => cr.severity === 'Extreme').length;
  const totalAffected = Array.from(new Set(compoundRisks.flatMap(cr => cr.affectedLocationIds))).length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Flame className="w-6 h-6 text-orange-400" />
            <span>Compound Environmental Risk Center</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Detecting co-occurring environmental hazards where multiple moderate-to-high stressors multiply community burden.
          </p>
        </div>
      </div>

      {/* Explanatory Banner (Specified in PRD) */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-[#1E3E62] via-slate-900 to-cyan-950/80 border border-cyan-500/40 text-xs text-slate-200 flex items-start gap-3 shadow-lg">
        <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-slate-100">Understanding Compound Risk</p>
          <p className="text-slate-300 mt-0.5 leading-relaxed">
            “Compound risk means multiple environmental stressors are occurring together. The combined burden may be materially higher than any single factor viewed alone.”
          </p>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-cyan-900/40">
          <span className="text-xs font-semibold text-slate-400 uppercase">Active Compound Risks</span>
          <p className="text-3xl font-black text-slate-100 font-mono mt-2">{compoundRisks.length}</p>
          <p className="text-[11px] text-cyan-400 mt-1">Simultaneous multi-hazard states</p>
        </Card>

        <Card className="border-rose-900/40">
          <span className="text-xs font-semibold text-slate-400 uppercase">Extreme Compound Risks</span>
          <p className="text-3xl font-black text-rose-300 font-mono mt-2">{extremeCount}</p>
          <p className="text-[11px] text-rose-400 mt-1">Requires immediate intervention</p>
        </Card>

        <Card>
          <span className="text-xs font-semibold text-slate-400 uppercase">Locations Affected</span>
          <p className="text-3xl font-black text-slate-100 font-mono mt-2">{totalAffected}</p>
          <p className="text-[11px] text-slate-400 mt-1">Unique municipal wards</p>
        </Card>

        <Card>
          <span className="text-xs font-semibold text-slate-400 uppercase">New Risks Today</span>
          <p className="text-3xl font-black text-emerald-400 font-mono mt-2">2</p>
          <p className="text-[11px] text-slate-400 mt-1">Detected in past 6 hours</p>
        </Card>
      </div>

      {/* Compound Risk Cards */}
      <div className="space-y-6">
        {compoundRisks.map(cr => (
          <Card key={cr.id} className="border-slate-700/80">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 border-b border-slate-700/60 pb-4">
              <div>
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
                  <h3 className="text-lg font-bold text-slate-100">{cr.title}</h3>
                  <Badge level={cr.severity} />
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Detected at {cr.detectedAt.split('T')[1].substring(0, 5)} IST via <span className="text-cyan-400 font-mono">{cr.sourceType}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">{cr.affectedLocationNames.length} Locations Affected</span>
              </div>
            </div>

            {/* Content Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
              {/* Co-occurring Factors */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Co-occurring Factors:</p>
                <div className="space-y-1.5 font-mono text-xs">
                  {cr.factorsInvolved.map((f, i) => (
                    <div key={i} className="p-2 rounded bg-[#0B192C] border border-slate-800 text-slate-200">
                      • {f}
                    </div>
                  ))}
                </div>
              </div>

              {/* Explanation & Impact */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Compounded Mechanism:</p>
                <p className="text-xs text-slate-300 leading-relaxed bg-[#0B192C]/50 p-3 rounded-xl border border-slate-800">
                  {cr.explanation}
                </p>
              </div>

              {/* Priority Public Action Advice */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Recommended Public Action:</p>
                <div className="p-3 rounded-xl bg-teal-950/40 border border-teal-700/40 text-xs text-teal-200 leading-relaxed">
                  {cr.publicActionAdvice}
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => navigate(`/locations/${cr.affectedLocationIds[0]}`)}
                    className="w-full py-2 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Inspect Affected Ward ({cr.affectedLocationNames[0]})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
