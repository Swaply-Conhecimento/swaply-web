import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { CheckCircle, XCircle, Warning, Info, X } from '@phosphor-icons/react';
import './Toast.css';

/**
 * Toast - Componente de notificação toast
 */
const Toast = ({ 
  id,
  message, 
  type = 'info', 
  duration = 5000, 
  onClose 
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle size={20} aria-hidden="true" />,
    error: <XCircle size={20} aria-hidden="true" />,
    warning: <Warning size={20} aria-hidden="true" />,
    info: <Info size={20} aria-hidden="true" />,
  };

  return (
    <div 
      className={`toast toast--${type}`}
      role="alert"
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      aria-atomic="true"
    >
      <div className="toast__icon">{icons[type]}</div>
      <div className="toast__message">{message}</div>
      <button
        className="toast__close"
        onClick={onClose}
        aria-label="Fechar notificação"
      >
        <X size={16} aria-hidden="true" />
      </button>
    </div>
  );
};

Toast.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  duration: PropTypes.number,
  onClose: PropTypes.func.isRequired,
};

export default Toast;

