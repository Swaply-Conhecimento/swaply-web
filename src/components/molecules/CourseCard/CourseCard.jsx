import React from 'react';
import PropTypes from 'prop-types';
import { Heart } from '@phosphor-icons/react';
import { useApp } from '../../../contexts/AppContext';
import Card from '../Card';
import Button from '../../atoms/Button';
import './CourseCard.css';

const CourseCard = ({
  id,
  title,
  instructor,
  category = 'Usuário',
  rating,
  students,
  price,
  image,
  onClick,
  className = '',
  ...props
}) => {
  const { state, actions } = useApp();
  const isFavorite = state.user.favorites.includes(id);

  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // Evita trigger do onClick do card
    actions.toggleFavorite(id);
  };
  return (
    <Card
      variant="course"
      padding="none"
      shadow="base"
      hover
      onClick={onClick}
      className={`course-card ${className}`}
      {...props}
    >
      <div className="course-card__image-container">
        {image ? (
          <img src={image} alt={title} className="course-card__image" />
        ) : (
          <div className="course-card__image course-card__image--placeholder">
            <span>📚</span>
          </div>
        )}
        <div className="course-card__category">
          {category}
        </div>
        <button 
          className={`course-card__favorite ${isFavorite ? 'course-card__favorite--active' : ''}`}
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Heart size={20} weight={isFavorite ? 'fill' : 'regular'} />
        </button>
      </div>
      
      <div className="course-card__content">
        <h3 className="course-card__title">{title}</h3>
        <p className="course-card__instructor">{instructor}</p>
        
        <div className="course-card__stats">
          {rating && (
            <div className="course-card__stat">
              <span className="course-card__icon">⭐</span>
              <span>{rating}</span>
            </div>
          )}
          {students && (
            <div className="course-card__stat">
              <span className="course-card__icon">👥</span>
              <span>{students} alunos</span>
            </div>
          )}
        </div>
        
        {price && (
          <div className="course-card__footer">
            <div className="course-card__price">
              {price} crédito{price !== 1 ? 's' : ''}
            </div>
            <Button variant="primary" size="small">
              Comprar Aula
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

CourseCard.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string.isRequired,
  instructor: PropTypes.string.isRequired,
  category: PropTypes.string,
  rating: PropTypes.number,
  students: PropTypes.number,
  price: PropTypes.number,
  image: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default CourseCard;
