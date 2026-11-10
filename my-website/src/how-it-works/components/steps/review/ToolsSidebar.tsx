import { ChevronRight, CircleHelp } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../../lib/cn';
import type { Entity } from '../../../types';
import { IconButton } from '../../ui/Button';
import { CollapsibleSidebar } from '../../ui/CollapsibleSidebar';
import { cardTitle } from '../../ui/styles';
import { ColoursHelp } from './ColoursHelp';
import { EntityList } from './EntityList';
import { edgeHandle, type MaskDraft, type Tool } from './review';
import { SelectedEntityPanel } from './SelectedEntityPanel';
import { ToolsPanel } from './ToolsPanel';

interface Props {
  open: boolean;
  onToggle: () => void;
  tool: Tool;
  onToolClick: (id: Tool) => void;
  onSelectTool: () => void;
  draft: MaskDraft | null;
  onDraftChange: (draft: MaskDraft) => void;
  /** The draft as an entity, once it is valid. */
  pending: Entity | null;
  /** The current document's entities. */
  entities: Entity[];
  selected: Entity | null;
  selectedIndex: number;
  onSelectEntity: (entity: Entity) => void;
  onStep: (delta: -1 | 1) => void;
  onApplyReplacement: (value: string) => void;
  pendingCount: number;
  /** Omitted when there is nothing to review (manual mode). */
  onConfirmAll?: () => void;
}

/**
 * The Tools panel as items of the review grid: a hide handle on its edge and the sticky panel itself (a rail
 * when collapsed). The colour legend opens from its header.
 */
export function ToolsSidebar(props: Props) {
  const { open, onToggle: toggleOpen, entities, selected } = props;
  const [fromToggle, setFromToggle] = useState(false);
  const onToggle = () => {
    setFromToggle(true);
    toggleOpen();
  };
  const [coloursHelpOpen, setColoursHelpOpen] = useState(false);

  return (
    <>
      {open && (
        <button
          // Straddles the toolbox's left edge, centred on the documents row. Single column has no gap to
          // sit in, so there the toolbox closes from its header button instead.
          className={cn(edgeHandle, 'col-start-2 row-start-1 mt-6 -ml-[7px] self-center justify-self-start max-lg:hidden')}
          onClick={onToggle}
          autoFocus={fromToggle}
          aria-label="Hide Tools"
          title="Hide Tools"
        >
          <ChevronRight size={12} />
        </button>
      )}
      <CollapsibleSidebar
        label="Tools"
        stackBelow="lg"
        edgeHandle
        // Pushed down past the column labels so it lines up with the document cards.
        className="col-start-2 row-[1] mt-6 max-lg:col-auto max-lg:row-auto max-lg:mt-0"
        collapsedClassName="static max-h-none self-stretch"
        railClassName="h-full justify-start"
        open={open}
        onToggle={onToggle}
        heading={
          <>
            <h2 className={cn(cardTitle, 'min-w-0 flex-1')}>Tools</h2>
            <IconButton onClick={() => setColoursHelpOpen(true)} aria-label="What do the colours mean?" title="What do the colours mean?">
              <CircleHelp size={16} />
            </IconButton>
          </>
        }
      >
        <ToolsPanel
          tool={props.tool}
          draft={props.draft}
          onToolClick={props.onToolClick}
          onSelectTool={props.onSelectTool}
          pendingCount={props.pendingCount}
          onConfirmAll={props.onConfirmAll}
        />
        <SelectedEntityPanel
          draft={props.draft}
          pending={props.pending}
          onDraftChange={props.onDraftChange}
          selected={selected}
          position={{ index: props.selectedIndex, total: entities.length }}
          onStep={props.onStep}
          onApplyReplacement={props.onApplyReplacement}
        />
        <EntityList entities={entities} selectedId={selected?.id ?? null} onSelect={props.onSelectEntity} />
      </CollapsibleSidebar>
      {coloursHelpOpen && <ColoursHelp onClose={() => setColoursHelpOpen(false)} />}
    </>
  );
}
