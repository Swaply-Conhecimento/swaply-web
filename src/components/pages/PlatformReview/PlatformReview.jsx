import React, { useState } from 'react';
import { Star } from '@phosphor-icons/react';
import { useApp } from '../../../contexts';
import DashboardTemplate from '../../templates/DashboardTemplate';
import Card from '../../molecules/Card';
import Button from '../../atoms/Button';
import StarRating from '../../atoms/StarRating';
import { feedbackService } from '../../../services/api';
import './PlatformReview.css';

const PlatformReview = () => {
  const { actions, state } = useApp();
  const [formData, setFormData] = useState({
    rating: 0,
    categories: {
      usability: 0,
      design: 0,
      performance: 0,
      support: 0
    },
    comment: '',
    suggestions: '',
    wouldRecommend: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleCategoryRating = (category, value) => {
    setFormData(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.rating === 0) {
      setError('Por favor, forneça uma avaliação geral');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await feedbackService.submitPlatformReview(formData);
      setSuccess(true);
      actions.showToast('Obrigado pelo seu feedback!', 'success');
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        actions.setCurrentPage('dashboard');
      }, 2000);
    } catch (err) {
      const errorMessage = err.message || 'Erro ao enviar avaliação. Tente novamente.';
      setError(errorMessage);
      actions.showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    actions.setCurrentPage('dashboard');
  };

  return (
    <DashboardTemplate>
      <div className="platform-review-page">
        <Card className="platform-review-page__card" padding="large">
          <div className="platform-review-page__header">
            <h1 className="platform-review-page__title">
              <Star size={32} weight="fill" />
              Avalie a Plataforma Swaply
            </h1>
            <p className="platform-review-page__subtitle">
              Sua opinião é muito importante para melhorarmos nossa plataforma!
            </p>
          </div>

          {success && (
            <div className="platform-review-page__success" role="alert">
              <p>Obrigado pelo seu feedback! Redirecionando...</p>
            </div>
          )}

          {error && (
            <div className="platform-review-page__error" role="alert">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="platform-review-page__form">
            {/* Avaliação Geral */}
            <div className="platform-review-page__section">
              <h2 className="platform-review-page__section-title">
                Como você avalia a plataforma Swaply? <span className="platform-review-page__required">*</span>
              </h2>
              <StarRating
                rating={formData.rating}
                onRatingChange={(value) => 
                  setFormData(prev => ({ ...prev, rating: value }))
                }
                size="large"
              />
            </div>

            {/* Avaliações por Categoria */}
            <div className="platform-review-page__section">
              <h2 className="platform-review-page__section-title">
                Avalie por categoria (opcional)
              </h2>
              <div className="platform-review-page__categories">
                <div className="platform-review-page__category">
                  <label className="platform-review-page__category-label">
                    Facilidade de Uso
                  </label>
                  <StarRating
                    rating={formData.categories.usability}
                    onRatingChange={(value) => 
                      handleCategoryRating('usability', value)
                    }
                    size="medium"
                  />
                </div>
                <div className="platform-review-page__category">
                  <label className="platform-review-page__category-label">
                    Design/Interface
                  </label>
                  <StarRating
                    rating={formData.categories.design}
                    onRatingChange={(value) => 
                      handleCategoryRating('design', value)
                    }
                    size="medium"
                  />
                </div>
                <div className="platform-review-page__category">
                  <label className="platform-review-page__category-label">
                    Performance
                  </label>
                  <StarRating
                    rating={formData.categories.performance}
                    onRatingChange={(value) => 
                      handleCategoryRating('performance', value)
                    }
                    size="medium"
                  />
                </div>
                <div className="platform-review-page__category">
                  <label className="platform-review-page__category-label">
                    Suporte
                  </label>
                  <StarRating
                    rating={formData.categories.support}
                    onRatingChange={(value) => 
                      handleCategoryRating('support', value)
                    }
                    size="medium"
                  />
                </div>
              </div>
            </div>

            {/* Comentário */}
            <div className="platform-review-page__section">
              <label className="platform-review-page__label">
                Comentários (opcional)
              </label>
              <textarea
                className="platform-review-page__textarea"
                placeholder="Compartilhe sua experiência geral com a plataforma..."
                value={formData.comment}
                onChange={(e) => 
                  setFormData(prev => ({ ...prev, comment: e.target.value }))
                }
                rows={4}
              />
            </div>

            {/* Sugestões */}
            <div className="platform-review-page__section">
              <label className="platform-review-page__label">
                Sugestões de Melhoria (opcional)
              </label>
              <textarea
                className="platform-review-page__textarea"
                placeholder="O que você gostaria de ver melhorado na plataforma?"
                value={formData.suggestions}
                onChange={(e) => 
                  setFormData(prev => ({ ...prev, suggestions: e.target.value }))
                }
                rows={3}
              />
            </div>

            {/* Recomendaria */}
            <div className="platform-review-page__section">
              <label className="platform-review-page__checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.wouldRecommend}
                  onChange={(e) => 
                    setFormData(prev => ({ 
                      ...prev, 
                      wouldRecommend: e.target.checked 
                    }))
                  }
                  className="platform-review-page__checkbox"
                />
                <span>Eu recomendaria a plataforma Swaply para outras pessoas</span>
              </label>
            </div>

            {/* Botões */}
            <div className="platform-review-page__actions">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
                type="button"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading || formData.rating === 0}
                loading={loading}
              >
                {loading ? 'Enviando...' : 'Enviar Avaliação'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardTemplate>
  );
};

export default PlatformReview;

