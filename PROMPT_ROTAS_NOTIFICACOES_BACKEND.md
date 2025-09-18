# 🔔 PROMPT: ROTAS DE NOTIFICAÇÕES - BACKEND SWAPLY

## 📋 **CONTEXTO**
Implementar as rotas de notificações no backend Node.js + Express + MongoDB Atlas para suportar o sistema de notificações já criado no frontend React da plataforma Swaply.

---

## 🎯 **FUNCIONALIDADES DO FRONTEND QUE PRECISAM SER SUPORTADAS**

### **NotificationBell Component:**
- Buscar notificações não lidas (contador do badge)
- Buscar as 5 notificações mais recentes
- Marcar notificação específica como lida
- Marcar todas as notificações como lidas

### **Página de Notificações:**
- Listar todas as notificações com paginação
- Filtrar por status (todas, não lidas, lidas)
- Filtrar por tipo (aulas, cursos, créditos, sistema)
- Marcar notificação como lida
- Excluir notificação
- Marcar todas como lidas

---

## 🗄️ **MODELO DE NOTIFICAÇÃO (MongoDB)**

```javascript
// models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'class_reminder',
      'class_cancelled', 
      'class_scheduled',
      'new_course',
      'course_update',
      'credit_earned',
      'credit_spent',
      'new_student',
      'instructor_message',
      'system'
    ]
  },
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  message: {
    type: String,
    required: true,
    maxlength: 500
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Índices compostos para performance
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, type: 1, createdAt: -1 });

// Middleware para atualizar updatedAt
notificationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Notification', notificationSchema);
```

---

## 🛣️ **ROTAS DE NOTIFICAÇÕES (/api/notifications)**

### **1. GET /api/notifications**
**Listar notificações do usuário com filtros e paginação**

```javascript
// routes/notifications.js
const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

// GET /api/notifications
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      page = 1,
      limit = 20,
      status = 'all', // 'all', 'unread', 'read'
      type = 'all',   // 'all', 'class', 'course', 'credit', 'system'
      sort = 'desc'   // 'asc', 'desc'
    } = req.query;

    // Construir filtro
    const filter = { userId };

    // Filtro por status
    if (status === 'unread') {
      filter.isRead = false;
    } else if (status === 'read') {
      filter.isRead = true;
    }

    // Filtro por tipo
    if (type !== 'all') {
      const typeMap = {
        'class': ['class_reminder', 'class_cancelled', 'class_scheduled'],
        'course': ['new_course', 'course_update'],
        'credit': ['credit_earned', 'credit_spent'],
        'system': ['system', 'new_student', 'instructor_message']
      };
      
      if (typeMap[type]) {
        filter.type = { $in: typeMap[type] };
      }
    }

    // Configurar paginação
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = sort === 'asc' ? 1 : -1;

    // Buscar notificações
    const notifications = await Notification.find(filter)
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Contar total
    const total = await Notification.countDocuments(filter);
    const totalPages = Math.ceil(total / parseInt(limit));

    // Contar não lidas
    const unreadCount = await Notification.countDocuments({
      userId,
      isRead: false
    });

    res.json({
      success: true,
      data: notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      unreadCount
    });

  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar notificações'
    });
  }
});
```

### **2. GET /api/notifications/recent**
**Buscar notificações recentes para o dropdown**

```javascript
// GET /api/notifications/recent
router.get('/recent', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 5;

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    const unreadCount = await Notification.countDocuments({
      userId,
      isRead: false
    });

    res.json({
      success: true,
      data: notifications,
      unreadCount
    });

  } catch (error) {
    console.error('Error fetching recent notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar notificações recentes'
    });
  }
});
```

### **3. GET /api/notifications/unread-count**
**Contar notificações não lidas**

```javascript
// GET /api/notifications/unread-count
router.get('/unread-count', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const unreadCount = await Notification.countDocuments({
      userId,
      isRead: false
    });

    res.json({
      success: true,
      data: { unreadCount }
    });

  } catch (error) {
    console.error('Error counting unread notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao contar notificações não lidas'
    });
  }
});
```

### **4. PUT /api/notifications/:id/read**
**Marcar notificação específica como lida**

```javascript
// PUT /api/notifications/:id/read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { isRead: true, updatedAt: new Date() },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notificação não encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Notificação marcada como lida',
      data: notification
    });

  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao marcar notificação como lida'
    });
  }
});
```

### **5. PUT /api/notifications/mark-all-read**
**Marcar todas as notificações como lidas**

```javascript
// PUT /api/notifications/mark-all-read
router.put('/mark-all-read', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await Notification.updateMany(
      { userId, isRead: false },
      { isRead: true, updatedAt: new Date() }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} notificações marcadas como lidas`,
      data: {
        modifiedCount: result.modifiedCount
      }
    });

  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao marcar todas as notificações como lidas'
    });
  }
});
```

### **6. DELETE /api/notifications/:id**
**Excluir notificação específica**

```javascript
// DELETE /api/notifications/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      userId
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notificação não encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Notificação excluída com sucesso'
    });

  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao excluir notificação'
    });
  }
});
```

### **7. DELETE /api/notifications/clear-all**
**Excluir todas as notificações lidas**

```javascript
// DELETE /api/notifications/clear-all
router.delete('/clear-all', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await Notification.deleteMany({
      userId,
      isRead: true
    });

    res.json({
      success: true,
      message: `${result.deletedCount} notificações excluídas`,
      data: {
        deletedCount: result.deletedCount
      }
    });

  } catch (error) {
    console.error('Error clearing notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao limpar notificações'
    });
  }
});
```

### **8. POST /api/notifications**
**Criar nova notificação (para sistema interno)**

```javascript
// POST /api/notifications
router.post('/', auth, async (req, res) => {
  try {
    const {
      userId,
      type,
      title,
      message,
      data = {}
    } = req.body;

    // Validar dados obrigatórios
    if (!userId || !type || !title || !message) {
      return res.status(400).json({
        success: false,
        message: 'userId, type, title e message são obrigatórios'
      });
    }

    // Validar tipo
    const validTypes = [
      'class_reminder', 'class_cancelled', 'class_scheduled',
      'new_course', 'course_update',
      'credit_earned', 'credit_spent',
      'new_student', 'instructor_message', 'system'
    ];

    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Tipo de notificação inválido'
      });
    }

    const notification = new Notification({
      userId,
      type,
      title,
      message,
      data
    });

    await notification.save();

    res.status(201).json({
      success: true,
      message: 'Notificação criada com sucesso',
      data: notification
    });

  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar notificação'
    });
  }
});

module.exports = router;
```

---

## 🔧 **SERVIÇO DE NOTIFICAÇÕES**

### **Criar serviço para envio automático de notificações**

```javascript
// services/notificationService.js
const Notification = require('../models/Notification');

class NotificationService {
  
  // Criar notificação
  static async createNotification(userId, type, title, message, data = {}) {
    try {
      const notification = new Notification({
        userId,
        type,
        title,
        message,
        data
      });

      await notification.save();
      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Notificação de lembrete de aula
  static async createClassReminder(userId, courseTitle, instructorName, timeMinutes) {
    return this.createNotification(
      userId,
      'class_reminder',
      'Lembrete de Aula',
      `Você tem uma aula de "${courseTitle}" em ${timeMinutes} minutos com ${instructorName}.`,
      { courseTitle, instructorName, timeMinutes }
    );
  }

  // Notificação de créditos recebidos
  static async createCreditEarned(userId, credits, courseTitle) {
    return this.createNotification(
      userId,
      'credit_earned',
      'Créditos Recebidos',
      `Você ganhou ${credits} crédito${credits > 1 ? 's' : ''} por ensinar a aula de "${courseTitle}".`,
      { credits, courseTitle }
    );
  }

  // Notificação de novo curso
  static async createNewCourse(userId, courseTitle, category) {
    return this.createNotification(
      userId,
      'new_course',
      'Novo Curso Disponível',
      `Um novo curso "${courseTitle}" foi adicionado na categoria ${category}.`,
      { courseTitle, category }
    );
  }

  // Notificação de aula agendada
  static async createClassScheduled(userId, courseTitle, date, time) {
    return this.createNotification(
      userId,
      'class_scheduled',
      'Aula Agendada',
      `Sua aula de "${courseTitle}" foi agendada para ${date} às ${time}.`,
      { courseTitle, date, time }
    );
  }

  // Notificação de novo aluno
  static async createNewStudent(instructorId, studentName, courseTitle) {
    return this.createNotification(
      instructorId,
      'new_student',
      'Novo Aluno',
      `${studentName} se inscreveu no seu curso "${courseTitle}".`,
      { studentName, courseTitle }
    );
  }

  // Notificação de créditos gastos
  static async createCreditSpent(userId, credits, courseTitle) {
    return this.createNotification(
      userId,
      'credit_spent',
      'Créditos Utilizados',
      `Você utilizou ${credits} crédito${credits > 1 ? 's' : ''} para agendar uma aula de "${courseTitle}".`,
      { credits, courseTitle }
    );
  }

  // Notificação de aula cancelada
  static async createClassCancelled(userId, courseTitle, refundedCredits) {
    return this.createNotification(
      userId,
      'class_cancelled',
      'Aula Cancelada',
      `A aula de "${courseTitle}" foi cancelada. ${refundedCredits > 0 ? `Seus ${refundedCredits} créditos foram reembolsados.` : ''}`,
      { courseTitle, refundedCredits }
    );
  }

  // Notificação do sistema
  static async createSystemNotification(userId, title, message, data = {}) {
    return this.createNotification(
      userId,
      'system',
      title,
      message,
      data
    );
  }

  // Notificar todos os usuários (para atualizações do sistema)
  static async notifyAllUsers(title, message, data = {}) {
    const User = require('../models/User');
    const users = await User.find({ isActive: true }).select('_id');
    
    const notifications = users.map(user => ({
      userId: user._id,
      type: 'system',
      title,
      message,
      data
    }));

    await Notification.insertMany(notifications);
    return notifications.length;
  }

  // Limpar notificações antigas (rodar como cron job)
  static async cleanupOldNotifications(daysOld = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await Notification.deleteMany({
      createdAt: { $lt: cutoffDate },
      isRead: true
    });

    return result.deletedCount;
  }
}

module.exports = NotificationService;
```

---

## 🔗 **INTEGRAÇÃO COM OUTRAS FUNCIONALIDADES**

### **1. Ao agendar uma aula:**
```javascript
// Em classController.js
const NotificationService = require('../services/notificationService');

// Após criar a aula
await NotificationService.createClassScheduled(
  studentId, 
  courseTitle, 
  formattedDate, 
  time
);

await NotificationService.createCreditSpent(
  studentId, 
  creditsUsed, 
  courseTitle
);
```

### **2. Ao completar uma aula:**
```javascript
// Notificar instrutor sobre créditos recebidos
await NotificationService.createCreditEarned(
  instructorId, 
  creditsEarned, 
  courseTitle
);
```

### **3. Ao criar novo curso:**
```javascript
// Notificar usuários interessados na categoria
const interestedUsers = await User.find({
  'preferences.categories': courseCategory
});

for (const user of interestedUsers) {
  await NotificationService.createNewCourse(
    user._id, 
    courseTitle, 
    courseCategory
  );
}
```

---

## 📱 **MIDDLEWARE DE AUTENTICAÇÃO**

```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de acesso requerido'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
};

module.exports = auth;
```

---

## ⚡ **CONFIGURAÇÃO NO APP.JS**

```javascript
// app.js
const express = require('express');
const notificationRoutes = require('./routes/notifications');

const app = express();

// Middlewares
app.use(express.json());

// Rotas
app.use('/api/notifications', notificationRoutes);

module.exports = app;
```

---

## 🔄 **JOBS AUTOMÁTICOS (CRON)**

```javascript
// jobs/notificationJobs.js
const cron = require('node-cron');
const NotificationService = require('../services/notificationService');

// Limpar notificações antigas (todo domingo às 2h)
cron.schedule('0 2 * * 0', async () => {
  try {
    const deletedCount = await NotificationService.cleanupOldNotifications(30);
    console.log(`Limpeza automática: ${deletedCount} notificações antigas removidas`);
  } catch (error) {
    console.error('Erro na limpeza de notificações:', error);
  }
});

// Lembretes de aula (verificar a cada 5 minutos)
cron.schedule('*/5 * * * *', async () => {
  try {
    // Buscar aulas que começam em 30 minutos
    const upcomingClasses = await Class.find({
      date: {
        $gte: new Date(Date.now() + 25 * 60 * 1000), // 25 min
        $lte: new Date(Date.now() + 35 * 60 * 1000)  // 35 min
      },
      status: 'scheduled',
      reminderSent: { $ne: true }
    }).populate('studentId courseId');

    for (const classItem of upcomingClasses) {
      await NotificationService.createClassReminder(
        classItem.studentId._id,
        classItem.courseId.title,
        classItem.instructorName,
        30
      );

      // Marcar lembrete como enviado
      classItem.reminderSent = true;
      await classItem.save();
    }

  } catch (error) {
    console.error('Erro ao enviar lembretes:', error);
  }
});
```

---

## 🧪 **TESTES**

```javascript
// tests/notifications.test.js
const request = require('supertest');
const app = require('../app');

describe('Notifications API', () => {
  
  test('GET /api/notifications should return user notifications', async () => {
    const response = await request(app)
      .get('/api/notifications')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.pagination).toBeDefined();
  });

  test('PUT /api/notifications/:id/read should mark as read', async () => {
    const response = await request(app)
      .put(`/api/notifications/${notificationId}/read`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.isRead).toBe(true);
  });

});
```

---

## 📋 **CHECKLIST DE IMPLEMENTAÇÃO**

### ✅ **Backend:**
- [ ] Criar modelo Notification no MongoDB
- [ ] Implementar todas as 8 rotas de notificações
- [ ] Criar NotificationService para automação
- [ ] Configurar middleware de autenticação
- [ ] Integrar com outras funcionalidades (aulas, cursos, créditos)
- [ ] Configurar jobs automáticos (cron)
- [ ] Implementar testes unitários
- [ ] Adicionar validações e tratamento de erros
- [ ] Configurar índices no MongoDB para performance
- [ ] Documentar API no Swagger

### ✅ **Integrações:**
- [ ] Conectar com sistema de aulas
- [ ] Conectar com sistema de créditos
- [ ] Conectar com sistema de cursos
- [ ] Conectar com sistema de usuários

---

**Este prompt contém TUDO necessário para implementar um sistema completo de notificações no backend que funcionará perfeitamente com o frontend já criado!** 🚀
