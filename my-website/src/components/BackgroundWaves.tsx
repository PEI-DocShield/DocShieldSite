import React from 'react';

export default function BackgroundWaves(): React.JSX.Element {
  return (
    <div className="background-waves" aria-hidden="true">
      <svg viewBox="0 0 1000 1000" preserveAspectRatio="none">
        <path
          className="wave wave-1"
          d="M0,1000 L0,780 Q250,730 500,780 T1000,780 L1000,1000 Z"
          fill="var(--wave-color-1)"
          fillOpacity="0.18"
        />
        <path
          className="wave wave-2"
          d="M0,1000 L0,840 Q250,890 500,840 T1000,840 L1000,1000 Z"
          fill="var(--wave-color-2)"
          fillOpacity="0.15"
        />
        <path
          className="wave wave-3"
          d="M0,0 L0,180 Q250,230 500,180 T1000,180 L1000,0 Z"
          fill="var(--wave-color-1)"
          fillOpacity="0.12"
        />
      </svg>
    </div>
  );
}
