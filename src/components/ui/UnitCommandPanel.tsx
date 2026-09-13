import React, { useState, useMemo } from 'react';
import { Users, Route, ArrowRight, Shield, Flame, Package, CheckCircle, X, Send, AlertTriangle } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { planUnitMarch } from '../../engine/movementEngine';

export const UnitCommandPanel: React.FC = () => {
  const isUnitCommandOpen = useGameStore(s => s.isUnitCommandOpen);
  const closeUnitCommand = useGameStore(s => s.closeUnitCommand);
  const selectedUnitId = useGameStore(s => s.selectedUnitId);
  const units = useGameStore(s => s.units);
  const locations = useGameStore(s => s.locations);
  const supplyRoutes = useGameStore(s => s.supplyRoutes);
  const warState = useGameStore(s => s.warState);
  const dispatchUnitMarch = useGameStore(s => s.dispatchUnitMarch);

  const unit = units.find(u => u.id === selectedUnitId) || units[0];
  const currentLoc = locations.find(l => l.id === unit.locationId) || locations[0];

  const destinationOptions = useMemo(() => {
    return locations.filter(l => l.id !== unit.locationId);
  }, [locations, unit.locationId]);

  const [targetLocId, setTargetLocId] = useState<string>(destinationOptions[0]?.id || 'baramulla');

  const targetLoc = locations.find(l => l.id === targetLocId) || destinationOptions[0];

  // Calculate projected march plan
  const marchPlan = useMemo(() => {
    if (!targetLoc) return null;
    return planUnitMarch(unit, currentLoc, targetLoc, supplyRoutes, warState);
  }, [unit, currentLoc, targetLoc, supplyRoutes, warState]);

  if (!isUnitCommandOpen) return null;

  const handleConfirm = () => {
    if (marchPlan && targetLoc) {
      dispatchUnitMarch(unit.id, targetLoc.id, marchPlan);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-md select-none animate-fadeIn">
      <div className="max-w-xl w-full bg-panel border-2 border-brass/40 rounded-lg shadow-military overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-panelLight border-b border-brass/30 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 text-brass" />
            <div>
              <div className="text-[10px] font-condensed font-bold tracking-widest text-brass uppercase">
                OPERATIONAL TROOP REDEPLOYMENT DIRECTIVE
              </div>
              <h2 className="font-condensed font-extrabold text-lg text-paper uppercase tracking-wider">
                {unit.name} ({unit.designation})
              </h2>
            </div>
          </div>
          <button
            onClick={closeUnitCommand}
            className="p-1 rounded hover:bg-void text-muted hover:text-paper"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          
          {/* Unit Status Vitals */}
          <div className="grid grid-cols-4 gap-2 bg-void/70 border border-brass/20 p-2.5 rounded">
            <div>
              <div className="text-[9px] font-condensed text-mutedText uppercase">STRENGTH</div>
              <div className="font-mono font-bold text-xs text-lightText">{unit.strength}%</div>
              <div className="text-[8px] font-mono text-muted">{unit.currentPersonnel} TROOPS</div>
            </div>
            <div>
              <div className="text-[9px] font-condensed text-mutedText uppercase">MORALE</div>
              <div className="font-mono font-bold text-xs text-secure">{unit.morale}%</div>
              <div className="text-[8px] font-mono text-muted">RESOLVE</div>
            </div>
            <div>
              <div className="text-[9px] font-condensed text-mutedText uppercase">AMMUNITION</div>
              <div className="font-mono font-bold text-xs text-amber">{unit.ammo}%</div>
              <div className="text-[8px] font-mono text-muted">3" MORTARS</div>
            </div>
            <div>
              <div className="text-[9px] font-condensed text-mutedText uppercase">FATIGUE</div>
              <div className="font-mono font-bold text-xs text-danger">{unit.fatigue}%</div>
              <div className="text-[8px] font-mono text-muted">TIREDNESS</div>
            </div>
          </div>

          {/* Destination Selector */}
          <div>
            <label className="text-[10px] font-condensed font-bold tracking-wider text-brass uppercase block mb-1.5">
              SELECT OBJECTIVE DESTINATION SECTOR:
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {destinationOptions.map(dest => (
                <button
                  key={dest.id}
                  onClick={() => setTargetLocId(dest.id)}
                  className={`p-2 rounded border text-left transition-all ${
                    targetLocId === dest.id
                      ? 'bg-panelLight border-brass text-paper shadow-sm'
                      : 'bg-void/50 border-brass/15 text-muted hover:text-paper hover:border-brass/30'
                  }`}
                >
                  <div className="font-condensed font-bold text-xs uppercase leading-tight truncate">
                    {dest.name}
                  </div>
                  <div className="text-[9px] font-mono text-mutedText">
                    DEFENSE: {dest.currentDefense}%
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* March Transit Forecast */}
          {marchPlan && (
            <div className="bg-void/90 border border-brass/25 p-3.5 rounded space-y-2">
              <div className="flex items-center justify-between text-xs font-condensed font-bold text-paper border-b border-brass/15 pb-1.5">
                <span className="flex items-center gap-1.5">
                  <Route className="w-3.5 h-3.5 text-brass" />
                  <span>TRANSIT ROUTE: {currentLoc.name} -&gt; {targetLoc?.name}</span>
                </span>
                <span className="font-mono text-amber">ETA {marchPlan.etaMinutes} MIN</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs font-serif">
                <div className="text-muted">
                  <span className="text-[9px] font-condensed uppercase block text-mutedText">SUPPLY BURN:</span>
                  <span className="font-mono font-bold text-amber">-{marchPlan.supplyCost}% RATIONS</span>
                </div>
                <div className="text-muted">
                  <span className="text-[9px] font-condensed uppercase block text-mutedText">ROAD FATIGUE:</span>
                  <span className="font-mono font-bold text-danger">+{marchPlan.fatigueCost}% TIREDNESS</span>
                </div>
                <div className="text-muted">
                  <span className="text-[9px] font-condensed uppercase block text-mutedText">TACTICAL RISK:</span>
                  <span className="font-mono font-bold text-secure">MODERATE DEFENSIVE HOOK</span>
                </div>
              </div>

              <div className="text-[10px] font-serif italic text-mutedText border-l-2 border-brass/40 pl-2 mt-1">
                "Unit will physically march along mountain passes. Reinforces {targetLoc?.name} sector defense upon arrival."
              </div>
            </div>
          )}

          {/* Confirmation CTA */}
          <div className="pt-2">
            <button
              onClick={handleConfirm}
              className="w-full py-3 px-6 bg-gradient-to-r from-brass to-amber hover:from-amber hover:to-brass text-void font-condensed font-extrabold text-sm tracking-widest uppercase rounded shadow-brass-glow transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>CONFIRM & TRANSMIT MARCH ORDER</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
