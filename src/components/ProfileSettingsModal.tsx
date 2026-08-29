import React, { useState } from 'react';
import { 
  X, 
  User, 
  Save, 
  Download, 
  Upload, 
  RotateCcw, 
  ShieldCheck, 
  DollarSign, 
  Globe2, 
  Dumbbell, 
  Activity,
  CheckCircle2,
  Crown,
  KeyRound,
  WifiOff
} from 'lucide-react';
import { 
  UserProfile, 
  GeographicRegion, 
  BudgetTier, 
  FitnessGoal, 
  FitnessLevel, 
  EquipmentType,
  AuthUser 
} from '../types';
import { REGIONS_META } from '../data/defaultData';
import { exportAllUserData, importUserData } from '../services/storage';

interface ProfileSettingsModalProps {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  currentUser?: AuthUser;
  onOpenAuth?: () => void;
  onOpenOfflineManager?: () => void;
  onClose: () => void;
}

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({
  profile,
  setProfile,
  currentUser,
  onOpenAuth,
  onOpenOfflineManager,
  onClose
}) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Auto calculate BMR & TDEE
  const calculateMacros = (weight: number, height: number, age: number, gender: string, activity: string, goal: FitnessGoal) => {
    // Mifflin-St Jeor Equation
    let bmr = 10 * weight + 6.25 * height - 5 * age + (gender === 'male' ? 5 : -161);
    
    let mult = 1.2;
    if (activity === 'lightly_active') mult = 1.375;
    if (activity === 'moderately_active') mult = 1.55;
    if (activity === 'very_active') mult = 1.725;

    let tdee = bmr * mult;

    // Adjust for goal
    if (goal === 'weight_loss') tdee -= 400; // safe deficit
    if (goal === 'muscle_gain') tdee += 300; // lean surplus

    const calTarget = Math.round(tdee);
    const proteinGrams = Math.round(weight * 1.8); // 1.8g/kg
    const fatGrams = Math.round((calTarget * 0.25) / 9);
    const carbsGrams = Math.round((calTarget - (proteinGrams * 4 + fatGrams * 9)) / 4);

    return { calTarget, proteinGrams, fatGrams, carbsGrams };
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const macros = calculateMacros(
      formData.weightKg,
      formData.heightCm,
      formData.age,
      formData.gender,
      formData.activityLevel,
      formData.fitnessGoal
    );

    const updated: UserProfile = {
      ...formData,
      dailyCalorieTarget: macros.calTarget,
      dailyProteinTarget: macros.proteinGrams,
      dailyFatTarget: macros.fatGrams,
      dailyCarbsTarget: macros.carbsGrams
    };

    setProfile(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const toggleEquipment = (eq: EquipmentType) => {
    const list = formData.availableEquipment || [];
    if (list.includes(eq)) {
      setFormData({
        ...formData,
        availableEquipment: list.filter(e => e !== eq)
      });
    } else {
      setFormData({
        ...formData,
        availableEquipment: [...list, eq]
      });
    }
  };

  const handleExportData = () => {
    const jsonStr = exportAllUserData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fitregion-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content && importUserData(content)) {
        setImportStatus('Backup restored successfully! Reloading...');
        setTimeout(() => window.location.reload(), 1000);
      } else {
        setImportStatus('Invalid backup file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white font-['Outfit']">Profile & Settings</h2>
            <p className="text-xs text-slate-400">Configure your biometrics, regional food budget, and home training equipment.</p>
          </div>
        </div>

        {savedSuccess && (
          <div className="mb-6 p-4 bg-emerald-950/80 border border-emerald-500/40 rounded-2xl text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Profile and recalculated daily macro targets saved!</span>
          </div>
        )}

        {/* Section 0: Active Account & Authentication */}
        {currentUser && (
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-xl">
                {currentUser.avatar || '👤'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{currentUser.displayName}</span>
                  {currentUser.isOwner ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                      <Crown className="w-3 h-3 text-amber-400" /> OWNER VIP FREE
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
                      {currentUser.role.toUpperCase()}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{currentUser.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onOpenAuth && (
                <button
                  type="button"
                  onClick={() => { onClose(); onOpenAuth(); }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <KeyRound className="w-3.5 h-3.5" /> Switch Account
                </button>
              )}
              {onOpenOfflineManager && (
                <button
                  type="button"
                  onClick={() => { onClose(); onOpenOfflineManager(); }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <WifiOff className="w-3.5 h-3.5" /> Offline Hub
                </button>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Section 1: Biometrics */}
          <div className="bg-slate-800/40 border border-slate-700/60 p-5 rounded-2xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" /> Biometric Data & Goals
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={e => setFormData({ ...formData, age: parseInt(e.target.value, 10) || 25 })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Gender</label>
                <select
                  value={formData.gender}
                  onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={formData.heightCm}
                  onChange={e => setFormData({ ...formData, heightCm: parseInt(e.target.value, 10) || 170 })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Weight (kg)</label>
                <input
                  type="number"
                  value={formData.weightKg}
                  onChange={e => setFormData({ ...formData, weightKg: parseFloat(e.target.value) || 70 })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Primary Fitness Goal</label>
                <select
                  value={formData.fitnessGoal}
                  onChange={e => setFormData({ ...formData, fitnessGoal: e.target.value as FitnessGoal })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                >
                  <option value="weight_loss">Weight Loss & Fat Burn</option>
                  <option value="muscle_gain">Muscle Building & Hypertrophy</option>
                  <option value="home_strength">Home Strength & Tone</option>
                  <option value="endurance">Endurance & Cardio</option>
                  <option value="mobility_flexibility">Mobility & Posture</option>
                  <option value="general_health">General Health & Longevity</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Daily Activity Level</label>
                <select
                  value={formData.activityLevel}
                  onChange={e => setFormData({ ...formData, activityLevel: e.target.value as any })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                >
                  <option value="sedentary">Sedentary (Desk job / little movement)</option>
                  <option value="lightly_active">Lightly Active (1-3 days exercise/week)</option>
                  <option value="moderately_active">Moderately Active (3-5 days exercise/week)</option>
                  <option value="very_active">Very Active (6-7 days intense training)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Regional Nutrition & Budget */}
          <div className="bg-slate-800/40 border border-slate-700/60 p-5 rounded-2xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-teal-400" /> Geographic Region & Monthly Food Budget
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Geographic Culinary Tradition</label>
                <select
                  value={formData.geographicRegion}
                  onChange={e => setFormData({ ...formData, geographicRegion: e.target.value as GeographicRegion })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                >
                  {Object.entries(REGIONS_META).map(([k, r]) => (
                    <option key={k} value={k}>
                      {r.icon} {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  Monthly Food Budget ($USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400">$</span>
                  <input
                    type="number"
                    value={formData.monthlyFoodBudgetUSD}
                    onChange={e => setFormData({ ...formData, monthlyFoodBudgetUSD: parseInt(e.target.value, 10) || 150 })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 pl-7 text-xs text-white"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  ~${Math.round(formData.monthlyFoodBudgetUSD / 30)} / day allowance
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Equipment Owned */}
          <div className="bg-slate-800/40 border border-slate-700/60 p-5 rounded-2xl space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-amber-400" /> Home Equipment Available
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'bodyweight_only', label: 'Bodyweight (Floor)' },
                { id: 'chair_bench', label: 'Chair / Bench' },
                { id: 'dumbbells', label: 'Dumbbells' },
                { id: 'resistance_bands', label: 'Resistance Bands' },
                { id: 'pullup_bar', label: 'Pull-Up Bar' },
                { id: 'jump_rope', label: 'Jump Rope' },
                { id: 'yoga_mat', label: 'Yoga Mat' }
              ].map(eq => {
                const isSelected = formData.availableEquipment?.includes(eq.id as EquipmentType);
                return (
                  <button
                    key={eq.id}
                    type="button"
                    onClick={() => toggleEquipment(eq.id as EquipmentType)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                      isSelected
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '} {eq.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Offline Backup & Restore */}
          <div className="p-4 rounded-2xl bg-slate-800/20 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-slate-300 block">Offline Backup & Export</span>
              <span className="text-[11px] text-slate-400">Save all workout logs, meal plans, and customized macros locally.</span>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleExportData}
                className="flex-1 sm:flex-initial px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>

              <label className="flex-1 sm:flex-initial px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Import Backup</span>
                <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
              </label>
            </div>
          </div>

          {importStatus && (
            <p className="text-xs text-amber-300 font-semibold">{importStatus}</p>
          )}

          {/* Save Button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition-transform active:scale-95 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile & Recalculate Nutrition</span>
          </button>

        </form>

      </div>
    </div>
  );
};
