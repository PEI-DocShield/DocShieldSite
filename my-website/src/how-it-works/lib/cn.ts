import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// Teach tailwind-merge the custom theme scales so e.g. `text-md` (size) and `text-muted` (colour) don't collide.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ['2xs', 'xs', 'sm', 'md', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'],
      shadow: ['card', 'glow', 'header'],
    },
  },
});

/** Join class names, letting later Tailwind classes override conflicting earlier ones. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
