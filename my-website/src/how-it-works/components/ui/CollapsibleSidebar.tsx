import { PanelRightClose, PanelRightOpen, type LucideIcon } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { IconButton } from './Button';
import { card, sidebar } from './styles';

/** Breakpoint below which the surrounding layout stacks into one column. */
export type StackBelow = 'sm' | 'md' | 'lg';

// Written out in full so Tailwind can find every class at build time.
const STACKED: Record<StackBelow, { aside: string; rail: string; label: string }> = {
  sm: {
    aside: 'max-sm:static max-sm:max-h-none',
    rail: 'max-sm:flex-row max-sm:justify-center',
    label: 'max-sm:[writing-mode:horizontal-tb]',
  },
  md: {
    aside: 'max-md:static max-md:max-h-none',
    rail: 'max-md:flex-row max-md:justify-center',
    label: 'max-md:[writing-mode:horizontal-tb]',
  },
  lg: {
    aside: 'max-lg:static max-lg:max-h-none',
    rail: 'max-lg:flex-row max-lg:justify-center',
    label: 'max-lg:[writing-mode:horizontal-tb]',
  },
};

/** Collapsed panel: a narrow card holding a vertical label; horizontal once the layout stacks. */
export function SidebarRail({
  label,
  icon: Icon,
  onOpen,
  stackBelow,
  className,
  railClassName,
  autoFocus,
}: {
  label: string;
  icon: LucideIcon;
  onOpen: () => void;
  stackBelow: StackBelow;
  className?: string;
  railClassName?: string;
  /** Takes focus on mount, so a keyboard user who just collapsed a panel lands on its rail. */
  autoFocus?: boolean;
}) {
  return (
    <aside className={cn(card, sidebar, STACKED[stackBelow].aside, 'overflow-hidden p-0', className)}>
      <button
        className={cn(
          'flex w-full flex-col items-center gap-3 py-3.5 text-sm font-semibold text-muted hover:text-teal-600',
          // The card clips overflow, so the ring is drawn inside the button to stay visible.
          'focus-visible:outline-offset-[-3px]',
          railClassName,
          STACKED[stackBelow].rail,
        )}
        onClick={onOpen}
        autoFocus={autoFocus}
        aria-label={`Show ${label}`}
        title={`Show ${label}`}
      >
        <Icon size={16} />
        <span className={cn('tracking-[0.02em] [writing-mode:vertical-rl]', STACKED[stackBelow].label)}>{label}</span>
      </button>
    </aside>
  );
}

interface Props {
  label: string;
  heading: ReactNode;
  open: boolean;
  onToggle: () => void;
  stackBelow: StackBelow;
  /** The parent draws its own hide handle on the edge; the header button only shows once stacked. */
  edgeHandle?: boolean;
  className?: string;
  collapsedClassName?: string;
  railClassName?: string;
  children: ReactNode;
}

/* Right-hand sidebar that collapses sideways into a narrow rail. The parent grid
   must shrink the sidebar column while it is closed. */
export function CollapsibleSidebar({
  label,
  heading,
  open,
  onToggle,
  stackBelow,
  edgeHandle,
  className,
  collapsedClassName,
  railClassName,
  children,
}: Props) {
  const [fromToggle, setFromToggle] = useState(false);
  const toggle = () => {
    setFromToggle(true);
    onToggle();
  };

  if (!open) {
    return (
      <SidebarRail
        label={label}
        icon={PanelRightOpen}
        onOpen={toggle}
        autoFocus={fromToggle}
        stackBelow={stackBelow}
        className={cn(className, collapsedClassName)}
        railClassName={railClassName}
      />
    );
  }

  return (
    <aside className={cn(card, sidebar, STACKED[stackBelow].aside, className)}>
      <div className="flex items-center gap-2">
        {heading}
        <IconButton
          className={cn(edgeHandle && 'hidden max-lg:grid')}
          onClick={toggle}
          autoFocus={fromToggle}
          aria-label={`Hide ${label}`}
          title={`Hide ${label}`}
        >
          <PanelRightClose size={16} />
        </IconButton>
      </div>
      {children}
    </aside>
  );
}
