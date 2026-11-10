import { useEffect, useRef, useState } from 'react';

/** Smoothly eases a displayed number toward `target`, so discrete updates don't jump. */
export function useTween(target: number, durationMs = 700) {
  const [value, setValue] = useState(0);
  const current = useRef(0);

  useEffect(() => {
    const from = current.current;
    const start = performance.now();
    let frame: number;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      current.current = from + (target - from) * (1 - (1 - t) ** 3);
      setValue(current.current);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, durationMs]);

  return value;
}
