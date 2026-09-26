import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import MouseProximityGrid from '../components/MouseProximityGrid';
import BentoGrid from '../components/BentoGrid';
import TeamPolaroids from '../components/TeamPolaroids';

export default function Home(): React.JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={siteConfig.title}
      description={siteConfig.tagline}
    >
      {/* Full-page Mouse Proximity Grid Background */}
      <MouseProximityGrid
        className="background-grid"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
        }}
      />

      {/* Hero Section */}
      <main className="hero-custom">
        <div className="hero-content">
          <div className="text-underlay" />
          <h1 className="fade-in-up hero-title">
            Progress{' '}
            <img
              src={useBaseUrl('/assets/logoCompleta.png')}
              alt="DocShield"
              className="hero-logo-img"
            />
          </h1>
          <p className="fade-in-up delay-1 hero-subtitle">
            An easy and practical tool designed to anonymize confidential documents
            securely and efficiently.
          </p>
          <div className="hero-buttons fade-in-up delay-2">
            <Link to="/calendar" className="btn-custom btn-primary-custom">
              View Milestones
            </Link>
            <Link to="/docs/intro" className="btn-custom btn-secondary-custom">
              Read Documentation
            </Link>
          </div>
        </div>
      </main>

      {/* Bento Grid replaces the long scrolling sections */}
      <BentoGrid />

      {/* Team Section */}
      <section id="team" className="section-custom">
        <div className="section-container">
          <h2 className="section-title fade-in-up">Project Team</h2>
          <TeamPolaroids />
        </div>
      </section>
    </Layout>
  );
}
