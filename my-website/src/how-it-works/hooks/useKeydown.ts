import { useEffect, useRef } from 'react';

/** Calls `handler` on every window keydown. The listener is added once; it always runs the latest handler. */
export function useKeydown(handler: (e: KeyboardEvent) => void) {
  const latest = useRef(handler);
  useEffect(() => {
    latest.current = handler;
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => latest.current(e);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
}
