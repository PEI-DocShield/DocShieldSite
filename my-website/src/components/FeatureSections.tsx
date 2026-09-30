import "../css/hero.css";
import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { usePluginData } from '@docusaurus/useGlobalData';
import ScrollFloat from './react_bits/ScrollFloat';
import ScrollScrubReveal from './ScrollScrubReveal';
import '../css/feature-sections.css';

interface MilestoneData {
  id: string;
  name: string;
  link: string;
  order: number;
}

interface FeatureSectionProps {
  id?: string;
  title: string;
  description: string;
  link: string;
  image?: string;
  imageAlt?: string;
  align: 'left' | 'right';
  children?: React.ReactNode;
}

function FeatureSection({ id, title, description, link, image, imageAlt, align, children }: FeatureSectionProps) {
  const imageUrl = image ? useBaseUrl(image) : '';

  return (
    <ScrollScrubReveal id={id} className={`feature-section feature-section--${align}`}>
      <div className="feature-section__content">
        <ScrollFloat
          animationDuration={2}
          ease='back.inOut(2)'
          scrollStart='center bottom+=50%'
          scrollEnd='bottom bottom-=40%'
          stagger={0.05}
          containerClassName="feature-section__title-container"
          textClassName="feature-section__title"
        >
          {title}
        </ScrollFloat>
        <p className="feature-section__desc">{description}</p>
        {link && (
          <Link to={link} className="feature-section__link">
            Discover
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        )}
      </div>
      
      <div className="feature-section__visual">
        {children ? (
            children
        ) : (
          <Link to={link} className="feature-section__visual-link">
            <img src={imageUrl} alt={imageAlt} className="feature-section__image" />
          </Link>
        )}
      </div>
    </ScrollScrubReveal>
  );
}

function MilestonesGrid() {
  const { milestones } = usePluginData('docusaurus-plugin-milestones') as { milestones: MilestoneData[] };

  return (
    <div className="milestones-visual-grid" style={{
      gridTemplateColumns: milestones.length > 4 ? 'repeat(3, 1fr)' : '1fr 1fr'
    }}>
      {milestones.map((milestone) => (
        <Link 
          key={milestone.id} 
          to={milestone.link} 
          className="milestone-visual-item"
        >
          {milestone.name}
        </Link>
      ))}
    </div>
  );
}

export default function FeatureSections() {
  return (
    <section className="section-custom" style={{ minHeight: 'auto', paddingBottom: 0 }}><div className="feature-sections-container">
      <FeatureSection
        id="meeting-minutes"
        title="Meeting Minutes"
        description="Read through the minutes of our weekly meetings to stay up to date with project decisions."
        link="/minutes"
        image="/assets/meeting-minutes.svg"
        imageAlt="Meeting Minutes"
        align="left"
      />
      <FeatureSection
        title="Project Calendar"
        description="View our timeline and upcoming deadlines."
        link="/calendar"
        image="/assets/project-calendar.svg"
        imageAlt="Project Calendar"
        align="right"
      />
      
      <FeatureSection
        title="Milestones"
        description="Track our progress against major project milestones."
        link="#milestones"
        align="left"
      >
        <MilestonesGrid />
      </FeatureSection>

      <FeatureSection
        title="Documentation"
        description="Read the official documentation for DocShield."
        link="/under-construction"
        image="/assets/documentation.svg"
        imageAlt="Documentation"
        align="right"
      />
    </div></section>
  );
}
