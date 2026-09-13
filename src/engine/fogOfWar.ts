import { EnemyIntelContact, LocationData, BattlefieldEvent, RadioMessage, WarState } from '../types/game';

export interface ReconResult {
  updatedContacts: EnemyIntelContact[];
  newEvents: BattlefieldEvent[];
  newRadioMessages: RadioMessage[];
  reconOutcome: 'CONFIRMED' | 'PARTIAL' | 'DELAYED' | 'FAILED';
  reportText: string;
}

export function executeReconMission(
  targetLocation: LocationData,
  currentContacts: EnemyIntelContact[],
  warState: WarState,
  reconType: 'AIR_RECON' | 'ARMORED_SCOUT' | 'INFANTRY_PATROL'
): ReconResult {
  let outcome: 'CONFIRMED' | 'PARTIAL' | 'DELAYED' | 'FAILED' = 'CONFIRMED';
  const rand = Math.random();

  if (warState.weather === 'MOUNTAIN_BLIZZARD' || warState.visibilityPercent < 40) {
    outcome = rand > 0.5 ? 'PARTIAL' : 'FAILED';
  } else if (warState.weather === 'FOG_OVERCAST') {
    outcome = rand > 0.3 ? 'PARTIAL' : 'DELAYED';
  } else {
    outcome = rand > 0.15 ? 'CONFIRMED' : 'PARTIAL';
  }

  const confidenceDelta = outcome === 'CONFIRMED' ? 35 : outcome === 'PARTIAL' ? 18 : 0;
  let reportText = '';

  if (outcome === 'CONFIRMED') {
    reportText = `IAF reconnaissance aircraft completed low-altitude photoreconnaissance sweep over ${targetLocation.name}. Enemy 3.7" artillery positions and motorized staging areas precisely mapped.`;
  } else if (outcome === 'PARTIAL') {
    reportText = `Scouts encountered intermittent mountain mist and sniper fire near ${targetLocation.name}. Confirmed enemy presence in ravines, but exact troop numbers remain obscured.`;
  } else if (outcome === 'DELAYED') {
    reportText = `Scout patrol was pinned down by enemy crossfire in a nullah near ${targetLocation.name}. Detailed aerial report delayed until dusk.`;
  } else {
    reportText = `Reconnaissance failed due to zero-visibility mountain blizzards. No new intelligence obtained.`;
  }

  // Update intel contacts
  const updatedContacts = currentContacts.map(contact => {
    if (contact.locationId === targetLocation.id) {
      const newConf = Math.min(100, contact.confidencePercent + confidenceDelta);
      const newStatus = newConf >= 75 ? ('CONFIRMED' as const) : newConf >= 50 ? ('PROBABLE' as const) : ('SUSPECTED' as const);
      return {
        ...contact,
        confidencePercent: newConf,
        contactStatus: newStatus,
        lastReportedMinutesAgo: 2,
        activityNote: reportText
      };
    }
    return contact;
  });

  const newEvents: BattlefieldEvent[] = [
    {
      id: `evt-recon-${Date.now()}`,
      time: warState.time.substring(0, 5),
      type: 'RECON_COMPLETE',
      title: `Reconnaissance Report: ${targetLocation.name}`,
      description: reportText,
      locationId: targetLocation.id,
      severity: outcome === 'CONFIRMED' ? 'INFO' : 'WARN',
      timestamp: warState.time,
      resolved: true
    }
  ];

  const newRadioMessages: RadioMessage[] = [
    {
      id: `rad-recon-${Date.now()}`,
      channel: 'INTELLIGENCE',
      timestamp: warState.time.substring(0, 5),
      senderName: 'INTELLIGENCE CORPS RECON PATROL',
      senderRank: 'Captain (Field Intelligence)',
      callsign: 'HAWK-EYE',
      text: `RECON SITREP: ${reportText}`,
      urgent: outcome === 'CONFIRMED',
      isRead: false
    }
  ];

  return {
    updatedContacts,
    newEvents,
    newRadioMessages,
    reconOutcome: outcome,
    reportText
  };
}
