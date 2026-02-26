# Épico – Sistema de Inscrições e Participantes

**Produto:** Plataforma Web Unificada de Gestão de Eventos  
**Contexto:** MVP - Release 1.0  
**Versão:** 1.01  
**Data:** 10/02/2026  
**Release:** Release 1.0

---

## 1. Identificação

| Campo | Conteúdo |
|-------|----------|
| **Nome do Épico** | Sistema de Inscrições e Participantes |
| **ID** | EP-03 |
| **Produto / Iniciativa** | Plataforma Web Unificada de Gestão de Eventos |
| **Release** | Release 1.0 |
| **Responsável (Proposta)** | Product Owner |
| **Status** | Proposta |

---

## 2. Resumo do Épico

Criar sistema público de inscrições que permita participantes se cadastrarem em eventos de forma simples e segura, com confirmação automática, área logada para acompanhamento e gestão completa de participantes pelo organizador.

---

## 3. Contexto / Problema de Negócio

- Inscrições são feitas manualmente ou por sistemas externos não integrados
- Participantes não têm visibilidade do status de sua inscrição
- Dados de participantes ficam dispersos e desorganizados
- Falta comunicação automática de confirmação de inscrição
- Organizador não tem visão centralizada de todos os participantes

**Pergunta de negócio que este épico endereça:**  
*"Como facilitar o processo de inscrição para participantes e centralizar a gestão de todos os inscritos?"*

---

## 4. Proposta de Valor / Benefício

- **Para o usuário/cliente (Participante):** Processo simples e rápido de inscrição com confirmação imediata
- **Para a organização (Marketing/Organizador):** Dados estruturados e centralizados de todos os participantes para gestão eficiente
- **Para o ecossistema:** Base de dados rica para relacionamento, marketing e análise de perfil de participantes

### 4.1 ROI (Retorno sobre o Investimento)

- **Investimento esperado:** 2 desenvolvedores fullstack por 3 semanas
- **Retorno esperado:** 
  - Redução de 95% no tempo de cadastro manual de participantes
  - Eliminação de erros de digitação em dados de participantes
  - Aumento de 40% na conversão de inscrições por facilidade do processo
  - Base de dados para marketing de relacionamento (e-mail marketing)
- **Payback:** Imediato pela eliminação de processos manuais
- **Métricas de valor:** 
  - Taxa de conversão (visualizações da página / inscrições)
  - Tempo médio de preenchimento do formulário
  - Taxa de abandono do formulário
  - Número de inscrições por evento

---

## 5. Descrição Detalhada

Este épico cobre o **fluxo completo de inscrição de participantes** que:

1. **Formulário Público de Inscrição** - Formulário web acessível via link único do evento, campos customizáveis, validações obrigatórias (CPF, e-mail)
2. **Área do Participante** - Portal logado onde participante visualiza seus eventos, dados cadastrais, certificados futuros
3. **Gestão de Participantes (Admin)** - Painel para organizador visualizar, editar, importar, exportar participantes
4. **Confirmação Automática** - E-mail automático de confirmação de inscrição com detalhes do evento

**Escopo in scope:**  
- Formulário público de inscrição com validações
- Cadastro automático de participantes
- Confirmação por e-mail
- Área logada do participante
- Painel de gestão de participantes (visualizar, editar, buscar, filtrar)
- Importação de participantes via CSV
- Exportação de lista de participantes

**Escopo out of scope (outros épicos):**  
- Certificados (EP-04)
- Check-in/presença (EP-02)
- Lista de espera (EP-02)
- Pagamento/e-commerce (fora do escopo MVP)

---

## 6. Critérios de Aceite

- [ ] Formulário de inscrição não permite envio com campos obrigatórios vazios
- [ ] Validação de CPF (formato válido) funciona corretamente
- [ ] Validação de e-mail (formato válido e único por evento) funciona
- [ ] Participante recebe e-mail de confirmação em até 1 minuto após inscrição
- [ ] E-mail de confirmação contém todos os detalhes do evento (nome, data, hora, local)
- [ ] Participante consegue fazer login na área do participante com e-mail e senha
- [ ] Área do participante mostra todos os eventos em que está inscrito
- [ ] Organizador consegue editar dados de qualquer participante
- [ ] Importação via CSV valida formato e não permite duplicatas
- [ ] Exportação gera arquivo CSV com todos os campos

---

## 7. Features Sugeridas (backlog do épico)

| ID | Nome da Feature | Descrição breve |
|----|-----------------|-----------------|
| F3.1 | Formulário de Inscrição Público | Formulário web responsivo com validações de CPF, e-mail, telefone e campos obrigatórios |
| F3.2 | Área do Participante | Portal logado onde participante visualiza eventos, dados cadastrais e certificados |
| F3.3 | Gestão de Participantes | Painel administrativo para visualizar, editar, buscar, filtrar, importar e exportar participantes |
| F3.4 | Confirmação Automática de Inscrição | E-mail automático enviado imediatamente após inscrição com detalhes do evento |

---

## 8. Pré-condições / Dependências

- EP-02 (Gestão de Eventos) deve estar implementado
- Sistema de e-mails transacionais (EP-06) deve estar funcional
- Sistema de autenticação (EP-08) para área do participante

---

## 9. Riscos

| Risco | Impacto | Mitigação |
|-------|--------|------------|
| Bots ou spam no formulário de inscrição | Médio | Implementar CAPTCHA ou honeypot; validação de e-mail via link de confirmação |
| Participantes esquecem senha da área logada | Médio | Implementar recuperação de senha via e-mail; opção de login social (Google) |
| Dados pessoais sensíveis (CPF) | Alto | Criptografia em repouso; conformidade com LGPD (EP-08) |

---

## 10. Stakeholders

- **Participantes** - Usuários principais que se inscrevem em eventos
- **Marketing/Organizador** - Gerenciam participantes e analisam dados
- **Vendas** - Interessados em dados de participantes para relacionamento

---

## 11. Métricas de Sucesso

- **Número de inscrições por evento** (taxa de conversão)
- **Taxa de abandono do formulário** (% que iniciam mas não concluem)
- **Tempo médio de preenchimento** (usabilidade)
- **Taxa de confirmação de e-mail** (deliverability)
- **Taxa de retorno à área do participante** (engajamento)

---

*Documento elaborado com base no template de Épico (Upstream/SAFe). Versão do template: 1.01.*
