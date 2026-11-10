import { useTween } from '../../../hooks/useTween';
import { cn } from '../../../lib/cn';

// The ring is drawn in a 100×100 viewBox, so it scales to whatever size its container gives it.
const VB = 100;
const RING_STROKE = 4.5;
const RING_RADIUS = (VB - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

/**
 * Fixed-size circular progress indicator with the percentage in the middle. `target` changes in steps;
 * the ring eases between them.
 */
export function ProgressRing({ target }: { target: number }) {
  const value = useTween(target);
  const complete = value >= 99.9;
  return (
    <svg
      viewBox={`0 0 ${VB} ${VB}`}
      className="size-38"
      role="progressbar"
      aria-label="Overall progress"
      aria-valuetext={target >= 100 ? 'Complete' : `${Math.floor(target)}%`}
      aria-valuenow={Math.floor(target)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <g transform={`rotate(-90 ${VB / 2} ${VB / 2})`} fill="none" strokeWidth={RING_STROKE}>
        <circle cx={VB / 2} cy={VB / 2} r={RING_RADIUS} className="stroke-teal-100" />
        <circle
          cx={VB / 2}
          cy={VB / 2}
          r={RING_RADIUS}
          strokeLinecap="butt"
          className="stroke-primary"
          strokeDasharray={RING_CIRCUMFERENCE}
          strokeDashoffset={RING_CIRCUMFERENCE * (1 - value / 100)}
        />
      </g>
      <text
        x={VB / 2}
        y={VB / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={19}
        fontWeight={600}
        className={cn('fill-teal-600 transition-opacity duration-300', complete && 'opacity-0')}
      >
        {Math.floor(value)}%
      </text>
      {/* Once the ring has filled, the percentage fades out and the check mark draws itself in. */}
      <svg x={VB / 2 - 21} y={VB / 2 - 21} width={42} height={42} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M5 12.5 10 17.5 19 7"
          pathLength={1}
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="stroke-teal-600"
          strokeDasharray={1}
          strokeDashoffset={complete ? 0 : 1}
          style={{ transition: 'stroke-dashoffset 0.6s ease-out 0.25s' }}
        />
      </svg>
    </svg>
  );
}
