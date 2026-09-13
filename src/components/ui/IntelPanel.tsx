import React, { useState } from 'react';
import { Compass, Send, Radio, Shield, Users, Package, Flame, Zap, ArrowRight, Loader2 } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { askOfficerAdvice } from '../../services/groqService';

export const IntelPanel: React.FC = () => {
  const selectedLocationId = useGameStore(s => s.selectedLocationId);
  const locations = useGameStore(s => s.locations);
  const openDecisionModal = useGameStore(s => s.openDecisionModal);

  const loc = locations.find(l => l.id === selectedLocationId) || locations[0];

  const [selectedOfficerId, setSelectedOfficerId] = useState<string>('usman');
  const [officerAdvice, setOfficerAdvice] = useState<string | null>(null);
  const [isLoadingAdvice, setIsLoadingAdvice] = useState<boolean>(false);

  const handleConsult = async (officerId: string) => {
    setSelectedOfficerId(officerId);
    setIsLoadingAdvice(true);
    setOfficerAdvice(null);
    const ctx = `Garrison: ${loc.garrison.personnel} troops, Supplies: ${loc.garrison.suppliesPercent}%, Morale: ${loc.garrison.moralePercent}%, Enemy threat: ${loc.garrison.enemyPressurePercent}%. Note: ${loc.historicalNote}`;
    const res = await askOfficerAdvice(officerId, loc.name, ctx);
    setOfficerAdvice(res);
    setIsLoadingAdvice(false);
  };

  const statusColor =
    loc.status === 'SECURED' ? '#4ade80' : loc.status === 'CONTESTED' ? '#fbbf24' : '#ef4444';

  return (
    <aside className="absolute top-20 right-4 bottom-6 w-96 z-20 pointer-events-none flex flex-col select-none">
      <div className="bg-[#14120e]/95 backdrop-blur-md border border-[#c09a5b]/35 rounded shadow-lg p-4 flex-1 flex flex-col justify-between overflow-hidden pointer-events-auto">
        
        {/* 1. Header: CURRENT SITUATION */}
        <div>
          <div className="flex items-center justify-between pb-2 border-b border-[#c09a5b]/20 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColor }} />
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#a39783] uppercase">
                CURRENT SITUATION
              </span>
            </div>
            <span
              className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border"
              style={{ color: statusColor, borderColor: `${statusColor}60`, backgroundColor: `${statusColor}15` }}
            >
              {loc.status}
            </span>
          </div>

          {/* Sector Title & Elevation */}
          <div className="mb-3">
            <div className="flex items-baseline justify-between">
              <h2 className="font-serif font-extrabold text-2xl tracking-wider text-[#f4ecd8] uppercase">
                {loc.name}
              </h2>
              <div className="text-[10px] font-mono text-[#c09a5b]">
                ELEV: {loc.elevation}
              </div>
            </div>
            <p className="text-xs font-serif italic text-[#d5c7b0] leading-snug mt-1">
              "{loc.importanceDescription}"
            </p>
          </div>

          {/* Vitals Grid */}
          <div className="grid grid-cols-2 gap-2 bg-[#181612] border border-[#3d3425] p-2.5 rounded mb-3 font-mono text-xs">
            <div>
              <div className="text-[8px] text-[#8a7f6c] uppercase">GARRISON FORCES</div>
              <div className="font-bold text-[#f4ecd8]">{loc.garrison.personnel.toLocaleString()} TROOPS</div>
              <div className="text-[8px] font-serif text-[#a39783] truncate">{loc.garrison.regimentName}</div>
            </div>
            <div>
              <div className="text-[8px] text-[#8a7f6c] uppercase">SUPPLY STATUS</div>
              <div className="font-bold text-[#fbbf24]">{loc.garrison.suppliesPercent}% CAPACITY</div>
              <div className="text-[8px] font-serif text-[#a39783]">Rations & Ammo</div>
            </div>
            <div>
              <div className="text-[8px] text-[#8a7f6c] uppercase">SECTOR MORALE</div>
              <div className="font-bold text-[#4ade80]">{loc.garrison.moralePercent}% RESOLVE</div>
              <div className="text-[8px] font-serif text-[#a39783]">High Mountain Spirit</div>
            </div>
            <div>
              <div className="text-[8px] text-[#8a7f6c] uppercase">ENEMY PRESSURE</div>
              <div className="font-bold text-[#ef4444]">{loc.garrison.enemyPressurePercent}% THREAT</div>
              <div className="text-[8px] font-serif text-[#a39783]">Hostile Picketers</div>
            </div>
          </div>

          {/* Intelligence Reports (Exact match to Image 3 #04) */}
          <div className="mb-3">
            <div className="text-[9px] font-mono font-bold tracking-wider text-[#c09a5b] uppercase mb-1.5">
              INTELLIGENCE REPORTS (3):
            </div>
            <div className="space-y-1.5 text-[10px] font-serif">
              <div className="bg-[#181612] border border-[#3d3425] p-2 rounded flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1 flex-shrink-0" />
                <div className="flex-1 text-[#d5c7b0]">
                  <span>Enemy columns probing outer pickets near {loc.name}.</span>
                  <div className="text-[8px] font-mono text-[#8a7f6c] mt-0.5">2 hours ago • Field Recon</div>
                </div>
              </div>
              <div className="bg-[#181612] border border-[#3d3425] p-2 rounded flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1 flex-shrink-0" />
                <div className="flex-1 text-[#d5c7b0]">
                  <span>Local civilian volunteer patrols reporting road blockages.</span>
                  <div className="text-[8px] font-mono text-[#8a7f6c] mt-0.5">4 hours ago • Local Scout</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Field Officer Radio & Dispatch Actions */}
        <div className="space-y-2 pt-2 border-t border-[#c09a5b]/20">
          {/* Officer Radio Quick Consultation */}
          <div>
            <div className="text-[9px] font-mono font-bold tracking-wider text-[#8a7f6c] uppercase mb-1">
              OFFICER RADIO CONSULTATION (GROQ AI):
            </div>
            <div className="grid grid-cols-4 gap-1 font-mono text-[9px]">
              {[
                { id: 'usman', rank: 'BRIG', label: 'Usman' },
                { id: 'rai', rank: 'MAJ', label: 'Somnath' },
                { id: 'thimayya', rank: 'GEN', label: 'Thimayya' },
                { id: 'mehar', rank: 'AIR', label: 'Mehar' },
              ].map(o => (
                <button
                  key={o.id}
                  onClick={() => handleConsult(o.id)}
                  disabled={isLoadingAdvice}
                  className={`p-1.5 rounded border text-center transition-all cursor-pointer ${
                    selectedOfficerId === o.id
                      ? 'bg-[#c09a5b] text-[#14120e] font-bold border-[#c09a5b]'
                      : 'bg-[#181612] border-[#3d3425] text-[#a39783] hover:text-[#f4ecd8]'
                  }`}
                >
                  <div className="font-bold">[{o.rank}]</div>
                  <div className="text-[8px] truncate">{o.label}</div>
                </button>
              ))}
            </div>

            {/* Advice Result Box */}
            {isLoadingAdvice && (
              <div className="mt-1.5 p-2 bg-[#181612] border border-[#c09a5b]/30 rounded text-[10px] text-[#c09a5b] flex items-center gap-2">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Decrypting encrypted field transmission...</span>
              </div>
            )}

            {officerAdvice && (
              <div className="mt-1.5 p-2 bg-[#181612] border border-[#c09a5b]/40 rounded text-[10px] font-serif italic text-[#f4ecd8] max-h-20 overflow-y-auto custom-scrollbar">
                "{officerAdvice}"
              </div>
            )}
          </div>

          {/* Dispatch Operational Order CTA */}
          <button
            onClick={openDecisionModal}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-[#c09a5b] to-[#d4a45c] hover:from-[#d4a45c] hover:to-[#c09a5b] text-[#14120e] font-serif font-extrabold text-xs tracking-widest uppercase rounded shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>DISPATCH OPERATIONAL ORDER</span>
          </button>
        </div>

      </div>
    </aside>
  );
};
