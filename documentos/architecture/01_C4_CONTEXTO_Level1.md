# Diagrama de Contexto (C4 - Nível 1) - Plataforma de Gestão de Eventos

**Versão**: 1.0 (Engenharia Reversa)
**Data**: 18/02/2026
**Nível C4**: 1 - Context
**Pergunta respondida**: "Quem usa o sistema e com o que ele se integra?"

---

## Visão Geral

A Plataforma de Gestão de Eventos é um sistema corporativo que permite a gestão completa do ciclo de vida de eventos educacionais/clínicos: desde a solicitação por equipes de Vendas, aprovação pelo Marketing, publicação, inscrições públicas, check-in com QR Code, gestão de pacientes modelo, até a emissão de certificados. O sistema integra-se com o Microsoft Outlook Calendar para sincronização de agenda e com serviço de e-mail para comunicação automatizada.

---

## Diagrama de Contexto

```mermaid
graph TB
    classDef userClass fill:#81C784,stroke:#388E3C,stroke-width:2px,color:#1B5E20
    classDef systemClass fill:#64B5F6,stroke:#1976D2,stroke-width:4px,color:#0D47A1
    classDef externalClass fill:#BA68C8,stroke:#7B1FA2,stroke-width:2px,color:#4A148C

    subgraph "Usuarios Internos"
        U1["ADMIN<br/>Gestao completa do sistema"]
        U2["MARKETING<br/>Aprova solicitacoes, gerencia eventos"]
        U3["VENDAS<br/>Solicita eventos"]
        U4["PROFESSOR<br/>Leciona eventos, fotos antes/depois"]
    end

    subgraph "Usuarios Externos"
        U5["PARTICIPANTE<br/>Inscreve-se e participa de eventos"]
        U6["PACIENTE_MODELO<br/>Paciente voluntario em eventos clinicos"]
    end

    S["PLATAFORMA DE GESTAO DE EVENTOS<br/>Angular 17 + NestJS 10 + PostgreSQL"]

    subgraph "Sistemas Externos"
        E1["Microsoft Outlook Calendar<br/>REST API - Microsoft Graph"]
        E2["Servico de E-mail<br/>SMTP"]
        E3["Supabase<br/>PostgreSQL Managed + RLS"]
    end

    U1 -->|"Administra usuarios, perfis, LGPD, auditoria"| S
    U2 -->|"Aprova solicitacoes, publica eventos, configura certificados"| S
    U3 -->|"Solicita novos eventos"| S
    U4 -->|"Gerencia pacientes modelo, fotos, area do professor"| S
    U5 -->|"Inscreve-se, faz check-in, baixa certificado"| S
    U6 -->|"Cadastra-se como paciente modelo, assina termos"| S

    S -->|"Sincroniza eventos no calendario"| E1
    S -->|"Envia e-mails automatizados: confirmacao, lembrete, certificado"| E2
    S -->|"Persiste dados com Row Level Security"| E3

    class U1,U2,U3,U4,U5,U6 userClass
    class S systemClass
    class E1,E2,E3 externalClass
```

---

## Personas (Usuarios)

| Persona | Perfil | Papel Principal | Acesso |
|---------|--------|-----------------|--------|
| Administrador | ADMIN | Gestao completa: usuarios, perfis, LGPD, auditoria, configuracoes | Web (todas as telas) |
| Marketing | MARKETING | Aprova solicitacoes, publica eventos, configura certificados e templates de e-mail | Web (eventos, solicitacoes, config) |
| Vendas | VENDAS | Solicita novos eventos com justificativa e publico-alvo | Web (solicitacoes, dashboard) |
| Professor | PROFESSOR | Leciona eventos, gerencia pacientes modelo, registra fotos antes/depois | Web (area professor, documentos) |
| Participante | PARTICIPANTE | Inscreve-se em eventos publicos, faz check-in via QR Code, baixa certificados | Web (inscricao publica, area participante) |
| Paciente Modelo | PACIENTE_MODELO | Voluntario em eventos clinicos, assina termos de consentimento | Web (dados pessoais, privacidade) |

## Sistemas Externos

| Sistema | Protocolo | Finalidade | Criticidade |
|---------|-----------|------------|-------------|
| Microsoft Outlook Calendar | REST API (Microsoft Graph) | Sincronizacao bidirecional de eventos com calendario corporativo | Media |
| Servico de E-mail | SMTP | Envio automatizado: confirmacao de inscricao, lembretes, certificados, recuperacao de senha | Alta |
| Supabase | PostgreSQL Protocol (TCP/5432) | Banco de dados managed com Row Level Security e backups automaticos | Critica |

---

*Documento gerado por engenharia reversa - C4 Model Level 1*
