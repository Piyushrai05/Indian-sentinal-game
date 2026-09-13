import React from 'react';
import { Award, Shield, RotateCcw, BookOpen, Users, Package, Flame, CheckCircle, AlertTriangle, Star, Trophy } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

export const EndingScreen: React.FC = () => {
  const gameScreen = useGameStore(s => s.gameScreen);
  const afterActionReport = useGameStore(s => s.afterActionReport);
  const unlockedMedals = useGameStore(s => s.unlockedMedals);
  const restartGame = useGameStore(s => s.restartGame);

  if (gameScreen !== 'ENDING' || !afterActionReport) return null;

  const getEndingBadgeColor = () => {
    switch (afterActionReport.ending) {
      case 'STRATEGIC_SUCCESS': return 'text-secure border-secure bg-secure/15';
      case 'HARD_FOUGHT_HOLD': return 'text-amber border-amber bg-amber/15';
      case 'ORDERLY_WITHDRAWAL': return 'text-amber border-amber bg-amber/15';
      case 'FRONTLINE_COLLAPSE': return 'text-danger border-danger bg-danger/15';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-void/90 backdrop-blur-md select-none animate-fadeIn">
      <div className="max-w-4xl w-full bg-[#181510] border-4 border-brass/60 rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-[#241f17] border-b-2 border-brass/40 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="w-7 h-7 text-amber" />
            <div>
              <div className="font-condensed font-bold tracking-widest text-xs text-brass uppercase">
                AFTER ACTION REPORT // GENERAL HEADQUARTERS (INDIA)
              </div>
              <h1 className="font-condensed font-extrabold text-2xl text-paper uppercase tracking-wider">
                STRATEGIC CAMPAIGN EVALUATION & ROLL OF HONOR
              </h1>
            </div>
          </div>

          <div className={`px-3 py-1.5 rounded font-condensed font-bold tracking-widest text-xs uppercase border ${getEndingBadgeColor()}`}>
            {afterActionReport.ending}
          </div>
        </div>

        {/* Debrief Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-5 custom-scrollbar bg-[#14120e] text-paper">
          
          <div className="bg-void/80 border border-brass/30 p-5 rounded-lg">
            <h2 className="font-condensed font-extrabold text-2xl text-amber uppercase tracking-wider mb-1">
              {afterActionReport.title}
            </h2>
            <div className="text-xs font-serif italic text-brass/90 mb-3">
              {afterActionReport.subtitle}
            </div>
            <p className="text-xs font-serif text-lightText/90 leading-relaxed italic">
              "{afterActionReport.legacyReport}"
            </p>
          </div>

          {/* Strategic Vitals Grid */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-panelLight/80 border border-brass/25 p-3 rounded text-center">
              <div className="text-[9px] font-condensed text-mutedText uppercase mb-1">TERRITORY PRESERVED</div>
              <div className="font-mono font-bold text-2xl text-paper">{afterActionReport.territoryControlPercent}%</div>
            </div>

            <div className="bg-panelLight/80 border border-brass/25 p-3 rounded text-center">
              <div className="text-[9px] font-condensed text-mutedText uppercase mb-1">OPERATIONS SUCCESS</div>
              <div className="font-mono font-bold text-2xl text-secure">
                {afterActionReport.successfulOpsCount} / {afterActionReport.strategicDecisionsCount}
              </div>
            </div>

            <div className="bg-panelLight/80 border border-brass/25 p-3 rounded text-center">
              <div className="text-[9px] font-condensed text-mutedText uppercase mb-1">THEATRE MORALE</div>
              <div className="font-mono font-bold text-2xl text-amber">{afterActionReport.finalMorale}%</div>
            </div>

            <div className="bg-panelLight/80 border border-brass/25 p-3 rounded text-center">
              <div className="text-[9px] font-condensed text-mutedText uppercase mb-1">COMMAND REPUTATION</div>
              <div className="font-mono font-bold text-2xl text-brass">{afterActionReport.commandReputation}%</div>
            </div>
          </div>

          {/* Gallantry Medals Showcase */}
          {unlockedMedals.length > 0 && (
            <div className="bg-[#201b13] border border-amber/40 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-xs font-condensed font-bold tracking-widest text-amber uppercase mb-3">
                <Award className="w-4 h-4" />
                <span>GALLANTRY DECORATIONS CONFERRED ({unlockedMedals.length})</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {unlockedMedals.map((m) => (
                  <div key={m.id} className="bg-void/70 border border-brass/30 p-3 rounded flex items-start gap-3">
                    <Star className="w-5 h-5 text-amber fill-amber/30 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-condensed font-bold text-xs text-amber uppercase">
                        {m.medalType === 'PVC' ? 'PARAM VIR CHAKRA' : m.medalType === 'MVC' ? 'MAHA VIR CHAKRA' : 'VIR CHAKRA'}
                      </div>
                      <div className="font-bold text-paper text-xs">{m.recipient}</div>
                      <div className="text-[10px] font-serif text-mutedText italic mt-0.5 line-clamp-2">
                        "{m.citationText}"
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Historical Roll of Honor */}
          <div className="bg-void/60 border border-brass/20 p-4 rounded-lg">
            <div className="font-condensed font-bold text-xs tracking-widest text-brass uppercase mb-2">
              HISTORICAL ROLL OF HONOR (1947–1948 KASHMIR CAMPAIGN)
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] font-serif text-lightText/90">
              <div className="border-l-2 border-brass/40 pl-2">
                <span className="font-bold text-paper block">Brig. Mohammad Usman (MVC)</span>
                "Lion of Naushera" — Martyred in action on 3 July 1948.
              </div>
              <div className="border-l-2 border-brass/40 pl-2">
                <span className="font-bold text-paper block">Maj. Somnath Sharma (PVC)</span>
                First recipient of Param Vir Chakra for Badgam defense.
              </div>
              <div className="border-l-2 border-brass/40 pl-2">
                <span className="font-bold text-paper block">Air Cmdr Mehar Singh (DSO, MVC)</span>
                Pioneer of Poonch & Leh high-altitude airlifts.
              </div>
            </div>
          </div>

        </div>

        {/* Footer CTA */}
        <div className="bg-[#241f17] border-t-2 border-brass/40 p-4 flex justify-end">
          <button
            onClick={restartGame}
            className="py-3 px-8 bg-gradient-to-r from-brass to-amber hover:from-amber hover:to-brass text-void font-condensed font-extrabold text-sm tracking-widest uppercase rounded shadow-brass-glow transition-all flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>COMMENCE NEW CAMPAIGN</span>
          </button>
        </div>

      </div>
    </div>
  );
};
