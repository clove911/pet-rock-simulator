export class FocusTimer {
  constructor(onTick, onComplete) {
    this.onTick = onTick;
    this.onComplete = onComplete;
    this.preset = 25;
    this.phase = "study";
    this.remaining = 25 * 60;
    this.running = false;
    this.interval = null;
    this.endAt = null;
  }
  setPreset(minutes) {
    this.pause();
    this.preset = minutes;
    this.phase = "study";
    this.remaining = minutes * 60;
    this.emit();
  }
  start() {
    if (this.running) return;
    this.running = true;
    this.endAt = Date.now() + this.remaining * 1000;
    this.interval = setInterval(() => this.tick(), 250);
    this.emit();
  }
  pause() {
    if (!this.running) return;
    this.remaining = Math.max(0, Math.ceil((this.endAt - Date.now()) / 1000));
    this.running = false;
    clearInterval(this.interval);
    this.interval = null;
    this.emit();
  }
  reset() {
    this.pause();
    this.phase = "study";
    this.remaining = this.preset * 60;
    this.emit();
  }
  tick() {
    this.remaining = Math.max(0, Math.ceil((this.endAt - Date.now()) / 1000));
    this.emit();
    if (this.remaining <= 0) {
      this.running = false;
      clearInterval(this.interval);
      this.interval = null;
      const completedPhase = this.phase;
      if (completedPhase === "study") {
        this.phase = "break";
        this.remaining = (this.preset === 25 ? 5 : 10) * 60;
        this.onComplete?.(this.preset);
      } else {
        this.phase = "study";
        this.remaining = this.preset * 60;
      }
      this.emit();
    }
  }
  emit() { this.onTick?.({ remaining: this.remaining, phase: this.phase, running: this.running, preset: this.preset }); }
  destroy() { this.pause(); }
}
export function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}