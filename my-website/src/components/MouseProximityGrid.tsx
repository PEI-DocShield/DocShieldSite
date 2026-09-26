import React, { useRef, useEffect } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789^$[]{}<>*#@!%&~+=-/\\|:;.,';
const CELL_SIZE = 18;
const BASE_OPACITY = 0.15;
const BASE_COLOR = '#6B7280';
const HIGHLIGHT_GRAY = '#374151';
const HIGHLIGHT_BLUE = '#25828e';

interface MouseProximityGridProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function MouseProximityGrid({ className, style }: MouseProximityGridProps): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const buildGrid = () => {
      const { offsetWidth: w, offsetHeight: h } = container;
      const cols = Math.ceil(w / CELL_SIZE);
      const rows = Math.ceil(h / CELL_SIZE);
      
      container.innerHTML = '';

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const span = document.createElement('span');
          span.textContent = CHARS[Math.floor(Math.random() * CHARS.length)];
          
          // Randomly highlight some characters statically so it still looks interesting
          const isHighlighted = Math.random() < 0.05;
          const color = isHighlighted 
            ? (Math.random() < 0.4 ? HIGHLIGHT_BLUE : HIGHLIGHT_GRAY)
            : BASE_COLOR;
          const opacity = isHighlighted ? 0.5 : BASE_OPACITY;

          span.style.cssText = `
            position: absolute;
            left: ${c * CELL_SIZE}px;
            top: ${r * CELL_SIZE}px;
            width: ${CELL_SIZE}px;
            height: ${CELL_SIZE}px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Courier New', Courier, monospace;
            font-size: 14px;
            color: ${color};
            opacity: ${opacity};
            pointer-events: none;
            user-select: none;
          `;
          
          container.appendChild(span);
        }
      }
    };

    buildGrid();

    const resizeObserver = new ResizeObserver(() => {
      buildGrid();
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        ...style,
      }}
    />
  );
}
