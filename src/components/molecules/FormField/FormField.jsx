import React from 'react';
import PropTypes from 'prop-types';
import Input from '../../atoms/Input';
import './FormField.css';

const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  disabled = false,
  error,
  helperText,
  validation,
  size = 'medium',
  fullWidth = true,
  leftIcon,
  rightIcon,
  className = '',
  children,
  ...props
}) => {
  const [touched, setTouched] = React.useState(false);
  const [localError, setLocalError] = React.useState('');

  const handleBlur = (e) => {
    setTouched(true);
    
    // Run validation if provided
    if (validation && value) {
      const validationResult = validation(value);
      if (validationResult !== true) {
        setLocalError(validationResult);
      } else {
        setLocalError('');
      }
    }
    
    if (onBlur) {
      onBlur(e);
    }
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    
    // Clear error when user starts typing
    if (localError || error) {
      setLocalError('');
    }
    
    if (onChange) {
      onChange(e);
    }
  };

  const displayError = error || (touched && localError);

  return (
    <div className={`form-field ${className}`}>
        {type === 'select' ? (
          <div className="input-wrapper">
            {label && (
              <label htmlFor={props.id || `input-${Math.random().toString(36).substr(2, 9)}`} className="input-label">
                {label}
                {required && <span className="input-required">*</span>}
              </label>
            )}
            <select
              id={props.id || `input-${Math.random().toString(36).substr(2, 9)}`}
              name={name}
              className={`input-field input-field--${size} ${fullWidth ? 'input-field--full-width' : ''} ${displayError ? 'input-field--error' : ''}`}
              value={value}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={disabled}
              required={required}
              {...props}
            >
              {children}
            </select>
            {(displayError || helperText) && (
              <div className={`input-message ${displayError ? 'input-message--error' : ''}`}>
                {displayError || helperText}
              </div>
            )}
          </div>
        ) : type === 'textarea' ? (
          <div className="input-wrapper">
            {label && (
              <label htmlFor={props.id || `input-${Math.random().toString(36).substr(2, 9)}`} className="input-label">
                {label}
                {required && <span className="input-required">*</span>}
              </label>
            )}
            <textarea
              id={props.id || `input-${Math.random().toString(36).substr(2, 9)}`}
              name={name}
              className={`input-field input-field--${size} ${fullWidth ? 'input-field--full-width' : ''} ${displayError ? 'input-field--error' : ''}`}
              placeholder={placeholder}
              value={value}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={disabled}
              required={required}
              rows={4}
              {...props}
            />
            {(displayError || helperText) && (
              <div className={`input-message ${displayError ? 'input-message--error' : ''}`}>
                {displayError || helperText}
              </div>
            )}
          </div>
        ) : (
          <Input
            label={label}
            name={name}
            type={type}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            error={displayError}
            helperText={!displayError ? helperText : undefined}
            size={size}
            fullWidth={fullWidth}
            leftIcon={leftIcon}
            rightIcon={rightIcon}
            {...props}
          />
        )}
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  helperText: PropTypes.string,
  validation: PropTypes.func,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  fullWidth: PropTypes.bool,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  className: PropTypes.string,
  children: PropTypes.node,
};

// Common validation functions
export const validations = {
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) || 'Por favor, insira um email válido';
  },
  
  password: (value) => {
    if (value.length < 8) {
      return 'A senha deve ter pelo menos 8 caracteres';
    }
    return true;
  },
  
  required: (value) => {
    return value && value.trim().length > 0 || 'Este campo é obrigatório';
  },
  
  minLength: (min) => (value) => {
    return value.length >= min || `Mínimo de ${min} caracteres`;
  },
  
  maxLength: (max) => (value) => {
    return value.length <= max || `Máximo de ${max} caracteres`;
  },
};

export default FormField;
