# 🔍 Análise de Inconsistências - Documentação vs Código

Análise comparativa entre a documentação da API (`documentacaoApi.md`) e o código implementado nos serviços (`src/services/api/`).

## ✅ Rotas Implementadas Corretamente

Todas as rotas principais estão implementadas e funcionando:
- ✅ Autenticação (login, register, logout, refresh-token, verify-token, forgot-password, reset-password)
- ✅ Usuários (profile, settings, avatar, credits, favorites, enrolled-courses, teaching-courses)
- ✅ Cursos (CRUD completo, search, categories, featured, popular, recommended)
- ✅ Aulas/Classes (schedule, list, cancel, complete, attendance, rating, join)
- ✅ Avaliações/Reviews (CRUD, helpful, report, respond)
- ✅ Notificações (list, mark as read, delete, create)
- ✅ Calendário (users/calendar, instructors/:id/calendar)

---

## ⚠️ Inconsistências Encontradas

### 1. Rotas Faltando no Código

#### ❌ GET `/users/reviews`
**Documentação:** Lista avaliações feitas pelo usuário  
**Status:** Não implementado no `userService`

**Código esperado:**
```javascript
getUserReviews: async (params = {}) => {
  try {
    const { data } = await apiClient.get('/users/reviews', { params });
    return {
      success: true,
      reviews: data.data,
      pagination: data.pagination,
    };
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
```

---

#### ❌ GET `/users/reviews/received`
**Documentação:** Lista avaliações recebidas pelo usuário (como instrutor)  
**Status:** Não implementado no `userService`

**Código esperado:**
```javascript
getReceivedReviews: async (params = {}) => {
  try {
    const { data } = await apiClient.get('/users/reviews/received', { params });
    return {
      success: true,
      reviews: data.data,
      pagination: data.pagination,
    };
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
```

---

#### ❌ GET `/users/reviews/stats`
**Documentação:** Obter estatísticas de avaliações do instrutor  
**Status:** Não implementado no `userService`

**Código esperado:**
```javascript
getReviewStats: async () => {
  try {
    const { data } = await apiClient.get('/users/reviews/stats');
    return {
      success: true,
      stats: data.data,
    };
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
```

---

### 2. Diferenças nos Formatos de Resposta

#### ⚠️ GET `/users/credits/balance`
**Documentação retorna:**
```json
{
  "success": true,
  "data": {
    "balance": 50
  }
}
```

**Código espera:**
```javascript
credits: data.data.credits,
creditPrice: data.data.creditPrice,
```

**Problema:** O código espera `credits` e `creditPrice`, mas a documentação mostra apenas `balance`.

**Solução:** Ajustar o código para aceitar ambos os formatos ou atualizar a documentação.

---

#### ⚠️ POST `/classes/schedule`
**Documentação especifica body:**
```json
{
  "courseId": "507f1f77bcf86cd799439011",
  "date": "2025-01-25T14:00:00.000Z",
  "duration": 2,
  "notes": "Aula sobre arrays e objetos"
}
```

**Código:** Aceita `scheduleData` genérico, mas pode estar esperando `dateTime` ao invés de `date`.

**Verificação necessária:** Confirmar se o backend aceita `date` ou `dateTime`.

---

#### ⚠️ PUT `/classes/:id/rating`
**Documentação especifica body:**
```json
{
  "rating": 5,
  "feedback": "Excelente aula, muito didático!"
}
```

**Código envia:**
```javascript
{
  rating,
  comment,  // ← Usa 'comment' ao invés de 'feedback'
}
```

**Problema:** Inconsistência entre documentação (`feedback`) e código (`comment`).

**Solução:** Verificar qual campo o backend realmente aceita e padronizar.

---

### 3. POST `/auth/logout`
**Documentação especifica:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Código atual:**
```javascript
logout: async () => {
  try {
    await apiClient.post('/auth/logout');  // ← Não envia refreshToken
    clearAuthData();
    return { success: true };
  } catch (error) {
    // ...
  }
}
```

**Problema:** O código não está enviando o `refreshToken` no body, como especificado na documentação.

**Solução:** Atualizar o código para enviar o refreshToken:
```javascript
logout: async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    await apiClient.post('/auth/logout', { refreshToken });
    clearAuthData();
    return { success: true };
  } catch (error) {
    clearAuthData();
    throw new Error(getErrorMessage(error));
  }
}
```

---

### 4. POST `/courses/:id/reviews`
**Código atual:**
```javascript
createReview: async (courseId, reviewData) => {
  // ...
  await apiClient.post(`/courses/${courseId}/reviews`, {
    courseId, // ← Envia courseId no body (inconsistência documentada)
    ...reviewData,
  });
}
```

**Observação:** O código tem um comentário indicando que a API requer `courseId` no body mesmo que esteja na URL. Isso está documentado como uma inconsistência da API, mas não está mencionado na documentação principal.

**Solução:** Adicionar nota na documentação sobre essa particularidade da API.

---

### 5. GET `/courses/:id/reviews`
**Código espera:**
```javascript
reviews: data.data.reviews,
stats: data.data.stats,
pagination: data.pagination,
```

**Documentação mostra:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "rating": 5,
      "comment": "..."
    }
  ],
  "pagination": { ... }
}
```

**Problema:** O código espera `data.data.reviews` e `data.data.stats`, mas a documentação mostra que `data` é um array direto.

**Solução:** Verificar o formato real da resposta da API e ajustar código ou documentação.

---

### 6. GET `/courses/:id/availability`
**Código espera:**
```javascript
availability: data.data.availability,
instructorSchedule: data.data.instructorSchedule,
```

**Documentação mostra:**
```json
{
  "success": true,
  "data": {
    "availableSlots": [ ... ]  // ← Nome diferente
  }
}
```

**Problema:** Inconsistência entre `availableSlots` (doc) e `availability` (código).

---

### 7. Base URL
**Documentação:** `http://localhost:5000/api`  
**Código (client.js):** `https://swaply-api.onrender.com/api` (produção) ou `VITE_API_BASE_URL` (env)

**Observação:** Isso é normal (documentação mostra localhost, código usa produção/variavel de ambiente).

---

## 📋 Resumo de Ações Necessárias

### Prioridade Alta ✅ CONCLUÍDO
1. ✅ **Implementar rotas faltantes:** ✅ IMPLEMENTADO
   - ✅ `GET /users/reviews` - Implementado em `users.js`
   - ✅ `GET /users/reviews/received` - Implementado em `users.js`
   - ✅ `GET /users/reviews/stats` - Implementado em `users.js`

2. ✅ **Corrigir POST `/auth/logout`:** ✅ CORRIGIDO
   - ✅ Agora envia `refreshToken` no body quando disponível

3. ✅ **Padronizar PUT `/classes/:id/rating`:** ✅ CORRIGIDO
   - ✅ Atualizado para usar `feedback` conforme documentação
   - ✅ Adicionada nota sobre compatibilidade com `comment`

### Prioridade Média ✅ PARCIALMENTE RESOLVIDO
4. ⚠️ **Verificar formatos de resposta:**
   - ✅ `GET /users/credits/balance` - ✅ CORRIGIDO: Agora suporta ambos `balance` e `credits`
   - ⚠️ `GET /courses/:id/reviews` - ⚠️ PENDENTE: Verificar formato real da resposta
   - ⚠️ `GET /courses/:id/availability` - ⚠️ PENDENTE: Verificar se retorna `availableSlots` ou `availability`

5. ⚠️ **Adicionar nota na documentação:**
   - Sobre `courseId` no body de `POST /courses/:id/reviews`

### Prioridade Baixa
6. ℹ️ **Atualizar documentação:**
   - Adicionar exemplo de uso com variável de ambiente para Base URL
   - Clarificar diferenças entre desenvolvimento e produção

---

## ✅ Correções Implementadas

### 1. Rotas Adicionadas em `src/services/api/users.js` ✅
- ✅ `getUserReviews()` - GET /users/reviews
- ✅ `getReceivedReviews()` - GET /users/reviews/received  
- ✅ `getReviewStats()` - GET /users/reviews/stats

### 2. Correção em `src/services/api/auth.js` ✅
- ✅ `logout()` agora envia `refreshToken` no body quando disponível

### 3. Correção em `src/services/api/classes.js` ✅
- ✅ `rateClass()` atualizado para usar `feedback` conforme documentação

### 4. Melhoria em `src/services/api/users.js` ✅
- ✅ `getCreditBalance()` agora suporta ambos os formatos (`balance` e `credits`)

---

## 📝 Notas Finais

- ✅ **A maioria das correções críticas foram implementadas**
- ✅ **Todas as rotas documentadas agora estão implementadas no código**
- ⚠️ **Pendências menores:**
  - Verificar formatos exatos de resposta de algumas rotas (testes necessários)
  - Possíveis diferenças de nomenclatura entre documentação e implementação real do backend
- ✅ **Recomendação:** Testar as rotas com o backend real para confirmar:
  - `GET /courses/:id/reviews` - estrutura exata da resposta
  - `GET /courses/:id/availability` - nome do campo retornado
  - `PUT /classes/:id/rating` - se backend aceita `feedback` ou `comment`

---

## ✅ Status das Correções

| Item | Status | Observação |
|------|--------|------------|
| Rotas faltantes | ✅ Implementado | 3 rotas adicionadas |
| POST /auth/logout | ✅ Corrigido | Agora envia refreshToken |
| PUT /classes/:id/rating | ✅ Corrigido | Usa 'feedback' conforme doc |
| GET /users/credits/balance | ✅ Melhorado | Suporta ambos formatos |
| Formato de respostas | ⚠️ Pendente | Requer testes com backend |

---

**Data da análise:** 2025-01-22  
**Data das correções:** 2025-01-22  
**Versão da API analisada:** 1.0.0

