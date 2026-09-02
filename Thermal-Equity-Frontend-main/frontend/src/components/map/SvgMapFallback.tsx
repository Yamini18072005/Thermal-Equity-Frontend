import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataService } from '../../services/dataService';
import { LocationData, RiskScoreResult, EnvironmentalReading } from '../../types';
import { MapPin, ArrowRight, ShieldAlert, Thermometer, Wind, Droplets } from 'lucide-react';
import { Badge } from '../common/Badge';

interface SvgMapFallbackProps {
  selectedLocationId?: string;
  onSelectLocation?: (loc: LocationData) => void;
  activeLayer?: string;
  heightClass?: string;
}

export const SvgMapFallback: React.FC<SvgMapFallbackProps> = ({
  selectedLocationId,
  onSelectLocation,
  activeLayer = 'risk',
  heightClass = 'h-[500px]'
}) => {
  const navigate = useNavigate();
  const allScores = DataService.getAllRiskScores();

  // Internal selection state if not controlled externally
  const [internalSelectedId, setInternalSelectedId] = useState<string | undefined>(
    selectedLocationId || 'manali-ennore'
  );

  const activeId = selectedLocationId !== undefined ? selectedLocationId : internalSelectedId;
  const activeScoreObj = allScores.find(s => s.locationId === activeId) || allScores[0];

  const handleSelect = (item: (typeof allScores)[0]) => {
    setInternalSelectedId(item.locationId);
    if (onSelectLocation) {
      onSelectLocation(item.location);
    }
  };

  // Coordinates mapping to SVG X/Y viewbox (0 to 800 width, 0 to 600 height)
  // Chennai bounding box: Lat 12.85 to 13.20, Lng 80.05 to 80.35
  const getSvgCoordinates = (lat: number, lng: number) => {
    const minLat = 12.85, maxLat = 13.22;
    const minLng = 80.05, maxLng = 80.35;

    const x = ((lng - minLng) / (maxLng - minLng)) * 700 + 50;
    // Invert Y because SVG 0 is top
    const y = 550 - (((lat - minLat) / (maxLat - minLat)) * 500);

    return { x: Math.round(x), y: Math.round(y) };
  };

  const getLayerColor = (scoreObj: typeof allScores[0]) => {
    if (activeLayer === 'vulnerability') {
      const vulnScore = scoreObj.vulnerabilitySubScore;
      return vulnScore > 75 ? '#ef4444' : vulnScore > 50 ? '#f97316' : vulnScore > 30 ? '#f59e0b' : '#10b981';
    }
    if (activeLayer === 'vegetation') {
      const ndvi = scoreObj.location.vegetationNdvi;
      return ndvi < 0.12 ? '#ef4444' : ndvi < 0.25 ? '#f97316' : ndvi < 0.35 ? '#f59e0b' : '#10b981';
    }
    if (activeLayer === 'cooling') {
      const cool = scoreObj.location.coolingAccessScore;
      return cool < 35 ? '#ef4444' : cool < 55 ? '#f97316' : cool < 70 ? '#f59e0b' : '#10b981';
    }

    // Default Risk Score
    if (scoreObj.score >= 80) return '#dc2626'; // Extreme Red
    if (scoreObj.score >= 60) return '#ea580c'; // High Orange
    if (scoreObj.score >= 30) return '#d97706'; // Moderate Amber
    return '#059669'; // Low Emerald
  };

  return (
    <div className={`relative w-full ${heightClass} bg-[#091424] border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col`}>
      {/* SVG Canvas Map Surface */}
      <div className="relative flex-1 w-full h-full">
        <svg
          viewBox="0 0 800 600"
          className="w-full h-full object-cover select-none"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Water Gradient */}
            <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0b2447" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#19376d" stopOpacity="0.8" />
            </linearGradient>

            {/* Zone Glow Filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Land Surface */}
          <rect x="0" y="0" width="800" height="600" fill="#0b192c" />

          {/* Grid lines */}
          <g stroke="#1e3e62" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.3">
            <line x1="100" y1="0" x2="100" y2="600" />
            <line x1="250" y1="0" x2="250" y2="600" />
            <line x1="400" y1="0" x2="400" y2="600" />
            <line x1="550" y1="0" x2="550" y2="600" />
            <line x1="700" y1="0" x2="700" y2="600" />
            <line x1="0" y1="150" x2="800" y2="150" />
            <line x1="0" y1="300" x2="800" y2="300" />
            <line x1="0" y1="450" x2="800" y2="450" />
          </g>

          {/* Bay of Bengal Ocean Coastline (Right Side) */}
          <path
            d="M 680 0 Q 640 150 630 300 Q 620 450 660 600 L 800 600 L 800 0 Z"
            fill="url(#oceanGrad)"
            stroke="#00adb5"
            strokeWidth="1"
            opacity="0.9"
          />
          <text x="730" y="280" fill="#00adb5" fontSize="12" fontWeight="bold" opacity="0.6" transform="rotate(90, 730, 280)">
            BAY OF BENGAL
          </text>

          {/* Rivers (Cooum & Adyar) */}
          {/* Cooum River */}
          <path
            d="M 50 280 C 200 290 350 250 500 270 C 580 280 610 260 635 250"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="3"
            opacity="0.7"
          />
          <text x="360" y="255" fill="#38bdf8" fontSize="9" opacity="0.7">Cooum River</text>

          {/* Adyar River */}
          <path
            d="M 80 440 C 250 430 420 420 540 430 C 580 435 600 450 625 460"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="3"
            opacity="0.7"
          />
          <text x="400" y="415" fill="#38bdf8" fontSize="9" opacity="0.7">Adyar River</text>

          {/* Major Road Corridors */}
          {/* GST Road */}
          <path d="M 220 580 L 450 360 L 520 280" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="3 3" />
          {/* OMR IT Highway */}
          <path d="M 520 370 L 560 580" fill="none" stroke="#334155" strokeWidth="2.5" />

          {/* Zone Polygon Heat Overlays */}
          {allScores.map(scoreObj => {
            const { x, y } = getSvgCoordinates(scoreObj.location.coordinates.lat, scoreObj.location.coordinates.lng);
            const color = getLayerColor(scoreObj);
            const isSelected = scoreObj.locationId === activeId;

            return (
              <g key={`zone-${scoreObj.locationId}`}>
                {/* Micro Polygon Zone */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 38 : 28}
                  fill={color}
                  fillOpacity={isSelected ? 0.35 : 0.2}
                  stroke={color}
                  strokeWidth={isSelected ? 2 : 1}
                  filter={isSelected ? 'url(#glow)' : undefined}
                  className="transition-all duration-300 cursor-pointer"
                  onClick={() => handleSelect(scoreObj)}
                />
              </g>
            );
          })}

          {/* Interactive Marker Pins */}
          {allScores.map(scoreObj => {
            const { x, y } = getSvgCoordinates(scoreObj.location.coordinates.lat, scoreObj.location.coordinates.lng);
            const color = getLayerColor(scoreObj);
            const isSelected = scoreObj.locationId === activeId;

            return (
              <g
                key={`pin-${scoreObj.locationId}`}
                transform={`translate(${x}, ${y})`}
                onClick={() => handleSelect(scoreObj)}
                className="cursor-pointer group"
              >
                {/* Pulse Ring for Extreme Risk */}
                {scoreObj.score >= 80 && (
                  <circle r="16" fill="none" stroke="#ef4444" strokeWidth="1.5" className="animate-ping opacity-75" />
                )}

                {/* Marker Outer Container */}
                <rect
                  x="-18"
                  y="-12"
                  width="36"
                  height="24"
                  rx="6"
                  fill="#1e3e62"
                  stroke={color}
                  strokeWidth={isSelected ? "2.5" : "1.5"}
                  className="transition-transform duration-200 group-hover:scale-110 shadow-lg"
                />

                {/* Marker Score Text */}
                <text
                  x="0"
                  y="4"
                  fill="#ffffff"
                  fontSize="11"
                  fontWeight="bold"
                  textAnchor="middle"
                  className="font-mono"
                >
                  {scoreObj.score}
                </text>

                {/* Location Name Label */}
                <text
                  x="0"
                  y="24"
                  fill={isSelected ? '#38bdf8' : '#cbd5e1'}
                  fontSize="10"
                  fontWeight={isSelected ? 'bold' : 'normal'}
                  textAnchor="middle"
                  className="drop-shadow-md pointer-events-none"
                >
                  {scoreObj.location.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Location Quick Detail Popup Card overlay */}
        {activeScoreObj && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md bg-[#1E3E62]/95 backdrop-blur-md border border-slate-700/80 rounded-xl p-4 shadow-2xl z-10 text-xs text-slate-200 animate-fadeIn">
            <div className="flex items-start justify-between gap-3 border-b border-slate-700/60 pb-2 mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <h4 className="font-bold text-slate-100 text-sm">{activeScoreObj.location.name}</h4>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">{activeScoreObj.location.district}</p>
              </div>
              <Badge level={activeScoreObj.classification} />
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 py-2 bg-[#0B192C]/60 rounded-lg p-2.5 mb-3 border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Thermometer className="w-3 h-3 text-orange-400" /> Temp
                </span>
                <p className="font-mono font-bold text-slate-100">{activeScoreObj.reading.temperature}°C</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Wind className="w-3 h-3 text-cyan-400" /> PM2.5
                </span>
                <p className="font-mono font-bold text-slate-100">{activeScoreObj.reading.pm25} µg/m³</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Droplets className="w-3 h-3 text-teal-400" /> Humidity
                </span>
                <p className="font-mono font-bold text-slate-100">{activeScoreObj.reading.humidity}%</p>
              </div>
            </div>

            {/* Secondary Factors */}
            <div className="flex items-center justify-between text-[11px] text-slate-300 mb-3">
              <span>Cooling Access: <strong className="text-slate-100">{activeScoreObj.location.coolingAccessScore}%</strong></span>
              <span>Canopy (NDVI): <strong className="text-slate-100">{Math.round(activeScoreObj.location.vegetationNdvi * 100)}%</strong></span>
              <span>Exposed Pop: <strong className="text-slate-100">{(activeScoreObj.location.population / 1000).toFixed(0)}k</strong></span>
            </div>

            {/* Action button */}
            <button
              onClick={() => navigate(`/locations/${activeScoreObj.locationId}`)}
              className="w-full py-2 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-cyan-950"
            >
              <span>View location details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Map Header Overlay Notice */}
        <div className="absolute top-3 left-3 bg-[#0B192C]/80 backdrop-blur-md border border-slate-800 rounded-lg px-3 py-1.5 text-[11px] text-slate-300 flex items-center gap-2 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-cyan-400 live-pulse-dot" />
          <span>Interactive Vector Map — Chennai Metropolitan Area</span>
        </div>
      </div>
    </div>
  );
};
