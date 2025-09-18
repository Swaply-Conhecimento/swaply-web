import React, { useState } from 'react';
import AuthTemplate from '../../templates/AuthTemplate';
import AuthForm from '../../organisms/AuthForm';
import './Auth.css';

const Auth = () => {
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError('');

    try {
      // Simular chamada da API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log(`${mode} submitted:`, formData);
      
      // Em uma aplicação real, aqui você faria a autenticação
      if (mode === 'login') {
        // Simular login
        if (formData.email === 'admin@swaply.com' && formData.password === '12345678') {
          console.log('Login successful!');
          // Redirecionar para dashboard
        } else {
          throw new Error('Credenciais inválidas');
        }
      } else {
        // Simular registro
        console.log('Registration successful!');
        // Redirecionar para dashboard ou confirmação
      }
    } catch (err) {
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
