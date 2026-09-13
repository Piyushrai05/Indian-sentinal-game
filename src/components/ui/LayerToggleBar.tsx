import React from 'react';
import { Layers, Shield, Eye, Route, CloudRain, Flame, Radio } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

export const LayerToggleBar: React.FC = () => {
  const mapLayers = useGameStore(s => s.mapLayers);
  const toggleMapLayer = useGameStore(s => s.toggleMapLayer);
  const isSatelliteView = useGameStore(s => s.isSatelliteView);
  const toggleSatelliteView = useGameStore(s => s.toggleSatelliteView);

  const layersConfig: { key: keyof typeof mapLayers; label: string; icon: React.ReactNode }[] = [
    { key: 'terrain', label: 'TERRAIN', icon: <Layers className="w-3 h-3" /> },
    { key: 'frontline', label: 'FRONTLINE', icon: <Shield className="w-3 h-3 text-danger" /> },
    { key: 'forces', label: 'UNITS', icon: <Eye className="w-3 h-3 text-secure" /> },
    { key: 'enemyIntel', label: 'INTEL', icon: <Flame className="w-3 h-3 text-danger" /> },
    { key: 'supplyRoutes', label: 'SUPPLY', icon: <Route className="w-3 h-3 text-brass" /> },
    { key: 'weather', label: 'WEATHER', icon: <CloudRain className="w-3 h-3 text-amber" /> }
  ];

  return (
    <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none select-none">
      <div className="bg-[#181713]/90 backdrop-blur-md border border-[#c09a5b]/30 rounded-full px-3 py-1.5 shadow-military flex items-center gap-1.5 pointer-events-auto">
        <span className="text-[9px] font-condensed font-bold tracking-widest text-[#a99778] uppercase px-2 border-r border-[#c09a5b]/20 flex items-center gap-1">
          <Layers className="w-3 h-3 text-[#c09a5b]" />
          <span>MAP LAYERS:</span>
        </span>

        {layersConfig.map(l => {
          const isActive = mapLayers[l.key];
          return (
            <button
              key={l.key}
              onClick={() => toggleMapLayer(l.key)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-condensed font-bold tracking-wider uppercase transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#c09a5b]/25 border border-[#c09a5b] text-[#eee7da] shadow-sm'
                  : 'bg-black/40 border border-transparent text-[#817b6f] hover:text-[#eee7da]'
              }`}
            >
              {l.icon}
              <span>{l.label}</span>
            </button>
          );
        })}

        {/* Satellite Recon Mode Toggle Button */}
        <button
          onClick={toggleSatelliteView}
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-condensed font-black tracking-wider uppercase transition-all ml-1.5 cursor-pointer ${
            isSatelliteView
              ? 'bg-emerald-500 text-black border border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
              : 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-900/60'
          }`}
        >
          <Radio className="w-3 h-3 animate-pulse" />
          <span>SATELLITE VIEW [V]</span>
        </button>
      </div>
    </div>
  );
};
