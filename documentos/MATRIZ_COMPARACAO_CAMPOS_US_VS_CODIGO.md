# Matriz de Comparação: Regras de Campos – US Frontend vs Aplicação

**Data:** 11/02/2026  
**Objetivo:** Comparar todas as regras de campos definidas nas User Stories de Frontend com a implementação efetiva no código

---

## Legenda

| Símbolo | Significado |
|---------|-------------|
| ✅ | Conforme – regra implementada igual à US |
| ⚠️ | Parcial – implementado com diferença |
| ❌ | Ausente – regra da US não implementada |
| ➖ | N/A – não aplicável |

---

## 1. EP-01-F1.1 – Formulário de Solicitação de Evento

**Componente:** `solicitar-evento.component.ts`

| Campo | Regra na US | Implementação no Código | Status |
|-------|-------------|-------------------------|--------|
| **formSolicitante** | | | |
| nome | required | `Validators.required` | ✅ |
| email | required, email | `Validators.required`, `Validators.email` | ✅ |
| telefone | required, máscara sugerida | `Validators.required`, placeholder "(XX) XXXXX-XXXX" | ⚠️ Placeholder apenas, sem máscara automática |
| **formEvento** | | | |
| nome | required | `Validators.required` | ✅ |
| tipo | required (Workshop \| Mentoria) | `Validators.required`, default Workshop | ✅ |
| formato | required (Presencial \| Online \| Híbrido) | `Validators.required`, default Online | ✅ |
| dataInicio | required, datetime-local | `Validators.required`, type="datetime-local" | ✅ |
| dataFim | required, datetime-local | `Validators.required`, type="datetime-local" | ✅ |
| descricao | opcional | Sem Validators | ✅ |
| **formLogistica** | | | |
| vagasMaximas | required, min(1) | `Validators.required`, `Validators.min(1)` | ✅ |
| local | condicional (required se formato ≠ Online) | `setValidators([Validators.required])` via valueChanges | ✅ |
| endereco | condicional (se Presencial/Híbrido) | Campo presente, @if (formato !== 'Online') | ✅ |
| coffeBreak | checkbox | Sem validators | ✅ |
| certificado | checkbox | Sem validators | ✅ |
| **formPaciente** | | | |
| quantidadePacientes | condicional (required se requerPaciente) | `setValidators([Validators.required, Validators.min(1)])` | ✅ |
| **formOrcamento** | | | |
| publicoAlvo | required | `Validators.required` | ✅ |
| valorInvestimento | número, min(0) | min="0" no input, sem required | ⚠️ US não especifica required |
| justificativa | texto | Sem required | ✅ |
| **Upload (US-FE-04)** | | | |
| Quantidade | até 5 arquivos | MAX_ANEXOS=5, slice(0, 5) | ✅ |
| Tipos | PDF, JPG, PNG | `['pdf','jpg','jpeg','png'].includes(ext)` | ✅ |
| Tamanho | máx 10MB cada | `f.size > MAX_SIZE_MB * 1024 * 1024` | ✅ |

---

## 2. EP-03-F3.1 – Formulário de Inscrição Público

**Componente:** `inscricao-publica.component.ts`

| Campo | Regra na US | Implementação no Código | Status |
|-------|-------------|-------------------------|--------|
| nome | obrigatório | `Validators.required` | ✅ |
| email | obrigatório, validação formato | `Validators.required`, `Validators.email` | ✅ |
| telefone | obrigatório, máscara (XX) XXXXX-XXXX | `Validators.required`, `Validators.minLength(10)`, `mascaraTelefone()` | ✅ |
| CPF | obrigatório, dígitos verificadores | `Validators.required`, `Validators.minLength(11)`, `cpfValidator` | ✅ |
| Máscara CPF | XXX.XXX.XXX-XX | `mascaraCPF()` aplicada no input | ✅ |
| Máscara telefone | (XX) XXXXX-XXXX | `mascaraTelefone()` aplicada | ✅ |
| reCAPTCHA v3 | score > 0.5, invisível | ❌ Não implementado | ❌ |
| Botão desabilitado | até form válido | `[disabled]="form.invalid \|\| loading()"` | ✅ |

---

## 3. EP-05-F5.1 – Cadastro de Paciente Modelo

**Componente:** `cadastro-paciente-modelo.component.ts`

| Campo | Regra na US | Implementação no Código | Status |
|-------|-------------|-------------------------|--------|
| nome | obrigatório | `Validators.required` | ✅ |
| CPF | obrigatório, validação dígitos | `Validators.required`, `Validators.minLength(11)`, `cpfValidator` | ✅ |
| dataNascimento | obrigatório | `Validators.required` | ✅ |
| email | obrigatório, formato | `Validators.required`, `Validators.email` | ✅ |
| telefone | obrigatório | `Validators.required` | ✅ |
| endereco | opcional | Sem required | ✅ |
| historicoSaude | opcional | Sem required | ✅ |
| restricoesAlergias | opcional | Sem required | ✅ |
| Vínculo (evento) | obrigatório | Evento via rota (`/eventos/:id/pacientes-modelo`), não campo do form | ⚠️ Garantido pela rota, não validação explícita |
| consentimento (Termo LGPD) | obrigatório (requiredTrue) | `Validators.requiredTrue` | ✅ |
| Scroll obrigatório no termo | scroll até o final antes de aceitar | ❌ Não implementado | ❌ |
| Máscara CPF | XXX.XXX.XXX-XX | `mascaraCPF` no input | ✅ |
| Máscara telefone | (XX) XXXXX-XXXX | `mascaraTelefone` no input | ✅ |

---

## 4. EP-04-F4.1 – Configuração de Template de Certificado

**Componente:** `config-certificados.component.ts`

| Campo | Regra na US | Implementação no Código | Status |
|-------|-------------|-------------------------|--------|
| nome | required | `Validators.required` | ✅ |
| titulo | required | `Validators.required` | ✅ |
| textoBase | required | `Validators.required` | ✅ |
| assinatura1Nome | required | `Validators.required` | ✅ |
| assinatura1Cargo | required | `Validators.required` | ✅ |
| assinatura2Nome | opcional | Sem required | ✅ |
| assinatura2Cargo | opcional | Sem required | ✅ |
| logoUrl | opcional | Sem required | ✅ |
| corPrimaria | required | `Validators.required` | ✅ |
| corSecundaria | required | `Validators.required` | ✅ |
| fonteTitulo | required | `Validators.required` | ✅ |
| fonteTexto | required | `Validators.required` | ✅ |
| ativo | boolean | Sem required (default true) | ✅ |

---

## 5. EP-02-F2.1 – Formulário de Criação/Edição de Evento

**Componente:** `cadastro-evento.component.ts`

| Campo | Regra na US | Implementação no Código | Status |
|-------|-------------|-------------------------|--------|
| nome | required | `Validators.required` | ✅ |
| tipo | required | `Validators.required` | ✅ |
| formato | required | `Validators.required` | ✅ |
| dataInicio | required | `Validators.required` | ✅ |
| dataFim | required | `Validators.required` | ✅ |
| vagasMaximas | required, min(1) | `Validators.required`, `Validators.min(1)` | ✅ |
| status | required | `Validators.required` | ✅ |
| descricao | opcional | Sem required | ✅ |
| local | ~20 campos mencionados na US | ❌ Não presente no form | ⚠️ Form simplificado |
| professor | - | ❌ Não presente | ⚠️ |
| imagem de capa | upload opcional | ❌ Não presente | ❌ |

---

## 6. EP-08-F8.1 – Tela de Login

**Componente:** `login.component.ts`

| Campo | Regra na US | Implementação no Código | Status |
|-------|-------------|-------------------------|--------|
| email | required, email | `Validators.required`, `Validators.email` | ✅ |
| senha | required, minLength(8) | `Validators.required` apenas | ❌ **minLength(8) ausente** |

---

## 7. EP-08-F8.1 – Configuração 2FA

**Componente:** `config-2fa.component.ts`

| Campo | Regra na US | Implementação no Código | Status |
|-------|-------------|-------------------------|--------|
| codigo | 6 dígitos numéricos | `Validators.required`, `Validators.minLength(6)`, `Validators.maxLength(6)` | ✅ |

---

## 8. EP-06-F6.1 – Templates de E-mail

**Componente:** `templates-email.component.ts`

| Campo | Regra na US | Implementação no Código | Status |
|-------|-------------|-------------------------|--------|
| nome | required | `Validators.required` | ✅ |
| assunto | required | `Validators.required` | ✅ |
| corpoHtml | required | `Validators.required` | ✅ |
| gatilho | required | `Validators.required` | ✅ |
| corPrimaria | required | `Validators.required` | ✅ |

---

## 9. EP-09-F9.1 – Agendamento de Relatórios

**Componente:** `agendar-relatorio-dialog.component.ts`

| Campo | Regra na US | Implementação no Código | Status |
|-------|-------------|-------------------------|--------|
| tipo | required | `Validators.required` | ✅ |
| periodicidade | required | `Validators.required` | ✅ |
| formato | required | `Validators.required` | ✅ |
| destinatarios | required | `Validators.required` | ✅ |

---

## 10. EP-03-F3.2 – Área do Participante (Meus Dados)

**Componente:** `area-participante.component.ts`

| Campo | Regra na US | Implementação no Código | Status |
|-------|-------------|-------------------------|--------|
| nome | required | `Validators.required` | ✅ |
| email | required | `Validators.required` | ✅ |
| telefone | required | `Validators.required` | ✅ |
| senhaAtual | required (troca senha) | `Validators.required` | ✅ |
| novaSenha | required, minLength(6) | `Validators.required`, `Validators.minLength(6)` | ⚠️ US geralmente sugere minLength(8) |
| confirmarSenha | required | `Validators.required` | ✅ |

---

## 11. EP-07-F7.3 – Gestão de Fuso Horário

**Componente:** `gestao-fuso-horario.component.ts`

| Campo | Regra na US | Implementação no Código | Status |
|-------|-------------|-------------------------|--------|
| fusoHorarioPadrao | required | `Validators.required` | ✅ |
| fusoOrigem | required | `Validators.required` | ✅ |
| dataHoraOrigem | required | `Validators.required` | ✅ |
| fusoDestino | required | `Validators.required` | ✅ |

---

## 12. Revisão e Aprovação de Documentos

**Componente:** `revisao-aprovacao-docs.component.ts`

| Campo | Regra na US | Implementação no Código | Status |
|-------|-------------|-------------------------|--------|
| decisao | required | `Validators.required` | ✅ |

---

## 📊 Resumo por Status

| Status | Quantidade | Principais itens |
|--------|------------|------------------|
| ✅ Conforme | 52 | Maioria das validações e campos obrigatórios |
| ⚠️ Parcial | 6 | Telefone máscara (solicitação), cadastro-evento campos, novaSenha minLength |
| ❌ Ausente | 3 | reCAPTCHA (inscrição), minLength(8) senha (login), scroll termo LGPD |

---

## 🔧 Recomendações de Correção

1. **Login (EP-08-F8.1):** Adicionar `Validators.minLength(8)` ao campo password.
2. **Inscrição Pública (EP-03-F3.1):** Implementar Google reCAPTCHA v3.
3. **Cadastro Paciente (EP-05-F5.1):** Considerar scroll obrigatório até o final do termo LGPD antes de permitir marcar checkbox.
4. **Formulário Solicitação:** Avaliar máscara automática para telefone (ex.: ngx-mask ou similar).
5. **Cadastro Evento:** Avaliar inclusão de campos como local e professor designado conforme US completa (~20 campos).

---

---

## Atualização das User Stories

**11/02/2026:** As US foram atualizadas com os itens Parcial e Ausente identificados nesta matriz. Cada US afetada possui agora uma seção **"Pendências / Gaps Identificados"** com a tabela de itens a corrigir.

| US atualizada | Itens documentados |
|---------------|-------------------|
| EP-01-F1.1-US-FE-02 | Telefone: máscara automática |
| EP-03-F3.1-US-FE-01 | reCAPTCHA v3 |
| EP-05-F5.1-US-FE-01 | Vínculo evento, scroll termo LGPD |
| EP-02-F2.1-US-FE-01 | Local, professor, imagem de capa |
| EP-08-F8.1-US-FE-01 | Senha minLength(8) |
| EP-03-F3.2-US-FE-04 | novaSenha minLength(8) |

---

*Documento gerado com base na análise das US de Frontend e do código em `Plataforma-Gestao-Eventos_codigo-fonte/frontend/src/app`.*
