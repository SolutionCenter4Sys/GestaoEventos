# Arquitetura de Épicos - Plataforma de Gestão de Eventos

## Visão Geral

Esta visualização mostra a arquitetura dos 9 épicos e suas dependências.

---

## Camada 1: Fundação (Obrigatória)

```
┌─────────────────────────────────────────────────────────────┐
│  EP-08: Controle de Acesso e Segurança                      │
│  • Autenticação                                             │
│  • RBAC (Perfis e Permissões)                               │
│  • LGPD e Criptografia                                      │
│  • Auditoria                                                │
└─────────────────────────────────────────────────────────────┘
                           ▲
                           │
              TODOS OS ÉPICOS DEPENDEM DESTE
```

---

## Camada 2: Core da Plataforma (Alta Prioridade)

```
┌─────────────────────────┐        ┌──────────────────────────┐
│  EP-01: Solicitações    │───────>│  EP-02: Gestão de        │
│  • Formulário           │        │  Eventos                 │
│  • Workflow Aprovação   │        │  • CRUD Eventos          │
│  • Comunicação Interna  │        │  • Publicação            │
└─────────────────────────┘        │  • Controle de Vagas     │
                                   │  • Lista de Espera       │
                                   │  • Check-in              │
                                   └──────────────────────────┘
                                              │
                                              ├──────────────────┐
                                              ▼                  ▼
                          ┌──────────────────────────┐   ┌──────────────────┐
                          │  EP-03: Inscrições e     │   │  EP-05: Pacientes│
                          │  Participantes           │   │  Modelo          │
                          │  • Formulário Público    │   │  • Cadastro      │
                          │  • Área Participante     │   │  • Documentos    │
                          │  • Gestão Admin          │   │  • Área Professor│
                          └──────────────────────────┘   └──────────────────┘
                                    │                              │
                                    └──────────┬───────────────────┘
                                               ▼
                                   ┌──────────────────────────┐
                                   │  EP-04: Certificação     │
                                   │  • Geração Automática    │
                                   │  • Envio por E-mail      │
                                   │  • Reenvio e Auditoria   │
                                   └──────────────────────────┘
```

---

## Camada 3: Comunicação (Transversal)

```
┌─────────────────────────────────────────────────────────────┐
│  EP-06: Sistema de Comunicação Automatizada                 │
│  • Templates de E-mail                                       │
│  • Gatilhos Automáticos                                     │
│  • Log de Envios                                             │
│                                                              │
│  USADO POR: EP-01, EP-02, EP-03, EP-04, EP-05               │
└─────────────────────────────────────────────────────────────┘
```

---

## Camada 4: Integrações (Produtividade)

```
┌──────────────────────────────────────┐
│  EP-07: Outlook Calendar             │
│  • Sincronização de Eventos          │
│  • Atualização Automática            │
│  • Gestão de Fusos Horários          │
│                                      │
│  INTEGRA COM: EP-02 (Gestão Eventos) │
└──────────────────────────────────────┘
```

---

## Camada 5: Análise (Business Intelligence)

```
┌─────────────────────────────────────────────────────────────┐
│  EP-09: Relatórios e Exportações                            │
│  • Relatórios Operacionais                                  │
│  • Dashboard Gerencial                                      │
│  • Exportação CSV/PDF                                       │
│                                                              │
│  CONSOME DADOS DE: TODOS OS ÉPICOS                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Fluxo de Dados Principal

```
1. VENDAS           2. MARKETING        3. PÚBLICO         4. EXECUÇÃO         5. PÓS-EVENTO
   │                   │                   │                  │                   │
   ▼                   ▼                   ▼                  ▼                   ▼
┌──────┐          ┌──────┐           ┌──────┐          ┌──────┐            ┌──────┐
│EP-01 │─────────>│EP-02 │──────────>│EP-03 │          │EP-05 │            │EP-04 │
│Solici│          │Gestão│           │Inscr.│          │Pacien│            │Certif│
│tação │          │Event │           │      │          │te    │            │      │
└──────┘          └──────┘           └──────┘          └──────┘            └──────┘
   │                   │                   │                  │                   │
   └───────────────────┴───────────────────┴──────────────────┴───────────────────┘
                                    │
                                    ▼
                            ┌──────────────┐
                            │   EP-06      │
                            │ Comunicação  │◄── E-mails transacionais
                            └──────────────┘    em todos os momentos
                                    │
                                    ▼
                            ┌──────────────┐
                            │   EP-09      │
                            │ Relatórios   │◄── Análise e decisão
                            └──────────────┘
```

---

## Matriz de Dependências

| Épico | Depende de | É Usado por |
|-------|-----------|-------------|
| EP-01 | EP-08, EP-06 | EP-02 |
| EP-02 | EP-01, EP-08, EP-06 | EP-03, EP-04, EP-05, EP-07, EP-09 |
| EP-03 | EP-02, EP-08, EP-06 | EP-04, EP-09 |
| EP-04 | EP-02, EP-03, EP-06, EP-08 | EP-09 |
| EP-05 | EP-02, EP-08, EP-06 | EP-09 |
| EP-06 | EP-08 | EP-01, EP-02, EP-03, EP-04, EP-05 |
| EP-07 | EP-02, EP-08 | - |
| EP-08 | - | TODOS |
| EP-09 | TODOS | - |

---

## Ordem de Implementação Recomendada (MVP)

### Sprint 0-1: Fundação
1. **EP-08** - Controle de Acesso e Segurança (2-3 semanas)
2. **EP-06** - Sistema de Comunicação (2 semanas)

### Sprint 2-3: Core do Negócio
3. **EP-01** - Gestão de Solicitações (3 semanas)
4. **EP-02** - Gestão de Eventos (4 semanas)

### Sprint 4-5: Interface Pública
5. **EP-03** - Inscrições e Participantes (3 semanas)
6. **EP-05** - Pacientes Modelo (3 semanas)

### Sprint 6: Automação e Valor
7. **EP-04** - Certificação (2 semanas)

### Sprint 7: Integrações (Opcional MVP)
8. **EP-07** - Outlook Calendar (2 semanas)

### Sprint 8: Análise (Pós-MVP)
9. **EP-09** - Relatórios (2 semanas)

---

## Priorização Inicial (WSJF será feito no Step 3)

### 🔴 Críticos (MVP Mínimo)
- EP-08: Segurança e LGPD (obrigatório legal)
- EP-01: Solicitações (ponto de entrada)
- EP-02: Gestão de Eventos (core da plataforma)
- EP-03: Inscrições (interface pública)
- EP-06: Comunicação (transversal)

### 🟡 Importantes (MVP Completo)
- EP-04: Certificação (agregação de valor)
- EP-05: Pacientes Modelo (diferencial competitivo)

### 🟢 Desejáveis (Pós-MVP)
- EP-07: Outlook Calendar (produtividade interna)
- EP-09: Relatórios (análise e decisão)

---

## Estimativa de Esforço

| Épico | Story Points | Semanas (3 devs) | Complexidade |
|-------|-------------|------------------|--------------|
| EP-01 | 34 | 3 | Média |
| EP-02 | 55 | 4 | Alta |
| EP-03 | 34 | 3 | Média |
| EP-04 | 21 | 2 | Baixa |
| EP-05 | 34 | 3 | Alta (LGPD) |
| EP-06 | 21 | 2 | Média |
| EP-07 | 21 | 2 | Média |
| EP-08 | 34 | 3 | Alta (Segurança) |
| EP-09 | 21 | 2 | Baixa |
| **TOTAL** | **275** | **24 semanas** | - |

**Nota:** Com 3 desenvolvedores trabalhando em paralelo, estima-se **12-16 semanas** para MVP completo.

---

*Documento gerado no Step 1 - Geração de Épicos*  
*Data: 10/02/2026*
