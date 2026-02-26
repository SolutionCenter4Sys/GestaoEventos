# Diagrama de Rede - Plataforma de Gestão de Eventos

**Versão**: 1.0 (Engenharia Reversa)
**Data**: 18/02/2026
**Tipo**: Network Topology
**Pergunta respondida**: "Como é a topologia de rede, conectividade e segurança?"

---

## Visão Geral

O diagrama de rede mapeia a topologia de conectividade, portas, protocolos e zonas de segurança do sistema. A arquitetura segue o princípio de defesa em profundidade com múltiplas camadas de proteção.

---

## Diagrama de Rede - Topologia Completa

```mermaid
graph TB
    classDef internet fill:#A1887F,stroke:#5D4037,stroke-width:2px,color:#3E2723
    classDef firewall fill:#4DB6AC,stroke:#00796B,stroke-width:3px,color:#004D40
    classDef app fill:#81C784,stroke:#388E3C,stroke-width:2px,color:#1B5E20
    classDef api fill:#64B5F6,stroke:#1976D2,stroke-width:2px,color:#0D47A1
    classDef data fill:#FFB74D,stroke:#F57C00,stroke-width:2px,color:#E65100
    classDef cache fill:#E57373,stroke:#D32F2F,stroke-width:2px,color:#B71C1C
    classDef security fill:#FFF59D,stroke:#F57F17,stroke-width:2px,color:#F57F17
    classDef external fill:#BA68C8,stroke:#7B1FA2,stroke-width:2px,color:#4A148C

    subgraph "Internet Zone"
        USERS["Usuarios<br/>Browser HTTPS"]
        ATTACKERS["Ameacas<br/>DDoS, Bots, Injection"]
    end

    subgraph "Edge Layer - Protecao"
        WAF["WAF - Web Application Firewall<br/>OWASP Top 10<br/>Rate Limiting L7"]
        THROTTLE["Rate Limiting<br/>@nestjs/throttler<br/>10 req/60s default"]
    end

    subgraph "DMZ - Public Subnet"
        LB["Load Balancer<br/>HTTPS :443<br/>SSL/TLS Termination"]
    end

    subgraph "Application Subnet - Private"
        subgraph "Frontend"
            FE["Angular SPA<br/>:4200 dev / :80 prod<br/>NGINX static server"]
        end

        subgraph "Backend"
            API["NestJS API<br/>:3000<br/>Global Prefix /api"]
            WORKER["BullMQ Worker<br/>Background Jobs"]
        end

        subgraph "Security Layer"
            JWT_G["JwtAuthGuard<br/>Valida Bearer Token"]
            ROLES_G["RolesGuard<br/>RBAC 6 perfis"]
            VALID["ValidationPipe<br/>Input sanitization"]
            CORS_C["CORS<br/>Origin: frontend URL"]
        end
    end

    subgraph "Data Subnet - Private Restricted"
        PG[("PostgreSQL<br/>Supabase<br/>:5432<br/>SSL Required")]
        REDIS[("Redis<br/>:6379<br/>Password Protected")]
    end

    subgraph "External Services"
        OUTLOOK["Microsoft Graph API<br/>HTTPS :443<br/>OAuth2 Bearer"]
        SMTP["SMTP Server<br/>:587 TLS<br/>Credenciais"]
        PROM["Prometheus<br/>:9090<br/>Internal only"]
    end

    USERS -->|"HTTPS :443"| WAF
    ATTACKERS -.->|"Bloqueado"| WAF
    WAF -->|"HTTPS :443<br/>Limpo"| LB
    LB -->|"HTTP :80<br/>Static/*"| FE
    LB -->|"HTTP :3000<br/>/api/*"| API

    FE -->|"REST/JSON<br/>HTTPS /api"| API

    API -->|"Intercepta"| JWT_G
    API -->|"Verifica"| ROLES_G
    API -->|"Valida"| VALID
    API -->|"Filtra origin"| CORS_C

    API -->|"Prisma<br/>SSL/TLS :5432"| PG
    API -->|"ioredis<br/>AUTH :6379"| REDIS
    REDIS -->|"BullMQ<br/>Jobs"| WORKER
    WORKER -->|"Prisma<br/>:5432"| PG

    API -->|"REST OAuth2<br/>HTTPS :443"| OUTLOOK
    WORKER -->|"SMTP TLS<br/>:587"| SMTP
    API -->|"HTTP :9090<br/>/metrics"| PROM

    THROTTLE -.->|"Protege"| API

    class USERS,ATTACKERS internet
    class WAF,THROTTLE firewall
    class LB firewall
    class FE app
    class API,WORKER api
    class PG data
    class REDIS cache
    class JWT_G,ROLES_G,VALID,CORS_C security
    class OUTLOOK,SMTP,PROM external
```

---

## Regras de Firewall / Seguranca

| # | De | Para | Porta | Protocolo | Descricao | Status |
|---|----|----- |-------|-----------|-----------|--------|
| 1 | Internet | WAF | 443 | HTTPS | Trafego publico filtrado | Recomendado |
| 2 | WAF | Load Balancer | 443 | HTTPS | Trafego limpo | Recomendado |
| 3 | Load Balancer | Frontend | 80 | HTTP | Static assets (internal) | Recomendado |
| 4 | Load Balancer | Backend API | 3000 | HTTP | API requests (internal) | Implementado |
| 5 | Frontend SPA | Backend API | 3000 | REST/JSON | CORS: origin validado | Implementado |
| 6 | Backend API | PostgreSQL | 5432 | PostgreSQL/SSL | Prisma Client | Implementado |
| 7 | Backend API | Redis | 6379 | Redis AUTH | Cache + BullMQ publish | Implementado |
| 8 | BullMQ Worker | Redis | 6379 | Redis AUTH | Consume jobs | Implementado |
| 9 | BullMQ Worker | PostgreSQL | 5432 | PostgreSQL/SSL | Write results | Implementado |
| 10 | Backend API | Microsoft Graph | 443 | HTTPS OAuth2 | Outlook Calendar sync | Estruturado |
| 11 | Worker | SMTP Server | 587 | SMTP TLS | Envio de e-mails | Estruturado |
| 12 | Backend API | Prometheus | 9090 | HTTP | Expose /metrics | Implementado |

---

## Camadas de Seguranca (Defesa em Profundidade)

### Camada 1: Rede (Edge)

| Mecanismo | Implementacao | Descricao |
|-----------|--------------|-----------|
| WAF | Recomendado | OWASP Top 10, SQL Injection, XSS |
| CDN | Recomendado | Cache de assets, DDoS L3/L4 |
| SSL/TLS | Implementado (CORS) | Criptografia em transito |

### Camada 2: Aplicacao

| Mecanismo | Implementacao | Descricao |
|-----------|--------------|-----------|
| Rate Limiting | `@nestjs/throttler` (global) | 10 req/60s (configuravel) |
| CORS | `app.enableCors({ origin, credentials })` | Restringe origens |
| Input Validation | `ValidationPipe({ whitelist, forbidNonWhitelisted })` | Rejeita campos desconhecidos |
| Helmet | Recomendado | Headers de seguranca HTTP |

### Camada 3: Autenticacao/Autorizacao

| Mecanismo | Implementacao | Descricao |
|-----------|--------------|-----------|
| JWT Auth | `JwtAuthGuard` (global) | Valida token em todas as rotas |
| RBAC | `RolesGuard` + `@RequireRoles()` | 6 perfis com permissoes granulares |
| 2FA TOTP | speakeasy + QR Code | Segundo fator opcional |
| Account Lockout | 5 tentativas = bloqueio 1h | Previne brute force |
| Refresh Token Rotation | UUID + revogacao no banco | Previne token reuse |
| Password Hashing | bcrypt (rounds: 12) | Armazenamento seguro |
| @Public() decorator | Marca rotas sem auth | Whitelist explicita |

### Camada 4: Dados

| Mecanismo | Implementacao | Descricao |
|-----------|--------------|-----------|
| Encryption at Rest | Criptografia de dados sensiveis (backend) | historicoSaude, restricoesAlergias |
| RLS (Row Level Security) | Supabase | Isolamento de dados por contexto |
| Soft Delete | `deletedAt` em PacienteModelo | LGPD compliance |
| Audit Chain | Hash SHA-256 encadeado | Integridade de logs de auditoria |
| Consentimento LGPD | Registro com IP/UserAgent/Timestamp | Rastreabilidade legal |

### Camada 5: Observabilidade

| Mecanismo | Implementacao | Descricao |
|-----------|--------------|-----------|
| Auth Logging | `LogAutenticacao` (15 campos) | Toda tentativa de auth e logada |
| Audit Trail | `AuditLogPacienteModelo` com hash chain | Rastreabilidade LGPD |
| Metrics | Prometheus (prom-client) | Performance e disponibilidade |
| Winston Logs | Estruturados (JSON) | Logs de aplicacao |
| Geolocation | geoip-lite | IP para pais/cidade em auth logs |

---

## Portas e Protocolos (Resumo)

| Servico | Porta | Protocolo | Interno/Externo |
|---------|-------|-----------|-----------------|
| Angular CLI (dev) | 4200 | HTTP | Interno |
| NGINX (prod) | 80/443 | HTTP/HTTPS | Publico via LB |
| NestJS API | 3000 | HTTP | Interno |
| PostgreSQL | 5432 | PostgreSQL/SSL | Interno |
| Redis | 6379 | Redis Protocol | Interno |
| Prisma Studio | 5555 | HTTP | Dev only |
| Prometheus | 9090 | HTTP | Interno |
| Microsoft Graph | 443 | HTTPS OAuth2 | Externo |
| SMTP | 587 | SMTP TLS | Externo |

---

*Documento gerado por engenharia reversa - Network Topology*
