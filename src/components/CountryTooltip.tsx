import { memo } from 'react';
import { TooltipData } from '../types';

const regionLabels: Record<string, string> = {
  asia: 'Asia',
  africa: 'Africa',
  europe: 'Europe',
  americas: 'Americas',
  oceania: 'Oceania',
};

const regionColors: Record<string, string> = {
  asia: '#00ffd5',
  africa: '#ffd700',
  europe: '#a78bfa',
  americas: '#ff6b9d',
  oceania: '#4ade80',
};

interface CountryTooltipProps {
  data: TooltipData | null;
}

function CountryTooltipInner({ data }: CountryTooltipProps) {
  if (!data) return null;

  const birthsPerMinute = Math.round(60000 / data.intervalMs);

  return (
    <div
      className="country-tooltip"
      id="country-tooltip"
      style={{
        left: data.x + 16,
        top: data.y - 10,
      }}
    >
      <div className="tooltip-header">
        <span className="tooltip-name">{data.name}</span>
        <span
          className="tooltip-region"
          style={{ color: regionColors[data.region] }}
        >
          {regionLabels[data.region]}
        </span>
      </div>
      <div className="tooltip-stats">
        <div className="tooltip-row">
          <span className="tooltip-label">Annual Births</span>
          <span className="tooltip-value">
            {data.annualBirths.toLocaleString()}
          </span>
        </div>
        <div className="tooltip-row">
          <span className="tooltip-label">Per Minute</span>
          <span className="tooltip-value">~{birthsPerMinute}</span>
        </div>
        <div className="tooltip-row">
          <span className="tooltip-label">Interval</span>
          <span className="tooltip-value">
            {data.intervalMs < 1000
              ? `${data.intervalMs}ms`
              : `${(data.intervalMs / 1000).toFixed(1)}s`}
          </span>
        </div>
        <div className="tooltip-row highlight">
          <span className="tooltip-label">Session Count</span>
          <span className="tooltip-value">
            {data.sessionCount.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

export const CountryTooltip = memo(CountryTooltipInner);
