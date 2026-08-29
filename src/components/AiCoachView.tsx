import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Dumbbell, 
  Utensils, 
  DollarSign, 
  ShieldCheck, 
  Trash2,
  RefreshCw,
  User
} from 'lucide-react';
import { ChatMessage, UserProfile } from '../types';
import { sendCoachMessage } from '../services/api';
import { loadChatHistory, saveChatHistory } from '../services/storage';

interface AiCoachViewProps {
  profile: UserProfile;
  isOnline: boolean;
}

export const AiCoachView: React.FC<AiCoachViewProps> = ({ profile, isOnline }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadChatHistory());
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    saveChatHistory(messages);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const QUICK_PROMPTS = [
    { label: '🏃 Human Form Coach Cues', text: 'What are the top 3 biomechanical cues for perfect pushup and squat form to avoid wrist, shoulder, and knee pain?' },
    { label: '🥩 100g Protein for <$3/day', text: 'How can I reach 100-120g of daily protein on less than $3 to $4 per day using staples in my region?' },
    { label: '🏠 15-Min Zero Equipment HIIT', text: 'Give me a fast 15-minute high-intensity zero-equipment routine I can do in a small living room without making noise.' },
    { label: '🥑 Cheaper Ingredient Swaps', text: 'What are the best cheap nutrient-dense alternatives to expensive items like salmon, avocados, and whey protein powder?' },
    { label: '📉 Break Weight Loss Plateau', text: 'I hit a fat loss plateau with home workouts. What are 3 actionable adjustments I should make to my calorie deficit and step count?' }
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputText('');
    setIsLoading(true);

    try {
      const replyText = await sendCoachMessage(newHistory, profile);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: "I'm having trouble connecting right now, but here's a quick rule of thumb: Focus on progressive bodyweight overload and prioritize dry legumes + eggs for peak budget nutrition!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    const welcomeMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: `👋 Fresh session started! Ask me anything about home workouts (with or without weights), regional food budgets, or recipes for your ${profile.geographicRegion.replace('_', ' ')} region.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([welcomeMsg]);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl flex flex-col h-[750px] max-w-4xl mx-auto overflow-hidden">
      
      {/* Coach Header */}
      <div className="p-4 sm:p-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-emerald-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white font-['Outfit']">FitRegion AI Coach</h2>
              <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {isOnline ? 'Online Synced' : 'Offline Knowledge'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Personalized to: {profile.fitnessGoal.replace('_', ' ')} • Region: {profile.geographicRegion.replace('_', ' ')} • Budget: ${profile.monthlyFoodBudgetUSD}/mo
            </p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-colors"
          title="Clear chat history"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages List Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map(msg => {
          const isBot = msg.sender === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isBot ? '' : 'flex-row-reverse'}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  isBot
                    ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
                    : 'bg-slate-800 border border-slate-700 text-slate-300'
                }`}
              >
                {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isBot
                    ? 'bg-slate-800/90 border border-slate-700 text-slate-200'
                    : 'bg-emerald-500 text-slate-950 font-medium'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <span
                  className={`block text-[10px] mt-1.5 ${
                    isBot ? 'text-slate-500 text-right' : 'text-slate-800 text-right'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 text-xs text-slate-400 flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
              <span>Analyzing regional nutritional index & fitness mechanics...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2 bg-slate-900 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-[10px] font-bold uppercase text-slate-500 flex-shrink-0">Quick Ask:</span>
        {QUICK_PROMPTS.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(qp.text)}
            className="px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold whitespace-nowrap border border-slate-700/80 transition-colors"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Input box */}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 sm:p-4 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="Ask about budget recipes, exercise form, substitutions, calorie targets..."
          className="flex-1 bg-slate-800 border border-slate-700 text-white text-xs sm:text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 placeholder-slate-500"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="p-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-emerald-500/20"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
