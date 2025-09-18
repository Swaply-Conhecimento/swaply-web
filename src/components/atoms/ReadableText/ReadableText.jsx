import React from 'react';
import PropTypes from 'prop-types';
import { SpeakerHigh } from '@phosphor-icons/react';
import { useAccessibility } from '../../../hooks/useAccessibility';
import './ReadableText.css';

const ReadableText = ({
  children,
  as: Component = 'span',
  showIcon = false,
  className = '',
  ...props
}) => {
  const { readText, settings } = useAccessibility();

  const handleClick = () => {
    if (settings.audioDescription) {
      const textContent = typeof children === 'string' 
        ? children 
        : extractTextFromChildren(children);
      readText(textContent);
    }
  };

  const extractTextFromChildren = (children) => {
    if (typeof children === 'string') {
      return children;
    }
    
    if (React.isValidElement(children)) {
      return extractTextFromChildren(children.props.children);
    }
    
    if (Array.isArray(children)) {
      return children.map(extractTextFromChildren).join(' ');
    }
    
    return '';
  };

  if (!settings.audioDescription) {
    return <Component className={className} {...props}>{children}</Component>;
  }

  return (
    <Component 
      className={`readable-text ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
      {showIcon && (
        <SpeakerHigh size={16} className="readable-text__icon" />
      )}
    </Component>
  );
};

ReadableText.propTypes = {
  children: PropTypes.node.isRequired,
  as: PropTypes.elementType,
  showIcon: PropTypes.bool,
  className: PropTypes.string,
};

export default ReadableText;
