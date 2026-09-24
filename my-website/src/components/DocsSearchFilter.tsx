import React, { useState } from 'react';
import Link from '@docusaurus/Link';
import { docsData, DocCardItem } from '../data/docsData';

export default function DocsSearchFilter(): React.JSX.Element {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filteredDocs = docsData.filter((doc: DocCardItem) => {
    const matchesCategory = activeFilter === 'all' || doc.category === activeFilter;
    const textToSearch = `${doc.title} ${doc.desc} ${doc.badgeLabel}`.toLowerCase();
    const matchesSearch = textToSearch.includes(searchTerm.toLowerCase().trim());
    return matchesCategory && matchesSearch;
  });

  const renderIcon = (type: string) => {
    switch (type) {
      case 'guide':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        );
      case 'tech':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        );
      case 'security':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        );
      case 'api':
      default:
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        );
    }
  };

  return (
    <div className="docs-container fade-in-up delay-1">
      <div className="docs-header">
        <div className="docs-search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search documentation..."
            aria-label="Search documentation"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="docs-filter-tabs">
          <button
            className={`doc-filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All
          </button>
          <button
            className={`doc-filter-btn ${activeFilter === 'guide' ? 'active' : ''}`}
            onClick={() => setActiveFilter('guide')}
          >
            Guides
          </button>
          <button
            className={`doc-filter-btn ${activeFilter === 'tech' ? 'active' : ''}`}
            onClick={() => setActiveFilter('tech')}
          >
            Technical
          </button>
          <button
            className={`doc-filter-btn ${activeFilter === 'api' ? 'active' : ''}`}
            onClick={() => setActiveFilter('api')}
          >
            API / CLI
          </button>
        </div>
      </div>

      <div className="docs-grid">
        {filteredDocs.map((doc: DocCardItem) => (
          <div key={doc.id} className="doc-card">
            <div className="doc-card-icon">{renderIcon(doc.icon)}</div>
            <div className="doc-card-content">
              <span className={`doc-card-badge ${doc.badgeClass || ''}`}>
                {doc.badgeLabel}
              </span>
              <h3 className="doc-card-title">{doc.title}</h3>
              <p className="doc-card-desc">{doc.desc}</p>
              <Link to={doc.link} className="doc-card-link">
                View Documentation &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
