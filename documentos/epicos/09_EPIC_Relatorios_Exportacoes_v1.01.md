# Épico – Relatórios e Exportações

**Produto:** Plataforma Web Unificada de Gestão de Eventos  
**Contexto:** MVP - Release 1.0  
**Versão:** 1.01  
**Data:** 10/02/2026  
**Release:** Release 1.0

---

## 1. Identificação

| Campo | Conteúdo |
|-------|----------|
| **Nome do Épico** | Relatórios e Exportações |
| **ID** | EP-09 |
| **Produto / Iniciativa** | Plataforma Web Unificada de Gestão de Eventos |
| **Release** | Release 1.0 |
| **Responsável (Proposta)** | Product Owner |
| **Status** | Proposta |

---

## 2. Resumo do Épico

Criar sistema de relatórios operacionais e gerenciais com exportação em múltiplos formatos (CSV, PDF) e dashboard com indicadores-chave para apoiar tomada de decisão e análise de performance dos eventos.

---

## 3. Contexto / Problema de Negócio

- Não existe visibilidade consolidada de métricas de eventos (ocupação, presença, conversão)
- Dados precisam ser exportados manualmente para análise externa
- Falta dashboard gerencial para acompanhamento de indicadores
- Relatórios operacionais (lista de presença, inscritos, certificados) são gerados manualmente

**Pergunta de negócio que este épico endereça:**  
*"Como fornecer visibilidade e análise de dados dos eventos para apoiar decisões estratégicas e operacionais?"*

---

## 4. Proposta de Valor / Benefício

- **Para o usuário/cliente (Marketing/Organizador):** Visibilidade de performance e indicadores em tempo real
- **Para a organização:** Decisões baseadas em dados, identificação de oportunidades de melhoria
- **Para o ecossistema:** Análise de tendências, ROI de eventos, otimização contínua

### 4.1 ROI (Retorno sobre o Investimento)

- **Investimento esperado:** 1 desenvolvedor fullstack por 2 semanas
- **Retorno esperado:** 
  - Decisões mais assertivas baseadas em dados
  - Identificação de gargalos e oportunidades
  - Otimização de performance de eventos
- **Payback:** 3-6 meses
- **Métricas de valor:** 
  - Melhoria de indicadores (taxa de ocupação, presença) após análise
  - Redução de tempo gasto em geração manual de relatórios

---

## 5. Descrição Detalhada

Este épico cobre o **sistema completo de relatórios e análise** que:

1. **Relatórios Operacionais** - Lista de presença, inscritos, status de documentos, certificados enviados
2. **Exportação de Dados** - Exportação de relatórios em CSV e PDF
3. **Dashboard Gerencial** - Indicadores-chave (taxa de ocupação, taxa de presença, conversão, demanda por tipo de evento)

**Escopo in scope:**  
- Relatórios operacionais:
  - Lista de presença (com status check-in)
  - Lista de inscritos por evento
  - Status de documentos de pacientes modelo
  - Certificados enviados
  - Solicitações de eventos (por status, por vendedor)
- Exportação em CSV e PDF
- Dashboard gerencial com:
  - Taxa média de ocupação
  - Taxa média de presença (no-show)
  - Conversão de inscrições
  - Demanda por tipo de evento
  - Eventos por status
- Filtros por período, tipo de evento, status

**Escopo out of scope:**  
- BI avançado (Power BI, Tableau)
- Relatórios customizados pelo usuário
- Análise preditiva (machine learning)

---

## 6. Critérios de Aceite

- [ ] Organizador consegue gerar lista de presença em PDF
- [ ] Lista de inscritos pode ser exportada em CSV
- [ ] Relatório de status de documentos mostra pacientes com documentação pendente
- [ ] Relatório de certificados mostra quem recebeu e quando
- [ ] Dashboard gerencial atualiza em tempo real
- [ ] Filtros por período funcionam corretamente
- [ ] Exportações geram arquivos válidos e completos

---

## 7. Features Sugeridas (backlog do épico)

| ID | Nome da Feature | Descrição breve |
|----|-----------------|-----------------|
| F9.1 | Relatórios Operacionais | Lista de presença, inscritos, status de documentos, certificados enviados |
| F9.2 | Exportação de Dados | Exportação de relatórios em CSV e PDF |
| F9.3 | Dashboard Gerencial | Indicadores-chave (ocupação, presença, conversão, demanda) com filtros |

---

## 8. Pré-condições / Dependências

- Todos os épicos anteriores devem estar implementados (fontes de dados)
- Dados devem estar estruturados para consultas eficientes

---

## 9. Riscos

| Risco | Impacto | Mitigação |
|-------|--------|------------|
| Consultas complexas podem impactar performance | Médio | Otimização de queries, índices no banco, cache |
| Exportações grandes podem travar o navegador | Médio | Processamento assíncrono, geração no backend |

---

## 10. Stakeholders

- **Marketing/Organizador** - Usuários principais de relatórios e dashboard
- **Vendas** - Interessados em relatórios de demanda
- **Direção** - Usa dashboard para decisões estratégicas

---

## 11. Métricas de Sucesso

- **Uso de relatórios** (relatórios gerados por semana)
- **Tempo de geração** (<30 segundos)
- **Satisfação com insights** (NPS)

---

*Documento elaborado com base no template de Épico (Upstream/SAFe). Versão do template: 1.01.*
