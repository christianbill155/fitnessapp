import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  SkipForward, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  Flame, 
  Clock, 
  Dumbbell, 
  Award,
  ChevronRight,
  RefreshCw,
  Sparkles,
  Maximize2,
  Activity
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { WorkoutDay, Exercise } from '../types';
import { playCountdownBeep, playRepSuccessBeep, playWorkoutCompleteChime } from '../services/audioSynth';
import { HumanExerciseVisualizer } from './HumanExerciseVisualizer';
import { ExerciseDemoModal } from './ExerciseDemoModal';
import { WorkoutMusicPlayer } from './WorkoutMusicPlayer';

interface ActiveWorkoutModalProps {
  workoutDay: WorkoutDay;
  onClose: () => void;
  onCompleteWorkout: (stats: { workoutId: string; workoutTitle: string; durationMinutes: number; caloriesBurned: number }) => void;
}

export const ActiveWorkoutModal: React.FC<ActiveWorkoutModalProps> = ({
  workoutDay,
  onClose,
  onCompleteWorkout
}) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [restSecondsRemaining, setRestSecondsRemaining] = useState(30);
  const [isActive, setIsActive] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [workoutSecondsElapsed, setWorkoutSecondsElapsed] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);

  // Timed exercise countdown state
  const [exerciseSecondsRemaining, setExerciseSecondsRemaining] = useState<number | null>(null);

  const currentItem = workoutDay.exercises[currentExerciseIndex];
  const currentEx = currentItem?.exercise;
  const totalSets = currentItem?.sets || 3;
  const totalExercises = workoutDay.exercises.length;

  // Initialize timed exercise state
  useEffect(() => {
    if (currentEx?.type === 'time' && currentItem?.durationSeconds) {
      setExerciseSecondsRemaining(currentItem.durationSeconds);
    } else {
      setExerciseSecondsRemaining(null);
    }
  }, [currentExerciseIndex, currentSet, currentEx, currentItem]);

  // Overall workout elapsed timer
  useEffect(() => {
    if (!isActive || isCompleted) return;
    const interval = setInterval(() => {
      setWorkoutSecondsElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive, isCompleted]);

  // Rest timer countdown
  useEffect(() => {
    if (!isResting || !isActive) return;

    if (restSecondsRemaining <= 0) {
      setIsResting(false);
      if (soundEnabled) playCountdownBeep(true);
      return;
    }

    // Play countdown beeps on 3, 2, 1
    if (soundEnabled && restSecondsRemaining <= 3 && restSecondsRemaining > 0) {
      playCountdownBeep(restSecondsRemaining === 1);
    }

    const timer = setTimeout(() => {
      setRestSecondsRemaining(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isResting, restSecondsRemaining, isActive, soundEnabled]);

  // Timed exercise active countdown
  useEffect(() => {
    if (isResting || !isActive || exerciseSecondsRemaining === null) return;

    if (exerciseSecondsRemaining <= 0) {
      // Completed timed exercise set
      handleSetComplete();
      return;
    }

    if (soundEnabled && exerciseSecondsRemaining <= 3 && exerciseSecondsRemaining > 0) {
      playCountdownBeep(exerciseSecondsRemaining === 1);
    }

    const timer = setTimeout(() => {
      setExerciseSecondsRemaining(prev => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [isResting, isActive, exerciseSecondsRemaining, soundEnabled]);

  const handleSetComplete = () => {
    if (soundEnabled) playRepSuccessBeep();

    if (currentSet < totalSets) {
      // Advance set and trigger rest
      setCurrentSet(prev => prev + 1);
      setIsResting(true);
      setRestSecondsRemaining(currentItem.restSeconds || 30);
    } else {
      // Finished all sets for current exercise
      if (currentExerciseIndex < totalExercises - 1) {
        setCurrentExerciseIndex(prev => prev + 1);
        setCurrentSet(1);
        setIsResting(true);
        setRestSecondsRemaining(currentItem.restSeconds || 45);
      } else {
        // Complete whole workout!
        finishWorkout();
      }
    }
  };

  const handleSkipExercise = () => {
    if (currentExerciseIndex < totalExercises - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setCurrentSet(1);
      setIsResting(false);
    } else {
      finishWorkout();
    }
  };

  const finishWorkout = () => {
    setIsCompleted(true);
    setIsActive(false);
    if (soundEnabled) playWorkoutCompleteChime();

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  const caloriesBurnedEst = Math.max(
    20,
    Math.round((workoutSecondsElapsed / 60) * (currentEx?.caloriesPerMinute || 7.5))
  );

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (isCompleted) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-10 max-w-lg w-full text-center relative shadow-2xl">
          
          <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award className="w-10 h-10" />
          </div>

          <h2 className="text-3xl font-extrabold text-white font-['Outfit'] mb-2">Workout Crushed! 🚀</h2>
          <p className="text-slate-400 text-sm mb-8">
            You completed <span className="text-emerald-400 font-semibold">{workoutDay.dayName}</span> right at home!
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-2xl">
              <div className="flex items-center justify-center gap-1.5 text-slate-400 text-xs mb-1">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Total Time</span>
              </div>
              <p className="text-2xl font-black text-white">{formatTime(workoutSecondsElapsed)}</p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-2xl">
              <div className="flex items-center justify-center gap-1.5 text-slate-400 text-xs mb-1">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Est. Calories</span>
              </div>
              <p className="text-2xl font-black text-amber-400">{caloriesBurnedEst} kcal</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              id="finish-and-log-workout-btn"
              onClick={() => {
                onCompleteWorkout({
                  workoutId: workoutDay.id,
                  workoutTitle: workoutDay.dayName,
                  durationMinutes: Math.max(1, Math.round(workoutSecondsElapsed / 60)),
                  caloriesBurned: caloriesBurnedEst
                });
                onClose();
              }}
              className="w-full py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-colors shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Save & Log to Calorie Tracker</span>
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors"
            >
              Close Session
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col">
      
      {/* Top Header Bar */}
      <div className="px-4 sm:px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Exercise {currentExerciseIndex + 1} of {totalExercises}
          </span>
          <h1 className="text-lg sm:text-xl font-bold text-white truncate max-w-xs sm:max-w-md">
            {workoutDay.dayName}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2.5 rounded-xl border transition-colors ${
              soundEnabled 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
            title={soundEnabled ? 'Mute audio cues' : 'Enable audio cues'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main workout content area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-4xl mx-auto w-full flex flex-col justify-between">
        
        {/* Progress Bar & Stats */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Progress: {Math.round(((currentExerciseIndex + (currentSet / totalSets)) / totalExercises) * 100)}%</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                {formatTime(workoutSecondsElapsed)}
              </span>
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                {caloriesBurnedEst} kcal
              </span>
            </div>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
              style={{ width: `${((currentExerciseIndex + (currentSet / totalSets)) / totalExercises) * 100}%` }}
            />
          </div>
        </div>

        {/* Workout Music Player Bar */}
        <div className="mb-4">
          <WorkoutMusicPlayer
            currentExerciseId={currentEx?.id}
            currentExerciseName={currentEx?.name}
            compact={true}
          />
        </div>

        {/* Dynamic Card: Active Exercise or Rest Mode */}
        {isResting ? (
          <div className="bg-slate-900/90 border border-teal-500/30 rounded-3xl p-6 sm:p-10 text-center my-auto shadow-2xl relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl" />
            <span className="inline-block px-3 py-1 bg-teal-500/20 text-teal-300 font-bold text-xs rounded-full uppercase tracking-wider mb-4">
              Rest & Breathe
            </span>
            <div className="text-6xl sm:text-8xl font-black text-white font-mono tracking-tight my-4">
              {restSecondsRemaining}s
            </div>
            <p className="text-slate-400 text-sm mb-6">
              Next Up: <span className="text-white font-semibold">{currentEx?.name}</span> (Set {currentSet} of {totalSets})
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setRestSecondsRemaining(prev => prev + 15)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-colors"
              >
                +15s Rest
              </button>
              <button
                id="skip-rest-btn"
                onClick={() => setIsResting(false)}
                className="px-6 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition-colors"
              >
                Skip Rest & Go!
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 my-auto shadow-xl space-y-4">
            
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Set {currentSet} of {totalSets}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                  Target: {currentEx?.targetMuscle}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowDemoModal(true)}
                  className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Full Form Studio</span>
                </button>
                <span className="text-xs text-slate-400">
                  {currentEx?.equipment === 'bodyweight_only' ? 'Bodyweight' : currentEx?.equipment.replace('_', ' ')}
                </span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
              {currentEx?.name}
            </h2>

            {/* ANIMATED HUMAN CHARACTER VISUALIZER COACH */}
            {currentEx && (
              <div className="w-full">
                <HumanExerciseVisualizer
                  exercise={currentEx}
                  compact={true}
                  autoPlay={isActive}
                  onExpand={() => setShowDemoModal(true)}
                />
              </div>
            )}

            {/* Target requirement: Reps or Timer */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                  {currentEx?.type === 'reps' ? 'Target Repetitions' : 'Active Duration'}
                </span>
                <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono">
                  {currentEx?.type === 'reps' ? `${currentItem?.reps || currentEx.defaultReps || 12} Reps` : `${exerciseSecondsRemaining ?? currentItem?.durationSeconds ?? 45}s`}
                </div>
              </div>

              {/* Action Button to complete set */}
              <button
                id="complete-set-btn"
                onClick={handleSetComplete}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-lg transition-transform active:scale-95 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-6 h-6" />
                <span>Done Set {currentSet}!</span>
              </button>
            </div>

            {/* Step by step Form guidance */}
            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Coach Cue:</h4>
                <p className="text-xs sm:text-sm text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  {currentEx?.instructions[0] || 'Execute with controlled cadence and strong breathing.'}
                </p>
              </div>

              {currentEx?.tips && currentEx.tips.length > 0 && (
                <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/20 rounded-xl text-xs text-emerald-300">
                  💡 <span className="font-semibold">Coach Tip:</span> {currentEx.tips[0]}
                </div>
              )}
            </div>

          </div>
        )}

        {/* Bottom controls: Pause / Skip */}
        <div className="mt-4 flex items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={() => setIsActive(!isActive)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-colors"
          >
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-emerald-400" />}
            <span>{isActive ? 'Pause Workout' : 'Resume Workout'}</span>
          </button>

          <button
            onClick={handleSkipExercise}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-colors"
          >
            <span>Skip Exercise</span>
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Expanded Exercise Form Studio Modal */}
      {showDemoModal && currentEx && (
        <ExerciseDemoModal
          exercise={currentEx}
          onClose={() => setShowDemoModal(false)}
        />
      )}

    </div>
  );
};
