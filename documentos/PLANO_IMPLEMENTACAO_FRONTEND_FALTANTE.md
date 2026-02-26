# Plano de Implementação – Frontend Faltante

**Data:** 11/02/2026  
**Base:** [RELATORIO_COMPARATIVO_MATRIZ_VS_CODIGO.md](./RELATORIO_COMPARATIVO_MATRIZ_VS_CODIGO.md)  
**Objetivo:** Completar 100% do frontend planejado na matriz de user stories

---

## 📊 RESUMO DO GAP FRONTEND

| Status | US-FE | Componentes |
|--------|-------|-------------|
| ✅ Implementado | 49 | 40 componentes |
| ⚠️ Parcial/Rotas | 18 | Completar integração |
| ❌ Pendente | 9 | Funcionalidades específicas |
| **Total** | **76** | **100% meta** |

---

## 🎯 FASE 1: INTEGRAÇÃO E NAVEGAÇÃO (Prioridade CRÍTICA)

**Objetivo:** Garantir que todos os componentes existentes sejam acessíveis via rotas e menu.

### 1.1 Rotas Faltantes no `app.routes.ts`

| Rota | Componente | Status |
|------|------------|--------|
| `config-certificados` | config-certificados | ❌ Faltando |
| `eventos/:id/certificados` | certificados-evento | ❌ Faltando |
| `templates-email` | templates-email | ❌ Faltando |
| `eventos/:id/lista-espera` | lista-espera | ❌ Faltando |
| `eventos/:id/checkin` | check-in-presenca | ❌ Faltando |
| `gestao-lgpd` | gestao-lgpd | ❌ Faltando |
| `relatorios` | relatorios | ❌ Faltando |
| `dashboard-gerencial` | dashboard-gerencial | ❌ Faltando |

### 1.2 Itens Faltantes no `menu.service.ts`

| Item | Path | Roles | Ícone |
|------|------|-------|-------|
| Configurar Certificados | /config-certificados | admin, marketing | emoji_events |
| Templates de E-mail | /templates-email | admin, marketing | email |
| Gestão LGPD | /gestao-lgpd | admin | shield |
| Relatórios | /relatorios | admin, marketing | assessment |
| Dashboard Gerencial | /dashboard-gerencial | admin | analytics |

### 1.3 Links de Ação em `visualizar-evento`

Adicionar quick actions para:
- ✅ Certificados (já existe)
- ❌ Lista de Espera
- ❌ Check-in / Presença

**Estimativa:** 30 min

---

## 🎯 FASE 2: EP-04-F4.2 – Envio Automático (1 US-FE)

**US-FE-01:** Visualização de Status de Envio

**Requisito:** Organizador visualiza status de envio de cada certificado (enviado, pendente, falha).

**Implementação:**
- ✅ `certificados-evento.component.ts` já possui coluna "Status" com badges
- Adicionar indicador visual de "envio automático agendado" (badge ou ícone)
- Adicionar tooltip/info sobre job de envio automático

**Estimativa:** 1-2 horas

---

## 🎯 FASE 3: EP-04-F4.3 – Reenvio e Auditoria (2 US-FE)

**Status:** Componentes `certificados-evento` e `auditoria-certificados` **já existem**.

**Verificação:**
- Reenvio individual: ✅ (botão reenviar em certificados-evento)
- Reenvio em massa: ✅ (botão "Enviar Todos")
- Log de auditoria: ✅ (auditoria-certificados)

**Ação:** Validar completude e adicionar rota se necessário.  
**Estimativa:** 30 min

---

## 🎯 FASE 4: EP-05 – Documentos e Área Professor (6 US-FE)

**Status:** Componentes **existem** mas podem precisar de refinamento.

| Componente | Feature | Verificar |
|------------|---------|-----------|
| anamnese-termo-paciente | F5.2 | Formulário online para paciente modelo |
| painel-documentos | F5.2/F5.4 | Painel de status de documentos |
| area-professor | F5.3 | Upload de fotos antes/depois |
| galeria-antes-depois | F5.3 | Galeria de fotos |
| revisao-aprovacao-docs | F5.4 | Workflow de aprovação |

**Ação:** Revisar rotas e navegação entre componentes. Painel-documentos precisa de eventoId na URL.  
**Estimativa:** 1 hora

---

## 🎯 FASE 5: EP-06-F6.3 – Log e Auditoria de E-mails (2 US-FE)

**Status:** `auditoria-emails.component.ts` **já existe**.

**Ação:** Verificar se contempla:
- Interface de consulta de log de e-mails
- Relatório de deliverability

**Estimativa:** 30 min

---

## 🎯 FASE 6: EP-07 – Integração Outlook (5 US-FE)

**Status:** Componentes **existem** (configuracao-outlook, painel-sincronizacao, gestao-fuso-horario).

**Ação:** Verificar rotas e menu. Já estão no menu "Integração Outlook".  
**Estimativa:** 15 min

---

## 🎯 FASE 7: EP-08-F8.3 – Auditoria e Logs (2 US-FE)

**Status:** `logs-acesso.component.ts` **já existe**.

**Ação:** Verificar se contempla Interface de Consulta e Relatório de Compliance.  
**Estimativa:** 30 min

---

## 🎯 FASE 8: Mock Interceptor – Handlers Faltantes

**Objetivo:** Garantir que todos os componentes funcionem em modo mock.

**Endpoints a adicionar:**
- `GET/POST /api/certificados/templates`
- `GET/POST /api/eventos/:id/certificados`
- `GET/POST /api/emails/templates`
- `GET/POST /api/eventos/:id/lista-espera`
- `POST /api/eventos/:id/checkin`
- `GET/POST /api/lgpd/solicitacoes`
- `POST /api/relatorios/gerar`
- `GET /api/dashboard/metricas`

**Estimativa:** 2 horas

---

## 📋 ORDEM DE EXECUÇÃO

| # | Fase | Descrição | Prioridade | Tempo |
|---|------|-----------|------------|-------|
| 1 | Fase 1 | Rotas + Menu + Links | 🔴 CRÍTICO | 30 min |
| 2 | Fase 8 | Mock Interceptor | 🔴 CRÍTICO | 2h |
| 3 | Fase 2 | EP-04-F4.2 Status Envio | 🟡 ALTA | 1-2h |
| 4 | Fase 3 | Validar EP-04-F4.3 | 🟡 ALTA | 30 min |
| 5 | Fase 4 | Revisar EP-05 | 🟢 MÉDIA | 1h |
| 6 | Fase 5 | Validar EP-06-F6.3 | 🟢 MÉDIA | 30 min |
| 7 | Fase 6 | Validar EP-07 | 🟢 BAIXA | 15 min |
| 8 | Fase 7 | Validar EP-08-F8.3 | 🟢 BAIXA | 30 min |

**Tempo total estimado:** 6-7 horas

---

## ✅ CRITÉRIOS DE CONCLUSÃO

- [ ] Todas as rotas navegáveis sem erro 404
- [ ] Menu completo com todos os itens para roles corretos
- [ ] Quick actions em visualizar-evento (certificados, lista-espera, checkin)
- [ ] Build sem erros: `npm run build`
- [ ] Navegação funcional em modo mock

---

## ✅ EXECUÇÃO REALIZADA (11/02/2026)

### Concluído

1. **Fase 1 – Integração e Navegação**
   - ✅ Rotas adicionadas em `app.routes.ts`:
     - `config-certificados`, `eventos/:id/certificados`, `eventos/:id/lista-espera`, `eventos/:id/checkin`
     - `templates-email`, `gestao-lgpd`, `relatorios`, `dashboard-gerencial`
   - ✅ Menu atualizado em `menu.service.ts`:
     - Dashboard Gerencial, Configurar Certificados, Templates de E-mail, Relatórios, Gestão LGPD
   - ✅ Quick actions em `visualizar-evento.component.ts`:
     - Lista de espera, Check-in (além de Certificados, Pacientes modelo, Participantes)

2. **Fase 3 – Mock Interceptor**
   - ✅ Handlers para certificados (GET/POST eventos/:id/certificados)
   - ✅ Handlers para lista de espera (GET/POST)
   - ✅ Handlers para check-in e presença
   - ✅ Handlers para templates de certificados
   - ✅ Handlers para LGPD, relatórios, dashboard métricas
   - ✅ Correção de HttpHeaders nos downloads (Blob responses)

3. **Correções adicionais**
   - ✅ Correção de typo em `dashboard-gerencial.component.ts` (`<mat-card-content">` → `<mat-card-content>`)

### Pendente (erros pré-existentes no build)

- `config-certificados`: variáveis `{{nome_participante}}` no template (Angular interpreta como binding)
- `templates-email`: mesmo problema
- `certificados-evento`: parâmetros com tipo `any` implícito
- Alguns warnings de content projection em `mat-button`

### Como testar

1. Iniciar frontend: `ng serve` ou `npm start`
2. Adicionar `?mock=1` na URL ou definir `localStorage.setItem('USE_MOCK', 'true')`
3. Fazer login e navegar pelas novas rotas:
   - Dashboard → Dashboard Gerencial
   - Eventos → [evento] → Certificados / Lista de espera / Check-in
   - Menu: Configurar Certificados, Templates de E-mail, Relatórios, Gestão LGPD

---

*Plano criado em: 11/02/2026*  
*Execução: 11/02/2026*
