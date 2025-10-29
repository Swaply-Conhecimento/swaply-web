import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  Warning, 
  Trash,
  Lock,
  Eye,
  EyeSlash
} from '@phosphor-icons/react';
import Modal from '../../atoms/Modal';
import Button from '../../atoms/Button';
import FormField from '../../molecules/FormField';
import './DeleteAccountModal.css';

const DeleteAccountModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  userName = 'usuário',
}) => {
  const [password, setPassword] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const expectedText = 'EXCLUIR MINHA CONTA';

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!password.trim()) {
      setError('Por favor, digite sua senha para confirmar');
      return;
    }

    if (confirmText !== expectedText) {
      setError(`Por favor, digite exatamente "${expectedText}" para confirmar`);
      return;
    }

    onConfirm(password);
  };

  const handleClose = () => {
    if (!loading) {
      setPassword('');
      setConfirmText('');
      setError('');
      onClose();
    }
  };

  const isValid = password.trim() && confirmText === expectedText;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Excluir Conta"
      size="medium"
      className="delete-account-modal"
    >
      <div className="delete-account-modal__content">
        {/* Ícone de aviso */}
        <div className="delete-account-modal__icon">
          <Warning size={64} weight="fill" />
        </div>

        {/* Mensagem de aviso */}
        <div className="delete-account-modal__warning">
          <h3>⚠️ Atenção: Esta ação é irreversível!</h3>
          <p>
            Ao excluir sua conta, <strong>{userName}</strong>, você perderá permanentemente:
          </p>
          <ul className="delete-account-modal__list">
            <li>✗ Todos os seus dados pessoais</li>
            <li>✗ Seu histórico de cursos</li>
            <li>✗ Seus créditos acumulados</li>
            <li>✗ Suas avaliações e comentários</li>
            <li>✗ Todos os cursos que você criou</li>
            <li>✗ Suas configurações e preferências</li>
          </ul>
        </div>

        {/* Formulário de confirmação */}
        <form onSubmit={handleSubmit} className="delete-account-modal__form">
          {error && (
            <div className="delete-account-modal__error">
              {error}
            </div>
          )}

          <FormField
            label="Digite sua senha para confirmar *"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Sua senha"
            leftIcon={<Lock size={20} />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="delete-account-modal__password-toggle"
              >
                {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
              </button>
            }
            required
            disabled={loading}
            fullWidth
          />

          <FormField
            label={`Digite "${expectedText}" para confirmar *`}
            name="confirmText"
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={expectedText}
            helperText={`Digite exatamente: ${expectedText}`}
            required
            disabled={loading}
            fullWidth
          />

          <div className="delete-account-modal__actions">
            <Button
              type="button"
              variant="outline"
              size="large"
              onClick={handleClose}
              disabled={loading}
              fullWidth
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="danger"
              size="large"
              loading={loading}
              disabled={loading || !isValid}
              fullWidth
            >
              <Trash size={20} />
              {loading ? 'Excluindo...' : 'Excluir Conta Permanentemente'}
            </Button>
          </div>
        </form>

        {/* Nota final */}
        <div className="delete-account-modal__note">
          <p>
            <strong>Nota:</strong> Se você está tendo problemas com sua conta, 
            considere entrar em contato com nosso suporte antes de excluí-la.
          </p>
        </div>
      </div>
    </Modal>
  );
};

DeleteAccountModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  userName: PropTypes.string,
};

export default DeleteAccountModal;


