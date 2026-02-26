# Épico – Sistema de Certificação

**Produto:** Plataforma Web Unificada de Gestão de Eventos  
**Contexto:** MVP - Release 1.0  
**Versão:** 1.01  
**Data:** 10/02/2026  
**Release:** Release 1.0

---

## 1. Identificação

| Campo | Conteúdo |
|-------|----------|
| **Nome do Épico** | Sistema de Certificação |
| **ID** | EP-04 |
| **Produto / Iniciativa** | Plataforma Web Unificada de Gestão de Eventos |
| **Release** | Release 1.0 |
| **Responsável (Proposta)** | Product Owner |
| **Status** | Proposta |

---

## 2. Resumo do Épico

Automatizar a geração e envio de certificados digitais em PDF para participantes que concluíram eventos, com template customizável, regras de elegibilidade baseadas em presença e sistema de auditoria completo.

---

## 3. Contexto / Problema de Negócio

- Certificados são gerados e enviados manualmente, causando atrasos e retrabalho
- Não há template padronizado, gerando inconsistência visual
- Falta rastreabilidade de quem recebeu certificado e quando
- Reenvio de certificados é trabalhoso e desorganizado

**Pergunta de negócio que este épico endereça:**  
*"Como automatizar a geração e envio de certificados para participantes, garantindo profissionalismo e rastreabilidade?"*

---

## 4. Proposta de Valor / Benefício

- **Para o usuário/cliente (Participante):** Recebimento automático e imediato do certificado após evento
- **Para a organização:** Eliminação de processo manual trabalhoso, profissionalização e rastreabilidade
- **Para o ecossistema:** Certificados padronizados agregam valor e credibilidade aos eventos

### 4.1 ROI (Retorno sobre o Investimento)

- **Investimento esperado:** 1 desenvolvedor fullstack por 2 semanas + designer para template
- **Retorno esperado:** 
  - Eliminação de 100% do trabalho manual de geração de certificados
  - Redução de 90% em solicitações de reenvio por envio imediato
  - Profissionalização e padronização dos certificados
- **Payback:** Imediato no primeiro evento
- **Métricas de valor:** 
  - Tempo de envio de certificado após evento (meta: <1 hora)
  - Taxa de sucesso de envio de e-mail
  - Número de reenvios solicitados

---

## 5. Descrição Detalhada

Este épico cobre o **sistema completo de certificação** que:

1. **Template de Certificado** - Template PDF configurável com logo, assinatura digital, campos dinâmicos (nome, evento, data, carga horária)
2. **Regras de Elegibilidade** - Sistema define automaticamente quem recebe certificado baseado em presença registrada
3. **Envio Automático** - Certificados gerados e enviados automaticamente após término do evento
4. **Reenvio e Auditoria** - Funcionalidade de reenvio individual/em massa e registro completo de todos os envios

**Escopo in scope:**  
- Template de certificado configurável (PDF)
- Geração automática de certificados após evento
- Envio automático por e-mail
- Regras de elegibilidade (presença obrigatória)
- Reenvio individual e em massa
- Log completo de envios (auditoria)
- Download de certificado na área do participante

**Escopo out of scope:**  
- Certificados físicos impressos
- Blockchain/NFT de certificados
- Validação pública de autenticidade de certificados

---

## 6. Critérios de Aceite

- [ ] Certificado é gerado automaticamente após término do evento agendado
- [ ] Apenas participantes com presença registrada recebem certificado
- [ ] Certificado é enviado por e-mail em formato PDF
- [ ] Template inclui: nome do participante, nome do evento, data, carga horária, logo, assinatura
- [ ] Organizador pode reenviar certificado para participante específico
- [ ] Organizador pode reenviar certificados em massa
- [ ] Log de auditoria registra: data/hora de envio, destinatário, status
- [ ] Participante pode baixar certificado na área logada

---

## 7. Features Sugeridas (backlog do épico)

| ID | Nome da Feature | Descrição breve |
|----|-----------------|-----------------|
| F4.1 | Geração de Certificados | Template PDF configurável com campos dinâmicos (nome, evento, data, carga horária) |
| F4.2 | Envio Automático de Certificados | Envio automático por e-mail após término do evento para participantes com presença |
| F4.3 | Reenvio e Auditoria de Certificados | Reenvio individual/em massa e log completo de todos os envios |

---

## 8. Pré-condições / Dependências

- EP-02 (Check-in/presença) deve estar implementado
- EP-03 (Participantes) deve estar implementado
- EP-06 (Sistema de e-mails) deve estar funcional
- Template de certificado deve ser fornecido pelo cliente (design)

---

## 9. Riscos

| Risco | Impacto | Mitigação |
|-------|--------|------------|
| E-mail com certificado cair em spam | Alto | Usar domínio autenticado (SPF, DKIM); instruir participantes a verificar spam |
| Template fornecido pelo cliente atrasar | Médio | Criar template provisório para desenvolvimento; validar com cliente antes de produção |
| Geração de PDF em massa pode sobrecarregar servidor | Médio | Implementar fila de processamento assíncrono |

---

## 10. Stakeholders

- **Participantes** - Recebem certificados
- **Organizador/Marketing** - Gerenciam envio e reenvio
- **Professor** - Nome pode aparecer no certificado

---

## 11. Métricas de Sucesso

- **Taxa de envio automático** (certificados enviados automaticamente / total)
- **Tempo médio de envio** após término do evento
- **Taxa de deliverability** (e-mails entregues / enviados)
- **Número de reenvios solicitados** (indicador de falhas)

---

*Documento elaborado com base no template de Épico (Upstream/SAFe). Versão do template: 1.01.*
