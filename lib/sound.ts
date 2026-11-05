// Pokémon 8-bit Chiptune Audio Synthesizer & BGM (Web Audio API)

class SoundManager {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private musicEnabled: boolean = false;
  private bgmInterval: NodeJS.Timeout | null = null;
  private bgmStep: number = 0;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  public isMusicEnabled(): boolean {
    return this.musicEnabled;
  }

  // Toggle retro chiptune battle music loop
  public toggleMusic(): boolean {
    if (this.musicEnabled) {
      this.stopMusic();
      return false;
    } else {
      this.startMusic();
      return true;
    }
  }

  public startMusic() {
    this.musicEnabled = true;
    if (this.bgmInterval) clearInterval(this.bgmInterval);
    const ctx = this.getContext();
    if (!ctx) return;

    // Upbeat Pokémon battle bassline & melody pattern (notes in Hz)
    const bassline = [
      130.81, 130.81, 196.00, 130.81, 164.81, 130.81, 196.00, 220.00, // C3 C3 G3 C3 E3 C3 G3 A3
      110.00, 110.00, 164.81, 110.00, 130.81, 110.00, 164.81, 196.00, // A2 A2 E3 A2 C3 A2 E3 G3
      146.83, 146.83, 220.00, 146.83, 174.61, 146.83, 220.00, 246.94, // D3 D3 A3 D3 F3 D3 A3 B3
      196.00, 196.00, 246.94, 196.00, 261.63, 246.94, 196.00, 164.81  // G3 G3 B3 G3 C4 B3 G3 E3
    ];

    const melody = [
      523.25, 0, 523.25, 659.25, 783.99, 659.25, 523.25, 0,
      440.00, 0, 440.00, 523.25, 659.25, 523.25, 440.00, 0,
      587.33, 0, 587.33, 698.46, 880.00, 698.46, 587.33, 0,
      783.99, 880.00, 783.99, 659.25, 587.33, 523.25, 493.88, 392.00
    ];

    this.bgmStep = 0;
    this.bgmInterval = setInterval(() => {
      if (!this.musicEnabled) return;
      const now = ctx.currentTime;

      // Play bass note
      const bassFreq = bassline[this.bgmStep % bassline.length];
      if (bassFreq > 0) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(bassFreq, now);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.17);
      }

      // Play melody note
      const melFreq = melody[this.bgmStep % melody.length];
      if (melFreq > 0) {
        const oscM = ctx.createOscillator();
        const gainM = ctx.createGain();
        oscM.type = 'square';
        oscM.frequency.setValueAtTime(melFreq, now);
        gainM.gain.setValueAtTime(0.025, now);
        gainM.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        oscM.connect(gainM);
        gainM.connect(ctx.destination);
        oscM.start(now);
        oscM.stop(now + 0.17);
      }

      this.bgmStep = (this.bgmStep + 1) % 32;
    }, 180);
  }

  public stopMusic() {
    this.musicEnabled = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  // Pokémon Menu / Pokeball Select Beep
  public playClick() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.setValueAtTime(1760, now + 0.04);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  // Pokémon Super Effective / Level-Up Chime
  public playCorrect() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [783.99, 1046.5, 1318.5, 1567.98];

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0.14, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.22);
    });
  }

  // Pokémon Attack Missed / Faint Sound
  public playIncorrect() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.linearRampToValueAtTime(110, now + 0.35);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.36);
  }

  // Pokémon Gym Victory / Hall of Fame Fanfare
  public playFanfare() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [
      { f: 523.25, t: 0, d: 0.12 },
      { f: 659.25, t: 0.12, d: 0.12 },
      { f: 783.99, t: 0.24, d: 0.12 },
      { f: 1046.5, t: 0.36, d: 0.18 },
      { f: 880.00, t: 0.54, d: 0.12 },
      { f: 1046.5, t: 0.68, d: 0.45 },
    ];

    notes.forEach(note => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(note.f, now + note.t);

      gain.gain.setValueAtTime(0.2, now + note.t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + note.t + note.d);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + note.t);
      osc.stop(now + note.t + note.d);
    });
  }
}

export const sounds = new SoundManager();
