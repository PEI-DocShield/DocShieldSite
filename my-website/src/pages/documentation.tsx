import React from 'react';
import Layout from '@theme/Layout';
import MouseProximityGrid from '../components/MouseProximityGrid';
import DocsWorkspace from '../components/DocsWorkspace';

export default function DocumentationPage(): React.JSX.Element {
  return (
    <Layout
      title="Documentation Workspace"
      description="DocShield Project Documentation Workspace: Use Cases, Requirements, Architecture, Deployment, Domain Model, and UI Mockups."
    >
      <MouseProximityGrid
        className="background-grid"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
        }}
      />
      <main
        className="container docs-workspace-page-main"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.75rem',
          marginTop: '2.5rem',
          marginBottom: '5.5rem',
          position: 'relative',
          zIndex: 1,
          maxWidth: '1350px',
          minHeight: 'calc(100vh - 100px)',
        }}
      >
        {/* Page Title & Subtitle */}
        <div style={{ position: 'relative', textAlign: 'left', marginBottom: '0.5rem', marginTop: '0.5rem' }}>
          <div className="text-underlay" style={{ width: '100%', height: '250%' }} />
          <h1
            className="fade-in-up docs-workspace-title"
            style={{
              position: 'relative',
              zIndex: 2,
              margin: '0 0 0.5rem 0',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: 'var(--text-primary)',
            }}
          >
            Documentation
          </h1>
        </div>

        {/* Interactive Workspace Component */}
        <div className="fade-in-up delay-2">
          <DocsWorkspace />
        </div>
      </main>
    </Layout>
  );
}
