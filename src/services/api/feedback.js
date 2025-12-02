import apiClient, { getErrorMessage } from './client';

/**
 * Serviços de Feedback da Plataforma
 */
const feedbackService = {
  /**
   * POST /feedback/platform
   * Enviar avaliação da plataforma
   */
  submitPlatformReview: async (reviewData) => {
    try {
      const response = await apiClient.post('/feedback/platform', reviewData);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Avaliação enviada com sucesso',
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * GET /feedback/platform
   * Obter feedback do usuário atual
   */
  getUserFeedback: async () => {
    try {
      const response = await apiClient.get('/feedback/platform');
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Feedback obtido com sucesso',
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * GET /feedback/stats
   * Obter estatísticas agregadas (admin)
   */
  getFeedbackStats: async () => {
    try {
      const response = await apiClient.get('/feedback/stats');
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Estatísticas obtidas com sucesso',
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};

export default feedbackService;

// Exportação nomeada para compatibilidade
export const submitPlatformReview = feedbackService.submitPlatformReview;

