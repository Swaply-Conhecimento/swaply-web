import apiClient, { getErrorMessage } from './client';

/**
 * Serviços de Avaliações
 */
const reviewService = {
  /**
   * POST /courses/:id/reviews
   * Criar avaliação para um curso
   * 
   * Nota: A API tem uma inconsistência - o courseId deve ser enviado no body
   * mesmo que o ID esteja na URL
   */
  createReview: async (courseId, reviewData) => {
    try {
      const { data } = await apiClient.post(`/courses/${courseId}/reviews`, {
        courseId, // API requer courseId no body também
        ...reviewData,
      });
      return {
        success: true,
        review: data.data,
        message: data.message,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * PUT /courses/reviews/:reviewId
   * Atualizar avaliação
   */
  updateReview: async (reviewId, reviewData) => {
    try {
      const { data } = await apiClient.put(
        `/courses/reviews/${reviewId}`,
        reviewData
      );
      return {
        success: true,
        review: data.data,
        message: data.message,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * DELETE /courses/reviews/:reviewId
   * Deletar avaliação
   */
  deleteReview: async (reviewId) => {
    try {
      const { data } = await apiClient.delete(`/courses/reviews/${reviewId}`);
      return {
        success: true,
        message: data.message,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * POST /courses/reviews/:reviewId/helpful
   * Marcar avaliação como útil
   */
  markReviewAsHelpful: async (reviewId) => {
    try {
      const { data } = await apiClient.post(
        `/courses/reviews/${reviewId}/helpful`
      );
      return {
        success: true,
        helpfulCount: data.data.helpfulCount,
        message: data.message,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * DELETE /courses/reviews/:reviewId/helpful
   * Desmarcar avaliação como útil
   */
  unmarkReviewAsHelpful: async (reviewId) => {
    try {
      const { data } = await apiClient.delete(
        `/courses/reviews/${reviewId}/helpful`
      );
      return {
        success: true,
        helpfulCount: data.data.helpfulCount,
        message: data.message,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Helper para toggle helpful
   */
  toggleReviewHelpful: async (reviewId, isHelpful) => {
    if (isHelpful) {
      return await reviewService.unmarkReviewAsHelpful(reviewId);
    } else {
      return await reviewService.markReviewAsHelpful(reviewId);
    }
  },

  /**
   * POST /courses/reviews/:reviewId/report
   * Reportar avaliação
   */
  reportReview: async (reviewId, reason) => {
    try {
      const { data } = await apiClient.post(
        `/courses/reviews/${reviewId}/report`,
        { reason }
      );
      return {
        success: true,
        message: data.message,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * POST /courses/reviews/:reviewId/respond
   * Responder a uma avaliação (instrutor)
   */
  respondToReview: async (reviewId, response) => {
    try {
      const { data } = await apiClient.post(
        `/courses/reviews/${reviewId}/respond`,
        { response }
      );
      return {
        success: true,
        review: data.data,
        message: data.message,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Helper para criar avaliação completa
   * Validação antes de enviar
   */
  createReviewWithValidation: async (courseId, reviewData) => {
    // Validações locais
    if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
      throw new Error('Rating deve ser entre 1 e 5');
    }

    if (reviewData.comment && reviewData.comment.length > 1000) {
      throw new Error('Comentário não pode ter mais de 1000 caracteres');
    }

    return await reviewService.createReview(courseId, reviewData);
  },

  /**
   * Helper para atualizar avaliação completa
   */
  updateReviewWithValidation: async (reviewId, reviewData) => {
    // Validações locais
    if (reviewData.rating && (reviewData.rating < 1 || reviewData.rating > 5)) {
      throw new Error('Rating deve ser entre 1 e 5');
    }

    if (reviewData.comment && reviewData.comment.length > 1000) {
      throw new Error('Comentário não pode ter mais de 1000 caracteres');
    }

    return await reviewService.updateReview(reviewId, reviewData);
  },
};

export default reviewService;




