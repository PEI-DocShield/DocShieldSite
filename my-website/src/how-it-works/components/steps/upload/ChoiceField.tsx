import { cn } from '../../../lib/cn';
import { fieldLabel, muted } from '../../ui/styles';

interface Props<T extends string> {
  label: string;
  /** Optional, so compact copies of the panel (the landing page's miniature) can leave it out. */
  description?: string;
  value: T;
  options: { id: T; label: string }[];
  onChange: (value: T) => void;
}

/** A settings field with few options, all visible at once: a select would only hide them. */
export function ChoiceField<T extends string>({ label, description, value, options, onChange }: Props<T>) {
  return (
    <div className="flex flex-col gap-1" role="radiogroup" aria-label={label}>
      <span className={fieldLabel}>{label}</span>
      {description && <span className={cn(muted, 'mb-1')}>{description}</span>}
      <div
        className="grid auto-cols-fr grid-flow-col gap-2"
        onKeyDown={(e) => {
          // Radio pattern: arrows move the choice (wrapping), and focus follows it.
          const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
          if (!step) return;
          e.preventDefault();
          const next = (options.findIndex((o) => o.id === value) + step + options.length) % options.length;
          onChange(options[next].id);
          e.currentTarget.querySelectorAll<HTMLElement>('[role="radio"]')[next]?.focus();
        }}
      >
        {options.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={id === value}
            tabIndex={id === value ? 0 : -1}
            className={cn(
              'flex min-w-0 items-center justify-center rounded-xl border border-line bg-surface px-1.5 py-2.5 text-sm font-semibold text-muted',
              id === value ? 'border-teal-500 bg-teal-50 text-teal-600' : 'hover:border-line-strong hover:text-fg',
            )}
            onClick={() => onChange(id)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
