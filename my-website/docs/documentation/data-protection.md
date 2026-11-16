---
id: data-protection
title: "Data Protection & Privacy Policy"
displayed_sidebar: null
---

This document describes which personal data DocShield collects, why it is collected, how sensitive information is anonymised or pseudonymised, how users can exercise the Right to Be Forgotten, and which security measures protect their data, in line with the GDPR (RGPD).

---

## Data Collected and Purpose

DocShield only collects the data it needs to work. Data is split into two groups: **account data**, which only exists for authenticated users, and **document data**, which is produced while a document is processed.

<div style={{ textAlign: 'center', margin: '2rem 0' }}>
  <img src={require('@site/static/milestones_imgs/m3/data_purpose.png').default} alt="Data collected and purpose" style={{ maxWidth: '100%', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
</div>

### Account Data

| Data | Where it is stored | Purpose |
|---|---|---|
| Email, password, name | Keycloak | Authentication |
| Keycloak `sub` ID | `User` table | Link the account to its workspaces |
| Workspace name | `Workspace` table | Organise and resume work |
| Wrapped DEK and KMS key ID | `Workspace` table | Per-workspace encryption |
| Audit messages | `Audit_Log` table | Traceability of changes |
| Server logs | Server | Security and abuse detection |

### Document Data

| Data | Where it is stored | Purpose |
|---|---|---|
| Original file | Object storage | Processing and review |
| Anonymised file | Object storage | Delivered output |
| Filename, type, language, status, SHA-256 checksum | `Document` table | Processing and integrity validation |
| Detected entities (type, page, coordinates, confidence, replacement text) | PostgreSQL | Review and selective reversion |
| Original token values (AES-GCM encrypted) | `Token_Vault_Entry` table | Reversible anonymisation |
| Scheduled purge timestamp | `Document.Expire_At` | Deletion of files |

---

## Anonymisation and Pseudonymisation

### 1. Detection

Sensitive data (names, tax IDs, emails, phone numbers, etc.) is found by combining three complementary techniques:

- **Regex:** structured identifiers (NIF, NIC, IBAN, email, phone number, postcode).
- **SpaCy (NER):** unstructured entities (names, locations, organisations, dates).
- **Presidio:** orchestration, confidence scoring and overlap resolution between detectors.

### 2. Treatment

Once detected, each entity is treated with one of two methods:

- **Anonymisation:** the value is permanently masked (removed, masked or generalised) and the original is **not kept**.
- **Pseudonymisation:** the value is replaced by a consistent token (e.g. `[PERSON_01]`) and the original is **stored encrypted in a token vault**. The same value always gets the same token inside a document, and the original can be restored by the owner.

### 3. Protection and Review

- **Vault:** the mapping between tokens and original values is encrypted with **AES-256-GCM**, using a **separate key per workspace** protected by a KMS.
- **Guest users:** there is no vault, so their documents cannot be reversed.
- **Manual review:** the user checks the output, corrects mistakes and chooses which tokens to revert.
- **Limits:** automatic detection is not 100% accurate, so the user must review the result before sharing it.

---

## The Right to Be Forgotten

> *You decide what stays, we make sure the rest disappears.*

| # | Action | What happens |
|---|---|---|
| 01 | **Delete a document or workspace** | A single button removes, in one operation: the original and anonymised files from object storage; the document, detected entities and token vault entries from PostgreSQL; and the workspace's encryption key. Once the key is destroyed, any leftover encrypted copy is unreadable. |
| 02 | **Delete an account** | Removes the Keycloak identity, the `User` record and all of its workspaces (as above). |
| 03 | **Automatic deletion** | The `Expire_At` field purges files on schedule, so data does not stay longer than needed. |
| 04 | **Guest users** | Nothing to delete on request: documents live only in memory and are purged on download or when the session ends. |
| 05 | **Audit log** | Deleted or anonymised together with the workspace, so it does not keep personal data after erasure. |
| 06 | **Backups** | Encrypted, with a fixed retention period, so deleted data disappears from them within that period. |

---

## Privacy Policy: Sharing with Third Parties

**Short answer:** no personal data or document content is shared with third parties.

| Principle | Commitment |
|---|---|
| **Self-hosted** | Keycloak, PostgreSQL, object storage, spaCy and Presidio are open-source components that we host ourselves, so documents are never sent to an external API or LLM. |
| **Zero tracking** | No advertising or analytics: no tracking cookies, and no data sold or used for marketing. |
| **No model training** | Documents and outputs are not used to train models. |
| **Only when legally required** | Data is disclosed only if the law requires it. |
| **The user's own sharing** | What the user does with the anonymised output (for example, sending it to an LLM) is their responsibility. |

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

### Encryption

- **In transit:** TLS 1.3 for external traffic and mutual TLS (mTLS) between internal services.
- **At rest:**
  - AES-256-GCM envelope encryption, with a separate key per workspace.
  - Workspace keys protected by a Master Key in a KMS.
  - Encrypted PostgreSQL volumes and object storage buckets (SSE-KMS).
- **Token vault:** original values stored encrypted, with a unique nonce per entry and key versioning for rotation.

### Access Control

- **Authentication:** Keycloak with OAuth2 and OpenID Connect, issuing JWT sessions.
- **Isolation:** each user can only access their own workspaces and documents.
- **Reversion:** only authenticated users can re-identify data, and only for the tokens they select.
- **Passwords:** handled by Keycloak, never stored in our own database.

### Data Protection by Design

- **Guest mode:** documents kept only in RAM and purged after download or session end.
- **NLP engine:** detection runs separately from durable storage.
- **Minimisation:** our database stores the Keycloak ID, not the email.

### Integrity and Monitoring

- **Checksums:** SHA-256 on uploads and on exported or imported workspace files, so altered files are rejected.
- **Audit log:** every change in a workspace is recorded.
- **Error handling:** if the NLP service fails, the backend reports an error without corrupting data.
