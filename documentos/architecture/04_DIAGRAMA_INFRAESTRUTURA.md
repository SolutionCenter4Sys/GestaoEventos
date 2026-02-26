# Diagrama de Infraestrutura - Plataforma de Gestão de Eventos

**Versão**: 1.0 (Engenharia Reversa)
**Data**: 18/02/2026
**Tipo**: Deployment View
**Pergunta respondida**: "Como o sistema é implantado e onde cada componente roda?"

---

## Visão Geral

A infraestrutura atual utiliza Supabase como plataforma managed para PostgreSQL, com o backend NestJS e frontend Angular rodando em ambiente Node.js. O Redis é usado como broker para BullMQ (jobs assíncronos). O sistema expõe métricas via Prometheus.

---

## Diagrama de Infraestrutura - Ambiente de Desenvolvimento

```mermaid
graph TB
    classDef user fill:#81C784,stroke:#388E3C,stroke-width:2px,color:#1B5E20
    classDef frontend fill:#81C784,stroke:#388E3C,stroke-width:2px,color:#1B5E20
    classDef backend fill:#64B5F6,stroke:#1976D2,stroke-width:2px,color:#0D47A1
    classDef database fill:#FFB74D,stroke:#F57C00,stroke-width:2px,color:#E65100
    classDef cache fill:#E57373,stroke:#D32F2F,stroke-width:2px,color:#B71C1C
    classDef monitoring fill:#4DB6AC,stroke:#00796B,stroke-width:2px,color:#004D40
    classDef external fill:#BA68C8,stroke:#7B1FA2,stroke-width:2px,color:#4A148C
    classDef tool fill:#A1887F,stroke:#5D4037,stroke-width:2px,color:#3E2723

    subgraph "Developer Machine"
        DEV["Desenvolvedor<br/>Browser + IDE"]
    end

    subgraph "Local Environment"
        subgraph "Frontend Server"
            NG_CLI["Angular CLI<br/>ng serve<br/>Port: 4200<br/>Hot Reload + MockInterceptor"]
        end

        subgraph "Backend Server"
            NEST_CLI["NestJS CLI<br/>nest start --watch<br/>Port: 3000<br/>Global Prefix: /api"]
        end

        subgraph "Tools"
            PRISMA_STUDIO["Prisma Studio<br/>Port: 5555<br/>Database GUI"]
        end

        subgraph "Redis Server"
            REDIS_LOCAL["Redis<br/>Port: 6379<br/>BullMQ + Cache"]
        end
    end

    subgraph "Supabase Cloud"
        SUPABASE_DB[("PostgreSQL<br/>Supabase Managed<br/>Row Level Security<br/>Automatic Backups")]
    end

    subgraph "External Services"
        OUTLOOK_API["Microsoft Graph API<br/>Outlook Calendar"]
        SMTP_SVC["SMTP Server<br/>E-mail Service"]
    end

    subgraph "Monitoring"
        PROM["Prometheus<br/>Port: 9090<br/>Metricas Backend"]
    end

    DEV -->|"http://localhost:4200"| NG_CLI
    DEV -->|"http://localhost:5555"| PRISMA_STUDIO
    NG_CLI -->|"REST /api<br/>http://localhost:3000"| NEST_CLI
    NEST_CLI -->|"Prisma Client<br/>DATABASE_URL"| SUPABASE_DB
    NEST_CLI -->|"ioredis<br/>localhost:6379"| REDIS_LOCAL
    NEST_CLI -->|"Microsoft Graph<br/>OAuth2"| OUTLOOK_API
    NEST_CLI -->|"SMTP"| SMTP_SVC
    NEST_CLI -->|"prom-client"| PROM
    PRISMA_STUDIO -->|"DATABASE_URL"| SUPABASE_DB

    class DEV user
    class NG_CLI frontend
    class NEST_CLI backend
    class SUPABASE_DB database
    class REDIS_LOCAL cache
    class PROM monitoring
    class OUTLOOK_API,SMTP_SVC external
    class PRISMA_STUDIO tool
```

---

## Diagrama de Infraestrutura - Producao (Recomendado)

```mermaid
graph TB
    classDef internet fill:#A1887F,stroke:#5D4037,stroke-width:2px,color:#3E2723
    classDef lb fill:#4DB6AC,stroke:#00796B,stroke-width:3px,color:#004D40
    classDef frontend fill:#81C784,stroke:#388E3C,stroke-width:2px,color:#1B5E20
    classDef backend fill:#64B5F6,stroke:#1976D2,stroke-width:2px,color:#0D47A1
    classDef database fill:#FFB74D,stroke:#F57C00,stroke-width:2px,color:#E65100
    classDef cache fill:#E57373,stroke:#D32F2F,stroke-width:2px,color:#B71C1C
    classDef external fill:#BA68C8,stroke:#7B1FA2,stroke-width:2px,color:#4A148C
    classDef storage fill:#FFF59D,stroke:#F57F17,stroke-width:2px,color:#F57F17

    subgraph "Internet"
        USERS["Usuarios<br/>Browser/Mobile"]
        CDN["CDN<br/>Assets Estaticos"]
    end

    subgraph "Cloud Environment"
        subgraph "DMZ - Public"
            LB["Load Balancer<br/>HTTPS :443<br/>SSL Termination"]
        end

        subgraph "Application Tier"
            FE_CONT["Frontend Container<br/>Angular 17 Build<br/>NGINX :80<br/>2 replicas"]
            BE_CONT["Backend Container<br/>NestJS 10<br/>Node.js :3000<br/>2-4 replicas"]
            WORKER_CONT["Worker Container<br/>BullMQ Consumer<br/>1-2 replicas"]
        end

        subgraph "Data Tier"
            PG[("PostgreSQL<br/>Supabase<br/>Multi-AZ<br/>Backups diarios")]
            REDIS_PROD[("Redis<br/>Managed<br/>Persistence: AOF")]
        end

        subgraph "Storage"
            BLOB["Blob Storage<br/>Certificados PDF<br/>Fotos antes/depois"]
        end
    end

    subgraph "External Services"
        OUTLOOK_PROD["Microsoft Graph API"]
        SMTP_PROD["E-mail Service SMTP"]
        PROM_PROD["Prometheus + Grafana"]
    end

    USERS -->|"HTTPS"| CDN
    CDN -->|"Cache Miss"| LB
    USERS -->|"HTTPS"| LB
    LB -->|"Route /"| FE_CONT
    LB -->|"Route /api/*"| BE_CONT
    FE_CONT -->|"Static Assets"| CDN
    BE_CONT -->|"Prisma"| PG
    BE_CONT -->|"ioredis"| REDIS_PROD
    BE_CONT -->|"Publish Jobs"| REDIS_PROD
    REDIS_PROD -->|"Consume"| WORKER_CONT
    WORKER_CONT -->|"Write"| PG
    BE_CONT -->|"Upload/Download"| BLOB
    WORKER_CONT -->|"Upload PDF"| BLOB
    BE_CONT -->|"REST OAuth2"| OUTLOOK_PROD
    WORKER_CONT -->|"SMTP"| SMTP_PROD
    BE_CONT -->|"/metrics"| PROM_PROD

    class USERS internet
    class CDN internet
    class LB lb
    class FE_CONT frontend
    class BE_CONT backend
    class WORKER_CONT backend
    class PG database
    class REDIS_PROD cache
    class BLOB storage
    class OUTLOOK_PROD,SMTP_PROD,PROM_PROD external
```

---

## Especificacoes de Recursos (Producao Recomendada)

| Recurso | Tipo | Especificacao | Replicas | Custo Mensal Est. |
|---------|------|---------------|----------|-------------------|
| Load Balancer | HTTPS/SSL | 100 RPS, SSL termination | 1 | $25 |
| Frontend | Container NGINX | 1 vCPU, 1GB RAM | 2 | $30 |
| Backend API | Container Node.js | 2 vCPU, 4GB RAM | 2-4 | $120-240 |
| Worker | Container Node.js | 1 vCPU, 2GB RAM | 1-2 | $30-60 |
| PostgreSQL | Supabase Pro | 8GB RAM, 100GB SSD | 1 (Multi-AZ) | $25-75 |
| Redis | Managed | 2GB RAM, AOF persistence | 1 | $30 |
| Blob Storage | Object Storage | 50GB (certificados, fotos) | N/A | $5 |
| CDN | Global | Static assets cache | N/A | $10 |
| Prometheus + Grafana | Monitoring | Standard | 1 | $20 |
| **Total** | | | | **$295-495/mes** |

### Ambientes

| Ambiente | Proposito | Escala | Custo Est. |
|----------|-----------|--------|------------|
| Dev | Desenvolvimento local | Minimo (1 replica cada) | ~$80/mes |
| Staging | Testes/QA | Medio (1-2 replicas) | ~$200/mes |
| Producao | Usuarios finais | Completo (2-4 replicas) | ~$400/mes |
| **Total 3 ambientes** | | | **~$680/mes** |

---

## Variaveis de Ambiente Criticas

| Variavel | Container | Descricao |
|----------|-----------|-----------|
| DATABASE_URL | Backend, Worker | Connection string PostgreSQL (Supabase) |
| JWT_SECRET | Backend | Secret para assinar tokens JWT |
| JWT_EXPIRES_IN | Backend | Tempo de expiração do access token (default: 15m) |
| FRONTEND_URL | Backend | URL do frontend para CORS (default: http://localhost:4200) |
| REDIS_HOST | Backend, Worker | Host do Redis (default: localhost) |
| REDIS_PORT | Backend, Worker | Porta do Redis (default: 6379) |
| REDIS_PASSWORD | Backend, Worker | Senha do Redis (opcional) |
| RATE_LIMIT_TTL | Backend | TTL do rate limiting em segundos (default: 60) |
| RATE_LIMIT_MAX | Backend | Maximo de requests por TTL (default: 10) |
| PORT | Backend | Porta do servidor (default: 3000) |

---

*Documento gerado por engenharia reversa - Deployment View*
