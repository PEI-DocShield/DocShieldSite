import React from 'react';
import { HowItWorks } from './components/landing/HowItWorks';
import './how-it-works.css';

/**
 * The "How it works" section of the DocShield app (frontend-service/src/components/landing/HowItWorks.tsx),
 * copied with its dependencies. It is styled with Tailwind, scoped to `.ds-tw` (see how-it-works.css).
 */
export default function HowItWorksSection() {
  return (
    <div className="ds-tw mx-auto w-full max-w-[1440px] px-6 max-sm:px-4">
      <HowItWorks />
    </div>
  );
}
