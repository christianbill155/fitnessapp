import React, { useState } from 'react';
import { 
  Wifi, 
  WifiOff, 
  Download, 
  Upload, 
  HardDrive, 
  Smartphone, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  X, 
  Copy, 
  Check, 
  RefreshCw,
  Crown
} from 'lucide-react';
import { exportAllUserData, importUserData } from '../services/storage';

interface OfflineManagerModalProps {
  isOnline: boolean;
  onClose: () => void;
  onDataRestored?: () => void;
}

export const OfflineManagerModal: React.FC<OfflineManagerModalProps> = ({
  isOnline,
  onClose,
  onDataRestored
}) => {
  const [copied, setCopied] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleExport = () => {
    const dataStr = exportAllUserData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fitregion-offline-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyJSON = () => {
    const dataStr = exportAllUserData();
    navigator.clipboard.writeText(dataStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImport = () => {
    if (!importJsonText.trim()) return;
    const ok = importUserData(importJsonText.trim());
    if (ok) {
      setImportStatus('✅ Data imported successfully! Reloading...');
      setTimeout(() => {
        if (onDataRestored) onDataRestored();
        window.location.reload();
      }, 1000);
    } else {
      setImportStatus('❌ Invalid backup JSON file format.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-slate-950 font-black shadow-lg ${
            isOnline ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-amber-500 shadow-amber-500/20'
          }`}>
            {isOnline ? <Wifi className="w-6 h-6 stroke-[2.5]" /> : <WifiOff className="w-6 h-6 stroke-[2.5]" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-white font-['Outfit']">Offline & PWA Installation Hub</h2>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                isOnline ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {isOnline ? 'Online Synced' : '100% Offline Mode Active'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              FitRegion runs completely independent of internet connection and can be installed as a native app on your phone or desktop.
            </p>
          </div>
        </div>

        {/* Offline Engine Modules Status */}
        <div className="mb-6 p-5 rounded-2xl bg-slate-950/80 border border-slate-800">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-emerald-400" /> Offline Local Cache & Engine Status
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300 font-medium">Home Workout Roadmaps</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% Offline Ready
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300 font-medium">9 Cultural Regional Cuisines</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% Offline Ready
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300 font-medium">Calorie & Macro TDEE Engine</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% Offline Ready
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300 font-medium">Web Audio Interval Voice Synth</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% Offline Ready
              </span>
            </div>
          </div>
        </div>

        {/* How to Install to Phone / Desktop */}
        <div className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-slate-950 to-slate-900 border border-emerald-500/30">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-sm">How to Install to Your Device (PWA)</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Once deployed, you can install FitRegion directly to your mobile home screen or computer dock to launch it in full-screen offline mode:
              </p>
              
              <ul className="mt-3 space-y-1.5 text-xs text-slate-400">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <strong>iPhone / Safari:</strong> Tap <span className="text-slate-200">Share</span> → <span className="text-emerald-400 font-semibold">"Add to Home Screen"</span>.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <strong>Android / Chrome:</strong> Tap <span className="text-slate-200">Menu (⋮)</span> → <span className="text-emerald-400 font-semibold">"Install App"</span> or tap the install prompt banner.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <strong>Desktop Chrome / Edge:</strong> Click the <span className="text-emerald-400 font-semibold">Install icon (⊕)</span> in the address bar.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 1-Click Backup and Restore */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Download className="w-4 h-4 text-emerald-400" /> Zero-Loss Local Backup & Restore
          </h3>

          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <button
              onClick={handleExport}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5" /> Download JSON Backup File
            </button>

            <button
              onClick={handleCopyJSON}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center gap-1.5 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied to Clipboard!' : 'Copy Raw JSON'}
            </button>
          </div>

          <div className="pt-3 border-t border-slate-800/80">
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Restore from Backup JSON:
            </label>
            <div className="flex gap-2">
              <textarea
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                placeholder="Paste your backup JSON content here..."
                rows={2}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-300 font-mono focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleImport}
                disabled={!importJsonText.trim()}
                className="px-4 rounded-xl bg-slate-800 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <Upload className="w-3.5 h-3.5" />
                Restore
              </button>
            </div>
            {importStatus && (
              <p className="text-xs mt-2 font-medium text-slate-300">{importStatus}</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
