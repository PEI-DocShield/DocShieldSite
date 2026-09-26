import React from 'react';
import Layout from '@theme/Layout';
import { calendarData } from '../data/calendarData';
import MouseProximityGrid from '../components/MouseProximityGrid';

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
      <main className="container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '3rem', marginBottom: '3rem', position: 'relative', zIndex: 1 }}>
        <div style={{ position: 'relative', textAlign: 'center', marginBottom: '1rem', marginTop: '1rem' }}>
          <div className="text-underlay" style={{ width: '100%', height: '250%' }} />
          <h2 className="section-title fade-in-up" style={{ position: 'relative', zIndex: 2, margin: 0, fontSize: '1.75rem' }}>Project Calendar</h2>
        </div>

        <section style={{ padding: '0 2rem', width: '100%' }}>
          <div className="section-container" style={{ margin: '0 auto', padding: '3rem 4rem', borderRadius: '24px', alignItems: 'flex-start', textAlign: 'left', width: '100%' }}>
            <div className="table-container fade-in-up delay-1" style={{ width: '100%', overflowX: 'auto' }}>
              <table className="calendar-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th className="highlight" style={{ padding: '1rem', borderBottom: '2px solid var(--ifm-color-emphasis-200)', textAlign: 'left' }}>Milestone</th>
                    <th style={{ padding: '1rem', borderBottom: '2px solid var(--ifm-color-emphasis-200)', textAlign: 'left' }}>Date</th>
                    <th style={{ padding: '1rem', borderBottom: '2px solid var(--ifm-color-emphasis-200)', textAlign: 'left' }}>Task List</th>
                  </tr>
                </thead>
                <tbody>
                  {calendarData.map((item) => (
                    <tr key={item.id} id={item.id} style={{ borderBottom: '1px solid var(--ifm-color-emphasis-200)' }}>
                      <td className="milestone-name" style={{ padding: '1.5rem 1rem', verticalAlign: 'top', fontWeight: 'bold', color: 'var(--primary-color, #25828e)' }}>
                        {item.name}
                      </td>
                      <td className="milestone-date" style={{ padding: '1.5rem 1rem', verticalAlign: 'top' }}>{item.date}</td>
                      <td className="milestone-tasks" style={{ padding: '1.5rem 1rem', verticalAlign: 'top' }}>
                        <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                          {item.tasks.map((task, idx) => (
                            <li key={idx} style={{ marginBottom: '0.25rem' }}>{task}</li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
