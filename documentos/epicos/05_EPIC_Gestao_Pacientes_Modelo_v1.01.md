# Épico – Gestão de Pacientes Modelo

**Produto:** Plataforma Web Unificada de Gestão de Eventos  
**Contexto:** MVP - Release 1.0  
**Versão:** 1.01  
**Data:** 10/02/2026  
**Release:** Release 1.0

---

## 1. Identificação

| Campo | Conteúdo |
|-------|----------|
| **Nome do Épico** | Gestão de Pacientes Modelo |
| **ID** | EP-05 |
| **Produto / Iniciativa** | Plataforma Web Unificada de Gestão de Eventos |
| **Release** | Release 1.0 |
| **Responsável (Proposta)** | Product Owner |
| **Status** | Proposta |

---

## 2. Resumo do Épico

Criar sistema completo de gestão de pacientes modelo para workshops hands-on, incluindo cadastro de dados pessoais e de saúde, documentação obrigatória (anamnese e termo de imagem), workflow automático de coleta de documentos e área do professor para upload de fotos antes/depois.

---

## 3. Contexto / Problema de Negócio

- Dados de pacientes modelo são coletados manualmente sem estrutura
- Documentos legais (anamnese, termo de imagem) são impressos, assinados fisicamente e arquivados sem digitalização
- Professor precisa enviar fotos antes/depois por WhatsApp ou e-mail
- Não há rastreabilidade do status dos documentos (pendente, recebido, aprovado)
- Dados sensíveis de saúde não são armazenados de forma segura e em conformidade com LGPD

**Pergunta de negócio que este épico endereça:**  
*"Como digitalizar e automatizar a gestão de pacientes modelo, garantindo conformidade legal e segurança de dados sensíveis?"*

---

## 4. Proposta de Valor / Benefício

- **Para o usuário/cliente (Paciente Modelo):** Processo digital simples para fornecer dados e assinar documentos
- **Para a organização (Professor/Organizador):** Gestão centralizada, segura e rastreável de pacientes modelo
- **Para o ecossistema:** Conformidade total com LGPD para dados de saúde, reduzindo riscos legais

### 4.1 ROI (Retorno sobre o Investimento)

- **Investimento esperado:** 2 desenvolvedores fullstack por 3 semanas
- **Retorno esperado:** 
  - Eliminação de 100% do processo manual de coleta de documentos
  - Redução de risco legal por conformidade com LGPD
  - Organização e rastreabilidade de fotos antes/depois para fins de marketing
- **Payback:** Imediato pela redução de risco legal
- **Métricas de valor:** 
  - Taxa de conclusão de documentos (% pacientes com documentação completa)
  - Tempo médio de coleta de documentos
  - Redução de custos com impressão e arquivamento físico

---

## 5. Descrição Detalhada

Este épico cobre o **sistema completo de gestão de pacientes modelo** que:

1. **Cadastro de Paciente Modelo** - Formulário completo com dados pessoais, contato, histórico de saúde, vínculo a evento específico
2. **Documentos Obrigatórios** - Ficha de anamnese e termo de autorização de uso de imagem gerados automaticamente
3. **Workflow de Documentos** - Envio automático por e-mail, coleta online (assinatura eletrônica ou upload), rastreamento de status, lembretes automáticos
4. **Área do Professor** - Portal logado onde professor faz upload de fotos antes/depois vinculadas ao evento

**Escopo in scope:**  
- Cadastro de paciente modelo (dados pessoais e saúde)
- Vínculo de paciente modelo a evento específico
- Geração automática de ficha de anamnese
- Geração automática de termo de autorização de uso de imagem
- Envio automático de documentos por e-mail
- Coleta online de documentos (assinatura eletrônica simples ou upload de PDF assinado)
- Rastreamento de status dos documentos
- Lembretes automáticos para documentos pendentes
- Área do professor para upload de fotos antes/depois
- Controle de acesso restrito a dados sensíveis

**Escopo out of scope:**  
- Assinatura eletrônica avançada (ICP-Brasil)
- Anonimização automática de fotos (pode ser feature futura)
- Histórico médico completo (EHR)

---

## 6. Critérios de Aceite

- [ ] Organizador consegue cadastrar paciente modelo com todos os campos obrigatórios
- [ ] Paciente modelo é vinculada a evento específico
- [ ] Ficha de anamnese é gerada automaticamente e enviada por e-mail
- [ ] Termo de imagem é gerado automaticamente e enviado por e-mail
- [ ] Paciente modelo consegue preencher anamnese online ou fazer upload de PDF
- [ ] Paciente modelo consegue assinar termo de imagem online ou fazer upload de PDF assinado
- [ ] Status dos documentos é atualizado automaticamente (pendente → enviado → recebido → aprovado)
- [ ] Lembrete automático é enviado se documentos ficarem pendentes por mais de 7 dias
- [ ] Professor consegue fazer login e visualizar apenas eventos aos quais foi designado
- [ ] Professor consegue fazer upload de fotos antes/depois (JPEG, PNG, até 5MB cada)
- [ ] Fotos são associadas automaticamente ao evento e à paciente modelo
- [ ] Apenas Organizador, Admin e Professor designado conseguem acessar dados da paciente modelo
- [ ] Dados de saúde são criptografados em repouso

---

## 7. Features Sugeridas (backlog do épico)

| ID | Nome da Feature | Descrição breve |
|----|-----------------|-----------------|
| F5.1 | Cadastro de Paciente Modelo | Formulário completo com dados pessoais, contato e histórico de saúde, vínculo a evento |
| F5.2 | Geração de Documentos Obrigatórios | Ficha de anamnese e termo de imagem gerados automaticamente a partir de templates |
| F5.3 | Workflow de Coleta de Documentos | Envio por e-mail, coleta online, rastreamento de status, lembretes automáticos |
| F5.4 | Área do Professor | Portal logado para professor fazer upload de fotos antes/depois vinculadas ao evento |
| F5.5 | Controle de Acesso a Dados Sensíveis | Acesso restrito apenas a perfis autorizados, criptografia de dados de saúde |

---

## 8. Pré-condições / Dependências

- EP-02 (Gestão de Eventos) deve estar implementado
- EP-06 (Sistema de e-mails) para envio de documentos e lembretes
- EP-08 (Controle de Acesso e LGPD) para segurança de dados sensíveis
- Templates de anamnese e termo de imagem devem ser fornecidos pelo cliente

---

## 9. Riscos

| Risco | Impacto | Mitigação |
|-------|--------|------------|
| Dados de saúde são extremamente sensíveis (LGPD) | Alto | Criptografia em repouso e trânsito; acesso restrito; auditoria completa; termo de consentimento explícito |
| Paciente modelo não preenche documentos a tempo | Médio | Lembretes automáticos; prazo mínimo de 10 dias antes do evento |
| Templates de documentos fornecidos pelo cliente atrasarem | Médio | Criar templates provisórios para desenvolvimento |
| Fotos antes/depois podem conter dados sensíveis (rosto) | Médio | Implementar watermark com aviso; feature de anonimização facial (futuro) |

---

## 10. Stakeholders

- **Paciente Modelo** - Fornece dados e assina documentos
- **Professor** - Faz upload de fotos antes/depois
- **Organizador/Admin** - Gerencia pacientes modelo e documentos
- **Marketing** - Usa fotos para divulgação (com autorização)

---

## 11. Métricas de Sucesso

- **Taxa de conclusão de documentos** (% pacientes com documentação completa antes do evento)
- **Tempo médio de coleta de documentos** (da solicitação até recebimento)
- **Taxa de conversão de lembretes** (% que preenchem após lembrete)
- **Número de fotos antes/depois por evento** (riqueza de conteúdo)

---

## 12. Observações

- **Crítico:** Este épico envolve dados sensíveis de saúde. Conformidade com LGPD é obrigatória.
- Recomenda-se consultoria jurídica para validar templates de anamnese e termo de imagem
- Assinatura eletrônica simples (nome + checkbox) é válida juridicamente, mas considerar ICP-Brasil no futuro
- Fotos antes/depois são asset valioso para marketing, mas requerem consentimento explícito

---

*Documento elaborado com base no template de Épico (Upstream/SAFe). Versão do template: 1.01.*
