import { nextToken } from '../../../data/sampleDocuments';
import { segmentParagraph } from '../../../lib/anonymize';
import type { Entity, EntityState, EntityType, ProtectionMethod, SampleDocument } from '../../../types';

// Shared by the Review step and its panels.

export type Tool = 'select' | ProtectionMethod | 'confirm' | 'reject';

/** Text dragged over with the Select tool, waiting for a technique and a Confirm/Reject. */
export interface MaskDraft {
  text: string;
  type: EntityType;
  method: ProtectionMethod | null;
  /** Where the text sits: paragraph index and character offset, so the mask covers only that spot. */
  paragraph: number;
  start: number;
  error?: string;
}

/** Entity id of the draft's preview, drawn in the documents until it is confirmed or rejected. */
export const PENDING_ID = 'pending';

export const STATE_LABELS: Record<EntityState, string> = {
  detected: 'Detected',
  confirmed: 'Confirmed',
  manual: 'Manual',
  rejected: 'Rejected',
  reverted: 'Reverted',
};

/** Drawer handle: a slim pill laid over a panel's edge that hides it. */
export const edgeHandle =
  'z-1 grid h-24 w-3.5 place-items-center rounded-full border border-line bg-surface text-muted shadow-card hover:border-teal-500 hover:text-teal-600';

/** The change a tool makes to an entity, or null when it would change nothing. */
export function applyTool(tool: Tool, e: Entity): Partial<Entity> | null {
  const masked = e.state === 'manual' ? 'manual' : 'confirmed';
  switch (tool) {
    case 'select':
      return null;
    case 'confirm':
      return e.state === masked ? null : { state: masked };
    case 'reject':
      return e.state === 'rejected' ? null : { state: 'rejected' };
    default:
      return e.method === tool && !e.customReplacement && e.state === masked
        ? null
        : { method: tool, customReplacement: undefined, state: masked };
  }
}

/** What the user's text selection in a document amounts to. */
export type SelectionResult =
  | { kind: 'none' }
  /** The selection is exactly an existing entity. */
  | { kind: 'entity'; id: string }
  /** New text to mask (or an invalid selection, flagged by `draft.error`). */
  | { kind: 'draft'; draft: MaskDraft };

/**
 * Reads the browser's text selection inside a document and works out the exact spot it covers: the segment
 * the selection starts in knows its offset in the paragraph. Clears the browser selection once it is read.
 */
export function readSelection(doc: SampleDocument, docEntities: Entity[]): SelectionResult {
  const sel = window.getSelection();
  const raw = sel?.toString() ?? '';
  const text = raw.replace(/\s+/g, ' ').trim();
  const range = sel && sel.rangeCount > 0 ? sel.getRangeAt(0) : null;
  if (!sel || !range || !text) return { kind: 'none' };

  let node: Node | null = range.startContainer;
  let offset = range.startOffset;
  if (node.nodeType !== Node.TEXT_NODE) {
    node = node.childNodes[offset] ?? null;
    offset = 0;
  }
  const startEl = (node instanceof Element ? node : node?.parentElement)?.closest<HTMLElement>('[data-start]') ?? null;
  const paraEl = startEl?.closest<HTMLElement>('[data-paragraph]') ?? null;
  if (!startEl || !paraEl || !paraEl.closest('[data-doc-body]')) return { kind: 'none' };
  sel.removeAllRanges();

  const paragraph = Number(paraEl.dataset.paragraph);
  const start = Number(startEl.dataset.start) + offset + (raw.length - raw.trimStart().length);
  const end = start + text.length;

  // Segments whose text the selection touches: another entity there means an overlap.
  const segments = segmentParagraph(doc.paragraphs[paragraph], docEntities, paragraph);
  const hits = segments.filter((s) => s.entity && start < s.start + s.text.length && end > s.start);
  const exact = hits.length === 1 && hits[0].start === start && hits[0].text.length === text.length ? hits[0].entity : undefined;
  if (exact) return { kind: 'entity', id: exact.id };

  let error: string | undefined;
  if (!doc.paragraphs[paragraph].startsWith(text, start)) error = 'Select plain text within one paragraph.';
  else if (hits.length > 0) error = 'This text overlaps an existing entity.';
  return { kind: 'draft', draft: { text, type: 'CUSTOM', method: null, paragraph, start, error } };
}

/** The draft as an entity pinned to its spot: the confirmed mask, or the pending preview (`fields` tells which). */
export function draftEntity(draft: MaskDraft, docId: string, entities: Entity[], fields: Pick<Entity, 'id' | 'state' | 'method'>): Entity {
  return {
    ...fields,
    docId,
    text: draft.text,
    type: draft.type,
    token: nextToken(draft.type, entities),
    confidence: null,
    position: { paragraph: draft.paragraph, start: draft.start },
  };
}
