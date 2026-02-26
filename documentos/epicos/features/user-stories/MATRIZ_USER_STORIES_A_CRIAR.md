# Matriz de User Stories – Documentos a Criar

**Produto:** Plataforma de Gestão de Eventos  
**Data:** 10/02/2026  
**Objetivo:** Identificar quais User Stories de **frontend (US-FE)** e **backend (US-BE)** ainda precisam ter **documento dedicado** (arquivo .md em `user-stories/frontend` ou `user-stories/backend`), com base no [INDEX_FEATURES_COMPLETO](../INDEX_FEATURES_COMPLETO.md) e nas features existentes.

> **Atualização (11/02/2026):** os documentos faltantes foram **gerados automaticamente** via `epicos/features/user-stories/scripts/generate_user_stories.py`.  
> **Status atual:** `user-stories/frontend` contém **76** arquivos (US-FE) e `user-stories/backend` contém **109** arquivos (US-BE) — cobertura **100%** (pendências = **0**).

---

## 1. Matriz Features × User Stories

Legenda: **Esperado** = quantidade definida no índice da feature | **Existente** = quantidade de arquivos .md na pasta `user-stories/frontend` ou `user-stories/backend`.

| Épico | Feature | Nome da Feature | US-FE (esp.\|exist.) | US-BE (esp.\|exist.) | US-FE a criar | US-BE a criar |
|-------|---------|-----------------|----------------------|----------------------|---------------|---------------|
| EP-01 | F1.1 | Formulário de Solicitação de Evento | 4 \| 0 | 4 \| 0 | 4 | 4 |
| EP-01 | F1.2 | Workflow de Aprovação | 3 \| 0 | 6 \| 0 | 3 | 6 |
| EP-01 | F1.3 | Comunicação Vendas e Marketing | 3 \| 0 | 4 \| 0 | 3 | 4 |
| EP-02 | F2.1 | CRUD de Eventos | 3 \| 0 | 5 \| 0 | 3 | 5 |
| EP-02 | F2.2 | Controle de Capacidade e Vagas | 3 \| 0 | 4 \| 0 | 3 | 4 |
| EP-02 | F2.3 | Lista de Espera | 4 \| 0 | 4 \| 0 | 4 | 4 |
| EP-02 | F2.4 | Check-in e Controle de Presença | 4 \| 0 | 5 \| 0 | 4 | 5 |
| EP-03 | F3.1 | Formulário de Inscrição Público | 3 \| 3 | 4 \| 4 | 0 | 0 |
| EP-03 | F3.2 | Área do Participante | 4 \| 0 | 5 \| 0 | 4 | 5 |
| EP-03 | F3.3 | Gestão de Participantes | 4 \| 0 | 5 \| 0 | 4 | 5 |
| EP-04 | F4.1 | Geração de Certificados | 3 \| 0 | 4 \| 0 | 3 | 4 |
| EP-04 | F4.2 | Envio Automático de Certificados | 1 \| 0 | 2 \| 0 | 1 | 2 |
| EP-04 | F4.3 | Reenvio e Auditoria de Certificados | 2 \| 0 | 3 \| 0 | 2 | 3 |
| EP-05 | F5.1 | Cadastro de Paciente Modelo | 2 \| 2 | 3 \| 3 | 0 | 0 |
| EP-05 | F5.2 | Documentos da Paciente (Anamnese e Termo) | 2 \| 0 | 3 \| 0 | 2 | 3 |
| EP-05 | F5.3 | Área do Professor (Upload de Fotos) | 2 \| 0 | 3 \| 0 | 2 | 3 |
| EP-05 | F5.4 | Workflow de Documentos | 2 \| 0 | 4 \| 0 | 2 | 4 |
| EP-06 | F6.1 | Templates de E-mail Configuráveis | 2 \| 0 | 2 \| 0 | 2 | 2 |
| EP-06 | F6.2 | Gatilhos Automáticos | 1 \| 1 | 3 \| 3 | 0 | 0 |
| EP-06 | F6.3 | Log e Auditoria de E-mails | 2 \| 0 | 4 \| 0 | 2 | 4 |
| EP-07 | F7.1 | Sincronização de Eventos (Outlook) | 2 \| 0 | 3 \| 0 | 2 | 3 |
| EP-07 | F7.2 | Atualização e Cancelamento (Outlook) | 1 \| 0 | 3 \| 0 | 1 | 3 |
| EP-07 | F7.3 | Gestão de Fusos Horários | 2 \| 0 | 2 \| 0 | 2 | 2 |
| EP-08 | F8.1 | Sistema de Autenticação | 2 \| 2 | 4 \| 4 | 0 | 0 |
| EP-08 | F8.2 | Controle de Acesso RBAC | 2 \| 2 | 3 \| 3 | 0 | 0 |
| EP-08 | F8.3 | Auditoria e Logs de Acesso | 2 \| 0 | 3 \| 0 | 2 | 3 |
| EP-08 | F8.4 | Conformidade LGPD | 4 \| 0 | 5 \| 0 | 4 | 5 |
| EP-09 | F9.1 | Relatórios Operacionais | 2 \| 0 | 2 \| 0 | 2 | 2 |
| EP-09 | F9.2 | Exportação de Dados | 2 \| 0 | 3 \| 0 | 2 | 3 |
| EP-09 | F9.3 | Dashboard Gerencial | 3 \| 0 | 4 \| 0 | 3 | 4 |
| **TOTAL** | **34** | | **76 \| 10** | **109 \| 17** | **66** | **92** |

**Resumo:** Existem **10 US-FE** e **17 US-BE** com documento dedicado. Faltam **66 US-FE** e **92 US-BE** para atingir a cobertura completa (um .md por user story).

---

## 2. User Stories de FRONTEND a criar (por feature)

Cada linha é um ID sugerido para o arquivo (ex.: `EP-01-F1.1-US-FE-01_Formulario_Multi_Secao.md`). O título do arquivo deve refletir o nome da US no documento da feature.

### EP-01 – Gestão de Solicitações e Aprovação de Eventos

| ID | Título sugerido (da feature) |
|----|------------------------------|
| EP-01-F1.1-US-FE-01 | Formulário Multi-Seção de Solicitação |
| EP-01-F1.1-US-FE-02 | Validações em Tempo Real |
| EP-01-F1.1-US-FE-03 | Campos Condicionais |
| EP-01-F1.1-US-FE-04 | Salvar Rascunho e Upload de Anexos |
| EP-01-F1.2-US-FE-01 | (consultar EP-01-F1.2_Workflow_Aprovacao_v1.01.md) |
| EP-01-F1.2-US-FE-02 | idem |
| EP-01-F1.2-US-FE-03 | idem |
| EP-01-F1.3-US-FE-01 | (consultar EP-01-F1.3_Comunicacao_Vendas_Marketing_v1.01.md) |
| EP-01-F1.3-US-FE-02 | idem |
| EP-01-F1.3-US-FE-03 | idem |

### EP-02 – Gestão e Publicação de Eventos

| ID | Título sugerido |
|----|------------------|
| EP-02-F2.1-US-FE-01 | Formulário de Criação/Edição de Evento |
| EP-02-F2.1-US-FE-02 | Criação Automática a partir de Solicitação Aprovada |
| EP-02-F2.1-US-FE-03 | Lista de Eventos e Ações (Visualizar/Editar/Duplicar/Arquivar) |
| EP-02-F2.2-US-FE-01 a 03 | (consultar EP-02-F2.2_Controle_Capacidade_Vagas_v1.01.md) |
| EP-02-F2.3-US-FE-01 a 04 | (consultar EP-02-F2.3_Lista_Espera_v1.01.md) |
| EP-02-F2.4-US-FE-01 a 04 | (consultar EP-02-F2.4_Check-in_Controle_Presenca_v1.01.md) |

### EP-03 – Sistema de Inscrições e Participantes

| ID | Título sugerido |
|----|------------------|
| ~~EP-03-F3.1-US-FE-01 a 03~~ | ✅ **Já existem** |
| EP-03-F3.2-US-FE-01 | Login e Dashboard do Participante |
| EP-03-F3.2-US-FE-02 a 04 | (consultar EP-03-F3.2_Area_Participante_v1.01.md) |
| EP-03-F3.3-US-FE-01 a 04 | (consultar EP-03-F3.3_Gestao_Participantes_v1.01.md) |

### EP-04 – Sistema de Certificação

| ID | Título sugerido |
|----|------------------|
| EP-04-F4.1-US-FE-01 a 03 | (consultar EP-04-F4.1_Geracao_Certificados_v1.01.md) |
| EP-04-F4.2-US-FE-01 | (consultar EP-04-F4.2_Envio_Automatico_Certificados_v1.01.md) |
| EP-04-F4.3-US-FE-01 a 02 | (consultar EP-04-F4.3_Reenvio_Auditoria_Certificados_v1.01.md) |

### EP-05 – Gestão de Pacientes Modelo

| ID | Título sugerido |
|----|------------------|
| ~~EP-05-F5.1-US-FE-01 a 02~~ | ✅ **Já existem** |
| EP-05-F5.2-US-FE-01 a 02 | (consultar EP-05-F5.2_Documentos_Paciente_v1.01.md) |
| EP-05-F5.3-US-FE-01 a 02 | (consultar EP-05-F5.3_Area_Professor_Upload_Fotos_v1.01.md) |
| EP-05-F5.4-US-FE-01 a 02 | (consultar EP-05-F5.4_Workflow_Documentos_v1.01.md) |

### EP-06 – Sistema de Comunicação Automatizada

| ID | Título sugerido |
|----|------------------|
| EP-06-F6.1-US-FE-01 | Editor de Templates |
| EP-06-F6.1-US-FE-02 | Customização de Identidade Visual |
| ~~EP-06-F6.2-US-FE-01~~ | ✅ **Já existe** (Configuração Gatilhos) |
| EP-06-F6.3-US-FE-01 a 02 | (consultar EP-06-F6.3_Log_Auditoria_Emails_v1.01.md) |

### EP-07 – Integração Microsoft Outlook Calendar

| ID | Título sugerido |
|----|------------------|
| EP-07-F7.1-US-FE-01 a 02 | (consultar EP-07-F7.1_Sincronizacao_Eventos_Outlook_v1.01.md) |
| EP-07-F7.2-US-FE-01 | (consultar EP-07-F7.2_Atualizacao_Cancelamento_Outlook_v1.01.md) |
| EP-07-F7.3-US-FE-01 a 02 | (consultar EP-07-F7.3_Gestao_Fusos_Horarios_v1.01.md) |

### EP-08 – Controle de Acesso e Segurança

| ID | Título sugerido |
|----|------------------|
| ~~EP-08-F8.1-US-FE-01 a 02~~ | ✅ **Já existem** |
| ~~EP-08-F8.2-US-FE-01 a 02~~ | ✅ **Já existem** |
| EP-08-F8.3-US-FE-01 | Interface de Consulta de Logs |
| EP-08-F8.3-US-FE-02 | Relatório de Compliance |
| EP-08-F8.4-US-FE-01 a 04 | (consultar EP-08-F8.4_Conformidade_LGPD_v1.01.md) |

### EP-09 – Relatórios e Exportações

| ID | Título sugerido |
|----|------------------|
| EP-09-F9.1-US-FE-01 a 02 | (consultar EP-09-F9.1_Relatorios_Operacionais_v1.01.md) |
| EP-09-F9.2-US-FE-01 a 02 | (consultar EP-09-F9.2_Exportacao_Dados_v1.01.md) |
| EP-09-F9.3-US-FE-01 a 03 | (consultar EP-09-F9.3_Dashboard_Gerencial_v1.01.md) |

---

## 3. User Stories de BACKEND a criar (por feature)

### EP-01

| ID | Título sugerido |
|----|------------------|
| EP-01-F1.1-US-BE-01 a 04 | (consultar EP-01-F1.1_Formulario_Solicitacao_Evento_v1.01.md) |
| EP-01-F1.2-US-BE-01 a 06 | (consultar EP-01-F1.2_Workflow_Aprovacao_v1.01.md) |
| EP-01-F1.3-US-BE-01 a 04 | (consultar EP-01-F1.3_Comunicacao_Vendas_Marketing_v1.01.md) |

### EP-02

| ID | Título sugerido |
|----|------------------|
| EP-02-F2.1-US-BE-01 a 05 | (consultar EP-02-F2.1_CRUD_Eventos_v1.01.md) |
| EP-02-F2.2-US-BE-01 a 04 | (consultar EP-02-F2.2_Controle_Capacidade_Vagas_v1.01.md) |
| EP-02-F2.3-US-BE-01 a 04 | (consultar EP-02-F2.3_Lista_Espera_v1.01.md) |
| EP-02-F2.4-US-BE-01 a 05 | (consultar EP-02-F2.4_Check-in_Controle_Presenca_v1.01.md) |

### EP-03

| ID | Título sugerido |
|----|------------------|
| ~~EP-03-F3.1-US-BE-01 a 04~~ | ✅ **Já existem** |
| EP-03-F3.2-US-BE-01 a 05 | (consultar EP-03-F3.2_Area_Participante_v1.01.md) |
| EP-03-F3.3-US-BE-01 a 05 | (consultar EP-03-F3.3_Gestao_Participantes_v1.01.md) |

### EP-04

| ID | Título sugerido |
|----|------------------|
| EP-04-F4.1-US-BE-01 a 04 | (consultar EP-04-F4.1_Geracao_Certificados_v1.01.md) |
| EP-04-F4.2-US-BE-01 a 02 | (consultar EP-04-F4.2_Envio_Automatico_Certificados_v1.01.md) |
| EP-04-F4.3-US-BE-01 a 03 | (consultar EP-04-F4.3_Reenvio_Auditoria_Certificados_v1.01.md) |

### EP-05

| ID | Título sugerido |
|----|------------------|
| ~~EP-05-F5.1-US-BE-01 a 03~~ | ✅ **Já existem** |
| EP-05-F5.2-US-BE-01 a 03 | (consultar EP-05-F5.2_Documentos_Paciente_v1.01.md) |
| EP-05-F5.3-US-BE-01 a 03 | (consultar EP-05-F5.3_Area_Professor_Upload_Fotos_v1.01.md) |
| EP-05-F5.4-US-BE-01 a 04 | (consultar EP-05-F5.4_Workflow_Documentos_v1.01.md) |

### EP-06

| ID | Título sugerido |
|----|------------------|
| EP-06-F6.1-US-BE-01 | Endpoint CRUD de Templates |
| EP-06-F6.1-US-BE-02 | Endpoint de Preview e Teste |
| ~~EP-06-F6.2-US-BE-01 a 03~~ | ✅ **Já existem** |
| EP-06-F6.3-US-BE-01 a 04 | (consultar EP-06-F6.3_Log_Auditoria_Emails_v1.01.md) |

### EP-07

| ID | Título sugerido |
|----|------------------|
| EP-07-F7.1-US-BE-01 a 03 | (consultar EP-07-F7.1_Sincronizacao_Eventos_Outlook_v1.01.md) |
| EP-07-F7.2-US-BE-01 a 03 | (consultar EP-07-F7.2_Atualizacao_Cancelamento_Outlook_v1.01.md) |
| EP-07-F7.3-US-BE-01 a 02 | (consultar EP-07-F7.3_Gestao_Fusos_Horarios_v1.01.md) |

### EP-08

| ID | Título sugerido |
|----|------------------|
| ~~EP-08-F8.1-US-BE-01 a 04~~ | ✅ **Já existem** |
| ~~EP-08-F8.2-US-BE-01 a 03~~ | ✅ **Já existem** |
| EP-08-F8.3-US-BE-01 | Sistema de Logging Automático |
| EP-08-F8.3-US-BE-02 | Endpoint de Consulta de Logs |
| EP-08-F8.3-US-BE-03 | Endpoint de Exportação de Logs |
| EP-08-F8.4-US-BE-01 a 05 | (consultar EP-08-F8.4_Conformidade_LGPD_v1.01.md) |

### EP-09

| ID | Título sugerido |
|----|------------------|
| EP-09-F9.1-US-BE-01 a 02 | (consultar EP-09-F9.1_Relatorios_Operacionais_v1.01.md) |
| EP-09-F9.2-US-BE-01 a 03 | (consultar EP-09-F9.2_Exportacao_Dados_v1.01.md) |
| EP-09-F9.3-US-BE-01 a 04 | (consultar EP-09-F9.3_Dashboard_Gerencial_v1.01.md) |

---

## 4. Lista plana – IDs de US a criar (para checklist)

### Frontend (66 US)

```
EP-01-F1.1-US-FE-01, EP-01-F1.1-US-FE-02, EP-01-F1.1-US-FE-03, EP-01-F1.1-US-FE-04
EP-01-F1.2-US-FE-01, EP-01-F1.2-US-FE-02, EP-01-F1.2-US-FE-03
EP-01-F1.3-US-FE-01, EP-01-F1.3-US-FE-02, EP-01-F1.3-US-FE-03
EP-02-F2.1-US-FE-01, EP-02-F2.1-US-FE-02, EP-02-F2.1-US-FE-03
EP-02-F2.2-US-FE-01, EP-02-F2.2-US-FE-02, EP-02-F2.2-US-FE-03
EP-02-F2.3-US-FE-01, EP-02-F2.3-US-FE-02, EP-02-F2.3-US-FE-03, EP-02-F2.3-US-FE-04
EP-02-F2.4-US-FE-01, EP-02-F2.4-US-FE-02, EP-02-F2.4-US-FE-03, EP-02-F2.4-US-FE-04
EP-03-F3.2-US-FE-01, EP-03-F3.2-US-FE-02, EP-03-F3.2-US-FE-03, EP-03-F3.2-US-FE-04
EP-03-F3.3-US-FE-01, EP-03-F3.3-US-FE-02, EP-03-F3.3-US-FE-03, EP-03-F3.3-US-FE-04
EP-04-F4.1-US-FE-01, EP-04-F4.1-US-FE-02, EP-04-F4.1-US-FE-03
EP-04-F4.2-US-FE-01
EP-04-F4.3-US-FE-01, EP-04-F4.3-US-FE-02
EP-05-F5.2-US-FE-01, EP-05-F5.2-US-FE-02
EP-05-F5.3-US-FE-01, EP-05-F5.3-US-FE-02
EP-05-F5.4-US-FE-01, EP-05-F5.4-US-FE-02
EP-06-F6.1-US-FE-01, EP-06-F6.1-US-FE-02
EP-06-F6.3-US-FE-01, EP-06-F6.3-US-FE-02
EP-07-F7.1-US-FE-01, EP-07-F7.1-US-FE-02
EP-07-F7.2-US-FE-01
EP-07-F7.3-US-FE-01, EP-07-F7.3-US-FE-02
EP-08-F8.3-US-FE-01, EP-08-F8.3-US-FE-02
EP-08-F8.4-US-FE-01, EP-08-F8.4-US-FE-02, EP-08-F8.4-US-FE-03, EP-08-F8.4-US-FE-04
EP-09-F9.1-US-FE-01, EP-09-F9.1-US-FE-02
EP-09-F9.2-US-FE-01, EP-09-F9.2-US-FE-02
EP-09-F9.3-US-FE-01, EP-09-F9.3-US-FE-02, EP-09-F9.3-US-FE-03
```

### Backend (92 US)

```
EP-01-F1.1-US-BE-01, EP-01-F1.1-US-BE-02, EP-01-F1.1-US-BE-03, EP-01-F1.1-US-BE-04
EP-01-F1.2-US-BE-01 a 06
EP-01-F1.3-US-BE-01 a 04
EP-02-F2.1-US-BE-01 a 05
EP-02-F2.2-US-BE-01 a 04
EP-02-F2.3-US-BE-01 a 04
EP-02-F2.4-US-BE-01 a 05
EP-03-F3.2-US-BE-01 a 05
EP-03-F3.3-US-BE-01 a 05
EP-04-F4.1-US-BE-01 a 04
EP-04-F4.2-US-BE-01, EP-04-F4.2-US-BE-02
EP-04-F4.3-US-BE-01 a 03
EP-05-F5.2-US-BE-01 a 03
EP-05-F5.3-US-BE-01 a 03
EP-05-F5.4-US-BE-01 a 04
EP-06-F6.1-US-BE-01, EP-06-F6.1-US-BE-02
EP-06-F6.3-US-BE-01 a 04
EP-07-F7.1-US-BE-01 a 03
EP-07-F7.2-US-BE-01 a 03
EP-07-F7.3-US-BE-01, EP-07-F7.3-US-BE-02
EP-08-F8.3-US-BE-01, EP-08-F8.3-US-BE-02, EP-08-F8.3-US-BE-03
EP-08-F8.4-US-BE-01 a 05
EP-09-F9.1-US-BE-01, EP-09-F9.1-US-BE-02
EP-09-F9.2-US-BE-01 a 03
EP-09-F9.3-US-BE-01 a 04
```

---

## 5. Referência – User Stories já existentes (documentos .md)

| Frontend (10) | Backend (17) |
|---------------|--------------|
| EP-03-F3.1-US-FE-01, 02, 03 | EP-03-F3.1-US-BE-01, 02, 03, 04 |
| EP-05-F5.1-US-FE-01, 02 | EP-05-F5.1-US-BE-01, 02, 03 |
| EP-06-F6.2-US-FE-01 | EP-06-F6.2-US-BE-01, 02, 03 |
| EP-08-F8.1-US-FE-01, 02 | EP-08-F8.1-US-BE-01, 02, 03, 04 |
| EP-08-F8.2-US-FE-01, 02 | EP-08-F8.2-US-BE-01, 02, 03 |

---

## 6. Status de implementação na aplicação (resumo)

Visão do que **já existe no código** (frontend + backend) versus as features. Útil para priorizar quais US documentar e implementar em seguida.

| Área | Implementado no código | Cobre as features / US |
|------|------------------------|-------------------------|
| **Frontend** | Login, Recuperar/Resetar senha, 2FA, Dashboard, Gestão de perfis, Config. gatilhos, Inscrição pública, Confirmação inscrição, Lista e cadastro de pacientes modelo (por evento) | EP-08 F8.1 (parcial), F8.2 (parcial), EP-06 F6.2 (parcial), EP-03 F3.1 (parcial), EP-05 F5.1 (parcial) |
| **Backend** | Auth (login, refresh, recuperar/resetar senha, 2FA status/habilitar/validar/desabilitar, me, logout), Usuários (GET list, GET :id, PUT :id/perfil) | EP-08 F8.1 (US-BE-01 a 04), F8.2 (US-BE-01 a 03) |

**Ainda não implementado (exemplos):** CRUD de eventos (EP-02 F2.1), Solicitações de evento (EP-01 F1.1, F1.2), Endpoints de inscrição/participantes (EP-03 F3.1 backend real), Motor de gatilhos e fila de e-mails (EP-06 F6.2), Certificados (EP-04), Outlook (EP-07), Relatórios (EP-09), Auditoria (EP-08 F8.3), LGPD (EP-08 F8.4), etc. A matriz acima lista **todas** as US que faltam como **documento**; a implementação pode seguir a priorização do roadmap (ex.: WSJF).

---

## 7. Observações

- **Fonte da matriz:** [INDEX_FEATURES_COMPLETO](../INDEX_FEATURES_COMPLETO.md) e contagem dos arquivos em `user-stories/frontend` e `user-stories/backend`.
- **Convenção de documentos:** Cada US pode ter um arquivo próprio no formato `EP-XX-FX.X-US-FE-0N_Nome_Descriptivo.md` ou `...-US-BE-0N_...`, seguindo o padrão dos já existentes (ex.: `EP-08-F8.1-US-FE-01_Tela_Login_Recuperacao_Senha.md`).
- **Conteúdo de cada US:** O detalhamento de cada US (Como/Quero/Para que, critérios, tamanho P/M/G) está nas features em `../EP-XX-FX.X_*.md`; ao criar o .md da US, extrair/copiar da seção "User Stories" do documento da feature correspondente.
- **Implementação vs documento:** Esta matriz trata da **existência do documento** da user story. A seção 6 resume o que já está implementado na aplicação; um gap detalhado (US ↔ tela/endpoint) pode ser feito em documento separado.

---

*Documento gerado para suporte ao backlog e à criação dos artefatos de US.*
