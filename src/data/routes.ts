import { SupplyRouteData } from '../types/game';

export const INITIAL_ROUTES: SupplyRouteData[] = [
  {
    id: 'route-jammu-srinagar',
    name: 'NATIONAL HIGHWAY 1A (JAMMU - BANIHAL - SRINAGAR)',
    fromId: 'jammu',
    toId: 'srinagar',
    status: 'ACTIVE',
    threatLevel: 'MODERATE',
    vitalFor: 'Main military convoys, heavy ammunition, and reinforcements from Indian plains.',
    pathWaypoints: [
      [0.85, 0.24, 3.65],
      [1.15, 0.50, 2.20],
      [0.85, 0.70, 1.40],
      [0, 0.45, 0]
    ]
  },
  {
    id: 'route-srinagar-baramulla',
    name: 'JHELUM VALLEY HIGHWAY (SRINAGAR - BARAMULLA)',
    fromId: 'srinagar',
    toId: 'baramulla',
    status: 'ACTIVE',
    threatLevel: 'MODERATE',
    vitalFor: 'Primary counter-offensive axis into northwestern Kashmir.',
    pathWaypoints: [
      [0, 0.45, 0],
      [-0.8, 0.48, -0.3],
      [-1.6, 0.50, -0.6]
    ]
  },
  {
    id: 'route-baramulla-uri',
    name: 'JHELUM GORGE ROAD (BARAMULLA - URI DEFILE)',
    fromId: 'baramulla',
    toId: 'uri',
    status: 'ACTIVE',
    threatLevel: 'HIGH',
    vitalFor: 'Frontline ammunition supply to 161 Brigade at Uri.',
    pathWaypoints: [
      [-1.6, 0.50, -0.6],
      [-2.2, 0.58, -0.65],
      [-2.85, 0.65, -0.70]
    ]
  },
  {
    id: 'route-jammu-naushera',
    name: 'SOUTHERN HIGHWAY (JAMMU - NAUSHERA)',
    fromId: 'jammu',
    toId: 'naushera',
    status: 'ACTIVE',
    threatLevel: 'LOW',
    vitalFor: 'Artillery ammunition and vehicle columns to Brig. Usman.',
    pathWaypoints: [
      [0.85, 0.24, 3.65],
      [-0.4, 0.28, 3.10],
      [-1.55, 0.35, 2.30]
    ]
  },
  {
    id: 'route-naushera-jhangar',
    name: 'KOTLI HIGHWAY (NAUSHERA - JHANGAR)',
    fromId: 'naushera',
    toId: 'jhangar',
    status: 'ACTIVE',
    threatLevel: 'HIGH',
    vitalFor: 'Combat resupply to 50th Parachute Brigade at Jhangar.',
    pathWaypoints: [
      [-1.55, 0.35, 2.30],
      [-1.90, 0.38, 2.70]
    ]
  },
  {
    id: 'route-naushera-poonch',
    name: 'POONCH RELIEF CORRIDOR (NAUSHERA - RAJOURI - POONCH)',
    fromId: 'naushera',
    toId: 'poonch',
    status: 'ACTIVE',
    threatLevel: 'HIGH',
    vitalFor: 'Historic link-up breaking the 1-year siege of Poonch citadel.',
    pathWaypoints: [
      [-1.55, 0.35, 2.30],
      [-1.80, 0.55, 1.60],
      [-2.60, 0.70, 0.85]
    ]
  },
  {
    id: 'route-srinagar-zojila',
    name: 'SINDH VALLEY HIGHWAY (SRINAGAR - ZOJI LA PASS)',
    fromId: 'srinagar',
    toId: 'zojila',
    status: 'ACTIVE',
    threatLevel: 'HIGH',
    vitalFor: 'Assault axis of Stuart light tanks in Operation Bison.',
    pathWaypoints: [
      [0, 0.45, 0],
      [1.10, 0.70, -0.60],
      [2.05, 0.95, -0.80]
    ]
  },
  {
    id: 'route-zojila-kargil',
    name: 'GREAT HIMALAYAN PASSAGE (ZOJI LA - DRAS - KARGIL)',
    fromId: 'zojila',
    toId: 'kargil',
    status: 'ACTIVE',
    threatLevel: 'HIGH',
    vitalFor: 'Frontline liberation axis into Ladakh.',
    pathWaypoints: [
      [2.05, 0.95, -0.80],
      [2.70, 0.94, -1.05],
      [3.35, 0.92, -1.25]
    ]
  },
  {
    id: 'route-kargil-leh',
    name: 'TRANS-LADAKH HIGHWAY (KARGIL - LEH)',
    fromId: 'kargil',
    toId: 'leh',
    status: 'ACTIVE',
    threatLevel: 'LOW',
    vitalFor: 'Main arterial lifeline for entire Ladakh defense sector.',
    pathWaypoints: [
      [3.35, 0.92, -1.25],
      [4.25, 1.02, -0.90],
      [5.20, 1.10, -0.55]
    ]
  }
];
