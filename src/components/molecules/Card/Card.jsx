import React from 'react';
import PropTypes from 'prop-types';
import './Card.css';

const Card = ({
  children,
  variant = 'default',
  padding = 'medium',
  shadow = 'base',
  hover = false,
  className = '',
  onClick,
  ...props
}) => {
  const baseClass = 'card';
  const variantClass = `card--${variant}`;
  const paddingClass = `card--padding-${padding}`;
  const shadowClass = `card--shadow-${shadow}`;
  const hoverClass = hover ? 'card--hover' : '';
  const clickableClass = onClick ? 'card--clickable' : '';

  const cardClass = [
    baseClass,
    variantClass,
    paddingClass,
    shadowClass,
    hoverClass,
    clickableClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={cardClass}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'outlined', 'elevated', 'course']),
  padding: PropTypes.oneOf(['none', 'small', 'medium', 'large']),
  shadow: PropTypes.oneOf(['none', 'sm', 'base', 'md', 'lg']),
  hover: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default Card;
