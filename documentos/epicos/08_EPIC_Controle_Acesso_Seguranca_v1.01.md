# Épico – Controle de Acesso e Segurança

**Produto:** Plataforma Web Unificada de Gestão de Eventos  
**Contexto:** MVP - Release 1.0  
**Versão:** 1.01  
**Data:** 10/02/2026  
**Release:** Release 1.0

---

## 1. Identificação

| Campo | Conteúdo |
|-------|----------|
| **Nome do Épico** | Controle de Acesso e Segurança |
| **ID** | EP-08 |
| **Produto / Iniciativa** | Plataforma Web Unificada de Gestão de Eventos |
| **Release** | Release 1.0 |
| **Responsável (Proposta)** | Product Owner |
| **Status** | Proposta |

---

## 2. Resumo do Épico

Implementar sistema robusto de autenticação, controle de acesso baseado em perfis (RBAC), auditoria completa de ações críticas e conformidade com LGPD para garantir segurança, privacidade e rastreabilidade em todos os níveis da plataforma.

---

## 3. Contexto / Problema de Negócio

- Plataforma contém dados sensíveis (saúde, CPF, dados pessoais) que precisam ser protegidos
- Diferentes perfis (Organizador, Marketing, Vendas, Professor, Participante, Paciente Modelo) têm necessidades de acesso distintas
- Não existe rastreabilidade de quem acessa ou modifica dados sensíveis
- LGPD exige conformidade obrigatória para operação legal

**Pergunta de negócio que este épico endereça:**  
*"Como garantir segurança, privacidade e conformidade legal dos dados da plataforma, com controle de acesso granular e auditoria completa?"*

---

## 4. Proposta de Valor / Benefício

- **Para o usuário/cliente:** Proteção de dados pessoais e sensíveis
- **Para a organização:** Conformidade legal, redução de riscos, auditoria completa
- **Para o ecossistema:** Confiança na plataforma, reputação, proteção contra vazamentos

### 4.1 ROI (Retorno sobre o Investimento)

- **Investimento esperado:** 2 desenvolvedores fullstack por 3 semanas + consultoria jurídica LGPD
- **Retorno esperado:** 
  - Conformidade legal obrigatória (evita multas de até 2% do faturamento)
  - Redução de risco de vazamento de dados
  - Auditoria completa para proteção legal
- **Payback:** Imediato (obrigação legal)
- **Métricas de valor:** 
  - Conformidade com LGPD (checklist completo)
  - Zero incidentes de segurança
  - Auditoria funcional

---

## 5. Descrição Detalhada

Este épico cobre o **sistema completo de segurança e conformidade** que:

1. **Autenticação Segura** - Login com e-mail e senha (bcrypt), recuperação de senha, 2FA opcional para Admin/Professor
2. **Controle de Acesso (RBAC)** - Perfis com permissões granulares (Organizador, Marketing, Vendas, Professor, Participante, Paciente Modelo)
3. **Auditoria e Logs** - Registro de ações críticas (criar/editar/excluir, acesso a dados sensíveis, exportações)
4. **Conformidade LGPD** - Consentimento explícito, direito ao esquecimento, portabilidade de dados, criptografia de dados sensíveis

**Escopo in scope:**  
- Sistema de autenticação (login, logout, recuperação de senha)
- Controle de acesso baseado em perfis (RBAC) conforme matriz do briefing
- Permissões granulares por módulo e por registro (ownership)
- 2FA opcional (TOTP) para Admin e Professor
- Criptografia de senhas (bcrypt)
- Criptografia de dados sensíveis (dados de saúde, CPF) em repouso
- HTTPS obrigatório (TLS 1.2+)
- Auditoria de ações críticas (trilha completa)
- Termo de consentimento LGPD
- Direito ao esquecimento (exclusão ou anonimização)
- Portabilidade de dados (exportação completa)
- Política de privacidade e termos de uso

**Escopo out of scope:**  
- Autenticação via OAuth (Google, Microsoft) - pode ser feature futura
- Certificação ISO 27001 (pode ser objetivo futuro)

---

## 6. Critérios de Aceite

- [ ] Sistema de login funciona corretamente com e-mail e senha
- [ ] Senhas são armazenadas criptografadas (bcrypt)
- [ ] Recuperação de senha via e-mail funciona
- [ ] 2FA opcional funciona para Admin e Professor
- [ ] Cada perfil visualiza e acessa apenas o permitido pela matriz de permissões
- [ ] Vendedor visualiza apenas suas próprias solicitações
- [ ] Professor visualiza apenas eventos aos quais foi designado
- [ ] Dados de saúde da paciente modelo são criptografados
- [ ] Todas as comunicações são via HTTPS
- [ ] Auditoria registra: usuário, data/hora, ação, registro afetado
- [ ] Usuário pode solicitar exclusão de dados (direito ao esquecimento)
- [ ] Usuário pode exportar todos os seus dados (portabilidade)
- [ ] Termo de consentimento LGPD é apresentado e registrado

---

## 7. Features Sugeridas (backlog do épico)

| ID | Nome da Feature | Descrição breve |
|----|-----------------|-----------------|
| F8.1 | Sistema de Autenticação | Login, logout, recuperação de senha, 2FA opcional |
| F8.2 | Controle de Acesso por Perfis (RBAC) | Matriz de permissões granulares por perfil e por registro (ownership) |
| F8.3 | Auditoria e Logs de Acesso | Registro completo de ações críticas (criar/editar/excluir, acesso a dados sensíveis) |
| F8.4 | Conformidade LGPD | Consentimento, direito ao esquecimento, portabilidade, criptografia, política de privacidade |

---

## 8. Pré-condições / Dependências

- Este épico é pré-requisito de todos os outros épicos
- Consultoria jurídica para validar conformidade LGPD
- Certificado SSL/TLS válido para HTTPS

---

## 9. Riscos

| Risco | Impacto | Mitigação |
|-------|--------|------------|
| Vazamento de dados sensíveis | Crítico | Criptografia, auditoria, testes de segurança (pentest), backups |
| Não conformidade com LGPD | Crítico | Consultoria jurídica, checklist de conformidade, auditoria externa |
| Ataques de força bruta no login | Alto | Rate limiting, bloqueio após N tentativas, CAPTCHA |
| SQL Injection, XSS, CSRF | Alto | Uso de ORM, sanitização de inputs, tokens CSRF, headers de segurança |

---

## 10. Stakeholders

- **Todos os perfis** - Protegidos pelo sistema de segurança
- **Organizador/Admin** - Gerencia usuários e permissões
- **Jurídico** - Valida conformidade LGPD

---

## 11. Métricas de Sucesso

- **Zero incidentes de segurança**
- **Conformidade LGPD: 100%** (checklist completo)
- **Taxa de sucesso de auditoria** (logs funcionais)
- **Tempo de resposta a solicitações LGPD** (<48h)

---

## 12. Observações

- **Crítico:** Este épico é obrigação legal. Não conformidade com LGPD pode gerar multas de até 2% do faturamento.
- Recomenda-se pentest (teste de invasão) antes de go-live
- Auditoria deve ser imutável (append-only log)
- Considerar seguro cyber para proteção adicional

---

*Documento elaborado com base no template de Épico (Upstream/SAFe). Versão do template: 1.01.*
