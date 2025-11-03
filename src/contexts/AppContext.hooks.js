import { useContext } from 'react';
import AppContext from './AppContext';

/**
 * Hook para acessar o contexto da aplicação
 * 
 * @returns {Object} { state, actions } - Estado e ações da aplicação
 * @throws {Error} Se usado fora do AppProvider
 */
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

