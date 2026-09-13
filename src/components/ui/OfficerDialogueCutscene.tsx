import React, { useState, useEffect } from 'react';
import { Shield, MessageSquare, ArrowRight, Radio, Volume2, UserCheck, ChevronRight } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { HISTORICAL_OFFICERS } from '../../services/groqService';
import { soundEngine } from '../../engine/audioEngine';

export interface DialogueLine {
  speakerId: string;
  text: string;
  officerName: string;
  role: string;
  portrait: string;
}

export const OfficerDialogueCutscene: React.FC = () => {
  const gameScreen = useGameStore(s => s.gameScreen);
  const currentChapter = useGameStore(s => s.currentChapter);
  const setGameScreen = useGameStore(s => s.setGameScreen);

  const [currentLineIndex, setCurrentLineIndex] = useState<number>(0);
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  // Scripted historical dialogue for the chapter
  const dialogueScripts: Record<number, DialogueLine[]> = {
    1: [
      {
        speakerId: 'usman',
        officerName: 'Brigadier Mohammad Usman',
        role: 'Commander 50th Parachute Brigade',
        portrait: 'BRIG',
        text: 'Gentlemen, the fate of the Kashmir Valley hinges upon this airstrip. If raiders penetrate past Baramulla, Srinagar will fall before reinforcements can be organized.'
      },
      {
        speakerId: 'somnath',
        officerName: 'Major Somnath Sharma',
        role: '4th Battalion, Kumaon Regiment',
        portrait: 'MAJ',
        text: 'Sir, 4 Kumaon is moving into position at Badgam. We will hold the mounds between the raider axes and the runway. Not an inch of ground will be surrendered.'
      },
      {
        speakerId: 'mehar',
        officerName: 'Air Commodore Mehar Singh',
        role: 'IAF No. 12 Squadron Airlift Wing',
        portrait: 'AIR',
        text: 'Our Dakotas are flying round-the-clock sorties through Banihal pass. We will deliver ammunition and field artillery so long as your men keep the landing strip clear of enemy mortars.'
      }
    ],
    2: [
      {
        speakerId: 'usman',
        officerName: 'Brigadier Mohammad Usman',
        role: 'Commander 50th Parachute Brigade',
        portrait: 'BRIG',
        text: 'The enemy has concentrated at Shalateng. They believe we are trapped inside Srinagar. This is precisely where we spring the trap.'
      },
      {
        speakerId: 'sen',
        officerName: 'Brigadier L.P. Sen',
        role: 'Commander 161 Infantry Brigade',
        portrait: 'BRIG',
        text: '7th Cavalry armored cars have moved under darkness around their northern rear. When 1 Sikh attacks frontally, the enemy will break right into our armored machine guns.'
      }
    ],
    3: [
      {
        speakerId: 'mehar',
        officerName: 'Air Commodore Mehar Singh',
        role: 'IAF No. 12 Squadron Airlift Wing',
        portrait: 'AIR',
        text: 'Poonch is encircled by over 6,000 raiders on high ridges. Land communications are severed. We must attempt a night landing on their short dirt runway.'
      },
      {
        speakerId: 'usman',
        officerName: 'Brigadier Mohammad Usman',
        role: 'Commander 50th Parachute Brigade',
        portrait: 'BRIG',
        text: 'Authorize the sortie, Baba. Pritam Singh\'s garrison and 40,000 civilians have eaten their last rations. The air bridge is their only salvation.'
      }
    ],
    4: [
      {
        speakerId: 'yadunath',
        officerName: 'Naik Jadunath Singh',
        role: '1st Battalion, Rajput Regiment',
        portrait: 'NAIK',
        text: 'Enemy raiders numbering thousands are storming up Taindhar Ridge. Picquet No. 2 will fight with Bren guns and bayonets to the last man!'
      },
      {
        speakerId: 'usman',
        officerName: 'Brigadier Mohammad Usman',
        role: 'Lion of Naushera',
        portrait: 'BRIG',
        text: 'Stand steadfast, Rajputs! I have pledged not to sleep on a cot until Jhangar is liberated. The brigade is launching the counter-attack on your left flank now!'
      }
    ],
    5: [
      {
        speakerId: 'thimayya',
        officerName: 'General K.S. Thimayya',
        role: 'General Officer Commanding',
        portrait: 'GEN',
        text: 'Nobody believes tanks can fight at 11,500 feet in blizzards. That is why Operation Bison will succeed. Break through Zoji La and relieve Leh!'
      },
      {
        speakerId: 'usman',
        officerName: 'Brigadier Mohammad Usman',
        role: 'Theatre Command HQ',
        portrait: 'BRIG',
        text: 'May victory favor the brave. Unleash the Stuart armor through the snowbanks and secure the northern frontier of India!'
      }
    ]
  };

  const currentScript = dialogueScripts[currentChapter?.chapterNumber || 1] || dialogueScripts[1];
  const currentLine = currentScript[currentLineIndex] || currentScript[0];

  useEffect(() => {
    if (gameScreen !== 'CUTSCENE') return;

    soundEngine.playRadioStatic();
    setDisplayedText('');
    setIsTyping(true);

    let charIdx = 0;
    const fullText = currentLine.text;
    const timer = setInterval(() => {
      if (charIdx < fullText.length) {
        setDisplayedText(fullText.substring(0, charIdx + 1));
        if (charIdx % 3 === 0) soundEngine.playMorseBeep();
        charIdx++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 22);

    return () => clearInterval(timer);
  }, [gameScreen, currentLineIndex, currentLine.text]);

  if (gameScreen !== 'CUTSCENE') return null;

  const handleNextLine = () => {
    soundEngine.playPinClick();
    if (isTyping) {
      setDisplayedText(currentLine.text);
      setIsTyping(false);
      return;
    }

    if (currentLineIndex < currentScript.length - 1) {
      setCurrentLineIndex(prev => prev + 1);
    } else {
      // Finished dialogue -> Enter active battlefield
      setCurrentLineIndex(0);
      setGameScreen('COMMAND');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-6 bg-black/85 backdrop-blur-md select-none animate-fadeIn">
      <div className="max-w-4xl w-full bg-[#181510] border-4 border-brass/70 rounded-lg shadow-2xl p-6 mb-4">
        
        {/* Top Channel Bar */}
        <div className="flex items-center justify-between border-b border-brass/30 pb-2 mb-4">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-brass font-bold">
            <Radio className="w-4 h-4 text-amber animate-pulse" />
            <span>THEATRE COMMAND DIRECTIVE // SECURE FREQUENCY 47.8 MHZ</span>
          </div>
          <span className="text-[10px] font-mono text-paper/70">
            DIALOGUE {currentLineIndex + 1} OF {currentScript.length}
          </span>
        </div>

        {/* Speaker Profile & Speech Bubble */}
        <div className="flex items-start gap-5">
          <div className="w-20 h-20 rounded-xl bg-[#2a2318] border-2 border-brass flex flex-col items-center justify-center shadow-inner flex-shrink-0">
            <Shield className="w-7 h-7 text-amber mb-1" />
            <span className="text-[11px] font-mono font-black text-brass uppercase">{currentLine.portrait}</span>
          </div>

          <div className="flex-1">
            <div className="flex items-baseline gap-2 mb-1">
              <h3 className="font-condensed font-extrabold text-xl text-amber uppercase tracking-wider">
                {currentLine.officerName}
              </h3>
              <span className="text-xs font-serif text-paper/70 italic">({currentLine.role})</span>
            </div>

            <div className="min-h-[70px] bg-void/80 border border-brass/20 p-3.5 rounded text-sm font-serif text-paper/95 leading-relaxed italic shadow-inner">
              "{displayedText}"
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-4 border-t border-brass/20 mt-4">
          <div className="text-[11px] font-mono text-mutedText">
            Click continue or press <span className="font-bold text-brass">[SPACE]</span> to advance dialogue.
          </div>

          <button
            onClick={handleNextLine}
            className="py-2.5 px-6 bg-gradient-to-r from-brass to-amber hover:from-amber hover:to-brass text-void font-condensed font-extrabold text-xs tracking-widest uppercase rounded shadow-brass-glow transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>{currentLineIndex < currentScript.length - 1 ? 'CONTINUE TRANSMISSION' : 'ASSUME OPERATIONAL COMMAND'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
