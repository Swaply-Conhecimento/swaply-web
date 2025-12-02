import apiClient, { getErrorMessage } from './client';

/**
 * Serviços de Créditos e Transações
 */
const creditService = {
  /**
   * GET /users/credits
   * Obter histórico de créditos do usuário
   * 
   * Query Parameters:
   * - page (opcional): Número da página
   * - limit (opcional): Itens por página
   */
  getCreditHistory: async (params = {}) => {
    try {
      const { data } = await apiClient.get('/users/credits', { params });
      return {
        success: true,
        transactions: data.data,
        pagination: data.pagination,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * GET /users/stats
   * Obter estatísticas do usuário incluindo resumo financeiro
   */
  getUserStats: async () => {
    try {
      const { data } = await apiClient.get('/users/stats');
      return {
        success: true,
        stats: data.data,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};

export default creditService;

