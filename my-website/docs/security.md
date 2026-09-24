---
sidebar_position: 4
title: GDPR & Data Privacy Standards
---

# GDPR & Data Privacy Standards

A conformidade com o **Regulamento Geral sobre a Proteção de Dados (RGPD)** é um pilar fundamental do DocShield.

## Princípios de Privacidade

:::important
O DocShield adota a política de **Zero Data Retention** (retenção zero de dados) quando configurado no modo estrito local.
:::

### 1. Processamento Local (On-Premise / Edge)
Todos os ficheiros submetidos para anonimização são processados temporariamente em memória RAM e eliminados imediatamente após a geração do documento anonimizado.

### 2. Criptografia em Trânsito e Repouso
Se for utilizado o modo cloud, todas as comunicações são encriptadas via **TLS 1.3** e os ficheiros temporários utilizam cifra **AES-256**.

### 3. Registos de Auditoria (Audit Logs)
O sistema gera relatórios anonimizados que indicam o número de entidades mascaradas por categoria sem guardar o conteúdo original sensível.
