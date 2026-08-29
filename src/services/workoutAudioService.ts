// Workout Audio & Music Service
// Generates energetic workout soundtrack loops via Web Audio API
// and supports local custom MP3/WAV/AAC/M4A song uploads from PC & Phone with IndexedDB persistence.

export interface AudioTrack {
  id: string;
  title: string;
  category: 'preset' | 'custom';
  bpm: number;
  genre: string;
  durationFormatted?: string;
  fileDataUrl?: string; // For custom uploaded user songs
  fileName?: string;
  intensity: 'high' | 'medium' | 'chill';
}

export const PRESET_TRACKS: AudioTrack[] = [
  {
    id: 'preset-synthwave',
    title: '⚡ Neon Cyberpunk Velocity',
    category: 'preset',
    bpm: 132,
    genre: 'Synthwave / Retro',
    durationFormatted: 'Infinite Loop',
    intensity: 'high'
  },
  {
    id: 'preset-trap',
    title: '🔥 Iron Beast 808 Pump',
    category: 'preset',
    bpm: 140,
    genre: 'Hip Hop / Trap',
    durationFormatted: 'Infinite Loop',
    intensity: 'high'
  },
  {
    id: 'preset-electro',
    title: '🚀 Cardio Surge Pulse',
    category: 'preset',
    bpm: 128,
    genre: 'EDM / Electro House',
    durationFormatted: 'Infinite Loop',
    intensity: 'high'
  },
  {
    id: 'preset-rock',
    title: '🎸 Heavy Metal Drive',
    category: 'preset',
    bpm: 136,
    genre: 'High Octane Rock',
    durationFormatted: 'Infinite Loop',
    intensity: 'high'
  },
  {
    id: 'preset-lofi',
    title: '🧘 Zen Flow & Steady Recovery',
    category: 'preset',
    bpm: 90,
    genre: 'Lo-Fi Chillhop',
    durationFormatted: 'Infinite Loop',
    intensity: 'chill'
  }
];

// IndexedDB Helper for Storing Large Custom Audio Files
const DB_NAME = 'FitBudgetCustomMusicDB';
const DB_VERSION = 1;
const STORE_NAME = 'custom_audio_tracks';

function getDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveCustomAudioTrack(track: AudioTrack, audioBlob: Blob): Promise<void> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const record = {
        ...track,
        blob: audioBlob,
        uploadedAt: new Date().toISOString()
      };
      const req = store.put(record);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Failed to save track in IndexedDB:', err);
  }
}

export async function loadCustomAudioTracks(): Promise<AudioTrack[]> {
  try {
    const db = await getDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        const results = req.result || [];
        const tracks: AudioTrack[] = results.map((item: any) => {
          let url = item.fileDataUrl;
          if (item.blob) {
            url = URL.createObjectURL(item.blob);
          }
          return {
            id: item.id,
            title: item.title,
            category: 'custom',
            bpm: item.bpm || 130,
            genre: item.genre || 'Custom Upload',
            durationFormatted: item.durationFormatted || 'Uploaded Audio',
            fileDataUrl: url,
            fileName: item.fileName,
            intensity: item.intensity || 'high'
          };
        });
        resolve(tracks);
      };
      req.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

export async function deleteCustomAudioTrack(trackId: string): Promise<void> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(trackId);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Failed to delete custom track:', err);
  }
}

// Local Storage for Per-Exercise Custom Track Assignment Mapping
const EXERCISE_TRACK_MAP_KEY = 'fitbudget_exercise_music_map';
const GLOBAL_TRACK_KEY = 'fitbudget_active_music_track_id';

export function getExerciseTrackMapping(): Record<string, string> {
  try {
    const saved = localStorage.getItem(EXERCISE_TRACK_MAP_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

export function setExerciseTrackMapping(exerciseId: string, trackId: string) {
  try {
    const map = getExerciseTrackMapping();
    map[exerciseId] = trackId;
    localStorage.setItem(EXERCISE_TRACK_MAP_KEY, JSON.stringify(map));
  } catch (err) {
    console.error('Failed to save exercise audio mapping', err);
  }
}

export function getSavedGlobalTrackId(): string {
  try {
    return localStorage.getItem(GLOBAL_TRACK_KEY) || 'preset-synthwave';
  } catch {
    return 'preset-synthwave';
  }
}

export function saveGlobalTrackId(trackId: string) {
  try {
    localStorage.setItem(GLOBAL_TRACK_KEY, trackId);
  } catch {}
}

/* =========================================================================
   SYNTHESIZER WORKOUT SOUNDTRACK GENERATOR (Web Audio API)
========================================================================= */
class WorkoutAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentTrackId: string = 'preset-synthwave';
  private customAudioEl: HTMLAudioElement | null = null;
  private timerId: number | null = null;
  private masterGain: GainNode | null = null;
  private volume: number = 0.7; // 0.0 to 1.0
  private step: number = 0;
  private listeners: Set<() => void> = new Set();

  constructor() {
    // Custom audio element for user-uploaded MP3/WAV files
    if (typeof window !== 'undefined') {
      this.customAudioEl = new Audio();
      this.customAudioEl.loop = true;
      this.customAudioEl.volume = this.volume;
    }
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentTrackId(): string {
    return this.currentTrackId;
  }

  public getVolume(): number {
    return this.volume;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
    if (this.customAudioEl) {
      this.customAudioEl.volume = this.volume;
    }
    this.notify();
  }

  public async playTrack(track: AudioTrack) {
    this.initContext();
    this.currentTrackId = track.id;
    saveGlobalTrackId(track.id);

    // Stop current
    this.stopPlaybackInternal();

    if (track.category === 'custom' && track.fileDataUrl) {
      // Play custom uploaded song via HTML5 Audio element
      if (this.customAudioEl) {
        this.customAudioEl.src = track.fileDataUrl;
        this.customAudioEl.volume = this.volume;
        try {
          await this.customAudioEl.play();
          this.isPlaying = true;
          this.notify();
        } catch (e) {
          console.warn('Playback error on custom audio:', e);
        }
      }
    } else {
      // Play Web Audio Synth Workout Track
      this.isPlaying = true;
      this.startSynthLoop(track.id);
      this.notify();
    }
  }

  public pause() {
    this.stopPlaybackInternal();
    this.isPlaying = false;
    this.notify();
  }

  public resume(currentTrack: AudioTrack) {
    this.playTrack(currentTrack);
  }

  public toggle(track: AudioTrack) {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.playTrack(track);
    }
  }

  private stopPlaybackInternal() {
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
    if (this.customAudioEl) {
      this.customAudioEl.pause();
    }
  }

  /* ---------------- Synth Track Generation ---------------- */
  private startSynthLoop(trackId: string) {
    if (!this.ctx || !this.masterGain) return;

    let bpm = 130;
    if (trackId === 'preset-trap') bpm = 140;
    if (trackId === 'preset-electro') bpm = 128;
    if (trackId === 'preset-rock') bpm = 136;
    if (trackId === 'preset-lofi') bpm = 90;

    const intervalMs = (60 / bpm / 4) * 1000; // 16th notes
    this.step = 0;

    this.timerId = window.setInterval(() => {
      this.triggerStep(trackId, this.step);
      this.step = (this.step + 1) % 32; // 32-step 2-bar loop
    }, intervalMs);
  }

  private triggerStep(trackId: string, step: number) {
    if (!this.ctx || !this.masterGain) return;
    const time = this.ctx.currentTime;

    // 1. KICK DRUM (Every quarter note on beat 0, 4, 8, 12, 16, 20, 24, 28)
    const isQuarter = step % 4 === 0;
    const isOffbeat = step % 8 === 4;

    if (isQuarter) {
      this.playKick(time, trackId === 'preset-trap' ? 1.4 : 1.0);
    }

    // 2. SNARE / CLAP (On beat 4 and 12 of a 16-step bar)
    if (step % 8 === 4) {
      this.playSnare(time, trackId === 'preset-trap' || trackId === 'preset-rock');
    }

    // 3. HI-HAT (8th or 16th notes with groove)
    if (trackId === 'preset-trap') {
      // Rapid trap hi-hats
      if (step % 2 === 0 || (step > 24 && step % 1 === 0)) {
        this.playHiHat(time, step % 4 === 0 ? 0.25 : 0.12);
      }
    } else if (trackId === 'preset-lofi') {
      if (step % 4 === 2) {
        this.playHiHat(time, 0.12);
      }
    } else {
      // Standard energetic 8th/16th groove
      if (step % 2 === 0) {
        this.playHiHat(time, isOffbeat ? 0.2 : 0.1);
      }
    }

    // 4. BASSLINE & HARMONY SYNTH
    this.playBassSynth(trackId, step, time);
  }

  private playKick(time: number, power: number = 1.0) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.frequency.setValueAtTime(140, time);
    osc.frequency.exponentialRampToValueAtTime(36, time + 0.09);

    gain.gain.setValueAtTime(0.7 * power, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.19);
  }

  private playSnare(time: number, crisp: boolean) {
    if (!this.ctx || !this.masterGain) return;
    
    // Noise buffer for snap
    const bufferSize = this.ctx.sampleRate * 0.12;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = crisp ? 1800 : 1200;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    whiteNoise.start(time);
    whiteNoise.stop(time + 0.13);
  }

  private playHiHat(time: number, vol: number) {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 0.04;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 7500;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vol, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(time);
    noise.stop(time + 0.045);
  }

  private playBassSynth(trackId: string, step: number, time: number) {
    if (!this.ctx || !this.masterGain) return;

    // Chord progressions per track
    // Cyberpunk: Am -> F -> C -> G
    // Trap: Dm -> Bb -> Gm -> A
    // Rock: E5 -> G5 -> A5 -> B5
    let freq = 110; // A2
    let waveType: OscillatorType = 'sawtooth';

    const bar = Math.floor(step / 8); // 0, 1, 2, 3

    if (trackId === 'preset-synthwave') {
      const notes = [110, 87.31, 130.81, 98.0]; // A2, F2, C3, G2
      freq = notes[bar];
      // 16th note rolling arpeggio
      if (step % 2 === 0) {
        freq = freq * (step % 4 === 0 ? 1 : 1.5);
      }
      waveType = 'sawtooth';
    } else if (trackId === 'preset-trap') {
      const trapNotes = [73.42, 58.27, 48.99, 55.0]; // D2, Bb1, G1, A1 deep 808
      freq = trapNotes[bar];
      waveType = 'sine';
      if (step % 8 !== 0 && step % 8 !== 3) return; // Placed 808 hits
    } else if (trackId === 'preset-rock') {
      const rockNotes = [82.41, 98.0, 110.0, 123.47]; // E2, G2, A2, B2
      freq = rockNotes[bar];
      waveType = 'sawtooth';
      if (step % 2 !== 0) return;
    } else if (trackId === 'preset-lofi') {
      const lofiNotes = [130.81, 110.0, 98.0, 87.31]; // C3, A2, G2, F2
      freq = lofiNotes[bar];
      waveType = 'triangle';
      if (step % 4 !== 0) return;
    } else {
      // Electro
      const electroNotes = [110, 110, 130.81, 98.0];
      freq = electroNotes[bar];
      waveType = 'square';
      if (step % 2 !== 0) return;
    }

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = waveType;
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(trackId === 'preset-lofi' ? 450 : 1200, time);
    filter.Q.value = 3;

    const dur = trackId === 'preset-trap' ? 0.35 : 0.12;
    gain.gain.setValueAtTime(0.28, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + dur + 0.01);
  }
}

// Global Singleton Instance
export const workoutAudio = new WorkoutAudioEngine();
