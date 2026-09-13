# 🎖️ INDIAN SENTINEL : KASHMIR 1947
### *A Real-Time 3D Tactical Military Wargame & Historical Command Simulation*

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-r160-000000?style=for-the-badge&logo=three.dot.js&logoColor=white)](https://threejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-F59E0B?style=for-the-badge)](LICENSE)

<br />

**Command the Indian Army in historically authentic, high-stakes military operations across the Himalayan frontiers of Jammu, Kashmir, and Ladakh during the pivotal 1947–48 war.**

[Key Features](#-key-features) • [Satellite Modes](#-satellite-reconnaissance-modes) • [Historical Sectors](#-historical-battlefield-sectors) • [Weapons & Gun-Cam](#-live-weapons--gun-cam-system) • [Getting Started](#-getting-started) • [Controls](#-command-controls)

---

## 📖 Historical Context & Lore

In October 1947, following the partition of the subcontinent, armed tribal militias heavily reinforced by regular forces crossed the borders into the princely state of Jammu & Kashmir in *Operation Gulmarg*. With the accession treaty signed, the Indian Army executed one of the most audacious rapid airborne interventions in military history.

From the desperate stand of **Major Somnath Sharma (PVC)** at Badgam to **Brigadier Mohammad Usman's** fierce counter-offensive at Naushera, and **Air Commodore Mehar Singh's** legendary high-altitude landings at Poonch and Leh through unmapped Himalayan blizzard passes, **Indian Sentinel** places you directly inside the tactical war room.

---

## 🏔️ Key Features

### 1. Ultra-High-Resolution 3D Himalayan Topography
- **61,600-Vertex Dynamic Terrain Mesh** (280 × 220 grid) procedurally sculpted to faithfully match authentic Jammu, Kashmir, and Ladakh elevation contours.
- **9 Distinct Geological Zones**: Trans-Himalayas, Pir Panjal Mountain Wall, Kashmir Valley Basin, Jhelum River Gorge, Kishanganga Valley, Zanskar Range, Shiwalik Foothills, Jammu Plains, and the Leh-Ladakh High Altitude Plateau.
- **Glacial Hydrography**: Animated reflective water surfaces for the Jhelum River, Dal Lake, Wular Lake, Chenab River, and Kishanganga tributaries.
- **Micro-Detail Biomes**: 280 instanced organic Himalayan Pine & Deodar trees with procedurally generated snow-capped alpine peaks and valley foliage.
- **Atmospheric Physics**: Multi-layered drifting cumulus/stratus cloud layers, valley depth haze planes, and altitude-biased drifting Himalayan snow particle systems.

### 2. Authentic 3D Historical Landmarks & Units
- **Srinagar Airfield**: Concrete runway with animated landing lights, control tower, radar dome, aircraft hangars, fuel depots, and parked Douglas C-47 Dakota transport aircraft.
- **Jammu Bahu Fort**: Ancient citadel bastion with 4 stone corner towers, battlements, artillery batteries, Indian Tricolor flagpole, and night spotlights.
- **Baramulla Bridge**: Contested stone arch bridge spanning the Jhelum river with active muzzle flashes and sandbag fortifications.
- **Poonch Citadel**: 16-month besieged garrison with heavy 25-pounder artillery batteries.
- **Zoji La Pass**: Breakthrough point featuring M5A1 Stuart Light Tanks operating at record high altitudes.
- **Naushera & Jhangar**: Brigadier Usman Memorial, trench defense networks, and logistics hub with supply trucks and field depots.
- **Kargil & Leh High-Altitude Bases**: Remote frontier watch-towers, communication radio masts, and trans-Himalayan airstrip markers.

### 3. Advanced Tactical Post-Processing & Lighting
- **Cinema-Grade Post-Processing Pipeline** powered by `@react-three/postprocessing`:
  - Dynamic **Luminance Bloom** for glowing HUD reticles and NVG phosphor elements.
  - **Vignetting & Film Grain** for a rugged CRT tactical display aesthetic.
  - Mode-sensitive **Chromatic Aberration** during electronic satellite sweeps.
- **6-Light Dynamic Rig**: Solar zenith beam with 4096 × 4096 PCF soft shadows, golden hour Himalayan rim lighting, stratospheric earth-shine, and localized flickering battlefield campfires.

---

## 🛰️ Satellite Reconnaissance Modes

Switch tactical camera feeds in real time to analyze terrain, logistics, and enemy threats:

| View Mode | Visual Spectrum | Strategic Purpose |
|---|---|---|
| **STANDARD** | Photorealistic War-Room | Natural lighting, terrain relief elevation, vegetation density, and landmark visibility. |
| **OPTICAL** | High-Altitude Recon | True-color multispectral GIS imagery with clear supply routes and boundary lines. |
| **THERMAL** | FLIR Infrared Palette | Deep purple/crimson heat signature detection for enemy movement and active artillery. |
| **TOPOGRAPHIC** | Hypsometric Contour | High-contrast elevation contour mapping with clear altitude band delineation. |
| **STARLIGHT NVG** | Gen-II Green Phosphor | Night-vision interface featuring a continuous 360° radar sweep and distance range rings. |

---

## 🗺️ Historical Battlefield Sectors

The strategic map tracks 10 critical operational sectors during the 1947–48 campaign:

```
                      [LEH] 3,500m (Ladakh HQ)
                        ▲
                        │  (High-Altitude Route)
                        ▼
                   [KARGIL] 2,676m
                        ▲
                        │  (Zoji La Pass Corridor)
                        ▼
    [BARAMULLA] ────► [SRINAGAR] ◄──── [ZOJI LA] 3,528m
     (Jhelum Gate)     (Airbase HQ)     (Tank Breakthrough)
         │                  ▲
         ▼                  │
      [URI] ───────────────-┘
   (Border Defile)
         │
         ▼
     [POONCH] (Besieged Citadel)
         │
         ▼
     [JHANGAR] ◄────► [NAUSHERA]
   (Logistics Hub)   (Defense Line)
                            ▲
                            │
                            ▼
                         [JAMMU] (Southern Command Base)
```

1. **Srinagar (Capital / FOB)** — `34.0837° N, 74.7973° E` | Strategic airlift terminal.
2. **Baramulla (Frontline Defile)** — `34.2090° N, 74.3429° E` | Historic defensive bottleneck along the Jhelum canyon.
3. **Uri (Border Choke-Point)** — `34.0880° N, 74.0410° E` | Primary mountain access road to Muzaffarabad.
4. **Poonch (Besieged Garrison)** — `33.7700° N, 74.1000° E` | Isolated garrison supplied exclusively by night air drops.
5. **Naushera (Southern Shield)** — `33.1550° N, 74.2380° E` | Brigadier Usman's defensive line that broke the raider offensive.
6. **Jhangar (Logistics Axis)** — `33.2384° N, 74.0533° E` | Recaptured vital crossroads linking Jammu, Mirpur, and Poonch.
7. **Zoji La Pass (Alpine Breakthrough)** — `34.2800° N, 75.5000° E` | World's highest light tank assault in sub-zero blizzards.
8. **Kargil (Frontier Picket)** — `34.5553° N, 76.1320° E` | Crucial overland link between Kashmir Valley and Ladakh.
9. **Leh (Ladakh Command Terminal)** — `34.1526° N, 77.5771° E` | Trans-Himalayan outpost secured by Baba Mehar Singh's pioneering landing.
10. **Jammu (Army Base & Rear Depot)** — `32.7266° N, 74.8570° E` | Logistics staging area, railhead anchor, and hospital depot.

---

## 🎯 Live Weapons & Gun-Cam System

The game features an interactive arsenal supporting real-time strike deployment:

- **25-Pounder Artillery Barrage**: High-explosive field artillery with ballistic arc rendering and impact shockwaves.
- **IAF Air Strike Sortie**: Hawker Tempest CAS ground-attack runs on entrenched enemy columns.
- **WP-Smoke Screen**: Tactical white phosphorus obscurant aerosol deployment for frontline troop cover.
- **RL-6 Rocket Salvo**: Multi-tube rocket strike with live telemetry tracking.
- **100% Fullscreen Gun-Cam Feed (100vw × 100vh)**:
  - Live animated targeting reticle with azimuth and elevation telemetry.
  - CRT horizontal scanlines and holographic HUD overlay.
  - Optical filter grading with automated target acquisition tags.

---

## 🎖️ AI Officer Persona System

Consult legendary historical commanders for live tactical advice during complex strategic dilemmas:

- **Brigadier Mohammad Usman** (*"Lion of Naushera"*, 50th Parachute Brigade) — Bold counter-attack maneuvers and resolute holding orders.
- **Major Somnath Sharma, PVC** (*4th Kumaon*) — Uncompromising airfield perimeter defense and last-stand tactical doctrine.
- **Major Yadunath Singh, PVC** (*1st Rajput*) — Picket fortification, Bren gun crossfire traps, and close-quarter counter-assaults.
- **Air Commodore Mehar Singh, DSO** (*IAF No. 12 Squadron*) — Extreme weather air drops, dirt strip landings, and high-altitude transport logistics.

> *Officer advice operates with fast deterministic local offline fallbacks, or dynamic LLM intelligence when configured with an optional Groq API key.*

---

## 🕹️ Command Controls

| Input | Function | Description |
|---|---|---|
| **Left Click + Drag** | Orbit Camera | Rotate around the Himalayan theatre |
| **Right Click + Drag** | Pan Camera | Move the strategic view across sectors |
| **Mouse Wheel** | Zoom In / Out | Altitude control (from strategic satellite to low-altitude recon) |
| **Left Click Pin** | Sector Intel | Open sector garrison details, supply lines, and dilemma prompt |
| <kbd>F</kbd> Key | Fullscreen Cinema | Toggle cinema mode playing historical battlefield footage reels |
| <kbd>Esc</kbd> Key | Exit Modals | Close Gun-Cam, Tactical Dilemma, or Cinema Modal |

---

## 🚀 Getting Started

### System Requirements
- **Node.js**: v18.0.0 or newer
- **NPM**: v9.0.0 or newer
- **Browser**: Chrome, Edge, Brave, or Firefox with WebGL 2.0 support

### Installation Steps

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Piyushrai05/Indian-sentinal-game.git
   cd Indian-sentinal-game
   ```

2. **Install Dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **(Optional) Configure AI Officer Key:**
   Create a `.env.local` file in the project root:
   ```env
   VITE_GROQ_API_KEY=your_groq_api_key_here
   ```
   *(Note: The game is 100% functional offline with built-in historical dialogues if this key is omitted).*

4. **Launch Development Server:**
   ```bash
   npm run dev
   ```
   Open **http://localhost:5173** in your WebGL-capable browser.

5. **Build for Production Deployment:**
   ```bash
   npm run build
   npm run preview
   ```

---

## 🏗️ Architecture & Project Structure

```
Indian-sentinal-game/
├── public/
│   ├── images/              # NVG tactical maps & UI assets
│   └── videos/              # Historical Gun-Cam reels & background footage
├── src/
│   ├── components/
│   │   └── ui/              # React military HUD overlays
│   │       ├── MainMenu.tsx             # Landing interface & cinema launcher
│   │       ├── TopHUD.tsx               # War clock, resources, casualty stats
│   │       ├── SatelliteHUDOverlay.tsx  # NVG/Thermal switcher & sector profiles
│   │       ├── WeaponsArsenalDeck.tsx   # Fullscreen Gun-Cam strike feed
│   │       ├── LeftSectorsDrawer.tsx    # Regional filter tabs (Kashmir, Jammu, etc.)
│   │       └── FullscreenCinemaModal.tsx# 3-Reel fullscreen CRT cinema viewer
│   ├── three/               # Three.js 3D Rendering Pipeline
│   │   ├── SceneContainer.tsx       # Canvas, dynamic lighting & post-processing
│   │   ├── KashmirTerrain.tsx       # 280x220 vertex relief mesh & biomes
│   │   ├── Landmarks3D.tsx          # Airfields, Forts, Tanks, Artilleries
│   │   ├── LocationMarker3D.tsx     # Floating octahedral tactical pins
│   │   ├── FrontlineRibbon3D.tsx    # Contested boundary ribbons
│   │   ├── BattlefieldFX.tsx        # Shell craters, impact smoke, dust storms
│   │   ├── WeatherFX.tsx            # Blizzard snow, rain, and dawn mist
│   │   └── LiveWeaponsEngine.tsx    # Ballistic trajectory calculation
│   ├── store/
│   │   └── gameStore.ts     # Zustand centralized game state & logistics
│   ├── data/                # Historical 1947–48 orders of battle
│   │   ├── locations.ts     # 10 sector profiles & garrison stats
│   │   ├── routes.ts        # 9 interconnected mountain supply corridors
│   │   └── storyDilemmas.ts # Branching narrative military choices
│   └── types/
│       └── game.ts          # Strict TypeScript interfaces
├── index.html
├── tailwind.config.js       # Military brass/amber color palette tokens
└── vite.config.ts
```

---

## 📜 Historical Dedication

> *"We are outnumbered, we are outgunned, but we are not outfought."*

This simulation is dedicated to the gallant officers and men of the **Indian Armed Forces** — the 1st Sikh, 4th Kumaon, 1st Rajput, 50th Parachute Brigade, 7th Light Cavalry, No. 12 Squadron IAF, and the Jammu & Kashmir State Forces — who defended the frontiers under impossible odds in 1947–1948.

---

## 📄 License

This project is open-source software licensed under the **MIT License**. See [LICENSE](LICENSE) for full details.
