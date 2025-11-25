import { useState, useCallback } from 'react';
import { courseService } from '../services/api';
import { useApp } from '../contexts';

/**
 * Hook para operações de cursos
 */
export const useCourses = () => {
  const { state, actions } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Limpar erro
  const clearError = useCallback(() => setError(null), []);

  // Obter cursos com filtros
  const getCourses = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const result = await courseService.getCourses(filters);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar cursos
  const searchCourses = useCallback(async (searchTerm, filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const result = await courseService.searchCourses(searchTerm, filters);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obter curso por ID
  const getCourseById = useCallback(async (courseId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await courseService.getCourseById(courseId);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obter cursos em destaque
  const getFeaturedCourses = useCallback(async (limit = 6) => {
    setLoading(true);
    setError(null);
    try {
      const result = await courseService.getFeaturedCourses(limit);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obter cursos populares
  const getPopularCourses = useCallback(async (limit = 6) => {
    setLoading(true);
    setError(null);
    try {
      const result = await courseService.getPopularCourses(limit);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obter cursos recomendados
  const getRecommendedCourses = useCallback(async (userId, limit = 6) => {
    setLoading(true);
    setError(null);
    try {
      const result = await courseService.getRecommendedCourses(userId, limit);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obter categorias
  const getCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await courseService.getCategories();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Criar curso
  const createCourse = useCallback(async (courseData, imageFile = null) => {
    setLoading(true);
    setError(null);
    try {
      const result = await courseService.createCourse(courseData, imageFile);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Atualizar curso
  const updateCourse = useCallback(async (courseId, courseData, imageFile = null) => {
    setLoading(true);
    setError(null);
    try {
      const result = await courseService.updateCourse(courseId, courseData, imageFile);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Deletar curso
  const deleteCourse = useCallback(async (courseId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await courseService.deleteCourse(courseId);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Upload de imagem
  const uploadCourseImage = useCallback(async (courseId, file) => {
    setLoading(true);
    setError(null);
    try {
      const result = await courseService.uploadCourseImage(courseId, file);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Deletar imagem
  const deleteCourseImage = useCallback(async (courseId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await courseService.deleteCourseImage(courseId);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Matricular em curso
  const enrollInCourse = useCallback(async (courseId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await courseService.enrollInCourse(courseId);
      // Atualizar usuário após matrícula
      await actions.refreshUser();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [actions]);

  // Cancelar matrícula
  const unenrollFromCourse = useCallback(async (courseId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await courseService.unenrollFromCourse(courseId);
      // Atualizar usuário após cancelamento
      await actions.refreshUser();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [actions]);

  // Obter avaliações do curso
  const getCourseReviews = useCallback(async (courseId, params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const result = await courseService.getCourseReviews(courseId, params);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obter estudantes do curso
  const getCourseStudents = useCallback(async (courseId, params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const result = await courseService.getCourseStudents(courseId, params);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // Estado
    loading,
    error,
    selectedCourse: state.selectedCourse,

    // Métodos
    getCourses,
    searchCourses,
    getCourseById,
    getFeaturedCourses,
    getPopularCourses,
    getRecommendedCourses,
    getCategories,
    createCourse,
    updateCourse,
    deleteCourse,
    uploadCourseImage,
    deleteCourseImage,
    enrollInCourse,
    unenrollFromCourse,
    getCourseReviews,
    getCourseStudents,
    clearError,

    // Actions do contexto
    setSelectedCourse: actions.setSelectedCourse,
    toggleFavorite: actions.toggleFavorite,
  };
};




