import React from 'react';
import PropTypes from 'prop-types';
import LogoSemSlogan from '../../../assets/LogoSemSlogan.svg';
import LogoComSlogan from '../../../assets/LogoComSlogan.svg';
import LogoSimples2 from '../../../assets/LogoSimples2.svg';
import './Logo.css';

const Logo = ({
  variant = 'sem-slogan',
  size = 'medium',
  className = '',
  ...props
}) => {
  const getLogoSrc = () => {
    switch (variant) {
      case 'com-slogan':
        return LogoComSlogan;
      case 'simples':
        return LogoSimples2;
      case 'sem-slogan':
      default:
        return LogoSemSlogan;
    }
  };

  const baseClass = 'logo';
  const sizeClass = `logo--${size}`;
  const logoClass = [baseClass, sizeClass, className].filter(Boolean).join(' ');

  return (
    <img
      src={getLogoSrc()}
      alt="Swaply - Plataforma de Cursos"
      className={logoClass}
      {...props}
    />
  );
};

Logo.propTypes = {
  variant: PropTypes.oneOf(['sem-slogan', 'com-slogan', 'simples']),
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge']),
  className: PropTypes.string,
};

export default Logo;
