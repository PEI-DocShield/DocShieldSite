import { ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface Props {
  summary: ReactNode;
  chevron?: boolean;
  className?: string;
  summaryClassName?: string;
  children: ReactNode;
}

/* Native <details>. Open-state styles use `[[open]>summary>&]` (direct children only) rather than
   `group-open`, because disclosures nest and an open parent must not restyle a closed child. */
export function Disclosure({ summary, chevron = true, className, summaryClassName, children }: Props) {
  return (
    <details className={className}>
      <summary
        className={cn(
          'flex cursor-pointer list-none items-center gap-1.5 text-sm font-semibold text-muted hover:text-teal-600 [&::-webkit-details-marker]:hidden [[open]>&]:mb-2.5',
          summaryClassName,
        )}
      >
        {summary}
        {chevron && <ChevronDown size={14} className="ml-0.5 text-muted transition-transform duration-150 [[open]>summary>&]:rotate-180" />}
      </summary>
      {children}
    </details>
  );
}
