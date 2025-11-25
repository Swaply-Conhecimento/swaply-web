import apiClient, { getErrorMessage } from './client';

/**
 * Serviços de Agendamento de Aulas
 */
const classService = {
  /**
   * POST /classes/schedule
   * Agendar nova aula
   * ⚠️ ROTA CORRETA: POST /api/classes/schedule (conforme backend)
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
   * ⚠️ ROTA CORRETA: GET /api/classes/scheduled (conforme backend)
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
   * ⚠️ ROTA CORRETA: DELETE /api/classes/:id/cancel (conforme backend)
   */
  cancelClass: async (classId, reason = null) => {
    try {
      const { data } = await apiClient.delete(`/classes/${classId}/cancel`, {
        data: { reason },
      });
      return {
        success: true,
        message: data.message,
        refunded: data.data.refunded || data.data.refundAmount > 0,
        creditsRefunded: data.data.refundAmount || data.data.creditsRefunded,
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
   * 
   * Nota: A API aceita tanto 'feedback' quanto 'comment' no body
   */
  rateClass: async (classId, rating, feedback = null) => {
    try {
      const { data } = await apiClient.put(`/classes/${classId}/rating`, {
        rating,
        feedback, // Usando 'feedback' conforme documentação (pode ser 'comment' também)
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
   * GET /classes/:id/access
   * Obter link de acesso à sala virtual (Jitsi)
   * ⚠️ Campos corretos: jitsiLink, isInstructor, isStudent (não accessUrl, role)
   */
  getClassAccess: async (classId) => {
    try {
      const { data } = await apiClient.get(`/classes/${classId}/access`);
      return {
        success: true,
        roomName: data.data.roomName,
        jitsiLink: data.data.jitsiLink,  // ⚠️ Campo correto
        isInstructor: data.data.isInstructor,  // ⚠️ Campo correto
        isStudent: data.data.isStudent,  // ⚠️ Campo correto
        classDetails: data.data.classDetails,  // ⚠️ Campo correto
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * GET /classes/course/:courseId/availability
   * Verificar disponibilidade de horários do curso
   * Conforme documentação: GET /classes/course/:courseId/availability?startDate=2025-11-26&endDate=2025-11-30
   */
  getCourseAvailability: async (courseId, startDate, endDate) => {
    try {
      const { data } = await apiClient.get(`/classes/course/${courseId}/availability`, {
        params: { startDate, endDate },
      });
      return {
        success: true,
        availability: data.data,
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


