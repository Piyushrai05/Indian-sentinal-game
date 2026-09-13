export type ControlStatus = 'FRIENDLY' | 'CONTESTED' | 'BESIEGED' | 'HOSTILE';
export type SectorStatus = 'SECURED' | 'CONTESTED' | 'CRITICAL' | 'UNKNOWN' | 'THREATENED' | 'FRONTLINE' | 'HEAVY ENGAGEMENT' | 'UNDER SIEGE' | 'ISOLATED HIGH PLAIN' | 'REAR BASE';

export type UnitState =
  | 'READY'
  | 'MOVING'
  | 'DEPLOYING'
  | 'DEFENDING'
  | 'ATTACKING'
  | 'RETREATING'
  | 'RECON'
  | 'SUPPORTING'
  | 'LOW_SUPPLY'
  | 'EXHAUSTED'
  | 'CUT_OFF'
  | 'DESTROYED';

export interface LocationData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  elevation: string;
  heightValue: number;
  gridPosition: [number, number, number];
  region: string;
  strategicImportance: number; // 1 to 5
  control: ControlStatus;
  status: SectorStatus;
  importanceDescription: string;
  historicalNote: string;
  baseDefense: number; // 0 - 100
  currentDefense: number; // 0 - 100
  garrison: {
    personnel: number;
    suppliesPercent: number;
    moralePercent: number;
    enemyPressurePercent: number;
    commander?: string;
    regimentName: string;
  };
  connectedRouteIds: string[];
}

export type RouteStatus = 'ACTIVE' | 'THREATENED' | 'SEVERED' | 'SEASONAL';

export interface SupplyRouteData {
  id: string;
  name: string;
  fromId: string;
  toId: string;
  status: RouteStatus;
  threatLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' | 'EXTREME';
  vitalFor: string;
  pathWaypoints: [number, number, number][];
}

export interface UnitMarchOrder {
  id: string;
  unitId: string;
  fromLocationId: string;
  targetLocationId: string;
  routeWaypoints: [number, number, number][];
  totalDistance: number;
  progress: number; // 0.0 to 1.0
  speed: number; // progress per minute
  etaMinutes: number;
  remainingMinutes: number;
  supplyCost: number;
  fatigueCost: number;
  startTime: string;
  objectiveType: 'REINFORCE' | 'DEFEND' | 'ATTACK' | 'WITHDRAW' | 'RECON' | 'SUPPLY_ESCORT';
}

export interface UnitData {
  id: string;
  name: string;
  designation: string;
  commander: string;
  locationId: string;
  state: UnitState;
  strength: number; // percentage (0 - 100)
  maxPersonnel: number;
  currentPersonnel: number;
  morale: number; // percentage (0 - 100)
  ammo: number; // percentage (0 - 100)
  supply: number; // percentage (0 - 100)
  fatigue: number; // percentage (0 - 100)
  unitType: 'INFANTRY' | 'PARATROOP' | 'ARMORED_CAR' | 'ARTILLERY' | 'SAPPERS' | 'GARRISON' | 'AIR_WING';
  position3D: [number, number, number];
  currentMarch?: UnitMarchOrder;
  ordersDescription?: string;
}

export interface EnemyIntelContact {
  id: string;
  locationId: string;
  locationName: string;
  estimatedStrengthMin: number;
  estimatedStrengthMax: number;
  confidencePercent: number; // 0 - 100
  contactStatus: 'UNKNOWN' | 'SUSPECTED' | 'PROBABLE' | 'CONFIRMED';
  threatLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME';
  lastReportedMinutesAgo: number;
  position3D: [number, number, number];
  activityNote: string;
}

export interface EnemyAIState {
  aggression: number; // 0 - 100
  targetSectorId: string;
  focusAxis: 'NORTH_VALLEY' | 'SOUTHERN_CORRIDOR' | 'POONCH_SIEGE' | 'LADAKH_PASSES';
  awarenessLevel: 'LOW' | 'ALERT' | 'AGGRESSIVE_STAGING';
  lastMoveMinutesAgo: number;
  recentPlayerActions: string[];
}

export interface WarState {
  date: string;
  time: string;
  campaignDay: number;
  personnel: number;
  supplies: number; // 0 - 100
  morale: number; // 0 - 100
  enemyPressure: number; // 0 - 100
  weather: 'CLEAR' | 'FOG_OVERCAST' | 'MOUNTAIN_BLIZZARD' | 'COLD_RAIN';
  weatherDescription: string;
  visibilityPercent: number; // 0 - 100
}

export type RadioChannel = 'COMMAND' | 'FIELD' | 'INTELLIGENCE' | 'LOGISTICS' | 'AIR';

export interface RadioMessage {
  id: string;
  channel: RadioChannel;
  timestamp: string;
  senderName: string;
  senderRank: string;
  callsign: string;
  text: string;
  urgent: boolean;
  options?: {
    id: string;
    label: string;
    actionType: string;
    actionPayload?: any;
  }[];
  isRead: boolean;
}

export interface BattlefieldEvent {
  id: string;
  time: string;
  type:
    | 'CONTACT_DETECTED'
    | 'SUPPLY_INTERRUPTED'
    | 'WEATHER_SHIFT'
    | 'ENEMY_ATTACK'
    | 'RECON_COMPLETE'
    | 'UNIT_ARRIVED'
    | 'CASUALTY_ALERT'
    | 'OFFICER_DISPATCH'
    | 'TACTICAL_DILEMMA'
    | 'FIRE_SUPPORT';
  title: string;
  description: string;
  locationId?: string;
  severity: 'INFO' | 'WARN' | 'CRITICAL';
  timestamp: string;
  resolved: boolean;
}

export interface NPCMemory {
  id: string;
  name: string;
  rank: string;
  role: string;
  trust: number; // 0 - 100
  respect: number; // 0 - 100
  confidence: number; // 0 - 100
  successfulOperations: number;
  failedOperations: number;
  memoryLog: string[];
  lastInteractionScene?: string;
}

export interface MapLayerVisibility {
  terrain: boolean;
  frontline: boolean;
  forces: boolean;
  enemyIntel: boolean;
  supplyRoutes: boolean;
  recon: boolean;
  threatZones: boolean;
  weather: boolean;
}

export interface CampaignChapter {
  id: string;
  chapterNumber: number;
  title: string;
  subtitle: string;
  date: string;
  historicalContext: string;
  objective: string;
  constraint: string;
  initialState: WarState;
  hotspotSectorId: string;
  initialRadioMessages: RadioMessage[];
}

export type DecisionType = 'HOLD' | 'FALL_BACK' | 'COUNTERATTACK' | 'AIRLIFT_SUPPLIES' | 'RECON_SWEEP' | 'REINFORCE_SECTOR';

export interface DecisionRecord {
  id: string;
  date: string;
  time: string;
  locationId: string;
  locationName: string;
  orderType: DecisionType;
  title: string;
  rationale: string;
  immediateEffects: {
    defenseDelta: number;
    moraleDelta: number;
    suppliesDelta: number;
    personnelDelta: number;
  };
  delayedEffects: {
    enemyAwarenessDelta: number;
    routeThreatTarget?: string;
    narrativeForecast: string;
  };
  fieldReportSummary: string;
}

export type CampaignEnding = 'STRATEGIC_SUCCESS' | 'HARD_FOUGHT_HOLD' | 'ORDERLY_WITHDRAWAL' | 'FRONTLINE_COLLAPSE';

export interface MedalAward {
  id: string;
  medalType: 'PVC' | 'MVC' | 'VrC' | 'MENTION_IN_DISPATCHES';
  recipient: string;
  regiment: string;
  actionTitle: string;
  citationText: string;
  dateAwarded: string;
  icon: string;
  ribbonColor: string;
}

export interface AfterActionReportData {
  ending: CampaignEnding;
  title: string;
  subtitle: string;
  legacyReport: string;
  strategicDecisionsCount: number;
  successfulOpsCount: number;
  failedOpsCount: number;
  territoryControlPercent: number;
  finalMorale: number;
  finalSupplies: number;
  commandReputation: number;
  criticalDecisionsAnalysis: {
    title: string;
    impact: string;
    cost: string;
  }[];
  medalsAwarded: MedalAward[];
}

export type WarRoomLighting = 'WARM_LANTERN' | 'DAWN_MIST' | 'COLD_BLIZZARD';

export type SatelliteViewMode = 'STANDARD' | 'OPTICAL' | 'THERMAL' | 'TOPOGRAPHIC' | 'STARLIGHT_NVG';

export type GameScreen = 'MENU' | 'NEWSPAPER' | 'CHAPTER_INTRO' | 'CUTSCENE' | 'COMMAND' | 'DECISION' | 'CONSEQUENCE' | 'ENDING';
