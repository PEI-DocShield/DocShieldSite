---
id: data-protection
title: "Data Protection & Privacy Policy"
displayed_sidebar: null
---

This document describes which personal data DocShield collects, why it is collected, how sensitive information is anonymised or pseudonymised, how users can exercise the Right to Be Forgotten, and which security measures protect their data.

---

## Data Collected and Purpose

DocShield only collects the data it needs to work. Data is split into two groups: **account data**, which only exists for authenticated users, and **document data**, which is produced while a document is processed.

<div style={{ textAlign: 'center', margin: '2rem 0' }}>
  <img src={require('@site/static/milestones_imgs/m3/data_purpose.png').default} alt="Data collected and purpose" style={{ maxWidth: '100%', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
</div>

| Group | Data | Purpose |
|---|---|---|
| **Account** | Name, Password, Email | Authentication |
| | Internal account identifier | Linking account to workspaces |
| | Workspace name | Organising work |
| | Logs | Security detection |
| **Document** | Original File | Processing and Review |
| | Anonymised File | Delivered Output |
| | File Details | Processing and integrity validation |
| | Detected Entities | Review and selective reversion |

---

## Anonymisation and Pseudonymisation

### 1. Detection

Sensitive data is found by combining three complementary techniques:

- **Regex:** structured identifiers (NIF, NIC, IBAN, email, phone number, postcode).
- **SpaCy (NER):** unstructured entities (names, locations, organisations, dates).
- **Presidio:** orchestration, confidence scoring and overlap resolution between detectors.

### 2. Treatment

Once detected, each entity is treated with one of two approaches:

- **Pseudonymisation:** PII is replaced by consistent tokens (e.g. `[PERSON_01]`). The same value always gets the same token inside a document, and the original can be restored by the owner.
- **Anonymisation:** irreversible removal, masking or generalisation of the value.

### 3. Protection and Review

- **Vault:** the mapping between tokens and original values is encrypted with **AES-256**, using a **separate key per workspace** managed by a KMS.
- **Guest users:** there is no vault, so pseudonymised values cannot be reverted.
- **Limits:** automatic detection is not 100% accurate, so the system always includes a **review step** where the user confirms or rejects each entity.

---

## The Right to Be Forgotten

> *You decide what stays, we make sure the rest disappears.*

| # | Action | What happens |
|---|---|---|
| 01 | **Delete a document or workspace** | Original and anonymised files are removed from object storage; detected entities and token vault entries are removed from PostgreSQL; the workspace encryption key is destroyed, so any leftover encrypted copy is unreadable. |
| 02 | **Delete an account** | Removes the Keycloak identity, the User record and all its workspaces. |
| 03 | **Automatic deletion** | The `Expire_At` field purges files on schedule. |
| 04 | **Guest users** | Nothing to delete: documents live only in memory and are discarded on download or at session end. |
| 05 | **Audit log and backups** | Audit logs are deleted or anonymised together with the workspace; backups are encrypted with a fixed retention period, so deleted data expires from them. |

---

## Privacy Policy

| Principle | Commitment |
|---|---|
| **Self-hosted** | Documents never leave our infrastructure (Keycloak, PostgreSQL, spaCy, Presidio, ...). |
| **Zero tracking** | No tracking cookies, no analytics, no data sold. |
| **No model training** | Your documents train nothing. |
| **Only when legally required** | Data is disclosed only if the law demands it. |

---

## Security Measures to Protect Data

Security is applied at every step of the document's life cycle:

<div style={{ textAlign: 'center', margin: '2rem 0' }}>
  <img src={require('@site/static/milestones_imgs/m3/security_measures.png').default} alt="Security measures to protect data" style={{ maxWidth: '100%', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
</div>

1. **Upload:** secure connection (HTTPS) and file integrity check.
2. **Detect:** detection runs in an isolated service.
3. **Store:** data is encrypted, with a key per workspace protected by a KMS.
4. **Review:** only the owner can see the document, and only the selected tokens are reverted.
