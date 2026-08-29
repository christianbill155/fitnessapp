import React, { useState, useEffect } from 'react';
import { 
  Dumbbell, 
  Utensils, 
  Flame, 
  Bot, 
  Crown, 
  Globe2, 
  Sparkles, 
  Layers, 
  Heart,
  ShieldCheck,
  Zap,
  TrendingUp,
  Clock,
  DollarSign,
  Download,
  Smartphone,
  CheckCircle2,
  X,
  WifiOff,
  User
} from 'lucide-react';
import { 
  AppTab, 
  UserProfile, 
  WorkoutRoadmap, 
  WeeklyMealPlan, 
  DailyLog, 
  WorkoutDay, 
  Recipe,
  AuthUser 
} from './types';
import { 
  loadUserProfile, 
  saveUserProfile, 
  loadWorkoutRoadmap, 
  saveWorkoutRoadmap, 
  loadWeeklyMealPlan, 
  saveWeeklyMealPlan, 
  loadDailyLog, 
  saveDailyLog,
  addWorkoutToDailyLog
} from './services/storage';
import { getCurrentUser } from './services/auth';

// Components
import { Navbar } from './components/Navbar';
import { WorkoutRoadmapView } from './components/WorkoutRoadmapView';
import { MealPlannerView } from './components/MealPlannerView';
import { CalorieTrackerView } from './components/CalorieTrackerView';
import { AiCoachView } from './components/AiCoachView';
import { ActiveWorkoutModal } from './components/ActiveWorkoutModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { ProfileSettingsModal } from './components/ProfileSettingsModal';
import { AuthModal } from './components/AuthModal';
import { OfflineManagerModal } from './components/OfflineManagerModal';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<AppTab>('workouts');
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<AuthUser>(() => getCurrentUser());

  // Persistent Domain State
  const [profile, setProfile] = useState<UserProfile>(() => loadUserProfile());
  const [roadmap, setRoadmap] = useState<WorkoutRoadmap>(() => loadWorkoutRoadmap());
  const [mealPlan, setMealPlan] = useState<WeeklyMealPlan>(() => loadWeeklyMealPlan());
  const [dailyLog, setDailyLog] = useState<DailyLog>(() => loadDailyLog());

  // Modals
  const [activeWorkoutDay, setActiveWorkoutDay] = useState<WorkoutDay | null>(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showOfflineModal, setShowOfflineModal] = useState(false);

  // PWA Install Prompt State
  const [installPromptEvent, setInstallPromptEvent] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(true);

  // Online / Offline Listeners
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for PWA installation prompt
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setInstallPromptEvent(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  // Sync profile when owner status is active
  useEffect(() => {
    if (currentUser.isOwner && profile.subscription.plan !== 'lifetime_vip') {
      setProfile(prev => ({
        ...prev,
        subscription: {
          plan: 'lifetime_vip',
          status: 'active',
          expiresAt: '2099-12-31T23:59:59.000Z',
          autoRenew: true,
          pricePaid: 0,
          billingCycle: 'one_time'
        }
      }));
    }
  }, [currentUser]);

  // Sync to local persistence whenever state changes
  useEffect(() => {
    saveUserProfile(profile);
  }, [profile]);

  useEffect(() => {
    saveWorkoutRoadmap(roadmap);
  }, [roadmap]);

  useEffect(() => {
    saveWeeklyMealPlan(mealPlan);
  }, [mealPlan]);

  useEffect(() => {
    saveDailyLog(dailyLog);
  }, [dailyLog]);

  // Handler: When user triggers native PWA install
  const handleTriggerInstall = async () => {
    if (installPromptEvent) {
      installPromptEvent.prompt();
      const choice = await installPromptEvent.userChoice;
      if (choice.outcome === 'accepted') {
        setInstallPromptEvent(null);
        setShowInstallBanner(false);
      }
    } else {
      setShowOfflineModal(true);
    }
  };

  // Handler: When user completes an active workout
  const handleWorkoutComplete = (workoutTitle: string, durationMinutes: number, caloriesBurned: number) => {
    const updated = addWorkoutToDailyLog(workoutTitle, durationMinutes, caloriesBurned);
    setDailyLog(updated);
    setActiveWorkoutDay(null);
  };

  // Handler: When user clicks "Log Food" on a recipe in the meal planner
  const handleLogRecipeAsFood = (recipe: Recipe) => {
    const newFoodItem = {
      id: `recipe-log-${Date.now()}`,
      name: recipe.title,
      mealType: (recipe.mealType || 'lunch') as any,
      calories: recipe.calories,
      protein: recipe.proteinGrams,
      carbs: recipe.carbsGrams,
      fat: recipe.fatGrams,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      portion: '1 portion'
    };

    const updatedLog: DailyLog = {
      ...dailyLog,
      foods: [newFoodItem, ...dailyLog.foods]
    };
    setDailyLog(updatedLog);
    setActiveTab('calories');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] antialiased selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Top Banner for App Creator / Offline Install */}
      {currentUser.isOwner && showInstallBanner && (
        <aside aria-label="Creator banner" className="bg-gradient-to-r from-amber-500/20 via-slate-900 to-emerald-500/10 border-b border-amber-500/30 px-4 py-2 text-xs">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-amber-500 text-slate-950 font-bold text-[10px]">👑 CREATOR</span>
              <span className="text-slate-200">
                Welcome, <strong>poccnkcc</strong>! Lifetime VIP Free Pass is <strong>Active</strong> with 100% offline access after deployment.
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleTriggerInstall}
                className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 underline underline-offset-2"
              >
                <Smartphone className="w-3.5 h-3.5" /> Install App to Device (PWA)
              </button>
              <button
                onClick={() => setShowInstallBanner(false)}
                className="text-slate-500 hover:text-slate-300 p-0.5"
                title="Dismiss banner"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        currentUser={currentUser}
        onOpenSubscription={() => setShowSubscriptionModal(true)}
        onOpenProfile={() => setShowProfileModal(true)}
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenOfflineManager={() => setShowOfflineModal(true)}
        isOnline={isOnline}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'workouts' && (
          <WorkoutRoadmapView
            roadmap={roadmap}
            setRoadmap={setRoadmap}
            profile={profile}
            onStartWorkout={(day) => setActiveWorkoutDay(day)}
            isOnline={isOnline}
          />
        )}

        {activeTab === 'nutrition' && (
          <MealPlannerView
            mealPlan={mealPlan}
            setMealPlan={setMealPlan}
            profile={profile}
            onLogFood={handleLogRecipeAsFood}
            isOnline={isOnline}
          />
        )}

        {activeTab === 'calories' && (
          <CalorieTrackerView
            dailyLog={dailyLog}
            setDailyLog={setDailyLog}
            profile={profile}
          />
        )}

        {activeTab === 'coach' && (
          <AiCoachView
            profile={profile}
            isOnline={isOnline}
          />
        )}
      </main>

      {/* Footer info & quick summary */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400 font-['Outfit']">FitRegion</span>
            <span>•</span>
            <span>Home Fitness & Regional Nutrition Engine</span>
            <span>•</span>
            <span className="text-emerald-400 font-medium">100% Offline PWA Enabled</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <button
              onClick={() => setShowAuthModal(true)}
              className="text-slate-300 hover:text-white flex items-center gap-1"
            >
              <User className="w-3.5 h-3.5 text-emerald-400" /> Account: {currentUser.displayName}
            </button>
            <span>•</span>
            <button
              onClick={() => setShowSubscriptionModal(true)}
              className="text-amber-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <Crown className="w-3.5 h-3.5" /> {currentUser.isOwner ? 'VIP Free Pass' : 'Pro Subscriptions'}
            </button>
            <span>•</span>
            <button
              onClick={() => setShowOfflineModal(true)}
              className="text-slate-300 hover:underline flex items-center gap-1"
            >
              <WifiOff className="w-3.5 h-3.5 text-emerald-400" /> Offline & Backup Hub
            </button>
          </div>
        </div>
      </footer>

      {/* Active Workout Player Modal */}
      {activeWorkoutDay && (
        <ActiveWorkoutModal
          workoutDay={activeWorkoutDay}
          onClose={() => setActiveWorkoutDay(null)}
          onComplete={handleWorkoutComplete}
        />
      )}

      {/* Pro & SaaS Subscription Modal */}
      {showSubscriptionModal && (
        <SubscriptionModal
          profile={profile}
          setProfile={setProfile}
          currentUser={currentUser}
          onClose={() => setShowSubscriptionModal(false)}
        />
      )}

      {/* Profile & Biometrics Settings Modal */}
      {showProfileModal && (
        <ProfileSettingsModal
          profile={profile}
          setProfile={setProfile}
          currentUser={currentUser}
          onOpenAuth={() => setShowAuthModal(true)}
          onOpenOfflineManager={() => setShowOfflineModal(true)}
          onClose={() => setShowProfileModal(false)}
        />
      )}

      {/* User Authentication & Creator Pass Modal */}
      {showAuthModal && (
        <AuthModal
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          profile={profile}
          setProfile={setProfile}
          onClose={() => setShowAuthModal(false)}
          onOpenSubscription={() => setShowSubscriptionModal(true)}
        />
      )}

      {/* Offline & PWA Hub Modal */}
      {showOfflineModal && (
        <OfflineManagerModal
          isOnline={isOnline}
          onClose={() => setShowOfflineModal(false)}
          onDataRestored={() => {
            setProfile(loadUserProfile());
            setRoadmap(loadWorkoutRoadmap());
            setMealPlan(loadWeeklyMealPlan());
            setDailyLog(loadDailyLog());
          }}
        />
      )}

    </div>
  );
}
