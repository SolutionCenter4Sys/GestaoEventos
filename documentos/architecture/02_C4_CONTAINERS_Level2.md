# Diagrama de Containers (C4 - Nível 2) - Plataforma de Gestão de Eventos

**Versão**: 1.0 (Engenharia Reversa)
**Data**: 18/02/2026
**Nível C4**: 2 - Containers
**Pergunta respondida**: "Quais aplicações e data stores compõem o sistema?"

---

## Visão Geral

O sistema é composto por 5 containers principais: uma aplicação web SPA (Angular 17), uma API REST (NestJS 10), um banco de dados relacional (PostgreSQL via Supabase), um broker de mensagens/cache (Redis) e um worker de background (BullMQ). A comunicação frontend-backend é via REST/JSON sobre HTTPS.

---

## Diagrama de Containers

```mermaid
graph TB
    classDef frontend fill:#81C784,stroke:#388E3C,stroke-width:2px,color:#1B5E20
    classDef backend fill:#64B5F6,stroke:#1976D2,stroke-width:2px,color:#0D47A1
    classDef database fill:#FFB74D,stroke:#F57C00,stroke-width:2px,color:#E65100
    classDef cache fill:#E57373,stroke:#D32F2F,stroke-width:2px,color:#B71C1C
    classDef queue fill:#BA68C8,stroke:#7B1FA2,stroke-width:2px,color:#4A148C
    classDef external fill:#A1887F,stroke:#5D4037,stroke-width:2px,color:#3E2723

    U["Usuarios<br/>Browser"]

    subgraph "Frontend Layer"
        FE["Web Application SPA<br/>Angular 17.3 + TypeScript 5.4<br/>Angular Material 17<br/>Port: 4200"]
    end

    subgraph "Backend Layer"
        API["API REST<br/>NestJS 10.3 + TypeScript 5.3<br/>Prisma 4.16 + Passport JWT<br/>Port: 3000"]
    end

    subgraph "Data Layer"
        DB[("PostgreSQL<br/>Supabase Managed<br/>15+ tabelas, RLS<br/>Port: 5432")]
        REDIS[("Redis<br/>Cache + Message Broker<br/>Sessions, BullMQ<br/>Port: 6379")]
    end

    subgraph "Background Processing"
        WORKER["BullMQ Worker<br/>E-mails, Certificados<br/>Lembretes agendados"]
        CRON["Scheduler<br/>@nestjs/schedule<br/>Cron Jobs"]
    end

    subgraph "Sistemas Externos"
        OUTLOOK["Microsoft Outlook<br/>Calendar API<br/>Microsoft Graph"]
        EMAIL["Servico E-mail<br/>SMTP"]
        PROMETHEUS["Prometheus<br/>Metricas<br/>Port: 9090"]
    end

    U -->|"HTTPS"| FE
    FE -->|"REST/JSON<br/>HTTPS /api/*"| API
    API -->|"Prisma Client<br/>Connection Pool"| DB
    API -->|"ioredis<br/>Cache + Publish"| REDIS
    API -->|"EventEmitter<br/>Eventos internos"| WORKER
    REDIS -->|"BullMQ<br/>Consume Jobs"| WORKER
    CRON -->|"Scheduled Tasks"| API
    API -->|"Microsoft Graph API<br/>REST/OAuth2"| OUTLOOK
    WORKER -->|"SMTP"| EMAIL
    API -->|"prom-client<br/>Expose /metrics"| PROMETHEUS

    class FE frontend
    class API backend
    class DB database
    class REDIS cache
    class WORKER,CRON queue
    class OUTLOOK,EMAIL,PROMETHEUS external
```

---

## Containers Detalhados

### Web Application (Frontend)

| Atributo | Valor |
|----------|-------|
| **Tecnologia** | Angular 17.3 + TypeScript 5.4 |
| **UI Library** | Angular Material 17 |
| **State** | RxJS 7 + Angular Signals |
| **Porta** | 4200 (dev) |
| **Componentes** | 43 paginas + layout + core services |
| **Rotas** | 45+ (lazy loaded via `loadComponent()`) |
| **Autenticacao** | JWT token em localStorage + AuthGuard |
| **Mock API** | MockInterceptor para desenvolvimento (751 linhas) |

### API REST (Backend)

| Atributo | Valor |
|----------|-------|
| **Tecnologia** | NestJS 10.3 + TypeScript 5.3 |
| **ORM** | Prisma 4.16 |
| **Porta** | 3000 (prefixo `/api`) |
| **Autenticacao** | JWT (15min access + 7d refresh) + 2FA TOTP |
| **Seguranca** | Global Guards: JwtAuthGuard + RolesGuard + ThrottlerGuard |
| **Validacao** | Global ValidationPipe (whitelist + forbidNonWhitelisted) |
| **CORS** | Origin: `http://localhost:4200` (configuravel) |
| **Modulos Implementados** | AuthModule, UsuariosModule |
| **Modulos Pendentes** | EventosModule, InscricoesModule, CertificadosModule, PacientesModule, ComunicacaoModule |

### PostgreSQL (Database)

| Atributo | Valor |
|----------|-------|
| **Tecnologia** | PostgreSQL (Supabase) |
| **ORM** | Prisma 4.16 |
| **Porta** | 5432 |
| **Tabelas** | 15 (usuarios, solicitacoes, eventos, inscricoes, certificados, pacientes_modelo, templates_email, etc.) |
| **Enums** | 8 (PerfilUsuario, StatusSolicitacao, StatusEvento, StatusInscricao, etc.) |
| **Indices** | 30+ (performance queries) |
| **Seguranca** | Row Level Security (Supabase), dados sensiveis criptografados |

### Redis (Cache + Broker)

| Atributo | Valor |
|----------|-------|
| **Tecnologia** | Redis (via ioredis 5.3) |
| **Porta** | 6379 |
| **Uso como Cache** | Sessions, rate limiting |
| **Uso como Broker** | BullMQ jobs (e-mails, certificados, lembretes) |
| **Configuracao** | Host/Port/Password via env vars |

### BullMQ Worker (Background)

| Atributo | Valor |
|----------|-------|
| **Tecnologia** | BullMQ 5.1 + @nestjs/bullmq 10.1 |
| **Funcoes** | Envio de e-mails, geracao de certificados, lembretes agendados |
| **Retry** | Automatico com exponential backoff |
| **Scheduler** | @nestjs/schedule para cron jobs |

---

## Comunicacao entre Containers

| De | Para | Protocolo | Detalhes |
|----|------|-----------|----------|
| Browser | Frontend | HTTPS | SPA Angular servida via Angular CLI |
| Frontend | Backend API | REST/JSON HTTPS | Prefixo `/api`, MockInterceptor em dev |
| Backend API | PostgreSQL | Prisma Client (TCP) | Connection pooling, transactions |
| Backend API | Redis | ioredis (TCP) | Cache, publish BullMQ jobs |
| Redis | BullMQ Worker | BullMQ Protocol | Consume jobs assincrono |
| Backend API | Outlook | Microsoft Graph REST API | OAuth2, sincronizacao calendario |
| BullMQ Worker | Email SMTP | SMTP | Envio de e-mails transacionais |
| Backend API | Prometheus | HTTP /metrics | Exposicao de metricas prom-client |

---

*Documento gerado por engenharia reversa - C4 Model Level 2*
