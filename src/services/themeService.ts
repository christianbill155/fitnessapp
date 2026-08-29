// App Personalization & Customization Service
// Allows users to customize App Name, Color Themes, Background Presets & Custom Uploads, Units & Notations, Motivational Mottos & Gym Notes.

export type ColorThemeId = 
  | 'emerald' 
  | 'cyber_cyan' 
  | 'electric_violet' 
  | 'crimson_forge' 
  | 'sunset_gold' 
  | 'oceanic_blue' 
  | 'monochrome_slate';

export type BackgroundPresetId = 
  | 'pure_white'
  | 'studio_light'
  | 'warm_ivory'
  | 'mint_clarity'
  | 'sky_breeze'
  | 'rose_blush'
  | 'custom_solid'
  | 'none' 
  | 'gym_dark_iron' 
  | 'neon_cyber_grid' 
  | 'zen_calm_mist' 
  | 'luxury_obsidian' 
  | 'deep_space_aurora' 
  | 'custom_uploaded';

export type ThemeMode = 'light' | 'dark';

export type WeightUnit = 'kg' | 'lbs';
export type HeightUnit = 'cm' | 'ft_in';
export type EnergyUnit = 'kcal' | 'kJ';
export type CurrencySymbol = '$' | '€' | '£' | '¥' | '₹' | 'R$' | 'C$' | 'A$' | 'CHF' | 'kr' | 'zł' | string;

export interface AppPersonalization {
  appName: string;
  appSubtitle: string;
  themeMode: ThemeMode;
  colorTheme: ColorThemeId;
  backgroundPreset: BackgroundPresetId;
  customSolidColor: string;
  customBackgroundImageUrl?: string;
  backgroundBlur: number; // 0 to 20 px
  backgroundOpacity: number; // 0.05 to 1.0
  backgroundFit?: 'cover' | 'contain' | 'tile';
  backgroundOverlayTint?: 'auto' | 'light' | 'dark' | 'none';
  weightUnit: WeightUnit;
  heightUnit: HeightUnit;
  energyUnit: EnergyUnit;
  currencySymbol: CurrencySymbol;
  glassmorphismStyle: 'subtle' | 'intense' | 'solid';
  accentGlow: boolean;
  motivationalMotto: string;
  gymNotes: string;
  showMottoBanner: boolean;
}

export interface CuratedWallpaper {
  id: string;
  name: string;
  category: 'gym' | 'nature' | 'studio' | 'cyber';
  url: string;
  thumbnail: string;
  description: string;
}

export const CURATED_WALLPAPERS: CuratedWallpaper[] = [
  {
    id: 'iron_gym_dark',
    name: 'Iron Temple Gym Floor',
    category: 'gym',
    url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1600&auto=format&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=300&auto=format&fit=crop',
    description: 'Moody fitness center with barbells and athletic iron aesthetic'
  },
  {
    id: 'modern_light_studio',
    name: 'Daylight Fitness Studio',
    category: 'studio',
    url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1600&auto=format&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=300&auto=format&fit=crop',
    description: 'Clean, bright wooden gym floor and expansive mirror reflections'
  },
  {
    id: 'outdoor_sunset_run',
    name: 'Sunset Ocean Trail Runner',
    category: 'nature',
    url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=1600&auto=format&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=300&auto=format&fit=crop',
    description: 'Golden hour cardiovascular marathon trail and ocean breeze'
  },
  {
    id: 'mountain_mist_sunrise',
    name: 'Alpine Peak Sunrise',
    category: 'nature',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1600&auto=format&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=300&auto=format&fit=crop',
    description: 'Quiet meditative sunrise over serene mountain lakes'
  },
  {
    id: 'minimal_slate_architecture',
    name: 'Architectural Stone & Concrete',
    category: 'studio',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=300&auto=format&fit=crop',
    description: 'Crisp minimalist architectural textures and contemporary lighting'
  },
  {
    id: 'cyber_athletic_neon',
    name: 'Cyber Velocity Matrix',
    category: 'cyber',
    url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1600&auto=format&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=300&auto=format&fit=crop',
    description: 'Vibrant neon gradient flow for high energy and focus'
  }
];

export interface ColorThemeDefinition {
  id: ColorThemeId;
  name: string;
  description: string;
  primaryHex: string;
  primaryHoverHex: string;
  primaryRgb: string; // for rgba()
  secondaryHex: string;
  accentGradient: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  glowColor: string;
  tailwindBg: string;
  tailwindText: string;
  tailwindBorder: string;
}

export const COLOR_THEMES: Record<ColorThemeId, ColorThemeDefinition> = {
  emerald: {
    id: 'emerald',
    name: 'Emerald Pulse',
    description: 'Energetic vitality, clean herbal & athletic tones',
    primaryHex: '#10b981',
    primaryHoverHex: '#059669',
    primaryRgb: '16, 185, 129',
    secondaryHex: '#14b8a6',
    accentGradient: 'from-emerald-500 to-teal-400',
    badgeBg: 'bg-emerald-500/10',
    badgeText: 'text-emerald-400',
    badgeBorder: 'border-emerald-500/20',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    tailwindBg: 'bg-emerald-500',
    tailwindText: 'text-emerald-400',
    tailwindBorder: 'border-emerald-500'
  },
  cyber_cyan: {
    id: 'cyber_cyan',
    name: 'Cyber Cyan',
    description: 'Futuristic sci-fi velocity & high-contrast clarity',
    primaryHex: '#06b6d4',
    primaryHoverHex: '#0891b2',
    primaryRgb: '6, 182, 212',
    secondaryHex: '#38bdf8',
    accentGradient: 'from-cyan-500 to-sky-400',
    badgeBg: 'bg-cyan-500/10',
    badgeText: 'text-cyan-400',
    badgeBorder: 'border-cyan-500/20',
    glowColor: 'rgba(6, 182, 212, 0.4)',
    tailwindBg: 'bg-cyan-500',
    tailwindText: 'text-cyan-400',
    tailwindBorder: 'border-cyan-500'
  },
  electric_violet: {
    id: 'electric_violet',
    name: 'Electric Violet',
    description: 'Royal power, deep amethyst & cybernetic purple',
    primaryHex: '#8b5cf6',
    primaryHoverHex: '#7c3aed',
    primaryRgb: '139, 92, 246',
    secondaryHex: '#d946ef',
    accentGradient: 'from-violet-500 to-fuchsia-400',
    badgeBg: 'bg-violet-500/10',
    badgeText: 'text-violet-400',
    badgeBorder: 'border-violet-500/20',
    glowColor: 'rgba(139, 92, 246, 0.4)',
    tailwindBg: 'bg-violet-500',
    tailwindText: 'text-violet-400',
    tailwindBorder: 'border-violet-500'
  },
  crimson_forge: {
    id: 'crimson_forge',
    name: 'Crimson Forge',
    description: 'Raw high-octane intensity, blood iron & fiery focus',
    primaryHex: '#ef4444',
    primaryHoverHex: '#dc2626',
    primaryRgb: '239, 68, 68',
    secondaryHex: '#f43f5e',
    accentGradient: 'from-rose-500 to-red-500',
    badgeBg: 'bg-rose-500/10',
    badgeText: 'text-rose-400',
    badgeBorder: 'border-rose-500/20',
    glowColor: 'rgba(239, 68, 68, 0.4)',
    tailwindBg: 'bg-rose-500',
    tailwindText: 'text-rose-400',
    tailwindBorder: 'border-rose-500'
  },
  sunset_gold: {
    id: 'sunset_gold',
    name: 'Sunset Gold',
    description: 'Warm championship gold, molten amber & radiant sun',
    primaryHex: '#f59e0b',
    primaryHoverHex: '#d97706',
    primaryRgb: '245, 158, 11',
    secondaryHex: '#fbbf24',
    accentGradient: 'from-amber-500 to-orange-400',
    badgeBg: 'bg-amber-500/10',
    badgeText: 'text-amber-400',
    badgeBorder: 'border-amber-500/20',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    tailwindBg: 'bg-amber-500',
    tailwindText: 'text-amber-400',
    tailwindBorder: 'border-amber-500'
  },
  oceanic_blue: {
    id: 'oceanic_blue',
    name: 'Oceanic Sapphire',
    description: 'Deep cobalt depths, focused oceanic stamina',
    primaryHex: '#3b82f6',
    primaryHoverHex: '#2563eb',
    primaryRgb: '59, 130, 246',
    secondaryHex: '#60a5fa',
    accentGradient: 'from-blue-500 to-cyan-400',
    badgeBg: 'bg-blue-500/10',
    badgeText: 'text-blue-400',
    badgeBorder: 'border-blue-500/20',
    glowColor: 'rgba(59, 130, 246, 0.4)',
    tailwindBg: 'bg-blue-500',
    tailwindText: 'text-blue-400',
    tailwindBorder: 'border-blue-500'
  },
  monochrome_slate: {
    id: 'monochrome_slate',
    name: 'Obsidian Carbon',
    description: 'Ultra-refined minimalist luxury & titanium dark aesthetic',
    primaryHex: '#cbd5e1',
    primaryHoverHex: '#94a3b8',
    primaryRgb: '203, 213, 225',
    secondaryHex: '#f1f5f9',
    accentGradient: 'from-slate-200 to-slate-400',
    badgeBg: 'bg-slate-400/10',
    badgeText: 'text-slate-200',
    badgeBorder: 'border-slate-400/20',
    glowColor: 'rgba(203, 213, 225, 0.3)',
    tailwindBg: 'bg-slate-200 text-slate-950',
    tailwindText: 'text-slate-200',
    tailwindBorder: 'border-slate-400'
  }
};

export interface BackgroundPresetDefinition {
  id: BackgroundPresetId;
  name: string;
  category: 'light' | 'dark' | 'custom';
  description: string;
  cssBackground: string;
  previewGradient: string;
}

export const BACKGROUND_PRESETS: BackgroundPresetDefinition[] = [
  // LIGHT BACKGROUND PRESETS
  {
    id: 'pure_white',
    name: 'Pure Minimalist White',
    category: 'light',
    description: 'Crisp, ultra-clean white canvas with high contrast and zero clutter',
    cssBackground: '#ffffff',
    previewGradient: 'bg-white border border-slate-300'
  },
  {
    id: 'studio_light',
    name: 'Studio Light Slate',
    category: 'light',
    description: 'Modern porcelain off-white with subtle architectural grey depth',
    cssBackground: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    previewGradient: 'bg-gradient-to-br from-slate-50 to-slate-200 border border-slate-300'
  },
  {
    id: 'warm_ivory',
    name: 'Warm Ivory & Linen',
    category: 'light',
    description: 'Organic warm cream canvas, easy on the eyes during daytime training',
    cssBackground: 'linear-gradient(135deg, #fdfbf7 0%, #f5f0e6 100%)',
    previewGradient: 'bg-gradient-to-br from-amber-50 to-stone-100 border border-amber-200'
  },
  {
    id: 'mint_clarity',
    name: 'Fresh Mint Vitality (Light)',
    category: 'light',
    description: 'Soft botanical green glow for focused wellness and calm energy',
    cssBackground: 'radial-gradient(at top left, rgba(16, 185, 129, 0.12) 0%, transparent 60%), #f8fafc',
    previewGradient: 'bg-gradient-to-br from-emerald-100 to-teal-50 border border-emerald-300'
  },
  {
    id: 'sky_breeze',
    name: 'Morning Sky Breeze (Light)',
    category: 'light',
    description: 'Airy cyan and cobalt atmosphere with crisp daytime readability',
    cssBackground: 'radial-gradient(at top right, rgba(6, 182, 212, 0.12) 0%, transparent 60%), #f8fafc',
    previewGradient: 'bg-gradient-to-br from-cyan-100 to-sky-50 border border-cyan-300'
  },
  {
    id: 'rose_blush',
    name: 'Sunrise Rose Glow (Light)',
    category: 'light',
    description: 'Energetic warm sunrise tint with clear text separation',
    cssBackground: 'radial-gradient(at center top, rgba(244, 63, 94, 0.1) 0%, transparent 60%), #fafafa',
    previewGradient: 'bg-gradient-to-br from-rose-100 to-orange-50 border border-rose-300'
  },
  {
    id: 'custom_solid',
    name: 'Custom Solid Color Picker',
    category: 'custom',
    description: 'Set any custom solid background hex color of your choice',
    cssBackground: '#ffffff',
    previewGradient: 'bg-gradient-to-r from-red-200 via-green-200 to-blue-200 border border-slate-300'
  },

  // DARK BACKGROUND PRESETS
  {
    id: 'none',
    name: 'Deep Slate Pure (Dark)',
    category: 'dark',
    description: 'Ultra-fast, clean deep dark slate background',
    cssBackground: '#020617',
    previewGradient: 'bg-slate-950 border border-slate-800'
  },
  {
    id: 'gym_dark_iron',
    name: 'Dark Iron Gym Sanctuary',
    category: 'dark',
    description: 'Moody athletic gym floor with deep vignette shadows',
    cssBackground: 'radial-gradient(circle at 50% 0%, rgba(15, 23, 42, 0.9) 0%, #020617 80%), radial-gradient(ellipse at 80% 50%, rgba(30, 41, 59, 0.5) 0%, transparent 60%)',
    previewGradient: 'bg-gradient-to-b from-slate-900 via-slate-950 to-black border border-slate-800'
  },
  {
    id: 'neon_cyber_grid',
    name: 'Cyberpunk Grid Matrix',
    category: 'dark',
    description: 'Atmospheric neon glow nodes and geometric spatial depth',
    cssBackground: 'radial-gradient(at 0% 0%, rgba(6, 182, 212, 0.15) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.15) 0px, transparent 50%), #030712',
    previewGradient: 'bg-gradient-to-br from-cyan-950/60 via-slate-950 to-violet-950/60 border border-slate-800'
  },
  {
    id: 'zen_calm_mist',
    name: 'Zen Alpine Mist',
    category: 'dark',
    description: 'Calm breathing atmosphere, soothing deep teal shadows',
    cssBackground: 'radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.12) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(20, 184, 166, 0.1) 0%, transparent 50%), #020617',
    previewGradient: 'bg-gradient-to-tr from-emerald-950/40 via-slate-950 to-teal-950/40 border border-slate-800'
  },
  {
    id: 'luxury_obsidian',
    name: 'Luxury Obsidian Gold',
    category: 'dark',
    description: 'Premium championship glow with subtle gold metallic radiance',
    cssBackground: 'radial-gradient(circle at 50% 10%, rgba(245, 158, 11, 0.1) 0%, transparent 45%), radial-gradient(circle at 90% 90%, rgba(217, 119, 6, 0.08) 0%, transparent 50%), #020617',
    previewGradient: 'bg-gradient-to-b from-amber-950/30 via-slate-950 to-black border border-slate-800'
  },
  {
    id: 'deep_space_aurora',
    name: 'Deep Space Nebula',
    category: 'dark',
    description: 'Luminous starlight hues and cosmic purple velocity',
    cssBackground: 'radial-gradient(at 80% 0%, rgba(168, 85, 247, 0.15) 0px, transparent 50%), radial-gradient(at 0% 80%, rgba(59, 130, 246, 0.12) 0px, transparent 50%), #020617',
    previewGradient: 'bg-gradient-to-bl from-purple-950/50 via-slate-950 to-blue-950/50 border border-slate-800'
  }
];

export const DEFAULT_PERSONALIZATION: AppPersonalization = {
  appName: 'FitRegion',
  appSubtitle: 'Home Fitness & Regional Nutrition Engine',
  themeMode: 'light',
  colorTheme: 'emerald',
  backgroundPreset: 'pure_white',
  customSolidColor: '#ffffff',
  backgroundBlur: 0,
  backgroundOpacity: 0.15,
  weightUnit: 'kg',
  heightUnit: 'cm',
  energyUnit: 'kcal',
  currencySymbol: '$',
  glassmorphismStyle: 'subtle',
  accentGlow: true,
  motivationalMotto: '⚡ Discipline is choosing between what you want now and what you want most.',
  gymNotes: 'Daily Routine: Warm up 5 mins • Hydrate with 2.5L+ water • Track protein with every meal.',
  showMottoBanner: true
};

const STORAGE_KEY = 'fitregion_app_personalization_v1';
const DB_NAME = 'FitRegionPersonalizationDB';
const DB_STORE = 'custom_bg_images';

// IndexedDB Helper for Large Custom Background Images
function getCustomImageDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(DB_STORE)) {
        db.createObjectStore(DB_STORE, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveCustomBgImageBlob(blob: Blob): Promise<string> {
  try {
    const db = await getCustomImageDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(DB_STORE, 'readwrite');
      const store = tx.objectStore(DB_STORE);
      const record = { id: 'active_bg_image', blob, updatedAt: Date.now() };
      const req = store.put(record);
      req.onsuccess = () => {
        const url = URL.createObjectURL(blob);
        resolve(url);
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Failed to save background image blob', err);
    return '';
  }
}

export async function loadCustomBgImageBlob(): Promise<string | null> {
  try {
    const db = await getCustomImageDB();
    return new Promise((resolve) => {
      const tx = db.transaction(DB_STORE, 'readonly');
      const store = tx.objectStore(DB_STORE);
      const req = store.get('active_bg_image');
      req.onsuccess = () => {
        if (req.result && req.result.blob) {
          const url = URL.createObjectURL(req.result.blob);
          resolve(url);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export async function clearCustomBgImageBlob(): Promise<boolean> {
  try {
    const db = await getCustomImageDB();
    return new Promise((resolve) => {
      const tx = db.transaction(DB_STORE, 'readwrite');
      const store = tx.objectStore(DB_STORE);
      const req = store.delete('active_bg_image');
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    });
  } catch {
    return false;
  }
}

class ThemeService {
  private currentSettings: AppPersonalization = DEFAULT_PERSONALIZATION;
  private listeners: Set<(settings: AppPersonalization) => void> = new Set();
  private initialized: boolean = false;

  constructor() {
    this.loadInitial();
  }

  private async loadInitial() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        this.currentSettings = { ...DEFAULT_PERSONALIZATION, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Error loading theme settings', e);
    }

    // Attempt to load custom background image from IndexedDB if preset is custom
    if (this.currentSettings.backgroundPreset === 'custom_uploaded') {
      const customUrl = await loadCustomBgImageBlob();
      if (customUrl) {
        this.currentSettings.customBackgroundImageUrl = customUrl;
      }
    }

    this.initialized = true;
    this.applyCssVariables();
    this.notify();
  }

  public getSettings(): AppPersonalization {
    return this.currentSettings;
  }

  public getColorTheme(): ColorThemeDefinition {
    return COLOR_THEMES[this.currentSettings.colorTheme] || COLOR_THEMES.emerald;
  }

  public subscribe(listener: (settings: AppPersonalization) => void) {
    this.listeners.add(listener);
    listener(this.currentSettings);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn(this.currentSettings));
  }

  public updateSettings(partial: Partial<AppPersonalization>) {
    this.currentSettings = {
      ...this.currentSettings,
      ...partial
    };

    try {
      // Avoid saving large base64 strings directly in localStorage
      const { customBackgroundImageUrl, ...toSave } = this.currentSettings;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (err) {
      console.error('Failed to save personalization', err);
    }

    this.applyCssVariables();
    this.notify();
  }

  public applyCssVariables() {
    if (typeof document === 'undefined') return;
    const theme = this.getColorTheme();
    const root = document.documentElement;

    root.style.setProperty('--color-primary', theme.primaryHex);
    root.style.setProperty('--color-primary-hover', theme.primaryHoverHex);
    root.style.setProperty('--color-primary-rgb', theme.primaryRgb);
    root.style.setProperty('--color-secondary', theme.secondaryHex);
    root.style.setProperty('--color-glow', theme.glowColor);

    if (this.isLightMode()) {
      root.classList.add('theme-light');
      root.classList.remove('theme-dark');
    } else {
      root.classList.add('theme-dark');
      root.classList.remove('theme-light');
    }
  }

  public isLightMode(): boolean {
    if (this.currentSettings.themeMode === 'light') return true;
    if (this.currentSettings.themeMode === 'dark') return false;
    const currentPreset = BACKGROUND_PRESETS.find(p => p.id === this.currentSettings.backgroundPreset);
    return currentPreset?.category === 'light';
  }

  public toggleThemeMode() {
    const nextMode = this.isLightMode() ? 'dark' : 'light';
    const nextPreset = nextMode === 'light' ? 'pure_white' : 'gym_dark_iron';
    this.updateSettings({
      themeMode: nextMode,
      backgroundPreset: nextPreset,
      backgroundOpacity: nextMode === 'light' ? 0.15 : 0.35
    });
  }

  /* Unit Conversion Helpers */
  public formatWeight(kg: number): string {
    if (this.currentSettings.weightUnit === 'lbs') {
      const lbs = Math.round(kg * 2.20462);
      return `${lbs} lbs`;
    }
    return `${Math.round(kg * 10) / 10} kg`;
  }

  public formatHeight(cm: number): string {
    if (this.currentSettings.heightUnit === 'ft_in') {
      const totalInches = cm / 2.54;
      const feet = Math.floor(totalInches / 12);
      const inches = Math.round(totalInches % 12);
      return `${feet}′${inches}″`;
    }
    return `${cm} cm`;
  }

  public formatEnergy(kcal: number): string {
    if (this.currentSettings.energyUnit === 'kJ') {
      const kj = Math.round(kcal * 4.184);
      return `${kj} kJ`;
    }
    return `${Math.round(kcal)} kcal`;
  }

  public formatCurrency(amount: number): string {
    const sym = this.currentSettings.currencySymbol || '$';
    return `${sym}${amount.toFixed(2)}`;
  }
}

export const themeService = new ThemeService();
