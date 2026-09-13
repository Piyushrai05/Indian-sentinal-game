import React, { useState } from 'react';
import { MapPin, Shield, ChevronLeft, ChevronRight, AlertTriangle, Radio, Compass, Filter } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { soundEngine } from '../../engine/audioEngine';

export const LeftSectorsDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeRegion, setActiveRegion] = useState<'ALL' | 'KASHMIR' | 'JAMMU' | 'BORDER' | 'LADAKH'>('ALL');

  const locations = useGameStore(s => s.locations);
  const selectedLocationId = useGameStore(s => s.selectedLocationId);
  const selectLocation = useGameStore(s => s.selectLocation);

  const filterLocation = (loc: typeof locations[0]) => {
    if (activeRegion === 'ALL') return true;
    if (activeRegion === 'KASHMIR') {
      return loc.region.includes('Valley') || loc.region.includes('Kashmir') || loc.region.includes('Sindh') || loc.region.includes('Lidder');
    }
    if (activeRegion === 'JAMMU') {
      return loc.region.includes('Jammu') || loc.region.includes('Chenab') || loc.region.includes('Shiwalik') || loc.region.includes('Gateway');
    }
    if (activeRegion === 'BORDER') {
      return loc.region.includes('Pir Panjal') || loc.region.includes('Mirpur') || loc.region.includes('Poonch') || loc.region.includes('Karnah') || loc.region.includes('Gorge');
    }
    if (activeRegion === 'LADAKH') {
      return loc.region.includes('Ladakh') || loc.region.includes('Himalayan') || loc.region.includes('Suru') || loc.region.includes('Kishanganga');
    }
    return true;
  };

  const filteredLocations = locations.filter(filterLocation);

  return (
    <aside className={`absolute top-20 left-4 z-20 transition-all duration-300 pointer-events-none select-none ${isOpen ? 'w-80' : 'w-10'}`}>
      <div className="relative pointer-events-auto bg-[#14120e]/95 backdrop-blur-md border border-[#c09a5b]/40 rounded shadow-2xl overflow-hidden flex flex-col max-h-[calc(100vh-160px)]">
        
        {/* Header Bar */}
        <div className="p-3 border-b border-[#c09a5b]/25 flex items-center justify-between bg-[#1a1712]">
          {isOpen ? (
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-[#c09a5b] uppercase">
              <Compass className="w-4 h-4 text-[#c09a5b]" />
              <span>J&K SECTORS // {locations.length} CITIES</span>
            </div>
          ) : (
            <div className="w-full flex justify-center py-2">
              <Compass className="w-4 h-4 text-[#c09a5b]" />
            </div>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 rounded bg-[#242018] border border-[#c09a5b]/30 text-[#c09a5b] hover:bg-[#c09a5b] hover:text-[#14120e] transition-colors cursor-pointer"
            title={isOpen ? 'Collapse Drawer' : 'Expand Drawer'}
          >
            {isOpen ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        </div>

        {isOpen && (
          <>
            {/* Region Filter Buttons */}
            <div className="grid grid-cols-5 gap-1 p-2 bg-[#181510] border-b border-[#c09a5b]/20 text-[9px] font-mono">
              {(['ALL', 'KASHMIR', 'JAMMU', 'BORDER', 'LADAKH'] as const).map(reg => (
                <button
                  key={reg}
                  onClick={() => setActiveRegion(reg)}
                  className={`py-1 rounded text-center transition-all cursor-pointer ${
                    activeRegion === reg
                      ? 'bg-[#c09a5b] text-[#14120e] font-bold shadow-sm'
                      : 'bg-[#1e1b15] text-[#a39783] hover:text-[#f4ecd8]'
                  }`}
                >
                  {reg}
                </button>
              ))}
            </div>

            {/* List of Locations */}
            <div className="overflow-y-auto divide-y divide-[#c09a5b]/15 max-h-[calc(100vh-250px)]">
              {filteredLocations.map(loc => {
                const isSelected = selectedLocationId === loc.id;
                return (
                  <button
                    key={loc.id}
                    onClick={() => {
                      soundEngine.playPinClick();
                      selectLocation(loc.id);
                    }}
                    className={`w-full text-left p-2.5 transition-all flex items-start justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#c09a5b]/20 border-l-4 border-[#c09a5b]'
                        : 'hover:bg-[#1f1b14] border-l-4 border-transparent'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          loc.status === 'SECURED' ? 'bg-emerald-500' :
                          loc.status === 'CONTESTED' ? 'bg-amber-500 animate-pulse' :
                          loc.status === 'UNDER SIEGE' ? 'bg-red-500 animate-ping' :
                          'bg-red-500 animate-ping'
                        }`} />
                        <span className="font-serif font-bold text-xs text-[#f4ecd8] tracking-wider uppercase">
                          {loc.name}
                        </span>
                        <span className="text-[9px] font-mono text-[#a39783]">
                          {loc.elevation}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#a39783] font-mono mt-0.5 truncate max-w-[200px]">
                        {loc.region}
                      </div>
                    </div>

                    <div className="text-right font-mono text-[9px]">
                      <div className="text-[#c09a5b] font-bold">DEF: {loc.currentDefense}%</div>
                      <div className="text-[#8a7f6c]">{loc.garrison.personnel.toLocaleString()} TRP</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}

      </div>
    </aside>
  );
};
