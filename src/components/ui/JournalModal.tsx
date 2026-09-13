import React from 'react';
import { BookOpen, X, Clock, Award, Shield, CheckCircle } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

export const JournalModal: React.FC = () => {
  const isJournalOpen = useGameStore(s => s.isJournalOpen);
  const closeJournal = useGameStore(s => s.closeJournal);
  const decisionHistory = useGameStore(s => s.decisionHistory);
  const warState = useGameStore(s => s.warState);

  if (!isJournalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-md select-none animate-fadeIn">
      <div className="max-w-3xl w-full bg-panel border-2 border-brass/40 rounded-lg shadow-military overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="bg-panelLight border-b border-brass/30 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-brass" />
            <div>
              <div className="text-[10px] font-condensed font-bold tracking-widest text-brass uppercase">
                BRIGADIER MOHAMMAD USMAN // 50TH PARACHUTE BRIGADE
              </div>
              <h2 className="font-condensed font-extrabold text-lg text-paper uppercase tracking-wider">
                COMMANDER'S OPERATIONAL JOURNAL
              </h2>
            </div>
          </div>
          <button onClick={closeJournal} className="p-1 rounded hover:bg-void text-muted hover:text-paper">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Timeline Stream */}
        <div className="p-5 flex-1 overflow-y-auto space-y-3 custom-scrollbar bg-[#0f0e0c]">
          {decisionHistory.length === 0 ? (
            <div className="text-center text-muted font-mono text-xs py-8">
              [ NO DIRECTIVES ISSUED YET. ASSUME COMMAND ON THE 3D MAP. ]
            </div>
          ) : (
            decisionHistory.map((entry, idx) => (
              <div key={entry.id || idx} className="bg-panel border border-brass/20 p-3.5 rounded flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-brass font-bold">{entry.time} HRS</span>
                    <span className="text-xs font-condensed font-bold text-paper uppercase tracking-wider">
                      {entry.title} ({entry.locationName})
                    </span>
                  </div>

                  <p className="text-xs font-serif text-lightText/90 leading-relaxed italic">
                    "{entry.rationale}"
                  </p>

                  <div className="text-[10px] font-serif text-mutedText border-l-2 border-brass/40 pl-2 mt-1">
                    Delayed Forecast: {entry.delayedEffects.narrativeForecast}
                  </div>
                </div>

                <div className="text-right font-mono text-[10px] flex-shrink-0 space-y-0.5">
                  <div className={entry.immediateEffects.defenseDelta >= 0 ? 'text-secure' : 'text-danger'}>
                    DEFENSE {entry.immediateEffects.defenseDelta > 0 ? `+${entry.immediateEffects.defenseDelta}` : entry.immediateEffects.defenseDelta}%
                  </div>
                  <div className={entry.immediateEffects.suppliesDelta >= 0 ? 'text-secure' : 'text-amber'}>
                    SUPPLY {entry.immediateEffects.suppliesDelta > 0 ? `+${entry.immediateEffects.suppliesDelta}` : entry.immediateEffects.suppliesDelta}%
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
