import { useApp } from '../contexts';
import { authService } from '../services/api';

/**
 * Hook para operações de autenticação
 */
export const useAuth = () => {
  const { state, actions } = useApp();

  return {
    // Estado
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    user: state.user,

    // Ações
    login: actions.login,
    register: actions.register,
    logout: actions.logout,

    // Métodos adicionais
    forgotPassword: async (email) => {
      try {
        const result = await authService.forgotPassword(email);
        return { success: true, message: result.message };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    resetPassword: async (resetData) => {
      try {
        const result = await authService.resetPassword(resetData);
        return { success: true, message: result.message };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    verifyToken: async () => {
      try {
        const result = await authService.verifyToken();
        return { success: true, user: result.user };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    loginWithGoogle: () => {
      authService.loginWithGoogle();
    },

    handleOAuthCallback: () => {
      return authService.handleOAuthCallback();
    },
  };
};


