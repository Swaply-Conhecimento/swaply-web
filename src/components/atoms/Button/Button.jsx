import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const baseClass = 'btn';
  const variantClass = `btn--${variant}`;
  const sizeClass = `btn--${size}`;
  const fullWidthClass = fullWidth ? 'btn--full-width' : '';
  const loadingClass = loading ? 'btn--loading' : '';
  const disabledClass = disabled ? 'btn--disabled' : '';

  const buttonClass = [
    baseClass,
    variantClass,
    sizeClass,
    fullWidthClass,
    loadingClass,
    disabledClass,
    className
  ].filter(Boolean).join(' ');

  // Determinar aria-label baseado no estado
  const ariaLabel = loading 
    ? (props['aria-label'] ? `${props['aria-label']} - Carregando...` : `${children} - Carregando...`)
    : props['aria-label'];

  return (
    <button
      type={type}
      className={buttonClass}
      disabled={disabled || loading}
      onClick={onClick}
      aria-busy={loading}
      aria-disabled={disabled || loading}
      aria-label={ariaLabel}
      {...props}
    >
      {loading && (
        <span className="btn__spinner" aria-hidden="true">
          <span className="sr-only">Carregando...</span>
        </span>
      )}
      <span className={`btn__content ${loading ? 'btn__content--hidden' : ''}`}>
        {children}
      </span>
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost', 'danger']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  fullWidth: PropTypes.bool,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string,
};

export default Button;
