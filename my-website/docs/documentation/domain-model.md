---
id: domain-model
title: "Domain Model"
displayed_sidebar: null
---

<div style={{ textAlign: 'center', margin: '2rem 0' }}>
  <img src={require('@site/static/milestones_imgs/Domain_Model.png').default} alt="Domain Model" style={{ maxWidth: '100%', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
</div>

The Domain Model represents the core relational structure of DocShield. It centers around Users, Workspaces, and Documents, with granular entity detection records and an encrypted Token Vault for selective reversibility.

---

## Main Tables

### 1. User
Local shadow copy of the Keycloak identity used to attach users to their workspaces.
- **<u>ID</u>**: Keycloak subject (sub) claim.
- *Note*: Exists only for authenticated users.

### 2. Workspace
Place where documents and their tokens are stored and isolated.
- **<u>ID</u>**, **Name**: Workspace identity.
- **User_ID** (FK): Owner of the workspace.
- **Created_At**, **Updated_At**: Timestamps to order and sort workspaces.
- **Wrapped_dek**: Workspace Data Encryption Key (DEK), encrypted by the KMS (Key Management Service).
- **Kms_key_id**: Master key identifier in KMS used to wrap the DEK.
- *Default Workspace*: For users who do not create a named workspace, a default invisible workspace manages their active session.

### 3. Document
Metadata of the uploaded and processed file.
- **<u>ID</u>**: Unique document identifier.
- **Workspace_ID** (FK): The workspace to which the document belongs.
- **Document_Type** (FK): The file format (PDF, DOCX, TXT, …).
- **Default_Anonymization_Method** (FK): Method chosen to anonymize the document (can be overridden per entity).
- **Language** (FK): Language of the document (PT, ENG, …).
- **Status** (FK): Pipeline state (uploaded, processing, in_review, ready).
- **Review_mode** (FK): Manual or automatic review mode.
- **Anonymize_mode** (FK): Automatic NLP or manual text selection.
- **Filename**: Display name.
- **Original_File**, **Anonymized_File**: Pointers to storage locations in MinIO.
- **Created_At**, **Updated_At**: Timestamps.
- **Expire_At**: Scheduled purge timestamp for ephemeral files.
- **Original_checksum**: SHA-256 fingerprint of the original file for tamper detection and avoiding duplicate processing.

### 4. Detected_Entity
Sensitive text found during extraction, used for review and manual editing.
- **<u>ID</u>**: Unique entity identifier.
- **Document_ID** (FK): The document to which the entity belongs.
- **Anonymization_Method** (FK): Overrides document default method if specified.
- **Entity_Type** (FK): Data category (PERSON, DOB, TAX_ID, LOCATION, EMAIL, PHONE, …).
- **Token_Vault_Entry** (FK): Pointer to the encrypted original value (null if irreversible masking).
- **Review_State** (FK): Review status (detected, confirmed, rejected, manual, reverted).
- **Replacement_Text**: Display text shown in the sanitized document.
- **Page_Number**, **Coordinates**: Spatial bounding box [x1, y1, x2, y2] for highlight overlays.
- **Start_Char**, **End_Char**: Character offsets in extracted text stream.
- **Confidence**: Model detection probability score.

### 5. Token_Vault_Entry
Stores encrypted original values corresponding to reversible tokens.
- **<u>ID</u>**: Unique entry identifier.
- **Document_ID** (FK): Associated document.
- **Payload_Cipher**: The sensitive original value, encrypted with the workspace DEK.
- **Token**: The placeholder shown in the document (e.g. `[PERSON_1]`).
- **Nonce**: Unique cryptographic initialization vector required for AES-GCM decryption.
- **Key_version**: Version of the DEK used during encryption.
- *Note*: Exists only for authenticated users / persistent workspaces.

### 6. Audit_Log
Immutable activity log tracking every action within a workspace.
- **<u>ID</u>**: Unique entry identifier.
- **Workspace_ID** (FK): Associated workspace.
- **Message**: Description of the modification event.
- **Created_At**: Timestamp of the alteration.

---

## LookUp Tables

- **Language**: Allowed document languages (e.g. PT, ENG, ...).
- **Review_Mode**: Type of review (manual, automatic).
- **Document_Type**: Supported document formats and parsers (PDF, DOCX, TXT, …).
- **Status**: Document lifecycle status (uploading, processing, in review, ready).
- **Anonymization_Mode**: Method of anonymization (suppression, hashing, synthetic replacement, generalization, ...).
- **Entity_Type**: Category of sensitive data (person, dob, tax_id, location, email, phone, ...).
- **Review_State**: Status of detected entity (detected, confirmed, rejected, manual, reverted).
