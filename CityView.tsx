
import React from 'react';
import { Building, BuildingType, Resources } from './types';
import { BUILDING_COSTS } from './utils';

interface CityViewProps {
  buildings: Building[];
  clearedSlots: number[];
  onBuildingClick: (building: Building) => void;
  onSlotClick: (index: number, isCleared: boolean) => void;
  resources: Resources;
}

const BuildingCard: React.FC<{ building: Building; resources: Resources; onClick: () => void }> = ({ building, resources, onClick }) => {
  const getBuildingStyle = (type: BuildingType) => {
    switch (type) {
      case BuildingType.CASTLE: return 'bg-stone-800 border-amber-600';
      case BuildingType.FARM: return 'bg-emerald-900 border-emerald-500';
      case BuildingType.SAWMILL: return 'bg-amber-900 border-amber-700';
      case BuildingType.BARRACKS: return 'bg-red-900 border-red-700';
      case BuildingType.MINE: return 'bg-yellow-900 border-yellow-600';
      case BuildingType.TAVERN: return 'bg-purple-900 border-purple-600';
      case BuildingType.ACADEMY: return 'bg-blue-900 border-blue-500';
      default: return 'bg-gray-700';
    }
  };

  const getBuildingIcon = (type: BuildingType) => {
    switch(type) {
      case BuildingType.CASTLE: return '🏰';
      case BuildingType.FARM: return '🌾';
      case BuildingType.SAWMILL: return '🌲';
      case BuildingType.BARRACKS: return '⚔️';
      case BuildingType.MINE: return '⛏️';
      case BuildingType.TAVERN: return '🍺';
      case BuildingType.ACADEMY: return '📜';
    }
  };

  // Check if upgrade is affordable
  const nextLevel = building.level + 1;
  const costs = BUILDING_COSTS[building.type](nextLevel);
  const canAfford = Object.entries(costs).every(([res, cost]) => 
    resources[res as keyof Resources] >= (cost || 0)
  );

  return (
    <div
      onClick={onClick}
      className={`
        relative aspect-square rounded-lg border-2 border-b-[8px] 
        transition-all duration-300 cursor-pointer group 
        hover:-translate-y-4 hover:shadow-[0_20px_20px_rgba(0,0,0,0.5)]
        flex flex-col items-center justify-end pb-2
        ${getBuildingStyle(building.type)}
        shadow-2xl
      `}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Upgrade Indicator - Floating above */}
      {canAfford && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20 animate-bounce bg-gradient-to-b from-green-400 to-green-600 border border-green-300 text-white rounded-md px-2 py-0.5 text-xs font-bold shadow-lg whitespace-nowrap">
          ⬆ UPGRADE
        </div>
      )}

      {/* 3D Building Sprite Effect */}
      <div className="absolute bottom-6 text-7xl drop-shadow-[0_10px_5px_rgba(0,0,0,0.8)] transform transition-transform duration-300 group-hover:scale-110" style={{ transform: 'translateZ(20px)' }}>
        {getBuildingIcon(building.type)}
      </div>

      {/* Level Label */}
      <div className="bg-black/70 backdrop-blur-sm px-3 py-1 rounded text-[10px] uppercase font-bold text-amber-100 border border-amber-900/50 shadow-lg z-10 w-[90%] text-center">
        Lv.{building.level} {building.name}
      </div>
      
      {/* Base Plate Reflection */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg pointer-events-none"></div>
    </div>
  );
};

export const CityView: React.FC<CityViewProps> = ({ buildings, clearedSlots, onBuildingClick, onSlotClick, resources }) => {
  // Define total grid slots (e.g., 8 slots)
  const TOTAL_SLOTS = 8;

  const renderSlot = (index: number) => {
    const building = buildings.find(b => b.slotIndex === index);
    
    // Case 1: Slot has a building
    if (building) {
      return <BuildingCard key={building.id} building={building} resources={resources} onClick={() => onBuildingClick(building)} />;
    }

    const isCleared = clearedSlots.includes(index);

    // Case 2: Slot is cleared (Buildable)
    if (isCleared) {
       return (
        <div 
          key={`empty-${index}`} 
          onClick={() => onSlotClick(index, true)}
          className="aspect-square rounded-lg border-2 border-dashed border-green-800/50 bg-[#0f1a0f] flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer hover:border-green-500/50 hover:bg-green-950/20 transition-colors"
        >
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grass.png')] opacity-30"></div>
             
             {/* Build Label */}
             <div className="absolute top-2 bg-green-900/80 text-white text-[8px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-lg">
                🔨 BUILD
             </div>

             <div className="text-3xl text-green-800 group-hover:text-green-500 transition-colors z-10 duration-500 group-hover:scale-110">
                 🏗️
             </div>
             <span className="text-green-800/70 text-[9px] font-bold mt-2 uppercase tracking-widest z-10 group-hover:text-green-500 transition-colors">Empty Plot</span>
        </div>
       );
    }

    // Case 3: Slot is Wilderness (Goblin Camp)
    return (
        <div 
          key={`wild-${index}`} 
          onClick={() => onSlotClick(index, false)}
          className="aspect-square rounded-lg border-2 border-dashed border-red-900/30 bg-[#1a0f0f] flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer hover:border-red-600/50 hover:bg-red-950/20 transition-colors"
        >
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/tree-bark.png')] opacity-20 group-hover:opacity-40 transition-opacity"></div>
             <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-red-950/50 to-transparent"></div>
             
             {/* Attack Label */}
             <div className="absolute top-2 bg-red-900/80 text-white text-[8px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-lg">
                ⚔️ ATTACK
             </div>

             <div className="text-3xl text-stone-700 group-hover:text-red-600 transition-colors z-10 grayscale brightness-50 group-hover:brightness-100 group-hover:scale-110 duration-500">
                 ⛺
             </div>
             <span className="text-stone-600 text-[9px] font-bold mt-2 uppercase tracking-widest z-10 group-hover:text-red-400 transition-colors">Goblin Camp</span>
        </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#0a0a0a] relative perspective-container">
        {/* Simple isometric-like background pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-20" 
             style={{ 
               backgroundImage: `radial-gradient(#333 1px, transparent 1px)`, 
               backgroundSize: '20px 20px' 
             }}>
        </div>
        
        <div className="min-h-full flex flex-col items-center justify-center p-8 md:p-12 overflow-hidden">
            <div className="text-center mb-8 z-10 relative">
                <div className="inline-block bg-black/60 backdrop-blur-md border-y border-amber-500/50 px-8 py-2">
                    <h2 className="text-2xl font-cinzel text-amber-500 tracking-[0.2em] uppercase drop-shadow-md">Kingdom Territory</h2>
                </div>
            </div>
            
            {/* 3D Isometric Plane Container */}
            <div className="relative transform-gpu" style={{ transform: 'perspective(1200px) rotateX(30deg) scale(0.9)' }}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 p-8 bg-[#1a1a1a] rounded-[3rem] border-8 border-[#2a2a2a] shadow-[0_0_100px_rgba(0,0,0,0.8)] relative">
                    
                    {/* Map Texture on the plane */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-50 rounded-[2.5rem]"></div>

                    {Array.from({ length: TOTAL_SLOTS }).map((_, i) => renderSlot(i))}
                    
                </div>
                
                {/* Plane Shadow */}
                <div className="absolute -bottom-20 left-10 right-10 h-20 bg-black/60 blur-2xl rounded-[100%]"></div>
            </div>
        </div>
    </div>
  );
};
