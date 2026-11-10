import { cn } from '../../../lib/cn';

/** A document that fans out into a stack of three while files are dragged over the drop area. */
export function DropIcon({ fanned }: { fanned: boolean }) {
  // Pastel pages in neighbouring hues of the app's teal. Neighbouring pages differ in lightness as well as hue (light
  // front, deeper blue and mint behind it), so each reads apart from the next. At rest only a corner of each back page
  // sticks out; they swing wide once fanned.
  const page = 'absolute inset-0 size-full origin-bottom transition-transform duration-300 ease-out';
  return (
    <div className="relative h-[66px] w-[51px]" aria-hidden>
      <DocumentPage table className={cn(page, '-translate-x-0.5 -rotate-6 text-[#9bd6bc]', fanned && '-translate-x-4 -rotate-12')} />
      <DocumentPage image className={cn(page, 'translate-x-0.5 rotate-6 text-[#8db9e3]', fanned && 'translate-x-4 rotate-12')} />
      <DocumentPage ink={0.45} className={cn(page, 'text-[#c3e6ea]', fanned && '-translate-y-1')} />
    </div>
  );
}

interface PageProps {
  className?: string;
  image?: boolean;
  table?: boolean;
  /** Strength of the text lines. */
  ink?: number;
}

/** The logo's page: a cut top-right corner and rows of text, or a `table`, or a picture (`image`) above a few rows. */
function DocumentPage({ className, image, table, ink = 0.7 }: PageProps) {
  return (
    <svg viewBox="0 0 70 91" fill="none" className={className}>
      <path d="M0 0H58L70 12V91H0Z" fill="currentColor" />
      {table && (
        <g stroke="#1f6b76" strokeOpacity="0.3" strokeWidth="1">
          <rect x="9.6" y="25" width="48.4" height="46" />
          <rect x="9.6" y="25" width="48.4" height="10" fill="#1f6b76" fillOpacity="0.2" stroke="none" />
          <path d="M9.6 35H58M9.6 47H58M9.6 59H58M25.7 25V71M41.9 25V71" />
        </g>
      )}
      <g fill="#1f6b76" fillOpacity={ink}>
        <path d="M58 0L70 12H58Z" fillOpacity="0.3" />
        {table ? null : image ? (
          <>
            <rect x="9.6" y="25" width="48.4" height="30" rx="3" fillOpacity="0.25" />
            <circle cx="22" cy="34" r="4" fillOpacity="0.55" />
            <path d="M9.6 55V50L26 39L36 47L43 42L58 52V55Z" fillOpacity="0.55" />
          </>
        ) : (
          <>
            <rect x="9.6" y="25" width="26" height="4" />
            <rect x="9.6" y="33.8" width="48.4" height="4" />
            <rect x="9.6" y="42.4" width="48.4" height="4" />
            <rect x="9.6" y="51" width="48.4" height="4" />
          </>
        )}
        {!table && (
          <>
            <rect x="9.6" y="60" width="26" height="4" />
            <rect x="9.6" y="69" width="26" height="4" />
          </>
        )}
      </g>
    </svg>
  );
}
