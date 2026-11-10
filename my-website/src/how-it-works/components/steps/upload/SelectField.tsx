import { useId } from 'react';
import { cn } from '../../../lib/cn';
import { Dropdown } from '../../ui/Dropdown';
import { fieldLabel, muted } from '../../ui/styles';

interface Props<T extends string> {
  label: string;
  /** Optional, so compact copies of the panel (the landing page's miniature) can leave it out. */
  description?: string;
  value: T;
  options: { id: T; label: string }[];
  onChange: (value: T) => void;
}

/** A settings field with a dropdown for many options. */
export function SelectField<T extends string>({ label, description, value, options, onChange }: Props<T>) {
  const labelId = useId();
  return (
    <div className="flex flex-col gap-1">
      <span id={labelId} className={fieldLabel}>
        {label}
      </span>
      {description && <span className={cn(muted, 'mb-1')}>{description}</span>}
      <Dropdown value={value} onChange={onChange} options={options} labelledBy={labelId} />
    </div>
  );
}
