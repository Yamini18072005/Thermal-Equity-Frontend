import React from 'react';

interface MapLegendProps {
  activeLayer?: string;
}

export const MapLegend: React.FC<MapLegendProps> = ({ activeLayer = 'risk' }) => {
  return (
    <div className="bg-[#1E3E62]/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-3 shadow-xl text-xs space-y-2">
      <div className="flex items-center justify-between gap-4 border-b border-slate-700/60 pb-1.5">
        <span className="font-bold text-slate-200 uppercase text-[10px] tracking-wider">
          {activeLayer === 'vulnerability'
            ? 'Vulnerability Index'
            : activeLayer === 'vegetation'
            ? 'NDVI Green Canopy'
            : activeLayer === 'cooling'
            ? 'Cooling Space Deficit'
            : 'Thermal Equity Risk Score'}
        </span>
        <span className="text-[10px] font-mono text-cyan-400">0 – 100 Scale</span>
      </div>

      {activeLayer === 'risk' ? (
        <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-semibold">
          <div className="bg-emerald-950/80 text-emerald-300 border border-emerald-600/50 py-1 px-1.5 rounded">
            0–29 Low
          </div>
          <div className="bg-amber-950/80 text-amber-300 border border-amber-600/50 py-1 px-1.5 rounded">
            30–59 Mod
          </div>
          <div className="bg-orange-950/80 text-orange-300 border border-orange-600/50 py-1 px-1.5 rounded">
            60–79 High
          </div>
          <div className="bg-rose-950/80 text-rose-300 border border-rose-600/50 py-1 px-1.5 rounded">
            80–100 Extreme
          </div>
        </div>
      ) : activeLayer === 'vegetation' ? (
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
          <span className="text-rose-400">Sparse (&lt;10%)</span>
          <div className="h-2 flex-1 mx-3 rounded bg-gradient-to-r from-rose-600 via-amber-500 to-emerald-500" />
          <span className="text-emerald-400">Dense (&gt;40%)</span>
        </div>
      ) : (
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
          <span className="text-emerald-400">Low Burden</span>
          <div className="h-2 flex-1 mx-3 rounded bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-600" />
          <span className="text-rose-400">High Deficit</span>
        </div>
      )}
    </div>
  );
};
