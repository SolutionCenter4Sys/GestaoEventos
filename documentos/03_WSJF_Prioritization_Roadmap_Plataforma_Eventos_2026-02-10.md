# Value Stream Map – Matriz de Priorização [WSJF]

**Projeto / Produto:** Plataforma Web Unificada de Gestão de Eventos  
**Cliente:** Instituição de Ensino em Estética / Odontologia  
**Código do projeto:** PGE-2026-001  
**Versão:** 1.01  
**Data:** 10/02/2026

---

## Instruções de uso

- **WSJF (Weighted Shortest Job First):** priorização pelo maior valor econômico
- **Critérios (escala Fibonacci 1–20):**
  - **Valor para usuário/negócio**: Impacto no mercado e demanda
  - **Criticidade de tempo**: Urgência e risco de perda de valor
  - **Redução de risco**: Qualidade, conformidade, segurança (LGPD)
  - **Custo Estimado**: Esforço relativo (Story Points)
- **WSJF = (Valor + Criticidade + Redução de Risco) / Custo Estimado**
- **Classificação:** MVP | Fase 2 | Fase 3 | Parking Lot

---

## Legenda WSJF

**Custo do Atraso** (soma dos fatores, escala Fibonacci 1–20):

| Fator | Descrição breve |
|-------|------------------|
| **Valor para usuário/negócio** | Impacto no mercado e demanda do cliente |
| **Criticidade de tempo** | Prazos e risco de perda de valor |
| **Redução de risco** | Qualidade, conformidade, segurança (LGPD) |

**Duração:** Esforço relativo em Story Points (baseado em Fibonacci)

**WSJF = Custo do Atraso / Duração** → **Maior score = Maior prioridade**

---

## 1. Lista de Itens Priorizados (34 Features)

### 1.1 Features por Épico com Análise WSJF

| ID | Feature | Valor Negócio | Critic. Tempo | Red. Risco | **Custo Atraso** | Custo (SP) | **WSJF** | Fase Sugerida |
|----|---------|---------------|---------------|------------|------------------|------------|----------|---------------|
| **EP-08-F8.1** | Sistema de Autenticação | 20 | 20 | 20 | **60** | 8 | **7.50** | MVP |
| **EP-08-F8.4** | Conformidade LGPD | 13 | 20 | 20 | **53** | 13 | **4.08** | MVP |
| **EP-08-F8.2** | Controle de Acesso (RBAC) | 20 | 20 | 13 | **53** | 8 | **6.63** | MVP |
| **EP-06-F6.2** | Gatilhos Automáticos | 13 | 13 | 8 | **34** | 8 | **4.25** | MVP |
| **EP-01-F1.2** | Workflow de Aprovação | 13 | 13 | 8 | **34** | 13 | **2.62** | MVP |
| **EP-02-F2.1** | CRUD de Eventos | 20 | 13 | 5 | **38** | 13 | **2.92** | MVP |
| **EP-01-F1.1** | Formulário de Solicitação | 13 | 13 | 5 | **31** | 8 | **3.88** | MVP |
| **EP-02-F2.2** | Controle de Capacidade | 13 | 13 | 8 | **34** | 8 | **4.25** | MVP |
| **EP-03-F3.1** | Formulário Inscrição Público | 20 | 13 | 5 | **38** | 8 | **4.75** | MVP |
| **EP-06-F6.1** | Templates de E-mail | 8 | 8 | 3 | **19** | 5 | **3.80** | MVP |
| **EP-08-F8.3** | Auditoria e Logs | 8 | 13 | 13 | **34** | 8 | **4.25** | MVP |
| **EP-05-F5.1** | Cadastro Paciente Modelo | 13 | 13 | 20 | **46** | 8 | **5.75** | MVP |
| **EP-05-F5.2** | Documentos Paciente (Anamnese) | 13 | 13 | 20 | **46** | 8 | **5.75** | MVP |
| **EP-05-F5.3** | Área Professor (Upload Fotos) | 13 | 13 | 13 | **39** | 8 | **4.88** | MVP |
| **EP-05-F5.4** | Workflow de Documentos | 13 | 13 | 13 | **39** | 8 | **4.88** | MVP |
| **EP-04-F4.1** | Geração de Certificados | 13 | 13 | 5 | **31** | 13 | **2.38** | MVP |
| **EP-03-F3.2** | Área do Participante | 13 | 8 | 5 | **26** | 13 | **2.00** | MVP |
| **EP-06-F6.3** | Log e Auditoria de E-mails | 5 | 8 | 8 | **21** | 5 | **4.20** | MVP |
| **EP-02-F2.3** | Lista de Espera | 8 | 8 | 3 | **19** | 8 | **2.38** | Fase 2 |
| **EP-02-F2.4** | Check-in e Presença | 13 | 8 | 5 | **26** | 13 | **2.00** | Fase 2 |
| **EP-04-F4.2** | Envio Automático Certificados | 8 | 8 | 3 | **19** | 5 | **3.80** | Fase 2 |
| **EP-04-F4.3** | Reenvio e Auditoria Certificados | 5 | 5 | 5 | **15** | 5 | **3.00** | Fase 2 |
| **EP-03-F3.3** | Gestão de Participantes | 8 | 5 | 3 | **16** | 13 | **1.23** | Fase 2 |
| **EP-01-F1.3** | Comunicação Vendas/Marketing | 5 | 5 | 3 | **13** | 8 | **1.63** | Fase 2 |
| **EP-09-F9.1** | Relatórios Operacionais | 8 | 5 | 3 | **16** | 5 | **3.20** | Fase 2 |
| **EP-09-F9.2** | Exportação de Dados | 8 | 5 | 3 | **16** | 8 | **2.00** | Fase 2 |
| **EP-07-F7.1** | Sincronização Outlook | 5 | 3 | 3 | **11** | 8 | **1.38** | Fase 3 |
| **EP-07-F7.2** | Atualização/Cancelamento Outlook | 3 | 3 | 3 | **9** | 5 | **1.80** | Fase 3 |
| **EP-07-F7.3** | Gestão de Fusos Horários | 3 | 3 | 5 | **11** | 5 | **2.20** | Fase 3 |
| **EP-09-F9.3** | Dashboard Gerencial | 8 | 3 | 3 | **14** | 8 | **1.75** | Fase 3 |

---

## 2. Classificação por Fase

### 2.1 Resumo (Matriz MVP | Fase 2 | Fase 3 | Parking Lot)

| ID | Feature | MVP | Fase 2 | Fase 3 | Parking Lot |
|----|---------|-----|--------|--------|-------------|
| EP-08-F8.1 | Sistema de Autenticação | ✅ | – | – | – |
| EP-08-F8.4 | Conformidade LGPD | ✅ | – | – | – |
| EP-08-F8.2 | Controle de Acesso (RBAC) | ✅ | – | – | – |
| EP-08-F8.3 | Auditoria e Logs de Acesso | ✅ | – | – | – |
| EP-06-F6.1 | Templates de E-mail | ✅ | – | – | – |
| EP-06-F6.2 | Gatilhos Automáticos | ✅ | – | – | – |
| EP-06-F6.3 | Log e Auditoria de E-mails | ✅ | – | – | – |
| EP-01-F1.1 | Formulário de Solicitação | ✅ | – | – | – |
| EP-01-F1.2 | Workflow de Aprovação | ✅ | – | – | – |
| EP-02-F2.1 | CRUD de Eventos | ✅ | – | – | – |
| EP-02-F2.2 | Controle de Capacidade e Vagas | ✅ | – | – | – |
| EP-03-F3.1 | Formulário de Inscrição Público | ✅ | – | – | – |
| EP-03-F3.2 | Área do Participante | ✅ | – | – | – |
| EP-05-F5.1 | Cadastro Paciente Modelo | ✅ | – | – | – |
| EP-05-F5.2 | Documentos Paciente | ✅ | – | – | – |
| EP-05-F5.3 | Área Professor (Fotos) | ✅ | – | – | – |
| EP-05-F5.4 | Workflow de Documentos | ✅ | – | – | – |
| EP-04-F4.1 | Geração de Certificados | ✅ | – | – | – |
| EP-01-F1.3 | Comunicação Vendas/Marketing | – | ✅ | – | – |
| EP-02-F2.3 | Lista de Espera | – | ✅ | – | – |
| EP-02-F2.4 | Check-in e Controle de Presença | – | ✅ | – | – |
| EP-03-F3.3 | Gestão de Participantes | – | ✅ | – | – |
| EP-04-F4.2 | Envio Automático de Certificados | – | ✅ | – | – |
| EP-04-F4.3 | Reenvio e Auditoria Certificados | – | ✅ | – | – |
| EP-09-F9.1 | Relatórios Operacionais | – | ✅ | – | – |
| EP-09-F9.2 | Exportação de Dados | – | ✅ | – | – |
| EP-07-F7.1 | Sincronização Outlook | – | – | ✅ | – |
| EP-07-F7.2 | Atualização/Cancelamento Outlook | – | – | ✅ | – |
| EP-07-F7.3 | Gestão de Fusos Horários | – | – | ✅ | – |
| EP-09-F9.3 | Dashboard Gerencial | – | – | ✅ | – |

**Totais:**
- **MVP (Híbrido):** 15 features | 131 SP ⭐ **AJUSTADO após Party Mode Validation**
- **Fase 2 (Expandida):** 11 features | 89 SP
- **Fase 3:** 4 features | 31 SP
- **Parking Lot:** 0 features

**⚠️ MUDANÇA APÓS VALIDAÇÃO PARTY MODE (10/02/2026):**
EP-05 foi simplificado no MVP - apenas F5.1 (Cadastro Paciente Modelo) permanece no MVP.
F5.2, F5.3, F5.4 foram movidas para Fase 2 para reduzir risco LGPD e otimizar cronograma.

---

## 2.2 MVP (Minimum Viable Product) - 15 Features ⭐ AJUSTADO

**Objetivo:** Validar hipótese de negócio com escopo mínimo viável. Sistema funcional end-to-end com todas as funcionalidades core.

**Estratégia:** MVP Híbrido - EP-05 simplificado (apenas cadastro básico) para reduzir risco LGPD e otimizar time-to-market.

**Duração estimada:** 8-10 semanas | **Esforço:** 131 SP

### Features Priorizadas (por WSJF decrescente)

| Prioridade | ID | Feature | Descrição | WSJF | SP | Épico | Observação |
|------------|----|---------|-----------| ------|----|----|------------|
| 1º | EP-08-F8.1 | Sistema de Autenticação | Login, recuperação senha, 2FA, rate limiting | 7.50 | 8 | EP-08 | **CRÍTICO**: Fundação de tudo |
| 2º | EP-08-F8.2 | Controle de Acesso (RBAC) | 6 perfis, permissões granulares, validação | 6.63 | 8 | EP-08 | **CRÍTICO**: Segurança |
| 3º | EP-05-F5.1 | Cadastro Paciente Modelo | Formulário com dados sensíveis, LGPD, termo consentimento | 5.75 | 8 | EP-05 | **CRÍTICO**: Dados sensíveis |
| 4º | EP-05-F5.2 | Documentos Paciente | Anamnese, termo imagem, coleta online, lembretes | 5.75 | 8 | EP-05 | **CRÍTICO**: Compliance legal |
| 5º | EP-05-F5.3 | Área Professor (Fotos) | Upload fotos antes/depois, storage seguro, metadados | 4.88 | 8 | EP-05 | **CRÍTICO**: LGPD |
| 6º | EP-05-F5.4 | Workflow de Documentos | Status automáticos, aprovação manual, validação completude | 4.88 | 8 | EP-05 | **CRÍTICO**: Bloqueio evento |
| 7º | EP-03-F3.1 | Formulário Inscrição Público | Interface pública, validações, verificação vagas, QR Code | 4.75 | 8 | EP-03 | **CORE**: Interface principal |
| 8º | EP-06-F6.2 | Gatilhos Automáticos | E-mails transacionais, lembretes, fila assíncrona, retry | 4.25 | 8 | EP-06 | **TRANSVERSAL**: Todos dependem |
| 9º | EP-02-F2.2 | Controle de Capacidade | Vagas máximas, cálculo disponíveis, bloqueio automático | 4.25 | 8 | EP-02 | **CORE**: Evita overbooking |
| 10º | EP-08-F8.3 | Auditoria e Logs | Registro imutável ações críticas, consulta, exportação | 4.25 | 8 | EP-08 | **LGPD**: Obrigatório |
| 11º | EP-06-F6.3 | Log e Auditoria E-mails | Registro todos envios, deliverability, bounces | 4.20 | 5 | EP-06 | **LGPD**: Rastreabilidade |
| 12º | EP-08-F8.4 | Conformidade LGPD | Termo consentimento, direito esquecimento, portabilidade, criptografia | 4.08 | 13 | EP-08 | **CRÍTICO**: Multas até 2% |
| 13º | EP-01-F1.1 | Formulário de Solicitação | Multi-seção, validações, draft, anexos, envio Outlook | 3.88 | 8 | EP-01 | **CORE**: Entrada pipeline |
| 14º | EP-06-F6.1 | Templates de E-mail | Editor HTML, variáveis dinâmicas, preview, identidade visual | 3.80 | 5 | EP-06 | **BASE**: Comunicação |
| 15º | EP-02-F2.1 | CRUD de Eventos | Criar, editar, visualizar, duplicar, despublicar eventos | 2.92 | 13 | EP-02 | **CORE**: Base do sistema |
| 16º | EP-01-F1.2 | Workflow de Aprovação | 5 status, transições automáticas, notificações, histórico | 2.62 | 13 | EP-01 | **CORE**: Aprovação |
| 17º | EP-04-F4.1 | Geração de Certificados | Template configurável, PDF dinâmico, código validação | 2.38 | 13 | EP-04 | **VALOR**: Diferencial |
| 18º | EP-03-F3.2 | Área do Participante | Dashboard, meus eventos, certificados, dados pessoais | 2.00 | 13 | EP-03 | **ENGAJAMENTO**: Retenção |

**⚠️ REMOVIDOS DO MVP (Movidos para Fase 2):**
- ❌ EP-05-F5.2 | Documentos Paciente (Anamnese/Termo) | 8 SP
- ❌ EP-05-F5.3 | Área Professor (Upload Fotos) | 8 SP
- ❌ EP-05-F5.4 | Workflow de Documentos | 8 SP

**Razão:** MVP Híbrido - manter apenas F5.1 (cadastro básico) no MVP para reduzir complexidade LGPD inicial.

### Épicos no MVP (consolidado)

| Épico | Features MVP | SP | % do MVP |
|-------|-------------|-----|----------|
| EP-08 | 4 features | 37 SP | 28% |
| EP-06 | 3 features | 18 SP | 14% |
| EP-02 | 2 features | 21 SP | 16% |
| EP-01 | 2 features | 21 SP | 16% |
| EP-03 | 2 features | 21 SP | 16% |
| EP-04 | 1 feature | 13 SP | 10% |
| EP-05 | **1 feature (F5.1)** | **8 SP** | **6%** ⭐ |
| **TOTAL MVP** | **15 features** | **131 SP** | **100%** |

### Justificativa do MVP

**Por que estas 18 features?**

1. **Fundação Técnica (EP-08):** Sem autenticação, RBAC, auditoria e LGPD, sistema não pode operar. Compliance LGPD é obrigatório por lei.

2. **Core do Negócio (EP-01, EP-02):** Solicitações → Aprovação → Eventos são o fluxo principal que gera valor.

3. **Interface Pública (EP-03):** Inscrições públicas são a porta de entrada de participantes (receita).

4. **Diferencial Competitivo (EP-05):** Gestão de pacientes modelo com conformidade LGPD é o MAIOR diferencial da plataforma. Sem isso, eventos de estética não podem ocorrer.

5. **Comunicação (EP-06):** Gatilhos automáticos são transversais - todos os épicos dependem de notificações.

6. **Certificação (EP-04):** Geração de certificados automatiza processo manual trabalhoso, gerando valor imediato.

---

## 2.3 Fase 2 - 11 Features ⭐ EXPANDIDA

**Objetivo:** Expansão de funcionalidades operacionais, completar EP-05 (Pacientes Modelo) e otimizações de usabilidade após validação do MVP.

**Duração estimada:** 6-8 semanas | **Esforço:** 89 SP

| Prioridade | ID | Feature | Descrição | WSJF | SP | Observação |
|------------|----|---------|-----------| ------|----|----|
| 1º | EP-05-F5.2 | Documentos Paciente | Anamnese, termo imagem, coleta online, lembretes | 5.75 | 8 | ⭐ **MOVIDO DO MVP** |
| 2º | EP-05-F5.3 | Área Professor (Fotos) | Upload fotos antes/depois, storage seguro | 4.88 | 8 | ⭐ **MOVIDO DO MVP** |
| 3º | EP-05-F5.4 | Workflow de Documentos | Status automáticos, aprovação, validação completude | 4.88 | 8 | ⭐ **MOVIDO DO MVP** |
| 4º | EP-09-F9.1 | Relatórios Operacionais | 5 relatórios (presença, inscritos, docs, certificados, solicitações) | 3.20 | 5 | Operacional |
| 5º | EP-04-F4.2 | Envio Automático Certificados | E-mail com PDF anexado, link alternativo, retry | 3.80 | 5 | Automação |
| 6º | EP-04-F4.3 | Reenvio e Auditoria Certificados | Reenvio individual/massa, log completo | 3.00 | 5 | Rastreabilidade |
| 7º | EP-02-F2.3 | Lista de Espera | Fila ordenada, notificação automática, prazo confirmação | 2.38 | 8 | Maximiza ocupação |
| 8º | EP-09-F9.2 | Exportação de Dados | CSV/PDF/Excel, seleção colunas, assíncrona | 2.00 | 8 | Produtividade |
| 9º | EP-02-F2.4 | Check-in e Controle de Presença | QR Code, lista digital, dashboard real-time | 2.00 | 13 | Operação evento |
| 10º | EP-01-F1.3 | Comunicação Vendas/Marketing | Sistema comentários internos, notificações, menções | 1.63 | 8 | Colaboração |
| 11º | EP-03-F3.3 | Gestão de Participantes | Busca/filtros, edição, importação CSV, estatísticas | 1.23 | 13 | Gestão avançada |

### Justificativa Fase 2

Após MVP validado, estas features:
- **Melhoram operação** (relatórios, check-in, gestão participantes)
- **Automatizam processos** (envio certificados, lista espera)
- **Aumentam produtividade** (exportações, comunicação interna)

---

## 2.4 Fase 3 - 4 Features

**Objetivo:** Integrações externas e ferramentas analíticas avançadas.

**Duração estimada:** 3-4 semanas | **Esforço:** 31 SP

| Prioridade | ID | Feature | Descrição | WSJF | SP | Observação |
|------------|----|---------|-----------| ------|----|----|
| 1º | EP-07-F7.3 | Gestão de Fusos Horários | UTC storage, conversão automática, DST | 2.20 | 5 | Requisito Outlook |
| 2º | EP-07-F7.2 | Atualização/Cancelamento Outlook | Sync bidirecional, notificações nativas | 1.80 | 5 | Integração completa |
| 3º | EP-09-F9.3 | Dashboard Gerencial | KPIs tempo real, gráficos interativos, drill-down | 1.75 | 8 | Decisões estratégicas |
| 4º | EP-07-F7.1 | Sincronização Outlook | OAuth 2.0, Graph API, criação automática | 1.38 | 8 | Produtividade interna |

### Justificativa Fase 3

- **Nice-to-have** (não bloqueiam operação)
- **Produtividade interna** (integração Outlook beneficia equipe, não clientes)
- **Decisões estratégicas** (dashboard gerencial para direção)

---

## 2.5 Parking Lot

**Status:** Nenhum item no parking lot no momento.

**Todas as 34 features foram classificadas em MVP, Fase 2 ou Fase 3.**

---

## 3. Critérios de Classificação (Referência)

| Fase | Critério Resumido | Escopo Features |
|------|-------------------|-----------------|
| **MVP** | Máximo valor com mínimo escopo; validação de hipótese; compliance legal obrigatório | 18 features (155 SP) |
| **Fase 2** | Próxima leva de valor após MVP; otimizações operacionais e automações | 8 features (65 SP) |
| **Fase 3** | Expansão, integrações externas, ferramentas analíticas avançadas | 4 features (31 SP) |
| **Parking Lot** | Fora do roadmap atual; pode ser reavaliado futuramente | 0 features |

---

## 4. Roadmap Visual

```
┌─────────────────────────────────────────────────────────────┐
│                       ROADMAP 2026                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  MVP (Release 1.0)                                          │
│  ████████████████████ 10-12 semanas | 155 SP               │
│  Mar-Mai 2026                                               │
│  ├─ EP-08: Segurança e LGPD (37 SP)                         │
│  ├─ EP-05: Pacientes Modelo (32 SP) ⚠️ CRÍTICO             │
│  ├─ EP-06: Comunicação (18 SP)                              │
│  ├─ EP-01: Solicitações (21 SP)                             │
│  ├─ EP-02: Eventos Core (21 SP)                             │
│  ├─ EP-03: Inscrições (21 SP)                               │
│  └─ EP-04: Certificação Básica (13 SP)                      │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Fase 2 (Release 1.5)                                       │
│  ██████████ 4-6 semanas | 65 SP                             │
│  Jun-Jul 2026                                               │
│  ├─ EP-02: Lista Espera + Check-in (21 SP)                  │
│  ├─ EP-04: Certificação Automática (10 SP)                  │
│  ├─ EP-09: Relatórios e Exportações (13 SP)                 │
│  ├─ EP-03: Gestão Participantes (13 SP)                     │
│  └─ EP-01: Comunicação Interna (8 SP)                       │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Fase 3 (Release 2.0)                                       │
│  ██████ 3-4 semanas | 31 SP                                 │
│  Ago-Set 2026                                               │
│  ├─ EP-07: Integração Outlook (18 SP)                       │
│  └─ EP-09: Dashboard Gerencial (8 SP)                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘

TOTAL: 17-22 semanas (4-6 meses) | 251 SP | 30 features
```

---

## 5. Métricas e Estimativas

### 5.1 Esforço por Fase

| Fase | Features | Story Points | % Total | Duração (semanas) | Equipe |
|------|----------|-------------|---------|-------------------|--------|
| MVP Híbrido ⭐ | 15 | 131 SP | 52% | 8-10 | 3 devs + 1 UX |
| Fase 2 Expandida ⭐ | 11 | 89 SP | 35% | 6-8 | 3 devs + 1 UX |
| Fase 3 | 4 | 31 SP | 12% | 3-4 | 3 devs |
| **TOTAL** | **30** | **251 SP** | **100%** | **17-22** | **3 devs + 1 UX** |

**⭐ Mudança após Party Mode Validation:** MVP reduzido para 15 features, Fase 2 expandida com 3 features de EP-05.

**Nota:** 4 features (EP-07) foram priorizadas para Fase 3 (nice-to-have).

### 5.2 Investimento Estimado

| Fase | Recurso | Quantidade | Período | Custo (R$) |
|------|---------|-----------|---------|-----------|
| **MVP Híbrido** ⭐ | Desenvolvedor Fullstack | 3 | 10 semanas | R$ 150.000 |
| | UX/UI Designer | 1 | 10 semanas | R$ 50.000 |
| | Product Owner | 1 (part-time) | 10 semanas | R$ 25.000 |
| | Tech Lead | 1 (part-time) | 10 semanas | R$ 25.000 |
| | **Subtotal MVP** | | | **R$ 250.000** |
| **Fase 2 Expandida** ⭐ | Desenvolvedor Fullstack | 3 | 8 semanas | R$ 120.000 |
| | UX/UI Designer | 1 | 8 semanas | R$ 40.000 |
| | **Subtotal Fase 2** | | | **R$ 160.000** |
| **Fase 3** | Desenvolvedor Fullstack | 3 | 4 semanas | R$ 60.000 |
| | **Subtotal Fase 3** | | | **R$ 60.000** |
| **TOTAL DESENVOLVIMENTO** | | | | **R$ 470.000** |

**Outros Custos:**
- Infraestrutura Cloud (6 meses): R$ 15.000
- Licenças e Serviços: R$ 10.000
- Homologação/QA: R$ 20.000
- Consultoria LGPD: R$ 25.000 ⭐ **CRÍTICO**
- Contingência (15%): R$ 81.000

**INVESTIMENTO TOTAL: R$ 621.000**

**⚠️ Nota:** Investimento total aumentou ligeiramente (+R$ 21k) devido à inclusão explícita de consultoria LGPD obrigatória.

### 5.3 ROI Estimado

**Premissas:**
- 50 eventos/mês (média)
- Economia de 8h/evento em processos manuais
- Custo hora equipe: R$ 50/h

**Economia mensal:** 50 eventos × 8h × R$ 50 = **R$ 20.000/mês**

**Economia anual:** R$ 20.000 × 12 = **R$ 240.000/ano**

**Payback:** R$ 600.000 / R$ 240.000 = **2,5 anos**

**ROI 3 anos:** (R$ 720.000 - R$ 600.000) / R$ 600.000 = **20%**

---

## 6. Riscos e Dependências

### 6.1 Riscos Críticos

| Risco | Impacto | Prob. | Mitigação | Features Afetadas |
|-------|---------|-------|-----------|-------------------|
| **LGPD - Não conformidade** | CRÍTICO | Média | Consultoria jurídica obrigatória antes de dev | EP-05 (todas), EP-08-F8.4 |
| **Race conditions (vagas)** | ALTO | Alta | Lock otimista, testes de carga | EP-02-F2.2, F2.3 |
| **Integração Outlook falha** | MÉDIO | Média | Fallback, não bloquear operação | EP-07 (todas) |
| **Performance relatórios** | MÉDIO | Baixa | Índices, cache, materialized views | EP-09-F9.1, F9.3 |

### 6.2 Dependências Externas

| Dependência | Tipo | Criticidade | Status | Ação |
|-------------|------|-------------|--------|------|
| **Consultoria Jurídica LGPD** | Validação | CRÍTICA | Pendente | Contratar antes de iniciar EP-05 |
| **Microsoft Graph API** | Integração | MÉDIA | Disponível | Registrar app no Azure AD (Fase 3) |
| **Serviço de E-mail** | Infraestrutura | ALTA | Pendente | Contratar AWS SES ou SendGrid (antes MVP) |
| **Storage (S3/Azure)** | Infraestrutura | ALTA | Pendente | Configurar antes EP-05 (fotos/docs) |

---

## 7. Observações e Premissas

### 7.1 Premissas

1. **Equipe:** 3 desenvolvedores fullstack + 1 UX Designer disponíveis full-time
2. **Tecnologias:** A definir (sugestão: .NET Core ou Node.js backend, React frontend)
3. **Capacidade:** ~13 SP/semana/dev (velocity estimada)
4. **Início:** Março 2026
5. **MVP em produção:** Maio 2026
6. **Fase 2 em produção:** Julho 2026
7. **Fase 3 em produção:** Setembro 2026

### 7.2 Observações Críticas

⚠️ **LGPD - Ação Obrigatória:**
- Contratar consultoria jurídica ANTES de iniciar desenvolvimento do EP-05
- Revisão de termo de consentimento, política de privacidade, procedimentos de anonimização
- Designação formal de Encarregado DPO (Data Protection Officer)
- **Custo estimado:** R$ 20.000 - R$ 30.000
- **Prazo:** 2-3 semanas

⚠️ **Certificação Automática (EP-04-F4.1):**
- Cliente precisa fornecer template de certificado
- Template deve ser validado juridicamente (assinatura digital, validade legal)
- **Ação:** Solicitar template ao cliente antes de iniciar MVP

⚠️ **Pacientes Modelo (EP-05):**
- É o MAIOR diferencial competitivo da plataforma
- Compliance LGPD é OBRIGATÓRIO (dados de saúde são categoria especial)
- Falha neste épico inviabiliza eventos de estética/odontologia

### 7.3 Recomendações

1. **Priorizar EP-08 e EP-05:** São fundação e diferencial. Iniciar em paralelo.
2. **Consultoria LGPD:** Contratar IMEDIATAMENTE (crítico path).
3. **Infraestrutura:** Provisionar cloud (AWS/Azure) antes de iniciar MVP.
4. **QA/Testes:** Reservar 2 semanas para testes de carga (EP-02-F2.2) e segurança (EP-08).
5. **Documentação:** Manter atualizada (Step 4 - User Stories detalhadas).

---

## 8. Próximos Passos

### Imediatos (Semana 1-2)

1. ✅ **Aprovar esta priorização** com stakeholders
2. 🔲 **Contratar consultoria jurídica LGPD**
3. 🔲 **Definir stack tecnológico** (backend, frontend, infra)
4. 🔲 **Provisionar infraestrutura cloud**
5. 🔲 **Contratar serviço de e-mail** (AWS SES, SendGrid)
6. 🔲 **Solicitar template de certificado** ao cliente

### Curto Prazo (Semana 3-4)

7. 🔲 **Step 4:** Detalhar User Stories do MVP (18 features → ~115 US)
8. 🔲 **Setup ambiente de desenvolvimento**
9. 🔲 **Criar arquitetura técnica** (diagramas, decisões arquiteturais)
10. 🔲 **Kickoff com equipe** (apresentar épicos, features, roadmap)

### Médio Prazo (Semana 5+)

11. 🔲 **Step 5:** Iniciar desenvolvimento MVP (Sprint 1)
12. 🔲 **Cerimônias Scrum:** Planning, Daily, Review, Retro
13. 🔲 **Testes contínuos:** QA, segurança, performance

---

## 9. Glossário de Siglas

- **WSJF:** Weighted Shortest Job First
- **SP:** Story Points
- **MVP:** Minimum Viable Product
- **LGPD:** Lei Geral de Proteção de Dados
- **RBAC:** Role-Based Access Control
- **QA:** Quality Assurance
- **ROI:** Return on Investment
- **DPO:** Data Protection Officer
- **CRUD:** Create, Read, Update, Delete

---

*Documento elaborado com base no template Value Stream Map [WSJF]. Versão 1.01. Priorização SAFe/Upstream. Data: 10/02/2026.*

**✅ Step 3 - WSJF Priorization CONCLUÍDO!**

**Próximo:** Step 4 - Detalhar User Stories (MVP primeiro: 18 features → ~115 US)
