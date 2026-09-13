import React, { useState, useRef, useEffect } from 'react';
import { Maximize2, Minimize2, Volume2, VolumeX, Play, Pause, X, Film } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { soundEngine } from '../../engine/audioEngine';

interface VideoTrack {
  id: string;
  title: string;
  subtitle: string;
  src: string;
  sector: string;
  durationEstimate: string;
}

const VIDEO_TRACKS: VideoTrack[] = [
  {
    id: 'landing_bg',
    title: '1947 KASHMIR WAR ARCHIVE',
    subtitle: 'HISTORICAL FRONT REEL // TRIBAL INVASION & RESISTANCE',
    src: '/videos/landing_page_bg.mp4',
    sector: 'KASHMIR THEATRE // BARAMULLA-SRINAGAR SECTOR',
    durationEstimate: 'ARCHIVE LOOP'
  },
  {
    id: 'rl6_launcher',
    title: 'RL-6 MULTI-TUBE ROCKET BATTERY',
    subtitle: 'LIVE ARTILLERY SUPPRESSION & SALVO BATTERY CAM',
    src: '/videos/rl6_rocket_launcher.mp4',
    sector: 'POONCH RIDGE // HEAVY ORDNANCE',
    durationEstimate: 'TARGET FEED'
  },
  {
    id: 'wpsmk_smoke',
    title: 'WP-SMK PHOSPHORUS SMOKE SCREEN',
    subtitle: 'TACTICAL RETREAT SCREENING & OBSCURATION POD',
    src: '/videos/wpsmk_smoke_screen.mp4',
    sector: 'URI GORGE // SMOKE DEPLOYMENT',
    durationEstimate: 'CONCEAL FEED'
  }
];

export const FullscreenCinemaModal: React.FC = () => {
  const isCinemaOpen = useGameStore(s => s.isFullscreenCinemaOpen);
  const cinemaVideoUrl = useGameStore(s => s.activeCinemaVideoUrl);
  const closeCinema = useGameStore(s => s.closeFullscreenCinema);

  const [selectedTrackIndex, setSelectedTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [showHUD, setShowHUD] = useState<boolean>(true);
  const [hasScanlines, setHasScanlines] = useState<boolean>(true);
  const [isFullscreenHardware, setIsFullscreenHardware] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cinemaVideoUrl) {
      const idx = VIDEO_TRACKS.findIndex(t => t.src === cinemaVideoUrl);
      if (idx !== -1) {
        setSelectedTrackIndex(idx);
      }
    }
  }, [cinemaVideoUrl]);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreenHardware(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  if (!isCinemaOpen) return null;

  const currentTrack = VIDEO_TRACKS[selectedTrackIndex] || VIDEO_TRACKS[0];

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const toggleHardwareFullscreen = async () => {
    soundEngine.playPinClick();
    if (!document.fullscreenElement) {
      if (containerRef.current?.requestFullscreen) {
        await containerRef.current.requestFullscreen();
      } else if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = Math.floor(secs % 60).toString().padStart(2, '0');
    return m + ':' + s;
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-black flex flex-col justify-between select-none overflow-hidden animate-fadeIn"
    >
      <div className="absolute inset-0 z-0 bg-black flex items-center justify-center">
        <video
          ref={videoRef}
          key={currentTrack.src}
          src={currentTrack.src}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleTimeUpdate}
          className="w-full h-full object-cover video-sepia-grade"
          style={{ width: '100vw', height: '100vh', objectFit: 'cover' }}
        />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.85)_100%)]" />
        {hasScanlines && <div className="scanlines absolute inset-0 pointer-events-none opacity-25" />}
      </div>

      {showHUD && (
        <div className="relative z-20 flex items-center justify-between p-6 bg-gradient-to-b from-black/90 via-black/50 to-transparent transition-opacity">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded border border-[#c09a5b]/60 bg-[#14120e]/90 flex items-center justify-center text-[#c09a5b] shadow-brass-glow">
              <Film className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                <span className="font-mono text-xs text-[#c09a5b] tracking-widest font-bold uppercase">
                  ARCHIVAL CINEMATIC REEL // LIVE FEED
                </span>
              </div>
              <h2 className="font-serif font-extrabold text-lg text-[#f4ecd8] tracking-wider uppercase drop-shadow">
                {currentTrack.title}
              </h2>
              <div className="text-[10px] font-mono text-[#a39783]">
                {currentTrack.subtitle} • {currentTrack.sector}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setHasScanlines(!hasScanlines)}
              className={"px-3 py-1.5 rounded text-xs font-mono border transition-all cursor-pointer " + (
                hasScanlines
                  ? "bg-[#c09a5b]/20 border-[#c09a5b] text-[#c09a5b]"
                  : "bg-black/60 border-neutral-700 text-neutral-400 hover:text-white"
              )}
              title="Toggle CRT Scanline Effect"
            >
              CRT SCANLINES: {hasScanlines ? 'ON' : 'OFF'}
            </button>

            <button
              onClick={toggleHardwareFullscreen}
              className="p-2 rounded bg-black/60 border border-[#c09a5b]/40 text-[#c09a5b] hover:bg-[#c09a5b]/20 transition-all cursor-pointer"
              title="Toggle Browser Fullscreen"
            >
              {isFullscreenHardware ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => {
                soundEngine.playPinClick();
                closeCinema();
              }}
              className="p-2 rounded bg-red-950/80 border border-red-500/60 text-red-200 hover:bg-red-700 hover:text-white transition-all cursor-pointer shadow-danger-glow"
              title="Close Fullscreen (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {showHUD && (
        <div className="relative z-20 flex justify-center px-6">
          <div className="flex items-center gap-3 bg-black/80 backdrop-blur-md p-2 rounded-full border border-[#c09a5b]/30 shadow-2xl">
            {VIDEO_TRACKS.map((track, idx) => {
              const isActive = idx === selectedTrackIndex;
              return (
                <button
                  key={track.id}
                  onClick={() => {
                    soundEngine.playPinClick();
                    setSelectedTrackIndex(idx);
                    setIsPlaying(true);
                  }}
                  className={"px-4 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all cursor-pointer " + (
                    isActive
                      ? "bg-[#c09a5b] text-[#14120e] font-bold shadow-[0_0_15px_rgba(192,154,91,0.5)]"
                      : "text-[#a39783] hover:text-[#f4ecd8] hover:bg-white/10"
                  )}
                >
                  {track.title}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {showHUD && (
        <div className="relative z-20 p-6 bg-gradient-to-t from-black/95 via-black/60 to-transparent space-y-3">
          <div className="flex items-center gap-3 font-mono text-xs text-[#c09a5b]">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="w-full accent-[#c09a5b] cursor-pointer h-1.5 bg-neutral-800 rounded-lg appearance-none"
            />
            <span>{formatTime(duration)}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-[#c09a5b] text-[#14120e] flex items-center justify-center hover:bg-[#e4be7e] transition-all cursor-pointer shadow-brass-glow"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>

              <button
                onClick={toggleMute}
                className="p-2 rounded bg-black/60 border border-[#c09a5b]/40 text-[#c09a5b] hover:bg-[#c09a5b]/20 transition-all cursor-pointer flex items-center gap-2 text-xs font-mono"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                <span>{isMuted ? 'UNMUTE AUDIO' : 'AUDIO ON'}</span>
              </button>
            </div>

            <div className="text-center font-serif text-xs italic text-[#d5c7b0]">
              "The high mountain passes remain silent witnesses to the defense of the valley."
            </div>

            <button
              onClick={() => setShowHUD(!showHUD)}
              className="px-3 py-1.5 rounded bg-black/60 border border-neutral-700 text-[#a39783] hover:text-white text-xs font-mono cursor-pointer"
            >
              TOGGLE HUD VIEW
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
