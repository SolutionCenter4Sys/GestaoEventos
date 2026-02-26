# Diagrama de Código (C4 - Nível 4) - Outlook Integration Module

**Versão**: 1.0 (Engenharia Reversa)
**Data**: 18/02/2026
**Nível C4**: 4 - Code
**Épico**: EP-07 - Integração com Microsoft Outlook Calendar
**Status**: Pendente (Frontend pronto)

---

## Diagrama de Classes

```mermaid
classDiagram
    class OutlookModule {
        <<NestJS Module>>
        +imports: PrismaModule, EventEmitterModule, ScheduleModule, BullModule
        +controllers: OutlookController, SincronizacaoController, FusoHorarioController
        +providers: OutlookAuthService, OutlookCalendarService, SincronizacaoService, OutlookProcessor
    }

    class OutlookController {
        <<@Controller configuracao-outlook>>
        -authService: OutlookAuthService
        +getStatus(user) OutlookStatusDto
        +iniciarOAuth(user) OAuthRedirectDto
        +callback(code, state) OAuthCallbackDto
        +desconectar(user) StatusResponseDto
    }

    class SincronizacaoController {
        <<@Controller sincronizacao>>
        -syncService: SincronizacaoService
        +getPainel(user) PainelSincronizacaoDto
        +sincronizarEvento(eventoId) SincronizacaoResultDto
        +sincronizarTodos() SincronizacaoMassaDto
        +getLogs(query) LogsSincronizacaoDto
    }

    class FusoHorarioController {
        <<@Controller fuso-horario>>
        -syncService: SincronizacaoService
        +getFusoAtual() FusoHorarioDto
        +atualizar(dto) FusoHorarioDto
        +listarFusos() TimeZone[]
    }

    class OutlookAuthService {
        <<@Injectable>>
        -configService: ConfigService
        -prisma: PrismaService
        +getAuthUrl(userId) string
        +handleCallback(code, userId) OAuthTokens
        +refreshAccessToken(userId) string
        +revokeTokens(userId) void
        +getStatus(userId) ConnectionStatus
        -storeTokens(userId, tokens) void
        -isTokenExpired(token) boolean
    }

    class OutlookCalendarService {
        <<@Injectable>>
        -authService: OutlookAuthService
        -configService: ConfigService
        +criarCompromisso(evento: EventoData) OutlookEvent
        +atualizarCompromisso(outlookId, evento) OutlookEvent
        +cancelarCompromisso(outlookId) void
        +buscarCompromisso(outlookId) OutlookEvent
        -buildGraphRequest(accessToken) GraphClient
        -mapEventoToOutlook(evento) OutlookEventPayload
        -tratarFusoHorario(dataHora, fuso) string
    }

    class SincronizacaoService {
        <<@Injectable>>
        -calendarService: OutlookCalendarService
        -prisma: PrismaService
        -eventEmitter: EventEmitter2
        +sincronizarEvento(eventoId) SyncResult
        +sincronizarTodos() SyncMassaResult
        +getPainel() PainelData
        +getLogs(query) PaginatedResult
        -registrarLog(eventoId, acao, status, erro?) void
    }

    class OutlookProcessor {
        <<@Processor outlook-sync>>
        -syncService: SincronizacaoService
        +handleSincronizar(job) void
        +handleAtualizar(job) void
        +handleCancelar(job) void
    }

    class OutlookEventPayload {
        <<interface>>
        +subject: string
        +start: DateTimeTimeZone
        +end: DateTimeTimeZone
        +location: Location
        +body: ItemBody
        +attendees: Attendee[]
        +isOnlineMeeting: boolean
    }

    class SincronizarEventoDto {
        <<class-validator>>
        +eventoId: string @IsUUID
    }

    class PainelSincronizacaoDto {
        +totalEventos: number
        +sincronizados: number
        +pendentes: number
        +erros: number
        +ultimaSincronizacao: DateTime
        +statusConexao: string
    }

    OutlookModule --> OutlookController
    OutlookModule --> SincronizacaoController
    OutlookModule --> FusoHorarioController
    OutlookModule --> OutlookAuthService
    OutlookModule --> OutlookCalendarService
    OutlookModule --> SincronizacaoService
    OutlookModule --> OutlookProcessor

    OutlookController --> OutlookAuthService : OAuth2
    SincronizacaoController --> SincronizacaoService : sync
    FusoHorarioController --> SincronizacaoService : fuso
    SincronizacaoService --> OutlookCalendarService : Graph API
    OutlookCalendarService --> OutlookAuthService : tokens
    OutlookProcessor --> SincronizacaoService : async jobs
```

---

## Diagrama de Sequência - OAuth2 + Sincronização

```mermaid
sequenceDiagram
    actor Admin as ADMIN/MARKETING
    participant CTR as OutlookController
    participant AUTH as OutlookAuthService
    participant SYNC as SincronizacaoService
    participant CAL as OutlookCalendarService
    participant GRAPH as Microsoft Graph API
    participant DB as PrismaService

    Note over Admin,GRAPH: Fase 1: Autenticação OAuth 2.0

    Admin->>CTR: GET /configuracao-outlook/oauth/iniciar
    CTR->>AUTH: getAuthUrl(userId)
    AUTH-->>CTR: URL de autorização Microsoft
    CTR-->>Admin: 302 Redirect para login.microsoftonline.com

    Admin->>GRAPH: Autoriza acesso (Microsoft Login)
    GRAPH-->>CTR: GET /configuracao-outlook/oauth/callback?code=xxx
    CTR->>AUTH: handleCallback(code, userId)
    AUTH->>GRAPH: POST /oauth2/v2.0/token {code, client_secret}
    GRAPH-->>AUTH: {access_token, refresh_token, expires_in}
    AUTH->>DB: Armazena tokens criptografados
    AUTH-->>CTR: Conectado com sucesso
    CTR-->>Admin: 200 "Outlook conectado"

    Note over Admin,GRAPH: Fase 2: Sincronização de Evento

    Admin->>CTR: POST /sincronizacao/evento {eventoId}
    CTR->>SYNC: sincronizarEvento(eventoId)
    SYNC->>DB: evento.findUnique({id})
    SYNC->>AUTH: refreshAccessToken(userId)
    AUTH->>AUTH: isTokenExpired?
    alt Token expirado
        AUTH->>GRAPH: POST /oauth2/v2.0/token {refresh_token}
        GRAPH-->>AUTH: novo access_token
        AUTH->>DB: Atualiza token
    end
    AUTH-->>SYNC: accessToken válido

    SYNC->>CAL: criarCompromisso(eventoData)
    CAL->>CAL: mapEventoToOutlook(evento)
    CAL->>CAL: tratarFusoHorario(dataHora, 'America/Sao_Paulo')
    CAL->>GRAPH: POST /me/events {subject, start, end, location, attendees}

    alt Sucesso
        GRAPH-->>CAL: {id: outlookEventId}
        CAL-->>SYNC: OutlookEvent criado
        SYNC->>DB: Salva outlookEventId no evento
        SYNC->>SYNC: registrarLog(eventoId, CRIADO, SUCESSO)
        SYNC-->>CTR: {status: 'sincronizado'}
    else Falha (rate limit / erro)
        GRAPH-->>CAL: 429 ou 5xx
        CAL-->>SYNC: throw GraphApiException
        SYNC->>SYNC: registrarLog(eventoId, CRIADO, ERRO, mensagem)
        Note over SYNC: Retry automático via BullMQ (3x)
        SYNC-->>CTR: {status: 'erro', mensagem}
    end
```

## Endpoints REST

| Método | Rota | RBAC | Descrição |
|--------|------|------|-----------|
| GET | `/configuracao-outlook/status` | ADMIN, MARKETING | Status da conexão |
| GET | `/configuracao-outlook/oauth/iniciar` | ADMIN | Iniciar fluxo OAuth2 |
| GET | `/configuracao-outlook/oauth/callback` | @Public | Callback Microsoft |
| DELETE | `/configuracao-outlook/desconectar` | ADMIN | Revogar tokens |
| GET | `/sincronizacao/painel` | ADMIN, MARKETING | Painel de status |
| POST | `/sincronizacao/evento` | ADMIN, MARKETING | Sync evento individual |
| POST | `/sincronizacao/todos` | ADMIN | Sync em massa |
| GET | `/sincronizacao/logs` | ADMIN | Logs de sincronização |
| GET | `/fuso-horario` | ADMIN, MARKETING | Fuso atual |
| PUT | `/fuso-horario` | ADMIN | Alterar fuso |
| GET | `/fuso-horario/listar` | ADMIN, MARKETING | Lista de fusos |

## Estrutura de Arquivos Esperada

```
src/outlook/
├── outlook.module.ts
├── outlook.controller.ts            # 4 endpoints (OAuth)
├── sincronizacao.controller.ts      # 4 endpoints (sync)
├── fuso-horario.controller.ts       # 3 endpoints
├── outlook-auth.service.ts          # OAuth 2.0 token management
├── outlook-calendar.service.ts      # Microsoft Graph API calls
├── sincronizacao.service.ts         # Orquestração de sync
├── outlook.processor.ts             # BullMQ worker (async sync)
└── dto/
    ├── outlook-status.dto.ts
    ├── sincronizacao.dto.ts
    └── fuso-horario.dto.ts
```

**Total estimado**: ~12 arquivos | ~800 linhas

---

*C4 Level 4 - Outlook Integration Module (EP-07)*
