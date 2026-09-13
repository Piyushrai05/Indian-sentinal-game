import React, { useState, useEffect, useRef } from 'react';
import { Crosshair, ChevronUp, ChevronDown, Flame, Video, Shield, Radio, Activity, Target, X, Maximize2, Minimize2, Volume2, VolumeX } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { LiveStrikeType, FIRE_SUPPORT_ARSENAL } from '../../types/weapons';
import { soundEngine } from '../../engine/audioEngine';

export const WeaponsArsenalDeck: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const selectedLocationId = useGameStore(s => s.selectedLocationId);
  const locations = useGameStore(s => s.locations);
  const launchLiveStrike = useGameStore(s => s.launchLiveStrike);

  const [selectedWeaponId, setSelectedWeaponId] = useState<LiveStrikeType>('ROCKET_SALVO');
  const [showLiveGunCam, setShowLiveGunCam] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreenHardware, setIsFullscreenHardware] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const gunCamContainerRef = useRef<HTMLDivElement>(null);

  const loc = locations.find(l => l.id === selectedLocationId) || locations[0];
  const activeWeapon = FIRE_SUPPORT_ARSENAL.find(w => w.id === selectedWeaponId) || FIRE_SUPPORT_ARSENAL[0];

  const handleLaunch = () => {
    soundEngine.playStampThud();
    launchLiveStrike(selectedWeaponId, loc.id);

    if (activeWeapon.videoUrl) {
      setShowLiveGunCam(true);
    }
  };

  // Handle escape key to close fullscreen gun cam
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showLiveGunCam && e.key === 'Escape') {
        setShowLiveGunCam(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showLiveGunCam]);

  const toggleHardwareFullscreen = async () => {
    soundEngine.playPinClick();
    if (!document.fullscreenElement) {
      if (gunCamContainerRef.current?.requestFullscreen) {
        await gunCamContainerRef.current.requestFullscreen();
      } else if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
      setIsFullscreenHardware(true);
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
      setIsFullscreenHardware(false);
    }
  };

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          1. BOTTOM FLOATING ARSENAL DECK (MINIMIZED / EXPANDED)
          ───────────────────────────────────────────────────────────── */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 pointer-events-none select-none">
        <div className="bg-[#14120e]/95 backdrop-blur-md border border-[#c09a5b]/40 rounded shadow-2xl p-3 pointer-events-auto flex flex-col gap-2 max-w-2xl w-full">
          
          {/* Toggle Bar */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-[#f4ecd8] uppercase hover:text-[#c09a5b] transition-colors cursor-pointer"
            >
              <Crosshair className="w-3.5 h-3.5 text-[#c09a5b]" />
              <span>FIRE SUPPORT & STRIKES // TARGET: {loc.name}</span>
              {isCollapsed ? <ChevronUp className="w-3.5 h-3.5 text-[#c09a5b]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#c09a5b]" />}
            </button>

            {/* Video Feed Indicator Tag */}
            {activeWeapon.videoUrl && !isCollapsed && (
              <span className="flex items-center gap-1.5 text-[9px] font-mono text-[#c09a5b] bg-[#1c1914] px-2 py-0.5 rounded border border-[#c09a5b]/40">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                <span>GUN-CAM OPTICS LIVE</span>
              </span>
            )}
          </div>

          {/* Expanded Weapon Selection */}
          {!isCollapsed && (
            <div className="space-y-3 pt-2 border-t border-[#c09a5b]/20">
              {/* Weapon Badges */}
              <div className="grid grid-cols-5 gap-1.5 font-mono text-[10px]">
                {FIRE_SUPPORT_ARSENAL.map(w => {
                  const isSelected = selectedWeaponId === w.id;
                  return (
                    <button
                      key={w.id}
                      onClick={() => setSelectedWeaponId(w.id)}
                      className={`p-2 rounded border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#c09a5b] text-[#14120e] font-bold border-[#c09a5b] shadow-sm'
                          : 'bg-[#181612] border-[#3d3425] text-[#a39783] hover:text-[#f4ecd8]'
                      }`}
                    >
                      <div className="font-bold flex items-center justify-center gap-1">
                        <span>[{w.icon}]</span>
                        {w.videoUrl && <Video className="w-2.5 h-2.5 opacity-70" />}
                      </div>
                      <div className="text-[8px] truncate mt-0.5">{w.name}</div>
                    </button>
                  );
                })}
              </div>

              {/* Weapon Detail & Holographic Scope Preview */}
              <div className="grid grid-cols-12 gap-3 items-center bg-[#181612] border border-[#3d3425] p-3 rounded">
                
                {/* Left: Weapon Intel */}
                <div className="col-span-8 text-xs font-serif text-[#d5c7b0]">
                  <div className="font-bold text-[#f4ecd8] uppercase font-serif flex items-center gap-2">
                    <span>{activeWeapon.name}</span>
                    <span className="text-[9px] font-mono text-[#c09a5b] bg-black/50 px-1.5 py-0.2 rounded border border-[#c09a5b]/20">
                      {activeWeapon.damage}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#a39783] leading-snug mt-1">{activeWeapon.description}</div>
                </div>

                {/* Right: Holographic Scope View / Launch Button */}
                <div className="col-span-4 flex flex-col items-end gap-1.5">
                  {activeWeapon.videoUrl && (
                    <div className="w-28 h-14 rounded border border-[#c09a5b]/50 overflow-hidden relative shadow bg-black flex-shrink-0 group cursor-pointer"
                         onClick={() => setShowLiveGunCam(true)}
                         title="Click to view Fullscreen Gun-Cam Feed"
                    >
                      <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover video-sepia-grade opacity-85 hologram-feed-mask scale-110"
                        src={activeWeapon.videoUrl}
                      />
                      {/* Holographic Scope Reticle Overlay */}
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <Crosshair className="w-6 h-6 text-[#c09a5b]/60 stroke-1" />
                      </div>
                      <div className="absolute top-0.5 left-1 text-[7px] font-mono text-[#c09a5b] tracking-wider uppercase bg-black/80 px-1 rounded flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
                        <span>FULLSCREEN</span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleLaunch}
                    className="w-full py-2 px-3 bg-gradient-to-r from-red-600 to-amber-600 hover:from-amber-600 hover:to-red-600 text-white font-serif font-extrabold text-xs tracking-widest uppercase rounded shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>FIRE AT {loc.name}</span>
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. TRUE 100% EDGE-TO-EDGE FULLSCREEN GUN-CAM OPTICAL VIEWPORT
          ───────────────────────────────────────────────────────────── */}
      {showLiveGunCam && activeWeapon.videoUrl && (
        <div
          ref={gunCamContainerRef}
          className="fixed inset-0 z-[100] w-screen h-screen bg-black flex flex-col justify-between select-none overflow-hidden animate-fadeIn"
        >
          {/* Edge-to-Edge Video Playback Layer */}
          <div className="absolute inset-0 z-0 bg-black flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              controls={false}
              playsInline
              loop
              muted={isMuted}
              className="w-full h-full object-cover video-sepia-grade"
              style={{ width: '100vw', height: '100vh', objectFit: 'cover' }}
              src={activeWeapon.videoUrl}
            />

            {/* CRT Phosphor Scanlines */}
            <div className="scanlines absolute inset-0 pointer-events-none opacity-25" />

            {/* Ambient Optical Vignette */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.85)_100%)]" />

            {/* Dynamic Sweep Line */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-[#c09a5b]/10 to-transparent h-20 w-full animate-hud-sweep" />
          </div>

          {/* ─────────────────────────────────────────────────────────────
              FULLSCREEN HUD TOP BAR
              ───────────────────────────────────────────────────────────── */}
          <div className="relative z-20 flex items-center justify-between p-6 bg-gradient-to-b from-black/95 via-black/60 to-transparent font-mono">
            {/* Left Status */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded border border-red-500/70 bg-black/80 flex items-center justify-center text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                <Target className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                  <span className="font-bold tracking-widest uppercase text-red-400 text-sm">
                    TACTICAL GUN-CAM FEED // {activeWeapon.callsign}
                  </span>
                  <span className="text-[10px] bg-red-950/80 text-red-300 border border-red-500/40 px-2 py-0.5 rounded ml-2">
                    LIVE OPTICAL RECON
                  </span>
                </div>
                <div className="text-xs text-[#c09a5b] mt-0.5 flex items-center gap-3">
                  <span>TARGET: {loc.name.toUpperCase()} [{loc.lat.toFixed(4)}° N, {loc.lng.toFixed(4)}° E]</span>
                  <span>•</span>
                  <span>AZM: 042° • ELEV: +14° • RNG: 4.8 KM</span>
                  <span>•</span>
                  <span>FEED: 1080P HD / 60 FPS</span>
                </div>
              </div>
            </div>

            {/* Right Header Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2.5 rounded bg-black/70 border border-[#c09a5b]/50 text-[#c09a5b] hover:bg-[#c09a5b]/20 transition-all cursor-pointer flex items-center gap-2 text-xs"
                title="Toggle Audio"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                <span>{isMuted ? 'UNMUTE' : 'AUDIO ON'}</span>
              </button>

              <button
                onClick={toggleHardwareFullscreen}
                className="p-2.5 rounded bg-black/70 border border-[#c09a5b]/50 text-[#c09a5b] hover:bg-[#c09a5b]/20 transition-all cursor-pointer"
                title="Toggle Browser Fullscreen"
              >
                {isFullscreenHardware ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setShowLiveGunCam(false)}
                className="px-4 py-2 rounded bg-red-950/90 border-2 border-red-500 text-red-100 hover:bg-red-700 hover:text-white transition-all cursor-pointer shadow-[0_0_20px_rgba(239,68,68,0.5)] flex items-center gap-1.5 font-bold tracking-wider uppercase text-xs"
                title="Return to Command (Esc)"
              >
                <X className="w-4 h-4" />
                <span>RETURN TO COMMAND (ESC)</span>
              </button>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              FULLSCREEN OPTICAL RETICLE OVERLAY
              ───────────────────────────────────────────────────────────── */}
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 z-10">
            {/* 4 Precision Corner Brackets */}
            <div className="flex justify-between">
              <div className="w-12 h-12 border-t-2 border-l-2 border-[#c09a5b]/90 shadow-[0_0_10px_rgba(192,154,91,0.5)]" />
              <div className="w-12 h-12 border-t-2 border-r-2 border-[#c09a5b]/90 shadow-[0_0_10px_rgba(192,154,91,0.5)]" />
            </div>

            {/* Center Dynamic Large Optical Crosshair Reticle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
              <div className="w-72 h-72 rounded-full border-2 border-[#c09a5b]/30 animate-reticle-rotate" />
              <div className="w-48 h-48 rounded-full border border-dashed border-[#c09a5b]/50" />
              <Crosshair className="w-24 h-24 text-red-500/70 absolute drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
              <div className="absolute -bottom-10 bg-black/80 px-3 py-1 rounded border border-[#c09a5b]/40 text-[10px] font-mono text-[#c09a5b] tracking-widest uppercase">
                [ORDNANCE TRAJECTORY LOCKED]
              </div>
            </div>

            <div className="flex justify-between items-end">
              <div className="w-12 h-12 border-b-2 border-l-2 border-[#c09a5b]/90 shadow-[0_0_10px_rgba(192,154,91,0.5)]" />
              <div className="w-12 h-12 border-b-2 border-r-2 border-[#c09a5b]/90 shadow-[0_0_10px_rgba(192,154,91,0.5)]" />
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              FULLSCREEN HUD BOTTOM TELEMETRY FOOTER
              ───────────────────────────────────────────────────────────── */}
          <div className="relative z-20 p-6 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex items-center justify-between font-mono">
            {/* Impact Assessment */}
            <div className="space-y-1">
              <div className="text-[11px] text-[#a39783] uppercase tracking-wider">
                TACTICAL STRIKE IMPACT ASSESSMENT:
              </div>
              <div className="text-sm font-serif italic text-[#f4ecd8] font-bold">
                "{activeWeapon.effectDescription}"
              </div>
            </div>

            {/* Center Optical Signal Equalizer */}
            <div className="flex items-end gap-1.5 h-6 bg-black/80 px-3 py-1.5 rounded border border-[#c09a5b]/40 shadow-inner">
              <span className="w-1.5 bg-[#c09a5b] animate-signal-1" />
              <span className="w-1.5 bg-[#c09a5b] animate-signal-2" />
              <span className="w-1.5 bg-[#c09a5b] animate-signal-3" />
              <span className="w-1.5 bg-[#c09a5b] animate-signal-4" />
              <span className="text-[10px] font-mono text-[#c09a5b] ml-2 font-bold tracking-widest uppercase">
                OPTICAL SIGNAL LOCK 99.4%
              </span>
            </div>

            {/* Return Action Button */}
            <button
              onClick={() => setShowLiveGunCam(false)}
              className="px-6 py-2.5 bg-gradient-to-r from-[#c09a5b] to-[#d4a45c] text-[#14120e] font-serif font-extrabold uppercase rounded hover:from-[#d4a45c] hover:to-[#c09a5b] transition-all cursor-pointer shadow-[0_0_20px_rgba(192,154,91,0.4)] text-xs tracking-wider"
            >
              RETURN TO COMMAND MAP (ESC)
            </button>
          </div>

        </div>
      )}
    </>
  );
};
