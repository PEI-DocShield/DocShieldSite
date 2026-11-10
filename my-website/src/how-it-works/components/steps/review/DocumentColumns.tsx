import { ChevronLeft, PanelLeftOpen } from 'lucide-react';
import { useState } from 'react';
import { METHOD_LABELS } from '../../../lib/anonymize';
import { cn } from '../../../lib/cn';
import type { Entity, ProtectionMethod, SampleDocument } from '../../../types';
import { DocumentPreview } from '../../document/DocumentPreview';
import { SidebarRail } from '../../ui/CollapsibleSidebar';
import { eyebrow } from '../../ui/styles';
import { edgeHandle, PENDING_ID } from './review';

interface Props {
  doc: SampleDocument;
  /** Includes the pending draft preview, if any. */
  entities: Entity[];
  selectedId: string | null;
  onSelect: (entity: Entity) => void;
  toolActive: boolean;
  defaultMethod: ProtectionMethod;
  /** Fires after a drag over either document, to turn the text selection into a mask draft. */
  onTextSelect: () => void;
}

/* Original and Protected side by side. Returned as an item of the parent grid (in its first column)
   so the toolbox rail can span exactly the documents' row. The colour legend lives in ColoursHelp. */
export function DocumentColumns({ doc, entities, selectedId, onSelect, toolActive, defaultMethod, onTextSelect }: Props) {
  const [originalOpen, setOriginalOpen] = useState(true);
  // After the user toggles the original, focus follows to the control that replaces the one they used.
  const [fromToggle, setFromToggle] = useState(false);
  const toggleOriginal = (open: boolean) => {
    setFromToggle(true);
    setOriginalOpen(open);
  };
  const preview = { doc, entities, pendingId: PENDING_ID, selectedId, onSelect, toolActive };

  return (
    <>
      {/* Original and Protected share the width equally and match heights. With the original hidden it
          shrinks to a rail; only the fr value changes (1fr → 0fr, floored at 48px) so the columns animate. */}
      <div
        className={cn(
          'col-[1] row-[1] grid items-stretch gap-4 transition-[grid-template-columns] duration-200 max-sm:grid-cols-1',
          originalOpen ? 'grid-cols-[minmax(48px,1fr)_minmax(0,1fr)]' : 'grid-cols-[minmax(48px,0fr)_minmax(0,1fr)]',
        )}
      >
        {originalOpen ? (
          <div className="relative flex min-w-0 flex-col gap-2" onMouseUp={onTextSelect}>
            <span className={eyebrow}>Original</span>
            <button
              // Straddles the original's right edge, centred on its document card; lies flat in the label row once stacked.
              className={cn(
                edgeHandle,
                'absolute top-[calc(50%_+_12px)] -right-[7px] -translate-y-1/2 max-sm:-top-1 max-sm:right-1 max-sm:h-8 max-sm:w-16 max-sm:translate-y-0 max-sm:[&_svg]:rotate-90',
              )}
              onClick={() => toggleOriginal(false)}
              autoFocus={fromToggle}
              aria-label="Hide original"
              title="Hide original"
            >
              <ChevronLeft size={12} />
            </button>
            <DocumentPreview {...preview} showOriginal footer="Original text" />
          </div>
        ) : (
          // The rail runs the full height of the protected document card beside it.
          <SidebarRail
            label="Original"
            icon={PanelLeftOpen}
            onOpen={() => toggleOriginal(true)}
            autoFocus={fromToggle}
            stackBelow="sm"
            className="static mt-6 max-h-none self-stretch max-sm:mt-0"
            railClassName="flex-1 justify-start"
          />
        )}
        <div className="relative flex min-w-0 flex-col gap-2" onMouseUp={onTextSelect}>
          <span className={cn(eyebrow, 'text-teal-600')}>Protected</span>
          <DocumentPreview {...preview} footer={METHOD_LABELS[defaultMethod]} />
        </div>
      </div>
    </>
  );
}
