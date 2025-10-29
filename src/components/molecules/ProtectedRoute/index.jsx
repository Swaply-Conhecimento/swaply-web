import React from 'react';
import PropTypes from 'prop-types';
import { SignIn, LockKey } from '@phosphor-icons/react';
import { useApp } from '../../../contexts/AppContext';
import Card from '../Card';
import Button from '../../atoms/Button';
import './ProtectedRoute.css';

/**
 * Componente para exibir mensagem quando área requer autenticação
 */
const ProtectedRoute = ({ 
  children, 
  message = 'Esta área requer autenticação',
  showLoginButton = true 
}) => {
  const { state, actions } = useApp();

  // Se está autenticado, renderizar children
  if (state.isAuthenticated) {
    return <>{children}</>;
  }

  // Se não está autenticado, mostrar mensagem
  return (
    <div className="protected-route">
      <Card className="protected-route__card" padding="large">
        <div className="protected-route__content">
          <div className="protected-route__icon">
            <LockKey size={64} weight="duotone" />
          </div>
          
          <h2 className="protected-route__title">
            Área Restrita
          </h2>
          
          <p className="protected-route__message">
            {message}
          </p>
          
          {showLoginButton && (
            <Button
              variant="primary"
              size="large"
              onClick={() => actions.setCurrentPage('auth')}
            >
              <SignIn size={20} />
              Fazer Login
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

ProtectedRoute.propTypes = {
  children: PropTypes.node,
  message: PropTypes.string,
  showLoginButton: PropTypes.bool,
};

export default ProtectedRoute;


