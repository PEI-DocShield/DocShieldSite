import React, { useState } from 'react';

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

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(meetingMinutesData.length / itemsPerPage);

  const nextPage = () => setCurrentPage(p => Math.min(p + 1, totalPages - 1));
  const prevPage = () => setCurrentPage(p => Math.max(p - 1, 0));

  const visibleMeetings = meetingMinutesData.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  return (
    <>
      {/* Top Component: List of available minutes in its own separated container */}
      <section style={{ padding: '0 2rem', width: '100%' }}>
        <div className="section-container" style={{ margin: '0 auto', padding: '1rem 3rem', borderRadius: '50px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', width: '100%' }}>
            <button 
              className="carousel-arrow prev-btn" 
              onClick={prevPage} 
              disabled={currentPage === 0}
              style={{ opacity: currentPage === 0 ? 0.3 : 1, cursor: currentPage === 0 ? 'not-allowed' : 'pointer', background: 'none', border: 'none' }}
              aria-label="Previous Meetings"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
            </button>

            <div className="minutes-list-selector" style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', borderBottom: 'none', paddingBottom: 0 }}>
              {visibleMeetings.map(item => (
                <button
                  key={item.id}
                  className={`minute-selector-btn ${selectedId === item.id ? 'active' : ''}`}
                  onClick={() => setSelectedId(item.id)}
                >
                  <span className="minute-badge">{item.badgeTitle}</span>
                  <span className="minute-title-preview">{item.topic}</span>
                </button>
              ))}
            </div>

            <button 
              className="carousel-arrow next-btn" 
              onClick={nextPage} 
              disabled={currentPage >= totalPages - 1}
              style={{ opacity: currentPage >= totalPages - 1 ? 0.3 : 1, cursor: currentPage >= totalPages - 1 ? 'not-allowed' : 'pointer', background: 'none', border: 'none' }}
              aria-label="Next Meetings"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </div>
        </div>
      </section>

      {/* Bottom Component: Selected Minute Details in its own separated container */}
      {currentMeeting && (
        <section style={{ padding: '0 2rem', width: '100%' }}>
          <div className="section-container" style={{ margin: '0 auto', padding: '3rem 4rem', borderRadius: '24px', alignItems: 'flex-start', textAlign: 'left' }}>
            <div className="minute-detail-view fade-in-up" style={{ border: 'none', padding: 0, boxShadow: 'none', background: 'transparent', width: '100%' }}>
              <div className="markdown-content" style={{ width: '100%' }}>
                <currentMeeting.Content />
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
