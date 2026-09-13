import React, { useState } from 'react';
import { Crosshair, X, Send, Compass, Shield, CloudRain, CheckCircle, AlertTriangle, Plane, Users } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

export const ReconModal: React.FC = () => {
  const isReconModalOpen = useGameStore(s => s.isReconModalOpen);
  const closeReconModal = useGameStore(s => s.closeReconModal);
  const locations = useGameStore(s => s.locations);
  const selectedLocationId = useGameStore(s => s.selectedLocationId);
  const warState = useGameStore(s => s.warState);
  const dispatchReconMission = useGameStore(s => s.dispatchReconMission);

  const [targetSectorId, setTargetSectorId] = useState<string>(selectedLocationId || 'uri');
  const [reconType, setReconType] = useState<'AIR_RECON' | 'ARMORED_SCOUT' | 'INFANTRY_PATROL'>('AIR_RECON');

  if (!isReconModalOpen) return null;

  const targetLoc = locations.find(l => l.id === targetSectorId) || locations[0];

  const handleDispatch = () => {
    dispatchReconMission(targetSectorId, reconType);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-md select-none animate-fadeIn">
      <div className="max-w-lg w-full bg-panel border-2 border-brass/40 rounded-lg shadow-military overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-panelLight border-b border-brass/30 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Crosshair className="w-5 h-5 text-brass" />
            <div>
              <div className="text-[10px] font-condensed font-bold tracking-widest text-brass uppercase">
                INTELLIGENCE CORPS DIRECTIVE
              </div>
              <h2 className="font-condensed font-extrabold text-lg text-paper uppercase tracking-wider">
                DISPATCH RECONNAISSANCE SWEEP
              </h2>
            </div>
          </div>
          <button onClick={closeReconModal} className="p-1 rounded hover:bg-void text-muted hover:text-paper">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          
          {/* Target Sector Selector */}
          <div>
            <label className="text-[10px] font-condensed font-bold tracking-wider text-brass uppercase block mb-1.5">
              RECONNAISSANCE TARGET SECTOR:
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {locations.map(loc => (
                <button
                  key={loc.id}
                  onClick={() => setTargetSectorId(loc.id)}
                  className={`p-2 rounded border text-left transition-all ${
                    targetSectorId === loc.id
                      ? 'bg-panelLight border-brass text-paper shadow-sm'
                      : 'bg-void/50 border-brass/15 text-muted hover:text-paper'
                  }`}
                >
                  <div className="font-condensed font-bold text-xs uppercase leading-tight truncate">
                    {loc.name}
                  </div>
                  <div className="text-[9px] font-mono text-mutedText">
                    {loc.status}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Recon Method Selector */}
          <div>
            <label className="text-[10px] font-condensed font-bold tracking-wider text-brass uppercase block mb-1.5">
              RECONNAISSANCE ASSET:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setReconType('AIR_RECON')}
                className={`p-3 rounded border text-center transition-all ${
                  reconType === 'AIR_RECON'
                    ? 'bg-brass/25 border-brass text-paper'
                    : 'bg-void/50 border-brass/15 text-muted hover:text-paper'
                }`}
              >
                <div className="flex justify-center mb-1"><Plane className="w-5 h-5 text-amber" /></div>
                <div className="font-condensed font-bold text-xs uppercase">IAF SPITFIRE AIR RECON</div>
                <div className="text-[9px] font-mono text-amber">+12 MIN • HIGH SPEED</div>
              </button>

              <button
                onClick={() => setReconType('ARMORED_SCOUT')}
                className={`p-3 rounded border text-center transition-all ${
                  reconType === 'ARMORED_SCOUT'
                    ? 'bg-brass/25 border-brass text-paper'
                    : 'bg-void/50 border-brass/15 text-muted hover:text-paper'
                }`}
              >
                <div className="flex justify-center mb-1"><Shield className="w-5 h-5 text-amber" /></div>
                <div className="font-condensed font-bold text-xs uppercase">7 CAV ARMORED SCOUT</div>
                <div className="text-[9px] font-mono text-amber">+18 MIN • ROAD PATROL</div>
              </button>

              <button
                onClick={() => setReconType('INFANTRY_PATROL')}
                className={`p-3 rounded border text-center transition-all ${
                  reconType === 'INFANTRY_PATROL'
                    ? 'bg-brass/25 border-brass text-paper'
                    : 'bg-void/50 border-brass/15 text-muted hover:text-paper'
                }`}
              >
                <div className="flex justify-center mb-1"><Users className="w-5 h-5 text-amber" /></div>
                <div className="font-condensed font-bold text-xs uppercase">GURKHA STEALTH PATROL</div>
                <div className="text-[9px] font-mono text-amber">+25 MIN • NIGHT RIDGES</div>
              </button>
            </div>
          </div>

          {/* Weather Impact Notice */}
          <div className="bg-void/80 border border-brass/20 p-2.5 rounded text-xs font-serif flex items-center justify-between">
            <span className="text-muted flex items-center gap-1.5">
              <CloudRain className="w-3.5 h-3.5 text-amber" />
              <span>WEATHER: {warState.weather} (VISIBILITY: {warState.visibilityPercent}%)</span>
            </span>
            <span className="font-mono text-[10px] text-brass">
              {warState.visibilityPercent < 50 ? 'REDUCED ACCURACY' : 'OPTIMAL CONDITIONS'}
            </span>
          </div>

          {/* CTA */}
          <div className="pt-2">
            <button
              onClick={handleDispatch}
              className="w-full py-3 px-6 bg-gradient-to-r from-brass to-amber hover:from-amber hover:to-brass text-void font-condensed font-extrabold text-sm tracking-widest uppercase rounded shadow-brass-glow transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>COMMENCE RECONNAISSANCE PATROL</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
