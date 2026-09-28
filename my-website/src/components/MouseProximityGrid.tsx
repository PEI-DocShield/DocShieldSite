import React, { useRef, useEffect } from 'react';

const CHARS = '01ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#$*+=-/\\|:;<>🔒🛡️';
const CELL_SIZE = 28;
const PROXIMITY_RADIUS = 170;

interface Cell {
  x: number;
  y: number;
  char: string;
  originalChar: string;
  isSpecial: boolean;
  isHighlighted: boolean;
  isBlue: boolean;
  scrambleTimer: number;
}

interface MouseProximityGridProps {
  className?: string;
  style?: React.CSSProperties;
  interactive?: boolean;
}

export default function MouseProximityGrid({ className, style, interactive = false }: MouseProximityGridProps): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;

    // Mouse coordinates (target & current for lerp)
    let mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000, active: false };
    let cells: Cell[] = [];

    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const initGrid = () => {
      width = container.offsetWidth;
      height = container.offsetHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      const cols = Math.ceil(width / CELL_SIZE);
      const rows = Math.ceil(height / CELL_SIZE);

      cells = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const isSpecial = Math.random() < 0.04;
          const isHighlighted = Math.random() < 0.05;
          const isBlue = Math.random() < 0.4;
          const char = CHARS[Math.floor(Math.random() * CHARS.length)];
          cells.push({
            x: c * CELL_SIZE + CELL_SIZE / 2,
            y: r * CELL_SIZE + CELL_SIZE / 2,
            char,
            originalChar: char,
            isSpecial,
            isHighlighted,
            isBlue,
            scrambleTimer: 0,
          });
        }
      }
    };

    initGrid();

    const resizeObserver = new ResizeObserver(() => {
      initGrid();
    });
    resizeObserver.observe(container);

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.active = true;
    };

    const handlePointerLeave = () => {
      mouse.active = false;
    };

    if (interactive) {
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
      window.addEventListener('pointerleave', handlePointerLeave);
    }

    const render = () => {
      animId = requestAnimationFrame(render);

      // Smooth mouse lerp
      if (mouse.active) {
        mouse.x += (mouse.targetX - mouse.x) * 0.2;
        mouse.y += (mouse.targetY - mouse.y) * 0.2;
      } else {
        mouse.x += (-1000 - mouse.x) * 0.1;
        mouse.y += (-1000 - mouse.y) * 0.1;
      }

      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      const baseColor = isDark ? '148, 163, 184' : '100, 116, 139';
      const accentCyan = '36, 108, 119';
      const accentTeal = '36, 108, 119';

      // 1. Lightweight Radial Glow Spotlight
      if (mouse.x > -500 && mouse.y > -500) {
        const glowRadius = PROXIMITY_RADIUS * 1.1;
        const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, glowRadius);
        gradient.addColorStop(0, `rgba(${accentTeal}, ${isDark ? 0.25 : 0.15})`);
        gradient.addColorStop(0.5, `rgba(${accentCyan}, ${isDark ? 0.08 : 0.04})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Fast Grid Cell Rendering (No heavy shadowBlur!)
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = "13px 'Courier New', Courier, monospace";

      const activeCellsNearMouse: Cell[] = [];
      const proxSq = PROXIMITY_RADIUS * PROXIMITY_RADIUS;

      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        const dx = mouse.x - cell.x;
        const dy = mouse.y - cell.y;
        const distSq = dx * dx + dy * dy;

        let intensity = 0;
        let displacementX = 0;
        let displacementY = 0;

        if (distSq < proxSq) {
          const dist = Math.sqrt(distSq);
          intensity = 1 - dist / PROXIMITY_RADIUS;
          activeCellsNearMouse.push(cell);

          displacementX = -(dx / (dist || 1)) * intensity * 3;
          displacementY = -(dy / (dist || 1)) * intensity * 3;

          if (!prefersReducedMotion && Math.random() < 0.15 * intensity) {
            cell.char = CHARS[Math.floor(Math.random() * CHARS.length)];
            cell.scrambleTimer = 8;
          }
        } else if (cell.scrambleTimer > 0) {
          cell.scrambleTimer--;
          if (cell.scrambleTimer === 0) {
            cell.char = cell.originalChar;
          }
        }

        let opacity = cell.isSpecial ? 0.3 : 0.12;
        let charColor = `rgba(${baseColor}, ${opacity})`;

        if (interactive) {
          if (intensity > 0) {
            opacity = Math.min(0.9, opacity + intensity * 0.75);
          }
          if (intensity > 0.5) {
            charColor = `rgba(${accentCyan}, ${opacity})`;
          } else if (intensity > 0.2) {
            charColor = `rgba(${accentTeal}, ${opacity})`;
          }
        } else {
          // Make the static background more noticeable
          opacity = cell.isSpecial ? 0.45 : 0.25;
          charColor = `rgba(${baseColor}, ${opacity})`;
          
          if (cell.isHighlighted) {
            opacity = 0.7;
            if (cell.isBlue) {
              charColor = `rgba(${accentCyan}, ${opacity})`;
            } else {
              charColor = `rgba(148, 163, 184, ${opacity})`;
            }
          }
        }


        ctx.fillStyle = charColor;
        ctx.fillText(cell.char, cell.x + displacementX, cell.y + displacementY);
      }

      // 3. Lightweight Constellation Lines
      if (activeCellsNearMouse.length > 1 && activeCellsNearMouse.length < 35) {
        ctx.lineWidth = 0.6;
        const maxMeshDistSq = 70 * 70;

        for (let a = 0; a < activeCellsNearMouse.length; a++) {
          for (let b = a + 1; b < activeCellsNearMouse.length; b++) {
            const ca = activeCellsNearMouse[a];
            const cb = activeCellsNearMouse[b];
            const mdx = ca.x - cb.x;
            const mdy = ca.y - cb.y;
            const mDistSq = mdx * mdx + mdy * mdy;

            if (mDistSq < maxMeshDistSq) {
              const lineAlpha = (1 - Math.sqrt(mDistSq) / 70) * 0.2;
              ctx.strokeStyle = `rgba(${accentCyan}, ${lineAlpha})`;
              ctx.beginPath();
              ctx.moveTo(ca.x, ca.y);
              ctx.lineTo(cb.x, cb.y);
              ctx.stroke();
            }
          }
        }
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      if (interactive) {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerleave', handlePointerLeave);
      }
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
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}


