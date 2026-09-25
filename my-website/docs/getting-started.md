---
sidebar_position: 2
title: Getting Started & Installation
---

# Getting Started & Installation

This step-by-step guide explains how to install and configure **DocShield** in your local environment or server.

## Prerequisites

- **Node.js**: >= 20.0
- **Python**: >= 3.10 (for NER and OCR modules)
- **Tesseract OCR** (optional, for processing scanned documents and images)

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/PEI-DocShield/DocShield.git
cd DocShield
```

### 2. Configure Backend Dependencies

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Create a `.env` file in the root of the project with the following settings:

```env
PORT=3000
ENVIRONMENT=development
NER_MODEL_PATH=./models/pt_core_news_lg
MAX_UPLOAD_SIZE=50MB
```

### 4. Run the Application

```bash
npm run dev
```

Access `http://localhost:3000` to start using DocShield.

