
class AudioService {
  private ctx: AudioContext | null = null;

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private createGain(duration: number, startVolume: number = 0.1) {
    if (!this.ctx) return null;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(startVolume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
    gain.connect(this.ctx.destination);
    return gain;
  }

  playBoot() {
    if (!this.ctx) return;
    const notes = [220, 440, 880, 1760];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.createGain(0.5, 0.05);
        if (!gain) return;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        osc.connect(gain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.5);
      }, i * 150);
    });
  }

  playTransition() {
    if (!this.ctx || this.ctx.state !== 'running') return;
    const osc = this.ctx.createOscillator();
    const gain = this.createGain(0.2, 0.02);
    if (!gain) return;

    osc.type = 'square';
    osc.frequency.setValueAtTime(1000, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.2);
    
    osc.connect(gain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  playSoftCue() {
    if (!this.ctx || this.ctx.state !== 'running') return;
    const osc = this.ctx.createOscillator();
    const gain = this.createGain(0.15, 0.015);
    if (!gain) return;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.1);
    
    osc.connect(gain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  playPulse() {
    if (!this.ctx || this.ctx.state !== 'running') return;
    const osc = this.ctx.createOscillator();
    const gain = this.createGain(0.1, 0.01);
    if (!gain) return;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(60, this.ctx.currentTime);
    
    osc.connect(gain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }
}

export const audioService = new AudioService();
