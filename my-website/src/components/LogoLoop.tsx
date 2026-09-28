import React, { useMemo } from 'react';
import clsx from 'clsx';
import './LogoLoop.css';

export interface LogoItem {
  node?: React.ReactNode;
  src?: string;
  alt?: string;
  title?: string;
  href?: string;
  target?: string;
  rel?: string;
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

export interface LogoLoopProps {
  logos?: LogoItem[];
  items?: LogoItem[];
  speed?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
  logoHeight?: number | string;
  gap?: number;
  hoverSpeed?: number;
  scaleOnHover?: boolean;
  fadeOut?: boolean;
  fadeOutColor?: string;
  ariaLabel?: string;
  useCustomRender?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function LogoLoop({
  logos,
  items,
  speed = 60,
  direction = 'left',
  logoHeight = 40,
  gap = 40,
  hoverSpeed,
  scaleOnHover = false,
  fadeOut = false,
  fadeOutColor,
  ariaLabel = 'Partner logos',
  useCustomRender = false,
  className,
  style,
}: LogoLoopProps) {
  const logoList = logos || items || [];
  if (!logoList || logoList.length === 0) return null;

  // Duplicate items enough times to guarantee a wide track
  const minItems = 10;
  const repeatCount = Math.max(2, Math.ceil(minItems / logoList.length));

  const repeatedLogos = useMemo(() => {
    const arr: LogoItem[] = [];
    for (let i = 0; i < repeatCount; i++) {
      arr.push(...logoList);
    }
    return arr;
  }, [logoList, repeatCount]);

  const isVertical = direction === 'up' || direction === 'down';

  // Compute smooth constant animation duration without layout state recalculation glitches
  const estimatedItemWidth = typeof logoHeight === 'number' ? logoHeight * 2.5 : 100;
  const sequenceLengthPx = repeatedLogos.length * (estimatedItemWidth + gap);
  const durationSec = useMemo(() => {
    return Math.max(3, sequenceLengthPx / Math.max(1, speed));
  }, [sequenceLengthPx, speed]);

  const heightVal = typeof logoHeight === 'number' ? `${logoHeight}px` : logoHeight;
  const gapVal = `${gap}px`;
  const isPauseOnHover = hoverSpeed === 0;

  const containerStyle: React.CSSProperties = {
    ...style,
    ...(fadeOutColor ? ({ '--fade-color': fadeOutColor } as React.CSSProperties) : {}),
  };

  const trackStyle: React.CSSProperties = {
    animationDuration: `${durationSec}s`,
  };

  const listStyle: React.CSSProperties = {
    gap: gapVal,
    [isVertical ? 'paddingBottom' : 'paddingRight']: gapVal,
  };

  return (
    <div
      className={clsx(
        'logo-loop-container',
        `logo-loop--${direction}`,
        {
          'logo-loop--fade-out': fadeOut,
          'logo-loop--scale-hover': scaleOnHover,
          'logo-loop--pause-on-hover': isPauseOnHover,
        },
        className
      )}
      style={containerStyle}
      aria-label={ariaLabel}
      role="region"
    >
      <div className="logo-loop-track" style={trackStyle}>
        {/* Sequence 1 */}
        <div className="logo-loop-list" style={listStyle}>
          {repeatedLogos.map((item, index) =>
            renderLogoItem(item, `seq1-${index}`, heightVal)
          )}
        </div>
        {/* Sequence 2 (Identical copy for ultra-smooth 60fps GPU loop) */}
        <div className="logo-loop-list" style={listStyle} aria-hidden="true">
          {repeatedLogos.map((item, index) =>
            renderLogoItem(item, `seq2-${index}`, heightVal)
          )}
        </div>
      </div>
    </div>
  );
}

function renderLogoItem(
  item: LogoItem,
  key: string | number,
  heightVal: string
) {
  const content = (
    <>
      {item.node ? (
        <span className="logo-loop-node" style={{ height: heightVal, fontSize: heightVal }}>
          {item.node}
        </span>
      ) : item.src ? (
        <img
          src={item.src}
          alt={item.alt || item.title || 'Logo'}
          title={item.title}
          style={{ height: heightVal }}
          className={clsx('logo-loop-img', item.className)}
          loading="eager"
          decoding="async"
        />
      ) : (
        item.title && <span className="logo-loop-text">{item.title}</span>
      )}
    </>
  );

  if (item.href) {
    return (
      <a
        key={key}
        href={item.href}
        target={item.target || '_blank'}
        rel={item.rel || 'noopener noreferrer'}
        className={clsx('logo-loop-item', 'logo-loop-item--link', item.className)}
        title={item.title || item.alt}
        aria-label={item.ariaLabel || item.title || item.alt}
        style={item.style}
      >
        {content}
      </a>
    );
  }

  return (
    <div
      key={key}
      className={clsx('logo-loop-item', item.className)}
      title={item.title || item.alt}
      style={item.style}
    >
      {content}
    </div>
  );
}
