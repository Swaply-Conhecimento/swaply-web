import React from 'react';
import PropTypes from 'prop-types';
import Logo from '../Logo';
import './LoadingScreen.css';

/**
 * Componente de tela de loading global
 */
const LoadingScreen = ({ 
  message = 'Carregando...',
  showLogo = true 
}) => {
  return (
    <div className="loading-screen">
      <div className="loading-screen__content">
        {showLogo && (
          <div className="loading-screen__logo">
            <Logo variant="simples" size="large" />
          </div>
        )}
        
        <div className="loading-screen__spinner">
          <div className="loading-screen__spinner-ring"></div>
          <div className="loading-screen__spinner-ring"></div>
          <div className="loading-screen__spinner-ring"></div>
        </div>
        
        <p className="loading-screen__message">{message}</p>
      </div>
    </div>
  );
};

LoadingScreen.propTypes = {
  message: PropTypes.string,
  showLogo: PropTypes.bool,
};

export default LoadingScreen;


