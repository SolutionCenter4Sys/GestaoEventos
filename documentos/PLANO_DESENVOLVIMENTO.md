# Plano de Desenvolvimento - Plataforma de Gestão de Eventos

**Data:** 11/02/2026  
**Status:** Em andamento  
**Objetivo:** Implementar todas as features do MVP seguindo priorização WSJF

---

## Status Geral

### User Stories (Documentação)
✅ **CONCLUÍDO** - 185 US documentadas (76 FE + 109 BE)
- Script automatizado gerou todos os .md faltantes em `epicos/features/user-stories/`

### Frontend (Angular) - Implementação

| Feature | Status | Páginas criadas | Observações |
|---------|--------|-----------------|-------------|
| **EP-08-F8.1** Sistema de Autenticação | ✅ 100% | Login, Recuperar senha, Resetar senha, Config 2FA | Modo mock ativo |
| **EP-08-F8.2** RBAC | ✅ 100% | Menu dinâmico, Gestão de perfis | Guard + decorator + interceptor |
| **EP-06-F6.2** Gatilhos Automáticos | ✅ 80% | Config gatilhos | Falta backend real (motor + fila) |
| **EP-02-F2.1** CRUD de Eventos | ✅ 100% | Lista, Criar/Editar, Visualizar, Duplicar, Arquivar | Mock completo |
| **EP-03-F3.1** Inscrição Público | ✅ 80% | Form inscrição, Confirmação | Mock básico |
| **EP-05-F5.1** Paciente Modelo | ✅ 80% | Lista, Cadastro | Mock básico, falta upload docs |
| **EP-01-F1.1** Solicitação Evento | 🚧 0% | — | **PRÓXIMO** |
| **EP-01-F1.2** Workflow Aprovação | 🚧 0% | — | Depende de F1.1 |
| **EP-02-F2.2** Controle Capacidade | 🚧 0% | — | Requer lógica vagas |
| **EP-03-F3.2** Área Participante | 🚧 0% | — | Dashboard, Meus eventos |
| **EP-03-F3.3** Gestão Participantes | 🚧 0% | — | Busca/filtros, importação |
| **EP-04-F4.1** Certificados | 🚧 0% | — | Template + geração PDF |
| **EP-06-F6.1** Templates E-mail | 🚧 0% | — | Editor HTML + preview |
| **EP-08-F8.3** Auditoria | 🚧 0% | — | Log imutável |
| **EP-08-F8.4** LGPD | 🚧 0% | — | Termo consentimento, portabilidade |

### Backend (NestJS) - Implementação

| Módulo | Status | Endpoints | Observações |
|--------|--------|-----------|-------------|
| Auth | ✅ 100% | Login, refresh, recuperar/resetar senha, 2FA, me, logout | JWT + bcrypt + rate limit |
| Usuários | ✅ 80% | GET /users, PATCH /users/:id/perfil | Falta CRUD completo |
| Eventos | 🚧 0% | — | **PRÓXIMO** |
| Solicitações | 🚧 0% | — | Workflow + notificações |
| Inscrições | 🚧 0% | — | Validação vagas + QR Code |
| Pacientes Modelo | 🚧 0% | — | LGPD + criptografia |
| Gatilhos | 🚧 0% | — | Motor + fila (Bull/RabbitMQ) |
| Templates | 🚧 0% | — | Editor + variáveis |
| Certificados | 🚧 0% | — | PDF dinâmico (PDFKit) |
| Auditoria | 🚧 0% | — | Interceptor global |

---

## Roadmap de Desenvolvimento (Incremental)

### ✅ Fase 1 - Fundação (CONCLUÍDA)

**Duração:** ~2 semanas  
**Entregue:**
- Sistema de autenticação completo (login, 2FA, recuperação senha)
- RBAC com 6 perfis (guard + decorator + interceptor ownership)
- Menu dinâmico por perfil
- Gestão de perfis (Admin)
- CRUD de Eventos com visualização, duplicação e arquivamento
- Modo mock funcional (frontend roda standalone)
- Design system Alur aplicado (tokens, cores, tipografia)
- 185 User Stories documentadas

**Tecnologias:**
- Frontend: Angular 19 standalone components + Material Design
- Backend: NestJS + Prisma + PostgreSQL
- Auth: JWT + Bcrypt + Speakeasy (2FA)

---

### 🚧 Fase 2 - Core do Negócio (EM ANDAMENTO)

**Duração estimada:** 3-4 semanas  
**Objetivo:** Implementar fluxo principal Solicitações → Aprovação → Eventos → Inscrições

#### Sprint 1 - Solicitações e Aprovação (1,5 semanas | 21 SP)

**EP-01-F1.1 - Formulário de Solicitação (8 SP)**

Frontend:
- [ ] Formulário multi-seção (6 seções: Solicitante, Evento, Logística, Infraestrutura, Paciente Modelo, Orçamento)
- [ ] Validações tempo real (campos obrigatórios, formatos, lógica condicional)
- [ ] Campos condicionais (aparecem/somem conforme seleções)
- [ ] Salvar rascunho
- [ ] Upload de anexos (até 5 arquivos PDF/JPG/PNG)

Backend:
- [ ] POST /solicitacoes (criar)
- [ ] GET /solicitacoes (listar, filtros por status/perfil)
- [ ] GET /solicitacoes/:id (detalhe)
- [ ] PATCH /solicitacoes/:id (atualizar)
- [ ] Upload de anexos (multer + validação tipo/tamanho)

Mock:
- [ ] Lista de solicitações fake
- [ ] CRUD solicitações em memória

**EP-01-F1.2 - Workflow de Aprovação (13 SP)**

Frontend:
- [ ] Lista de solicitações (Admin/Marketing) com filtros por status
- [ ] Card de solicitação com resumo + ações (Aprovar/Reprovar/Solicitar alteração)
- [ ] Modal de aprovação com comentários
- [ ] Histórico de transições
- [ ] Botão "Criar Evento" (após aprovação) que redireciona para cadastro de evento pré-preenchido

Backend:
- [ ] Máquina de estados (5 status: Enviado, Revisão, Alteração solicitada, Aprovado, Reprovado)
- [ ] POST /solicitacoes/:id/aprovar
- [ ] POST /solicitacoes/:id/reprovar
- [ ] POST /solicitacoes/:id/solicitar-alteracao
- [ ] Histórico de transições (tabela audit_log ou campo JSON)
- [ ] Notificações por e-mail (integração com gatilhos)
- [ ] POST /eventos/from-solicitacao/:id (criar evento a partir de solicitação aprovada)

Mock:
- [ ] Transições de status simuladas
- [ ] Criação de evento a partir de solicitação

---

#### Sprint 2 - Controle de Vagas e Inscrições (1,5 semanas | 16 SP)

**EP-02-F2.2 - Controle de Capacidade (8 SP)**

Frontend:
- [ ] Indicador de vagas no card do evento (X/Y inscritos)
- [ ] Bloqueio visual quando lotado
- [ ] Dashboard de ocupação por evento

Backend:
- [ ] Campo `inscritosCount` calculado (trigger ou coluna computed)
- [ ] Validação de vagas no POST /inscricoes (lock otimista ou transação)
- [ ] GET /eventos/:id/estatisticas (vagas, confirmados, lista espera)

Mock:
- [ ] Contador de vagas simulado

**EP-03-F3.1 - Melhorias Inscrição Público (já parcialmente implementado)**

Backend:
- [ ] Validação de vagas real (não apenas mock)
- [ ] Geração de QR Code (qrcode lib) após inscrição
- [ ] Criação automática de conta participante
- [ ] E-mail de confirmação com QR Code (integração com EP-06)

Mock:
- [ ] Manter comportamento atual

---

#### Sprint 3 - Área do Participante + Gestão (1 semana | 26 SP)

**EP-03-F3.2 - Área do Participante (13 SP)**

Frontend:
- [ ] Dashboard do participante (resumo: próximos eventos, certificados disponíveis)
- [ ] Abas: Próximos eventos, Concluídos, Lista de espera
- [ ] Card de evento com QR Code para check-in
- [ ] Meus Certificados (lista + download PDF)
- [ ] Meus Dados (editar nome, telefone, senha)
- [ ] Cancelar inscrição (com confirmação)

Backend:
- [ ] GET /participante/dashboard (resumo)
- [ ] GET /participante/eventos (listar eventos do usuário com status)
- [ ] GET /participante/certificados
- [ ] DELETE /inscricoes/:id (cancelar inscrição)

Mock:
- [ ] Dados fake de participante

**EP-03-F3.3 - Gestão de Participantes (13 SP)**

Frontend:
- [ ] Lista de participantes por evento com busca/filtros
- [ ] Edição inline de dados
- [ ] Importação CSV (upload + preview + validação)
- [ ] Exportação CSV
- [ ] Estatísticas (total, confirmados, presentes, certificados emitidos)

Backend:
- [ ] GET /eventos/:id/participantes (lista com filtros)
- [ ] PATCH /inscricoes/:id (editar dados)
- [ ] POST /eventos/:id/participantes/import (importação CSV)
- [ ] GET /eventos/:id/participantes/export (exportação CSV)
- [ ] GET /eventos/:id/participantes/estatisticas

Mock:
- [ ] Lista de participantes fake

---

### 📅 Fase 3 - Certificação e Comunicação (3 semanas)

#### Sprint 4 - Certificados (1,5 semanas | 13 SP)

**EP-04-F4.1 - Geração de Certificados**

Frontend:
- [ ] Configuração de template (campos personalizáveis: título, texto, assinatura, logo)
- [ ] Preview de template
- [ ] Lista de certificados gerados por evento
- [ ] Botão "Gerar certificados" (para todos participantes presentes)
- [ ] Download individual de certificado

Backend:
- [ ] Modelo Certificado (tabela com campos: eventoId, participanteId, codigo, pdfUrl, geradoEm)
- [ ] POST /eventos/:id/certificados/gerar (geração em massa)
- [ ] GET /certificados/:codigo (validação pública de certificado)
- [ ] GET /certificados/:id/download (PDF)
- [ ] Biblioteca PDFKit ou Puppeteer para geração de PDF dinâmico
- [ ] Storage de PDFs (local ou S3)

Mock:
- [ ] PDF fake (base64 ou link externo)

---

#### Sprint 5 - Templates e Gatilhos (1,5 semanas | 13 SP)

**EP-06-F6.1 - Templates de E-mail (5 SP)**

Frontend:
- [ ] Editor HTML (WYSIWYG: CKEditor ou Quill)
- [ ] Lista de variáveis disponíveis ({{nome_participante}}, {{nome_evento}}, etc.)
- [ ] Preview em tempo real com dados de exemplo
- [ ] Upload de logo
- [ ] Seletor de paleta de cores
- [ ] Lista de templates (duplicar, editar, excluir)

Backend:
- [ ] CRUD /templates
- [ ] Renderização de template com variáveis (handlebars ou mustache)
- [ ] POST /templates/preview (retorna HTML renderizado)
- [ ] Versionamento de templates

Mock:
- [ ] Templates fake

**EP-06-F6.2 - Motor de Gatilhos (8 SP) — já tem UI, falta backend**

Backend:
- [ ] Tabela de gatilhos (eventoTipo, timing, templateId, ativo)
- [ ] Motor de gatilhos (listener de eventos do sistema)
- [ ] Fila de e-mails (Bull + Redis ou RabbitMQ)
- [ ] Integração com provedor de e-mail (SendGrid, AWS SES, ou SMTP)
- [ ] Retry automático em caso de falha
- [ ] Job de lembretes (cron: rodar 1x/dia, verificar eventos próximos)
- [ ] GET /gatilhos (listar)
- [ ] PATCH /gatilhos/:id (atualizar config)

Mock:
- [ ] Manter atual

---

### 📊 Fase 4 - Segurança e Compliance (2 semanas)

#### Sprint 6 - Auditoria e LGPD (2 semanas | 21 SP)

**EP-08-F8.3 - Auditoria e Logs (8 SP)**

Frontend:
- [ ] Interface de consulta de logs (busca por usuário, módulo, ação, data)
- [ ] Filtros avançados
- [ ] Exportação de logs para CSV (compliance)

Backend:
- [ ] Tabela audit_log (append-only, campos: userId, action, module, recordId, dataBefore, dataAfter, ip, timestamp)
- [ ] Interceptor global que registra ações críticas automaticamente
- [ ] GET /auditoria (consulta com filtros)
- [ ] GET /auditoria/exportar (CSV)

Mock:
- [ ] Logs fake

**EP-08-F8.4 - Conformidade LGPD (13 SP)**

Frontend:
- [ ] Modal de consentimento LGPD (na inscrição e cadastro de paciente)
- [ ] Página "Meus Dados" (participante pode solicitar exclusão ou portabilidade)
- [ ] Gestão de solicitações LGPD (Admin: aprovar/reprovar exclusão)
- [ ] Política de privacidade (página estática)

Backend:
- [ ] Campo `consentimentoLgpd` (boolean + data)
- [ ] POST /lgpd/solicitar-exclusao
- [ ] POST /lgpd/solicitar-portabilidade (retorna JSON ou CSV com todos os dados)
- [ ] Job de anonimização de dados (após aprovação de exclusão)
- [ ] Criptografia de dados sensíveis (campo `cpf`, `telefone` com lib crypto)
- [ ] GET /lgpd/solicitacoes (Admin)
- [ ] PATCH /lgpd/solicitacoes/:id/processar

Mock:
- [ ] Fluxo fake

---

## Próximos Passos Imediatos

1. **EP-01-F1.1** - Formulário de solicitação de evento (iniciando agora)
2. **EP-01-F1.2** - Workflow de aprovação
3. **EP-02-F2.2** - Controle de capacidade
4. Seguir sprints acima

---

## Ferramentas e Bibliotecas a Adicionar

### Frontend
- CKEditor ou Quill (editor HTML)
- ngx-qrcode (geração QR Code)
- file-saver (download de arquivos)

### Backend
- @nestjs/bull + bull + redis (fila de jobs)
- qrcode (geração QR Code)
- pdfkit ou @nestjs-modules/puppeteer (geração PDF)
- handlebars ou mustache (templates de e-mail)
- multer (upload de arquivos)
- @nestjs/schedule (cron jobs)
- nodemailer ou @sendgrid/mail (envio de e-mail)

---

## Observações

- Priorizar **funcionalidade end-to-end** (vertical slice) em vez de camadas horizontais
- Manter **modo mock funcional** para frontend poder ser testado independentemente
- **Build validado** após cada grupo de features
- **Design system Alur** aplicado em todas as novas telas
- Seguir **convenções de nomenclatura** existentes (kebab-case para componentes, camelCase para variáveis)

---

*Documento vivo - atualizar após cada sprint/milestone*
