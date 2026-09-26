import React from 'react';
import Layout from '@theme/Layout';
import MeetingMinutesViewer from '../components/MeetingMinutesViewer';
import MouseProximityGrid from '../components/MouseProximityGrid';

export default function MinutesPage(): React.JSX.Element {
  return (
    <Layout
      title="Meeting Minutes"
      description="DocShield Project Meeting Minutes"
    >
      <MouseProximityGrid
        className="background-grid"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
        }}
      />
      <main className="container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '3rem', marginBottom: '3rem', position: 'relative', zIndex: 1 }}>
        <div style={{ position: 'relative', textAlign: 'center', marginBottom: '1rem', marginTop: '1rem' }}>
          <div className="text-underlay" style={{ width: '100%', height: '250%' }} />
          <h2 className="section-title fade-in-up" style={{ position: 'relative', zIndex: 2, margin: 0, fontSize: '1.75rem' }}>Meeting Minutes</h2>
        </div>
        <MeetingMinutesViewer />
      </main>
    </Layout>
  );
}
