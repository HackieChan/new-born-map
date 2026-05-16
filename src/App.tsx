import { useState, useCallback } from 'react';
import { WorldMap } from './components/WorldMap';
import { StatsPanel } from './components/StatsPanel';
import { ControlPanel } from './components/ControlPanel';
import { CountryTooltip } from './components/CountryTooltip';
import { useSimulation } from './hooks/useSimulation';
import { TooltipData } from './types';

export default function App() {
  const { markers, stats, isPlaying, speed, toggle, setSpeed, reset } =
    useSimulation();

  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  const handleHover = useCallback(
    (data: TooltipData | null) => {
      if (data) {
        // Inject live session count
        data.sessionCount = stats.countryCounts[
          Object.keys(stats.countryCounts).find(
            (k) =>
              stats.countryCounts[k] !== undefined &&
              k ===
                Object.keys(stats.countryCounts).find((id) => {
                  // match by name through birthRateMap
                  return id;
                })
          ) || ''
        ] || data.sessionCount;
      }
      setTooltip(data);
    },
    [stats.countryCounts]
  );

  return (
    <div className="app">
      {/* Background gradient overlay */}
      <div className="bg-gradient" />

      {/* Header / Branding */}
      <header className="app-header" id="app-header">
        <div className="brand">
          <span className="brand-icon">👶</span>
          <div className="brand-text">
            <h1 className="brand-title">BabyMap</h1>
            <p className="brand-subtitle">Real-Time Global Birth Simulation</p>
          </div>
        </div>
      </header>

      {/* Main map */}
      <WorldMap
        markers={markers}
        onHoverCountry={handleHover}
        countryCounts={stats.countryCounts}
      />

      {/* Stats overlay */}
      <StatsPanel stats={stats} isPlaying={isPlaying} />

      {/* Controls */}
      <ControlPanel
        isPlaying={isPlaying}
        speed={speed}
        onToggle={toggle}
        onSetSpeed={setSpeed}
        onReset={reset}
      />

      {/* Country tooltip */}
      <CountryTooltip data={tooltip} />

      {/* Legend */}
      <div className="legend" id="legend">
        <div className="legend-title">Regions</div>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#00ffd5' }} />
            <span>Asia</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#ffd700' }} />
            <span>Africa</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#ff6b9d' }} />
            <span>Americas</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#a78bfa' }} />
            <span>Europe</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#4ade80' }} />
            <span>Oceania</span>
          </div>
        </div>
      </div>
    </div>
  );
}
