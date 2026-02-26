# Épico – Integração com Microsoft Outlook Calendar

**Produto:** Plataforma Web Unificada de Gestão de Eventos  
**Contexto:** MVP - Release 1.0  
**Versão:** 1.01  
**Data:** 10/02/2026  
**Release:** Release 1.0

---

## 1. Identificação

| Campo | Conteúdo |
|-------|----------|
| **Nome do Épico** | Integração com Microsoft Outlook Calendar |
| **ID** | EP-07 |
| **Produto / Iniciativa** | Plataforma Web Unificada de Gestão de Eventos |
| **Release** | Release 1.0 |
| **Responsável (Proposta)** | Product Owner |
| **Status** | Proposta |

---

## 2. Resumo do Épico

Integrar a plataforma de forma nativa com Microsoft Outlook Calendar para sincronização automática de eventos, criação/atualização/cancelamento de compromissos e gestão de participantes internos, garantindo que a agenda corporativa reflita automaticamente os eventos da plataforma.

---

## 3. Contexto / Problema de Negócio

- Eventos da plataforma não aparecem automaticamente na agenda corporativa (Outlook)
- Equipe interna (Marketing, Professor, Organizador) precisa adicionar eventos manualmente no calendário
- Mudanças de data/hora na plataforma não são refletidas automaticamente no Outlook
- Falta visibilidade centralizada de todos os eventos na agenda corporativa

**Pergunta de negócio que este épico endereça:**  
*"Como garantir que eventos da plataforma sejam sincronizados automaticamente com a agenda corporativa da equipe?"*

---

## 4. Proposta de Valor / Benefício

- **Para o usuário/cliente (Equipe interna):** Visibilidade automática de eventos na agenda corporativa
- **Para a organização:** Eliminação de retrabalho de cadastro manual, redução de conflitos de agenda
- **Para o ecossistema:** Integração com ferramentas já utilizadas pela organização

### 4.1 ROI (Retorno sobre o Investimento)

- **Investimento esperado:** 1 desenvolvedor backend por 2 semanas
- **Retorno esperado:** 
  - Eliminação de cadastro manual de eventos no Outlook
  - Redução de conflitos de agenda
- **Payback:** 2 meses
- **Métricas de valor:** Redução de conflitos de agenda, satisfação da equipe interna

---

## 5. Descrição Detalhada

Este épico cobre a **integração completa com Microsoft Outlook Calendar** que:

1. **Sincronização de Eventos** - Eventos publicados na plataforma são automaticamente criados no Outlook Calendar
2. **Atualização Automática** - Mudanças na plataforma (data, hora, local) refletem automaticamente no Outlook
3. **Cancelamento** - Eventos cancelados na plataforma são removidos do Outlook
4. **Participantes Internos** - Compromissos incluem Marketing, Professor, Organizador como participantes

**Escopo in scope:**  
- Integração via Microsoft Graph API
- Criação automática de compromisso no Outlook quando evento é publicado
- Atualização automática de compromisso quando evento é editado
- Cancelamento de compromisso quando evento é despublicado/cancelado
- Inclusão de participantes internos (Marketing, Professor, Organizador)
- Gestão de fusos horários
- Tratamento de erros e retries

**Escopo out of scope:**  
- Sincronização com Google Calendar
- Convites de participantes externos (alunos) no Outlook

---

## 6. Critérios de Aceite

- [ ] Evento publicado na plataforma cria compromisso no Outlook em até 5 minutos
- [ ] Mudanças de data/hora/local na plataforma atualizam compromisso no Outlook
- [ ] Evento cancelado na plataforma remove compromisso do Outlook
- [ ] Compromisso no Outlook inclui: Marketing, Professor, Organizador como participantes
- [ ] Fusos horários são gerenciados corretamente
- [ ] Retry automático em caso de falha de sincronização

---

## 7. Features Sugeridas (backlog do épico)

| ID | Nome da Feature | Descrição breve |
|----|-----------------|-----------------|
| F7.1 | Sincronização de Eventos | Criação automática de compromissos no Outlook para eventos publicados |
| F7.2 | Atualização e Cancelamento | Atualização automática de compromissos quando eventos são editados ou cancelados |
| F7.3 | Gestão de Fusos Horários | Tratamento correto de fusos horários para evitar inconsistências |

---

## 8. Pré-condições / Dependências

- EP-02 (Gestão de Eventos) deve estar implementado
- Conta Microsoft 365 corporativa configurada
- Permissões de API do Microsoft Graph configuradas

---

## 9. Riscos

| Risco | Impacto | Mitigação |
|-------|--------|------------|
| API do Microsoft Graph pode ter indisponibilidade temporária | Médio | Implementar retry com backoff exponencial; fila de sincronização |
| Limites de API (throttling) | Médio | Respeitar rate limits; implementar batching quando possível |
| Mudanças na API do Microsoft | Baixo | Monitorar changelog da Microsoft; testes automatizados |

---

## 10. Stakeholders

- **Marketing** - Visualiza eventos no Outlook
- **Professor** - Visualiza eventos aos quais foi designado
- **Organizador/Admin** - Supervisiona todos os eventos

---

## 11. Métricas de Sucesso

- **Taxa de sincronização bem-sucedida** (>98%)
- **Tempo médio de sincronização** (<5 minutos)
- **Satisfação da equipe interna** (NPS)

---

*Documento elaborado com base no template de Épico (Upstream/SAFe). Versão do template: 1.01.*
