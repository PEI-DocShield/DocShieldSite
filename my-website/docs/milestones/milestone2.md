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

<br/>

<div style={{ position: 'relative', width: '100%', height: '0', paddingTop: '56.2500%', paddingBottom: '0', boxShadow: '0 2px 8px 0 rgba(63,69,81,0.16)', marginTop: '1.6em', marginBottom: '0.9em', overflow: 'hidden', borderRadius: '8px', willChange: 'transform' }}>
  <iframe loading="lazy" style={{ position: 'absolute', width: '100%', height: '100%', top: '0', left: '0', border: 'none', padding: '0', margin: '0' }} src="https://www.canva.com/design/DAHXmtrowp4/AGBHEZGl5jSMtiMmuuAKyQ/view?embed" allowFullScreen={true} allow="fullscreen"></iframe>
</div>

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

> See the rest of the Use Cases in **[HERE](/docs/documentation/use-cases)**

## Requirements

> See the requirements in **[HERE](/docs/documentation/requirements)**

## Architecture

<img src={require('@site/static/milestones_imgs/architecture.png').default} alt="Architecture" />

## State of the Art

<img src={require('@site/static/milestones_imgs/state_of_art.png').default} alt="State of the Art" />

## Architecture (with technologies)

<img src={require('@site/static/milestones_imgs/architecture_tec.png').default} alt="Architecture with technologies" />

> See the architecture in detail in **[HERE](/docs/documentation/architecture)**

## Deployment Diagram

<img src={require('@site/static/milestones_imgs/deployment.png').default} alt="Deployment Diagram" />

> See the deployment diagram in detail in **[HERE](/docs/documentation/deployment-diagram)**

## Domain Model

<img src={require('@site/static/milestones_imgs/Domain_Model.png').default} alt="Domain Model" />

> See the domain model in detail in **[HERE](/docs/documentation/domain-model)**

## MockUps - Guest User

<img src={require('@site/static/milestones_imgs/mockup_guest/1.png').default} alt="MockUp Guest" />
<img src={require('@site/static/milestones_imgs/mockup_guest/3.png').default} alt="MockUp Guest" />
<img src={require('@site/static/milestones_imgs/mockup_guest/4.png').default} alt="MockUp Guest" />
<img src={require('@site/static/milestones_imgs/mockup_guest/6.png').default} alt="MockUp Guest" />

## MockUps - Signed-in User

The major diference between Signed-in Users and Guest Users, its that the signed-in user can put the files in the workspaces and manage them

<img src={require('@site/static/milestones_imgs/mockup_signed_in/1.png').default} alt="MockUp Signed-in" />
<img src={require('@site/static/milestones_imgs/mockup_signed_in/2.png').default} alt="MockUp Signed-in" />

## MockUps - Workspaces

<img src={require('@site/static/milestones_imgs/workspaces/1.png').default} alt="MockUp Workspace" />
<img src={require('@site/static/milestones_imgs/workspaces/2.png').default} alt="MockUp Workspace" />
<img src={require('@site/static/milestones_imgs/workspaces/3.png').default} alt="MockUp Workspace" />

> For the complete gallery and UI flow descriptions of the mockups see in **[HERE](/docs/documentation/mockups)**
