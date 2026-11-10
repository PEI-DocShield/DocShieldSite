import type { Step } from '../types';

/** The wizard's steps, in order. */
export const STEPS: { id: Step; label: string }[] = [
  { id: 'upload', label: 'Upload & configuration' },
  { id: 'processing', label: 'Process & detect' },
  { id: 'review', label: 'Review & edit' },
  { id: 'conclusion', label: 'Download' },
];
