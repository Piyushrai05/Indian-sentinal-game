import React, { useEffect } from 'react';
import { Newspaper, ArrowRight, Shield, Globe, Calendar, DollarSign } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { HISTORICAL_NEWSPAPERS } from '../../data/newspapers';
import { soundEngine } from '../../engine/audioEngine';

export const NewspaperPrologModal: React.FC = () => {
  const gameScreen = useGameStore(s => s.gameScreen);
  const currentChapter = useGameStore(s => s.currentChapter);
  const setGameScreen = useGameStore(s => s.setGameScreen);

  const article = currentChapter ? HISTORICAL_NEWSPAPERS[currentChapter.id] || HISTORICAL_NEWSPAPERS['chapter-1-frontier'] : null;

  useEffect(() => {
    if (gameScreen === 'NEWSPAPER') {
      soundEngine.playPaperFlip();
    }
  }, [gameScreen]);

  if (gameScreen !== 'NEWSPAPER' || !article) return null;

  const handleContinue = () => {
    soundEngine.playPaperFlip();
    setGameScreen('CHAPTER_INTRO');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md select-none animate-fadeIn">
      {/* Vintage Newsprint Broadsheet Frame */}
      <div className="max-w-4xl w-full bg-[#f4ecd8] text-[#1c1813] border-8 border-[#3b3123] rounded shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Top Masthead & Gazette Header */}
        <div className="bg-[#ebdcc0] border-b-4 border-double border-[#1c1813] px-6 py-4 text-center">
          <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-[#594b39] uppercase border-b border-[#1c1813]/30 pb-1 mb-2">
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              <span>THE SPECIAL WAR EDITION // {article.city}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{article.date}</span>
            </div>
            <div className="flex items-center gap-1.5 font-bold">
              <span>PRICE: {article.issuePrice}</span>
            </div>
          </div>

          <h1 className="font-serif font-black text-4xl md:text-5xl tracking-tight text-[#1c1813] uppercase leading-none my-1 font-headline">
            {article.newspaperName}
          </h1>
          <div className="text-[10px] tracking-widest text-[#4d4032] font-mono uppercase italic">
            LARGEST CIRCULATION THROUGHOUT NORTHERN INDIA & KASHMIR
          </div>
        </div>

        {/* Newspaper Column Grid */}
        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar bg-[#f4ecd8] space-y-5">
          
          {/* Main Giant Banner Headline */}
          <div className="border-b-2 border-[#1c1813] pb-3 text-center">
            <h2 className="font-condensed font-black text-2xl md:text-3xl uppercase tracking-tight text-[#1c1813] leading-snug">
              {article.bannerHeadline}
            </h2>
            <div className="font-serif italic text-sm text-[#4d4032] mt-1 font-bold">
              {article.subHeadline}
            </div>
          </div>

          {/* Three Column Broadsheet Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 font-serif text-xs leading-relaxed text-[#262018]">
            
            {/* Lead Story Column */}
            <div className="md:col-span-2 space-y-3 pr-2 md:border-r border-[#1c1813]/25">
              <p className="first-letter:text-4xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:font-headline leading-relaxed">
                {article.leadParagraph}
              </p>

              {/* Wire Photo Mockup Box */}
              <div className="bg-[#dfd1b2] border border-[#1c1813]/30 p-2 rounded">
                <div className="w-full h-32 bg-[#2d271f] flex flex-col items-center justify-center text-[#d5c7a5] p-3 text-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
                  <Shield className="w-8 h-8 text-brass/70 mb-1" />
                  <span className="font-mono text-[9px] uppercase tracking-wider text-paper/90">
                    [WIREPRESS FIELD TELEGRAPH TRANSMISSION]
                  </span>
                  <span className="text-[10px] italic text-[#eee7da]/80 mt-1 max-w-sm">
                    "{article.wirePhotoCaption}"
                  </span>
                </div>
                <div className="text-[9px] font-mono text-[#594b39] mt-1 italic">
                  Press Information Bureau (Govt of India) Authorized Wire Photo.
                </div>
              </div>
            </div>

            {/* Side Column: Secondary Article & Editorial */}
            <div className="space-y-4">
              <div className="bg-[#ebdcc0] p-3 border border-[#1c1813]/20 rounded">
                <h3 className="font-condensed font-bold text-sm uppercase text-[#1c1813] border-b border-[#1c1813]/20 pb-1 mb-1.5">
                  {article.secondaryArticleTitle}
                </h3>
                <p className="text-[11px] leading-relaxed text-[#3b3123]">
                  {article.secondaryArticleSnippet}
                </p>
              </div>

              <div className="border-t-2 border-double border-[#1c1813]/40 pt-2">
                <div className="font-mono font-bold text-[9px] uppercase tracking-wider text-[#594b39] mb-1">
                  EDITORIAL DESK COMMENTARY:
                </div>
                <blockquote className="italic text-[11px] text-[#4d4032] border-l-2 border-[#1c1813] pl-2 leading-relaxed">
                  {article.editorialSnippet}
                </blockquote>
              </div>
            </div>

          </div>

        </div>

        {/* Footer Navigation Bar */}
        <div className="bg-[#241f17] text-paper border-t-2 border-[#1c1813] p-4 flex items-center justify-between">
          <div className="text-xs font-mono text-brass/80 flex items-center gap-2">
            <Newspaper className="w-4 h-4 text-brass" />
            <span>HISTORICAL ARCHIVE RECORD // KASHMIR FRONT 1947–1948</span>
          </div>

          <button
            onClick={handleContinue}
            className="py-2.5 px-6 bg-gradient-to-r from-brass to-amber hover:from-amber hover:to-brass text-void font-condensed font-extrabold text-sm tracking-widest uppercase rounded shadow-brass-glow transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>PROCEED TO OPERATIONAL BRIEFING</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
