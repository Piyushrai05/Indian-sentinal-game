import { EnemyIntelContact } from '../types/game';

export const INITIAL_ENEMY_CONTACTS: EnemyIntelContact[] = [
  {
    id: 'intel-baramulla-force',
    locationId: 'baramulla',
    locationName: 'Baramulla Sector',
    estimatedStrengthMin: 2200,
    estimatedStrengthMax: 3500,
    confidencePercent: 78,
    contactStatus: 'CONFIRMED',
    threatLevel: 'EXTREME',
    lastReportedMinutesAgo: 14,
    position3D: [-1.9, 0.52, -0.7],
    activityNote: 'Tribal raider mechanized column with 3.7" mountain guns concentrated along Jhelum road.'
  },
  {
    id: 'intel-uri-gorge',
    locationId: 'uri',
    locationName: 'Uri Defile',
    estimatedStrengthMin: 800,
    estimatedStrengthMax: 1400,
    confidencePercent: 62,
    contactStatus: 'PROBABLE',
    threatLevel: 'HIGH',
    lastReportedMinutesAgo: 25,
    position3D: [-3.0, 0.68, -0.85],
    activityNote: 'Hostile sniper and mortar nests commanding the high cliff slopes above the gorge.'
  },
  {
    id: 'intel-poonch-siege',
    locationId: 'poonch',
    locationName: 'Poonch Ring Ridges',
    estimatedStrengthMin: 4000,
    estimatedStrengthMax: 6500,
    confidencePercent: 85,
    contactStatus: 'CONFIRMED',
    threatLevel: 'EXTREME',
    lastReportedMinutesAgo: 8,
    position3D: [-2.9, 0.45, 1.4],
    activityNote: 'Continuous mortar and artillery harassment directed at town perimeter and dirt airstrip.'
  },
  {
    id: 'intel-naushera-front',
    locationId: 'naushera',
    locationName: 'Taindhar Southern Approaches',
    estimatedStrengthMin: 5000,
    estimatedStrengthMax: 8000,
    confidencePercent: 70,
    contactStatus: 'PROBABLE',
    threatLevel: 'HIGH',
    lastReportedMinutesAgo: 32,
    position3D: [-1.7, 0.38, 2.7],
    activityNote: 'Human-wave assault preparations detected in nullahs and wooded ravines.'
  }
];
