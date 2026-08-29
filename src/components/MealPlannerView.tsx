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
  Info,
  Camera,
  Image as ImageIcon
} from 'lucide-react';
import { 
  WeeklyMealPlan, 
  Recipe, 
  UserProfile, 
  GeographicRegion, 
  BudgetTier,
  DailyMealPlan
} from '../types';
import { REGIONS_META, BUDGET_TIERS_META, SAMPLE_REGIONAL_RECIPES, getMealImageUrl } from '../data/defaultData';
import { requestMealPlan } from '../services/api';
import { themeService } from '../services/themeService';

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
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-md dark:shadow-xl transition-colors">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5" />
                {REGIONS_META[mealPlan.targetRegion]?.name || 'Regional Cuisine'}
              </span>
              <span className="px-3 py-1 bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30 text-xs font-bold rounded-full flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5" />
                ~{themeService.formatCurrency(mealPlan.estimatedWeeklyBudget)} / Week (~{themeService.formatCurrency(mealPlan.estimatedWeeklyBudget / 7)}/day)
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-['Outfit']">
              {mealPlan.title}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 max-w-2xl">
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
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
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
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Grocery List</span>
            </button>

            <button
              id="tab-generator-btn"
              onClick={() => setActiveTab('generator')}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                activeTab === 'generator'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate / Customize</span>
            </button>
          </div>
        </div>

        {genMessage && (
          <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{genMessage}</span>
          </div>
        )}
      </div>

      {/* VIEW 1: 7-DAY MEAL PLAN */}
      {activeTab === 'plan' && (
        <div className="space-y-6">
          
          {/* Day of Week Selector Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {mealPlan.days.map((day, idx) => (
              <button
                key={idx}
                id={`day-select-btn-${idx}`}
                onClick={() => setSelectedDayIndex(idx)}
                className={`flex-1 min-w-[100px] p-3 rounded-2xl border text-center transition-all ${
                  selectedDayIndex === idx
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-md shadow-emerald-500/20'
                    : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <span className="text-xs uppercase tracking-wider block font-semibold">
                  {day.dayName.slice(0, 3)}
                </span>
                <span className="text-sm font-extrabold block mt-0.5 font-['Outfit']">
                  {themeService.formatEnergy(day.totalCalories)}
                </span>
              </button>
            ))}
          </div>

          {/* Current Day Nutrition Summary Bar */}
          {currentDayPlan && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black text-sm">
                  {currentDayPlan.dayName}
                </div>
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block">Target Nutrition & Cost</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {themeService.formatEnergy(currentDayPlan.totalCalories)} • {currentDayPlan.totalProtein}g Protein • ~{themeService.formatCurrency(currentDayPlan.estimatedDailyCost || 4.50)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Protein: {currentDayPlan.totalProtein}g
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                  Carbs: {currentDayPlan.totalCarbs}g
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  Fat: {currentDayPlan.totalFat}g
                </span>
              </div>
            </div>
          )}

          {/* 3 Meal Cards Grid (Breakfast, Lunch, Dinner) with Pictures before ingredients */}
          {currentDayPlan && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Breakfast Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden flex flex-col justify-between hover:border-emerald-500/50 transition-all shadow-md dark:shadow-lg group">
                <div>
                  {/* Meal Photo Header */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img 
                      src={getMealImageUrl(currentDayPlan.breakfast)} 
                      alt={currentDayPlan.breakfast?.title || 'Breakfast'} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                    
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-slate-950 shadow-md flex items-center gap-1">
                        🌅 Breakfast
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-black bg-slate-900/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
                        {themeService.formatCurrency(currentDayPlan.breakfast?.estimatedCostPerServing || 1.20)}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-bold">
                      <span className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-md">
                        <Clock className="w-3 h-3 text-amber-400" />
                        {(currentDayPlan.breakfast?.prepTimeMinutes || 5) + (currentDayPlan.breakfast?.cookTimeMinutes || 10)} mins
                      </span>
                      <span className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-md">
                        <Flame className="w-3 h-3 text-amber-400" />
                        {themeService.formatEnergy(currentDayPlan.breakfast?.calories || 400)}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white font-['Outfit'] mb-1 line-clamp-1">
                      {currentDayPlan.breakfast?.title || 'Energizing Breakfast'}
                    </h3>

                    <div className="flex items-center gap-2 text-xs mb-3">
                      <span className="text-emerald-600 dark:text-emerald-400 font-black">
                        {currentDayPlan.breakfast?.proteinGrams}g Protein
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500 dark:text-slate-400">
                        {currentDayPlan.breakfast?.carbsGrams}g Carbs
                      </span>
                    </div>

                    {/* Ingredients Section */}
                    <div className="space-y-1.5 mb-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                      <span className="text-[10px] uppercase font-black text-slate-500 dark:text-slate-400 tracking-wider flex items-center gap-1">
                        <ChefHat className="w-3 h-3 text-emerald-500" /> Key Ingredients:
                      </span>
                      <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                        {currentDayPlan.breakfast?.ingredients.slice(0, 3).map((ing, iIdx) => (
                          <li key={iIdx} className="truncate">• {ing.name} <span className="text-slate-400">({ing.amount})</span></li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedRecipe(currentDayPlan.breakfast)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                    <span>View Recipe & Steps</span>
                  </button>

                  <button
                    onClick={() => onLogFood(currentDayPlan.breakfast)}
                    title="Log to Daily Calorie Tracker"
                    className="p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Lunch Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden flex flex-col justify-between hover:border-emerald-500/50 transition-all shadow-md dark:shadow-lg group">
                <div>
                  {/* Meal Photo Header */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img 
                      src={getMealImageUrl(currentDayPlan.lunch)} 
                      alt={currentDayPlan.lunch?.title || 'Lunch'} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                    
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500 text-slate-950 shadow-md flex items-center gap-1">
                        ☀️ Lunch
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-black bg-slate-900/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
                        {themeService.formatCurrency(currentDayPlan.lunch?.estimatedCostPerServing || 1.60)}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-bold">
                      <span className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-md">
                        <Clock className="w-3 h-3 text-emerald-400" />
                        {(currentDayPlan.lunch?.prepTimeMinutes || 8) + (currentDayPlan.lunch?.cookTimeMinutes || 15)} mins
                      </span>
                      <span className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-md">
                        <Flame className="w-3 h-3 text-amber-400" />
                        {themeService.formatEnergy(currentDayPlan.lunch?.calories || 460)}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white font-['Outfit'] mb-1 line-clamp-1">
                      {currentDayPlan.lunch?.title || 'Power Lunch'}
                    </h3>

                    <div className="flex items-center gap-2 text-xs mb-3">
                      <span className="text-emerald-600 dark:text-emerald-400 font-black">
                        {currentDayPlan.lunch?.proteinGrams}g Protein
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500 dark:text-slate-400">
                        {currentDayPlan.lunch?.carbsGrams}g Carbs
                      </span>
                    </div>

                    {/* Ingredients Section */}
                    <div className="space-y-1.5 mb-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                      <span className="text-[10px] uppercase font-black text-slate-500 dark:text-slate-400 tracking-wider flex items-center gap-1">
                        <ChefHat className="w-3 h-3 text-emerald-500" /> Key Ingredients:
                      </span>
                      <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                        {currentDayPlan.lunch?.ingredients.slice(0, 3).map((ing, iIdx) => (
                          <li key={iIdx} className="truncate">• {ing.name} <span className="text-slate-400">({ing.amount})</span></li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedRecipe(currentDayPlan.lunch)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                    <span>View Recipe & Steps</span>
                  </button>

                  <button
                    onClick={() => onLogFood(currentDayPlan.lunch)}
                    title="Log to Daily Calorie Tracker"
                    className="p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Dinner Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden flex flex-col justify-between hover:border-emerald-500/50 transition-all shadow-md dark:shadow-lg group">
                <div>
                  {/* Meal Photo Header */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img 
                      src={getMealImageUrl(currentDayPlan.dinner)} 
                      alt={currentDayPlan.dinner?.title || 'Dinner'} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                    
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-500 text-slate-950 shadow-md flex items-center gap-1">
                        🌙 Dinner
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-black bg-slate-900/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
                        {themeService.formatCurrency(currentDayPlan.dinner?.estimatedCostPerServing || 1.80)}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-bold">
                      <span className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-md">
                        <Clock className="w-3 h-3 text-teal-400" />
                        {(currentDayPlan.dinner?.prepTimeMinutes || 10) + (currentDayPlan.dinner?.cookTimeMinutes || 20)} mins
                      </span>
                      <span className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-md">
                        <Flame className="w-3 h-3 text-amber-400" />
                        {themeService.formatEnergy(currentDayPlan.dinner?.calories || 490)}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white font-['Outfit'] mb-1 line-clamp-1">
                      {currentDayPlan.dinner?.title || 'Recovery Dinner'}
                    </h3>

                    <div className="flex items-center gap-2 text-xs mb-3">
                      <span className="text-emerald-600 dark:text-emerald-400 font-black">
                        {currentDayPlan.dinner?.proteinGrams}g Protein
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500 dark:text-slate-400">
                        {currentDayPlan.dinner?.carbsGrams}g Carbs
                      </span>
                    </div>

                    {/* Ingredients Section */}
                    <div className="space-y-1.5 mb-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                      <span className="text-[10px] uppercase font-black text-slate-500 dark:text-slate-400 tracking-wider flex items-center gap-1">
                        <ChefHat className="w-3 h-3 text-emerald-500" /> Key Ingredients:
                      </span>
                      <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                        {currentDayPlan.dinner?.ingredients.slice(0, 3).map((ing, iIdx) => (
                          <li key={iIdx} className="truncate">• {ing.name} <span className="text-slate-400">({ing.amount})</span></li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedRecipe(currentDayPlan.dinner)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                    <span>View Recipe & Steps</span>
                  </button>

                  <button
                    onClick={() => onLogFood(currentDayPlan.dinner)}
                    title="Log to Daily Calorie Tracker"
                    className="p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* VIEW 2: GROCERY SHOPPING LIST */}
      {activeTab === 'shopping' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-md dark:shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-['Outfit'] flex items-center gap-2">
                <ShoppingCart className="w-6 h-6 text-emerald-500" />
                <span>Bulk Budget Grocery List</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                Organized by aisle categories with approximate prices for your {REGIONS_META[mealPlan.targetRegion]?.name} weekly meal prep.
              </p>
            </div>

            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-right">
              <span className="text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Estimated Grocery Total</span>
              <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">{themeService.formatCurrency(mealPlan.estimatedWeeklyBudget)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mealPlan.shoppingList.map((category, cIdx) => (
              <div key={cIdx} className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 rounded-2xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center justify-between">
                  <span>{category.category}</span>
                  <span className="text-xs font-semibold text-slate-400">
                    {category.items.length} items
                  </span>
                </h3>

                <div className="space-y-2">
                  {category.items.map((item, iIdx) => {
                    const isChecked = Boolean(shoppingChecked[item.name]);
                    return (
                      <div
                        key={iIdx}
                        onClick={() => toggleShoppingItem(item.name)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-emerald-500/10 border-emerald-500/30 opacity-60'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                            isChecked
                              ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                              : 'border-slate-400 dark:border-slate-600'
                          }`}>
                            {isChecked && <CheckCircle2 className="w-4 h-4" />}
                          </div>
                          <div>
                            <span className={`text-xs font-bold block ${isChecked ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                              {item.name}
                            </span>
                            <span className="text-[11px] text-slate-400">{item.amount}</span>
                          </div>
                        </div>

                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          {themeService.formatCurrency(item.estimatedCost)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: CUSTOMIZE REGION & BUDGET GENERATOR */}
      {activeTab === 'generator' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-3xl mx-auto shadow-md dark:shadow-xl space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-emerald-500" />
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-['Outfit']">
                Regional & Budget Nutrition Customizer
              </h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Generate meals based on your geographical cuisine staples and monthly food budget.
            </p>
          </div>

          <div className="space-y-5">
            
            {/* Geographic Region Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
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
                        ? 'bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <span className="text-lg">{reg.icon}</span>
                      <span>{reg.name}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                      {reg.budgetProteins}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Budget Tier & Daily Cost */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Budget Constraint Level
                </label>
                <select
                  value={genBudgetTier}
                  onChange={e => setGenBudgetTier(e.target.value as BudgetTier)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="ultra_budget">Ultra Budget ($2.50 - $4 / day)</option>
                  <option value="smart_budget">Smart Value ($5 - $8 / day)</option>
                  <option value="moderate">Moderate ($9 - $14 / day)</option>
                  <option value="flexible">Flexible / Prime ($15+ / day)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Target Daily Calories: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{themeService.formatEnergy(genCalories)}</span>
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
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
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
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Pantry Ingredients to Utilize (Optional)
              </label>
              <input
                type="text"
                value={genPantry}
                onChange={e => setGenPantry(e.target.value)}
                placeholder="e.g. 5kg rice, frozen tilapia, canned chickpeas, onions, peanut butter"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-500 placeholder-slate-400 dark:placeholder-slate-500"
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
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            
            {/* Modal Hero Image */}
            <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img 
                src={getMealImageUrl(selectedRecipe)} 
                alt={selectedRecipe.title} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              
              <button
                onClick={() => setSelectedRecipe(null)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 text-white">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-slate-950">
                    {selectedRecipe.mealType.toUpperCase()}
                  </span>
                  <span className="text-xs text-slate-200 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    {selectedRecipe.prepTimeMinutes + selectedRecipe.cookTimeMinutes} Mins Total
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] leading-tight">
                  {selectedRecipe.title}
                </h2>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">

              {/* Macro Pill Bar */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase block font-bold">Calories</span>
                  <span className="text-sm sm:text-base font-black text-amber-600 dark:text-amber-400">{themeService.formatEnergy(selectedRecipe.calories)}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase block font-bold">Protein</span>
                  <span className="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400">{selectedRecipe.proteinGrams}g</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase block font-bold">Carbs</span>
                  <span className="text-sm sm:text-base font-black text-cyan-600 dark:text-teal-300">{selectedRecipe.carbsGrams}g</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase block font-bold">Cost/Serv</span>
                  <span className="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-300">{themeService.formatCurrency(selectedRecipe.estimatedCostPerServing)}</span>
                </div>
              </div>

              {/* Ingredients with estimated costs */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <ChefHat className="w-4 h-4 text-emerald-500" />
                  Ingredients & Approximate Costs:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  {selectedRecipe.ingredients.map((ing, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                      <span className="text-slate-800 dark:text-slate-200 font-semibold">{ing.name} <span className="text-slate-400 font-normal">({ing.amount})</span></span>
                      <span className="text-emerald-600 dark:text-amber-400 font-bold">{themeService.formatCurrency(ing.estimatedCost)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step-by-Step Cooking Instructions */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Utensils className="w-4 h-4 text-emerald-500" />
                  Step-by-Step Cooking Instructions:
                </h4>
                <ol className="space-y-2 text-xs text-slate-700 dark:text-slate-300 pl-4 list-decimal">
                  {selectedRecipe.instructions.map((step, idx) => (
                    <li key={idx} className="leading-relaxed pl-1">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Budget & Regional Hacks */}
              {selectedRecipe.budgetTips && selectedRecipe.budgetTips.length > 0 && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl text-xs text-emerald-800 dark:text-emerald-300 space-y-1">
                  <span className="font-black block flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Budget & Substitution Advice:
                  </span>
                  {selectedRecipe.budgetTips.map((tip, idx) => (
                    <p key={idx}>• {tip}</p>
                  ))}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  id="log-recipe-from-modal-btn"
                  onClick={() => {
                    onLogFood(selectedRecipe);
                    setSelectedRecipe(null);
                  }}
                  className="flex-1 py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Log to Calorie Tracker</span>
                </button>

                <button
                  onClick={() => setSelectedRecipe(null)}
                  className="py-3.5 px-6 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold transition-colors"
                >
                  Close
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
