import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import BackgroundWaves from '../components/BackgroundWaves';
import MeetingMinutesCarousel from '../components/MeetingMinutesCarousel';
import TeamPolaroids from '../components/TeamPolaroids';
import DocsSearchFilter from '../components/DocsSearchFilter';
import { calendarData } from '../data/calendarData';

export default function Home(): React.JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={siteConfig.title}
      description={siteConfig.tagline}
    >
      <BackgroundWaves />

      {/* Hero Section */}
      <main className="hero-custom">
        <div className="hero-content">
          <h1 className="fade-in-up hero-title">
            Progresso{' '}
            <img
              src="/assets/logoCompleta.png"
              alt="DocShield"
              className="hero-logo-img"
            />
          </h1>
          <p className="fade-in-up delay-1 hero-subtitle">
            Uma ferramenta fácil e prática concebida para anonimizar documentos
            confidenciais de forma segura e eficiente.
          </p>
          <div className="hero-buttons fade-in-up delay-2">
            <a href="#calendar" className="btn-custom btn-primary-custom">
              Ver Milestones
            </a>
            <Link to="/docs/intro" className="btn-custom btn-secondary-custom">
              Ler Documentação
            </Link>
          </div>
        </div>
      </main>

      {/* Meeting Minutes Section */}
      <section id="minutes" className="section-custom">
        <div className="section-container">
          <h2 className="section-title fade-in-up">Meeting Minutes</h2>
          <MeetingMinutesCarousel />
        </div>
      </section>

      {/* Calendar Section */}
      <section id="calendar" className="section-custom">
        <div className="section-container">
          <h2 className="section-title fade-in-up">Project Calendar</h2>
          <div className="table-container fade-in-up delay-1">
            <table className="calendar-table">
              <thead>
                <tr>
                  <th className="highlight">Milestone</th>
                  <th>Date</th>
                  <th>Task List</th>
                </tr>
              </thead>
              <tbody>
                {calendarData.map((item) => (
                  <tr key={item.id} id={item.id}>
                    <td className="milestone-name">
                      <a href={item.link}>{item.name}</a>
                    </td>
                    <td className="milestone-date">{item.date}</td>
                    <td className="milestone-tasks">
                      <ul>
                        {item.tasks.map((task, idx) => (
                          <li key={idx}>{task}</li>
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

      {/* Team Section */}
      <section id="team" className="section-custom">
        <div className="section-container">
          <h2 className="section-title fade-in-up">Project Team</h2>
          <TeamPolaroids />
        </div>
      </section>

      {/* Documentation Section */}
      <section id="documentation" className="section-custom">
        <div className="section-container">
          <h2 className="section-title fade-in-up">Documentation</h2>
          <DocsSearchFilter />
        </div>
      </section>
    </Layout>
  );
}
