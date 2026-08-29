import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Eye, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Sliders, 
  Maximize2, 
  ShieldCheck, 
  Activity,
  Layers,
  User
} from 'lucide-react';
import { Exercise } from '../types';
import { CHARACTER_THEMES, AnatomyDefs } from './character/HumanAnatomyParts';
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

export type CoachCharacter = 'marcus' | 'maya' | 'biomech';
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

  const activeTheme = CHARACTER_THEMES[character];

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
    phaseDetail = '1. Setup: Deep diaphragmatic inhale, stack joints, and brace core 360°.';
  } else if (repProgress >= 0.25 && repProgress < 0.75) {
    phaseDetail = '2. Eccentric Phase: 2-second controlled descent. Resist gravity with tension.';
  } else {
    phaseDetail = '3. Concentric Drive: Forceful exhale, peak muscular contraction at apex!';
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
        : 'bg-slate-900 border-slate-800 p-5 sm:p-7 shadow-2xl'
    }`}>
      
      {/* Top Bar Controls */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Avatar Selector */}
          <div className="flex bg-slate-950 p-0.5 rounded-xl border border-slate-800">
            {(['marcus', 'maya', 'biomech'] as CoachCharacter[]).map((c) => (
              <button
                key={c}
                onClick={() => setCharacter(c)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                  character === c 
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm shadow-emerald-500/20' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {c === 'marcus' ? 'Marcus' : c === 'maya' ? 'Maya' : 'Anatomy'}
              </button>
            ))}
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
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Right tools: Glow Toggle & Fullscreen Modal */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowAnatomicalGlow(!showAnatomicalGlow)}
            className={`p-1.5 rounded-xl border text-xs font-medium transition-colors flex items-center gap-1 ${
              showAnatomicalGlow 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                : 'bg-slate-800/80 text-slate-500 border-slate-700'
            }`}
            title="Toggle active muscle highlight glow"
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Muscles</span>
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
      <div className="relative w-full aspect-[16/10] bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 rounded-2xl border border-slate-800/90 overflow-hidden flex items-center justify-center p-2 sm:p-4">
        
        {/* Anatomical Grid Lines Background */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Common Form Trap Toggle Pill */}
        <button
          onClick={() => setShowMistakeComparison(!showMistakeComparison)}
          className={`absolute top-2.5 right-2.5 px-3 py-1 rounded-xl text-[11px] font-bold border transition-all flex items-center gap-1.5 z-10 ${
            showMistakeComparison
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-lg shadow-rose-500/10'
              : 'bg-slate-900/80 text-slate-400 border-slate-700/80 hover:text-white'
          }`}
        >
          {showMistakeComparison ? (
            <>
              <AlertTriangle className="w-3 h-3 text-rose-400" />
              <span>Simulating Common Mistake</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Golden Form Standard</span>
            </>
          )}
        </button>

        {/* SVG ARTICULATED HUMAN CHARACTER */}
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
              theme={activeTheme}
              characterType={character}
              exerciseName={exercise.name}
              targetMuscle={exercise.targetMuscle}
              showGlow={showAnatomicalGlow}
            />
          )}
        </svg>

        {/* Biomechanical Real-time Angle & Cadence HUD */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Target: {exercise.targetMuscle}
          </span>
          <span className="hidden sm:inline">Tempo: {speed}x cadence</span>
          <span>Phase: {Math.round(currentPhase)}%</span>
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
                <h4 className="font-bold text-white mb-0.5">Biomechanical Coach Guidance</h4>
                <p className="text-slate-300 leading-relaxed">{phaseDetail}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Proper Alignment
              </div>
              <p className="text-slate-300 text-[11px]">
                {exercise.tips && exercise.tips[0] ? exercise.tips[0] : 'Maintain stacked joints and drive through the stable base.'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/20">
              <div className="flex items-center gap-1.5 text-rose-400 font-bold mb-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Common Mistake
              </div>
              <p className="text-slate-300 text-[11px]">
                {showMistakeComparison 
                  ? 'Compensating by sagging hips or rushing rep tempo without full range of motion.'
                  : 'Letting joints flare unnaturally or bouncing with momentum. Squeeze and control!'}
              </p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
