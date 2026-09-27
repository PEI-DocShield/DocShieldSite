import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import './bento.css';

interface BentoCardProps {
  title: string;
  description: string;
  link: string;
  image: string;
  imageAlt: string;
  imageClassName?: string;
  className?: string;
}

function BentoCard({ title, description, link, image, imageAlt, imageClassName, className }: BentoCardProps) {
  const imageUrl = useBaseUrl(image);

  return (
    <Link to={link} className={`bento-card ${className || ''}`}>
      <img className={`bento-image-placeholder ${imageClassName || ''}`} src={imageUrl} alt={imageAlt} />
      <div className="bento-content">
        <h3 className="bento-title">{title}</h3>
        <p className="bento-desc">{description}</p>
      </div>
    </Link>
  );
}

function MilestonesBentoCard({ className, id }: { className?: string, id?: string }) {
  return (
    <div id={id} className={`bento-card ${className || ''}`} style={{ cursor: 'default' }}>
      <div className="bento-image-placeholder" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '0.75rem', padding: '0.75rem' }}>
        {[1, 2, 3, 4].map((num) => (
          <Link
            key={num}
            to={`/docs/milestones/milestone${num}`}
            className="milestone-bento-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--ifm-background-color)',
              border: 'none',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              fontWeight: 600,
              fontSize: '1.2rem',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = 'var(--primary-color)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = 'var(--text-primary)';
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            M{num}
          </Link>
        ))}
      </div>
      <div className="bento-content">
        <h3 className="bento-title">Milestones</h3>
        <p className="bento-desc">Track our progress against major project milestones.</p>
      </div>
    </div>
  );
}

export default function BentoGrid() {
  return (
    <section className="bento-section">
      <div className="bento-grid">
        <BentoCard
          title="Meeting Minutes"
          description="Read through the minutes of our weekly meetings to stay up to date with project decisions."
          link="/minutes"
          image="/assets/meeting-minutes.svg"
          imageAlt="Illustration of a meeting minutes sheet with a checklist and pen"
          imageClassName="bento-image-full"
          className="span-2"
        />
        <BentoCard
          title="Project Calendar"
          description="View our timeline and upcoming deadlines."
          link="/calendar"
          image="/assets/project-calendar.svg"
          imageAlt="Illustration of a project calendar with milestone dates"
        />
        
        <MilestonesBentoCard id="milestones-bento" />

        <BentoCard
          title="Documentation"
          description="Read the official documentation for DocShield."
          link="/under-construction"
          image="/assets/documentation.svg"
          imageAlt="Illustration of an open documentation book with a shield"
          imageClassName="bento-image-full"
          className="span-2"
        />
      </div>
    </section>
  );
}
