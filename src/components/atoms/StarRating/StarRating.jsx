import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Star } from '@phosphor-icons/react';
import './StarRating.css';

const StarRating = ({ 
  rating = 0, 
  onRatingChange, 
  readonly = false,
  size = 'medium',
  showLabel = true 
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  const handleClick = (value) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (!readonly) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || rating;
  const labels = ['Péssimo', 'Ruim', 'Regular', 'Bom', 'Excelente'];

  return (
    <div className="star-rating">
      <div className="star-rating__container">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            className={`star-rating__button ${readonly ? 'star-rating__button--readonly' : ''}`}
            onClick={() => handleClick(value)}
            onMouseEnter={() => handleMouseEnter(value)}
            onMouseLeave={handleMouseLeave}
            disabled={readonly}
            aria-label={`Avaliar com ${value} estrela${value > 1 ? 's' : ''}`}
            aria-pressed={value <= displayRating}
          >
            <Star 
              size={size === 'small' ? 18 : size === 'large' ? 32 : 24} 
              weight={value <= displayRating ? 'fill' : 'regular'}
              className={`star-rating__star ${value <= displayRating ? 'star-rating__star--filled' : 'star-rating__star--empty'}`}
            />
          </button>
        ))}
      </div>
      {showLabel && displayRating > 0 && (
        <span className="star-rating__label">{labels[displayRating - 1]}</span>
      )}
    </div>
  );
};

StarRating.propTypes = {
  rating: PropTypes.number,
  onRatingChange: PropTypes.func,
  readonly: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  showLabel: PropTypes.bool,
};

export default StarRating;

