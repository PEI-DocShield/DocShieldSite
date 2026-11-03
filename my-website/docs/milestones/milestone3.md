---
id: milestone3
title: "Milestone 3: Construction"
displayed_sidebar: null
milestone_name: M3
order: 3
phases:
  - date: "13 october - 3 november"
    tasks:
      - Privacy Policy Definition
      - Licensing and Intellectual Property
      - Sector-Specific Regulation
      - Terms and Conditions
      - Usability and Digital Accessibility
      - "Frontend: Simple page with a file input and output"
      - Presentation
---

<br/>

<div style={{ position: 'relative', width: '100%', height: '0', paddingTop: '56.2500%', paddingBottom: '0', boxShadow: '0 2px 8px 0 rgba(63,69,81,0.16)', marginTop: '1.6em', marginBottom: '0.9em', overflow: 'hidden', borderRadius: '8px', willChange: 'transform' }}>
  <iframe loading="lazy" style={{ position: 'absolute', width: '100%', height: '100%', top: '0', left: '0', border: 'none', padding: '0', margin: '0' }} src="https://www.canva.com/design/DAHZee2g1Qw/9vS3vnJ529sAAM2QuQjqKg/view?embed" allowFullScreen={true} allow="fullscreen"></iframe>
</div>

## Overview

The third milestone (13 October – 3 November) focused on the legal, privacy and usability foundations of DocShield, alongside the first steps of the frontend. During this milestone, the team:

- **Mapped the data collected** by the platform and the purpose of each piece of data.
- **Defined the anonymisation and pseudonymisation strategy**, including detection, treatment and protection of sensitive data.
- **Defined how the Right to Be Forgotten is enforced** across documents, workspaces, accounts, guest sessions, logs and backups.
- **Wrote the Privacy Policy** and the **security measures** that protect user data.
- **Studied licensing and sector-specific regulation**, and wrote the **Terms and Conditions**.
- **Evaluated usability and digital accessibility**, building accessibility matrices for each step of the anonymisation flow.
- **Started the frontend**, with a simple page for file input and output.

## Data Collected and Purpose

<img src={require('@site/static/milestones_imgs/m3/data_purpose.png').default} alt="Data collected and purpose" />

## Anonymisation and Pseudonymisation

### Detection

- **Regex:** structured identifiers (NIF, NIC, IBAN, email, phone number, postcode);
- **SpaCy (NER):** unstructured entities (names, locations, organisations, dates);
- **Presidio:** orchestration, confidence scoring, overlap resolution.

### Treatment

- **Pseudonymisation:** PII replaced by consistent tokens (e.g. `[PERSON_01]`);
- **Anonymisation:** irreversible removal, masking or generalisation.

### Protection and Review

- **Vault:** AES-256, separate key per workspace (KMS). Guests: no vault, no reversal;
- **Limits:** detection is not 100% accurate, so the system has a review step.

## The Right to Be Forgotten

1. **Delete a document or workspace** – Original and anonymised files are removed from MinIO; detected entities and token vault entries are removed from PostgreSQL; the workspace encryption key is destroyed, so any leftover encrypted copy is unreadable.
2. **Delete an account** – Removes the Keycloak identity, the User record and all its workspaces.
3. **Automatic deletion** – `Expire_At` purges files on schedule.
4. **Guest users** – Nothing to delete: documents live only in memory and are discarded on download or at session end.
5. **Audit log and backups** – Audit logs are deleted or anonymised with the workspace; backups are encrypted with a fixed retention period, so deleted data expires from them.

## Privacy Policy

- **Self-hosted** – Documents never leave our infrastructure (Keycloak, MinIO, PostgreSQL, spaCy, Presidio, ...).
- **Zero tracking** – No tracking cookies, no analytics, no data sold.
- **No model training** – Your documents train nothing.
- **Only when legally required** – Data is disclosed only if the law demands it.

## Security Measures to Protect Data

<img src={require('@site/static/milestones_imgs/m3/security_measures.png').default} alt="Security measures to protect data" />

> See the full data protection and privacy documentation in **[HERE](/docs/documentation/data-protection)**

## Licenses

We analysed the licenses of the technologies used by DocShield. Most of them (React, Tailwind CSS, FastAPI, PostgreSQL, Keycloak, RabbitMQ, NGINX, Python, Presidio, Docker) use permissive licenses (**MIT, BSD, Apache 2.0, PSF, PostgreSQL, MPL 2.0**).

Three components were licensed under **AGPLv3**, so we replaced them with permissive alternatives:

| AGPLv3 | Replaced by | License |
|---|---|---|
| Redis | Valkey | 3-clause BSD |
| MinIO | SeaweedFS | BSD |
| PyMuPDF | pdfplumber, pypdf, pdfminer.six | MIT/BSD |

<img src={require('@site/static/milestones_imgs/m3/licenses.png').default} alt="Licenses" />

## Sector-Specific Regulations

As a general-purpose document anonymization utility, this software is **not bound to a single specific sector**.

Instead of being subject to one sector's rules, the system acts as a tool to help organizations across heavily regulated sectors (e.g., healthcare providers, legal firms, financial institutions) comply with their own strict, industry-specific data handling and privacy frameworks.

**AI Act:** Minimal Risk (Support Application).

> See the full licensing and regulation documentation in **[HERE](/docs/documentation/licensing-regulation)**

## Terms and Conditions

### 1. Acceptance of Terms

By using DocShield, the user agrees to these Terms and Conditions.

### 2. Conditions of Service Use

The user should take responsibility and consideration for:

- 3rd party information;
- Illegal content or malware;
- Material that violates intellectual property.

**Inappropriate conduct:**

- Attempting to bypass authentication or infrastructure security mechanisms;
- Attempting to reverse-engineer the anonymization algorithms or using the system to train competing models.

### 3. Liability Disclaimers

- The document anonymization service is provided "as is", and the creators do not guarantee 100% accuracy or complete removal of all personal data.
- The user is responsible for reviewing and validating the final anonymized documents.
- The creators are not responsible for any direct or indirect damages.

### 4. Refund / Cancellation Policy

Access to the software is currently provided for academic and non-commercial purposes free of charge; therefore, no refund policies apply.

### 5. Legal Jurisdiction

These Terms and Conditions shall be governed by and construed in accordance with the laws of Portugal (EU).

### 6. Changes to the Terms

The development team reserves the right to update or modify these terms at any time.

> See the full terms and conditions in **[HERE](/docs/documentation/terms-and-conditions)**

## Usability and Digital Accessibility

### Tools Used

1. Coblis – Color blindness simulation
2. Firefox DevTools
3. WebAIM Contrast Checker
4. NVDA (Windows)
5. Lighthouse

Reference: [thewcag.com](https://www.thewcag.com/)

### Accessibility Matrix – Upload Step

<img src={require('@site/static/milestones_imgs/m3/upload.png').default} alt="Upload step" />

<img src={require('@site/static/milestones_imgs/m3/matrix_upload.png').default} alt="Accessibility matrix - upload step" />

### Accessibility Matrix – Processing Step

<img src={require('@site/static/milestones_imgs/m3/processing.png').default} alt="Processing step" />

<img src={require('@site/static/milestones_imgs/m3/matrix_processing.png').default} alt="Accessibility matrix - processing step" />

### Accessibility Matrix – Review Step

<img src={require('@site/static/milestones_imgs/m3/review.png').default} alt="Review step" />

<img src={require('@site/static/milestones_imgs/m3/matrix_review.png').default} alt="Accessibility matrix - review step" />

### Accessibility Matrix – Download Step

<img src={require('@site/static/milestones_imgs/m3/download.png').default} alt="Download step" />

<img src={require('@site/static/milestones_imgs/m3/matrix_download.png').default} alt="Accessibility matrix - download step" />

> See the full accessibility documentation in **[HERE](/docs/documentation/accessibility)**

## Next Steps

For the next milestone (4 November – 15 December), the team plans to work on:

- **Frontend:** more anonymization techniques and other file format options;
- **Backend:** PII detection;
- Keycloak integration;
- Simple database;
- Presentation.

## Project Timeline

See our calendar in **[HERE](/DocShieldSite/calendar)**
