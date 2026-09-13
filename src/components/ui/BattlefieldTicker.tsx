import React from 'react';
import { AlertCircle, ShieldAlert, Radio, Route, CheckCircle, Info } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

export const BattlefieldTicker: React.FC = () => {
  const events = useGameStore(s => s.battlefieldEvents);
  const activeEvent = events.find(e => !e.resolved) || events[0];

  if (!activeEvent) return null;

  const getSeverityStyle = () => {
    switch (activeEvent.severity) {
      case 'CRITICAL':
        return 'bg-[#261212]/95 border-danger text-[#fed7d7] shadow-danger-glow/30';
      case 'WARN':
        return 'bg-[#24190e]/95 border-amber text-[#feebc8] shadow-sm';
      default:
        return 'bg-[#181713]/95 border-brass/40 text-paper shadow-sm';
    }
  };

  const getIcon = () => {
    switch (activeEvent.type) {
      case 'CONTACT_DETECTED':
      case 'ENEMY_ATTACK':
        return <ShieldAlert className="w-4 h-4 text-danger animate-pulse" />;
      case 'SUPPLY_INTERRUPTED':
        return <Route className="w-4 h-4 text-amber" />;
      case 'UNIT_ARRIVED':
      case 'RECON_COMPLETE':
        return <CheckCircle className="w-4 h-4 text-secure" />;
      default:
        return <Radio className="w-4 h-4 text-brass" />;
    }
  };

  return (
    <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none select-none max-w-2xl w-full px-4 animate-fadeIn">
      <div className={`p-2.5 rounded-lg border backdrop-blur-md flex items-center justify-between gap-3 ${getSeverityStyle()}`}>
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="flex-shrink-0">{getIcon()}</div>
          <div className="truncate">
            <div className="font-condensed font-bold text-xs uppercase tracking-wider truncate">
              {activeEvent.title}
            </div>
            <div className="text-[11px] font-serif text-lightText/90 truncate">
              {activeEvent.description}
            </div>
          </div>
        </div>

        <span className="font-mono text-[10px] text-brass flex-shrink-0">
          {activeEvent.time}
        </span>
      </div>
    </div>
  );
};
