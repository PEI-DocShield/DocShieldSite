---
sidebar_position: 4
title: GDPR & Data Privacy Standards
---

# GDPR & Data Privacy Standards

Compliance with the **General Data Protection Regulation (GDPR)** is a core pillar of DocShield.

## Privacy Principles

:::important
DocShield adopts a **Zero Data Retention** policy when configured in strict local mode.
:::

### 1. Local Processing (On-Premise / Edge)
All files submitted for anonymization are processed temporarily in RAM and immediately deleted after generating the anonymized document.

### 2. Encryption in Transit and at Rest
If cloud mode is used, all communications are encrypted via **TLS 1.3** and temporary files use **AES-256** encryption.

### 3. Audit Logs
The system generates anonymized reports indicating the number of redacted entities by category without storing the sensitive original content.

