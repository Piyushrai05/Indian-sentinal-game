import React, { useEffect } from 'react';
import { SceneContainer } from './three/SceneContainer';
import { TopHUD } from './components/ui/TopHUD';
import { LayerToggleBar } from './components/ui/LayerToggleBar';
import { LeftSectorsDrawer } from './components/ui/LeftSectorsDrawer';
import { IntelPanel } from './components/ui/IntelPanel';
import { BattlefieldTicker } from './components/ui/BattlefieldTicker';
import { UnitCommandPanel } from './components/ui/UnitCommandPanel';
import { RadioDeck } from './components/ui/RadioDeck';
import { ReconModal } from './components/ui/ReconModal';
import { JournalModal } from './components/ui/JournalModal';
import { DecisionModal } from './components/ui/DecisionModal';
import { ConsequenceDrawer } from './components/ui/ConsequenceDrawer';
import { ChapterIntroModal } from './components/ui/ChapterIntroModal';
import { NewspaperPrologModal } from './components/ui/NewspaperPrologModal';
import { OfficerDialogueCutscene } from './components/ui/OfficerDialogueCutscene';
import { TacticalDilemmaModal } from './components/ui/TacticalDilemmaModal';
import { MedalShowcaseModal } from './components/ui/MedalShowcaseModal';
import { WeaponsArsenalDeck } from './components/ui/WeaponsArsenalDeck';
import { SatelliteHUDOverlay } from './components/ui/SatelliteHUDOverlay';
import { MainMenu } from './components/ui/MainMenu';
import { EndingScreen } from './components/ui/EndingScreen';
import { FullscreenCinemaModal } from './components/ui/FullscreenCinemaModal';
import { useGameStore } from './store/gameStore';

export const App: React.FC = () => {
  const gameScreen = useGameStore(s => s.gameScreen);
  const isFilmGrainEnabled = useGameStore(s => s.isFilmGrainEnabled);
  const openDecisionModal = useGameStore(s => s.openDecisionModal);
  const openUnitCommand = useGameStore(s => s.openUnitCommand);
  const openReconModal = useGameStore(s => s.openReconModal);
  const openRadio = useGameStore(s => s.openRadio);
  const openJournal = useGameStore(s => s.openJournal);
  const openMedals = useGameStore(s => s.openMedals);
  const toggleSatelliteView = useGameStore(s => s.toggleSatelliteView);
  const resetCameraToOverview = useGameStore(s => s.resetCameraToOverview);
  const setSimulationSpeed = useGameStore(s => s.setSimulationSpeed);
  const cycleNextSector = useGameStore(s => s.cycleNextSector);
  const cyclePrevSector = useGameStore(s => s.cyclePrevSector);
  const closeUnitCommand = useGameStore(s => s.closeUnitCommand);
  const closeReconModal = useGameStore(s => s.closeReconModal);
  const closeRadio = useGameStore(s => s.closeRadio);
  const closeJournal = useGameStore(s => s.closeJournal);
  const closeMedals = useGameStore(s => s.closeMedals);
  const closeDecisionModal = useGameStore(s => s.closeDecisionModal);
  const closeConsequence = useGameStore(s => s.closeConsequence);
  const openFullscreenCinema = useGameStore(s => s.openFullscreenCinema);
  const closeFullscreenCinema = useGameStore(s => s.closeFullscreenCinema);
  const isFullscreenCinemaOpen = useGameStore(s => s.isFullscreenCinemaOpen);

  // Global Tactical Keyboard Shortcuts for Fast Gameplay
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'f' || e.key === 'F') {
        if (isFullscreenCinemaOpen) closeFullscreenCinema();
        else openFullscreenCinema('/videos/landing_page_bg.mp4');
      } else if (e.key === 'Escape') {
        closeUnitCommand();
        closeReconModal();
        closeRadio();
        closeJournal();
        closeMedals();
        closeDecisionModal();
        closeConsequence();
        closeFullscreenCinema();
      } else if (e.key === '1') {
        setSimulationSpeed(1);
      } else if (e.key === '2') {
        setSimulationSpeed(2);
      } else if (e.key === '3' || e.key === '4') {
        setSimulationSpeed(4);
      } else if (e.key === 'd' || e.key === 'D') {
        openUnitCommand();
      } else if (e.key === 'r' || e.key === 'R') {
        openReconModal();
      } else if (e.key === 'c' || e.key === 'C') {
        openRadio();
      } else if (e.key === 'j' || e.key === 'J') {
        openJournal();
      } else if (e.key === 'g' || e.key === 'G') {
        openMedals();
      } else if (e.key === 'v' || e.key === 'V') {
        toggleSatelliteView();
      } else if (e.key === 'm' || e.key === 'M') {
        resetCameraToOverview();
      } else if (e.key === ' ' && gameScreen === 'COMMAND') {
        e.preventDefault();
        openDecisionModal();
      } else if (e.key === 'Tab' || e.key === 'ArrowRight') {
        e.preventDefault();
        cycleNextSector();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        cyclePrevSector();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    gameScreen,
    openDecisionModal,
    openUnitCommand,
    openReconModal,
    openRadio,
    openJournal,
    openMedals,
    resetCameraToOverview,
    setSimulationSpeed,
    cycleNextSector,
    cyclePrevSector,
    closeUnitCommand,
    closeReconModal,
    closeRadio,
    closeJournal,
    closeMedals,
    closeDecisionModal,
    closeConsequence
  ]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-void font-sans select-none">
      
      {/* 1. Real 3D Command Battlefield Engine (75–80% Screen Dominance) */}
      <SceneContainer />

      {/* 2. Atmospheric War Room Vignette Overlay */}
      <div className="vignette-overlay" />
      {isFilmGrainEnabled && <div className="scanlines pointer-events-none fixed inset-0 z-10 opacity-30" />}

      {/* 3. Main Menu Title Screen */}
      {gameScreen === 'MENU' && <MainMenu />}

      {/* 4. Active Battlefield Mode (Command HUD & Strategic Overlays) */}
      {(gameScreen === 'COMMAND' || gameScreen === 'DECISION' || gameScreen === 'CONSEQUENCE') && (
        <>
          <TopHUD />
          <BattlefieldTicker />
          <LeftSectorsDrawer />
          <IntelPanel />
          <LayerToggleBar />
          <WeaponsArsenalDeck />
          <SatelliteHUDOverlay />

          {/* Modals & Tactical Command Drawers */}
          <UnitCommandPanel />
          <RadioDeck />
          <ReconModal />
          <JournalModal />
          <DecisionModal />
          <ConsequenceDrawer />
        </>
      )}

      {/* 5. Interactive Story Mode Flow (Newspaper -> Chapter Dispatch -> Dialogue Cutscene) */}
      {gameScreen === 'NEWSPAPER' && <NewspaperPrologModal />}
      {gameScreen === 'CHAPTER_INTRO' && <ChapterIntroModal />}
      {gameScreen === 'CUTSCENE' && <OfficerDialogueCutscene />}

      {/* 6. Dynamic Mid-Battle Dilemmas & Gallantry Medals */}
      <TacticalDilemmaModal />
      <MedalShowcaseModal />

      {/* 7. Campaign Conclusion & After Action Report */}
      {gameScreen === 'ENDING' && <EndingScreen />}
      <FullscreenCinemaModal />

    </div>
  );
};

export default App;
