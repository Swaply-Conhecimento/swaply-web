import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeSlash, CheckCircle, Warning } from '@phosphor-icons/react';
import { useApp } from '../../../contexts/AppContext';
import { authService } from '../../../services/api';
import AuthTemplate from '../../templates/AuthTemplate';
import Card from '../../molecules/Card';
import Button from '../../atoms/Button';
import FormField from '../../molecules/FormField';
import './ResetPassword.css';

const ResetPassword = () => {
  const { actions } = useApp();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // Extrair token da URL
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    
    if (urlToken) {
      setToken(urlToken);
    } else {
      setError('Token inválido ou ausente. Solicite um novo link de recuperação.');
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authService.resetPassword({
        token,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Erro ao resetar senha. O link pode ter expirado.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoToLogin = () => {
    actions.setCurrentPage('auth');
  };

  if (success) {
    return (
      <AuthTemplate backgroundVariant="gradient">
        <div className="reset-password">
          <Card className="reset-password__card" padding="large">
            <div className="reset-password__success">
              <div className="reset-password__success-icon">
                <CheckCircle size={64} weight="duotone" />
              </div>
              
              <h1 className="reset-password__title">
                Senha Alterada com Sucesso!
              </h1>
              
              <p className="reset-password__message">
                Sua senha foi redefinida. Agora você pode fazer login com sua nova senha.
              </p>

              <Button variant="primary" size="large" onClick={handleGoToLogin}>
                Ir para Login
              </Button>
            </div>
          </Card>
        </div>
      </AuthTemplate>
    );
  }

  if (!token || error.includes('Token inválido ou ausente')) {
    return (
      <AuthTemplate backgroundVariant="gradient">
        <div className="reset-password">
          <Card className="reset-password__card" padding="large">
            <div className="reset-password__error-state">
              <div className="reset-password__error-icon">
                <Warning size={64} weight="duotone" />
              </div>
              
              <h1 className="reset-password__title">
                Link Inválido
              </h1>
              
              <p className="reset-password__message">
                O link de recuperação é inválido ou está ausente. Solicite um novo link.
              </p>

              <div className="reset-password__actions">
                <Button 
                  variant="primary" 
                  size="large" 
                  onClick={() => actions.setCurrentPage('forgot-password')}
                >
                  Solicitar Novo Link
                </Button>
                <Button variant="ghost" onClick={handleGoToLogin}>
                  Voltar ao Login
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </AuthTemplate>
    );
  }

  return (
    <AuthTemplate backgroundVariant="gradient">
      <div className="reset-password">
        <Card className="reset-password__card" padding="large">
          <div className="reset-password__content">
            <div className="reset-password__header">
              <div className="reset-password__icon">
                <Lock size={48} weight="duotone" />
              </div>
              
              <h1 className="reset-password__title">
                Redefinir Senha
              </h1>
              
              <p className="reset-password__subtitle">
                Digite sua nova senha abaixo. Ela deve ter no mínimo 6 caracteres com letras maiúsculas, minúsculas e números.
              </p>
            </div>

            {error && (
              <div className="reset-password__error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="reset-password__form">
              <FormField
                label="Nova Senha"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                leftIcon={<Lock size={20} />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="reset-password__password-toggle"
                  >
                    {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                  </button>
                }
                required
                autoFocus
              />

              <FormField
                label="Confirmar Nova Senha"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="••••••••"
                leftIcon={<Lock size={20} />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="reset-password__password-toggle"
                  >
                    {showConfirmPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                  </button>
                }
                required
              />

              <div className="reset-password__requirements">
                <p className="reset-password__requirements-title">Sua senha deve conter:</p>
                <ul className="reset-password__requirements-list">
                  <li className={formData.password.length >= 6 ? 'valid' : ''}>
                    Mínimo 6 caracteres
                  </li>
                  <li className={/[a-z]/.test(formData.password) ? 'valid' : ''}>
                    Uma letra minúscula
                  </li>
                  <li className={/[A-Z]/.test(formData.password) ? 'valid' : ''}>
                    Uma letra maiúscula
                  </li>
                  <li className={/[0-9]/.test(formData.password) ? 'valid' : ''}>
                    Um número
                  </li>
                </ul>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="large"
                fullWidth
                loading={loading}
                disabled={!formData.password || !formData.confirmPassword || loading}
              >
                {loading ? 'Redefinindo...' : 'Redefinir Senha'}
              </Button>
            </form>

            <div className="reset-password__info">
              <p>
                Lembrou sua senha?{' '}
                <button 
                  type="button"
                  className="reset-password__link"
                  onClick={handleGoToLogin}
                >
                  Voltar ao login
                </button>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </AuthTemplate>
  );
};

export default ResetPassword;


