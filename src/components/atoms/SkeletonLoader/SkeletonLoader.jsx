import React from 'react';
import PropTypes from 'prop-types';
import './SkeletonLoader.css';

/**
 * SkeletonLoader - Componente para mostrar estados de loading
 * com placeholder animado
 */
const SkeletonLoader = ({ 
  variant = 'text', 
  width, 
  height, 
  className = '',
  count = 1,
  ...props
}) => {
  const variants = {
    text: 'skeleton--text',
    circular: 'skeleton--circular',
    rectangular: 'skeleton--rectangular',
    card: 'skeleton--card',
    avatar: 'skeleton--avatar',
  };

  const items = Array.from({ length: count });

  return (
    <>
      {items.map((_, index) => (
        <div
          key={index}
          className={`skeleton ${variants[variant]} ${className}`}
          style={{ width, height }}
          aria-label="Carregando conteúdo"
          role="status"
          aria-live="polite"
          {...props}
        >
          <span className="sr-only">Carregando...</span>
        </div>
      ))}
    </>
  );
};

SkeletonLoader.propTypes = {
  variant: PropTypes.oneOf(['text', 'circular', 'rectangular', 'card', 'avatar']),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  count: PropTypes.number,
};

export default SkeletonLoader;

