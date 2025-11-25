import apiClient, { getErrorMessage } from './client';

/**
 * Serviços de Disponibilidade
 */
const availabilityService = {
  /**
   * GET /availability/instructor
   * Obter disponibilidade do instrutor
   */
  getInstructorAvailability: async (courseId = null) => {
    try {
      const params = courseId ? { courseId } : {};
      const { data } = await apiClient.get('/availability/instructor', { params });
      return {
        success: true,
        availability: data.data,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * POST /availability/recurring
   * Adicionar disponibilidade recorrente
   */
  addRecurringAvailability: async (availabilityData) => {
    try {
      const { data } = await apiClient.post('/availability/recurring', availabilityData);
      return {
        success: true,
        availability: data.data,
        message: data.message,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * DELETE /availability/recurring/:slotId
   * Remover disponibilidade recorrente
   */
  removeRecurringAvailability: async (slotId, courseId = null) => {
    try {
      const params = courseId ? { courseId } : {};
      const { data } = await apiClient.delete(`/availability/recurring/${slotId}`, { params });
      return {
        success: true,
        availability: data.data,
        message: data.message,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * POST /availability/specific
   * Adicionar slot específico
   */
  addSpecificSlot: async (slotData) => {
    try {
      const { data } = await apiClient.post('/availability/specific', slotData);
      return {
        success: true,
        availability: data.data,
        message: data.message,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * POST /availability/block
   * Bloquear data específica
   */
  blockDate: async (blockData) => {
    try {
      const { data } = await apiClient.post('/availability/block', blockData);
      return {
        success: true,
        availability: data.data,
        message: data.message,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * GET /availability/slots
   * Obter slots disponíveis (público)
   * ⚠️ instructorId é obrigatório conforme documentação do backend
   */
  getAvailableSlots: async (params) => {
    try {
      // Validar parâmetros obrigatórios conforme documentação
      if (!params.instructorId) {
        throw new Error('instructorId é obrigatório');
      }

      const { data } = await apiClient.get('/availability/slots', { params });
      return {
        success: true,
        slots: data.data.slots || [],
        period: data.data.period,
        totalSlots: data.data.totalSlots,
        settings: data.data.settings,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * GET /availability/course/:courseId
   * Obter disponibilidade de um curso
   */
  getCourseAvailability: async (courseId, startDate = null, endDate = null) => {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const { data } = await apiClient.get(`/availability/course/${courseId}`, { params });
      return {
        success: true,
        slots: data.data.slots || [],
        period: data.data.period,
        totalSlots: data.data.totalSlots,
        settings: data.data.settings,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * PUT /availability/settings
   * Atualizar configurações de disponibilidade
   */
  updateSettings: async (settingsData) => {
    try {
      const { data } = await apiClient.put('/availability/settings', settingsData);
      return {
        success: true,
        availability: data.data,
        message: data.message,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};

export default availabilityService;

