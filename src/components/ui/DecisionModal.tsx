import React, { useState } from 'react';
import { Crosshair, X, Shield, ArrowRight, Package, Flame, Users, Zap } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { DecisionType } from '../../types/game';

export const DecisionModal: React.FC = () => {
  const isDecisionModalOpen = useGameStore(s => s.isDecisionModalOpen);
  const closeDecisionModal = useGameStore(s => s.closeDecisionModal);
  const selectedLocationId = useGameStore(s => s.selectedLocationId);
  const locations = useGameStore(s => s.locations);
  const executeDecision = useGameStore(s => s.executeDecision);

  const loc = locations.find(l => l.id === selectedLocationId) || locations[0];

  const [selectedType, setSelectedType] = useState<DecisionType>('HOLD');

  if (!isDecisionModalOpen) return null;

  const handleConfirm = () => {
    executeDecision(selectedType);
  };

  const options: {
    type: DecisionType;
    title: string;
    desc: string;
    effect: string;
    supplies: string;
    morale: string;
    defense: string;
  }[] = [
    {
      type: 'HOLD',
      title: 'HOLD POSITION',
      desc: 'Maintain current defenses and strengthen positions. Fortify stone sangars and anchor mountain ridgelines.',
      effect: 'Conserves infantry casualties while absorbing probing enemy strikes.',
      supplies: '-8%',
      morale: '+4%',
      defense: '+15%'
    },
    {
      type: 'FALL_BACK',
      title: 'FALL BACK',
      desc: 'Retreat to secondary lines. Preserve resources and ammunition behind artillery coverage.',
      effect: 'Saves valuable supplies and equipment at the cost of ceding high ground.',
      supplies: '+5%',
      morale: '-10%',
      defense: '-20%'
    },
    {
      type: 'COUNTERATTACK',
      title: 'COUNTERATTACK',
      desc: 'Launch a decisive offensive counter-strike to shatter hostile forward sangars and push frontlines back.',
      effect: 'High-intensity assault that drives back raiders, at significant ammunition burn.',
      supplies: '-18%',
      morale: '+14%',
      defense: '+25%'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#0a0806]/85 backdrop-blur-md select-none animate-fadeIn font-serif">
      <div className="max-w-4xl w-full bg-[#14120e] border border-[#c09a5b]/50 rounded shadow-2xl p-6 flex flex-col justify-between">
        
        {/* Header (Exact match to Image 3 #06) */}
        <div className="text-center pb-4 border-b border-[#c09a5b]/20 relative">
          <button
            onClick={closeDecisionModal}
            className="absolute right-0 top-0 p-1 text-[#a39783] hover:text-[#f4ecd8] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-xs font-mono font-bold tracking-[0.3em] text-[#c09a5b] uppercase mb-1">
            THEATRE OPERATIONAL DIRECTIVE // {loc.name}
          </div>
          <h2 className="font-serif font-extrabold text-3xl tracking-widest text-[#f4ecd8] uppercase">
            YOUR DECISION
          </h2>
          <p className="text-xs italic text-[#d5c7b0] mt-1">
            How will you respond, Brigadier?
          </p>
        </div>

        {/* 3 Decision Cards (Exact match to Image 3 #06) */}
        <div className="grid grid-cols-3 gap-4 my-6">
          {options.map(opt => {
            const isSelected = selectedType === opt.type;
            return (
              <button
                key={opt.type}
                onClick={() => setSelectedType(opt.type)}
                className={`text-left p-5 rounded border transition-all flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-[#242018] border-[#c09a5b] shadow-[0_0_20px_rgba(192,154,91,0.3)] scale-[1.02]'
                    : 'bg-[#181612]/80 border-[#3d3425] hover:border-[#c09a5b]/60 hover:bg-[#1c1914]'
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="font-serif font-extrabold text-base tracking-wider text-[#f4ecd8] uppercase mb-2">
                    {opt.title}
                  </div>
                  <p className="text-xs text-[#a39783] leading-relaxed mb-4">
                    {opt.desc}
                  </p>
                </div>

                {/* Stat Deltas */}
                <div className="pt-3 border-t border-[#c09a5b]/20 font-mono text-[10px] space-y-1">
                  <div className="flex justify-between text-[#a39783]">
                    <span>SUPPLIES:</span>
                    <span className="font-bold text-[#fbbf24]">{opt.supplies}</span>
                  </div>
                  <div className="flex justify-between text-[#a39783]">
                    <span>MORALE:</span>
                    <span className="font-bold text-[#4ade80]">{opt.morale}</span>
                  </div>
                  <div className="flex justify-between text-[#a39783]">
                    <span>DEFENSE:</span>
                    <span className="font-bold text-[#c09a5b]">{opt.defense}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer with Quote & Action Button */}
        <div className="flex items-center justify-between pt-4 border-t border-[#c09a5b]/20">
          <div className="text-xs italic text-[#a39783]">
            "In war, there are no perfect choices. Only consequences."
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={closeDecisionModal}
              className="px-4 py-2 border border-[#3d3425] hover:border-[#c09a5b] text-[#a39783] hover:text-[#f4ecd8] text-xs font-mono uppercase rounded transition-colors"
            >
              CANCEL
            </button>
            <button
              onClick={handleConfirm}
              className="px-6 py-2.5 bg-gradient-to-r from-[#c09a5b] to-[#d4a45c] hover:from-[#d4a45c] hover:to-[#c09a5b] text-[#14120e] font-serif font-extrabold text-xs tracking-widest uppercase rounded shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>ISSUE ORDER</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
