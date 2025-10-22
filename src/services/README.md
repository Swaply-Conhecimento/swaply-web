# 📚 Documentação de Serviços - Swaply Frontend

Esta documentação explica como usar os serviços da API integrados ao frontend.

## 📦 Estrutura de Serviços

```
src/services/api/
├── client.js           # Cliente HTTP configurado com interceptors
├── auth.js             # Serviços de autenticação
├── users.js            # Serviços de usuários
├── courses.js          # Serviços de cursos
├── reviews.js          # Serviços de avaliações
├── notifications.js    # Serviços de notificações
└── index.js           # Exportação centralizada
```

## 🔧 Configuração

A API está configurada para usar a base URL: `https://swaply-api.onrender.com/api`

### Cliente HTTP (Axios)

O cliente HTTP está configurado com:
- **Timeout:** 30 segundos
- **Refresh automático de token:** Quando o token expira (401), automaticamente tenta renovar usando o refresh token
- **Interceptors:** Adiciona automaticamente o Bearer token em todas as requisições autenticadas
- **Tratamento de erros:** Extração de mensagens de erro consistente

## 🎣 Hooks Customizados

Use os hooks customizados para facilitar a integração nos componentes:

```jsx
import { 
  useAuth, 
  useCourses, 
  useUser, 
  useNotifications, 
  useReviews 
} from '../hooks';
```

### useAuth

```jsx
const { 
  isAuthenticated, 
  user, 
  login, 
  register, 
  logout,
  forgotPassword,
  resetPassword 
} = useAuth();

// Fazer login
const handleLogin = async () => {
  const result = await login({ email, password });
  if (result.success) {
    // Login realizado com sucesso
  } else {
    // Mostrar erro: result.error
  }
};
```

### useCourses

```jsx
const { 
  loading,
  error,
  getCourses, 
  searchCourses,
  getCourseById,
  enrollInCourse,
  createCourse
} = useCourses();

// Buscar cursos
const loadCourses = async () => {
  try {
    const { courses, pagination } = await getCourses({
      page: 1,
      limit: 10,
      category: 'Programação',
      level: 'Intermediário'
    });
    // Usar courses...
  } catch (error) {
    // Tratar erro
  }
};

// Matricular em curso
const handleEnroll = async (courseId) => {
  try {
    const result = await enrollInCourse(courseId);
    if (result.success) {
      // Matrícula realizada
    }
  } catch (error) {
    // Tratar erro
  }
};
```

### useUser

```jsx
const { 
  user,
  updateProfile,
  uploadAvatar,
  getEnrolledCourses,
  getFavorites,
  toggleFavorite
} = useUser();

// Atualizar perfil
const handleUpdateProfile = async () => {
  const result = await updateProfile({
    name: 'João Silva',
    bio: 'Desenvolvedor',
    skills: ['React', 'Node.js']
  });
};

// Upload de avatar
const handleAvatarUpload = async (file) => {
  const result = await uploadAvatar(file);
  if (result.success) {
    // Avatar atualizado: result.avatar
  }
};
```

### useNotifications

```jsx
const { 
  notifications,
  unreadCount,
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
} = useNotifications();

// Carregar notificações
const loadNotifications = async () => {
  const { notifications } = await getNotifications({
    page: 1,
    limit: 20,
    status: 'unread'
  });
};

// Marcar como lida
const handleMarkAsRead = async (notificationId) => {
  await markAsRead(notificationId);
};
```

### useReviews

```jsx
const { 
  createReview,
  updateReview,
  deleteReview,
  toggleReviewHelpful,
  respondToReview
} = useReviews();

// Criar avaliação
const handleCreateReview = async () => {
  try {
    const result = await createReview(courseId, {
      rating: 5,
      comment: 'Curso excelente!',
      isAnonymous: false
    });
  } catch (error) {
    // Tratar erro
  }
};
```

## 🚀 Uso Direto dos Serviços

Se preferir usar os serviços diretamente sem hooks:

```jsx
import { api } from '../services/api';
// ou
import { authService, courseService, userService } from '../services/api';

// Exemplo: Login
const login = async () => {
  try {
    const result = await api.auth.login({ email, password });
    // ou
    const result = await authService.login({ email, password });
  } catch (error) {
    console.error(error.message);
  }
};
```

## 📝 Exemplos Práticos

### Exemplo 1: Página de Login

```jsx
import React, { useState } from 'react';
import { useAuth } from '../hooks';

const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const result = await login({ email, password });
    
    if (!result.success) {
      setError(result.error);
    }
    // Se sucesso, o contexto já atualiza e redireciona
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      {error && <p>{error}</p>}
      <button type="submit">Entrar</button>
    </form>
  );
};
```

### Exemplo 2: Lista de Cursos

```jsx
import React, { useEffect, useState } from 'react';
import { useCourses } from '../hooks';

const CoursesList = () => {
  const { getCourses, loading, error } = useCourses();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const { courses } = await getCourses({ page: 1, limit: 10 });
        setCourses(courses);
      } catch (err) {
        console.error(err);
      }
    };

    loadCourses();
  }, [getCourses]);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      {courses.map(course => (
        <div key={course._id}>
          <h3>{course.title}</h3>
          <p>{course.description}</p>
        </div>
      ))}
    </div>
  );
};
```

### Exemplo 3: Upload de Avatar

```jsx
import React from 'react';
import { useUser } from '../hooks';

const AvatarUpload = () => {
  const { uploadAvatar } = useUser();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const result = await uploadAvatar(file);
      if (result.success) {
        alert('Avatar atualizado!');
      }
    } catch (error) {
      alert('Erro ao atualizar avatar: ' + error.message);
    }
  };

  return (
    <input 
      type="file" 
      accept="image/*" 
      onChange={handleFileChange} 
    />
  );
};
```

## 🔐 Autenticação

### Como funciona

1. **Login/Register:** Ao fazer login ou registro, os tokens são automaticamente armazenados no `localStorage`
2. **Requisições autenticadas:** O interceptor do axios adiciona automaticamente o Bearer token
3. **Refresh automático:** Quando o token expira (401), o sistema tenta renovar automaticamente
4. **Logout:** Remove os tokens e redireciona para a página de login

### Verificação de Autenticação

```jsx
import { isAuthenticated } from '../services/api';

if (isAuthenticated()) {
  // Usuário está autenticado
}
```

## 🎨 AppContext

O `AppContext` gerencia o estado global da aplicação:

- **Autenticação:** `isAuthenticated`, `token`, `user`
- **Navegação:** `currentPage`, `sidebarOpen`
- **Modais:** `modals`
- **Notificações:** `notifications`, `unreadNotificationsCount`
- **UI:** `selectedCourse`, `isReading`

```jsx
import { useApp } from '../contexts/AppContext';

const Component = () => {
  const { state, actions } = useApp();

  // Acessar estado
  console.log(state.user);
  console.log(state.isAuthenticated);

  // Usar ações
  actions.setCurrentPage('dashboard');
  actions.openModal('addCourse');
};
```

## 📊 Tratamento de Erros

Todos os serviços retornam erros de forma consistente:

```jsx
try {
  const result = await someService.method();
} catch (error) {
  // error.message contém a mensagem de erro da API
  console.error(error.message);
}
```

## 🔄 Paginação

Endpoints que retornam listas incluem paginação:

```jsx
const { courses, pagination } = await getCourses({ page: 1, limit: 10 });

console.log(pagination);
// {
//   page: 1,
//   limit: 10,
//   total: 150,
//   totalPages: 15
// }
```

## 📱 Exemplos de Filtros

### Buscar cursos por categoria e nível

```jsx
const { courses } = await getCourses({
  category: 'Programação',
  level: 'Intermediário',
  sortBy: 'rating',
  sortOrder: 'desc'
});
```

### Buscar notificações não lidas

```jsx
const { notifications } = await getNotifications({
  status: 'unread',
  type: 'class'
});
```

### Histórico de créditos com filtro de data

```jsx
const { credits } = await getCreditHistory({
  type: 'enrollment',
  startDate: '2025-01-01',
  endDate: '2025-01-31'
});
```

## 🛠️ Helpers Úteis

```jsx
import { getErrorMessage, isAuthenticated, clearAuthData } from '../services/api';

// Extrair mensagem de erro
const errorMessage = getErrorMessage(error);

// Verificar autenticação
if (isAuthenticated()) {
  // Fazer algo
}

// Limpar dados de autenticação
clearAuthData();
```

## 📚 Documentação Completa da API

Para detalhes completos de todos os endpoints, consulte: `rotasBackend.md`

---

**Base URL:** `https://swaply-api.onrender.com/api`  
**Versão:** 1.0.0  
**Status:** ✅ Integração completa implementada




