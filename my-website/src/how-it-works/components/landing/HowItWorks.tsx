import { Download, Eye, ScanSearch, Upload, type LucideIcon } from 'lucide-react';
import { useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion';
import { useRef, useState, type ComponentType } from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { cn } from '../../lib/cn';
import { STEPS } from '../../lib/steps';
import type { Step } from '../../types';
import { Stepper } from '../steps/Stepper';
import { card, cardTitle, muted, screenSection } from '../ui/styles';
import { DownloadVisual, ProcessingVisual, ReviewVisual, UploadVisual } from './PhaseVisuals';
import { CenteredHeading, IconTile } from './Section';

interface Phase {
  step: Step;
  icon: LucideIcon;
  text: string;
  /** A miniature of the wizard screen for this phase; `active` lets it replay its animation. */
  Visual: ComponentType<{ active: boolean }>;
}

const PHASES: Phase[] = [
  {
    icon: Upload,
    step: 'upload',
    text: 'Add your files and choose how to protect them.',
    Visual: UploadVisual,
  },
  {
    icon: ScanSearch,
    step: 'processing',
    text: 'Sensitive data is found automatically.',
    Visual: ProcessingVisual,
  },
  {
    icon: Eye,
    step: 'review',
    text: 'Confirm, reject or add masks — you decide.',
    Visual: ReviewVisual,
  },
  {
    icon: Download,
    step: 'conclusion',
    text: 'Get the protected files and your workspace.',
    Visual: DownloadVisual,
  },
];

function Heading() {
  return (
    <CenteredHeading>
      How it works
    </CenteredHeading>
  );
}

// Titles come from the wizard's own step labels, so the landing page and the stepper always agree.
const titleOf = (phase: Phase) => STEPS.find((s) => s.id === phase.step)!.label;

function PhasePanel({ phase, active }: { phase: Phase; active: boolean }) {
  return (
    <div className="grid grid-cols-[280px_minmax(0,1fr)] items-center gap-10 max-lg:grid-cols-[230px_minmax(0,1fr)] max-lg:gap-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <IconTile icon={phase.icon} size="lg" />
        <h3 className="text-2xl font-bold tracking-[-0.025em]">{titleOf(phase)}</h3>
        <p className="text-muted">{phase.text}</p>
      </div>
      {/* Illustration only: inert keeps its buttons out of the tab order, and the fade hides whatever doesn't fit. */}
      <div className={cn(card, 'max-h-[440px] overflow-hidden bg-surface-2 mask-b-from-85% p-5 select-none')} inert aria-hidden>
        <phase.Visual active={active} />
      </div>
    </div>
  );
}

/** Desktop: the section pins to the viewport and each stretch of scrolling swaps in the next phase, like the wizard does. */
function PinnedPhases() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const [active, setActive] = useState(0);

  // The scroll distance is split into equal bands, one per phase.
  useMotionValueEvent(scrollYProgress, 'change', (v) => setActive(Math.min(PHASES.length - 1, Math.floor(v * PHASES.length))));

  // Jump to the middle of phase `i`'s band.
  const jumpToPhase = (i: number) => {
    const section = ref.current;
    if (!section) return;
    const top = section.getBoundingClientRect().top + window.scrollY;
    const band = (i + 0.5) / PHASES.length;
    window.scrollTo({ top: top + band * (section.offsetHeight - window.innerHeight), behavior: 'instant' });
  };

  return (
    <section id="how-it-works" ref={ref} className="relative" style={{ height: `${PHASES.length * 100}vh` }}>
      {/* pt-16 clears the fixed header that sits over the pinned frame; the rest is centred in what's left. */}
      <div className="sticky top-0 flex h-screen flex-col justify-center gap-7 overflow-hidden pt-16 pb-4">
        <Heading />

        <Stepper
          current={PHASES[active].step}
          maxReached={PHASES.length - 1}
          manual={false}
          onNavigate={(step) => jumpToPhase(PHASES.findIndex((p) => p.step === step))}
        />

        {/* All panels share one grid cell; only the active one is shown, the rest fade out in place. */}
        <ol className="grid">
          {PHASES.map((phase, i) => (
            <li
              key={phase.step}
              className={cn(
                'transition-[opacity,scale] duration-350 ease-in-out [grid-area:1/1]',
                i === active ? 'scale-100 opacity-100' : 'pointer-events-none scale-[0.97] opacity-0',
              )}
              // Not aria-hidden when inactive: scrolling swaps the panels, which a screen reader can't do, so it reads all four.
            >
              <PhasePanel phase={phase} active={i === active} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Small screens and reduced motion: a plain stacked list. */
function StackedPhases() {
  return (
    <section id="how-it-works" className={cn(screenSection, 'gap-8')}>
      <Heading />
      <ol className="grid grid-cols-2 gap-5 max-sm:grid-cols-1">
        {PHASES.map((phase, i) => (
          <li key={phase.step} className={cn(card, 'gap-4')}>
            <div className="flex items-center justify-between">
              <IconTile icon={phase.icon} />
              <span className="text-2xl font-bold text-line-strong">{String(i + 1).padStart(2, '0')}</span>
            </div>
            <h3 className={cardTitle}>{titleOf(phase)}</h3>
            <p className={muted}>{phase.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function HowItWorks() {
  const wide = useMediaQuery('(min-width: 960px)');
  const reduceMotion = useReducedMotion();
  return wide && !reduceMotion ? <PinnedPhases /> : <StackedPhases />;
}
