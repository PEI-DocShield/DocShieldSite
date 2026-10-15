---
id: use-cases
title: "Use Cases"
displayed_sidebar: null
---

## Use Case Diagram

<div style={{ textAlign: 'center', margin: '2rem 0' }}>
  <img src={require('@site/static/milestones_imgs/DocShield-Use_Case_Diagram.png').default} alt="Use Case Diagram" style={{ maxWidth: '100%', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
</div>

---

## Personas

### The Occasional User - Francisco

Francisco is a university student who occasionally needs to anonymize personal documents, like sharing a financial breakdown, a lease agreement, or a personal report with friends, colleagues, or teachers, without leaking private details. He also wants to be able to analyze documents with LLMs without the risk of his data being leaked. He doesn't want to bother creating accounts or leaving his sensitive files permanently stored on external servers.

- **Motivation:** He wants a quick, hassle-free way to mask sensitive data on the fly, enjoy complete privacy with zero server retention, and use a portable local workspace file whenever he needs to pause and finish editing later.

### The Company's DPO - Beatriz

Beatriz is a compliance and operations manager who handles dozens of complex documents every week for her organization. She needs a reliable, centralized place to store her ongoing projects, track her progress, and easily pick up where she left off across multiple sessions.

- **Motivation:** She wants to securely log in, save her documents with robust encryption on the server, and use an efficient dashboard to manage her files, review NLP edits, selectively unmask data when preparing final reports, and when the company requires, a tool to accommodate large volumes of documents.

---

## Detailed Use Case Specifications

### UC01: Automatic document anonymization

**As a** user, **I want to** upload a document, **so that** the system can automatically process, extract, and mask sensitive information.
- **Actor**: User (Anonymous or Authenticated)
- **Pre-conditions**: The user has a valid document (PDF, TXT, …)
- **Main Flow**:
  1. The user selects and uploads the file via the web interface
  2. The system temporarily stores the document for processing
  3. The backend extracts the text from the document and sends it to the NLP Detection Engine
  4. The NLP service returns the detected sensitive entities
  5. FastAPI applies the chosen anonymization method and generates the reversibility mapping
  6. The system presents a preview interface
- **Post-conditions**: The document is presented to the user ready to be reviewed and edited.

### UC02: Manual document anonymization

**As a** user, **I want to** upload a document, **so that I** choose what I want to be anonymized.
- **Actor**: User (Anonymous or Authenticated)
- **Pre-conditions**: The user has a valid document (PDF, TXT, …)
- **Main Flow**:
  1. The user selects and uploads the file via the web interface
  2. The system temporarily stores the document for processing
  3. The user selects what text is to be anonymized
  4. The backend extracts the text that the user selected from the document and sends it to the NLP Detection Engine
  5. The NLP service returns the detected sensitive entities
  6. FastAPI applies the chosen anonymization method and generates the reversibility mapping
  7. The system presents a preview interface
- **Post-conditions**: The document is presented to the user ready to be reviewed and edited.

### UC03: Manual Post-Anonymization Review and Editing

**As a** user, **I want to** review and edit the anonymized document, **so that I** can manually correct any NLP errors or adjust the masked text.
- **Actor**: User
- **Pre-conditions**: The document has already gone through anonymization (UC01/UC02)
- **Main Flow**:
  1. The user navigates through the anonymized document in the web interface
  2. The user clicks on the text to edit it directly or to change the anonymization state of that specific word or phrase (UC05)
  3. The system updates the visual representation of the document in real time
- **Post-conditions**: The document reflects the manual changes made by the user.

### UC04: Automatic Post-Anonymization Review and Editing

**As a** user, **I want** the system to review the anonymized document and show me anonymized entities with a low confidence score, **so that I** only have to verify those ones/or ignore them and save time.
- **Actor**: User
- **Pre-conditions**: The document has already gone through anonymization (UC01/UC02)
- **Main Flow**:
  1. The system scans the entities of the anonymized document
  2. If some entity has a low confidence score it alerts the user
  3. The user can decide to ignore the alert or review that entity (it becomes a manual review - UC03)
- **Post-conditions**: The anonymized document stays the same / reflects the manual changes made by the user.

### UC05: Selective Data Reversibility

**As a** user, **I want to** selectively revert specific anonymized tokens back to their original values, **so that** only necessary details are unmasked in the final document.
- **Actor**: User
- **Pre-conditions**: The document contains anonymized data with an active mapping in the session/workspace.
- **Main Flow**:
  1. The user identifies a specific anonymized point that needs to be revealed in the final document
  2. The user clicks on the token and selects the Revert option
  3. The system validates the request by querying the encrypted mapping corresponding to that specific token
  4. The token is replaced by the original value only for that point, keeping the rest of the document protected
- **Post-conditions**: The document displays the selected original data while maintaining anonymization across the rest of the content.

### UC06: Document Management in Authenticated Mode

**As an** authenticated user, **I want to** log in and save my documents with encrypted tokens, **so that I** can securely store my work and resume it later from my dashboard.
- **Actor**: Authenticated User
- **Pre-conditions**: The user has logged into the application via Keycloak
- **Main Flow**:
  1. The user chooses to save the document and its current anonymization state (in a workspace or "not")
  2. The system encrypts the data and the token mapping with the workspace Data Encryption Key (DEK)
  3. The system saves the information in the encrypted database associated with the user's account
  4. In a future session, the user accesses their dashboard, lists the saved documents, and selects one to continue working
- **Post-conditions**: The previous state of the document is securely restored from the database.

### UC07: Export and Import of Portable Workspace

**As a** user, **I want to** download and import my portable workspace file, **so that I** can pause and continue my progress locally without using server storage.
- **Actor**: User
- **Pre-conditions**: The user is processing a document
- **Main Flow (export)**:
  1. The user clicks "Export Workspace"
  2. The system packages the current state (text, tokens, edits, SHA-256 checksums) into a local project file and downloads it to the user's computer
  3. The server cleans up associated temporary data from memory / tmpfs
- **Main Flow (import)**:
  1. In a later session, the user uploads the saved workspace file from their computer
  2. The system reads the file, verifies integrity, and reconstructs the exact anonymization state where the user left off
- **Post-conditions**: The user resumes work without depending on persistent server storage.

### UC08: See audit log of a workspace 

**As an** authenticated user, **I want to** see the logs of my activity in a selected workspace, **so that I** can keep track of what happened to the documents inside it.
- **Actor**: Authenticated User
- **Pre-conditions**: The user has a processed/processing document in an active workspace
- **Main Flow**:
  1. The user anonymizes, edits, or reverts entities in a document
  2. For each alteration the system sends a message detailing the alterations and the document in which it happened
  3. The system persists the message in the append-only audit log table
- **Post-conditions**: The user can view the complete chronological audit trail history in the workspace dashboard.
