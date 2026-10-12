---
id: milestone2
title: "Milestone 2: Elaboration"
displayed_sidebar: null
milestone_name: M2
order: 2
phases:
  - date: "29 september - 13 october"
    tasks:
      - Requirements Gathering
      - Personas
      - User Stories
      - Deployment Diagram
      - Domain Model
      - First Mockups
      - Presentation
---

## Overview

*Content to be added...*

## Personas

### The Ocassional User - Francisco

Francisco is a university student who occasionally needs to anonymize personal documents, like sharing a financial breakdown, a lease agreement, or a personal report with friends, colleagues, or teachers, without leaking private details. He also wants to be able to analyze documents with llms without the risk of his data being leaked. He doesn’t want to bother creating accounts or leaving his sensitive files permanently stored on external servers.

- **Motivation:** He wants a quick, hassle-free way to mask sensitive data on the fly, enjoy complete privacy with zero server retention, and use a portable local workspace file whenever he needs to pause and finish editing later.

### The Company's DPO - Beatriz

Beatriz is a compliance and operations manager who handles dozens of complex documents every week for her organization. She needs a reliable, centralized place to store her ongoing projects, track her progress, and easily pick up where she left off across multiple sessions.

- **Motivation:** She wants to securely log in, save her documents  with robust encryption on the server, and use an efficient dashboard to manage her files, review NLP edits, selectively unmask data when preparing final reports, and when the company requires, a tool to accomadate large volumes of documents.

## Use Case Diagram

<img src={require('@site/static/milestones_imgs/DocShield-Use_Case_Diagram.png').default} alt="Use Case Diagram" width="500" />

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
- **Post-conditions**: The document reflects the manual changes made by the user

### UC04: Automatic Post-Anonymization Review and Editing

**As a** user, **I want** the system to review the anonymized document and show me anonymized entitites with a low confidence score, **so that I** only have to verify those ones/or ignore them and save time.
- **Actor**: User
- **Pre-conditions**: The document has already gone through anonymization (UC01/UC02)
- **Main Flow**:
  1. The system scans the entitites of the anonymized document
  2. If some entity has a low confidence score it alerts the user
  3. The user can decide to ignore the alert or review that entity (it becomes a manual review - UC03)
- **Post-conditions**: The anonymize document stays the same/reflects the manual changes made by the user

### UC05: Selective Data Reversibility

**As a** user, **I want to** selectively revert specific anonymized tokens back to their original values, **so that** only necessary details are unmasked in the final document.
- **Actor**: User
- **Pre-conditions**: The document contains anonymized data with an active mapping in the session/workspace.
- **Main Flow**:
  1. The user identifies a specific anonymized point that needs to be revealed in the final document
  2. The user clicks on the token and selects the Revert option
  3. The system validates the request by querying the encrypted mapping corresponding to that specific token
  4. The token is replaced by the original value only for that point, keeping the rest of the document protected
- **Post-conditions**: The document displays the selected original data while maintaining anonymization across the rest of the content

### UC06: Document Management in Authenticated Mode

**As an** authenticated user, **I want to** log in and save my documents with encrypted tokens, **so that I** can securely store my work and resume it later from my dashboard.
- **Actor**: Authenticated User.
- **Pre-conditions**: The user has logged into the application
- **Main Flow**:
  1. The user chooses to save the document and its current anonymization state (in a workspace or "not").
  2. The system encrypts the data and the token mapping
  3. The system saves the information in the encrypted database associated with the user’s account
  4. In a future session, the user accesses their dashboard, lists the saved documents, and selects one to continue working
- **Post-conditions**: The previous state of the document is securely restored from the database.

### UC07: Export and Import of Portable Workspace

**As a** user, **I want to** download and import my portable workspace file, **so that I** can pause and continue my progress locally without using server storage.
- **Actor**: User
- **Pre-conditions**: The user is processing a document
- **Main Flow (export)**:
  1. The user clicks “Export Workspace”.
  2. The system packages the current state (text, tokens, edits) into a local project file and downloads it to the user’s computer.
  3. The server cleans up associated temporary data (if applicable)
- **Main Flow (import)**:
  1. In a later session, the user uploads the saved workspace file from their computer.
  2. The system reads the file and reconstructs the exact anonymization state where the user left off.
- **Post-conditions**: The user resumes work without depending on persistent server storage.

### UC08: See audit log of a workspace 

**As an** authenticated user, **I want to** see the logs of my activity in a selected workspace, **so that I** can keep track of what happened to the documents inside it.
- **Actor**: User
- **Pre-conditions**: The user has to have a processed/processing document
- **Main Flow**:
  1. The user anonymizes a document
  2. For each alteration the system sends a message with the alterations and in what document happened.
  3. The system saves the message in the audit log
- **Post-conditions**: The user can see the messages in the audit log. The messages are persistent

## Functional Requirements

### Document Ingestion and Processing Modes

- **FR01 (File Upload and Format Support)**: The system must allow users to upload valid document formats (e.g., PDF, TXT) through the web interface
- **FR02 (Temporary Storage)**: The system must temporarily store uploaded documents during active processing sessions
- **FR03 (Automated Anonymization Pipeline)**: For automated flows, the backend must extract raw text, send it to the NLP Detection Engine, receive detected sensitive entities, apply the chosen anonymization method, and generate the reversibility mapping
- **FR04 (Manual Anonymization Bypass)**: The system must provide a “Manual Anonymization” option during upload that bypasses the automated NLP extraction step entirely, routing the user straight to the manual ree user straight to the manual review page with the original document text intact.

### Review, Editing and Manual Masking

- **FR05 (Interactive Review Interface)**: The system must present a preview interface where users can navigate and inspect documents.
- **FR06 (Direct Text Editing and State Control)**: The system must allow users to click on text to edit it directly or manually after the anonymization/masking state of specific words or phrases.
- **FR07 (Real-time Visual Updates)**: The user interface must update the visual representation of the document in real time to reflect manual edits and masking changes.

### Reversibility

- **FR08 (Selective Data Reversion)**: The system must allow users to select specific anonymized tokens and trigger a “Revert” action.
- **FR09 (Encrypted Token Validation)**: Upon a reversion request, the system must validate the request by querying the encrypted mapping corresponding to that specific token and replace it with the original value exclusively at that point.

### Authentication and Persistent Storage

- **FR10 (User Authentication)**: The system must provide a secure login mechanism for users to access authenticated features.
- **FR11 (Encrypted Database Persistence)**: The system must allow authenticated users to save their documents and token mappings as “Workspaces”, encrypting the data prior to storage in the database associated with their account.
- **FR12 (Dashboard Management)**: The system must provide a user dashboard allowing authenticated users to list saved “Workspaces” and select one to resume working on it in future sessions.

### Portability (Workspace)

- **FR13 (Workspace Export)**: The system must allow users to download a portable project file (“Workspace”) containing the current state, text, tokens, and edits, subsequently cleaning up associated temporary server data if applicable.
- **FR14 (Workspace Import)**: The system must allow users to upload/import a previously saved local workspace file to reconstruct the exact anonymization state and resume progress.

### Audit Logging

- **FR15 (Activity Alteration Tracking)**: The system must automatically record a log message detailing every alteration made within a workspace and the corresponding document it occurred in.
- **FR16 (Persistent Audit Log Viewing)**: The system must maintain persistent audit log messages and provide an interface for the user to view the activity history of a selected workspace.

## Non Functional Requirements

### Performance and Scalability

- **FR01 (Response Time for NLP Processing)**: Text extraction and initial entity recognition should complete within an acceptable threshold (< 2 seconds per page) to ensure a smooth user experience
- **NFR02 (Client-Side Responsiveness)**: Real-time UI updates during manual text editing must render instantaneously (under 100ms) without lagging the browser
- **NFR03 (Serverless Scalability)**: The system must execute on a serverless architecture utilizing event-driven functions to scale automatically with demand
- **NFR04 (Technology Stack Compliance)**: The backend must deploy on AWS Lambda or Azure Functions
- **NFR05 (Operational Efficiency)**: Infrastructure must utilize object storage and queues to minimize operational management and cost

### Security and Privacy

- **NFR06 (Data Confidentiality and Encryption)**: All user accounts and saved documents in the persistent database must be encrypted using robust cryptographic standards
- **NFR07 (Secure Transmission)**: All communications between the client web interface, the FastAPI Backend, and internal third-party NLP services must be encrypted in transit using HTTPS/TLS 1.3

### Reliability and Availability

- **NFR08 (Graceful Failure Handling)**: If the internal NLP service fails or becomes unreachable, the FastAPI backend must handle the exception gracefully, notify the user with a clear error message, and prevent data corruption.
- **NFR09 (Workspace Integrity)**: Exported and imported local workspace files must include structural checksums or validation metadata to ensure that corrupted or tampered files are safely rejected by the application.


## Architecture

<img src={require('@site/static/milestones_imgs/architecture.png').default} alt="Architecture" />

## State of the Art

<img src={require('@site/static/milestones_imgs/state_of_art.png').default} alt="State of the Art" />

## Architecture (with technologies)

<img src={require('@site/static/milestones_imgs/architecture_tec.png').default} alt="Architecture with technologies" />

## Deployment Diagram

<img src={require('@site/static/milestones_imgs/deployment.png').default} alt="Deployment Diagram" />

## Domain Model

<img src={require('@site/static/milestones_imgs/Domain_Model.png').default} alt="Domain Model" />

### Main Tables

#### User

Local copy of the Keycloak identity - keycloak is responsible for the login, the local copy is to attach users to their workspaces.
- *<u>ID</u>* : Keycloak sub

This only exists for authenticated users

#### Workspace

Place where documents and their tokens are “stored”
- *<u>ID</u>*, Name: identity
- User_ID (FK): the owner of the workspace.
- Created_At, Updated_At: timestamps to sort the workspaces
- Wrapped_dek: workspace data encryption key, encrypted by the KMS (Key Management Service)
- Kms_key_id: which master key in the KMS wrapped it

If the user doesn’t want to create a new workspace and just wants to anonymize a document, there will be a default workspace, that will be invisible to the user, but its where those documents are going to be.

#### Document

Metadata of the uploaded file.
- *<u>Workspace_ID</u>* : the workspace to which the document belongs
- Document_Type (FK): the file format (PDF, DOCX, TXT, …)
- Default_Anonymization_Method (FK): method that the user chooses to anonymize its document. Some entities can override this.
- Language (FK): language of the document 
- Status (FK): where it is in the pipeline (uploaded, processing, ready, …)
- Review_mode (FK): if it is automatic or manual. The automatic can later be converted to manual if the user needs to change something
- Anonymize_mode (FK): If it is automatic or manual. If the person does the anonymization by hand or let the machine do it.
- Filename: the display name
- Original_File, Anonymized_File: pointers to the files (uploaded and the one to download) that are saved in MinIO
- Created_At, Updated_At: timestamps to sort the documents inside the workspace
- Expire_At: when the document and everything associated should be deleted (?)
- Original_checksum: SHA-256 fingerprint of the original file, to detect corruption or tampering and to avoid reprocessing the same bytes

#### Detected_Entity

Sensitive text found. This serves for review and edits
- *<u>ID</u>* : identity
- Document_ID (Fk): the document where the entity belong
- Anonymization_Method (FK): this serves to override if needed the default method of the document
- Entity_Type (FK): type of data (Person, Gov, Age, …)
- Token_Vault_Entry (FK): FK to the encrypted original. If the method used isn’t reversible, it will be empty/null
- Review_State (FK): say the state of the review of an entity
- Replacement_Text: what the anonymised document shows, so that when rendering the anonymised document only touches this and not the encrypted value.
- Page_Number, Coordinates: where to highlight it in a PDF or image. The Coordinates are a jsonb - so that if an entity wraps onto a second line it will need a list of coordinates.
- Start_Char, End_Char: positions of the initial and final characters to be easier to find it in the extracted text
- Confidence: how sure the detector was that it anonymized sensitive data

#### Token_Vault_Entry

Every distinct original value in a workspace, stored encrypted. Used for the reversion process
- *<u>ID</u>* : identity
- Document_ID (FK): to which document the entry belongs 
- Payload_Cipher: the original value, encrypted with the workspace data key
- Token: the placeholder shown in the document
- Nonce: unique random value used for this encryption. It is needed to decrypt
- Key_version: which data key was used - in the beginning will always be the same, but if in the future we want to keep changing the keys (to be even more secure) it is already here

This only exists for authenticated users

#### Audit_Log

Logs to keep track of what happened in a workspace
- *<u>ID</u>*: identity
- Workspace_ID (FK): to which workspace the log belongs
- Message: what happened
- Created_At: when it happened 

### LookUp Tables

#### Language
Language of a document: PT, ENG, …

#### Review_Mode
Type of review: manual, automatic

#### Document_Type
Type of document and their needed parser: PDF, DOCX, TXT, …

#### Status
Status of a given document: uploading, processing, in review, ready

#### Anonymization_Mode
Modes of anonymization: suppression, hashing, …

#### Entity_Type
Type of sensitive data that is the entity: person, age, gov, …

#### Anonymization_Mode
Mode of anonymization: manual or automatic

#### Review_State
States in which the entities of a document are: detected, confirmed, rejected, manual, reverted

## MockUps - Guest User

<img src={require('@site/static/milestones_imgs/mockup_guest/1.png').default} alt="MockUp Guest" />
<img src={require('@site/static/milestones_imgs/mockup_guest/2.png').default} alt="MockUp Guest" />
<img src={require('@site/static/milestones_imgs/mockup_guest/3.png').default} alt="MockUp Guest" />
<img src={require('@site/static/milestones_imgs/mockup_guest/4.png').default} alt="MockUp Guest" />
<img src={require('@site/static/milestones_imgs/mockup_guest/5.png').default} alt="MockUp Guest" />
<img src={require('@site/static/milestones_imgs/mockup_guest/6.png').default} alt="MockUp Guest" />


