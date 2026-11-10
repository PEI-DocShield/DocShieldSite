import { Download, FolderDown, Info } from 'lucide-react';
import { useId, useState } from 'react';
import { TYPE_PLURALS } from '../../../data/sampleDocuments';
import { anonymizedName, anonymizedText, averageConfidence, isMasked, METHOD_LABELS } from '../../../lib/anonymize';
import { cn } from '../../../lib/cn';
import { downloadFile } from '../../../lib/download';
import type { AnonymizationMode, Entity, EntityType, ProtectionMethod, ReviewMode, SampleDocument } from '../../../types';
import { Button } from '../../ui/Button';
import { Disclosure } from '../../ui/Disclosure';
import { card, muted, sidebar } from '../../ui/styles';

const TYPE_ORDER: EntityType[] = ['PERSON', 'EMAIL', 'PHONE', 'ADDRESS', 'DATE', 'ORG', 'CUSTOM'];

// The prototype exports plain-text renditions; real PDF/DOCX rendering is a backend concern.
function downloadDocument(doc: SampleDocument, entities: Entity[]) {
  downloadFile(`${anonymizedName(doc.name)}.txt`, anonymizedText(doc, entities));
}

interface Props {
  mode: AnonymizationMode;
  reviewMode: ReviewMode;
  method: ProtectionMethod;
  docs: SampleDocument[];
  /** The file chosen in the header, for "Download selected". */
  activeDoc: SampleDocument;
  entities: Entity[];
  onExportWorkspace: () => void;
}

/** The summary side panel: what was protected, the download buttons and the details of the run. */
export function DownloadOptions({ mode, reviewMode, method, docs, activeDoc, entities, onExportWorkspace }: Props) {
  const protectedEntities = entities.filter((e) => isMasked(e.state));
  const rows = TYPE_ORDER.map((t) => ({ type: t, count: protectedEntities.filter((e) => e.type === t).length })).filter((r) => r.count > 0);
  const max = Math.max(1, ...rows.map((r) => r.count));
  const reviewLabel = mode === 'manual' ? 'Manual editing' : reviewMode === 'automatic' ? 'Automatic review' : 'Manual review';
  const fileCount = docs.length;
  const [announcement, setAnnouncement] = useState('');
  const selectedHintId = useId();

  return (
    <aside className={cn(card, sidebar, 'max-md:static max-md:max-h-none')}>
      <div>
        <div className="text-5xl leading-[1.2] font-medium text-teal-600">{protectedEntities.length}</div>
        <div className={muted}>
          entities protected in {fileCount} {fileCount === 1 ? 'file' : 'files'} · {METHOD_LABELS[method]}
        </div>
      </div>

      {/* A download gives no sign on the page, so say it out loud for screen readers. */}
      <p className="sr-only" role="status">
        {announcement}
      </p>
      <Button
        variant="primary"
        block
        className="rounded-xl"
        onClick={() => {
          docs.forEach((d) => downloadDocument(d, entities));
          setAnnouncement(`${fileCount} ${fileCount === 1 ? 'file' : 'files'} downloaded`);
        }}
      >
        <Download size={15} /> Download all ({fileCount})
      </Button>
      <Button
        block
        className="rounded-xl"
        title={`Download ${anonymizedName(activeDoc.name)}`}
        aria-describedby={selectedHintId}
        onClick={() => {
          downloadDocument(activeDoc, entities);
          setAnnouncement(`${anonymizedName(activeDoc.name)} downloaded`);
        }}
      >
        <Download size={15} /> Download selected
      </Button>
      {/* The name of the file the button will download, for users who never see the tooltip. */}
      <span id={selectedHintId} className="sr-only">
        {anonymizedName(activeDoc.name)}
      </span>
      <Button
        block
        className="rounded-xl"
        onClick={() => {
          onExportWorkspace();
          setAnnouncement('Workspace saved');
        }}
      >
        <FolderDown size={15} /> Save workspace
      </Button>
      <p className={muted}>Nothing is kept after you close this page. Save the workspace to continue later.</p>

      <Disclosure
        className="border-t border-line pt-3.5"
        summary={
          <>
            <Info size={14} /> Details
          </>
        }
      >
        <ul className="mb-2.5">
          {rows.map((r) => (
            <li key={r.type} className="grid grid-cols-[110px_1fr_24px] items-center gap-3 py-[5px]">
              <span className={muted}>{TYPE_PLURALS[r.type]}</span>
              <span className="h-1 overflow-hidden rounded-full bg-surface-2">
                <span
                  className="block h-full rounded-[inherit] bg-teal-600 transition-[width] duration-400"
                  style={{ width: `${(r.count / max) * 100}%` }}
                />
              </span>
              <span className="text-right text-sm font-semibold">{r.count}</span>
            </li>
          ))}
        </ul>
        <p className={muted}>
          {reviewLabel} · {averageConfidence(protectedEntities).toFixed(1)}% average detection confidence. Confidence is not a guarantee of
          privacy.
        </p>
      </Disclosure>
    </aside>
  );
}
