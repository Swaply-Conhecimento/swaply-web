# 📚 Fluxo de Criação de Cursos - Swaply API

> Documentação completa sobre como funciona a criação de cursos na API Swaply

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Endpoint e Autenticação](#endpoint-e-autenticação)
3. [Fluxo de Middlewares](#fluxo-de-middlewares)
4. [Campos Obrigatórios e Opcionais](#campos-obrigatórios-e-opcionais)
5. [Fluxo no Controller](#fluxo-no-controller)
6. [Exemplos de Uso](#exemplos-de-uso)
7. [Tratamento de Erros](#tratamento-de-erros)
8. [Status do Curso](#status-do-curso)
9. [Comportamentos Automáticos](#comportamentos-automáticos)
10. [Mapeamento de Campos](#mapeamento-de-campos)

---

## 🎯 Visão Geral

A criação de cursos na Swaply API permite que qualquer usuário autenticado crie um curso. O sistema valida os dados, processa uploads de imagem, salva no banco de dados e atualiza automaticamente as estatísticas do usuário.

**Endpoint:** `POST /api/courses`  
**Autenticação:** Requer token JWT  
**Content-Type:** `application/json` ou `multipart/form-data`

---

## 🔐 Endpoint e Autenticação

### URL Base
```
POST http://localhost:5000/api/courses
```

### Headers Necessários

```http
Authorization: Bearer {seu_token_jwt}
Content-Type: application/json
```

**OU** (se incluir imagem no mesmo envio):

```http
Authorization: Bearer {seu_token_jwt}
Content-Type: multipart/form-data
```

### Autenticação

- ✅ Qualquer usuário autenticado pode criar cursos
- ✅ Não é necessário ser instrutor previamente (o sistema marca automaticamente)
- ✅ Token JWT válido é obrigatório

---

## 🔄 Fluxo de Middlewares

A requisição passa por uma sequência de middlewares na seguinte ordem:

```
1. authenticate          → Verifica token JWT
2. handleOptionalCourseImageUpload → Processa imagem (se enviada)
3. cleanupTempFiles      → Limpa arquivos temporários
4. sanitizeInput         → Sanitiza dados de entrada
5. courseValidators.create → Valida todos os campos
6. handleValidationErrors → Trata erros de validação
7. createCourse          → Controller principal
```

### Detalhamento dos Middlewares

#### 1. `authenticate`
- Verifica se o token JWT está presente
- Valida o token
- Busca o usuário no banco
- Verifica se a conta está ativa
- Adiciona `req.user` à requisição

#### 2. `handleOptionalCourseImageUpload`
- Detecta se o Content-Type é `multipart/form-data`
- Processa upload de imagem (se presente)
- Valida tipo e tamanho do arquivo
- Salva temporariamente para processamento

#### 3. `cleanupTempFiles`
- Remove arquivos temporários após processamento
- Garante limpeza mesmo em caso de erro

#### 4. `sanitizeInput`
- Remove espaços em branco desnecessários
- Remove campos vazios
- Limpa arrays vazios

#### 5. `courseValidators.create`
- Valida todos os campos obrigatórios
- Verifica tipos e formatos
- Aplica regras de negócio (tamanhos, limites, etc.)

#### 6. `handleValidationErrors`
- Coleta todos os erros de validação
- Retorna resposta padronizada com lista de erros

#### 7. `createCourse`
- Controller principal que executa a lógica de criação

---

## 📝 Campos Obrigatórios e Opcionais

### ✅ Campos Obrigatórios

| Campo | Tipo | Validação | Descrição |
|-------|------|-----------|-----------|
| `title` | String | 5-200 caracteres | Título do curso |
| `description` | String | 20-2000 caracteres | Descrição detalhada |
| `category` | String | Não vazio | Categoria principal |
| `level` | String | "Iniciante", "Intermediário" ou "Avançado" | Nível do curso |
| `pricePerHour` | Number | 1-100 (inteiro) | Preço em créditos por hora |
| `totalHours` | Number | 1-100 (inteiro) | Total de horas do curso |

### 🔹 Campos Opcionais

| Campo | Tipo | Validação | Descrição |
|-------|------|-----------|-----------|
| `language` | String | Lista de idiomas suportados | Idioma do curso (padrão: "Português") |
| `subcategory` | String | - | Subcategoria |
| `maxStudents` | Number | 1-1000 | Máximo de estudantes (padrão: 50) |
| `features` | Array | Máx. 10 itens, cada um 1-200 chars | Características do curso |
| `curriculum` | Array | Máx. 50 itens | Estrutura do currículo |
| `schedule` | Array | Máx. 14 horários | Horários das aulas |
| `requirements` | Array | Máx. 10 itens, cada um 1-200 chars | Pré-requisitos |
| `objectives` | Array | Máx. 10 itens, cada um 1-200 chars | Objetivos de aprendizado |
| `tags` | Array | - | Tags para busca |
| `status` | String | "draft", "active", "completed", "cancelled" | Status (padrão: "draft") |
| `image` | File | JPG/PNG/WEBP, máx. 10MB | Imagem do curso |

### 📋 Estrutura de Campos Complexos

#### Curriculum
```json
{
  "curriculum": [
    {
      "id": 1,
      "title": "Introdução ao Python",
      "duration": 3,
      "lessons": [
        "O que é Python?",
        "Instalação",
        "Primeiro programa"
      ]
    }
  ]
}
```

#### Schedule
```json
{
  "schedule": [
    {
      "day": "Segunda",
      "time": "20:00-22:00"
    },
    {
      "day": "Quarta",
      "time": "20:00-22:00"
    }
  ]
}
```

**Dias válidos:** Segunda, Terça, Quarta, Quinta, Sexta, Sábado, Domingo  
**Formato de horário:** `HH:MM-HH:MM` (ex: "20:00-22:00")

---

## ⚙️ Fluxo no Controller

O controller `createCourse` executa os seguintes passos:

### 1. Validação de Dados
```javascript
const errors = validationResult(req);
if (!errors.isEmpty()) {
  // Retorna erros de validação
  return res.status(400).json({...});
}
```

### 2. Preparação dos Dados
```javascript
// Mapear 'language' para 'courseLanguage' para evitar conflito com MongoDB
const { language, ...restBody } = req.body;
const courseData = {
  ...restBody,
  instructor: req.user._id  // Adicionado automaticamente
};

// Se language foi enviado, mapear para courseLanguage
if (language !== undefined) {
  courseData.courseLanguage = language;
}
```

**⚠️ Nota Importante:** O campo `language` é mapeado internamente para `courseLanguage` no banco de dados para evitar conflito com a palavra reservada `language` do MongoDB (usada em índices de texto). O frontend continua enviando e recebendo `language` normalmente - o mapeamento é transparente.

### 3. Upload de Imagem (se fornecida)
```javascript
if (req.file) {
  // Upload para Cloudinary
  const uploadResult = await uploadImageToCloud(req.file.path, 'swaply/courses');
  courseData.image = uploadResult.url;
  // Limpa arquivo temporário
  await deleteFile(req.file.path);
}
```

### 4. Criação do Curso
```javascript
const course = new Course(courseData);
await course.save();
```

### 5. Atualização de Estatísticas
```javascript
await User.findByIdAndUpdate(req.user._id, {
  $inc: { 'stats.coursesTeaching': 1 },
  $set: { isInstructor: true }
});
```

### 6. Resposta
```javascript
const populatedCourse = await Course.findById(course._id)
  .populate('instructor', 'name avatar')
  .lean();

// Mapear courseLanguage de volta para language na resposta (compatibilidade)
if (populatedCourse.courseLanguage) {
  populatedCourse.language = populatedCourse.courseLanguage;
}

res.status(201).json({
  success: true,
  message: 'Curso criado com sucesso',
  data: populatedCourse
});
```

**Nota:** O campo `courseLanguage` do banco é automaticamente mapeado de volta para `language` na resposta, mantendo compatibilidade total com o frontend.

---

## 💻 Exemplos de Uso

### Exemplo 1: Criar Curso sem Imagem (JSON)

```javascript
const courseData = {
  title: "Curso de Python para Iniciantes",
  description: "Aprenda Python do zero de forma prática e objetiva. Este curso aborda desde os conceitos básicos até programação orientada a objetos.",
  category: "Programação",
  subcategory: "Backend",
  level: "Iniciante",
  language: "Português",
  pricePerHour: 8,
  totalHours: 20,
  maxStudents: 30,
  features: [
    "Material complementar",
    "Exercícios práticos",
    "Certificado de conclusão"
  ],
  curriculum: [
    {
      id: 1,
      title: "Introdução ao Python",
      duration: 3,
      lessons: [
        "O que é Python?",
        "Instalação e configuração",
        "Primeiro programa"
      ]
    },
    {
      id: 2,
      title: "Variáveis e Tipos de Dados",
      duration: 4,
      lessons: [
        "Tipos primitivos",
        "Strings e formatação",
        "Listas e tuplas"
      ]
    }
  ],
  schedule: [
    {
      day: "Segunda",
      time: "20:00-22:00"
    },
    {
      day: "Quarta",
      time: "20:00-22:00"
    }
  ],
  requirements: [
    "Computador com acesso à internet",
    "Conhecimento básico de informática"
  ],
  objectives: [
    "Aprender fundamentos de Python",
    "Criar programas básicos",
    "Entender programação orientada a objetos"
  ],
  tags: ["python", "programação", "backend", "iniciante"],
  status: "draft"
};

const response = await fetch('http://localhost:5000/api/courses', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(courseData)
});

const result = await response.json();
console.log(result);
```

### Exemplo 2: Criar Curso com Imagem (FormData)

```javascript
const courseData = {
  title: "Curso de React Avançado",
  description: "Domine React com hooks, context API e técnicas avançadas...",
  category: "Programação",
  subcategory: "Frontend",
  level: "Avançado",
  pricePerHour: 12,
  totalHours: 40,
  maxStudents: 25,
  status: "draft"
};

// Criar FormData
const formData = new FormData();

// Adicionar campos simples
Object.keys(courseData).forEach(key => {
  formData.append(key, courseData[key]);
});

// Adicionar arrays como JSON stringify
formData.append('features', JSON.stringify([
  "Projetos práticos",
  "Code review",
  "Certificado"
]));

formData.append('curriculum', JSON.stringify([
  {
    id: 1,
    title: "Hooks Avançados",
    duration: 5,
    lessons: ["useReducer", "useMemo", "useCallback"]
  }
]));

// Adicionar arquivo de imagem
const imageFile = document.querySelector('input[type="file"]').files[0];
formData.append('image', imageFile);

// Enviar requisição
const response = await fetch('http://localhost:5000/api/courses', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
    // NÃO definir Content-Type - browser define automaticamente
  },
  body: formData
});

const result = await response.json();
```

### Exemplo 3: Usando Axios

```javascript
import axios from 'axios';

// Sem imagem
const createCourse = async (courseData, token) => {
  try {
    const response = await axios.post(
      'http://localhost:5000/api/courses',
      courseData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao criar curso:', error.response?.data);
    throw error;
  }
};

// Com imagem
const createCourseWithImage = async (courseData, imageFile, token) => {
  try {
    const formData = new FormData();
    
    // Adicionar campos
    Object.keys(courseData).forEach(key => {
      if (Array.isArray(courseData[key])) {
        formData.append(key, JSON.stringify(courseData[key]));
      } else {
        formData.append(key, courseData[key]);
      }
    });
    
    // Adicionar imagem
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    const response = await axios.post(
      'http://localhost:5000/api/courses',
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Erro ao criar curso:', error.response?.data);
    throw error;
  }
};
```

---

## 🔧 Mapeamento de Campos

### Campo `language` → `courseLanguage`

Por questões técnicas do MongoDB (o campo `language` é uma palavra reservada para índices de texto), o sistema realiza um mapeamento automático:

**No Frontend:**
- Envia: `{ "language": "Português" }`
- Recebe: `{ "language": "Português" }`

**No Backend:**
- Recebe: `language` do body
- Salva no banco: `courseLanguage`
- Retorna: `language` (mapeado de `courseLanguage`)

**Implementação:**
```javascript
// Ao criar/atualizar
const { language, ...restBody } = req.body;
if (language !== undefined) {
  courseData.courseLanguage = language;
}

// Ao retornar
if (course.courseLanguage) {
  course.language = course.courseLanguage;
}
```

**✅ Transparente para o Frontend:** O frontend não precisa fazer nenhuma alteração - continua usando `language` normalmente.

---

## ⚠️ Tratamento de Erros

### Códigos de Status HTTP

| Código | Situação | Descrição |
|--------|----------|-----------|
| `201` | ✅ Sucesso | Curso criado com sucesso |
| `400` | ❌ Erro de Validação | Dados inválidos ou faltando |
| `401` | ❌ Não Autenticado | Token ausente ou inválido |
| `500` | ❌ Erro Interno | Erro no servidor |

### Exemplo de Resposta de Erro

```json
{
  "success": false,
  "message": "Dados inválidos",
  "errors": [
    {
      "field": "title",
      "message": "Título deve ter entre 5 e 200 caracteres",
      "value": "Py"
    },
    {
      "field": "pricePerHour",
      "message": "Preço por hora deve ser entre 1 e 100 créditos",
      "value": 150
    }
  ]
}
```

### Exemplo de Resposta de Sucesso

```json
{
  "success": true,
  "message": "Curso criado com sucesso",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Curso de Python para Iniciantes",
    "description": "Aprenda Python do zero...",
    "instructor": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "João Silva",
      "avatar": "https://..."
    },
    "category": "Programação",
    "level": "Iniciante",
    "pricePerHour": 8,
    "totalHours": 20,
    "maxStudents": 30,
    "currentStudents": 0,
    "rating": 0,
    "image": "https://res.cloudinary.com/...",
    "status": "draft",
    "createdAt": "2025-01-22T10:00:00.000Z",
    "updatedAt": "2025-01-22T10:00:00.000Z"
  }
}
```

---

## 📊 Status do Curso

O campo `status` define o estado do curso:

| Status | Descrição | Visibilidade |
|--------|-----------|--------------|
| `draft` | Rascunho (padrão) | Apenas o instrutor vê |
| `active` | Ativo | Visível para todos |
| `completed` | Concluído | Visível mas não aceita novos alunos |
| `cancelled` | Cancelado | Oculto |

**Recomendação:** Criar cursos inicialmente como `draft` e mudar para `active` após revisão.

---

## 🤖 Comportamentos Automáticos

O sistema executa automaticamente as seguintes ações ao criar um curso:

### 1. Definição do Instrutor
```javascript
instructor: req.user._id  // Adicionado automaticamente do token
```

### 2. Marcação como Instrutor
```javascript
isInstructor: true  // Usuário é marcado como instrutor
```

### 3. Atualização de Estatísticas
```javascript
stats.coursesTeaching += 1  // Incrementa contador
```

### 4. Upload de Imagem
- Se uma imagem for enviada, é automaticamente:
  - Validada (tipo e tamanho)
  - Enviada para Cloudinary
  - URL salva no campo `image`
  - Arquivo temporário removido

### 5. Valores Padrão
- `status`: `"draft"`
- `currentStudents`: `0`
- `rating`: `0`
- `totalRatings`: `0`
- `courseLanguage`: `"Português"` (se não informado, mapeado de `language`)
- `maxStudents`: `50` (se não informado)
- `isLive`: `true`

**⚠️ Importante:** O campo `language` enviado pelo frontend é automaticamente mapeado para `courseLanguage` no banco de dados. Na resposta, `courseLanguage` é mapeado de volta para `language` para manter compatibilidade.

---

## 📝 Checklist para Criação de Curso

Antes de enviar a requisição, verifique:

- [ ] Token JWT válido no header `Authorization`
- [ ] Campo `title` preenchido (5-200 caracteres)
- [ ] Campo `description` preenchido (20-2000 caracteres)
- [ ] Campo `category` preenchido
- [ ] Campo `level` com valor válido ("Iniciante", "Intermediário" ou "Avançado")
- [ ] Campo `pricePerHour` entre 1 e 100
- [ ] Campo `totalHours` entre 1 e 100
- [ ] Se enviando imagem: arquivo válido (JPG/PNG/WEBP, máx. 10MB)
- [ ] Arrays (features, curriculum, etc.) no formato correto
- [ ] Horários no formato `HH:MM-HH:MM`

---

## 🔍 Logs de Erro

O sistema registra logs detalhados em caso de erro:

### Erros Registrados

1. **Erro de Validação**
   ```javascript
   {
     userId: "...",
     errors: [...]
   }
   ```

2. **Erro no Upload de Imagem**
   ```javascript
   {
     userId: "...",
     courseTitle: "...",
     error: "..."
   }
   ```

3. **Erro ao Salvar no Banco**
   ```javascript
   {
     userId: "...",
     courseTitle: "...",
     error: "..."
   }
   ```

4. **Erro ao Atualizar Estatísticas**
   ```javascript
   {
     userId: "...",
     courseId: "...",
     error: "..."
   }
   ```

5. **Erro Geral**
   ```javascript
   {
     userId: "...",
     courseTitle: "...",
     error: "...",
     stack: "..."
   }
   ```

---

## 🚀 Próximos Passos Após Criar o Curso

Após criar o curso com sucesso, você pode:

1. **Atualizar o curso** - `PUT /api/courses/:id`
2. **Upload de imagem separado** - `POST /api/courses/:id/image`
3. **Ativar o curso** - Atualizar `status` para `"active"`
4. **Visualizar o curso** - `GET /api/courses/:id`
5. **Listar seus cursos** - `GET /api/users/teaching-courses`

---

## 📚 Referências

- [Documentação Completa da API](./API_DOCUMENTATION.md)
- [Modelo de Curso](./src/models/Course.js)
- [Validações](./src/utils/validators.js)
- [Controller de Cursos](./src/controllers/courseController.js)

---

---

## ⚠️ Notas Técnicas Importantes

### Mapeamento `language` → `courseLanguage`

O MongoDB usa `language` como palavra reservada para configuração de índices de texto. Para evitar conflitos, o sistema:

1. **Recebe** `language` do frontend
2. **Mapeia** para `courseLanguage` antes de salvar no banco
3. **Retorna** `language` na resposta (mapeado de `courseLanguage`)

**Para o Frontend:** Continue usando `language` normalmente - o mapeamento é totalmente transparente.

**Para o Backend:** O campo no banco de dados é `courseLanguage`, mas todas as respostas incluem `language` para compatibilidade.

---

**Última atualização:** Janeiro 2025  
**Versão da API:** 1.0.0  
**Nota:** Campo `language` mapeado internamente para `courseLanguage` (transparente para o frontend)
# 📚 Como Buscar um Curso via URL - Swaply API

> Guia completo para buscar detalhes de um curso específico usando a API

**Versão da API:** 1.0.0  
**Última atualização:** Janeiro 2025

---

## 🎯 Endpoint

### GET `/api/courses/:id`

Obter detalhes completos de um curso específico pelo seu ID.

**Acesso:** Público (autenticação opcional)

---

## 📋 Informações da Requisição

### Método HTTP
```
GET
```

### URL Base
```
http://localhost:5000/api/courses/:id
```

### Parâmetros de URL

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `id` | String (MongoDB ObjectId) | ✅ Sim | ID único do curso |

### Headers

**Opcional (mas recomendado):**
```
Authorization: Bearer <token>
```

**Nota:** Se você enviar o token de autenticação:
- O sistema verifica se você está matriculado no curso (`isEnrolled`)
- O sistema verifica se o curso está nos seus favoritos (`isFavorite`)
- Você recebe informações adicionais personalizadas

**Sem token:**
- A requisição funciona normalmente
- `isEnrolled` será sempre `false`
- `isFavorite` será sempre `false`

---

## ✅ Resposta de Sucesso (200)

### Estrutura da Resposta

```json
{
  "success": true,
  "message": "Curso obtido com sucesso",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Curso de Python para Iniciantes",
    "description": "Aprenda Python do zero de forma prática e objetiva",
    "instructor": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "João Silva",
      "avatar": "https://res.cloudinary.com/...",
      "bio": "Desenvolvedor Python com 10 anos de experiência",
      "stats": {
        "coursesTeaching": 5,
        "coursesCompleted": 0,
        "totalHours": 0,
        "totalEarnings": 0
      }
    },
    "category": "Programação",
    "subcategory": "Backend",
    "level": "Iniciante",
    "language": "Português",
    "pricePerHour": 10,
    "totalHours": 20,
    "maxStudents": 30,
    "currentStudents": 5,
    "rating": 4.8,
    "totalRatings": 15,
    "image": "https://res.cloudinary.com/.../swaply/courses/...",
    "features": [
      "Material complementar",
      "Exercícios práticos",
      "Certificado de conclusão"
    ],
    "curriculum": [
      {
        "id": 1,
        "title": "Introdução ao Python",
        "duration": 3,
        "lessons": [
          "O que é Python?",
          "Instalação e configuração",
          "Primeiro programa"
        ]
      }
    ],
    "schedule": [
      {
        "day": "Segunda",
        "time": "20:00-22:00"
      }
    ],
    "requirements": [
      "Computador com acesso à internet"
    ],
    "objectives": [
      "Aprender fundamentos de Python",
      "Criar programas básicos"
    ],
    "tags": ["python", "programação", "backend"],
    "status": "active",
    "isLive": true,
    "enrolledStudents": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "name": "Maria Santos",
        "avatar": "https://res.cloudinary.com/..."
      }
    ],
    "totalPrice": 200,
    "spotsAvailable": 25,
    "isEnrolled": false,
    "isFavorite": false,
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-20T14:20:00.000Z"
  }
}
```

### Campos Retornados

#### Informações Básicas
- `_id`: ID único do curso
- `title`: Título do curso
- `description`: Descrição completa
- `category`: Categoria principal
- `subcategory`: Subcategoria (opcional)
- `level`: Nível do curso ("Iniciante", "Intermediário", "Avançado")
- `language`: Idioma do curso (ex: "Português", "Inglês", "Espanhol")
- `status`: Status do curso ("draft", "active", "completed", "cancelled")

#### Informações do Instrutor
- `instructor._id`: ID do instrutor
- `instructor.name`: Nome do instrutor
- `instructor.avatar`: URL do avatar
- `instructor.bio`: Biografia do instrutor
- `instructor.stats`: Estatísticas do instrutor

#### Informações Financeiras
- `pricePerHour`: Preço por hora em créditos
- `totalHours`: Total de horas do curso
- `totalPrice`: Preço total calculado (`pricePerHour * totalHours`)

#### Informações de Capacidade
- `maxStudents`: Número máximo de estudantes
- `currentStudents`: Número atual de estudantes matriculados
- `spotsAvailable`: Vagas disponíveis (`maxStudents - currentStudents`)

#### Informações de Avaliação
- `rating`: Nota média (0-5)
- `totalRatings`: Número total de avaliações

#### Conteúdo do Curso
- `image`: URL da imagem do curso (Cloudinary)
- `features`: Array de características do curso
- `curriculum`: Estrutura do currículo
- `schedule`: Horários das aulas
- `requirements`: Pré-requisitos
- `objectives`: Objetivos de aprendizado
- `tags`: Tags para busca

#### Informações Adicionais (Calculadas)
- `totalPrice`: Preço total do curso
- `spotsAvailable`: Vagas disponíveis
- `isEnrolled`: Se o usuário autenticado está matriculado (apenas se autenticado)
- `isFavorite`: Se o curso está nos favoritos do usuário (apenas se autenticado)

#### Estudantes Matriculados
- `enrolledStudents`: Array com informações básicas dos estudantes matriculados
  - `_id`: ID do estudante
  - `name`: Nome do estudante
  - `avatar`: URL do avatar

---

## ❌ Respostas de Erro

### 404 - Curso Não Encontrado

**Quando ocorre:**
- ID do curso não existe no banco de dados
- ID está em formato inválido

**Resposta:**
```json
{
  "success": false,
  "message": "Curso não encontrado"
}
```

### 400 - ID Inválido

**Quando ocorre:**
- ID não está no formato MongoDB ObjectId válido

**Resposta:**
```json
{
  "success": false,
  "message": "Dados inválidos",
  "errors": [
    {
      "field": "id",
      "message": "ID do curso inválido",
      "value": "invalid-id"
    }
  ]
}
```

### 500 - Erro Interno do Servidor

**Quando ocorre:**
- Erro no banco de dados
- Erro no processamento

**Resposta:**
```json
{
  "success": false,
  "message": "Erro interno do servidor"
}
```

---

## 💻 Exemplos de Uso

### Exemplo 1: Buscar Curso (JavaScript/Fetch)

```javascript
// Sem autenticação
async function getCourseById(courseId) {
  try {
    const response = await fetch(`http://localhost:5000/api/courses/${courseId}`);
    const data = await response.json();
    
    if (data.success) {
      console.log('Curso:', data.data);
      return data.data;
    } else {
      console.error('Erro:', data.message);
      return null;
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
    return null;
  }
}

// Com autenticação
async function getCourseByIdAuthenticated(courseId, token) {
  try {
    const response = await fetch(`http://localhost:5000/api/courses/${courseId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    
    if (data.success) {
      console.log('Curso:', data.data);
      console.log('Está matriculado?', data.data.isEnrolled);
      console.log('Está nos favoritos?', data.data.isFavorite);
      return data.data;
    } else {
      console.error('Erro:', data.message);
      return null;
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
    return null;
  }
}

// Uso
const course = await getCourseById('507f1f77bcf86cd799439011');
```

### Exemplo 2: Buscar Curso (Axios)

```javascript
import axios from 'axios';

// Sem autenticação
async function getCourseById(courseId) {
  try {
    const { data } = await axios.get(
      `http://localhost:5000/api/courses/${courseId}`
    );
    
    if (data.success) {
      return data.data;
    }
    return null;
  } catch (error) {
    if (error.response?.status === 404) {
      console.error('Curso não encontrado');
    } else {
      console.error('Erro:', error.message);
    }
    return null;
  }
}

// Com autenticação (usando interceptor)
// O token será adicionado automaticamente pelo interceptor
async function getCourseByIdAuthenticated(courseId) {
  try {
    const { data } = await apiClient.get(`/courses/${courseId}`);
    
    if (data.success) {
      return data.data;
    }
    return null;
  } catch (error) {
    if (error.response?.status === 404) {
      console.error('Curso não encontrado');
    } else {
      console.error('Erro:', error.message);
    }
    return null;
  }
}
```

### Exemplo 3: React Hook

```javascript
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { courseService } from '../services/api/courses';

function useCourse() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCourse() {
      try {
        setLoading(true);
        const result = await courseService.getCourseById(id);
        
        if (result.success) {
          setCourse(result.course);
        } else {
          setError('Curso não encontrado');
        }
      } catch (err) {
        setError(err.message || 'Erro ao carregar curso');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchCourse();
    }
  }, [id]);

  return { course, loading, error };
}

// Uso no componente
function CourseDetails() {
  const { course, loading, error } = useCourse();

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;
  if (!course) return <div>Curso não encontrado</div>;

  return (
    <div>
      <h1>{course.title}</h1>
      <p>{course.description}</p>
      <p>Instrutor: {course.instructor.name}</p>
      <p>Idioma: {course.language}</p>
      <p>Preço Total: {course.totalPrice} créditos</p>
      <p>Vagas Disponíveis: {course.spotsAvailable}</p>
      {course.isEnrolled && <p>✅ Você está matriculado neste curso</p>}
      {course.isFavorite && <p>⭐ Este curso está nos seus favoritos</p>}
    </div>
  );
}
```

### Exemplo 4: cURL

```bash
# Sem autenticação
curl -X GET http://localhost:5000/api/courses/507f1f77bcf86cd799439011

# Com autenticação
curl -X GET http://localhost:5000/api/courses/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer seu_token_aqui"
```

### Exemplo 5: Postman/Insomnia

**Configuração:**
- **Método:** GET
- **URL:** `http://localhost:5000/api/courses/:id`
- **Parâmetros:**
  - `id`: `507f1f77bcf86cd799439011`
- **Headers (opcional):**
  - `Authorization`: `Bearer seu_token_aqui`

---

## 🔍 Informações Adicionais

### Autenticação Opcional

A rota usa o middleware `optionalAuth`, que significa:

1. **Sem token:** A requisição funciona normalmente, mas:
   - `isEnrolled` será sempre `false`
   - `isFavorite` será sempre `false`

2. **Com token válido:** Você recebe informações adicionais:
   - `isEnrolled`: Indica se você está matriculado no curso
   - `isFavorite`: Indica se o curso está nos seus favoritos

### Mapeamento de Campos

**⚠️ IMPORTANTE:** O campo `language` é retornado na resposta, mas internamente no banco de dados é armazenado como `courseLanguage`. O mapeamento é automático e transparente.

### Populate Automático

A rota automaticamente popula (preenche) os seguintes campos:

- `instructor`: Informações completas do instrutor
- `enrolledStudents`: Lista de estudantes matriculados (apenas nome e avatar)

### Campos Calculados

A rota adiciona automaticamente campos calculados:

- `totalPrice`: `pricePerHour * totalHours`
- `spotsAvailable`: `maxStudents - currentStudents`
- `isEnrolled`: Verifica se o usuário autenticado está na lista de `enrolledStudents`
- `isFavorite`: Verifica se o curso está na lista de favoritos do usuário

---

## 🎯 Casos de Uso

### 1. Visualizar Detalhes do Curso
```javascript
// Usuário clica em um curso na listagem
const courseId = '507f1f77bcf86cd799439011';
const course = await getCourseById(courseId);
// Exibe página de detalhes com todas as informações
```

### 2. Verificar Matrícula
```javascript
// Verificar se usuário está matriculado
const course = await getCourseByIdAuthenticated(courseId, token);
if (course.isEnrolled) {
  // Mostrar conteúdo do curso
} else {
  // Mostrar botão de matrícula
}
```

### 3. Verificar Favoritos
```javascript
// Verificar se curso está nos favoritos
const course = await getCourseByIdAuthenticated(courseId, token);
if (course.isFavorite) {
  // Mostrar ícone de favorito preenchido
} else {
  // Mostrar ícone de favorito vazio
}
```

### 4. Verificar Vagas Disponíveis
```javascript
// Verificar se há vagas disponíveis
const course = await getCourseById(courseId);
if (course.spotsAvailable > 0) {
  // Permitir matrícula
} else {
  // Mostrar "Curso lotado"
}
```

---

## 📝 Notas Importantes

1. **ID Válido:** O ID deve ser um MongoDB ObjectId válido (24 caracteres hexadecimais)

2. **Autenticação Opcional:** Você pode buscar cursos sem estar autenticado, mas perderá informações personalizadas

3. **Performance:** A rota faz populate de `instructor` e `enrolledStudents`, então pode ser um pouco mais lenta para cursos com muitos estudantes

4. **Cache:** Considere implementar cache no frontend para evitar requisições desnecessárias

5. **Tratamento de Erros:** Sempre trate os casos de erro (404, 400, 500) adequadamente

---

## 🔗 Endpoints Relacionados

- `GET /api/courses` - Listar todos os cursos
- `GET /api/courses/search` - Buscar cursos por termo
- `GET /api/courses/featured` - Cursos em destaque
- `GET /api/courses/popular` - Cursos populares
- `POST /api/courses/:id/enroll` - Matricular-se no curso
- `GET /api/courses/:id/reviews` - Avaliações do curso

---

## 📚 Referências

- [Documentação Completa da API](./API_DOCUMENTATION.md)
- [Modelo de Curso](./src/models/Course.js)
- [Controller de Cursos](./src/controllers/courseController.js)
- [Rotas de Cursos](./src/routes/courses.js)

---

**Última atualização:** Janeiro 2025  
**Versão da API:** 1.0.0


