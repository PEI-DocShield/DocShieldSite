import type { Entity, FileStatus, ProcessingStage, SampleDocument } from '../../../types';
import { Pill } from '../../ui/Pill';
import { FileRow } from './FileRow';

/** The list reserves room for at least this many rows, so the box height doesn't depend on the file count. */
const MIN_ROWS = 3;

interface Props {
  docs: SampleDocument[];
  statuses: FileStatus[];
  stages: ProcessingStage[];
  entities: Entity[];
  manual: boolean;
}

export function FileList({ docs, statuses, stages, entities, manual }: Props) {
  return (
    <ul>
      {docs.map((doc, i) => (
        <FileRow
          key={doc.id}
          doc={doc}
          status={statuses[i]}
          stages={stages}
          entityCount={manual ? null : entities.filter((e) => e.docId === doc.id).length}
        />
      ))}
      {/* Invisible filler rows keep the box as tall as if MIN_ROWS documents were listed. */}
      {Array.from({ length: Math.max(0, MIN_ROWS - docs.length) }, (_, i) => (
        <li key={`filler-${i}`} aria-hidden className="invisible flex h-11 items-center gap-3">
          <Pill tone="neutral">&nbsp;</Pill>
        </li>
      ))}
    </ul>
  );
}
