import { useState, useCallback } from 'react';
import availabilityService from '../services/api/availability';

/**
 * Hook para gerenciar disponibilidade de horários
 */
const useAvailability = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Obter disponibilidade do instrutor
   */
  const getInstructorAvailability = useCallback(async (courseId = null) => {
    setLoading(true);
    setError(null);
    try {
      const result = await availabilityService.getInstructorAvailability(courseId);
      return { success: true, availability: result.availability };
    } catch (err) {
      const errorMessage = err.message || 'Erro ao obter disponibilidade';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Adicionar disponibilidade recorrente
   */
  const addRecurringAvailability = useCallback(async (availabilityData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await availabilityService.addRecurringAvailability(availabilityData);
      return { success: true, availability: result.availability, message: result.message };
    } catch (err) {
      const errorMessage = err.message || 'Erro ao adicionar disponibilidade';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Remover disponibilidade recorrente
   */
  const removeRecurringAvailability = useCallback(async (slotId, courseId = null) => {
    setLoading(true);
    setError(null);
    try {
      const result = await availabilityService.removeRecurringAvailability(slotId, courseId);
      return { success: true, availability: result.availability, message: result.message };
    } catch (err) {
      const errorMessage = err.message || 'Erro ao remover disponibilidade';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Adicionar slot específico
   */
  const addSpecificSlot = useCallback(async (slotData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await availabilityService.addSpecificSlot(slotData);
      return { success: true, availability: result.availability, message: result.message };
    } catch (err) {
      const errorMessage = err.message || 'Erro ao adicionar slot';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Bloquear data específica
   */
  const blockDate = useCallback(async (blockData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await availabilityService.blockDate(blockData);
      return { success: true, availability: result.availability, message: result.message };
    } catch (err) {
      const errorMessage = err.message || 'Erro ao bloquear data';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obter slots disponíveis (público)
   */
  const getAvailableSlots = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const result = await availabilityService.getAvailableSlots(params);
      return { 
        success: true, 
        slots: result.slots,
        period: result.period,
        totalSlots: result.totalSlots,
        settings: result.settings
      };
    } catch (err) {
      const errorMessage = err.message || 'Erro ao obter slots disponíveis';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obter disponibilidade de um curso
   */
  const getCourseAvailabilitySlots = useCallback(async (courseId, startDate = null, endDate = null) => {
    setLoading(true);
    setError(null);
    try {
      const result = await availabilityService.getCourseAvailability(courseId, startDate, endDate);
      return { 
        success: true, 
        slots: result.slots,
        period: result.period,
        totalSlots: result.totalSlots,
        settings: result.settings
      };
    } catch (err) {
      const errorMessage = err.message || 'Erro ao obter disponibilidade do curso';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Atualizar configurações de disponibilidade
   */
  const updateSettings = useCallback(async (settingsData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await availabilityService.updateSettings(settingsData);
      return { success: true, availability: result.availability, message: result.message };
    } catch (err) {
      const errorMessage = err.message || 'Erro ao atualizar configurações';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getInstructorAvailability,
    addRecurringAvailability,
    removeRecurringAvailability,
    addSpecificSlot,
    blockDate,
    getAvailableSlots,
    getCourseAvailabilitySlots,
    updateSettings,
  };
};

export default useAvailability;

