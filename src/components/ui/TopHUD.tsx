import React from 'react';
import { Shield, Radio, Users, Package, Flame, Eye, Crosshair, Award, Zap, Film } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

export const TopHUD: React.FC = () => {
  const warState = useGameStore(s => s.warState);
  const currentChapter = useGameStore(s => s.currentChapter);
  const simulationSpeed = useGameStore(s => s.simulationSpeed);
  const setSimulationSpeed = useGameStore(s => s.setSimulationSpeed);
  const advanceSimulationTime = useGameStore(s => s.advanceSimulationTime);
  const openRadio = useGameStore(s => s.openRadio);
  const openReconModal = useGameStore(s => s.openReconModal);
  const openJournal = useGameStore(s => s.openJournal);
  const openMedals = useGameStore(s => s.openMedals);
  const isSatelliteView = useGameStore(s => s.isSatelliteView);
  const toggleSatelliteView = useGameStore(s => s.toggleSatelliteView);
  const openFullscreenCinema = useGameStore(s => s.openFullscreenCinema);
  const radioMessages = useGameStore(s => s.radioMessages);

  const unreadRadioCount = radioMessages.filter(m => !m.isRead).length;

  return (
    <header className="absolute top-3 left-4 right-4 z-30 pointer-events-none select-none">
      <div className="flex items-center justify-between gap-4 bg-[#14120e]/95 backdrop-blur-md border border-[#c09a5b]/35 px-5 py-2.5 rounded shadow-lg pointer-events-auto">
        
        {/* Left: Theatre Title & Time */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#1c1914] border border-[#c09a5b]/50 flex items-center justify-center text-[#c09a5b] shadow-inner">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="font-serif font-extrabold text-xs tracking-widest text-[#f4ecd8] uppercase">
              KASHMIR FRONT // 1947–48
            </div>
            <div className="text-[10px] font-mono text-[#a39783] tracking-wider uppercase">
              NOV 02, 1947 • {warState.time.substring(0, 5)} HRS • {warState.weather.replace('_', ' ')}
            </div>
          </div>
        </div>

        {/* Center: Strategic Meters */}
        <div className="flex items-center gap-6 border-x border-[#c09a5b]/20 px-6 font-mono">
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-[#d5c7b0]" />
            <div>
              <div className="text-[8px] text-[#8a7f6c] uppercase">TROOPS</div>
              <div className="font-bold text-xs text-[#f4ecd8]">{warState.personnel.toLocaleString()}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Package className="w-3.5 h-3.5 text-[#fbbf24]" />
            <div>
              <div className="text-[8px] text-[#8a7f6c] uppercase">SUPPLIES</div>
              <div className="font-bold text-xs text-[#fbbf24]">{warState.supplies}%</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Flame className="w-3.5 h-3.5 text-[#4ade80]" />
            <div>
              <div className="text-[8px] text-[#8a7f6c] uppercase">MORALE</div>
              <div className="font-bold text-xs text-[#4ade80]">{warState.morale}%</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-[#ef4444]" />
            <div>
              <div className="text-[8px] text-[#8a7f6c] uppercase">ENEMY THREAT</div>
              <div className="font-bold text-xs text-[#ef4444]">{warState.enemyPressure}%</div>
            </div>
          </div>
        </div>

        {/* Right: Tactical Action Bar */}
        <div className="flex items-center gap-2.5 font-mono text-[11px]">
          {/* Time Controls */}
          <div className="flex items-center bg-[#1c1914] border border-[#c09a5b]/30 rounded px-1 py-0.5">
            {[1, 2, 4].map(spd => (
              <button
                key={spd}
                onClick={() => setSimulationSpeed(spd as 1 | 2 | 4)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                  simulationSpeed === spd ? 'bg-[#c09a5b] text-[#14120e]' : 'text-[#a39783] hover:text-[#f4ecd8]'
                }`}
              >
                {spd}x
              </button>
            ))}
            <button
              onClick={() => advanceSimulationTime(60)}
              className="px-1.5 py-0.5 text-[#c09a5b] hover:text-[#f4ecd8] text-[10px] font-bold border-l border-[#c09a5b]/20 ml-1 cursor-pointer"
              title="Advance 1 Hour"
            >
              +1H
            </button>
          </div>

          {/* Recon Trigger */}
          <button
            onClick={openReconModal}
            className="px-3 py-1.5 bg-[#1c1914] hover:bg-[#c09a5b]/20 border border-[#c09a5b]/40 hover:border-[#c09a5b] text-[#f4ecd8] rounded transition-colors flex items-center gap-1.5 cursor-pointer font-serif"
          >
            <Crosshair className="w-3.5 h-3.5 text-[#c09a5b]" />
            <span>RECON [R]</span>
          </button>

          {/* Radio Trigger */}
          <button
            onClick={openRadio}
            className="px-3 py-1.5 bg-[#1c1914] hover:bg-[#c09a5b]/20 border border-[#c09a5b]/40 hover:border-[#c09a5b] text-[#f4ecd8] rounded transition-colors flex items-center gap-1.5 cursor-pointer font-serif relative"
          >
            <Radio className="w-3.5 h-3.5 text-[#c09a5b]" />
            <span>RADIO</span>
            {unreadRadioCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            )}
          </button>

          {/* Citations Trigger */}
          <button
            onClick={openMedals}
            className="px-3 py-1.5 bg-[#1c1914] hover:bg-[#c09a5b]/20 border border-[#c09a5b]/40 hover:border-[#c09a5b] text-[#f4ecd8] rounded transition-colors flex items-center gap-1.5 cursor-pointer font-serif"
          >
            <Award className="w-3.5 h-3.5 text-[#c09a5b]" />
            <span>CITATIONS</span>
          </button>

          {/* Cinema Reel Toggle */}
          <button
            onClick={() => openFullscreenCinema('/videos/landing_page_bg.mp4')}
            className="flex items-center gap-1.5 bg-[#1c1914] hover:bg-[#2a241b] border border-[#c09a5b]/40 text-[#c09a5b] px-2.5 py-1 rounded text-[10px] font-mono tracking-wider uppercase transition-all cursor-pointer shadow-sm hover:border-[#c09a5b]"
            title="Watch Fullscreen Historical Footage (F)"
          >
            <Film className="w-3.5 h-3.5 text-[#c09a5b]" />
            <span>CINEMA REEL</span>
          </button>

          {/* Satellite Mode Toggle */}
          <button
            onClick={toggleSatelliteView}
            className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 cursor-pointer font-serif border ${
              isSatelliteView
                ? 'bg-[#00e5ff]/20 border-[#00e5ff] text-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                : 'bg-[#1c1914] border-[#c09a5b]/40 text-[#f4ecd8] hover:border-[#c09a5b]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>SATELLITE [V]</span>
          </button>
        </div>

      </div>
    </header>
  );
};
