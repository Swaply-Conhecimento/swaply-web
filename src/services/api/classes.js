import apiClient, { getErrorMessage } from './client';

/**
 * Serviços de Agendamento de Aulas
 */
const classService = {
  /**
   * POST /classes/schedule
   * Agendar nova aula
   */
  scheduleClass: async (scheduleData) => {
    try {
      const { data } = await apiClient.post('/classes/schedule', scheduleData);
      return {
        success: true,
        class: data.data,
        message: data.message,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * GET /classes/scheduled
   * Listar aulas agendadas do usuário
   */
  getScheduledClasses: async (params = {}) => {
    try {
      const { data } = await apiClient.get('/classes/scheduled', { params });
      return {
        success: true,
        classes: data.data,
        pagination: data.pagination,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * GET /classes/upcoming
   * Próximas aulas
   */
  getUpcomingClasses: async (limit = 5) => {
    try {
      const { data } = await apiClient.get('/classes/upcoming', {
        params: { limit },
      });
      return {
        success: true,
        classes: data.data,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * GET /classes/history
   * Histórico de aulas
   */
  getClassHistory: async (params = {}) => {
    try {
      const { data } = await apiClient.get('/classes/history', { params });
      return {
        success: true,
        classes: data.data,
        pagination: data.pagination,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * GET /classes/:id
   * Detalhes de uma aula específica
   */
  getClassById: async (classId) => {
    try {
      const { data } = await apiClient.get(`/classes/${classId}`);
      return {
        success: true,
        class: data.data,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * DELETE /classes/:id/cancel
   * Cancelar aula
   */
  cancelClass: async (classId, reason = null) => {
    try {
      const { data } = await apiClient.delete(`/classes/${classId}/cancel`, {
        data: { reason },
      });
      return {
        success: true,
        message: data.message,
        refunded: data.data.refunded,
        creditsRefunded: data.data.creditsRefunded,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * PUT /classes/:id/complete
   * Marcar aula como concluída
   */
  completeClass: async (classId) => {
    try {
      const { data } = await apiClient.put(`/classes/${classId}/complete`);
      return {
        success: true,
        class: data.data,
        message: data.message,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * POST /classes/:id/attendance
   * Marcar presença
   */
  markAttendance: async (classId) => {
    try {
      const { data } = await apiClient.post(`/classes/${classId}/attendance`);
      return {
        success: true,
        class: data.data,
        message: data.message,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * PUT /classes/:id/rating
   * Avaliar aula
   */
  rateClass: async (classId, rating, comment = null) => {
    try {
      const { data } = await apiClient.put(`/classes/${classId}/rating`, {
        rating,
        comment,
      });
      return {
        success: true,
        class: data.data,
        message: data.message,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * GET /classes/:id/join
   * Obter link para entrar na aula
   */
  getJoinLink: async (classId) => {
    try {
      const { data } = await apiClient.get(`/classes/${classId}/join`);
      return {
        success: true,
        ...data.data,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * GET /courses/:id/availability
   * Verificar disponibilidade de horários
   */
  getAvailability: async (courseId, startDate, endDate) => {
    try {
      const { data } = await apiClient.get(`/courses/${courseId}/availability`, {
        params: { startDate, endDate },
      });
      return {
        success: true,
        availability: data.data.availability,
        instructorSchedule: data.data.instructorSchedule,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * GET /users/calendar
   * Obter calendário do usuário
   */
  getUserCalendar: async (month, year, view = 'month') => {
    try {
      const { data } = await apiClient.get('/users/calendar', {
        params: { month, year, view },
      });
      return {
        success: true,
        events: data.data.events,
        summary: data.data.summary,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * GET /instructors/:id/calendar
   * Obter calendário público do instrutor
   */
  getInstructorCalendar: async (instructorId, month, year) => {
    try {
      const { data } = await apiClient.get(
        `/instructors/${instructorId}/calendar`,
        { params: { month, year } }
      );
      return {
        success: true,
        instructor: data.data.instructor,
        availability: data.data.availability,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};

export default classService;


