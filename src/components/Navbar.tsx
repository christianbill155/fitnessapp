import React, { useState, useEffect } from 'react';
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
  Smartphone,
  Palette
} from 'lucide-react';
import { UserProfile, AuthUser, AppTab } from '../types';
import { themeService, AppPersonalization, COLOR_THEMES } from '../services/themeService';

interface NavbarProps {
  activeTab: AppTab | 'monetization';
  setActiveTab: (tab: any) => void;
  isOnline: boolean;
  profile: UserProfile;
  currentUser: AuthUser;
  onOpenSettings: () => void;
  onOpenPersonalization: () => void;
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
  onOpenPersonalization,
  onOpenSubscription,
  onOpenAuth,
  onOpenOfflineManager
}) => {
  const [personalization, setPersonalization] = useState<AppPersonalization>(() => themeService.getSettings());

  useEffect(() => {
    const unsub = themeService.subscribe((s) => {
      setPersonalization(s);
    });
    return unsub;
  }, []);

  const isSubscribed = profile.subscription.plan !== 'free';
  const currentTheme = COLOR_THEMES[personalization.colorTheme] || COLOR_THEMES.emerald;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('workouts')}>
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg text-slate-950 font-black transition-all"
              style={{
                background: `linear-gradient(135deg, ${currentTheme.primaryHex}, ${currentTheme.secondaryHex})`,
                boxShadow: personalization.accentGlow ? `0 4px 20px ${currentTheme.glowColor}` : 'none'
              }}
            >
              <Dumbbell className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white font-['Outfit']">
                  {personalization.appName}
                </span>
                <span 
                  className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-md"
                  style={{
                    backgroundColor: `rgba(${currentTheme.primaryRgb}, 0.12)`,
                    color: currentTheme.primaryHex,
                    border: `1px solid rgba(${currentTheme.primaryRgb}, 0.25)`
                  }}
                >
                  {currentTheme.name}
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-400">
                {personalization.appSubtitle}
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              id="nav-workouts-btn"
              onClick={() => setActiveTab('workouts')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'workouts'
                  ? 'text-slate-950 shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
              style={activeTab === 'workouts' ? { 
                backgroundColor: currentTheme.primaryHex,
                boxShadow: personalization.accentGlow ? `0 4px 14px ${currentTheme.glowColor}` : 'none'
              } : {}}
            >
              <Dumbbell className="w-4 h-4" />
              <span className="hidden sm:inline">Workouts</span>
            </button>

            <button
              id="nav-nutrition-btn"
              onClick={() => setActiveTab('nutrition')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'nutrition'
                  ? 'text-slate-950 shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
              style={activeTab === 'nutrition' ? { 
                backgroundColor: currentTheme.primaryHex,
                boxShadow: personalization.accentGlow ? `0 4px 14px ${currentTheme.glowColor}` : 'none'
              } : {}}
            >
              <Utensils className="w-4 h-4" />
              <span className="hidden sm:inline">Budget Meals</span>
            </button>

            <button
              id="nav-tracker-btn"
              onClick={() => setActiveTab('calories')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'calories'
                  ? 'text-slate-950 shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
              style={activeTab === 'calories' ? { 
                backgroundColor: currentTheme.primaryHex,
                boxShadow: personalization.accentGlow ? `0 4px 14px ${currentTheme.glowColor}` : 'none'
              } : {}}
            >
              <Flame className="w-4 h-4" />
              <span className="hidden sm:inline">Calorie Tracker</span>
            </button>

            <button
              id="nav-coach-btn"
              onClick={() => setActiveTab('coach')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'coach'
                  ? 'text-slate-950 shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
              style={activeTab === 'coach' ? { 
                backgroundColor: currentTheme.primaryHex,
                boxShadow: personalization.accentGlow ? `0 4px 14px ${currentTheme.glowColor}` : 'none'
              } : {}}
            >
              <Bot className="w-4 h-4" />
              <span className="hidden sm:inline">AI Coach</span>
            </button>
          </nav>

          {/* Right utility buttons: Personalize, Auth profile, Online/Offline pill, Sub status, Settings */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Quick Personalize Trigger */}
            <button
              onClick={onOpenPersonalization}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-all shadow-sm"
              title="Personalize Color Themes, Custom Wallpapers, Units & Mottos"
            >
              <Palette className="w-3.5 h-3.5" style={{ color: currentTheme.primaryHex }} />
              <span className="hidden lg:inline text-[11px]">Personalize</span>
            </button>

            {/* User Account / Auth Button */}
            <button
              id="header-user-auth-btn"
              onClick={onOpenAuth}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                currentUser.isOwner
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 hover:bg-amber-500/20'
                  : currentUser.role === 'guest'
                  ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  : 'bg-slate-800 border-slate-700 text-slate-200 hover:border-slate-600'
              }`}
              title="Account & Auth"
            >
              <span>{currentUser.avatar || (currentUser.isOwner ? '👑' : '👤')}</span>
              <span className="max-w-[70px] sm:max-w-[100px] truncate text-[11px]">
                {currentUser.isOwner ? 'Owner (VIP)' : currentUser.displayName}
              </span>
            </button>

            {/* Online / Offline status badge & hub trigger */}
            <button
              onClick={onOpenOfflineManager}
              title={isOnline ? 'Online & Synced (Click to view Offline & PWA Hub)' : 'Offline Mode (Click to manage Cache & Backup)'}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                isOnline 
                  ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/40' 
                  : 'bg-amber-950/60 border-amber-500/30 text-amber-300 hover:bg-amber-900/40'
              }`}
            >
              {isOnline ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="hidden xl:inline text-[11px]">PWA Ready</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 text-amber-400" />
                  <span className="hidden xl:inline text-[11px]">Offline App</span>
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
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
              }`}
            >
              <Crown className={`w-3.5 h-3.5 ${currentUser.isOwner || isSubscribed ? 'text-amber-400' : 'text-slate-400'}`} />
              <span className="hidden md:inline">
                {currentUser.isOwner ? 'VIP Free' : profile.subscription.plan === 'pro_annual' ? 'PRO' : profile.subscription.plan === 'pro_monthly' ? 'PRO' : profile.subscription.plan === 'lifetime_vip' ? 'VIP' : 'Free Trial'}
              </span>
            </button>

            {/* Settings Trigger */}
            <button
              id="header-settings-btn"
              onClick={onOpenSettings}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-colors"
              title="Profile & Biometric Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

