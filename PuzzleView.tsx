import React, { useState, useEffect, useRef } from 'react';
import { PuzzleLevel, PuzzlePin, PuzzleZone, EntityType } from './types';

// Levels Definition
const LEVELS: PuzzleLevel[] = [
  {
    id: 1,
    name: "The King's Rescue",
    winCondition: 'TREASURE_COLLECTED',
    zones: [
      { id: 'z1', contents: ['HERO'], capacity: 1 },
      { id: 'z2', contents: ['TREASURE'], capacity: 2 }, 
    ],
    pins: [
      { id: 'p1', separates: ['z1', 'z2'], isHorizontal: true }
    ]
  },
  {
    id: 2,
    name: "Goblin Ambush",
    winCondition: 'TREASURE_COLLECTED',
    zones: [
      { id: 'top_left', contents: ['HERO'], capacity: 1 },
      { id: 'top_right', contents: ['GOBLIN'], capacity: 1 },
      { id: 'bottom', contents: ['TREASURE'], capacity: 3 },
    ],
    pins: [
      { id: 'p1', separates: ['top_left', 'bottom'], isHorizontal: true },
      { id: 'p2', separates: ['top_right', 'bottom'], isHorizontal: true },
    ]
  },
  {
    id: 3,
    name: "Molten Danger",
    winCondition: 'TREASURE_COLLECTED',
    zones: [
      { id: 'z1', contents: ['LAVA'], capacity: 5 },
      { id: 'z2', contents: ['WATER'], capacity: 5 },
      { id: 'z3', contents: ['HERO'], capacity: 5 },
      { id: 'z4', contents: ['TREASURE'], capacity: 5 },
    ],
    pins: [
      { id: 'p1', separates: ['z1', 'z2'], isHorizontal: true },
      { id: 'p2', separates: ['z2', 'z3'], isHorizontal: true },
      { id: 'p3', separates: ['z3', 'z4'], isHorizontal: true },
    ]
  },
  {
    id: 4,
    name: "The Double Trap",
    winCondition: 'TREASURE_COLLECTED',
    zones: [
      { id: 'z1', contents: ['LAVA'], capacity: 5 },
      { id: 'z2', contents: ['GOBLIN'], capacity: 5 },
      { id: 'z3', contents: ['WATER'], capacity: 5 },
      { id: 'z4', contents: ['HERO'], capacity: 5 },
      { id: 'z5', contents: ['TREASURE'], capacity: 5 },
    ],
    pins: [
        { id: 'p1', separates: ['z1', 'z2'], isHorizontal: true }, // Lava over Goblin
        { id: 'p2', separates: ['z2', 'z3'], isHorizontal: true }, // Goblin over Water
        { id: 'p3', separates: ['z3', 'z4'], isHorizontal: true }, // Water over Hero
        { id: 'p4', separates: ['z4', 'z5'], isHorizontal: true }, // Hero over Treasure
    ]
  },
  {
      id: 5,
      name: "The Great Divide",
      winCondition: 'TREASURE_COLLECTED',
      zones: [
          { id: 'left_top', contents: ['LAVA'], capacity: 2 },
          { id: 'right_top', contents: ['WATER'], capacity: 2 },
          { id: 'mid', contents: ['GOBLIN'], capacity: 2 },
          { id: 'hero_zone', contents: ['HERO'], capacity: 2 },
          { id: 'gold_zone', contents: ['TREASURE'], capacity: 2 }
      ],
      pins: [
          { id: 'p1', separates: ['left_top', 'mid'], isHorizontal: true },
          { id: 'p2', separates: ['right_top', 'mid'], isHorizontal: true },
          { id: 'p3', separates: ['mid', 'hero_zone'], isHorizontal: true },
          { id: 'p4', separates: ['hero_zone', 'gold_zone'], isHorizontal: true }
      ]
  }
];

interface PuzzleViewProps {
  initialLevel: number;
  onWin: (reward: number) => void;
  onClose: () => void;
}

export const PuzzleView: React.FC<PuzzleViewProps> = ({ initialLevel, onWin, onClose }) => {
  // Safe bounds check for level index
  const startIdx = Math.max(0, Math.min(initialLevel - 1, LEVELS.length - 1));
  const [levelIndex, setLevelIndex] = useState(startIdx);
  const [currentLevel, setCurrentLevel] = useState<PuzzleLevel>(JSON.parse(JSON.stringify(LEVELS[startIdx])));
  const [gameState, setGameState] = useState<'PLAYING' | 'WON' | 'LOST'>('PLAYING');
  const [message, setMessage] = useState('');
  
  // Reset level when levelIndex changes (handling next level navigation)
  useEffect(() => {
    setCurrentLevel(JSON.parse(JSON.stringify(LEVELS[levelIndex])));
    setGameState('PLAYING');
    setMessage('');
  }, [levelIndex]);

  // Game Loop
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const tick = () => {
      let changed = false;
      const newLevel = { 
        ...currentLevel, 
        zones: currentLevel.zones.map(z => ({...z, contents: [...z.contents]})) 
      };
      
      const originalPins = LEVELS[levelIndex].pins; 
      
      // 1. Flow Logic
      originalPins.forEach(p => {
        const isPinActive = newLevel.pins.some(activePin => activePin.id === p.id);
        
        if (!isPinActive) {
          const topZone = newLevel.zones.find(z => z.id === p.separates[0]);
          const botZone = newLevel.zones.find(z => z.id === p.separates[1]);

          // Gravity effect
          if (topZone && botZone && topZone.contents.length > 0) {
            const itemsToMove = [...topZone.contents];
            topZone.contents = []; 
            botZone.contents.push(...itemsToMove);
            changed = true;
          }
        }
      });

      // 2. Interaction Logic
      if (changed) {
        newLevel.zones.forEach(zone => {
           const c = zone.contents;
           
           // Interactions
           if (c.includes('LAVA') && c.includes('WATER')) {
             // Lava + Water = Rock (Remove both for simplicity, or effectively neutralize)
             zone.contents = zone.contents.filter(i => i !== 'LAVA' && i !== 'WATER');
           }
           
           if (c.includes('LAVA') && c.includes('GOBLIN')) {
             // Lava kills Goblin
             zone.contents = zone.contents.filter(i => i !== 'GOBLIN');
             // Lava remains
           }

           // Win/Loss
           if (c.includes('LAVA') && c.includes('HERO')) {
             setGameState('LOST');
             setMessage("The King has fallen into lava!");
           }
           else if (c.includes('GOBLIN') && c.includes('HERO')) {
             setGameState('LOST');
             setMessage("Ambushed by Goblins!");
           }
           else if (c.includes('LAVA') && c.includes('TREASURE')) {
             setGameState('LOST');
             setMessage("The treasure has melted away!");
           }
           else if (c.includes('HERO') && c.includes('TREASURE')) {
              // Ensure safety
              if (!c.includes('LAVA') && !c.includes('GOBLIN')) {
                  setGameState('WON');
                  setMessage("Kingdom Saved!");
              }
           }
        });
        
        setCurrentLevel(newLevel);
      }
    };

    const timerId = setTimeout(tick, 200);
    return () => clearTimeout(timerId);

  }, [currentLevel, gameState, levelIndex]);

  const removePin = (pinId: string) => {
    if (gameState !== 'PLAYING') return;
    setCurrentLevel(prev => ({
      ...prev,
      pins: prev.pins.filter(p => p.id !== pinId)
    }));
  };

  const handleClaim = () => {
    const reward = 1000 * (levelIndex + 1);
    onWin(reward);

    if (levelIndex + 1 < LEVELS.length) {
      setLevelIndex(prev => prev + 1);
    } else {
      // Completed all available levels
      onClose(); 
    }
  };

  const retry = () => {
    setCurrentLevel(JSON.parse(JSON.stringify(LEVELS[levelIndex])));
    setGameState('PLAYING');
    setMessage('');
  };

  const renderEntity = (e: EntityType, idx: number) => {
    const style = { animationDelay: `${idx * 0.1}s` };
    switch(e) {
      case 'HERO': return <div key={`e-${idx}`} style={style} className="text-4xl animate-bounce z-10 filter drop-shadow-md cursor-help transition-transform hover:scale-110" title="The King">🤴</div>;
      case 'TREASURE': return <div key={`e-${idx}`} style={style} className="text-4xl animate-pulse z-10 filter drop-shadow-md text-yellow-400" title="Gold">💰</div>;
      case 'LAVA': return <div key={`e-${idx}`} style={style} className="w-full h-full min-h-[1.5rem] bg-gradient-to-b from-orange-500 to-red-600 opacity-90 animate-pulse shadow-[inset_0_0_10px_rgba(255,0,0,0.8)] border-t border-red-400 rounded-sm"></div>;
      case 'WATER': return <div key={`e-${idx}`} style={style} className="w-full h-full min-h-[1.5rem] bg-gradient-to-b from-blue-400 to-blue-600 opacity-80 shadow-[inset_0_0_10px_rgba(0,0,255,0.5)] border-t border-blue-300 rounded-sm"></div>;
      case 'GOBLIN': return <div key={`e-${idx}`} style={style} className="text-4xl animate-bounce z-10 filter drop-shadow-md grayscale-[0.2]" title="Goblin">👹</div>;
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-[#2a2a2a] w-full max-w-md rounded-3xl border-[6px] border-amber-700 shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
        
        <div className="bg-gradient-to-r from-amber-800 to-amber-700 p-4 flex justify-between items-center border-b-4 border-amber-900 shadow-lg z-20 shrink-0">
           <h3 className="text-xl font-cinzel font-bold text-amber-100 drop-shadow-md flex items-center gap-2">
             <span className="text-2xl">🛡️</span> Level {levelIndex + 1}: {LEVELS[levelIndex].name}
           </h3>
           <button onClick={onClose} className="text-amber-200 hover:text-white bg-black/20 hover:bg-black/40 rounded-full w-8 h-8 flex items-center justify-center transition-colors">✕</button>
        </div>

        <div className="flex-1 relative bg-[url('https://www.transparenttextures.com/patterns/dark-brick-wall.png')] bg-stone-800 p-6 flex flex-col items-center justify-center overflow-hidden">
            
            <div className="w-full aspect-[3/4] max-h-[500px] relative bg-stone-900/80 rounded-xl border-4 border-stone-600 shadow-inner overflow-hidden ring-4 ring-black/20">
                 {/* Zones */}
                 {currentLevel.zones.map((zone) => (
                    <div key={zone.id} className={`absolute border border-white/5 flex flex-wrap content-end justify-center items-end p-2 transition-all duration-500 overflow-hidden
                        ${getLevelLayout(levelIndex, zone.id)}
                    `}>
                        {zone.contents.map((e, idx) => (
                          <div key={idx} className={`${(e === 'LAVA' || e === 'WATER') ? 'w-full flex-1' : ''} flex justify-center`}>
                             {renderEntity(e, idx)}
                          </div>
                        ))}
                    </div>
                 ))}

                 {/* Pins */}
                 {currentLevel.pins.map(pin => (
                   <div 
                      key={pin.id} 
                      onClick={() => removePin(pin.id)}
                      className={`absolute cursor-pointer hover:brightness-125 active:scale-95 transition-all z-20 flex items-center justify-center group
                      ${getPinLayout(levelIndex, pin.id)}`}
                   >
                     <div className="w-full h-full relative pointer-events-none filter drop-shadow-xl">
                        <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700 border-2 border-yellow-200 shadow-lg z-30 flex items-center justify-center">
                            <div className="w-3 h-3 bg-yellow-900/40 rounded-full blur-[1px]"></div>
                        </div>
                        <div className="w-full h-full bg-gradient-to-b from-yellow-600 via-yellow-400 to-yellow-800 border-y border-yellow-900 shadow-lg"></div>
                     </div>
                   </div>
                 ))}
            </div>

            {gameState !== 'PLAYING' && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center z-40 animate-in fade-in zoom-in duration-300 p-6 text-center">
                 <div className="text-7xl mb-4 animate-bounce">{gameState === 'WON' ? '👑' : '💀'}</div>
                 <h2 className={`text-4xl font-cinzel font-bold mb-2 drop-shadow-lg ${gameState === 'WON' ? 'text-amber-400' : 'text-red-500'}`}>
                   {gameState === 'WON' ? 'VICTORY' : 'DEFEAT'}
                 </h2>
                 <p className="text-stone-300 mb-8 font-serif italic text-lg max-w-[80%]">{message}</p>
                 <div className="flex flex-col gap-3 w-full max-w-xs">
                   {gameState === 'LOST' && (
                     <button onClick={retry} className="bg-amber-700 text-white border-2 border-amber-500 px-8 py-3 rounded-full font-bold hover:bg-amber-600 transition hover:scale-105 shadow-lg uppercase tracking-wider">
                       Try Again
                     </button>
                   )}
                   {gameState === 'WON' && (
                     <button onClick={handleClaim} className="bg-emerald-700 text-white border-2 border-emerald-500 px-8 py-3 rounded-full font-bold hover:bg-emerald-600 transition hover:scale-105 shadow-lg uppercase tracking-wider flex items-center justify-center gap-2 animate-pulse">
                       {levelIndex + 1 < LEVELS.length ? 'Next Level & Claim' : 'Claim & Close'} ➜
                     </button>
                   )}
                 </div>
              </div>
            )}
        </div>
        
        <div className="bg-[#1a1a1a] p-3 text-center border-t border-stone-700 shrink-0">
           <p className="text-stone-500 text-xs uppercase tracking-widest font-bold">Logic Puzzle • Save the King</p>
        </div>
      </div>
    </div>
  );
};

// Layout Helpers
function getLevelLayout(levelIdx: number, zoneId: string): string {
  const base = "bg-stone-800/50";
  
  // Level 1: Standard Stack
  if (levelIdx === 0) { 
     if (zoneId === 'z1') return `top-0 left-0 right-0 h-1/2 ${base}`;
     if (zoneId === 'z2') return `bottom-0 left-0 right-0 h-1/2 ${base}`;
  }
  // Level 2: Top Split
  if (levelIdx === 1) { 
     if (zoneId === 'top_left') return `top-0 left-0 w-1/2 h-1/2 border-r border-stone-600 ${base}`;
     if (zoneId === 'top_right') return `top-0 right-0 w-1/2 h-1/2 ${base}`;
     if (zoneId === 'bottom') return `bottom-0 left-0 right-0 h-1/2 ${base}`;
  }
  // Level 3: 4-Stack
  if (levelIdx === 2) { 
     const height = 'h-[25%]';
     if (zoneId === 'z1') return `top-0 left-0 right-0 ${height} ${base}`;
     if (zoneId === 'z2') return `top-[25%] left-0 right-0 ${height} ${base}`;
     if (zoneId === 'z3') return `top-[50%] left-0 right-0 ${height} ${base}`;
     if (zoneId === 'z4') return `bottom-0 left-0 right-0 ${height} ${base}`;
  }
  // Level 4: 5-Stack (Double Trap)
  if (levelIdx === 3) {
      const h = 'h-[20%]';
      if (zoneId === 'z1') return `top-0 left-0 right-0 ${h} ${base}`;
      if (zoneId === 'z2') return `top-[20%] left-0 right-0 ${h} ${base}`;
      if (zoneId === 'z3') return `top-[40%] left-0 right-0 ${h} ${base}`;
      if (zoneId === 'z4') return `top-[60%] left-0 right-0 ${h} ${base}`;
      if (zoneId === 'z5') return `bottom-0 left-0 right-0 ${h} ${base}`;
  }
  // Level 5: Complex Split
  if (levelIdx === 4) {
      // Top Left, Top Right, Mid (Full), Hero (Full), Gold (Full)
      if (zoneId === 'left_top') return `top-0 left-0 w-1/2 h-[20%] border-r border-stone-600 ${base}`;
      if (zoneId === 'right_top') return `top-0 right-0 w-1/2 h-[20%] ${base}`;
      if (zoneId === 'mid') return `top-[20%] left-0 right-0 h-[20%] ${base}`;
      if (zoneId === 'hero_zone') return `top-[40%] left-0 right-0 h-[30%] ${base}`;
      if (zoneId === 'gold_zone') return `bottom-0 left-0 right-0 h-[30%] ${base}`;
  }
  return '';
}

function getPinLayout(levelIdx: number, pinId: string): string {
    const h = "h-4";
    // L1
    if (levelIdx === 0) {
        return `top-[49%] left-[-5%] w-[110%] ${h}`;
    }
    // L2
    if (levelIdx === 1) {
        if (pinId === 'p1') return `top-[49%] left-[-5%] w-[55%] ${h}`;
        if (pinId === 'p2') return `top-[49%] right-[-5%] w-[55%] ${h}`;
    }
    // L3
    if (levelIdx === 2) {
        if (pinId === 'p1') return `top-[24.5%] left-[-5%] w-[110%] ${h}`;
        if (pinId === 'p2') return `top-[49.5%] left-[-5%] w-[110%] ${h}`;
        if (pinId === 'p3') return `top-[74.5%] left-[-5%] w-[110%] ${h}`;
    }
    // L4 (5 zones, 4 pins)
    if (levelIdx === 3) {
        if (pinId === 'p1') return `top-[19.5%] left-[-5%] w-[110%] ${h}`;
        if (pinId === 'p2') return `top-[39.5%] left-[-5%] w-[110%] ${h}`;
        if (pinId === 'p3') return `top-[59.5%] left-[-5%] w-[110%] ${h}`;
        if (pinId === 'p4') return `top-[79.5%] left-[-5%] w-[110%] ${h}`;
    }
    // L5 (Split top)
    if (levelIdx === 4) {
        if (pinId === 'p1') return `top-[19%] left-[-5%] w-[55%] ${h}`;
        if (pinId === 'p2') return `top-[19%] right-[-5%] w-[55%] ${h}`;
        if (pinId === 'p3') return `top-[39%] left-[-5%] w-[110%] ${h}`;
        if (pinId === 'p4') return `top-[69%] left-[-5%] w-[110%] ${h}`;
    }
    return '';
}