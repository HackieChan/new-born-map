import { memo, useMemo } from 'react';
import { SimulationStats } from '../types';
import { birthRateMap } from '../data/birthRates';

interface StatsPanelProps {
  stats: SimulationStats;
  isPlaying: boolean;
}

function StatsPanelInner({ stats, isPlaying }: StatsPanelProps) {
  // Top 5 countries by session count
  const topCountries = useMemo(() => {
    return Object.entries(stats.countryCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([id, count]) => ({
        id,
        name: birthRateMap.get(id)?.name || id,
        count,
        region: birthRateMap.get(id)?.region || 'asia',
      }));
  }, [stats.countryCounts]);

  const maxCount = topCountries[0]?.count || 1;

  const regionColors: Record<string, string> = {
    asia: '#00ffd5',
    africa: '#ffd700',
    europe: '#a78bfa',
    americas: '#ff6b9d',
    oceania: '#4ade80',
  };

  const elapsed = Math.floor((Date.now() - stats.startTime) / 1000);
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;

  return (
    <div className="stats-panel" id="stats-panel">
      <div className="stats-header">
        <div className="stats-indicator">
          <span className={`pulse-dot ${isPlaying ? 'active' : ''}`} />
          <span className="stats-label">{isPlaying ? 'LIVE' : 'PAUSED'}</span>
        </div>
        <span className="stats-elapsed">
          {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
        </span>
      </div>

      <div className="stats-global">
        <span className="stats-global-label">Global Births</span>
        <span className="stats-global-count" id="global-counter">
          {stats.globalCount.toLocaleString()}
        </span>
      </div>

      <div className="stats-rate">
        <span className="stats-rate-value">{stats.birthsPerSecond}</span>
        <span className="stats-rate-label">births/sec</span>
      </div>

      <div className="stats-divider" />

      <div className="stats-top-label">Top Countries</div>
      <div className="stats-leaderboard">
        {topCountries.map((c) => (
          <div key={c.id} className="leader-row">
            <span className="leader-name">{c.name}</span>
            <div className="leader-bar-bg">
              <div
                className="leader-bar-fill"
                style={{
                  width: `${(c.count / maxCount) * 100}%`,
                  background: regionColors[c.region] || '#00ffd5',
                }}
              />
            </div>
            <span className="leader-count">{c.count.toLocaleString()}</span>
          </div>
        ))}
        {topCountries.length === 0 && (
          <div className="leader-empty">Press play to start...</div>
        )}
      </div>
    </div>
  );
}

export const StatsPanel = memo(StatsPanelInner);
