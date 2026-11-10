import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import type { EntityState } from '../../types';

export type PillTone = EntityState | 'neutral';

const TONES: Record<PillTone, string> = {
  neutral: 'bg-surface-2 text-muted',
  detected: 'bg-teal-50 text-teal-500',
  confirmed: 'bg-teal-100 text-teal-700',
  manual: 'bg-blue-soft text-blue',
  rejected: 'bg-surface-2 text-muted',
  reverted: 'bg-amber-soft text-amber',
};

export function Pill({ tone, className, children }: { tone: PillTone; className?: string; children: ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex h-[22px] items-center rounded-full px-[9px] text-[11.5px] font-semibold whitespace-nowrap',
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
