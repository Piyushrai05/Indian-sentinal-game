import { NPCMemory, WarState } from '../types/game';

export function updateOfficerRelationship(
  currentOfficers: Record<string, NPCMemory>,
  officerId: string,
  eventOutcome: 'VICTORY' | 'TACTICAL_SUCCESS' | 'CASUALTY_HEAVY' | 'RETREAT' | 'IGNORED_REQUEST',
  details: string
): Record<string, NPCMemory> {
  const officer = currentOfficers[officerId];
  if (!officer) return currentOfficers;

  let trustDelta = 0;
  let respectDelta = 0;
  let confidenceDelta = 0;
  let isSuccess = false;

  switch (eventOutcome) {
    case 'VICTORY':
      trustDelta = +8;
      respectDelta = +10;
      confidenceDelta = +12;
      isSuccess = true;
      break;
    case 'TACTICAL_SUCCESS':
      trustDelta = +4;
      respectDelta = +5;
      confidenceDelta = +6;
      isSuccess = true;
      break;
    case 'CASUALTY_HEAVY':
      trustDelta = -4;
      respectDelta = +2; // respect for holding ground
      confidenceDelta = -6;
      break;
    case 'RETREAT':
      trustDelta = -6;
      respectDelta = -5;
      confidenceDelta = -10;
      break;
    case 'IGNORED_REQUEST':
      trustDelta = -12;
      respectDelta = -8;
      confidenceDelta = -5;
      break;
  }

  const updated: NPCMemory = {
    ...officer,
    trust: Math.max(10, Math.min(100, officer.trust + trustDelta)),
    respect: Math.max(10, Math.min(100, officer.respect + respectDelta)),
    confidence: Math.max(10, Math.min(100, officer.confidence + confidenceDelta)),
    successfulOperations: isSuccess ? officer.successfulOperations + 1 : officer.successfulOperations,
    failedOperations: !isSuccess && eventOutcome !== 'IGNORED_REQUEST' ? officer.failedOperations + 1 : officer.failedOperations,
    memoryLog: [details, ...officer.memoryLog.slice(0, 6)],
    lastInteractionScene: details
  };

  return {
    ...currentOfficers,
    [officerId]: updated
  };
}
