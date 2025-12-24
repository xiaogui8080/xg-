
import React, { useState, useEffect, useRef } from 'react';
import { GameState, Building, BuildingType, ResourceType, General, ResearchType, Item, ViewMode, WorldEntity, Mail, Alliance, GlobalMessage } from './types';
import { INITIAL_RESOURCES, RESOURCE_GENERATION, BUILDING_COSTS, Icons, formatNumber, MAIN_QUESTS, AVAILABLE_GENERALS, RESEARCH_DATA, VIP_DATA, DAILY_REWARDS, GAME_ITEMS, FAKE_ALLIANCES, FAKE_CHAT_MESSAGES } from './utils';
import { CityView } from './CityView';
import { PuzzleView } from './PuzzleView';
import { Advisor } from './Advisor';
import { WorldMap } from './WorldMap';

const App: React.FC = () => {
  // --- Game State with Persistence ---
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('civony_gamestate_v11');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.questIndex === undefined) parsed.questIndex = 0;
        if (parsed.enemiesDefeated === undefined) parsed.enemiesDefeated = 0;
        if (parsed.clearedSlots === undefined) parsed.clearedSlots = [0, 1, 2, 3];
        if (parsed.recruitedGenerals === undefined) parsed.recruitedGenerals = [];
        if (parsed.researchedTechs === undefined) parsed.researchedTechs = {};
        if (parsed.vipLevel === undefined) parsed.vipLevel = 1;
        if (parsed.vipPoints === undefined) parsed.vipPoints = 0;
        if (parsed.lastClaimedLogin === undefined) parsed.lastClaimedLogin = 0;
        if (parsed.inventory === undefined) parsed.inventory = {};
        if (parsed.mails === undefined) parsed.mails = [{ id: 'welcome', title: 'Welcome, My Liege!', timestamp: Date.now(), type: 'SYSTEM', body: 'Welcome to your new kingdom. Construct buildings, recruit troops, and conquer the world!', read: false }];
        if (parsed.allianceId === undefined) parsed.allianceId = null;
        return parsed;
      } catch (e) {
        console.error("Failed to load save", e);
      }
    }
    return {
      resources: { ...INITIAL_RESOURCES },
      buildings: [
          { id: '1', type: BuildingType.CASTLE, level: 1, slotIndex: 0, name: 'Keep' },
          { id: '2', type: BuildingType.FARM, level: 1, slotIndex: 1, name: 'Wheat Field' },
          { id: '3', type: BuildingType.SAWMILL, level: 1, slotIndex: 2, name: 'Lumber Yard' },
          { id: '4', type: BuildingType.BARRACKS, level: 0, slotIndex: 3, name: 'Training Grounds' }, 
      ],
      lastTick: Date.now(),
      playerLevel: 1,
      puzzleLevelReached: 1,
      questIndex: 0,
      enemiesDefeated: 0,
      clearedSlots: [0, 1, 2, 3],
      recruitedGenerals: [],
      researchedTechs: {},
      vipLevel: 1,
      vipPoints: 0,
      lastClaimedLogin: 0,
      inventory: { 'box_food_1k': 1, 'speed_5m': 1 }, // Starter Items
      mails: [{ id: 'welcome', title: 'Welcome, My Liege!', timestamp: Date.now(), type: 'SYSTEM', body: 'Welcome to your new kingdom. Construct buildings, recruit troops, and conquer the world!', read: false }],
      allianceId: null
    };
  });

  const [viewMode, setViewMode] = useState<ViewMode>('CITY');
  const [isPuzzleOpen, setIsPuzzleOpen] = useState(false);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isMailOpen, setIsMailOpen] = useState(false);
  const [isQuestListOpen, setIsQuestListOpen] = useState(false);
  const [isAllianceOpen, setIsAllianceOpen] = useState(false);
  const [dailyReward, setDailyReward] = useState<{item: typeof DAILY_REWARDS[0], index: number} | null>(null);
  
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [activeSlot, setActiveSlot] = useState<{index: number, mode: 'ATTACK' | 'BUILD'} | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [isMarching, setIsMarching] = useState(false);

  // --- Persistence Effect ---
  useEffect(() => {
    localStorage.setItem('civony_gamestate_v11', JSON.stringify(gameState));
  }, [gameState]);

  // --- Daily Login Check ---
  useEffect(() => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    if (now - gameState.lastClaimedLogin > oneDay) {
        const dayIndex = Math.floor(Math.random() * DAILY_REWARDS.length);
        setDailyReward({ item: DAILY_REWARDS[dayIndex], index: dayIndex });
    }
  }, []);

  // --- Buff Calculations Logic ---
  const activeGenerals = AVAILABLE_GENERALS.filter(g => gameState.recruitedGenerals.includes(g.id));
  const currentVipData = VIP_DATA.find(v => v.level === gameState.vipLevel) || VIP_DATA[0];

  const getGeneralBuff = (type: 'ECONOMY' | 'MILITARY') => activeGenerals.filter(g => g.type === type).reduce((acc, g) => acc + g.multiplier, 0);
  const getResearchBuff = (type: ResearchType) => (gameState.researchedTechs[type] || 0) * RESEARCH_DATA[type].buffPerLevel;

  const economyBuff = getGeneralBuff('ECONOMY') + currentVipData.buffEco;
  const militaryBuff = getGeneralBuff('MILITARY') + getResearchBuff(ResearchType.MEDICINE) + currentVipData.buffMil;

  // --- Game Loop (Resource Generation) ---
  useEffect(() => {
    const tickRate = 3000; 
    const interval = setInterval(() => {
      setGameState(prev => {
        const newResources = { ...prev.resources };
        
        // Context recalculation for thread safety
        const currentActiveGens = AVAILABLE_GENERALS.filter(g => prev.recruitedGenerals.includes(g.id));
        const genEcoBuff = currentActiveGens.filter(g => g.type === 'ECONOMY').reduce((acc, g) => acc + g.multiplier, 0);
        const vipEcoBuff = (VIP_DATA.find(v => v.level === prev.vipLevel) || VIP_DATA[0]).buffEco;

        const agriBuff = (prev.researchedTechs[ResearchType.AGRICULTURE] || 0) * RESEARCH_DATA[ResearchType.AGRICULTURE].buffPerLevel;
        const forestryBuff = (prev.researchedTechs[ResearchType.FORESTRY] || 0) * RESEARCH_DATA[ResearchType.FORESTRY].buffPerLevel;
        const miningBuff = (prev.researchedTechs[ResearchType.MINING] || 0) * RESEARCH_DATA[ResearchType.MINING].buffPerLevel;

        const totalGlobalEcoBuff = genEcoBuff + vipEcoBuff;

        prev.buildings.forEach(b => {
          if (b.level > 0) {
            const production = RESOURCE_GENERATION[b.type](b.level);
            Object.entries(production).forEach(([res, amount]) => {
                if(amount) {
                    let specificResearchBuff = 0;
                    if (res === ResourceType.FOOD) specificResearchBuff = agriBuff;
                    if (res === ResourceType.WOOD) specificResearchBuff = forestryBuff;
                    if (res === ResourceType.GOLD) specificResearchBuff = miningBuff;

                    const totalBonus = Math.floor(amount * (totalGlobalEcoBuff + specificResearchBuff));
                    newResources[res as ResourceType] += (amount + totalBonus);
                }
            });
          }
        });

        return {
          ...prev,
          resources: newResources,
          lastTick: Date.now()
        };
      });
    }, tickRate);

    return () => clearInterval(interval);
  }, []);

  // --- Notifications ---
  useEffect(() => {
    if (notification) {
        const t = setTimeout(() => setNotification(null), 3000);
        return () => clearTimeout(t);
    }
  }, [notification]);

  // --- Helper: Add Mail ---
  const sendMail = (mail: Omit<Mail, 'id' | 'timestamp' | 'read'>) => {
      setGameState(prev => ({
          ...prev,
          mails: [
              { ...mail, id: Date.now().toString(), timestamp: Date.now(), read: false },
              ...prev.mails
          ]
      }));
  };

  // --- Handlers ---
  
  const handleClaimDaily = () => {
    if (!dailyReward) return;
    setGameState(prev => {
        const newRes = { ...prev.resources };
        Object.entries(dailyReward.item.reward).forEach(([k, v]) => {
            newRes[k as ResourceType] += v;
        });

        let newPoints = prev.vipPoints + dailyReward.item.vipPoints;
        let newLevel = prev.vipLevel;
        const nextLevelData = VIP_DATA.find(v => v.level === prev