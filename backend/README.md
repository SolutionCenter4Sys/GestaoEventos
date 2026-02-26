# Backend - Plataforma de Gestão de Eventos

Backend NestJS + Prisma + Supabase para o MVP Híbrido.

## 🚀 Setup Rápido

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar environment variables
Criar arquivo `.env` na raiz do backend:
```bash
# Supabase Database
DATABASE_URL="postgresql://postgres:[4gRhou@4gRhou]@db.vrliyffjqwqxnixwwhbk.supabase.co:5432/postgres"

# JWT
JWT_SECRET="<gerar_secret_forte_aqui>"
JWT_EXPIRES_IN="15m"
REFRESH_TOKEN_EXPIRES_IN="7d"

# Encryption (LGPD - Dados sensíveis)
ENCRYPTION_KEY="<gerar_key_32_bytes_base64>"

# Frontend URL
FRONTEND_URL="http://localhost:4200"

# Redis (BullMQ - Fila de E-mails)
REDIS_HOST="localhost"
REDIS_PORT="6379"
REDIS_PASSWORD=""

# reCAPTCHA Google
RECAPTCHA_SECRET_KEY="<sua_recaptcha_secret>"

# Email Provider (opcional - usar Supabase Edge Functions ou externo)
EMAIL_PROVIDER="supabase"
EMAIL_FROM="noreply@plataforma-eventos.com"

# Supabase (opcional - para Supabase Auth)
SUPABASE_URL="https://vrliyffjqwqxnixwwhbk.supabase.co"
SUPABASE_ANON_KEY="<sua_anon_key>"
SUPABASE_SERVICE_KEY="<sua_service_role_key>"
```

### 3. Setup do banco de dados
```bash
# Executar migration (cria todas as tabelas)
npx prisma migrate dev --name init

# Gerar Prisma Client
npx prisma generate

# Seed inicial (Admin + Templates)
npm run prisma:seed

# Visualizar dados (opcional)
npx prisma studio
```

### 4. Executar backend
```bash
# Desenvolvimento (hot-reload)
npm run start:dev

# Produção
npm run build
npm run start:prod
```

## 📂 Estrutura do Projeto

```
backend/
├── prisma/
│   ├── schema.prisma          # Schema do Prisma (todas as tabelas)
│   ├── seed.ts                # Seed data (Admin, templates)
│   └── migrations/            # Migrations (geradas automaticamente)
├── src/
│   ├── auth/                  # Módulo de autenticação (EP-08-F8.1)
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── strategies/        # JWT, Local strategies
│   │   ├── guards/            # Auth guard, RBAC guard
│   │   ├── decorators/        # @RequireRoles decorator
│   │   └── dto/               # Login, Recuperação, 2FA DTOs
│   ├── usuarios/              # Módulo de usuários (EP-08-F8.2)
│   │   ├── usuarios.controller.ts
│   │   ├── usuarios.service.ts
│   │   └── dto/
│   ├── eventos/               # Módulo de eventos (EP-02)
│   │   ├── eventos.controller.ts
│   │   ├── eventos.service.ts
│   │   └── dto/
│   ├── inscricoes/            # Módulo de inscrições (EP-03)
│   │   ├── inscricoes.controller.ts
│   │   ├── inscricoes.service.ts
│   │   └── dto/
│   ├── pacientes-modelo/      # Módulo de pacientes (EP-05)
│   │   ├── pacientes-modelo.controller.ts
│   │   ├── pacientes-modelo.service.ts
│   │   ├── crypto.service.ts  # Criptografia AES-256
│   │   └── dto/
│   ├── comunicacao/           # Módulo de e-mails (EP-06)
│   │   ├── email.service.ts
│   │   ├── gatilhos/
│   │   │   ├── gatilhos.listener.ts
│   │   │   └── gatilhos.service.ts
│   │   ├── queue/
│   │   │   ├── email.processor.ts
│   │   │   └── email.queue.ts
│   │   └── jobs/
│   │       └── lembretes.job.ts
│   ├── audit/                 # Módulo de auditoria (EP-08-F8.3)
│   │   ├── audit-log.service.ts
│   │   └── audit-log.controller.ts
│   ├── common/
│   │   ├── filters/           # Exception filters
│   │   ├── interceptors/      # Logging, Transform
│   │   ├── pipes/             # Validation pipe
│   │   └── decorators/        # Custom decorators
│   ├── prisma/
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   ├── app.module.ts
│   └── main.ts
├── test/
│   ├── auth.e2e-spec.ts
│   └── jest-e2e.json
├── .env.example
├── .gitignore
├── nest-cli.json
├── tsconfig.json
├── tsconfig.build.json
├── package.json
└── README.md
```

## 🗄️ Tabelas Criadas (Prisma Schema)

### Autenticação (EP-08)
- ✅ `usuarios` - Dados de usuários + perfis RBAC
- ✅ `refresh_tokens` - Tokens de refresh JWT
- ✅ `tokens_recuperacao_senha` - Tokens de recuperação
- ✅ `codigos_recuperacao_2fa` - Códigos backup 2FA
- ✅ `logs_autenticacao` - Auditoria de logins

### Eventos & Inscrições (EP-01, EP-02, EP-03)
- ✅ `solicitacoes` - Solicitações de eventos
- ✅ `eventos` - Eventos cadastrados
- ✅ `inscricoes` - Inscrições de participantes

### Pacientes Modelo (EP-05)
- ✅ `pacientes_modelo` - Dados com criptografia
- ✅ `consentimentos_lgpd` - Termos aceitos
- ✅ `audit_log_pacientes_modelo` - Auditoria append-only

### Comunicação (EP-06)
- ✅ `templates_email` - Templates HTML
- ✅ `gatilhos_config` - Configurações de gatilhos
- ✅ `email_queue_log` - Log de e-mails enviados
- ✅ `lembretes_enviados` - Controle de lembretes

### Certificados (EP-04)
- ✅ `certificados` - PDFs gerados

**Total:** 15 tabelas + enums

## 🎯 Próximos Passos

1. ✅ Estrutura criada
2. ⏭️ Instalar dependências (`npm install`)
3. ⏭️ Configurar Prisma Schema
4. ⏭️ Executar migrations
5. ⏭️ Implementar primeiro endpoint (Login)

---

**Status:** Estrutura de pastas criada! Pronto para npm install.
