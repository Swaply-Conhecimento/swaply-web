import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  House, 
  User, 
  Heart, 
  Plus, 
  Calendar,
  Bell,
  Gear,
  SignOut,
  SignIn,
  Coins,
  BookOpen,
  X
} from '@phosphor-icons/react';
import { useApp } from '../../../contexts';
import Logo from '../../atoms/Logo';
import ConfirmLogoutModal from '../../molecules/ConfirmLogoutModal/ConfirmLogoutModal';
import './Sidebar.css';

const Sidebar = ({
  className = '',
}) => {
  const { state, actions } = useApp();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const unreadNotificationsCount = state.notifications.filter(n => !n.isRead).length;
  const isAuthenticated = state.isAuthenticated;
  // Menu para usuários NÃO autenticados
  const guestMenuItems = [
    {
      id: 'dashboard',
      label: 'Catálogo',
      icon: <BookOpen size={24} />,
      page: 'dashboard',
    },
  ];

  // Menu para usuários AUTENTICADOS
  const authenticatedMenuItems = [
    {
      id: 'dashboard',
      label: 'Início',
      icon: <House size={24} />,
      page: 'dashboard',
    },
    {
      id: 'profile',
      label: 'Perfil',
      icon: <User size={24} />,
      page: 'profile',
    },
    {
      id: 'favorites',
      label: 'Favoritos',
      icon: <Heart size={24} />,
      page: 'favorites',
    },
    {
      id: 'new-course',
      label: 'Novo Curso',
      icon: <Plus size={24} />,
      action: 'openModal',
      modal: 'addCourse',
    },
    {
      id: 'calendar',
      label: 'Agenda',
      icon: <Calendar size={24} />,
      page: 'calendar',
    },
    {
      id: 'notifications',
      label: 'Notificações',
      icon: <Bell size={24} />,
      page: 'notifications',
      badge: unreadNotificationsCount,
    },
  ];

  // Menu de configurações para NÃO autenticados
  const guestSettingsItems = [
    {
      id: 'settings',
      label: 'Configurações',
      icon: <Gear size={24} />,
      page: 'settings',
    },
    {
      id: 'login',
      label: 'Entrar',
      icon: <SignIn size={24} />,
      page: 'auth',
    },
  ];

  // Menu de configurações para AUTENTICADOS
  const authenticatedSettingsItems = [
    {
      id: 'settings',
      label: 'Configurações',
      icon: <Gear size={24} />,
      page: 'settings',
    },
    {
      id: 'logout',
      label: 'Sair',
      icon: <SignOut size={24} />,
      action: 'logout',
    },
  ];

  // Selecionar menus baseado em autenticação
  const menuItems = isAuthenticated ? authenticatedMenuItems : guestMenuItems;
  const settingsItems = isAuthenticated ? authenticatedSettingsItems : guestSettingsItems;

  const handleMenuClick = async (item) => {
    // Fechar sidebar no mobile após clicar em um item
    if (window.innerWidth <= 768 && state.sidebarOpen) {
      actions.toggleSidebar();
    }

    if (item.action === 'openModal') {
      actions.openModal(item.modal);
    } else if (item.action === 'logout') {
      // Mostrar modal de confirmação antes de fazer logout
      setShowLogoutModal(true);
    } else if (item.page) {
      actions.setCurrentPage(item.page);
    }
  };

  const handleConfirmLogout = async () => {
    setShowLogoutModal(false);
    await actions.logout();
    actions.setCurrentPage('auth');
  };

  return (
    <aside className={`sidebar ${state.sidebarOpen ? 'sidebar--open' : 'sidebar--closed'} ${className}`}>
      <div className="sidebar__header">
        <div className="sidebar__logo">
          <Logo variant="simples" size="large" />
          {state.sidebarOpen && (
            <div className="sidebar__brand">
              <span className="sidebar__brand-name">Swaply</span>
              {isAuthenticated && (
                <div className="sidebar__credits">
                  <Coins size={20} weight="fill" />
                  <span className="sidebar__credits-amount">{state.user?.credits || 0}</span>
                </div>
              )}
            </div>
          )}
        </div>
        {/* Botão de fechar no mobile */}
        <button
          className="sidebar__close-mobile"
          onClick={actions.toggleSidebar}
          aria-label="Fechar sidebar"
        >
          <X size={24} />
        </button>
      </div>

      <nav className="sidebar__nav">
        <ul className="sidebar__menu">
          {menuItems.map((item) => (
            <li key={item.id} className="sidebar__menu-item">
              <button
                className={`sidebar__menu-button ${
                  state.currentPage === item.page ? 'sidebar__menu-button--active' : ''
                }`}
                onClick={() => handleMenuClick(item)}
                title={!state.sidebarOpen ? item.label : undefined}
              >
                <span className="sidebar__menu-icon">
                  {item.icon}
                  {item.badge && item.badge > 0 && (
                    <span className="sidebar__notification-badge">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </span>
                {state.sidebarOpen && (
                  <span className="sidebar__menu-label">{item.label}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar__footer">
        <ul className="sidebar__menu">
          {settingsItems.map((item) => (
            <li key={item.id} className="sidebar__menu-item">
              <button
                className={`sidebar__menu-button ${
                  state.currentPage === item.page ? 'sidebar__menu-button--active' : ''
                }`}
                onClick={() => handleMenuClick(item)}
                title={!state.sidebarOpen ? item.label : undefined}
              >
                <span className="sidebar__menu-icon">{item.icon}</span>
                {state.sidebarOpen && (
                  <span className="sidebar__menu-label">{item.label}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <button
        className="sidebar__toggle"
        onClick={actions.toggleSidebar}
        aria-label={state.sidebarOpen ? 'Fechar sidebar' : 'Abrir sidebar'}
      >
        <span className="sidebar__toggle-icon">
          {state.sidebarOpen ? '←' : '→'}
        </span>
      </button>

      {/* Modal de Confirmação de Logout */}
      <ConfirmLogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
        userName={state.user?.name || state.user?.email}
      />
    </aside>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
};

export default Sidebar;
