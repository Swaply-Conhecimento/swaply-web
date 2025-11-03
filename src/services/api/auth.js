import apiClient, { getErrorMessage, clearAuthData } from './client';

/**
 * Serviços de Autenticação
 */
const authService = {
  /**
   * POST /auth/register
   * Registrar novo usuário
   */
  register: async (userData) => {
    try {
      const { data } = await apiClient.post('/auth/register', userData);
      // Garantir que a API retornou token válido
      if (!data?.data?.token) {
        // Se não houver token, tratar como falha explícita
        throw new Error(data?.message || 'Token não recebido no registro');
      }

      // Armazenar tokens
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('refreshToken', data.data.refreshToken);

      return {
        success: true,
        user: data.data.user,
        token: data.data.token,
        refreshToken: data.data.refreshToken,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * POST /auth/login
   * Fazer login na plataforma
   */
  login: async (credentials) => {
    try {
      const { data } = await apiClient.post('/auth/login', credentials);
      // Se a API respondeu sem token, tratar como erro
      if (!data?.data?.token) {
        throw new Error(data?.message || 'Token não recebido no login');
      }

      // Armazenar tokens
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('refreshToken', data.data.refreshToken);

      return {
        success: true,
        user: data.data.user,
        token: data.data.token,
        refreshToken: data.data.refreshToken,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * POST /auth/logout
   * Fazer logout (invalidar refresh token)
   */
  logout: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await apiClient.post('/auth/logout', { refreshToken });
      } else {
        await apiClient.post('/auth/logout');
      }
      clearAuthData();
      return { success: true };
    } catch (error) {
      // Mesmo com erro, limpar dados locais
      clearAuthData();
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * GET /auth/verify-token
   * Verificar se o token é válido
   */
  verifyToken: async () => {
    try {
      const { data } = await apiClient.get('/auth/verify-token');
      return {
        success: true,
        user: data.data.user,
      };
    } catch (error) {
      clearAuthData();
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * POST /auth/refresh-token
   * Renovar token de acesso
   */
  refreshToken: async (refreshToken) => {
    try {
      const { data } = await apiClient.post('/auth/refresh-token', {
        refreshToken,
      });
      
      // Atualizar tokens
      if (data.data.token) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('refreshToken', data.data.refreshToken);
      }
      
      return {
        success: true,
        token: data.data.token,
        refreshToken: data.data.refreshToken,
      };
    } catch (error) {
      clearAuthData();
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * POST /auth/forgot-password
   * Solicitar reset de senha
   */
  forgotPassword: async (email) => {
    try {
      const { data } = await apiClient.post('/auth/forgot-password', { email });
      return {
        success: true,
        message: data.message,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * POST /auth/reset-password
   * Resetar senha com token
   */
  resetPassword: async (resetData) => {
    try {
      const { data } = await apiClient.post('/auth/reset-password', resetData);
      return {
        success: true,
        message: data.message,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * GET /auth/google
   * Iniciar autenticação com Google OAuth
   * Abre uma nova janela para autenticação
   */
  loginWithGoogle: () => {
    const googleAuthUrl = `${apiClient.defaults.baseURL}/auth/google`;
    window.location.href = googleAuthUrl;
  },

  /**
   * Helper para processar callback do OAuth
   * Extrai token e refreshToken da URL
   */
  handleOAuthCallback: () => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const refreshToken = params.get('refresh');
    const error = params.get('error');

    if (error) {
      return { success: false, error };
    }

    if (token && refreshToken) {
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      return { success: true, token, refreshToken };
    }

    return { success: false, error: 'No tokens received' };
  },
};

export default authService;



