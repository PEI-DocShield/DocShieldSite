import { X } from 'lucide-react';
import { useEffect, useRef, type KeyboardEvent, type ReactNode } from 'react';
import { useKeydown } from '../../hooks/useKeydown';
import { cn } from '../../lib/cn';
import { IconButton } from './Button';
import { card } from './styles';

interface Props {
  title: string;
  /** Keeps the title as the dialog's accessible name only, for content that carries its own headings. */
  hideTitle?: boolean;
  /** Room for content laid out in columns; the dialog scrolls if the screen is too short for it. */
  wide?: boolean;
  onClose: () => void;
  children: ReactNode;
}

const FOCUSABLE =
  'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';

export function Modal({ title, hideTitle, wide, onClose, children }: Props) {
  useKeydown((e) => e.key === 'Escape' && onClose());
  const dialog = useRef<HTMLDivElement>(null);

  // Move focus into the dialog on open, and hand it back to whatever opened it on close.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    dialog.current?.focus();
    return () => opener?.focus();
  }, []);

  // Keep Tab inside the dialog: wrap from the last control to the first and back.
  const trapTab = (e: KeyboardEvent) => {
    if (e.key !== 'Tab' || !dialog.current) return;
    const items = Array.from(dialog.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);
    if (items.length === 0) return e.preventDefault();
    const first = items[0];
    const last = items[items.length - 1];
    const current = document.activeElement;
    if (e.shiftKey && (current === first || current === dialog.current)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && current === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-backdrop p-4 backdrop-blur-xs" onClick={onClose}>
      <div
        ref={dialog}
        tabIndex={-1}
        onKeyDown={trapTab}
        className={cn(card, 'relative w-[min(440px,100%)] gap-3.5 outline-none', wide && 'max-h-full w-[min(960px,100%)] overflow-y-auto')}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Without a title the close button floats in the corner, so the content starts at the top. */}
        <div className={cn('flex items-center justify-between', hideTitle && 'absolute top-3.5 right-3.5')}>
          {!hideTitle && <h3 className="text-lg font-bold">{title}</h3>}
          <IconButton onClick={onClose} aria-label="Close">
            <X size={16} />
          </IconButton>
        </div>
        {children}
      </div>
    </div>
  );
}
