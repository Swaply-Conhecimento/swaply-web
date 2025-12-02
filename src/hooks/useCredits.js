import { useState, useCallback } from 'react';
import creditService from '../services/api/credits';
import userService from '../services/api/users';

/**
 * Hook para gerenciar créditos e transações
 */
const useCredits = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Obter histórico de créditos
   */
  const getCreditHistory = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const result = await creditService.getCreditHistory(params);
      return { 
        success: true, 
        transactions: result.transactions, 
        pagination: result.pagination 
      };
    } catch (err) {
      const errorMessage = err.message || 'Erro ao obter histórico de créditos';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obter estatísticas do usuário (inclui resumo financeiro)
   */
  const getUserStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await creditService.getUserStats();
      return { success: true, stats: result.stats };
    } catch (err) {
      const errorMessage = err.message || 'Erro ao obter estatísticas';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obter saldo de créditos
   */
  const getCreditBalance = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await userService.getCreditBalance();
      return { success: true, credits: result.credits };
    } catch (err) {
      const errorMessage = err.message || 'Erro ao obter saldo';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Comprar créditos
   */
  const purchaseCredits = useCallback(async (amount) => {
    setLoading(true);
    setError(null);
    try {
      const result = await userService.purchaseCredits(amount);
      return { 
        success: true, 
        credits: result.credits,
        transaction: result.transaction,
        message: result.message 
      };
    } catch (err) {
      const errorMessage = err.message || 'Erro ao comprar créditos';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getCreditHistory,
    getUserStats,
    getCreditBalance,
    purchaseCredits,
  };
};

export default useCredits;

