import { ArrowRight, CircleHelp, FolderInput, Plus, Settings2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DEFAULT_FILES, detectEntities, SAMPLE_DOCUMENTS } from '../../data/sampleDocuments';
import { useMockProcessing } from '../../hooks/useMockProcessing';
import { cn } from '../../lib/cn';
import { overallPercent, stagesFor } from '../../lib/processing';
import type { Entity } from '../../types';
import { AnonymizedDocument } from '../steps/conclusion/AnonymizedDocument';
import { ConclusionHeader } from '../steps/conclusion/ConclusionHeader';
import { DownloadOptions } from '../steps/conclusion/DownloadOptions';
import { FileList as ProcessingFileList } from '../steps/processing/FileList';
import { ProgressRing } from '../steps/processing/ProgressRing';
import { ReviewOptions } from '../steps/processing/ReviewOptions';
import { DocumentColumns } from '../steps/review/DocumentColumns';
import { ToolsSidebar } from '../steps/review/ToolsSidebar';
import { ChoiceField } from '../steps/upload/ChoiceField';
import { DropIcon } from '../steps/upload/DropIcon';
import { FileList } from '../steps/upload/FileList';
import { LANGUAGES, METHODS, MODES } from '../steps/upload/options';
import { SelectField } from '../steps/upload/SelectField';
import { Button, LinkButton } from '../ui/Button';
import { card, cardTitle, muted } from '../ui/styles';

// Miniatures of the wizard's own screens, built from the same sample data and class recipes.

const [DOC] = SAMPLE_DOCUMENTS;
/** The first two paragraphs are enough to show every kind of entity. */
const EXCERPT = { ...DOC, paragraphs: DOC.paragraphs.slice(0, 2) };
const ENTITIES = detectEntities('replacement', 'automatic');
// A mix of review states, as a reviewer would leave them.
const REVIEWED: Entity[] = ENTITIES.map((e) => (e.text === 'Northwind Analytics' ? { ...e, state: 'rejected' } : e));

const noop = () => {};

/** The miniature's drag loop: files hover over the drop area for `DRAG_MS`, then rest until the next round. */
const DRAG_MS = 1100;
const DRAG_EVERY_MS = 3500;

/** The upload screen, built from its own pieces: the fanning drop icon, the file list and the settings fields. */
export function UploadVisual({ active }: { active: boolean }) {
  const [dragOn, setDragOn] = useState(false);
  const dragging = active && dragOn;

  // While the phase is showing, files are dragged over the drop area every few seconds, so the fan is seen whenever
  // the reader gets here (Upload is the first phase, so it is already "active" while the hero is still on screen).
  useEffect(() => {
    if (!active) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const round = () => {
      setDragOn(true);
      timers.push(setTimeout(() => setDragOn(false), DRAG_MS));
    };
    timers.push(setTimeout(round, 400));
    const loop = setInterval(round, DRAG_EVERY_MS);
    return () => {
      clearInterval(loop);
      timers.forEach(clearTimeout);
      setDragOn(false);
    };
  }, [active]);

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_300px] items-stretch gap-3">
      <div className={cn(card, 'gap-3 p-4')}>
        <div
          className={cn(
            'flex flex-col items-center justify-center gap-1.5 rounded-2xl border-[1.5px] border-dashed border-line-strong bg-surface-2 px-4 py-4 text-center transition-colors duration-150',
            dragging && 'border-teal-500 bg-teal-50',
          )}
        >
          <DropIcon fanned={dragging} />
          <p className="text-lg font-semibold">Drag and drop your documents here</p>
          <p className={muted}>PDF, TXT or DOCX</p>
          <Button>
            <Plus size={15} /> Choose files
          </Button>
        </div>
        {/* The real list reserves room for three rows; the miniature only needs the two sample files. */}
        <FileList files={DEFAULT_FILES} onRemove={noop} className="min-h-0" />
      </div>

      <div className={cn(card, 'p-4')}>
        <div className="flex items-center gap-2">
          <h4 className={cn(cardTitle, 'flex min-w-0 flex-1 items-center gap-2 text-base')}>
            <Settings2 size={16} className="text-teal-600" /> Settings
          </h4>
          <CircleHelp size={16} className="text-muted" />
        </div>
        <div className="flex flex-col divide-y divide-line *:py-3 *:first:pt-0 *:last:pb-0">
          <ChoiceField label="Mode" value="automatic" options={MODES} onChange={noop} />
          <SelectField label="Protection method" value="replacement" options={METHODS} onChange={noop} />
          <SelectField label="Language" value="English" options={LANGUAGES} onChange={noop} />
        </div>
        <div className="mt-auto flex flex-col gap-3 border-t border-line pt-4">
          <Button variant="primary" block className="rounded-xl">
            <ArrowRight size={15} /> Start anonymization
          </Button>
          <LinkButton className="self-center">
            <FolderInput size={14} /> Continue from a saved workspace
          </LinkButton>
        </div>
      </div>
    </div>
  );
}

/** The processing screen: the progress ring and file rows, with the review choices unlocking once it's done. */
export function ProcessingVisual({ active }: { active: boolean }) {
  // A new key each time the phase comes into view restarts the mock run, so the ring fills up again.
  const [round, setRound] = useState(0);
  const [wasActive, setWasActive] = useState(active);
  if (active !== wasActive) {
    setWasActive(active);
    if (active) setRound((r) => r + 1);
  }
  return <ProcessingRun key={round} />;
}

function ProcessingRun() {
  const stages = stagesFor('automatic');
  const statusById = useMockProcessing(SAMPLE_DOCUMENTS, stages);
  const statuses = SAMPLE_DOCUMENTS.map((d) => statusById[d.id] ?? stages[0]);
  const readyCount = statuses.filter((s) => s === 'done').length;
  const done = readyCount === SAMPLE_DOCUMENTS.length;
  const overall = overallPercent(
    statuses,
    SAMPLE_DOCUMENTS.map((d) => d.sizeKb),
    stages,
  );

  return (
    <div className="flex flex-col gap-3">
      <section className={cn(card, 'flex-row items-center gap-6 p-4')}>
        <div className="shrink-0 px-2 [&>svg]:size-30">
          <ProgressRing target={overall} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2 border-l border-line pl-6">
          <div className="flex flex-col gap-1">
            <h4 className="text-2xl font-bold tracking-[-0.025em]">
              {done ? 'Your documents are processed.' : 'Processing your documents…'}
            </h4>
            <p className={muted}>
              {done
                ? `${ENTITIES.length} entities detected across ${SAMPLE_DOCUMENTS.length} documents.`
                : `${readyCount} of ${SAMPLE_DOCUMENTS.length} documents ready for review.`}
            </p>
          </div>
          <ProcessingFileList docs={SAMPLE_DOCUMENTS} statuses={statuses} stages={stages} entities={ENTITIES} manual={false} />
        </div>
      </section>
      <ReviewOptions manual={false} ready={done} onReview={noop} />
    </div>
  );
}

/** Entities the excerpt actually shows, for the toolbox's list. */
const EXCERPT_ENTITIES = REVIEWED.filter((e) => e.docId === DOC.id && EXCERPT.paragraphs.some((p) => p.includes(e.text)));

/** The review screen: Original and Protected side by side, with the Tools panel collapsed to its rail. */
export function ReviewVisual() {
  return (
    // The same grid as the review step: DocumentColumns and ToolsSidebar place themselves in its columns.
    <div className="grid grid-cols-[minmax(0,1fr)_48px] items-start gap-x-5 [&_aside]:static [&_aside]:max-h-none">
      <DocumentColumns
        doc={EXCERPT}
        entities={REVIEWED}
        selectedId={null}
        onSelect={noop}
        toolActive={false}
        defaultMethod="replacement"
        onTextSelect={noop}
      />
      <ToolsSidebar
        open={false}
        onToggle={noop}
        tool="select"
        onToolClick={noop}
        onSelectTool={noop}
        draft={null}
        onDraftChange={noop}
        pending={null}
        entities={EXCERPT_ENTITIES}
        selected={EXCERPT_ENTITIES[0] ?? null}
        selectedIndex={0}
        onSelectEntity={noop}
        onStep={noop}
        onApplyReplacement={noop}
        pendingCount={EXCERPT_ENTITIES.filter((e) => e.state === 'detected').length}
        onConfirmAll={noop}
      />
    </div>
  );
}

/** The download screen: the file switcher and anonymized document, beside the summary and download buttons. */
export function DownloadVisual() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_260px] items-start gap-3 [&_aside]:static [&_aside]:max-h-none">
      <div className="flex min-w-0 flex-col gap-3">
        <ConclusionHeader docs={SAMPLE_DOCUMENTS} activeDocId={DOC.id} onDocChange={noop} />
        <AnonymizedDocument doc={EXCERPT} entities={ENTITIES} method="replacement" />
      </div>
      <DownloadOptions
        mode="automatic"
        reviewMode="manual"
        method="replacement"
        docs={SAMPLE_DOCUMENTS}
        activeDoc={DOC}
        entities={ENTITIES}
        onExportWorkspace={noop}
      />
    </div>
  );
}
