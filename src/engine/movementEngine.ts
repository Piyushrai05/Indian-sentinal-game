import * as THREE from 'three';
import { UnitData, LocationData, SupplyRouteData, UnitMarchOrder, WarState } from '../types/game';

export function planUnitMarch(
  unit: UnitData,
  fromLoc: LocationData,
  targetLoc: LocationData,
  routes: SupplyRouteData[],
  warState: WarState
): UnitMarchOrder {
  // 1. Find existing connecting route or synthesize terrain road waypoints
  const directRoute = routes.find(
    r => (r.fromId === fromLoc.id && r.toId === targetLoc.id) ||
         (r.fromId === targetLoc.id && r.toId === fromLoc.id)
  );

  let waypoints: [number, number, number][] = [];

  if (directRoute) {
    if (directRoute.fromId === fromLoc.id) {
      waypoints = [...directRoute.pathWaypoints];
    } else {
      waypoints = [...directRoute.pathWaypoints].reverse();
    }
  } else {
    // Multi-segment fallback via central valley
    const [x1, y1, z1] = fromLoc.gridPosition;
    const [x2, y2, z2] = targetLoc.gridPosition;
    const midX = (x1 + x2) / 2;
    const midY = Math.max(y1, y2) + 0.15;
    const midZ = (z1 + z2) / 2;

    waypoints = [
      [x1, y1 + 0.08, z1],
      [midX, midY, midZ],
      [x2, y2 + 0.08, z2]
    ];
  }

  // 2. Compute 3D path length
  let totalDist = 0;
  for (let i = 0; i < waypoints.length - 1; i++) {
    const p1 = new THREE.Vector3(...waypoints[i]);
    const p2 = new THREE.Vector3(...waypoints[i + 1]);
    totalDist += p1.distanceTo(p2);
  }

  // 3. Compute ETA based on distance, unit type, and weather
  let baseSpeed = unit.unitType === 'ARMORED_CAR' ? 0.35 : unit.unitType === 'PARATROOP' ? 0.28 : 0.22;
  if (warState.weather === 'MOUNTAIN_BLIZZARD') baseSpeed *= 0.6;
  if (warState.weather === 'COLD_RAIN' || warState.weather === 'FOG_OVERCAST') baseSpeed *= 0.8;

  const estimatedMinutes = Math.max(12, Math.round((totalDist / baseSpeed) * 3.5));
  const supplyCost = Math.max(4, Math.round(estimatedMinutes * 0.35));
  const fatigueCost = Math.max(6, Math.round(estimatedMinutes * 0.45));

  return {
    id: `march-${Date.now()}`,
    unitId: unit.id,
    fromLocationId: fromLoc.id,
    targetLocationId: targetLoc.id,
    routeWaypoints: waypoints,
    totalDistance: totalDist,
    progress: 0.0,
    speed: 1.0 / estimatedMinutes,
    etaMinutes: estimatedMinutes,
    remainingMinutes: estimatedMinutes,
    supplyCost,
    fatigueCost,
    startTime: warState.time,
    objectiveType: 'REINFORCE'
  };
}

export function interpolateMarchPosition(
  waypoints: [number, number, number][],
  progress: number
): [number, number, number] {
  if (!waypoints || waypoints.length === 0) return [0, 0, 0];
  if (waypoints.length === 1) return waypoints[0];

  const clamped = Math.max(0, Math.min(1, progress));
  const pts = waypoints.map(w => new THREE.Vector3(...w));
  const spline = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.15);
  const pos = spline.getPoint(clamped);

  return [pos.x, pos.y + 0.08, pos.z];
}
