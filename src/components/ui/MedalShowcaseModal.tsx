import React from 'react';
import { Award, Shield, Check, X, Star } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { MedalAward } from '../../types/game';
import { soundEngine } from '../../engine/audioEngine';

export const MedalShowcaseModal: React.FC = () => {
  const isMedalsOpen = useGameStore(s => s.isMedalsOpen);
  const closeMedals = useGameStore(s => s.closeMedals);
  const unlockedMedals = useGameStore(s => s.unlockedMedals);

  if (!isMedalsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/85 backdrop-blur-md select-none animate-fadeIn">
      <div className="max-w-3xl w-full bg-[#1c1813] border-4 border-brass/70 rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#241f17] text-paper border-b-2 border-brass/40 px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-xs tracking-widest text-brass font-bold">
            <Award className="w-5 h-5 text-amber" />
            <span>GALLANTRY CITATIONS & MEDALS OF VALOR // 1947–1948</span>
          </div>
          <button
            onClick={closeMedals}
            className="p-1 hover:bg-brass/20 text-paper/70 hover:text-paper rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar space-y-4 bg-[#14120e] text-paper">
          {unlockedMedals.length === 0 ? (
            <div className="text-center py-12 text-mutedText font-serif">
              <Award className="w-12 h-12 text-brass/30 mx-auto mb-3" />
              <div className="text-sm font-condensed uppercase tracking-wider text-paper/80">No Gallantry Citations Conferred Yet</div>
              <p className="text-xs text-mutedText mt-1 max-w-md mx-auto">
                Execute bold tactical counter-attacks and resolve high-stakes story dilemmas to earn historical decorations for your regiments.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {unlockedMedals.map((medal) => (
                <div
                  key={medal.id}
                  className="bg-panel/90 border-2 border-brass/40 p-4 rounded-lg flex items-start gap-4 shadow-military"
                >
                  <div className="w-16 h-16 rounded-full bg-[#2a2318] border-2 border-amber flex flex-col items-center justify-center text-[10px] font-mono font-black text-amber shadow-inner flex-shrink-0">
                    <Star className="w-6 h-6 text-amber fill-amber/30" />
                    <span>{medal.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-condensed font-black text-base text-amber uppercase tracking-wider">
                          {medal.medalType === 'PVC' ? 'PARAM VIR CHAKRA' : medal.medalType === 'MVC' ? 'MAHA VIR CHAKRA' : 'VIR CHAKRA'}
                        </span>
                        <span className="text-[10px] font-mono bg-brass/20 text-brass px-2 py-0.5 rounded border border-brass/30">
                          {medal.dateAwarded}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-mutedText">{medal.regiment}</span>
                    </div>

                    <h3 className="font-condensed font-bold text-lg text-paper uppercase mt-0.5">
                      {medal.recipient} — {medal.actionTitle}
                    </h3>

                    <p className="text-xs font-serif text-lightText/90 leading-relaxed italic mt-1 bg-void/60 p-2.5 rounded border border-brass/15">
                      "{medal.citationText}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#241f17] border-t-2 border-brass/40 p-4 flex items-center justify-between">
          <div className="text-xs font-mono text-brass/80">
            TOTAL CONFERRED: <span className="font-bold text-paper">{unlockedMedals.length} CITATIONS</span>
          </div>

          <button
            onClick={closeMedals}
            className="py-2 px-6 bg-brass hover:bg-amber text-void font-condensed font-bold text-xs tracking-widest uppercase rounded transition-colors"
          >
            RETURN TO COMMAND
          </button>
        </div>

      </div>
    </div>
  );
};
