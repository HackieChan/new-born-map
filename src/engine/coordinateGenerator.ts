/**
 * Coordinate Generator
 * Uses rejection sampling with ray-casting point-in-polygon
 * to generate random [lng, lat] coordinates inside country boundaries.
 * No external dependencies — pure math.
 */

type Position = [number, number];
type Ring = Position[];

interface CachedGeo {
  polygons: Ring[];        // All outer rings
  bbox: [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]
}

// Cache parsed geometries per country
const geoCache = new Map<string, CachedGeo>();

/**
 * Ray-casting algorithm for point-in-polygon test.
 * Returns true if (x, y) is inside the polygon ring.
 */
function pointInRing(x: number, y: number, ring: Ring): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0], yi = ring[i][1];
    const xj = ring[j][0], yj = ring[j][1];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

/**
 * Check if point is inside any polygon of a country
 */
function pointInCountry(lng: number, lat: number, cached: CachedGeo): boolean {
  for (const ring of cached.polygons) {
    if (pointInRing(lng, lat, ring)) return true;
  }
  return false;
}

/**
 * Compute bounding box from a set of rings
 */
function computeBBox(polygons: Ring[]): [number, number, number, number] {
  let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;
  for (const ring of polygons) {
    for (const [lng, lat] of ring) {
      if (lng < minLng) minLng = lng;
      if (lat < minLat) minLat = lat;
      if (lng > maxLng) maxLng = lng;
      if (lat > maxLat) maxLat = lat;
    }
  }
  return [minLng, minLat, maxLng, maxLat];
}

/**
 * Extract outer rings from a GeoJSON geometry object.
 * Handles both Polygon and MultiPolygon types.
 */
function extractPolygons(geometry: GeoJSON.Geometry): Ring[] {
  const rings: Ring[] = [];
  if (geometry.type === 'Polygon') {
    // First ring is the outer boundary
    rings.push(geometry.coordinates[0] as Ring);
  } else if (geometry.type === 'MultiPolygon') {
    for (const polygon of geometry.coordinates) {
      rings.push(polygon[0] as Ring);
    }
  }
  return rings;
}

/**
 * Register a GeoJSON feature for coordinate generation.
 * Call this once per country when geographies are loaded.
 */
export function registerGeoFeature(countryId: string, geometry: GeoJSON.Geometry): void {
  if (geoCache.has(countryId)) return;
  const polygons = extractPolygons(geometry);
  if (polygons.length === 0) return;
  const bbox = computeBBox(polygons);
  geoCache.set(countryId, { polygons, bbox });
}

/**
 * Generate a random coordinate inside a registered country's boundaries.
 * Uses rejection sampling: random point in bbox → check if inside polygon.
 * Max 50 attempts to prevent infinite loops for tiny/unusual geometries.
 */
export function getRandomPointInCountry(countryId: string): Position | null {
  const cached = geoCache.get(countryId);
  if (!cached) return null;

  const [minLng, minLat, maxLng, maxLat] = cached.bbox;

  for (let attempt = 0; attempt < 50; attempt++) {
    const lng = minLng + Math.random() * (maxLng - minLng);
    const lat = minLat + Math.random() * (maxLat - minLat);
    if (pointInCountry(lng, lat, cached)) {
      return [lng, lat];
    }
  }

  // Fallback: return bbox center (should rarely happen)
  return [(minLng + maxLng) / 2, (minLat + maxLat) / 2];
}

/**
 * Check if a country has been registered for coordinate generation
 */
export function isCountryRegistered(countryId: string): boolean {
  return geoCache.has(countryId);
}

/**
 * Clear cache (useful for cleanup)
 */
export function clearGeoCache(): void {
  geoCache.clear();
}
