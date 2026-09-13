import {
  GameScreen,
  LocationData,
  SupplyRouteData,
  UnitData,
  WarState,
  DecisionRecord,
  CampaignChapter,
  DecisionType,
  RadioMessage,
  BattlefieldEvent,
  NPCMemory,
  EnemyIntelContact,
  EnemyAIState,
  MapLayerVisibility,
  AfterActionReportData,
  UnitMarchOrder,
  MedalAward,
  WarRoomLighting,
  SatelliteViewMode
} from '../types/game';
import { LiveStrikeType, ActiveStrikeEntity, FIRE_SUPPORT_ARSENAL } from '../types/weapons';
import { INITIAL_LOCATIONS } from '../data/locations';
import { INITIAL_ROUTES } from '../data/routes';
import { INITIAL_UNITS } from '../data/units';
import { INITIAL_ENEMY_CONTACTS } from '../data/enemyIntel';
import { INITIAL_OFFICERS } from '../data/officers';
import { CAMPAIGN_CHAPTERS } from '../data/chapters';
import { CAMPAIGN_DILEMMAS, StoryDilemma, StoryDilemmaOption } from '../data/storyDilemmas';
import { resolveCombatOrder, computeAfterActionReport } from '../engine/warEngine';
import { evaluateEnemyReaction } from '../engine/enemyAI';
import { executeReconMission } from '../engine/fogOfWar';
import { advanceCampaignTime } from '../engine/campaignClock';
import { updateOfficerRelationship } from '../engine/relationshipEngine';
import { soundEngine } from '../engine/audioEngine';

interface GameStoreState {
  // Screen & Chapter Navigation
  gameScreen: GameScreen;
  currentChapterIndex: number;
  currentChapter: CampaignChapter;

  // 3D Camera & Visual Focus
  cameraMode: 'OVERVIEW' | 'SECTOR_FOCUS' | 'BATTLE_FOCUS' | 'TITLE_DRIFT';
  cameraFocusTarget: [number, number, number];
  selectedLocationId: string;
  selectedUnitId: string;

  // Authoritative War Simulation State
  warState: WarState;
  locations: LocationData[];
  supplyRoutes: SupplyRouteData[];
  units: UnitData[];
  enemyContacts: EnemyIntelContact[];
  enemyAI: EnemyAIState;
  officers: Record<string, NPCMemory>;

  // Layers Visibility
  mapLayers: MapLayerVisibility;

  // Atmosphere, Satellite & Lighting
  warRoomLighting: WarRoomLighting;
  isFilmGrainEnabled: boolean;
  isSatelliteView: boolean;
  isFullscreenCinemaOpen: boolean;
  activeCinemaVideoUrl?: string;
  satelliteViewMode: SatelliteViewMode;

  // Radio & Communications Deck
  isRadioOpen: boolean;
  activeRadioChannel: 'COMMAND' | 'FIELD' | 'INTELLIGENCE' | 'LOGISTICS' | 'AIR';
  radioMessages: RadioMessage[];

  // Dynamic Battlefield Events
  battlefieldEvents: BattlefieldEvent[];

  // Unit Command & Physical Movement Modal
  isUnitCommandOpen: boolean;

  // Reconnaissance Modal
  isReconModalOpen: boolean;

  // Operational Decisions & Cascading Consequences
  isDecisionModalOpen: boolean;
  isConsequenceOpen: boolean;
  lastDecisionRecord: DecisionRecord | null;
  decisionHistory: DecisionRecord[];

  // Story Dilemmas & Gallantry Medals
  activeDilemma: StoryDilemma | null;
  unlockedMedals: MedalAward[];
  isMedalsOpen: boolean;

  // Campaign Logbook / Journal
  isJournalOpen: boolean;

  // After Action Report
  afterActionReport: AfterActionReportData | null;

  // Audio & Speed Settings
  isSoundMuted: boolean;
  simulationSpeed: number;

  // Live 3D Weapons & Fire Support Strikes
  activeStrikes: ActiveStrikeEntity[];

  // Actions
  setGameScreen: (screen: GameScreen) => void;
  setSimulationSpeed: (speed: number) => void;
  advanceSimulationTime: (minutes: number) => void;
  setWarRoomLighting: (lighting: WarRoomLighting) => void;
  toggleFilmGrain: () => void;
  toggleSatelliteView: () => void;
  openFullscreenCinema: (videoUrl?: string) => void;
  closeFullscreenCinema: () => void;
  setSatelliteViewMode: (mode: SatelliteViewMode) => void;
  startCampaign: () => void;
  startNewspaperBriefing: () => void;
  enterCommandCenter: () => void;
  selectLocation: (locationId: string) => void;
  cycleNextSector: () => void;
  cyclePrevSector: () => void;
  selectUnit: (unitId: string) => void;
  resetCameraToOverview: () => void;
  toggleMapLayer: (layer: keyof MapLayerVisibility) => void;

  // Live Strike Actions
  launchLiveStrike: (strikeType: LiveStrikeType, targetSectorId: string) => void;
  removeStrike: (strikeId: string) => void;

  // Story Dilemma & Medals Actions
  triggerDilemma: (dilemma: StoryDilemma) => void;
  resolveDilemma: (option: StoryDilemmaOption) => void;
  openMedals: () => void;
  closeMedals: () => void;

  // Modals & Panels
  openRadio: () => void;
  closeRadio: () => void;
  setActiveRadioChannel: (channel: 'COMMAND' | 'FIELD' | 'INTELLIGENCE' | 'LOGISTICS' | 'AIR') => void;
  respondToRadioOption: (messageId: string, option: any) => void;

  openUnitCommand: () => void;
  closeUnitCommand: () => void;
  dispatchUnitMarch: (unitId: string, targetLocId: string, plan: UnitMarchOrder) => void;

  openReconModal: () => void;
  closeReconModal: () => void;
  dispatchReconMission: (targetSectorId: string, reconType: 'AIR_RECON' | 'ARMORED_SCOUT' | 'INFANTRY_PATROL') => void;

  openDecisionModal: () => void;
  closeDecisionModal: () => void;
  executeDecision: (orderType: DecisionType) => Promise<void>;
  closeConsequence: () => void;

  openJournal: () => void;
  closeJournal: () => void;

  nextChapter: () => void;
  finishCampaignAndAAR: () => void;
  restartGame: () => void;
  toggleSound: () => void;
}

import { create } from 'zustand';

export const useGameStore = create<GameStoreState>((set, get) => ({
  gameScreen: 'MENU',
  currentChapterIndex: 0,
  currentChapter: CAMPAIGN_CHAPTERS[0],

  cameraMode: 'TITLE_DRIFT',
  cameraFocusTarget: [0, 0, 0],
  selectedLocationId: 'srinagar',
  selectedUnitId: 'unit-4-kumaon',

  warState: CAMPAIGN_CHAPTERS[0].initialState,
  locations: INITIAL_LOCATIONS,
  supplyRoutes: INITIAL_ROUTES,
  units: INITIAL_UNITS,
  enemyContacts: INITIAL_ENEMY_CONTACTS,
  enemyAI: {
    aggression: 70,
    targetSectorId: 'baramulla',
    focusAxis: 'NORTH_VALLEY',
    awarenessLevel: 'ALERT',
    lastMoveMinutesAgo: 5,
    recentPlayerActions: []
  },
  officers: INITIAL_OFFICERS,

  mapLayers: {
    terrain: true,
    frontline: true,
    forces: true,
    enemyIntel: true,
    supplyRoutes: true,
    recon: true,
    threatZones: true,
    weather: true
  },

  warRoomLighting: 'WARM_LANTERN',
  isFilmGrainEnabled: true,
  isSatelliteView: false,
      isFullscreenCinemaOpen: false,
      activeCinemaVideoUrl: undefined,
  satelliteViewMode: 'STANDARD',

  isRadioOpen: false,
  activeRadioChannel: 'COMMAND',
  radioMessages: CAMPAIGN_CHAPTERS[0].initialRadioMessages,

  battlefieldEvents: [
    {
      id: 'evt-init',
      time: '07:30',
      type: 'OFFICER_DISPATCH',
      title: 'Operational Command Assumed',
      description: 'Brigadier Mohammad Usman has assumed operational control of Kashmir Theatre from Srinagar HQ.',
      severity: 'INFO',
      timestamp: '07:30:00',
      resolved: true
    }
  ],

  isUnitCommandOpen: false,
  isReconModalOpen: false,
  isDecisionModalOpen: false,
  isConsequenceOpen: false,
  lastDecisionRecord: null,
  decisionHistory: [],
  activeDilemma: null,
  unlockedMedals: [],
  isMedalsOpen: false,
  isJournalOpen: false,
  afterActionReport: null,
  isSoundMuted: false,
  simulationSpeed: 1,
  activeStrikes: [],

  setGameScreen: (screen) => set({ gameScreen: screen }),

  setSimulationSpeed: (speed: number) => {
    soundEngine.playPinClick();
    set({ simulationSpeed: speed });
  },

  advanceSimulationTime: (minutes: number) => {
    soundEngine.playStampThud();
    const { warState } = get();
    const timeAdv = advanceCampaignTime(warState.date, warState.time, minutes);
    set({
      warState: {
        ...warState,
        time: timeAdv.newTime
      }
    });
  },

  setWarRoomLighting: (lighting) => {
    soundEngine.playPinClick();
    set({ warRoomLighting: lighting });
  },

  toggleFilmGrain: () => {
    soundEngine.playPinClick();
    set((s) => ({ isFilmGrainEnabled: !s.isFilmGrainEnabled }));
  },

  toggleSatelliteView: () => {
    soundEngine.playRadioStatic();
    set((s) => ({ isSatelliteView: !s.isSatelliteView }));
  },

  setSatelliteViewMode: (mode: SatelliteViewMode) => {
    soundEngine.playPinClick();
    set({ satelliteViewMode: mode });
  },

  startCampaign: () => {
    soundEngine.playPaperFlip();
    const ch = CAMPAIGN_CHAPTERS[0];
    set({
      gameScreen: 'NEWSPAPER',
      currentChapterIndex: 0,
      currentChapter: ch,
      warState: ch.initialState,
      radioMessages: ch.initialRadioMessages,
      cameraMode: 'OVERVIEW',
      cameraFocusTarget: [0, 0, 0]
    });
  },

  startNewspaperBriefing: () => {
    soundEngine.playPaperFlip();
    set({ gameScreen: 'NEWSPAPER' });
  },

  enterCommandCenter: () => {
    soundEngine.playStampThud();
    const initialLoc = get().locations.find(l => l.id === 'srinagar');
    set({
      gameScreen: 'CUTSCENE',
      cameraMode: 'OVERVIEW',
      cameraFocusTarget: initialLoc ? initialLoc.gridPosition : [0, 0, 0],
      selectedLocationId: 'srinagar'
    });
  },

  selectLocation: (locationId: string) => {
    soundEngine.playPinClick();
    const loc = get().locations.find(l => l.id === locationId);
    if (!loc) return;
    set({
      selectedLocationId: locationId,
      cameraMode: 'SECTOR_FOCUS',
      cameraFocusTarget: loc.gridPosition
    });
  },

  cycleNextSector: () => {
    const { locations, selectedLocationId } = get();
    const currentIndex = locations.findIndex(l => l.id === selectedLocationId);
    const nextIndex = (currentIndex + 1) % locations.length;
    get().selectLocation(locations[nextIndex].id);
  },

  cyclePrevSector: () => {
    const { locations, selectedLocationId } = get();
    const currentIndex = locations.findIndex(l => l.id === selectedLocationId);
    const prevIndex = (currentIndex - 1 + locations.length) % locations.length;
    get().selectLocation(locations[prevIndex].id);
  },

  selectUnit: (unitId: string) => {
    soundEngine.playPinClick();
    const u = get().units.find(unit => unit.id === unitId);
    if (!u) return;
    set({
      selectedUnitId: unitId,
      selectedLocationId: u.locationId,
      isUnitCommandOpen: true
    });
  },

  resetCameraToOverview: () => {
    soundEngine.playPinClick();
    set({
      cameraMode: 'OVERVIEW',
      cameraFocusTarget: [0, 0, 0]
    });
  },

  toggleMapLayer: (layer) => {
    soundEngine.playPinClick();
    set((s) => ({
      mapLayers: {
        ...s.mapLayers,
        [layer]: !s.mapLayers[layer]
      }
    }));
  },

  launchLiveStrike: (strikeType: LiveStrikeType, targetSectorId: string) => {
    const { locations, warState, activeStrikes, battlefieldEvents, radioMessages } = get();
    const loc = locations.find(l => l.id === targetSectorId) || locations[0];
    const targetPos: [number, number, number] = [loc.gridPosition[0], loc.gridPosition[1], loc.gridPosition[2]];

    // Determine flight origin and duration based on weapon type
    let originPos: [number, number, number];
    let duration = 3.5;

    if (strikeType === 'TEMPEST_AIR_STRIKE') {
      originPos = [targetPos[0] - 6, 3.8, targetPos[2] + 5];
      duration = 4.2;
    } else if (strikeType === 'DAKOTA_SUPPLY_DROP') {
      originPos = [targetPos[0] + 6, 4.0, targetPos[2] - 4];
      duration = 5.0;
    } else if (strikeType === 'ROCKET_SALVO') {
      originPos = [targetPos[0] + 4.5, 0.4, targetPos[2] + 3.5];
      duration = 3.2;
    } else {
      originPos = [targetPos[0] + 3.8, 0.4, targetPos[2] + 3.0];
      duration = 3.0;
    }

    const newStrike: ActiveStrikeEntity = {
      id: `strike-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type: strikeType,
      origin: originPos,
      target: targetPos,
      targetSectorId: loc.id,
      targetSectorName: loc.name,
      startTime: Date.now(),
      duration,
      hasDetonated: false,
      damagePercent: strikeType === 'TEMPEST_AIR_STRIKE' ? 45 : strikeType === 'ROCKET_SALVO' ? 35 : 25
    };

    // Calculate simulation impact
    let newPressure = warState.enemyPressure;
    let newSupplies = warState.supplies;
    let newMorale = warState.morale;

    if (strikeType === 'DAKOTA_SUPPLY_DROP') {
      newSupplies = Math.min(100, warState.supplies + 25);
      newMorale = Math.min(100, warState.morale + 15);
    } else if (strikeType === 'TEMPEST_AIR_STRIKE') {
      newPressure = Math.max(10, warState.enemyPressure - 30);
    } else if (strikeType === 'ROCKET_SALVO') {
      newPressure = Math.max(10, warState.enemyPressure - 25);
    } else if (strikeType === 'ARTILLERY_BARRAGE') {
      newPressure = Math.max(10, warState.enemyPressure - 20);
    } else if (strikeType === 'SMOKE_SCREEN') {
      newPressure = Math.max(10, warState.enemyPressure - 15);
    }

    const updatedWarState: WarState = {
      ...warState,
      enemyPressure: newPressure,
      supplies: newSupplies,
      morale: newMorale
    };

    // Update target location defense / threat
    const updatedLocations = locations.map(l => {
      if (l.id === loc.id) {
        if (strikeType === 'DAKOTA_SUPPLY_DROP' || strikeType === 'SMOKE_SCREEN') {
          return { ...l, currentDefense: Math.min(100, l.currentDefense + 15) };
        } else {
          return {
            ...l,
            currentDefense: Math.min(100, l.currentDefense + 10),
            status: l.status === 'CRITICAL' ? ('CONTESTED' as const) : l.status === 'CONTESTED' ? ('SECURED' as const) : l.status
          };
        }
      }
      return l;
    });

    // Create tactical event and radio announcement
    const wpnInfo = FIRE_SUPPORT_ARSENAL.find(w => w.id === strikeType);
    const strikeEvent: BattlefieldEvent = {
      id: `evt-strike-${Date.now()}`,
      time: warState.time.substring(0, 5),
      type: 'FIRE_SUPPORT',
      title: `${wpnInfo?.name || strikeType} Inbound on ${loc.name}`,
      description: `Live fire mission executing over ${loc.name}. ${wpnInfo?.effectDescription || 'Saturating hostile positions.'}`,
      locationId: loc.id,
      severity: strikeType === 'DAKOTA_SUPPLY_DROP' ? 'INFO' : 'CRITICAL',
      timestamp: warState.time,
      resolved: true
    };

    const strikeRadio: RadioMessage = {
      id: `rad-strike-${Date.now()}`,
      channel: strikeType === 'TEMPEST_AIR_STRIKE' || strikeType === 'DAKOTA_SUPPLY_DROP' ? 'AIR' : 'FIELD',
      timestamp: warState.time.substring(0, 5),
      senderName: wpnInfo?.callsign || 'FIRE-SUPPORT',
      senderRank: 'Combat Support Element',
      callsign: wpnInfo?.callsign || 'BATTERY-1',
      text: `SPLASH TARGET! ${wpnInfo?.name || strikeType} delivered on grid coordinates ${loc.name.toUpperCase()}. Enemy positions suppressed!`,
      urgent: false,
      isRead: false
    };

    set({
      activeStrikes: [...activeStrikes, newStrike],
      warState: updatedWarState,
      locations: updatedLocations,
      battlefieldEvents: [strikeEvent, ...battlefieldEvents],
      radioMessages: [strikeRadio, ...radioMessages]
    });
  },

  removeStrike: (strikeId: string) => {
    set(s => ({
      activeStrikes: s.activeStrikes.filter(st => st.id !== strikeId)
    }));
  },

  openRadio: () => {
    soundEngine.playRadioStatic();
    set((s) => ({
      isRadioOpen: true,
      radioMessages: s.radioMessages.map(m => ({ ...m, isRead: true }))
    }));
  },

  closeRadio: () => {
    soundEngine.playPinClick();
    set({ isRadioOpen: false });
  },

  setActiveRadioChannel: (channel) => {
    soundEngine.playPinClick();
    set({ activeRadioChannel: channel });
  },

  respondToRadioOption: (messageId: string, option: any) => {
    soundEngine.playStampThud();
    set((s) => ({
      radioMessages: s.radioMessages.map(m =>
        m.id === messageId ? { ...m, options: undefined } : m
      )
    }));

    if (option.actionType === 'RECON') {
      get().openReconModal();
    } else if (option.actionType === 'REINFORCE_SECTOR' || option.actionType === 'DEPLOY') {
      get().openUnitCommand();
    } else {
      get().executeDecision(option.actionType);
    }
  },

  openUnitCommand: () => {
    soundEngine.playPaperFlip();
    set({ isUnitCommandOpen: true });
  },

  closeUnitCommand: () => {
    soundEngine.playPinClick();
    set({ isUnitCommandOpen: false });
  },

  // PHYSICAL 3D TROOP DEPLOYMENT & MARCH
  dispatchUnitMarch: (unitId: string, targetLocId: string, plan: UnitMarchOrder) => {
    soundEngine.playStampThud();
    soundEngine.playRadioStatic();

    const { units, locations, warState, enemyAI, supplyRoutes } = get();
    const unit = units.find(u => u.id === unitId);
    const targetLoc = locations.find(l => l.id === targetLocId);
    if (!unit || !targetLoc) return;

    // 1. Advance campaign time by transit duration
    const timeAdv = advanceCampaignTime(warState.date, warState.time, plan.etaMinutes);
    const updatedWarState: WarState = {
      ...warState,
      time: timeAdv.newTime,
      supplies: Math.max(5, warState.supplies - plan.supplyCost)
    };

    // 2. Put unit in MOVING state with active march order
    const updatedUnits = units.map(u => {
      if (u.id === unitId) {
        return {
          ...u,
          state: 'MOVING' as const,
          locationId: targetLocId,
          supply: Math.max(10, u.supply - plan.supplyCost),
          fatigue: Math.min(100, u.fatigue + plan.fatigueCost),
          ordersDescription: `Redeploying to ${targetLoc.name} (ETA ${plan.etaMinutes}m)`,
          currentMarch: {
            ...plan,
            progress: 0.35, // immediately show progress along spline
            remainingMinutes: Math.round(plan.etaMinutes * 0.65)
          }
        };
      }
      return u;
    });

    // 3. Enemy reacts to troop movement
    const enemyReaction = evaluateEnemyReaction(
      locations,
      supplyRoutes,
      enemyAI,
      updatedWarState,
      `Player deployed ${unit.name} to ${targetLoc.name}`
    );

    // 4. Boost sector defense upon arrival planning
    const updatedLocations = enemyReaction.updatedLocations.map(l => {
      if (l.id === targetLocId) {
        return {
          ...l,
          currentDefense: Math.min(100, l.currentDefense + 15),
          garrison: {
            ...l.garrison,
            personnel: l.garrison.personnel + unit.currentPersonnel
          }
        };
      }
      return l;
    });

    // 5. New event & radio
    const marchEvent: BattlefieldEvent = {
      id: `evt-march-${Date.now()}`,
      time: timeAdv.formattedTime,
      type: 'UNIT_ARRIVED',
      title: `${unit.designation} Marched to ${targetLoc.name}`,
      description: `${unit.name} completed high-altitude road transit. Sector defense reinforced to ${targetLoc.currentDefense + 15}%.`,
      locationId: targetLocId,
      severity: 'INFO',
      timestamp: timeAdv.newTime,
      resolved: false
    };

    const marchRadio: RadioMessage = {
      id: `rad-march-${Date.now()}`,
      channel: 'FIELD',
      timestamp: timeAdv.formattedTime.substring(0, 5),
      senderName: unit.commander,
      senderRank: 'Regimental Officer',
      callsign: unit.designation,
      text: `Sir, ${unit.designation} has completed the mountain march and established forward defensive sangars at ${targetLoc.name}. Sector secure.`,
      urgent: false,
      isRead: false
    };

    set({
      isUnitCommandOpen: false,
      units: updatedUnits,
      warState: updatedWarState,
      locations: updatedLocations,
      supplyRoutes: enemyReaction.updatedRoutes,
      enemyAI: enemyReaction.updatedEnemyState,
      battlefieldEvents: [marchEvent, ...enemyReaction.newEvents, ...get().battlefieldEvents],
      radioMessages: [marchRadio, ...enemyReaction.newRadioMessages, ...get().radioMessages]
    });

    // Scale march arrival transition based on simulation speed
    const marchDelay = Math.max(300, 1600 / get().simulationSpeed);
    setTimeout(() => {
      set((s) => ({
        units: s.units.map(u => {
          if (u.id === unitId) {
            return {
              ...u,
              state: 'DEFENDING',
              currentMarch: undefined,
              position3D: targetLoc.gridPosition
            };
          }
          return u;
        })
      }));
    }, marchDelay);
  },

  openReconModal: () => {
    soundEngine.playPaperFlip();
    set({ isReconModalOpen: true });
  },

  closeReconModal: () => {
    soundEngine.playPinClick();
    set({ isReconModalOpen: false });
  },

  dispatchReconMission: (targetSectorId: string, reconType: 'AIR_RECON' | 'ARMORED_SCOUT' | 'INFANTRY_PATROL') => {
    soundEngine.playDakotaDrone();
    soundEngine.playRadioStatic();

    const { locations, enemyContacts, warState } = get();
    const loc = locations.find(l => l.id === targetSectorId) || locations[0];

    const reconResult = executeReconMission(loc, enemyContacts, warState, reconType);
    const timeAdv = advanceCampaignTime(warState.date, warState.time, reconType === 'AIR_RECON' ? 12 : 20);

    set((s) => ({
      isReconModalOpen: false,
      enemyContacts: reconResult.updatedContacts,
      warState: { ...s.warState, time: timeAdv.newTime },
      battlefieldEvents: [...reconResult.newEvents, ...s.battlefieldEvents],
      radioMessages: [...reconResult.newRadioMessages, ...s.radioMessages]
    }));
  },

  openDecisionModal: () => {
    soundEngine.playPaperFlip();
    set({ isDecisionModalOpen: true });
  },

  closeDecisionModal: () => {
    soundEngine.playPinClick();
    set({ isDecisionModalOpen: false });
  },

  executeDecision: async (orderType: DecisionType) => {
    soundEngine.playStampThud();
    soundEngine.playRadioStatic();

    const { selectedLocationId, locations, supplyRoutes, units, warState, enemyAI, officers, decisionHistory, simulationSpeed } = get();
    const loc = locations.find(l => l.id === selectedLocationId) || locations[0];

    // 1. Focus camera on combat area
    set({
      isDecisionModalOpen: false,
      cameraMode: 'BATTLE_FOCUS',
      cameraFocusTarget: loc.gridPosition
    });

    setTimeout(() => soundEngine.playArtilleryRumble(), Math.max(50, 200 / simulationSpeed));

    // 2. Resolve combat order
    const battleResult = resolveCombatOrder(selectedLocationId, orderType, locations, supplyRoutes, units, warState, enemyAI);

    // 3. Enemy AI reacts
    const enemyReaction = evaluateEnemyReaction(
      battleResult.updatedLocations,
      battleResult.updatedRoutes,
      enemyAI,
      battleResult.newWarState,
      `Player issued ${orderType} at ${loc.name}`
    );

    // 4. Update officer relationships
    const updatedOfficers = updateOfficerRelationship(
      officers,
      'usman',
      orderType === 'COUNTERATTACK' ? 'VICTORY' : orderType === 'HOLD' ? 'TACTICAL_SUCCESS' : 'RETREAT',
      `${orderType} executed at ${loc.name}`
    );

    const resolveDelay = Math.max(100, 450 / simulationSpeed);
    await new Promise(res => setTimeout(res, resolveDelay));

    set({
      warState: battleResult.newWarState,
      locations: enemyReaction.updatedLocations,
      supplyRoutes: enemyReaction.updatedRoutes,
      units: battleResult.updatedUnits,
      enemyAI: enemyReaction.updatedEnemyState,
      officers: updatedOfficers,
      lastDecisionRecord: battleResult.newDecisionRecord,
      decisionHistory: [battleResult.newDecisionRecord, ...decisionHistory],
      battlefieldEvents: [...battleResult.newEvents, ...enemyReaction.newEvents, ...get().battlefieldEvents],
      radioMessages: [...battleResult.newRadioMessages, ...enemyReaction.newRadioMessages, ...get().radioMessages],
      isConsequenceOpen: true
    });
  },

  closeConsequence: () => {
    soundEngine.playPaperFlip();
    const { decisionHistory, currentChapterIndex, activeDilemma } = get();
    const currentChNum = currentChapterIndex + 1;

    // Check if we should trigger a dynamic mid-chapter story dilemma
    const relevantDilemma = CAMPAIGN_DILEMMAS.find(d => d.chapterNumber === currentChNum);
    const hasTriggeredDilemmaThisChapter = decisionHistory.some(d => d.title.includes('Directive:'));

    if (relevantDilemma && !activeDilemma && decisionHistory.length % 2 === 1 && !hasTriggeredDilemmaThisChapter) {
      set({
        isConsequenceOpen: false,
        activeDilemma: relevantDilemma,
        cameraMode: 'OVERVIEW',
        cameraFocusTarget: [0, 0, 0]
      });
      return;
    }

    // If 2+ decisions issued in this chapter, offer next chapter or AAR
    if (decisionHistory.length >= currentChNum * 2) {
      if (currentChapterIndex < CAMPAIGN_CHAPTERS.length - 1) {
        get().nextChapter();
      } else {
        get().finishCampaignAndAAR();
      }
    } else {
      set({
        isConsequenceOpen: false,
        cameraMode: 'OVERVIEW',
        cameraFocusTarget: [0, 0, 0]
      });
    }
  },

  triggerDilemma: (dilemma: StoryDilemma) => {
    soundEngine.playRadioStatic();
    set({ activeDilemma: dilemma });
  },

  resolveDilemma: (option: StoryDilemmaOption) => {
    const { warState, unlockedMedals, currentChapter, battlefieldEvents, radioMessages } = get();
    soundEngine.playStampThud();

    // 1. Calculate new state deltas
    const updatedWarState: WarState = {
      ...warState,
      morale: Math.min(100, Math.max(10, warState.morale + option.statEffects.moraleDelta)),
      supplies: Math.min(100, Math.max(10, warState.supplies + option.statEffects.suppliesDelta)),
      personnel: Math.max(500, warState.personnel + option.statEffects.personnelDelta),
      enemyPressure: Math.min(100, Math.max(10, warState.enemyPressure + option.statEffects.pressureDelta))
    };

    // 2. Check for Gallantry Medal Award
    let newMedals = [...unlockedMedals];
    if (option.medalUnlock) {
      soundEngine.playFanfare();
      const medalCitation: MedalAward = {
        id: `medal-${Date.now()}`,
        medalType: option.medalUnlock,
        recipient: option.medalUnlock === 'PVC' ? 'Major Somnath Sharma / Naik Jadunath Singh' : '50th Parachute Brigade Vanguard',
        regiment: 'Indian Army & Air Force',
        actionTitle: option.label,
        citationText: option.narrativeOutcome,
        dateAwarded: warState.date,
        icon: option.medalUnlock === 'PVC' ? 'PVC' : option.medalUnlock === 'MVC' ? 'MVC' : 'VrC',
        ribbonColor: '#c09a5b'
      };
      newMedals = [medalCitation, ...newMedals];
    }

    // 3. New event and radio transmission
    const dilemmaEvent: BattlefieldEvent = {
      id: `evt-dilemma-${Date.now()}`,
      time: warState.time.substring(0, 5),
      type: 'TACTICAL_DILEMMA',
      title: `Directive: ${option.label}`,
      description: option.narrativeOutcome,
      severity: option.medalUnlock === 'PVC' ? 'CRITICAL' : 'INFO',
      timestamp: warState.time,
      resolved: true
    };

    const dilemmaRadio: RadioMessage = {
      id: `rad-dilemma-${Date.now()}`,
      channel: 'COMMAND',
      timestamp: warState.time.substring(0, 5),
      senderName: 'BRIGADIER MOHAMMAD USMAN',
      senderRank: 'Brigadier (MVC)',
      callsign: 'TIGER-6',
      text: `Command Directive Confirmed: ${option.narrativeOutcome}`,
      urgent: false,
      isRead: false
    };

    set({
      activeDilemma: null,
      warState: updatedWarState,
      unlockedMedals: newMedals,
      battlefieldEvents: [dilemmaEvent, ...battlefieldEvents],
      radioMessages: [dilemmaRadio, ...radioMessages]
    });
  },

  openMedals: () => {
    soundEngine.playPaperFlip();
    set({ isMedalsOpen: true });
  },

  closeMedals: () => {
    soundEngine.playPinClick();
    set({ isMedalsOpen: false });
  },

  openJournal: () => {
    soundEngine.playPaperFlip();
    set({ isJournalOpen: true });
  },

  closeJournal: () => {
    soundEngine.playPinClick();
    set({ isJournalOpen: false });
  },

  nextChapter: () => {
    const nextIdx = get().currentChapterIndex + 1;
    if (nextIdx >= CAMPAIGN_CHAPTERS.length) {
      get().finishCampaignAndAAR();
      return;
    }

    const nextChapterData = CAMPAIGN_CHAPTERS[nextIdx];
    soundEngine.playStampThud();

    set({
      isConsequenceOpen: false,
      currentChapterIndex: nextIdx,
      currentChapter: nextChapterData,
      warState: nextChapterData.initialState,
      radioMessages: [...nextChapterData.initialRadioMessages, ...get().radioMessages],
      selectedLocationId: nextChapterData.hotspotSectorId,
      gameScreen: 'NEWSPAPER',
      cameraMode: 'OVERVIEW',
      cameraFocusTarget: [0, 0, 0]
    });
  },

  finishCampaignAndAAR: () => {
    soundEngine.playStampThud();
    const { warState, locations, decisionHistory, unlockedMedals } = get();
    const aar = computeAfterActionReport(warState, locations, decisionHistory);
    aar.medalsAwarded = unlockedMedals;

    set({
      isConsequenceOpen: false,
      afterActionReport: aar,
      gameScreen: 'ENDING',
      cameraMode: 'OVERVIEW',
      cameraFocusTarget: [0, 0, 0]
    });
  },

  restartGame: () => {
    soundEngine.playPaperFlip();
    const ch = CAMPAIGN_CHAPTERS[0];
    set({
      gameScreen: 'MENU',
      currentChapterIndex: 0,
      currentChapter: ch,
      warState: ch.initialState,
      locations: INITIAL_LOCATIONS,
      supplyRoutes: INITIAL_ROUTES,
      units: INITIAL_UNITS,
      enemyContacts: INITIAL_ENEMY_CONTACTS,
      officers: INITIAL_OFFICERS,
      radioMessages: ch.initialRadioMessages,
      decisionHistory: [],
      battlefieldEvents: [],
      unlockedMedals: [],
      activeDilemma: null,
      afterActionReport: null,
      isConsequenceOpen: false,
      isRadioOpen: false,
      isUnitCommandOpen: false,
      isReconModalOpen: false,
      isJournalOpen: false,
      selectedLocationId: 'srinagar',
      selectedUnitId: 'unit-4-kumaon',
      cameraMode: 'TITLE_DRIFT',
      cameraFocusTarget: [0, 0, 0]
    });
  },

  toggleSound: () => {
    const newMuted = !get().isSoundMuted;
    soundEngine.setMuted(newMuted);
    set({ isSoundMuted: newMuted });
  },

  openFullscreenCinema: (videoUrl?: string) => set({ isFullscreenCinemaOpen: true, activeCinemaVideoUrl: videoUrl }),
  closeFullscreenCinema: () => set({ isFullscreenCinemaOpen: false, activeCinemaVideoUrl: undefined })
}));
