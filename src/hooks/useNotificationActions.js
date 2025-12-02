import { useCallback } from 'react';
import { useApp } from '../contexts';

/**
 * Hook para processar ações de notificações
 */
export const useNotificationActions = () => {
  const { actions } = useApp();

  const handleNotificationClick = useCallback((notification) => {
    const { type, data } = notification;

    // Marcar como lida
    if (!notification.isRead) {
      actions.markNotificationAsRead(notification._id || notification.id);
    }

    // Processar ações específicas
    switch (data?.action) {
      case 'open_platform_review':
        actions.setCurrentPage('platform-review');
        break;

      case 'review_course':
        if (data.courseId) {
          actions.setSelectedCourse({ id: data.courseId });
          actions.setCurrentPage('course-details');
          // Armazenar flag para abrir modal de avaliação
          sessionStorage.setItem('openReviewModal', 'true');
        } else if (data.url) {
          // Se tiver URL, tentar extrair courseId ou navegar diretamente
          const urlMatch = data.url.match(/\/courses\/([^/?]+)/);
          if (urlMatch) {
            actions.setSelectedCourse({ id: urlMatch[1] });
            actions.setCurrentPage('course-details');
            sessionStorage.setItem('openReviewModal', 'true');
          }
        }
        break;

      case 'view_course':
        if (data.courseId) {
          actions.setSelectedCourse({ id: data.courseId });
          actions.setCurrentPage('course-details');
        }
        break;

      case 'view_classes':
        actions.setCurrentPage('calendar');
        break;

      default:
        // Ação padrão baseada no tipo
        if (type === 'system' && data?.url) {
          // Tentar extrair página da URL
          const urlMatch = data.url.match(/\/([^/?]+)/);
          if (urlMatch) {
            const page = urlMatch[1];
            // Mapear URLs comuns para páginas
            const pageMap = {
              'feedback': 'platform-review',
              'courses': 'course-details',
              'dashboard': 'dashboard',
              'profile': 'profile',
              'notifications': 'notifications',
            };
            const mappedPage = pageMap[page] || page;
            actions.setCurrentPage(mappedPage);
          }
        }
        break;
    }
  }, [actions]);

  return { handleNotificationClick };
};

