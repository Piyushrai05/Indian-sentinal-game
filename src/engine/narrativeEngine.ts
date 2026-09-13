import { LocationData, WarState, DecisionType } from '../types/game';

export interface FieldDispatch {
  timestamp: string;
  sender: string;
  callsign: string;
  subject: string;
  body: string;
  classification: string;
}

export function generateHistoricalDispatch(
  location: LocationData,
  orderType: DecisionType,
  warState: WarState
): FieldDispatch {
  const time = warState.time.substring(0, 5);
  const date = warState.date;

  const templates: Record<DecisionType, { subject: string; body: string }> = {
    COUNTERATTACK: {
      subject: `FLASH // SITREP FROM ${location.name} SECTOR COMMAND`,
      body: `1. AT ${time} HRS, 50TH PARACHUTE BRIGADE LAUNCHED OFFENSIVE SORTIE ON FORWARD RIDGES.
2. ENEMY 3.7-INCH MORTAR POCKETS NEUTRALIZED BY 25-POUNDER ARTILLERY BARRAGE.
3. CASUALTIES EVACUATED TO REGIMENTAL AID POST. ADVANCE SANGARS OCCUPIED.
4. MORALE AT ${location.name} IS HIGH. ENEMY WITHDRAWING IN DISORDER TOWARDS RIVER GORGE.`
    },
    HOLD: {
      subject: `PRIORITY // DEFENSIVE SITUATION AT ${location.name}`,
      body: `1. ENTRENCHED POSITIONS FIRMLY HELD. INTERLOCKING MMG FIRE ARRESTED ENEMY PROBING COLS.
2. AMMUNITION EXPENDITURE CONTROLLED. RATIONS AT ${location.garrison.suppliesPercent}%.
3. NIGHT PATROLS REPORT ENEMY ENTRENCHING ON REVERSE SLOPES AT 800 YARDS.
4. STATUS REMAINS STEADY UNDER COMMAND OF ${location.garrison.commander || 'SECTOR HQ'}.`
    },
    FALL_BACK: {
      subject: `TACTICAL WITHDRAWAL REPORT // ${location.name}`,
      body: `1. FORWARD PICKETS EVACUATED UNDER HIGH-EXPLOSIVE SMOKE SCREEN COVER.
2. MAIN BATTALION FORCES RE-ESTABLISHED ON RIDGE-TOP POSITIONS.
3. SUPPLY LINES CONTRACTED; ENEMY FORCES NOW OCCUPY VALLEY BASIN ROAD.
4. REQUEST ARTILLERY TARGET REGISTRATION ON ABANDONED SECTOR ROADWAYS.`
    },
    AIRLIFT_SUPPLIES: {
      subject: `IAF SORTIE REPORT // DAKOTA AIRDROP ${location.name}`,
      body: `1. TWO DAKOTA TRANSPORTS OF NO. 12 SQUADRON TOUCHED DOWN / DROPPED PARACHUTE CRATES.
2. 40 CRATES OF 3-INCH MORTAR AMMUNITION AND WINTER MEDICAL PACKS DELIVERED.
3. 24 CRITICAL CASUALTIES LOADED FOR AIRLIFT TO JAMMU MILITARY HOSPITAL.
4. GARRISON RESUPPLY COMPLETE; DEFENSIVE CAPABILITY RESTORED.`
    },
    RECON_SWEEP: {
      subject: `INTELLIGENCE MEMO // FLANK RECONNAISSANCE ${location.name}`,
      body: `1. 7TH CAVALRY ARMOURED CAR DETACHMENT SWEPT MOUNTAIN PASS JUNCTIONS.
2. HOSTILE INFILTRATION ATTEMPT INTERCEPTED AND DISPERSED.
3. CONVOY ROUTE CONFIRMED CLEAR FOR THE NEXT 12 HOURS.`
    },
    REINFORCE_SECTOR: {
      subject: `REINFORCEMENT DISPATCH // ${location.name}`,
      body: `1. BATTALION RESERVES REACHED DESIGNATED PICKET LINES.
2. SECTOR DEFENSE ELEVATED AND FIRING PITS EXPANDED.
3. TROOP DISPOSITIONS COMPLETE FOR UPCOMING ENGAGEMENT.`
    }
  };

  const selected = templates[orderType] || templates.HOLD;

  return {
    timestamp: `${date} // ${time} HRS`,
    sender: location.garrison.commander || 'BRIGADE HQ',
    callsign: 'TIGER-6',
    subject: selected.subject,
    body: selected.body,
    classification: 'SECRET // INDIAN ARMY JAK FORCE'
  };
}
