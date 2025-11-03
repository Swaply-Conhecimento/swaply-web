import React from 'react';
import './SkipLink.css';

/**
 * SkipLink - Componente para permitir que usuários de teclado
 * pulem diretamente para o conteúdo principal
 * 
 * @example
 * <SkipLink href="#main-content" />
 */
const SkipLink = ({ href = '#main-content', children = 'Ir para conteúdo principal' }) => {
  return (
    <a
      href={href}
      className="skip-link"
      aria-label={children}
    >
      {children}
    </a>
  );
};

export default SkipLink;

