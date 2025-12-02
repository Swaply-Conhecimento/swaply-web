/**
 * API Services - Swaply
 * 
 * Módulo centralizado de serviços para integração com a API
 * Base URL: https://swaply-api.onrender.com/api
 */

import apiClient, { getErrorMessage, isAuthenticated, clearAuthData } from './client';
import authService from './auth';
import userService from './users';
import courseService from './courses';
import reviewService from './reviews';
import notificationService from './notifications';
import classService from './classes';
import feedbackService from './feedback';

/**
 * Exportação de serviços organizados por domínio
 */
export const api = {
  // Autenticação
  auth: authService,

  // Usuários
  users: userService,

  // Cursos
  courses: courseService,

  // Avaliações
  reviews: reviewService,

  // Notificações
  notifications: notificationService,

  // Agendamento de Aulas
  classes: classService,

  // Feedback da Plataforma
  feedback: feedbackService,

  // Helpers
  helpers: {
    getErrorMessage,
    isAuthenticated,
    clearAuthData,
  },
};

/**
 * Exportações individuais para facilitar imports
 */
export { 
  authService, 
  userService, 
  courseService, 
  reviewService, 
  notificationService,
  classService,
  feedbackService
};

export { 
  apiClient, 
  getErrorMessage, 
  isAuthenticated, 
  clearAuthData 
};

/**
 * Exportação padrão
 */
export default api;




