import { CountryBirthData } from '../types';

const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000; // 31,557,600,000

function entry(
  id: string, name: string, annualBirths: number, region: CountryBirthData['region']
): CountryBirthData {
  return { id, name, annualBirths, intervalMs: Math.round(MS_PER_YEAR / annualBirths), region };
}

// UN World Population Prospects 2024 — approximate annual births
export const birthRatesData: CountryBirthData[] = [
  // ASIA
  entry('356', 'India',           23000000, 'asia'),
  entry('156', 'China',            8700000, 'asia'),
  entry('586', 'Pakistan',         5900000, 'asia'),
  entry('360', 'Indonesia',        4500000, 'asia'),
  entry('050', 'Bangladesh',       3100000, 'asia'),
  entry('608', 'Philippines',      1800000, 'asia'),
  entry('704', 'Vietnam',          1400000, 'asia'),
  entry('364', 'Iran',             1100000, 'asia'),
  entry('368', 'Iraq',             1200000, 'asia'),
  entry('004', 'Afghanistan',      1200000, 'asia'),
  entry('792', 'Turkey',           1100000, 'asia'),
  entry('104', 'Myanmar',           900000, 'asia'),
  entry('887', 'Yemen',             800000, 'asia'),
  entry('392', 'Japan',             770000, 'asia'),
  entry('764', 'Thailand',          550000, 'asia'),
  entry('524', 'Nepal',             500000, 'asia'),
  entry('458', 'Malaysia',          480000, 'asia'),
  entry('682', 'Saudi Arabia',      450000, 'asia'),
  entry('410', 'South Korea',       250000, 'asia'),

  // AFRICA
  entry('566', 'Nigeria',          7600000, 'africa'),
  entry('231', 'Ethiopia',         3600000, 'africa'),
  entry('180', 'DR Congo',         3800000, 'africa'),
  entry('818', 'Egypt',            2400000, 'africa'),
  entry('834', 'Tanzania',         2200000, 'africa'),
  entry('800', 'Uganda',           1800000, 'africa'),
  entry('404', 'Kenya',            1500000, 'africa'),
  entry('729', 'Sudan',            1400000, 'africa'),
  entry('024', 'Angola',           1400000, 'africa'),
  entry('508', 'Mozambique',       1200000, 'africa'),
  entry('710', 'South Africa',     1100000, 'africa'),
  entry('012', 'Algeria',           900000, 'africa'),
  entry('288', 'Ghana',             850000, 'africa'),
  entry('504', 'Morocco',           600000, 'africa'),

  // AMERICAS
  entry('840', 'United States',    3600000, 'americas'),
  entry('076', 'Brazil',           2700000, 'americas'),
  entry('484', 'Mexico',           1700000, 'americas'),
  entry('170', 'Colombia',          600000, 'americas'),
  entry('032', 'Argentina',         530000, 'americas'),
  entry('124', 'Canada',            370000, 'americas'),

  // EUROPE
  entry('643', 'Russia',           1400000, 'europe'),
  entry('276', 'Germany',           700000, 'europe'),
  entry('250', 'France',            700000, 'europe'),
  entry('826', 'United Kingdom',    650000, 'europe'),
  entry('380', 'Italy',             400000, 'europe'),
  entry('724', 'Spain',             330000, 'europe'),
  entry('616', 'Poland',            300000, 'europe'),
  entry('804', 'Ukraine',           250000, 'europe'),

  // OCEANIA
  entry('036', 'Australia',         310000, 'oceania'),
];

// Lookup map by ID for O(1) access
export const birthRateMap = new Map<string, CountryBirthData>(
  birthRatesData.map(d => [d.id, d])
);

// All country IDs that participate in simulation
export const simulatedCountryIds = new Set(birthRatesData.map(d => d.id));
