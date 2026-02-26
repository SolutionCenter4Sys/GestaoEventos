# Plataforma de Gestão de Eventos – Frontend React

Refatoração do frontend Angular para React, seguindo os padrões definidos em `Specs/frontend`.

## Stack

- **Framework:** Next.js 14 (App Router)
- **Runtime:** React 18
- **Linguagem:** TypeScript 5
- **Estado:** Redux Toolkit
- **UI:** Material-UI v6
- **HTTP:** Axios com `httpClient` e FRONTEND_TRACE_ID

## Estrutura (Clean Architecture)

```
src/
├── app/              # Next.js App Router (rotas, layouts)
├── store/            # Redux store e slices
├── providers/        # Providers (Redux, MUI)
├── hooks/            # Hooks customizados (useAppDispatch, useAppSelector)
├── data/             # HTTP client, APIs
├── presentation/    # Componentes e layouts
├── shared/           # Constantes, tipos, tema, utils
└── domain/           # (futuro) entidades e interfaces
```

## Rodar o projeto

```bash
npm install
npm run dev
```

Aplicação em: **http://localhost:4301**

**Recomendado:** Node 20 LTS. Node 23+ pode causar erro no SWC - veja `FRONTEND-SWC-FIX.md` se ocorrer.

### Modo mock (validar telas sem backend)

Para validar as telas sem subir o backend, use o modo mock:

- **PowerShell:** `.\rodar-mock.ps1`
- **Duplo clique:** `RODAR-MOCK.bat`

O script define `NEXT_PUBLIC_MOCK=1` e inicia o servidor. Um usuário mock (Organizador, admin) é injetado automaticamente — sem necessidade de login. Um banner amarelo indica que está em modo demonstração.

### Apresentação (tudo em um: nvm + corrigir + rodar)

Para apresentação local sem git/docker — correção automática + Node 20 + servidor:

- **Duplo clique:** `APRESENTACAO-MOCK.bat`
- **PowerShell:** `.\APRESENTACAO-MOCK.ps1`

Usa nvm (Node 20) se disponível, corrige dependências e inicia o servidor. URL: http://localhost:4301

## Rotas

- **Públicas:** `/login`, `/recuperar-senha`, `/resetar-senha`, `/politica-privacidade`
- **Protegidas (com layout):** `/dashboard`, `/eventos`, `/solicitacoes`, `/meus-dados-privacidade`

## Configuração da API

Defina `window.__API_URL__` ou use o padrão `http://localhost:3000/api`.

## reCAPTCHA v3 (Inscrição pública)

Para produção, defina `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` no `.env.local` com sua chave do Google reCAPTCHA v3. Em desenvolvimento, é usada a chave de teste do Google (sempre passa).

## Tema (Design System PG V2)

Tema Material-UI com paleta Design System PG V2 (azul #3b82f6, sidebar #1e3a5f, neutros).
