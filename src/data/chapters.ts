import { CampaignChapter } from '../types/game';

export const CAMPAIGN_CHAPTERS: CampaignChapter[] = [
  {
    id: 'chapter-1-frontier',
    chapterNumber: 1,
    title: 'CHAPTER I // THE FRONTIER',
    subtitle: 'Fall of Baramulla & Defense of Srinagar Airfield',
    date: '28 October 1947',
    historicalContext: 'Over 5,000 tribal raiders backed by artillery have captured Baramulla and are advancing rapidly towards Srinagar. Indian Army 1st Sikh under Lt. Col. Dewan Ranjit Rai has been airlifted to Srinagar airfield to buy critical time.',
    objective: 'HOLD SRINAGAR AIRFIELD PERIMETER & HALT RAIDER FORWARD PROBES',
    constraint: 'LIMITED TROOP RESERVES; CRITICAL SHORTAGE OF 3" MORTARS AND TRUCKS',
    initialState: {
      date: '28 October 1947',
      time: '07:30:00',
      campaignDay: 1,
      personnel: 5400,
      supplies: 72,
      morale: 78,
      enemyPressure: 74,
      weather: 'COLD_RAIN',
      weatherDescription: 'Cold freezing drizzle, low cloud ceiling at 1,500 ft, muddy defiles.',
      visibilityPercent: 65
    },
    hotspotSectorId: 'srinagar',
    initialRadioMessages: [
      {
        id: 'rad-ch1-1',
        channel: 'COMMAND',
        timestamp: '07:32',
        senderName: 'LT. COL. DEWAN RANJIT RAI',
        senderRank: 'Lt. Colonel (MVC)',
        callsign: 'SIKH-1',
        text: 'Sir, 1st Sikh vanguard has established defensive roadblock at Mile 32 outside Baramulla. Heavy enemy motorized column spotted advancing on main highway.',
        urgent: true,
        isRead: false,
        options: [
          { id: 'opt-1a', label: 'Hold roadblock and prepare ambush', actionType: 'HOLD' },
          { id: 'opt-1b', label: 'Dispatch armored cars for recon sweep', actionType: 'RECON' }
        ]
      },
      {
        id: 'rad-ch1-2',
        channel: 'FIELD',
        timestamp: '07:45',
        senderName: 'MAJ. SOMNATH SHARMA',
        senderRank: 'Major (PVC)',
        callsign: 'KUMAON-1',
        text: '4 Kumaon companies have dug in around Badgam heights. Airfield perimeter pickets established.',
        urgent: false,
        isRead: false
      }
    ]
  },
  {
    id: 'chapter-2-defence',
    chapterNumber: 2,
    title: 'CHAPTER II // THE DEFENCE',
    subtitle: 'Battle of Shalateng & Northwest Flanking Hook',
    date: '07 November 1947',
    historicalContext: 'Enemy force of 3,000 concentrated at Shalateng to assault the capital. 161 Brigade HQ has coordinated a daring triple envelopment: 1 Sikh frontal pinning, 1 Kumaon right flank, and 7th Cavalry armored cars moving around the rear canal.',
    objective: 'TRAP & DESTROY RAIDER CONCENTRATION AT SHALATENG JUNCTION',
    constraint: 'ARMORED CARS OPERATING ACROSS FLOODED PADDY FIELDS WITH NARROW DIKES',
    initialState: {
      date: '07 November 1947',
      time: '08:15:00',
      campaignDay: 11,
      personnel: 5100,
      supplies: 64,
      morale: 84,
      enemyPressure: 68,
      weather: 'CLEAR',
      weatherDescription: 'Crisp cold Himalayan morning, excellent aerial observation.',
      visibilityPercent: 90
    },
    hotspotSectorId: 'baramulla',
    initialRadioMessages: [
      {
        id: 'rad-ch2-1',
        channel: 'FIELD',
        timestamp: '08:20',
        senderName: 'LT. COL. L.P. SEN',
        senderRank: 'Brigadier (Commander 161 Bde)',
        callsign: 'TIGER-HQ',
        text: '7th Cavalry Daimler armored cars under Lt. David have crossed Sumbal bridge and reached the enemy rear at Shalateng undetected. Request authorization to open fire.',
        urgent: true,
        isRead: false,
        options: [
          { id: 'opt-2a', label: 'Authorize immediate synchronized strike', actionType: 'COUNTERATTACK' },
          { id: 'opt-2b', label: 'Call IAF Tempest air strike first', actionType: 'AIR_SUPPORT' }
        ]
      }
    ]
  },
  {
    id: 'chapter-3-pressure',
    chapterNumber: 3,
    title: 'CHAPTER III // THE PRESSURE',
    subtitle: 'The Siege of Poonch & Dakota Night Airlifts',
    date: '15 December 1947',
    historicalContext: 'Poonch garrison under Brigadier Pritam Singh is completely surrounded by 8,000 hostile fighters. With over 40,000 civilian refugees inside the perimeter, food and rifle ammunition are critically depleted. IAF Dakota pilots attempt landing on an unlit 600-yard dirt strip.',
    objective: 'MAINTAIN GARRISON DEFENCE & RESUPPLY POONCH VIA NIGHT AIRLIFTS',
    constraint: 'HOSTILE ENEMY 3.7" HOWITZERS COMMANDING DIRECT FIRE ON DIRT RUNWAY',
    initialState: {
      date: '15 December 1947',
      time: '21:40:00',
      campaignDay: 49,
      personnel: 4700,
      supplies: 38,
      morale: 62,
      enemyPressure: 88,
      weather: 'FOG_OVERCAST',
      weatherDescription: 'Dense freezing mountain mist, zero moonlight, artillery flashes along ridges.',
      visibilityPercent: 35
    },
    hotspotSectorId: 'poonch',
    initialRadioMessages: [
      {
        id: 'rad-ch3-1',
        channel: 'AIR',
        timestamp: '21:45',
        senderName: 'AIR COMMODORE MEHAR SINGH',
        senderRank: 'Air Commodore (DSO)',
        callsign: 'BABA-1',
        text: 'Brigadier Usman, I have two Dakotas loaded with 25-pounder guns circling over Poonch valley. Request ground crews light kerosene flare pots on the strip. We are going in.',
        urgent: true,
        isRead: false,
        options: [
          { id: 'opt-3a', label: 'Ignite flare pots and clear strip', actionType: 'AIRLIFT_SUPPLIES' },
          { id: 'opt-3b', label: 'Hold until enemy hill mortars are suppressed', actionType: 'HOLD' }
        ]
      }
    ]
  },
  {
    id: 'chapter-4-countermove',
    chapterNumber: 4,
    title: 'CHAPTER IV // THE COUNTERMOVE',
    subtitle: 'The Lion of Naushera & Battle of Taindhar Ridge',
    date: '06 February 1948',
    historicalContext: 'At 06:40 hrs, enemy launched a massive 11,000-man multi-pronged offensive to overrun Naushera and open the gateway to Jammu. Brigadier Mohammad Usman deployed 50th Parachute Brigade and 1 Rajput on Taindhar ridge in a legendary defensive stand.',
    objective: 'REPEL HUMAN-WAVE ASSAULTS ON TAINDHAR & SECURE NAUSHERA BASIN',
    constraint: 'OUTNUMBERED 5 TO 1; FORWARD PICKETS UNDER INTENSE HAND-TO-HAND COMBAT',
    initialState: {
      date: '06 February 1948',
      time: '06:40:00',
      campaignDay: 102,
      personnel: 4850,
      supplies: 54,
      morale: 90,
      enemyPressure: 92,
      weather: 'FOG_OVERCAST',
      weatherDescription: 'Mountain morning fog clearing slowly, heavy smoke from artillery duel.',
      visibilityPercent: 55
    },
    hotspotSectorId: 'naushera',
    initialRadioMessages: [
      {
        id: 'rad-ch4-1',
        channel: 'FIELD',
        timestamp: '06:48',
        senderName: 'MAJOR YADUNATH SINGH',
        senderRank: 'Major (1 Rajput)',
        callsign: 'RAJPUT-9',
        text: 'Picket No. 2 under relentless third assault! Bren gunner martyred. I am taking over the Bren gun myself. We will not give up this crest!',
        urgent: true,
        isRead: false,
        options: [
          { id: 'opt-4a', label: 'Direct 25-pounder artillery barrage on reverse slope', actionType: 'COUNTERATTACK' },
          { id: 'opt-4b', label: 'Send 50th Para reserve platoon to reinforce', actionType: 'REINFORCE_SECTOR' }
        ]
      }
    ]
  },
  {
    id: 'chapter-5-final-command',
    chapterNumber: 5,
    title: 'CHAPTER V // THE FINAL COMMAND',
    subtitle: 'Operation Vijay & The Liberation of Jhangar',
    date: '18 March 1948',
    historicalContext: 'Brigadier Mohammad Usman fulfilled his solemn vow to retake Jhangar. Leading the coordinated advance of 50th Parachute Brigade and 19th Infantry Brigade, Indian forces shattered hostile resistance and reclaimed the strategic junction.',
    objective: 'RECAPTURE JHANGAR CROSSROAD & SECURE SOUTHERN KASHMIR BASTIONS',
    constraint: 'HEAVILY MINED GORGES AND RIDGE DEFENSES REQUIRING SAPPER CLEARANCE',
    initialState: {
      date: '18 March 1948',
      time: '07:15:00',
      campaignDay: 142,
      personnel: 5200,
      supplies: 68,
      morale: 95,
      enemyPressure: 55,
      weather: 'CLEAR',
      weatherDescription: 'Bright spring mountain sun, roads dry and passable for supply convoys.',
      visibilityPercent: 95
    },
    hotspotSectorId: 'jhangar',
    initialRadioMessages: [
      {
        id: 'rad-ch5-1',
        channel: 'COMMAND',
        timestamp: '07:20',
        senderName: 'BRIGADIER MOHAMMAD USMAN',
        senderRank: 'Brigadier (Commander 50 Para Bde)',
        callsign: 'TIGER-6',
        text: 'To all commanders: The hour of Jhangar has arrived. We move with speed, discipline, and courage. Not a yard of this soil shall be conceded.',
        urgent: true,
        isRead: false,
        options: [
          { id: 'opt-5a', label: 'Launch unified brigade advance on Jhangar heights', actionType: 'COUNTERATTACK' }
        ]
      }
    ]
  }
];
