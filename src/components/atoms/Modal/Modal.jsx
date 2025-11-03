import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { X } from '@phosphor-icons/react';
import './Modal.css';

const Modal = ({
  isOpen = false,
  onClose,
  title,
  children,
  size = 'medium',
  showCloseButton = true,
  closeOnOverlayClick = true,
  className = '',
  ...props
}) => {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);
  const titleId = `modal-title-${Math.random().toString(36).substr(2, 9)}`;
  const contentId = `modal-content-${Math.random().toString(36).substr(2, 9)}`;

  // Close on Escape key and focus management
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      // Salvar elemento que tinha foco antes de abrir o modal
      previousFocusRef.current = document.activeElement;
      
      // Focar no modal
      setTimeout(() => {
        const firstFocusable = modalRef.current?.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (firstFocusable) {
          firstFocusable.focus();
        } else {
          modalRef.current?.focus();
        }
      }, 100);

      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';

      // Focus trap
      const handleTab = (e) => {
        if (e.key !== 'Tab' || !modalRef.current) return;
        
        const focusableElements = modalRef.current.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input:not([disabled]), select, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      };

      document.addEventListener('keydown', handleTab);

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.removeEventListener('keydown', handleTab);
        document.body.style.overflow = 'unset';
        // Restaurar foco anterior
        if (previousFocusRef.current) {
          previousFocusRef.current.focus();
        }
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  const modalClass = [
    'modal',
    `modal--${size}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className="modal-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={contentId}
    >
      <div
        ref={modalRef}
        className={modalClass}
        tabIndex={-1}
        {...props}
      >
        {(title || showCloseButton) && (
          <div className="modal__header">
            {title && (
              <h2 id={titleId} className="modal__title">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                className="modal__close"
                onClick={onClose}
                aria-label="Fechar modal"
              >
                <X size={24} aria-hidden="true" />
              </button>
            )}
          </div>
        )}
        
        <div id={contentId} className="modal__content">
          {children}
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge']),
  showCloseButton: PropTypes.bool,
  closeOnOverlayClick: PropTypes.bool,
  className: PropTypes.string,
};

export default Modal;
