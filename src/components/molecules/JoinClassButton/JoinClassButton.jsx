import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { VideoCamera } from '@phosphor-icons/react';
import useClasses from '../../../hooks/useClasses';
import { useApp } from '../../../contexts';
import Button from '../../atoms/Button';
import './JoinClassButton.css';

const JoinClassButton = ({ classId, disabled = false, className = '' }) => {
  const { getClassAccess, loading } = useClasses();
  const { actions } = useApp();
  const [error, setError] = useState(null);

  const handleJoinClass = async () => {
    if (!classId || disabled) return;

    setError(null);
    try {
      const result = await getClassAccess(classId);
      
      if (result.success && result.jitsiLink) {
        // Abrir sala Jitsi em nova aba
        window.open(result.jitsiLink, '_blank', 'noopener,noreferrer');
        
        // Mostrar mensagem de sucesso
        actions.showToast(
          'Entrando na sala virtual...',
          'success',
          3000
        );
      } else {
        const errorMessage = result.error || 'Erro ao obter link de acesso';
        setError(errorMessage);
        actions.showToast(errorMessage, 'error', 5000);
      }
    } catch (err) {
      console.error('Erro ao entrar na aula:', err);
      const errorMessage = err.message || 'Erro ao entrar na aula. Tente novamente.';
      setError(errorMessage);
      actions.showToast(errorMessage, 'error', 5000);
    }
  };

  return (
    <div className={`join-class-button ${className}`}>
      <Button
        variant="primary"
        size="medium"
        onClick={handleJoinClass}
        disabled={disabled || loading || !classId}
        loading={loading}
      >
        <VideoCamera size={18} />
        {loading ? 'Carregando...' : 'Entrar na Aula'}
      </Button>
      {error && (
        <span className="join-class-button__error">{error}</span>
      )}
    </div>
  );
};

JoinClassButton.propTypes = {
  classId: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default JoinClassButton;

