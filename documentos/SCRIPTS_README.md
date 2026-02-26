# 📜 Scripts de Automação - Plataforma de Gestão de Eventos

Scripts PowerShell e Batch para facilitar instalação e execução do backend.

---

## 👤 Não sou administrador da máquina

**Forma mais fácil:** use um único atalho que faz tudo e já sobe o backend:

| Arquivo | Descrição |
|---------|-----------|
| **RODAR-BACKEND-SEM-ADMIN.bat** | Clique duplo: configura (se precisar) e inicia o backend. Não precisa ser admin. |
| **rodar-backend-sem-admin.ps1** | Mesma coisa, pelo PowerShell: `.\rodar-backend-sem-admin.ps1` |

**Passos:**
1. Dê **clique duplo** em **RODAR-BACKEND-SEM-ADMIN.bat**
2. Na primeira vez: o script copia o backend para sua pasta de usuário, instala dependências, configura o banco e inicia o servidor.
3. Nas próximas vezes: só inicia o servidor (API em http://localhost:3000/api).

Outros scripts opcionais (sem admin):

| Arquivo | Descrição |
|---------|-----------|
| **setup-backend-sem-admin.ps1** | Só o setup (sem iniciar o servidor) |
| **iniciar-backend-local.ps1** | Só inicia o backend (projeto ou pasta do usuário) |

Ver também a seção **"Rodar sem ser administrador"** mais abaixo.

---

## 📋 Scripts Disponíveis

| Arquivo | Descrição |
|---------|-----------|
| **setup-backend.ps1** | Setup completo (recomendado se você for admin) |
| **setup-backend-sem-admin.ps1** | Setup sem precisar de administrador |
| **iniciar-backend.ps1** | Inicia o servidor na pasta do projeto |
| **iniciar-backend-local.ps1** | Inicia o servidor (projeto ou pasta do usuário) |
| **testar-login.ps1** | Testa o endpoint de login da API |
| **EXECUTAR-SETUP-ADMIN.bat** | Atalho para rodar setup como administrador |

---

## 🚀 Uso Rápido

### Opção 1: Duplo clique (recomendado para primeira vez)

1. **Clique com o botão direito** em `EXECUTAR-SETUP-ADMIN.bat`
2. Selecione **"Executar como administrador"**
3. Aguarde a conclusão (2-5 min)
4. Se perguntar "Deseja iniciar o servidor agora?", digite **S**

### Opção 2: PowerShell

1. Abra **PowerShell** (de preferência como Administrador)
2. Navegue até a pasta do projeto:
   ```powershell
   cd "C:\Cursor_Codigo\Simulacao BMAD\Plataforma-Gestao-Eventos"
   ```
3. Execute o setup:
   ```powershell
   .\setup-backend.ps1
   ```
4. Se aparecer erro de política de execução:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   .\setup-backend.ps1
   ```

### Depois do setup

**Iniciar o backend:**
```powershell
.\iniciar-backend.ps1
```

**Testar login** (em outro terminal, com backend rodando):
```powershell
.\testar-login.ps1
```

---

## 📖 O que cada script faz

### setup-backend.ps1
1. Verifica se Node.js está instalado  
2. Verifica pasta do backend  
3. Cria `.env` a partir de `.env.example` (se não existir)  
4. Limpa cache e executa `npm install`  
5. Executa `npx prisma generate`  
6. Executa `npx prisma migrate dev --name init`  
7. Executa `npx prisma db seed` (Admin + templates)  
8. Pergunta se deseja iniciar o servidor  

### iniciar-backend.ps1
- Entra na pasta do backend e executa `npm run start:dev`  
- Verifica se as dependências estão instaladas  

### testar-login.ps1
- Envia POST para `http://localhost:3000/api/auth/login`  
- Usa credenciais: admin@plataforma-eventos.com / Admin123!@#  
- Exibe usuário e token em caso de sucesso  

---

## ⚠️ Problemas Comuns

### "Não é possível carregar o arquivo... a execução de scripts está desabilitada"
**Solução:** No PowerShell (como Admin):
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### npm install falha com EPERM
**Solução:** Execute o setup como **Administrador** (clique direito no .bat → Executar como administrador).

### Prisma migrate falha
**Solução:** Confira a `DATABASE_URL` no arquivo `Plataforma-Gestao-Eventos_codigo-fonte\backend\.env`.

### testar-login retorna erro de conexão
**Solução:** Inicie o backend antes com `.\iniciar-backend.ps1`.

---

## 📁 Estrutura

```
Plataforma-Gestao-Eventos/
├── RODAR-BACKEND-SEM-ADMIN.bat    ← [SEM ADMIN] Clique duplo: configura e sobe o backend
├── rodar-backend-sem-admin.ps1    ← [SEM ADMIN] Script que o .bat chama
├── setup-backend.ps1              ← Setup completo (com admin)
├── setup-backend-sem-admin.ps1    ← Setup SEM admin (so setup, nao inicia)
├── iniciar-backend.ps1            ← Iniciar (pasta do projeto)
├── iniciar-backend-local.ps1      ← Iniciar (projeto ou pasta do usuario)
├── testar-login.ps1               ← Testar API
├── EXECUTAR-SETUP-ADMIN.bat       ← Atalho (executar como admin)
├── SCRIPTS_README.md              ← Este arquivo
└── Plataforma-Gestao-Eventos_codigo-fonte/
    └── backend/
        ├── .env
        ├── package.json
        └── ...
```

---

*Scripts criados em 10/02/2026*
