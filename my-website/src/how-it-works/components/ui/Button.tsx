import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline';
  pill?: boolean;
  block?: boolean;
}

const VARIANTS = {
  primary: 'bg-primary text-white shadow-glow enabled:hover:-translate-y-px enabled:hover:bg-primary-hover',
  outline: 'border-line-strong bg-surface text-teal-700 enabled:hover:border-teal-500 enabled:hover:bg-teal-50',
};

export function Button({ variant = 'outline', pill, block, className, ...props }: Props) {
  return (
    <button
      className={cn(
        'inline-flex h-[38px] items-center justify-center gap-2 rounded-lg border border-transparent px-4 text-md font-semibold whitespace-nowrap transition duration-200 disabled:opacity-45',
        VARIANTS[variant],
        pill && 'rounded-full px-5',
        block && 'h-[42px] w-full',
        className,
      )}
      {...props}
    />
  );
}

export function IconButton({ accent, className, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { accent?: boolean }) {
  return (
    <button
      className={cn(
        // 44px on touch screens, where small targets are hard to hit with a screen reader's gestures.
        'grid size-[30px] place-items-center rounded-lg text-muted enabled:hover:bg-surface-hover enabled:hover:text-fg disabled:opacity-40 max-sm:size-11',
        accent && 'text-teal-600 enabled:hover:text-teal-600',
        className,
      )}
      {...props}
    />
  );
}

export function LinkButton({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn('inline-flex items-center gap-1 self-start text-md font-semibold text-teal-600 hover:underline', className)}
      {...props}
    />
  );
}
