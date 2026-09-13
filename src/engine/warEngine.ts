import {
  LocationData,
  SupplyRouteData,
  UnitData,
  WarState,
  DecisionType,
  DecisionRecord,
  BattlefieldEvent,
  RadioMessage,
  CampaignEnding,
  AfterActionReportData,
  EnemyAIState
} from '../types/game';

export interface BattleResolutionResult {
  newWarState: WarState;
  updatedLocations: LocationData[];
  updatedRoutes: SupplyRouteData[];
  updatedUnits: UnitData[];
  newDecisionRecord: DecisionRecord;
  newEvents: BattlefieldEvent[];
  newRadioMessages: RadioMessage[];
}

export function resolveCombatOrder(
  locationId: string,
  orderType: DecisionType,
  locations: LocationData[],
  routes: SupplyRouteData[],
  units: UnitData[],
  warState: WarState,
  enemyState: EnemyAIState
): BattleResolutionResult {
  const loc = locations.find(l => l.id === locationId) || locations[0];
  const locName = loc.name;

  let defDelta = 0;
  let pDelta = 0;
  let sDelta = 0;
  let mDelta = 0;
  let pressureDelta = 0;
  let rationale = '';
  let delayedForecast = '';

  switch (orderType) {
    case 'COUNTERATTACK':
      defDelta = +22;
      pDelta = -Math.floor(80 + Math.random() * 40);
      sDelta = -18;
      mDelta = +14;
      pressureDelta = -28;
      rationale = `Brigadier Usman ordered a rapid concentrated 25-pounder artillery preparation followed by a bayonet charge. The forward pickets advanced through heavy fire, seizing enemy sangars and breaking their defensive cohesion.`;
      delayedForecast = `Hostile forces fell back across the river gorge in disarray. However, heavy expenditure of 3" mortar rounds has depleted forward ammunition reserves.`;
      break;

    case 'HOLD':
      defDelta = +14;
      pDelta = -Math.floor(10 + Math.random() * 15);
      sDelta = -8;
      mDelta = +4;
      pressureDelta = +2;
      rationale = `Troops reinforced their stone sangars and laid interlocking machine gun crossfire arcs. Probing enemy thrusts were repulsed with minimal friendly losses.`;
      delayedForecast = `Defensive line holds firmly, but hostile scouts continue probing for exposed flanks in reverse slopes.`;
      break;

    case 'FALL_BACK':
      defDelta = -25;
      pDelta = -Math.floor(20 + Math.random() * 15);
      sDelta = +5;
      mDelta = -10;
      pressureDelta = +16;
      rationale = `Forward observation outposts fell back under smoke cover to the secondary ridge line. Supply expenditure was curtailed.`;
      delayedForecast = `Withdrawing ceded dominant observation peaks to enemy artillery spotters. Connected supply routes now face imminent ambush threats.`;
      break;

    case 'AIRLIFT_SUPPLIES':
      defDelta = +18;
      pDelta = +35;
      sDelta = +28;
      mDelta = +10;
      pressureDelta = -6;
      rationale = `IAF No. 12 Squadron Dakotas braved turbulent mountain winds to drop 25-pounder ammunition, winter greatcoats, and emergency blood plasma directly onto the strip.`;
      delayedForecast = `Garrison supply capability restored; enemy attempts to mount an encirclement have been arrested.`;
      break;

    default:
      defDelta = +10;
      pDelta = -15;
      sDelta = -6;
      mDelta = +2;
      pressureDelta = -5;
      rationale = `Tactical redeployment executed under field commander directives.`;
      delayedForecast = `Frontline stabilized along key mountain approach.`;
      break;
  }

  // Update war state
  const newWarState: WarState = {
    ...warState,
    personnel: Math.max(500, warState.personnel + pDelta),
    supplies: Math.max(0, Math.min(100, warState.supplies + sDelta)),
    morale: Math.max(10, Math.min(100, warState.morale + mDelta)),
    enemyPressure: Math.max(5, Math.min(100, warState.enemyPressure + pressureDelta))
  };

  // Update locations
  const updatedLocations = locations.map(l => {
    if (l.id === locationId) {
      const newDef = Math.max(10, Math.min(100, l.currentDefense + defDelta));
      const newPressure = Math.max(10, Math.min(98, l.garrison.enemyPressurePercent + pressureDelta));
      const newStatus = newDef >= 70 ? ('SECURED' as const) : newPressure > 80 ? ('CRITICAL' as const) : ('CONTESTED' as const);
      const newControl = orderType === 'FALL_BACK' && newDef < 30 ? ('CONTESTED' as const) : l.control;

      return {
        ...l,
        currentDefense: newDef,
        status: newStatus,
        control: newControl,
        garrison: {
          ...l.garrison,
          enemyPressurePercent: newPressure,
          suppliesPercent: Math.max(5, Math.min(100, l.garrison.suppliesPercent + sDelta)),
          moralePercent: Math.max(10, Math.min(100, l.garrison.moralePercent + mDelta)),
          personnel: Math.max(100, l.garrison.personnel + pDelta)
        }
      };
    }
    return l;
  });

  // Update supply routes
  const updatedRoutes = routes.map(r => {
    if (r.fromId === locationId || r.toId === locationId) {
      if (orderType === 'COUNTERATTACK') {
        return { ...r, status: 'ACTIVE' as const, threatLevel: 'MODERATE' as const };
      } else if (orderType === 'FALL_BACK') {
        return { ...r, status: 'THREATENED' as const, threatLevel: 'HIGH' as const };
      }
    }
    return r;
  });

  // Decision record
  const newDecisionRecord: DecisionRecord = {
    id: `rec-${Date.now()}`,
    date: warState.date,
    time: warState.time.substring(0, 5),
    locationId,
    locationName: locName,
    orderType,
    title: orderType === 'COUNTERATTACK' ? 'OFFENSIVE COUNTER-STRIKE' : orderType === 'HOLD' ? 'ENTRENCHED DEFENSE' : 'TACTICAL RETROGRADE',
    rationale,
    immediateEffects: {
      defenseDelta: defDelta,
      moraleDelta: mDelta,
      suppliesDelta: sDelta,
      personnelDelta: pDelta
    },
    delayedEffects: {
      enemyAwarenessDelta: +15,
      routeThreatTarget: orderType === 'FALL_BACK' ? locName : undefined,
      narrativeForecast: delayedForecast
    },
    fieldReportSummary: `${orderType} executed at ${locName}. Defense adjusted by ${defDelta > 0 ? `+${defDelta}` : defDelta}%.`
  };

  const newEvents: BattlefieldEvent[] = [
    {
      id: `evt-ord-${Date.now()}`,
      time: warState.time.substring(0, 5),
      type: 'OFFICER_DISPATCH',
      title: `Directive Executed: ${locName}`,
      description: rationale,
      locationId,
      severity: 'INFO',
      timestamp: warState.time,
      resolved: true
    }
  ];

  const newRadioMessages: RadioMessage[] = [
    {
      id: `rad-action-${Date.now()}`,
      channel: 'COMMAND',
      timestamp: warState.time.substring(0, 5),
      senderName: loc.garrison.commander || 'SECTOR COMMAND',
      senderRank: 'Commander',
      callsign: 'TIGER-HQ',
      text: `SITREP: ${rationale} ${delayedForecast}`,
      urgent: orderType === 'COUNTERATTACK',
      isRead: false
    }
  ];

  return {
    newWarState,
    updatedLocations,
    updatedRoutes,
    updatedUnits: units,
    newDecisionRecord,
    newEvents,
    newRadioMessages
  };
}

export function computeAfterActionReport(
  warState: WarState,
  locations: LocationData[],
  decisionHistory: DecisionRecord[]
): AfterActionReportData {
  const friendlyCount = locations.filter(l => l.control === 'FRIENDLY').length;
  const territoryControl = Math.round((friendlyCount / locations.length) * 100);

  const successfulOps = decisionHistory.filter(d => d.immediateEffects.defenseDelta > 0).length;
  const failedOps = decisionHistory.length - successfulOps;

  let ending: CampaignEnding = 'HARD_FOUGHT_HOLD';
  let title = 'VALIANT DEFENSIVE STAND';
  let subtitle = 'The Kashmir Front Stabilized Under Brigadier Usman';
  let legacyReport = 'Through determined defensive leadership and tactical boldness, Indian Army formations contained hostile raider penetrations and preserved the vital corridors of the Kashmir Valley.';

  if (territoryControl >= 80 && warState.morale >= 75 && warState.enemyPressure <= 45) {
    ending = 'STRATEGIC_SUCCESS';
    title = 'DECISIVE STRATEGIC TRIUMPH';
    subtitle = 'Kashmir Bastions Firmly Secured';
    legacyReport = 'Brigadier Mohammad Usman’s brilliant counter-offensives and unyielding resolve at Naushera, Srinagar, and Baramulla completely shattered the enemy offensive. All major passes and civilian centers were successfully defended.';
  } else if (warState.supplies <= 15 || warState.morale <= 25) {
    ending = 'ORDERLY_WITHDRAWAL';
    title = 'EXHAUSTION & STRATEGIC RETROGRADE';
    subtitle = 'Forces Consolidated at Jammu Perimeter';
    legacyReport = 'Severe logistical depletion and ammunition shortages compelled our forward formations to shorten lines. While thousands of civilian lives were saved, the forward passes were ceded.';
  }

  const criticalDecisionsAnalysis = decisionHistory.slice(0, 3).map(d => ({
    title: `${d.title} at ${d.locationName}`,
    impact: d.rationale,
    cost: `Supplies: ${d.immediateEffects.suppliesDelta}%, Casualties: ${d.immediateEffects.personnelDelta}`
  }));

  return {
    ending,
    title,
    subtitle,
    legacyReport,
    strategicDecisionsCount: decisionHistory.length,
    successfulOpsCount: successfulOps,
    failedOpsCount: failedOps,
    territoryControlPercent: territoryControl,
    finalMorale: warState.morale,
    finalSupplies: warState.supplies,
    commandReputation: Math.round((warState.morale + territoryControl) / 2),
    criticalDecisionsAnalysis,
    medalsAwarded: []
  };
}
