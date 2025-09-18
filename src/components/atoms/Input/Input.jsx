import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import './Input.css';

const Input = forwardRef(({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  disabled = false,
  required = false,
  error,
  helperText,
  size = 'medium',
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}, ref) => {
  const baseClass = 'input-field';
  const sizeClass = `input-field--${size}`;
  const errorClass = error ? 'input-field--error' : '';
  const disabledClass = disabled ? 'input-field--disabled' : '';
  const fullWidthClass = fullWidth ? 'input-field--full-width' : '';
  const hasIconClass = (leftIcon || rightIcon) ? 'input-field--with-icon' : '';

  const inputClass = [
    baseClass,
    sizeClass,
    errorClass,
    disabledClass,
    fullWidthClass,
    hasIconClass,
    className
  ].filter(Boolean).join(' ');

  const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="input-wrapper">
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      
      <div className="input-container">
        {leftIcon && (
          <div className="input-icon input-icon--left">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={inputClass}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          disabled={disabled}
          required={required}
          {...props}
        />
        
        {rightIcon && (
          <div className="input-icon input-icon--right">
            {rightIcon}
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <div className={`input-message ${error ? 'input-message--error' : ''}`}>
          {error || helperText}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  error: PropTypes.string,
  helperText: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  fullWidth: PropTypes.bool,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  className: PropTypes.string,
  id: PropTypes.string,
};

export default Input;
