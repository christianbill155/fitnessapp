import React, { useState, useEffect, useRef } from 'react';
import { 
  Palette, 
  X, 
  Check, 
  Sparkles, 
  Sliders, 
  Image as ImageIcon, 
  Upload, 
  DollarSign, 
  Scale, 
  Ruler, 
  Flame, 
  Type, 
  Quote, 
  FileText, 
  RotateCcw, 
  Layers, 
  Eye, 
  Smartphone, 
  HardDrive,
  Info,
  CheckCircle2,
  Link,
  Trash2,
  Sun,
  Moon,
  Laptop
} from 'lucide-react';
import { 
  AppPersonalization, 
  ColorThemeId, 
  BackgroundPresetId, 
  WeightUnit, 
  HeightUnit, 
  EnergyUnit, 
  CurrencySymbol, 
  COLOR_THEMES, 
  BACKGROUND_PRESETS, 
  CURATED_WALLPAPERS,
  DEFAULT_PERSONALIZATION, 
  themeService, 
  saveCustomBgImageBlob,
  clearCustomBgImageBlob
} from '../services/themeService';

interface PersonalizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PersonalizationModal: React.FC<PersonalizationModalProps> = ({
  isOpen,
  onClose
}) => {
  const [settings, setSettings] = useState<AppPersonalization>(() => themeService.getSettings());
  const [activeSubTab, setActiveSubTab] = useState<'theme' | 'background' | 'units' | 'branding'>('background');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [savedToast, setSavedToast] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsub = themeService.subscribe((s) => {
      setSettings(s);
    });
    return unsub;
  }, []);

  if (!isOpen) return null;

  const currentThemeDef = COLOR_THEMES[settings.colorTheme] || COLOR_THEMES.emerald;

  const handleUpdate = (partial: Partial<AppPersonalization>) => {
    const updated = { ...settings, ...partial };
    setSettings(updated);
    themeService.updateSettings(partial);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 1500);
  };

  const processImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, WebP, GIF).');
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      const blobUrl = await saveCustomBgImageBlob(file);
      handleUpdate({
        backgroundPreset: 'custom_uploaded',
        customBackgroundImageUrl: blobUrl
      });
    } catch (err) {
      console.error(err);
      setUploadError('Failed to process image. Please try a smaller photo.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processImageFile(file);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processImageFile(file);
    }
  };

  const handleApplyUrl = () => {
    if (!customUrlInput.trim()) return;
    try {
      new URL(customUrlInput.trim());
      handleUpdate({
        backgroundPreset: 'custom_uploaded',
        customBackgroundImageUrl: customUrlInput.trim()
      });
      setCustomUrlInput('');
    } catch {
      setUploadError('Please enter a valid HTTP/HTTPS image URL.');
    }
  };

  const handleClearCustomBg = async () => {
    await clearCustomBgImageBlob();
    handleUpdate({
      backgroundPreset: 'pure_white',
      customBackgroundImageUrl: undefined
    });
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all personalization and theme settings back to factory default?')) {
      handleUpdate(DEFAULT_PERSONALIZATION);
    }
  };

  const hasActiveCustomImage = Boolean(settings.customBackgroundImageUrl);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-5 pb-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transition-all"
              style={{ 
                background: `linear-gradient(135deg, ${currentThemeDef.primaryHex}, ${currentThemeDef.secondaryHex})`,
                color: '#020617'
              }}
            >
              <Palette className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white font-['Outfit']">Personalize & Customize App</h2>
                {savedToast && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse flex items-center gap-1">
                    <Check className="w-3 h-3" /> Saved Live
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Tailor colors, custom backgrounds, gym branding, motivational motto, and unit notations.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetDefaults}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs transition-colors flex items-center gap-1"
              title="Reset to defaults"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-4 pt-2 gap-2 overflow-x-auto">
          {[
            { id: 'theme', label: 'Color Themes', icon: Palette },
            { id: 'background', label: 'Wallpapers & Backgrounds', icon: ImageIcon },
            { id: 'branding', label: 'App Name & Motto', icon: Type },
            { id: 'units', label: 'Units & Notations', icon: Sliders }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                  isActive 
                    ? 'text-white border-b-2' 
                    : 'text-slate-400 border-transparent hover:text-slate-200'
                }`}
                style={isActive ? { borderColor: currentThemeDef.primaryHex, color: currentThemeDef.primaryHex } : {}}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* TAB 1: COLOR THEMES & ACCENT GLOW */}
          {activeSubTab === 'theme' && (
            <div className="space-y-6">
              
              <div>
                <h3 className="text-sm font-extrabold text-white mb-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" style={{ color: currentThemeDef.primaryHex }} />
                  <span>Choose Your Master Color Accent</span>
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Select a bespoke color aesthetic that cascades across buttons, active indicators, badges, and workout cards.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.values(COLOR_THEMES).map((theme) => {
                    const isSelected = settings.colorTheme === theme.id;
                    return (
                      <div
                        key={theme.id}
                        onClick={() => handleUpdate({ colorTheme: theme.id })}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                          isSelected
                            ? 'bg-slate-950 border-2 shadow-xl'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                        }`}
                        style={isSelected ? { borderColor: theme.primaryHex } : {}}
                      >
                        <div>
                          {/* Color Swatch & Title */}
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2.5">
                              <div 
                                className="w-6 h-6 rounded-full shadow-md flex items-center justify-center"
                                style={{ background: `linear-gradient(135deg, ${theme.primaryHex}, ${theme.secondaryHex})` }}
                              >
                                {isSelected && <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />}
                              </div>
                              <span className="font-bold text-sm text-white">{theme.name}</span>
                            </div>

                            {isSelected && (
                              <span 
                                className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                                style={{ 
                                  backgroundColor: `rgba(${theme.primaryRgb}, 0.15)`,
                                  color: theme.primaryHex,
                                  border: `1px solid rgba(${theme.primaryRgb}, 0.3)`
                                }}
                              >
                                Active
                              </span>
                            )}
                          </div>

                          <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                            {theme.description}
                          </p>
                        </div>

                        {/* Mini Live Preview Bar */}
                        <div className="pt-2 border-t border-slate-900 flex items-center gap-2">
                          <div 
                            className="h-2 flex-1 rounded-full"
                            style={{ background: `linear-gradient(90deg, ${theme.primaryHex}, ${theme.secondaryHex})` }}
                          />
                          <span className="text-[10px] font-mono text-slate-500">{theme.primaryHex}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Visual FX & Glassmorphism Controls */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Layers className="w-4 h-4" style={{ color: currentThemeDef.primaryHex }} />
                  <span>UI Texture & Accent Glow Styling</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Accent Glow Toggle */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div>
                      <span className="text-xs font-bold text-white block">Accent Neon Glow Effects</span>
                      <span className="text-[11px] text-slate-400">Radiant aura around active buttons & cards</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleUpdate({ accentGlow: !settings.accentGlow })}
                      className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${
                        settings.accentGlow ? 'bg-emerald-500' : 'bg-slate-700'
                      }`}
                      style={settings.accentGlow ? { backgroundColor: currentThemeDef.primaryHex } : {}}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${settings.accentGlow ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {/* Glassmorphism Depth */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white">Glassmorphism Card Depth</span>
                      <span className="text-[10px] font-bold text-slate-400 capitalize">{settings.glassmorphismStyle}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['subtle', 'intense', 'solid'] as const).map(style => (
                        <button
                          key={style}
                          type="button"
                          onClick={() => handleUpdate({ glassmorphismStyle: style })}
                          className={`py-1.5 px-2 rounded-lg text-xs font-bold capitalize transition-all ${
                            settings.glassmorphismStyle === style 
                              ? 'bg-white text-slate-950 shadow' 
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: WALLPAPERS & BACKGROUND SYSTEM */}
          {activeSubTab === 'background' && (
            <div className="space-y-6">

              {/* ACTIVE WALLPAPER STATUS CARD */}
              {hasActiveCustomImage && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-16 h-12 rounded-xl bg-cover bg-center border border-slate-700 shadow-md shrink-0"
                      style={{ backgroundImage: `url(${settings.customBackgroundImageUrl})` }}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Custom Wallpaper Active
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Rendered across your entire fitness app just like wallpaper on your phone or PC.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleClearCustomBg}
                      className="px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/30 text-rose-300 text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Background Image</span>
                    </button>
                  </div>
                </div>
              )}
              
              {/* UPLOAD CUSTOM WALLPAPER FROM PHONE OR PC */}
              <div 
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`p-5 rounded-2xl border-2 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isDragging
                    ? 'border-emerald-400 bg-emerald-950/30'
                    : 'border-dashed border-slate-700 bg-slate-950/80 hover:border-slate-600'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-extrabold text-white">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <Laptop className="w-4 h-4 text-teal-400" />
                    <span>Upload Image from Phone or PC</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Choose any photo from your phone gallery, PC desktop, gym shots, or personal fitness goals.
                  </p>
                  <span className="text-[10px] text-slate-500 block">Supports JPG, PNG, WebP, GIF • Drag & drop supported</span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.png,.jpg,.jpeg,.webp,.gif"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="bg-image-upload"
                  />
                  <label
                    htmlFor="bg-image-upload"
                    className="w-full sm:w-auto px-5 py-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all active:scale-95"
                    style={{ 
                      backgroundColor: currentThemeDef.primaryHex, 
                      color: '#020617' 
                    }}
                  >
                    {isUploading ? (
                      <span className="animate-spin">⏳</span>
                    ) : (
                      <Upload className="w-4 h-4 stroke-[2.5]" />
                    )}
                    <span>{isUploading ? 'Uploading & Processing...' : 'Choose File from Device'}</span>
                  </label>
                </div>
              </div>

              {/* PASTE IMAGE URL OPTION */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <Link className="w-4 h-4" style={{ color: currentThemeDef.primaryHex }} />
                  <span>Or Set Background via Web Image URL</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyUrl}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 transition-all shrink-0"
                    style={{ backgroundColor: currentThemeDef.primaryHex }}
                  >
                    Apply URL
                  </button>
                </div>
              </div>

              {uploadError && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* CURATED HIGH-DEFINITION FITNESS & AESTHETIC WALLPAPERS */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Curated HD Fitness & Scenic Wallpapers</span>
                  </h3>
                  <span className="text-[11px] text-slate-400">1-click apply</span>
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  High-resolution fitness photography optimized for app readability and aesthetic training vibes.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {CURATED_WALLPAPERS.map((curated) => {
                    const isSelected = settings.customBackgroundImageUrl === curated.url;
                    return (
                      <div
                        key={curated.id}
                        onClick={() => handleUpdate({
                          backgroundPreset: 'custom_uploaded',
                          customBackgroundImageUrl: curated.url
                        })}
                        className={`group relative rounded-2xl overflow-hidden h-32 border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-2 ring-2 ring-emerald-500/40 shadow-xl'
                            : 'border-slate-800 hover:border-slate-600'
                        }`}
                        style={isSelected ? { borderColor: currentThemeDef.primaryHex } : {}}
                      >
                        <div 
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                          style={{ backgroundImage: `url(${curated.thumbnail})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
                        
                        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                          <div>
                            <span className="font-bold text-xs text-white drop-shadow block line-clamp-1">{curated.name}</span>
                            <span className="text-[9px] text-slate-300 capitalize">{curated.category}</span>
                          </div>
                          {isSelected && (
                            <div 
                              className="w-5 h-5 rounded-full flex items-center justify-center text-slate-950 font-bold shrink-0"
                              style={{ backgroundColor: currentThemeDef.primaryHex }}
                            >
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* WALLPAPER DISPLAY & READABILITY CONTROLS */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Eye className="w-4 h-4" style={{ color: currentThemeDef.primaryHex }} />
                  <span>Wallpaper Display Calibration & Legibility</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Opacity Slider */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-white">Wallpaper Opacity</span>
                      <span className="font-mono text-slate-300 font-bold">{Math.round((settings.backgroundOpacity ?? 0.25) * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="1.0"
                      step="0.05"
                      value={settings.backgroundOpacity ?? 0.25}
                      onChange={(e) => handleUpdate({ backgroundOpacity: parseFloat(e.target.value) })}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                      style={{ accentColor: currentThemeDef.primaryHex }}
                    />
                    <span className="text-[10px] text-slate-500 block">Higher opacity makes the image more vibrant; lower opacity maximizes text contrast.</span>
                  </div>

                  {/* Blur Slider */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-white">Wallpaper Soft Blur</span>
                      <span className="font-mono text-slate-300 font-bold">{settings.backgroundBlur}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      step="1"
                      value={settings.backgroundBlur}
                      onChange={(e) => handleUpdate({ backgroundBlur: parseInt(e.target.value, 10) })}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                      style={{ accentColor: currentThemeDef.primaryHex }}
                    />
                    <span className="text-[10px] text-slate-500 block">0px for crisp photo; higher blur adds depth-of-field behind cards.</span>
                  </div>
                </div>

                {/* Wallpaper Fit & Overlay Tint */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-900">
                  {/* Fit Mode */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-300 block mb-1.5">Image Fit / Scaling</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {([
                        { id: 'cover', label: 'Cover (Fill)' },
                        { id: 'contain', label: 'Contain (Fit)' },
                        { id: 'tile', label: 'Tile (Pattern)' }
                      ] as const).map(fit => (
                        <button
                          key={fit.id}
                          type="button"
                          onClick={() => handleUpdate({ backgroundFit: fit.id })}
                          className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                            (settings.backgroundFit || 'cover') === fit.id 
                              ? 'bg-white text-slate-950 shadow' 
                              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          {fit.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Readability Tint */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-300 block mb-1.5">Readability Overlay Tint</span>
                    <div className="grid grid-cols-4 gap-1.5">
                      {([
                        { id: 'auto', label: 'Auto' },
                        { id: 'light', label: 'Light' },
                        { id: 'dark', label: 'Dark' },
                        { id: 'none', label: 'None' }
                      ] as const).map(tint => (
                        <button
                          key={tint.id}
                          type="button"
                          onClick={() => handleUpdate({ backgroundOverlayTint: tint.id })}
                          className={`py-1.5 px-1.5 rounded-lg text-xs font-bold transition-all text-center ${
                            (settings.backgroundOverlayTint || 'auto') === tint.id 
                              ? 'bg-white text-slate-950 shadow' 
                              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          {tint.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* SOLID & GRADIENT PRESET ALTERNATIVES */}
              <div>
                <h3 className="text-sm font-extrabold text-white mb-1">Color Gradient Presets (Non-Image)</h3>
                <p className="text-xs text-slate-400 mb-3">
                  If you prefer a clean solid or gradient backdrop without custom photography.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                  {BACKGROUND_PRESETS.map((preset) => {
                    const isSelected = settings.backgroundPreset === preset.id && !hasActiveCustomImage;
                    return (
                      <div
                        key={preset.id}
                        onClick={() => {
                          handleUpdate({ 
                            backgroundPreset: preset.id,
                            customBackgroundImageUrl: undefined 
                          });
                        }}
                        className={`p-3 rounded-xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between h-20 ${
                          isSelected
                            ? 'border-2 shadow-lg bg-slate-900'
                            : 'border-slate-800 hover:border-slate-700 bg-slate-950'
                        }`}
                        style={isSelected ? { borderColor: currentThemeDef.primaryHex } : {}}
                      >
                        <div 
                          className={`absolute inset-0 opacity-40 ${preset.previewGradient}`}
                          style={{ background: preset.cssBackground }}
                        />
                        <div className="relative z-10 flex items-center justify-between">
                          <span className="font-bold text-[11px] text-white drop-shadow line-clamp-1">{preset.name}</span>
                          {isSelected && (
                            <div 
                              className="w-4 h-4 rounded-full flex items-center justify-center text-slate-950 font-bold shrink-0"
                              style={{ backgroundColor: currentThemeDef.primaryHex }}
                            >
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                          )}
                        </div>
                        <span className="relative z-10 text-[9px] text-slate-400 uppercase font-mono">{preset.category}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: APP NAME, GYM BRANDING & MOTTO */}
          {activeSubTab === 'branding' && (
            <div className="space-y-6">
              
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <Type className="w-4 h-4" style={{ color: currentThemeDef.primaryHex }} />
                  <span>Custom App Title & Gym Identity</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Give the app your own personal gym name, studio branding, or fitness title.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">App / Gym Title</label>
                    <input
                      type="text"
                      value={settings.appName}
                      onChange={(e) => handleUpdate({ appName: e.target.value })}
                      placeholder="e.g. FitRegion, Iron Beast Studio"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-bold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Subtitle / Tagline</label>
                    <input
                      type="text"
                      value={settings.appSubtitle}
                      onChange={(e) => handleUpdate({ appSubtitle: e.target.value })}
                      placeholder="e.g. Home Fitness & Regional Nutrition"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Motivational Motto */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <Quote className="w-4 h-4" style={{ color: currentThemeDef.primaryHex }} />
                    <span>Daily Motivational Motto Banner</span>
                  </h3>

                  <button
                    type="button"
                    onClick={() => handleUpdate({ showMottoBanner: !settings.showMottoBanner })}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                      settings.showMottoBanner ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {settings.showMottoBanner ? 'Banner Visible' : 'Banner Hidden'}
                  </button>
                </div>

                <div>
                  <textarea
                    rows={2}
                    value={settings.motivationalMotto}
                    onChange={(e) => handleUpdate({ motivationalMotto: e.target.value })}
                    placeholder="Enter your favorite motivational quote or training mantra..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white italic focus:outline-none"
                  />
                </div>

                {/* Quick Presets for Motto */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-slate-500">Quick Inspirational Mantras:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      '⚡ Discipline is choosing between what you want now and what you want most.',
                      '🔥 The body achieves what the mind believes.',
                      '🛡️ Small daily improvements over time lead to stunning results.',
                      '🚀 Consistency is the true superpower.'
                    ].map((quote, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleUpdate({ motivationalMotto: quote, showMottoBanner: true })}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 text-left"
                      >
                        {quote.slice(0, 38)}...
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Personal Gym Notes */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4" style={{ color: currentThemeDef.primaryHex }} />
                  <span>Personal Gym Protocol & Checklist Notes</span>
                </h3>
                <textarea
                  rows={3}
                  value={settings.gymNotes}
                  onChange={(e) => handleUpdate({ gymNotes: e.target.value })}
                  placeholder="e.g. 5 min warmup • Drink 2.5L water • Post-workout stretching..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none"
                />
              </div>

            </div>
          )}

          {/* TAB 4: UNITS & NOTATION PREFERENCES */}
          {activeSubTab === 'units' && (
            <div className="space-y-6">
              
              <div>
                <h3 className="text-sm font-extrabold text-white mb-1">Measurement Units & Financial Notations</h3>
                <p className="text-xs text-slate-400 mb-4">
                  Configure how body weight, height, calorie burn, and regional food costs are calculated and displayed.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Weight Unit */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                      <Scale className="w-4 h-4" style={{ color: currentThemeDef.primaryHex }} />
                      <span>Body Weight Unit</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {[
                        { id: 'kg', label: 'Kilograms (kg)', desc: 'Metric' },
                        { id: 'lbs', label: 'Pounds (lbs)', desc: 'Imperial' }
                      ].map(unit => (
                        <button
                          key={unit.id}
                          type="button"
                          onClick={() => handleUpdate({ weightUnit: unit.id as WeightUnit })}
                          className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                            settings.weightUnit === unit.id
                              ? 'bg-slate-900 border-2 text-white font-bold'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                          style={settings.weightUnit === unit.id ? { borderColor: currentThemeDef.primaryHex } : {}}
                        >
                          <span className="block">{unit.label}</span>
                          <span className="text-[10px] text-slate-500">{unit.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Height Unit */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                      <Ruler className="w-4 h-4" style={{ color: currentThemeDef.primaryHex }} />
                      <span>Height Measurement Unit</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {[
                        { id: 'cm', label: 'Centimeters (cm)', desc: 'Metric' },
                        { id: 'ft_in', label: 'Feet & Inches (ft/in)', desc: 'Imperial' }
                      ].map(unit => (
                        <button
                          key={unit.id}
                          type="button"
                          onClick={() => handleUpdate({ heightUnit: unit.id as HeightUnit })}
                          className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                            settings.heightUnit === unit.id
                              ? 'bg-slate-900 border-2 text-white font-bold'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                          style={settings.heightUnit === unit.id ? { borderColor: currentThemeDef.primaryHex } : {}}
                        >
                          <span className="block">{unit.label}</span>
                          <span className="text-[10px] text-slate-500">{unit.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Energy Unit */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                      <Flame className="w-4 h-4" style={{ color: currentThemeDef.primaryHex }} />
                      <span>Workout & Food Energy Unit</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {[
                        { id: 'kcal', label: 'Calories (kcal)', desc: 'Standard' },
                        { id: 'kJ', label: 'Kilojoules (kJ)', desc: 'SI Unit' }
                      ].map(unit => (
                        <button
                          key={unit.id}
                          type="button"
                          onClick={() => handleUpdate({ energyUnit: unit.id as EnergyUnit })}
                          className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                            settings.energyUnit === unit.id
                              ? 'bg-slate-900 border-2 text-white font-bold'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                          style={settings.energyUnit === unit.id ? { borderColor: currentThemeDef.primaryHex } : {}}
                        >
                          <span className="block">{unit.label}</span>
                          <span className="text-[10px] text-slate-500">{unit.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Currency Symbol */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                      <DollarSign className="w-4 h-4" style={{ color: currentThemeDef.primaryHex }} />
                      <span>Meal Budget Currency Symbol</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {['$', '€', '£', '¥', '₹', 'R$', 'C$', 'A$', 'CHF', 'zł', 'kr'].map(sym => (
                        <button
                          key={sym}
                          type="button"
                          onClick={() => handleUpdate({ currencySymbol: sym })}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all ${
                            settings.currencySymbol === sym
                              ? 'bg-slate-900 border-2 text-white'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                          style={settings.currencySymbol === sym ? { borderColor: currentThemeDef.primaryHex, color: currentThemeDef.primaryHex } : {}}
                        >
                          {sym}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* LIVE AESTHETIC CARD PREVIEW */}
          <div className="mt-6 p-4 rounded-2xl bg-slate-950/90 border border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Eye className="w-3.5 h-3.5" style={{ color: currentThemeDef.primaryHex }} />
              <span>Live Application Preview</span>
            </h4>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
              {/* Simulated Glow */}
              {settings.accentGlow && (
                <div 
                  className="absolute -top-10 -left-10 w-40 h-40 rounded-full blur-3xl pointer-events-none opacity-20"
                  style={{ backgroundColor: currentThemeDef.primaryHex }}
                />
              )}

              <div className="relative z-10 flex items-center gap-3.5">
                <div 
                  className="w-11 h-11 rounded-2xl flex items-center justify-center text-slate-950 font-black shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${currentThemeDef.primaryHex}, ${currentThemeDef.secondaryHex})` }}
                >
                  <Sparkles className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-base text-white font-['Outfit']">{settings.appName}</span>
                    <span 
                      className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider"
                      style={{ 
                        backgroundColor: `rgba(${currentThemeDef.primaryRgb}, 0.15)`,
                        color: currentThemeDef.primaryHex,
                        border: `1px solid rgba(${currentThemeDef.primaryRgb}, 0.3)`
                      }}
                    >
                      {currentThemeDef.name}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{settings.appSubtitle}</p>
                </div>
              </div>

              <div className="relative z-10 flex items-center gap-2">
                <span className="text-xs font-mono text-slate-300 font-bold">
                  {themeService.formatCurrency(3.50)} / meal • {themeService.formatWeight(72)}
                </span>
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-xl font-bold text-xs shadow-md"
                  style={{ 
                    backgroundColor: currentThemeDef.primaryHex,
                    color: '#020617'
                  }}
                >
                  Action Button
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>All personalized changes are saved instantly to your device storage.</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl font-bold text-xs transition-all shadow-lg text-slate-950"
            style={{ 
              backgroundColor: currentThemeDef.primaryHex,
              color: '#020617'
            }}
          >
            Done & Apply
          </button>
        </div>

      </div>
    </div>
  );
};
