import React, { useRef } from 'react';
import ColorModeToggle from '@theme-original/ColorModeToggle';
import type ColorModeToggleType from '@theme/ColorModeToggle';
import type { WrapperProps } from '@docusaurus/types';
import { flushSync } from 'react-dom';

type Props = WrapperProps<typeof ColorModeToggleType>;

export default function ColorModeToggleWrapper(props: Props): JSX.Element {
  const clickCoords = useRef<{x: number, y: number} | null>(null);

  const handleCapture = (e: React.MouseEvent) => {
    clickCoords.current = { x: e.clientX, y: e.clientY };
  };

  const handleChange = (value: string) => {
    // Check if View Transitions API is supported
    if (!document.startViewTransition) {
      props.onChange(value);
      return;
    }

    const x = clickCoords.current?.x ?? window.innerWidth / 2;
    const y = clickCoords.current?.y ?? window.innerHeight / 2;
    
    // Calculate the radius needed to cover the entire screen from the click point
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // Set CSS variables for the animation
    document.documentElement.style.setProperty('--theme-toggle-x', `${x}px`);
    document.documentElement.style.setProperty('--theme-toggle-y', `${y}px`);
    document.documentElement.style.setProperty('--theme-toggle-r', `${endRadius}px`);

    document.documentElement.classList.add('theme-transitioning');

    const transition = document.startViewTransition(() => {
      // Force DOM update synchronously for the snapshot
      const resolvedValue = value === null ? 'light' : value;
      document.documentElement.setAttribute('data-theme', resolvedValue);
      
      flushSync(() => {
        props.onChange(value);
      });
    });

    transition.finished.finally(() => {
      document.documentElement.classList.remove('theme-transitioning');
    });
  };

  return (
    <div onClickCapture={handleCapture} style={{ display: 'inline-flex' }}>
      <ColorModeToggle {...props} onChange={handleChange} />
    </div>
  );
}
