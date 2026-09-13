import React, { useEffect } from 'react';
import { Shield, ArrowRight, Zap } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

export const ChapterIntroModal: React.FC = () => {
  const gameScreen = useGameStore(s => s.gameScreen);
  const currentChapter = useGameStore(s => s.currentChapter);
  const enterCommandCenter = useGameStore(s => s.enterCommandCenter);

  useEffect(() => {
    if (gameScreen !== 'CHAPTER_INTRO') return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        enterCommandCenter();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gameScreen, enterCommandCenter]);

  if (gameScreen !== 'CHAPTER_INTRO' || !currentChapter) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/85 backdrop-blur-md select-none animate-fadeIn">
      <div className="max-w-3xl w-full bg-paper text-void border-4 border-brass/60 rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Classified Top Banner */}
        <div className="bg-[#241f17] text-paper border-b-2 border-brass/40 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-xs tracking-widest text-brass">
            <Shield className="w-4 h-4" />
            <span>TOP SECRET // GENERAL HEADQUARTERS (INDIA)</span>
          </div>
          <span className="font-mono text-[11px] text-paper/70">
            KASHMIR THEATRE // 1947–1948
          </span>
        </div>

        {/* Parchment Body */}
        <div className="p-8 flex-1 overflow-y-auto space-y-6 custom-scrollbar bg-[#dfd3b8] text-[#1c1813]">
          
          <div className="flex items-start justify-between border-b-2 border-[#1c1813]/20 pb-4">
            <div>
              <div className="font-mono text-[10px] tracking-widest text-[#6e5d48] uppercase">
                50TH PARACHUTE BRIGADE OPERATIONAL DISPATCH
              </div>
              <h1 className="font-condensed font-extrabold text-3xl tracking-wide uppercase text-[#1c1813] mt-1">
                {currentChapter.title}
              </h1>
              <div className="font-serif italic text-sm text-[#4d4032]">
                {currentChapter.subtitle} // {currentChapter.date}
              </div>
            </div>

            <div className="border-2 border-[#942923] text-[#942923] px-3 py-1 font-condensed font-bold tracking-widest text-xs uppercase rotate-[4deg]">
              WAR CABINET ORDER
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-[#d5c7a5] p-4 rounded border border-[#1c1813]/15 font-serif text-xs">
            <div>
              <div className="font-mono font-bold text-[10px] text-[#594b39] uppercase">OPERATIONAL OBJECTIVE:</div>
              <div className="font-bold text-[#1c1813] mt-0.5">{currentChapter.objective}</div>
            </div>
            <div>
              <div className="font-mono font-bold text-[10px] text-[#594b39] uppercase">COMMANDER IN CHIEF:</div>
              <div className="font-bold text-[#1c1813] mt-0.5">BRIGADIER MOHAMMAD USMAN</div>
            </div>
            <div>
              <div className="font-mono font-bold text-[10px] text-[#594b39] uppercase">THEATRE CONSTRAINT:</div>
              <div className="text-[#69221f] font-bold mt-0.5">{currentChapter.constraint}</div>
            </div>
            <div>
              <div className="font-mono font-bold text-[10px] text-[#594b39] uppercase">AIR SUPPORT WING:</div>
              <div className="text-[#1c1813] mt-0.5">IAF No. 12 Sqn Dakotas (Air Cmdr Mehar Singh)</div>
            </div>
          </div>

          <div className="space-y-2 font-serif text-xs leading-relaxed text-[#262018]">
            <div className="font-mono font-bold text-[11px] text-[#594b39] uppercase tracking-wider">
              FIELD INTELLIGENCE BRIEF:
            </div>
            <p>
              {currentChapter.historicalContext}
            </p>
          </div>

        </div>

        {/* Footer CTA */}
        <div className="bg-[#241f17] border-t-2 border-brass/40 p-4 flex items-center justify-between">
          <div className="text-[11px] font-mono text-paper/70 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber" />
            <span>PRESS <span className="font-bold text-brass">[ENTER]</span> OR CLICK TO COMMENCE</span>
          </div>

          <button
            onClick={enterCommandCenter}
            className="py-3 px-8 bg-gradient-to-r from-brass to-amber hover:from-amber hover:to-brass text-void font-condensed font-extrabold text-sm tracking-widest uppercase rounded shadow-brass-glow transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>ASSUME COMMAND & ENTER MAP</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
