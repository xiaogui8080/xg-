
import React, { useState, useMemo } from 'react';
import { WorldEntity } from './types';
import { WORLD_ENEMIES } from './utils';

interface WorldMapProps {
  onAttack: (entity: WorldEntity) => void;
  playerPower: number;
}

export const WorldMap: React.FC<WorldMapProps> = ({ onAttack, playerPower }) => {
  // Generate pseudo-random world map data
  const mapData = useMemo(() => {
    const tiles: WorldEntity[] = [];
    // Generate a 10x10 grid of potential monster spots
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        // 30% chance of monster
        if (Math.random() < 0.3) {
          const type = WORLD_ENEMIES[Math.floor(Math.random() * WORLD_ENEMIES.length)];
          tiles.push({
            id: `monster-${x}-${y}`,
            x,
            y,
            ...type,
            type: 'MONSTER',
            loot: type.loot || []
          });
        }
      }
    }
    return tiles;
  }, []);

  const [selectedEntity, setSelectedEntity] = useState<WorldEntity | null>(null);

  const getTileStyle = (x: number, y: number) => {
    // Offset every other row for a pseudo-hex/isometric look
    const left = x * 80 + (y % 2) * 40;
    const top = y * 60;
    return { left, top };
  };

  return (
    <div className="flex-1 relative overflow-hidden bg-[#0c140c] cursor-move">
      {/* Scrollable Map Container */}
      <div className="absolute inset-0 overflow-auto">
        <div className="relative min-w-[1000px] min-h-[800px] p-20">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-30"></div>
            
            {/* Render Tiles */}
            {mapData.map((entity) => {
                const pos = getTileStyle(entity.x, entity.y);
                const isTooStrong = entity.power > playerPower;

                return (
                    <div 
                        key={entity.id}
                        onClick={() => setSelectedEntity(entity)}
                        style={{ transform: `translate(${pos.left}px, ${pos.top}px)` }}
                        className={`absolute w-16 h-16 flex items-center justify-center cursor-pointer transition-transform hover:scale-125 z-10`}
                    >
                         {/* Entity Icon */}
                         <div className="text-4xl drop-shadow-md relative">
                            {entity.icon}
                            {/* Level Badge */}
                            <div className={`absolute -top-2 -right-2 text-[10px] font-bold px-1.5 rounded-full border ${isTooStrong ? 'bg-red-900 border-red-500 text-red-200' : 'bg-stone-800 border-stone-500 text-stone-200'}`}>
                                Lv.{entity.level}
                            </div>
                         </div>
                    </div>
                );
            })}
        </div>
      </div>

      {/* Interaction Modal */}
      {selectedEntity && (
          <div className="absolute bottom-0 left-0 right-0 bg-stone-900 border-t-4 border-red-900 p-6 animate-in slide-in-from-bottom-10 z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
               <button onClick={() => setSelectedEntity(null)} className="absolute top-2 right-4 text-stone-500 text-xl">✕</button>
               
               <div className="flex gap-4 items-center">
                   <div className="text-6xl bg-black/50 p-4 rounded-lg border border-stone-700">{selectedEntity.icon}</div>
                   <div>
                       <h3 className="text-2xl text-red-500 font-cinzel font-bold">{selectedEntity.name}</h3>
                       <p className="text-stone-400 text-sm mb-2">Level {selectedEntity.level} Monster</p>
                       <div className="flex gap-4 text-xs font-bold uppercase tracking-wider">
                           <span className={playerPower >= selectedEntity.power ? 'text-green-500' : 'text-red-500'}>
                               Power Req: {selectedEntity.power}
                           </span>
                           <span className="text-yellow-500">Possible Loot: {selectedEntity.loot.length > 0 ? '🎁 Chests' : 'None'}</span>
                       </div>
                   </div>
               </div>

               <div className="mt-6 flex gap-4">
                   <button 
                     onClick={() => { onAttack(selectedEntity); setSelectedEntity(null); }}
                     className="flex-1 bg-gradient-to-r from-red-800 to-red-600 hover:from-red-700 hover:to-red-500 text-white font-bold py-3 rounded uppercase tracking-widest shadow-lg border border-red-400"
                   >
                       ⚔️ March & Attack
                   </button>
                   <button className="px-6 bg-stone-800 text-stone-400 font-bold rounded border border-stone-600">
                       Info
                   </button>
               </div>
          </div>
      )}

      {/* Map Overlay UI */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur px-6 py-2 rounded-full border border-stone-600 text-xs font-bold text-stone-300 pointer-events-none">
           🌍 World Map ( Coordinates: Random )
      </div>
    </div>
  );
};
