# 📝 Exemplos de Integração - Componentes Existentes

Este documento mostra como atualizar os componentes existentes para usar a API integrada.

## 1. Atualizar Auth.jsx para usar API Real

**Arquivo:** `src/components/pages/Auth/Auth.jsx`

### Antes (Mock):
```jsx
const handleSubmit = async (formData) => {
  setLoading(true);
  setError('');

  try {
    // Simular chamada da API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (mode === 'login') {
      if (formData.email === 'admin@swaply.com' && formData.password === '12345678') {
        console.log('Login successful!');
      } else {
        throw new Error('Credenciais inválidas');
      }
    }
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

### Depois (API Real):
```jsx
import React, { useState } from 'react';
import { useAuth } from '../../hooks';
import AuthTemplate from '../../templates/AuthTemplate';
import AuthForm from '../../organisms/AuthForm';
import './Auth.css';

const Auth = () => {
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, register, loginWithGoogle } = useAuth();

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError('');

    try {
      let result;
      
      if (mode === 'login') {
        result = await login({
          email: formData.email,
          password: formData.password
        });
      } else {
        result = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        });
      }

      if (!result.success) {
        setError(result.error);
      }
      // Se sucesso, o AppContext já redireciona para o dashboard
    } catch (err) {
      setError(err.message || 'Ocorreu um erro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    loginWithGoogle();
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setError('');
  };

  return (
    <AuthTemplate backgroundVariant="gradient">
      <div className="auth-page">
        <AuthForm
          mode={mode}
          onSubmit={handleSubmit}
          onModeChange={handleModeChange}
          onGoogleLogin={handleGoogleLogin}
          loading={loading}
          error={error}
        />
      </div>
    </AuthTemplate>
  );
};

export default Auth;
```

**Atualização necessária em AuthForm.jsx:**
```jsx
// Adicionar prop onGoogleLogin
const AuthForm = ({
  mode = "login",
  onSubmit,
  onModeChange,
  onGoogleLogin, // Nova prop
  loading = false,
  error,
  className = "",
}) => {
  // ...

  const handleGoogleLogin = () => {
    if (onGoogleLogin) {
      onGoogleLogin();
    }
  };

  // ... resto do componente
};

AuthForm.propTypes = {
  // ...
  onGoogleLogin: PropTypes.func,
};
```

---

## 2. Atualizar Dashboard para Carregar Cursos Reais

**Arquivo:** `src/components/pages/Dashboard/Dashboard.jsx`

```jsx
import React, { useState, useEffect } from 'react';
import { useCourses } from '../../hooks';
import DashboardTemplate from '../../templates/DashboardTemplate';
import CourseGrid from '../../organisms/CourseGrid';

const Dashboard = () => {
  const { 
    getFeaturedCourses, 
    getPopularCourses, 
    loading, 
    error 
  } = useCourses();
  
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [popularCourses, setPopularCourses] = useState([]);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        // Carregar cursos em destaque
        const featured = await getFeaturedCourses(6);
        setFeaturedCourses(featured.courses);

        // Carregar cursos populares
        const popular = await getPopularCourses(6);
        setPopularCourses(popular.courses);
      } catch (err) {
        console.error('Erro ao carregar cursos:', err);
      }
    };

    loadCourses();
  }, [getFeaturedCourses, getPopularCourses]);

  if (loading) {
    return (
      <DashboardTemplate>
        <div className="loading">Carregando cursos...</div>
      </DashboardTemplate>
    );
  }

  if (error) {
    return (
      <DashboardTemplate>
        <div className="error">Erro: {error}</div>
      </DashboardTemplate>
    );
  }

  return (
    <DashboardTemplate>
      <section className="dashboard-section">
        <h2>Cursos em Destaque</h2>
        <CourseGrid courses={featuredCourses} />
      </section>

      <section className="dashboard-section">
        <h2>Cursos Populares</h2>
        <CourseGrid courses={popularCourses} />
      </section>
    </DashboardTemplate>
  );
};

export default Dashboard;
```

---

## 3. Atualizar Notifications para usar API Real

**Arquivo:** `src/components/pages/Notifications/Notifications.jsx`

```jsx
import React, { useState, useEffect } from 'react';
import { useNotifications } from '../../hooks';
import DashboardTemplate from '../../templates/DashboardTemplate';
import './Notifications.css';

const Notifications = () => {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadNotifications();
  }, [filter]);

  const loadNotifications = async () => {
    try {
      await getNotifications({
        status: filter === 'all' ? undefined : filter,
        page: 1,
        limit: 20,
      });
    } catch (err) {
      console.error('Erro ao carregar notificações:', err);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
    } catch (err) {
      console.error('Erro ao marcar notificação:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (err) {
      console.error('Erro ao marcar todas:', err);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await deleteNotification(notificationId);
    } catch (err) {
      console.error('Erro ao deletar notificação:', err);
    }
  };

  return (
    <DashboardTemplate>
      <div className="notifications-page">
        <header className="notifications-header">
          <h1>Notificações</h1>
          <span className="unread-count">{unreadCount} não lidas</span>
          <button onClick={handleMarkAllAsRead}>
            Marcar todas como lidas
          </button>
        </header>

        <div className="notifications-filters">
          <button 
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'active' : ''}
          >
            Todas
          </button>
          <button 
            onClick={() => setFilter('unread')}
            className={filter === 'unread' ? 'active' : ''}
          >
            Não lidas
          </button>
          <button 
            onClick={() => setFilter('read')}
            className={filter === 'read' ? 'active' : ''}
          >
            Lidas
          </button>
        </div>

        {loading && <div>Carregando...</div>}
        {error && <div>Erro: {error}</div>}

        <div className="notifications-list">
          {notifications.map((notif) => (
            <div 
              key={notif._id || notif.id}
              className={`notification-item ${notif.isRead ? 'read' : 'unread'}`}
            >
              <div className="notification-content">
                <h3>{notif.title}</h3>
                <p>{notif.message}</p>
                <span className="notification-date">
                  {new Date(notif.createdAt).toLocaleString('pt-BR')}
                </span>
              </div>
              <div className="notification-actions">
                {!notif.isRead && (
                  <button onClick={() => handleMarkAsRead(notif._id || notif.id)}>
                    Marcar como lida
                  </button>
                )}
                <button onClick={() => handleDelete(notif._id || notif.id)}>
                  Deletar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardTemplate>
  );
};

export default Notifications;
```

---

## 4. Atualizar Profile para usar API Real

**Arquivo:** `src/components/pages/Profile/Profile.jsx`

```jsx
import React, { useState, useEffect } from 'react';
import { useUser } from '../../hooks';
import DashboardTemplate from '../../templates/DashboardTemplate';
import './Profile.css';

const Profile = () => {
  const { 
    user, 
    updateProfile, 
    uploadAvatar, 
    getStats,
    loading 
  } = useUser();

  const [editing, setEditing] = useState(false);
  const [stats, setStats] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    skills: [],
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        skills: user.skills || [],
      });
    }
  }, [user]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const result = await getStats();
      setStats(result.stats);
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const result = await updateProfile(formData);
      
      if (result.success) {
        alert('Perfil atualizado com sucesso!');
        setEditing(false);
      } else {
        alert('Erro: ' + result.error);
      }
    } catch (err) {
      alert('Erro ao atualizar perfil: ' + err.message);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const result = await uploadAvatar(file);
      
      if (result.success) {
        alert('Avatar atualizado!');
      } else {
        alert('Erro: ' + result.error);
      }
    } catch (err) {
      alert('Erro ao atualizar avatar: ' + err.message);
    }
  };

  return (
    <DashboardTemplate>
      <div className="profile-page">
        <div className="profile-header">
          <div className="profile-avatar">
            <img src={user?.avatar || '/default-avatar.png'} alt="Avatar" />
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: 'none' }}
              id="avatar-upload"
            />
            <label htmlFor="avatar-upload" className="avatar-upload-btn">
              Alterar foto
            </label>
          </div>

          <div className="profile-info">
            <h1>{user?.name}</h1>
            <p>{user?.email}</p>
            <p>Créditos: {user?.credits}</p>
          </div>
        </div>

        {stats && (
          <div className="profile-stats">
            <div className="stat-card">
              <h3>{stats.coursesCompleted}</h3>
              <p>Cursos Concluídos</p>
            </div>
            <div className="stat-card">
              <h3>{stats.coursesTeaching}</h3>
              <p>Cursos Ensinando</p>
            </div>
            <div className="stat-card">
              <h3>{stats.totalHours}</h3>
              <p>Horas Totais</p>
            </div>
          </div>
        )}

        <div className="profile-form">
          {editing ? (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nome</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="form-actions">
                <button type="submit" disabled={loading}>
                  Salvar
                </button>
                <button type="button" onClick={() => setEditing(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <div>
              <p><strong>Bio:</strong> {user?.bio || 'Nenhuma bio cadastrada'}</p>
              <p><strong>Habilidades:</strong> {user?.skills?.join(', ') || 'Nenhuma'}</p>
              <button onClick={() => setEditing(true)}>Editar Perfil</button>
            </div>
          )}
        </div>
      </div>
    </DashboardTemplate>
  );
};

export default Profile;
```

---

## 5. Atualizar CourseDetails para usar API Real

```jsx
import React, { useState, useEffect } from 'react';
import { useCourses, useReviews } from '../../hooks';
import DashboardTemplate from '../../templates/DashboardTemplate';

const CourseDetails = ({ courseId }) => {
  const { 
    getCourseById, 
    enrollInCourse, 
    getCourseReviews,
    loading 
  } = useCourses();
  
  const { createReviewWithValidation } = useReviews();

  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    loadCourse();
    loadReviews();
  }, [courseId]);

  const loadCourse = async () => {
    try {
      const result = await getCourseById(courseId);
      setCourse(result.course);
    } catch (err) {
      console.error('Erro ao carregar curso:', err);
    }
  };

  const loadReviews = async () => {
    try {
      const result = await getCourseReviews(courseId, { page: 1, limit: 10 });
      setReviews(result.reviews);
    } catch (err) {
      console.error('Erro ao carregar avaliações:', err);
    }
  };

  const handleEnroll = async () => {
    try {
      const result = await enrollInCourse(courseId);
      
      if (result.success) {
        alert('Matrícula realizada com sucesso!');
        loadCourse(); // Recarregar para atualizar status
      }
    } catch (err) {
      alert('Erro: ' + err.message);
    }
  };

  const handleSubmitReview = async (reviewData) => {
    try {
      await createReviewWithValidation(courseId, reviewData);
      alert('Avaliação enviada!');
      loadReviews();
      setShowReviewForm(false);
    } catch (err) {
      alert('Erro: ' + err.message);
    }
  };

  if (loading || !course) {
    return <DashboardTemplate><div>Carregando...</div></DashboardTemplate>;
  }

  return (
    <DashboardTemplate>
      <div className="course-details">
        <img src={course.image} alt={course.title} />
        <h1>{course.title}</h1>
        <p>{course.description}</p>
        
        <div className="course-info">
          <p>Instrutor: {course.instructor.name}</p>
          <p>Preço: R$ {course.pricePerHour}/hora</p>
          <p>Total de horas: {course.totalHours}h</p>
          <p>Rating: {course.rating} ⭐ ({course.totalRatings} avaliações)</p>
          <p>Vagas disponíveis: {course.spotsAvailable}/{course.maxStudents}</p>
        </div>

        {!course.isEnrolled && (
          <button onClick={handleEnroll}>
            Matricular ({course.totalPrice} créditos)
          </button>
        )}

        {course.isEnrolled && (
          <button onClick={() => setShowReviewForm(true)}>
            Avaliar Curso
          </button>
        )}

        <div className="reviews-section">
          <h2>Avaliações</h2>
          {reviews.map(review => (
            <div key={review._id} className="review-item">
              <div className="review-header">
                <strong>{review.studentId.name}</strong>
                <span>{review.rating} ⭐</span>
              </div>
              <p>{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardTemplate>
  );
};

export default CourseDetails;
```

---

## 6. Atualizar NotificationBell Component

```jsx
import React, { useEffect } from 'react';
import { useNotifications } from '../../../hooks';
import { Bell } from '@phosphor-icons/react';
import './NotificationBell.css';

const NotificationBell = () => {
  const { 
    notifications, 
    unreadCount, 
    getRecentNotifications,
    markAsRead 
  } = useNotifications();

  const [isOpen, setIsOpen] = React.useState(false);

  useEffect(() => {
    // Carregar notificações recentes ao montar
    loadRecentNotifications();

    // Polling a cada 30 segundos
    const interval = setInterval(loadRecentNotifications, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadRecentNotifications = async () => {
    try {
      await getRecentNotifications(5);
    } catch (err) {
      console.error('Erro ao carregar notificações:', err);
    }
  };

  const handleNotificationClick = async (notificationId) => {
    try {
      await markAsRead(notificationId);
      // Navegar para página de detalhes se necessário
    } catch (err) {
      console.error('Erro ao marcar notificação:', err);
    }
  };

  return (
    <div className="notification-bell">
      <button 
        className="bell-button" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="badge">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notifications-dropdown">
          <div className="dropdown-header">
            <h3>Notificações</h3>
            <span>{unreadCount} não lidas</span>
          </div>
          
          <div className="notifications-list">
            {notifications.length === 0 ? (
              <p>Nenhuma notificação</p>
            ) : (
              notifications.map(notif => (
                <div
                  key={notif._id || notif.id}
                  className={`notification-item ${notif.isRead ? 'read' : 'unread'}`}
                  onClick={() => handleNotificationClick(notif._id || notif.id)}
                >
                  <h4>{notif.title}</h4>
                  <p>{notif.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
```

---

## 🎯 Checklist de Integração

- [ ] Atualizar Auth.jsx para usar useAuth
- [ ] Atualizar Dashboard.jsx para carregar cursos reais
- [ ] Atualizar Notifications.jsx para usar API
- [ ] Atualizar Profile.jsx para usar API
- [ ] Atualizar CourseDetails.jsx para usar API
- [ ] Atualizar NotificationBell para usar API
- [ ] Atualizar Settings.jsx para usar API
- [ ] Atualizar MyCourses.jsx para usar API
- [ ] Atualizar Favorites.jsx para usar API
- [ ] Implementar tratamento de erros global
- [ ] Adicionar loading states em todos componentes
- [ ] Testar fluxo completo de autenticação
- [ ] Testar CRUD de cursos
- [ ] Testar sistema de notificações

---

**Dica:** Sempre use try-catch ao chamar os serviços da API e forneça feedback visual ao usuário (loading, success, error).




