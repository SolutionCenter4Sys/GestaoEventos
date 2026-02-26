# 🗄️ PRISMA SCHEMA - Plataforma de Gestão de Eventos

**Banco de Dados:** Supabase PostgreSQL  
**ORM:** Prisma  
**Versão:** 1.0  
**Data:** 10/02/2026

---

## 📋 INSTRUÇÕES DE USO

### 1. Configurar Prisma
```bash
cd backend
npm install @prisma/client prisma
npx prisma init --datasource-provider postgresql
```

### 2. Copiar este schema para `prisma/schema.prisma`

### 3. Configurar .env
```bash
DATABASE_URL="postgresql://postgres:[4gRhou@4gRhou]@db.vrliyffjqwqxnixwwhbk.supabase.co:5432/postgres"
```

### 4. Executar Migration
```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

## 🔧 SCHEMA COMPLETO

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// EP-08: AUTENTICAÇÃO E CONTROLE DE ACESSO
// ============================================

enum PerfilUsuario {
  ADMIN
  MARKETING
  VENDAS
  PROFESSOR
  PARTICIPANTE
  PACIENTE_MODELO
}

model Usuario {
  id                        String    @id @default(uuid()) @db.Uuid
  nome                      String    @db.VarChar(200)
  email                     String    @unique @db.VarChar(255)
  senhaHash                 String    @db.VarChar(255)
  perfil                    PerfilUsuario
  ativo                     Boolean   @default(true)
  bloqueadoAte              DateTime? @db.Timestamp()
  tentativasLoginFalhas     Int       @default(0)
  ultimaTentativaLogin      DateTime? @db.Timestamp()
  
  // 2FA
  twoFactorHabilitado       Boolean   @default(false)
  twoFactorSecret           String?   @db.VarChar(255)
  twoFactorHabilitadoEm     DateTime? @db.Timestamp()
  
  // LGPD
  foto                      String?   @db.VarChar(500)
  
  criadoEm                  DateTime  @default(now()) @db.Timestamp()
  atualizadoEm              DateTime  @updatedAt @db.Timestamp()
  
  // Relacionamentos
  refreshTokens             RefreshToken[]
  logsAutenticacao          LogAutenticacao[]
  solicitacoesCriadas       Solicitacao[] @relation("SolicitacaoCriador")
  eventosLecionados         Evento[] @relation("EventoProfessor")
  inscricoes                Inscricao[]
  pacientesModeloCadastrados PacienteModelo[]
  
  @@index([email])
  @@map("usuarios")
}

model RefreshToken {
  id         String    @id @default(uuid()) @db.Uuid
  usuarioId  String    @db.Uuid
  token      String    @unique @db.VarChar(500)
  expiraEm   DateTime  @db.Timestamp()
  revogado   Boolean   @default(false)
  criadoEm   DateTime  @default(now()) @db.Timestamp()
  
  // Relacionamentos
  usuario    Usuario   @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
  
  @@index([usuarioId])
  @@index([token])
  @@map("refresh_tokens")
}

model TokenRecuperacaoSenha {
  id             String    @id @default(uuid()) @db.Uuid
  usuarioId      String    @db.Uuid
  token          String    @unique @db.VarChar(500)
  criadoEm       DateTime  @default(now()) @db.Timestamp()
  expiraEm       DateTime  @db.Timestamp()
  usado          Boolean   @default(false)
  usadoEm        DateTime? @db.Timestamp()
  ipSolicitacao  String?   @db.VarChar(45)
  
  @@index([token])
  @@index([usuarioId])
  @@map("tokens_recuperacao_senha")
}

model CodigoRecuperacao2FA {
  id        Int       @id @default(autoincrement())
  usuarioId String    @db.Uuid
  codigo    String    @db.VarChar(255) // Hash do código
  usado     Boolean   @default(false)
  usadoEm   DateTime? @db.Timestamp()
  criadoEm  DateTime  @default(now()) @db.Timestamp()
  
  @@index([usuarioId])
  @@index([codigo])
  @@map("codigos_recuperacao_2fa")
}

enum TipoEventoAuth {
  LOGIN_SUCESSO
  LOGIN_FALHA
  LOGOUT
  SENHA_ALTERADA
  TWO_FA_HABILITADO
  TWO_FA_DESABILITADO
  ACESSO_NEGADO
  PERFIL_ALTERADO
}

model LogAutenticacao {
  id            Int             @id @default(autoincrement())
  usuarioId     String?         @db.Uuid
  email         String          @db.VarChar(255)
  tipoEvento    TipoEventoAuth
  ipOrigem      String          @db.VarChar(45)
  userAgent     String?         @db.Text
  pais          String?         @db.Char(2)
  cidade        String?         @db.VarChar(100)
  sucesso       Boolean
  motivoFalha   String?         @db.VarChar(255)
  metadados     Json?
  timestamp     DateTime        @default(now()) @db.Timestamp()
  
  // Relacionamentos
  usuario       Usuario?        @relation(fields: [usuarioId], references: [id], onDelete: SetNull)
  
  @@index([usuarioId])
  @@index([email])
  @@index([timestamp(sort: Desc)])
  @@index([ipOrigem])
  @@index([tipoEvento])
  @@map("logs_autenticacao")
}

// ============================================
// EP-01: SOLICITAÇÕES DE EVENTOS
// ============================================

enum StatusSolicitacao {
  PENDENTE
  EM_ANALISE
  APROVADA
  REPROVADA
  CANCELADA
}

model Solicitacao {
  id                  String             @id @default(uuid()) @db.Uuid
  titulo              String             @db.VarChar(200)
  descricao           String             @db.Text
  justificativa       String             @db.Text
  publicoAlvo         String             @db.Text
  capacidadeEstimada  Int
  dataPreferencial    DateTime           @db.Date
  horaPreferencial    String             @db.VarChar(5) // HH:mm
  duracaoHoras        Int
  localSugerido       String?            @db.VarChar(200)
  status              StatusSolicitacao  @default(PENDENTE)
  motivoReprovacao    String?            @db.Text
  
  // Relacionamentos
  solicitanteId       String             @db.Uuid
  solicitante         Usuario            @relation("SolicitacaoCriador", fields: [solicitanteId], references: [id])
  
  // Aprovação
  analisadoPorId      String?            @db.Uuid
  analisadoEm         DateTime?          @db.Timestamp()
  
  criadoEm            DateTime           @default(now()) @db.Timestamp()
  atualizadoEm        DateTime           @updatedAt @db.Timestamp()
  
  // Se aprovada, gera evento
  eventoId            String?            @unique @db.Uuid
  evento              Evento?            @relation("EventoDeSolicitacao")
  
  @@index([solicitanteId])
  @@index([status])
  @@index([dataPreferencial])
  @@map("solicitacoes")
}

// ============================================
// EP-02: GESTÃO DE EVENTOS
// ============================================

enum StatusEvento {
  RASCUNHO
  PUBLICADO
  EM_ANDAMENTO
  CONCLUIDO
  CANCELADO
}

model Evento {
  id                    String         @id @default(uuid()) @db.Uuid
  nome                  String         @db.VarChar(200)
  descricao             String         @db.Text
  dataInicio            DateTime       @db.Timestamp()
  dataFim               DateTime       @db.Timestamp()
  local                 String         @db.VarChar(200)
  endereco              String?        @db.Text
  capacidadeMaxima      Int
  capacidadeAtual       Int            @default(0)
  publicado             Boolean        @default(false)
  status                StatusEvento   @default(RASCUNHO)
  
  // Informações adicionais
  objetivos             String?        @db.Text
  programacao           String?        @db.Text
  informacoesAdicionais String?        @db.Text
  
  // Professor responsável
  professorId           String?        @db.Uuid
  professor             Usuario?       @relation("EventoProfessor", fields: [professorId], references: [id])
  
  // Origem (se veio de solicitação)
  solicitacaoId         String?        @unique @db.Uuid
  solicitacao           Solicitacao?   @relation("EventoDeSolicitacao", fields: [solicitacaoId], references: [id])
  
  criadoEm              DateTime       @default(now()) @db.Timestamp()
  atualizadoEm          DateTime       @updatedAt @db.Timestamp()
  
  // Relacionamentos
  inscricoes            Inscricao[]
  pacientesModelo       PacienteModelo[]
  certificados          Certificado[]
  
  @@index([dataInicio])
  @@index([status])
  @@index([publicado])
  @@index([professorId])
  @@map("eventos")
}

// ============================================
// EP-03: INSCRIÇÕES E PARTICIPANTES
// ============================================

enum StatusInscricao {
  PENDENTE
  CONFIRMADA
  CANCELADA
  NO_SHOW
  PRESENTE
}

model Inscricao {
  id              String           @id @default(uuid()) @db.Uuid
  eventoId        String           @db.Uuid
  participanteId  String           @db.Uuid
  cpf             String           @db.VarChar(11)
  telefone        String           @db.VarChar(20)
  status          StatusInscricao  @default(CONFIRMADA)
  qrCode          String           @unique @db.Uuid // UUID para check-in
  checkinEm       DateTime?        @db.Timestamp()
  
  criadoEm        DateTime         @default(now()) @db.Timestamp()
  atualizadoEm    DateTime         @updatedAt @db.Timestamp()
  
  // Relacionamentos
  evento          Evento           @relation(fields: [eventoId], references: [id], onDelete: Cascade)
  participante    Usuario          @relation(fields: [participanteId], references: [id])
  certificado     Certificado?
  
  @@unique([cpf, eventoId]) // Um CPF por evento
  @@index([eventoId])
  @@index([participanteId])
  @@index([qrCode])
  @@map("inscricoes")
}

// ============================================
// EP-04: CERTIFICADOS
// ============================================

enum StatusCertificado {
  PENDENTE
  GERADO
  ENVIADO
  ERRO
}

model Certificado {
  id              String             @id @default(uuid()) @db.Uuid
  inscricaoId     String             @unique @db.Uuid
  eventoId        String             @db.Uuid
  participanteNome String            @db.VarChar(200)
  eventNome       String             @db.VarChar(200)
  dataEvento      DateTime           @db.Date
  cargaHoraria    Int
  urlPdf          String?            @db.VarChar(500) // Supabase Storage URL
  status          StatusCertificado  @default(PENDENTE)
  geradoEm        DateTime?          @db.Timestamp()
  enviadoEm       DateTime?          @db.Timestamp()
  
  criadoEm        DateTime           @default(now()) @db.Timestamp()
  
  // Relacionamentos
  inscricao       Inscricao          @relation(fields: [inscricaoId], references: [id], onDelete: Cascade)
  evento          Evento             @relation(fields: [eventoId], references: [id])
  
  @@index([inscricaoId])
  @@index([eventoId])
  @@index([status])
  @@map("certificados")
}

// ============================================
// EP-05: PACIENTES MODELO (LGPD)
// ============================================

model PacienteModelo {
  id                   String    @id @default(uuid()) @db.Uuid
  nome                 String    @db.VarChar(200)
  cpf                  String    @db.VarChar(11)
  dataNascimento       DateTime  @db.Date
  email                String    @db.VarChar(255)
  telefone             String    @db.VarChar(20)
  endereco             String?   @db.Text
  
  // Dados sensíveis (CRIPTOGRAFADOS)
  historicoSaude       String?   @db.Text // AES-256-GCM encrypted
  restricoesAlergias   String?   @db.Text // AES-256-GCM encrypted
  
  // Vínculo obrigatório
  eventoId             String    @db.Uuid
  
  // Auditoria
  criadoPor            String    @db.Uuid
  criadoEm             DateTime  @default(now()) @db.Timestamp()
  atualizadoEm         DateTime  @updatedAt @db.Timestamp()
  deletedAt            DateTime? @db.Timestamp() // Soft delete
  
  // Relacionamentos
  evento               Evento    @relation(fields: [eventoId], references: [id])
  criador              Usuario   @relation(fields: [criadoPor], references: [id])
  consentimentos       ConsentimentoLGPD[]
  logsAuditoria        AuditLogPacienteModelo[]
  
  @@unique([cpf, eventoId])
  @@index([eventoId])
  @@index([criadoPor])
  @@map("pacientes_modelo")
}

model ConsentimentoLGPD {
  id             Int       @id @default(autoincrement())
  entidadeTipo   String    @db.VarChar(50) // 'PACIENTE_MODELO', etc.
  entidadeId     String    @db.Uuid
  tipo           String    @db.VarChar(100) // 'CADASTRO_PACIENTE_MODELO'
  aceito         Boolean
  timestamp      DateTime  @db.Timestamp()
  ip             String    @db.VarChar(45)
  userAgent      String    @db.Text
  criadoEm       DateTime  @default(now()) @db.Timestamp()
  
  // Relacionamentos (opcional, por entidade)
  pacienteModelo PacienteModelo? @relation(fields: [entidadeId], references: [id], onDelete: Cascade, map: "fk_consentimento_paciente")
  
  @@index([entidadeId, entidadeTipo])
  @@map("consentimentos_lgpd")
}

enum TipoEventoAuditPaciente {
  PACIENTE_MODELO_CRIADO
  PACIENTE_MODELO_VISUALIZADO
  PACIENTE_MODELO_EDITADO
  PACIENTE_MODELO_EXCLUIDO
  ACESSO_PACIENTES_MODELO
  DOCUMENTOS_PACIENTE_ACESSADOS
  CONSENTIMENTO_REGISTRADO
}

model AuditLogPacienteModelo {
  id                   Int                        @id @default(autoincrement())
  timestamp            DateTime                   @default(now()) @db.Timestamp()
  usuarioId            String                     @db.Uuid
  usuarioNome          String                     @db.VarChar(200)
  usuarioPerfil        PerfilUsuario
  ipOrigem             String                     @db.VarChar(45)
  userAgent            String                     @db.Text
  acao                 TipoEventoAuditPaciente
  pacienteModeloId     String?                    @db.Uuid
  pacienteModeloNome   String?                    @db.VarChar(200)
  eventoId             String?                    @db.Uuid
  detalhes             Json?
  hashAnterior         String                     @db.VarChar(64)
  hash                 String                     @unique @db.VarChar(64)
  
  // Relacionamentos
  usuario              Usuario                    @relation(fields: [usuarioId], references: [id], onDelete: Restrict)
  pacienteModelo       PacienteModelo?            @relation(fields: [pacienteModeloId], references: [id], onDelete: Restrict)
  
  @@index([timestamp(sort: Desc)])
  @@index([usuarioId])
  @@index([pacienteModeloId])
  @@index([acao])
  @@map("audit_log_pacientes_modelo")
}

// ============================================
// EP-06: SISTEMA DE COMUNICAÇÃO
// ============================================

model TemplateEmail {
  id          String    @id @default(uuid()) @db.Uuid
  nome        String    @unique @db.VarChar(100)
  descricao   String?   @db.Text
  assunto     String    @db.VarChar(255)
  corpo       String    @db.Text // HTML
  variaveis   Json      // Array de variáveis disponíveis
  ativo       Boolean   @default(true)
  criadoEm    DateTime  @default(now()) @db.Timestamp()
  atualizadoEm DateTime @updatedAt @db.Timestamp()
  
  // Relacionamentos
  gatilhos    GatilhoConfig[]
  
  @@map("templates_email")
}

enum TipoTiming {
  IMEDIATO
  DIAS_ANTES
  DIAS_DEPOIS
}

model GatilhoConfig {
  id           String      @id @default(uuid()) @db.Uuid
  nome         String      @unique @db.VarChar(100)
  descricao    String      @db.Text
  ativo        Boolean     @default(true)
  templateId   String      @db.Uuid
  timingTipo   TipoTiming
  timingValor  Int?        // Quantidade de dias (se aplicável)
  criadoEm     DateTime    @default(now()) @db.Timestamp()
  atualizadoEm DateTime    @updatedAt @db.Timestamp()
  
  // Relacionamentos
  template     TemplateEmail @relation(fields: [templateId], references: [id])
  
  @@index([ativo])
  @@map("gatilhos_config")
}

model EmailQueueLog {
  id            Int       @id @default(autoincrement())
  jobId         String?   @db.VarChar(100)
  destinatario  String    @db.VarChar(255)
  assunto       String    @db.Text
  gatilhoId     String?   @db.Uuid
  messageId     String?   @db.VarChar(255) // ID do provedor (SES, SendGrid)
  tentativa     Int
  sucesso       Boolean
  erro          String?   @db.Text
  metadados     Json?
  timestamp     DateTime  @default(now()) @db.Timestamp()
  
  @@index([destinatario])
  @@index([timestamp(sort: Desc)])
  @@index([gatilhoId])
  @@index([sucesso])
  @@map("email_queue_log")
}

model LembreteEnviado {
  id                  Int      @id @default(autoincrement())
  eventoId            String   @db.Uuid
  tipo                String   @db.VarChar(50) // 'lembrete_7d_antes', etc.
  quantidadeEnviados  Int
  dataEnvio           DateTime @db.Date
  criadoEm            DateTime @default(now()) @db.Timestamp()
  
  @@unique([eventoId, tipo, dataEnvio])
  @@index([eventoId])
  @@index([dataEnvio])
  @@map("lembretes_enviados")
}
```

---

## 🔐 CONFIGURAÇÕES DE SEGURANÇA (Supabase)

### Row Level Security (RLS)

Após criar as tabelas, executar no Supabase SQL Editor:

```sql
-- Habilitar RLS em todas as tabelas sensíveis
ALTER TABLE pacientes_modelo ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log_pacientes_modelo ENABLE ROW LEVEL SECURITY;
ALTER TABLE consentimentos_lgpd ENABLE ROW LEVEL SECURITY;

-- Policy: Admin vê tudo
CREATE POLICY "Admin full access" ON pacientes_modelo
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE usuarios.id = auth.uid()
      AND usuarios.perfil = 'ADMIN'
    )
  );

-- Policy: Professor vê apenas de seus eventos
CREATE POLICY "Professor own events" ON pacientes_modelo
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM eventos
      WHERE eventos.id = pacientes_modelo.evento_id
      AND eventos.professor_id = auth.uid()
    )
  );

-- Policy: Paciente Modelo vê apenas seus próprios dados
CREATE POLICY "Paciente own data" ON pacientes_modelo
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE usuarios.id = auth.uid()
      AND usuarios.email = pacientes_modelo.email
    )
  );
```

---

## 📦 SEED DATA (Dados Iniciais)

```typescript
// prisma/seed.ts
import { PrismaClient, PerfilUsuario } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // 1. Criar Admin padrão
  const adminSenhaHash = await bcrypt.hash('Admin123!@#', 12);
  
  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@plataforma-eventos.com' },
    update: {},
    create: {
      nome: 'Administrador do Sistema',
      email: 'admin@plataforma-eventos.com',
      senhaHash: adminSenhaHash,
      perfil: PerfilUsuario.ADMIN,
      ativo: true
    }
  });
  
  console.log('✅ Admin criado:', admin.email);
  
  // 2. Criar template de e-mail padrão
  const templateInscricao = await prisma.templateEmail.upsert({
    where: { nome: 'inscricao_confirmada' },
    update: {},
    create: {
      nome: 'inscricao_confirmada',
      descricao: 'E-mail de confirmação de inscrição',
      assunto: '✅ Inscrição Confirmada - {{nomeEvento}}',
      corpo: `
        <h1>Olá {{nomeParticipante}}!</h1>
        <p>Sua inscrição no evento <strong>{{nomeEvento}}</strong> foi confirmada!</p>
        <p><strong>Data:</strong> {{dataEvento}}</p>
        <p><strong>Horário:</strong> {{horaEvento}}</p>
        <p><strong>Local:</strong> {{localEvento}}</p>
      `,
      variaveis: ['nomeParticipante', 'nomeEvento', 'dataEvento', 'horaEvento', 'localEvento']
    }
  });
  
  console.log('✅ Template criado:', templateInscricao.nome);
  
  // 3. Criar gatilho de inscrição confirmada
  const gatilho = await prisma.gatilhoConfig.upsert({
    where: { nome: 'inscricao_confirmada' },
    update: {},
    create: {
      nome: 'inscricao_confirmada',
      descricao: 'Enviado imediatamente após confirmação de inscrição',
      ativo: true,
      templateId: templateInscricao.id,
      timingTipo: 'IMEDIATO'
    }
  });
  
  console.log('✅ Gatilho criado:', gatilho.nome);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

---

## 🚀 COMANDOS DE SETUP

```bash
# 1. Criar arquivo prisma/schema.prisma com conteúdo acima

# 2. Executar migration
npx prisma migrate dev --name init

# 3. Gerar Prisma Client
npx prisma generate

# 4. Executar seed
npx prisma db seed

# 5. Abrir Prisma Studio (visualizar dados)
npx prisma studio
```

---

**Próximo:** Criar estrutura do projeto backend (NestJS) + frontend (Angular)!
