export type AppTab = 'workouts' | 'nutrition' | 'calories' | 'coach';

export type FitnessGoal = 'weight_loss' | 'muscle_gain' | 'endurance' | 'mobility_flexibility' | 'home_strength' | 'general_health';

export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';

export type EquipmentType = 
  | 'bodyweight_only' 
  | 'dumbbells' 
  | 'resistance_bands' 
  | 'chair_bench' 
  | 'pullup_bar' 
  | 'kettlebell' 
  | 'jump_rope' 
  | 'yoga_mat';

export type BudgetTier = 'ultra_budget' | 'smart_budget' | 'moderate' | 'flexible';

export type GeographicRegion = 
  | 'mediterranean' 
  | 'west_african' 
  | 'east_asian' 
  | 'south_asian' 
  | 'latin_american' 
  | 'north_american' 
  | 'middle_eastern' 
  | 'european_continental' 
  | 'southeast_asian';

export interface Exercise {
  id: string;
  name: string;
  targetMuscle: string;
  secondaryMuscles?: string[];
  equipment: EquipmentType;
  difficulty: FitnessLevel;
  type: 'reps' | 'time';
  defaultSets: number;
  defaultReps?: number;
  defaultDurationSeconds?: number;
  restSeconds: number;
  instructions: string[];
  tips: string[];
  caloriesPerMinute: number;
  videoPlaceholderText?: string;
  alternativeNoEquipment?: string;
}

export interface WorkoutDay {
  id: string;
  dayNumber: number;
  dayName: string; // e.g. "Day 1 - Lower Body & Core"
  focus: string;
  estimatedMinutes: number;
  estimatedCaloriesBurn: number;
  equipmentNeeded: EquipmentType[];
  exercises: {
    exercise: Exercise;
    sets: number;
    reps?: number;
    durationSeconds?: number;
    restSeconds: number;
    notes?: string;
  }[];
  completed?: boolean;
  completedAt?: string;
}

export interface WorkoutRoadmap {
  id: string;
  title: string;
  description: string;
  goal: FitnessGoal;
  level: FitnessLevel;
  equipment: EquipmentType[];
  daysPerWeek: number;
  minutesPerSession: number;
  weeksTotal: number;
  currentWeek: number;
  schedule: WorkoutDay[];
  generatedByAI?: boolean;
}

export interface RecipeIngredient {
  name: string;
  amount: string;
  estimatedCost: number; // in USD or local currency
  substitutes?: string[];
  category: 'produce' | 'protein' | 'grains_pantry' | 'dairy_alt' | 'spices_oils';
}

export interface Recipe {
  id: string;
  title: string;
  cuisine: GeographicRegion;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  estimatedCostPerServing: number;
  totalCost: number;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fiberGrams?: number;
  ingredients: RecipeIngredient[];
  instructions: string[];
  budgetTips: string[];
  regionalNotes: string;
  tags: string[];
}

export interface DailyMealPlan {
  id: string;
  dayName: string; // "Monday"
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  estimatedDailyCost: number;
  breakfast: Recipe;
  lunch: Recipe;
  dinner: Recipe;
  snack?: Recipe;
}

export interface WeeklyMealPlan {
  id: string;
  title: string;
  targetRegion: GeographicRegion;
  budgetTier: BudgetTier;
  targetDailyCalories: number;
  estimatedWeeklyBudget: number;
  currency: string;
  days: DailyMealPlan[];
  shoppingList: {
    category: string;
    items: { name: string; amount: string; estimatedCost: number; checked?: boolean }[];
  }[];
}

export interface FoodLogItem {
  id: string;
  name: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
  portion: string;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  waterIntakeMl: number;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  foods: FoodLogItem[];
  workoutsCompleted: {
    workoutId: string;
    workoutTitle: string;
    durationMinutes: number;
    caloriesBurned: number;
    completedAt: string;
  }[];
  weightKg?: number;
  notes?: string;
}

export type SubscriptionPlan = 'free' | 'pro_monthly' | 'pro_annual' | 'lifetime_vip';

export interface UserSubscription {
  plan: SubscriptionPlan;
  status: 'active' | 'trial' | 'expired' | 'canceled';
  expiresAt: string;
  autoRenew: boolean;
  pricePaid: number;
  billingCycle: 'monthly' | 'annual' | 'one_time' | 'free';
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: 'female' | 'male' | 'other';
  heightCm: number;
  weightKg: number;
  targetWeightKg?: number;
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';
  fitnessGoal: FitnessGoal;
  fitnessLevel: FitnessLevel;
  availableEquipment: EquipmentType[];
  timePerWorkoutMinutes: number;
  workoutDaysPerWeek: number;
  geographicRegion: GeographicRegion;
  monthlyFoodBudgetUSD: number;
  budgetTier: BudgetTier;
  dietaryRestrictions: string[]; // 'vegetarian', 'halal', 'vegan', 'gluten_free', 'none'
  dailyCalorieTarget: number;
  dailyProteinTarget: number;
  dailyCarbsTarget: number;
  dailyFatTarget: number;
  subscription: UserSubscription;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  category?: 'nutrition' | 'fitness' | 'budget' | 'recipe';
  suggestedActions?: { label: string; action: string; payload?: any }[];
}

export type UserRole = 'creator_owner' | 'member' | 'guest';

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  isOwner: boolean;
  isOfflineOnly?: boolean;
  avatar?: string;
  createdAt: string;
  lastLoginAt: string;
  authProvider: 'local_account' | 'owner_vip_pass' | 'offline_guest';
}

export interface StoredAccount extends AuthUser {
  passwordHash?: string;
  pinCode?: string;
}

export interface AuthSession {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isOwner: boolean;
  token?: string;
}
