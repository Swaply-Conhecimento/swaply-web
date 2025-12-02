import { useState, useCallback } from 'react';
import classService from '../services/api/classes';

/**
 * Hook customizado para gerenciar agendamento de aulas
 */
export const useScheduling = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Agendar nova aula
   */
  const scheduleClass = useCallback(async (scheduleData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await classService.scheduleClass(scheduleData);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obter aulas agendadas
   */
  const getScheduledClasses = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const result = await classService.getScheduledClasses(params);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obter próximas aulas
   */
  const getUpcomingClasses = useCallback(async (limit = 5) => {
    setLoading(true);
    setError(null);

    try {
      const result = await classService.getUpcomingClasses(limit);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obter histórico
   */
  const getClassHistory = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const result = await classService.getClassHistory(params);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obter detalhes de uma aula
   */
  const getClassById = useCallback(async (classId) => {
    setLoading(true);
    setError(null);

    try {
      const result = await classService.getClassById(classId);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Cancelar aula
   */
  const cancelClass = useCallback(async (classId, reason = null) => {
    setLoading(true);
    setError(null);

    try {
      const result = await classService.cancelClass(classId, reason);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Verificar disponibilidade
   * Conforme documentação: GET /classes/course/:courseId/availability
   */
  const checkAvailability = useCallback(
    async (courseId, startDate, endDate) => {
      setLoading(true);
      setError(null);

      try {
        const result = await classService.getCourseAvailability(
          courseId,
          startDate,
          endDate
        );
        return result;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Obter calendário do usuário
   */
  const getUserCalendar = useCallback(async (month, year, view = 'month') => {
    setLoading(true);
    setError(null);

    try {
      const result = await classService.getUserCalendar(month, year, view);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obter calendário do instrutor
   */
  const getInstructorCalendar = useCallback(async (instructorId, month, year) => {
    setLoading(true);
    setError(null);

    try {
      const result = await classService.getInstructorCalendar(instructorId, month, year);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Marcar presença
   */
  const markAttendance = useCallback(async (classId) => {
    setLoading(true);
    setError(null);

    try {
      const result = await classService.markAttendance(classId);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Concluir aula
   */
  const completeClass = useCallback(async (classId) => {
    setLoading(true);
    setError(null);

    try {
      const result = await classService.completeClass(classId);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Avaliar aula
   */
  const rateClass = useCallback(async (classId, rating, comment = null) => {
    setLoading(true);
    setError(null);

    try {
      const result = await classService.rateClass(classId, rating, comment);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obter link de acesso à sala virtual (Jitsi)
   * Conforme documentação: GET /classes/:id/access
   */
  const getJoinLink = useCallback(async (classId) => {
    setLoading(true);
    setError(null);

    try {
      const result = await classService.getClassAccess(classId);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    scheduleClass,
    getScheduledClasses,
    getUpcomingClasses,
    getClassHistory,
    getClassById,
    cancelClass,
    checkAvailability,
    getUserCalendar,
    getInstructorCalendar,
    markAttendance,
    completeClass,
    rateClass,
    getJoinLink,
  };
};

export default useScheduling;


