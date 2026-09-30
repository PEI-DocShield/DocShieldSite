import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import MouseProximityGrid from '../components/MouseProximityGrid';
import { calendarData } from '../data/calendarData';

export default function CalendarPage(): React.JSX.Element {

  return (
    <Layout
      title="Project Calendar"
      description="DocShield Project Calendar and Milestones"
    >
      <MouseProximityGrid
        className="background-grid"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
        }}
      />
      <main className="container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '3rem', marginBottom: '4rem', position: 'relative', zIndex: 1, maxWidth: '1300px' }}>
        
        <div style={{ position: 'relative', textAlign: 'left', marginBottom: '1rem', marginTop: '1rem' }}>
          <div className="text-underlay" style={{ width: '100%', height: '250%' }} />
          <h2 className="fade-in-up" style={{ position: 'relative', zIndex: 2, margin: 0, fontSize: '2.5rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Project Calendar</h2>
        </div>

        {/* The Grid layout perfectly aligns all columns and allows spanning rows */}
        <div className="calendar-grid fade-in-up delay-1">
          
          {/* Header Row */}
          <div className="calendar-header">Milestone</div>
          <div className="calendar-header">Date</div>
          <div className="calendar-header">Tasks</div>

          {/* Data Rows */}
          {calendarData.map((item) => (
            <div key={item.id} style={{ display: 'contents' }}>
              
              {/* Milestone Box spans vertically across all phases */}
              <Link 
                to={item.link}
                className="calendar-milestone-link"
                style={{ 
                  gridRow: `span ${item.phases.length}`,
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = 'var(--primary-color)';
                  e.currentTarget.style.borderColor = 'var(--primary-color)';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = 'var(--text-primary)';
                  e.currentTarget.style.borderColor = 'var(--ifm-color-emphasis-300)';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                {item.name}
              </Link>
              
              {/* Phase Rows */}
              {item.phases.map((phase, idx) => (
                <React.Fragment key={idx}>
                  
                  {/* Date Box */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    backgroundColor: 'var(--ifm-background-color)',
                    border: '1px solid var(--ifm-color-emphasis-300)', 
                    borderRadius: '24px', 
                    padding: '2rem 1.5rem',
                    fontWeight: 700,
                    color: 'var(--primary-color)',
                    textAlign: 'center'
                  }}>
                    {phase.date}
                  </div>

                  {/* Tasks Box */}
                  <div style={{ 
                    backgroundColor: 'var(--ifm-background-color)',
                    border: '1px solid var(--ifm-color-emphasis-300)', 
                    borderRadius: '24px', 
                    padding: '2rem 2.5rem',
                    color: 'var(--text-primary)'
                  }}>
                    <ul style={{ margin: 0, paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {phase.tasks.map((task, tIdx) => (
                        <li key={tIdx} style={{ fontWeight: 500 }}>{task}</li>
                      ))}
                    </ul>
                  </div>

                </React.Fragment>
              ))}

            </div>
          ))}

        </div>
      </main>
    </Layout>
  );
}
