import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { TYPE_LABELS } from '../../../data/sampleDocuments';
import { isMasked, replacementFor } from '../../../lib/anonymize';
import { cn } from '../../../lib/cn';
import type { Entity, EntityType } from '../../../types';
import { MaskedText } from '../../document/DocumentPreview';
import { Button, IconButton } from '../../ui/Button';
import { Pill } from '../../ui/Pill';
import { Dropdown } from '../../ui/Dropdown';
import { eyebrow, fieldLabel, muted } from '../../ui/styles';
import { STATE_LABELS, type MaskDraft } from './review';

const MASKABLE_TYPES: EntityType[] = ['PERSON', 'ORG', 'DATE', 'EMAIL', 'PHONE', 'ADDRESS', 'CUSTOM'];

const panel = 'flex flex-col gap-2.5 border-t border-line pt-3.5';
const panelTitle = 'text-[1.17em] font-semibold';

interface Props {
  /** A mask being drawn takes precedence over the selected entity. */
  draft: MaskDraft | null;
  /** The draft as an entity, once it is valid; previews its replacement. */
  pending: Entity | null;
  onDraftChange: (draft: MaskDraft) => void;
  selected: Entity | null;
  /** Position of the selected entity among the document's entities, for the "n of N" label and arrows. */
  position: { index: number; total: number };
  /** Moves the selection by `delta` entities (-1 previous, +1 next). */
  onStep: (delta: -1 | 1) => void;
  onApplyReplacement: (value: string) => void;
}

/** Details of the entity being edited: the pending mask draft, or else the selected entity. */
export function SelectedEntityPanel({ draft, pending, onDraftChange, selected, position, onStep, onApplyReplacement }: Props) {
  if (draft) {
    return (
      <div className={panel}>
        <div className="flex items-center justify-between gap-3">
          <h3 className={panelTitle}>{pending && draft.method ? <MaskedText entity={pending} /> : 'New mask'}</h3>
          <Pill tone="manual">Pending</Pill>
        </div>
        <p className={muted}>“{draft.text}”</p>
        {draft.error ? (
          <p className="text-sm text-red">{draft.error}</p>
        ) : (
          <div>
            <span className={cn(fieldLabel, 'mt-1 mb-1.5')}>Entity type</span>
            <Dropdown
              label="Entity type"
              value={draft.type}
              onChange={(v) => onDraftChange({ ...draft, type: v })}
              options={MASKABLE_TYPES.map((t) => ({ id: t, label: TYPE_LABELS[t] }))}
            />
          </div>
        )}
      </div>
    );
  }

  if (!selected) return null;

  return (
    <div className={panel}>
      <div className="flex items-center justify-between gap-2">
        <span className={eyebrow}>
          Selected entity · {position.index + 1} of {position.total}
        </span>
        <div className="flex gap-0.5">
          <IconButton disabled={position.index <= 0} onClick={() => onStep(-1)} aria-label="Previous entity" title="Previous entity">
            <ChevronLeft size={16} />
          </IconButton>
          <IconButton
            disabled={position.index >= position.total - 1}
            onClick={() => onStep(1)}
            aria-label="Next entity"
            title="Next entity"
          >
            <ChevronRight size={16} />
          </IconButton>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3">
        <h3 className={panelTitle}>{isMasked(selected.state) ? replacementFor(selected) : selected.text}</h3>
        <Pill tone={selected.state}>{STATE_LABELS[selected.state]}</Pill>
      </div>
      <p className={muted}>
        {selected.text} · {TYPE_LABELS[selected.type]}
        {selected.confidence !== null && ` · ${selected.confidence}%`}
      </p>
      {isMasked(selected.state) && selected.method !== 'suppression' && (
        <CustomReplacementField
          // Remounting on every replacement change resets the input to the entity's current value.
          key={`${selected.id}:${selected.method}:${selected.customReplacement ?? ''}`}
          entity={selected}
          onApply={onApplyReplacement}
        />
      )}
    </div>
  );
}

function CustomReplacementField({ entity, onApply }: { entity: Entity; onApply: (value: string) => void }) {
  const [value, setValue] = useState(() => replacementFor(entity));
  return (
    <label>
      <span className={cn(fieldLabel, 'mt-1 mb-1.5')}>Custom replacement</span>
      <div className="flex gap-2">
        <input
          className="h-10 w-full min-w-0 flex-1 rounded-xl border border-line-strong bg-surface px-3"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onApply(value)}
        />
        <Button className="rounded-xl" onClick={() => onApply(value)}>
          Apply
        </Button>
      </div>
    </label>
  );
}
