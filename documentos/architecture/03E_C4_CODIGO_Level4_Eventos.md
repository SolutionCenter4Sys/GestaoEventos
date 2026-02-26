# Diagrama de Código (C4 - Nível 4) - Eventos Module

**Versão**: 1.0 (Engenharia Reversa)
**Data**: 18/02/2026
**Nível C4**: 4 - Code
**Épico**: EP-02 - Gestão e Publicação de Eventos
**Status**: Pendente (Schema Prisma + Frontend prontos)

---

## Diagrama de Classes

```mermaid
classDiagram
    class EventosModule {
        <<NestJS Module>>
        +imports: PrismaModule, EventEmitterModule
        +controllers: EventosController
        +providers: EventosService, EventosValidator
    }

    class EventosController {
        <<@Controller eventos>>
        -service: EventosService
        +criar(dto, user) EventoResponseDto
        +listar(query) ListarEventosResponseDto
        +buscarPorId(id) EventoDetalheDto
        +atualizar(id, dto, user) EventoResponseDto
        +publicar(id, user) StatusResponseDto
        +cancelar(id, dto, user) StatusResponseDto
        +concluir(id, user) StatusResponseDto
        +getPublicados() EventoPublicoDto[]
        +getCapacidade(id) CapacidadeDto
    }

    class EventosService {
        <<@Injectable>>
        -prisma: PrismaService
        -eventEmitter: EventEmitter2
        +criar(dto, userId) Evento
        +listar(query) PaginatedResult
        +buscarPorId(id) Evento
        +atualizar(id, dto) Evento
        +publicar(id) Evento
        +cancelar(id, motivo) Evento
        +concluir(id) Evento
        +getPublicados() Evento[]
        +getCapacidade(id) CapacidadeInfo
        +incrementarCapacidade(eventoId) void
        +decrementarCapacidade(eventoId) void
        +temVagasDisponiveis(eventoId) boolean
    }

    class CriarEventoDto {
        <<class-validator>>
        +nome: string @MaxLength 200
        +descricao: string
        +dataInicio: Date @IsDate
        +dataFim: Date @IsDate
        +local: string @MaxLength 200
        +endereco?: string
        +capacidadeMaxima: number @IsInt @Min 1
        +objetivos?: string
        +programacao?: string
        +informacoesAdicionais?: string
        +professorId?: string @IsUUID
        +solicitacaoId?: string @IsUUID
    }

    class AtualizarEventoDto {
        <<PartialType CriarEventoDto>>
    }

    class CancelarEventoDto {
        <<class-validator>>
        +motivo: string @IsString @IsNotEmpty
    }

    class ListarEventosQueryDto {
        <<class-validator>>
        +status?: StatusEvento
        +publicado?: boolean
        +professorId?: string
        +dataInicio?: Date
        +dataFim?: Date
        +page?: number default 1
        +limit?: number default 20
        +busca?: string
    }

    class EventoDetalheDto {
        +id: string
        +nome: string
        +descricao: string
        +dataInicio: DateTime
        +dataFim: DateTime
        +local: string
        +capacidadeMaxima: number
        +capacidadeAtual: number
        +vagasRestantes: number
        +status: StatusEvento
        +publicado: boolean
        +professor: UsuarioResumo
        +solicitacao: SolicitacaoResumo
        +totalInscritos: number
        +totalPresentes: number
        +totalCertificados: number
    }

    class CapacidadeDto {
        +eventoId: string
        +capacidadeMaxima: number
        +capacidadeAtual: number
        +vagasRestantes: number
        +percentualOcupacao: number
        +listaEsperaAtiva: boolean
        +totalListaEspera: number
    }

    EventosModule --> EventosController
    EventosModule --> EventosService
    EventosController --> EventosService : delega
    EventosController ..> CriarEventoDto : input
    EventosController ..> AtualizarEventoDto : input
    EventosController ..> CancelarEventoDto : input
    EventosService ..> EventoDetalheDto : retorna
    EventosService ..> CapacidadeDto : retorna
```

---

## Diagrama de Sequência - Publicação e Controle de Capacidade

```mermaid
sequenceDiagram
    actor MKT as MARKETING
    participant CTR as EventosController
    participant SVC as EventosService
    participant DB as PrismaService
    participant EVT as EventEmitter

    MKT->>CTR: POST /eventos (CriarEventoDto)
    CTR->>SVC: criar(dto, userId)
    SVC->>DB: evento.create({status: RASCUNHO, capacidadeAtual: 0})
    SVC-->>CTR: Evento criado
    CTR-->>MKT: 201 Created

    MKT->>CTR: PUT /eventos/:id (AtualizarEventoDto)
    CTR->>SVC: atualizar(id, dto)
    SVC->>DB: evento.update({...campos})
    SVC-->>CTR: Evento atualizado
    CTR-->>MKT: 200 OK

    MKT->>CTR: PUT /eventos/:id/publicar
    CTR->>SVC: publicar(id)
    SVC->>DB: evento.findUnique({id})
    SVC->>SVC: Valida campos obrigatórios preenchidos
    SVC->>DB: evento.update({status: PUBLICADO, publicado: true})
    SVC->>EVT: emit('evento.publicado', {id, nome, data})
    Note over EVT: Gatilho EP-06: e-mail para inscritos lista espera
    Note over EVT: Gatilho EP-07: sync Outlook Calendar
    SVC-->>CTR: Publicado
    CTR-->>MKT: 200 OK

    Note over MKT,DB: Participantes se inscrevem (EP-03)

    MKT->>CTR: GET /eventos/:id/capacidade
    CTR->>SVC: getCapacidade(id)
    SVC->>DB: evento.findUnique + inscricao.count
    SVC-->>CTR: CapacidadeDto
    CTR-->>MKT: 200 {max: 50, atual: 45, restante: 5, ocupacao: 90%}
```

## Máquina de Estados - StatusEvento

```mermaid
stateDiagram-v2
    [*] --> RASCUNHO: criar()
    RASCUNHO --> PUBLICADO: publicar()
    RASCUNHO --> CANCELADO: cancelar()
    PUBLICADO --> EM_ANDAMENTO: iniciar()
    PUBLICADO --> CANCELADO: cancelar()
    EM_ANDAMENTO --> CONCLUIDO: concluir()
    CONCLUIDO --> [*]: gerar certificados
    CANCELADO --> [*]
```

## Endpoints REST

| Método | Rota | RBAC | Descrição |
|--------|------|------|-----------|
| POST | `/eventos` | MARKETING, ADMIN | Criar evento |
| GET | `/eventos` | MARKETING, ADMIN | Listar com filtros |
| GET | `/eventos/:id` | MARKETING, ADMIN, PROFESSOR | Detalhe do evento |
| PUT | `/eventos/:id` | MARKETING, ADMIN | Atualizar evento |
| PUT | `/eventos/:id/publicar` | MARKETING, ADMIN | Publicar evento |
| PUT | `/eventos/:id/cancelar` | MARKETING, ADMIN | Cancelar com motivo |
| PUT | `/eventos/:id/concluir` | MARKETING, ADMIN | Finalizar evento |
| GET | `/eventos/publicados` | @Public | Eventos públicos (para inscrição) |
| GET | `/eventos/:id/capacidade` | MARKETING, ADMIN | Info de vagas |

## Estrutura de Arquivos Esperada

```
src/eventos/
├── eventos.module.ts
├── eventos.controller.ts          # 9 endpoints
├── eventos.service.ts             # Lógica + capacidade + eventos
├── eventos.validator.ts           # Transições de status
└── dto/
    ├── criar-evento.dto.ts
    ├── atualizar-evento.dto.ts
    ├── cancelar-evento.dto.ts
    └── listar-eventos.dto.ts
```

**Total estimado**: ~7 arquivos | ~500 linhas

---

*C4 Level 4 - Eventos Module (EP-02)*
