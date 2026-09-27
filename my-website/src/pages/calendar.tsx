import React from 'react';
import Layout from '@theme/Layout';
import { usePluginData } from '@docusaurus/useGlobalData';
import MouseProximityGrid from '../components/MouseProximityGrid';

interface MilestonePhase {
  date: string;
  tasks: string[];
}

interface MilestoneData {
  id: string;
  name: string;
  link: string;
  order: number;
  phases: MilestonePhase[];
}

// Load milestone markdown files directly into the module graph so HMR updates instantly on edit
const req = require.context('../../docs/milestones', false, /\.mdx?$/);

function getMilestonesFromModules(): MilestoneData[] {
  const items: MilestoneData[] = [];
  req.keys().forEach((key) => {
    const mod = req(key);
    const data = mod.frontMatter || {};
    if (data.milestone_name && data.phases) {
      const docId = data.id || key.replace('./', '').replace(/\.mdx?$/, '');
      items.push({
        id: docId,
        name: data.milestone_name,
        link: `/docs/milestones/${docId}`,
        order: data.order ?? 99,
        phases: data.phases,
      });
    }
  });
  return items.sort((a, b) => a.order - b.order);
}

export default function CalendarPage(): React.JSX.Element {
  let milestones: MilestoneData[] = [];
  try {
    milestones = getMilestonesFromModules();
  } catch (err) {
    const globalData = usePluginData('docusaurus-plugin-milestones') as { milestones: MilestoneData[] };
    milestones = globalData?.milestones || [];
  }

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
        <div className="calendar-grid fade-in-up delay-1" style={{ 
          display: 'grid', 
          gridTemplateColumns: '15% 25% 1fr', 
          gap: '1.5rem', 
          width: '100%',
          alignItems: 'stretch'
        }}>
          
          {/* Header Row */}
          <div style={{ 
            backgroundColor: 'var(--primary-color)', 
            color: 'white', 
            padding: '1rem', 
            borderRadius: '12px', 
            textAlign: 'center', 
            fontWeight: 700, 
            letterSpacing: '2px', 
            textTransform: 'uppercase' 
          }}>
            Milestone
          </div>
          <div style={{ 
            backgroundColor: 'var(--primary-color)', 
            color: 'white', 
            padding: '1rem', 
            borderRadius: '12px', 
            textAlign: 'center', 
            fontWeight: 700, 
            letterSpacing: '2px', 
            textTransform: 'uppercase' 
          }}>
            Date
          </div>
          <div style={{ 
            backgroundColor: 'var(--primary-color)', 
            color: 'white', 
            padding: '1rem', 
            borderRadius: '12px', 
            textAlign: 'center', 
            fontWeight: 700, 
            letterSpacing: '2px', 
            textTransform: 'uppercase' 
          }}>
            Tasks
          </div>

          {/* Data Rows */}
          {milestones.map((item) => (
            <div key={item.id} style={{ display: 'contents' }}>
              
              {/* Milestone Box spans vertically across all phases */}
              <div style={{ 
                gridRow: `span ${item.phases.length}`,
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundColor: 'var(--ifm-background-color)',
                border: '1px solid var(--ifm-color-emphasis-300)', 
                borderRadius: '24px', 
                padding: '2rem 1rem',
                fontSize: '1.5rem',
                fontWeight: 800,
                color: 'var(--text-primary)'
              }}>
                {item.name}
              </div>
              
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
