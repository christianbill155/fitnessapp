import React, { useState, useEffect, useRef } from 'react';
import { 
  Music, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Upload, 
  Sparkles, 
  Trash2, 
  Check, 
  Radio, 
  Sliders, 
  Smartphone, 
  HardDrive, 
  Plus,
  Flame,
  Zap,
  Info,
  X
} from 'lucide-react';
import { 
  AudioTrack, 
  PRESET_TRACKS, 
  workoutAudio, 
  loadCustomAudioTracks, 
  saveCustomAudioTrack, 
  deleteCustomAudioTrack,
  getExerciseTrackMapping,
  setExerciseTrackMapping,
  getSavedGlobalTrackId,
  saveGlobalTrackId
} from '../services/workoutAudioService';

interface WorkoutMusicPlayerProps {
  currentExerciseId?: string;
  currentExerciseName?: string;
  compact?: boolean;
}

export const WorkoutMusicPlayer: React.FC<WorkoutMusicPlayerProps> = ({
  currentExerciseId,
  currentExerciseName,
  compact = false
}) => {
  const [isPlaying, setIsPlaying] = useState(workoutAudio.getIsPlaying());
  const [volume, setVolume] = useState(workoutAudio.getVolume());
  const [customTracks, setCustomTracks] = useState<AudioTrack[]>([]);
  const [activeTrackId, setActiveTrackId] = useState<string>(getSavedGlobalTrackId());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exerciseMapping, setExerciseMapping] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state with workout audio engine updates
  useEffect(() => {
    const unsubscribe = workoutAudio.subscribe(() => {
      setIsPlaying(workoutAudio.getIsPlaying());
      setActiveTrackId(workoutAudio.getCurrentTrackId());
      setVolume(workoutAudio.getVolume());
    });
    return unsubscribe;
  }, []);

  // Load custom tracks from IndexedDB & exercise mappings from localStorage
  useEffect(() => {
    loadCustomAudioTracks().then((tracks) => {
      setCustomTracks(tracks);
    });
    const map = getExerciseTrackMapping();
    setExerciseMapping(map);

    // If there is an exercise mapping for this exercise, set it as the active track
    if (currentExerciseId && map[currentExerciseId]) {
      setActiveTrackId(map[currentExerciseId]);
    }
  }, [currentExerciseId]);

  // Combine presets + user uploaded tracks
  const allTracks = [...PRESET_TRACKS, ...customTracks];
  const activeTrack = allTracks.find(t => t.id === activeTrackId) || PRESET_TRACKS[0];

  const handleTogglePlay = () => {
    workoutAudio.toggle(activeTrack);
  };

  const handleSelectTrack = (track: AudioTrack, assignToCurrentExercise: boolean = false) => {
    setActiveTrackId(track.id);
    saveGlobalTrackId(track.id);

    if (assignToCurrentExercise && currentExerciseId) {
      setExerciseTrackMapping(currentExerciseId, track.id);
      setExerciseMapping(prev => ({ ...prev, [currentExerciseId]: track.id }));
    }

    if (isPlaying) {
      workoutAudio.playTrack(track);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check audio type
    if (!file.type.startsWith('audio/') && !file.name.match(/\.(mp3|wav|m4a|aac|ogg|flac)$/i)) {
      setUploadError('Please select a valid audio file (MP3, WAV, M4A, AAC, OGG).');
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      const cleanName = file.name.replace(/\.[^/.]+$/, '');
      const newTrackId = `custom-${Date.now()}`;
      
      const newTrack: AudioTrack = {
        id: newTrackId,
        title: cleanName.length > 30 ? cleanName.substring(0, 30) + '...' : cleanName,
        category: 'custom',
        bpm: 130,
        genre: 'Device Audio',
        durationFormatted: 'Local File',
        fileName: file.name,
        intensity: 'high'
      };

      await saveCustomAudioTrack(newTrack, file);
      
      // Reload custom tracks
      const updated = await loadCustomAudioTracks();
      setCustomTracks(updated);

      // Immediately select new track
      const saved = updated.find(t => t.id === newTrackId) || newTrack;
      handleSelectTrack(saved, true);
    } catch (err: any) {
      console.error('File upload failed', err);
      setUploadError('Could not process audio file. Please try another song.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteCustomTrack = async (trackId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteCustomAudioTrack(trackId);
    const updated = await loadCustomAudioTracks();
    setCustomTracks(updated);
    if (activeTrackId === trackId) {
      handleSelectTrack(PRESET_TRACKS[0]);
    }
  };

  return (
    <>
      {/* Mini Player Ribbon / Bar */}
      <div className={`flex items-center justify-between gap-2.5 rounded-2xl border transition-all ${
        compact 
          ? 'bg-slate-950/80 border-slate-800/80 px-3 py-2 text-xs' 
          : 'bg-slate-950 border-slate-800 p-3 sm:px-4 sm:py-3 shadow-lg'
      }`}>
        
        {/* Left: Animated Equalizer & Track Info */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {/* Animated Equalizer Bars */}
          <div className="relative flex items-end gap-0.5 h-5 w-5 shrink-0 px-0.5 pb-0.5 bg-slate-900 rounded-lg border border-slate-800">
            <span className={`w-1 rounded-sm bg-emerald-400 transition-all ${isPlaying ? 'h-4 animate-pulse' : 'h-1.5'}`} />
            <span className={`w-1 rounded-sm bg-emerald-300 transition-all ${isPlaying ? 'h-3 animate-bounce' : 'h-1'}`} />
            <span className={`w-1 rounded-sm bg-teal-400 transition-all ${isPlaying ? 'h-4.5 animate-pulse' : 'h-2'}`} />
          </div>

          {/* Track Name & Exercise Mapping */}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white text-xs truncate max-w-[140px] sm:max-w-[220px]">
                {activeTrack.title}
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {activeTrack.bpm} BPM
              </span>
            </div>
            <p className="text-[10px] text-slate-400 truncate">
              {currentExerciseName ? `Music for ${currentExerciseName}` : activeTrack.genre}
            </p>
          </div>
        </div>

        {/* Center/Right: Play/Pause, Volume, Custom Song Selector */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Play / Pause Toggle */}
          <button
            onClick={handleTogglePlay}
            className={`p-2 rounded-xl font-bold transition-all shadow-md flex items-center justify-center ${
              isPlaying 
                ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20 hover:bg-emerald-400' 
                : 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700'
            }`}
            title={isPlaying ? 'Pause workout soundtrack' : 'Play energetic workout soundtrack'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          </button>

          {/* Volume Control */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-900 px-2 py-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => workoutAudio.setVolume(volume > 0 ? 0 : 0.7)}
              className="text-slate-400 hover:text-white"
              title="Mute / Unmute"
            >
              {volume > 0 ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-rose-400" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => workoutAudio.setVolume(Number(e.target.value))}
              className="w-14 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          {/* Song Library / Upload from Phone/PC Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Change track or upload your own song from phone/PC"
          >
            <Music className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden xs:inline">Change Song</span>
          </button>
        </div>
      </div>

      {/* MODAL: Workout Soundtrack & Phone/PC Custom Song Manager */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-5 pb-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Music className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Workout Soundtrack & Music</h3>
                  <p className="text-xs text-slate-400">
                    Choose high-tempo workout beats or upload any song from your phone or PC
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-5">
              
              {/* UPLOAD CUSTOM AUDIO FROM PHONE OR PC */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-teal-950/20 to-slate-900 border border-emerald-500/30">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-bold text-emerald-300">
                      <Smartphone className="w-4 h-4" />
                      <HardDrive className="w-4 h-4" />
                      <span>Use Song from Your Phone or PC</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      Upload your favorite MP3, WAV, M4A or AAC tracks for this workout session.
                    </p>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg,.flac"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="audio-upload-input"
                  />
                  <label
                    htmlFor="audio-upload-input"
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 transition-all shrink-0"
                  >
                    {isUploading ? (
                      <span className="animate-spin">⏳</span>
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    <span>{isUploading ? 'Loading...' : 'Upload Song File'}</span>
                  </label>
                </div>

                {uploadError && (
                  <div className="mt-3 p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <Info className="w-4 h-4 shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}
              </div>

              {/* USER'S CUSTOM UPLOADED SONGS */}
              {customTracks.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Your Uploaded Songs ({customTracks.length})</span>
                  </h4>
                  <div className="space-y-2">
                    {customTracks.map((track) => {
                      const isCurrent = track.id === activeTrackId;
                      return (
                        <div
                          key={track.id}
                          onClick={() => handleSelectTrack(track, true)}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            isCurrent
                              ? 'bg-emerald-950/30 border-emerald-500/40 shadow-md shadow-emerald-500/10'
                              : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-950'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`p-2 rounded-xl ${isCurrent ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                              <Music className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-white truncate">{track.title}</p>
                              <p className="text-[11px] text-slate-400">{track.fileName || 'Custom Device Audio'}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {isCurrent && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                Active
                              </span>
                            )}
                            <button
                              onClick={(e) => handleDeleteCustomTrack(track.id, e)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                              title="Delete this uploaded song"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* BUILT-IN WORKOUT SOUNDTRACK PRESETS */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>High-Energy Proposed Soundtracks</span>
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {PRESET_TRACKS.map((track) => {
                    const isCurrent = track.id === activeTrackId;
                    return (
                      <div
                        key={track.id}
                        onClick={() => handleSelectTrack(track, true)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isCurrent
                            ? 'bg-emerald-950/30 border-emerald-500/40 shadow-md shadow-emerald-500/10'
                            : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-950'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`p-2.5 rounded-xl ${isCurrent ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}>
                            {track.bpm >= 135 ? <Flame className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-white truncate">{track.title}</p>
                            <p className="text-xs text-slate-400">{track.genre} • {track.bpm} BPM</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {isCurrent ? (
                            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500 text-slate-950">
                              <Check className="w-3.5 h-3.5" /> Selected
                            </span>
                          ) : (
                            <span className="text-xs text-slate-500 hover:text-slate-300 font-medium">
                              Select
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Per-Exercise Assignment Note */}
              {currentExerciseName && (
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 flex items-center gap-2.5">
                  <Radio className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    Selected music will automatically be remembered for <strong>{currentExerciseName}</strong>.
                  </span>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleTogglePlay}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                    isPlaying 
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                      : 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  }`}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  <span>{isPlaying ? 'Pause Music' : 'Start Music'}</span>
                </button>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
