# ⚠️ ERRO DE INSTALAÇÃO - SOLUÇÃO

## Problema Identificado

O `npm install` falhou devido a erro de permissão do Windows (EPERM - código: -4048).

**Causa:** Windows Defender, Antivírus ou falta de permissões podem bloquear a instalação de pacotes do npm.

---

## 🔧 SOLUÇÕES (Tente na ordem)

### **SOLUÇÃO 1: Executar Como Administrador** ⭐ (Recomendado)

1. **Feche o Cursor/VSCode completamente**

2. **Abra PowerShell como Administrador:**
   - Pressione `Win + X`
   - Selecione "Windows PowerShell (Admin)" ou "Terminal (Admin)"

3. **Navegue até a pasta do backend:**
   ```powershell
   cd "C:\Cursor_Codigo\Simulacao BMAD\Plataforma-Gestao-Eventos\Plataforma-Gestao-Eventos_codigo-fonte\backend"
   ```

4. **Execute o npm install:**
   ```powershell
   npm install --force
   ```

5. **Aguarde a conclusão** (2-5 minutos)

---

### **SOLUÇÃO 2: Limpar Cache do npm**

Se a Solução 1 falhar:

```powershell
# 1. Limpar cache do npm
npm cache clean --force

# 2. Remover node_modules (se existir)
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue

# 3. Remover package-lock.json (se existir)
Remove-Item package-lock.json -ErrorAction SilentlyContinue

# 4. Instalar novamente
npm install
```

---

### **SOLUÇÃO 3: Desabilitar Temporariamente o Antivírus**

Se as soluções anteriores falharem:

1. Desabilite temporariamente o Windows Defender ou outro antivírus
2. Execute `npm install` novamente
3. Reative o antivírus após a instalação

---

### **SOLUÇÃO 4: Usar yarn** (Alternativa)

Se npm continuar falhando, use yarn:

```powershell
# Instalar yarn (se não tiver)
npm install -g yarn

# Instalar dependências com yarn
yarn install
```

---

## ✅ **APÓS A INSTALAÇÃO BEM-SUCEDIDA**

Quando as dependências estiverem instaladas, execute:

### 1. Configurar Prisma e Banco de Dados

```powershell
# Gerar Prisma Client
npx prisma generate

# Executar Migration (criar tabelas no Supabase)
npx prisma migrate dev --name init

# Executar Seed (criar Admin + Templates)
npm run prisma:seed
```

### 2. Iniciar o Backend

```powershell
npm run start:dev
```

### 3. Testar API

```powershell
# Testar login (novo terminal)
$body = @{
    email = "admin@plataforma-eventos.com"
    senha = "Admin123!@#"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

---

## 📊 **VERIFICAÇÃO DE SUCESSO**

Você saberá que funcionou quando ver:

### npm install completo:
```
added 1243 packages in 2m
```

### Prisma migrate:
```
✔ Generated Prisma Client
✔ The migration has been created successfully
✔ Applied 1 migration
```

### Backend rodando:
```
[Nest] 12345  - LOG [NestFactory] Starting Nest application...
✅ Prisma conectado ao Supabase PostgreSQL
[Nest] 12345  - LOG [NestApplication] Nest application successfully started

🚀 Backend rodando em: http://localhost:3000/api
```

---

## 🆘 **SE AINDA ASSIM FALHAR**

Entre em contato com informações do erro:

1. Qual solução você tentou?
2. Qual foi o erro exato?
3. Screenshot do erro (se possível)

---

## 💡 **DICA PRO**

Para evitar problemas futuros no Windows:

1. Adicione exceção no Windows Defender:
   - Configurações → Segurança do Windows → Proteção contra vírus e ameaças
   - Gerenciar configurações → Adicionar exclusão
   - Adicionar pasta: `C:\Cursor_Codigo\`

2. Execute sempre o terminal como Administrador para operações do npm

---

**Boa sorte! 🚀**

*Guia de Solução de Problemas - 10/02/2026*
