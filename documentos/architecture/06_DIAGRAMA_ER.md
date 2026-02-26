# Diagrama Entidade-Relacionamento (ER) - Plataforma de Gestão de Eventos

**Versão**: 1.0 (Engenharia Reversa)
**Data**: 18/02/2026
**Tipo**: Entity-Relationship Diagram
**Fonte**: Prisma Schema (`prisma/schema.prisma`)
**Pergunta respondida**: "Quais são as entidades do domínio e como se relacionam?"

---

## Visão Geral

O banco de dados PostgreSQL (Supabase) contém 15 tabelas organizadas por domínio funcional (épicos). O schema usa UUIDs como chaves primárias, 8 enums para tipagem forte, e 30+ índices para performance.

---

## Diagrama ER Completo

```mermaid
erDiagram
    USUARIO ||--o{ REFRESH_TOKEN : "possui tokens"
    USUARIO ||--o{ LOG_AUTENTICACAO : "gera logs"
    USUARIO ||--o{ SOLICITACAO : "cria solicitacoes"
    USUARIO ||--o{ EVENTO : "leciona como professor"
    USUARIO ||--o{ INSCRICAO : "inscreve-se"
    USUARIO ||--o{ PACIENTE_MODELO : "cadastra pacientes"

    SOLICITACAO ||--o| EVENTO : "origina evento"

    EVENTO ||--o{ INSCRICAO : "recebe inscricoes"
    EVENTO ||--o{ PACIENTE_MODELO : "tem pacientes modelo"
    EVENTO ||--o{ CERTIFICADO : "gera certificados"

    INSCRICAO ||--o| CERTIFICADO : "gera certificado"

    PACIENTE_MODELO ||--o{ CONSENTIMENTO_LGPD : "registra consentimentos"
    PACIENTE_MODELO ||--o{ AUDIT_LOG_PACIENTE : "auditado"

    TEMPLATE_EMAIL ||--o{ GATILHO_CONFIG : "usado por gatilhos"

    USUARIO {
        uuid id PK
        varchar nome
        varchar email UK
        varchar senhaHash
        enum perfil "ADMIN MARKETING VENDAS PROFESSOR PARTICIPANTE PACIENTE_MODELO"
        boolean ativo
        timestamp bloqueadoAte
        int tentativasLoginFalhas
        boolean twoFactorHabilitado
        varchar twoFactorSecret
        timestamp criadoEm
        timestamp atualizadoEm
    }

    REFRESH_TOKEN {
        uuid id PK
        uuid usuarioId FK
        varchar token UK
        timestamp expiraEm
        boolean revogado
        timestamp criadoEm
    }

    TOKEN_RECUPERACAO_SENHA {
        uuid id PK
        uuid usuarioId FK
        varchar token UK
        timestamp expiraEm
        boolean usado
        varchar ipSolicitacao
    }

    CODIGO_RECUPERACAO_2FA {
        int id PK
        uuid usuarioId FK
        varchar codigo "hash bcrypt"
        boolean usado
        timestamp usadoEm
    }

    LOG_AUTENTICACAO {
        int id PK
        uuid usuarioId FK
        varchar email
        enum tipoEvento "LOGIN_SUCESSO LOGIN_FALHA LOGOUT etc"
        varchar ipOrigem
        text userAgent
        char pais
        varchar cidade
        boolean sucesso
        varchar motivoFalha
        json metadados
        timestamp timestamp
    }

    SOLICITACAO {
        uuid id PK
        varchar titulo
        text descricao
        text justificativa
        text publicoAlvo
        int capacidadeEstimada
        date dataPreferencial
        varchar horaPreferencial
        int duracaoHoras
        varchar localSugerido
        enum status "PENDENTE EM_ANALISE APROVADA REPROVADA CANCELADA"
        uuid solicitanteId FK
        uuid analisadoPorId FK
        uuid eventoId FK_UK
        timestamp criadoEm
    }

    EVENTO {
        uuid id PK
        varchar nome
        text descricao
        timestamp dataInicio
        timestamp dataFim
        varchar local
        int capacidadeMaxima
        int capacidadeAtual
        boolean publicado
        enum status "RASCUNHO PUBLICADO EM_ANDAMENTO CONCLUIDO CANCELADO"
        uuid professorId FK
        uuid solicitacaoId FK_UK
        timestamp criadoEm
    }

    INSCRICAO {
        uuid id PK
        uuid eventoId FK
        uuid participanteId FK
        varchar cpf
        varchar telefone
        enum status "PENDENTE CONFIRMADA CANCELADA NO_SHOW PRESENTE"
        uuid qrCode UK
        timestamp checkinEm
        timestamp criadoEm
    }

    CERTIFICADO {
        uuid id PK
        uuid inscricaoId FK_UK
        uuid eventoId FK
        varchar participanteNome
        varchar eventoNome
        date dataEvento
        int cargaHoraria
        varchar urlPdf
        enum status "PENDENTE GERADO ENVIADO ERRO"
        timestamp geradoEm
        timestamp enviadoEm
    }

    PACIENTE_MODELO {
        uuid id PK
        varchar nome
        varchar cpf
        date dataNascimento
        varchar email
        varchar telefone
        text historicoSaude "CRIPTOGRAFADO"
        text restricoesAlergias "CRIPTOGRAFADO"
        uuid eventoId FK
        uuid criadoPor FK
        timestamp deletedAt "soft-delete LGPD"
        timestamp criadoEm
    }

    CONSENTIMENTO_LGPD {
        int id PK
        varchar entidadeTipo
        uuid entidadeId FK
        varchar tipo
        boolean aceito
        timestamp timestamp
        varchar ip
        text userAgent
    }

    AUDIT_LOG_PACIENTE {
        int id PK
        timestamp timestamp
        uuid usuarioId FK
        varchar usuarioNome
        enum usuarioPerfil
        varchar ipOrigem
        text userAgent
        enum acao "CRIADO VISUALIZADO EDITADO EXCLUIDO etc"
        uuid pacienteModeloId FK
        json detalhes
        varchar hashAnterior "integridade chain"
        varchar hash UK "SHA-256"
    }

    TEMPLATE_EMAIL {
        uuid id PK
        varchar nome UK
        text descricao
        varchar assunto
        text corpo
        json variaveis
        boolean ativo
        timestamp criadoEm
    }

    GATILHO_CONFIG {
        uuid id PK
        varchar nome UK
        text descricao
        boolean ativo
        uuid templateId FK
        enum timingTipo "IMEDIATO DIAS_ANTES DIAS_DEPOIS"
        int timingValor
        timestamp criadoEm
    }

    EMAIL_QUEUE_LOG {
        int id PK
        varchar jobId
        varchar destinatario
        text assunto
        uuid gatilhoId
        varchar messageId
        int tentativa
        boolean sucesso
        text erro
        json metadados
        timestamp timestamp
    }

    LEMBRETE_ENVIADO {
        int id PK
        uuid eventoId FK
        varchar tipo
        int quantidadeEnviados
        date dataEnvio
    }
```

---

## Tabela de Relacionamentos

| Origem | Destino | Tipo | Descricao | ON DELETE |
|--------|---------|------|-----------|----------|
| Usuario | RefreshToken | 1:N | Um usuario tem multiplos refresh tokens | Cascade |
| Usuario | LogAutenticacao | 1:N | Um usuario gera multiplos logs de auth | SetNull |
| Usuario | Solicitacao | 1:N | Um usuario (Vendas) cria solicitacoes | - |
| Usuario | Evento | 1:N | Um professor leciona eventos | - |
| Usuario | Inscricao | 1:N | Um participante se inscreve em eventos | - |
| Usuario | PacienteModelo | 1:N | Um usuario cadastra pacientes modelo | - |
| Solicitacao | Evento | 1:1 | Uma solicitacao aprovada origina um evento | - |
| Evento | Inscricao | 1:N | Um evento recebe multiplas inscricoes | Cascade |
| Evento | PacienteModelo | 1:N | Um evento tem multiplos pacientes modelo | - |
| Evento | Certificado | 1:N | Um evento gera certificados | - |
| Inscricao | Certificado | 1:1 | Uma inscricao (com presenca) gera um certificado | Cascade |
| PacienteModelo | ConsentimentoLGPD | 1:N | Um paciente registra consentimentos | Cascade |
| PacienteModelo | AuditLogPaciente | 1:N | Acoes sobre pacientes sao auditadas | Restrict |
| TemplateEmail | GatilhoConfig | 1:N | Um template e usado por multiplos gatilhos | - |

## Constraints Unicos (UK)

| Tabela | Campos | Proposito |
|--------|--------|-----------|
| Usuario | email | E-mail unico no sistema |
| Inscricao | cpf + eventoId | Um CPF so pode se inscrever uma vez por evento |
| Inscricao | qrCode | QR Code unico para check-in |
| PacienteModelo | cpf + eventoId | Um CPF como paciente modelo por evento |
| Certificado | inscricaoId | Um certificado por inscricao |
| AuditLogPaciente | hash | Integridade da cadeia de auditoria |
| TemplateEmail | nome | Nome unico do template |
| GatilhoConfig | nome | Nome unico do gatilho |
| LembreteEnviado | eventoId + tipo + dataEnvio | Evita envio duplicado |

## Enums

| Enum | Valores | Usado em |
|------|---------|----------|
| PerfilUsuario | ADMIN, MARKETING, VENDAS, PROFESSOR, PARTICIPANTE, PACIENTE_MODELO | Usuario |
| TipoEventoAuth | LOGIN_SUCESSO, LOGIN_FALHA, LOGOUT, SENHA_ALTERADA, TWO_FA_HABILITADO, TWO_FA_DESABILITADO, ACESSO_NEGADO, PERFIL_ALTERADO | LogAutenticacao |
| StatusSolicitacao | PENDENTE, EM_ANALISE, APROVADA, REPROVADA, CANCELADA | Solicitacao |
| StatusEvento | RASCUNHO, PUBLICADO, EM_ANDAMENTO, CONCLUIDO, CANCELADO | Evento |
| StatusInscricao | PENDENTE, CONFIRMADA, CANCELADA, NO_SHOW, PRESENTE | Inscricao |
| StatusCertificado | PENDENTE, GERADO, ENVIADO, ERRO | Certificado |
| TipoEventoAuditPaciente | PACIENTE_MODELO_CRIADO, VISUALIZADO, EDITADO, EXCLUIDO, ACESSO_PACIENTES_MODELO, DOCUMENTOS_ACESSADOS, CONSENTIMENTO_REGISTRADO | AuditLogPacienteModelo |
| TipoTiming | IMEDIATO, DIAS_ANTES, DIAS_DEPOIS | GatilhoConfig |

---

*Documento gerado por engenharia reversa do Prisma Schema - ER Diagram*
