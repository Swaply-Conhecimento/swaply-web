import { useState, useCallback } from 'react';
import { userService } from '../services/api';
import { useApp } from '../contexts/AppContext';

/**
 * Hook para operações de usuário
 */
export const useUser = () => {
  const { state, actions } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Limpar erro
  const clearError = useCallback(() => setError(null), []);

  // Obter perfil
  const getProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await userService.getProfile();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Atualizar perfil
  const updateProfile = useCallback(async (profileData) => {
    return await actions.updateProfile(profileData);
  }, [actions]);

  // Upload avatar
  const uploadAvatar = useCallback(async (file) => {
    return await actions.uploadAvatar(file);
  }, [actions]);

  // Deletar avatar
  const deleteAvatar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await userService.deleteAvatar();
      await actions.refreshUser();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [actions]);

  // Obter configurações
  const getSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await userService.getSettings();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Atualizar configurações
  const updateSettings = useCallback(async (settings) => {
    return await actions.updateSettings(settings);
  }, [actions]);

  // Obter histórico de créditos
  const getCreditHistory = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const result = await userService.getCreditHistory(params);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obter saldo de créditos
  const getCreditBalance = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await userService.getCreditBalance();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obter estatísticas
  const getStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await userService.getStats();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obter favoritos
  const getFavorites = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const result = await userService.getFavorites(params);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Toggle favorito
  const toggleFavorite = useCallback(async (courseId) => {
    return await actions.toggleFavorite(courseId);
  }, [actions]);

  // Obter cursos matriculados
  const getEnrolledCourses = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const result = await userService.getEnrolledCourses(params);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obter cursos ensinando
  const getTeachingCourses = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const result = await userService.getTeachingCourses(params);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Tornar-se instrutor
  const becomeInstructor = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await userService.becomeInstructor();
      await actions.refreshUser();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [actions]);

  // Deletar conta
  const deleteAccount = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await userService.deleteAccount();
      await actions.logout();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [actions]);

  return {
    // Estado
    user: state.user,
    settings: state.settings,
    loading,
    error,

    // Métodos
    getProfile,
    updateProfile,
    uploadAvatar,
    deleteAvatar,
    getSettings,
    updateSettings,
    getCreditHistory,
    getCreditBalance,
    getStats,
    getFavorites,
    toggleFavorite,
    getEnrolledCourses,
    getTeachingCourses,
    becomeInstructor,
    deleteAccount,
    clearError,

    // Actions do contexto
    refreshUser: actions.refreshUser,
  };
};




