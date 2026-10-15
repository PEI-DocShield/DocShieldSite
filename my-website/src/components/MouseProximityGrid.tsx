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
    
    // Document card aura (reacts to WorkflowSection document card scroll and step color)
    let cardAura = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      active: false,
      targetActive: false,
      radius: 360,
      r: 37,
      g: 130,
      b: 142,
      targetR: 37,
      targetG: 130,
      targetB: 142,
    };

    let scrollVelocity = 0;
    let lastScrollY = typeof window !== 'undefined' ? window.scrollY : 0;

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

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = Math.abs(currentScrollY - lastScrollY);
      lastScrollY = currentScrollY;
      scrollVelocity = Math.min(1, scrollVelocity + delta * 0.02);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const handleCardGlow = (e: Event) => {
      const custom = e as CustomEvent<{ x: number; y: number; active: boolean; rgb?: string; radius?: number }>;
      if (custom.detail) {
        const rect = canvas.getBoundingClientRect();
        cardAura.targetX = custom.detail.x - rect.left;
        cardAura.targetY = custom.detail.y - rect.top;
        cardAura.targetActive = custom.detail.active;

        // Snap immediately when waking up from offscreen so it doesn't streak across
        if (cardAura.x < -500 && custom.detail.active) {
          cardAura.x = cardAura.targetX;
          cardAura.y = cardAura.targetY;
        }

        if (custom.detail.rgb) {
          const parts = custom.detail.rgb.split(',').map((p) => parseFloat(p.trim()));
          if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
            cardAura.targetR = parts[0];
            cardAura.targetG = parts[1];
            cardAura.targetB = parts[2];
          }
        }
        if (custom.detail.radius) cardAura.radius = custom.detail.radius;
      }
    };

    window.addEventListener('docshield:card-glow', handleCardGlow);

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

      // Smooth card aura lerp
      if (cardAura.targetActive) {
        cardAura.x += (cardAura.targetX - cardAura.x) * 0.15;
        cardAura.y += (cardAura.targetY - cardAura.y) * 0.15;
        cardAura.active = true;
      } else {
        cardAura.x += (-1000 - cardAura.x) * 0.1;
        cardAura.y += (-1000 - cardAura.y) * 0.1;
        if (Math.abs(cardAura.x - -1000) < 5) cardAura.active = false;
      }

      // Smooth RGB color transition and scroll velocity decay
      cardAura.r += (cardAura.targetR - cardAura.r) * 0.08;
      cardAura.g += (cardAura.targetG - cardAura.g) * 0.08;
      cardAura.b += (cardAura.targetB - cardAura.b) * 0.08;
      const cardRgb = `${Math.round(cardAura.r)}, ${Math.round(cardAura.g)}, ${Math.round(cardAura.b)}`;

      scrollVelocity *= 0.94;

      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      const baseColor = isDark ? '148, 163, 184' : '100, 116, 139';
      const accentCyan = '36, 108, 119';
      const accentTeal = '36, 108, 119';

      // 1. Lightweight Radial Glow Spotlight (Mouse)
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

      // 1b. Document Card Radial Glow Spotlight (subtle, dimmed)
      if (cardAura.active && cardAura.x > -500 && cardAura.y > -500) {
        const cardGlowRadius = cardAura.radius;
        const cardGradient = ctx.createRadialGradient(cardAura.x, cardAura.y, 30, cardAura.x, cardAura.y, cardGlowRadius);
        cardGradient.addColorStop(0, `rgba(${cardRgb}, ${isDark ? 0.16 : 0.09})`);
        cardGradient.addColorStop(0.5, `rgba(${cardRgb}, ${isDark ? 0.05 : 0.025})`);
        cardGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = cardGradient;
        ctx.beginPath();
        ctx.arc(cardAura.x, cardAura.y, cardGlowRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Fast Grid Cell Rendering
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

        // Proximity to Document Card (gently reacts to scroll near the card)
        let cardIntensity = 0;
        if (cardAura.active && cardAura.x > -500) {
          const cdx = cardAura.x - cell.x;
          const cdy = cardAura.y - cell.y;
          const cDistSq = cdx * cdx + cdy * cdy;
          const cardRadSq = cardAura.radius * cardAura.radius;

          if (cDistSq < cardRadSq) {
            const cDist = Math.sqrt(cDistSq);
            cardIntensity = 1 - cDist / cardAura.radius;

            // React to scrolling near the card: subtle scramble proportional to scroll speed
            const scrambleChance = (0.03 + scrollVelocity * 0.15) * cardIntensity;
            if (!prefersReducedMotion && Math.random() < scrambleChance) {
              cell.char = CHARS[Math.floor(Math.random() * CHARS.length)];
              cell.scrambleTimer = 6;
            }
          }
        }

        let opacity = cell.isSpecial ? 0.3 : 0.12;
        let charColor = `rgba(${baseColor}, ${opacity})`;

        const effectiveIntensity = Math.max(intensity, cardIntensity * 0.5);

        if (interactive) {
          if (effectiveIntensity > 0) {
            opacity = Math.min(0.85, opacity + effectiveIntensity * 0.45 + (cardIntensity > 0 ? scrollVelocity * 0.1 : 0));
          }
          if (intensity > 0.5) {
            charColor = `rgba(${accentCyan}, ${opacity})`;
          } else if (intensity > 0.2) {
            charColor = `rgba(${accentTeal}, ${opacity})`;
          } else if (cardIntensity > 0.1) {
            // Subtle character tint near the card with the step's pastel/teal color
            charColor = `rgba(${cardRgb}, ${opacity})`;
          }
        } else {
          // Even when static, if cardAura is active:
          if (cardIntensity > 0.1) {
            opacity = Math.min(0.8, 0.25 + cardIntensity * 0.35 + scrollVelocity * 0.1);
            charColor = `rgba(${cardRgb}, ${opacity})`;
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
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('docshield:card-glow', handleCardGlow);
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


