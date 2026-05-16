import { memo } from 'react';

interface ControlPanelProps {
  isPlaying: boolean;
  speed: number;
  onToggle: () => void;
  onSetSpeed: (speed: number) => void;
  onReset: () => void;
}

const SPEEDS = [1, 2, 5, 10];

function ControlPanelInner({
  isPlaying,
  speed,
  onToggle,
  onSetSpeed,
  onReset,
}: ControlPanelProps) {
  return (
    <div className="control-panel" id="control-panel">
      <button
        className="ctrl-btn ctrl-play"
        id="play-pause-btn"
        onClick={onToggle}
        title={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="6,4 20,12 6,20" />
          </svg>
        )}
      </button>

      <div className="ctrl-divider" />

      <div className="speed-group">
        {SPEEDS.map((s) => (
          <button
            key={s}
            className={`ctrl-btn ctrl-speed ${speed === s ? 'active' : ''}`}
            onClick={() => onSetSpeed(s)}
            id={`speed-${s}x-btn`}
          >
            {s}x
          </button>
        ))}
      </div>

      <div className="ctrl-divider" />

      <button
        className="ctrl-btn ctrl-reset"
        id="reset-btn"
        onClick={onReset}
        title="Reset"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="1 4 1 10 7 10" />
          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
        </svg>
      </button>
    </div>
  );
}

export const ControlPanel = memo(ControlPanelInner);
