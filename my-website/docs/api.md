---
sidebar_position: 5
title: REST API & CLI References
---

# REST API & CLI References

O DocShield oferece interfaces flexíveis para integração com sistemas existentes via API REST e linha de comandos (CLI).

## REST API Endpoints

### 1. Anonimizar Documento

`POST /api/v1/anonymize`

#### Headers
```http
Content-Type: multipart/form-data
Authorization: Bearer <seu_token_api>
```

#### Body Parameters
- `file`: O documento a anonimizar.
- `mask_type`: `blackout` | `scramble` | `synthetic`.
- `entities`: Lista de entidades a remover (ex: `["PERSON", "NIF", "PHONE"]`).

#### Response Example
```json
{
  "status": "success",
  "document_id": "doc_8f9a2b",
  "entities_found": {
    "PERSON": 4,
    "NIF": 2,
    "EMAIL": 1
  },
  "download_url": "/api/v1/download/doc_8f9a2b"
}
```

---

## CLI Usage

O DocShield CLI permite processar lotes de documentos via terminal:

```bash
# Processar um ficheiro único
docshield anonymize --input contrato.pdf --output contrato_anon.pdf

# Processar uma pasta inteira
docshield batch --dir ./documentos/ --entities NIF,IBAN,NAME
```
