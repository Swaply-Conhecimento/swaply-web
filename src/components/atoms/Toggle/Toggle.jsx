import React from 'react';
import PropTypes from 'prop-types';
import './Toggle.css';

const Toggle = ({
  checked = false,
  onChange,
  disabled = false,
  size = 'medium',
  label,
  className = '',
  ...props
}) => {
  const baseClass = 'toggle';
  const sizeClass = `toggle--${size}`;
  const checkedClass = checked ? 'toggle--checked' : '';
  const disabledClass = disabled ? 'toggle--disabled' : '';

  const toggleClass = [
    baseClass,
    sizeClass,
    checkedClass,
    disabledClass,
    className
  ].filter(Boolean).join(' ');

  const handleToggle = () => {
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  const toggleId = props.id || `toggle-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="toggle-wrapper">
      <div className={toggleClass} onClick={handleToggle}>
        <input
          type="checkbox"
          id={toggleId}
          checked={checked}
          onChange={() => {}} // Controlled by onClick
          disabled={disabled}
          className="toggle-input"
          {...props}
        />
        <span className="toggle-track">
          <span className="toggle-thumb" />
        </span>
      </div>
      {label && (
        <label htmlFor={toggleId} className="toggle-label">
          {label}
        </label>
      )}
    </div>
  );
};

Toggle.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  label: PropTypes.string,
  className: PropTypes.string,
  id: PropTypes.string,
};

export default Toggle;
