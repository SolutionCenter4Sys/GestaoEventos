# Diagrama de Código (C4 - Nível 4) - Solicitações Module

**Versão**: 1.0 (Engenharia Reversa)
**Data**: 18/02/2026
**Nível C4**: 4 - Code
**Épico**: EP-01 - Gestão de Solicitações e Aprovação de Eventos
**Status**: Pendente (Schema Prisma + Frontend prontos)

---

## Diagrama de Classes

```mermaid
classDiagram
    class SolicitacoesModule {
        <<NestJS Module>>
        +imports: PrismaModule, EventEmitterModule
        +controllers: SolicitacoesController
        +providers: SolicitacoesService, SolicitacoesValidator
    }

    class SolicitacoesController {
        <<@Controller solicitacoes>>
        -service: SolicitacoesService
        +criar(dto, user) CriarSolicitacaoResponseDto
        +listar(query, user) ListarSolicitacoesResponseDto
        +buscarPorId(id, user) SolicitacaoDetalheDto
        +atualizar(id, dto, user) AtualizarSolicitacaoResponseDto
        +enviar(id, user) StatusResponseDto
        +analisar(id, dto, user) StatusResponseDto
        +aprovar(id, dto, user) StatusResponseDto
        +reprovar(id, dto, user) StatusResponseDto
        +cancelar(id, user) StatusResponseDto
        +criarEvento(id, user) CriarEventoFromSolicitacaoDto
    }

    class SolicitacoesService {
        <<@Injectable>>
        -prisma: PrismaService
        -eventEmitter: EventEmitter2
        +criar(dto, userId) Solicitacao
        +listar(query, userId, perfil) PaginatedResult
        +buscarPorId(id, userId, perfil) Solicitacao
        +atualizar(id, dto, userId) Solicitacao
        +enviar(id, userId) Solicitacao
        +analisar(id, userId) Solicitacao
        +aprovar(id, dto, userId) Solicitacao
        +reprovar(id, dto, userId) Solicitacao
        +cancelar(id, userId) Solicitacao
        +criarEventoFromSolicitacao(id, userId) Evento
    }

    class SolicitacoesValidator {
        <<@Injectable>>
        +validarCriacao(dto) void
        +validarStatusTransicao(atual, novo) void
        +validarOwnership(solicitacao, userId) void
        +validarAprovacao(solicitacao) void
    }

    class CriarSolicitacaoDto {
        <<class-validator>>
        +titulo: string @IsString @MaxLength 200
        +descricao: string @IsString
        +justificativa: string @IsString
        +publicoAlvo: string @IsString
        +capacidadeEstimada: number @IsInt @Min 1
        +dataPreferencial: Date @IsDate
        +horaPreferencial: string @Matches HH:mm
        +duracaoHoras: number @IsInt @Min 1
        +localSugerido?: string @IsOptional
    }

    class AtualizarSolicitacaoDto {
        <<class-validator PartialType>>
        +titulo?: string
        +descricao?: string
        +justificativa?: string
        +publicoAlvo?: string
        +capacidadeEstimada?: number
        +dataPreferencial?: Date
        +horaPreferencial?: string
        +duracaoHoras?: number
        +localSugerido?: string
    }

    class AprovarSolicitacaoDto {
        <<class-validator>>
        +observacoes?: string @IsOptional
    }

    class ReprovarSolicitacaoDto {
        <<class-validator>>
        +motivoReprovacao: string @IsString @IsNotEmpty
    }

    class ListarSolicitacoesQueryDto {
        <<class-validator>>
        +status?: StatusSolicitacao @IsOptional
        +page?: number default 1
        +limit?: number default 20
        +busca?: string @IsOptional
        +dataInicio?: Date @IsOptional
        +dataFim?: Date @IsOptional
    }

    class SolicitacaoDetalheDto {
        +id: string
        +titulo: string
        +descricao: string
        +justificativa: string
        +publicoAlvo: string
        +capacidadeEstimada: number
        +dataPreferencial: Date
        +horaPreferencial: string
        +duracaoHoras: number
        +localSugerido: string
        +status: StatusSolicitacao
        +motivoReprovacao: string
        +solicitante: UsuarioResumo
        +analisadoPor: UsuarioResumo
        +analisadoEm: DateTime
        +eventoId: string
        +criadoEm: DateTime
    }

    SolicitacoesModule --> SolicitacoesController
    SolicitacoesModule --> SolicitacoesService
    SolicitacoesModule --> SolicitacoesValidator
    SolicitacoesController --> SolicitacoesService : delega
    SolicitacoesService --> SolicitacoesValidator : valida regras
    SolicitacoesController ..> CriarSolicitacaoDto : input
    SolicitacoesController ..> AprovarSolicitacaoDto : input
    SolicitacoesController ..> ReprovarSolicitacaoDto : input
```

---

## Diagrama de Sequência - Workflow de Aprovação

```mermaid
sequenceDiagram
    actor Vendas as VENDAS
    actor Marketing as MARKETING
    participant CTR as SolicitacoesController
    participant SVC as SolicitacoesService
    participant VAL as SolicitacoesValidator
    participant DB as PrismaService
    participant EVT as EventEmitter

    Vendas->>CTR: POST /solicitacoes (CriarSolicitacaoDto)
    CTR->>SVC: criar(dto, userId)
    SVC->>VAL: validarCriacao(dto)
    SVC->>DB: solicitacao.create({status: PENDENTE, solicitanteId})
    SVC->>EVT: emit('solicitacao.criada', {id, titulo})
    Note over EVT: Gatilho EP-06: notifica Marketing
    SVC-->>CTR: Solicitacao criada
    CTR-->>Vendas: 201 Created

    Marketing->>CTR: PUT /solicitacoes/:id/analisar
    CTR->>SVC: analisar(id, userId)
    SVC->>VAL: validarStatusTransicao(PENDENTE, EM_ANALISE)
    SVC->>DB: solicitacao.update({status: EM_ANALISE, analisadoPorId})
    SVC-->>CTR: Status atualizado
    CTR-->>Marketing: 200 OK

    alt Aprovação
        Marketing->>CTR: PUT /solicitacoes/:id/aprovar
        CTR->>SVC: aprovar(id, dto, userId)
        SVC->>VAL: validarStatusTransicao(EM_ANALISE, APROVADA)
        SVC->>DB: solicitacao.update({status: APROVADA, analisadoEm: now()})
        SVC->>EVT: emit('solicitacao.aprovada', {id})
        Note over EVT: Gatilho EP-06: notifica Vendas
        SVC-->>CTR: Aprovada
        CTR-->>Marketing: 200 OK
    else Reprovação
        Marketing->>CTR: PUT /solicitacoes/:id/reprovar
        CTR->>SVC: reprovar(id, dto, userId)
        SVC->>VAL: validarStatusTransicao(EM_ANALISE, REPROVADA)
        SVC->>DB: solicitacao.update({status: REPROVADA, motivoReprovacao})
        SVC->>EVT: emit('solicitacao.reprovada', {id, motivo})
        SVC-->>CTR: Reprovada
        CTR-->>Marketing: 200 OK
    end

    Marketing->>CTR: POST /solicitacoes/:id/criar-evento
    CTR->>SVC: criarEventoFromSolicitacao(id, userId)
    SVC->>VAL: validarAprovacao(solicitacao)
    SVC->>DB: evento.create({...dados da solicitacao})
    SVC->>DB: solicitacao.update({eventoId})
    SVC-->>CTR: Evento criado
    CTR-->>Marketing: 201 Created
```

---

## Máquina de Estados - StatusSolicitacao

```mermaid
stateDiagram-v2
    [*] --> PENDENTE: criar()
    PENDENTE --> EM_ANALISE: analisar()
    PENDENTE --> CANCELADA: cancelar()
    EM_ANALISE --> APROVADA: aprovar()
    EM_ANALISE --> REPROVADA: reprovar()
    EM_ANALISE --> PENDENTE: devolver()
    APROVADA --> [*]: criar-evento
    REPROVADA --> [*]
    CANCELADA --> [*]
```

## Endpoints REST

| Método | Rota | RBAC | Descrição |
|--------|------|------|-----------|
| POST | `/solicitacoes` | VENDAS, ADMIN | Criar solicitação |
| GET | `/solicitacoes` | VENDAS, MARKETING, ADMIN | Listar (filtro por perfil) |
| GET | `/solicitacoes/:id` | VENDAS, MARKETING, ADMIN | Detalhe |
| PUT | `/solicitacoes/:id` | VENDAS (owner) | Atualizar rascunho |
| PUT | `/solicitacoes/:id/enviar` | VENDAS (owner) | Enviar para análise |
| PUT | `/solicitacoes/:id/analisar` | MARKETING, ADMIN | Iniciar análise |
| PUT | `/solicitacoes/:id/aprovar` | MARKETING, ADMIN | Aprovar |
| PUT | `/solicitacoes/:id/reprovar` | MARKETING, ADMIN | Reprovar com motivo |
| PUT | `/solicitacoes/:id/cancelar` | VENDAS (owner), ADMIN | Cancelar |
| POST | `/solicitacoes/:id/criar-evento` | MARKETING, ADMIN | Criar evento vinculado |

## Estrutura de Arquivos Esperada

```
src/solicitacoes/
├── solicitacoes.module.ts
├── solicitacoes.controller.ts      # 10 endpoints
├── solicitacoes.service.ts         # Lógica + eventos
├── solicitacoes.validator.ts       # Regras de transição de status
└── dto/
    ├── criar-solicitacao.dto.ts
    ├── atualizar-solicitacao.dto.ts
    ├── aprovar-solicitacao.dto.ts
    ├── reprovar-solicitacao.dto.ts
    └── listar-solicitacoes.dto.ts
```

**Total estimado**: ~8 arquivos | ~600 linhas

---

*C4 Level 4 - Solicitações Module (EP-01)*
