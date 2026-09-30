import "../css/carousel.css";
import React, { useState, useEffect } from 'react';

// Require all .md or .mdx files in the docs/minutes folder using Docusaurus' default loader
const req = require.context('../../docs/minutes', false, /\.mdx?$/);

export interface MeetingMinute {
  id: number;
  badgeTitle: string;
  topic: string;
  Content: React.ComponentType;
}

const fileContents: MeetingMinute[] = req.keys().map((key, index) => {
  const mod = req(key);
  const Content = mod.default;
  const frontMatter = mod.frontMatter || {};
  
  // Use frontMatter.title or contentTitle provided by Docusaurus MDX loader
  const rawTitle = frontMatter.title || mod.contentTitle || `Meeting ${index + 1}`;
  
  let badgeTitle = `Meeting ${index + 1}`;
  let topic = rawTitle;

  if (rawTitle.includes('—')) {
    const parts = rawTitle.split('—');
    badgeTitle = parts[0].trim();
    topic = parts.slice(1).join('—').trim();
  } else if (rawTitle.includes('-')) {
    const parts = rawTitle.split('-');
    badgeTitle = parts[0].trim();
    topic = parts.slice(1).join('-').trim();
  }

  return {
    id: index + 1,
    badgeTitle,
    topic,
    Content
  };
});

export default function MeetingMinutesViewer(): React.JSX.Element {
  const meetingMinutesData = [...fileContents];
  // Sort them so Meeting 1 is first
  meetingMinutesData.sort((a, b) => a.id - b.id);
  
  const [selectedId, setSelectedId] = useState(meetingMinutesData[0]?.id);
  const currentMeeting = meetingMinutesData.find(m => m.id === selectedId) || meetingMinutesData[0];

  const [startIndex, setStartIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setVisibleCount(1);
      else if (window.innerWidth < 1024) setVisibleCount(2);
      else setVisibleCount(3);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const maxStartIndex = Math.max(0, meetingMinutesData.length - visibleCount);

  const nextSlide = () => setStartIndex(p => Math.min(p + 1, maxStartIndex));
  const prevSlide = () => setStartIndex(p => Math.max(p - 1, 0));

  const visibleMeetings = meetingMinutesData.slice(startIndex, startIndex + visibleCount);

  return (
    <>
      {/* Top Component: Selected Minute Details in its own separated container */}
      {currentMeeting && (
        <section style={{ width: '100%' }}>
          <div className="section-container minute-detail-container" style={{ margin: '0 auto', borderRadius: '24px', alignItems: 'flex-start', textAlign: 'left' }}>
            <div className="minute-detail-view fade-in-up" style={{ border: 'none', padding: 0, boxShadow: 'none', background: 'transparent', width: '100%' }}>
              <div className="markdown-content" style={{ width: '100%' }}>
                <currentMeeting.Content />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Bottom Component: List of available minutes in its own separated container */}
      <section style={{ width: '100%' }}>
        <div className="section-container minute-slider-container" style={{ margin: '0 auto', borderRadius: '50px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', width: '100%' }}>
            <button 
              className="carousel-arrow prev-btn" 
              onClick={prevSlide} 
              disabled={startIndex === 0}
              style={{ opacity: startIndex === 0 ? 0.3 : 1, cursor: startIndex === 0 ? 'not-allowed' : 'pointer', background: 'none', border: 'none' }}
              aria-label="Previous Meetings"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
            </button>

            <div style={{ flex: 1, overflow: 'hidden', padding: '0.5rem 0' }}>
              <div 
                className="minutes-list-selector" 
                style={{ 
                  display: 'flex',
                  borderBottom: 'none', 
                  paddingBottom: 0,
                  margin: '0 -0.5rem',
                  width: `${(Math.max(visibleCount, meetingMinutesData.length) / visibleCount) * 100}%`,
                  transform: `translateX(-${startIndex * (100 / Math.max(visibleCount, meetingMinutesData.length))}%)`,
                  transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
                }}
              >
                {meetingMinutesData.map(item => (
                  <div key={item.id} style={{ width: `${100 / Math.max(visibleCount, meetingMinutesData.length)}%`, padding: '0 0.5rem' }}>
                    <button
                      className={`minute-selector-btn ${selectedId === item.id ? 'active' : ''}`}
                      onClick={() => setSelectedId(item.id)}
                      style={{ width: '100%', margin: 0, height: '100%' }}
                    >
                      <span className="minute-badge">{item.badgeTitle}</span>
                      <span className="minute-title-preview">{item.topic}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button 
              className="carousel-arrow next-btn" 
              onClick={nextSlide} 
              disabled={startIndex >= maxStartIndex}
              style={{ opacity: startIndex >= maxStartIndex ? 0.3 : 1, cursor: startIndex >= maxStartIndex ? 'not-allowed' : 'pointer', background: 'none', border: 'none' }}
              aria-label="Next Meetings"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </div>
        </div>
      </section>

    </>
  );
}
