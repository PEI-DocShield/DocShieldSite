---
sidebar_position: 3
title: Architecture & Processing Pipeline
---

# Architecture & Processing Pipeline

DocShield uses a modular architecture consisting of ingestion pipelines, Named Entity Recognition (NER), and a redaction engine.

```mermaid
graph TD
    A[Original Document] --> B[Ingestion / OCR Parsing]
    B --> C[Text Extraction]
    C --> D[NER Engine & Regex Matching]
    D --> E[Position Mapping / Bounding Boxes]
    E --> F[Text Redaction / Obfuscation]
    F --> G[Anonymized PDF/DOCX Document]
```

## Key Components

### 1. Document Ingestion Engine
Supports multiple formats:
- PDF (vectorial and scanned via OCR)
- Microsoft Word (DOCX)
- Plain text files (TXT, CSV)

### 2. Entity Recognition (NER & Regex Pipeline)
Combines heuristic regex rules (for Tax ID, IBAN, Citizen ID) with Natural Language Processing (NLP) models to identify names and addresses.

### 3. Redaction Engine
Applies opaque masks or pseudonym replacement while retaining the visual formatting and structure of the original document.

