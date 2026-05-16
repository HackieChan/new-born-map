import { useState, useEffect, useRef, useCallback } from 'react';
import { BirthEvent, SimulationStats, CountryBirthData } from '../types';
import { SimulationEngine } from '../engine/SimulationEngine';
import { getRandomPointInCountry } from '../engine/coordinateGenerator';
import { birthRatesData } from '../data/birthRates';

const MAX_MARKERS = 200;
const MARKER_LIFETIME_MS = 2500;

export function useSimulation() {
  const [markers, setMarkers] = useState<BirthEvent[]>([]);
  const [stats, setStats] = useState<SimulationStats>({
    globalCount: 0,
    countryCounts: {},
    birthsPerSecond: 0,
    startTime: Date.now(),
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeedState] = useState(1);

  const engineRef = useRef<SimulationEngine | null>(null);
  const pendingRef = useRef<BirthEvent[]>([]);
  const statsRef = useRef(stats);
  const frameRef = useRef<number>(0);
  const idCounter = useRef(0);

  statsRef.current = stats;

  // Birth event handler — accumulates pending births
  const handleBirth = useCallback((country: CountryBirthData) => {
    const coords = getRandomPointInCountry(country.id);
    if (!coords) return;

    pendingRef.current.push({
      id: idCounter.current++,
      coordinates: coords,
      countryId: country.id,
      countryName: country.name,
      region: country.region,
      timestamp: Date.now(),
    });
  }, []);

  // Animation frame loop: flush pending births + cleanup expired markers
  useEffect(() => {
    let active = true;

    const tick = () => {
      if (!active) return;

      const now = Date.now();
      const pending = pendingRef.current;

      if (pending.length > 0) {
        const newBirths = pending.splice(0, pending.length);

        // Update stats
        setStats(prev => {
          const next = { ...prev };
          next.globalCount += newBirths.length;
          const elapsed = (now - prev.startTime) / 1000;
          next.birthsPerSecond = elapsed > 0 ? Math.round(next.globalCount / elapsed) : 0;
          const cc = { ...prev.countryCounts };
          for (const b of newBirths) {
            cc[b.countryId] = (cc[b.countryId] || 0) + 1;
          }
          next.countryCounts = cc;
          return next;
        });

        // Update markers: add new, remove expired, cap total
        setMarkers(prev => {
          const alive = prev.filter(m => now - m.timestamp < MARKER_LIFETIME_MS);
          const combined = [...alive, ...newBirths];
          return combined.length > MAX_MARKERS
            ? combined.slice(combined.length - MAX_MARKERS)
            : combined;
        });
      } else {
        // Still clean up expired markers
        setMarkers(prev => {
          const alive = prev.filter(m => now - m.timestamp < MARKER_LIFETIME_MS);
          return alive.length !== prev.length ? alive : prev;
        });
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      active = false;
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  // Create engine once
  useEffect(() => {
    const engine = new SimulationEngine(birthRatesData, handleBirth);
    engineRef.current = engine;
    return () => engine.destroy();
  }, [handleBirth]);

  const play = useCallback(() => {
    engineRef.current?.start();
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    engineRef.current?.stop();
    setIsPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    if (engineRef.current?.running) pause();
    else play();
  }, [play, pause]);

  const setSpeed = useCallback((s: number) => {
    setSpeedState(s);
    engineRef.current?.setSpeed(s);
  }, []);

  const reset = useCallback(() => {
    engineRef.current?.stop();
    setIsPlaying(false);
    setMarkers([]);
    pendingRef.current = [];
    idCounter.current = 0;
    setStats({
      globalCount: 0,
      countryCounts: {},
      birthsPerSecond: 0,
      startTime: Date.now(),
    });
  }, []);

  return { markers, stats, isPlaying, speed, play, pause, toggle, setSpeed, reset };
}
