import apiClient, { getErrorMessage } from './client';

/**
 * Serviços de Notificações
 */
const notificationService = {
  /**
   * GET /notifications
   * Listar notificações do usuário com filtros e paginação
   */
  getNotifications: async (params = {}) => {
    try {
      const { data } = await apiClient.get('/notifications', { params });
      return {
        success: true,
        notifications: data.data,
        pagination: data.pagination,
        unreadCount: data.unreadCount,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * GET /notifications/recent
   * Buscar notificações recentes para o dropdown
   */
  getRecentNotifications: async (limit = 5) => {
    try {
      const { data } = await apiClient.get('/notifications/recent', {
        params: { limit },
      });
      return {
        success: true,
        notifications: data.data,
        unreadCount: data.unreadCount,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * GET /notifications/unread-count
   * Contar notificações não lidas
   */
  getUnreadCount: async () => {
    try {
      const { data } = await apiClient.get('/notifications/unread-count');
      return {
        success: true,
        unreadCount: data.data.unreadCount,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * PUT /notifications/:id/read
   * Marcar notificação específica como lida
   */
  markAsRead: async (notificationId) => {
    try {
      const { data } = await apiClient.put(`/notifications/${notificationId}/read`);
      return {
        success: true,
        notification: data.data,
        message: data.message,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * PUT /notifications/mark-all-read
   * Marcar todas as notificações como lidas
   */
  markAllAsRead: async () => {
    try {
      const { data } = await apiClient.put('/notifications/mark-all-read');
      return {
        success: true,
        modifiedCount: data.data.modifiedCount,
        message: data.message,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * DELETE /notifications/:id
   * Excluir notificação específica
   */
  deleteNotification: async (notificationId) => {
    try {
      const { data } = await apiClient.delete(`/notifications/${notificationId}`);
      return {
        success: true,
        message: data.message,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * DELETE /notifications/clear-all
   * Excluir todas as notificações lidas
   */
  clearAllRead: async () => {
    try {
      const { data } = await apiClient.delete('/notifications/clear-all');
      return {
        success: true,
        deletedCount: data.data.deletedCount,
        message: data.message,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * POST /notifications
   * Criar nova notificação (uso interno do sistema)
   */
  createNotification: async (notificationData) => {
    try {
      const { data } = await apiClient.post('/notifications', notificationData);
      return {
        success: true,
        notification: data.data,
        message: data.message,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Helper para obter notificações com filtros específicos
   */
  getNotificationsByType: async (type, params = {}) => {
    return await notificationService.getNotifications({
      type,
      ...params,
    });
  },

  /**
   * Helper para obter apenas não lidas
   */
  getUnreadNotifications: async (params = {}) => {
    return await notificationService.getNotifications({
      status: 'unread',
      ...params,
    });
  },

  /**
   * Helper para obter apenas lidas
   */
  getReadNotifications: async (params = {}) => {
    return await notificationService.getNotifications({
      status: 'read',
      ...params,
    });
  },

  /**
   * Helper para filtrar notificações de aulas
   */
  getClassNotifications: async (params = {}) => {
    return await notificationService.getNotifications({
      type: 'class',
      ...params,
    });
  },

  /**
   * Helper para filtrar notificações de cursos
   */
  getCourseNotifications: async (params = {}) => {
    return await notificationService.getNotifications({
      type: 'course',
      ...params,
    });
  },

  /**
   * Helper para filtrar notificações de créditos
   */
  getCreditNotifications: async (params = {}) => {
    return await notificationService.getNotifications({
      type: 'credit',
      ...params,
    });
  },

  /**
   * Helper para filtrar notificações do sistema
   */
  getSystemNotifications: async (params = {}) => {
    return await notificationService.getNotifications({
      type: 'system',
      ...params,
    });
  },
};

export default notificationService;




