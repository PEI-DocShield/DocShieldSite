import React, { useState } from 'react';
import { meetingMinutesData } from '../data/meetingMinutes';

export default function MeetingMinutesCarousel(): React.JSX.Element {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? meetingMinutesData.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === meetingMinutesData.length - 1 ? 0 : prev + 1));
  };

  const currentMeeting = meetingMinutesData[currentIndex];

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
                  <h4>Topics Discussed</h4>
                  <ul>
                    {item.topicsDiscussed.map((topic, i) => (
                      <li key={i}>{topic}</li>
                    ))}
                  </ul>
                </div>

                <div className="minimal-col">
                  <h4>Action Items</h4>
                  <ul>
                    {item.actionItems.map((action, i) => (
                      <li key={i}>
                        <strong>{action.assignee}:</strong> {action.task}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="minimal-attendees">
                <strong>Attendees:</strong> {item.attendees}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
