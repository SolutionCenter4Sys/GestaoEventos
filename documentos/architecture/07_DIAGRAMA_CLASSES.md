# Diagrama de Classes (Domain Model) - Plataforma de Gestão de Eventos

**Versão**: 1.0 (Engenharia Reversa)
**Data**: 18/02/2026
**Tipo**: Class Diagram (Domain Model)
**Fonte**: Prisma Schema + Backend Services + Frontend Services
**Pergunta respondida**: "Quais são os objetos de negócio e seus comportamentos?"

---

## Visão Geral

O modelo de domínio da Plataforma de Gestão de Eventos é organizado em 6 bounded contexts alinhados com os épicos: Autenticação, Solicitações, Eventos, Inscrições, Pacientes Modelo e Comunicação. Cada contexto possui entidades, value objects (enums) e serviços de domínio.

---

## Diagrama de Classes - Domínio Principal

```mermaid
classDiagram
    class Usuario {
        -UUID id
        -String nome
        -String email
        -String senhaHash
        -PerfilUsuario perfil
        -Boolean ativo
        -DateTime bloqueadoAte
        -Int tentativasLoginFalhas
        -Boolean twoFactorHabilitado
        -String twoFactorSecret
        +login(email, senha, codigo2FA) LoginResponse
        +recuperarSenha(email) void
        +resetarSenha(token, novaSenha) void
        +habilitarTwoFactor() QRCodeResponse
        +validarTwoFactor(codigo) void
        +desabilitarTwoFactor(codigo) void
        +isBloqueado() Boolean
        +incrementarTentativasFalhas() void
        +resetarTentativas() void
    }

    class Solicitacao {
        -UUID id
        -String titulo
        -String descricao
        -String justificativa
        -String publicoAlvo
        -Int capacidadeEstimada
        -Date dataPreferencial
        -Int duracaoHoras
        -StatusSolicitacao status
        -UUID solicitanteId
        -UUID eventoId
        +criar(dados) Solicitacao
        +analisar() void
        +aprovar() void
        +reprovar(motivo) void
        +cancelar() void
        +vincularEvento(eventoId) void
    }

    class Evento {
        -UUID id
        -String nome
        -String descricao
        -DateTime dataInicio
        -DateTime dataFim
        -String local
        -Int capacidadeMaxima
        -Int capacidadeAtual
        -StatusEvento status
        -UUID professorId
        +criar(dados) Evento
        +publicar() void
        +iniciar() void
        +concluir() void
        +cancelar() void
        +temVagasDisponiveis() Boolean
        +incrementarCapacidade() void
        +getVagasRestantes() Int
    }

    class Inscricao {
        -UUID id
        -UUID eventoId
        -UUID participanteId
        -String cpf
        -String telefone
        -StatusInscricao status
        -UUID qrCode
        -DateTime checkinEm
        +criar(eventoId, dados) Inscricao
        +confirmar() void
        +cancelar() void
        +fazerCheckin() void
        +marcarNoShow() void
        +gerarQRCode() UUID
        +isPresente() Boolean
    }

    class Certificado {
        -UUID id
        -UUID inscricaoId
        -UUID eventoId
        -String participanteNome
        -String eventoNome
        -Date dataEvento
        -Int cargaHoraria
        -String urlPdf
        -StatusCertificado status
        +gerar(inscricao, evento) Certificado
        +gerarPDF() String
        +enviarPorEmail() void
        +marcarErro(motivo) void
    }

    class PacienteModelo {
        -UUID id
        -String nome
        -String cpf
        -Date dataNascimento
        -String email
        -String historicoSaude
        -String restricoesAlergias
        -UUID eventoId
        -DateTime deletedAt
        +cadastrar(dados) PacienteModelo
        +atualizar(dados) void
        +excluir() void
        +criptografarDadosSensiveis() void
        +descriptografarDadosSensiveis() void
        +registrarConsentimento(tipo, aceito) void
        +isExcluido() Boolean
    }

    class TemplateEmail {
        -UUID id
        -String nome
        -String assunto
        -String corpo
        -Json variaveis
        -Boolean ativo
        +criar(dados) TemplateEmail
        +atualizar(dados) void
        +renderizar(contexto) EmailRenderizado
        +ativar() void
        +desativar() void
    }

    class GatilhoConfig {
        -UUID id
        -String nome
        -Boolean ativo
        -UUID templateId
        -TipoTiming timingTipo
        -Int timingValor
        +criar(dados) GatilhoConfig
        +ativar() void
        +desativar() void
        +calcularDataDisparo(eventoData) DateTime
        +isImediato() Boolean
    }

    class ConsentimentoLGPD {
        -Int id
        -String entidadeTipo
        -UUID entidadeId
        -String tipo
        -Boolean aceito
        -DateTime timestamp
        -String ip
        -String userAgent
        +registrar(paciente, tipo, aceito, req) void
    }

    class AuditLogPaciente {
        -Int id
        -DateTime timestamp
        -UUID usuarioId
        -String acao
        -UUID pacienteModeloId
        -Json detalhes
        -String hashAnterior
        -String hash
        +registrar(usuario, acao, paciente, detalhes) void
        +calcularHash() String
        +verificarIntegridade() Boolean
    }

    Usuario "1" --o "0..*" Solicitacao : cria
    Usuario "1" --o "0..*" Evento : leciona
    Usuario "1" --o "0..*" Inscricao : inscreve-se
    Usuario "1" --o "0..*" PacienteModelo : cadastra

    Solicitacao "1" --o "0..1" Evento : origina
    Evento "1" --o "0..*" Inscricao : recebe
    Evento "1" --o "0..*" PacienteModelo : tem
    Evento "1" --o "0..*" Certificado : gera

    Inscricao "1" --o "0..1" Certificado : gera

    PacienteModelo "1" --o "0..*" ConsentimentoLGPD : registra
    PacienteModelo "1" --o "0..*" AuditLogPaciente : auditado

    TemplateEmail "1" --o "0..*" GatilhoConfig : usado por
```

---

## Diagrama de Classes - Servicos (Backend NestJS)

```mermaid
classDiagram
    class AuthService {
        -PrismaService prisma
        -JwtService jwtService
        -ConfigService configService
        +login(dto, ip, userAgent) LoginResponse
        +refreshToken(dto) TokenPair
        +recuperarSenha(dto, ip) Message
        +resetarSenha(dto) Message
        +habilitarTwoFactor(userId) QRCodeResponse
        +validarTwoFactor(userId, dto) Message
        +desabilitarTwoFactor(userId, codigo) Message
        +getTwoFactorStatus(userId) Status
        -generateTokens(userId, email, perfil) TokenPair
        -validarCodigoRecuperacao(userId, codigo) Boolean
        -logAuthEvent(data) void
    }

    class UsuariosService {
        -PrismaService prisma
        +listar(dto) PaginatedResponse
        +atualizarPerfil(userId, dto, adminId) Response
        +buscarPorId(userId) Usuario
    }

    class PrismaService {
        +usuario PrismaClient
        +refreshToken PrismaClient
        +solicitacao PrismaClient
        +evento PrismaClient
        +inscricao PrismaClient
        +certificado PrismaClient
        +pacienteModelo PrismaClient
        +templateEmail PrismaClient
        +$transaction() void
    }

    class AuthController {
        -AuthService authService
        +login(dto, req) LoginResponse
        +refreshToken(dto) TokenPair
        +recuperarSenha(dto, req) Message
        +resetarSenha(dto) Message
        +getTwoFactorStatus(user) Status
        +habilitarTwoFactor(user) QRCodeResponse
        +validarTwoFactor(user, dto) Message
        +desabilitarTwoFactor(user, dto) Message
        +getProfile(user) UserData
        +logout(dto) Message
    }

    class UsuariosController {
        -UsuariosService usuariosService
        +listar(dto) PaginatedResponse
        +atualizarPerfil(id, dto, admin) Response
        +buscarPorId(id) Usuario
    }

    AuthController --> AuthService : delega
    UsuariosController --> UsuariosService : delega
    AuthService --> PrismaService : queries
    UsuariosService --> PrismaService : queries
```

---

## Diagrama de Classes - Frontend Services

```mermaid
classDiagram
    class AuthServiceFE {
        -HttpClient http
        -Router router
        -Signal~User~ userSignal
        -Signal~boolean~ loadingSignal
        -Signal~string~ errorSignal
        +currentUser Computed~User~
        +isLoggedIn Computed~boolean~
        +loading Computed~boolean~
        +login(email, password) Observable~LoginResponse~
        +submit2FA(code) Observable~LoginResponse~
        +getToken() string
        +logout() void
        +hasRole(role) boolean
        +hasAnyRole(roles) boolean
        -loadStoredUser() void
        -getApiUrl() string
    }

    class MenuServiceFE {
        -MenuItem[] items
        +getMenuItems(userRoles) MenuItem[]
    }

    class ConsentimentoLgpdServiceFE {
        +hasConsent() boolean
        +setConsent() void
    }

    class MainLayoutComponent {
        -AuthServiceFE auth
        -MenuServiceFE menuService
        -ConsentimentoLgpdServiceFE consentimento
        -MatDialog dialog
        +currentUser Computed~User~
        +menuItems Computed~MenuItem[]~
        +ngOnInit() void
        +logout() void
    }

    MainLayoutComponent --> AuthServiceFE : usa
    MainLayoutComponent --> MenuServiceFE : menu dinamico
    MainLayoutComponent --> ConsentimentoLgpdServiceFE : LGPD check
```

---

## Enumeracoes (Value Objects)

```mermaid
classDiagram
    class PerfilUsuario {
        <<enumeration>>
        ADMIN
        MARKETING
        VENDAS
        PROFESSOR
        PARTICIPANTE
        PACIENTE_MODELO
    }

    class StatusSolicitacao {
        <<enumeration>>
        PENDENTE
        EM_ANALISE
        APROVADA
        REPROVADA
        CANCELADA
    }

    class StatusEvento {
        <<enumeration>>
        RASCUNHO
        PUBLICADO
        EM_ANDAMENTO
        CONCLUIDO
        CANCELADO
    }

    class StatusInscricao {
        <<enumeration>>
        PENDENTE
        CONFIRMADA
        CANCELADA
        NO_SHOW
        PRESENTE
    }

    class StatusCertificado {
        <<enumeration>>
        PENDENTE
        GERADO
        ENVIADO
        ERRO
    }

    class TipoTiming {
        <<enumeration>>
        IMEDIATO
        DIAS_ANTES
        DIAS_DEPOIS
    }
```

---

*Documento gerado por engenharia reversa - Class Diagram (Domain Model)*
