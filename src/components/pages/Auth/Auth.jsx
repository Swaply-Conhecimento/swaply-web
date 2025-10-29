import React, { useState } from 'react';
import { useApp } from '../../../contexts/AppContext';
import AuthTemplate from '../../templates/AuthTemplate';
import AuthForm from '../../organisms/AuthForm';
import './Auth.css';

const Auth = ({ onLogin }) => {
  const { actions } = useApp();
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData) => {
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

  const handleGoogleLogin = () => {
    // Integração com Google OAuth
    try {
      const { authService } = require('../../../services/api');
      authService.loginWithGoogle();
    } catch (err) {
      setError('Erro ao iniciar login com Google');
    }
  };

  return (
    <AuthTemplate backgroundVariant="gradient">
      <div className="auth-page">
        <AuthForm
          mode={mode}
          onSubmit={handleSubmit}
          onModeChange={handleModeChange}
          onGoogleLogin={handleGoogleLogin}
          loading={loading}
          error={error}
        />
      </div>
    </AuthTemplate>
  );
};

export default Auth;
