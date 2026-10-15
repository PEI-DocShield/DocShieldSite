import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../css/workflow-section.css';

/**
 * Entity types supported in DocShield's classification step.
 */
export type EntityCategory = 'person' | 'identifier' | 'contact';

/**
 * Definition of a sensitive entity discovered in the document.
 */
interface SensitiveEntity {
  id: string;
  original: string;
  token: string;
  type: EntityCategory;
  typeLabel: string;
}

/**
 * The 6 sensitive entities specified in requirements:
 * 1. Name
 * 2. Date of birth
 * 3. Tax ID
 * 4. Address
 * 5. Email
 * 6. Phone
 */
const SENSITIVE_ENTITIES: SensitiveEntity[] = [
  {
    id: 'name',
    original: 'Dr. Sarah Jenkins',
    token: '[PERSON_1]',
    type: 'person',
    typeLabel: 'PERSON',
  },
  {
    id: 'dob',
    original: '14/05/1988',
    token: '[DOB_1]',
    type: 'identifier',
    typeLabel: 'DOB',
  },
  {
    id: 'tax_id',
    original: 'TX-9482019',
    token: '[TAX_ID_1]',
    type: 'identifier',
    typeLabel: 'TAX ID',
  },
  {
    id: 'address',
    original: '742 Evergreen Terrace, Springfield',
    token: '[LOCATION_1]',
    type: 'contact',
    typeLabel: 'LOCATION',
  },
  {
    id: 'email',
    original: 'sarah.jenkins@medicare-center.org',
    token: '[EMAIL_1]',
    type: 'contact',
    typeLabel: 'EMAIL',
  },
  {
    id: 'phone',
    original: '+1 (555) 382-9104',
    token: '[PHONE_1]',
    type: 'contact',
    typeLabel: 'PHONE',
  },
];

/**
 * Step glow & character illumination colors:
 * A cohesive gradient from the brand primary teal (#25828e) to a light aqua/teal (#52d8f0).
 */
export const STEP_COLORS: Record<number, { name: string; rgb: string; hex: string; lightHex: string }> = {
  0: { name: 'teal-1', rgb: '37, 130, 142', hex: '#25828e', lightHex: '#2d8e9b' },       // Step 1: Base primary teal
  1: { name: 'teal-2', rgb: '47, 140, 152', hex: '#2f8c98', lightHex: '#3896a2' },       // Step 2: Slightly lighter teal
  2: { name: 'teal-3', rgb: '60, 152, 163', hex: '#3c98a3', lightHex: '#47a3ad' },       // Step 3: Mid soft teal
  3: { name: 'pastel-teal-4', rgb: '79, 168, 178', hex: '#4fa8b2', lightHex: '#5db5be' }, // Step 4: Soft pastel teal
  4: { name: 'pastel-teal-5', rgb: '107, 185, 194', hex: '#6bb9c2', lightHex: '#7bc4cd' },// Step 5: Pastel seafoam / mint
  5: { name: 'pastel-teal-6', rgb: '138, 202, 209', hex: '#8acacf', lightHex: '#9ad4d9' },// Step 6: Gentle pastel powder aqua
};

/**
 * The 6 workflow steps.
 */
interface WorkflowStep {
  id: string;
  number: number;
  title: string;
  shortDesc: string;
  badgeText: string;
  badgeClass: string;
}

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: 'upload',
    number: 1,
    title: 'Upload your document',
    shortDesc: 'Securely ingest unstructured records in PDF, DOCX, text format and more to come. All processing within your isolated workspace or securely stored if you have an account.',
    badgeText: 'Original Document',
    badgeClass: 'badge--plain',
  },
  {
    id: 'detect',
    number: 2,
    title: 'Detect sensitive data',
    shortDesc: 'Our tools for detection instantly parse the text to identify PII, government numbers, and private contact points in milliseconds.',
    badgeText: '6 Sensitive Entities Detected',
    badgeClass: 'badge--detected',
  },
  {
    id: 'classify',
    number: 3,
    title: 'Classify each entity',
    shortDesc: 'Entities are semantically mapped into distinct categories - distinguishing, for example, persons, unique identifiers, and contact/location data.',
    badgeText: 'Classified by Category',
    badgeClass: 'badge--classified',
  },
  {
    id: 'anonymize',
    number: 4,
    title: 'Anonymize',
    shortDesc: 'Sensitive data points are progressively substituted, automatic or manually, with the anonymization method choosen for safe LLMs and public sharing.',
    badgeText: '100% Anonymized & Protected',
    badgeClass: 'badge--anonymized',
  },
  {
    id: 'review',
    number: 5,
    title: 'Review',
    shortDesc: 'Inspect and verify sanitized outputs. Click any anonymized token directly in the document to reverse it back to its original value and also anonymize text that you want.',
    badgeText: 'Interactive Review Mode',
    badgeClass: 'badge--review',
  },
  {
    id: 'conclusion',
    number: 6,
    title: 'Conclusion',
    shortDesc: 'Your document is fully certified and protected. The sanitized output is clean, privacy-compliant, and ready for LLMs or secure storage.',
    badgeText: 'Ready for Export',
    badgeClass: 'badge--conclusion',
  },
];

/**
 * WorkflowSection Component
 *
 * Implements a scroll-driven, sticky introductory section right after the hero:
 * - Desktop: The section stays pinned while the user scrolls down, and scroll progress controls the active step.
 * - Mobile: Layout stacks, and the document stays sticky at the top while the step list scrolls underneath.
 * - Clicking any step smoothly scrolls the page to activate that step.
 * - Step 1: Plain original text.
 * - Step 2: Teal outline & light highlight.
 * - Step 3: Color-coded by entity category (person, identifier, contact/location).
 * - Step 4: Staggered progressive replacement into dark tokens ([PERSON_1], etc.).
 * - Respects prefers-reduced-motion and integrates seamlessly with light/dark theme variables.
 */
export default function WorkflowSection(): React.JSX.Element {
  // Current active step index (0 to 5)
  const [activeStep, setActiveStep] = useState<number>(0);

  // Tracks whether the workflow section is currently active/visible in viewport
  const [isSectionActive, setIsSectionActive] = useState<boolean>(false);

  // Progressive tokenization counter for Step 4 (how many of the 6 entities have morphed)
  const [tokenizedCount, setTokenizedCount] = useState<number>(0);

  // Step 5 (Review): Set of entity indices that the user has clicked to reverse back to original
  const [reversedEntities, setReversedEntities] = useState<Set<number>>(new Set());

  // Refs for tracking DOM nodes and scroll geometry
  const sectionRef = useRef<HTMLElement | null>(null);
  const docCardRef = useRef<HTMLDivElement | null>(null);
  const stepButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Tokenization effect: progressive in Step 4, fully tokenized in Steps 5 and 6
  useEffect(() => {
    if (activeStep < 3) {
      setTokenizedCount(0);
      return;
    }

    if (activeStep > 3) {
      // In Step 5 (Review) and Step 6 (Conclusion), all entities are tokenized by default
      setTokenizedCount(SENSITIVE_ENTITIES.length);
      return;
    }

    // Step 4 (Anonymize): Check prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setTokenizedCount(SENSITIVE_ENTITIES.length);
      return;
    }

    // Step 4 active: reveal tokens one by one with a smooth progressive stagger
    setTokenizedCount(1);
    const timers: NodeJS.Timeout[] = [];

    for (let i = 2; i <= SENSITIVE_ENTITIES.length; i++) {
      const timer = setTimeout(() => {
        setTokenizedCount(i);
      }, (i - 1) * 140);
      timers.push(timer);
    }

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [activeStep]);

  // Step 5 Review: Toggle entity reversal between original text and token
  const handleToggleEntityReversal = (entityIndex: number) => {
    if (activeStep !== 4) return;
    setReversedEntities((prev) => {
      const next = new Set(prev);
      if (next.has(entityIndex)) {
        next.delete(entityIndex);
      } else {
        next.add(entityIndex);
      }
      return next;
    });
  };

  // Scroll listener for Desktop: calculates scroll progress through the pinned section
  const handleDesktopScroll = useCallback(() => {
    if (!sectionRef.current) return;
    const isMobile = window.innerWidth <= 996;
    if (isMobile) return; // Mobile is handled via IntersectionObserver

    const rect = sectionRef.current.getBoundingClientRect();
    const navOffset = 96; // Nav height + top padding clearance
    const scrollableDistance = rect.height - window.innerHeight;

    // Check if section is within active viewport range
    const active = rect.top <= window.innerHeight * 0.75 && rect.bottom >= window.innerHeight * 0.25;
    setIsSectionActive(active);

    if (scrollableDistance <= 0) return;

    // Calculate normalized scroll progress: 0.0 -> 1.0 within the section
    const currentScrollWithin = navOffset - rect.top;
    const progress = Math.min(Math.max(currentScrollWithin / scrollableDistance, 0), 1);

    // Map progress smoothly across the 6 steps (0..5)
    const nextStep = Math.min(5, Math.floor(progress * 6));
    setActiveStep(nextStep);

    // Dispatch card position and step color to MouseProximityGrid
    if (docCardRef.current && typeof window !== 'undefined') {
      const cardRect = docCardRef.current.getBoundingClientRect();
      const cardCenterX = cardRect.left + cardRect.width / 2;
      const cardCenterY = cardRect.top + cardRect.height / 2;
      const stepColor = STEP_COLORS[nextStep] || STEP_COLORS[0];

      window.dispatchEvent(
        new CustomEvent('docshield:card-glow', {
          detail: {
            x: cardCenterX,
            y: cardCenterY,
            active,
            rgb: stepColor.rgb,
            radius: 280,
          },
        })
      );
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Listen to scroll events on desktop
    window.addEventListener('scroll', handleDesktopScroll, { passive: true });
    window.addEventListener('resize', handleDesktopScroll, { passive: true });

    // Initial check
    handleDesktopScroll();

    return () => {
      window.removeEventListener('scroll', handleDesktopScroll);
      window.removeEventListener('resize', handleDesktopScroll);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('docshield:card-glow', {
            detail: { x: -1000, y: -1000, active: false },
          })
        );
      }
    };
  }, [handleDesktopScroll]);

  // Synchronize card glow position and color when activeStep or isSectionActive changes
  useEffect(() => {
    if (!docCardRef.current || typeof window === 'undefined') return;
    const cardRect = docCardRef.current.getBoundingClientRect();
    const cardCenterX = cardRect.left + cardRect.width / 2;
    const cardCenterY = cardRect.top + cardRect.height / 2;
    const stepColor = STEP_COLORS[activeStep] || STEP_COLORS[0];

    window.dispatchEvent(
      new CustomEvent('docshield:card-glow', {
        detail: {
          x: cardCenterX,
          y: cardCenterY,
          active: isSectionActive,
          rgb: stepColor.rgb,
          radius: 280,
        },
      })
    );
  }, [activeStep, isSectionActive]);

  // IntersectionObserver for Mobile: triggers when step buttons scroll beneath the sticky document
  useEffect(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return;

    const isMobile = window.innerWidth <= 996;
    if (!isMobile) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === sectionRef.current) {
            setIsSectionActive(entry.isIntersecting);
          }
          if (entry.isIntersecting) {
            const stepIdx = Number(entry.target.getAttribute('data-step-index'));
            if (!isNaN(stepIdx)) {
              setActiveStep(stepIdx);
            }
          }
        });
      },
      {
        root: null,
        // Trigger as the step card enters the middle region below the sticky document
        rootMargin: '-20% 0px -25% 0px',
        threshold: 0.15,
      }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    stepButtonRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  // Smooth scroll to a step when clicking on its list item
  const scrollToStep = (stepIndex: number) => {
    setActiveStep(stepIndex);

    if (typeof window === 'undefined') return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const behavior: ScrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';
    const isMobile = window.innerWidth <= 996;

    if (isMobile) {
      // Mobile: scroll the specific step card into view right below the sticky document
      const targetCard = stepButtonRefs.current[stepIndex];
      if (targetCard) {
        const docHeight = docCardRef.current?.offsetHeight || 220;
        const targetY = window.scrollY + targetCard.getBoundingClientRect().top - docHeight - 90;
        window.scrollTo({ top: Math.max(0, targetY), behavior });
      }
    } else {
      // Desktop: calculate the target progress point along the pinned section (6 steps)
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const navOffset = 96;
      const scrollableDistance = rect.height - window.innerHeight;

      // Target progress centers within each 1/6 segment
      const progressTargets = [0.08, 0.25, 0.42, 0.58, 0.75, 0.92];
      const targetProgress = progressTargets[stepIndex];
      const targetScrollY = window.scrollY + rect.top - navOffset + targetProgress * scrollableDistance;

      window.scrollTo({ top: Math.max(0, targetScrollY), behavior });
    }
  };

  /**
   * Helper component to render an individual entity with dynamic step-specific styling:
   * - Step 1: Plain original text
   * - Step 2: Teal outline & light highlight
   * - Step 3: Color-coded by entity category
   * - Step 4: Dark anonymized token [TOKEN_1] with progressive transition
   * - Step 5 (Review): Interactive click-to-reverse between token and original value
   * - Step 6 (Conclusion): Preserves final anonymized/reviewed state
   */
  const renderEntity = (entityIndex: number) => {
    const entity = SENSITIVE_ENTITIES[entityIndex];
    const isReversed = reversedEntities.has(entityIndex);
    const isStep4Anonymized = activeStep === 3 && tokenizedCount > entityIndex;
    const isReviewStep = activeStep === 4;
    const isConclusionStep = activeStep === 5;

    // Step 5 (Review) interactive state
    if (isReviewStep) {
      if (isReversed) {
        return (
          <span
            key={entity.id}
            role="button"
            tabIndex={0}
            className="workflow-entity step-state--reversed"
            onClick={() => handleToggleEntityReversal(entityIndex)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleToggleEntityReversal(entityIndex);
              }
            }}
            title={`Restored to original. Click to re-anonymize back to ${entity.token}`}
            aria-label={`Restored value: ${entity.original}. Click to re-anonymize.`}
          >
            {entity.original}
          </span>
        );
      }

      return (
        <span
          key={entity.id}
          role="button"
          tabIndex={0}
          className="workflow-entity step-state--tokenized step-state--reviewable"
          onClick={() => handleToggleEntityReversal(entityIndex)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleToggleEntityReversal(entityIndex);
            }
          }}
          title={`Click to reverse token to original value: ${entity.original}`}
          aria-label={`Token: ${entity.token}. Click to reverse to original value.`}
        >
          {entity.token}
        </span>
      );
    }

    // Step 6 (Conclusion) state: reverted entities look like normal text
    if (isConclusionStep) {
      if (isReversed) {
        return (
          <span
            key={entity.id}
            className="workflow-entity step-state--plain"
          >
            {entity.original}
          </span>
        );
      }
      return (
        <span
          key={entity.id}
          className="workflow-entity step-state--tokenized"
          title={`Anonymized: ${entity.token}`}
        >
          {entity.token}
        </span>
      );
    }

    // Steps 1 to 4 states
    let stepClass = 'step-state--plain';
    let displayText = entity.original;

    if (isStep4Anonymized) {
      stepClass = 'step-state--tokenized';
      displayText = entity.token;
    } else if (activeStep === 1) {
      stepClass = 'step-state--detected';
    } else if (activeStep === 2) {
      stepClass = `step-state--classified type--${entity.type}`;
    }

    return (
      <span
        key={entity.id}
        className={`workflow-entity ${stepClass}`}
        title={`Type: ${entity.typeLabel} • Token: ${entity.token}`}
      >
        {displayText}
      </span>
    );
  };

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="workflow-section"
      aria-label="How DocShield Works Workflow"
    >
      <div className="workflow-sticky-frame">
        <div
          className="workflow-content-wrapper"
          style={
            {
              '--active-step-rgb': (STEP_COLORS[activeStep] || STEP_COLORS[0]).rgb,
              '--active-step-hex': (STEP_COLORS[activeStep] || STEP_COLORS[0]).hex,
              '--active-step-light-hex': (STEP_COLORS[activeStep] || STEP_COLORS[0]).lightHex,
            } as React.CSSProperties
          }
        >
          <div className="workflow-container">
            {/* Section Header & Title */}
            <div className="workflow-section-header">
              <h2 className="workflow-section-title">
                <span>How It Works</span>
              </h2>
            </div>

            {/* ---------------- Left Column: Steps List ---------------- */}
            <div className="workflow-left">
              {/* Stepper Navigation List */}
              <div className="workflow-stepper" role="tablist" aria-label="DocShield Workflow Steps">
                {WORKFLOW_STEPS.map((step, index) => {
                  const isActive = activeStep === index;
                  const isCompleted = activeStep > index;
                  const stepColor = STEP_COLORS[index] || STEP_COLORS[0];

                  return (
                    <button
                      key={step.id}
                      ref={(el) => {
                        stepButtonRefs.current[index] = el;
                      }}
                      data-step-index={index}
                      role="tab"
                      aria-selected={isActive}
                      tabIndex={0}
                      style={
                        {
                          '--step-rgb': stepColor.rgb,
                          '--step-hex': stepColor.hex,
                          '--step-light-hex': stepColor.lightHex,
                        } as React.CSSProperties
                      }
                      className={`workflow-step-btn ${isActive ? 'is-active' : ''} ${
                        isCompleted ? 'is-completed' : ''
                      }`}
                      onClick={() => scrollToStep(index)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          scrollToStep(index);
                        }
                      }}
                    >
                      {/* Teal number circle */}
                      <div className="workflow-step-circle">
                        {isCompleted ? '✓' : step.number}
                      </div>

                      <div className="workflow-step-content">
                        <h3 className="workflow-step-title">{step.title}</h3>
                        <div className="workflow-step-desc-wrapper" aria-hidden={!isActive}>
                          <p className="workflow-step-desc">{step.shortDesc}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ---------------- Right Column: Sticky Document Card ---------------- */}
            <div className="workflow-right">
              {/* Radial glow that follows the card and shifts color with the step */}
              <div
                className={`workflow-ambient-glow workflow-glow--step-${activeStep}`}
                aria-hidden="true"
              />

              {/* Paper Document Card Stack */}
              <div className={`workflow-doc-stack ${isSectionActive ? 'is-active' : ''}`}>
                {/* Background Sheets in Paper Stack */}
                <div className="workflow-doc-sheet workflow-doc-sheet--deep" aria-hidden="true" />
                <div className="workflow-doc-sheet workflow-doc-sheet--mid" aria-hidden="true" />

                {/* Top Document Paper Card */}
                <div ref={docCardRef} className="workflow-doc-card">
                  {/* Document Header / Window Bar */}
                  <div className="workflow-doc-header">
                    <div className="workflow-doc-dots" aria-hidden="true">
                      <span className="workflow-doc-dot workflow-doc-dot--red" />
                      <span className="workflow-doc-dot workflow-doc-dot--yellow" />
                      <span className="workflow-doc-dot workflow-doc-dot--green" />
                    </div>
                    <div className="workflow-doc-filename">
                      <svg
                        className="workflow-doc-file-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                      <span>patient_intake_record.pdf</span>
                    </div>
                  </div>

                  {/* Document Paper Body */}
                  <div className="workflow-doc-paper">
                    {/* Background Watermark */}
                    <svg
                      className="workflow-doc-watermark"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>

                    <div className="workflow-doc-headline">
                      <span>CONFIDENTIAL MEDICAL CONSULTATION AGREEMENT</span>
                      <span className="workflow-doc-meta-id">ID: MED-9042</span>
                    </div>

                    <p className="workflow-doc-paragraph">
                      This intake record certifies that {renderEntity(0)} (DOB:{' '}
                      {renderEntity(1)}), registered under Tax ID {renderEntity(2)},
                      residing at {renderEntity(3)}, has authorized the secure
                      processing of clinical documentation. All official follow-up
                      correspondence will be transmitted directly to{' '}
                      {renderEntity(4)} or confirmed by telephone at{' '}
                      {renderEntity(5)}.
                    </p>
                  </div>

                  {/* Document Card Footer */}
                  <div className="workflow-doc-footer">
                    <div className="workflow-doc-footer-meta">
                      <svg
                        className="workflow-doc-footer-shield"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                      <span>DocShield</span>
                    </div>

                    <div className="workflow-doc-footer-progress">
                      Step {activeStep + 1} of 6
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
