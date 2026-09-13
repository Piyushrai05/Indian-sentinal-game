import React, { useState } from 'react';
import { Radio, X, Send, Volume2, Shield, MessageSquare, AlertCircle, ChevronRight } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { RadioChannel } from '../../types/game';

export const RadioDeck: React.FC = () => {
  const isRadioOpen = useGameStore(s => s.isRadioOpen);
  const closeRadio = useGameStore(s => s.closeRadio);
  const radioMessages = useGameStore(s => s.radioMessages);
  const activeRadioChannel = useGameStore(s => s.activeRadioChannel);
  const setActiveRadioChannel = useGameStore(s => s.setActiveRadioChannel);
  const respondToRadioOption = useGameStore(s => s.respondToRadioOption);

  const channels: RadioChannel[] = ['COMMAND', 'FIELD', 'INTELLIGENCE', 'LOGISTICS', 'AIR'];

  const filteredMessages = radioMessages.filter(m => m.channel === activeRadioChannel);

  if (!isRadioOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-md select-none animate-fadeIn">
      <div className="max-w-3xl w-full bg-panel border-2 border-brass/50 rounded-lg shadow-military overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="bg-panelLight border-b border-brass/30 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Radio className="w-5 h-5 text-amber animate-pulse" />
            <div>
              <div className="text-[10px] font-condensed font-bold tracking-widest text-brass uppercase">
                FIELD WIRELESS TELEGRAPHY & RADIO TRANSCEIVER
              </div>
              <h2 className="font-condensed font-extrabold text-lg text-paper uppercase tracking-wider">
                TACTICAL COMMUNICATIONS DECK
              </h2>
            </div>
          </div>
          <button
            onClick={closeRadio}
            className="p-1 rounded hover:bg-void text-muted hover:text-paper"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Channel Selector Bar */}
        <div className="flex border-b border-brass/25 bg-void/80 px-4 py-2 gap-2 overflow-x-auto">
          {channels.map(chan => {
            const unreadCount = radioMessages.filter(m => m.channel === chan && !m.isRead).length;
            return (
              <button
                key={chan}
                onClick={() => setActiveRadioChannel(chan)}
                className={`px-3 py-1 rounded text-xs font-condensed font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 ${
                  activeRadioChannel === chan
                    ? 'bg-brass/25 border border-brass text-paper shadow-sm'
                    : 'bg-panelLight/40 border border-brass/10 text-muted hover:text-paper'
                }`}
              >
                <span>{chan}</span>
                {unreadCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-danger text-white text-[9px] flex items-center justify-center font-mono">
                    {unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Messages Stream */}
        <div className="p-5 flex-1 overflow-y-auto space-y-3 custom-scrollbar bg-[#0f0e0c]">
          {filteredMessages.length === 0 ? (
            <div className="text-center text-muted text-xs font-mono py-8">
              [ NO ACTIVE RADIO TRAFFIC ON CHANNEL {activeRadioChannel} ]
            </div>
          ) : (
            filteredMessages.map(msg => (
              <div
                key={msg.id}
                className={`p-3.5 rounded border transition-all ${
                  msg.urgent
                    ? 'bg-[#211614] border-danger/50 shadow-danger-glow/20'
                    : 'bg-panel border-brass/20'
                }`}
              >
                <div className="flex items-center justify-between border-b border-brass/15 pb-1.5 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-brass font-bold">{msg.timestamp} HRS</span>
                    <span className="text-xs font-condensed font-bold text-paper uppercase">
                      {msg.senderName} ({msg.callsign})
                    </span>
                  </div>
                  {msg.urgent && (
                    <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-danger/20 border border-danger text-danger">
                      URGENT DISPATCH
                    </span>
                  )}
                </div>

                <p className="text-xs font-serif text-lightText/95 leading-relaxed mb-3">
                  "{msg.text}"
                </p>

                {/* Interactive Commander Options */}
                {msg.options && msg.options.length > 0 && (
                  <div className="border-t border-brass/15 pt-2.5 mt-2 flex flex-col gap-1.5">
                    <div className="text-[9px] font-condensed font-bold text-muted uppercase">
                      COMMANDER RESPONSE DIRECTIVE:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {msg.options.map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => respondToRadioOption(msg.id, opt)}
                          className="py-1.5 px-3 bg-brass/20 hover:bg-brass hover:text-void border border-brass text-paper text-xs font-condensed font-bold tracking-wider uppercase rounded transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>{opt.label}</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
