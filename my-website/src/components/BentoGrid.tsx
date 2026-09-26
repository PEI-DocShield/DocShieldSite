import React from 'react';
import Link from '@docusaurus/Link';
import './bento.css';

interface BentoCardProps {
  title: string;
  description: string;
  link: string;
  className?: string;
}

function BentoCard({ title, description, link, className }: BentoCardProps) {
  return (
    <Link to={link} className={`bento-card ${className || ''}`}>
      <div className="bento-image-placeholder"></div>
      <div className="bento-content">
        <h3 className="bento-title">{title}</h3>
        <p className="bento-desc">{description}</p>
      </div>
    </Link>
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
          className="span-2"
        />
        <BentoCard
          title="Project Calendar"
          description="View our timeline and upcoming deadlines."
          link="/calendar"
        />
        <BentoCard
          title="Milestones"
          description="Track our progress against major project milestones."
          link="/calendar"
        />
        <BentoCard
          title="Documentation"
          description="Read the official documentation for DocShield."
          link="/docs/intro"
          className="span-2"
        />
      </div>
    </section>
  );
}
