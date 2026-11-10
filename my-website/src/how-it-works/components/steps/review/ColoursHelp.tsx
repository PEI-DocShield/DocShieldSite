import type { EntityState } from '../../../types';
import { Modal } from '../../ui/Modal';
import { Pill } from '../../ui/Pill';
import { muted } from '../../ui/styles';

const LEGEND: { state: EntityState; label: string; hint: string }[] = [
  { state: 'detected', label: 'Detected', hint: 'Auto-found, not reviewed yet. The replacement is shown.' },
  { state: 'confirmed', label: 'Confirmed', hint: 'You agreed with the detection. The replacement is shown.' },
  { state: 'manual', label: 'Manual', hint: 'A mask you added by hand. The replacement is shown.' },
  { state: 'rejected', label: 'Rejected', hint: 'A false positive. The original text is shown.' },
  { state: 'reverted', label: 'Reverted', hint: 'Deliberately revealed. The original text is shown.' },
];

/** Explains the entity colours used in the Original and Protected documents. */
export function ColoursHelp({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="What do the colours mean?" onClose={onClose}>
      <ul className="flex flex-col gap-2.5">
        {LEGEND.map((l) => (
          <li key={l.state} className="flex items-center gap-3">
            <Pill tone={l.state} className="w-24 shrink-0 justify-center">
              {l.label}
            </Pill>
            <span className={muted}>{l.hint}</span>
          </li>
        ))}
      </ul>
    </Modal>
  );
}
