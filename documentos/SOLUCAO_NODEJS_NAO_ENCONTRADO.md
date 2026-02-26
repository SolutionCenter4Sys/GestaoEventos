# 🚨 SOLUÇÃO: Node.js Não Encontrado

**Erro:** `Node.js não encontrado!`  
**Status:** ✅ Solução Disponível

---

## 🔍 Diagnóstico

O erro indica que:
1. ❌ Node.js não está instalado, **OU**
2. ⚠️ Node.js está instalado mas não está no PATH do sistema

---

## 🎯 Solução Rápida

### **Passo 1: Execute o Diagnóstico Detalhado**

```batch
# Duplo clique no arquivo:
diagnostico-nodejs.bat
```

Este script vai:
- ✅ Verificar se Node.js está instalado
- ✅ Verificar se está no PATH
- ✅ Mostrar caminhos possíveis
- ✅ Oferecer abrir a página de download

---

## 📥 Solução 1: Instalar Node.js (Se Não Instalado)

### **Passo a Passo:**

**1. Baixar Node.js:**
```
🌐 Acesse: https://nodejs.org/
📦 Baixe: Versão LTS (20.x recomendado)
   - Clique no botão verde grande "LTS"
```

**2. Instalar:**
```
✅ Execute o instalador baixado
✅ IMPORTANTE: Marque "Add to PATH" (Adicionar ao PATH)
✅ Aceite todas as configurações padrões
✅ Aguarde a instalação completa (~5 minutos)
```

**3. Reiniciar:**
```
🔄 REINICIE o computador (obrigatório!)
   - Isso garante que o PATH seja atualizado
```

**4. Verificar:**
```batch
# Abra um NOVO terminal (cmd)
node --version
npm --version

# Deve exibir algo como:
# v20.11.0
# 10.2.4
```

**5. Executar o Frontend:**
```batch
cd "c:\Cursor_Codigo\Simulacao BMAD\Plataforma-Gestao-Eventos\Plataforma-Gestao-Eventos_codigo-fonte\frontend"

INICIAR-FRONTEND.bat
```

---

## 🔧 Solução 2: Adicionar ao PATH (Se Já Instalado)

Se o Node.js JÁ está instalado mas não funciona:

### **Método 1: Reinstalar (MAIS FÁCIL)**

```
1. Desinstale Node.js:
   - Win + I (Configurações)
   - Apps > Apps e recursos
   - Procure "Node.js"
   - Desinstalar

2. Baixe e instale novamente:
   - https://nodejs.org/
   - Marque "Add to PATH" ✅
   
3. Reinicie o computador
```

---

### **Método 2: Adicionar PATH Manualmente**

**Windows 11:**

```
1. Win + X, depois I (Configurações)

2. Sistema > Sobre > Configurações avançadas do sistema

3. Clique: "Variáveis de Ambiente"

4. Em "Variáveis do Sistema", selecione "Path"

5. Clique: "Editar"

6. Clique: "Novo"

7. Adicione (escolha o caminho correto):
   C:\Program Files\nodejs\
   
   OU
   
   C:\Program Files (x86)\nodejs\

8. Clique: OK, OK, OK

9. IMPORTANTE: Feche TODOS os terminais abertos

10. Abra um NOVO terminal (cmd)

11. Teste:
    node --version
```

---

**Windows 10:**

```
1. Win + Pause (ou Botão direito em "Este Computador" > Propriedades)

2. Clique: "Configurações avançadas do sistema"

3. Clique: "Variáveis de Ambiente"

4. Em "Variáveis do Sistema", selecione "Path"

5. Clique: "Editar"

6. Clique: "Novo"

7. Adicione:
   C:\Program Files\nodejs\

8. Clique: OK, OK, OK

9. FECHE todos os terminais

10. Abra um NOVO terminal

11. Teste:
    node --version
```

---

## 🧪 Verificação Final

Depois de instalar/configurar:

```batch
# 1. Execute o diagnóstico:
diagnostico-nodejs.bat

# Deve exibir:
# [OK] Node.js encontrado via WHERE
# [INFO] Versao: v20.11.0

# 2. Se [OK], execute o frontend:
INICIAR-FRONTEND.bat

# 3. Aguarde o navegador abrir (~30-60 segundos)
```

---

## 📊 Checklist de Validação

Marque conforme vai fazendo:

- [ ] Node.js baixado de https://nodejs.org/
- [ ] Instalador executado com "Add to PATH" marcado
- [ ] Computador reiniciado (obrigatório!)
- [ ] Novo terminal aberto (não reuse terminal antigo)
- [ ] `node --version` retorna versão (ex: v20.11.0)
- [ ] `npm --version` retorna versão (ex: 10.2.4)
- [ ] `diagnostico-nodejs.bat` exibe [OK]
- [ ] `INICIAR-FRONTEND.bat` funciona sem erros

---

## 🎬 Exemplo Completo: Primeira Instalação

### **Cenário: Node.js NUNCA foi instalado**

```batch
# === ANTES DA INSTALAÇÃO ===

C:\> node --version
'node' nao e reconhecido como um comando interno...

# === PASSO 1: DOWNLOAD ===
1. Abra: https://nodejs.org/
2. Clique: "Download Node.js (LTS)" - versão 20.x
3. Aguarde download: node-v20.11.0-x64.msi (~30MB)

# === PASSO 2: INSTALAÇÃO ===
4. Duplo clique no arquivo baixado
5. Próximo, Próximo...
6. ✅ IMPORTANTE: Tela "Tools for Native Modules"
   - Marque: "Automatically install the necessary tools"
   - Se não aparecer, tudo bem, continue
7. Install
8. Aguarde instalação (~5 minutos)
9. Finish

# === PASSO 3: REINICIAR ===
10. Reinicie o computador (OBRIGATÓRIO!)

# === PASSO 4: VERIFICAÇÃO ===
11. Abra um NOVO terminal (cmd):
    Win + R
    Digite: cmd
    Enter

12. Teste:
C:\> node --version
v20.11.0

C:\> npm --version
10.2.4

# === PASSO 5: RODAR FRONTEND ===
13. Navegue até a pasta:
C:\> cd "c:\Cursor_Codigo\Simulacao BMAD\Plataforma-Gestao-Eventos\Plataforma-Gestao-Eventos_codigo-fonte\frontend"

14. Execute:
C:\...\frontend> INICIAR-FRONTEND.bat

# === RESULTADO ESPERADO ===
[PASSO 1/4] Verificando Node.js...
[OK] Node.js v20.11.0 detectado

[PASSO 2/4] Verificando projeto Angular...
[OK] package.json encontrado

[PASSO 3/4] Verificando dependencias...
[INFO] Instalando dependencias... (aguarde 2-5 min)
[OK] Dependencias instaladas!

[PASSO 4/4] Verificando porta 4300...
[OK] Porta 4300 disponivel

[INICIANDO] Servidor Angular...
(navegador abre automaticamente)

✅ SUCESSO!
```

---

## 🆘 Ainda com Problemas?

### **Erro Persiste Após Instalação:**

```batch
# Execute este comando e me envie a saída completa:
diagnostico-nodejs.bat

# Também execute e me envie:
echo %PATH%
where node
node --version
```

---

### **Node.js Instalado mas WHERE não encontra:**

**Causa:** PATH não foi atualizado corretamente

**Solução:**
```batch
# 1. Abra PowerShell como Administrador:
Win + X > Terminal (Admin)

# 2. Execute:
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\Program Files\nodejs\", "Machine")

# 3. Feche TODOS os terminais

# 4. Abra novo terminal e teste:
node --version
```

---

## 📱 Contato para Suporte

Se nada funcionar, me envie:

1. ✅ Saída completa de: `diagnostico-nodejs.bat`
2. ✅ Screenshot do erro
3. ✅ Versão do Windows: `ver`
4. ✅ Resultado de: `where node`
5. ✅ Resultado de: `echo %PATH%`

---

## 💡 Dicas Extras

### **Versão Recomendada:**
```
✅ Node.js v20.x (LTS) - Mais estável
⚠️ Node.js v23.x (Current) - Mais recente, mas não recomendado para produção
```

### **Após Instalação:**
```
✅ Sempre use um NOVO terminal
✅ Feche terminais antigos antes
✅ Reinicie o computador se necessário
```

### **Verificação Rápida:**
```batch
node --version && npm --version
# Deve exibir DUAS versões
```

---

## 📚 Arquivos Auxiliares

Na pasta `frontend/`, você tem:

- **`diagnostico-nodejs.bat`** ⭐ NOVO!
  - Diagnóstico detalhado de Node.js
  - Verifica caminhos comuns
  - Oferece abrir página de download
  
- **`diagnostico.bat`**
  - Diagnóstico geral do ambiente
  
- **`INICIAR-FRONTEND.bat`**
  - Inicia o frontend (após Node.js instalado)

---

**Versão:** 1.0  
**Data:** 11/02/2026  
**Última Atualização:** Correção do erro "Node.js não encontrado"  
**Status:** ✅ SOLUÇÃO TESTADA
