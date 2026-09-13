import { NPCMemory } from '../types/game';

export const INITIAL_OFFICERS: Record<string, NPCMemory> = {
  usman: {
    id: 'usman',
    name: 'Brigadier Mohammad Usman',
    rank: 'Brigadier (Maha Vir Chakra)',
    role: 'Commander, 50th Indian Parachute Brigade',
    trust: 95,
    respect: 98,
    confidence: 90,
    successfulOperations: 4,
    failedOperations: 0,
    memoryLog: [
      'Assumed operational command in Jammu & Kashmir theatre.',
      'Vowed never to sleep on a cot until Jhangar was reclaimed.',
      'Fortified Naushera perimeter into an impregnable defensive bastion.'
    ],
    lastInteractionScene: 'Theatre HQ Briefing'
  },
  somnath: {
    id: 'somnath',
    name: 'Major Somnath Sharma',
    rank: 'Major (Param Vir Chakra)',
    role: 'Company Commander, 4th Battalion Kumaon Regiment',
    trust: 90,
    respect: 92,
    confidence: 85,
    successfulOperations: 2,
    failedOperations: 0,
    memoryLog: [
      'Deployed at Badgam heights to shield Srinagar airfield.',
      'Maintained firm defensive pickets despite heavy hostile mortar fire.'
    ],
    lastInteractionScene: 'Badgam Forward Observation Post'
  },
  yadunath: {
    id: 'yadunath',
    name: 'Major Yadunath Singh',
    rank: 'Major (Param Vir Chakra)',
    role: 'Forward Picket Commander, 1st Battalion Rajput Regiment',
    trust: 88,
    respect: 94,
    confidence: 90,
    successfulOperations: 3,
    failedOperations: 0,
    memoryLog: [
      'Anchored Taindhar Picket No. 2 at Naushera.',
      'Repelled multiple human-wave attacks with single-handed Bren gun counter-fire.'
    ],
    lastInteractionScene: 'Taindhar Bunker Line'
  },
  mehar: {
    id: 'mehar',
    name: 'Air Commodore Mehar Singh',
    rank: 'Air Commodore (DSO, MVC)',
    role: 'Commander, No. 12 Transport Squadron IAF ("Baba")',
    trust: 92,
    respect: 96,
    confidence: 95,
    successfulOperations: 5,
    failedOperations: 0,
    memoryLog: [
      'Flew pioneer Dakota airlift missions under small-arms ground fire.',
      'Conducted daring night landings on Poonch 600-yard dirt strip.'
    ],
    lastInteractionScene: 'Srinagar Airfield Flight Deck'
  }
};
