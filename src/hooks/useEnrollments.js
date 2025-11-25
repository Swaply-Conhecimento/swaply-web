import { useState, useCallback } from 'react';
import enrollmentService from '../services/api/enrollments';

/**
 * Hook para gerenciar matrículas (enrollments)
 */
const useEnrollments = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Matricular-se no curso completo
   */
  const enrollInFullCourse = useCallback(async (courseId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await enrollmentService.enrollInFullCourse(courseId);
      return result;
    } catch (err) {
      const errorMessage = err.message || 'Erro ao realizar matrícula';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Comprar aula avulsa (matrícula + agendamento)
   */
  const enrollInSingleClass = useCallback(async (enrollmentData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await enrollmentService.enrollInSingleClass(enrollmentData);
      return result;
    } catch (err) {
      const errorMessage = err.message || 'Erro ao comprar aula avulsa';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Listar minhas matrículas
   */
  const getEnrollments = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const result = await enrollmentService.getEnrollments(params);
      return result;
    } catch (err) {
      const errorMessage = err.message || 'Erro ao listar matrículas';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Verificar status de matrícula em um curso
   */
  const checkEnrollmentStatus = useCallback(async (courseId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await enrollmentService.checkEnrollmentStatus(courseId);
      return result;
    } catch (err) {
      const errorMessage = err.message || 'Erro ao verificar matrícula';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obter detalhes de uma matrícula
   */
  const getEnrollmentById = useCallback(async (enrollmentId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await enrollmentService.getEnrollmentById(enrollmentId);
      return result;
    } catch (err) {
      const errorMessage = err.message || 'Erro ao obter matrícula';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Cancelar matrícula
   */
  const cancelEnrollment = useCallback(async (enrollmentId, reason = null) => {
    setLoading(true);
    setError(null);
    try {
      const result = await enrollmentService.cancelEnrollment(enrollmentId, reason);
      return result;
    } catch (err) {
      const errorMessage = err.message || 'Erro ao cancelar matrícula';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    enrollInFullCourse,
    enrollInSingleClass,
    getEnrollments,
    checkEnrollmentStatus,
    getEnrollmentById,
    cancelEnrollment,
  };
};

export default useEnrollments;

