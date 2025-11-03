import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Bell, Check, X, Clock, BookOpen, User, Coins } from '@phosphor-icons/react';
import { useApp } from '../../../contexts';
import Card from '../../molecules/Card';
import Button from '../Button';
import './NotificationBell.css';

const NotificationBell = ({ className = '' }) => {
  const { state, actions } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = state.notifications.filter(n => !n.isRead).length;

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleMarkAsRead = (notificationId) => {
    actions.markNotificationAsRead(notificationId);
  };

  const handleMarkAllAsRead = () => {
    actions.markAllNotificationsAsRead();
  };

  const handleViewAll = () => {
    setIsOpen(false);
    actions.setCurrentPage('notifications');
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

    setIsOpen(false);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'class_reminder':
      case 'class_cancelled':
      case 'class_scheduled':
        return <Clock size={16} />;
      case 'new_course':
      case 'course_update':
        return <BookOpen size={16} />;
      case 'credit_earned':
      case 'credit_spent':
        return <Coins size={16} />;
      case 'new_student':
      case 'instructor_message':
        return <User size={16} />;
      default:
        return <Bell size={16} />;
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

  const formatTimeAgo = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInMinutes = Math.floor((now - notificationDate) / (1000 * 60));

    if (diffInMinutes < 1) return 'Agora mesmo';
    if (diffInMinutes < 60) return `${diffInMinutes}m atrás`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d atrás`;
    return notificationDate.toLocaleDateString('pt-BR');
  };

  // Mostrar apenas as 5 notificações mais recentes no dropdown
  const recentNotifications = state.notifications
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className={`notification-bell ${className}`} ref={dropdownRef}>
      <button
        className={`notification-bell__trigger ${unreadCount > 0 ? 'notification-bell__trigger--has-unread' : ''}`}
        onClick={handleToggleDropdown}
        aria-label={`Notificações ${unreadCount > 0 ? `(${unreadCount} não lidas)` : ''}`}
      >
        <Bell size={20} weight={unreadCount > 0 ? 'fill' : 'regular'} />
        {unreadCount > 0 && (
          <span className="notification-bell__badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <Card className="notification-bell__dropdown" padding="none" shadow="lg">
          <div className="notification-bell__header">
            <h3 className="notification-bell__title">Notificações</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="small"
                onClick={handleMarkAllAsRead}
                className="notification-bell__mark-all"
              >
                <Check size={14} />
                Marcar todas como lidas
              </Button>
            )}
          </div>

          <div className="notification-bell__list">
            {recentNotifications.length > 0 ? (
              recentNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-bell__item ${!notification.isRead ? 'notification-bell__item--unread' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                  role="button"
                  tabIndex={0}
                >
                  <div className={`notification-bell__icon notification-bell__icon--${getNotificationColor(notification.type)}`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="notification-bell__content">
                    <div className="notification-bell__message">
                      <strong>{notification.title}</strong>
                      <p>{notification.message}</p>
                    </div>
                    <div className="notification-bell__meta">
                      <span className="notification-bell__time">
                        {formatTimeAgo(notification.createdAt)}
                      </span>
                      {!notification.isRead && (
                        <button
                          className="notification-bell__mark-read"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(notification.id);
                          }}
                          aria-label="Marcar como lida"
                        >
                          <Check size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="notification-bell__empty">
                <Bell size={32} />
                <p>Nenhuma notificação</p>
              </div>
            )}
          </div>

          <div className="notification-bell__footer">
            <Button
              variant="ghost"
              size="small"
              fullWidth
              onClick={handleViewAll}
            >
              Ver todas as notificações
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

NotificationBell.propTypes = {
  className: PropTypes.string,
};

export default NotificationBell;
