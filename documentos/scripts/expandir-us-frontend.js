/**
 * Script para expandir US de Frontend conforme template workflow_producao-MVP
 * Uso: node scripts/expandir-us-frontend.js
 * 
 * Expande arquivos que ainda estão no formato "Conteúdo (extraído da Feature)"
 * para o formato completo do template 01.01.01_EPIC_FEATURE_US_Frontend_Nome_Exemplo
 */

const fs = require('fs');
const path = require('path');

const FRONTEND_US_DIR = path.join(__dirname, '..', 'epicos', 'features', 'user-stories', 'frontend');
const EPIC_NAMES = {
  'EP-01': 'Gestão de Solicitações e Aprovação de Eventos',
  'EP-02': 'Gestão e Publicação de Eventos',
  'EP-03': 'Inscrições e Área do Participante',
  'EP-04': 'Sistema de Certificação',
  'EP-05': 'Documentos de Paciente',
  'EP-06': 'Templates e Comunicação por E-mail',
  'EP-07': 'Integração Outlook',
  'EP-08': 'Autenticação e Conformidade LGPD',
  'EP-09': 'Relatórios e Exportações',
};

function parseExistingUS(content) {
  const result = { id: '', title: '', como: '', quero: '', paraQue: '', relacionada: '', telas: '', feature: '', hasMinimalFormat: false };
  
  const idMatch = content.match(/\*\*ID\*\* \| ([^\n|]+)/);
  if (idMatch) result.id = idMatch[1].trim();
  else {
    const idFromTitle = content.match(/^# [^—]+— (.+)$/m);
    if (idFromTitle) result.title = idFromTitle[1].trim();
  }

  const titleMatch = content.match(/^# [^—\n]+[—–-] (.+)$/m);
  if (titleMatch) result.title = titleMatch[1].trim();

  const comoMatch = content.match(/\*\*Como\*\* \| ([^\n|]+)/);
  if (comoMatch) result.como = comoMatch[1].trim();

  const queroMatch = content.match(/\*\*Quero\*\* \| ([^\n|]+)/);
  if (queroMatch) result.quero = queroMatch[1].trim();

  const paraMatch = content.match(/\*\*Para que\*\* \| ([^\n|]+)/);
  if (paraMatch) result.paraQue = paraMatch[1].trim();

  const relMatch = content.match(/\*\*Relacionada a\*\* \| ([^\n|]+)/);
  if (relMatch) result.relacionada = relMatch[1].trim();

  const telasMatch = content.match(/\*\*Telas?[^:]*:\*\* ([^\n]+)/);
  if (telasMatch) result.telas = telasMatch[1].trim();

  const featureMatch = content.match(/\*\*Feature:\*\* (EP-\d+-F[\d.]+)/);
  if (featureMatch) result.feature = featureMatch[1].trim();

  result.hasMinimalFormat = content.includes('Conteúdo (extraído') || content.includes('## Conteúdo') && content.length < 800;
  
  if (!result.id && content.match(/EP-\d+-F[\d.]+-US-FE-\d+/)) {
    result.id = content.match(/EP-\d+-F[\d.]+-US-FE-\d+/)[0];
  }
  if (!result.feature && result.id) {
    result.feature = result.id.replace(/-US-FE-\d+$/, '');
  }
  
  const epMatch = result.id ? result.id.match(/^(EP-\d+)/) : result.feature?.match(/^(EP-\d+)/);
  result.epicId = epMatch ? epMatch[1] : '';
  result.epicName = EPIC_NAMES[result.epicId] || '';

  return result;
}

function getFeatureName(featureId) {
  const names = {
    'EP-01-F1.1': 'Formulário de Solicitação de Evento',
    'EP-01-F1.2': 'Workflow de Aprovação',
    'EP-01-F1.3': 'Comunicação Vendas-Marketing',
    'EP-02-F2.1': 'CRUD de Eventos',
    'EP-02-F2.2': 'Controle de Capacidade e Vagas',
    'EP-02-F2.3': 'Lista de Espera',
    'EP-02-F2.4': 'Check-in e Controle de Presença',
    'EP-04-F4.1': 'Geração de Certificados',
    'EP-04-F4.2': 'Envio Automático de Certificados',
    'EP-04-F4.3': 'Reenvio e Auditoria de Certificados',
    'EP-09-F9.1': 'Relatórios Operacionais',
    'EP-09-F9.2': 'Exportação de Dados',
    'EP-09-F9.3': 'Dashboard Gerencial',
  };
  return names[featureId] || featureId;
}

function generateExpandedUS(parsed, filename) {
  const featureName = getFeatureName(parsed.feature);
  return `# User Story – Frontend | ${parsed.title}

**Épico:** ${parsed.epicId} – ${parsed.epicName}  
**Feature:** ${parsed.feature} – ${featureName}  
**Produto:** Plataforma Web Unificada de Gestão de Eventos  
**Versão:** 2.01 (Template Expandido)  
**Data:** 11/02/2026  
**Escopo:** Frontend (telas, formulários, validações, feedback e acessibilidade)

---

## 1. Identificação

| Campo | Conteúdo |
|-------|----------|
| **ID da US** | ${parsed.id} |
| **Título** | ${parsed.title} |
| **Épico** | ${parsed.epicId} – ${parsed.epicName} |
| **Feature** | ${parsed.feature} – ${featureName} |
| **Produto / Iniciativa** | Plataforma Web Unificada de Gestão de Eventos |
| **Relacionada a (Backend)** | ${parsed.relacionada || '-'} |
| **Status** | Proposta |

---

## 2. User Story (Como / Quero / Para que)

| Campo | Conteúdo |
|-------|----------|
| **Como** | ${parsed.como || '-'} |
| **Quero** | ${parsed.quero || '-'} |
| **Para que** | ${parsed.paraQue || '-'} |

---

## 3. Descrição

Esta US de frontend cobre ${parsed.telas || 'a funcionalidade descrita'}.

**Contexto adicional:** Integra com as demais US da feature e com o backend indicado em Relacionada a.

---

## 4. Telas / Componentes

| Tela / Componente | Tipo | Descrição breve | Tamanho (P/M/G) |
|-------------------|------|-----------------|-----------------|
| Componente principal | Component | ${parsed.telas || 'A definir'} | M |

---

## 5. Fluxo de Tela (prévia)

### 5.1. Entrada
- **Navegação:** Rota correspondente ao recurso
- **Pré-condições:** Usuário autenticado, permissões adequadas

### 5.2. Ações do usuário
| Ação | Descrição | Resultado |
|------|-----------|-----------|
| (A definir conforme US) | - | - |

### 5.3. Chamadas ao backend
- **Endpoint(s):** (Conforme US-BE relacionada)
- **Método HTTP:** GET / POST / PUT / DELETE
- **Payload:** (Se aplicável)

### 5.4. Saída
- **Sucesso:** Feedback visual, atualização de dados
- **Erro:** Mensagem de erro ao usuário

---

## 6. Critérios de Aceite

**Funcionalidade:**
- [ ] Componente implementado conforme especificação
- [ ] Integração com backend funcional
- [ ] Validações aplicadas quando necessário

**Estados Visuais:**
- [ ] Loading state durante requisições
- [ ] Tratamento de erros com feedback

**Responsividade:**
- [ ] Layout responsivo (desktop, tablet, mobile)

**Acessibilidade:**
- [ ] Labels e aria-attributes conforme WCAG AA

---

## 7. Dependências e Observações

### Dependências:
- **API Backend:** ${parsed.relacionada || 'A definir'}
- **Bibliotecas:** Angular Material, ReactiveFormsModule (conforme necessário)
- **Serviços:** HttpClient, Router

### Observações:
- Detalhar interfaces e métodos na Seção 8 conforme refinamento da US.

---

## 8. Especificação Detalhada de Campos e Comportamentos

> **⚠️ SEÇÃO A COMPLETAR:** Refinar nesta seção conforme desenvolvimento da US.

### 8.1. Interfaces e Modelos TypeScript
(A definir)

### 8.2. Propriedades do Componente / Service
(A definir)

### 8.3. Métodos e Comportamentos Detalhados
(A definir)

### 8.4. Estados e Ciclo de Vida (quando aplicável)
(A definir)

### 8.5. Interações do Usuário
(A definir)

### 8.6. Estilos CSS/SCSS (quando aplicável)
(A definir)

### 8.7. Acessibilidade
(A definir)

### 8.8. Testes Unitários
(A definir)

---

## 9. Checklist Final de Qualidade

- [ ] Seções 1-8 preenchidas
- [ ] Dependências identificadas
- [ ] Critérios de aceite verificáveis

---

*Documento elaborado com base no Template de User Story Frontend V2.01. Plataforma Gestão de Eventos – 11/02/2026.*
`;
}

function main() {
  const files = fs.readdirSync(FRONTEND_US_DIR).filter(f => f.endsWith('.md'));
  const skipIds = ['EP-01-F1.1-US-FE-01', 'EP-01-F1.1-US-FE-02', 'EP-01-F1.1-US-FE-03', 'EP-01-F1.1-US-FE-04', 'EP-04-F4.1-US-FE-01'];
  let expanded = 0;

  for (const file of files) {
    const filepath = path.join(FRONTEND_US_DIR, file);
    let content = fs.readFileSync(filepath, 'utf8');
    
    const parsed = parseExistingUS(content);
    const usId = parsed.id || file.match(/(EP-\d+-F[\d.]+-US-FE-\d+)/)?.[1];
    
    if (skipIds.includes(usId)) {
      console.log(`Pulando ${file} (já expandido)`);
      continue;
    }

    if (parsed.hasMinimalFormat || content.length < 1200 && content.includes('Conteúdo')) {
      if (!parsed.id) parsed.id = usId || 'EP-XX-FX.X-US-FE-XX';
      if (!parsed.title) parsed.title = file.replace(/^[^_]+_([^.]+)\.md$/, '$1').replace(/_/g, ' ');
      if (!parsed.feature) parsed.feature = parsed.id.replace(/-US-FE-\d+$/, '');
      
      const epMatch = parsed.id.match(/^(EP-\d+)/);
      parsed.epicId = epMatch ? epMatch[1] : 'EP-XX';
      parsed.epicName = EPIC_NAMES[parsed.epicId] || '';

      const expandedContent = generateExpandedUS(parsed, file);
      fs.writeFileSync(filepath, expandedContent, 'utf8');
      console.log(`Expandido: ${file}`);
      expanded++;
    }
  }

  console.log(`\nTotal expandido: ${expanded} arquivos`);
}

main();
