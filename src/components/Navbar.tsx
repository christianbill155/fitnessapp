import React from 'react';
import { 
  Dumbbell, 
  Utensils, 
  Flame, 
  Bot, 
  Crown, 
  Settings, 
  Wifi, 
  WifiOff, 
  Sparkles,
  DollarSign,
  User,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import { UserProfile, AuthUser, AppTab } from '../types';

interface NavbarProps {
  activeTab: AppTab | 'monetization';
  setActiveTab: (tab: any) => void;
  isOnline: boolean;
  profile: UserProfile;
  currentUser: AuthUser;
  onOpenSettings: () => void;
  onOpenSubscription: () => void;
  onOpenAuth: () => void;
  onOpenOfflineManager: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isOnline,
  profile,
  currentUser,
  onOpenSettings,
  onOpenSubscription,
  onOpenAuth,
  onOpenOfflineManager
}) => {
  const isSubscribed = profile.subscription.plan !== 'free';

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('workouts')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950 font-black">
              <Dumbbell className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white font-['Outfit']">FitRegion</span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Home & Budget
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-400">Zero-Equipment Workouts • Region-Smart Nutrition</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              id="nav-workouts-btn"
              onClick={() => setActiveTab('workouts')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'workouts'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Dumbbell className="w-4 h-4" />
              <span className="hidden sm:inline">Workouts</span>
            </button>

            <button
              id="nav-nutrition-btn"
              onClick={() => setActiveTab('nutrition')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'nutrition'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Utensils className="w-4 h-4" />
              <span className="hidden sm:inline">Budget Meals</span>
            </button>

            <button
              id="nav-tracker-btn"
              onClick={() => setActiveTab('calories')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'calories'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span className="hidden sm:inline">Calorie Tracker</span>
            </button>

            <button
              id="nav-coach-btn"
              onClick={() => setActiveTab('coach')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'coach'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span className="hidden sm:inline">AI Coach</span>
            </button>
          </nav>

          {/* Right utility buttons: Auth profile, Online/Offline pill, Sub status, Settings */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* User Account / Auth Button */}
            <button
              id="header-user-auth-btn"
              onClick={onOpenAuth}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                currentUser.isOwner
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 hover:bg-amber-500/20'
                  : currentUser.role === 'guest'
                  ? 'bg-slate-800 border-emerald-500/30 text-emerald-300 hover:bg-slate-700'
                  : 'bg-slate-800 border-slate-700 text-slate-200 hover:border-slate-600'
              }`}
              title="Account & Auth"
            >
              <span>{currentUser.avatar || (currentUser.isOwner ? '👑' : '👤')}</span>
              <span className="max-w-[80px] sm:max-w-[110px] truncate text-[11px]">
                {currentUser.isOwner ? 'Owner (Free VIP)' : currentUser.displayName}
              </span>
            </button>

            {/* Online / Offline status badge & hub trigger */}
            <button
              onClick={onOpenOfflineManager}
              title={isOnline ? 'Online & Synced (Click to view Offline & PWA Hub)' : 'Offline Mode (Click to manage Cache & Backup)'}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                isOnline 
                  ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/40' 
                  : 'bg-amber-950/60 border-amber-500/30 text-amber-300 hover:bg-amber-900/40'
              }`}
            >
              {isOnline ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="hidden lg:inline text-[11px]">PWA Ready</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 text-amber-400" />
                  <span className="hidden lg:inline text-[11px]">Offline App</span>
                </>
              )}
            </button>

            {/* Subscription Pill */}
            <button
              id="header-upgrade-pill-btn"
              onClick={onOpenSubscription}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                currentUser.isOwner || isSubscribed
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-emerald-500/40 hover:text-emerald-300'
              }`}
            >
              <Crown className={`w-3.5 h-3.5 ${currentUser.isOwner || isSubscribed ? 'text-amber-400' : 'text-slate-400'}`} />
              <span className="hidden md:inline">
                {currentUser.isOwner ? 'VIP Free Pass' : profile.subscription.plan === 'pro_annual' ? 'PRO Annual' : profile.subscription.plan === 'pro_monthly' ? 'PRO Monthly' : profile.subscription.plan === 'lifetime_vip' ? 'VIP Lifetime' : 'Free Trial'}
              </span>
            </button>

            {/* Settings Trigger */}
            <button
              id="header-settings-btn"
              onClick={onOpenSettings}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-colors"
              title="Profile & Budget Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
