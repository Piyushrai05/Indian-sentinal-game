import React, { useState } from 'react';
import { Shield, BookOpen, Compass, Award, ArrowRight, Radio, Eye, Crosshair, Film, Maximize2 } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { soundEngine } from '../../engine/audioEngine';

export const MainMenu: React.FC = () => {
  const startCampaign = useGameStore(s => s.startCampaign);
  const enterCommandCenter = useGameStore(s => s.enterCommandCenter);
  const openJournal = useGameStore(s => s.openJournal);
  const openMedals = useGameStore(s => s.openMedals);
  const openFullscreenCinema = useGameStore(s => s.openFullscreenCinema);

  const [activeTab, setActiveTab] = useState<'HOME' | 'CAMPAIGN' | 'COMMAND' | 'HISTORY' | 'SETTINGS'>('HOME');

  const handleStartCampaign = () => {
    soundEngine.playPinClick();
    startCampaign();
  };

  const handleEnterCommand = () => {
    soundEngine.playPinClick();
    enterCommandCenter();
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-between p-6 select-none bg-[#0a0806] text-[#f4ecd8] font-serif overflow-hidden pointer-events-auto animate-fadeIn">
      
      {/* ─────────────────────────────────────────────────────────────
          ORGANIC CINEMATIC PROJECTION (SEAMLESS FULLSCREEN BACKDROP)
          ───────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover video-sepia-grade opacity-85 scale-100"
          style={{ width: '100vw', height: '100vh', objectFit: 'cover' }}
          src="/videos/landing_page_bg.mp4"
        />
        {/* Soft Radial Ambient Lighting & Film Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0806]/90 via-[#0a0806]/35 to-[#0a0806]/65" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,#0a0806_95%)]" />
        <div className="scanlines absolute inset-0 opacity-15" />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          1. TOP NAVIGATION BAR
          ───────────────────────────────────────────────────────────── */}
      <header className="relative z-10 flex items-center justify-between border-b border-[#c09a5b]/25 pb-4 pt-1 px-4">
        {/* Left Nav Links */}
        <div className="flex items-center gap-6 text-xs font-mono font-bold tracking-widest uppercase">
          <button
            onClick={() => setActiveTab('HOME')}
            className={"transition-colors cursor-pointer " + (activeTab === 'HOME' ? 'text-[#c09a5b] border-b-2 border-[#c09a5b] pb-0.5' : 'text-[#a39783] hover:text-[#f4ecd8]')}
          >
            HOME
          </button>
          <button
            onClick={() => {
              setActiveTab('CAMPAIGN');
              handleStartCampaign();
            }}
            className="text-[#a39783] hover:text-[#f4ecd8] transition-colors cursor-pointer"
          >
            CAMPAIGN
          </button>
          <button
            onClick={() => {
              setActiveTab('COMMAND');
              handleEnterCommand();
            }}
            className="text-[#a39783] hover:text-[#f4ecd8] transition-colors cursor-pointer"
          >
            COMMAND
          </button>
          <button
            onClick={() => {
              openJournal();
            }}
            className="text-[#a39783] hover:text-[#f4ecd8] transition-colors cursor-pointer"
          >
            HISTORY
          </button>
          <button
            onClick={() => {
              openMedals();
            }}
            className="text-[#a39783] hover:text-[#f4ecd8] transition-colors cursor-pointer"
          >
            CITATIONS
          </button>

          {/* Fullscreen Video Cinema Button */}
          <button
            onClick={() => openFullscreenCinema('/videos/landing_page_bg.mp4')}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#c09a5b]/20 border border-[#c09a5b]/70 text-[#c09a5b] hover:bg-[#c09a5b] hover:text-[#14120e] transition-all cursor-pointer shadow-sm animate-pulseGlow font-mono font-bold ml-2"
            title="Watch Fullscreen Historical Footage (F)"
          >
            <Film className="w-3.5 h-3.5" />
            <span>▶ FULLSCREEN CINEMA</span>
          </button>
        </div>

        {/* Right Status Badge */}
        <div className="flex items-center gap-4 text-right">
          <div className="flex items-center gap-2 text-[11px] font-mono tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[#a39783] uppercase">AI ENGINE ACTIVE // GROQ + GEMINI</span>
          </div>
          <div className="border-l border-[#c09a5b]/25 pl-4 text-[11px] font-mono text-[#c09a5b] font-bold">
            NOV 02, 1947 • 1800 HRS
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. MAIN HERO SECTION
          ───────────────────────────────────────────────────────────── */}
      <main className="relative z-10 grid grid-cols-12 gap-8 my-auto items-center px-4 max-w-7xl mx-auto w-full">
        
        {/* Left Column: Officer Portrait & Archival Desk Props */}
        <div className="col-span-3 flex flex-col justify-between h-[420px] border-r border-[#c09a5b]/20 pr-6">
          <div className="space-y-3">
            <div className="relative border border-[#c09a5b]/40 p-1 bg-[#14120f]/85 shadow-lg backdrop-blur-md">
              <div className="w-full h-44 bg-gradient-to-b from-[#242018] to-[#14120e] flex items-center justify-center relative overflow-hidden border border-[#c09a5b]/20">
                <div className="text-center p-3">
                  <div className="w-16 h-16 mx-auto rounded-full bg-[#342b1f] border-2 border-[#c09a5b]/60 flex items-center justify-center mb-2 shadow-inner">
                    <Shield className="w-8 h-8 text-[#c09a5b]" />
                  </div>
                  <div className="font-condensed font-extrabold text-sm text-[#f4ecd8] uppercase tracking-wider">
                    BRIG. MOHAMMAD USMAN
                  </div>
                  <div className="font-mono text-[9px] text-[#c09a5b] uppercase">
                    50TH PARACHUTE BRIGADE
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[11px] italic text-[#d5c7b0] leading-relaxed">
              "Some defend land. Others defend what it means to belong."
            </p>
            <div className="text-[9px] font-mono uppercase text-[#a39783]">
              — BRIG. MOHAMMAD USMAN, MVC
            </div>
          </div>

          <div className="space-y-1 pt-4 border-t border-[#c09a5b]/15 text-[10px] font-mono text-[#8a7f6c]">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c09a5b]" />
              <span>OPERATIONS LOGBOOK // OCT 1947</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c09a5b]" />
              <span>INTELLIGENCE DOSSIER // TRIBAL FORCES</span>
            </div>
            <div className="flex items-center gap-2 text-[#c09a5b]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>MUG: "A SAFER TOMORROW"</span>
            </div>
          </div>
        </div>

        {/* Center Column: Game Title & Dual Interactive Mode Cards */}
        <div className="col-span-6 flex flex-col items-center text-center px-4">
          <div className="text-xs font-mono font-bold tracking-[0.35em] text-[#c09a5b] uppercase mb-1">
            1947 — 1948
          </div>

          <h1 className="font-serif font-extrabold text-6xl tracking-[0.18em] text-[#f4ecd8] uppercase leading-tight drop-shadow-md">
            SENTINEL AI
          </h1>

          <div className="font-serif italic text-lg tracking-[0.2em] text-[#c09a5b] uppercase mb-4">
            THE KASHMIR FRONT
          </div>

          <p className="text-xs font-mono tracking-widest text-[#d5c7b0] uppercase max-w-lg mb-8 pb-4 border-b border-[#c09a5b]/25">
            A HISTORICAL WAR STORY. GUIDED BY AI. DRIVEN BY YOUR DECISIONS.
          </p>

          {/* Dual Action Cards */}
          <div className="grid grid-cols-2 gap-4 w-full text-left">
            <button
              onClick={handleStartCampaign}
              className="group bg-[#14120e]/85 border border-[#c09a5b]/40 hover:border-[#c09a5b] p-5 rounded transition-all duration-300 shadow-lg hover:shadow-[0_0_25px_rgba(192,154,91,0.25)] hover:scale-[1.02] flex flex-col justify-between cursor-pointer backdrop-blur-md"
            >
              <div>
                <div className="flex items-center gap-2 text-[#c09a5b] mb-2">
                  <BookOpen className="w-4 h-4" />
                  <span className="font-serif font-bold text-sm tracking-wider uppercase">STORY MODE</span>
                </div>
                <p className="text-xs font-serif text-[#a39783] leading-relaxed group-hover:text-[#d5c7b0] transition-colors">
                  Experience 5 historical chapters with dynamic AI narrative, character dialogues, and branching battlefield events.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#c09a5b]/20 flex items-center justify-between text-xs font-mono font-bold text-[#c09a5b] uppercase group-hover:text-[#f4ecd8]">
                <span>BEGIN CAMPAIGN</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </button>

            <button
              onClick={handleEnterCommand}
              className="group bg-[#14120e]/85 border border-[#c09a5b]/40 hover:border-[#c09a5b] p-5 rounded transition-all duration-300 shadow-lg hover:shadow-[0_0_25px_rgba(192,154,91,0.25)] hover:scale-[1.02] flex flex-col justify-between cursor-pointer backdrop-blur-md"
            >
              <div>
                <div className="flex items-center gap-2 text-[#c09a5b] mb-2">
                  <Compass className="w-4 h-4" />
                  <span className="font-serif font-bold text-sm tracking-wider uppercase">COMMAND MODE</span>
                </div>
                <p className="text-xs font-serif text-[#a39783] leading-relaxed group-hover:text-[#d5c7b0] transition-colors">
                  Direct access to the Kashmir Operations Center. Live 3D tactical map, satellite recon, supply lines, and war state meters.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#c09a5b]/20 flex items-center justify-between text-xs font-mono font-bold text-[#c09a5b] uppercase group-hover:text-[#f4ecd8]">
                <span>OPEN COMMAND CENTER</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </button>
          </div>
        </div>

        {/* Right Column: Mountains Photo & Archival Note */}
        <div className="col-span-3 flex flex-col justify-between h-[420px] border-l border-[#c09a5b]/20 pl-6 text-right">
          <div>
            <div className="font-serif italic text-xl text-[#c09a5b] leading-tight">
              Mountains
              <br />
              Remember Everything
            </div>
            <div className="text-[10px] font-mono text-[#8a7f6c] uppercase mt-2">
              JAMMU & KASHMIR // LADAKH
            </div>
          </div>

          <div className="bg-[#181612]/85 border border-[#c09a5b]/30 p-3.5 rounded shadow text-left relative rotate-1 hover:rotate-0 transition-transform backdrop-blur-md">
            <div className="text-[9px] font-mono text-[#c09a5b] font-bold uppercase tracking-wider mb-1">
              KASHMIR • OCT 1947
            </div>
            <div className="text-xs font-serif italic text-[#d5c7b0] leading-snug">
              "More than a battle. It was a beginning."
            </div>
            <div className="mt-2 text-[8px] font-mono text-[#8a7f6c] uppercase">
              SECTORS: SRINAGAR • URI • BARAMULLA • POONCH • NAUSHERA
            </div>
          </div>

          <div className="text-[10px] font-mono text-[#8a7f6c] uppercase space-y-1">
            <div>PEOPLE • TERRAIN</div>
            <div>SUPPLY • DECISIONS</div>
            <div className="text-[#c09a5b]">HISTORY RESPONDS TO YOU</div>
          </div>
        </div>

      </main>

      {/* ─────────────────────────────────────────────────────────────
          3. FOOTER TELEMETRY
          ───────────────────────────────────────────────────────────── */}
      <footer className="relative z-10 flex items-center justify-between border-t border-[#c09a5b]/25 pt-3 px-4 text-[10px] font-mono text-[#a39783]">
        <div className="uppercase tracking-wider">
          BRIGADIER MOHAMMAD USMAN // 50TH PARACHUTE BRIGADE
        </div>
        <div className="flex items-center gap-4 uppercase tracking-widest text-[#c09a5b]">
          <span>KICKR CODEMANIA 2026</span>
          <span>•</span>
          <span>GROQ & GEMINI AI POWERED</span>
          <span>•</span>
          <span>AUTHENTIC 1947–48 TELEMETRY</span>
        </div>
        <div className="uppercase tracking-wider text-[#f4ecd8]">
          HISTORY RESPONDS TO YOUR DECISIONS
        </div>
      </footer>

    </div>
  );
};
