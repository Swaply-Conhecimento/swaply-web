import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  Star, 
  PencilSimple, 
  Trash, 
  ThumbsUp,
  User,
  ChatCircle
} from '@phosphor-icons/react';
import { useApp } from '../../../contexts';
import { useCourses } from '../../../hooks/useCourses';
import { useReviews } from '../../../hooks/useReviews';
import Card from '../../molecules/Card';
import Button from '../../atoms/Button';
import FormField from '../../molecules/FormField';
import './CourseReviews.css';

const CourseReviews = ({ courseId, onReviewSubmit }) => {
  const { state } = useApp();
  const { getCourseReviews } = useCourses();
  const { 
    createReview, 
    updateReview, 
    deleteReview, 
    markReviewAsHelpful,
    unmarkReviewAsHelpful,
    loading 
  } = useReviews();

  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [error, setError] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ''
  });

  const currentUserId = state.user?._id || state.user?.id;

  // Carregar avaliações
  useEffect(() => {
    if (courseId) {
      loadReviews();
    }
  }, [courseId]);

  const loadReviews = async () => {
    if (!courseId) return;
    
    setLoadingReviews(true);
    setError(null);
    try {
      const result = await getCourseReviews(courseId);
      if (result.success) {
        setReviews(result.reviews || []);
        setStats(result.stats || null);
      }
    } catch (err) {
      console.error('Erro ao carregar avaliações:', err);
      setError(err.message || 'Erro ao carregar avaliações');
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!courseId) return;

    setError(null);
    try {
      let result;
      if (editingReview) {
        // Atualizar avaliação existente
        result = await updateReview(editingReview._id || editingReview.id, reviewForm);
      } else {
        // Criar nova avaliação
        result = await createReview(courseId, reviewForm);
      }

      if (result.success) {
        // Recarregar avaliações
        await loadReviews();
        
        // Limpar formulário
        setReviewForm({ rating: 5, comment: '' });
        setShowReviewForm(false);
        setEditingReview(null);
        
        // Callback para atualizar dados do curso
        if (onReviewSubmit) {
          onReviewSubmit(result.review);
        }
      }
    } catch (err) {
      console.error('Erro ao salvar avaliação:', err);
      setError(err.message || 'Erro ao salvar avaliação');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta avaliação?')) {
      return;
    }

    try {
      const result = await deleteReview(reviewId);
      if (result.success) {
        await loadReviews();
      }
    } catch (err) {
      console.error('Erro ao deletar avaliação:', err);
      setError(err.message || 'Erro ao deletar avaliação');
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setReviewForm({
      rating: review.rating || 5,
      comment: review.comment || ''
    });
    setShowReviewForm(true);
  };

  const handleToggleHelpful = async (reviewId, isHelpful) => {
    try {
      if (isHelpful) {
        await unmarkReviewAsHelpful(reviewId);
      } else {
        await markReviewAsHelpful(reviewId);
      }
      await loadReviews();
    } catch (err) {
      console.error('Erro ao marcar avaliação como útil:', err);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={20}
        weight={i < rating ? 'fill' : 'regular'}
        className={i < rating ? 'course-reviews__star--filled' : 'course-reviews__star--empty'}
      />
    ));
  };

  const isOwnReview = (review) => {
    const reviewUserId = review.user?._id || review.user?.id || review.userId;
    return reviewUserId === currentUserId;
  };

  if (loadingReviews) {
    return (
      <Card padding="large">
        <div className="course-reviews__loading">Carregando avaliações...</div>
      </Card>
    );
  }

  return (
    <Card className="course-reviews" padding="large">
      <div className="course-reviews__header">
        <h2 className="course-reviews__title">
          <Star size={24} weight="fill" />
          Avaliações
        </h2>
        {stats && (
          <div className="course-reviews__stats">
            <div className="course-reviews__rating">
              <span className="course-reviews__rating-value">{stats.averageRating?.toFixed(1) || '0.0'}</span>
              <div className="course-reviews__stars">
                {renderStars(Math.round(stats.averageRating || 0))}
              </div>
              <span className="course-reviews__total">({stats.totalReviews || 0} avaliações)</span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="course-reviews__error">
          ⚠️ {error}
        </div>
      )}

      {/* Formulário de avaliação */}
      {!showReviewForm && !editingReview && (
        <div className="course-reviews__add">
          <Button
            variant="primary"
            onClick={() => setShowReviewForm(true)}
            disabled={loading}
          >
            <Star size={18} />
            Adicionar Avaliação
          </Button>
        </div>
      )}

      {showReviewForm && (
        <div className="course-reviews__form">
          <h3 className="course-reviews__form-title">
            {editingReview ? 'Editar Avaliação' : 'Nova Avaliação'}
          </h3>
          <form onSubmit={handleSubmitReview}>
            <div className="course-reviews__form-rating">
              <label>Nota:</label>
              <div className="course-reviews__rating-input">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setReviewForm({ ...reviewForm, rating })}
                    className={`course-reviews__rating-btn ${
                      reviewForm.rating >= rating ? 'course-reviews__rating-btn--active' : ''
                    }`}
                  >
                    <Star
                      size={24}
                      weight={reviewForm.rating >= rating ? 'fill' : 'regular'}
                    />
                  </button>
                ))}
              </div>
            </div>

            <FormField
              label="Comentário (opcional)"
              name="comment"
              type="textarea"
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              placeholder="Compartilhe sua experiência com este curso..."
              fullWidth
            />

            <div className="course-reviews__form-actions">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowReviewForm(false);
                  setEditingReview(null);
                  setReviewForm({ rating: 5, comment: '' });
                }}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                disabled={loading}
              >
                {editingReview ? 'Atualizar' : 'Enviar'} Avaliação
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de avaliações */}
      <div className="course-reviews__list">
        {reviews.length === 0 ? (
          <div className="course-reviews__empty">
            <Star size={48} weight="regular" />
            <p>Nenhuma avaliação ainda. Seja o primeiro a avaliar!</p>
          </div>
        ) : (
          reviews.map((review) => {
            const isOwn = isOwnReview(review);
            const reviewUserId = review.user?._id || review.user?.id || review.userId;
            const userName = review.user?.name || review.user?.username || 'Usuário';
            
            return (
              <div key={review._id || review.id} className="course-reviews__item">
                <div className="course-reviews__item-header">
                  <div className="course-reviews__item-user">
                    <User size={20} />
                    <span className="course-reviews__item-name">{userName}</span>
                    {isOwn && <span className="course-reviews__item-badge">Você</span>}
                  </div>
                  <div className="course-reviews__item-rating">
                    {renderStars(review.rating || 0)}
                  </div>
                </div>

                {review.comment && (
                  <div className="course-reviews__item-comment">
                    {review.comment}
                  </div>
                )}

                {review.instructorResponse && (
                  <div className="course-reviews__item-response">
                    <div className="course-reviews__item-response-header">
                      <ChatCircle size={16} />
                      <strong>Resposta do instrutor:</strong>
                    </div>
                    <p>{review.instructorResponse}</p>
                  </div>
                )}

                <div className="course-reviews__item-footer">
                  <div className="course-reviews__item-actions">
                    <button
                      type="button"
                      onClick={() => handleToggleHelpful(review._id || review.id, review.isHelpful)}
                      className={`course-reviews__helpful-btn ${
                        review.isHelpful ? 'course-reviews__helpful-btn--active' : ''
                      }`}
                    >
                      <ThumbsUp size={16} />
                      Útil ({review.helpfulCount || 0})
                    </button>
                  </div>

                  {isOwn && (
                    <div className="course-reviews__item-own-actions">
                      <button
                        type="button"
                        onClick={() => handleEditReview(review)}
                        className="course-reviews__action-btn"
                      >
                        <PencilSimple size={16} />
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteReview(review._id || review.id)}
                        className="course-reviews__action-btn course-reviews__action-btn--danger"
                      >
                        <Trash size={16} />
                        Excluir
                      </button>
                    </div>
                  )}

                  <div className="course-reviews__item-date">
                    {review.createdAt && new Date(review.createdAt).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};

CourseReviews.propTypes = {
  courseId: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  onReviewSubmit: PropTypes.func,
};

export default CourseReviews;

