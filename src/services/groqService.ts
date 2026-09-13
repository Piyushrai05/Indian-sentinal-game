// Groq AI Integration Service for Historical Officer Personas & Dynamic Field Dispatches

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

export interface OfficerCharacter {
  id: string;
  name: string;
  rank: string;
  regiment: string;
  role: string;
  callsign: string;
  avatarBadge: string;
  systemPrompt: string;
}

export const HISTORICAL_OFFICERS: Record<string, OfficerCharacter> = {
  usman: {
    id: 'usman',
    name: 'Brigadier Mohammad Usman',
    rank: 'Brigadier',
    regiment: '50th Indian Parachute Brigade',
    role: 'Theatre Field Commander ("Lion of Naushera")',
    callsign: 'TIGER-6',
    avatarBadge: 'BRIG',
    systemPrompt: `You are Brigadier Mohammad Usman, legendary commander of the 50th Indian Parachute Brigade during the 1947-1948 Kashmir War. You are courageous, highly strategic, inspiring, and deeply patriotic. You speak in concise 1940s military command English. You vowed never to sleep on a cot until Jhangar was recaptured. Give sharp tactical assessments and resolute orders.`
  },
  somnath: {
    id: 'somnath',
    name: 'Major Somnath Sharma',
    rank: 'Major (Param Vir Chakra)',
    regiment: '4th Battalion, Kumaon Regiment',
    role: 'Badgam & Srinagar Airfield Defense Commander',
    callsign: 'KUMAON-1',
    avatarBadge: 'MAJ',
    systemPrompt: `You are Major Somnath Sharma of 4 Kumaon, defending Badgam and Srinagar airfield in October 1947. You are courageous and steadfast under heavy raider mortar fire. You famously transmitted: "The enemy are only 50 yards from us. We are heavily outnumbered. We are under devastating fire. I shall not withdraw an inch but will fight to our last man and our last round." Speak in authentic 1947 field combat style.`
  },
  yadunath: {
    id: 'yadunath',
    name: 'Major Yadunath Singh',
    rank: 'Major (Param Vir Chakra)',
    regiment: '1st Battalion, Rajput Regiment',
    role: 'Taindhar Ridge Picket Commander (Naushera)',
    callsign: 'RAJPUT-9',
    avatarBadge: 'CAPT',
    systemPrompt: `You are Major Yadunath Singh of 1 Rajput, commanding the forward Taindhar Picket No. 2 at Naushera on 6 February 1948. You face waves of thousands of hostile raiders. You are fearless, tactical, and expert with Bren guns and grenades. Give fierce, gritty battlefield reports.`
  },
  mehar: {
    id: 'mehar',
    name: 'Air Commodore Mehar Singh',
    rank: 'Air Commodore ("Baba Mehar Singh")',
    regiment: 'No. 12 Squadron IAF',
    role: 'High-Altitude Airlift & Dakota Transport Wing Commander',
    callsign: 'EAGLE-LEADER',
    avatarBadge: 'AIR',
    systemPrompt: `You are Air Commodore Mehar Singh (DSO), pioneer of the IAF high-altitude airlift to Srinagar, Poonch dirt strip, and Leh. You fly twin-engine Douglas Dakotas through treacherous mountain passes and blizzard winds without oxygen equipment. You speak with calm airman confidence, technical precision, and audacity.`
  }
};

const officerAdviceCache = new Map<string, string>();

export async function askOfficerAdvice(
  officerId: string,
  sectorName: string,
  situationContext: string
): Promise<string> {
  const officer = HISTORICAL_OFFICERS[officerId] || HISTORICAL_OFFICERS.usman;
  const cacheKey = `${officerId}-${sectorName}`;

  if (officerAdviceCache.has(cacheKey)) {
    return officerAdviceCache.get(cacheKey)!;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2500);

  try {
    const response = await fetch(GROQ_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: officer.systemPrompt },
          {
            role: 'user',
            content: `SITUATION REPORT: We are evaluating operational decisions at the ${sectorName} sector in Kashmir. ${situationContext}.
As ${officer.name} (${officer.rank}, ${officer.regiment}), give a 2-sentence direct tactical recommendation and commander's counsel for our next directive.`
          }
        ],
        temperature: 0.6,
        max_tokens: 120
      })
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Groq API returned status ${response.status}`);
    }

    const data = await response.json();
    const result = data.choices[0]?.message?.content?.trim() || `${officer.name}: Hold fast on the ridgeline. Lock 25-pounder artillery coordinates onto the defile.`;
    officerAdviceCache.set(cacheKey, result);
    return result;
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn('Groq API fast fallback:', err);
    // Deterministic lightning fallback
    let fallbackText = '';
    if (officerId === 'somnath') {
      fallbackText = `"The airfield runway must remain operational at all costs. 4 Kumaon will maintain interlocking machine gun crossfire from the Badgam mounds."`;
    } else if (officerId === 'yadunath') {
      fallbackText = `"Enemy concentration spotted in the ravine below Taindhar. Pickets 2 and 3 are ready with Bren guns. Counter-attack on their flank will shatter their assault."`;
    } else if (officerId === 'mehar') {
      fallbackText = `"Weather over Banihal pass is turbulent, but No. 12 Squadron Dakotas can punch through for night drop sorties if ground beacons are lit."`;
    } else {
      fallbackText = `"The defence of Kashmir demands moral courage and swift offensive action. Maintain forward pressure and do not cede the road junctions."`;
    }
    officerAdviceCache.set(cacheKey, fallbackText);
    return fallbackText;
  }
}
