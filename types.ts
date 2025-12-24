
export enum ResourceType {
  FOOD = 'Food',
  WOOD = 'Wood',
  GOLD = 'Gold',
  TROOPS = 'Troops'
}

export enum BuildingType {
  CASTLE = 'Castle',
  FARM = 'Farm',
  SAWMILL = 'Sawmill',
  BARRACKS = 'Barracks',
  MINE = 'Mine',
  TAVERN = 'Tavern',
  ACADEMY = 'Academy'
}

export enum ResearchType {
  AGRICULTURE = 'Agriculture',
  FORESTRY = 'Forestry',
  MINING = 'Mining',
  MEDICINE = 'Medicine'
}

export type ViewMode = 'CITY' | 'WORLD';

export interface Resources {
  [ResourceType.FOOD]: number;
  [ResourceType.WOOD]: number;
  [ResourceType.GOLD]: number;
  [ResourceType.TROOPS]: number;
}

export interface Building {
  id: string;
  type: BuildingType;
  level: number;
  slotIndex: number; // Position on the grid
  name: string;
}

export interface General {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: 'ECONOMY' | 'MILITARY';
  multiplier: number; // e.g., 0.2 for 20% bonus
  portraitSeed: string;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  type: 'RESOURCE' | 'SPEEDUP';
  // Resource adds amounts, Speedup simulates X minutes of production
  effect: Partial<Resources> | { minutes: number }; 
  icon: string;
}

export interface WorldEntity {
  id: string;
  type: 'MONSTER' | 'RESOURCE';
  name: string;
  level: number;
  power: number;
  icon: string;
  loot: string[]; // Item IDs
  x: number;
  y: number;
}

export interface Mail {
  id: string;
  title: string;
  timestamp: number;
  type: 'BATTLE' | 'SYSTEM' | 'QUEST';
  body: string; // Simple text content
  read: boolean;
  outcome?: 'VICTORY' | 'DEFEAT';
  rewards?: {
    resources?: Partial<Resources>;
    items?: { id: string; count: number }[];
  };
}

export interface Alliance {
  id: string;
  tag: string;
  name: string;
  leader: string;
  members: number;
  power: number;
}

export interface GlobalMessage {
  id: string;
  sender: string;
  tag?: string; // Alliance tag
  content: string;
  timestamp: number;
  type: 'WORLD' | 'SYSTEM';
}

export interface GameState {
  resources: Resources;
  buildings: Building[];
  lastTick: number;
  playerLevel: number;
  puzzleLevelReached: number;
  questIndex: number;
  enemiesDefeated: number;
  clearedSlots: number[]; // Array of slot indices that are safe to build on
  recruitedGenerals: string[]; // IDs of recruited generals
  researchedTechs: Partial<Record<ResearchType, number>>; // Tech Levels
  vipLevel: number;
  vipPoints: number;
  lastClaimedLogin: number; // Timestamp
  inventory: Record<string, number>; // ItemID -> Count
  mails: Mail[];
  allianceId: string | null; // Null if not in alliance
}

// Puzzle Types
export type EntityType = 'HERO' | 'TREASURE' | 'LAVA' | 'WATER' | 'GOBLIN' | 'EMPTY';

export interface PuzzleZone {
  id: string;
  contents: EntityType[];
  capacity: number;
}

export interface PuzzlePin {
  id: string;
  separates: [string, string]; // IDs of zones it separates (Top, Bottom) or (Left, Right) - Simplified to always vertical flow for this demo
  isHorizontal: boolean; // If true, it holds things up. If false, it's a wall.
}

export interface PuzzleLevel {
  id: number;
  name: string;
  zones: PuzzleZone[];
  pins: PuzzlePin[];
  winCondition: 'TREASURE_COLLECTED';
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

// Quest Types
export interface Quest {
  id: number;
  title: string;
  description: string;
  type: 'BUILDING' | 'RESOURCE' | 'PUZZLE' | 'TROOP' | 'ATTACK' | 'GENERAL' | 'RESEARCH';
  target: BuildingType | ResourceType | 'LEVEL' | 'ENEMY' | 'ANY' | ResearchType;
  count: number; // Level required or amount required
  reward: Partial<Resources>;
}
