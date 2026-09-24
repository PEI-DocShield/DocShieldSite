import React, { useState } from 'react';
import rawMarkdown from '!!raw-loader!../../docs/meeting-minutes.md';

export interface MeetingMinute {
  id: number;
  badgeTitle: string;
  topic: string;
  date: string;
  duration: string;
  location: string;
  topicsDiscussed: string[];
  actionItems: Array<{ assignee: string; task: string }>;
  attendees: string;
}

function parseMarkdownMeetings(mdText: string): MeetingMinute[] {
  // Remove frontmatter
  const cleanMd = mdText.replace(/^---[\s\S]*?---/, '');
  // Split by ## sections
  const sections = cleanMd.split(/^##\s+/m).slice(1);

  return sections.map((sec, index) => {
    const lines = sec.trim().split('\n');
    const headerLine = lines[0] || '';
    
    // Header can be e.g. "Reunião 1 — Kickoff & Planeamento Milestone 1" or "Meeting 1 - Kickoff"
    let badgeTitle = `Meeting ${index + 1}`;
    let topic = headerLine;

    if (headerLine.includes('—')) {
      const parts = headerLine.split('—');
      badgeTitle = parts[0].trim();
      topic = parts.slice(1).join('—').trim();
    } else if (headerLine.includes('-')) {
      const parts = headerLine.split('-');
      badgeTitle = parts[0].trim();
      topic = parts.slice(1).join('-').trim();
    }

    let date = '';
    let duration = '';
    let location = '';
    const topicsDiscussed: string[] = [];
    const actionItems: Array<{ assignee: string; task: string }> = [];
    let attendees = '';

    let currentSection = '';

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      if (line.startsWith('###')) {
        currentSection = line.replace(/^###\s*/, '').toLowerCase();
        continue;
      }

      // Metadata bullet points
      if (line.startsWith('- **') || line.startsWith('* **')) {
        const metaMatch = line.match(/^[-*]\s*\*\*([^*]+)\*\*:\s*(.*)$/);
        if (metaMatch) {
          const key = metaMatch[1].toLowerCase().trim();
          const val = metaMatch[2].trim();

          if (key.includes('data') || key.includes('date')) date = val;
          else if (key.includes('duração') || key.includes('duration')) duration = val.startsWith('⏱') ? val : `⏱ ${val}`;
          else if (key.includes('local') || key.includes('location')) location = val;
          else if (key.includes('participantes') || key.includes('attendees')) attendees = val;
          continue;
        }
      }

      // Section items
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const itemText = line.substring(2).trim();

        if (currentSection.includes('tópicos') || currentSection.includes('topics')) {
          topicsDiscussed.push(itemText);
        } else if (currentSection.includes('tarefas') || currentSection.includes('action')) {
          const actionMatch = itemText.match(/^\*\*([^*]+)\*\*:\s*(.*)$/);
          if (actionMatch) {
            actionItems.push({ assignee: actionMatch[1].trim(), task: actionMatch[2].trim() });
          } else {
            actionItems.push({ assignee: 'Task', task: itemText });
          }
        }
      }
    }

    return {
      id: index + 1,
      badgeTitle,
      topic,
      date: date || 'N/A',
      duration: duration || '⏱ N/A',
      location: location || 'Online',
      topicsDiscussed: topicsDiscussed.length > 0 ? topicsDiscussed : ['General discussion'],
      actionItems,
      attendees: attendees || 'Tiago Vale, João Silva, Bernardo Coelho, Mª Inês Gonçalves, Eduardo Laranjeiro',
    };
  });
}

export default function MeetingMinutesCarousel(): React.JSX.Element {
  const meetingMinutesData = parseMarkdownMeetings(rawMarkdown);
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? meetingMinutesData.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === meetingMinutesData.length - 1 ? 0 : prev + 1));
  };

  const currentMeeting = meetingMinutesData[currentIndex] || meetingMinutesData[0];

  return (
    <div className="minutes-carousel-container fade-in-up delay-1">
      <div className="carousel-header">
        <button
          className="carousel-arrow prev-btn"
          onClick={prevSlide}
          aria-label="Previous Meeting"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="meeting-title-badge">
          {currentMeeting?.badgeTitle || `Meeting ${currentIndex + 1}`}
        </div>

        <button
          className="carousel-arrow next-btn"
          onClick={nextSlide}
          aria-label="Next Meeting"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <div className="carousel-slides">
        {meetingMinutesData.map((item, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={item.id}
              className={`carousel-slide ${isActive ? 'active' : ''}`}
            >
              <div className="minimal-meeting-header">
                <h3 className="meeting-topic">{item.topic}</h3>
                <div className="meeting-meta">
                  <span>{item.date}</span>
                  <span className="meta-dot">•</span>
                  <span>{item.duration}</span>
                  <span className="meta-dot">•</span>
                  <span>{item.location}</span>
                </div>
              </div>

              <div className="minimal-meeting-grid">
                <div className="minimal-col">
                  <h4>Tópicos Discutidos</h4>
                  <ul>
                    {item.topicsDiscussed.map((topic, i) => (
                      <li key={i}>{topic}</li>
                    ))}
                  </ul>
                </div>

                {item.actionItems.length > 0 && (
                  <div className="minimal-col">
                    <h4>Tarefas / Action Items</h4>
                    <ul>
                      {item.actionItems.map((action, i) => (
                        <li key={i}>
                          <strong>{action.assignee}:</strong> {action.task}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="minimal-attendees">
                <strong>Participantes:</strong> {item.attendees}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
