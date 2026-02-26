# 📚 API Reference - Plataforma de Gestão de Eventos

**Base URL:** `http://localhost:3000/api`  
**Versão:** 1.0.0  
**Data:** 10/02/2026

---

## 🔐 Autenticação

Todas as rotas protegidas requerem um JWT no header:
```
Authorization: Bearer {accessToken}
```

---

## 📍 ENDPOINTS

### 1. AUTENTICAÇÃO

#### 1.1. Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@plataforma-eventos.com",
  "senha": "Admin123!@#",
  "codigoTwoFactor": "123456"  // opcional (se 2FA habilitado)
}
```

**Responses:**
- `200 OK` - Login bem-sucedido
  ```json
  {
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "550e8400-e29b-41d4-a716-446655440000",
    "usuario": {
      "id": "uuid",
      "nome": "Administrador do Sistema",
      "email": "admin@plataforma-eventos.com",
      "perfil": "ADMIN",
      "twoFactorHabilitado": false
    }
  }
  ```
- `200 OK` - 2FA necessário
  ```json
  {
    "requiresTwoFactor": true,
    "message": "Código de autenticação de dois fatores é necessário"
  }
  ```
- `401 Unauthorized` - Credenciais inválidas

#### 1.2. Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "550e8400-e29b-41d4-a716-446655440000"
}
```

#### 1.3. Recuperar Senha
```http
POST /auth/recuperar-senha
Content-Type: application/json

{
  "email": "usuario@exemplo.com"
}
```

#### 1.4. Resetar Senha
```http
POST /auth/resetar-senha
Content-Type: application/json

{
  "token": "token-recebido-por-email",
  "novaSenha": "NovaSenha123!@#"
}
```

#### 1.5. Perfil do Usuário
```http
GET /auth/me
Authorization: Bearer {accessToken}
```

#### 1.6. Logout
```http
POST /auth/logout
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "refreshToken": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

### 2. AUTENTICAÇÃO DE DOIS FATORES (2FA)

#### 2.1. Status do 2FA
```http
GET /auth/2fa/status
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "habilitado": false,
  "habilitadoEm": null
}
```

#### 2.2. Habilitar 2FA
```http
POST /auth/2fa/habilitar
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "secret": "JBSWY3DPEHPK3PXP",
  "qrCodeUrl": "data:image/png;base64,iVBORw0KGgoAAAANS...",
  "codigosRecuperacao": [
    "ABC12345",
    "DEF67890",
    ...
  ],
  "message": "Escaneie o QR Code no seu app autenticador e valide o código"
}
```

#### 2.3. Validar 2FA
```http
POST /auth/2fa/validar
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "codigo": "123456"
}
```

#### 2.4. Desabilitar 2FA
```http
DELETE /auth/2fa
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "codigo": "123456"
}
```

---

### 3. GESTÃO DE USUÁRIOS (Admin only)

#### 3.1. Listar Usuários
```http
GET /usuarios?page=1&limit=20&perfil=ADMIN
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "usuarios": [
    {
      "id": "uuid",
      "nome": "Usuário Teste",
      "email": "usuario@exemplo.com",
      "perfil": "PARTICIPANTE",
      "ativo": true,
      "criadoEm": "2026-02-10T19:00:00.000Z"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 20,
  "totalPages": 3
}
```

#### 3.2. Buscar Usuário
```http
GET /usuarios/{id}
Authorization: Bearer {accessToken}
```

#### 3.3. Alterar Perfil
```http
PUT /usuarios/{id}/perfil
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "perfil": "PROFESSOR"
}
```

**Response:**
```json
{
  "message": "Perfil atualizado com sucesso",
  "usuario": {
    "id": "uuid",
    "nome": "Usuário Teste",
    "email": "usuario@exemplo.com",
    "perfil": "PROFESSOR"
  }
}
```

---

## 🛡️ PERFIS DE USUÁRIO

| Perfil | Descrição | Permissões |
|--------|-----------|------------|
| `ADMIN` | Administrador | Acesso total ao sistema |
| `MARKETING` | Equipe de Marketing | Gerenciar eventos, comunicações |
| `VENDAS` | Equipe de Vendas | Criar solicitações, ver próprias solicitações |
| `PROFESSOR` | Professor/Instrutor | Gerenciar seus eventos, ver seus pacientes |
| `PARTICIPANTE` | Participante de Evento | Ver suas inscrições, certificados |
| `PACIENTE_MODELO` | Paciente Modelo | Acesso limitado aos próprios dados |

---

## ⚠️ CÓDIGOS DE ERRO

| Código | Descrição |
|--------|-----------|
| `400` | Bad Request - Dados inválidos |
| `401` | Unauthorized - Não autenticado |
| `403` | Forbidden - Sem permissão |
| `404` | Not Found - Recurso não encontrado |
| `429` | Too Many Requests - Rate limit excedido |
| `500` | Internal Server Error - Erro no servidor |

**Formato de Erro:**
```json
{
  "statusCode": 401,
  "timestamp": "2026-02-10T19:00:00.000Z",
  "path": "/api/auth/login",
  "method": "POST",
  "message": "E-mail ou senha incorretos"
}
```

---

## 🚦 RATE LIMITING

- **Limite Global:** 10 requisições por 60 segundos (por IP)
- **Limite de Login:** 5 tentativas (bloqueio de 1 hora após 5 falhas)

---

## 📝 NOTAS IMPORTANTES

1. **Tokens JWT:**
   - Access Token: Validade de 15 minutos
   - Refresh Token: Validade de 7 dias

2. **2FA:**
   - Códigos TOTP válidos por 30 segundos
   - Window de tolerância: 2 códigos (antes/depois)
   - 10 códigos de recuperação por usuário

3. **Recuperação de Senha:**
   - Token válido por 1 hora
   - Uso único (após resetar, token é invalidado)
   - Todos os refresh tokens são revogados

4. **Segurança:**
   - Senhas: Bcrypt com 12 salt rounds
   - 2FA: Speakeasy TOTP
   - Códigos recuperação: Bcrypt hash

---

## 🧪 EXEMPLOS DE USO (cURL)

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@plataforma-eventos.com",
    "senha": "Admin123!@#"
  }'
```

### Buscar Perfil (com JWT)
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Listar Usuários (Admin)
```bash
curl -X GET "http://localhost:3000/api/usuarios?page=1&limit=10" \
  -H "Authorization: Bearer {accessToken}"
```

---

*API Reference - v1.0.0 - Atualizado em 10/02/2026*
