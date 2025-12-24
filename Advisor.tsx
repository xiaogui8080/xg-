
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ChatMessage, GameState } from './types';

interface AdvisorProps {
  gameState: GameState;
  isOpen: boolean;
  onClose: () => void;
}

export const Advisor: React.FC<AdvisorProps> = ({ gameState, isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Greetings, my Liege. I am Alaric, your Grand Vizier. How may I serve the kingdom today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      // Initialize AI Client
      // The API key is obtained exclusively from process.env.API_KEY
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Dynamic context based on game state
      const gameContext = `
        Current Game Stats:
        - Player Level: ${gameState.playerLevel}
        - Resources: Food ${Math.floor(gameState.resources.Food)}, Wood ${Math.floor(gameState.resources.Wood)}, Gold ${Math.floor(gameState.resources.Gold)}
        - Military Power: ${Math.floor(gameState.resources.Troops)} Troops
        - Battles Won: ${gameState.enemiesDefeated}
        - Buildings: ${gameState.buildings.map(b => `${b.name} (Lv ${b.level})`).join(', ')}
        - Last Puzzle Level: ${gameState.puzzleLevelReached}
        - Active Quest Index: ${gameState.questIndex + 1}
      `;

      // Construct the prompt
      const prompt = `Here is the current situation of the kingdom: ${gameContext}\n\nMy Liege asks: "${userMsg}"`;

      // Generate response
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: "You are Alaric, a wise, loyal, and slightly archaic medieval Grand Vizier in a mobile strategy game (similar to Evony). Your goal is to help the player (the King/Queen) manage their city and solve puzzles. Keep responses concise (under 50 words) and helpful. Use medieval flourishes but be clear. If resources are low, suggest specific buildings to upgrade. If troops are low, advise training at the Barracks. If asked about puzzles, give cryptic but helpful hints about 'pulling pins' and gravity.",
          temperature: 0.7,
        }
      });

      const text = response.text || "I am at a loss for words, Sire.";
      setMessages(prev => [...prev, { role: 'model', text }]);

    } catch (e) {
      console.error("AI Error:", e);
      setMessages(prev => [...prev, { role: 'model', text: "Forgive me, my King, but the mists of time cloud my vision (Connection Error). Please ensure your API Key is valid.", isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-4 w-80 md:w-96 bg-stone-900 border-2 border-amber-700 rounded-t-xl rounded-bl-xl shadow-2xl z-40 flex flex-col max-h-[60vh] animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-gradient-to-r from-amber-900 to-amber-800 p-3 rounded-t-lg flex justify-between items-center border-b border-amber-600 shadow-md">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-stone-800 overflow-hidden border-2 border-amber-300 shadow-sm">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alaric&clothing=graphicShirt&eyebrows=raisedExcited&skinColor=pale" alt="Alaric" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="font-cinzel font-bold text-amber-100 text-sm shadow-black drop-shadow-sm">Grand Vizier Alaric</span>
              <span className="text-[10px] text-amber-300 uppercase tracking-widest font-bold">Royal Advisor</span>
            </div>
        </div>
        <button onClick={onClose} className="text-amber-200 hover:text-white bg-black/20 hover:bg-black/40 rounded w-6 h-6 flex items-center justify-center transition-colors">✕</button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-800 relative">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper.png')]"></div>
        
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} relative z-10`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-md border ${
              m.role === 'user' 
                ? 'bg-amber-900/90 text-amber-50 rounded-br-sm border-amber-700' 
                : 'bg-stone-700/90 text-stone-100 rounded-bl-sm border-stone-600'
            }`}>
               {m.isError && <span className="text-red-400 font-bold block mb-1">⚠ Error</span>}
               {m.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start relative z-10">
             <div className="bg-stone-700/50 text-stone-400 text-xs rounded-full px-4 py-2 animate-pulse flex items-center gap-2">
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></span>
                <span>Consulting the archives...</span>
             </div>
          </div>
        )}
      </div>

      <div className="p-3 bg-stone-900 border-t border-stone-700 flex gap-2 rounded-bl-lg">
        <input 
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask for guidance..."
          className="flex-1 bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-200 focus:outline-none focus:border-amber-600 placeholder-stone-600 shadow-inner"
        />
        <button 
          onClick={handleSend} 
          disabled={isLoading} 
          className="bg-amber-700 hover:bg-amber-600 disabled:bg-stone-800 disabled:text-stone-600 text-white p-2 rounded-lg transition-all shadow-lg border border-amber-600 hover:scale-105 active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
        </button>
      </div>
    </div>
  );
};
