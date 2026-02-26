# Diagrama de Código (C4 - Nível 4) - Inscrições Module

**Versão**: 1.0 (Engenharia Reversa)
**Data**: 18/02/2026
**Nível C4**: 4 - Code
**Épico**: EP-03 - Sistema de Inscrições e Participantes
**Status**: Pendente (Schema Prisma + Frontend prontos)

---

## Diagrama de Classes

```mermaid
classDiagram
    class InscricoesModule {
        <<NestJS Module>>
        +imports: PrismaModule, EventEmitterModule, EventosModule
        +controllers: InscricoesController, ParticipanteController
        +providers: InscricoesService, CheckinService, ListaEsperaService
    }

    class InscricoesController {
        <<@Controller inscricoes>>
        -service: InscricoesService
        -checkinService: CheckinService
        +inscrever(dto) InscricaoResponseDto
        +listarPorEvento(eventoId, query) ListarInscricoesResponseDto
        +cancelar(id, user) StatusResponseDto
        +checkin(dto) CheckinResponseDto
        +checkinQRCode(qrCode) CheckinResponseDto
        +getListaEspera(eventoId) ListaEsperaResponseDto
    }

    class ParticipanteController {
        <<@Controller participante>>
        -service: InscricoesService
        +getDashboard(user) DashboardParticipanteDto
        +getEventos(user, query) EventosParticipanteDto
        +getCertificados(user) CertificadosParticipanteDto
    }

    class InscricoesService {
        <<@Injectable>>
        -prisma: PrismaService
        -eventEmitter: EventEmitter2
        -eventosService: EventosService
        +inscrever(dto) Inscricao
        +listarPorEvento(eventoId, query) PaginatedResult
        +cancelar(id) Inscricao
        +verificarDuplicidade(cpf, eventoId) boolean
        +gerarQRCode() string
        +getDashboardParticipante(userId) DashboardData
        +getEventosParticipante(userId, filtro) Evento[]
        +getCertificadosParticipante(userId) Certificado[]
    }

    class CheckinService {
        <<@Injectable>>
        -prisma: PrismaService
        -eventEmitter: EventEmitter2
        +checkinPorId(inscricaoId) Inscricao
        +checkinPorQRCode(qrCode) Inscricao
        +validarCheckin(inscricao) void
    }

    class ListaEsperaService {
        <<@Injectable>>
        -prisma: PrismaService
        -eventEmitter: EventEmitter2
        +adicionarListaEspera(dto) Inscricao
        +promoverDaListaEspera(eventoId) Inscricao
        +getListaEspera(eventoId) Inscricao[]
    }

    class InscricaoPublicaDto {
        <<class-validator>>
        +eventoId: string @IsUUID
        +nome: string @IsString @MaxLength 200
        +email: string @IsEmail
        +cpf: string @Length 11
        +telefone: string @MaxLength 20
    }

    class CheckinDto {
        <<class-validator>>
        +inscricaoId?: string @IsOptional @IsUUID
        +qrCode?: string @IsOptional @IsUUID
    }

    class DashboardParticipanteDto {
        +proximosEventos: number
        +certificadosDisponiveis: number
        +listaEspera: number
    }

    class InscricaoResponseDto {
        +id: string
        +eventoId: string
        +status: StatusInscricao
        +qrCode: string
        +evento: EventoResumo
        +criadoEm: DateTime
    }

    class CheckinResponseDto {
        +inscricaoId: string
        +participanteNome: string
        +eventoNome: string
        +status: PRESENTE
        +checkinEm: DateTime
        +mensagem: string
    }

    InscricoesModule --> InscricoesController
    InscricoesModule --> ParticipanteController
    InscricoesModule --> InscricoesService
    InscricoesModule --> CheckinService
    InscricoesModule --> ListaEsperaService
    InscricoesController --> InscricoesService : delega
    InscricoesController --> CheckinService : check-in
    ParticipanteController --> InscricoesService : delega
    InscricoesController ..> InscricaoPublicaDto : input
    InscricoesController ..> CheckinDto : input
```

---

## Diagrama de Sequência - Inscrição Pública + Check-in

```mermaid
sequenceDiagram
    actor Part as PARTICIPANTE
    participant CTR as InscricoesController
    participant SVC as InscricoesService
    participant EVT_SVC as EventosService
    participant DB as PrismaService
    participant EVT as EventEmitter

    Part->>CTR: POST /inscricoes (InscricaoPublicaDto)
    Note over CTR: @Public() - sem autenticação
    CTR->>SVC: inscrever(dto)

    SVC->>SVC: verificarDuplicidade(cpf, eventoId)
    SVC->>DB: inscricao.findFirst({cpf, eventoId})

    alt CPF já inscrito
        SVC-->>CTR: throw ConflictException
        CTR-->>Part: 409 "CPF já inscrito neste evento"
    end

    SVC->>EVT_SVC: temVagasDisponiveis(eventoId)

    alt Sem vagas
        SVC->>DB: inscricao.create({status: PENDENTE})
        Note over SVC: Adiciona à lista de espera
        SVC-->>CTR: {status: PENDENTE, mensagem: "Lista de espera"}
    else Com vagas
        SVC->>SVC: gerarQRCode() = uuidv4()
        SVC->>DB: inscricao.create({status: CONFIRMADA, qrCode})
        SVC->>EVT_SVC: incrementarCapacidade(eventoId)
        SVC->>EVT: emit('inscricao.confirmada', {id, email, eventoId})
        Note over EVT: Gatilho EP-06: e-mail confirmação + QR Code
        SVC-->>CTR: InscricaoResponseDto
        CTR-->>Part: 201 Created {qrCode}
    end

    Note over Part,DB: No dia do evento...

    Part->>CTR: POST /inscricoes/checkin {qrCode: "uuid"}
    CTR->>SVC: checkinPorQRCode(qrCode)
    SVC->>DB: inscricao.findUnique({qrCode}, include: evento)

    alt QR Code inválido
        SVC-->>CTR: throw NotFoundException
        CTR-->>Part: 404 "QR Code não encontrado"
    end

    alt Já fez check-in
        SVC-->>CTR: throw BadRequestException
        CTR-->>Part: 400 "Check-in já realizado"
    end

    SVC->>DB: inscricao.update({status: PRESENTE, checkinEm: now()})
    SVC->>EVT: emit('checkin.realizado', {inscricaoId, eventoId})

    SVC-->>CTR: CheckinResponseDto
    CTR-->>Part: 200 {status: PRESENTE, checkinEm}
```

## Máquina de Estados - StatusInscricao

```mermaid
stateDiagram-v2
    [*] --> CONFIRMADA: inscrever() com vagas
    [*] --> PENDENTE: inscrever() sem vagas (lista espera)
    PENDENTE --> CONFIRMADA: promover da lista espera
    PENDENTE --> CANCELADA: cancelar()
    CONFIRMADA --> PRESENTE: checkin()
    CONFIRMADA --> CANCELADA: cancelar()
    CONFIRMADA --> NO_SHOW: evento concluído sem checkin
    PRESENTE --> [*]: gerar certificado
    NO_SHOW --> [*]
    CANCELADA --> [*]
```

## Endpoints REST

| Método | Rota | Auth | RBAC | Descrição |
|--------|------|------|------|-----------|
| POST | `/inscricoes` | @Public | - | Inscrição pública |
| GET | `/eventos/:id/inscricoes` | JWT | MARKETING, ADMIN | Listar inscritos |
| PUT | `/inscricoes/:id/cancelar` | JWT | Owner, ADMIN | Cancelar inscrição |
| POST | `/inscricoes/checkin` | JWT | MARKETING, ADMIN | Check-in por ID ou QR |
| GET | `/eventos/:id/lista-espera` | JWT | MARKETING, ADMIN | Lista de espera |
| GET | `/participante/dashboard` | JWT | PARTICIPANTE | Dashboard do participante |
| GET | `/participante/eventos` | JWT | PARTICIPANTE | Eventos do participante |
| GET | `/participante/certificados` | JWT | PARTICIPANTE | Certificados disponíveis |

## Estrutura de Arquivos Esperada

```
src/inscricoes/
├── inscricoes.module.ts
├── inscricoes.controller.ts        # 6 endpoints
├── participante.controller.ts      # 3 endpoints (área do participante)
├── inscricoes.service.ts           # Inscrição + lista espera
├── checkin.service.ts              # Check-in por QR Code
├── lista-espera.service.ts         # Gestão de lista de espera
└── dto/
    ├── inscricao-publica.dto.ts
    ├── checkin.dto.ts
    ├── listar-inscricoes.dto.ts
    └── dashboard-participante.dto.ts
```

**Total estimado**: ~10 arquivos | ~700 linhas

---

*C4 Level 4 - Inscrições Module (EP-03)*
