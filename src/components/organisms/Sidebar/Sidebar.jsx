import React from 'react';
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
  Coins
} from '@phosphor-icons/react';
import { useApp } from '../../../contexts/AppContext';
import Logo from '../../atoms/Logo';
import './Sidebar.css';

const Sidebar = ({
  className = '',
}) => {
  const { state, actions } = useApp();
  const unreadNotificationsCount = state.notifications.filter(n => !n.isRead).length;
  const menuItems = [
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
    },
  ];

  const settingsItems = [
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

  const handleMenuClick = (item) => {
    if (item.action === 'openModal') {
      actions.openModal(item.modal);
    } else if (item.action === 'logout') {
      // Handle logout
      console.log('Logout clicked');
      actions.setCurrentPage('auth');
    } else if (item.page) {
      actions.setCurrentPage(item.page);
    }
  };

  return (
    <aside className={`sidebar ${state.sidebarOpen ? 'sidebar--open' : 'sidebar--closed'} ${className}`}>
      <div className="sidebar__header">
        <div className="sidebar__logo">
          <Logo variant="simples" size="medium" />
          {state.sidebarOpen && (
            <div className="sidebar__brand">
              <span className="sidebar__brand-name">Swaply</span>
              <div className="sidebar__credits">
                <Coins size={20} weight="fill" />
                <span className="sidebar__credits-amount">{state.user.credits}</span>
              </div>
            </div>
          )}
        </div>
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
                  {item.id === 'notifications' && unreadNotificationsCount > 0 && (
                    <span className="sidebar__notification-badge">
                      {unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount}
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
    </aside>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
};

export default Sidebar;
