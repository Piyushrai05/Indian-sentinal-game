export interface NewspaperArticle {
  chapterId: string;
  newspaperName: string;
  city: string;
  date: string;
  issuePrice: string;
  bannerHeadline: string;
  subHeadline: string;
  leadParagraph: string;
  secondaryArticleTitle: string;
  secondaryArticleSnippet: string;
  editorialSnippet: string;
  wirePhotoCaption: string;
}

export const HISTORICAL_NEWSPAPERS: Record<string, NewspaperArticle> = {
  'chapter-1-frontier': {
    chapterId: 'chapter-1-frontier',
    newspaperName: 'THE HINDUSTAN TIMES',
    city: 'NEW DELHI',
    date: 'Wednesday, 29 October 1947',
    issuePrice: 'TWO ANNAS',
    bannerHeadline: 'INDIAN TROOPS RUSHED TO SRINAGAR BY AIR AS TRIBAL INVADERS NEAR CAPITAL',
    subHeadline: 'Maharaja Hari Singh Signs Instrument of Accession — Heroic Defense at Baramulla',
    leadParagraph: 'NEW DELHI — In a dramatic dawn airlift spearheaded by Royal Indian Air Force and civil Dakota aircraft, troops of the 1st Sikh Regiment under Lt. Col. Dewan Ranjit Rai landed at Srinagar airstrip yesterday morning to stem the blitzkrieg assault of over 5,000 armed raiders advancing down the Kohala-Baramulla highway.',
    secondaryArticleTitle: 'BARAMULLA SACKED BY INVADING TRIBAL HORDES',
    secondaryArticleSnippet: 'Reports from the frontier confirm widespread pillage and devastation across Baramulla town. St. Joseph\'s Convent was attacked, leaving civilian casualties before raiders paused their march to loot.',
    editorialSnippet: '"The airlift to Srinagar represents one of the most daring aerial mobilizations in military history. The fate of the entire Kashmir Valley now hangs on the thin perimeter defense holding the dusty airfield."',
    wirePhotoCaption: 'Douglas C-47 Dakotas of No. 12 Squadron IAF landing reinforcements on the unimproved dirt strip outside Srinagar.'
  },
  'chapter-2-defence': {
    chapterId: 'chapter-2-defence',
    newspaperName: 'THE STATESMAN',
    city: 'CALCUTTA & NEW DELHI',
    date: 'Saturday, 08 November 1947',
    issuePrice: 'TWO ANNAS',
    bannerHeadline: 'ROUT AT SHALATENG: ENEMY SMASHED IN DARING TRIPLE-ENVELOPMENT BLOW',
    subHeadline: 'Brigadier Sen\'s Armored Spearhead Destroys Raider Vanguard — Baramulla Road Reopened',
    leadParagraph: 'SRINAGAR — In a brilliant tactical trap conceived by 161 Infantry Brigade, Indian Army forces yesterday annihilated the main hostile invasion force at Shalateng junction, just five miles outside Srinagar. Over 300 enemy combatants were neutralized as Daimler armored cars struck from the rear.',
    secondaryArticleTitle: 'VALLEY SECURED FROM IMMEDIATE COLLAPSE',
    secondaryArticleSnippet: 'Panic in Srinagar has subsided into scenes of jubilation as forward columns of 1st Sikh and 1st Kumaon pursue retreating raiders past Patan towards Baramulla.',
    editorialSnippet: '"The Battle of Shalateng will enter military annals as a textbook masterstroke of deception, firepower concentration, and armored flanking."',
    wirePhotoCaption: 'Daimler Armored Cars of the 7th Light Cavalry crossing canal dikes during the decisive flanking maneuver.'
  },
  'chapter-3-pressure': {
    chapterId: 'chapter-3-pressure',
    newspaperName: 'THE TRIBUNE',
    city: 'AMBALA / EAST PUNJAB',
    date: 'Tuesday, 16 December 1947',
    issuePrice: 'TWO ANNAS',
    bannerHeadline: 'GARRISON HOLDS AT POONCH UNDER DEVILISH SIEGE IN PIR PANJAL MOUNTAINS',
    subHeadline: 'Wing Commander Mehar Singh Lands Dakota on 600-Yard Mud Strip Under Enemy Shellfire',
    leadParagraph: 'POONCH FRONT — Cut off from land communications by hostile forces controlling the high ridgelines, Brigadier Pritam Singh\'s isolated garrison of 40,000 refugees and defenders was relieved yesterday when Air Commodore "Baba" Mehar Singh landed the first Dakota on a hastily constructed mountain runway.',
    secondaryArticleTitle: 'CIVILIAN POPULATION BRAVES STARVATION & ARTILLERY',
    secondaryArticleSnippet: 'Citizens of Poonch carved a landing field out of apple orchards in five days using shovels and bare hands while enemy mortars rained shrapnel from surrounding crests.',
    editorialSnippet: '"The tenacity of the Poonch garrison is an epic of endurance. Every sack of grain flown over the snow-bound Banihal Pass is a lifeline snatched from the jaws of defeat."',
    wirePhotoCaption: 'Refugees and soldiers unloading ammunition and winter supplies from an IAF Dakota on the Poonch airstrip.'
  },
  'chapter-4-strike': {
    chapterId: 'chapter-4-strike',
    newspaperName: 'THE TIMES OF INDIA',
    city: 'BOMBAY',
    date: 'Saturday, 07 February 1948',
    issuePrice: 'TWO ANNAS',
    bannerHeadline: 'HEROIC STAND AT TAINDHAR RIDGE: "LION OF NAUSHERA" REPELS 10,000 RAIDERS',
    subHeadline: 'Naik Jadunath Singh Holds Picket to the Last Bullet — Massive Counter-Thrust Retakes Jhangar',
    leadParagraph: 'NAUSHERA SECTOR — In one of the fiercest engagements of the entire campaign, the 50th Indian Parachute Brigade under Brigadier Mohammad Usman shattered a ferocious assault by ten thousand enemy raiders aiming to sever Jammu from the Kashmir Valley.',
    secondaryArticleTitle: 'THE BATTLE FOR PICQUET NO. 2',
    secondaryArticleSnippet: 'Naik Jadunath Singh of 1 Rajput single-handedly engaged waves of charging enemy riflemen with a Bren gun despite being wounded repeatedly, saving the entire ridge.',
    editorialSnippet: '"Brigadier Usman\'s vow never to sleep on a cot until Jhangar was liberated has inspired his paratroopers to legendary feats of valor across the Jammu hills."',
    wirePhotoCaption: 'Indian Paratroopers fortifying stone sangars on the rugged windswept slopes of Taindhar Ridge.'
  },
  'chapter-5-consolidation': {
    chapterId: 'chapter-5-consolidation',
    newspaperName: 'THE HINDUSTAN TIMES',
    city: 'NEW DELHI',
    date: 'Sunday, 21 November 1948',
    issuePrice: 'TWO ANNAS',
    bannerHeadline: 'STUART TANKS SCALE 11,500-FOOT ZOJI LA PASS: LEH & LADAKH SAVED FROM SIEGE',
    subHeadline: 'Operation Bison Stuns World Military Observers — Highest Armored Assault in History',
    leadParagraph: 'ZOJI LA PASS — In an audacity unmatched in modern warfare, 7th Cavalry Stuart Mark VI light tanks dismantled and reassembled in blizzards broke through the enemy fortifications at the windswept 11,500-foot Zoji La pass, linking Srinagar with Kargil and Leh.',
    secondaryArticleTitle: 'MAJ. GEN. THORAT & AIR COMD. MEHAR SINGH PRAISED',
    secondaryArticleSnippet: 'Coordinated air strikes and high-altitude armor drove the enemy from caves on Gumri basin, cementing India\'s northern Himalayan frontier before winter snows closed the pass.',
    editorialSnippet: '"From the desperate defense of Srinagar airstrip in October 1947 to the armored ascent of Zoji La, the Indian Armed Forces have secured an immortal chapter of valor in the Himalayas."',
    wirePhotoCaption: 'Stuart Light Tanks advancing through five-foot snowdrifts along the narrow mountain defile of Zoji La.'
  }
};
