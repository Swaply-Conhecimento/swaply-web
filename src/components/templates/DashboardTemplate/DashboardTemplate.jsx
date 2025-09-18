import React from 'react';
import PropTypes from 'prop-types';
import { useApp } from '../../../contexts/AppContext';
import Sidebar from '../../organisms/Sidebar';
import NotificationBell from '../../atoms/NotificationBell';
import './DashboardTemplate.css';

const DashboardTemplate = ({
  children,
  className = '',
  ...props
}) => {
  const { state } = useApp();

  return (
    <div className={`dashboard-template ${className}`} {...props}>
      <Sidebar />
      
      <main className={`dashboard-template__main ${state.sidebarOpen ? 'dashboard-template__main--sidebar-open' : 'dashboard-template__main--sidebar-closed'}`}>
        <header className="dashboard-template__header">
          <div className="dashboard-template__header-content">
            <div className="dashboard-template__header-actions">
              <NotificationBell />
            </div>
          </div>
        </header>
        
        <div className="dashboard-template__content">
          {children}
        </div>
      </main>
    </div>
  );
};

DashboardTemplate.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default DashboardTemplate;
