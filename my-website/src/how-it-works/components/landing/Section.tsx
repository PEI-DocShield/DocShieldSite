import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

/** Big centred section title. */
export function CenteredHeading({ children }: { children: ReactNode }) {
  return <h2 className="text-center text-[44px] leading-tight font-bold tracking-[-0.035em] max-sm:text-[34px]">{children}</h2>;
}

export function IconTile({ icon: Icon, size = 'md' }: { icon: LucideIcon; size?: 'md' | 'lg' }) {
  return (
    <span
      className={cn(
        'grid shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-600',
        size === 'md' ? 'size-10' : 'size-14 rounded-2xl',
      )}
    >
      <Icon size={size === 'md' ? 20 : 28} />
    </span>
  );
}
