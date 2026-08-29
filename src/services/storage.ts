import { 
  UserProfile, 
  WorkoutRoadmap, 
  WeeklyMealPlan, 
  DailyLog, 
  FoodLogItem,
  Recipe,
  ChatMessage,
  AuthUser
} from '../types';
import { 
  INITIAL_USER_PROFILE, 
  generateLocalWorkoutRoadmap, 
  generateLocalMealPlan, 
  SAMPLE_REGIONAL_RECIPES 
} from '../data/defaultData';
import { getCurrentUser } from './auth';

const KEYS = {
  PROFILE: 'fitregion_profile',
  ROADMAP: 'fitregion_workout_roadmap',
  MEAL_PLAN: 'fitregion_meal_plan',
  DAILY_LOGS: 'fitregion_daily_logs',
  FAV_RECIPES: 'fitregion_fav_recipes',
  CHAT_HISTORY: 'fitregion_chat_history',
  CUSTOM_RECIPES: 'fitregion_custom_recipes'
};

export const getTodayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export function loadUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(KEYS.PROFILE);
    let profile: UserProfile = INITIAL_USER_PROFILE;
    if (raw) {
      profile = JSON.parse(raw);
    }
    
    // Check current auth user
    const user = getCurrentUser();
    if (user && user.isOwner) {
      // Ensure owner has permanent Lifetime VIP unlocked for free
      profile.subscription = {
        plan: 'lifetime_vip',
        status: 'active',
        expiresAt: '2099-12-31T23:59:59.000Z',
        autoRenew: true,
        pricePaid: 0,
        billingCycle: 'one_time'
      };
    }
    return profile;
  } catch (e) {
    console.error('Error loading profile', e);
  }
  return INITIAL_USER_PROFILE;
}

export function saveUserProfile(profile: UserProfile) {
  try {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving profile', e);
  }
}

export function loadWorkoutRoadmap(profile?: UserProfile): WorkoutRoadmap {
  try {
    const raw = localStorage.getItem(KEYS.ROADMAP);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error loading roadmap', e);
  }
  const p = profile || loadUserProfile();
  const defaultRoadmap = generateLocalWorkoutRoadmap(
    p.fitnessGoal,
    p.fitnessLevel,
    p.availableEquipment,
    p.workoutDaysPerWeek,
    p.timePerWorkoutMinutes
  );
  saveWorkoutRoadmap(defaultRoadmap);
  return defaultRoadmap;
}

export function saveWorkoutRoadmap(roadmap: WorkoutRoadmap) {
  try {
    localStorage.setItem(KEYS.ROADMAP, JSON.stringify(roadmap));
  } catch (e) {
    console.error('Error saving roadmap', e);
  }
}

export function loadMealPlan(profile?: UserProfile): WeeklyMealPlan {
  try {
    const raw = localStorage.getItem(KEYS.MEAL_PLAN);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error loading meal plan', e);
  }
  const p = profile || loadUserProfile();
  const defaultPlan = generateLocalMealPlan(
    p.geographicRegion,
    p.budgetTier,
    p.dailyCalorieTarget
  );
  saveMealPlan(defaultPlan);
  return defaultPlan;
}

export const loadWeeklyMealPlan = loadMealPlan;

export function saveMealPlan(plan: WeeklyMealPlan) {
  try {
    localStorage.setItem(KEYS.MEAL_PLAN, JSON.stringify(plan));
  } catch (e) {
    console.error('Error saving meal plan', e);
  }
}

export const saveWeeklyMealPlan = saveMealPlan;

export function loadDailyLogs(): Record<string, DailyLog> {
  try {
    const raw = localStorage.getItem(KEYS.DAILY_LOGS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error loading daily logs', e);
  }
  return {};
}

export function loadDailyLog(profile?: UserProfile): DailyLog {
  const today = getTodayKey();
  const p = profile || loadUserProfile();
  return getDailyLogForDate(today, p);
}

export function addWorkoutToDailyLog(
  workoutTitle: string,
  durationMinutes: number,
  caloriesBurned: number
): DailyLog {
  const today = getTodayKey();
  const profile = loadUserProfile();
  const current = getDailyLogForDate(today, profile);

  const updated: DailyLog = {
    ...current,
    workoutsCompleted: [
      {
        workoutId: `workout-${Date.now()}`,
        workoutTitle,
        durationMinutes,
        caloriesBurned,
        completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      ...current.workoutsCompleted
    ]
  };

  saveDailyLog(updated);
  return updated;
}

export function getDailyLogForDate(dateStr: string, profile: UserProfile): DailyLog {
  const logs = loadDailyLogs();
  if (logs[dateStr]) {
    return logs[dateStr];
  }
  return {
    date: dateStr,
    waterIntakeMl: 0,
    targetCalories: profile.dailyCalorieTarget,
    targetProtein: profile.dailyProteinTarget,
    targetCarbs: profile.dailyCarbsTarget,
    targetFat: profile.dailyFatTarget,
    foods: [],
    workoutsCompleted: []
  };
}

export function saveDailyLog(log: DailyLog) {
  try {
    const logs = loadDailyLogs();
    logs[log.date] = log;
    localStorage.setItem(KEYS.DAILY_LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error('Error saving daily log', e);
  }
}

export function loadChatHistory(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(KEYS.CHAT_HISTORY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error loading chat history', e);
  }
  return [
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: "👋 Welcome to your FitRegion Coach! I'm here to help you reach your fitness goals right at home (with or without equipment) and optimize your daily nutrition around your regional cuisine and budget. What would you like to plan today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ];
}

export function saveChatHistory(messages: ChatMessage[]) {
  try {
    localStorage.setItem(KEYS.CHAT_HISTORY, JSON.stringify(messages));
  } catch (e) {
    console.error('Error saving chat history', e);
  }
}

export function exportAllUserData(): string {
  const data = {
    profile: loadUserProfile(),
    roadmap: localStorage.getItem(KEYS.ROADMAP),
    mealPlan: localStorage.getItem(KEYS.MEAL_PLAN),
    dailyLogs: loadDailyLogs(),
    exportDate: new Date().toISOString()
  };
  return JSON.stringify(data, null, 2);
}

export function importUserData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.profile) localStorage.setItem(KEYS.PROFILE, JSON.stringify(data.profile));
    if (data.roadmap) localStorage.setItem(KEYS.ROADMAP, typeof data.roadmap === 'string' ? data.roadmap : JSON.stringify(data.roadmap));
    if (data.mealPlan) localStorage.setItem(KEYS.MEAL_PLAN, typeof data.mealPlan === 'string' ? data.mealPlan : JSON.stringify(data.mealPlan));
    if (data.dailyLogs) localStorage.setItem(KEYS.DAILY_LOGS, JSON.stringify(data.dailyLogs));
    return true;
  } catch (e) {
    console.error('Error importing user data', e);
    return false;
  }
}
