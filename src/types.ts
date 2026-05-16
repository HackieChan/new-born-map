export interface CountryBirthData {
  id: string;            // ISO 3166-1 numeric code (matches world-atlas)
  name: string;
  annualBirths: number;
  intervalMs: number;    // 31,536,000,000 / annualBirths
  region: Region;
}

export type Region = 'asia' | 'africa' | 'europe' | 'americas' | 'oceania';

export interface BirthEvent {
  id: number;
  coordinates: [number, number]; // [lng, lat]
  countryId: string;
  countryName: string;
  region: Region;
  timestamp: number;
}

export interface SimulationStats {
  globalCount: number;
  countryCounts: Record<string, number>;
  birthsPerSecond: number;
  startTime: number;
}

export interface TooltipData {
  name: string;
  annualBirths: number;
  intervalMs: number;
  sessionCount: number;
  region: Region;
  x: number;
  y: number;
}
