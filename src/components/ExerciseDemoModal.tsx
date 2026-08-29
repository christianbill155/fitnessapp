import React, { useState } from 'react';
import { 
  X, 
  Dumbbell, 
  Flame, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Volume2, 
  ShieldCheck, 
  Activity,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';
import { Exercise } from '../types';
import { HumanExerciseVisualizer } from './HumanExerciseVisualizer';
import { WorkoutMusicPlayer } from './WorkoutMusicPlayer';

interface ExerciseDemoModalProps {
  exercise: Exercise;
  onClose: () => void;
}

export const ExerciseDemoModal: React.FC<ExerciseDemoModalProps> = ({
  exercise,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'steps' | 'mistakes'>('visualizer');

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative my-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Human Character Form Coach
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {exercise.equipment === 'bodyweight_only' ? 'Zero Equipment' : exercise.equipment.replace('_', ' ')}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
              {exercise.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800 my-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('visualizer')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'visualizer'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Interactive Avatar & Form</span>
          </button>

          <button
            onClick={() => setActiveTab('steps')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'steps'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Step-by-Step Cues</span>
          </button>

          <button
            onClick={() => setActiveTab('mistakes')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'mistakes'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Common Form Traps</span>
          </button>
        </div>

        {/* Tab 1: Human Exercise Character Visualizer */}
        {activeTab === 'visualizer' && (
          <div className="space-y-4">
            <HumanExerciseVisualizer
              exercise={exercise}
              compact={false}
              autoPlay={true}
            />

            {/* Exercise Music Soundtrack & Custom Song Bar */}
            <WorkoutMusicPlayer
              currentExerciseId={exercise.id}
              currentExerciseName={exercise.name}
            />

            {/* Biometrics & Muscle Stats Grid */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Primary Target</span>
                <span className="text-xs sm:text-sm font-black text-emerald-400">{exercise.targetMuscle}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Burn Rate</span>
                <span className="text-xs sm:text-sm font-black text-amber-400">~{exercise.caloriesPerMinute} kcal/min</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Default Scheme</span>
                <span className="text-xs sm:text-sm font-black text-cyan-400">
                  {exercise.type === 'reps' ? `${exercise.defaultReps || 12} Reps` : `${exercise.defaultDurationSeconds || 45}s`}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Step-by-Step Instructions */}
        {activeTab === 'steps' && (
          <div className="space-y-4 py-2">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Coach Execution Steps:</span>
              </h3>
              <ol className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                {exercise.instructions.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {exercise.tips && exercise.tips.length > 0 && (
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
                <h4 className="font-bold text-emerald-300 text-xs flex items-center gap-1.5">
                  💡 Pro Coach Form Tips
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {exercise.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Common Form Traps & How to Fix */}
        {activeTab === 'mistakes' && (
          <div className="space-y-3 py-2 text-xs sm:text-sm">
            <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Common Form Traps to Avoid</span>
              </div>
              <ul className="space-y-2 text-slate-300 text-xs">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">❌</span>
                  <span><strong>Rushing Rep Tempo:</strong> Dropping rapidly without eccentric control strips 60% of hypertrophy & tendon development. Maintain a strict 2s down, 1s up rhythm.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">❌</span>
                  <span><strong>Compromising Lumbar Position:</strong> Letting the lower back hyperextend or sag causes unnecessary spinal shearing forces. Always brace abs 360°.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">❌</span>
                  <span><strong>Short Range of Motion:</strong> Performing half-reps limits joint mobility. Strive for deep, pain-free joint excursions.</span>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>The Golden Standard Form Checklist</span>
              </div>
              <ul className="space-y-2 text-slate-300 text-xs">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✅</span>
                  <span><strong>Inhale On Descent, Exhale On Press:</strong> Regulates intra-abdominal pressure and oxygen delivery to muscle fibers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✅</span>
                  <span><strong>Mind-Muscle Connection:</strong> Consciously squeeze {exercise.targetMuscle} at peak contraction rather than just moving the weight mechanically.</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Footer Button */}
        <div className="pt-4 mt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors"
          >
            Got It, Back to Routine
          </button>
        </div>

      </div>
    </div>
  );
};
