import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  User,
  Envelope,
  Lock,
  Eye,
  EyeSlash,
} from "@phosphor-icons/react";
import { useApp } from "../../../contexts";
import Logo from "../../atoms/Logo";
import Button from "../../atoms/Button";
import FormField, { validations } from "../../molecules/FormField";
import Card from "../../molecules/Card";
import "./AuthForm.css";

const AuthForm = ({
  mode = "login",
  onSubmit,
  onModeChange,
  loading = false,
  error,
  className = "",
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { actions } = useApp();
  const isLogin = mode === "login";
  const isRegister = mode === "register";

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (isRegister && !formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }

    if (!formData.email) {
      newErrors.email = "Email é obrigatório";
    } else if (validations.email(formData.email) !== true) {
      newErrors.email = validations.email(formData.email);
    }

    if (!formData.password) {
      newErrors.password = "Senha é obrigatória";
    } else if (isRegister && validations.password(formData.password) !== true) {
      newErrors.password = validations.password(formData.password);
    }

    if (isRegister && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
    }

    if (isRegister && !formData.acceptTerms) {
      newErrors.acceptTerms = "Você deve aceitar os termos de uso";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className={`auth-form ${className}`}>
      <div className={`auth-form__container ${isLogin ? 'auth-form__container--login' : 'auth-form__container--register'}`}>
        <Card
          variant="elevated"
          padding="medium"
          shadow="lg"
          className="auth-form__card"
        >
          <div className="auth-form__content">
            {/* Left Side - Logo and Info */}
            <div className="auth-form__left">
              <div className="auth-form__header">
                <Logo variant="simples" size="large" />
                <h1 className="auth-form__title">
                  {isLogin ? "Login" : "Cadastrar"}
                </h1>
                <p className="auth-form__subtitle">
                  {isLogin
                    ? "Por favor, faça o login para acessar o site"
                    : "Crie sua conta para aproveitar ao máximo do site"}
                </p>
              </div>

              <div className="auth-form__footer">
                <p className="auth-form__switch">
                  {isLogin ? "Não tem conta? " : "Já possui conta? "}
                  <button
                    type="button"
                    onClick={() => onModeChange(isLogin ? "register" : "login")}
                    className="auth-form__link"
                  >
                    {isLogin ? "Criar Conta" : "Login"}
                  </button>
                </p>
              </div>
            </div>

            {/* Right Side - Form */}
            <div
              className={`auth-form__right auth-form__right--${
                isLogin ? "login" : "register"
              }`}
            >
              {error && <div className="auth-form__error">{error}</div>}

              <form
                onSubmit={handleSubmit}
                className={`auth-form__form ${
                  loading ? "auth-form__form--loading" : ""
                } ${
                  isLogin
                    ? "auth-form__form--login"
                    : "auth-form__form--register"
                }`}
              >
                <div className="auth-form__fields">
                  {isRegister && (
                    <FormField
                      label="Seu nome"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      error={errors.name}
                      placeholder="Luís Gustavo"
                      leftIcon={<User size={20} />}
                      required
                    />
                  )}

                  <FormField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={errors.email}
                    placeholder="swaply@gmail.com"
                    leftIcon={<Envelope size={20} />}
                    required
                  />

                  <div className="auth-form__password-row">
                    <FormField
                      label="Senha"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      error={errors.password}
                      placeholder="••••••••••••"
                      leftIcon={<Lock size={20} />}
                      rightIcon={
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="auth-form__password-toggle"
                        >
                          {showPassword ? (
                            <EyeSlash size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      }
                      required
                    />

                    {isRegister && (
                      <FormField
                        label="Confirmar senha"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        error={errors.confirmPassword}
                        placeholder="••••••••••••"
                        leftIcon={<Lock size={20} />}
                        rightIcon={
                          <button
                            type="button"
                            onClick={toggleConfirmPasswordVisibility}
                            className="auth-form__password-toggle"
                          >
                            {showConfirmPassword ? (
                              <EyeSlash size={20} />
                            ) : (
                              <Eye size={20} />
                            )}
                          </button>
                        }
                        required
                      />
                    )}
                  </div>
                </div>

                <div className="auth-form__options">
                  {isRegister && (
                    <div className="auth-form__checkbox">
                      <label className="auth-form__checkbox-label">
                        <input
                          type="checkbox"
                          name="acceptTerms"
                          checked={formData.acceptTerms}
                          onChange={handleInputChange}
                          className="auth-form__checkbox-input"
                        />
                        <span className="auth-form__checkbox-text">
                          Li e aceito os{" "}
                          <button
                            type="button"
                            className="auth-form__link"
                            onClick={() => actions.setCurrentPage('terms')}
                          >
                            Termos de Uso
                          </button>
                        </span>
                      </label>
                      {errors.acceptTerms && (
                        <span className="auth-form__error-text">
                          {errors.acceptTerms}
                        </span>
                      )}
                    </div>
                  )}

                  {isLogin && (
                    <div className="auth-form__checkbox">
                    <label className="auth-form__checkbox-label">
                      <input
                        type="checkbox"
                          name="rememberMe"
                          checked={formData.rememberMe}
                          onChange={handleInputChange}
                        className="auth-form__checkbox-input"
                      />
                      <span className="auth-form__checkbox-text">
                        Lembrar de mim
                      </span>
                    </label>
                    </div>
                  )}
                </div>

                <div className="auth-form__actions">
                  <Button
                    type="submit"
                    variant="primary"
                    size="large"
                    fullWidth
                    loading={loading}
                  >
                    {isLogin ? "Logar" : "Criar Conta"}
                  </Button>
                  {isLogin && (
                    <button
                      type="button"
                      className="auth-form__link auth-form__forgot"
                      onClick={() => actions.setCurrentPage('forgot-password')}
                    >
                      Esqueci minha senha
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

AuthForm.propTypes = {
  mode: PropTypes.oneOf(["login", "register"]),
  onSubmit: PropTypes.func.isRequired,
  onModeChange: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  className: PropTypes.string,
};

export default AuthForm;
