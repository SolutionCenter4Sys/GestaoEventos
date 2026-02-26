# 🚀 STEP 5 - PLANO DE DESENVOLVIMENTO MVP HÍBRIDO

**Data Início:** 10/02/2026  
**Banco de Dados:** Supabase (PostgreSQL)  
**Status:** 🔄 EM ANDAMENTO

---

## 📊 ARQUITETURA TÉCNICA

### Stack Tecnológica Definida

**Backend:**
- **Framework:** NestJS (Node.js + TypeScript)
- **ORM:** Prisma (integração nativa com Supabase)
- **Banco de Dados:** Supabase PostgreSQL
- **Autenticação:** Supabase Auth + JWT
- **Fila:** BullMQ + Redis (Upstash Redis ou local)
- **Validação:** class-validator + class-transformer
- **Criptografia:** crypto (AES-256-GCM) + AWS KMS ou Supabase Vault

**Frontend:**
- **Framework:** Angular 17+ (standalone components)
- **UI:** Angular Material + Design System customizado
- **State Management:** RxJS + BehaviorSubjects
- **Forms:** Reactive Forms
- **HTTP:** HttpClient + Interceptors

**Infraestrutura:**
- **Database:** Supabase PostgreSQL
- **Storage:** Supabase Storage (documentos, QR Codes)
- **Auth:** Supabase Auth (JWT)
- **Logs:** Supabase Logging + Winston (local)
- **Deploy:** Vercel (Frontend) + Railway/Render (Backend)

---

## 🎯 ORDEM DE DESENVOLVIMENTO (Por Dependência)

### 🔴 SPRINT 0: Setup & Fundação (Semana 1)

**Objetivo:** Configurar infraestrutura base e banco de dados

#### 0.1. Configuração do Projeto
- [ ] Criar repositório Git
- [ ] Estrutura de pastas (monorepo: backend/ + frontend/)
- [ ] Configurar NestJS + Prisma
- [ ] Configurar Angular 17
- [ ] Configurar Supabase connection

#### 0.2. Schema do Banco de Dados (Prioridade)
- [ ] **EP-08**: Tabelas de autenticação e RBAC
  - `usuarios` (nome, email, senha_hash, perfil, ativo, 2fa)
  - `refresh_tokens`
  - `logs_autenticacao`
  - `codigos_recuperacao_2fa`
  - `tokens_recuperacao_senha`
  
- [ ] **EP-03**: Tabelas de eventos e inscrições
  - `eventos` (nome, data_inicio, capacidade, publicado)
  - `inscricoes` (evento_id, participante_id, cpf, status, qr_code)
  
- [ ] **EP-05**: Tabelas de pacientes modelo (LGPD)
  - `pacientes_modelo` (nome, cpf, historico_saude_cripto, evento_id)
  - `consentimentos_lgpd`
  - `audit_log_pacientes_modelo`
  
- [ ] **EP-06**: Tabelas de comunicação
  - `templates_email`
  - `gatilhos_config`
  - `email_queue_log`
  - `lembretes_enviados`

#### 0.3. Configuração Supabase
- [ ] Executar migrations (Prisma migrate)
- [ ] Configurar Row Level Security (RLS) no Supabase
- [ ] Configurar Storage buckets (documentos, qr-codes)
- [ ] Configurar Supabase Auth providers
- [ ] Configurar environment variables

---

### 🔴 SPRINT 1: Autenticação & RBAC (Semanas 2-3)

**Features:** EP-08-F8.1 + EP-08-F8.2 (11 US | 39 SP)

#### Backend (6 US)
1. ✅ **EP-08-F8.1-US-BE-01**: Endpoint de Login (JWT + bcrypt)
2. ✅ **EP-08-F8.1-US-BE-02**: Endpoint de Recuperação de Senha
3. ✅ **EP-08-F8.1-US-BE-03**: Implementação de 2FA (TOTP)
4. ✅ **EP-08-F8.1-US-BE-04**: Rate Limiting e Logs
5. ✅ **EP-08-F8.2-US-BE-01**: Middleware de Autorização RBAC
6. ✅ **EP-08-F8.2-US-BE-02**: Filtros de Ownership

#### Frontend (4 US)
1. ✅ **EP-08-F8.1-US-FE-01**: Tela de Login
2. ✅ **EP-08-F8.1-US-FE-02**: Configuração de 2FA
3. ✅ **EP-08-F8.2-US-FE-01**: Menu Dinâmico por Perfil
4. ✅ **EP-08-F8.2-US-FE-02**: Gestão de Perfis (Admin)

**Entrega Sprint 1:** Sistema de autenticação completo + RBAC funcional

---

### 🟡 SPRINT 2: Inscrições Públicas (Semana 4)

**Feature:** EP-03-F3.1 (7 US | 21 SP)

#### Backend (4 US)
1. ✅ **EP-03-F3.1-US-BE-01**: Endpoint de Criação de Inscrição
2. ✅ **EP-03-F3.1-US-BE-02**: Validações Server-Side (CPF, CAPTCHA)
3. ✅ **EP-03-F3.1-US-BE-03**: Criação Automática de Conta
4. ✅ **EP-03-F3.1-US-BE-04**: E-mail de Confirmação com QR Code

#### Frontend (3 US)
1. ✅ **EP-03-F3.1-US-FE-01**: Formulário de Inscrição Público
2. ✅ **EP-03-F3.1-US-FE-02**: Validações em Tempo Real
3. ✅ **EP-03-F3.1-US-FE-03**: Confirmação Visual

**Entrega Sprint 2:** Interface pública de inscrição funcional + criação automática de contas

---

### 🟡 SPRINT 3: Gatilhos Automáticos (Semana 5)

**Feature:** EP-06-F6.2 (4 US | 17 SP)

#### Backend (3 US)
1. ✅ **EP-06-F6.2-US-BE-01**: Motor de Gatilhos (Event-Driven)
2. ✅ **EP-06-F6.2-US-BE-02**: Fila de E-mails com Retry (BullMQ)
3. ✅ **EP-06-F6.2-US-BE-03**: Job Agendado de Lembretes (Cron)

#### Frontend (1 US)
1. ✅ **EP-06-F6.2-US-FE-01**: Configuração de Gatilhos

**Entrega Sprint 3:** Sistema de e-mails transacionais automatizado + lembretes

---

### 🟢 SPRINT 4: Pacientes Modelo (Semana 6)

**Feature:** EP-05-F5.1 (5 US | 19 SP)

#### Backend (3 US)
1. ✅ **EP-05-F5.1-US-BE-01**: Endpoint com Criptografia AES-256
2. ✅ **EP-05-F5.1-US-BE-02**: Endpoint de Listagem com RBAC
3. ✅ **EP-05-F5.1-US-BE-03**: Log de Auditoria LGPD

#### Frontend (2 US)
1. ✅ **EP-05-F5.1-US-FE-01**: Formulário de Cadastro
2. ✅ **EP-05-F5.1-US-FE-02**: Lista de Pacientes por Evento

**Entrega Sprint 4:** Gestão de pacientes modelo com conformidade LGPD completa

---

### 🔵 SPRINT 5: Testes & Ajustes (Semanas 7-8)

**Objetivo:** Testes integrados, correções e refinamentos

- [ ] Testes E2E (Cypress) - fluxos críticos
- [ ] Testes de integração (Backend)
- [ ] Testes de performance (K6)
- [ ] Correções de bugs
- [ ] Refinamento de UX
- [ ] Documentação técnica
- [ ] Deploy em staging

---

## 🗄️ SCHEMA SUPABASE (Prioridade 1)

### Configuração de Conexão

**Connection String:**
```
postgresql://postgres:[4gRhou@4gRhou]@db.vrliyffjqwqxnixwwhbk.supabase.co:5432/postgres
```

**Environment Variables (.env):**
```bash
# Supabase
DATABASE_URL="postgresql://postgres:[4gRhou@4gRhou]@db.vrliyffjqwqxnixwwhbk.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[4gRhou@4gRhou]@db.vrliyffjqwqxnixwwhbk.supabase.co:5432/postgres"

SUPABASE_URL="https://vrliyffjqwqxnixwwhbk.supabase.co"
SUPABASE_ANON_KEY="<sua_anon_key>"
SUPABASE_SERVICE_KEY="<sua_service_role_key>"

# JWT
JWT_SECRET="<gerar_secret_forte>"
JWT_EXPIRES_IN="15m"
REFRESH_TOKEN_EXPIRES_IN="7d"

# Email
EMAIL_PROVIDER="supabase" # ou AWS_SES, SENDGRID
EMAIL_FROM="noreply@plataforma-eventos.com"

# Encryption (LGPD)
ENCRYPTION_KEY="<gerar_key_32_bytes_base64>"

# Frontend
FRONTEND_URL="http://localhost:4200"

# Redis (BullMQ)
REDIS_HOST="localhost"
REDIS_PORT="6379"
REDIS_PASSWORD=""

# reCAPTCHA
RECAPTCHA_SECRET_KEY="<sua_recaptcha_secret>"
```

---

## 📋 PRÓXIMAS AÇÕES IMEDIATAS

### 1️⃣ Criar Estrutura do Projeto (Agora)
```bash
mkdir -p Plataforma-Gestao-Eventos/{backend,frontend}
cd Plataforma-Gestao-Eventos

# Backend (NestJS)
npx @nestjs/cli new backend

# Frontend (Angular)
npx @angular/cli new frontend --standalone --routing --style=scss

# Prisma
cd backend
npm install @prisma/client prisma
npx prisma init --datasource-provider postgresql
```

### 2️⃣ Configurar Prisma Schema (Próximo)
- Criar arquivo `prisma/schema.prisma` com todas as tabelas
- Executar `npx prisma migrate dev --name init`
- Verificar no Supabase Dashboard

### 3️⃣ Implementar EP-08-F8.1-US-BE-01 (Primeiro Endpoint)
- Módulo de autenticação
- Service de login
- Controller POST /auth/login
- Validações bcrypt + JWT

---

## 🎯 DECISÃO NECESSÁRIA

**Você quer que eu:**

**A)** Criar a estrutura completa do projeto agora (pastas, package.json, configs)  
**B)** Criar o Prisma Schema completo com todas as tabelas primeiro  
**C)** Começar direto implementando o primeiro endpoint (Login)  
**D)** Configurar o Supabase na UI primeiro (RLS, Storage, etc.)

**Qual opção você prefere?** Digite A, B, C ou D para continuar! 🚀

---

*Plano de Desenvolvimento - Step 5 - Fevereiro/2026*
