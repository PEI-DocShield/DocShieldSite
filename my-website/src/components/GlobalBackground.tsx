import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import MouseProximityGrid from './MouseProximityGrid';

export default function GlobalBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <MouseProximityGrid
          className="background-grid"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
          }}
        />
        <div 
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: '50%', 
            transform: 'translateX(-50%)', 
            width: '1200px', 
            maxWidth: '100vw',
            height: '100%', 
            background: 'linear-gradient(to right, transparent 0%, var(--ifm-background-color) 15%, var(--ifm-background-color) 85%, transparent 100%)', 
          }} 
        />
      </div>
      <style>{`
        /* Elevate the actual content to zIndex 1 so it sits above our zIndex 0 background */
        
        /* The main markdown body */
        .theme-doc-markdown {
          position: relative !important;
          z-index: 1 !important;
        }

        /* The title header (Milestone 1) */
        header {
          position: relative !important;
          z-index: 1 !important;
        }

        /* The right sidebar (Table of Contents) */
        .theme-doc-toc-desktop {
          position: relative !important;
          z-index: 1 !important;
        }
        
        /* The left sidebar (if visible) */
        .theme-doc-sidebar-container {
          position: relative !important;
          z-index: 1 !important;
        }

        /* Breadcrumbs (if enabled) */
        .theme-doc-breadcrumbs {
          position: relative !important;
          z-index: 1 !important;
        }

        /* Make sure the footer stays on top of the background */
        .footer {
          position: relative !important;
          z-index: 2 !important;
        }
      `}</style>
    </>,
    document.body
  );
}
