# Frontend em modo MOCK (sem backend)

Para testar todas as telas da Plataforma de Gestão de Eventos **sem subir o backend**, use o modo mock.

## Como rodar

1. **Pela pasta do projeto (recomendado)**  
   Dê duplo clique em:
   - `RODAR-FRONTEND-MOCK.bat`  
   Ou no PowerShell:
   - `.\rodar-frontend-mock.ps1`

2. **Manual**  
   Na pasta do frontend:
   ```bash
   cd Plataforma-Gestao-Eventos_codigo-fonte\frontend
   npm install
   npx ng serve
   ```

3. Abra no navegador: **http://localhost:4200/?mock=1**

## Comportamento no modo mock

- Com **?mock=1** na URL (ou após ter aberto uma vez com `?mock=1`), o app usa dados falsos em memória.
- O indicador **"Modo demonstração (dados mock – sem backend)"** aparece na tela de login.
- **Login:** qualquer e-mail e senha válidos (ex.: `admin@eventos.com` / `123456`) → entra como admin.
- **Recuperar senha / Resetar senha:** retorno de sucesso simulado.
- **2FA:** QR code placeholder e qualquer código de 6 dígitos aceito.
- **Gestão de perfis:** lista de 3 usuários mock; alteração de perfil simulada.
- **Gatilhos:** 3 gatilhos mock; ativar/desativar e salvar simulados.
- **Inscrição pública:** use `/inscricao/ev-1?mock=1` (ou outro id); evento "Evento Mock - Workshop 2026"; inscrição retorna sucesso.
- **Pacientes modelo:** lista e cadastro com dados mock.

## Desativar o modo mock

- Abra a aplicação **sem** `?mock=1` na URL, **ou**
- No console do navegador: `localStorage.removeItem('USE_MOCK')` e recarregue a página.

## Rodar em outra porta (ex.: 4201)

Use o script com porta customizada (útil quando a 4200 já está em uso):

1. **Duplo clique** em `RODAR-FRONTEND-MOCK-PORTA.bat` → sobe na porta **4201** (padrão) e **valida a compilação** antes de subir.
2. **Porta específica:** `RODAR-FRONTEND-MOCK-PORTA.bat 4300` → sobe na porta 4300.
3. **Sem validar compilação:** `RODAR-FRONTEND-MOCK-PORTA.bat 4201 skipbuild` → pula o `ng build` e sobe direto.

No PowerShell:
```powershell
.\rodar-frontend-mock-porta.ps1 -Porta 4201
.\rodar-frontend-mock-porta.ps1 -Porta 4300 -SkipBuild
```

Depois abra no navegador: **http://localhost:4201/?mock=1** (ou a porta que escolheu).

## Scripts

| Arquivo | Uso |
|--------|-----|
| `RODAR-FRONTEND-MOCK.bat` | Inicia o frontend na porta 4200. |
| `rodar-frontend-mock.ps1` | Script PowerShell; faz `npm install` se necessário e `ng serve`. |
| `RODAR-FRONTEND-MOCK-PORTA.bat` | Inicia em outra porta (padrão 4201); valida compilação antes de subir. |
| `rodar-frontend-mock-porta.ps1` | PowerShell com `-Porta` e `-SkipBuild`; chama `ng build` e depois `ng serve --port`. |

O mock é implementado em `frontend/src/app/core/interceptors/mock.interceptor.ts`.
