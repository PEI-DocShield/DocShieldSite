import React, { useState, useEffect } from 'react';
import { teamData, TeamMember } from '../data/teamData';

export default function TeamPolaroids(): React.JSX.Element {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveIndex(null);
      }
    };
    const handleClickOutside = () => {
      setActiveIndex(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleCardClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  return (
    <div className="polaroids-container fade-in-up delay-1">
      {teamData.map((member: TeamMember, idx: number) => {
        const isExpanded = activeIndex === idx;
        return (
          <div
            key={member.name}
            className={`polaroid-wrapper ${isExpanded ? 'expanded' : ''}`}
            style={{ transform: `rotate(${member.rotation}deg)` }}
            onClick={(e) => handleCardClick(e, idx)}
          >
            <div className="polaroid-inner">
              {/* Front Face */}
              <div className="polaroid-front">
                <div className="polaroid-image">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <p className="polaroid-name">{member.name}</p>
              </div>

              {/* Back Face */}
              <div className="polaroid-back">
                <h3 className="back-name">{member.name}</h3>
                <span className="back-role">{member.role}</span>
                <p className="back-bio">{member.bio}</p>
                <div className="back-links">
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="GitHub"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    >
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
