# Briefing - Plataforma Web Unificada de Gestão de Eventos

## 1. Visão Geral do Projeto

### 1.1. Objetivo
Desenvolver uma plataforma web exclusiva e única para a gestão completa e integrada de workshops hands-on e mentorias na área de estética.

### 1.2. Problema que Resolve
Gestão de eventos fragmentada com processos manuais e informações dispersas, gerando:
- Ineficiência e retrabalho
- Falhas de comunicação entre equipes (Vendas, Marketing, Operacional)
- Dificuldades no acompanhamento do ciclo de vida completo de eventos

### 1.3. Visão de Plataforma Única
Ponto central para todas as operações:
- Solicitação de eventos (Vendas)
- Aprovação e publicação (Marketing)
- Gestão de pacientes modelo
- Inscrição e acompanhamento de participantes
- Comunicação automatizada
- Emissão de certificados

## 2. Perfis de Usuários

### Organizador/Admin
- Acesso total e governança
- Gestão de usuários, templates, configurações
- Relatórios e auditoria

### Marketing
- Aprovação/reprovação de solicitações
- Publicação de eventos
- Gestão de participantes inscritos

### Vendas
- Solicitação de eventos
- Acompanhamento de status

### Professor
- Condução de eventos
- Gestão de pacientes modelo
- Upload de fotos antes/depois

### Participante
- Inscrição em eventos
- Acesso a certificados

### Paciente Modelo
- Fornecimento de dados
- Preenchimento de documentos (anamnese, termo de imagem)

## 3. Módulos Principais

### 3.1. Módulo de Solicitação de Evento
- Formulário completo com validações
- Workflow de aprovação (Rascunho → Enviado → Em Revisão → Aprovado/Reprovado → Publicado)
- Comentários internos entre Vendas e Marketing

### 3.2. Módulo de Eventos
- Criação/edição/publicação de eventos
- Controle de capacidade e vagas
- Lista de espera
- Check-in/presença

### 3.3. Módulo de Inscrição
- Formulário com validações
- Confirmação por e-mail
- Área do participante

### 3.4. Módulo de Participantes e Certificação
- Cadastro automático via formulário
- Lista de presença
- Envio automático de certificados (PDF)
- Reenvio e auditoria

### 3.5. Módulo de Paciente Modelo
- Gestão de dados pessoais e histórico de saúde
- Vínculo a eventos específicos
- Controle de acesso restrito

### 3.6. Documentos da Paciente Modelo
- Ficha de anamnese automática
- Termo de autorização de uso de imagem
- Status de documentos (pendente → enviado → recebido → aprovado)
- Lembretes automáticos

### 3.7. Área do Professor
- Acesso a eventos designados
- Upload de fotos antes/depois
- Visualização de participantes e paciente modelo

### 3.8. Comunicação Automatizada
- Templates configuráveis com variáveis dinâmicas
- Gatilhos automáticos:
  - Confirmação de inscrição
  - Lembretes de evento
  - Envio de certificado
  - Documentos pendentes

### 3.9. Integração com Microsoft Outlook Calendar
- Sincronização automática de eventos
- Criação/atualização/cancelamento
- Gestão de fusos horários

## 4. Requisitos Não Funcionais

### 4.1. LGPD e Privacidade
- Criptografia de dados sensíveis
- Consentimento explícito
- Direito ao esquecimento
- Trilha de auditoria

### 4.2. Segurança
- Autenticação segura
- 2FA opcional
- HTTPS obrigatório
- Controle de acesso granular

### 4.3. Performance e Escalabilidade
- Tempos de carregamento rápidos
- Suporte a crescimento de usuários e dados

### 4.4. Responsividade
- Interface adaptável (desktop, tablet, smartphone)

### 4.5. Backup e Recuperação
- Backup automático regular
- Definição de RPO/RTO

### 4.6. Acessibilidade
- Conformidade com WCAG 2.1 AA

## 5. Campos do Formulário de Solicitação

### Dados do Solicitante
- Nome, E-mail, Telefone

### Informações do Evento
- Nome proposto
- Tipo (Workshop/Mentoria)
- Objetivo
- Público-alvo
- Vagas estimadas
- Data/hora início e fim

### Logística
- Formato (Presencial/Online/Híbrido)
- Localização (endereço, cidade, estado, CEP)
- Plataforma online

### Infraestrutura
- Necessidades de equipamento
- Materiais de apoio
- Coffee break/alimentação

### Paciente Modelo
- Requer paciente modelo? (Sim/Não)
- Tipo de procedimento
- Critérios da paciente

### Orçamento
- Preço sugerido por participante
- Observações adicionais

## 6. Relatórios e Exportações

- Lista de presença
- Inscritos
- Status de documentos
- Certificados enviados
- Exportação em CSV/PDF

## 7. Critérios de Aceitação

- Validações obrigatórias em formulários
- Status atualizados corretamente
- Notificações automáticas funcionais
- Envio automático de certificados
- Envio automático de documentos para paciente modelo
- Upload de fotos pelo professor
- E-mails disparados nos gatilhos corretos
- Sincronização com Outlook Calendar
- Performance adequada
- Responsividade em dispositivos móveis
- Criptografia de dados sensíveis

---

**Fonte**: Briefing original fornecido pelo cliente  
**Data**: 10/02/2026
