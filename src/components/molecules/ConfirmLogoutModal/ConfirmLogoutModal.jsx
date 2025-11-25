import React from 'react';
import PropTypes from 'prop-types';
import { SignOut, Warning } from '@phosphor-icons/react';
import Modal from '../../atoms/Modal';
import Button from '../../atoms/Button';
import './ConfirmLogoutModal.css';

const ConfirmLogoutModal = ({
  isOpen,
  onClose,
  onConfirm,
  userName,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="small"
      closeOnOverlayClick={true}
      className="confirm-logout-modal"
    >
      <div className="confirm-logout-modal__content">
        <div className="confirm-logout-modal__icon">
          <div className="confirm-logout-modal__icon-circle">
            <SignOut size={48} weight="bold" />
          </div>
        </div>
        
        <h2 className="confirm-logout-modal__title">
          Deseja realmente sair?
        </h2>
        
        <p className="confirm-logout-modal__message">
          {userName 
            ? `Olá, ${userName}! Você tem certeza que deseja sair da sua conta?`
            : 'Você tem certeza que deseja sair da sua conta?'
          }
        </p>
        
        <div className="confirm-logout-modal__warning">
          <Warning size={20} weight="fill" />
          <span>Você precisará fazer login novamente para acessar sua conta.</span>
        </div>
        
        <div className="confirm-logout-modal__actions">
          <Button
            variant="outline"
            size="large"
            onClick={onClose}
            fullWidth
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            size="large"
            onClick={onConfirm}
            fullWidth
          >
            <SignOut size={20} />
            Sim, sair
          </Button>
        </div>
      </div>
    </Modal>
  );
};

ConfirmLogoutModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  userName: PropTypes.string,
};

export default ConfirmLogoutModal;

