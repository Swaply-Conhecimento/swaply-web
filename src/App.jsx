import React from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import { Dashboard, Auth, Profile, Settings, CourseDetails, Favorites, Calendar, MyCourses, ScheduleClass, Notifications } from './components/pages';
import { AddCourseModal } from './components/organisms';
import { useTheme } from './hooks/useTheme';
import { useAccessibility } from './hooks/useAccessibility';
import './App.css';

const AppContent = () => {
  const { state, actions } = useApp();
  
  // Initialize theme and accessibility
  useTheme();
  useAccessibility();

  const handleLogin = () => {
    actions.setCurrentPage('dashboard');
  };

  const renderCurrentPage = () => {
    switch (state.currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'auth':
        return <Auth onLogin={handleLogin} />;
      case 'profile':
        return <Profile />;
      case 'settings':
        return <Settings />;
      case 'course-details':
        return <CourseDetails />;
      case 'favorites':
        return <Favorites />;
      case 'calendar':
        return <Calendar />;
      case 'my-courses-completed':
        return <MyCourses initialTab="completed" />;
      case 'my-courses-teaching':
        return <MyCourses initialTab="teaching" />;
      case 'schedule-class':
        return <ScheduleClass />;
      case 'notifications':
        return <Notifications />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="App">
      {renderCurrentPage()}
      
      {/* Modals */}
      <AddCourseModal
        isOpen={state.modals.addCourse}
        onClose={() => actions.closeModal('addCourse')}
      />
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App
