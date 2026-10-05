import "../css/team.css";
import React, { useState, useEffect } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { teamData, TeamMember } from '../data/teamData';

export default function TeamPolaroids(): React.JSX.Element {
  const [flippedIndexes, setFlippedIndexes] = useState<number[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setFlippedIndexes([]);
      }
    };
    const handleClickOutside = () => {
      setFlippedIndexes([]);
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
    setFlippedIndexes((prev) => 
      prev.includes(index) 
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="polaroids-container fade-in-up delay-1">
      {teamData.map((member: TeamMember, idx: number) => {
        const isExpanded = flippedIndexes.includes(idx);
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
                  {member.image ? (
                    <img 
                      src={useBaseUrl(member.image)} 
                      alt={`${member.name} photo`} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  ) : (
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
                  )}
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
                    <span className="team-github-icon"></span>
                  </a>
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="LinkedIn"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg
                        className="team-linkedin-icon"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        fill="currentColor"
                      >
                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
