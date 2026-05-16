import { useEffect, useRef, useCallback, memo } from 'react';
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
  Marker,
} from 'react-simple-maps';
import topology from 'world-atlas/countries-110m.json';
import { BirthEvent, TooltipData } from '../types';
import { birthRateMap, simulatedCountryIds } from '../data/birthRates';
import { registerGeoFeature } from '../engine/coordinateGenerator';

const REGION_COLORS: Record<string, string> = {
  asia:     '#00ffd5',
  africa:   '#ffd700',
  europe:   '#a78bfa',
  americas: '#ff6b9d',
  oceania:  '#4ade80',
};

// Muted fill colors by birth rate intensity
function getCountryFill(countryId: string): string {
  const data = birthRateMap.get(countryId);
  if (!data) return '#1a1f35';
  const births = data.annualBirths;
  if (births > 10000000) return '#2d1f4e';
  if (births > 5000000) return '#261c42';
  if (births > 2000000) return '#201a38';
  if (births > 500000) return '#1c1830';
  return '#191628';
}

interface WorldMapProps {
  markers: BirthEvent[];
  onHoverCountry: (data: TooltipData | null) => void;
  countryCounts: Record<string, number>;
}

function WorldMapInner({ markers, onHoverCountry, countryCounts }: WorldMapProps) {
  const registeredRef = useRef(false);

  const handleGeoLoad = useCallback((geographies: any[]) => {
    if (registeredRef.current) return;
    registeredRef.current = true;
    for (const geo of geographies) {
      const id = geo.id || geo.properties?.ISO_A3;
      if (id && geo.geometry) {
        registerGeoFeature(String(id), geo.geometry);
      }
    }
  }, []);

  return (
    <div className="world-map-container">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 140,
          center: [20, 20],
        }}
        width={900}
        height={500}
        style={{ width: '100%', height: '100%' }}
      >
        <ZoomableGroup minZoom={1} maxZoom={8}>
          <Geographies geography={topology}>
            {({ geographies }) => {
              handleGeoLoad(geographies);
              return (
                <>
                  {geographies.map((geo) => {
                    const id = String(geo.id);
                    const data = birthRateMap.get(id);
                    const isSimulated = simulatedCountryIds.has(id);

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={getCountryFill(id)}
                        stroke="#2a2f4a"
                        strokeWidth={0.4}
                        style={{
                          default: { outline: 'none' },
                          hover: {
                            outline: 'none',
                            fill: isSimulated ? '#3d2a6e' : '#252a40',
                            cursor: isSimulated ? 'pointer' : 'default',
                          },
                          pressed: { outline: 'none' },
                        }}
                        onMouseEnter={(e) => {
                          if (!data) {
                            onHoverCountry(null);
                            return;
                          }
                          const rect = (e.target as SVGElement)
                            .closest('svg')
                            ?.getBoundingClientRect();
                          onHoverCountry({
                            name: data.name,
                            annualBirths: data.annualBirths,
                            intervalMs: data.intervalMs,
                            sessionCount: countryCounts[id] || 0,
                            region: data.region,
                            x: e.clientX - (rect?.left || 0),
                            y: e.clientY - (rect?.top || 0),
                          });
                        }}
                        onMouseLeave={() => onHoverCountry(null)}
                      />
                    );
                  })}
                </>
              );
            }}
          </Geographies>

          {/* Birth ping markers */}
          {markers.map((m) => (
            <Marker key={m.id} coordinates={m.coordinates}>
              <circle
                r={3}
                fill={REGION_COLORS[m.region] || '#00ffd5'}
                className="birth-dot"
              />
              <circle
                r={3}
                fill="none"
                stroke={REGION_COLORS[m.region] || '#00ffd5'}
                strokeWidth={1}
                className="birth-ripple"
              />
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}

export const WorldMap = memo(WorldMapInner);
