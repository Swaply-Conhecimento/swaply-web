import React, { useState, useEffect } from 'react';
import { useApp } from '../../../contexts';
import AuthTemplate from '../../templates/AuthTemplate';
import AuthForm from '../../organisms/AuthForm';
import './Auth.css';

const Auth = ({ onLogin, initialMode }) => {
  const { actions } = useApp();
  // Verificar se há um modo inicial no localStorage ou usar a prop
  const getInitialMode = () => {
    const savedMode = localStorage.getItem('authMode');
    if (savedMode === 'login' || savedMode === 'register') {
      localStorage.removeItem('authMode'); // Limpar após usar
      return savedMode;
    }
    return initialMode || 'login';
  };
  
  const [mode, setMode] = useState(getInitialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Garantir que a página comece no topo quando carregar ou mudar de modo
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [mode]);

  // Garantir que a página comece no topo quando o componente montar
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const handleSubmit = async (formData) => {
    // Prevenir duplo submit - se já está carregando, não fazer nada
    if (loading) {
      console.warn('⚠️ Tentativa de submit enquanto já está processando. Ignorando...');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        // Login real com API
        console.log('🔐 Tentando fazer login...');
        const result = await actions.login({
          email: formData.email,
          password: formData.password,
        });

        console.log('📥 Resultado do login:', result);

        if (result.success) {
          console.log('✅ Login bem-sucedido!');
          // Login bem-sucedido, redirecionado automaticamente pelo AppContext
          // Não precisa chamar onLogin() pois o AppContext já redireciona
        } else {
          console.log('❌ Falha no login:', result.error);
          setError(result.error || 'Credenciais inválidas');
        }
      } else {
        // Registro real com API
        console.log('📝 Tentando registrar...');
        const result = await actions.register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        });

        console.log('📥 Resultado do registro:', result);

        if (result.success) {
          console.log('✅ Registro bem-sucedido!');
          // Registro bem-sucedido, redirecionado automaticamente pelo AppContext
          // Não precisa chamar onLogin() pois o AppContext já redireciona
        } else {
          console.log('❌ Falha no registro:', result.error);
          setError(result.error || 'Erro ao criar conta. Tente novamente.');
        }
      }
    } catch (err) {
      console.error('❌ Erro na autenticação:', err);
      setError(err.message || 'Ocorreu um erro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setError('');
  };

  return (
    <AuthTemplate backgroundVariant="gradient">
      <div className="auth-page">
        <AuthForm
          mode={mode}
          onSubmit={handleSubmit}
          onModeChange={handleModeChange}
          loading={loading}
          error={error}
        />
      </div>
    </AuthTemplate>
  );
};

export default Auth;
