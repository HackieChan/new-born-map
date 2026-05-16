import { CountryBirthData } from '../types';

export type BirthCallback = (country: CountryBirthData) => void;

/**
 * Statistical simulation engine.
 * Runs independent recursive setTimeout loops per country.
 * Each tick applies ±10% variance to the interval for realism.
 */
export class SimulationEngine {
  private timers = new Map<string, ReturnType<typeof setTimeout>>();
  private countries: CountryBirthData[];
  private onBirth: BirthCallback;
  private _speed = 1;
  private _running = false;

  constructor(countries: CountryBirthData[], onBirth: BirthCallback) {
    this.countries = countries;
    this.onBirth = onBirth;
  }

  get speed(): number {
    return this._speed;
  }

  get running(): boolean {
    return this._running;
  }

  setSpeed(speed: number): void {
    this._speed = Math.max(0.1, Math.min(50, speed));
    // Restart all timers with new speed
    if (this._running) {
      this.stopTimers();
      this.startTimers();
    }
  }

  start(): void {
    if (this._running) return;
    this._running = true;
    this.startTimers();
  }

  stop(): void {
    this._running = false;
    this.stopTimers();
  }

  toggle(): void {
    if (this._running) this.stop();
    else this.start();
  }

  destroy(): void {
    this.stop();
  }

  private startTimers(): void {
    for (const country of this.countries) {
      this.scheduleNext(country);
    }
  }

  private stopTimers(): void {
    for (const timer of this.timers.values()) {
      clearTimeout(timer);
    }
    this.timers.clear();
  }

  private scheduleNext(country: CountryBirthData): void {
    if (!this._running) return;

    // Apply ±10% variance for realism
    const variance = 0.9 + Math.random() * 0.2;
    const interval = (country.intervalMs * variance) / this._speed;

    // Clamp minimum interval to 50ms to prevent browser overload
    const clampedInterval = Math.max(50, interval);

    const timer = setTimeout(() => {
      if (!this._running) return;
      this.onBirth(country);
      this.scheduleNext(country);
    }, clampedInterval);

    this.timers.set(country.id, timer);
  }
}
