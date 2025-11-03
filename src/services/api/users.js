import apiClient, { getErrorMessage } from './client';

/**
 * Serviços de Usuários
 */
const userService = {
  /**
   * GET /users/profile
   * Obter perfil do usuário autenticado
   */
  getProfile: async () => {
    try {
      const { data } = await apiClient.get('/users/profile');
      return {
        success: true,
        user: data.data,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * PUT /users/profile
   * Atualizar perfil do usuário
   */
  updateProfile: async (profileData) => {
    try {
      const { data } = await apiClient.put('/users/profile', profileData);
      return {
        success: true,
        user: data.data,
        message: data.message,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * POST /users/avatar
   * Upload de avatar do usuário
   */
  uploadAvatar: async (file) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const { data } = await apiClient.post('/users/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        success: true,
        avatar: data.data.avatar,
        message: data.message,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * DELETE /users/avatar
   * Remover avatar do usuário
   */
  deleteAvatar: async () => {
    try {
      const { data } = await apiClient.delete('/users/avatar');
      return {
        success: true,
        message: data.message,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * GET /users/settings
   * Obter configurações do usuário
   */
  getSettings: async () => {
    try {
      const { data } = await apiClient.get('/users/settings');
      return {
        success: true,
        settings: data.data,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * PUT /users/settings
   * Atualizar configurações do usuário
   */
  updateSettings: async (settings) => {
    try {
      const { data } = await apiClient.put('/users/settings', settings);
      return {
        success: true,
        settings: data.data,
        message: data.message,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * GET /users/credits
   * Obter histórico de créditos
   */
  getCreditHistory: async (params = {}) => {
    try {
      const { data } = await apiClient.get('/users/credits', { params });
      return {
        success: true,
        credits: data.data,
        pagination: data.pagination,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * GET /users/credits/balance
   * Obter saldo de créditos atual
   * 
   * Nota: A API pode retornar 'balance' ou 'credits' + 'creditPrice'
   */
  getCreditBalance: async () => {
    try {
      const { data } = await apiClient.get('/users/credits/balance');
      // Suporta ambos os formatos de resposta
      const balance = data.data.balance || data.data.credits;
      const creditPrice = data.data.creditPrice;
      
      return {
        success: true,
        balance,
        credits: balance, // Mantém compatibilidade
        creditPrice,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * POST /users/credits/purchase
   * Comprar créditos (não implementado - sistema de moeda virtual)
   */
  purchaseCredits: async (amount) => {
    try {
      const { data } = await apiClient.post('/users/credits/purchase', { amount });
      return {
        success: true,
        message: data.message,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * GET /users/stats
   * Obter estatísticas do usuário
   */
  getStats: async () => {
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

  /**
   * GET /users/favorites
   * Obter cursos favoritos
   */
  getFavorites: async (params = {}) => {
    try {
      const { data } = await apiClient.get('/users/favorites', { params });
      return {
        success: true,
        favorites: data.data,
        pagination: data.pagination,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * POST /users/favorites/:courseId
   * Adicionar curso aos favoritos
   */
  addFavorite: async (courseId) => {
    try {
      const { data } = await apiClient.post(`/users/favorites/${courseId}`);
      return {
        success: true,
        message: data.message,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * DELETE /users/favorites/:courseId
   * Remover curso dos favoritos
   */
  removeFavorite: async (courseId) => {
    try {
      const { data } = await apiClient.delete(`/users/favorites/${courseId}`);
      return {
        success: true,
        message: data.message,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Helper para toggle favorito
   */
  toggleFavorite: async (courseId, isFavorite) => {
    if (isFavorite) {
      return await userService.removeFavorite(courseId);
    } else {
      return await userService.addFavorite(courseId);
    }
  },

  /**
   * GET /users/enrolled-courses
   * Obter cursos matriculados
   */
  getEnrolledCourses: async (params = {}) => {
    try {
      const { data } = await apiClient.get('/users/enrolled-courses', { params });
      return {
        success: true,
        courses: data.data,
        pagination: data.pagination,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * GET /users/teaching-courses
   * Obter cursos que está ensinando
   */
  getTeachingCourses: async (params = {}) => {
    try {
      const { data } = await apiClient.get('/users/teaching-courses', { params });
      return {
        success: true,
        courses: data.data,
        pagination: data.pagination,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * POST /users/become-instructor
   * Tornar-se instrutor
   */
  becomeInstructor: async () => {
    try {
      const { data } = await apiClient.post('/users/become-instructor');
      return {
        success: true,
        isInstructor: data.data.isInstructor,
        message: data.message,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * DELETE /users/account
   * Excluir conta do usuário
   */
  deleteAccount: async () => {
    try {
      const { data } = await apiClient.delete('/users/account');
      return {
        success: true,
        message: data.message,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * PUT /users/password
   * Alterar senha do usuário logado
   */
  changePassword: async (passwordData) => {
    try {
      const { data } = await apiClient.put('/users/password', passwordData);
      return {
        success: true,
        message: data.message,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * GET /users/reviews
   * Obter avaliações feitas pelo usuário
   */
  getUserReviews: async (params = {}) => {
    try {
      const { data } = await apiClient.get('/users/reviews', { params });
      return {
        success: true,
        reviews: data.data,
        pagination: data.pagination,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * GET /users/reviews/received
   * Obter avaliações recebidas pelo usuário (como instrutor)
   */
  getReceivedReviews: async (params = {}) => {
    try {
      const { data } = await apiClient.get('/users/reviews/received', { params });
      return {
        success: true,
        reviews: data.data,
        pagination: data.pagination,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * GET /users/reviews/stats
   * Obter estatísticas de avaliações do instrutor
   */
  getReviewStats: async () => {
    try {
      const { data } = await apiClient.get('/users/reviews/stats');
      return {
        success: true,
        stats: data.data,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};

export default userService;



