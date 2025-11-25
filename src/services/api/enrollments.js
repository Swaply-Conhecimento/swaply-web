import apiClient, { getErrorMessage } from './client';

/**
 * Serviços de Matrículas (Enrollments)
 */
const enrollmentService = {
  /**
   * POST /enrollments/full-course
   * Matricular-se no curso completo
   */
  enrollInFullCourse: async (courseId) => {
    try {
      const { data } = await apiClient.post('/enrollments/full-course', {
        courseId,
      });
      return {
        success: true,
        enrollment: data.data.enrollment,
        remainingCredits: data.data.remainingCredits,
        message: data.message,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * POST /enrollments/single-class
   * Comprar aula avulsa (matrícula + agendamento)
   */
  enrollInSingleClass: async (enrollmentData) => {
    try {
      const { data } = await apiClient.post('/enrollments/single-class', enrollmentData);
      return {
        success: true,
        enrollment: data.data.enrollment,
        scheduledClass: data.data.scheduledClass,
        remainingCredits: data.data.remainingCredits,
        message: data.message,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * GET /enrollments
   * Listar minhas matrículas
   */
  getEnrollments: async (params = {}) => {
    try {
      const { data } = await apiClient.get('/enrollments', { params });
      return {
        success: true,
        enrollments: data.data,
        pagination: data.pagination,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * GET /enrollments/check/:courseId
   * Verificar status de matrícula em um curso
   */
  checkEnrollmentStatus: async (courseId) => {
    try {
      const { data } = await apiClient.get(`/enrollments/check/${courseId}`);
      return {
        success: true,
        enrolled: data.data.enrolled,
        canSchedule: data.data.canSchedule,
        enrollmentType: data.data.enrollmentType,
        enrollment: data.data.enrollment,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * GET /enrollments/:id
   * Obter detalhes de uma matrícula
   */
  getEnrollmentById: async (enrollmentId) => {
    try {
      const { data } = await apiClient.get(`/enrollments/${enrollmentId}`);
      return {
        success: true,
        enrollment: data.data,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * DELETE /enrollments/:id
   * Cancelar matrícula
   */
  cancelEnrollment: async (enrollmentId, reason = null) => {
    try {
      const { data } = await apiClient.delete(`/enrollments/${enrollmentId}`, {
        data: { reason },
      });
      return {
        success: true,
        enrollment: data.data.enrollment,
        refundAmount: data.data.refundAmount,
        refunded: data.data.refunded,
        message: data.message,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};

export default enrollmentService;

