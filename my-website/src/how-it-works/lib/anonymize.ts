import type { Entity, EntityState, ProtectionMethod, SampleDocument } from '../types';

export const METHOD_LABELS: Record<ProtectionMethod, string> = {
  replacement: 'Token replacement',
  suppression: 'Suppression',
  hashing: 'Hashing',
};

export function isMasked(state: EntityState): boolean {
  return state === 'detected' || state === 'confirmed' || state === 'manual';
}

/** Short deterministic hash (FNV-1a) — illustrative stand-in for a salted one-way hash. */
function shortHash(text: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}

export function replacementFor(entity: Entity): string {
  if (entity.customReplacement) return entity.customReplacement;
  switch (entity.method) {
    case 'replacement':
      return `[${entity.token}]`;
    case 'suppression':
      return '█████';
    case 'hashing':
      return `#${shortHash(entity.text)}`;
  }
}

export interface Segment {
  text: string;
  /** Character offset of the segment in its paragraph. */
  start: number;
  entity?: Entity;
}

/**
 * Splits a paragraph into plain text and entity segments. Masks made by hand carry a position and cover
 * only that spot; the rest apply to every occurrence of their text (longest match wins).
 */
export function segmentParagraph(paragraph: string, entities: Entity[], paragraphIndex: number): Segment[] {
  const ranges: { start: number; end: number; entity: Entity }[] = [];
  const overlaps = (start: number, end: number) => ranges.some((r) => start < r.end && end > r.start);

  for (const entity of entities) {
    const pos = entity.position;
    if (pos && pos.paragraph === paragraphIndex && paragraph.startsWith(entity.text, pos.start)) {
      ranges.push({ start: pos.start, end: pos.start + entity.text.length, entity });
    }
  }

  const byText = entities.filter((e) => !e.position).sort((a, b) => b.text.length - a.text.length);
  for (const entity of byText) {
    let from = 0;
    let idx: number;
    while ((idx = paragraph.indexOf(entity.text, from)) !== -1) {
      const end = idx + entity.text.length;
      if (!overlaps(idx, end)) ranges.push({ start: idx, end, entity });
      from = end;
    }
  }
  ranges.sort((a, b) => a.start - b.start);

  const segments: Segment[] = [];
  let cursor = 0;
  for (const r of ranges) {
    if (r.start > cursor) segments.push({ text: paragraph.slice(cursor, r.start), start: cursor });
    segments.push({ text: paragraph.slice(r.start, r.end), start: r.start, entity: r.entity });
    cursor = r.end;
  }
  if (cursor < paragraph.length) segments.push({ text: paragraph.slice(cursor), start: cursor });
  return segments;
}

export function anonymizedText(doc: SampleDocument, entities: Entity[]): string {
  const docEntities = entities.filter((e) => e.docId === doc.id);
  const body = doc.paragraphs.map((p, i) =>
    segmentParagraph(p, docEntities, i)
      .map((s) => (s.entity && isMasked(s.entity.state) ? replacementFor(s.entity) : s.text))
      .join(''),
  );
  return [doc.title, doc.meta, '', ...body.flatMap((p) => [p, ''])].join('\n');
}

export function averageConfidence(entities: Entity[]): number {
  const scored = entities.filter((e) => e.confidence !== null);
  if (scored.length === 0) return 0;
  return scored.reduce((sum, e) => sum + (e.confidence ?? 0), 0) / scored.length;
}

/** "Client-intake.pdf" -> "Client-intake_anonymized.pdf" */
export function anonymizedName(name: string): string {
  const dot = name.lastIndexOf('.');
  return dot === -1 ? `${name}_anonymized` : `${name.slice(0, dot)}_anonymized${name.slice(dot)}`;
}
