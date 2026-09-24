---
sidebar_position: 2
title: Getting Started & Installation
---

# Getting Started & Installation

Este guia explica passo a passo como instalar e configurar o **DocShield** no seu ambiente local ou servidor.

## Requisitos Prévios

- **Node.js**: >= 20.0
- **Python**: >= 3.10 (para módulos de NER e OCR)
- **Tesseract OCR** (opcional, para processamento de imagens e digitalizações)

## Passos de Instalação

### 1. Clonar o Repositório

```bash
git clone https://github.com/PEI-DocShield/DocShield.git
cd DocShield
```

### 2. Configurar Dependências de Backend

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3. Configurar Variáveis de Ambiente

Crie um ficheiro `.env` na raiz do projeto com as seguintes definições:

```env
PORT=3000
ENVIRONMENT=development
NER_MODEL_PATH=./models/pt_core_news_lg
MAX_UPLOAD_SIZE=50MB
```

### 4. Executar a Aplicação

```bash
npm run dev
```

Aceda a `http://localhost:3000` para utilizar o DocShield.
