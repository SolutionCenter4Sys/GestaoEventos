# Diagrama de Código (C4 - Nível 4) - Pacientes Modelo Module

**Versão**: 1.0 (Engenharia Reversa)
**Data**: 18/02/2026
**Nível C4**: 4 - Code
**Épico**: EP-05 - Gestão de Pacientes Modelo
**Status**: Pendente (Schema Prisma + Frontend prontos)

---

## Diagrama de Classes

```mermaid
classDiagram
    class PacientesModeloModule {
        <<NestJS Module>>
        +imports: PrismaModule, EventEmitterModule
        +controllers: PacientesModeloController, AuditLogController, ProfessorController
        +providers: PacientesModeloService, CriptografiaService, AuditService, DocumentosService
    }

    class PacientesModeloController {
        <<@Controller pacientes-modelo>>
        -service: PacientesModeloService
        +criar(dto, user, req) PacienteResponseDto
        +listarPorEvento(eventoId, query, user) ListarPacientesResponseDto
        +buscarPorId(id, user) PacienteDetalheDto
        +atualizar(id, dto, user) PacienteResponseDto
        +excluir(id, user) StatusResponseDto
    }

    class ProfessorController {
        <<@Controller professor>>
        -documentosService: DocumentosService
        +getAreaProfessor(user) AreaProfessorDto
        +uploadFotoAntes(pacienteId, file, user) FotoResponseDto
        +uploadFotoDepois(pacienteId, file, user) FotoResponseDto
        +getGaleria(eventoId, user) GaleriaDto
        +getDashboardCompletude(eventoId) CompletudeDto
    }

    class AuditLogController {
        <<@Controller audit-logs/pacientes-modelo>>
        -auditService: AuditService
        +listar(query) AuditLogPaginadoDto
        +exportar(query) StreamableFile
    }

    class PacientesModeloService {
        <<@Injectable>>
        -prisma: PrismaService
        -crypto: CriptografiaService
        -audit: AuditService
        -eventEmitter: EventEmitter2
        +criar(dto, userId, ip, userAgent) PacienteModelo
        +listarPorEvento(eventoId, query, userId, perfil) PaginatedResult
        +buscarPorId(id, userId, perfil) PacienteModelo
        +atualizar(id, dto, userId) PacienteModelo
        +excluir(id, userId) void
        -verificarPermissao(eventoId, userId, perfil) void
    }

    class CriptografiaService {
        <<@Injectable>>
        -configService: ConfigService
        +criptografar(plaintext: string) string
        +descriptografar(ciphertext: string) string
        +criptografarCamposSensiveis(dados) DadosCriptografados
        +descriptografarCamposSensiveis(dados) DadosDescriptografados
    }

    class AuditService {
        <<@Injectable>>
        -prisma: PrismaService
        +registrar(acao, usuario, paciente, detalhes, req) void
        +listar(query) PaginatedResult
        +exportar(query, formato) Buffer
        -calcularHash(dadosEntrada, hashAnterior) string
        -getUltimoHash() string
    }

    class DocumentosService {
        <<@Injectable>>
        -prisma: PrismaService
        +uploadFoto(pacienteId, tipo, file) Foto
        +getGaleria(eventoId) GaleriaItem[]
        +getDashboardCompletude(eventoId) CompletudeData
    }

    class CriarPacienteDto {
        <<class-validator>>
        +nome: string @MaxLength 200
        +cpf: string @Length 11
        +dataNascimento: Date @IsDate
        +email: string @IsEmail
        +telefone: string @MaxLength 20
        +endereco?: string
        +historicoSaude?: string
        +restricoesAlergias?: string
        +eventoId: string @IsUUID
        +aceitouTermoLGPD: boolean @IsTrue
        +consentimento: ConsentimentoDto
    }

    class ConsentimentoDto {
        <<class-validator>>
        +timestamp: Date @IsDate
        +ip: string
        +userAgent: string
    }

    class PacienteDetalheDto {
        +id: string
        +nome: string
        +cpf: string
        +dataNascimento: Date
        +email: string
        +telefone: string
        +historicoSaude: string "DESCRIPTOGRAFADO"
        +restricoesAlergias: string "DESCRIPTOGRAFADO"
        +eventoId: string
        +documentosPendentes: boolean
        +consentimentos: ConsentimentoLGPD[]
        +criadoEm: DateTime
    }

    PacientesModeloModule --> PacientesModeloController
    PacientesModeloModule --> ProfessorController
    PacientesModeloModule --> AuditLogController
    PacientesModeloModule --> PacientesModeloService
    PacientesModeloModule --> CriptografiaService
    PacientesModeloModule --> AuditService
    PacientesModeloModule --> DocumentosService

    PacientesModeloController --> PacientesModeloService : delega
    ProfessorController --> DocumentosService : delega
    AuditLogController --> AuditService : delega
    PacientesModeloService --> CriptografiaService : criptografa
    PacientesModeloService --> AuditService : audita
```

---

## Diagrama de Sequência - Cadastro com Criptografia e Auditoria LGPD

```mermaid
sequenceDiagram
    actor Prof as PROFESSOR
    participant CTR as PacientesModeloController
    participant SVC as PacientesModeloService
    participant CRYPTO as CriptografiaService
    participant AUDIT as AuditService
    participant DB as PrismaService
    participant EVT as EventEmitter

    Prof->>CTR: POST /pacientes-modelo (CriarPacienteDto)
    CTR->>SVC: criar(dto, userId, ip, userAgent)

    SVC->>SVC: verificarPermissao(eventoId, userId, perfil)
    Note over SVC: ADMIN vê tudo, PROFESSOR só seus eventos

    SVC->>DB: pacienteModelo.findFirst({cpf, eventoId})
    alt CPF duplicado no evento
        SVC-->>CTR: throw ConflictException
        CTR-->>Prof: 409 "CPF já cadastrado neste evento"
    end

    alt LGPD não aceito
        SVC-->>CTR: throw BadRequestException
        CTR-->>Prof: 400 "Consentimento LGPD obrigatório"
    end

    SVC->>CRYPTO: criptografarCamposSensiveis({historicoSaude, restricoesAlergias})
    Note over CRYPTO: AES-256-GCM
    CRYPTO-->>SVC: dados criptografados

    SVC->>DB: $transaction([
    Note over DB: 1. pacienteModelo.create()
    Note over DB: 2. consentimentoLGPD.create({tipo, aceito, ip, userAgent})
    SVC->>DB: ])

    SVC->>AUDIT: registrar(PACIENTE_MODELO_CRIADO, usuario, paciente, detalhes, req)
    AUDIT->>AUDIT: getUltimoHash()
    AUDIT->>AUDIT: calcularHash(dadosEntrada, hashAnterior)
    Note over AUDIT: SHA-256 chain = integridade blockchain-like
    AUDIT->>DB: auditLogPacienteModelo.create({hash, hashAnterior})

    SVC->>EVT: emit('paciente.cadastrado', {id, eventoId})
    Note over EVT: Gatilho EP-06: notificação ao Marketing

    SVC-->>CTR: PacienteResponseDto (sem dados sensíveis)
    CTR-->>Prof: 201 Created
```

---

## Diagrama de Sequência - Listagem com Descriptografia e RBAC

```mermaid
sequenceDiagram
    actor User as ADMIN/PROFESSOR
    participant CTR as PacientesModeloController
    participant SVC as PacientesModeloService
    participant CRYPTO as CriptografiaService
    participant AUDIT as AuditService
    participant DB as PrismaService

    User->>CTR: GET /eventos/:eventoId/pacientes-modelo
    CTR->>SVC: listarPorEvento(eventoId, query, userId, perfil)

    SVC->>SVC: verificarPermissao(eventoId, userId, perfil)

    alt PROFESSOR sem acesso ao evento
        SVC-->>CTR: throw ForbiddenException
        CTR-->>User: 403 "Sem permissão"
    end

    SVC->>DB: pacienteModelo.findMany({eventoId, deletedAt: null})
    DB-->>SVC: pacientes[] com dados criptografados

    loop Para cada paciente
        SVC->>CRYPTO: descriptografarCamposSensiveis(paciente)
        CRYPTO-->>SVC: dados em plaintext
    end

    SVC->>AUDIT: registrar(ACESSO_PACIENTES_MODELO, usuario, null, {eventoId})

    SVC-->>CTR: ListarPacientesResponseDto
    CTR-->>User: 200 {data: [...], meta: {total, page}}
```

## Endpoints REST

| Método | Rota | RBAC | Descrição |
|--------|------|------|-----------|
| POST | `/pacientes-modelo` | PROFESSOR, ADMIN | Cadastrar com criptografia + LGPD |
| GET | `/eventos/:id/pacientes-modelo` | PROFESSOR (seus), ADMIN | Listar com descriptografia |
| GET | `/pacientes-modelo/:id` | PROFESSOR (seus), ADMIN | Detalhe individual |
| PUT | `/pacientes-modelo/:id` | PROFESSOR, ADMIN | Atualizar (re-criptografa) |
| DELETE | `/pacientes-modelo/:id` | ADMIN | Soft-delete (LGPD) |
| GET | `/professor/area` | PROFESSOR | Área do professor |
| POST | `/pacientes-modelo/:id/foto-antes` | PROFESSOR | Upload foto antes |
| POST | `/pacientes-modelo/:id/foto-depois` | PROFESSOR | Upload foto depois |
| GET | `/eventos/:id/galeria` | PROFESSOR, ADMIN | Galeria antes/depois |
| GET | `/eventos/:id/completude` | MARKETING, ADMIN | Dashboard completude docs |
| GET | `/audit-logs/pacientes-modelo` | ADMIN | Logs de auditoria |
| GET | `/audit-logs/pacientes-modelo/export` | ADMIN | Exportar auditoria CSV/JSON |

## Regras de Negócio LGPD

| ID | Regra | Implementação |
|----|-------|--------------|
| RN-LGPD-01 | Consentimento obrigatório | `aceitouTermoLGPD: true` obrigatório, 400 se false |
| RN-LGPD-02 | Dados sensíveis criptografados | AES-256-GCM para historicoSaude e restricoesAlergias |
| RN-LGPD-03 | Soft-delete apenas | `deletedAt` timestamp, nunca hard delete |
| RN-LGPD-04 | Auditoria com hash chain | SHA-256 encadeado (integridade tipo blockchain) |
| RN-LGPD-05 | Logs append-only | Retenção 5 anos, sem DELETE/UPDATE |
| RN-LGPD-06 | Registro de IP/UserAgent | Todos os consentimentos com rastreabilidade |
| RN-LGPD-07 | RBAC restritivo | Professor só vê pacientes dos seus eventos |

## Estrutura de Arquivos Esperada

```
src/pacientes-modelo/
├── pacientes-modelo.module.ts
├── pacientes-modelo.controller.ts   # 5 endpoints CRUD
├── professor.controller.ts          # 5 endpoints (area professor, fotos)
├── audit-log.controller.ts          # 2 endpoints (logs, export)
├── pacientes-modelo.service.ts      # Lógica + criptografia + auditoria
├── criptografia.service.ts          # AES-256-GCM encrypt/decrypt
├── audit.service.ts                 # Hash chain + logging
├── documentos.service.ts            # Fotos, galeria, completude
└── dto/
    ├── criar-paciente.dto.ts
    ├── atualizar-paciente.dto.ts
    ├── consentimento.dto.ts
    ├── listar-pacientes.dto.ts
    └── audit-log.dto.ts
```

**Total estimado**: ~13 arquivos | ~1200 linhas

---

*C4 Level 4 - Pacientes Modelo Module (EP-05) - O mais complexo do sistema*
