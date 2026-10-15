---
id: requirements
title: "Functional & Non-Functional Requirements"
displayed_sidebar: null
---

## Functional Requirements

### 1. Document Ingestion and Processing Modes

- **FR01 (File Upload and Format Support)**: The system must allow users to upload valid document formats (e.g., PDF, TXT, DOCX) through the web interface.
- **FR02 (Temporary Storage)**: The system must temporarily store uploaded documents during active processing sessions.
- **FR03 (Automated Anonymization Pipeline)**: For automated flows, the backend must extract raw text, send it to the NLP Detection Engine, receive detected sensitive entities, apply the chosen anonymization method, and generate the reversibility mapping.
- **FR04 (Manual Anonymization Bypass)**: The system must provide a "Manual Anonymization" option during upload that bypasses the automated NLP extraction step entirely, routing the user straight to the manual review page with the original document text intact.

### 2. Review, Editing and Manual Masking

- **FR05 (Interactive Review Interface)**: The system must present a preview interface where users can navigate and inspect documents.
- **FR06 (Direct Text Editing and State Control)**: The system must allow users to click on text to edit it directly or manually alter the anonymization/masking state of specific words or phrases.
- **FR07 (Real-time Visual Updates)**: The user interface must update the visual representation of the document in real time to reflect manual edits and masking changes.

### 3. Reversibility

- **FR08 (Selective Data Reversion)**: The system must allow users to select specific anonymized tokens and trigger a "Revert" action.
- **FR09 (Encrypted Token Validation)**: Upon a reversion request, the system must validate the request by querying the encrypted mapping corresponding to that specific token and replace it with the original value exclusively at that point.

### 4. Authentication and Persistent Storage

- **FR10 (User Authentication)**: The system must provide a secure login mechanism for users to access authenticated features via Keycloak.
- **FR11 (Encrypted Database Persistence)**: The system must allow authenticated users to save their documents and token mappings as "Workspaces", encrypting the data prior to storage in the database associated with their account.
- **FR12 (Dashboard Management)**: The system must provide a user dashboard allowing authenticated users to list saved "Workspaces" and select one to resume working on it in future sessions.

### 5. Portability (Workspace)

- **FR13 (Workspace Export)**: The system must allow users to download a portable project file ("Workspace") containing the current state, text, tokens, and edits, subsequently cleaning up associated temporary server data if applicable.
- **FR14 (Workspace Import)**: The system must allow users to upload/import a previously saved local workspace file to reconstruct the exact anonymization state and resume progress.

### 6. Audit Logging

- **FR15 (Activity Alteration Tracking)**: The system must automatically record a log message detailing every alteration made within a workspace and the corresponding document it occurred in.
- **FR16 (Persistent Audit Log Viewing)**: The system must maintain persistent audit log messages and provide an interface for the user to view the activity history of a selected workspace.

---

## Non-Functional Requirements

### 1. Performance and Scalability

- **NFR01 (Response Time for NLP Processing)**: Text extraction and initial entity recognition should complete within an acceptable threshold (< 2 seconds per page) to ensure a smooth user experience.
- **NFR02 (Client-Side Responsiveness)**: Real-time UI updates during manual text editing must render instantaneously (under 100ms) without lagging the browser.
- **NFR03 (Serverless Scalability)**: The system must execute on a serverless architecture utilizing event-driven functions to scale automatically with demand.
- **NFR04 (Technology Stack Compliance)**: The backend must deploy on AWS Lambda or Azure Functions.
- **NFR05 (Operational Efficiency)**: Infrastructure must utilize object storage and queues to minimize operational management and cost.

### 2. Security and Privacy

- **NFR06 (Data Confidentiality and Encryption)**: All user accounts and saved documents in the persistent database must be encrypted using robust cryptographic standards (AES-256-GCM envelope encryption).
- **NFR07 (Secure Transmission)**: All communications between the client web interface, the FastAPI Backend, and internal third-party NLP services must be encrypted in transit using HTTPS/TLS 1.3.

### 3. Reliability and Availability

- **NFR08 (Graceful Failure Handling)**: If the internal NLP service fails or becomes unreachable, the FastAPI backend must handle the exception gracefully, notify the user with a clear error message, and prevent data corruption.
- **NFR09 (Workspace Integrity)**: Exported and imported local workspace files must include structural checksums (SHA-256) or validation metadata to ensure that corrupted or tampered files are safely rejected by the application.
