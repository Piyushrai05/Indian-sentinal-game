export type LiveStrikeType =
  | 'ROCKET_SALVO'
  | 'ARTILLERY_BARRAGE'
  | 'TEMPEST_AIR_STRIKE'
  | 'DAKOTA_SUPPLY_DROP'
  | 'SMOKE_SCREEN';

export interface ActiveStrikeEntity {
  id: string;
  type: LiveStrikeType;
  origin: [number, number, number];
  target: [number, number, number];
  targetSectorId: string;
  targetSectorName: string;
  startTime: number;
  duration: number; // in seconds
  hasDetonated: boolean;
  damagePercent: number;
}

export interface FireSupportWeapon {
  id: LiveStrikeType;
  name: string;
  callsign: string;
  icon: string;
  description: string;
  tacticalRole: string;
  ammoCount: number;
  maxAmmo: number;
  cooldownSeconds: number;
  damage: string;
  effectDescription: string;
  videoUrl?: string;
}

export const FIRE_SUPPORT_ARSENAL: FireSupportWeapon[] = [
  {
    id: 'ROCKET_SALVO',
    name: '6-TUBE ROCKET LAUNCHER SALVO',
    callsign: 'KATUSHA-SALVO',
    icon: 'RL-6',
    videoUrl: '/videos/rl6_rocket_launcher.mp4',
    description: 'Rapid-fire truck-mounted 132mm rocket barrage with incendiary fragmentation warheads.',
    tacticalRole: 'Area suppression and breaking enemy fortified sangars',
    ammoCount: 4,
    maxAmmo: 4,
    cooldownSeconds: 4,
    damage: '-35% Enemy Pressure',
    effectDescription: 'Shatters enemy pickets with heavy ground explosions & smoke.'
  },
  {
    id: 'ARTILLERY_BARRAGE',
    name: '25-POUNDER FIELD BATTERY',
    callsign: 'GUNNER-BATTERY',
    icon: '25-PDR',
    description: 'High-angle 87.6mm high explosive shell bombardment from regimental field artillery.',
    tacticalRole: 'Pinpoint neutralization of mountain mortars & roadblocks',
    ammoCount: 6,
    maxAmmo: 6,
    cooldownSeconds: 3,
    damage: '-25% Enemy Pressure, +15% Defense',
    effectDescription: 'Heavy shockwave detonation cratering enemy defiles.'
  },
  {
    id: 'TEMPEST_AIR_STRIKE',
    name: 'IAF HAWKER TEMPEST GROUND STRIKE',
    callsign: 'EAGLE-STRIKE',
    icon: 'TEMPEST',
    description: 'Low-altitude strafing with twin 20mm Hispano cannons and dual 500lb bombs.',
    tacticalRole: 'Destruction of motorized columns and raider concentrations',
    ammoCount: 3,
    maxAmmo: 3,
    cooldownSeconds: 6,
    damage: '-45% Enemy Pressure',
    effectDescription: 'Swooping 3D aircraft with tracer lines & dual bomb detonations.'
  },
  {
    id: 'DAKOTA_SUPPLY_DROP',
    name: 'DAKOTA C-47 AIRDROP & PARATROOPS',
    callsign: 'BABA-AIRLIFT',
    icon: 'C-47',
    description: 'No. 12 Squadron high-altitude cargo drop with parachuted rations & ammo crates.',
    tacticalRole: 'Relieving besieged garrisons and boosting sector stamina',
    ammoCount: 4,
    maxAmmo: 4,
    cooldownSeconds: 5,
    damage: '+30% Supplies, +20% Morale',
    effectDescription: 'Low-flying Dakota aircraft releasing floating parachute canisters.'
  },
  {
    id: 'SMOKE_SCREEN',
    name: 'WHITE PHOSPHORUS SMOKE BARRAGE',
    callsign: 'SMOKE-SCREEN',
    icon: 'WP-SMK',
    videoUrl: '/videos/wpsmk_smoke_screen.mp4',
    description: '3-inch mortar smoke canisters creating dense white concealing clouds.',
    tacticalRole: 'Blinding enemy sniper pickets and screening troop maneuvers',
    ammoCount: 5,
    maxAmmo: 5,
    cooldownSeconds: 3,
    damage: '-20% Enemy Accuracy, +20% Defense',
    effectDescription: 'Dense volumetric smoke clouds blanketing the valley.'
  }
];
