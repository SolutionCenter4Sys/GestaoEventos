# Diagrama de Código (C4 - Nível 4) - Certificados Module

**Versão**: 1.0 (Engenharia Reversa)
**Data**: 18/02/2026
**Nível C4**: 4 - Code
**Épico**: EP-04 - Sistema de Certificação
**Status**: Pendente (Schema Prisma + Frontend prontos)

---

## Diagrama de Classes

```mermaid
classDiagram
    class CertificadosModule {
        <<NestJS Module>>
        +imports: PrismaModule, BullModule, EventEmitterModule
        +controllers: CertificadosController
        +providers: CertificadosService, PdfGeneratorService, CertificadoProcessor
    }

    class CertificadosController {
        <<@Controller certificados>>
        -service: CertificadosService
        +gerarPorEvento(eventoId, user) GeracaoResultDto
        +regenerar(id, user) CertificadoResponseDto
        +listarPorEvento(eventoId, query) ListarCertificadosDto
        +download(id) StreamableFile
        +enviarPorEmail(id) StatusResponseDto
        +enviarTodosPorEvento(eventoId) EnvioMassaDto
        +getAuditoria(query) AuditoriaCertificadosDto
        +configurarTemplate(dto) TemplateConfigDto
    }

    class CertificadosService {
        <<@Injectable>>
        -prisma: PrismaService
        -pdfGenerator: PdfGeneratorService
        -emailQueue: Queue
        +gerarPorEvento(eventoId) GeracaoResult
        +regenerar(certificadoId) Certificado
        +listarPorEvento(eventoId, query) PaginatedResult
        +download(certificadoId) Buffer
        +enviarPorEmail(certificadoId) void
        +enviarTodosPorEvento(eventoId) EnvioResult
        +getAuditoria(query) AuditoriaPaginada
    }

    class PdfGeneratorService {
        <<@Injectable>>
        +gerarCertificadoPDF(dados: DadosCertificado) Buffer
        +gerarEmMassa(lista: DadosCertificado[]) Buffer[]
    }

    class CertificadoProcessor {
        <<@Processor certificados>>
        +handleGeracaoMassa(job) void
        +handleEnvioEmail(job) void
    }

    class GerarCertificadosDto {
        <<class-validator>>
        +eventoId: string @IsUUID
        +apenasPresentes: boolean default true
    }

    class CertificadoResponseDto {
        +id: string
        +inscricaoId: string
        +participanteNome: string
        +eventoNome: string
        +dataEvento: Date
        +cargaHoraria: number
        +urlPdf: string
        +status: StatusCertificado
        +geradoEm: DateTime
        +enviadoEm: DateTime
    }

    class DadosCertificado {
        <<interface>>
        +participanteNome: string
        +eventoNome: string
        +dataEvento: Date
        +cargaHoraria: number
        +templateConfig: TemplateConfig
    }

    CertificadosModule --> CertificadosController
    CertificadosModule --> CertificadosService
    CertificadosModule --> PdfGeneratorService
    CertificadosModule --> CertificadoProcessor
    CertificadosController --> CertificadosService : delega
    CertificadosService --> PdfGeneratorService : gera PDF
    CertificadoProcessor --> CertificadosService : processa jobs
    CertificadoProcessor --> PdfGeneratorService : gera PDF em massa
```

---

## Diagrama de Sequência - Geração e Envio de Certificados

```mermaid
sequenceDiagram
    actor Admin as MARKETING/ADMIN
    participant CTR as CertificadosController
    participant SVC as CertificadosService
    participant PDF as PdfGeneratorService
    participant DB as PrismaService
    participant QUEUE as BullMQ Queue
    participant WORKER as CertificadoProcessor
    participant EMAIL as SMTP

    Admin->>CTR: POST /eventos/:id/certificados/gerar
    CTR->>SVC: gerarPorEvento(eventoId)

    SVC->>DB: inscricao.findMany({eventoId, status: PRESENTE})
    DB-->>SVC: inscricoes[] com participantes

    loop Para cada inscricao com presenca
        SVC->>PDF: gerarCertificadoPDF(dados)
        PDF-->>SVC: Buffer (PDF)
        SVC->>SVC: Upload PDF para storage
        SVC->>DB: certificado.create({status: GERADO, urlPdf})
    end

    SVC-->>CTR: {total: 25, gerados: 25, erros: 0}
    CTR-->>Admin: 200 GeracaoResultDto

    Admin->>CTR: POST /eventos/:id/certificados/enviar-todos
    CTR->>SVC: enviarTodosPorEvento(eventoId)

    SVC->>DB: certificado.findMany({eventoId, status: GERADO})

    loop Para cada certificado
        SVC->>QUEUE: add('enviar-certificado', {certificadoId, email})
    end

    SVC-->>CTR: {enfileirados: 25}
    CTR-->>Admin: 202 Accepted

    QUEUE->>WORKER: process('enviar-certificado')
    WORKER->>DB: certificado.findUnique({id})
    WORKER->>EMAIL: enviar(destinatario, assunto, pdf)

    alt Envio com sucesso
        WORKER->>DB: certificado.update({status: ENVIADO, enviadoEm: now()})
    else Falha no envio
        WORKER->>DB: certificado.update({status: ERRO})
        Note over WORKER: BullMQ retry automático (3 tentativas)
    end
```

## Máquina de Estados - StatusCertificado

```mermaid
stateDiagram-v2
    [*] --> PENDENTE: evento concluído
    PENDENTE --> GERADO: gerar PDF
    GERADO --> ENVIADO: enviar por e-mail
    GERADO --> ERRO: falha na geração
    PENDENTE --> ERRO: falha
    ERRO --> GERADO: regenerar()
    ENVIADO --> [*]
```

## Endpoints REST

| Método | Rota | RBAC | Descrição |
|--------|------|------|-----------|
| POST | `/eventos/:id/certificados/gerar` | MARKETING, ADMIN | Gerar certificados em massa |
| POST | `/certificados/:id/regenerar` | MARKETING, ADMIN | Regenerar individual |
| GET | `/eventos/:id/certificados` | MARKETING, ADMIN | Listar certificados do evento |
| GET | `/certificados/:id/download` | Owner, ADMIN | Download PDF |
| POST | `/certificados/:id/enviar` | MARKETING, ADMIN | Enviar individual por e-mail |
| POST | `/eventos/:id/certificados/enviar-todos` | MARKETING, ADMIN | Envio em massa |
| GET | `/certificados/auditoria` | ADMIN | Log de geração e envio |
| POST | `/certificados/template` | ADMIN | Configurar template |

## Estrutura de Arquivos Esperada

```
src/certificados/
├── certificados.module.ts
├── certificados.controller.ts       # 8 endpoints
├── certificados.service.ts          # Lógica de geração e envio
├── pdf-generator.service.ts         # Geração de PDF
├── certificado.processor.ts         # BullMQ worker (jobs assíncronos)
└── dto/
    ├── gerar-certificados.dto.ts
    ├── certificado-response.dto.ts
    └── listar-certificados.dto.ts
```

**Total estimado**: ~8 arquivos | ~550 linhas

---

*C4 Level 4 - Certificados Module (EP-04)*
