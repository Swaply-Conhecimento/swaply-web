import React, { useState } from "react";
import {
  HandHeart,
  Palette,
  Bell,
  Shield,
  Eye,
  Ear,
  Sun,
  Moon,
  Desktop,
  TextAa,
  SpeakerHigh,
  Lock,
  EyeSlash,
  Trash,
  UserCircle,
} from "@phosphor-icons/react";
// Removed unused old molecules imports
import { useApp } from "../../../contexts/AppContext";
import { useTheme } from "../../../hooks/useTheme";
import { useAccessibility } from "../../../hooks/useAccessibility";
import { userService } from "../../../services/api";
import DashboardTemplate from "../../templates/DashboardTemplate";
import Card from "../../molecules/Card";
import Button from "../../atoms/Button";
import Toggle from "../../atoms/Toggle";
import FormField from "../../molecules/FormField";
import DeleteAccountModal from "../../organisms/DeleteAccountModal";
import "./Settings.css";
import SvgColorBlindFilters from "../../molecules/ColorBlindFilter/SvgColorBlindFilters";

// Filtros para daltonismo
const COLORBLIND_FILTERS = {
  normal: "none",
  protanopia: "url(#protanopia)",
  deuteranopia: "url(#deuteranopia)",
  tritanopia: "url(#tritanopia)",
  grayscale: "grayscale(100%)",
};

// Componente inline aprimorado para filtros de daltonismo (com pré-visualização)
const InlineColorBlindFilter = () => {
  const [filter, setFilter] = useState(() => {
    return localStorage.getItem("colorblind-filter") || "normal";
  });

  const options = [
    { id: "normal", label: "Normal", description: "Sem filtro" },
    {
      id: "protanopia",
      label: "Protanopia",
      description: "Dificuldade com vermelho",
    },
    {
      id: "deuteranopia",
      label: "Deuteranopia",
      description: "Dificuldade com verde",
    },
    {
      id: "tritanopia",
      label: "Tritanopia",
      description: "Dificuldade com azul",
    },
    { id: "grayscale", label: "Escala de Cinza", description: "Remover cores" },
  ];

  React.useEffect(() => {
    document.documentElement.style.filter = COLORBLIND_FILTERS[filter];
    localStorage.setItem("colorblind-filter", filter);
  }, [filter]);

  return (
    <div className="settings__colorblind-grid" role="list">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          role="listitem"
          className={`settings__colorblind-option ${
            filter === opt.id ? "settings__colorblind-option--active" : ""
          }`}
          onClick={() => setFilter(opt.id)}
          aria-pressed={filter === opt.id}
        >
          <span
            className="settings__colorblind-icon"
            aria-hidden="true"
            style={{
              borderRadius: "8px",
              background: "linear-gradient(90deg, #f87171, #60a5fa, #34d399)",
              filter: COLORBLIND_FILTERS[opt.id],
            }}
          />
          <span className="settings__colorblind-text">
            <span className="settings__colorblind-label">{opt.label}</span>
            <p className="settings__colorblind-description">
              {opt.description}
            </p>
          </span>
        </button>
      ))}
    </div>
  );
};

// Componente inline para controles de fonte
const InlineFontControls = () => {
  const [fontSize, setFontSize] = useState(100);

  React.useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
  }, [fontSize]);

  const increaseFont = () => setFontSize((prev) => Math.min(prev + 10, 130));
  const decreaseFont = () => setFontSize((prev) => Math.max(prev - 10, 70));
  const resetFont = () => setFontSize(100);

  return (
    <div className="settings__font-controls-wrapper">
      <div className="settings__font-display">
        <span className="settings__font-label">Tamanho Atual: {fontSize}%</span>
      </div>
      <div className="settings__font-buttons">
        <Button
          variant="outline"
          size="small"
          onClick={decreaseFont}
          disabled={fontSize <= 70}
          aria-label="Diminuir tamanho do texto"
        >
          A-
        </Button>
        <Button
          variant="outline"
          size="small"
          onClick={resetFont}
          aria-label="Resetar tamanho do texto"
        >
          A
        </Button>
        <Button
          variant="outline"
          size="small"
          onClick={increaseFont}
          disabled={fontSize >= 130}
          aria-label="Aumentar tamanho do texto"
        >
          A+
        </Button>
      </div>
    </div>
  );
};

const Settings = () => {
  const { state, actions } = useApp();
  const { currentTheme, setTheme } = useTheme();
  const {
    setFontSize,
    toggleVLibras,
    toggleAudioReading,
    isReading,
    settings: accessibilitySettings,
    fontSize,
  } = useAccessibility();

  const [activeSection, setActiveSection] = useState("accessibility");
  
  // Estado para alteração de senha
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Estado para modal de exclusão de conta
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);



  const menuItems = [
    {
      id: "accessibility",
      label: "Acessibilidade",
      icon: <HandHeart size={20} />,
    },
    {
      id: "notifications",
      label: "Notificações",
      icon: <Bell size={20} />,
    },
    {
      id: "appearance",
      label: "Aparência",
      icon: <Palette size={20} />,
    },
    {
      id: "security",
      label: "Conta e Segurança",
      icon: <Shield size={20} />,
    },
  ];

  const handleNotificationChange = (key, value) => {
    actions.updateSettings({
      notifications: {
        ...state.settings.notifications,
        [key]: value,
      },
    });
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
    setPasswordError('');
    setPasswordSuccess('');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordError('');
    setPasswordSuccess('');

    // Validações
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordError('As senhas não coincidem');
      setPasswordLoading(false);
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('A nova senha deve ter no mínimo 6 caracteres');
      setPasswordLoading(false);
      return;
    }

    try {
      await userService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmNewPassword: passwordForm.confirmNewPassword,
      });

      setPasswordSuccess('Senha alterada com sucesso!');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } catch (err) {
      setPasswordError(err.message || 'Erro ao alterar senha');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleEditProfile = () => {
    actions.setCurrentPage('profile');
  };

  const handleDeleteAccount = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (password) => {
    setDeleteLoading(true);
    
    try {
      await userService.deleteAccount(password);
      setIsDeleteModalOpen(false);
      
      // Fazer logout
      await actions.logout();
      
      // Redirecionar para página inicial
      actions.setCurrentPage('dashboard');
      
      // Mostrar mensagem de sucesso
      alert('✅ Conta excluída com sucesso.\n\nSentiremos sua falta!');
    } catch (err) {
      console.error('Erro ao excluir conta:', err);
      alert('❌ Erro ao excluir conta: ' + (err.message || 'Tente novamente mais tarde.'));
    } finally {
      setDeleteLoading(false);
    }
  };

  const renderAccessibilitySettings = () => (
    <div className="settings__section">
      <h2 className="settings__section-title">Acessibilidade</h2>

      <Card className="settings__card" padding="large">
        <div className="settings__option settings__option--vertical">
          <div className="settings__option-info">
            <div className="settings__option-header">
              <TextAa size={20} />
              <h3 className="settings__option-title">
                Controle de Tamanho de Fonte:
              </h3>
            </div>
            <p className="settings__option-description">
              Ajuste o tamanho da fonte para tornar a leitura mais fácil e
              confortável.
            </p>
          </div>
          <div className="settings__font-size-controls">
            <button
              className={`settings__font-size-btn ${
                fontSize === "small" ? "settings__font-size-btn--active" : ""
              }`}
              onClick={() => setFontSize("small")}
            >
              A-
            </button>
            <button
              className={`settings__font-size-btn ${
                fontSize === "medium" ? "settings__font-size-btn--active" : ""
              }`}
              onClick={() => setFontSize("medium")}
            >
              A
            </button>
            <button
              className={`settings__font-size-btn ${
                fontSize === "large" ? "settings__font-size-btn--active" : ""
              }`}
              onClick={() => setFontSize("large")}
            >
              A+
            </button>
          </div>
        </div>
      </Card>

      <Card className="settings__card" padding="large">
        <div className="settings__option">
          <div className="settings__option-info">
            <div className="settings__option-header">
              <Ear size={20} />
              <h3 className="settings__option-title">
                VLibras (Tradução para LIBRAS)
              </h3>
            </div>
            <p className="settings__option-description">
              Habilitar widget do VLibras para tradução automática de textos
              para a linguagem de sinais.
            </p>
          </div>
          <Toggle
            checked={accessibilitySettings.vlibras}
            onChange={toggleVLibras}
          />
        </div>
      </Card>

      <Card className="settings__card" padding="large">
        <div className="settings__option">
          <div className="settings__option-info">
            <div className="settings__option-header">
              <SpeakerHigh size={20} />
              <h3 className="settings__option-title">
                Leitura com Faixa de Áudio
              </h3>
            </div>
            <p className="settings__option-description">
              Habilitar funcionalidade para ler textos em voz alta ao clicar
              neles.
            </p>
          </div>
          <div className="settings__audio-controls">
            <Toggle
              checked={accessibilitySettings.audioDescription}
              onChange={toggleAudioReading}
            />
            {accessibilitySettings.audioDescription && (
              <div className="settings__audio-actions">
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => {
                    console.log("Test audio button clicked");
                    console.log(
                      "Speech synthesis available:",
                      "speechSynthesis" in window
                    );
                    console.log(
                      "Audio description enabled:",
                      accessibilitySettings.audioDescription
                    );

                    if ("speechSynthesis" in window) {
                      window.speechSynthesis.cancel();
                      const utterance = new SpeechSynthesisUtterance(
                        "Esta é uma demonstração da leitura de áudio. A funcionalidade está funcionando corretamente."
                      );
                      utterance.lang = "pt-BR";
                      utterance.rate = 0.9;
                      utterance.onstart = () => console.log("Speech started");
                      utterance.onend = () => console.log("Speech ended");
                      window.speechSynthesis.speak(utterance);
                    }
                  }}
                  disabled={isReading}
                >
                  {isReading ? "Lendo..." : "Testar Áudio"}
                </Button>
                {isReading && (
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => {
                      window.speechSynthesis.cancel();
                      actions.setReading(false);
                    }}
                  >
                    Parar
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>

      <Card className="settings__card" padding="large">
        <div className="settings__option settings__option--vertical">
          <div className="settings__option-info">
            <div className="settings__option-header">
              <Eye size={20} />
              <h3 className="settings__option-title">
                Filtros para Daltonismo:
              </h3>
            </div>
            <p className="settings__option-description">
              Selecione um filtro de cor e veja uma pré-visualização antes de
              aplicar.
            </p>
          </div>
          {/* SVG defs necessários para filtros URL(#id) */}
          <div className="settings__colorblind-filter">
            <SvgColorBlindFilters />
            <InlineColorBlindFilter />
          </div>
        </div>
      </Card>

      {/* Controle de Tamanho de Fonte Avançado removido conforme solicitado */}
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="settings__section">
      <h2 className="settings__section-title">Notificações</h2>

      <Card className="settings__card" padding="large">
        <div className="settings__option">
          <div className="settings__option-info">
            <h3 className="settings__option-title">Notificações de Aulas:</h3>
            <p className="settings__option-description">
              Mantendo esta opção habilitada, você receberá lembretes de aulas
              dos cursos em que você se inscreveu.
            </p>
          </div>
          <Toggle
            checked={state.settings.notifications.classNotifications}
            onChange={(value) =>
              handleNotificationChange("classNotifications", value)
            }
          />
        </div>
      </Card>

      <Card className="settings__card" padding="large">
        <div className="settings__option">
          <div className="settings__option-info">
            <h3 className="settings__option-title">
              Notificações de Interesse:
            </h3>
            <p className="settings__option-description">
              Mantendo esta opção habilitada, você receberá notificações caso
              alguém mostre interesse em alguma aula sua.
            </p>
          </div>
          <Toggle
            checked={state.settings.notifications.interestNotifications}
            onChange={(value) =>
              handleNotificationChange("interestNotifications", value)
            }
          />
        </div>
      </Card>

      <Card className="settings__card" padding="large">
        <div className="settings__option">
          <div className="settings__option-info">
            <h3 className="settings__option-title">
              Notificações de Cursos Novos:
            </h3>
            <p className="settings__option-description">
              Mantendo esta opção habilitada, você receberá notificações de
              cursos recém-criados que estão ligados a suas áreas de interesse.
            </p>
          </div>
          <Toggle
            checked={state.settings.notifications.newCoursesNotifications}
            onChange={(value) =>
              handleNotificationChange("newCoursesNotifications", value)
            }
          />
        </div>
      </Card>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="settings__section">
      <h2 className="settings__section-title">Aparência</h2>

      <Card className="settings__card" padding="large">
        <div className="settings__option settings__option--vertical">
          <div className="settings__option-info">
            <div className="settings__option-header">
              <Palette size={20} />
              <h3 className="settings__option-title">Tema:</h3>
            </div>
            <p className="settings__option-description">
              Aplicar tema claro ou escuro.
            </p>
          </div>

          <div className="settings__theme-options">
            <button
              className={`settings__theme-option ${
                currentTheme === "system"
                  ? "settings__theme-option--active"
                  : ""
              }`}
              onClick={() => setTheme("system")}
            >
              <Desktop size={20} />
              <span>Sistema</span>
            </button>

            <button
              className={`settings__theme-option ${
                currentTheme === "light" ? "settings__theme-option--active" : ""
              }`}
              onClick={() => setTheme("light")}
            >
              <Sun size={20} />
              <span>Claro</span>
            </button>

            <button
              className={`settings__theme-option ${
                currentTheme === "dark" ? "settings__theme-option--active" : ""
              }`}
              onClick={() => setTheme("dark")}
            >
              <Moon size={20} />
              <span>Escuro</span>
            </button>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="settings__section">
      <h2 className="settings__section-title">Conta e Segurança</h2>

      {/* Alterar Senha */}
      {state.isAuthenticated && (
        <Card className="settings__card" padding="large">
          <div className="settings__option settings__option--vertical">
            <div className="settings__option-info">
              <div className="settings__option-header">
                <Lock size={20} />
                <h3 className="settings__option-title">Alterar Senha</h3>
              </div>
              <p className="settings__option-description">
                Troque sua senha atual por uma nova. Sua senha deve ter no mínimo 6 caracteres.
              </p>
            </div>

            {passwordSuccess && (
              <div className="settings__success-message">
                {passwordSuccess}
              </div>
            )}

            {passwordError && (
              <div className="settings__error-message">
                {passwordError}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="settings__password-form">
              <FormField
                label="Senha Atual"
                name="currentPassword"
                type={showCurrentPassword ? 'text' : 'password'}
                value={passwordForm.currentPassword}
                onChange={handlePasswordInputChange}
                placeholder="Digite sua senha atual"
                leftIcon={<Lock size={20} />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="settings__password-toggle"
                  >
                    {showCurrentPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                  </button>
                }
                required
              />

              <FormField
                label="Nova Senha"
                name="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                value={passwordForm.newPassword}
                onChange={handlePasswordInputChange}
                placeholder="Digite sua nova senha"
                leftIcon={<Lock size={20} />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="settings__password-toggle"
                  >
                    {showNewPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                  </button>
                }
                required
              />

              <FormField
                label="Confirmar Nova Senha"
                name="confirmNewPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={passwordForm.confirmNewPassword}
                onChange={handlePasswordInputChange}
                placeholder="Confirme sua nova senha"
                leftIcon={<Lock size={20} />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="settings__password-toggle"
                  >
                    {showConfirmPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                  </button>
                }
                required
              />

              <div className="settings__password-requirements">
                <p className="settings__password-requirements-title">Sua nova senha deve conter:</p>
                <ul className="settings__password-requirements-list">
                  <li className={passwordForm.newPassword.length >= 6 ? 'valid' : ''}>
                    Mínimo 6 caracteres
                  </li>
                  <li className={/[a-z]/.test(passwordForm.newPassword) ? 'valid' : ''}>
                    Uma letra minúscula
                  </li>
                  <li className={/[A-Z]/.test(passwordForm.newPassword) ? 'valid' : ''}>
                    Uma letra maiúscula
                  </li>
                  <li className={/[0-9]/.test(passwordForm.newPassword) ? 'valid' : ''}>
                    Um número
                  </li>
                </ul>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="large"
                loading={passwordLoading}
                disabled={
                  !passwordForm.currentPassword ||
                  !passwordForm.newPassword ||
                  !passwordForm.confirmNewPassword ||
                  passwordLoading
                }
              >
                {passwordLoading ? 'Alterando...' : 'Alterar Senha'}
              </Button>
            </form>
          </div>
        </Card>
      )}

      {/* Esqueceu a senha */}
      {!state.isAuthenticated && (
        <Card className="settings__card" padding="large">
          <div className="settings__option settings__option--vertical">
            <div className="settings__option-info">
              <div className="settings__option-header">
                <Lock size={20} />
                <h3 className="settings__option-title">Esqueceu sua senha?</h3>
              </div>
              <p className="settings__option-description">
                Enviaremos um link para redefinir sua senha por email.
              </p>
            </div>
            <Button 
              variant="primary" 
              onClick={() => actions.setCurrentPage('forgot-password')}
            >
              Recuperar Senha
            </Button>
          </div>
        </Card>
      )}

      {/* Gerenciar Conta */}
      <Card className="settings__card" padding="large">
        <div className="settings__option settings__option--vertical">
          <div className="settings__option-info">
            <div className="settings__option-header">
              <UserCircle size={20} />
              <h3 className="settings__option-title">Gerenciar Conta</h3>
            </div>
            <p className="settings__option-description">
              Edite suas informações pessoais ou exclua sua conta permanentemente.
            </p>
          </div>
          <div className="settings__account-actions">
            <Button variant="outline" onClick={handleEditProfile}>
              <UserCircle size={18} />
              Editar Perfil
            </Button>
            {state.isAuthenticated && (
              <Button variant="danger" onClick={handleDeleteAccount}>
                <Trash size={18} />
                Excluir Conta
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );

  const renderCurrentSection = () => {
    switch (activeSection) {
      case "accessibility":
        return renderAccessibilitySettings();
      case "notifications":
        return renderNotificationSettings();
      case "appearance":
        return renderAppearanceSettings();
      case "security":
        return renderSecuritySettings();
      default:
        return renderAccessibilitySettings();
    }
  };

  return (
    <DashboardTemplate>
      <div className="settings">
        <div className="settings__layout">
          {/* Sidebar */}
          <div className="settings__sidebar">
            <h1 className="settings__title">Configurações</h1>
            <nav className="settings__nav">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  className={`settings__nav-item ${
                    activeSection === item.id
                      ? "settings__nav-item--active"
                      : ""
                  }`}
                  onClick={() => setActiveSection(item.id)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="settings__content">{renderCurrentSection()}</div>
        </div>
      </div>

      {/* Modal de Exclusão de Conta */}
      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
        userName={state.user?.name}
      />
    </DashboardTemplate>
  );
};

export default Settings;
