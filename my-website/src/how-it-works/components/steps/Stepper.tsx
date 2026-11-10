import { Check } from 'lucide-react';
import { useLayoutEffect, useRef, useState } from 'react';
import { cn } from '../../lib/cn';
import { STEPS } from '../../lib/steps';
import type { Step } from '../../types';

interface Props {
  current: Step;
  maxReached: number;
  /** Manual mode has nothing to detect, so the processing step collapses out of the stepper. */
  manual: boolean;
  onNavigate: (step: Step) => void;
}

/** Dot spacing of the connector, in px. */
const DOT = 8;

export function Stepper({ current, maxReached, manual, onNavigate }: Props) {
  const isHidden = (id: Step) => manual && id === 'processing';
  const visible = STEPS.filter((s) => !isHidden(s.id));
  const currentIndex = visible.findIndex((s) => s.id === current);
  const fullIndex = STEPS.findIndex((s) => s.id === current);
  const nav = useRef<HTMLElement>(null);
  const badges = useRef<(HTMLSpanElement | null)[]>([]);
  const wrappers = useRef<(HTMLDivElement | null)[]>([]);
  const [badgeBox, setBadgeBox] = useState<{ left: number; right: number; y: number }[]>([]);

  // The dotted line is drawn between the badges, measured from the badges themselves, so it stays joined to them
  // while the steps collapse and re-centre (resizes fire on every frame of those animations).
  useLayoutEffect(() => {
    const measure = () => {
      const origin = nav.current?.getBoundingClientRect();
      if (!origin) return;
      const boxes = badges.current.flatMap((el, i) => {
        const r = isHidden(STEPS[i].id) ? undefined : el?.getBoundingClientRect();
        return r ? [{ left: r.left - origin.left, right: r.right - origin.left, y: r.top + r.height / 2 - origin.top }] : [];
      });
      setBadgeBox(boxes);
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (nav.current) observer.observe(nav.current);
    wrappers.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, manual]);

  return (
    <nav ref={nav} className="relative flex items-center justify-center gap-8" aria-label="Progress">
      {badgeBox.slice(0, -1).map((box, i) => {
        // The stretch runs from one badge's centre to the next, so it always meets them; the badges and boxes sit
        // on top and hide its ends. The dots are painted at fixed positions in the nav, so they stay still while
        // the steps move and only the visible stretch changes.
        const start = (box.left + box.right) / 2;
        const end = (badgeBox[i + 1].left + badgeBox[i + 1].right) / 2;
        return (
          <span
            key={visible[i].id}
            className={cn('pointer-events-none absolute h-1', i < currentIndex ? 'text-primary' : 'text-line-strong')}
            style={{
              left: Math.round(start),
              top: Math.round(box.y) - 2,
              width: Math.round(end - start),
              backgroundImage: 'radial-gradient(circle at 50% 50%, currentColor 1.5px, transparent 1.8px)',
              backgroundSize: `${DOT}px 4px`,
              backgroundPositionX: -Math.round(start),
            }}
            aria-hidden
          />
        );
      })}
      {STEPS.map((step, i) => {
        const hidden = isHidden(step.id);
        // A collapsing step keeps its full-flow number so the badge does not change while it fades out.
        const number = hidden ? i + 1 : visible.findIndex((s) => s.id === step.id) + 1;
        const done = i < fullIndex;
        const active = i === fullIndex;
        // Review is the one step that can jump ahead: the user may conclude straight from it.
        const reachable = !active && (i <= maxReached || (current === 'review' && step.id === 'conclusion'));
        return (
          <div
            key={step.id}
            ref={(el) => {
              wrappers.current[i] = el;
            }}
            // A collapsed step takes up no room and cancels the nav's gap, so the others glide together.
            className={cn(
              'grid transition-[grid-template-columns,opacity,margin] duration-350 ease-in-out',
              hidden ? '-ml-8 grid-cols-[0fr] overflow-hidden opacity-0' : 'grid-cols-[1fr] opacity-100',
            )}
            aria-hidden={hidden}
          >
            <button
              className="group relative z-10 flex min-w-0 text-left text-md disabled:cursor-default"
              disabled={!reachable || hidden}
              tabIndex={hidden ? -1 : undefined}
              onClick={() => onNavigate(step.id)}
              aria-current={active ? 'step' : undefined}
              aria-label={step.label}
            >
              <span
                className={cn(
                  'flex items-center rounded-full border-[1.5px] border-line bg-surface px-3.5 py-3 text-muted transition-all duration-350 ease-in-out group-enabled:group-hover:-translate-y-0.5 group-enabled:group-hover:scale-110',
                  done &&
                    // The box fades out almost at once, so only the circle is seen while the padding closes in.
                    'mx-2 border-transparent bg-transparent px-0 text-fg [transition:padding_350ms_ease-in-out,margin_350ms_ease-in-out,translate_350ms_ease-in-out,scale_350ms_ease-in-out,color_350ms,background-color_100ms,border-color_100ms,box-shadow_100ms]',
                  !done && !active && 'shadow-sm group-enabled:group-hover:shadow-md',
                  active && 'border-teal-500 bg-linear-to-b from-teal-50 to-teal-50 px-3.5 font-semibold text-fg shadow-md',
                )}
              >
                <span
                  ref={(el) => {
                    badges.current[i] = el;
                  }}
                  className={cn(
                    'grid size-8 flex-none place-items-center rounded-full border border-line-strong text-sm font-semibold transition-colors duration-350 ease-in-out',
                    (active || done) && 'animate-step-pop border-primary bg-primary text-white',
                  )}
                >
                  {done ? <Check size={16} strokeWidth={3} /> : number}
                </span>
                <span
                  className={cn(
                    'grid transition-[grid-template-columns,opacity] duration-350 ease-in-out',
                    done ? 'grid-cols-[0fr] opacity-0' : 'grid-cols-[1fr] opacity-100 delay-100',
                  )}
                >
                  <span className="min-w-0 overflow-hidden">
                    <span className="block pl-2.5 whitespace-nowrap">{step.label}</span>
                  </span>
                </span>
              </span>
            </button>
          </div>
        );
      })}
    </nav>
  );
}
