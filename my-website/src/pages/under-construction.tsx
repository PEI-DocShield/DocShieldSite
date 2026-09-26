import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import MouseProximityGrid from '../components/MouseProximityGrid';

export default function UnderConstruction(): React.JSX.Element {
  return (
    <Layout
      title="Under Construction"
      description="This page is under construction"
    >
      <MouseProximityGrid
        className="background-grid"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
        }}
      />
      <main className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', position: 'relative', zIndex: 1 }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>Under Construction 🚧</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          We're still working on the documentation. Check back later!
        </p>
        <Link
          className="button button--primary button--lg"
          to="/"
        >
          Back to Home
        </Link>
      </main>
    </Layout>
  );
}
