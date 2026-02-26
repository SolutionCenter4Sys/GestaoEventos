# Frontend React — Design System Foursys

Versão da Plataforma de Gestão de Eventos que aplica o **Design System Foursys** (design-toolkit-17-12.md), alinhado aos princípios UX do BMAD.

## Identidade Visual

- **Primary:** #000000 (preto)
- **Accent:** #18C964 (verde)
- **Gradiente:** `linear-gradient(135deg, #9A1BFF 0%, #7B1CE5 40%, #4F46E5 100%)`
- **Superfícies:** #F5F3FF (fundo), #FFFFFF (cards)
- **Radius:** LG 20px, Pill 999px para botões
- **Sombras:** Soft e Hover conforme tokens

## Diferenças em relação ao frontend-react original

| Aspecto | Original (Alur) | Foursys |
|---------|-----------------|---------|
| Sidebar | Gradiente azul escuro | Gradiente roxo→azul (#4F46E5 → #9A1BFF) |
| Item ativo | Azul #3b82f6 | Verde accent #18C964 |
| CTAs | Azul | Preto (primary) ou verde (accent) |
| Botões | Radius 8px | Radius Pill (999px) |
| Cards | Radius 12px | Radius 20px |
| Background | #f8fafc | #F5F3FF |

## Execução

```powershell
.\rodar-mock.ps1
```

Ou manualmente:

```powershell
$env:NEXT_PUBLIC_MOCK = "1"
npm run dev
```

Acesse **http://localhost:4302** (porta 4302 para não conflitar com o frontend original na 4301).

## Estrutura

- `shared/theme/foursysTheme.ts` — tema MUI
- `styles/tokens.css` — tokens CSS
- `styles/globals.css` — estilos globais
- `presentation/layouts/MainLayout.tsx` — layout com Design System Foursys
