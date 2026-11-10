import { Check, ChevronDown } from 'lucide-react';
import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/cn';

interface Props<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: { id: T; label: string }[];
  /** Accessible name; a visible label elsewhere can be tied in with `labelledBy` instead. */
  label?: string;
  labelledBy?: string;
  /**
   * Lets the list grow wider than the field so option text stays on one line, growing from the given edge
   * (`left` for a field at the start of a row, `right` for one at the end). By default it matches the field.
   */
  wideFrom?: 'left' | 'right';
  /** `plain` drops the field's border and background (a quiet switcher in a header); the default is a bordered field. */
  variant?: 'field' | 'plain';
}

/**
 * A select whose list floats below the field, with roomy options and a grey hover, in place of the native popup.
 * The list is drawn on top of the page (not inside the field's container), so it is never clipped or scrolled
 * by a panel the field sits in; it opens upward when there is no room below.
 */
export function Dropdown<T extends string>({ value, onChange, options, label, labelledBy, wideFrom, variant = 'field' }: Props<T>) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const listId = useId();
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const selected = options.findIndex((o) => o.id === value);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (!root.current?.contains(target) && !list.current?.contains(target)) setOpen(false);
    };
    window.addEventListener('pointerdown', onPointerDown);
    return () => window.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  // Position the list against the field, and keep it there while the page scrolls or resizes.
  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const field = button.current?.getBoundingClientRect();
      const ul = list.current;
      if (!field || !ul) return;
      const room = window.innerHeight - field.bottom - 8;
      const flip = ul.offsetHeight > room && field.top > room;
      ul.style.top = `${flip ? Math.max(8, field.top - 8 - ul.offsetHeight) : field.bottom + 8}px`;
      ul.style.minWidth = `${field.width}px`;
      ul.style.width = wideFrom ? 'max-content' : `${field.width}px`;
      ul.style.left = wideFrom === 'right' ? 'auto' : `${field.left}px`;
      ul.style.right = wideFrom === 'right' ? `${window.innerWidth - field.right}px` : 'auto';
    };
    place();
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);
    return () => {
      window.removeEventListener('scroll', place, true);
      window.removeEventListener('resize', place);
    };
  }, [open, wideFrom]);

  const show = () => {
    setActive(Math.max(selected, 0));
    setOpen(true);
  };

  const choose = (index: number) => {
    onChange(options[index].id);
    setOpen(false);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false);
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!open) return show();
      setActive((a) => (a + (e.key === 'ArrowDown' ? 1 : options.length - 1)) % options.length);
    } else if (open && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      choose(active);
    }
  };

  return (
    <div ref={root} className="relative" onKeyDown={onKeyDown}>
      <button
        ref={button}
        type="button"
        className={cn(
          'flex h-10 w-full cursor-pointer items-center rounded-xl pr-9 text-left',
          variant === 'plain' ? 'bg-transparent pl-2 hover:bg-surface-hover' : 'border border-line-strong bg-surface pl-3',
        )}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        aria-label={label}
        aria-labelledby={labelledBy}
        onClick={() => (open ? setOpen(false) : show())}
      >
        <span className="min-w-0 truncate">{options[selected]?.label}</span>
      </button>
      <ChevronDown
        size={16}
        className={cn(
          'pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted transition-transform duration-150',
          open && 'rotate-180',
        )}
      />
      {open &&
        createPortal(
          <ul
            ref={list}
            id={listId}
            className="fixed z-[60] flex max-h-[calc(100vh-16px)] flex-col gap-1 overflow-y-auto rounded-2xl border border-line bg-surface p-2 shadow-card"
            role="listbox"
            aria-labelledby={labelledBy}
            aria-label={label}
          >
            {options.map((o, i) => (
              <li
                key={o.id}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === selected}
                className={cn(
                  'flex cursor-pointer items-center justify-between gap-2 rounded-xl px-3 py-2.5',
                  wideFrom && 'whitespace-nowrap',
                  i === active && 'bg-surface-hover',
                )}
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(i)}
              >
                {o.label}
                {i === selected && <Check size={15} className="flex-none text-muted" />}
              </li>
            ))}
          </ul>,
          document.body,
        )}
    </div>
  );
}
