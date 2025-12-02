import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { X } from '@phosphor-icons/react';
import Modal from '../../atoms/Modal';
import Button from '../../atoms/Button';
import StarRating from '../../atoms/StarRating';
import { useReviews } from '../../../hooks/useReviews';
import { useApp } from '../../../contexts';
import './CourseReviewModal.css';

const CourseReviewModal = ({ 
  isOpen, 
  onClose, 
  courseId, 
  courseTitle,
  onSuccess 
}) => {
  const { actions } = useApp();
  const { createReviewWithValidation, loading, error: reviewError } = useReviews();
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Por favor, selecione uma avaliação');
      return;
    }

    setError(null);

    try {
      const result = await createReviewWithValidation(courseId, {
        rating,
        comment: comment.trim(),
        isAnonymous
      });

      setSuccess(true);
      actions.showToast('Avaliação enviada com sucesso! Obrigado pelo feedback.', 'success');
      
      // Callback de sucesso
      if (onSuccess) {
        onSuccess(result.review);
      }

      // Fechar modal após 1.5s
      setTimeout(() => {
        handleClose();
      }, 1500);

    } catch (err) {
      const errorMessage = err.message || 'Erro ao enviar avaliação. Tente novamente.';
      setError(errorMessage);
      actions.showToast(errorMessage, 'error');
    }
  };

  const handleClose = () => {
    // Resetar estado ao fechar
    setRating(0);
    setComment('');
    setIsAnonymous(false);
    setError(null);
    setSuccess(false);
    onClose();
  };

  const displayError = error || reviewError;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      size="medium"
      title={`Avaliar Curso: ${courseTitle || 'Curso'}`}
    >
      <form onSubmit={handleSubmit} className="course-review-modal">
        <div className="course-review-modal__content">
          {success && (
            <div className="course-review-modal__success" role="alert">
              <p>Avaliação enviada com sucesso! Obrigado pelo feedback.</p>
            </div>
          )}

          {displayError && (
            <div className="course-review-modal__error" role="alert">
              <p>{displayError}</p>
            </div>
          )}

          <div className="course-review-modal__rating-section">
            <label className="course-review-modal__label">
              Como você avalia este curso? <span className="course-review-modal__required">*</span>
            </label>
            <StarRating
              rating={rating}
              onRatingChange={setRating}
              size="large"
            />
          </div>

          <div className="course-review-modal__comment-section">
            <label className="course-review-modal__label">
              Comentário (opcional)
            </label>
            <textarea
              className="course-review-modal__textarea"
              placeholder="Compartilhe sua experiência com este curso..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              maxLength={1000}
            />
            <span className="course-review-modal__char-count">
              {comment.length}/1000 caracteres
            </span>
          </div>

          <div className="course-review-modal__anonymous-section">
            <label className="course-review-modal__checkbox-label">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="course-review-modal__checkbox"
              />
              <span>Enviar avaliação anonimamente</span>
            </label>
          </div>
        </div>

        <div className="course-review-modal__actions">
          <Button 
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            type="button"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading || rating === 0}
            loading={loading}
          >
            {loading ? 'Enviando...' : 'Enviar Avaliação'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

CourseReviewModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  courseId: PropTypes.string.isRequired,
  courseTitle: PropTypes.string,
  onSuccess: PropTypes.func,
};

export default CourseReviewModal;

