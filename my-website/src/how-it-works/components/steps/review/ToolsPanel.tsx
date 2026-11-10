import { Check, CheckCheck, Eraser, Hash, MousePointer2, Tag, X, type LucideIcon } from 'lucide-react';
import { cn } from '../../../lib/cn';
import { eyebrow } from '../../ui/styles';
import type { MaskDraft, Tool } from './review';

const TOOL_GROUPS: { label: string; tools: { id: Tool; label: string; icon: LucideIcon }[] }[] = [
  {
    label: 'Protect with',
    tools: [
      { id: 'replacement', label: 'Token', icon: Tag },
      { id: 'suppression', label: 'Suppress', icon: Eraser },
      { id: 'hashing', label: 'Hash', icon: Hash },
    ],
  },
  {
    label: 'Review',
    tools: [
      { id: 'confirm', label: 'Confirm', icon: Check },
      { id: 'reject', label: 'Reject', icon: X },
    ],
  },
];

function toolClass(active: boolean) {
  return cn(
    'flex flex-col items-center gap-1.5 rounded-xl border border-line bg-surface px-1.5 py-2.5 text-xs font-semibold text-muted',
    active ? 'border-teal-500 bg-teal-50 text-teal-600' : 'hover:border-line-strong hover:text-fg',
  );
}

interface Props {
  tool: Tool;
  /** While a draft is open the palette edits it (technique, Confirm/Reject) instead of arming a tool. */
  draft: MaskDraft | null;
  onSelectTool: () => void;
  onToolClick: (id: Tool) => void;
  /** Detections in the current file nobody has confirmed or rejected yet. */
  pendingCount: number;
  /** Confirms every pending detection in one go. Omitted when there is nothing to review (manual mode). */
  onConfirmAll?: () => void;
}

/** Tool palette: pick a tool, then click entities to apply it. */
export function ToolsPanel({ tool, draft, onSelectTool, onToolClick, pendingCount, onConfirmAll }: Props) {
  const isActive = (id: Tool) => (draft ? draft.method === id : tool === id);
  const isDisabled = (id: Tool) => !!draft && ((id !== 'reject' && !!draft.error) || (id === 'confirm' && !draft.method));

  return (
    <>
      <button
        className={cn(toolClass(tool === 'select'), 'flex-row justify-center p-2')}
        aria-pressed={tool === 'select'}
        onClick={onSelectTool}
      >
        <MousePointer2 size={15} /> Select
      </button>
      {TOOL_GROUPS.map((g) => (
        <div key={g.label} className="flex flex-col gap-2">
          <span className={eyebrow}>{g.label}</span>
          {/* Up to three per row; a shorter row (e.g. Confirm/Reject) stretches to the full width. */}
          <div className="flex flex-wrap gap-2">
            {g.tools.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                className={cn(toolClass(isActive(id)), 'min-w-0 flex-[1_1_calc((100%_-_16px)/3)]')}
                aria-pressed={isActive(id)}
                disabled={isDisabled(id)}
                onClick={() => onToolClick(id)}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
            {g.label === 'Review' && onConfirmAll && (
              <button
                className={cn(toolClass(false), 'min-w-0 flex-[1_1_calc((100%_-_16px)/3)] disabled:opacity-45')}
                disabled={!!draft || pendingCount === 0}
                onClick={onConfirmAll}
                aria-label={`Confirm all${pendingCount > 0 ? ` (${pendingCount} pending)` : ''}`}
                title={pendingCount > 0 ? `Confirm the ${pendingCount} pending detections in this file` : 'Nothing left to confirm'}
              >
                <CheckCheck size={16} />
                Confirm all
              </button>
            )}
          </div>
        </div>
      ))}
    </>
  );
}
