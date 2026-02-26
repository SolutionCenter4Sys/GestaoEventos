# Decisões Tecnológicas - Plataforma de Gestão de Eventos

**Versão**: 1.0 (Engenharia Reversa)
**Data**: 18/02/2026
**Método**: Engenharia reversa do código-fonte e documentação existente
**Status**: Implementado (MVP)

---

## Stack Tecnológica Consolidada

### Frontend
- **Framework**: Angular 17.3 (Standalone Components)
- **Linguagem**: TypeScript 5.4 (strict mode)
- **UI Library**: Angular Material 17
- **State Management**: RxJS 7 + Angular Signals
- **QR Code**: angularx-qrcode 17
- **Build**: Angular CLI 17.3
- **Testes**: Jasmine 5.1 + Karma 6.4

### Backend
- **Framework**: NestJS 10.3
- **Linguagem**: TypeScript 5.3
- **ORM**: Prisma 4.16
- **Autenticação**: Passport + JWT (@nestjs/jwt 10.2, @nestjs/passport 10.0)
- **Validação**: class-validator 0.14 + class-transformer 0.5
- **Queue/Jobs**: BullMQ 5.1 (Redis)
- **Scheduler**: @nestjs/schedule 4.0 (Cron Jobs)
- **Event System**: @nestjs/event-emitter 2.0
- **Rate Limiting**: @nestjs/throttler 5.1

### Banco de Dados
- **Primary DB**: PostgreSQL (Supabase)
- **ORM**: Prisma 4.16
- **Cache/Queue**: Redis (via ioredis 5.3)

### Segurança
- **Autenticação**: JWT (access token 15min + refresh token 7 dias)
- **2FA**: TOTP via speakeasy 2.0 + QR Code (qrcode 1.5)
- **Hashing**: bcrypt (rounds: 12 para senhas, 10 para códigos)
- **RBAC**: 6 perfis (ADMIN, MARKETING, VENDAS, PROFESSOR, PARTICIPANTE, PACIENTE_MODELO)
- **Rate Limiting**: Throttler global (configurável via env)
- **Compliance**: LGPD (consentimento, anonimização, soft-delete)

### Observabilidade
- **Logs**: Winston 3.11
- **Métricas**: Prometheus (prom-client 15.1)
- **Geolocalização**: geoip-lite 1.4

### Infraestrutura
- **Cloud**: Supabase (PostgreSQL managed)
- **Deployment**: Node.js (NestJS) + Angular CLI
- **Portas**:
  - Frontend: 4200 (dev)
  - Backend API: 3000
  - Prisma Studio: 5555
  - Prometheus Metrics: 9090

---

## Architecture Decision Records (ADRs)

### ADR-001: Angular 17 para Frontend

**Data**: 18/02/2026 (identificado via engenharia reversa)
**Status**: Implementado
**Contexto**: Necessidade de framework robusto para SPA corporativa com 43+ componentes e sistema de permissões granular.
**Decisão**: Angular 17 com Standalone Components
**Alternativas Consideradas**: React 18, Vue 3, Next.js
**Justificativa**:
- Standalone Components eliminam necessidade de NgModules, simplificando a arquitetura
- Angular Material 17 oferece design system corporativo pronto
- TypeScript nativo com strict mode para robustez
- Lazy loading nativo via `loadComponent()` para performance
- Signal-based reactivity para estado local
**Consequências**:
- Positivas: Type-safety completo, material design pronto, routing poderoso com guards
- Negativas: Curva de aprendizado maior que React/Vue
- Riscos: Bundle size maior (mitigado por lazy loading)

### ADR-002: NestJS 10 para Backend

**Data**: 18/02/2026 (identificado via engenharia reversa)
**Status**: Implementado
**Contexto**: API REST com autenticação complexa (JWT + 2FA), RBAC granular, filas de jobs e integrações externas.
**Decisão**: NestJS 10 com módulos dedicados
**Alternativas Consideradas**: Express puro, Fastify, Spring Boot
**Justificativa**:
- Arquitetura modular inspirada em Angular (consistência com frontend)
- Decorators nativos para Guards, Interceptors, Pipes, Filters
- Ecossistema rico: @nestjs/jwt, @nestjs/passport, @nestjs/throttler, @nestjs/bullmq
- TypeScript nativo com DI (Dependency Injection)
- Global Guards permitem JWT + RBAC + Rate Limiting transparentes
**Consequências**:
- Positivas: Código organizado, segurança centralizada, extensível
- Negativas: Overhead de abstração vs Express puro
- Riscos: Complexidade em módulos com muitas dependências

### ADR-003: PostgreSQL (Supabase) + Prisma

**Data**: 18/02/2026 (identificado via engenharia reversa)
**Status**: Implementado
**Contexto**: Sistema com 15+ entidades, relacionamentos complexos, requisitos LGPD e auditoria.
**Decisão**: PostgreSQL via Supabase + Prisma ORM
**Alternativas Consideradas**: MySQL, MongoDB, TypeORM
**Justificativa**:
- PostgreSQL: ACID compliance, JSONB para metadados, índices avançados
- Supabase: PostgreSQL managed com RLS (Row Level Security)
- Prisma: Type-safe queries, migrations versionadas, Prisma Studio
- Schema declarativo facilita documentação e evolução
**Consequências**:
- Positivas: Consistência garantida, type-safety no data layer, migrations automatizadas
- Negativas: Schema rígido (mitigado por Json fields para flexibilidade)
- Riscos: Dependência do Supabase (mitigado por Prisma ser DB-agnostic)

### ADR-004: JWT + 2FA com Speakeasy

**Data**: 18/02/2026 (identificado via engenharia reversa)
**Status**: Implementado
**Contexto**: Plataforma com dados sensíveis (pacientes modelo, LGPD) requer autenticação forte.
**Decisão**: JWT (access 15min + refresh 7d) + 2FA TOTP opcional
**Alternativas Consideradas**: OAuth 2.0 externo, Session-based, Keycloak
**Justificativa**:
- JWT stateless permite escalabilidade horizontal
- Refresh token rotativo (revogação no banco) para segurança
- 2FA TOTP (speakeasy) compatível com Google Authenticator/Authy
- 10 códigos de recuperação hashados com bcrypt
- Bloqueio automático após 5 tentativas falhas (1 hora)
**Consequências**:
- Positivas: Segurança robusta, UX boa (2FA opcional), recovery codes
- Negativas: Complexidade de implementação
- Riscos: Secret 2FA deve ser protegido em trânsito

### ADR-005: BullMQ + Redis para Processamento Assíncrono

**Data**: 18/02/2026 (identificado via engenharia reversa)
**Status**: Configurado (parcialmente implementado)
**Contexto**: Necessidade de processamento assíncrono para envio de e-mails, geração de certificados e notificações.
**Decisão**: BullMQ 5.1 com Redis como broker
**Alternativas Consideradas**: RabbitMQ, AWS SQS, agenda.js
**Justificativa**:
- BullMQ integrado ao NestJS (@nestjs/bullmq)
- Redis já necessário para cache de sessões
- Retry automático, dead letter queue, dashboard de monitoramento
- @nestjs/schedule para cron jobs (lembretes de eventos)
**Consequências**:
- Positivas: Processamento resiliente, retry automático, baixa latência
- Negativas: Dependência do Redis
- Riscos: Perda de jobs se Redis não persistir (mitigar com AOF)

### ADR-006: Compliance LGPD

**Data**: 18/02/2026 (identificado via engenharia reversa)
**Status**: Implementado (estrutura base)
**Contexto**: Plataforma processa dados sensíveis de pacientes modelo (saúde) e dados pessoais de participantes.
**Decisão**: Implementar LGPD compliance nativo na arquitetura
**Implementação identificada**:
- Consentimento explícito com registro (ConsentimentoLGPD model)
- Criptografia de dados sensíveis no backend (historicoSaude, restricoesAlergias)
- Soft-delete para pacientes modelo (deletedAt)
- Auditoria completa com hash chain (AuditLogPacienteModelo)
- Logs de autenticação com IP e geolocalização
- Modal de consentimento LGPD no frontend (ConsentimentoLgpdModalComponent)
**Consequências**:
- Positivas: Conformidade legal, rastreabilidade completa
- Negativas: Overhead de performance (criptografia, auditoria)
- Riscos: Evolução regulatória pode requerer ajustes

---

*Documento gerado por engenharia reversa do código-fonte e documentação do projeto.*
