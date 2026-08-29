import React, { useState } from 'react';
import { 
  Utensils, 
  DollarSign, 
  Globe2, 
  Sparkles, 
  CheckCircle2, 
  ShoppingCart, 
  Flame, 
  Clock, 
  ChefHat, 
  Plus, 
  ChevronRight, 
  BookOpen, 
  Filter, 
  X,
  Layers,
  ArrowRight,
  TrendingDown,
  Info
} from 'lucide-react';
import { 
  WeeklyMealPlan, 
  Recipe, 
  UserProfile, 
  GeographicRegion, 
  BudgetTier,
  DailyMealPlan
} from '../types';
import { REGIONS_META, BUDGET_TIERS_META, SAMPLE_REGIONAL_RECIPES } from '../data/defaultData';
import { requestMealPlan } from '../services/api';

interface MealPlannerViewProps {
  mealPlan: WeeklyMealPlan;
  setMealPlan: (plan: WeeklyMealPlan) => void;
  profile: UserProfile;
  onLogFood: (recipe: Recipe) => void;
  isOnline: boolean;
}

export const MealPlannerView: React.FC<MealPlannerViewProps> = ({
  mealPlan,
  setMealPlan,
  profile,
  onLogFood,
  isOnline
}) => {
  const [activeTab, setActiveTab] = useState<'plan' | 'shopping' | 'generator'>('plan');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genMessage, setGenMessage] = useState<string | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  // Generator form state
  const [genRegion, setGenRegion] = useState<GeographicRegion>(profile.geographicRegion);
  const [genBudgetTier, setGenBudgetTier] = useState<BudgetTier>(profile.budgetTier);
  const [genCalories, setGenCalories] = useState<number>(profile.dailyCalorieTarget);
  const [genDietary, setGenDietary] = useState<string[]>(profile.dietaryRestrictions || []);
  const [genPantry, setGenPantry] = useState<string>('');
  const [customDailyBudget, setCustomDailyBudget] = useState<number>(
    profile.monthlyFoodBudgetUSD ? Math.round(profile.monthlyFoodBudgetUSD / 30) : 5
  );

  // Shopping list checked items
  const [shoppingChecked, setShoppingChecked] = useState<Record<string, boolean>>({});

  const toggleShoppingItem = (name: string) => {
    setShoppingChecked(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    setGenMessage(null);
    try {
      const result = await requestMealPlan(
        genRegion,
        genBudgetTier,
        customDailyBudget,
        genCalories,
        genDietary,
        profile.fitnessGoal,
        genPantry
      );
      setMealPlan(result.plan);
      setActiveTab('plan');
      setSelectedDayIndex(0);
      setGenMessage(
        result.isOfflineFallback
          ? 'Generated structured offline budget meal plan with regional ingredients!'
          : `AI generated custom ${REGIONS_META[genRegion].name} budget meal plan!`
      );
    } catch (e) {
      setGenMessage('Error generating meal plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const currentDayPlan: DailyMealPlan = mealPlan.days[selectedDayIndex] || mealPlan.days[0];

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5" />
                {REGIONS_META[mealPlan.targetRegion]?.name || 'Regional Cuisine'}
              </span>
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold rounded-full flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5" />
                ~${mealPlan.estimatedWeeklyBudget} / Week (~${Math.round((mealPlan.estimatedWeeklyBudget / 7) * 10) / 10}/day)
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
              {mealPlan.title}
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Culturally grounded, high-protein recipes optimized for your local ingredients and revenue budget.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              id="tab-mealplan-btn"
              onClick={() => setActiveTab('plan')}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                activeTab === 'plan'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Utensils className="w-4 h-4" />
              <span>7-Day Menu</span>
            </button>

            <button
              id="tab-shopping-btn"
              onClick={() => setActiveTab('shopping')}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                activeTab === 'shopping'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Smart Grocery List</span>
            </button>

            <button
              id="tab-custom-menu-btn"
              onClick={() => setActiveTab('generator')}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                activeTab === 'generator'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Customize Region & Budget</span>
            </button>
          </div>
        </div>

        {genMessage && (
          <div className="mt-4 p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{genMessage}</span>
          </div>
        )}
      </div>

      {/* VIEW 1: 7-DAY MEAL PLAN */}
      {activeTab === 'plan' && (
        <div className="space-y-6">
          
          {/* Day of Week Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {mealPlan.days.map((day, idx) => (
              <button
                key={day.id || idx}
                onClick={() => setSelectedDayIndex(idx)}
                className={`px-5 py-3 rounded-2xl border text-left flex-shrink-0 transition-all ${
                  selectedDayIndex === idx
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold shadow-lg shadow-emerald-500/10'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="text-xs uppercase tracking-wider opacity-80">
                  {day.dayName}
                </div>
                <div className="text-sm font-bold mt-0.5">
                  {day.totalCalories} kcal • ${day.estimatedDailyCost}
                </div>
              </button>
            ))}
          </div>

          {/* Daily Nutrition Macro Target Banner */}
          {currentDayPlan && (
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-bold text-white text-sm">{currentDayPlan.dayName} Overview:</span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-slate-300">
                <span>Total Energy: <strong className="text-white">{currentDayPlan.totalCalories} kcal</strong></span>
                <span>Protein: <strong className="text-emerald-400">{currentDayPlan.totalProtein}g</strong></span>
                <span>Carbs: <strong className="text-teal-300">{currentDayPlan.totalCarbs}g</strong></span>
                <span>Fats: <strong className="text-amber-300">{currentDayPlan.totalFat}g</strong></span>
                <span className="text-amber-400 font-bold">Est. Daily Cost: ${currentDayPlan.estimatedDailyCost}</span>
              </div>
            </div>
          )}

          {/* 3 Meal Cards: Breakfast, Lunch, Dinner */}
          {currentDayPlan && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Breakfast */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all shadow-lg">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      🌅 Breakfast
                    </span>
                    <span className="text-xs font-bold text-emerald-400">
                      ${currentDayPlan.breakfast?.estimatedCostPerServing || 1.20} / portion
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white font-['Outfit'] mb-2">
                    {currentDayPlan.breakfast?.title || 'Energizing Breakfast'}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
                    <span className="flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-400" /> {currentDayPlan.breakfast?.calories} kcal
                    </span>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold">
                      {currentDayPlan.breakfast?.proteinGrams}g Protein
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Key Ingredients:</span>
                    <ul className="text-xs text-slate-300 space-y-1">
                      {currentDayPlan.breakfast?.ingredients.slice(0, 3).map((ing, iIdx) => (
                        <li key={iIdx} className="truncate">• {ing.name} ({ing.amount})</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => setSelectedRecipe(currentDayPlan.breakfast)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                    <span>View Recipe & Steps</span>
                  </button>

                  <button
                    onClick={() => onLogFood(currentDayPlan.breakfast)}
                    title="Log to Daily Calorie Tracker"
                    className="p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Lunch */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all shadow-lg">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      ☀️ Lunch
                    </span>
                    <span className="text-xs font-bold text-emerald-400">
                      ${currentDayPlan.lunch?.estimatedCostPerServing || 1.60} / portion
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white font-['Outfit'] mb-2">
                    {currentDayPlan.lunch?.title || 'Power Lunch'}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
                    <span className="flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-400" /> {currentDayPlan.lunch?.calories} kcal
                    </span>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold">
                      {currentDayPlan.lunch?.proteinGrams}g Protein
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Key Ingredients:</span>
                    <ul className="text-xs text-slate-300 space-y-1">
                      {currentDayPlan.lunch?.ingredients.slice(0, 3).map((ing, iIdx) => (
                        <li key={iIdx} className="truncate">• {ing.name} ({ing.amount})</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => setSelectedRecipe(currentDayPlan.lunch)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                    <span>View Recipe & Steps</span>
                  </button>

                  <button
                    onClick={() => onLogFood(currentDayPlan.lunch)}
                    title="Log to Daily Calorie Tracker"
                    className="p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Dinner */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all shadow-lg">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                      🌙 Dinner
                    </span>
                    <span className="text-xs font-bold text-emerald-400">
                      ${currentDayPlan.dinner?.estimatedCostPerServing || 1.80} / portion
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white font-['Outfit'] mb-2">
                    {currentDayPlan.dinner?.title || 'Recovery Dinner'}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
                    <span className="flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-400" /> {currentDayPlan.dinner?.calories} kcal
                    </span>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold">
                      {currentDayPlan.dinner?.proteinGrams}g Protein
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Key Ingredients:</span>
                    <ul className="text-xs text-slate-300 space-y-1">
                      {currentDayPlan.dinner?.ingredients.slice(0, 3).map((ing, iIdx) => (
                        <li key={iIdx} className="truncate">• {ing.name} ({ing.amount})</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => setSelectedRecipe(currentDayPlan.dinner)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                    <span>View Recipe & Steps</span>
                  </button>

                  <button
                    onClick={() => onLogFood(currentDayPlan.dinner)}
                    title="Log to Daily Calorie Tracker"
                    className="p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* VIEW 2: SMART GROCERY LIST */}
      {activeTab === 'shopping' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-emerald-400" />
                <h2 className="text-2xl font-extrabold text-white font-['Outfit']">
                  Budget Grocery Shopping List
                </h2>
              </div>
              <p className="text-slate-400 text-xs mt-1">
                Organized by supermarket aisle. Check items as you purchase them.
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 block">Estimated Total Budget</span>
              <span className="text-2xl font-black text-emerald-400">
                ${mealPlan.estimatedWeeklyBudget || 35.00}
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {mealPlan.shoppingList?.map((cat, cIdx) => (
              <div key={cIdx} className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-800/60 px-3 py-1.5 rounded-lg inline-block">
                  {cat.category}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {cat.items.map((item, iIdx) => {
                    const isChecked = Boolean(shoppingChecked[item.name]);
                    return (
                      <div
                        key={iIdx}
                        onClick={() => toggleShoppingItem(item.name)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                          isChecked
                            ? 'bg-slate-950/60 border-slate-800 text-slate-500 line-through'
                            : 'bg-slate-800/60 border-slate-700/80 text-white hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-lg border flex items-center justify-center text-xs font-bold ${
                            isChecked ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-600 bg-slate-800'
                          }`}>
                            {isChecked && '✓'}
                          </div>
                          <div>
                            <span className="text-sm font-semibold block">{item.name}</span>
                            <span className="text-xs text-slate-400">{item.amount}</span>
                          </div>
                        </div>

                        <span className="text-xs font-bold text-amber-400">
                          ${item.estimatedCost}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-emerald-950/40 border border-emerald-500/20 rounded-2xl text-xs text-emerald-300 flex items-center gap-2">
            <Info className="w-4 h-4 flex-shrink-0 text-emerald-400" />
            <span>
              <strong>Budget Pro-Tip:</strong> Buying dry lentils, beans, and rice in bulk bags (2kg+) cuts ingredient costs by up to 50% compared to small canned portions!
            </span>
          </div>
        </div>
      )}

      {/* VIEW 3: CUSTOMIZE REGION & BUDGET GENERATOR */}
      {activeTab === 'generator' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-3xl mx-auto shadow-xl space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h2 className="text-xl sm:text-2xl font-extrabold text-white font-['Outfit']">
                Regional & Budget Nutrition Customizer
              </h2>
            </div>
            <p className="text-slate-400 text-sm">
              Generate meals based on your geographical cuisine staples and monthly food budget.
            </p>
          </div>

          <div className="space-y-5">
            
            {/* Geographic Region Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Select Your Geographic Region / Culinary Tradition
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {Object.entries(REGIONS_META).map(([key, reg]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setGenRegion(key as GeographicRegion)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      genRegion === key
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <span className="text-lg">{reg.icon}</span>
                      <span>{reg.name}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                      {reg.budgetProteins}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Budget Tier & Daily Cost */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Budget Constraint Level
                </label>
                <select
                  value={genBudgetTier}
                  onChange={e => setGenBudgetTier(e.target.value as BudgetTier)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="ultra_budget">Ultra Budget ($2.50 - $4 / day)</option>
                  <option value="smart_budget">Smart Value ($5 - $8 / day)</option>
                  <option value="moderate">Moderate ($9 - $14 / day)</option>
                  <option value="flexible">Flexible / Prime ($15+ / day)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Target Daily Calories: <span className="text-emerald-400 font-bold">{genCalories} kcal</span>
                </label>
                <div className="flex gap-2">
                  {[1600, 1900, 2200, 2500].map(cal => (
                    <button
                      key={cal}
                      type="button"
                      onClick={() => setGenCalories(cal)}
                      className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                        genCalories === cal
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {cal}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Custom Pantry items / staples */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Pantry Ingredients to Utilize (Optional)
              </label>
              <input
                type="text"
                value={genPantry}
                onChange={e => setGenPantry(e.target.value)}
                placeholder="e.g. 5kg rice, frozen tilapia, canned chickpeas, onions, peanut butter"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-500 placeholder-slate-500"
              />
            </div>

            {/* Action button */}
            <button
              id="generate-new-mealplan-btn"
              disabled={isGenerating}
              onClick={handleGeneratePlan}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-base transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Synthesizing Regional Recipes & Budget Plan...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>{isOnline ? 'Generate AI Regional Budget Meal Plan' : 'Generate Local Offline Meal Plan'}</span>
                </>
              )}
            </button>

          </div>
        </div>
      )}

      {/* RECIPE DETAIL & COOKING GUIDE MODAL */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            
            <button
              onClick={() => setSelectedRecipe(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {selectedRecipe.mealType.toUpperCase()}
              </span>
              <span className="text-xs text-slate-400">
                ⏱ {selectedRecipe.prepTimeMinutes + selectedRecipe.cookTimeMinutes} Mins Total
              </span>
            </div>

            <h2 className="text-2xl font-extrabold text-white font-['Outfit'] mb-2">
              {selectedRecipe.title}
            </h2>

            {/* Macro Pill Bar */}
            <div className="grid grid-cols-4 gap-2 my-4 text-center">
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <span className="text-[10px] text-slate-400 uppercase block">Calories</span>
                <span className="text-sm font-black text-amber-400">{selectedRecipe.calories}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <span className="text-[10px] text-slate-400 uppercase block">Protein</span>
                <span className="text-sm font-black text-emerald-400">{selectedRecipe.proteinGrams}g</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <span className="text-[10px] text-slate-400 uppercase block">Carbs</span>
                <span className="text-sm font-black text-teal-300">{selectedRecipe.carbsGrams}g</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <span className="text-[10px] text-slate-400 uppercase block">Cost/Serv</span>
                <span className="text-sm font-black text-emerald-300">${selectedRecipe.estimatedCostPerServing}</span>
              </div>
            </div>

            {/* Ingredients with estimated costs */}
            <div className="space-y-3 mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Ingredients & Approximate Costs:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {selectedRecipe.ingredients.map((ing, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-between">
                    <span className="text-slate-200">{ing.name} ({ing.amount})</span>
                    <span className="text-amber-400 font-semibold">${ing.estimatedCost}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step-by-Step Cooking Instructions */}
            <div className="space-y-3 mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Step-by-Step Cooking Instructions:
              </h4>
              <ol className="space-y-2 text-xs text-slate-300 pl-4 list-decimal">
                {selectedRecipe.instructions.map((step, idx) => (
                  <li key={idx} className="leading-relaxed pl-1">
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {/* Budget & Regional Hacks */}
            {selectedRecipe.budgetTips && selectedRecipe.budgetTips.length > 0 && (
              <div className="p-4 bg-emerald-950/40 border border-emerald-500/20 rounded-2xl text-xs text-emerald-300 mb-6 space-y-1">
                <span className="font-bold block">💰 Budget & Substitution Advice:</span>
                {selectedRecipe.budgetTips.map((tip, idx) => (
                  <p key={idx}>• {tip}</p>
                ))}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                id="log-recipe-from-modal-btn"
                onClick={() => {
                  onLogFood(selectedRecipe);
                  setSelectedRecipe(null);
                }}
                className="flex-1 py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Log to Calorie Tracker</span>
              </button>

              <button
                onClick={() => setSelectedRecipe(null)}
                className="py-3 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
