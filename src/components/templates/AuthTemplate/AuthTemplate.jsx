import React from 'react';
import PropTypes from 'prop-types';
import './AuthTemplate.css';

const AuthTemplate = ({
  children,
  backgroundVariant = 'gradient',
  className = '',
  ...props
}) => {
  return (
    <div className={`auth-template auth-template--${backgroundVariant} ${className}`} {...props}>
      <div className="auth-template__background">
        <div className="auth-template__background-pattern"></div>
      </div>
      
      <main 
        id="main-content"
        role="main" 
        aria-label="Conteúdo principal"
        tabIndex={-1}
        className="auth-template__content"
      >
        {children}
      </main>
      
      <div className="auth-template__footer">
        <p className="auth-template__footer-text">
          © 2024 Swaply. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
};

AuthTemplate.propTypes = {
  children: PropTypes.node.isRequired,
  backgroundVariant: PropTypes.oneOf(['gradient', 'pattern', 'solid']),
  className: PropTypes.string,
};

export default AuthTemplate;
