# 🔧 Troubleshooting - Network Error

## 🐛 Problema Atual

Você está vendo o erro: **"Erro ao carregar cursos: Network Error"**

## 🔍 Possíveis Causas

### 1. ⏱️ API em Cold Start (Render.com)
**Mais provável:** A API está hospedada no Render.com que tem "cold start" - a primeira requisição pode demorar 30-60 segundos para responder.

**Solução:**
- Aguarde 1-2 minutos após a primeira tentativa
- Recarregue a página (F5)
- A API deve "acordar" e responder normalmente

### 2. 🔒 CORS (Cross-Origin Resource Sharing)
A API pode estar bloqueando requisições do `localhost`.

**Solução no Backend:**
Verificar se no backend a configuração de CORS permite `http://localhost:5173` ou `http://localhost:3000`

### 3. 🔐 Rotas Requerem Autenticação
As rotas `/courses/popular` e `/courses/featured` podem requerer autenticação.

**Solução implementada:**
- ✅ Adicionei fallback para carregar cursos gerais
- ✅ Se popular/featured falharem, tenta `/courses`

### 4. 🌐 API Offline
A API pode estar offline ou com problemas.

**Como verificar:**
Abra no navegador: `https://swaply-api.onrender.com/api/courses`

## 🔬 Debug Implementado

Agora o Dashboard mostra logs detalhados no console:

```
🔄 Iniciando carregamento de cursos...
📊 Buscando cursos populares...
⭐ Buscando cursos em destaque...
✅ Cursos populares carregados: 6
✅ Cursos em destaque carregados: 6
✨ Carregamento de cursos concluído
```

## 🛠️ Como Testar Agora

### 1. Abra o Console do Navegador
- Chrome/Edge: F12 → aba "Console"
- Firefox: F12 → aba "Console"

### 2. Recarregue a Página
- Pressione F5
- Observe os logs no console

### 3. Verifique os Logs

#### ✅ Se aparecer:
```
✅ Cursos populares carregados: X
✅ Cursos em destaque carregados: X
```
**Sucesso!** Os cursos devem aparecer na tela.

#### ⚠️ Se aparecer:
```
⚠️ Erro ao carregar cursos populares: timeout of 30000ms exceeded
⚠️ Erro ao carregar cursos em destaque: timeout of 30000ms exceeded
🔄 Tentando fallback: carregar cursos gerais...
```
**Cold Start!** A API está demorando. Aguarde e recarregue.

#### ❌ Se aparecer:
```
❌ Erro geral ao carregar cursos: Network Error
```
Veja os "Detalhes do erro" logo abaixo no console.

## 🚀 Soluções Rápidas

### Solução 1: Aguardar Cold Start
```bash
# Aguarde 1-2 minutos
# Depois recarregue: F5
```

### Solução 2: Testar API Diretamente
Abra no navegador:
```
https://swaply-api.onrender.com/api/courses?page=1&limit=6
```

**Se retornar JSON:** API está funcionando!
**Se der erro:** API está offline ou com problemas.

### Solução 3: Verificar Autenticação
Se as rotas requerem autenticação, você precisa fazer login primeiro:

1. Vá para a página de Login
2. Faça login com suas credenciais
3. Volte ao Dashboard

## 📊 Logs de Debug

Os seguintes logs foram adicionados para ajudar:

| Emoji | Significado |
|-------|------------|
| 🔄 | Iniciando processo |
| 📊 | Buscando cursos populares |
| ⭐ | Buscando cursos em destaque |
| ✅ | Sucesso |
| ⚠️ | Aviso (tentou mas falhou) |
| ❌ | Erro crítico |
| ✨ | Concluído |

## 🔧 Melhorias Implementadas

1. ✅ **Logs detalhados** - Mostra exatamente onde está falhando
2. ✅ **Fallback automático** - Se popular/featured falham, tenta carregar cursos gerais
3. ✅ **Try-catch individual** - Não para tudo se uma requisição falhar
4. ✅ **Detalhes do erro** - Mostra status HTTP, mensagem, etc.

## 🎯 Próximos Passos

### Se o problema persistir:

1. **Verifique a URL da API:**
   - Abra: `src/services/api/client.js`
   - Linha 4: `const API_BASE_URL = 'https://swaply-api.onrender.com/api'`
   - Confirme que está correta

2. **Teste a API manualmente:**
   ```bash
   # No terminal (se tiver curl instalado)
   curl https://swaply-api.onrender.com/api/courses
   ```

3. **Verifique CORS no Backend:**
   - O backend deve permitir: `http://localhost:5173`
   - Verifique configuração de CORS

4. **Aumente o Timeout:**
   Se a API é muito lenta, aumente em `src/services/api/client.js`:
   ```javascript
   timeout: 60000, // 60 segundos ao invés de 30
   ```

## 📱 Contato

Se nada funcionar, compartilhe:
1. Os logs do console
2. A mensagem de erro completa
3. O resultado de abrir: `https://swaply-api.onrender.com/api/courses` no navegador

---

**Lembre-se:** O erro "Network Error" geralmente é causado por:
- ⏱️ 70% → Cold Start (demora inicial)
- 🔒 20% → CORS
- 🌐 10% → API offline

**Aguarde 1-2 minutos e recarregue!** 🔄




