---
sidebar_position: 5
title: REST API & CLI References
---

# REST API & CLI References

DocShield offers flexible interfaces for integration with existing systems via REST API and command-line interface (CLI).

## REST API Endpoints

### 1. Anonymize Document

`POST /api/v1/anonymize`

#### Headers
```http
Content-Type: multipart/form-data
Authorization: Bearer <your_api_token>
```

#### Body Parameters
- `file`: The document to anonymize.
- `mask_type`: `blackout` | `scramble` | `synthetic`.
- `entities`: List of entities to redact (e.g., `["PERSON", "NIF", "PHONE"]`).

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

The DocShield CLI allows batch document processing via terminal:

```bash
# Process a single file
docshield anonymize --input contract.pdf --output contract_anon.pdf

# Process an entire folder
docshield batch --dir ./documents/ --entities NIF,IBAN,NAME
```

