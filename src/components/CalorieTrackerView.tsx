import React, { useState } from 'react';
import { 
  Flame, 
  Plus, 
  Droplet, 
  TrendingUp, 
  Dumbbell, 
  Trash2, 
  Check, 
  Sparkles, 
  Utensils, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  PieChart,
  Scale
} from 'lucide-react';
import { DailyLog, FoodLogItem, UserProfile } from '../types';

interface CalorieTrackerViewProps {
  dailyLog: DailyLog;
  setDailyLog: (log: DailyLog) => void;
  profile: UserProfile;
}

export const CalorieTrackerView: React.FC<CalorieTrackerViewProps> = ({
  dailyLog,
  setDailyLog,
  profile
}) => {
  const [showAddFoodModal, setShowAddFoodModal] = useState(false);
  const [modalMealType, setModalMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
  
  // Custom Food Form
  const [foodName, setFoodName] = useState('');
  const [foodCalories, setFoodCalories] = useState('');
  const [foodProtein, setFoodProtein] = useState('');
  const [foodCarbs, setFoodCarbs] = useState('');
  const [foodFat, setFoodFat] = useState('');
  const [foodPortion, setFoodPortion] = useState('1 serving');

  // Quick preset foods
  const PRESET_SNACKS = [
    { name: '2 Large Boiled Eggs', calories: 140, protein: 12, carbs: 1, fat: 10, portion: '2 eggs' },
    { name: '1 Medium Banana + 1 tbsp Peanut Butter', calories: 200, protein: 5, carbs: 32, fat: 8, portion: '1 serving' },
    { name: 'Greek Yogurt / Curd (150g)', calories: 130, protein: 15, carbs: 6, fat: 4, portion: '150g cup' },
    { name: 'Canned Tuna in Brine (1 can)', calories: 120, protein: 28, carbs: 0, fat: 1, portion: '1 can (130g)' },
    { name: 'Cooked Oatmeal with Cinnamon (1 cup)', calories: 160, protein: 6, carbs: 28, fat: 3, portion: '1 bowl' }
  ];

  // Calculate totals
  const totalCaloriesConsumed = dailyLog.foods.reduce((acc, f) => acc + f.calories, 0);
  const totalProteinConsumed = dailyLog.foods.reduce((acc, f) => acc + f.protein, 0);
  const totalCarbsConsumed = dailyLog.foods.reduce((acc, f) => acc + f.carbs, 0);
  const totalFatConsumed = dailyLog.foods.reduce((acc, f) => acc + f.fat, 0);

  const totalCaloriesBurnedFromWorkouts = dailyLog.workoutsCompleted.reduce(
    (acc, w) => acc + w.caloriesBurned,
    0
  );

  const netCalories = totalCaloriesConsumed - totalCaloriesBurnedFromWorkouts;
  const remainingCalories = profile.dailyCalorieTarget - totalCaloriesConsumed;

  const handleAddCustomFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName || !foodCalories) return;

    const newItem: FoodLogItem = {
      id: `food-${Date.now()}`,
      name: foodName,
      mealType: modalMealType,
      calories: parseInt(foodCalories, 10) || 0,
      protein: parseInt(foodProtein, 10) || 0,
      carbs: parseInt(foodCarbs, 10) || 0,
      fat: parseInt(foodFat, 10) || 0,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      portion: foodPortion || '1 serving'
    };

    setDailyLog({
      ...dailyLog,
      foods: [newItem, ...dailyLog.foods]
    });

    // Reset form
    setFoodName('');
    setFoodCalories('');
    setFoodProtein('');
    setFoodCarbs('');
    setFoodFat('');
    setShowAddFoodModal(false);
  };

  const handleAddPreset = (preset: typeof PRESET_SNACKS[0]) => {
    const newItem: FoodLogItem = {
      id: `food-${Date.now()}`,
      name: preset.name,
      mealType: modalMealType,
      calories: preset.calories,
      protein: preset.protein,
      carbs: preset.carbs,
      fat: preset.fat,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      portion: preset.portion
    };

    setDailyLog({
      ...dailyLog,
      foods: [newItem, ...dailyLog.foods]
    });

    setShowAddFoodModal(false);
  };

  const handleDeleteFood = (id: string) => {
    setDailyLog({
      ...dailyLog,
      foods: dailyLog.foods.filter(f => f.id !== id)
    });
  };

  const handleAddWater = (amountMl: number) => {
    setDailyLog({
      ...dailyLog,
      waterIntakeMl: Math.max(0, dailyLog.waterIntakeMl + amountMl)
    });
  };

  const getMealItems = (type: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    return dailyLog.foods.filter(f => f.mealType === type);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Calorie & Macro Target Dashboard */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Daily Energy & Balance
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
              Nutrition & Calorie Following
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              Target: <strong className="text-white">{profile.dailyCalorieTarget} kcal</strong> • Goal: <span className="capitalize">{profile.fitnessGoal.replace('_', ' ')}</span>
            </p>
          </div>

          <button
            id="quick-add-food-btn"
            onClick={() => {
              setModalMealType('lunch');
              setShowAddFoodModal(true);
            }}
            className="py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm transition-transform active:scale-95 shadow-lg shadow-emerald-500/20 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>Quick Log Food</span>
          </button>
        </div>

        {/* Big 3-Metric Gauges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
          
          {/* Intake */}
          <div className="bg-slate-800/60 border border-slate-700/60 p-5 rounded-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Calories Consumed
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white font-mono">{totalCaloriesConsumed}</span>
              <span className="text-xs text-slate-400">/ {profile.dailyCalorieTarget} kcal</span>
            </div>
            <div className="w-full h-2 bg-slate-700 rounded-full mt-3 overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${Math.min(100, (totalCaloriesConsumed / profile.dailyCalorieTarget) * 100)}%` }}
              />
            </div>
          </div>

          {/* Burned */}
          <div className="bg-slate-800/60 border border-slate-700/60 p-5 rounded-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Workout Burn
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-amber-400 font-mono">-{totalCaloriesBurnedFromWorkouts}</span>
              <span className="text-xs text-slate-400">kcal burned</span>
            </div>
            <span className="text-[11px] text-slate-400 block mt-2">
              {dailyLog.workoutsCompleted.length} Workout sessions logged today
            </span>
          </div>

          {/* Remaining */}
          <div className="bg-slate-800/60 border border-slate-700/60 p-5 rounded-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Calorie Budget Left
            </span>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-black font-mono ${remainingCalories >= 0 ? 'text-teal-300' : 'text-rose-400'}`}>
                {remainingCalories}
              </span>
              <span className="text-xs text-slate-400">kcal</span>
            </div>
            <span className="text-[11px] text-slate-400 block mt-2">
              {remainingCalories >= 0 ? 'Within target deficit/budget' : 'Slight calorie surplus'}
            </span>
          </div>

        </div>

        {/* Macronutrient breakdown progress bars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
          
          {/* Protein */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-400">Protein</span>
              <span className="text-slate-300 font-semibold">{totalProteinConsumed}g / {profile.dailyProteinTarget}g</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-400 transition-all duration-300"
                style={{ width: `${Math.min(100, (totalProteinConsumed / profile.dailyProteinTarget) * 100)}%` }}
              />
            </div>
          </div>

          {/* Carbs */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-teal-300">Carbohydrates</span>
              <span className="text-slate-300 font-semibold">{totalCarbsConsumed}g / {profile.dailyCarbsTarget}g</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-teal-400 transition-all duration-300"
                style={{ width: `${Math.min(100, (totalCarbsConsumed / profile.dailyCarbsTarget) * 100)}%` }}
              />
            </div>
          </div>

          {/* Fat */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-300">Healthy Fats</span>
              <span className="text-slate-300 font-semibold">{totalFatConsumed}g / {profile.dailyFatTarget}g</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-400 transition-all duration-300"
                style={{ width: `${Math.min(100, (totalFatConsumed / profile.dailyFatTarget) * 100)}%` }}
              />
            </div>
          </div>

        </div>

      </div>

      {/* Water Tracking & Daily Workout Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Water Tracker */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Droplet className="w-5 h-5 text-sky-400" />
                <h3 className="text-lg font-bold text-white font-['Outfit']">Hydration Tracker</h3>
              </div>
              <span className="text-xs font-bold text-sky-400">
                {dailyLog.waterIntakeMl} ml / 2500 ml
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Optimal hydration accelerates fat loss and muscle recovery during home training.
            </p>

            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden mb-4">
              <div 
                className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 transition-all duration-300"
                style={{ width: `${Math.min(100, (dailyLog.waterIntakeMl / 2500) * 100)}%` }}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleAddWater(250)}
              className="flex-1 py-2.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-bold transition-colors"
            >
              +250 ml (Glass)
            </button>
            <button
              onClick={() => handleAddWater(500)}
              className="flex-1 py-2.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-bold transition-colors"
            >
              +500 ml (Bottle)
            </button>
          </div>
        </div>

        {/* Workouts Completed Today */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white font-['Outfit']">Today's Completed Home Workouts</h3>
            </div>
            <span className="text-xs text-slate-400">
              {dailyLog.workoutsCompleted.length} Session(s)
            </span>
          </div>

          {dailyLog.workoutsCompleted.length === 0 ? (
            <div className="p-8 text-center bg-slate-800/40 rounded-2xl border border-slate-800/80">
              <p className="text-xs text-slate-400 mb-2">No workouts logged yet today.</p>
              <p className="text-[11px] text-slate-500">
                Go to the Workouts tab and start a session to auto-track calories burned!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {dailyLog.workoutsCompleted.map((w, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                      ✓
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-white">{w.workoutTitle}</h4>
                      <span className="text-xs text-slate-400">{w.durationMinutes} minutes duration</span>
                    </div>
                  </div>

                  <span className="text-sm font-black text-amber-400">
                    -{w.caloriesBurned} kcal
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Meal Breakdown Logs (Breakfast, Lunch, Dinner, Snack) */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 px-1">
          Detailed Food Log by Meal Type
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map(mealType => {
            const items = getMealItems(mealType);
            const mealCals = items.reduce((acc, i) => acc + i.calories, 0);

            return (
              <div key={mealType} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h4 className="text-base font-bold text-white capitalize font-['Outfit']">
                      {mealType === 'breakfast' && '🌅 Breakfast'}
                      {mealType === 'lunch' && '☀️ Lunch'}
                      {mealType === 'dinner' && '🌙 Dinner'}
                      {mealType === 'snack' && '🍎 Snacks & Supplements'}
                    </h4>
                    <span className="text-xs text-slate-400">{items.length} items logged</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-amber-400">{mealCals} kcal</span>
                    <button
                      onClick={() => {
                        setModalMealType(mealType);
                        setShowAddFoodModal(true);
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 transition-colors"
                      title="Add item to this meal"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {items.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-2 text-center">
                    No foods logged for this meal yet.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {items.map(item => (
                      <div key={item.id} className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold text-white block">{item.name}</span>
                          <span className="text-[11px] text-slate-400">
                            {item.portion} • P: {item.protein}g • C: {item.carbs}g • F: {item.fat}g
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-amber-400">{item.calories} kcal</span>
                          <button
                            onClick={() => handleDeleteFood(item.id)}
                            className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* QUICK ADD FOOD MODAL */}
      {showAddFoodModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white font-['Outfit']">
                Log Food / Recipe
              </h3>
              <button
                onClick={() => setShowAddFoodModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Meal Category Tab */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-slate-800 rounded-xl">
              {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setModalMealType(type)}
                  className={`py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                    modalMealType === type ? 'bg-emerald-500 text-slate-950' : 'text-slate-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Quick Preset Staples */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Quick Budget Staples:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_SNACKS.map((preset, pIdx) => (
                  <button
                    key={pIdx}
                    type="button"
                    onClick={() => handleAddPreset(preset)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition-colors"
                  >
                    + {preset.name} ({preset.calories} cal)
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input Form */}
            <form onSubmit={handleAddCustomFood} className="space-y-3 pt-2 border-t border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Or Enter Custom Food:
              </span>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Food / Dish Name</label>
                <input
                  type="text"
                  required
                  value={foodName}
                  onChange={e => setFoodName(e.target.value)}
                  placeholder="e.g. Scrambled Eggs & Rice, Black Bean Stew"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Calories (kcal)</label>
                  <input
                    type="number"
                    required
                    value={foodCalories}
                    onChange={e => setFoodCalories(e.target.value)}
                    placeholder="350"
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Protein (g)</label>
                  <input
                    type="number"
                    value={foodProtein}
                    onChange={e => setFoodProtein(e.target.value)}
                    placeholder="25"
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    value={foodCarbs}
                    onChange={e => setFoodCarbs(e.target.value)}
                    placeholder="40"
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Fat (g)</label>
                  <input
                    type="number"
                    value={foodFat}
                    onChange={e => setFoodFat(e.target.value)}
                    placeholder="10"
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
                >
                  Save to Daily Log
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddFoodModal(false)}
                  className="py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
