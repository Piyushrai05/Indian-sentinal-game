import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

export const ConsequenceDrawer: React.FC = () => {
  const isConsequenceOpen = useGameStore(s => s.isConsequenceOpen);
  const lastDecisionRecord = useGameStore(s => s.lastDecisionRecord);
  const closeConsequence = useGameStore(s => s.closeConsequence);

  if (!isConsequenceOpen || !lastDecisionRecord) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#0a0806]/85 backdrop-blur-md select-none animate-fadeIn font-serif">
      <div className="max-w-3xl w-full bg-[#14120e] border border-[#c09a5b]/50 rounded shadow-2xl p-6 flex flex-col justify-between">
        
        {/* Header */}
        <div className="pb-3 border-b border-[#c09a5b]/20">
          <div className="text-xs font-mono font-bold tracking-widest text-[#c09a5b] uppercase mb-1">
            TACTICAL AFTER-ACTION REPORT
          </div>
          <h2 className="font-serif font-extrabold text-2xl tracking-widest text-[#f4ecd8] uppercase">
            FIELD REPORT
          </h2>
          <div className="text-xs font-mono text-[#a39783] mt-0.5">
            YOUR DECISION: <span className="text-[#c09a5b] font-bold">{lastDecisionRecord.orderType}</span> • SECTOR: {lastDecisionRecord.locationName}
          </div>
        </div>

        {/* Dispatch Content */}
        <div className="my-6 space-y-4">
          <div className="bg-[#181612] border border-[#3d3425] p-4 rounded text-xs font-serif leading-relaxed text-[#d5c7b0]">
            <p className="mb-2 font-bold text-[#f4ecd8]">
              {lastDecisionRecord.title}
            </p>
            <p className="mb-2">
              {lastDecisionRecord.fieldReportSummary}
            </p>
            <p className="italic text-[#a39783]">
              "{lastDecisionRecord.rationale}"
            </p>
          </div>

          {/* Stat Changes Grid */}
          <div className="grid grid-cols-3 gap-3 font-mono text-xs">
            <div className="bg-[#181612] border border-[#3d3425] p-2.5 rounded text-center">
              <div className="text-[8px] text-[#8a7f6c] uppercase">SUPPLIES</div>
              <div className="font-bold text-sm text-[#fbbf24] mt-0.5">
                {lastDecisionRecord.immediateEffects.suppliesDelta >= 0
                  ? `+${lastDecisionRecord.immediateEffects.suppliesDelta}%`
                  : `${lastDecisionRecord.immediateEffects.suppliesDelta}%`}
              </div>
            </div>

            <div className="bg-[#181612] border border-[#3d3425] p-2.5 rounded text-center">
              <div className="text-[8px] text-[#8a7f6c] uppercase">MORALE</div>
              <div className="font-bold text-sm text-[#4ade80] mt-0.5">
                {lastDecisionRecord.immediateEffects.moraleDelta >= 0
                  ? `+${lastDecisionRecord.immediateEffects.moraleDelta}%`
                  : `${lastDecisionRecord.immediateEffects.moraleDelta}%`}
              </div>
            </div>

            <div className="bg-[#181612] border border-[#3d3425] p-2.5 rounded text-center">
              <div className="text-[8px] text-[#8a7f6c] uppercase">SECTOR DEFENSE</div>
              <div className="font-bold text-sm text-[#c09a5b] mt-0.5">
                {lastDecisionRecord.immediateEffects.defenseDelta >= 0
                  ? `+${lastDecisionRecord.immediateEffects.defenseDelta}%`
                  : `${lastDecisionRecord.immediateEffects.defenseDelta}%`}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-[#c09a5b]/20">
          <div className="text-xs italic text-[#a39783]">
            "The night is long, but we still hold."
          </div>

          <button
            onClick={closeConsequence}
            className="px-6 py-2.5 bg-gradient-to-r from-[#c09a5b] to-[#d4a45c] hover:from-[#d4a45c] hover:to-[#c09a5b] text-[#14120e] font-serif font-extrabold text-xs tracking-widest uppercase rounded shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>CONTINUE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
