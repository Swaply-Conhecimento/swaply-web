import React from 'react';
import { useApp } from '../../../contexts';
import Toast from './Toast';
import './ToastContainer.css';

/**
 * ToastContainer - Container para exibir múltiplos toasts
 */
const ToastContainer = () => {
  const { state, actions } = useApp();
  const toasts = state.toasts || [];

  if (toasts.length === 0) return null;

  return (
    <div 
      className="toast-container"
      role="region"
      aria-label="Notificações"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => actions.removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default ToastContainer;

