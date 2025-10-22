# 🚀 Guia de Uso Rápido - API Swaply

## ✅ Integração Completa Implementada

A integração completa com a API Swaply foi implementada seguindo as melhores práticas de desenvolvimento.

## 📦 O que foi implementado

### 1. Serviços da API (`src/services/api/`)
- ✅ **client.js** - Cliente HTTP configurado com interceptors, refresh automático de token
- ✅ **auth.js** - Autenticação (login, register, logout, reset password, OAuth)
- ✅ **users.js** - Gerenciamento de usuários (perfil, avatar, configurações, créditos, favoritos)
- ✅ **courses.js** - Cursos (CRUD, busca, filtros, matrícula, imagens)
- ✅ **reviews.js** - Avaliações (criar, editar, marcar útil, reportar, responder)
- ✅ **notifications.js** - Notificações (listar, marcar lida, deletar, contar)

### 2. Hooks Customizados (`src/hooks/`)
- ✅ **useAuth** - Hook para autenticação
- ✅ **useCourses** - Hook para operações com cursos
- ✅ **useUser** - Hook para operações de usuário
- ✅ **useNotifications** - Hook para notificações
- ✅ **useReviews** - Hook para avaliações

### 3. Context Atualizado
- ✅ **AppContext** - Gerenciamento de estado global com autenticação integrada

## 🔧 Como usar

### Exemplo 1: Login de Usuário

```jsx
import React, { useState } from 'react';
import { useAuth } from './hooks';

function LoginForm() {
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login({ email, password });
    
    if (!result.success) {
      setError(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Senha"
      />
      {error && <p style={{color: 'red'}}>{error}</p>}
      <button type="submit">Entrar</button>
    </form>
  );
}
```

### Exemplo 2: Listar Cursos

```jsx
import React, { useEffect, useState } from 'react';
import { useCourses } from './hooks';

function CourseList() {
  const { getCourses, loading, error } = useCourses();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const result = await getCourses({ 
          page: 1, 
          limit: 10,
          category: 'Programação' 
        });
        setCourses(result.courses);
      } catch (err) {
        console.error('Erro ao carregar cursos:', err);
      }
    };

    loadCourses();
  }, [getCourses]);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      <h2>Cursos Disponíveis</h2>
      {courses.map(course => (
        <div key={course._id}>
          <h3>{course.title}</h3>
          <p>{course.description}</p>
          <p>Preço: R$ {course.pricePerHour}/hora</p>
          <p>Rating: {course.rating} ⭐</p>
        </div>
      ))}
    </div>
  );
}
```

### Exemplo 3: Matricular em Curso

```jsx
import React from 'react';
import { useCourses } from './hooks';

function EnrollButton({ courseId }) {
  const { enrollInCourse, loading } = useCourses();

  const handleEnroll = async () => {
    try {
      const result = await enrollInCourse(courseId);
      if (result.success) {
        alert('Matrícula realizada com sucesso!');
      }
    } catch (error) {
      alert('Erro ao matricular: ' + error.message);
    }
  };

  return (
    <button onClick={handleEnroll} disabled={loading}>
      {loading ? 'Matriculando...' : 'Matricular'}
    </button>
  );
}
```

### Exemplo 4: Gerenciar Notificações

```jsx
import React, { useEffect, useState } from 'react';
import { useNotifications } from './hooks';

function NotificationsList() {
  const { 
    notifications, 
    unreadCount, 
    getNotifications,
    markAsRead,
    loading 
  } = useNotifications();

  useEffect(() => {
    getNotifications({ status: 'unread' });
  }, [getNotifications]);

  const handleMarkAsRead = async (notificationId) => {
    await markAsRead(notificationId);
  };

  return (
    <div>
      <h2>Notificações ({unreadCount} não lidas)</h2>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <ul>
          {notifications.map(notif => (
            <li 
              key={notif._id || notif.id}
              style={{ 
                fontWeight: notif.isRead ? 'normal' : 'bold' 
              }}
            >
              <h4>{notif.title}</h4>
              <p>{notif.message}</p>
              {!notif.isRead && (
                <button onClick={() => handleMarkAsRead(notif._id || notif.id)}>
                  Marcar como lida
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### Exemplo 5: Atualizar Perfil

```jsx
import React, { useState } from 'react';
import { useUser } from './hooks';

function ProfileEdit() {
  const { user, updateProfile, uploadAvatar } = useUser();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateProfile({ name, bio });
    
    if (result.success) {
      alert('Perfil atualizado!');
    } else {
      alert('Erro: ' + result.error);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const result = await uploadAvatar(file);
      if (result.success) {
        alert('Avatar atualizado!');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Avatar:</label>
        <input type="file" accept="image/*" onChange={handleAvatarChange} />
      </div>
      <div>
        <label>Nome:</label>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
      </div>
      <div>
        <label>Bio:</label>
        <textarea 
          value={bio} 
          onChange={(e) => setBio(e.target.value)} 
        />
      </div>
      <button type="submit">Salvar</button>
    </form>
  );
}
```

### Exemplo 6: Criar Avaliação

```jsx
import React, { useState } from 'react';
import { useReviews } from './hooks';

function ReviewForm({ courseId }) {
  const { createReviewWithValidation, loading } = useReviews();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const result = await createReviewWithValidation(courseId, {
        rating,
        comment,
        isAnonymous: false
      });
      
      if (result.success) {
        alert('Avaliação criada com sucesso!');
        setComment('');
        setRating(5);
      }
    } catch (error) {
      alert('Erro: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Rating:</label>
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
          <option value={1}>1 ⭐</option>
          <option value={2}>2 ⭐</option>
          <option value={3}>3 ⭐</option>
          <option value={4}>4 ⭐</option>
          <option value={5}>5 ⭐</option>
        </select>
      </div>
      <div>
        <label>Comentário:</label>
        <textarea 
          value={comment} 
          onChange={(e) => setComment(e.target.value)}
          maxLength={1000}
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Enviando...' : 'Enviar Avaliação'}
      </button>
    </form>
  );
}
```

## 🎯 Funcionalidades Principais

### Autenticação
- ✅ Login e Registro
- ✅ Logout
- ✅ Reset de senha
- ✅ Refresh automático de token
- ✅ OAuth Google (integrado)
- ✅ Verificação de token

### Usuários
- ✅ Perfil completo
- ✅ Upload de avatar
- ✅ Configurações
- ✅ Gerenciamento de créditos
- ✅ Favoritos
- ✅ Cursos matriculados
- ✅ Cursos ensinando
- ✅ Tornar-se instrutor
- ✅ Estatísticas

### Cursos
- ✅ CRUD completo
- ✅ Busca e filtros avançados
- ✅ Categorias
- ✅ Cursos em destaque
- ✅ Cursos populares
- ✅ Recomendações
- ✅ Matrícula/Cancelamento
- ✅ Upload de imagem
- ✅ Avaliações
- ✅ Estudantes do curso

### Avaliações
- ✅ Criar avaliação
- ✅ Editar avaliação
- ✅ Deletar avaliação
- ✅ Marcar como útil
- ✅ Reportar avaliação
- ✅ Responder (instrutor)

### Notificações
- ✅ Listar notificações
- ✅ Filtros por tipo
- ✅ Marcar como lida
- ✅ Marcar todas como lidas
- ✅ Deletar notificação
- ✅ Limpar todas lidas
- ✅ Contador de não lidas

## 🔐 Segurança

- ✅ Tokens armazenados com segurança
- ✅ Refresh automático de token
- ✅ Interceptors para adicionar Bearer token
- ✅ Tratamento de erros 401
- ✅ Logout automático em caso de token inválido

## 📚 Documentação Adicional

- **API Completa:** `rotasBackend.md`
- **Serviços:** `src/services/README.md`
- **Hooks:** Veja exemplos acima

## 🌐 Configuração da API

Base URL: `https://swaply-api.onrender.com/api`

Para alterar a URL, edite em `src/services/api/client.js`:

```javascript
const API_BASE_URL = 'https://swaply-api.onrender.com/api';
```

## 📝 Próximos Passos

1. Integre os hooks nos componentes existentes
2. Substitua dados mockados por chamadas reais à API
3. Implemente tratamento de erros em todos os componentes
4. Adicione feedback visual (loading, success, error)
5. Implemente paginação nas listagens
6. Adicione validação de formulários

## 🐛 Debugging

Para debugar requisições, você pode adicionar logs no interceptor:

```javascript
// Em src/services/api/client.js
apiClient.interceptors.request.use((config) => {
  console.log('Request:', config.method.toUpperCase(), config.url);
  return config;
});

apiClient.interceptors.response.use((response) => {
  console.log('Response:', response.status, response.data);
  return response;
});
```

## ✨ Pronto para Usar!

A integração está completa e pronta para ser usada. Todos os serviços seguem as boas práticas e a documentação oficial da API.

---

**Desenvolvido com ❤️ seguindo as melhores práticas de React e integração com APIs RESTful**




