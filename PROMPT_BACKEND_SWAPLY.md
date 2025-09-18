# 🎯 PROMPT COMPLETO PARA BACKEND SWAPLY - NODE.JS + EXPRESS + MONGODB ATLAS

Baseado na análise completa do frontend da plataforma Swaply, aqui está o prompt detalhado para criar o backend completo:

---

## 📋 **CONTEXTO DO PROJETO**
Crie um backend completo para a plataforma **Swaply** - uma plataforma de troca de conhecimentos onde pessoas ensinam e aprendem usando um sistema de créditos. Use **Node.js**, **Express.js** e **MongoDB Atlas** para hospedagem.

---

## 🏗️ **ARQUITETURA E ESTRUTURA**

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   ├── auth.js
│   │   └── cloudinary.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── courseController.js
│   │   ├── classController.js
│   │   ├── paymentController.js
│   │   └── notificationController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── validation.js
│   │   ├── upload.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── Class.js
│   │   ├── Payment.js
│   │   ├── Review.js
│   │   └── Notification.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── courses.js
│   │   ├── classes.js
│   │   ├── payments.js
│   │   └── notifications.js
│   ├── services/
│   │   ├── emailService.js
│   │   ├── zoomService.js
│   │   └── paymentService.js
│   ├── utils/
│   │   ├── helpers.js
│   │   ├── validators.js
│   │   └── constants.js
│   └── app.js
├── .env
├── package.json
└── server.js
```

---

## 🗄️ **MODELOS DO BANCO DE DADOS (MongoDB)**

### **1. User Model**
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  avatar: String (URL),
  bio: String,
  skills: [String],
  credits: Number (default: 10),
  joinDate: Date (default: now),
  isInstructor: Boolean (default: false),
  stats: {
    coursesCompleted: Number (default: 0),
    coursesTeaching: Number (default: 0),
    totalHours: Number (default: 0),
    totalEarnings: Number (default: 0)
  },
  favorites: [ObjectId] (Course IDs),
  settings: {
    theme: String (enum: ['light', 'dark', 'system']),
    fontSize: String (enum: ['small', 'medium', 'large']),
    accessibility: {
      fontSizeControl: Boolean,
      screenReader: Boolean,
      audioDescription: Boolean,
      vlibras: Boolean
    },
    notifications: {
      classNotifications: Boolean,
      interestNotifications: Boolean,
      newCoursesNotifications: Boolean
    }
  },
  googleId: String (opcional),
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### **2. Course Model**
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String (required),
  instructor: ObjectId (ref: 'User', required),
  category: String (required),
  subcategory: String,
  level: String (enum: ['Iniciante', 'Intermediário', 'Avançado']),
  language: String (default: 'Português'),
  pricePerHour: Number (required, em créditos),
  totalHours: Number (required),
  maxStudents: Number (default: 50),
  currentStudents: Number (default: 0),
  rating: Number (default: 0),
  totalRatings: Number (default: 0),
  image: String (URL),
  features: [String],
  curriculum: [{
    id: Number,
    title: String,
    duration: Number,
    lessons: [String]
  }],
  schedule: [{
    day: String,
    time: String
  }],
  status: String (enum: ['draft', 'active', 'completed', 'cancelled']),
  tags: [String],
  requirements: [String],
  objectives: [String],
  isLive: Boolean (default: true),
  zoomSettings: {
    meetingId: String,
    password: String,
    recurringMeeting: Boolean
  },
  enrolledStudents: [ObjectId] (User IDs),
  createdAt: Date,
  updatedAt: Date
}
```

### **3. Class Model (Aulas Agendadas)**
```javascript
{
  _id: ObjectId,
  courseId: ObjectId (ref: 'Course', required),
  instructorId: ObjectId (ref: 'User', required),
  studentId: ObjectId (ref: 'User', required),
  title: String,
  date: Date (required),
  time: String (required),
  duration: Number (default: 1, em horas),
  status: String (enum: ['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show']),
  zoomLink: String,
  zoomMeetingId: String,
  zoomPassword: String,
  recordingUrl: String,
  notes: String,
  creditsUsed: Number (required),
  createdAt: Date,
  updatedAt: Date
}
```

### **4. Payment Model**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', required),
  type: String (enum: ['credit_purchase', 'credit_earned', 'credit_spent']),
  amount: Number (required),
  credits: Number (required),
  description: String,
  courseId: ObjectId (ref: 'Course', opcional),
  classId: ObjectId (ref: 'Class', opcional),
  paymentMethod: String,
  transactionId: String,
  status: String (enum: ['pending', 'completed', 'failed', 'refunded']),
  createdAt: Date,
  updatedAt: Date
}
```

### **5. Review Model**
```javascript
{
  _id: ObjectId,
  courseId: ObjectId (ref: 'Course', required),
  studentId: ObjectId (ref: 'User', required),
  instructorId: ObjectId (ref: 'User', required),
  rating: Number (required, 1-5),
  comment: String,
  isAnonymous: Boolean (default: false),
  helpfulCount: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### **6. Notification Model**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', required),
  type: String (enum: ['class_reminder', 'class_cancelled', 'new_course', 'credit_earned', 'system']),
  title: String (required),
  message: String (required),
  data: Object, // dados extras específicos do tipo
  isRead: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🛣️ **ROTAS E ENDPOINTS COMPLETOS**

### **🔐 AUTH ROUTES (/api/auth)**
```javascript
POST /register          // Cadastro (name, email, password, confirmPassword)
POST /login            // Login (email, password)
POST /google           // Login com Google
POST /forgot-password  // Solicitar reset de senha
POST /reset-password   // Resetar senha com token
POST /logout           // Logout
GET  /verify-token     // Verificar token JWT
POST /refresh-token    // Renovar token
```

### **👤 USER ROUTES (/api/users)**
```javascript
GET    /profile                 // Obter perfil do usuário logado
PUT    /profile                 // Atualizar perfil
POST   /avatar                  // Upload de avatar
DELETE /avatar                  // Remover avatar
GET    /settings                // Obter configurações
PUT    /settings                // Atualizar configurações
GET    /credits                 // Histórico de créditos
POST   /credits/purchase        // Comprar créditos
GET    /stats                   // Estatísticas do usuário
GET    /favorites               // Cursos favoritos
POST   /favorites/:courseId     // Adicionar aos favoritos
DELETE /favorites/:courseId     // Remover dos favoritos
GET    /enrolled-courses        // Cursos matriculados
GET    /teaching-courses        // Cursos sendo ensinados
DELETE /account                 // Excluir conta
```

### **📚 COURSE ROUTES (/api/courses)**
```javascript
GET    /                       // Listar todos os cursos (com filtros e paginação)
GET    /search                  // Buscar cursos
GET    /categories              // Listar categorias
GET    /featured                // Cursos em destaque
GET    /popular                 // Cursos populares
GET    /recommended/:userId     // Cursos recomendados
GET    /:id                     // Obter curso por ID
POST   /                       // Criar novo curso (instrutor)
PUT    /:id                     // Atualizar curso (instrutor)
DELETE /:id                     // Excluir curso (instrutor)
POST   /:id/enroll              // Matricular-se no curso
DELETE /:id/unenroll            // Cancelar matrícula
GET    /:id/students            // Listar alunos do curso
POST   /:id/image               // Upload de imagem do curso
GET    /:id/reviews             // Avaliações do curso
POST   /:id/reviews             // Criar avaliação
PUT    /reviews/:reviewId       // Atualizar avaliação
DELETE /reviews/:reviewId       // Excluir avaliação
```

### **🎓 CLASS ROUTES (/api/classes)**
```javascript
GET    /                       // Listar aulas do usuário
GET    /calendar               // Aulas do calendário
GET    /scheduled              // Aulas agendadas
GET    /completed              // Aulas completadas
GET    /:id                    // Obter aula por ID
POST   /schedule               // Agendar nova aula
PUT    /:id                    // Atualizar aula
DELETE /:id                    // Cancelar aula
POST   /:id/confirm            // Confirmar aula
POST   /:id/complete           // Marcar como completada
GET    /:id/zoom-link          // Obter link do Zoom
POST   /:id/recording          // Salvar URL da gravação
GET    /instructor/available-slots  // Horários disponíveis do instrutor
POST   /instructor/availability     // Definir disponibilidade
```

### **💰 PAYMENT ROUTES (/api/payments)**
```javascript
GET    /history                // Histórico de transações
POST   /credits/purchase       // Comprar créditos
POST   /credits/transfer       // Transferir créditos
GET    /credits/balance        // Saldo de créditos
POST   /refund/:transactionId  // Solicitar reembolso
GET    /invoices               // Faturas/recibos
```

### **🔔 NOTIFICATION ROUTES (/api/notifications)**
```javascript
GET    /                       // Listar notificações
GET    /unread                 // Notificações não lidas
PUT    /:id/read               // Marcar como lida
PUT    /mark-all-read          // Marcar todas como lidas
DELETE /:id                    // Excluir notificação
POST   /preferences            // Configurar preferências
```

---

## 🔧 **FUNCIONALIDADES ESPECÍFICAS**

### **Sistema de Créditos**
- 1 crédito = 1 hora de aula
- Usuários iniciam com 10 créditos
- Instrutores ganham créditos ao ensinar
- Sistema de compra de créditos
- Histórico completo de transações

### **Sistema de Agendamento**
- Calendário interativo
- Horários disponíveis do instrutor
- Confirmação de aulas
- Integração com Zoom para links automáticos
- Notificações de lembrete

### **Sistema de Avaliações**
- Avaliações de 1-5 estrelas
- Comentários opcionais
- Sistema de "útil" para avaliações
- Cálculo automático da média

### **Sistema de Favoritos**
- Adicionar/remover cursos dos favoritos
- Lista personalizada de favoritos

### **Upload de Arquivos**
- Avatar do usuário
- Imagens dos cursos
- Integração com Cloudinary

### **Autenticação**
- JWT tokens
- Login com Google OAuth
- Reset de senha por email
- Middleware de autenticação

---

## 🔐 **MIDDLEWARE ESSENCIAL**

### **Autenticação**
```javascript
// Verificar JWT token
// Verificar se usuário existe
// Adicionar userId ao req
```

### **Autorização**
```javascript
// Verificar se é instrutor
// Verificar se é dono do curso
// Verificar se está matriculado
```

### **Validação**
```javascript
// Validar dados de entrada
// Sanitizar dados
// Verificar tipos e formatos
```

### **Upload**
```javascript
// Multer para upload
// Validação de tipos de arquivo
// Redimensionamento de imagens
```

---

## 📧 **SERVIÇOS EXTERNOS**

### **Email Service**
- Nodemailer para envio de emails
- Templates para reset de senha
- Notificações de aulas
- Confirmações de matrícula

### **Zoom Service**
- API do Zoom para criar meetings
- Gerar links automáticos
- Gerenciar gravações

### **Payment Service**
- Integração com Stripe/PayPal
- Processamento de pagamentos
- Webhooks para confirmação

---

## 🛡️ **SEGURANÇA**

### **Implementar:**
- Helmet para headers de segurança
- Rate limiting
- CORS configurado
- Validação e sanitização de dados
- Hash de senhas com bcrypt
- JWT com refresh tokens
- Logs de segurança

### **Variáveis de Ambiente (.env)**
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
JWT_REFRESH_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
ZOOM_API_KEY=...
ZOOM_API_SECRET=...
EMAIL_HOST=...
EMAIL_USER=...
EMAIL_PASS=...
STRIPE_SECRET_KEY=...
```

---

## 📦 **DEPENDÊNCIAS (package.json)**

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.5.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "express-rate-limit": "^6.8.1",
    "multer": "^1.4.5-lts.1",
    "cloudinary": "^1.40.0",
    "nodemailer": "^6.9.4",
    "joi": "^17.9.2",
    "dotenv": "^16.3.1",
    "express-validator": "^7.0.1",
    "passport": "^0.6.0",
    "passport-google-oauth20": "^2.0.0",
    "passport-jwt": "^4.0.1",
    "stripe": "^13.5.0",
    "axios": "^1.5.0",
    "moment": "^2.29.4",
    "cron": "^2.4.3"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.6.4",
    "supertest": "^6.3.3"
  }
}
```

---

## 🚀 **EXTRAS IMPORTANTES**

### **Implementar:**
1. **Paginação** em todas as listagens
2. **Filtros avançados** para cursos
3. **Sistema de busca** com índices MongoDB
4. **Cache** com Redis (opcional)
5. **Logs** estruturados
6. **Testes unitários** e integração
7. **Documentação** da API com Swagger
8. **Monitoramento** de performance
9. **Backup** automático do banco
10. **CI/CD** para deploy

### **Estrutura de Resposta Padrão:**
```javascript
{
  success: boolean,
  message: string,
  data: object/array,
  pagination: {
    page: number,
    limit: number,
    total: number,
    totalPages: number
  }
}
```

---

## 📊 **ESTATÍSTICAS E ANALYTICS**

Implementar endpoints para:
- Cursos mais populares
- Instrutores top-rated
- Estatísticas de usuário
- Relatórios de receita
- Métricas de engajamento

---

## 🔄 **INTEGRAÇÕES FUTURAS**

Preparar estrutura para:
- Sistema de chat em tempo real
- Videoconferência própria
- Sistema de certificados
- Gamificação
- API pública para terceiros

---

## 📋 **DADOS ESPECÍFICOS DO FRONTEND ANALISADO**

### **Campos de Usuário Identificados:**
```javascript
// Do contexto AppContext.jsx
user: {
  name: 'Murilo Celegatto Oliveira',
  email: 'murilo@swaply.com',
  avatar: null,
  credits: 10,
  bio: 'Amo aprender novos idiomas e hobbies...',
  skills: ['RPG', 'Figma', 'SQL', 'Jardinagem', 'Oratória', 'Cabeleireiro'],
  joinDate: '04/09/2025',
  stats: {
    coursesCompleted: 4,
    coursesTeaching: 7,
    totalHours: 45
  },
  favorites: [1, 3, 5]
}
```

### **Estrutura de Cursos Identificada:**
```javascript
// Dos componentes Dashboard, CourseDetails, etc.
course: {
  id: 1,
  title: 'Desenvolvimento Web Completo com React e Node.js',
  instructor: 'Enzo Fernandes',
  category: 'Empreendedorismo',
  rating: 4.3,
  students: 2000,
  price: 1, // créditos
  image: null,
  description: '...',
  totalHours: 40,
  pricePerHour: 1,
  features: ['🎥 Aulas ao vivo via Zoom', '👨‍🏫 Suporte direto...'],
  curriculum: [{
    id: 1,
    title: 'Introdução ao Desenvolvimento Web',
    duration: 2,
    lessons: ['O que é desenvolvimento web', '...']
  }],
  schedule: [
    { day: 'Segunda', time: '19:00-21:00' },
    { day: 'Quarta', time: '19:00-21:00' }
  ]
}
```

### **Sistema de Agendamento:**
```javascript
// Do ScheduleClass e Calendar
scheduledClass: {
  id: Date.now(),
  courseId: course.id,
  courseTitle: course.title,
  instructor: course.instructor,
  date: selectedDate,
  time: selectedTime,
  duration: 1,
  zoomLink: 'https://zoom.us/j/...',
  status: 'scheduled'
}
```

### **Configurações do Usuário:**
```javascript
settings: {
  theme: 'light', // 'light', 'dark', 'system'
  fontSize: 'medium', // 'small', 'medium', 'large'
  accessibility: {
    fontSizeControl: true,
    screenReader: true,
    audioDescription: true,
    vlibras: false
  },
  notifications: {
    classNotifications: true,
    interestNotifications: true,
    newCoursesNotifications: true
  }
}
```

### **Páginas e Funcionalidades Identificadas:**
- **Dashboard**: Lista de cursos, estatísticas, call-to-action
- **Auth**: Login/Cadastro com validação completa
- **Profile**: Dados do usuário, cursos completados/ensinando
- **CourseDetails**: Detalhes completos, compra, agendamento
- **Calendar**: Calendário de aulas, disponibilidade
- **Favorites**: Sistema de favoritos
- **MyCourses**: Cursos do usuário (completados/ensinando)
- **Settings**: Configurações de tema, acessibilidade, notificações
- **ScheduleClass**: Agendamento de aulas em 3 etapas

---

**Este prompt contém TUDO que você precisa para criar um backend completo e robusto para a plataforma Swaply. Implemente seguindo esta estrutura exata para garantir compatibilidade total com o frontend existente.**
