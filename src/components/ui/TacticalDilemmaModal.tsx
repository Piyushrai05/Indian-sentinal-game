import React from 'react';
import { AlertTriangle, Shield, CheckCircle, Crosshair, Award, Users, Package, Flame, Zap } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { StoryDilemmaOption } from '../../data/storyDilemmas';
import { soundEngine } from '../../engine/audioEngine';

export const TacticalDilemmaModal: React.FC = () => {
  const activeDilemma = useGameStore(s => s.activeDilemma);
  const resolveDilemma = useGameStore(s => s.resolveDilemma);

  if (!activeDilemma) return null;

  const handleSelectOption = (opt: StoryDilemmaOption) => {
    soundEngine.playStampThud();
    resolveDilemma(opt);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/90 backdrop-blur-md select-none animate-fadeIn">
      <div className="max-w-3xl w-full bg-[#1c1813] border-4 border-danger/60 rounded-lg shadow-[0_20px_50px_rgba(180,30,30,0.4)] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Red Alarm Top Header */}
        <div className="bg-gradient-to-r from-[#5a1815] to-[#2b0f0e] text-paper border-b-2 border-danger/40 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-xs tracking-widest text-danger font-bold animate-pulse">
            <AlertTriangle className="w-4 h-4" />
            <span>URGENT TACTICAL DILEMMA // {activeDilemma.urgency}</span>
          </div>
          <span className="font-mono text-[10px] text-paper/70">
            {activeDilemma.contextHeader}
          </span>
        </div>

        {/* Parchment/Slate Body */}
        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar space-y-4 bg-[#14120e] text-paper">
          
          {/* Officer & Situation Header */}
          <div className="flex items-start gap-4 bg-void/80 border border-brass/30 p-4 rounded">
            <div className="w-14 h-14 rounded-full bg-[#2a241b] border-2 border-brass flex flex-col items-center justify-center shadow-inner flex-shrink-0">
              <Shield className="w-5 h-5 text-amber" />
              <span className="text-[9px] font-mono font-black text-brass uppercase mt-0.5">{activeDilemma.officerPortrait}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-condensed font-bold text-lg text-brass uppercase">
                  {activeDilemma.officerName}
                </span>
                <span className="text-[10px] font-mono bg-brass/20 text-brass px-1.5 py-0.5 rounded border border-brass/30">
                  {activeDilemma.officerCallsign}
                </span>
              </div>
              <h2 className="font-condensed font-extrabold text-2xl uppercase tracking-wider text-paper mt-0.5">
                {activeDilemma.title}
              </h2>
              <p className="text-xs font-serif text-lightText/90 leading-relaxed italic mt-1">
                "{activeDilemma.situationSummary}"
              </p>
            </div>
          </div>

          {/* Historical Narrative Lore */}
          <div className="bg-[#241f17]/90 border-l-4 border-amber p-3 rounded text-xs font-serif text-paper/90 leading-relaxed italic">
            <span className="font-sans not-italic font-bold text-amber text-[10px] block mb-0.5 uppercase tracking-wider">
              FIELD INTELLIGENCE DISPATCH:
            </span>
            {activeDilemma.narrativeLore}
          </div>

          {/* Decision Options */}
          <div className="space-y-3 pt-2">
            <div className="text-[10px] font-mono text-brass uppercase tracking-widest font-bold">
              SELECT COMMAND DIRECTIVE:
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeDilemma.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt)}
                  className="bg-panel/90 hover:bg-[#2e261a] border-2 border-brass/40 hover:border-brass p-4 rounded text-left transition-all group flex flex-col justify-between cursor-pointer shadow-military"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-condensed font-bold text-sm tracking-wide text-amber group-hover:text-brass uppercase">
                        {opt.label}
                      </span>
                      {opt.medalUnlock && (
                        <span className="text-[9px] font-mono bg-amber/20 text-amber px-1.5 py-0.5 rounded border border-amber/30 flex items-center gap-1 font-bold">
                          <Award className="w-2.5 h-2.5" />
                          {opt.medalUnlock}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-serif text-lightText/85 leading-snug mb-3">
                      {opt.description}
                    </p>
                  </div>

                  <div className="space-y-1.5 border-t border-brass/20 pt-2 text-[10px] font-mono">
                    <div className="text-danger/90">
                      <span className="font-bold">RISK:</span> {opt.riskDescription}
                    </div>
                    <div className="text-secure/90">
                      <span className="font-bold">REWARD:</span> {opt.rewardDescription}
                    </div>

                    {/* Stat Deltas */}
                    <div className="flex items-center gap-2 text-[9px] pt-1 text-brass/80">
                      {opt.statEffects.moraleDelta !== 0 && (
                        <span>Morale {opt.statEffects.moraleDelta > 0 ? `+${opt.statEffects.moraleDelta}` : opt.statEffects.moraleDelta}%</span>
                      )}
                      {opt.statEffects.personnelDelta !== 0 && (
                        <span>Forces {opt.statEffects.personnelDelta > 0 ? `+${opt.statEffects.personnelDelta}` : opt.statEffects.personnelDelta}</span>
                      )}
                      {opt.statEffects.pressureDelta !== 0 && (
                        <span>Pressure {opt.statEffects.pressureDelta}%</span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
