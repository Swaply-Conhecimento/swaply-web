import React, { useState } from 'react';
import { ArrowLeft, Envelope, PaperPlaneTilt, CheckCircle } from '@phosphor-icons/react';
import { useApp } from '../../../contexts/AppContext';
import { authService } from '../../../services/api';
import AuthTemplate from '../../templates/AuthTemplate';
import Card from '../../molecules/Card';
import Button from '../../atoms/Button';
import FormField from '../../molecules/FormField';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const { actions } = useApp();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authService.forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Erro ao enviar email. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    actions.setCurrentPage('auth');
  };

  if (success) {
    return (
      <AuthTemplate backgroundVariant="gradient">
        <div className="forgot-password">
          <Card className="forgot-password__card" padding="large">
            <div className="forgot-password__success">
              <div className="forgot-password__success-icon">
                <CheckCircle size={64} weight="duotone" />
              </div>
              
              <h1 className="forgot-password__title">
                Email Enviado!
              </h1>
              
              <p className="forgot-password__message">
                Enviamos um link de recuperação de senha para <strong>{email}</strong>
              </p>
              
              <p className="forgot-password__submessage">
                Verifique sua caixa de entrada e spam. O link expira em 10 minutos.
              </p>

              <div className="forgot-password__actions">
                <Button variant="primary" size="large" onClick={handleGoBack}>
                  Voltar ao Login
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setSuccess(false)}
                >
                  Enviar novamente
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
      <div className="forgot-password">
        <Card className="forgot-password__card" padding="large">
          <div className="forgot-password__content">
            <button 
              className="forgot-password__back"
              onClick={handleGoBack}
            >
              <ArrowLeft size={20} />
              Voltar
            </button>

            <div className="forgot-password__header">
              <div className="forgot-password__icon">
                <PaperPlaneTilt size={48} weight="duotone" />
              </div>
              
              <h1 className="forgot-password__title">
                Esqueceu sua senha?
              </h1>
              
              <p className="forgot-password__subtitle">
                Sem problemas! Digite seu email e enviaremos um link para redefinir sua senha.
              </p>
            </div>

            {error && (
              <div className="forgot-password__error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="forgot-password__form">
              <FormField
                label="Email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu-email@example.com"
                leftIcon={<Envelope size={20} />}
                required
                autoFocus
              />

              <Button
                type="submit"
                variant="primary"
                size="large"
                fullWidth
                loading={loading}
                disabled={!email || loading}
              >
                {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
              </Button>
            </form>

            <div className="forgot-password__info">
              <p>
                Lembrou sua senha?{' '}
                <button 
                  type="button"
                  className="forgot-password__link"
                  onClick={handleGoBack}
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

export default ForgotPassword;


