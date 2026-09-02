import React from 'react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { FileCode, Info, ShieldCheck, HelpCircle } from 'lucide-react';

export const ModelTransparencyPage: React.FC = () => {
  const factorGlossary = [
    { name: 'Air Temperature', unit: '°C', weight: '15%', description: 'Surface air dry-bulb temperature measured at 2m height.' },
    { name: 'PM2.5 Airborne Particulates', unit: 'µg/m³', weight: '15%', description: 'Fine inhalable atmospheric particles with diameters 2.5 micrometers and smaller.' },
    { name: 'Relative Humidity', unit: '%', weight: '10%', description: 'Atmospheric moisture ratio; impairs human evaporative sweat cooling during heatwaves.' },
    { name: 'Solar UV Index', unit: '0 - 12+', weight: '5%', description: 'Direct solar ultraviolet radiation intensity at ground level.' },
    { name: 'Vulnerable Population Ratio', unit: '%', weight: '13.5%', description: 'Share of residents under 5, over 65, outdoor manual workers, and low-income households.' },
    { name: 'Built-up Concrete Density', unit: '%', weight: '10.5%', description: 'Proportion of impervious artificial surface cover retaining daytime heat.' },
    { name: 'Population Density', unit: 'ppl/km²', weight: '6.0%', description: 'Ward resident density intensifying collective exposure scale.' },
    { name: 'Cooling Space Deficit', unit: '% inverse', weight: '11.0%', description: 'Proportion of ward population without access to AC or public resilience cooling centers.' },
    { name: 'Tree Canopy Deficit (NDVI)', unit: '% inverse', weight: '9.0%', description: 'Inverse normalized difference vegetation index reflecting microclimate shade deficit.' }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <FileCode className="w-6 h-6 text-cyan-400" />
            <span>Model Transparency & Risk Methodology</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete mathematical specification, feature weightings, SHAP XAI formulation, and operational limitations.
          </p>
        </div>
      </div>

      {/* Baseline Mathematical Formula Card */}
      <Card title="Thermal Equity Risk Score Formulation">
        <div className="space-y-4 text-xs text-slate-200">
          <p className="leading-relaxed">
            The Thermal Equity Risk Score is a composite index scaled from <strong className="text-cyan-400">0 (Minimal Risk)</strong> to <strong className="text-rose-400">100 (Extreme Risk)</strong> computed deterministically per location according to three foundational pillars:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
            <div className="p-4 rounded-xl bg-[#0B192C] border border-cyan-900/50 space-y-1">
              <div className="flex justify-between items-center text-cyan-300 font-bold">
                <span>1. Environmental Exposure</span>
                <span className="text-base">50%</span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans mt-1">
                Fuses temperature (30%), PM2.5 (30%), relative humidity (20%), UV Index (10%), and secondary gaseous pollutants (10%).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0B192C] border border-amber-900/50 space-y-1">
              <div className="flex justify-between items-center text-amber-300 font-bold">
                <span>2. Social Vulnerability</span>
                <span className="text-base">30%</span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans mt-1">
                Fuses vulnerable demographic ratio (45%), built-up concrete surface density (35%), and population density (20%).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0B192C] border border-emerald-900/50 space-y-1">
              <div className="flex justify-between items-center text-emerald-300 font-bold">
                <span>3. Resilience Deficit</span>
                <span className="text-base">20%</span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans mt-1">
                Fuses inverse municipal cooling space accessibility (55%) and inverse tree canopy cover NDVI (45%).
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Factor Glossary Table */}
      <Card title="Factor Glossary & Global Weighting Table">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B192C] text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Factor Symbol</th>
                <th className="py-3 px-4">Unit</th>
                <th className="py-3 px-4">Global Weight</th>
                <th className="py-3 px-4">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono">
              {factorGlossary.map((fg, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-sans font-bold text-slate-100">{fg.name}</td>
                  <td className="py-3 px-4 text-cyan-400">{fg.unit}</td>
                  <td className="py-3 px-4 font-bold text-amber-400">{fg.weight}</td>
                  <td className="py-3 px-4 font-sans text-slate-300 text-[11px]">{fg.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Model Limitations & Disclaimers (Specified in PRD) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="Spatial Resolution & Missing Data Handling">
          <div className="space-y-2 text-xs text-slate-300">
            <p>
              <strong>Spatial Scale:</strong> Scored at ward and grid-cell level (10m - 100m spatial resolution). Spatial interpolation is performed via kriging where station density is sparse.
            </p>
            <p>
              <strong>Missing Telemetry:</strong> In the event of sensor outage, missing parameters fallback to nearest neighbor spatial interpolation marked as <code className="text-cyan-400">estimated</code>.
            </p>
          </div>
        </Card>

        <Card title="Decision Support & Medical Disclaimer">
          <div className="space-y-2 text-xs text-slate-300">
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-700/40 text-rose-200">
              <p className="font-semibold flex items-center gap-1">
                <Info className="w-4 h-4 text-rose-400" /> Non-Medical Advisory Notice
              </p>
              <p className="mt-1 text-[11px]">
                The Thermal Equity Risk Score is a decision-support metric for municipal resource allocation. It does not constitute a certified medical diagnosis or official emergency warning.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
