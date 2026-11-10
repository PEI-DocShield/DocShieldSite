// Class recipes shared by elements that differ in tag (section, aside, article…), so a component wrapper would add nothing.

export const card = 'flex min-w-0 flex-col gap-3 rounded-2xl border border-line bg-surface p-5 shadow-card';

export const cardTitle = 'text-lg font-semibold tracking-[-0.01em]';

/** Sticky right-hand column. Pair with a `max-*:static max-*:max-h-none` reset where the layout stacks. */
export const sidebar = 'sticky top-24 max-h-[calc(100vh-112px)] gap-4 overflow-y-auto scrollbar-thin';

/** Two-column layout with a fixed-width sidebar; stacks below `md`. */
export const withSidebar = 'grid items-start gap-5 transition-[grid-template-columns] duration-200 max-md:grid-cols-1';

/** A landing page topic that fills the screen like its own page; pt-16 clears the sticky header. */
export const screenSection = 'flex min-h-screen scroll-mt-0 flex-col justify-center pt-16 pb-8';

export const fieldLabel = 'block text-sm font-semibold';

/** Small uppercase label above a column or group. */
export const eyebrow = 'pl-1 text-2xs leading-4 font-bold tracking-[0.08em] text-muted uppercase';

export const muted = 'text-sm text-muted';

export const banner = 'flex items-center gap-2.5 rounded-lg border px-3.5 py-2.5';
