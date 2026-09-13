import { LocationData, SupplyRouteData, EnemyAIState, BattlefieldEvent, RadioMessage, WarState } from '../types/game';

export interface EnemyReactionResult {
  updatedEnemyState: EnemyAIState;
  updatedLocations: LocationData[];
  updatedRoutes: SupplyRouteData[];
  newEvents: BattlefieldEvent[];
  newRadioMessages: RadioMessage[];
}

export function evaluateEnemyReaction(
  currentLocations: LocationData[],
  currentRoutes: SupplyRouteData[],
  enemyState: EnemyAIState,
  warState: WarState,
  playerActionDescription: string
): EnemyReactionResult {
  const newEvents: BattlefieldEvent[] = [];
  const newRadioMessages: RadioMessage[] = [];

  // 1. Find the most vulnerable friendly sector
  const vulnerableLoc = currentLocations
    .filter(l => l.control === 'FRIENDLY' || l.control === 'CONTESTED')
    .sort((a, b) => a.currentDefense - b.currentDefense)[0];

  let newAggression = Math.min(100, enemyState.aggression + 4);
  let newFocusAxis = enemyState.focusAxis;
  let targetSector = vulnerableLoc ? vulnerableLoc.id : 'uri';

  // 2. Determine enemy response based on vulnerability
  const updatedLocations = currentLocations.map(loc => {
    if (loc.id === targetSector && loc.currentDefense < 50) {
      // Enemy probes weak sector
      const addedPressure = Math.round(6 + Math.random() * 8);
      return {
        ...loc,
        status: loc.status === 'SECURED' ? ('CONTESTED' as const) : loc.status,
        garrison: {
          ...loc.garrison,
          enemyPressurePercent: Math.min(98, loc.garrison.enemyPressurePercent + addedPressure)
        }
      };
    }
    return loc;
  });

  // 3. Evaluate supply route raiding
  const updatedRoutes = currentRoutes.map(route => {
    if ((route.fromId === targetSector || route.toId === targetSector) && route.status === 'ACTIVE') {
      if (Math.random() > 0.4) {
        newEvents.push({
          id: `evt-route-${Date.now()}`,
          time: warState.time.substring(0, 5),
          type: 'SUPPLY_INTERRUPTED',
          title: `Supply Route Threatened: ${route.name}`,
          description: `Hostile tribal scouts have set up ambushes along ${route.name}. Convoy transit impeded.`,
          locationId: targetSector,
          severity: 'WARN',
          timestamp: warState.time,
          resolved: false
        });

        newRadioMessages.push({
          id: `rad-threat-${Date.now()}`,
          channel: 'LOGISTICS',
          timestamp: warState.time.substring(0, 5),
          senderName: 'LOGISTICS CORPS HQ',
          senderRank: 'Captain (Supply Depot)',
          callsign: 'SUPPLY-JAMMU',
          text: `URGENT: Convoy carrying 25-pounder shells on ${route.name} reports sniper fire. Threat level elevated to HIGH.`,
          urgent: true,
          isRead: false
        });

        return {
          ...route,
          status: 'THREATENED' as const,
          threatLevel: 'HIGH' as const
        };
      }
    }
    return route;
  });

  // 4. Generate general enemy contact event if pressure is high
  if (vulnerableLoc && vulnerableLoc.currentDefense < 45) {
    newEvents.push({
      id: `evt-contact-${Date.now()}`,
      time: warState.time.substring(0, 5),
      type: 'CONTACT_DETECTED',
      title: `Hostile Infiltration at ${vulnerableLoc.name}`,
      description: `Forward listening posts detect heavy raider motorized movements probing the perimeter of ${vulnerableLoc.name}.`,
      locationId: vulnerableLoc.id,
      severity: 'CRITICAL',
      timestamp: warState.time,
      resolved: false
    });

    newRadioMessages.push({
      id: `rad-field-${Date.now()}`,
      channel: 'FIELD',
      timestamp: warState.time.substring(0, 5),
      senderName: vulnerableLoc.garrison.commander || 'FORWARD PICKET',
      senderRank: 'Field Commander',
      callsign: 'OUTPOST-2',
      text: `Sir! Raider mortar concentrations detected in ravine near ${vulnerableLoc.name}. They are testing our defensive picket lines.`,
      urgent: true,
      isRead: false
    });
  }

  const updatedEnemyState: EnemyAIState = {
    ...enemyState,
    aggression: newAggression,
    targetSectorId: targetSector,
    focusAxis: newFocusAxis,
    lastMoveMinutesAgo: 0,
    recentPlayerActions: [playerActionDescription, ...enemyState.recentPlayerActions.slice(0, 4)]
  };

  return {
    updatedEnemyState,
    updatedLocations,
    updatedRoutes,
    newEvents,
    newRadioMessages
  };
}
