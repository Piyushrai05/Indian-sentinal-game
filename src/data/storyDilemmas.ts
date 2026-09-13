export interface StoryDilemmaOption {
  id: string;
  label: string;
  description: string;
  riskDescription: string;
  rewardDescription: string;
  statEffects: {
    moraleDelta: number;
    suppliesDelta: number;
    defenseDelta: number;
    personnelDelta: number;
    pressureDelta: number;
  };
  narrativeOutcome: string;
  medalUnlock?: 'PVC' | 'MVC' | 'VrC' | 'MENTION_IN_DISPATCHES';
}

export interface StoryDilemma {
  id: string;
  chapterNumber: number;
  sectorId: string;
  title: string;
  contextHeader: string;
  urgency: 'URGENT' | 'CRITICAL' | 'STRATEGIC';
  situationSummary: string;
  narrativeLore: string;
  officerCallsign: string;
  officerName: string;
  officerPortrait: string;
  options: StoryDilemmaOption[];
}

export const CAMPAIGN_DILEMMAS: StoryDilemma[] = [
  {
    id: 'dilemma-ch1-badgam',
    chapterNumber: 1,
    sectorId: 'srinagar',
    title: 'THE CRISIS AT BADGAM MOUNDS',
    contextHeader: '3 NOVEMBER 1947 // 14:30 HRS // BADGAM SECTOR',
    urgency: 'CRITICAL',
    situationSummary: 'Major Somnath Sharma\'s company of 4 Kumaon is surrounded on three sides by 700 tribal raiders disguised in Kashmiri pherans. The airstrip is only 3 miles behind them.',
    narrativeLore: 'Enemy 3-inch mortar fire has severed landline telegraph cables. Major Somnath Sharma has his left arm in a plaster cast from a previous polo injury, yet is personally filling Bren gun magazines for his riflemen.',
    officerName: 'Major Somnath Sharma',
    officerCallsign: 'KUMAON-1',
    officerPortrait: 'MAJ',
    options: [
      {
        id: 'opt-badgam-hold',
        label: 'STAND FAST: "FIGHT TO LAST MAN & LAST ROUND"',
        description: 'Order 4 Kumaon to hold their sangars at Badgam at all costs until 1st Kumaon reserves arrive from Srinagar.',
        riskDescription: 'Severe casualties among forward pickets; heroic sacrifice required.',
        rewardDescription: 'Completely blocks raider advance on Srinagar runway, saving capital from capture.',
        statEffects: {
          moraleDelta: +18,
          suppliesDelta: -10,
          defenseDelta: +25,
          personnelDelta: -120,
          pressureDelta: -22
        },
        narrativeOutcome: 'Major Somnath Sharma transmits his immortal words: "I shall not withdraw an inch but will fight to our last man and our last round." 4 Kumaon repels waves of assaults until relieving forces arrive, saving Srinagar airstrip.',
        medalUnlock: 'PVC'
      },
      {
        id: 'opt-badgam-tactical',
        label: 'COORDINATED FIGHTING WITHDRAWAL TO RUNWAY PERIMETER',
        description: 'Authorize an orderly fighting retreat to the inner sandbag perimeter of the airstrip with 25-pounder smoke screen support.',
        riskDescription: 'Raiders get within mortar range of aircraft parked on the dirt strip.',
        rewardDescription: 'Preserves trained infantry personnel for the coming counter-offensive.',
        statEffects: {
          moraleDelta: -5,
          suppliesDelta: -5,
          defenseDelta: +10,
          personnelDelta: -30,
          pressureDelta: +12
        },
        narrativeOutcome: '4 Kumaon conducts a disciplined withdrawal under smoke cover. While casualties are minimized, raider mortar shells crater the edge of the runway, delaying evening Dakota supply sorties.',
        medalUnlock: 'VrC'
      }
    ]
  },
  {
    id: 'dilemma-ch2-canal',
    chapterNumber: 2,
    sectorId: 'baramulla',
    title: 'THE SUMBAL CANAL AMBUSH OPPORTUNITY',
    contextHeader: '7 NOVEMBER 1947 // 09:00 HRS // SHALATENG AXIS',
    urgency: 'STRATEGIC',
    situationSummary: '7th Light Cavalry armored cars under Lt. Noel David have discovered an unguarded wooden canal bridge leading directly behind the enemy main body at Shalateng.',
    narrativeLore: 'The bridge timber is old and might give way under the 7-ton weight of Daimler armored cars. If it holds, the enemy will be trapped between anvil and hammer.',
    officerName: 'Brigadier L.P. Sen',
    officerCallsign: 'TIGER-161',
    officerPortrait: 'BRIG',
    options: [
      {
        id: 'opt-canal-commit',
        label: 'FORCE CANAL CROSSING WITH ARMORED CARS',
        description: 'Send the entire troop of Daimler and Humber armored cars across the canal to sever the enemy retreat road to Baramulla.',
        riskDescription: 'Lead vehicle risks falling through wooden planks if bridge collapses.',
        rewardDescription: 'Total encirclement and crushing defeat of the enemy raider force.',
        statEffects: {
          moraleDelta: +22,
          suppliesDelta: -12,
          defenseDelta: +30,
          personnelDelta: -45,
          pressureDelta: -35
        },
        narrativeOutcome: 'The bridge creaks under the armored hulls but holds! 7th Cavalry erupts behind the raider lines with machine guns, turning their assault into a headlong rout toward Baramulla.',
        medalUnlock: 'MVC'
      },
      {
        id: 'opt-canal-airpin',
        label: 'PIN WITH ARTILLERY AND CALL IAF HARVARD STRAFING',
        description: 'Direct 25-pounder field guns to lay down continuous high-explosive barrages while RIAF Harvard and Spitfire planes strafe the defile.',
        riskDescription: 'Gives raiders time to disperse into mountain ravines and escape capture.',
        rewardDescription: 'Zero vehicle loss; safe and overwhelming firepower suppression.',
        statEffects: {
          moraleDelta: +12,
          suppliesDelta: -20,
          defenseDelta: +15,
          personnelDelta: -15,
          pressureDelta: -18
        },
        narrativeOutcome: 'Devastating air strikes and artillery pound the Shalateng junction. The raiders scatter in disorder, abandoning truckloads of ammunition and heavy weapons.',
        medalUnlock: 'VrC'
      }
    ]
  },
  {
    id: 'dilemma-ch3-airlift',
    chapterNumber: 3,
    sectorId: 'poonch',
    title: 'THE NIGHT DAKOTA FLIGHT TO THE POONCH STRIP',
    contextHeader: '16 DECEMBER 1947 // 22:15 HRS // POONCH SECTOR',
    urgency: 'CRITICAL',
    situationSummary: 'The Poonch garrison is down to 2 days of food rations and 50 rounds per rifle. Blizzard winds are howling across Banihal Pass, and the landing strip is surrounded by enemy mountain guns.',
    narrativeLore: 'Air Commodore Mehar Singh steps forward: "We fly tonight without night-landing lights. Light two kerosene lanterns on the strip when you hear my twin Pratt & Whitney engines."',
    officerName: 'Air Commodore Mehar Singh',
    officerCallsign: 'BABA-1',
    officerPortrait: 'AIR',
    options: [
      {
        id: 'opt-airlift-dare',
        label: 'AUTHORIZE NIGHT LANDING RUNWAY SORTIE',
        description: 'Clear Wing Commander Mehar Singh and Gen. Thimayya to attempt the hazardous night landing on the short 600-yard dirt strip.',
        riskDescription: 'High risk of crash into surrounding mountain slopes or enemy sniper fire on touch-down.',
        rewardDescription: 'Delivers 25-pounder mountain guns and ammo, breaking the siege encirclement.',
        statEffects: {
          moraleDelta: +30,
          suppliesDelta: +40,
          defenseDelta: +25,
          personnelDelta: -10,
          pressureDelta: -28
        },
        narrativeOutcome: 'Baba Mehar Singh touches down cleanly in pitch darkness guided only by two lanterns! 25-pounder mountain guns are rolled out, shocking the besieging raiders with unexpected artillery fire.',
        medalUnlock: 'MVC'
      },
      {
        id: 'opt-airlift-airdrop',
        label: 'EXECUTE HIGH-ALTITUDE CANISTER PARACHUTE DROPS',
        description: 'Drop supplies by parachute from 8,000 feet above enemy flak range.',
        riskDescription: '40% of supply canisters may drift onto hostile-held ridges and ravines.',
        rewardDescription: 'Protects valuable IAF transport aircraft and aircrew.',
        statEffects: {
          moraleDelta: +10,
          suppliesDelta: +18,
          defenseDelta: +8,
          personnelDelta: 0,
          pressureDelta: -10
        },
        narrativeOutcome: 'Parachute canisters float down over the valley. While some are lost in gorges, essential ammunition reaches the garrison, stabilizing the defensive perimeter.',
        medalUnlock: 'MENTION_IN_DISPATCHES'
      }
    ]
  },
  {
    id: 'dilemma-ch4-taindhar',
    chapterNumber: 4,
    sectorId: 'naushera',
    title: 'THE DEFENSE OF PICQUET NO. 2 (TAINDHAR RIDGE)',
    contextHeader: '6 FEBRUARY 1948 // 06:40 HRS // NAUSHERA FRONT',
    urgency: 'CRITICAL',
    situationSummary: 'Over 3,000 enemy combatants launch an overwhelming dawn assault up Taindhar Ridge. Naik Jadunath Singh of 1 Rajput is in command of the forward post with only nine men.',
    narrativeLore: 'Two waves of raiders have been repulsed, but all nine defenders except Jadunath are dead or wounded. A third and larger wave of enemy is charging up the crest.',
    officerName: 'Brigadier Mohammad Usman',
    officerCallsign: 'LION-USMAN',
    officerPortrait: 'BRIG',
    options: [
      {
        id: 'opt-taindhar-heroic',
        label: 'COUNTER-CHARGE FROM PICQUET WITH STEN GUN',
        description: 'Single-handedly leap from the stone sangar to surprise and break the enemy charge with fierce close-quarters fire.',
        riskDescription: 'Mortal danger to the post commander under point-blank crossfire.',
        rewardDescription: 'Shatters enemy morale completely; saves entire Naushera valley from breakthrough.',
        statEffects: {
          moraleDelta: +35,
          suppliesDelta: -5,
          defenseDelta: +35,
          personnelDelta: -18,
          pressureDelta: -40
        },
        narrativeOutcome: 'Naik Jadunath Singh charges into the charging enemy ranks, firing with indomitable fury. Bewildered and panicked by his lone courage, the enemy wave breaks and flees down the valley!',
        medalUnlock: 'PVC'
      },
      {
        id: 'opt-taindhar-smoke',
        label: 'CONCENTRATE 3-INCH BRIGADE MORTAR BARRAGE ON OWN POST',
        description: 'Call defensive mortar fire directly onto the picquet perimeter while surviving wounded shelter in stone sangars.',
        riskDescription: 'Friendly shrapnel danger to wounded pickets.',
        rewardDescription: 'Wipes out the assaulting raider concentration on the ridge.',
        statEffects: {
          moraleDelta: +15,
          suppliesDelta: -15,
          defenseDelta: +20,
          personnelDelta: -30,
          pressureDelta: -25
        },
        narrativeOutcome: 'Brigade mortars plaster the crest with high explosives. The enemy assault collapses under devastating shellfire, holding Taindhar Ridge for the 50th Parachute Brigade.',
        medalUnlock: 'MVC'
      }
    ]
  },
  {
    id: 'dilemma-ch5-zojila',
    chapterNumber: 5,
    sectorId: 'skardu',
    title: 'THE TANK ASSAULT ACROSS ZOJI LA BLIZZARD (OPERATION BISON)',
    contextHeader: '1 NOVEMBER 1948 // 10:30 HRS // ZOJI LA PASS (11,500 FT)',
    urgency: 'STRATEGIC',
    situationSummary: 'Stuart light tanks of 7th Cavalry have been winched up the sheer cliffside tracks of Zoji La. A howling Himalayan blizzard has reduced visibility to 15 yards.',
    narrativeLore: 'Enemy snipers and mountain guns occupy caves along the sheer limestone cliffs of the Gumri Basin. No armored tank has ever fought at this altitude in human history.',
    officerName: 'General K.S. Thimayya',
    officerCallsign: 'TIMMY-HQ',
    officerPortrait: 'GEN',
    options: [
      {
        id: 'opt-zojila-armor',
        label: 'UNLEASH 37MM TANK CANNONS THROUGH SNOWDRIFTS',
        description: 'Order Stuart tanks to push through 5-foot snowbanks and fire directly into enemy mountain gun embrasures.',
        riskDescription: 'Tanks risking slipping off the icy single-lane precipice into the abyss.',
        rewardDescription: 'Stuns and pulverizes enemy mountain defenses; opens the road to Dras and Kargil.',
        statEffects: {
          moraleDelta: +40,
          suppliesDelta: -25,
          defenseDelta: +40,
          personnelDelta: -20,
          pressureDelta: -50
        },
        narrativeOutcome: 'The appearance of 7-ton Stuart tanks firing high explosive shells at 11,500 feet terrifies the enemy defenders, who believed tanks could never climb the pass. Zoji La is forced in a single morning!',
        medalUnlock: 'MVC'
      },
      {
        id: 'opt-zojila-patrol',
        label: 'SLOW SIKH & GORKHA INFANTRY NIGHT INFILTRATION',
        description: 'Send Gorkha and Sikh mountain pickets across high glacier ridges to outflank enemy caves under night cover.',
        riskDescription: 'Heavy frostbite casualties and delayed relief of Kargil before deep winter.',
        rewardDescription: 'Conserves precious armored vehicles from mountain hazards.',
        statEffects: {
          moraleDelta: +20,
          suppliesDelta: -10,
          defenseDelta: +20,
          personnelDelta: -45,
          pressureDelta: -25
        },
        narrativeOutcome: 'Gorkha kukri assaults clear the cliff embrasures after three days of fierce close combat in sub-zero snows, consolidating Indian control over the gateway to Ladakh.',
        medalUnlock: 'VrC'
      }
    ]
  }
];
