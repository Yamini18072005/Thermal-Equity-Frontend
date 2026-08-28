import React from 'react';
import { Layers, Maximize2, RotateCcw, ShieldAlert, Trees, Snowflake, Users } from 'lucide-react';

interface MapControlsProps {
  activeLayer: string;
  onSelectLayer: (layerId: string) => void;
  onResetView?: () => void;
  onToggleFullscreen?: () => void;
  isFullscreen?: boolean;
}

export const MapControls: React.FC<MapControlsProps> = ({
  activeLayer,
  onSelectLayer,
  onResetView,
  onToggleFullscreen,
  isFullscreen
}) => {
  const layers = [
    { id: 'risk', label: 'Risk Score', icon: ShieldAlert },
    { id: 'vulnerability', label: 'Vulnerability', icon: Users },
    { id: 'cooling', label: 'Cooling Access', icon: Snowflake },
    { id: 'vegetation', label: 'Vegetation (NDVI)', icon: Trees }
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-[#1E3E62]/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-2.5 shadow-xl text-xs">
      {/* Layer Toggles */}
      <div className="flex flex-wrap items-center gap-1.5">
        <div className="flex items-center gap-1 text-slate-400 font-semibold px-2 text-[11px] uppercase tracking-wider">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Layers:</span>
        </div>
        {layers.map(l => {
          const Icon = l.icon;
          const isActive = activeLayer === l.id;
          return (
            <button
              key={l.id}
              onClick={() => onSelectLayer(l.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all ${
                isActive
                  ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-950'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{l.label}</span>
            </button>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1">
        {onResetView && (
          <button
            onClick={onResetView}
            className="p-1.5 rounded-lg bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            title="Reset Map Bounds"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
        {onToggleFullscreen && (
          <button
            onClick={onToggleFullscreen}
            className="p-1.5 rounded-lg bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen View'}
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
