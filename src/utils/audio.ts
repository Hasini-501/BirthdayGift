/**
 * Web Audio API synthesized gentle music-box & sound effects
 * Plays a relaxing, celestial music-box version of "Happy Birthday"
 * and soft chime sound effects without requiring external audio files.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private timerId: number | null = null;
  private gainNode: GainNode | null = null;
  private audioEl: HTMLAudioElement | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a soft chime tone (sine + gentle bell overtone)
  private playNote(freq: number, startTime: number, duration: number, volume: number = 0.2) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    // Warm music box harmonic
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, startTime);

    noteGain.gain.setValueAtTime(0, startTime);
    noteGain.gain.linearRampToValueAtTime(volume, startTime + 0.02);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(noteGain);
    osc2.connect(noteGain);
    if (this.gainNode) {
      noteGain.connect(this.gainNode);
    } else {
      noteGain.connect(this.ctx.destination);
    }

    osc.start(startTime);
    osc2.start(startTime);
    osc.stop(startTime + duration);
    osc2.stop(startTime + duration);
  }

  // Sweet music-box "Happy Birthday" melody (frequencies in Hz)
  private getHappyBirthdayMelody(): { note: number; dur: number }[] {
    const C4 = 261.63;
    const D4 = 293.66;
    const E4 = 329.63;
    const F4 = 349.23;
    const G4 = 392.00;
    const A4 = 440.00;
    const Bb4 = 466.16;
    const B4 = 493.88;
    const C5 = 523.25;
    const D5 = 587.33;
    const E5 = 659.25;
    const F5 = 698.46;

    // notes with beat durations
    return [
      { note: G4, dur: 0.75 }, { note: G4, dur: 0.25 }, { note: A4, dur: 1 }, { note: G4, dur: 1 }, { note: C5, dur: 1 }, { note: B4, dur: 2 },
      { note: G4, dur: 0.75 }, { note: G4, dur: 0.25 }, { note: A4, dur: 1 }, { note: G4, dur: 1 }, { note: D5, dur: 1 }, { note: C5, dur: 2 },
      { note: G4, dur: 0.75 }, { note: G4, dur: 0.25 }, { note: G4 * 2, dur: 1 }, { note: E5, dur: 1 }, { note: C5, dur: 1 }, { note: B4, dur: 1 }, { note: A4, dur: 2 },
      { note: F5, dur: 0.75 }, { note: F5, dur: 0.25 }, { note: E5, dur: 1 }, { note: C5, dur: 1 }, { note: D5, dur: 1 }, { note: C5, dur: 2.5 },
      // Gentle pause before loop
      { note: 0, dur: 2 }
    ];
  }

  public playSparkleSound() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const pitches = [523.25, 659.25, 783.99, 1046.5, 1318.5]; // C5, E5, G5, C6, E6
      pitches.forEach((freq, idx) => {
        this.playNote(freq, t + idx * 0.08, 0.6, 0.12);
      });
    } catch {
      // ignore
    }
  }

  public playCelebrationChime() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const notes = [392, 523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        this.playNote(freq, t + idx * 0.1, 0.8, 0.15);
      });
    } catch {
      // ignore
    }
  }

  public playCardFlip() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      this.playNote(440, t, 0.15, 0.08);
      this.playNote(587.33, t + 0.06, 0.2, 0.08);
    } catch {
      // ignore
    }
  }

  private listeners: ((playing: boolean) => void)[] = [];

  public subscribe(listener: (playing: boolean) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(playing: boolean) {
    this.listeners.forEach(listener => {
      try {
        listener(playing);
      } catch (err) {
        console.error('Audio listener error:', err);
      }
    });
  }

  private timeListeners: ((current: number, duration: number) => void)[] = [];
  private volume: number = 0.75;
  private currentTrackUrl: string = '';

  public subscribeTime(listener: (current: number, duration: number) => void): () => void {
    this.timeListeners.push(listener);
    return () => {
      this.timeListeners = this.timeListeners.filter(l => l !== listener);
    };
  }

  private notifyTime(current: number, duration: number) {
    this.timeListeners.forEach(listener => {
      try {
        listener(current, duration);
      } catch (err) {
        console.error('Audio time listener error:', err);
      }
    });
  }

  public getCurrentTime(): number {
    return this.audioEl ? this.audioEl.currentTime : 0;
  }

  public getDuration(): number {
    return this.audioEl && !isNaN(this.audioEl.duration) ? this.audioEl.duration : 148;
  }

  public seek(seconds: number) {
    if (this.audioEl && !isNaN(this.audioEl.duration)) {
      this.audioEl.currentTime = Math.max(0, Math.min(seconds, this.audioEl.duration));
      this.notifyTime(this.audioEl.currentTime, this.audioEl.duration);
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.audioEl) {
      this.audioEl.volume = this.volume;
    }
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(this.volume * 0.25, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public setCustomAudio(url: string, autoPlay: boolean = true) {
    this.currentTrackUrl = url;
    if (this.audioEl) {
      this.audioEl.pause();
      this.audioEl.src = url;
      this.audioEl.load();
      if (autoPlay) {
        this.audioEl.play().catch(e => console.warn('Autoplay error:', e));
      }
    } else if (autoPlay) {
      this.startMusic(url);
    }
  }

  public startMusic(customUrl?: string, onStatusChange?: (playing: boolean) => void) {
    const targetUrl = customUrl || this.currentTrackUrl;
    if (this.isPlaying && this.audioEl && targetUrl && this.audioEl.src.includes(targetUrl)) {
      return;
    }

    if (targetUrl && targetUrl.trim().length > 0) {
      this.currentTrackUrl = targetUrl;
      if (!this.audioEl) {
        this.audioEl = new Audio(targetUrl);
        this.audioEl.loop = true;
        this.audioEl.volume = this.volume;

        this.audioEl.ontimeupdate = () => {
          if (this.audioEl) {
            this.notifyTime(this.audioEl.currentTime, this.audioEl.duration || 148);
          }
        };
        this.audioEl.onloadedmetadata = () => {
          if (this.audioEl) {
            this.notifyTime(this.audioEl.currentTime, this.audioEl.duration || 148);
          }
        };
        this.audioEl.onplay = () => {
          this.isPlaying = true;
          this.notifyListeners(true);
          onStatusChange?.(true);
        };
        this.audioEl.onpause = () => {
          this.isPlaying = false;
          this.notifyListeners(false);
          onStatusChange?.(false);
        };
        this.audioEl.onerror = () => {
          console.warn('Audio element error, falling back to synth');
          this.startSynthMelody(onStatusChange);
        };
      } else {
        if (!this.audioEl.src.includes(targetUrl)) {
          this.audioEl.src = targetUrl;
          this.audioEl.load();
        }
      }

      this.audioEl.play().then(() => {
        this.isPlaying = true;
        this.notifyListeners(true);
        onStatusChange?.(true);
      }).catch((err) => {
        console.warn('Audio play prevented or failed:', err);
        this.startSynthMelody(onStatusChange);
      });
      return;
    }

    this.startSynthMelody(onStatusChange);
  }

  private startSynthMelody(onStatusChange?: (playing: boolean) => void) {
    this.initCtx();
    if (!this.ctx) return;
    this.isPlaying = true;
    this.notifyListeners(true);
    onStatusChange?.(true);

    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(0.18, this.ctx.currentTime);
    this.gainNode.connect(this.ctx.destination);

    const melody = this.getHappyBirthdayMelody();
    const tempo = 0.48; // seconds per beat

    const scheduleLoop = () => {
      if (!this.isPlaying || !this.ctx) return;
      let curTime = this.ctx.currentTime + 0.1;
      melody.forEach(item => {
        if (item.note > 0) {
          this.playNote(item.note, curTime, item.dur * tempo * 1.5, 0.15);
        }
        curTime += item.dur * tempo;
      });

      const totalTime = (curTime - this.ctx.currentTime) * 1000;
      this.timerId = window.setTimeout(() => {
        if (this.isPlaying) scheduleLoop();
      }, totalTime);
    };

    scheduleLoop();
  }

  public stopMusic(onStatusChange?: (playing: boolean) => void) {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.audioEl) {
      this.audioEl.pause();
    }
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setTargetAtTime(0, this.ctx.currentTime, 0.2);
    }
    this.notifyListeners(false);
    onStatusChange?.(false);
  }

  public toggleMusic(customUrl?: string, onStatusChange?: (playing: boolean) => void) {
    if (this.isPlaying) {
      this.stopMusic(onStatusChange);
      return false;
    } else {
      this.startMusic(customUrl, onStatusChange);
      return true;
    }
  }

  public getIsPlaying() {
    return this.isPlaying;
  }
}

export const soundEngine = new SoundEngine();
