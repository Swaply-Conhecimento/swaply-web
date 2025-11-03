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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  };

  const toggleId = props.id || `toggle-${Math.random().toString(36).substr(2, 9)}`;
  const labelId = `toggle-label-${toggleId}`;

  return (
    <div className="toggle-wrapper">
      <div
        className={toggleClass}
        role="switch"
        aria-checked={checked}
        aria-disabled={disabled}
        aria-labelledby={label ? labelId : undefined}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
      >
        <input
          type="checkbox"
          id={toggleId}
          checked={checked}
          onChange={() => {}} // Controlled by onClick
          disabled={disabled}
          className="toggle-input"
          aria-hidden="true"
          tabIndex={-1}
          {...props}
        />
        <span className="toggle-track" aria-hidden="true">
          <span className="toggle-thumb" />
        </span>
      </div>
      {label && (
        <label id={labelId} htmlFor={toggleId} className="toggle-label">
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
