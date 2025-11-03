import { useState, useCallback } from 'react';
import { notificationService } from '../services/api';
import { useApp } from '../contexts';

/**
 * Hook para operações de notificações
 */
export const useNotifications = () => {
  const { state, actions } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Limpar erro
  const clearError = useCallback(() => setError(null), []);

  // Obter notificações
  const getNotifications = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const result = await notificationService.getNotifications(params);
      actions.loadNotifications(params);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [actions]);

  // Obter notificações recentes
  const getRecentNotifications = useCallback(async (limit = 5) => {
    setLoading(true);
    setError(null);
    try {
      const result = await notificationService.getRecentNotifications(limit);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obter contagem de não lidas
  const getUnreadCount = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await notificationService.getUnreadCount();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Marcar como lida
  const markAsRead = useCallback(async (notificationId) => {
    return await actions.markNotificationAsRead(notificationId);
  }, [actions]);

  // Marcar todas como lidas
  const markAllAsRead = useCallback(async () => {
    return await actions.markAllNotificationsAsRead();
  }, [actions]);

  // Deletar notificação
  const deleteNotification = useCallback(async (notificationId) => {
    return await actions.deleteNotification(notificationId);
  }, [actions]);

  // Limpar todas lidas
  const clearAllRead = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await notificationService.clearAllRead();
      // Recarregar notificações
      await actions.loadNotifications();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [actions]);

  // Filtros específicos
  const getUnreadNotifications = useCallback(async (params = {}) => {
    return await getNotifications({ status: 'unread', ...params });
  }, [getNotifications]);

  const getReadNotifications = useCallback(async (params = {}) => {
    return await getNotifications({ status: 'read', ...params });
  }, [getNotifications]);

  const getNotificationsByType = useCallback(async (type, params = {}) => {
    return await getNotifications({ type, ...params });
  }, [getNotifications]);

  const getClassNotifications = useCallback(async (params = {}) => {
    return await notificationService.getClassNotifications(params);
  }, []);

  const getCourseNotifications = useCallback(async (params = {}) => {
    return await notificationService.getCourseNotifications(params);
  }, []);

  const getCreditNotifications = useCallback(async (params = {}) => {
    return await notificationService.getCreditNotifications(params);
  }, []);

  const getSystemNotifications = useCallback(async (params = {}) => {
    return await notificationService.getSystemNotifications(params);
  }, []);

  return {
    // Estado
    notifications: state.notifications,
    unreadCount: state.unreadNotificationsCount,
    loading,
    error,

    // Métodos
    getNotifications,
    getRecentNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllRead,
    clearError,

    // Filtros
    getUnreadNotifications,
    getReadNotifications,
    getNotificationsByType,
    getClassNotifications,
    getCourseNotifications,
    getCreditNotifications,
    getSystemNotifications,

    // Actions do contexto
    addNotification: actions.addNotification,
  };
};




