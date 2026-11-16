---
id: licensing-regulation
title: "Licensing & Regulation"
displayed_sidebar: null
---

This document covers the licensing analysis of the technologies used by DocShield, the license chosen for the project itself, and the regulatory framework that applies to it.

---

## Licenses

<div style={{ textAlign: 'center', margin: '2rem 0' }}>
  <img src={require('@site/static/milestones_imgs/m3/licenses.png').default} alt="Licenses" style={{ maxWidth: '100%', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
</div>

### 1. Inbound Dependency Audit and License Stratification

Component licenses dictate strict architectural boundaries. The stack divides into four compliance tiers:

| Tier | Licenses | Components | Obligation |
|---|---|---|---|
| **1. Permissive** | MIT, BSD, PSF, PostgreSQL | React, Tailwind CSS, FastAPI, Python, Presidio, PostgreSQL, NGINX | Retain the original copyright and license notices within the repository. No restrictions on distribution, modification or commercialization. |
| **2. Permissive with Patent Grants** | Apache 2.0 | Keycloak, Tesseract OCR, Docker | Retain `NOTICE` files if distributing compiled binaries. Provides express patent grants from contributors, protecting the project against patent litigation from upstream authors. Any modification to original source files must be explicitly stated. |
| **3. Weak Copyleft** | MPL 2.0 | RabbitMQ | File-level copyleft. The AMQP network protocol natively isolates the broker, so connecting through standard Python clients (`aio-pika`) does not trigger copyleft obligations for the application code. |
| **4. Strong Copyleft & Source-Available** | AGPLv3, RSALv2 / SSPLv1 | Redis, MinIO, PyMuPDF | Would require the surrounding code to be released under the same terms, or impose managed-service restrictions. Requires active mitigation to avoid contaminating the repository (see below). |

### 2. Critical Architectural Mitigations

The Tier 4 components introduce severe licensing constraints:

- **AGPLv3 (network copyleft):** Section 13 requires that any software modifying, embedding or tightly coupling with an AGPL service over a network discloses its surrounding source code under the same AGPLv3 terms.
- **RSALv2 / SSPLv1 (source-available):** Redis moved to non-OSI-compliant licenses with explicit managed-service restrictions. Depending on non-free software goes against academic open-source standards.

To remove these risks, the components were replaced with permissive alternatives:

| Component | License | Role | Replaced by | License |
|---|---|---|---|---|
| Redis | RSALv2 / SSPLv1 / AGPLv3 | In-memory store / cache | Valkey | BSD 3-Clause |
| MinIO | AGPLv3 | Object storage | SeaweedFS | BSD |
| PyMuPDF | AGPLv3 | PDF parsing | pdfplumber, pypdf, pdfminer.six | MIT / BSD |

**Valkey** is a Linux Foundation fork of Redis. It uses the same wire protocol, so the standard `redis-py` client keeps working while the caching layer stays fully Open Source Initiative (OSI) compliant.

### 3. Outbound Licensing Strategy

The project repository is released under the **MIT License**.

- **Rationale:** MIT avoids license collisions with the permissive inbound dependencies. It makes academic peer review, institutional reuse and unrestricted downstream deployment easy, without copyleft burdens, and lets future teams fork or commercialize the engine.
- **Execution:** a root `LICENSE` file contains the MIT text governing the original code. A `THIRD_PARTY_NOTICES.md` document gathers all upstream copyright attributions, satisfying the attribution clauses of the Tier 1 and Tier 2 dependencies in one place.

---

## Sector-Specific Regulations

- **Horizontal application:** as a general-purpose document anonymization utility, this software is **not bound to a single specific sector** (such as Healthcare or Finance).
- **Compliance enabler:** instead of being subject to one sector's rules, the system acts as a tool to help organizations across heavily regulated sectors (e.g., healthcare providers, legal firms, financial institutions) comply with their own strict, industry-specific data handling and privacy frameworks.

---

## AI Act

Under the EU AI Act, DocShield is classified as **Minimal Risk (Support Application)**: it supports users in identifying sensitive data, and every result can be reviewed and corrected by the user before export.
