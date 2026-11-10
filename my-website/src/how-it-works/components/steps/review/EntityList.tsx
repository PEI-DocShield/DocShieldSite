import { List, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { TYPE_LABELS } from '../../../data/sampleDocuments';
import { isMasked, replacementFor } from '../../../lib/anonymize';
import { cn } from '../../../lib/cn';
import type { Entity, EntityState, EntityType } from '../../../types';
import { Disclosure } from '../../ui/Disclosure';
import { Dropdown } from '../../ui/Dropdown';
import { Pill } from '../../ui/Pill';

import { muted } from '../../ui/styles';
import { STATE_LABELS } from './review';

interface Props {
  /** Entities of the current document. */
  entities: Entity[];
  selectedId: string | null;
  onSelect: (entity: Entity) => void;
}

/** Collapsible, filterable list of the document's entities. */
export function EntityList({ entities, selectedId, onSelect }: Props) {
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [stateFilter, setStateFilter] = useState<string>('all');

  const visible = entities.filter(
    (e) => (typeFilter === 'all' || e.type === typeFilter) && (stateFilter === 'all' || e.state === stateFilter),
  );
  const typeCounts = new Map<EntityType, number>();
  entities.forEach((e) => typeCounts.set(e.type, (typeCounts.get(e.type) ?? 0) + 1));
  const typeOptions = [
    { id: 'all', label: 'All types' },
    ...[...typeCounts].map(([t, n]) => ({ id: t as string, label: `${TYPE_LABELS[t]} (${n})` })),
  ];
  const stateOptions = [
    { id: 'all', label: 'All states' },
    ...(Object.keys(STATE_LABELS) as EntityState[]).map((s) => ({
      id: s as string,
      label: `${STATE_LABELS[s]} (${entities.filter((e) => e.state === s).length})`,
    })),
  ];
  const activeFilters = (typeFilter !== 'all' ? 1 : 0) + (stateFilter !== 'all' ? 1 : 0);

  return (
    <Disclosure
      className="border-t border-line pt-3.5"
      summaryClassName="text-fg"
      summary={
        <>
          <List size={14} /> Entities <span className="text-muted">({entities.length})</span>
        </>
      }
    >
      <Disclosure
        chevron={false}
        className="mb-2.5"
        summaryClassName="text-fg"
        summary={
          <span
            className={cn(
              'inline-flex h-7 items-center gap-1.5 rounded-full border border-line-strong px-2.5 text-xs text-muted',
              '[[open]>summary>&]:border-teal-500 [[open]>summary>&]:bg-teal-50 [[open]>summary>&]:text-teal-600',
              activeFilters > 0 && 'border-teal-500 bg-teal-50 text-teal-600',
            )}
          >
            <SlidersHorizontal size={14} /> Filter{activeFilters ? ` (${activeFilters})` : ''}
          </span>
        }
      >
        <div className="grid grid-cols-2 gap-3.5 max-sm:grid-cols-1">
          <Dropdown wideFrom="left" label="Filter by type" value={typeFilter} onChange={setTypeFilter} options={typeOptions} />
          <Dropdown wideFrom="right" label="Filter by state" value={stateFilter} onChange={setStateFilter} options={stateOptions} />
        </div>
      </Disclosure>

      <ul className="max-h-[290px] scrollbar-thin overflow-y-auto rounded-xl border border-line">
        {visible.map((e, i) => (
          <li key={e.id}>
            <button
              className={cn(
                'grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-2.5 border-b border-line bg-surface px-3 py-[7px] text-left max-sm:py-3',
                e.id === selectedId ? 'bg-teal-50' : 'hover:bg-surface-hover',
                i === visible.length - 1 && 'border-b-0',
              )}
              onClick={() => onSelect(e)}
            >
              <span className={cn('truncate text-sm font-semibold text-teal-600', !isMasked(e.state) && 'font-medium text-fg')}>
                {isMasked(e.state) ? replacementFor(e) : e.text}
              </span>
              <Pill tone={e.state} className="justify-self-end">
                {STATE_LABELS[e.state]}
              </Pill>
            </button>
          </li>
        ))}
        {visible.length === 0 && (
          <li className={cn(muted, 'px-3 py-4')}>
            {entities.length === 0
              ? 'No entities in this file yet. Select text in the document to add a mask.'
              : 'No entities match these filters.'}
          </li>
        )}
      </ul>
    </Disclosure>
  );
}
