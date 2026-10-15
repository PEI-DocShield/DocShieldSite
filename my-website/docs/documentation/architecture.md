---
id: architecture
title: "Architecture"
displayed_sidebar: null
---

## High Level Architecture

<div style={{ textAlign: 'center', margin: '2rem 0' }}>
  <img src={require('@site/static/milestones_imgs/high_level_architecture.png').default} alt="High Level Architecture" style={{ maxWidth: '100%', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
</div>

Visualizes the end-to-end data processing flowchart mapping ingestion, tokenization, user review, and export life cycle:
1. **Ingestion & Validation**: File upload, MIME type verification, SHA-256 fingerprinting.
2. **Text & Coordinate Extraction**: Parsing document layout for PDF, DOCX, and TXT.
3. **Semantic Entity Detection**: Discovering PII (names, dates, tax IDs, contact details).
4. **Anonymization & Vault Mapping**: Replacing sensitive items with tokens and storing encrypted payloads.
5. **Interactive Review**: Real-time user verification, manual overrides, and selective reversion.
6. **Certified Export**: Generating sanitised documents ready for public distribution or LLM analysis.

---

## System Architecture

<div style={{ textAlign: 'center', margin: '2rem 0' }}>
  <img src={require('@site/static/milestones_imgs/architecture.png').default} alt="System Architecture" style={{ maxWidth: '100%', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
</div>

The DocShield Conceptual Architecture illustrates the boundary between client-side rendering and isolated backend processing. Documents enter through the Web Client, are routed via an API Gateway, and are split between an ephemeral NLP Detection Engine and a durable encrypted vault.

---

## State of the Art

<div style={{ textAlign: 'center', margin: '2rem 0' }}>
  <img src={require('@site/static/milestones_imgs/state_of_art.png').default} alt="State of the Art" style={{ maxWidth: '100%', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
</div>

---

## Architecture (with technologies)

<div style={{ textAlign: 'center', margin: '2rem 0' }}>
  <img src={require('@site/static/milestones_imgs/architecture_tec.png').default} alt="Architecture with technologies" style={{ maxWidth: '100%', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
</div>

The technological architecture details the production stack:
- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: FastAPI (Python 3.11) with asynchronous workers for request routing and orchestration.
- **NLP Detection Engine**: Spacy / Presidio ensemble for named entity recognition (NER), regex rules, and coordinate mapping.
- **Identity Provider**: Keycloak for authentication.
- **Object Storage**: MinIO for encrypted document storage.
- **Relational Database**: PostgreSQL for workspace metadata, token vaults, and audit logs.
