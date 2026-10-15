import React from 'react';
import Link from '@docusaurus/Link';
import '../css/docs-workspace.css';

export interface FolderItem {
  id: string;
  name: string;
  link: string;
  badge: string;
  color: string;
  accentBg: string;
  description: string;
  itemCount: number;
  filesPreview: string[];
  iconType: 'use-case' | 'checklist' | 'layers' | 'server' | 'database' | 'wireframe';
  updatedAt: string;
}

export const DOCUMENTATION_FOLDERS: FolderItem[] = [
  {
    id: 'use-cases',
    name: 'Use Cases',
    link: '/docs/documentation/use-cases',
    badge: '8 Scenarios • 2 Personas',
    color: '#25828e',
    accentBg: 'rgba(37, 130, 142, 0.12)',
    description: 'System use cases, persona profiles, and detailed step-by-step interaction flows.',
    itemCount: 10,
    filesPreview: ['Use Case Diagram', 'User Personas', 'Specifications'],
    iconType: 'use-case',
    updatedAt: 'Updated Oct 2026',
  },
  {
    id: 'requirements',
    name: 'Requirements',
    link: '/docs/documentation/requirements',
    badge: '16 FRs • 9 NFRs',
    color: '#25828e',
    accentBg: 'rgba(37, 130, 142, 0.12)',
    description: 'Comprehensive technical requirements matrix covering document ingestion and masking.',
    itemCount: 25,
    filesPreview: ['Functional Reqs', 'Non-Functional', 'Traceability Matrix'],
    iconType: 'checklist',
    updatedAt: 'Updated Oct 2026',
  },
  {
    id: 'architecture',
    name: 'Architecture',
    link: '/docs/documentation/architecture',
    badge: '4 Diagrams • Pipeline',
    color: '#25828e',
    accentBg: 'rgba(37, 130, 142, 0.12)',
    description: 'System conceptual diagrams, technology integrations, and NLP detection pipeline.',
    itemCount: 5,
    filesPreview: ['System Architecture', 'Tech Stack', 'NLP Pipeline'],
    iconType: 'layers',
    updatedAt: 'Updated Oct 2026',
  },
  {
    id: 'deployment-diagram',
    name: 'Deployment Diagram',
    link: '/docs/documentation/deployment-diagram',
    badge: 'UML Topology • Cloud',
    color: '#25828e',
    accentBg: 'rgba(37, 130, 142, 0.12)',
    description: 'Infrastructure architecture, containerized microservices, and network boundaries.',
    itemCount: 2,
    filesPreview: ['Topology UML', 'Cloud Specs', 'Network Boundaries'],
    iconType: 'server',
    updatedAt: 'Updated Oct 2026',
  },
  {
    id: 'domain-model',
    name: 'Domain Model',
    link: '/docs/documentation/domain-model',
    badge: '1 ER • 6 Core Tables',
    color: '#25828e',
    accentBg: 'rgba(37, 130, 142, 0.12)',
    description: 'Relational database schema, entity-relationship models, and token vault structures.',
    itemCount: 15,
    filesPreview: ['Domain Model ER', 'Core Tables', 'Token Vaults'],
    iconType: 'database',
    updatedAt: 'Updated Oct 2026',
  },
  {
    id: 'mockups',
    name: 'Mockups',
    link: '/docs/documentation/mockups',
    badge: '11 UI Screens',
    color: '#25828e',
    accentBg: 'rgba(37, 130, 142, 0.12)',
    description: 'High-fidelity UI mockups covering guest journeys and workspace managers.',
    itemCount: 11,
    filesPreview: ['Figma UI Screens', 'Guest Flow', 'Workspace Flow'],
    iconType: 'wireframe',
    updatedAt: 'Updated Oct 2026',
  },
];

function renderFolderIcon(type: FolderItem['iconType']): React.JSX.Element {
  switch (type) {
    case 'use-case':
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      );
    case 'checklist':
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          <path d="M9 17h6" />
        </svg>
      );
    case 'layers':
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      );
    case 'server':
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
          <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
          <line x1="6" y1="6" x2="6.01" y2="6" />
          <line x1="6" y1="18" x2="6.01" y2="18" />
        </svg>
      );
    case 'database':
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        </svg>
      );
    case 'wireframe':
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="9" y1="21" x2="9" y2="9" />
        </svg>
      );
  }
}

export default function DocsWorkspace(): React.JSX.Element {
  return (
    <div className="docs-workspace-wrapper">
      <div className="ws-window-frame">
        <div className="ws-drive-container">
          {/* Phase 2: Elaboration Phase (Current) */}
          <div className="ws-phase-section">
            <div className="ws-phase-header">
              <div className="ws-phase-title-group">
                <span className="ws-phase-badge">Phase 2</span>
                <h3 className="ws-phase-name">Elaboration Phase</h3>
                <span className="ws-phase-sep" aria-hidden="true">•</span>
                <span className="ws-phase-desc">Architecture baseline, formal specifications & technical models</span>
              </div>
              <span className="ws-phase-count">{DOCUMENTATION_FOLDERS.length} Folders</span>
            </div>

            {/* Centered Folders Grid (5 per row) */}
            <div className="ws-folders-grid">
              {DOCUMENTATION_FOLDERS.map((folder) => (
                <Link
                  key={folder.id}
                  to={folder.link}
                  className="ws-folder-3d"
                  title={folder.name}
                  aria-label={`Open folder: ${folder.name}`}
                >
                  <div className="ws-folder-construct">
                    {/* Layer 1: Back flap with top tab */}
                    <div className="ws-folder-back">
                      <div className="ws-folder-tab">
                        <span className="ws-folder-tab-label">{folder.name}</span>
                      </div>
                      <div className="ws-folder-back-body" />
                    </div>

                    {/* Layer 2: Documents tucked inside pocket */}
                    <div className="ws-folder-docs" aria-hidden="true">
                      {folder.filesPreview.slice(0, 3).map((doc, i) => (
                        <div key={i} className={`ws-folder-doc ws-folder-doc--${i}`}>
                          <div className="ws-folder-doc-header">
                            <span className="ws-folder-doc-label">{doc}</span>
                          </div>
                          <div className="ws-folder-doc-lines">
                            <div className="ws-folder-doc-line ws-folder-doc-line--1" />
                            <div className="ws-folder-doc-line ws-folder-doc-line--2" />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Layer 3: Front flap with pastel icon and metadata */}
                    <div className="ws-folder-front">
                      <div className="ws-folder-front-icon">
                        {renderFolderIcon(folder.iconType)}
                      </div>
                      <div className="ws-folder-front-meta">
                        <span>{folder.updatedAt}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Phase 3: Construction Phase (Future) */}
          <div className="ws-phase-section ws-phase-section--future">
            <div className="ws-phase-header">
              <div className="ws-phase-title-group">
                <span className="ws-phase-badge ws-phase-badge--upcoming">Phase 3</span>
                <h3 className="ws-phase-name">Construction Phase</h3>
                <span className="ws-phase-sep" aria-hidden="true">•</span>
                <span className="ws-phase-desc">Implementation details, source code specs, test suites & build artifacts</span>
              </div>
              <span className="ws-phase-count ws-phase-count--upcoming">Upcoming</span>
            </div>

            <div className="ws-future-phase-card">
              <div className="ws-future-phase-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
              </div>
              <div className="ws-future-phase-info">
                <h4 className="ws-future-phase-title">Construction Phase Documentation</h4>
                <p className="ws-future-phase-text">
                  To be done...
                </p>
              </div>
            </div>
          </div>

          {/* Phase 4: Transition Phase (Future) */}
          <div className="ws-phase-section ws-phase-section--future">
            <div className="ws-phase-header">
              <div className="ws-phase-title-group">
                <span className="ws-phase-badge ws-phase-badge--upcoming">Phase 4</span>
                <h3 className="ws-phase-name">Transition Phase</h3>
                <span className="ws-phase-sep" aria-hidden="true">•</span>
                <span className="ws-phase-desc">Deti4Devs, User validation, deployment manuals, operational runbooks & final handover</span>
              </div>
              <span className="ws-phase-count ws-phase-count--upcoming">Upcoming</span>
            </div>

            <div className="ws-future-phase-card">
              <div className="ws-future-phase-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div className="ws-future-phase-info">
                <h4 className="ws-future-phase-title">Transition Phase Documentation</h4>
                <p className="ws-future-phase-text">
                  To be done...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
