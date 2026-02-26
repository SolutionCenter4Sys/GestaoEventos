# Épico – Gestão e Publicação de Eventos

**Produto:** Plataforma Web Unificada de Gestão de Eventos  
**Contexto:** MVP - Release 1.0  
**Versão:** 1.01  
**Data:** 10/02/2026  
**Release:** Release 1.0

---

## 1. Identificação

| Campo | Conteúdo |
|-------|----------|
| **Nome do Épico** | Gestão e Publicação de Eventos |
| **ID** | EP-02 |
| **Produto / Iniciativa** | Plataforma Web Unificada de Gestão de Eventos |
| **Release** | Release 1.0 |
| **Responsável (Proposta)** | Product Owner |
| **Status** | Proposta |

---

## 2. Resumo do Épico

Criar sistema completo de gerenciamento de eventos que permita ao Marketing e Organizador criar, editar, publicar e despublicar eventos, com controle de capacidade, lista de espera e registro de presença, transformando solicitações aprovadas em eventos operacionais.

---

## 3. Contexto / Problema de Negócio

- Após aprovação da solicitação, não existe sistema estruturado para criar e gerenciar o evento operacional
- Controle de vagas e capacidade é feito manualmente, gerando erros e sobrecarga
- Não há lista de espera automatizada quando eventos estão esgotados
- Controle de presença (check-in) é manual, sem rastreabilidade
- Falta visibilidade do status operacional dos eventos (planejado, em andamento, concluído, cancelado)

**Pergunta de negócio que este épico endereça:**  
*"Como transformar solicitações aprovadas em eventos operacionais gerenciáveis, com controle de capacidade, presença e ciclo de vida completo?"*

---

## 4. Proposta de Valor / Benefício

- **Para o usuário/cliente (Marketing/Organizador):** Ferramentas completas para gerenciar eventos de forma eficiente e profissional
- **Para a organização:** Controle operacional total sobre eventos, eliminando erros de sobrecarga e melhorando experiência do participante
- **Para o ecossistema:** Dados precisos sobre participação, presença e execução de eventos para análise e melhoria contínua

### 4.1 ROI (Retorno sobre o Investimento)

- **Investimento esperado:** 2 desenvolvedores fullstack por 4 semanas (CRUD, controle de vagas, check-in, integrações)
- **Retorno esperado:** 
  - Eliminação de erros de sobrecarga/overbooking (custo de reputação)
  - Redução de 90% no tempo de gestão operacional de eventos
  - Aumento de 30% na taxa de ocupação via lista de espera automatizada
  - Dados precisos de presença para emissão de certificados
- **Payback (retorno do investimento):** 2-3 meses após go-live
- **Métricas de valor (como medir o ROI):** 
  - Taxa de ocupação dos eventos (vagas preenchidas / vagas totais)
  - Taxa de conversão da lista de espera
  - Tempo gasto na gestão operacional de eventos
  - Taxa de presença real vs. inscritos
- **Premissas para o ROI:** 
  - Realização de pelo menos 10 eventos/mês
  - Adoção do check-in digital por participantes
  - Marketing utiliza lista de espera ativamente

---

## 5. Descrição Detalhada

Este épico cobre o **gerenciamento completo do ciclo de vida de eventos** que:

1. **CRUD de Eventos** - Criação (a partir de solicitação aprovada ou manual), edição completa de detalhes, duplicação de eventos, arquivamento/exclusão
2. **Publicação e Visibilidade** - Publicar evento (tornar visível para inscrições), despublicar (remover da lista pública), controle de visibilidade
3. **Controle de Capacidade** - Definição de vagas máximas, contagem automática de vagas disponíveis/ocupadas, bloqueio de inscrições quando lotado
4. **Lista de Espera** - Inscrição automática na lista quando evento lotado, notificação automática quando vaga é liberada, controle de prioridade
5. **Check-in e Presença** - Registro de presença via lista digital ou QR Code, relatório de presença em tempo real, marcação de ausentes

**Escopo in scope:**  
- CRUD completo de eventos (criar, editar, duplicar, arquivar, excluir)
- Criação automática de evento a partir de solicitação aprovada
- Publicação/despublicação de eventos
- Definição de capacidade máxima e contagem automática de vagas
- Lista de espera com notificação automática
- Sistema de check-in digital (lista ou QR Code)
- Painel de gestão de eventos (todos os eventos, filtros, status)
- Geração automática de página pública do evento

**Escopo out of scope (outros épicos):**  
- Formulário de inscrição público (EP-03)
- Gestão de participantes inscritos (EP-03)
- Envio de certificados (EP-04)
- Gestão de paciente modelo (EP-05)
- Sincronização com Outlook Calendar (EP-07)

---

## 6. Critérios de Aceite

- [ ] Marketing consegue criar evento manualmente ou a partir de solicitação aprovada
- [ ] Evento criado a partir de solicitação herda automaticamente todos os dados da solicitação
- [ ] É possível editar todos os campos do evento (nome, data, hora, local, descrição, professor, vagas)
- [ ] Publicação de evento torna-o visível na página pública de inscrições
- [ ] Despublicação remove evento da lista pública mas mantém dados no sistema
- [ ] Sistema bloqueia novas inscrições quando número de vagas é atingido
- [ ] Quando evento está lotado, botão de inscrição muda para "Entrar na lista de espera"
- [ ] Quando participante desiste ou vaga é liberada, primeiro da lista de espera recebe notificação automática
- [ ] Check-in pode ser feito via lista digital (marcar presença manualmente) ou QR Code escaneado pelo participante
- [ ] Relatório de presença mostra em tempo real quantos fizeram check-in
- [ ] Apenas participantes com presença registrada podem receber certificado

---

## 7. Features Sugeridas (backlog do épico)

| ID | Nome da Feature | Descrição breve |
|----|-----------------|-----------------|
| F2.1 | CRUD de Eventos | Criar, editar, duplicar, arquivar e excluir eventos; criação automática a partir de solicitação aprovada |
| F2.2 | Publicação de Eventos | Publicar/despublicar eventos, controle de visibilidade, geração automática de página pública |
| F2.3 | Controle de Capacidade e Vagas | Definição de vagas máximas, contagem automática de vagas disponíveis/ocupadas, bloqueio quando lotado |
| F2.4 | Lista de Espera | Inscrição na lista quando evento lotado, notificação automática quando vaga liberada, controle de prioridade |
| F2.5 | Check-in e Controle de Presença | Registro de presença via lista digital ou QR Code, relatório em tempo real, marcação de ausentes |
| F2.6 | Painel de Gestão de Eventos | Dashboard com todos os eventos, filtros por status/data/tipo, indicadores operacionais (taxa de ocupação, presença) |

*As features acima serão detalhadas no Step 2 do workflow.*

---

## 8. Pré-condições / Dependências

- EP-01 (Gestão de Solicitações) deve estar implementado para criação automática a partir de solicitação
- Sistema de autenticação e controle de acesso (EP-08) deve estar funcional
- Sistema de notificações por e-mail (EP-06) para lista de espera
- Armazenamento de dados estruturado (banco de dados) deve estar configurado

---

## 9. Riscos

| Risco | Impacto | Mitigação |
|-------|--------|------------|
| Sincronização de vagas pode ter race condition (dois usuários inscrevendo na última vaga simultaneamente) | Alto | Implementar controle transacional no backend com lock otimista; testes de carga |
| QR Code pode não funcionar em ambientes com internet instável | Médio | Check-in via lista digital como fallback; modo offline do QR Code |
| Lista de espera pode gerar frustração se notificações demorarem muito | Médio | Notificação instantânea via e-mail; prazo de 24h para confirmar vaga antes de passar para próximo |
| Exclusão de eventos pode causar perda de dados históricos | Médio | Implementar arquivamento ao invés de exclusão física; exclusão lógica com soft delete |

---

## 10. Stakeholders

- **Marketing** - Usuário principal que cria e publica eventos
- **Organizador/Admin** - Gerencia todos os eventos e supervisiona operação
- **Vendas** - Visualiza eventos criados a partir de suas solicitações
- **Professor** - Visualiza eventos aos quais foi designado (read-only neste épico)
- **Participantes** - Beneficiados pela lista de espera e check-in eficiente

---

## 11. Métricas de Sucesso (sugestão)

- **Número de eventos criados por mês** (volume operacional)
- **Taxa de ocupação média** (vagas preenchidas / vagas totais) - meta: >85%
- **Taxa de conversão da lista de espera** (pessoas da lista que se inscreveram)
- **Taxa de presença** (check-in / inscritos) - indicador de no-show
- **Tempo médio de criação de evento** (eficiência operacional)
- **Taxa de eventos publicados vs. criados** (eventos que chegam ao público)

---

## 12. Observações

- Este épico é crítico para operacionalização da plataforma
- A lista de espera é um diferencial competitivo importante para maximizar ocupação
- O check-in digital facilita a emissão automática de certificados (EP-04)
- Recomenda-se implementar soft delete para preservar histórico de eventos
- Página pública do evento deve ser SEO-friendly para divulgação

---

*Documento elaborado com base no template de Épico (Upstream/SAFe). Versão do template: 1.01.*
