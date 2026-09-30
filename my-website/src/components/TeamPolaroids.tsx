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
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
