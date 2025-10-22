import { useState, useCallback } from 'react';
import { reviewService } from '../services/api';

/**
 * Hook para operações de avaliações
 */
export const useReviews = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Limpar erro
  const clearError = useCallback(() => setError(null), []);

  // Criar avaliação
  const createReview = useCallback(async (courseId, reviewData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await reviewService.createReview(courseId, reviewData);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Criar avaliação com validação
  const createReviewWithValidation = useCallback(async (courseId, reviewData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await reviewService.createReviewWithValidation(courseId, reviewData);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Atualizar avaliação
  const updateReview = useCallback(async (reviewId, reviewData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await reviewService.updateReview(reviewId, reviewData);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Atualizar avaliação com validação
  const updateReviewWithValidation = useCallback(async (reviewId, reviewData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await reviewService.updateReviewWithValidation(reviewId, reviewData);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Deletar avaliação
  const deleteReview = useCallback(async (reviewId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await reviewService.deleteReview(reviewId);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Marcar como útil
  const markReviewAsHelpful = useCallback(async (reviewId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await reviewService.markReviewAsHelpful(reviewId);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Desmarcar como útil
  const unmarkReviewAsHelpful = useCallback(async (reviewId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await reviewService.unmarkReviewAsHelpful(reviewId);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Toggle útil
  const toggleReviewHelpful = useCallback(async (reviewId, isHelpful) => {
    setLoading(true);
    setError(null);
    try {
      const result = await reviewService.toggleReviewHelpful(reviewId, isHelpful);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Reportar avaliação
  const reportReview = useCallback(async (reviewId, reason) => {
    setLoading(true);
    setError(null);
    try {
      const result = await reviewService.reportReview(reviewId, reason);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Responder avaliação (instrutor)
  const respondToReview = useCallback(async (reviewId, response) => {
    setLoading(true);
    setError(null);
    try {
      const result = await reviewService.respondToReview(reviewId, response);
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

    // Métodos
    createReview,
    createReviewWithValidation,
    updateReview,
    updateReviewWithValidation,
    deleteReview,
    markReviewAsHelpful,
    unmarkReviewAsHelpful,
    toggleReviewHelpful,
    reportReview,
    respondToReview,
    clearError,
  };
};




