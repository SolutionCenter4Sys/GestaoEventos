# Correção do erro SWC do Next.js

Erro: `Failed to load SWC binary for win32/x64` ou `não é um aplicativo Win32 válido`

## Solução rápida (recomendado)

1. Execute o script de correção:
   - **Windows:** `.\corrigir-frontend.ps1` ou duplo clique em `CORRIGIR-FRONTEND.bat`

2. Depois execute: `.\rodar-mock.ps1`

## Se o erro persistir

### 1. Use Node 20 LTS

O Node 23 pode ter incompatibilidade com o binário SWC do Next.js.

**Com nvm (Node Version Manager):**
```powershell
nvm install 20
nvm use 20
.\corrigir-frontend.ps1
.\rodar-mock.ps1
```

**Instalação manual:** Baixe Node 20 LTS de https://nodejs.org (versão LTS)

### 2. Instale o Visual C++ Redistributable

Obrigatório no Windows para módulos nativos do Node:

- **x64:** https://aka.ms/vs/17/release/vc_redist.x64.exe
- **x86:** https://aka.ms/vs/17/release/vc_redist.x86.exe

Após instalar, reinicie o terminal e execute `.\corrigir-frontend.ps1`.

### 3. Reinstalação manual

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
Remove-Item -Recurse -Force .next
npm cache clean --force
npm install
.\rodar-mock.ps1
```

## Verificação

- Node: `node -v` (recomendado: v20.x.x)
- Arquitetura: `node -p "process.arch"` (deve ser `x64`)
