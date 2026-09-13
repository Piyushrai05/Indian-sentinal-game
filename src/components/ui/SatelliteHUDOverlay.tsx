import React from 'react';
import { Eye, Flame, Map, Disc, Radio, Compass, Crosshair, Minimize2, ZoomIn, ZoomOut } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { SatelliteViewMode } from '../../types/game';
import { soundEngine } from '../../engine/audioEngine';

export const SatelliteHUDOverlay: React.FC = () => {
  const isSatelliteView = useGameStore(s => s.isSatelliteView);
  const satelliteViewMode = useGameStore(s => s.satelliteViewMode);
  const toggleSatelliteView = useGameStore(s => s.toggleSatelliteView);
  const setSatelliteViewMode = useGameStore(s => s.setSatelliteViewMode);
  const selectedLocationId = useGameStore(s => s.selectedLocationId);
  const locations = useGameStore(s => s.locations);
  const warState = useGameStore(s => s.warState);

  if (!isSatelliteView) return null;

  const activeLoc = locations.find(l => l.id === selectedLocationId) || locations[0];

  const modes: { id: SatelliteViewMode; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: 'OPTICAL',
      label: 'OPTICAL RECON',
      icon: <Eye className="w-3.5 h-3.5" />,
      desc: 'Natural true-color high-altitude aerial reconnaissance'
    },
    {
      id: 'THERMAL',
      label: 'THERMAL FLIR',
      icon: <Flame className="w-3.5 h-3.5" />,
      desc: 'Infrared thermal heat signatures across road axes'
    },
    {
      id: 'TOPOGRAPHIC',
      label: 'TOPOGRAPHIC DEM',
      icon: <Map className="w-3.5 h-3.5" />,
      desc: 'Digital elevation hypsometric contour relief map'
    },
    {
      id: 'STANDARD',
      label: 'WAR TABLE',
      icon: <Disc className="w-3.5 h-3.5" />,
      desc: '1940s Physical command center plaster relief'
    }
  ];

  return (
    <>

      {/* ─────────────────────────────────────────────────────────────
          STARLIGHT NIGHT-VISION TACTICAL ALERTS & TARGET CARD
          ───────────────────────────────────────────────────────────── */}
      {isSatelliteView && satelliteViewMode === 'STARLIGHT_NVG' && (
        <>
          {/* Left Tactical Alerts Sidebar */}
          <div className="absolute top-24 left-6 z-30 w-72 bg-black/85 border-2 border-[#00ff66]/60 rounded p-3 font-mono text-xs shadow-[0_0_25px_rgba(0,255,102,0.25)] select-none backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-[#00ff66]/30 pb-1.5 mb-2 text-[#00ff66]">
              <span className="font-bold tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00ff66] animate-pulse" />
                ACTIVE ALERTS // RADAR SCAN
              </span>
              <span className="text-[10px] text-[#00ff66]/70">14:22:09</span>
            </div>
            <div className="space-y-1.5 text-[10px]">
              <div className="text-[#00ff66] bg-[#00ff66]/10 p-1.5 rounded border border-[#00ff66]/30">
                [14:32:01] CONTACT_DETECT/LOC_SECTOR
              </div>
              <div className="text-amber-400 bg-amber-950/40 p-1.5 rounded border border-amber-500/30">
                [14:30:45] CH-47 H-1 MOVING/LEH
              </div>
              <div className="text-[#00ff66] bg-[#00ff66]/10 p-1.5 rounded border border-[#00ff66]/30">
                [14:32:45] CH-47 H-1 SECTOR CLEAR
              </div>
              <div className="text-[#00ff66]/70 text-[9px] pt-1">
                RADAR: 240° SWEEP // GAIN: 94.2%
              </div>
            </div>
          </div>

          {/* Bottom-Right Target Profile Card (KARGIL - SECTOR ALPHA) */}
          <div className="absolute bottom-16 right-6 z-30 w-80 bg-black/90 border-2 border-[#00ff66]/70 rounded p-3.5 font-mono text-xs shadow-[0_0_30px_rgba(0,255,102,0.3)] select-none backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-[#00ff66]/40 pb-1.5 mb-2 text-[#00ff66]">
              <span className="font-bold tracking-widest uppercase flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                TARGET PROFILE
              </span>
              <span className="text-[10px] text-[#00ff66]/70">OPTICAL ACTIVE</span>
            </div>
            <div className="text-sm font-bold text-red-400 tracking-wider mb-1">
              KARGIL (SECTOR-ALPHA)
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px] text-[#00ff66]">
              <div>COORDS: 34.5553°N, 76.1320°E</div>
              <div>ALTITUDE: 2,710m</div>
              <div>STATUS: <span className="text-amber-400 font-bold">MONITORING</span></div>
              <div>RANGE: 84.6 KM</div>
            </div>
            <div className="mt-2 pt-2 border-t border-[#00ff66]/20 flex items-center justify-between text-[9px] text-[#00ff66]/80">
              <span>HIMALAYAN RECON VANTAGE</span>
              <span className="text-red-400 font-bold">[LOCKED]</span>
            </div>
          </div>
        </>
      )}

    <div className="absolute inset-0 pointer-events-none z-25 select-none flex flex-col justify-between p-4 font-mono">
      
      {/* ─────────────────────────────────────────────────────────────
          1. TOP SATELLITE TELEMETRY HEADER
          ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between pointer-events-auto">
        {/* Left Orbital Status Badge */}
        <div className="bg-black/90 border border-emerald-500/60 px-3.5 py-2 rounded shadow-[0_0_20px_rgba(16,185,129,0.25)] backdrop-blur-md flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <div className="flex items-center gap-2 text-xs font-black text-emerald-400 tracking-widest uppercase">
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>SATELLITE RECONNAISSANCE FEED • ORBITAL LOCK</span>
              <span className="text-[9px] bg-emerald-950/80 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/40">
                LIVE 3D
              </span>
            </div>
            <div className="text-[10px] text-emerald-500/80 mt-0.5 flex gap-3">
              <span>LAT: {activeLoc.lat.toFixed(3)}°N</span>
              <span>LNG: {activeLoc.lng.toFixed(3)}°E</span>
              <span>ALT: 385 KM LEO</span>
              <span>GSD: 0.75M</span>
            </div>
          </div>
        </div>

        {/* Right Exit Satellite Mode Button */}
        <button
          onClick={() => {
            soundEngine.playPinClick();
            toggleSatelliteView();
          }}
          className="bg-black/90 border border-amber/60 hover:bg-amber/20 hover:border-amber text-amber px-3.5 py-2 rounded text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 shadow-brass-glow cursor-pointer"
        >
          <Minimize2 className="w-4 h-4" />
          <span>WAR ROOM OVERVIEW [V]</span>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. SCREEN CORNER RECON BRACKETS
          ───────────────────────────────────────────────────────────── */}
      <div className="absolute top-20 left-6 w-8 h-8 border-t-2 border-l-2 border-emerald-500/50 pointer-events-none" />
      <div className="absolute top-20 right-6 w-8 h-8 border-t-2 border-r-2 border-emerald-500/50 pointer-events-none" />
      <div className="absolute bottom-24 left-6 w-8 h-8 border-b-2 border-l-2 border-emerald-500/50 pointer-events-none" />
      <div className="absolute bottom-24 right-6 w-8 h-8 border-b-2 border-r-2 border-emerald-500/50 pointer-events-none" />

      {/* Center Reticle Crosshair Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-25">
        <Crosshair className="w-24 h-24 text-emerald-400 stroke-1" />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. BOTTOM MULTISPECTRAL SENSOR SWITCHER
          ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between pointer-events-auto">
        {/* Left Sensor Switcher */}
        <div className="bg-black/90 border border-emerald-500/50 px-2.5 py-2 rounded shadow-lg backdrop-blur-md flex items-center gap-2">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest px-2">
            SENSOR MODE:
          </span>
          <div className="flex items-center gap-1.5">
            {modes.map(m => {
              const isSelected = satelliteViewMode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    soundEngine.playPinClick();
                    setSatelliteViewMode(m.id);
                  }}
                  className={`px-3 py-1.5 rounded text-[10px] font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.5)] font-black'
                      : 'bg-emerald-950/40 text-emerald-300/80 border border-emerald-500/20 hover:border-emerald-500/60 hover:text-emerald-200'
                  }`}
                >
                  {m.icon}
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Sector Telemetry Readout */}
        <div className="bg-black/90 border border-emerald-500/50 px-3.5 py-2 rounded shadow-lg backdrop-blur-md text-right">
          <div className="text-[10px] font-bold text-emerald-400 uppercase">
            TARGET SECTOR: <span className="text-white font-black">{activeLoc.name.toUpperCase()}</span>
          </div>
          <div className="text-[9px] text-emerald-300/80 mt-0.5">
            ELEVATION: <span className="text-amber font-mono font-bold">{activeLoc.elevation}</span> • DEFENSE: <span className="text-emerald-400 font-bold">{activeLoc.currentDefense}%</span>
          </div>
        </div>
      </div>

    </div>
  </>
  );
};
