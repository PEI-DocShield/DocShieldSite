---
id: licensing-regulation
title: "Licensing & Regulation"
displayed_sidebar: null
---

This document covers the licensing analysis of the technologies used by DocShield and the regulatory framework that applies to it.

---

## Licenses

<div style={{ textAlign: 'center', margin: '2rem 0' }}>
  <img src={require('@site/static/milestones_imgs/m3/licenses.png').default} alt="Licenses" style={{ maxWidth: '100%', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
</div>

### 1. Permissive Licenses

Most of the technologies used by DocShield are distributed under permissive licenses (**MIT, BSD, Apache 2.0, PSF, PostgreSQL, MPL 2.0**), which allow use, modification and distribution without imposing restrictions on our own code:

- React
- Tailwind CSS
- FastAPI
- Python
- PostgreSQL
- Keycloak
- RabbitMQ
- NGINX
- Presidio
- Docker

### 2. Replaced AGPLv3 Components

Three components were licensed under **AGPLv3**, a strong copyleft license that would require the whole service to be released under the same terms. They were replaced with permissive alternatives:

| AGPLv3 component | Role | Replaced by | License |
|---|---|---|---|
| Redis | In-memory store / cache | Valkey | 3-clause BSD |
| MinIO | Object storage | SeaweedFS | BSD |
| PyMuPDF | PDF parsing | pdfplumber, pypdf, pdfminer.six | MIT/BSD |

---

## Sector-Specific Regulations

As a general-purpose document anonymization utility, this software is **not bound to a single specific sector**.

Instead of being subject to one sector's rules, the system acts as a tool to help organizations across heavily regulated sectors (e.g., healthcare providers, legal firms, financial institutions) comply with their own strict, industry-specific data handling and privacy frameworks.

---

## AI Act

Under the EU AI Act, DocShield is classified as **Minimal Risk (Support Application)**: it supports users in identifying sensitive data, and every result can be reviewed and corrected by the user before export.
