import { useState, useCallback } from 'react';
import classService from '../services/api/classes';

/**
 * Hook para gerenciar agendamento de aulas
 */
const useClasses = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Agendar uma nova aula
   */
  const scheduleClass = useCallback(async (scheduleData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await classService.scheduleClass(scheduleData);
      return { success: true, data: result.class, message: result.message };
    } catch (err) {
      const errorMessage = err.message || 'Erro ao agendar aula';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obter disponibilidade de horários para um curso
   */
  const getCourseAvailability = useCallback(async (courseId, startDate, endDate) => {
    setLoading(true);
    setError(null);
    try {
      const result = await classService.getCourseAvailability(courseId, startDate, endDate);
      return { success: true, data: result.availability };
    } catch (err) {
      const errorMessage = err.message || 'Erro ao obter disponibilidade';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Listar aulas agendadas
   */
  const getScheduledClasses = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const result = await classService.getScheduledClasses(params);
      return { 
        success: true, 
        classes: result.classes, 
        pagination: result.pagination 
      };
    } catch (err) {
      const errorMessage = err.message || 'Erro ao listar aulas';
      setError(errorMessage);
      return { success: false, error: errorMessage };
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
      return { success: true, classes: result.classes };
    } catch (err) {
      const errorMessage = err.message || 'Erro ao obter próximas aulas';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obter histórico de aulas
   */
  const getClassHistory = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const result = await classService.getClassHistory(params);
      return { 
        success: true, 
        classes: result.classes, 
        pagination: result.pagination 
      };
    } catch (err) {
      const errorMessage = err.message || 'Erro ao obter histórico';
      setError(errorMessage);
      return { success: false, error: errorMessage };
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
      return { success: true, class: result.class };
    } catch (err) {
      const errorMessage = err.message || 'Erro ao obter aula';
      setError(errorMessage);
      return { success: false, error: errorMessage };
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
      return { 
        success: true, 
        message: result.message,
        refunded: result.refunded,
        creditsRefunded: result.creditsRefunded
      };
    } catch (err) {
      const errorMessage = err.message || 'Erro ao cancelar aula';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Marcar aula como concluída (instrutor)
   */
  const completeClass = useCallback(async (classId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await classService.completeClass(classId);
      return { success: true, class: result.class, message: result.message };
    } catch (err) {
      const errorMessage = err.message || 'Erro ao marcar aula como concluída';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Avaliar aula
   */
  const rateClass = useCallback(async (classId, rating, feedback = null) => {
    setLoading(true);
    setError(null);
    try {
      const result = await classService.rateClass(classId, rating, feedback);
      return { success: true, class: result.class, message: result.message };
    } catch (err) {
      const errorMessage = err.message || 'Erro ao avaliar aula';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obter link de acesso à sala virtual (Jitsi)
   * ⚠️ Campos corretos: jitsiLink, isInstructor, isStudent (não accessUrl, role)
   */
  const getClassAccess = useCallback(async (classId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await classService.getClassAccess(classId);
      return { 
        success: true, 
        roomName: result.roomName,
        jitsiLink: result.jitsiLink,  // ⚠️ Campo correto
        isInstructor: result.isInstructor,  // ⚠️ Campo correto
        isStudent: result.isStudent,  // ⚠️ Campo correto
        classDetails: result.classDetails  // ⚠️ Campo correto
      };
    } catch (err) {
      const errorMessage = err.message || 'Erro ao obter acesso à sala';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    scheduleClass,
    getCourseAvailability,
    getScheduledClasses,
    getUpcomingClasses,
    getClassHistory,
    getClassById,
    cancelClass,
    completeClass,
    rateClass,
    getClassAccess,
  };
};

export default useClasses;

