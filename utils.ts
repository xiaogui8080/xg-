
import { BuildingType, ResourceType, Quest, General, ResearchType, Item, WorldEntity, Alliance, GlobalMessage } from './types';

export const INITIAL_RESOURCES = {
  [ResourceType.FOOD]: 1000,
  [ResourceType.WOOD]: 1000,
  [ResourceType.GOLD]: 500,
  [ResourceType.TROOPS]: 50,
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return Math.floor(num).toString();
};

export const AVAILABLE_GENERALS: General[] = [
  { 
    id: 'gen_joan', 
    name: 'Joan of Arc', 
    description: '+20% Resource Production', 
    cost: 1000, 
    type: 'ECONOMY', 
    multiplier: 0.2,
    portraitSeed: 'Joan'
  },
  { 
    id: 'gen_leonidas', 
    name: 'Leonidas', 
    description: '-50% Battle Casualties', 
    cost: 2000, 
    type: 'MILITARY', 
    multiplier: 0.5,
    portraitSeed: 'Leonidas'
  },
  {
    id: 'gen_caesar',
    name: 'Julius Caesar',
    description: '+30% Gold Tax Revenue',
    cost: 3000, 
    type: 'ECONOMY', 
    multiplier: 0.3,
    portraitSeed: 'Caesar'
  }
];

export const GAME_ITEMS: Item[] = [
    { id: 'box_food_1k', name: 'Small Food Box', description: 'Contains 1,000 Food', type: 'RESOURCE', effect: { [ResourceType.FOOD]: 1000 }, icon: '🥡' },
    { id: 'box_wood_1k', name: 'Small Wood Box', description: 'Contains 1,000 Wood', type: 'RESOURCE', effect: { [ResourceType.WOOD]: 1000 }, icon: '🪵' },
    { id: 'box_gold_500', name: 'Small Coin Purse', description: 'Contains 500 Gold', type: 'RESOURCE', effect: { [ResourceType.GOLD]: 500 }, icon: '💰' },
    { id: 'speed_5m', name: '5m Speedup', description: 'Instant 5m Resource Production', type: 'SPEEDUP', effect: { minutes: 5 }, icon: '⏩' },
    { id: 'speed_60m', name: '1h Speedup', description: 'Instant 60m Resource Production', type: 'SPEEDUP', effect: { minutes: 60 }, icon: '⏭️' },
];

export const WORLD_ENEMIES: Omit<WorldEntity, 'id' | 'x' | 'y'>[] = [
  { type: 'MONSTER', name: 'Goblin Scout', level: 1, power: 20, icon: '👺', loot: ['box_food_1k'] },
  { type: 'MONSTER', name: 'Bandit', level: 3, power: 50, icon: '🥷', loot: ['box_gold_500'] },
  { type: 'MONSTER', name: 'Skeleton Warrior', level: 5, power: 100, icon: '💀', loot: ['box_wood_1k'] },
  { type: 'MONSTER', name: 'Orc Raider', level: 8, power: 300, icon: '👹', loot: ['speed_5m'] },
  { type: 'MONSTER', name: 'Dragon Whelp', level: 12, power: 1000, icon: '🐲', loot: ['speed_60m'] },
];

export const FAKE_ALLIANCES: Alliance[] = [
  { id: '1', tag: 'KNG', name: 'KingsGuard', leader: 'Arthur', members: 45, power: 15000000 },
  { id: '2', tag: 'WAR', name: 'WarLords', leader: 'Attila', members: 32, power: 8500000 },
  { id: '3', tag: 'ONE', name: 'TheOne', leader: 'Neo', members: 50, power: 25000000 },
  { id: '4', tag: 'ELF', name: 'SilverLeaf', leader: 'Legolas', members: 12, power: 1200000 },
];

export const FAKE_CHAT_MESSAGES: GlobalMessage[] = [
  { id: '1', sender: 'SirLancelot', tag: 'KNG', content: 'Anyone want to rally the level 12 Dragon?', timestamp: Date.now() - 50000, type: 'WORLD' },
  { id: '2', sender: 'System', content: 'Player "DragonSlayer" has defeated the Skeleton King!', timestamp: Date.now() - 40000, type: 'SYSTEM' },
  { id: '3', sender: 'Newbie123', content: 'How do I get more food?', timestamp: Date.now() - 30000, type: 'WORLD' },
  { id: '4', sender: 'Merlin', tag: 'KNG', content: 'Use gathering items or attack goblins.', timestamp: Date.now() - 15000, type: 'WORLD' },
];

export const RESEARCH_DATA: Record<ResearchType, { name: string; description: string; baseCost: Partial<Record<ResourceType, number>>; buffPerLevel: number }> = {
    [ResearchType.AGRICULTURE]: { name: 'Agriculture', description: '+10% Food Production', baseCost: { [ResourceType.GOLD]: 500, [ResourceType.WOOD]: 500 }, buffPerLevel: 0.1 },
    [ResearchType.FORESTRY]: { name: 'Forestry', description: '+10% Wood Production', baseCost: { [ResourceType.GOLD]: 500, [ResourceType.FOOD]: 500 }, buffPerLevel: 0.1 },
    [ResearchType.MINING]: { name: 'Mining', description: '+10% Gold Production', baseCost: { [ResourceType.FOOD]: 1000, [ResourceType.WOOD]: 1000 }, buffPerLevel: 0.1 },
    [ResearchType.MEDICINE]: { name: 'Medicine', description: '-5% Battle Casualties', baseCost: { [ResourceType.GOLD]: 2000 }, buffPerLevel: 0.05 },
};

export const VIP_DATA = [
  { level: 1, points: 0, buffEco: 0.05, buffMil: 0.00 }, // 5% Eco
  { level: 2, points: 100, buffEco: 0.10, buffMil: 0.00 }, // 10% Eco
  { level: 3, points: 300, buffEco: 0.15, buffMil: 0.05 }, // 15% Eco, 5% Def
  { level: 4, points: 600, buffEco: 0.20, buffMil: 0.05 },
  { level: 5, points: 1000, buffEco: 0.25, buffMil: 0.10 },
  { level: 6, points: 2000, buffEco: 0.30, buffMil: 0.10 },
];

export const DAILY_REWARDS = [
  { day: 1, reward: { [ResourceType.FOOD]: 500, [ResourceType.WOOD]: 500, [ResourceType.GOLD]: 100 }, vipPoints: 50 },
  { day: 2, reward: { [ResourceType.FOOD]: 1000, [ResourceType.WOOD]: 1000, [ResourceType.GOLD]: 200 }, vipPoints: 60 },
  { day: 3, reward: { [ResourceType.FOOD]: 1500, [ResourceType.WOOD]: 1500, [ResourceType.GOLD]: 300 }, vipPoints: 70 },
  { day: 4, reward: { [ResourceType.FOOD]: 2000, [ResourceType.WOOD]: 2000, [ResourceType.GOLD]: 400 }, vipPoints: 80 },
  { day: 5, reward: { [ResourceType.FOOD]: 3000, [ResourceType.WOOD]: 3000, [ResourceType.GOLD]: 500 }, vipPoints: 100 },
];

export const MAIN_QUESTS: Quest[] = [
  {
    id: 1,
    title: "The King's Seat",
    description: "Upgrade your Keep to Level 2 to establish your rule.",
    type: 'BUILDING',
    target: BuildingType.CASTLE,
    count: 2,
    reward: { [ResourceType.GOLD]: 500, [ResourceType.FOOD]: 500 }
  },
  {
    id: 2,
    title: "Secure Provisions",
    description: "Gather 1,200 Food to feed your subjects.",
    type: 'RESOURCE',
    target: ResourceType.FOOD,
    count: 1200,
    reward: { [ResourceType.WOOD]: 300, [ResourceType.TROOPS]: 10 }
  },
  {
    id: 3,
    title: "Royal Rescue",
    description: "Complete Puzzle Level 1 to save the scout.",
    type: 'PUZZLE',
    target: 'LEVEL',
    count: 2, // Reaching level 2 means level 1 is done
    reward: { [ResourceType.GOLD]: 1000 }
  },
  {
    id: 4,
    title: "Military Might",
    description: "Build a Training Grounds (Barracks) to Level 1.",
    type: 'BUILDING',
    target: BuildingType.BARRACKS,
    count: 1,
    reward: { [ResourceType.TROOPS]: 50 }
  },
  {
    id: 5,
    title: "Preparation for War",
    description: "Amass 200 Troops for the coming battles.",
    type: 'TROOP',
    target: ResourceType.TROOPS,
    count: 200,
    reward: { [ResourceType.GOLD]: 2000, [ResourceType.FOOD]: 2000 }
  },
  {
    id: 6,
    title: "The Goblin Threat",
    description: "Attack and defeat 1 Goblin Camp in the Wilderness.",
    type: 'ATTACK',
    target: 'ENEMY',
    count: 1,
    reward: { [ResourceType.GOLD]: 1000, [ResourceType.WOOD]: 1000, [ResourceType.FOOD]: 1000 }
  },
  {
    id: 7,
    title: "Recruit a Hero",
    description: "Build a Tavern and recruit your first General.",
    type: 'GENERAL',
    target: 'ANY',
    count: 1,
    reward: { [ResourceType.TROOPS]: 100, [ResourceType.GOLD]: 2000 }
  },
  {
    id: 8,
    title: "Knowledge is Power",
    description: "Build an Academy and research Agriculture Lv.1",
    type: 'RESEARCH',
    target: ResearchType.AGRICULTURE,
    count: 1,
    reward: { [ResourceType.FOOD]: 5000, [ResourceType.GOLD]: 1000 }
  }
];

export const BUILDING_COSTS: Record<BuildingType, (level: number) => Partial<Record<ResourceType, number>>> = {
  [BuildingType.CASTLE]: (level) => ({
    [ResourceType.WOOD]: level * 500,
    [ResourceType.GOLD]: level * 200,
  }),
  [BuildingType.FARM]: (level) => ({
    [ResourceType.WOOD]: level * 100,
    [ResourceType.GOLD]: level * 50,
  }),
  [BuildingType.SAWMILL]: (level) => ({
    [ResourceType.FOOD]: level * 100,
    [ResourceType.GOLD]: level * 50,
  }),
  [BuildingType.BARRACKS]: (level) => ({
    [ResourceType.WOOD]: level * 300,
    [ResourceType.FOOD]: level * 300,
  }),
  [BuildingType.MINE]: (level) => ({
    [ResourceType.WOOD]: level * 400,
    [ResourceType.FOOD]: level * 400,
  }),
  [BuildingType.TAVERN]: (level) => ({
    [ResourceType.WOOD]: level * 600,
    [ResourceType.GOLD]: level * 600,
  }),
  [BuildingType.ACADEMY]: (level) => ({
    [ResourceType.WOOD]: level * 800,
    [ResourceType.GOLD]: level * 400,
    [ResourceType.FOOD]: level * 400,
  }),
};

export const RESOURCE_GENERATION: Record<BuildingType, (level: number) => Partial<Record<ResourceType, number>>> = {
  [BuildingType.CASTLE]: (level) => ({ [ResourceType.GOLD]: level * 2 }), // Tax
  [BuildingType.FARM]: (level) => ({ [ResourceType.FOOD]: level * 10 }),
  [BuildingType.SAWMILL]: (level) => ({ [ResourceType.WOOD]: level * 10 }),
  [BuildingType.BARRACKS]: (level) => ({ [ResourceType.TROOPS]: level * 1 }), 
  [BuildingType.MINE]: (level) => ({ [ResourceType.GOLD]: level * 50 }),
  [BuildingType.TAVERN]: (level) => ({}),
  [BuildingType.ACADEMY]: (level) => ({}),
};

// Simple SVG Icons as components
export const Icons = {
  Food: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-green-500">
      <path d="M12 2C7.5 2 4 6.5 4 10c0 3.866 3.582 7 8 7s8-3.134 8-7c0-3.5-3.5-8-8-8zM12 22c-2.67 0-8-1.34-8-4 0 0 2 2 8 2s8-2 8-2c0 2.66-5.33 4-8 4z" />
    </svg>
  ),
  Wood: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-amber-700">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-2v-4h2v4zm0-6h-2V7h2v4z" />
    </svg>
  ),
  Gold: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-400">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.78-1.38-2.98-3.01-3.23v-1.19h-1.39v1.21c-1.67.24-2.98 1.45-2.98 3.03 0 1.93 1.6 2.88 4.25 3.48 1.83.42 2.18 1.09 2.18 1.9 0 1.05-.95 1.67-2.34 1.67-1.71 0-2.43-.82-2.49-1.9H8.43c.09 2.01 1.62 3.11 3.26 3.32v1.23h1.39v-1.25c1.67-.22 2.95-1.43 2.95-3.08 0-2.12-1.77-3.02-4.72-3.66z" />
    </svg>
  ),
  Troops: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-500">
      <path d="M12 2L1 21h22L12 2zm0 3.5L18.5 19H5.5L12 5.5z" />
    </svg>
  ),
  Pin: () => (
     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-yellow-500 rotate-90">
       <path d="M16 6l2.29-2.29-4.88-4.88-4 4L2 2v2h2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4h2V2h-2l-.88.88-4.88 4.88L16 6z" />
    </svg>
  )
};
