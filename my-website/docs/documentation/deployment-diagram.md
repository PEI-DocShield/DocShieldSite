---
id: deployment-diagram
title: "Deployment Diagram"
displayed_sidebar: null
---

<div style={{ textAlign: 'center', margin: '2rem 0' }}>
  <img src={require('@site/static/milestones_imgs/deployment.png').default} alt="Deployment Diagram" style={{ maxWidth: '100%', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
</div>

---

## Infrastructure Specifications

### 1. Web Tier (Client Application)
- **Host**: Served via CDN / NGINX reverse proxy with HTTPS/TLS 1.3 enforcement.
- **Client**: Single-Page Application (SPA) executed directly inside the user's web browser.
- **Responsibilities**: Interactive document rendering, client-side preview manipulation, local workspace file generation, and HTTPS communication with the API Gateway.

### 2. Application Tier (FastAPI Backend)
- **Container**: FastAPI application container running on Apache Cloud Stack
- **Responsibilities**: Request authentication verification, document ingestion parsing, orchestration with the NLP service, tokenization execution, and reversibility handling.

### 3. Identity and Access Management (Keycloak)
- **Container**: Keycloak IAM instance.
- **Protocol**: OAuth2 and OpenID Connect (OIDC).
- **Responsibilities**: User registration, login, password management, and JSON Web Token (JWT) session issuance.

### 4. Data Persistence Tier (PostgreSQL)
- **Node**: PostgreSQL 14 relational database instance with volume encryption.
- **Responsibilities**: Storing user workspace records, document metadata, audit logs, and encrypted token vault entries.

### 5. Object Storage (MinIO)
- **Cluster**: MinIO cluster configured with bucket-level encryption (SSE-S3 / SSE-KMS).
- **Responsibilities**: Secure storage of raw uploaded files and processed sanitized output files.

---

## Security Boundaries & Encryption

- **Transit Encryption**: Strict HTTPS with TLS 1.3 across all incoming external traffic and encrypted mutual-TLS on inter-container network calls.
- **At-Rest Envelope Encryption**: Workspace Data Encryption Keys (DEKs) are generated per workspace and encrypted with a Master Key residing in a Key Management Service (KMS).
- **Zero-Retention Mode**: When operating in guest mode, all document bytes exist exclusively in ephemeral RAM / tmpfs and are permanently purged upon download or session termination.
