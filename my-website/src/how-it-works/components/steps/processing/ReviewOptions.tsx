import { ArrowRight, MousePointer2, PenLine, Sparkles } from 'lucide-react';
import { useId } from 'react';
import { cn } from '../../../lib/cn';
import type { ReviewMode } from '../../../types';
import { Button } from '../../ui/Button';
import { card, cardTitle, muted } from '../../ui/styles';

interface Props {
  manual: boolean;
  /** Everything is processed: until then the options are visible but dimmed and locked. */
  ready: boolean;
  onReview: (mode: ReviewMode) => void;
}

export function ReviewOptions({ manual, ready, onReview }: Props) {
  const optionClass = cn(card, 'gap-3.5 transition-opacity duration-700', ready ? 'opacity-100' : 'opacity-50 select-none');
  // While locked, the buttons say why to screen readers; the hint goes away once they unlock.
  const hintId = useId();
  const hint = ready ? undefined : hintId;
  const hintText = !ready && (
    <span id={hintId} className="sr-only">
      Available when processing finishes.
    </span>
  );

  if (manual) {
    return (
      <section className={optionClass}>
        {hintText}
        <PenLine size={20} className="text-teal-600" />
        <h2 className={cardTitle}>Manual editing</h2>
        <p className={muted}>Select any text in the document to mask it. Nothing is protected until you add a mask.</p>
        <div>
          <Button variant="primary" disabled={!ready} aria-describedby={hint} onClick={() => onReview('manual')}>
            <ArrowRight size={15} /> Open editor
          </Button>
        </div>
      </section>
    );
  }

  return (
    <div className="grid grid-cols-2 items-stretch gap-5 max-md:grid-cols-1">
      <section className={optionClass}>
        {hintText}
        <h2 className={cardTitle}>Manual review</h2>
        <MousePointer2 size={20} className="text-teal-600" />
        <p className={muted}>Inspect detected entities one by one, confirm or reject them, and refine the document before exporting.</p>
        <div>
          <Button variant="primary" disabled={!ready} aria-describedby={hint} onClick={() => onReview('manual')}>
            <ArrowRight size={15} /> Start manual review
          </Button>
        </div>
      </section>
      <section className={optionClass}>
        <h2 className={cardTitle}>Automatic review</h2>
        <Sparkles size={20} className="text-teal-600" />
        <p className={muted}>
          Keep the automatically applied result and continue to ready. You can still open the editor and make changes.
        </p>
        <div>
          <Button disabled={!ready} aria-describedby={hint} onClick={() => onReview('automatic')}>
            <ArrowRight size={15} /> Use automatic review
          </Button>
        </div>
      </section>
    </div>
  );
}
