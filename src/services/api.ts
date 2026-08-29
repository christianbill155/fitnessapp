import { 
  UserProfile, 
  WorkoutRoadmap, 
  WeeklyMealPlan, 
  ChatMessage, 
  FitnessGoal, 
  FitnessLevel, 
  EquipmentType, 
  GeographicRegion, 
  BudgetTier 
} from '../types';
import { generateLocalWorkoutRoadmap, generateLocalMealPlan } from '../data/defaultData';

export async function checkServerHealth(): Promise<{ online: boolean; hasApiKey: boolean }> {
  try {
    const res = await fetch('/api/health', { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      return { online: true, hasApiKey: Boolean(data.hasApiKey) };
    }
  } catch (e) {
    // Offline or server not responding
  }
  return { online: false, hasApiKey: false };
}

export async function requestWorkoutRoadmap(
  goal: FitnessGoal,
  level: FitnessLevel,
  equipment: EquipmentType[],
  daysPerWeek: number,
  minutesPerSession: number,
  limitations?: string
): Promise<{ roadmap: WorkoutRoadmap; isOfflineFallback: boolean }> {
  try {
    const res = await fetch('/api/generate-workout-roadmap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        goal,
        level,
        equipment,
        daysPerWeek,
        minutesPerSession,
        limitations
      }),
      signal: AbortSignal.timeout(25000)
    });

    if (res.ok) {
      const data = await res.json();
      return { roadmap: data, isOfflineFallback: false };
    }
  } catch (err) {
    console.warn('Backend unavailable, generating offline workout roadmap:', err);
  }

  // Graceful offline fallback
  const localRoadmap = generateLocalWorkoutRoadmap(goal, level, equipment, daysPerWeek, minutesPerSession);
  return { roadmap: localRoadmap, isOfflineFallback: true };
}

export async function requestMealPlan(
  region: GeographicRegion,
  budgetTier: BudgetTier,
  customDailyBudgetUSD: number,
  calorieTarget: number,
  dietaryRestrictions: string[],
  goal: FitnessGoal,
  availablePantry?: string
): Promise<{ plan: WeeklyMealPlan; isOfflineFallback: boolean }> {
  try {
    const res = await fetch('/api/generate-meal-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        region,
        budgetTier,
        customDailyBudgetUSD,
        calorieTarget,
        dietaryRestrictions,
        goal,
        availablePantry
      }),
      signal: AbortSignal.timeout(25000)
    });

    if (res.ok) {
      const data = await res.json();
      return { plan: data, isOfflineFallback: false };
    }
  } catch (err) {
    console.warn('Backend unavailable, generating offline meal plan:', err);
  }

  // Graceful offline fallback
  const localPlan = generateLocalMealPlan(region, budgetTier, calorieTarget);
  return { plan: localPlan, isOfflineFallback: true };
}

export async function sendCoachMessage(
  messages: ChatMessage[],
  userContext: UserProfile
): Promise<string> {
  try {
    const res = await fetch('/api/nutrition-coach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, userContext }),
      signal: AbortSignal.timeout(20000)
    });

    if (res.ok) {
      const data = await res.json();
      return data.reply || 'Here are some quick recommendations for your fitness journey!';
    }
  } catch (e) {
    console.warn('Coach backend offline, generating offline guidance', e);
  }

  // Offline intelligent advice rulebook
  const lastText = (messages[messages.length - 1]?.text || '').toLowerCase();
  if (lastText.includes('protein') || lastText.includes('muscle')) {
    return `🥦 **Offline Coach Tip for Budget Protein**:
- **Eggs & Egg Whites**: ~$0.20 per 6g pure protein.
- **Dry Beans & Lentils**: Over 20g protein per $0.50 batch when bought in 1kg/2kg bags.
- **Canned Sardines / Tuna / Mackerel**: Extremely dense in omega-3 fatty acids and complete protein.
- **Tofu & Greek Curd/Yogurt**: Fast absorption, versatile for stir-fries and breakfast bowls.`;
  }
  if (lastText.includes('workout') || lastText.includes('equipment') || lastText.includes('home')) {
    return `💪 **Offline Coach Tip for Home Workouts**:
- **Progressive Overload Without Weights**: Increase time-under-tension (3-second slow eccentric lowers), reduce rest intervals between sets, or elevate feet on a chair for push-ups.
- **Daily Consistency**: 20 focused minutes 4 times a week outperforms a sporadic 90-minute session.`;
  }
  return `💡 **FitRegion Offline Coach**:
To keep your nutrition budget lean and your results high:
1. Batch cook your staple grains and legumes on Sundays.
2. Track your water intake (aim for 2.5 - 3 Liters daily).
3. Use progressive bodyweight tempo (2 seconds down, 1 second pause at the bottom) to build dense muscle without any equipment!`;
}
