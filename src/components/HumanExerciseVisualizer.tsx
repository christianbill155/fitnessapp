import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Activity, 
  Maximize2, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  UserCheck,
  Flame,
  Info
} from 'lucide-react';
import { Exercise } from '../types';
import { CHARACTER_THEMES, COACH_PROFILES, AnatomyDefs } from './character/HumanAnatomyParts';
import {
  PushupCharacter,
  SquatCharacter,
  PlankCharacter,
  LungeCharacter,
  GluteBridgeCharacter,
  ChairDipCharacter,
  DumbbellRowCharacter,
  MountainClimberCharacter,
  LatPulldownCharacter,
  BurpeeCharacter,
  GenericAthleticCharacter
} from './character/ExerciseKinematicModels';

export type CoachCharacter = 'marcus' | 'maya' | 'jordan' | 'biomech';
export type ViewAngle = 'side' | 'front';

interface HumanExerciseVisualizerProps {
  exercise: Exercise;
  compact?: boolean;
  autoPlay?: boolean;
  onExpand?: () => void;
}

export const HumanExerciseVisualizer: React.FC<HumanExerciseVisualizerProps> = ({
  exercise,
  compact = false,
  autoPlay = true,
  onExpand
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [character, setCharacter] = useState<CoachCharacter>('marcus');
  const [viewAngle, setViewAngle] = useState<ViewAngle>('side');
  const [speed, setSpeed] = useState<number>(1.0); // 0.5, 1.0, 1.5
  const [currentPhase, setCurrentPhase] = useState<number>(0); // 0 to 100% loop progress
  const [showMistakeComparison, setShowMistakeComparison] = useState(false);
  const [showAnatomicalGlow, setShowAnatomicalGlow] = useState(true);

  // Animation cycle loop (0% to 100%)
  useEffect(() => {
    if (!isPlaying) return;
    const durationMs = 3000 / speed; // 3 seconds per rep at 1.0x
    const intervalMs = 30;
    const step = (intervalMs / durationMs) * 100;

    const interval = setInterval(() => {
      setCurrentPhase(prev => {
        const next = prev + step;
        return next >= 100 ? 0 : next;
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  // Convert 0..100 phase into a sine smooth wave (0 = start, 1 = peak, 0 = return)
  const repProgress = Math.sin((currentPhase / 100) * Math.PI); // 0 to 1 smooth curve

  const activeTheme = CHARACTER_THEMES[character] || CHARACTER_THEMES.marcus;

  // Detect exercise category for human posture kinematics
  const exId = exercise.id.toLowerCase();
  const exName = exercise.name.toLowerCase();

  const isPushup = exId.includes('pushup') || exName.includes('push-up');
  const isSquat = exId.includes('squat') || exName.includes('squat');
  const isPlank = exId.includes('plank') || exName.includes('plank');
  const isLunge = exId.includes('lunge') || exName.includes('lunge');
  const isBridge = exId.includes('bridge') || exName.includes('bridge');
  const isDip = exId.includes('dip') || exName.includes('dip');
  const isRow = exId.includes('row') || exName.includes('row');
  const isClimber = exId.includes('climber') || exName.includes('mountain');
  const isLatPulldown = exId.includes('lat') || exName.includes('pulldown') || exName.includes('pull-apart');
  const isBurpee = exId.includes('burpee') || exName.includes('burpee');

  // Compute movement phase description text
  let phaseDetail = 'Brace core, maintain neutral spine, engage target stabilizers.';
  if (repProgress < 0.25) {
    phaseDetail = '1. Inhale & Setup: Stack joints over points of support, brace 360° cylindrical core.';
  } else if (repProgress >= 0.25 && repProgress < 0.75) {
    phaseDetail = '2. Eccentric Phase: Smooth 2-second descent resisting gravity. Keep tension continuous.';
  } else {
    phaseDetail = '3. Concentric Drive: Forceful exhale, contract primary movers through full range!';
  }

  const commonKinematicProps = {
    progress: repProgress,
    viewAngle,
    colors: activeTheme,
    theme: activeTheme,
    characterType: character,
    showMistake: showMistakeComparison,
    showGlow: showAnatomicalGlow
  };

  return (
    <div className={`rounded-3xl border transition-all ${
      compact 
        ? 'bg-slate-900/95 border-slate-800 p-3 sm:p-4' 
        : 'bg-slate-900 border-slate-800 p-4 sm:p-6 shadow-2xl'
    }`}>
      
      {/* Top Bar: Coach Avatars & Perspective Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Coach Character Selector */}
          <div className="flex bg-slate-950 p-0.5 rounded-xl border border-slate-800">
            {(['marcus', 'maya', 'jordan', 'biomech'] as CoachCharacter[]).map((c) => {
              const info = COACH_PROFILES[c];
              return (
                <button
                  key={c}
                  onClick={() => setCharacter(c)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all flex items-center gap-1 ${
                    character === c 
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm shadow-emerald-500/20' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{c === 'marcus' ? 'Marcus' : c === 'maya' ? 'Maya' : c === 'jordan' ? 'Jordan' : '3D Titan'}</span>
                </button>
              );
            })}
          </div>

          {/* Perspective View Angle (Front vs Side) */}
          <div className="flex bg-slate-950 p-0.5 rounded-xl border border-slate-800">
            {(['side', 'front'] as ViewAngle[]).map((v) => (
              <button
                key={v}
                onClick={() => setViewAngle(v)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                  viewAngle === v 
                    ? 'bg-slate-800 text-emerald-300 font-bold border border-slate-700' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {v} Angle
              </button>
            ))}
          </div>
        </div>

        {/* Right tools: Glow Toggle & Fullscreen Modal */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowAnatomicalGlow(!showAnatomicalGlow)}
            className={`px-2.5 py-1 rounded-xl border text-xs font-medium transition-colors flex items-center gap-1 ${
              showAnatomicalGlow 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-bold' 
                : 'bg-slate-800/80 text-slate-500 border-slate-700'
            }`}
            title="Toggle active muscle highlight glow"
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Muscle Heatmap</span>
          </button>

          {onExpand && (
            <button
              onClick={onExpand}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Open full-screen form analysis"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Interactive Human Canvas Display */}
      <div className="relative w-full aspect-[16/10] bg-gradient-to-b from-slate-950 via-slate-950/95 to-slate-900/90 rounded-2xl border border-slate-800/90 overflow-hidden flex items-center justify-center p-2 sm:p-4 shadow-inner">
        
        {/* Soft Ambient Studio Spotlight */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_40%,rgba(16,185,129,0.08),transparent_60%)]" />
        
        {/* Fine Anatomical Calibration Grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px]" />

        {/* Active Coach Identity Badge */}
        <div className="absolute top-2.5 left-3 flex items-center gap-2 z-10 bg-slate-950/80 backdrop-blur-sm border border-slate-800/80 px-2.5 py-1 rounded-xl">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-bold text-slate-200">
            {activeTheme.name}
          </span>
          <span className="text-[10px] text-slate-400 hidden sm:inline">
            • {activeTheme.subtitle}
          </span>
        </div>

        {/* Common Form Trap / Standard Form Toggle */}
        <button
          onClick={() => setShowMistakeComparison(!showMistakeComparison)}
          className={`absolute top-2.5 right-2.5 px-3 py-1 rounded-xl text-[11px] font-bold border transition-all flex items-center gap-1.5 z-10 ${
            showMistakeComparison
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-lg shadow-rose-500/10'
              : 'bg-slate-900/80 text-slate-300 border-slate-700/80 hover:text-white'
          }`}
        >
          {showMistakeComparison ? (
            <>
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Simulating Mistake</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Standard Form</span>
            </>
          )}
        </button>

        {/* SVG ARTICULATED HUMAN COACH */}
        <svg
          viewBox="0 0 400 260"
          className="w-full h-full max-w-lg z-0 transition-transform duration-75"
        >
          {/* Anatomy Defs (Lighting, Shadows, Skin & Apparel Gradients) */}
          <AnatomyDefs theme={activeTheme} />

          {/* RENDER EXERCISE SPECIFIC KINEMATICS */}
          {isPushup && <PushupCharacter {...commonKinematicProps} />}
          {isSquat && <SquatCharacter {...commonKinematicProps} />}
          {isPlank && <PlankCharacter {...commonKinematicProps} />}
          {isLunge && <LungeCharacter {...commonKinematicProps} />}
          {isBridge && <GluteBridgeCharacter {...commonKinematicProps} />}
          {isDip && <ChairDipCharacter {...commonKinematicProps} />}
          {isRow && <DumbbellRowCharacter {...commonKinematicProps} />}
          {isClimber && <MountainClimberCharacter {...commonKinematicProps} />}
          {isLatPulldown && <LatPulldownCharacter {...commonKinematicProps} />}
          {isBurpee && <BurpeeCharacter {...commonKinematicProps} />}

          {/* Generic default for any other exercise */}
          {!isPushup && !isSquat && !isPlank && !isLunge && !isBridge && !isDip && !isRow && !isClimber && !isLatPulldown && !isBurpee && (
            <GenericAthleticCharacter
              progress={repProgress}
              viewAngle={viewAngle}
              colors={activeTheme}
              theme={activeTheme}
              characterType={character}
              showMistake={showMistakeComparison}
              showGlow={showAnatomicalGlow}
            />
          )}
        </svg>

        {/* Real-time Telemetry Status Bar */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] text-slate-400 font-mono bg-slate-950/70 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-slate-800/60">
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <Flame className="w-3 h-3 text-amber-400" />
            Target: {exercise.targetMuscle}
          </span>
          <span className="hidden sm:inline text-slate-400">Tempo: {speed}x cadence</span>
          <span className="text-slate-300 font-bold">Kinematic Phase: {Math.round(currentPhase)}%</span>
        </div>

      </div>

      {/* Playback Controls & Scrubber Slider */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all shadow-md shadow-emerald-500/20"
            title={isPlaying ? 'Pause repetition loop' : 'Play repetition loop'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          </button>

          <button
            onClick={() => { setCurrentPhase(0); setIsPlaying(true); }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Restart repetition cycle"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Speed Selector */}
          <div className="flex bg-slate-950 p-0.5 rounded-xl border border-slate-800">
            {[0.5, 1.0, 1.5].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                  speed === s ? 'bg-slate-800 text-emerald-400' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Phase Scrubber Slider */}
        <div className="flex-1 max-w-xs flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="100"
            value={currentPhase}
            onChange={(e) => {
              setIsPlaying(false);
              setCurrentPhase(Number(e.target.value));
            }}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <span className="font-mono text-[10px] text-slate-400 w-8 text-right">
            {Math.round(currentPhase)}%
          </span>
        </div>
      </div>

      {/* Detailed Form Guidance Checklist */}
      {!compact && (
        <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3">
          
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/90">
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 mt-0.5 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <h4 className="font-bold text-white mb-0.5 flex items-center gap-1.5">
                  <span>Anatomical Kinetic Analysis</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                    Phase {repProgress < 0.25 ? '1/3' : repProgress < 0.75 ? '2/3' : '3/3'}
                  </span>
                </h4>
                <p className="text-slate-300 leading-relaxed">{phaseDetail}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Golden Biomechanical Form
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {exercise.tips && exercise.tips[0] ? exercise.tips[0] : 'Maintain stacked joints, full range of motion, and smooth eccentric deceleration.'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/20">
              <div className="flex items-center gap-1.5 text-rose-400 font-bold mb-1">
                <AlertTriangle className="w-3.5 h-3.5" /> High-Risk Form Compensation
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {showMistakeComparison 
                  ? 'Active compensation detected: Break in core tension, joint over-flare, or rushing the eccentric phase.'
                  : 'Avoid using momentum, rounding cervical spine, or shorting range of motion. Squeeze and breathe at apex!'}
              </p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
