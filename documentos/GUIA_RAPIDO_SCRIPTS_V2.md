# 🚀 GUIA RÁPIDO - Scripts Atualizados v2.0

**Problema corrigido:** Script não fecha mais sozinho! ✅

---

## 🎯 Como Usar Agora

### **Método 1: Mais Simples (Recomendado)**

```
1. Abra a pasta: frontend\
2. Duplo clique em: INICIAR-FRONTEND.bat
3. Aguarde (~30-60 segundos)
4. Navegador abre automaticamente
```

**URL:** `http://localhost:4300`  
**Login:** `admin@eventos.com` / `123456`

---

### **Método 2: Se Houver Problemas**

```
1. Duplo clique em: diagnostico.bat
2. Leia o relatório completo
3. Corrija os problemas (se houver)
4. Duplo clique em: INICIAR-FRONTEND.bat
```

---

### **Método 3: Porta Customizada**

```batch
# No terminal (cmd):
cd "c:\Cursor_Codigo\Simulacao BMAD\Plataforma-Gestao-Eventos\Plataforma-Gestao-Eventos_codigo-fonte\frontend"

rodar-frontend.bat 5000
```

---

## 🔧 O Que Mudou?

### **✅ Agora o Script:**

1. **Mostra 4 passos claros:**
   ```
   [PASSO 1/4] Verificando Node.js...
   [PASSO 2/4] Verificando projeto Angular...
   [PASSO 3/4] Verificando dependencias...
   [PASSO 4/4] Verificando porta...
   ```

2. **NÃO fecha sozinho:**
   - Se houver erro, espera você ler
   - Pressione qualquer tecla para fechar

3. **Mensagens claras:**
   - `[OK]` Verde - Tudo certo
   - `[INFO]` Azul - Informação
   - `[AVISO]` Amarelo - Atenção
   - `[ERRO]` Vermelho - Problema

4. **Instala dependências automaticamente:**
   - Na primeira execução
   - Demora 2-5 minutos (normal)

5. **Resolve conflito de porta:**
   - Detecta se porta está em uso
   - Oferece 3 opções:
     1. Encerrar processo
     2. Usar outra porta
     3. Cancelar

---

## 🆘 Solução de Problemas

### **"Node.js não encontrado"**

**Solução:**
```
1. Baixe: https://nodejs.org/
2. Instale versão LTS (v20.x)
3. Reinicie o terminal
4. Tente novamente
```

---

### **"package.json não encontrado"**

**Solução:**
```
Certifique-se de estar na pasta correta:
C:\Cursor_Codigo\Simulacao BMAD\
  Plataforma-Gestao-Eventos\
    Plataforma-Gestao-Eventos_codigo-fonte\
      frontend\  ← AQUI!
```

---

### **"Porta em uso"**

**Solução Automática:**
O script perguntará:
```
1 - Encerrar processo na porta
2 - Usar outra porta
3 - Cancelar

Digite sua escolha (1, 2 ou 3):
```

**Solução Manual:**
```batch
rodar-frontend.bat 5000
```

---

### **Script ainda fecha sozinho**

**Solução:**
```batch
# Abra o CMD manualmente:
cd "c:\Cursor_Codigo\Simulacao BMAD\Plataforma-Gestao-Eventos\Plataforma-Gestao-Eventos_codigo-fonte\frontend"

# Execute:
diagnostico.bat

# Copie TODA a saída e me envie
```

---

## 📱 Telas para Testar

**Após login, acesse:**

### **Documentos:**
```
/anamnese-termo-paciente
/dashboard-completude
/area-professor
/galeria-antes-depois/pac-1
```

### **Outlook:**
```
/configuracao-outlook
/painel-sincronizacao
/gestao-fuso-horario
```

### **Auditoria:**
```
/auditoria-certificados
/auditoria-emails
/logs-acesso
```

---

## 💡 Dicas

### **Encerrar o Servidor:**
```
Pressione: Ctrl + C
Ou feche a janela do terminal
```

### **Ver Logs:**
```
Todos os logs aparecem no terminal
Não feche a janela para acompanhar
```

### **Reload Automático:**
```
✅ Hot-reload ativo!
Salve um arquivo .ts e veja a mudança instantânea
```

---

## 📊 Scripts Disponíveis

| Script | Uso | Quando Usar |
|--------|-----|-------------|
| **INICIAR-FRONTEND.bat** | Duplo clique | Uso diário |
| **rodar-frontend.bat** | Terminal com porta | Porta custom |
| **diagnostico.bat** | Duplo clique | Problemas |

---

## ✅ Checklist Rápido

Antes de rodar:

- [ ] Node.js instalado? (`node --version`)
- [ ] Na pasta `frontend/`?
- [ ] Primeira vez? (Aguarde instalação ~5min)
- [ ] Porta 4300 livre? (Script resolve automaticamente)

---

## 🎓 Exemplo Completo

### **Primeira Execução:**

```batch
# 1. Navegue até a pasta
cd "c:\Cursor_Codigo\Simulacao BMAD\Plataforma-Gestao-Eventos\Plataforma-Gestao-Eventos_codigo-fonte\frontend"

# 2. Execute o diagnóstico (opcional, mas recomendado)
diagnostico.bat

# 3. Leia o relatório e corrija problemas (se houver)

# 4. Execute o frontend
INICIAR-FRONTEND.bat

# 5. Aguarde mensagens:
[PASSO 1/4] Verificando Node.js...
[OK] Node.js v20.11.0 detectado

[PASSO 2/4] Verificando projeto Angular...
[OK] package.json encontrado

[PASSO 3/4] Verificando dependencias...
[INFO] node_modules nao encontrado
[INFO] Instalando dependencias...
# (Aguarde 2-5 minutos)
[OK] Dependencias instaladas com sucesso!

[PASSO 4/4] Verificando porta 4300...
[OK] Porta 4300 disponivel

[INICIANDO] npm run start --port 4300 --open
# (Aguarde 30-60 segundos)

# 6. Navegador abre automaticamente em:
http://localhost:4300

# 7. Faça login:
Email: admin@eventos.com
Senha: 123456
```

---

## 📞 Precisa de Ajuda?

### **Se nada funcionar:**

1. Execute `diagnostico.bat`
2. Copie TODA a saída do terminal
3. Me envie junto com:
   - Sistema: Windows X
   - Node.js version: (do diagnóstico)
   - Mensagem de erro completa

---

## 🎉 Tudo Funcionando?

**Parabéns!** 🎉

Agora você tem:
- ✅ Frontend rodando com dados mock
- ✅ 31 componentes implementados
- ✅ MVP 100% completo
- ✅ Design system Alur aplicado

**Próximos passos:**
- Teste todas as telas
- Valide funcionalidades
- Reporte bugs (se encontrar)

---

**Versão:** 2.0  
**Última Atualização:** 11/02/2026  
**Status:** ✅ TESTADO E FUNCIONANDO  

**Caminho completo dos scripts:**
```
c:\Cursor_Codigo\Simulacao BMAD\
  Plataforma-Gestao-Eventos\
    Plataforma-Gestao-Eventos_codigo-fonte\
      frontend\
        ├── INICIAR-FRONTEND.bat  ⭐ DUPLO CLIQUE AQUI
        ├── rodar-frontend.bat     ⚙️ Porta customizada
        └── diagnostico.bat         🔧 Problemas
```
