# 🚀 Guia de Instalação e Teste - Sprint 1

**Data:** 10/02/2026  
**Objetivo:** Instalar dependências, configurar banco de dados e testar API

---

## 📋 PRÉ-REQUISITOS

Certifique-se de ter instalado:
- ✅ Node.js 20+ (`node --version`)
- ✅ npm 10+ (`npm --version`)
- ✅ Git (`git --version`)

---

## 🔧 PASSO 1: Instalar Dependências

### 1.1. Navegar para a pasta do backend
```bash
cd "c:\Cursor_Codigo\Simulacao BMAD\Plataforma-Gestao-Eventos\Plataforma-Gestao-Eventos_codigo-fonte\backend"
```

### 1.2. Instalar dependências do Node.js
```bash
npm install
```

**⏱️ Tempo estimado:** 2-3 minutos

**Pacotes principais instalados:**
- NestJS (framework)
- Prisma (ORM)
- JWT, Passport (autenticação)
- Bcrypt (hashing)
- Speakeasy (2FA)
- Class-validator (validação)
- BullMQ, IORedis (fila de emails)

---

## 🗄️ PASSO 2: Configurar Banco de Dados

### 2.1. Criar arquivo .env
```bash
# Copiar template
copy .env.example .env

# Ou criar manualmente com o conteúdo abaixo:
```

**Conteúdo do `.env`:**
```env
# Supabase Database
DATABASE_URL="postgresql://postgres:[4gRhou@4gRhou]@db.vrliyffjqwqxnixwwhbk.supabase.co:5432/postgres"

# JWT
JWT_SECRET="sua_chave_secreta_super_forte_min_32_caracteres_aqui_2026"
JWT_EXPIRES_IN="15m"
REFRESH_TOKEN_EXPIRES_IN="7d"

# Encryption (LGPD)
ENCRYPTION_KEY="base64_encoded_32_bytes_key_aqui"

# Frontend URL
FRONTEND_URL="http://localhost:4200"

# Redis (BullMQ - opcional por enquanto)
REDIS_HOST="localhost"
REDIS_PORT="6379"
REDIS_PASSWORD=""

# reCAPTCHA (opcional por enquanto)
RECAPTCHA_SECRET_KEY=""

# Email Provider (opcional por enquanto)
EMAIL_PROVIDER="console"
EMAIL_FROM="noreply@plataforma-eventos.com"

# Node Environment
NODE_ENV="development"
PORT="3000"

# Rate Limiting
RATE_LIMIT_TTL="60"
RATE_LIMIT_MAX="10"
```

### 2.2. Executar Migration (criar tabelas)
```bash
npx prisma migrate dev --name init
```

**✅ Resultado esperado:**
```
✔ Generated Prisma Client
✔ The migration has been created successfully
✔ Applied 1 migration
```

**⏱️ Tempo estimado:** 30 segundos

### 2.3. Executar Seed (dados iniciais)
```bash
npm run prisma:seed
```

**✅ Resultado esperado:**
```
🌱 Iniciando seed do banco de dados...

[1/3] Criando Admin padrão...
   ✅ Admin criado: admin@plataforma-eventos.com
   📧 Email: admin@plataforma-eventos.com
   🔑 Senha: Admin123!@#

[2/3] Criando templates de e-mail...
   ✅ Template criado: inscricao_confirmada
   ✅ Template criado: lembrete_7d_antes
   ✅ Template criado: recuperacao_senha

[3/3] Criando gatilhos automáticos...
   ✅ Gatilho criado: inscricao_confirmada (IMEDIATO)
   ✅ Gatilho criado: lembrete_7d_antes (7 DIAS ANTES)
   ✅ Gatilho criado: lembrete_3d_antes (3 DIAS ANTES)
   ✅ Gatilho criado: lembrete_1d_antes (1 DIA ANTES)

============================================================
✅ SEED CONCLUÍDO COM SUCESSO!
============================================================

📊 RESUMO:
  • 1 Admin criado
  • 3 Templates de e-mail criados
  • 4 Gatilhos automáticos configurados

🔑 CREDENCIAIS DO ADMIN:
  Email: admin@plataforma-eventos.com
  Senha: Admin123!@#

🚀 Próximo passo: npm run start:dev
============================================================
```

### 2.4. (Opcional) Visualizar dados no Prisma Studio
```bash
npx prisma studio
```
Abre em: `http://localhost:5555`

---

## ▶️ PASSO 3: Iniciar o Backend

```bash
npm run start:dev
```

**✅ Resultado esperado:**
```
[Nest] 12345  - 10/02/2026, 19:45:00     LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 10/02/2026, 19:45:00     LOG [InstanceLoader] PrismaModule dependencies initialized
[Nest] 12345  - 10/02/2026, 19:45:00     LOG [InstanceLoader] AuthModule dependencies initialized
✅ Prisma conectado ao Supabase PostgreSQL
[Nest] 12345  - 10/02/2026, 19:45:01     LOG [NestApplication] Nest application successfully started

🚀 Backend rodando em: http://localhost:3000/api
📖 Prisma Studio: http://localhost:5555
📊 Metrics (Prometheus): http://localhost:9090/metrics
```

**🎉 BACKEND ESTÁ NO AR!**

---

## 🧪 PASSO 4: Testar a API

### 4.1. Testar Health Check
Abra o navegador em: `http://localhost:3000/api`

Ou use cURL:
```bash
curl http://localhost:3000/api
```

### 4.2. Testar Login do Admin

**Opção 1: cURL (Terminal)**
```bash
curl -X POST http://localhost:3000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@plataforma-eventos.com\",\"senha\":\"Admin123!@#\"}"
```

**Opção 2: PowerShell**
```powershell
$body = @{
    email = "admin@plataforma-eventos.com"
    senha = "Admin123!@#"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

**Opção 3: Thunder Client / Postman / Insomnia**
```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "admin@plataforma-eventos.com",
  "senha": "Admin123!@#"
}
```

**✅ Response esperado (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI...",
  "refreshToken": "550e8400-e29b-41d4-a716-446655440000",
  "usuario": {
    "id": "uuid-do-admin",
    "nome": "Administrador do Sistema",
    "email": "admin@plataforma-eventos.com",
    "perfil": "ADMIN",
    "twoFactorHabilitado": false
  }
}
```

**🎉 LOGIN FUNCIONANDO!** Copie o `accessToken` para os próximos testes.

### 4.3. Testar Perfil do Usuário (Rota Protegida)

**cURL:**
```bash
curl -X GET http://localhost:3000/api/auth/me ^
  -H "Authorization: Bearer SEU_ACCESS_TOKEN_AQUI"
```

**PowerShell:**
```powershell
$token = "SEU_ACCESS_TOKEN_AQUI"

Invoke-RestMethod -Uri "http://localhost:3000/api/auth/me" `
  -Method GET `
  -Headers @{ "Authorization" = "Bearer $token" }
```

**✅ Response esperado:**
```json
{
  "id": "uuid-do-admin",
  "email": "admin@plataforma-eventos.com",
  "nome": "Administrador do Sistema",
  "perfil": "ADMIN"
}
```

### 4.4. Testar Listar Usuários (Admin Only)

```bash
curl -X GET "http://localhost:3000/api/usuarios?page=1&limit=10" ^
  -H "Authorization: Bearer SEU_ACCESS_TOKEN_AQUI"
```

**✅ Response esperado:**
```json
{
  "usuarios": [
    {
      "id": "uuid",
      "nome": "Administrador do Sistema",
      "email": "admin@plataforma-eventos.com",
      "perfil": "ADMIN",
      "ativo": true,
      "criadoEm": "2026-02-10T19:40:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

### 4.5. Testar 2FA (Opcional)

**Habilitar 2FA:**
```bash
curl -X POST http://localhost:3000/api/auth/2fa/habilitar ^
  -H "Authorization: Bearer SEU_ACCESS_TOKEN_AQUI"
```

**✅ Response:**
```json
{
  "secret": "JBSWY3DPEHPK3PXP",
  "qrCodeUrl": "data:image/png;base64,iVBORw0KGgo...",
  "codigosRecuperacao": [
    "ABC12345",
    "DEF67890",
    ...
  ],
  "message": "Escaneie o QR Code no seu app autenticador e valide o código"
}
```

1. Copie o `qrCodeUrl` e abra no navegador (é uma imagem base64)
2. Escaneie com Google Authenticator / Authy
3. Use o código gerado para validar:

```bash
curl -X POST http://localhost:3000/api/auth/2fa/validar ^
  -H "Authorization: Bearer SEU_ACCESS_TOKEN_AQUI" ^
  -H "Content-Type: application/json" ^
  -d "{\"codigo\":\"123456\"}"
```

---

## ✅ CHECKLIST DE VALIDAÇÃO

Marque conforme testa:

- [ ] Dependências instaladas (`npm install`)
- [ ] Migration executada (15 tabelas criadas)
- [ ] Seed executado (Admin + Templates)
- [ ] Backend iniciado (porta 3000)
- [ ] Login funcionando (POST /auth/login)
- [ ] Perfil retornando (GET /auth/me)
- [ ] Listar usuários funcionando (GET /usuarios)
- [ ] 2FA testado (opcional)

---

## 🐛 TROUBLESHOOTING

### Erro: "Cannot find module '@nestjs/core'"
**Solução:** Execute `npm install` novamente

### Erro: "Prisma Client not generated"
**Solução:** Execute `npx prisma generate`

### Erro: "Port 3000 already in use"
**Solução:** 
1. Encontre o processo: `netstat -ano | findstr :3000`
2. Mate o processo: `taskkill /PID <PID> /F`
3. Ou altere a porta no `.env`: `PORT=3001`

### Erro: "Connection refused - PostgreSQL"
**Solução:** Verifique a `DATABASE_URL` no `.env`

### Erro: "JWT secret not configured"
**Solução:** Defina `JWT_SECRET` no `.env`

---

## 📊 TESTES AUTOMATIZADOS (Próximo passo)

Para executar testes (quando implementados):
```bash
# Testes unitários
npm run test

# Testes E2E
npm run test:e2e

# Coverage
npm run test:cov
```

---

## 🎉 PRÓXIMOS PASSOS

Após validar que tudo está funcionando:

1. **Explorar Prisma Studio** (`npx prisma studio`)
   - Ver tabelas criadas
   - Explorar dados do Admin
   - Ver templates de email

2. **Testar Rate Limiting**
   - Fazer 11 requisições rápidas ao /auth/login
   - Deve retornar 429 (Too Many Requests)

3. **Testar Recuperação de Senha**
   - POST /auth/recuperar-senha
   - Verificar logs no console (token gerado)

4. **Importar Collection do Postman**
   - Criar collection com todos os endpoints
   - Salvar para reutilização

5. **Avançar para Sprint 2**
   - Implementar EP-03 (Inscrições Públicas)

---

**🎊 PARABÉNS! Sua API está rodando com sucesso!** 🎊

*Guia de Instalação - Sprint 1 - 10/02/2026*
