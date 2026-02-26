# ⚡ Quick Start Guide - 5 Minutos

**Objetivo:** Rodar o frontend e testar os novos componentes em 5 minutos.

---

## 🚀 Passo 1: Abrir PowerShell (30 segundos)

1. Pressione `Win + X`
2. Clique em "Windows PowerShell" ou "Terminal"

---

## 📂 Passo 2: Executar o Script

### **OPÇÃO 1: Duplo Clique (MAIS FÁCIL)** ⭐

1. Abra o Windows Explorer (Win + E)
2. Cole este caminho na barra de endereço:
   ```
   c:\Cursor_Codigo\Simulacao BMAD\Plataforma-Gestao-Eventos\Plataforma-Gestao-Eventos_codigo-fonte\frontend
   ```
3. Localize o arquivo: **`INICIAR-FRONTEND.bat`**
4. **Duplo clique** no arquivo
5. Aguarde o navegador abrir automaticamente

---

### **OPÇÃO 2: Terminal (Porta Customizada)**

1. Abra PowerShell ou CMD
2. Cole e execute:

```powershell
cd "c:\Cursor_Codigo\Simulacao BMAD\Plataforma-Gestao-Eventos\Plataforma-Gestao-Eventos_codigo-fonte\frontend"

# Porta padrão (4300)
.\rodar-frontend.bat

# Ou porta customizada
.\rodar-frontend.bat 5000
```

---

**Aguarde:** O script irá:
- ✅ Verificar Node.js
- ✅ Verificar se a porta está disponível
- ✅ Instalar dependências (primeira vez)
- ✅ Iniciar servidor
- ✅ Abrir navegador automaticamente

**Tempo:** 30-60 segundos (primeira vez pode demorar mais)

---

## 🔐 Passo 3: Fazer Login (15 segundos)

**O navegador abrirá automaticamente em:**
```
http://localhost:4300
```
(Ou a porta que você escolheu)

**Credenciais:**
```
Email: admin@eventos.com
Senha: 123456 (ou qualquer senha)
```

Clique em **"Entrar"**

---

## 🎯 Passo 4: Testar Componentes Novos (3 minutos)

### **4.1. Documentos de Paciente** (1 min)

No menu lateral, clique em **"Documentos"** > **"Dashboard de Completude"**

**URL:** `http://localhost:4300/dashboard-completude`

✅ **Verificar:**
- KPIs exibidos (Total, Completo, Aguardando, Pendente)
- Gráfico de completude
- Lista de pendências
- Filtros funcionando

---

### **4.2. Integração Outlook** (1 min)

No menu lateral, clique em **"Integração Outlook"** > **"Painel de Sincronização"**

**URL:** `http://localhost:4300/painel-sincronizacao`

✅ **Verificar:**
- Indicador de status (animação de pulse)
- KPIs de sincronização
- Countdown para próxima sync
- Histórico de sincronizações
- Botão "Sincronizar Agora"

---

### **4.3. Auditoria** (1 min)

No menu lateral, clique em **"Auditoria e Logs"** > **"Logs de Acesso"**

**URL:** `http://localhost:4300/logs-acesso`

✅ **Verificar:**
- **Tab 1:** Logs de Acesso
  - KPIs (Total Acessos, Usuários, Sucessos, Falhas)
  - Tabela de logs com IP e localização
  - Filtros funcionando
  
- **Tab 2:** Compliance LGPD
  - Métricas de consentimentos
  - Status de compliance
  - Ações recomendadas

---

## 🎨 Passo 5: Validar Design (30 segundos)

### **Verificar em QUALQUER tela:**

✅ **Cores Alur:**
- Azul primário: `#2c5aa0`
- Turquesa secundário: `#00a3a3`
- Verde sucesso, Laranja warning, Vermelho erro

✅ **Componentes:**
- Cards com sombra
- Botões com cores temáticas
- Ícones Material Design
- Chips coloridos para status
- Tabelas bem formatadas

✅ **Layout:**
- Menu lateral expandível
- Header com logo
- Conteúdo centralizado
- Responsivo

---

## ✅ Checklist Rápido

### **Login:**
- [ ] Tela de login carregou
- [ ] Login funcionou com qualquer senha
- [ ] Redirecionou para dashboard

### **Menu:**
- [ ] Menu lateral carregado
- [ ] Itens "Documentos", "Integração Outlook", "Auditoria" visíveis
- [ ] Submenus expandem ao clicar

### **Componentes:**
- [ ] Dashboard Completude: KPIs exibidos
- [ ] Painel Sincronização: Animação funcionando
- [ ] Logs de Acesso: Tabela carregada

### **Design:**
- [ ] Cores Alur aplicadas
- [ ] Layout responsivo
- [ ] Ícones corretos

---

## 🎯 URLs Diretas

Cole no navegador para acesso direto (substitua 4300 pela sua porta):

### **Documentos:**
```
http://localhost:4300/anamnese-termo-paciente
http://localhost:4300/dashboard-completude
http://localhost:4300/area-professor
```

### **Outlook:**
```
http://localhost:4300/configuracao-outlook
http://localhost:4300/painel-sincronizacao
http://localhost:4300/gestao-fuso-horario
```

### **Auditoria:**
```
http://localhost:4300/auditoria-certificados
http://localhost:4300/auditoria-emails
http://localhost:4300/logs-acesso
```

---

## 🐛 Problemas Comuns

### **Erro: "npm não reconhecido"**
**Solução:** Instale Node.js em https://nodejs.org/

### **Erro: "porta em uso"**
**Solução:** O script `rodar-frontend.bat` detecta automaticamente e oferece 3 opções:
1. Encerrar processo na porta
2. Usar outra porta
3. Cancelar

Ou use porta customizada:
```batch
rodar-frontend.bat 5000
```

### **Warnings no build**
Os warnings `NG8011` são **NORMAIS** e não afetam o funcionamento! ✅
Veja `SOBRE_WARNINGS.md` para detalhes.

### **Tela branca após login**
**Solução:**
1. Abra DevTools (F12)
2. Verifique erros no Console
3. Recarregue a página (Ctrl + F5)

---

## 📊 Próximos Passos

Após validar rapidamente, consulte:

1. **`GUIA_VALIDACAO_FASE3.md`** - Testes detalhados (60-90 min)
2. **`MOCK_API_ENDPOINTS.md`** - Todos os endpoints disponíveis
3. **`RELATORIO_FINAL_FASE3_100_COMPLETA.md`** - Relatório técnico completo

---

## 🎉 Parabéns!

Você testou com sucesso os **12 novos componentes** da Fase 3!

**Total de componentes funcionando:** 31  
**Status do MVP:** ✅ 100% Completo

---

**Dúvidas?** Consulte o `README.md` principal ou a documentação completa.

**Tempo Total:** ~5 minutos ⚡
