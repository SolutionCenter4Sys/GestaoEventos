# Épico – Gestão de Solicitações e Aprovação de Eventos

**Produto:** Plataforma Web Unificada de Gestão de Eventos  
**Contexto:** MVP - Release 1.0  
**Versão:** 1.01  
**Data:** 10/02/2026  
**Release:** Release 1.0

---

## 1. Identificação

| Campo | Conteúdo |
|-------|----------|
| **Nome do Épico** | Gestão de Solicitações e Aprovação de Eventos |
| **ID** | EP-01 |
| **Produto / Iniciativa** | Plataforma Web Unificada de Gestão de Eventos |
| **Release** | Release 1.0 |
| **Responsável (Proposta)** | Product Owner |
| **Status** | Proposta |

---

## 2. Resumo do Épico

Criar um sistema de solicitação estruturado que permita à equipe de Vendas formalizar demandas de eventos para o Marketing, com workflow de aprovação completo, comunicação interna e rastreabilidade de status, eliminando processos manuais e fragmentados.

---

## 3. Contexto / Problema de Negócio

- Atualmente a solicitação de eventos é feita de forma manual e desorganizada (e-mails, planilhas, mensagens)
- Não existe rastreabilidade do status das solicitações entre Vendas e Marketing
- Falhas de comunicação causam retrabalho e perda de informações críticas para execução dos eventos
- Marketing recebe solicitações incompletas ou sem informações essenciais
- Não há histórico centralizado das solicitações aprovadas, reprovadas ou em andamento

**Pergunta de negócio que este épico endereça:**  
*"Como estruturar e centralizar o processo de solicitação de eventos entre Vendas e Marketing, garantindo qualidade de informações e rastreabilidade?"*

---

## 4. Proposta de Valor / Benefício

- **Para o usuário/cliente (Vendas):** Processo claro e estruturado para solicitar eventos, com feedback imediato do status da solicitação
- **Para a organização (Marketing):** Recebimento de solicitações completas e estruturadas, reduzindo retrabalho e agilizando aprovações
- **Para o ecossistema:** Base sólida de dados para planejamento, histórico e análise de demanda de eventos

### 4.1 ROI (Retorno sobre o Investimento)

- **Investimento esperado:** 2 desenvolvedores fullstack por 3 semanas (frontend + backend + integrações)
- **Retorno esperado:** 
  - Redução de 70% no tempo de comunicação entre Vendas e Marketing
  - Redução de 80% em solicitações incompletas ou com informações faltantes
  - Eliminação de retrabalho estimado em 15-20 horas/mês
- **Payback (retorno do investimento):** Imediato após go-live pela eliminação de processos manuais
- **Métricas de valor (como medir o ROI):** 
  - Tempo médio de aprovação de solicitações
  - Taxa de solicitações aprovadas vs. reprovadas
  - Número de interações necessárias até aprovação
  - Satisfação das equipes (NPS interno)
- **Premissas para o ROI:** 
  - Adoção obrigatória pela equipe de Vendas (substituição do processo atual)
  - Treinamento adequado das equipes
  - Marketing assume responsabilidade de aprovar/reprovar em até 48h

---

## 5. Descrição Detalhada

Este épico cobre o **fluxo completo de solicitação de eventos** que:

1. **Formulário estruturado de solicitação** com todos os campos necessários (dados do evento, logística, infraestrutura, paciente modelo, orçamento) e validações obrigatórias
2. **Workflow de status** com transições claras (Rascunho → Enviado → Em Revisão → Aprovado/Reprovado → Publicado)
3. **Comunicação interna** via comentários entre Vendas e Marketing dentro da própria solicitação
4. **Notificações automáticas** para Marketing quando nova solicitação é enviada e para Vendas quando há mudança de status

**Escopo in scope:**  
- Formulário completo de solicitação com todos os campos do briefing
- Sistema de validação de campos obrigatórios
- Workflow de aprovação com 5 status (Rascunho, Enviado, Em Revisão, Aprovado, Reprovado)
- Campo de comentários internos entre Vendas e Marketing
- Upload de anexos (documentos, imagens) na solicitação
- Notificações por e-mail de mudanças de status
- Histórico de todas as solicitações por vendedor
- Painel de solicitações pendentes para Marketing

**Escopo out of scope (outros épicos):**  
- Criação efetiva do evento após aprovação (EP-02)
- Publicação do evento para inscrições (EP-02)
- Gestão de participantes (EP-03)
- Envio de certificados (EP-04)

---

## 6. Critérios de Aceite

- [ ] O formulário de solicitação não permite envio com campos obrigatórios vazios
- [ ] O status da solicitação é atualizado corretamente em cada transição (Rascunho → Enviado → Em Revisão → Aprovado/Reprovado → Publicado)
- [ ] Marketing recebe notificação por e-mail imediatamente ao receber nova solicitação
- [ ] Vendas recebe notificação por e-mail quando status da solicitação muda
- [ ] Comentários internos são visíveis para Vendas e Marketing, mas não para outros perfis
- [ ] É possível anexar até 5 arquivos (PDF, JPG, PNG) por solicitação
- [ ] Vendedor visualiza apenas suas próprias solicitações
- [ ] Marketing visualiza todas as solicitações de todos os vendedores
- [ ] Validações de formato (e-mail, telefone, data/hora, CEP) funcionam corretamente
- [ ] Campos condicionais aparecem/somem conforme seleções (ex: localização física só aparece se evento for Presencial/Híbrido)

---

## 7. Features Sugeridas (backlog do épico)

| ID | Nome da Feature | Descrição breve |
|----|-----------------|-----------------|
| F1.1 | Formulário de Solicitação de Evento | Formulário completo com todos os campos do briefing (dados do solicitante, informações do evento, logística, infraestrutura, paciente modelo, orçamento) e validações obrigatórias |
| F1.2 | Workflow de Aprovação | Sistema de status com transições controladas (Rascunho → Enviado → Em Revisão → Aprovado/Reprovado → Publicado) e regras de transição por perfil |
| F1.3 | Comunicação entre Vendas e Marketing | Sistema de comentários internos dentro da solicitação, visível apenas para Vendas e Marketing |
| F1.4 | Anexos de Documentos | Upload de até 5 arquivos (PDF, JPG, PNG) por solicitação |
| F1.5 | Notificações de Solicitação | E-mails automáticos para Marketing (nova solicitação) e Vendas (mudança de status) |
| F1.6 | Painel de Solicitações | Dashboard para Marketing visualizar todas as solicitações pendentes e histórico |

*As features acima serão detalhadas no Step 2 do workflow.*

---

## 8. Pré-condições / Dependências

- Sistema de autenticação e controle de acesso por perfis (EP-08) deve estar implementado
- Sistema de envio de e-mails transacionais (EP-06) deve estar funcional
- Definição dos campos finais do formulário com cliente (alguns campos estão marcados como [A DEFINIR] no briefing)
- Armazenamento de arquivos (storage) deve estar configurado para upload de anexos

---

## 9. Riscos

| Risco | Impacto | Mitigação |
|-------|--------|------------|
| Campos do formulário ainda não totalmente definidos pelo cliente | Alto | Realizar workshop de elicitação com cliente antes de iniciar desenvolvimento; criar formulário expansível para adicionar campos posteriormente |
| Vendas não aderir ao novo processo e continuar usando e-mail/planilhas | Alto | Treinamento obrigatório + processo antigo será desativado + gestão top-down para garantir adoção |
| Validações muito restritivas podem bloquear solicitações legítimas | Médio | Revisão das regras de validação com Vendas e Marketing; implementar validações progressivas (avisos antes de bloqueios) |
| Marketing não aprovar/reprovar solicitações em tempo hábil | Médio | Definir SLA de aprovação (48h) + notificações de lembrete + dashboard de solicitações pendentes |

---

## 10. Stakeholders

- **Vendas (Vendedor do Alur)** - Usuário principal que cria solicitações
- **Marketing** - Responsável por aprovar/reprovar solicitações e fornecer feedback
- **Organizador/Admin** - Supervisiona o processo e pode intervir em casos especiais
- **Produto e Tecnologia** - Responsáveis pelo desenvolvimento e manutenção

---

## 11. Métricas de Sucesso (sugestão)

- **Número de solicitações criadas por mês** (baseline de demanda)
- **Taxa de aprovação vs. reprovação** (indicador de qualidade das solicitações)
- **Tempo médio entre envio e aprovação/reprovação** (SLA de aprovação)
- **Número de interações (comentários) até aprovação** (indicador de clareza das solicitações)
- **Taxa de adoção** (% de solicitações feitas pelo sistema vs. outros canais)
- **NPS interno** de Vendas e Marketing sobre o processo

---

## 12. Observações

- Este épico é o ponto de entrada do fluxo completo da plataforma
- A qualidade das informações capturadas aqui impacta diretamente todos os épicos seguintes
- Recomenda-se priorizar este épico para MVP (será validado no Step 3 - WSJF)
- Formulário deve ser expansível para acomodar novos campos no futuro sem necessidade de refatoração

---

*Documento elaborado com base no template de Épico (Upstream/SAFe). Versão do template: 1.01.*
