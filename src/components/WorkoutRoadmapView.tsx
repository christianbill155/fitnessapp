import React, { useState } from 'react';
import { 
  Dumbbell, 
  Play, 
  Sparkles, 
  Clock, 
  Flame, 
  CheckCircle2, 
  Sliders, 
  RotateCcw, 
  Filter, 
  Layers, 
  ShieldCheck, 
  Info,
  Calendar,
  Zap,
  ChevronDown,
  ChevronUp,
  Activity,
  Eye
} from 'lucide-react';
import { 
  WorkoutRoadmap, 
  WorkoutDay, 
  Exercise, 
  UserProfile, 
  FitnessGoal, 
  FitnessLevel, 
  EquipmentType 
} from '../types';
import { EXERCISE_LIBRARY } from '../data/defaultData';
import { requestWorkoutRoadmap } from '../services/api';
import { ExerciseDemoModal } from './ExerciseDemoModal';
import { WorkoutMusicPlayer } from './WorkoutMusicPlayer';

interface WorkoutRoadmapViewProps {
  roadmap: WorkoutRoadmap;
  setRoadmap: (roadmap: WorkoutRoadmap) => void;
  profile: UserProfile;
  onStartWorkout: (day: WorkoutDay) => void;
  isOnline: boolean;
}

export const WorkoutRoadmapView: React.FC<WorkoutRoadmapViewProps> = ({
  roadmap,
  setRoadmap,
  profile,
  onStartWorkout,
  isOnline
}) => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'library' | 'generator'>('schedule');
  const [selectedDay, setSelectedDay] = useState<WorkoutDay | null>(roadmap.schedule[0] || null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genMessage, setGenMessage] = useState<string | null>(null);

  // Generator form state
  const [genGoal, setGenGoal] = useState<FitnessGoal>(profile.fitnessGoal);
  const [genLevel, setGenLevel] = useState<FitnessLevel>(profile.fitnessLevel);
  const [genEquipment, setGenEquipment] = useState<EquipmentType[]>(profile.availableEquipment || ['bodyweight_only']);
  const [genDays, setGenDays] = useState<number>(profile.workoutDaysPerWeek || 4);
  const [genMinutes, setGenMinutes] = useState<number>(profile.timePerWorkoutMinutes || 25);
  const [genLimitations, setGenLimitations] = useState<string>('');

  // Exercise Library filtering
  const [libFilterMuscle, setLibFilterMuscle] = useState<string>('all');
  const [libFilterEquipment, setLibFilterEquipment] = useState<string>('all');
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);
  const [selectedDemoExercise, setSelectedDemoExercise] = useState<Exercise | null>(null);

  const toggleEquipment = (eq: EquipmentType) => {
    if (genEquipment.includes(eq)) {
      if (genEquipment.length > 1) {
        setGenEquipment(genEquipment.filter(e => e !== eq));
      }
    } else {
      setGenEquipment([...genEquipment, eq]);
    }
  };

  const handleGenerateRoadmap = async () => {
    setIsGenerating(true);
    setGenMessage(null);
    try {
      const result = await requestWorkoutRoadmap(
        genGoal,
        genLevel,
        genEquipment,
        genDays,
        genMinutes,
        genLimitations
      );
      setRoadmap(result.roadmap);
      setSelectedDay(result.roadmap.schedule[0] || null);
      setActiveTab('schedule');
      setGenMessage(
        result.isOfflineFallback 
          ? 'Generated structured offline roadmap tailored to your home space!'
          : 'AI generated a customized home workout roadmap!'
      );
    } catch (e: any) {
      setGenMessage('Error generating roadmap. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredExercises = EXERCISE_LIBRARY.filter(ex => {
    if (libFilterMuscle !== 'all' && !ex.targetMuscle.toLowerCase().includes(libFilterMuscle.toLowerCase())) {
      return false;
    }
    if (libFilterEquipment === 'bodyweight' && ex.equipment !== 'bodyweight_only') {
      return false;
    }
    if (libFilterEquipment === 'dumbbells' && ex.equipment !== 'dumbbells') {
      return false;
    }
    if (libFilterEquipment === 'bands' && ex.equipment !== 'resistance_bands') {
      return false;
    }
    if (libFilterEquipment === 'chair' && ex.equipment !== 'chair_bench') {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Mode Switcher */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-full uppercase tracking-wider">
                Home Training Engine
              </span>
              {roadmap.generatedByAI && (
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-400" /> AI Optimized
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
              {roadmap.title}
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              {roadmap.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              id="tab-schedule-btn"
              onClick={() => setActiveTab('schedule')}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                activeTab === 'schedule'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Weekly Roadmap</span>
            </button>

            <button
              id="tab-generator-btn"
              onClick={() => setActiveTab('generator')}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                activeTab === 'generator'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Customize / AI Build</span>
            </button>

            <button
              id="tab-library-btn"
              onClick={() => setActiveTab('library')}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                activeTab === 'library'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Exercise Library</span>
            </button>
          </div>
        </div>

        {genMessage && (
          <div className="mt-4 p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{genMessage}</span>
          </div>
        )}
      </div>

      {/* VIEW 1: WEEKLY SCHEDULE */}
      {activeTab === 'schedule' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Day Selector Column */}
          <div className="lg:col-span-1 space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 px-1">
              Select Workout Day ({roadmap.schedule.length} Days)
            </h2>
            
            <div className="space-y-2.5">
              {roadmap.schedule.map((day, idx) => {
                const isSelected = selectedDay?.id === day.id;
                return (
                  <div
                    key={day.id || idx}
                    onClick={() => setSelectedDay(day)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-slate-800/90 border-emerald-500 shadow-lg shadow-emerald-500/10'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                        Day {day.dayNumber}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" /> {day.estimatedMinutes}m
                        </span>
                        <span className="flex items-center gap-1">
                          <Flame className="w-3 h-3 text-amber-400" /> {day.estimatedCaloriesBurn} kcal
                        </span>
                      </div>
                    </div>

                    <h4 className="text-base font-bold text-white mb-1 font-['Outfit']">
                      {day.dayName.split(':')[1] || day.dayName}
                    </h4>
                    <p className="text-xs text-slate-400 truncate">
                      Focus: {day.focus}
                    </p>

                    <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
                      <span className="text-slate-400">
                        {day.exercises.length} Exercises
                      </span>
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        View Plan →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Selected Day View */}
          <div className="lg:col-span-2">
            {selectedDay ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                
                {/* Header with Quick Action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Day {selectedDay.dayNumber} Routine
                    </span>
                    <h2 className="text-2xl font-extrabold text-white font-['Outfit']">
                      {selectedDay.dayName}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Target Focus: <span className="text-slate-200">{selectedDay.focus}</span>
                    </p>
                  </div>

                  <button
                    id="start-workout-session-btn"
                    onClick={() => onStartWorkout(selectedDay)}
                    className="py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm transition-transform active:scale-95 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Start Workout Player</span>
                  </button>
                </div>

                {/* Workout Music Player Bar */}
                <WorkoutMusicPlayer compact={true} />

                {/* Exercise List */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Exercise Sequence ({selectedDay.exercises.length} movements):
                  </h3>

                  <div className="space-y-3">
                    {selectedDay.exercises.map((item, idx) => {
                      const ex = item.exercise;
                      return (
                        <div
                          key={ex.id || idx}
                          className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 sm:p-5 transition-colors hover:border-slate-600"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-3">
                              <span className="w-7 h-7 rounded-xl bg-slate-800 text-emerald-400 font-black text-xs flex items-center justify-center border border-slate-700">
                                {idx + 1}
                              </span>
                              <div>
                                <h4 className="text-base font-bold text-white font-['Outfit']">
                                  {ex.name}
                                </h4>
                                <span className="text-xs text-slate-400">
                                  Target: <strong className="text-slate-300">{ex.targetMuscle}</strong>
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedDemoExercise(ex)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1 transition-colors"
                                title="Watch Animated Character Demonstration"
                              >
                                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Character Demo</span>
                              </button>
                              <span className="px-3 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold">
                                {item.sets} Sets × {item.reps ? `${item.reps} Reps` : `${item.durationSeconds || 45}s`}
                              </span>
                            </div>
                          </div>

                          {/* Instructions bullet summary & quick action */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-2 pl-10 border-l border-slate-700/80 text-xs text-slate-400">
                            <p>{ex.instructions?.[0] || 'Perform with controlled tempo and engaged core.'}</p>
                            <button
                              onClick={() => setSelectedDemoExercise(ex)}
                              className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 shrink-0"
                            >
                              <Eye className="w-3 h-3" /> Form Guide →
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Workout Summary stats */}
                <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-emerald-400" /> Approx. Duration: <strong className="text-white">{selectedDay.estimatedMinutes} Mins</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-amber-400" /> Calories Burned: <strong className="text-amber-400">~{selectedDay.estimatedCaloriesBurn} kcal</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Dumbbell className="w-4 h-4 text-teal-400" /> Equipment: <strong className="text-white">{selectedDay.equipmentNeeded?.map(e => e.replace('_', ' ')).join(', ') || 'Bodyweight'}</strong>
                  </span>
                </div>

              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
                Select a day to view its workout schedule.
              </div>
            )}
          </div>

        </div>
      )}

      {/* VIEW 2: AI / CUSTOM ROADMAP GENERATOR */}
      {activeTab === 'generator' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-3xl mx-auto shadow-xl space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h2 className="text-xl sm:text-2xl font-extrabold text-white font-['Outfit']">
                Personalized Workout Roadmap Builder
              </h2>
            </div>
            <p className="text-slate-400 text-sm">
              Tailor your weekly roadmap to your exact equipment, schedule availability, and fitness goals.
            </p>
          </div>

          <div className="space-y-5">
            
            {/* Primary Goal */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Primary Fitness Goal
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'weight_loss', label: 'Fat Loss & Tone', icon: '🔥' },
                  { id: 'muscle_gain', label: 'Hypertrophy / Muscle', icon: '💪' },
                  { id: 'home_strength', label: 'Home Strength', icon: '🏋️' },
                  { id: 'endurance', label: 'Stamina & Cardio', icon: '⚡' },
                  { id: 'mobility_flexibility', label: 'Mobility & Posture', icon: '🧘' },
                  { id: 'general_health', label: 'Daily Energy & Vitality', icon: '✨' }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setGenGoal(item.id as FitnessGoal)}
                    className={`p-3 rounded-xl border text-left text-xs font-bold transition-all ${
                      genGoal === item.id
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span className="text-base mr-1.5">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Equipment Available (Multi-select) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Available Equipment (Choose All That Apply)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'bodyweight_only', label: 'Zero Equipment (Floor)' },
                  { id: 'chair_bench', label: 'Sturdy Chair / Couch' },
                  { id: 'dumbbells', label: 'Dumbbells / Weights' },
                  { id: 'resistance_bands', label: 'Resistance Bands' },
                  { id: 'pullup_bar', label: 'Pull-Up Bar' },
                  { id: 'jump_rope', label: 'Jump Rope' },
                  { id: 'kettlebell', label: 'Kettlebell' },
                  { id: 'yoga_mat', label: 'Yoga Mat' }
                ].map(eq => {
                  const isChecked = genEquipment.includes(eq.id as EquipmentType);
                  return (
                    <button
                      key={eq.id}
                      type="button"
                      onClick={() => toggleEquipment(eq.id as EquipmentType)}
                      className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                        isChecked
                          ? 'bg-teal-500/20 border-teal-500 text-teal-300 font-bold'
                          : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <span className="mr-1">{isChecked ? '✓' : '+'}</span> {eq.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Experience Level & Days Per Week */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Experience Level
                </label>
                <select
                  value={genLevel}
                  onChange={e => setGenLevel(e.target.value as FitnessLevel)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="beginner">Beginner (Gentle on joints, master basics)</option>
                  <option value="intermediate">Intermediate (Moderate intensity & volume)</option>
                  <option value="advanced">Advanced (High intensity, short rest)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Days Per Week: <span className="text-emerald-400 font-bold">{genDays} Days</span>
                </label>
                <div className="flex gap-2">
                  {[2, 3, 4, 5, 6].map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setGenDays(d)}
                      className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                        genDays === d
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {d} Days
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Time Available per workout */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Time Available Per Session: <span className="text-emerald-400 font-bold">{genMinutes} Minutes</span>
              </label>
              <div className="flex gap-2">
                {[15, 20, 30, 45, 60].map(mins => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setGenMinutes(mins)}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                      genMinutes === mins
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>

            {/* Limitations or Notes */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Physical Limitations / Joint Sensitivity (Optional)
              </label>
              <input
                type="text"
                value={genLimitations}
                onChange={e => setGenLimitations(e.target.value)}
                placeholder="e.g. Sensitive lower back, low-impact knees only, apartment quiet mode (no jumping)"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-500 placeholder-slate-500"
              />
            </div>

            {/* Action button */}
            <button
              id="generate-new-roadmap-btn"
              disabled={isGenerating}
              onClick={handleGenerateRoadmap}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-base transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Synthesizing Custom Workout Plan...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>{isOnline ? 'Generate AI Custom Roadmap' : 'Generate Local Offline Roadmap'}</span>
                </>
              )}
            </button>

          </div>
        </div>
      )}

      {/* VIEW 3: EXERCISE DIRECTORY & LIBRARY */}
      {activeTab === 'library' && (
        <div className="space-y-6">
          
          {/* Library filters */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Filter by:
              </span>
              
              {/* Muscle filter */}
              <select
                value={libFilterMuscle}
                onChange={e => setLibFilterMuscle(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-xs font-semibold text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">All Muscles</option>
                <option value="chest">Chest & Push</option>
                <option value="back">Back & Pull</option>
                <option value="quad">Quadriceps & Legs</option>
                <option value="glute">Glutes</option>
                <option value="core">Core & Abs</option>
                <option value="cardio">Cardio & HIIT</option>
              </select>

              {/* Equipment filter */}
              <select
                value={libFilterEquipment}
                onChange={e => setLibFilterEquipment(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-xs font-semibold text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">All Equipment</option>
                <option value="bodyweight">Zero Equipment (Bodyweight)</option>
                <option value="dumbbells">Dumbbells</option>
                <option value="bands">Resistance Bands</option>
                <option value="chair">Chair / Couch</option>
              </select>
            </div>

            <span className="text-xs text-slate-400">
              Showing {filteredExercises.length} Movements
            </span>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExercises.map(ex => {
              const isExpanded = expandedExerciseId === ex.id;
              return (
                <div
                  key={ex.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {ex.targetMuscle}
                      </span>
                      <span className="text-[11px] text-slate-400 uppercase font-medium">
                        {ex.equipment.replace('_', ' ')}
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-white font-['Outfit'] mb-2">
                      {ex.name}
                    </h4>

                    <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                      <span>{ex.defaultSets} sets</span>
                      <span>•</span>
                      <span>{ex.type === 'reps' ? `${ex.defaultReps} reps` : `${ex.defaultDurationSeconds}s`}</span>
                      <span>•</span>
                      <span className="text-amber-400">{ex.caloriesPerMinute} kcal/min</span>
                    </div>

                    {isExpanded && (
                      <div className="pt-3 border-t border-slate-800 text-xs text-slate-300 space-y-2">
                        <strong className="block text-slate-400 uppercase tracking-wider text-[10px]">Instructions:</strong>
                        <ul className="space-y-1 pl-2">
                          {ex.instructions.map((step, sIdx) => (
                            <li key={sIdx} className="list-disc list-inside text-slate-300">
                              {step}
                            </li>
                          ))}
                        </ul>
                        {ex.tips?.[0] && (
                          <p className="p-2 rounded-lg bg-emerald-950/40 text-emerald-300 text-[11px]">
                            💡 {ex.tips[0]}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedDemoExercise(ex)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 transition-colors shadow-md shadow-emerald-500/20"
                    >
                      <Activity className="w-3.5 h-3.5" />
                      <span>Character Demo</span>
                    </button>

                    <button
                      onClick={() => setExpandedExerciseId(isExpanded ? null : ex.id)}
                      className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      <span>{isExpanded ? 'Hide' : 'Details'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* Expanded Exercise Demo Modal */}
      {selectedDemoExercise && (
        <ExerciseDemoModal
          exercise={selectedDemoExercise}
          onClose={() => setSelectedDemoExercise(null)}
        />
      )}

    </div>
  );
};
