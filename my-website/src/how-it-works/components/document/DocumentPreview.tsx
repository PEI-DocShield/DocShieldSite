import { useRef, useState, type KeyboardEvent } from 'react';
import { cn } from '../../lib/cn';
import { isMasked, replacementFor, segmentParagraph } from '../../lib/anonymize';
import { TYPE_LABELS } from '../../data/sampleDocuments';
import type { Entity, SampleDocument } from '../../types';
import { card } from '../ui/styles';
import { STATE_LABELS } from '../steps/review/review';

/**
 * What a screen reader says for an entity: the colour-coded state and the hover tooltip, as words.
 * `masked` is whether the text on screen is the replacement (protected column) or the original.
 */
function entityLabel(e: Entity, masked: boolean) {
  const shown = masked ? (e.method === 'suppression' && !e.customReplacement ? 'suppressed' : replacementFor(e)) : e.text;
  const becomes =
    !masked && isMasked(e.state)
      ? `, protected as ${e.method === 'suppression' && !e.customReplacement ? 'suppressed' : replacementFor(e)}`
      : '';
  return `${shown}, ${TYPE_LABELS[e.type]}, ${STATE_LABELS[e.state].toLowerCase()}${becomes}`;
}

interface Props {
  doc: SampleDocument;
  entities: Entity[];
  footer: string;
  showOriginal?: boolean;
  selectedId?: string | null;
  onSelect?: (entity: Entity) => void;
  /** Entity id drawn as an unconfirmed preview. */
  pendingId?: string;
  /** A review tool is armed, so clicking an entity applies it. */
  toolActive?: boolean;
}

/** Suppressed entities render as a fixed-width solid bar, so the bar never hints at the original length. */
export function MaskedText({ entity }: { entity: Entity }) {
  if (entity.method !== 'suppression' || entity.customReplacement) return <>{replacementFor(entity)}</>;
  return (
    // The placeholder glyphs only size the bar and are never visible.
    <span className="rounded-xs bg-fg text-transparent select-none" role="img" aria-label="Suppressed">
      {'x'.repeat(5)}
    </span>
  );
}

function entityClass(e: Entity, masked: boolean, selected: boolean, pending: boolean, clickable: boolean, toolActive?: boolean) {
  return cn(
    'scroll-my-28 rounded-[3px] bg-transparent p-px text-inherit',
    masked
      ? ['font-semibold text-teal-600', e.state === 'manual' && 'text-blue']
      : [
          'underline decoration-teal-500 decoration-dotted underline-offset-3',
          e.state === 'rejected' && 'decoration-muted',
          e.state === 'reverted' && 'bg-amber-soft no-underline',
        ],
    // Text dragged over with the Select tool, waiting for Confirm or Reject.
    pending && 'bg-teal-50 no-underline outline outline-offset-1 outline-teal-500 outline-dashed',
    selected && 'bg-teal-50 shadow-[0_0_0_1px_var(--color-teal-100)]',
    clickable && ['hover:bg-teal-50 hover:shadow-[0_0_0_1px_var(--color-teal-100)]', toolActive ? 'cursor-crosshair' : 'cursor-pointer'],
  );
}

export function DocumentPreview({ doc, entities, footer, showOriginal, selectedId, onSelect, pendingId, toolActive }: Props) {
  const docEntities = entities.filter((e) => e.docId === doc.id);
  const body = useRef<HTMLDivElement>(null);
  const [lastFocused, setLastFocused] = useState<string | null>(null);

  const paragraphs = doc.paragraphs.map((p, i) => segmentParagraph(p, docEntities, i));
  // Roving tabindex: the entities form one tab stop, and the arrow keys move between them. The stop is the
  // entity last focused, else the selected one, else the first. A mark is keyed by place (an entity's text can recur).
  const markKey = (paragraph: number, start: number) => `${paragraph}:${start}`;
  const marks = paragraphs.flatMap((segs, i) =>
    segs.flatMap((seg) => (seg.entity ? [{ key: markKey(i, seg.start), id: seg.entity.id }] : [])),
  );
  const tabStop = (marks.find((m) => m.key === lastFocused) ?? marks.find((m) => m.id === selectedId) ?? marks[0])?.key;

  const moveFocus = (ev: KeyboardEvent<HTMLElement>) => {
    const keys: Record<string, (i: number, last: number) => number> = {
      ArrowRight: (i) => i + 1,
      ArrowDown: (i) => i + 1,
      ArrowLeft: (i) => i - 1,
      ArrowUp: (i) => i - 1,
      Home: () => 0,
      End: (_, last) => last,
    };
    const next = keys[ev.key];
    if (!next || !body.current) return false;
    const all = Array.from(body.current.querySelectorAll<HTMLElement>('[data-entity-id]'));
    const target = all[Math.min(Math.max(next(all.indexOf(ev.currentTarget), all.length - 1), 0), all.length - 1)];
    ev.preventDefault();
    target?.focus();
    return true;
  };

  return (
    <article className={cn(card, 'flex-1 gap-0 p-7 max-sm:p-5')}>
      <h2 className="font-serif text-2xl font-normal">{doc.title}</h2>
      <p className="border-b border-line pt-1 pb-3.5 text-2xs tracking-[0.06em] text-muted uppercase">{doc.meta}</p>
      <div ref={body} className="flex-1 pt-[18px] pb-2 leading-[1.9] wrap-anywhere" data-doc-body>
        {doc.paragraphs.map((_, i) => (
          <p key={i} data-paragraph={i} className="mb-[18px] whitespace-pre-line">
            {paragraphs[i].map((seg, j) => {
              if (!seg.entity)
                return (
                  <span key={j} data-start={seg.start}>
                    {seg.text}
                  </span>
                );
              const e = seg.entity;
              const masked = isMasked(e.state) && !showOriginal;
              return (
                <mark
                  key={j}
                  data-entity-id={e.id}
                  data-start={seg.start}
                  className={entityClass(e, masked, e.id === selectedId, e.id === pendingId, !!onSelect, toolActive)}
                  title={masked ? undefined : replacementFor(e)}
                  onClick={onSelect ? () => onSelect(e) : undefined}
                  // Selectable entities act like buttons and share one roving tab stop.
                  {...(onSelect && {
                    tabIndex: markKey(i, seg.start) === tabStop ? 0 : -1,
                    role: 'button',
                    'aria-pressed': e.id === selectedId,
                    'aria-label': entityLabel(e, masked),
                    onFocus: () => setLastFocused(markKey(i, seg.start)),
                    onKeyDown: (ev: KeyboardEvent<HTMLElement>) => {
                      if (moveFocus(ev) || (ev.key !== 'Enter' && ev.key !== ' ')) return;
                      ev.preventDefault();
                      onSelect(e);
                    },
                  })}
                >
                  {masked ? <MaskedText entity={e} /> : seg.text}
                </mark>
              );
            })}
          </p>
        ))}
      </div>
      <footer className="flex justify-between pt-3 text-2xs text-muted">
        <span>{footer}</span>
        <span>1 / {doc.pages}</span>
      </footer>
    </article>
  );
}
