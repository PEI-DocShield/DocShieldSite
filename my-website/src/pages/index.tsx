import React from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import MouseProximityGrid from '../components/MouseProximityGrid';
import BentoGrid from '../components/BentoGrid';
import TeamPolaroids from '../components/TeamPolaroids';
import AnimatedHero from '../components/AnimatedHero';

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
        interactive={true}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
        }}
      />

      {/* Hero Section — animated logo + phrase */}
      <main className="hero-custom hero-custom--animated" style={{ position: 'relative' }}>
        <div className="hero-content">
          <div className="text-underlay" />
          <AnimatedHero />
        </div>

        {/* Scroll Indicator */}
        <div
          className="hero-scroll-indicator"
          onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <span className="hero-scroll-text">Discover</span>
          <svg className="hero-scroll-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M19 12l-7 7-7-7"/>
          </svg>
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
