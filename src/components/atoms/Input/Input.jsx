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
  labelId,
  errorId,
  helperId,
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

  // Extrair id e outras props que não devem ir para o DOM
  const { 
    id: propsId, 
    labelId: propsLabelId, 
    errorId: propsErrorId, 
    helperId: propsHelperId,
    ...inputProps 
  } = props;
  
  // Garantir que labelId, errorId, helperId não estejam em inputProps (caso venham via ...props)
  delete inputProps.labelId;
  delete inputProps.errorId;
  delete inputProps.helperId;
  
  const inputId = propsId || `input-${Math.random().toString(36).substr(2, 9)}`;
  const finalLabelId = labelId || propsLabelId || `${inputId}-label`;
  const finalErrorId = errorId || propsErrorId || `${inputId}-error`;
  const finalHelperId = helperId || propsHelperId || `${inputId}-helper`;

  return (
    <div className="input-wrapper">
      {label && (
        <label id={finalLabelId} htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="input-required" aria-label="obrigatório">*</span>}
        </label>
      )}
      
      <div className="input-container">
        {leftIcon && (
          <div className="input-icon input-icon--left" aria-hidden="true">
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
          aria-labelledby={label ? finalLabelId : undefined}
          aria-describedby={error ? finalErrorId : (helperText ? finalHelperId : undefined)}
          aria-invalid={!!error}
          aria-required={required}
          {...inputProps}
        />
        
        {rightIcon && (
          <div className="input-icon input-icon--right" aria-hidden="true">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <div id={finalErrorId} className="input-message input-message--error" role="alert" aria-live="polite">
          {error}
        </div>
      )}
      {!error && helperText && (
        <div id={finalHelperId} className="input-message">
          {helperText}
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
  labelId: PropTypes.string,
  errorId: PropTypes.string,
  helperId: PropTypes.string,
};

export default Input;
