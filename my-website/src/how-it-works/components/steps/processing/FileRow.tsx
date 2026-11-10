import { FileText, Loader } from 'lucide-react';
import { cn } from '../../../lib/cn';
import { STAGE_LABELS } from '../../../lib/processing';
import type { FileStatus, ProcessingStage, SampleDocument } from '../../../types';
import { Pill } from '../../ui/Pill';
import { muted } from '../../ui/styles';

interface Props {
  doc: SampleDocument;
  status: FileStatus;
  stages: ProcessingStage[];
  /** Entities found in this file; `null` in manual mode, where nothing is detected. */
  entityCount: number | null;
}

/** One file: dimmed with its current step while processing, full opacity with "Ready for review" once done. */
export function FileRow({ doc, status, stages, entityCount }: Props) {
  return (
    <li className={cn('flex h-11 items-center gap-3 transition-opacity duration-700', status === 'done' ? 'opacity-100' : 'opacity-55')}>
      <FileText size={17} className="text-teal-600" />
      <span className="min-w-0 flex-1 truncate text-md font-semibold">{doc.name}</span>
      {status === 'done' ? (
        <>
          {entityCount !== null && <span className={muted}>{entityCount} entities</span>}
          <Pill tone="confirmed">Ready for review</Pill>
        </>
      ) : (
        <span className="flex items-center gap-2 text-md text-teal-600" role="status">
          <Loader size={15} className="animate-spin" />
          {/* All labels share one grid cell, so the widest one sets the width and the text never shifts. */}
          <span className="grid">
            {stages.map((s) => (
              <span key={s} className={cn('col-start-1 row-start-1 whitespace-nowrap', s !== status && 'invisible')}>
                {stages.length > 1 && `Step ${stages.indexOf(s) + 1}/${stages.length} · `}
                {STAGE_LABELS[s]}
              </span>
            ))}
          </span>
        </span>
      )}
    </li>
  );
}
