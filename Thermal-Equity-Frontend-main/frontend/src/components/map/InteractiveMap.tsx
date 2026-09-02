import React, { useState } from 'react';
import { SvgMapFallback } from './SvgMapFallback';
import { MapControls } from './MapControls';
import { MapLegend } from './MapLegend';
import { LocationData } from '../../types';

interface InteractiveMapProps {
  selectedLocationId?: string;
  onSelectLocation?: (loc: LocationData) => void;
  heightClass?: string;
  showControls?: boolean;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  selectedLocationId,
  onSelectLocation,
  heightClass = 'h-[520px]',
  showControls = true
}) => {
  const [activeLayer, setActiveLayer] = useState('risk');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div
      className={`relative w-full transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 p-4 bg-slate-950/90 backdrop-blur-lg flex flex-col' : ''
      }`}
    >
      {/* Map Header Layer Controls */}
      {showControls && (
        <div className="mb-3">
          <MapControls
            activeLayer={activeLayer}
            onSelectLayer={setActiveLayer}
            onToggleFullscreen={toggleFullscreen}
            isFullscreen={isFullscreen}
          />
        </div>
      )}

      {/* Main Map Container */}
      <div className={`relative w-full flex-1 ${isFullscreen ? 'h-full' : heightClass}`}>
        <SvgMapFallback
          selectedLocationId={selectedLocationId}
          onSelectLocation={onSelectLocation}
          activeLayer={activeLayer}
          heightClass="h-full"
        />

        {/* Legend Overlay at Bottom Right */}
        <div className="absolute bottom-4 right-4 z-20 max-w-xs hidden md:block">
          <MapLegend activeLayer={activeLayer} />
        </div>
      </div>
    </div>
  );
};
