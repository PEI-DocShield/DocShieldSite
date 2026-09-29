import React from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import MouseProximityGrid from '../components/MouseProximityGrid';
import BentoGrid from '../components/BentoGrid';
import TeamPolaroids from '../components/TeamPolaroids';
import AnimatedHero from '../components/AnimatedHero';
import ScrollScrubReveal from '../components/ScrollScrubReveal';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Home(): React.JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  
  // Connect to global scroll
  const { scrollY } = useScroll();

  // Scroll Zoom Hero effects (between 0px and 500px of scroll)
  // 1. Fade out the hero content
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  
  // 2. Scale up (zoom effect) from 1 to 1.15
  const scale = useTransform(scrollY, [0, 500], [1, 1.05]);
  
  // 3. Blur effect from 0px to 10px
  const blur = useTransform(scrollY, [0, 500], [0, 10]);
  const filter = useTransform(blur, (v) => `blur(${v}px)`);
  
  // 4. Slight parallax Y offset so it moves slower than the rest of the page
  const y = useTransform(scrollY, [0, 500], [0, 150]);

  // Indicator fades out much faster (between 0px and 150px)
  const indicatorOpacity = useTransform(scrollY, [0, 150], [1, 0]);

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
        <motion.div 
          className="hero-content"
          style={{ 
            opacity, 
            scale, 
            y, 
            filter, 
            willChange: 'opacity, transform, filter' 
          }}
        >
          <div className="text-underlay" />
          <AnimatedHero />
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="hero-scroll-indicator"
          onClick={() => document.getElementById('bento-grid-container')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
          style={{ 
            opacity: indicatorOpacity, 
            willChange: 'opacity' 
          }}
        >
          <span className="hero-scroll-text">Discover</span>
          <svg className="hero-scroll-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M19 12l-7 7-7-7"/>
          </svg>
        </motion.div>
      </main>

      {/* Feature Sections */}
      <BentoGrid />

      {/* Team Section */}
      <ScrollScrubReveal id="team" className="section-custom">
        <div className="section-container">
          <h2 className="section-title fade-in-up">Project Team</h2>
          <TeamPolaroids />
        </div>
      </ScrollScrubReveal>
    </Layout>
  );
}
