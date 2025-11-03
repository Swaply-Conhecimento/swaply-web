import React, { useState } from 'react';
import { 
  Bell, 
  Check, 
  Trash, 
  Clock, 
  BookOpen, 
  User, 
  Coins,
  Funnel,
  CheckCircle,
  Circle
} from '@phosphor-icons/react';
import { useApp } from '../../../contexts';
import DashboardTemplate from '../../templates/DashboardTemplate';
import Card from '../../molecules/Card';
import Button from '../../atoms/Button';
import './Notifications.css';

const Notifications = () => {
  const { state, actions } = useApp();
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'class', 'course', 'credit', 'system'

  const filteredNotifications = state.notifications
    .filter(notification => {
      // Filtrar por status de leitura
      if (filter === 'unread' && notification.isRead) return false;
      if (filter === 'read' && !notification.isRead) return false;

      // Filtrar por tipo
      if (typeFilter === 'class' && !['class_reminder', 'class_cancelled', 'class_scheduled'].includes(notification.type)) return false;
      if (typeFilter === 'course' && !['new_course', 'course_update'].includes(notification.type)) return false;
      if (typeFilter === 'credit' && !['credit_earned', 'credit_spent'].includes(notification.type)) return false;
      if (typeFilter === 'system' && !['system', 'new_student', 'instructor_message'].includes(notification.type)) return false;

      return true;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const unreadCount = state.notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = (notificationId) => {
    actions.markNotificationAsRead(notificationId);
  };

  const handleMarkAllAsRead = () => {
    actions.markAllNotificationsAsRead();
  };

  const handleDeleteNotification = (notificationId) => {
    actions.deleteNotification(notificationId);
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }

    // Navegar baseado no tipo de notificação
    if (notification.data?.courseId) {
      actions.setSelectedCourse({ id: notification.data.courseId });
      actions.setCurrentPage('course-details');
    } else if (notification.data?.page) {
      actions.setCurrentPage(notification.data.page);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'class_reminder':
      case 'class_cancelled':
      case 'class_scheduled':
        return <Clock size={20} />;
      case 'new_course':
      case 'course_update':
        return <BookOpen size={20} />;
      case 'credit_earned':
      case 'credit_spent':
        return <Coins size={20} />;
      case 'new_student':
      case 'instructor_message':
        return <User size={20} />;
      default:
        return <Bell size={20} />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'class_reminder':
        return 'warning';
      case 'class_cancelled':
        return 'danger';
      case 'class_scheduled':
      case 'new_course':
        return 'success';
      case 'credit_earned':
        return 'primary';
      case 'credit_spent':
        return 'info';
      default:
        return 'neutral';
    }
  };

  const formatDate = (date) => {
    const notificationDate = new Date(date);
    const now = new Date();
    const diffInDays = Math.floor((now - notificationDate) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return `Hoje às ${notificationDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffInDays === 1) {
      return `Ontem às ${notificationDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffInDays < 7) {
      return `${diffInDays} dias atrás`;
    } else {
      return notificationDate.toLocaleDateString('pt-BR');
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'class_reminder':
      case 'class_cancelled':
      case 'class_scheduled':
        return 'Aula';
      case 'new_course':
      case 'course_update':
        return 'Curso';
      case 'credit_earned':
      case 'credit_spent':
        return 'Crédito';
      case 'new_student':
      case 'instructor_message':
      case 'system':
        return 'Sistema';
      default:
        return 'Geral';
    }
  };

  return (
    <DashboardTemplate>
      <div className="notifications-page">
        {/* Header */}
        <div className="notifications-page__header">
          <div className="notifications-page__header-content">
            <div className="notifications-page__header-info">
              <h1 className="notifications-page__title">
                <Bell size={32} />
                Notificações
              </h1>
              <p className="notifications-page__subtitle">
                Acompanhe todas as suas notificações e atualizações
                {unreadCount > 0 && (
                  <span className="notifications-page__unread-count">
                    {unreadCount} não lida{unreadCount !== 1 ? 's' : ''}
                  </span>
                )}
              </p>
            </div>
            <div className="notifications-page__header-actions">
              {unreadCount > 0 && (
                <Button variant="outline" onClick={handleMarkAllAsRead}>
                  <CheckCircle size={20} />
                  Marcar todas como lidas
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="notifications-page__filters" padding="medium">
          <div className="notifications-page__filter-group">
            <div className="notifications-page__filter-section">
              <span className="notifications-page__filter-label">Status:</span>
              <div className="notifications-page__filter-buttons">
                <button
                  className={`notifications-page__filter-btn ${filter === 'all' ? 'notifications-page__filter-btn--active' : ''}`}
                  onClick={() => setFilter('all')}
                >
                  Todas ({state.notifications.length})
                </button>
                <button
                  className={`notifications-page__filter-btn ${filter === 'unread' ? 'notifications-page__filter-btn--active' : ''}`}
                  onClick={() => setFilter('unread')}
                >
                  Não lidas ({unreadCount})
                </button>
                <button
                  className={`notifications-page__filter-btn ${filter === 'read' ? 'notifications-page__filter-btn--active' : ''}`}
                  onClick={() => setFilter('read')}
                >
                  Lidas ({state.notifications.length - unreadCount})
                </button>
              </div>
            </div>

            <div className="notifications-page__filter-section">
              <span className="notifications-page__filter-label">Tipo:</span>
              <div className="notifications-page__filter-buttons">
                <button
                  className={`notifications-page__filter-btn ${typeFilter === 'all' ? 'notifications-page__filter-btn--active' : ''}`}
                  onClick={() => setTypeFilter('all')}
                >
                  <Funnel size={16} />
                  Todos
                </button>
                <button
                  className={`notifications-page__filter-btn ${typeFilter === 'class' ? 'notifications-page__filter-btn--active' : ''}`}
                  onClick={() => setTypeFilter('class')}
                >
                  <Clock size={16} />
                  Aulas
                </button>
                <button
                  className={`notifications-page__filter-btn ${typeFilter === 'course' ? 'notifications-page__filter-btn--active' : ''}`}
                  onClick={() => setTypeFilter('course')}
                >
                  <BookOpen size={16} />
                  Cursos
                </button>
                <button
                  className={`notifications-page__filter-btn ${typeFilter === 'credit' ? 'notifications-page__filter-btn--active' : ''}`}
                  onClick={() => setTypeFilter('credit')}
                >
                  <Coins size={16} />
                  Créditos
                </button>
                <button
                  className={`notifications-page__filter-btn ${typeFilter === 'system' ? 'notifications-page__filter-btn--active' : ''}`}
                  onClick={() => setTypeFilter('system')}
                >
                  <User size={16} />
                  Sistema
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Notifications List */}
        <div className="notifications-page__content">
          {filteredNotifications.length > 0 ? (
            <div className="notifications-page__list">
              {filteredNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`notifications-page__item ${!notification.isRead ? 'notifications-page__item--unread' : ''}`}
                  padding="medium"
                  hover
                >
                  <div className="notifications-page__item-content">
                    <div 
                      className="notifications-page__item-main"
                      onClick={() => handleNotificationClick(notification)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className={`notifications-page__item-icon notifications-page__item-icon--${getNotificationColor(notification.type)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>

                      <div className="notifications-page__item-body">
                        <div className="notifications-page__item-header">
                          <h3 className="notifications-page__item-title">
                            {notification.title}
                            {!notification.isRead && (
                              <Circle size={8} weight="fill" className="notifications-page__unread-indicator" />
                            )}
                          </h3>
                          <span className="notifications-page__item-type">
                            {getTypeLabel(notification.type)}
                          </span>
                        </div>

                        <p className="notifications-page__item-message">
                          {notification.message}
                        </p>

                        <div className="notifications-page__item-meta">
                          <span className="notifications-page__item-date">
                            {formatDate(notification.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="notifications-page__item-actions">
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="small"
                          onClick={() => handleMarkAsRead(notification.id)}
                          aria-label="Marcar como lida"
                        >
                          <Check size={16} />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="small"
                        onClick={() => handleDeleteNotification(notification.id)}
                        aria-label="Excluir notificação"
                        className="notifications-page__delete-btn"
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="notifications-page__empty" padding="large">
              <div className="notifications-page__empty-content">
                <Bell size={64} />
                <h2>Nenhuma notificação encontrada</h2>
                <p>
                  {filter === 'unread' 
                    ? 'Você não tem notificações não lidas no momento.'
                    : filter === 'read'
                    ? 'Você não tem notificações lidas no momento.'
                    : 'Você não tem notificações no momento.'
                  }
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardTemplate>
  );
};

export default Notifications;
