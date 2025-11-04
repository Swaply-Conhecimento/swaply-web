import React from "react";
import { AppProvider, useApp } from "./contexts";
import {
  Dashboard,
  Auth,
  Profile,
  EditProfile,
  Settings,
  CourseDetails,
  Favorites,
  Calendar,
  MyCourses,
  ScheduleClass,
  Notifications,
  ForgotPassword,
  ResetPassword,
  Terms,
} from "./components/pages";
import { AddCourseModal } from "./components/organisms";
import { SvgColorBlindFilters } from "./components/molecules";
import { ToastContainer } from "./components/molecules/Toast";
import LoadingScreen from "./components/atoms/LoadingScreen";
import { useTheme } from "./hooks/useTheme";
import { useAccessibility } from "./hooks/useAccessibility";
import "./App.css";

const AppContent = () => {
  const { state, actions } = useApp();

  // Initialize theme and accessibility
  useTheme();
  useAccessibility();

  // Não precisa mais dessa função, o AppContext cuida do redirecionamento
  const handleLogin = () => {
    // Função vazia mantida para compatibilidade, mas não faz nada
    // O redirecionamento é feito automaticamente pelo AppContext após login bem-sucedido
  };

  // Rotas públicas que não precisam de autenticação
  const publicPages = ['auth', 'dashboard', 'course-details', 'settings', 'forgot-password', 'reset-password', 'terms'];
  
  // Rotas protegidas que exigem autenticação
  const protectedPages = [
    'profile',
    'edit-profile',
    'favorites', 
    'calendar',
    'my-courses-completed',
    'my-courses-teaching',
    'schedule-class',
    'notifications'
  ];

  // Verificar se usuário está tentando acessar rota protegida sem autenticação
  React.useEffect(() => {
    if (!state.isAuthenticated && protectedPages.includes(state.currentPage)) {
      // Redirecionar para login se tentar acessar área protegida
      actions.setCurrentPage('auth');
    }
  }, [state.isAuthenticated, state.currentPage]);

  // Se ainda está carregando, mostrar tela de loading
  if (state.isLoading) {
    return (
      <>
        <SvgColorBlindFilters />
        <LoadingScreen message="Verificando autenticação..." />
      </>
    );
  }

  const renderCurrentPage = () => {
    const page = state.currentPage;

    // Se não autenticado e tentar acessar rota protegida, mostrar login
    if (!state.isAuthenticated && protectedPages.includes(page)) {
      return <Auth onLogin={handleLogin} />;
    }

    switch (page) {
      case "dashboard":
        return <Dashboard />;
      case "auth":
        return <Auth onLogin={handleLogin} />;
      case "profile":
        return <Profile />;
      case "edit-profile":
        return <EditProfile />;
      case "settings":
        return <Settings />;
      case "course-details":
        return <CourseDetails />;
      case "favorites":
        return <Favorites />;
      case "calendar":
        return <Calendar />;
      case "my-courses-completed":
        return <MyCourses initialTab="completed" />;
      case "my-courses-teaching":
        return <MyCourses initialTab="teaching" />;
      case "schedule-class":
        return <ScheduleClass />;
      case "notifications":
        return <Notifications />;
      case "forgot-password":
        return <ForgotPassword />;
      case "reset-password":
        return <ResetPassword />;
      case "terms":
        return <Terms />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="App">
      {/* SVG Filters for colorblind support - need to be available globally */}
      <SvgColorBlindFilters />
      
      {renderCurrentPage()}

      {/* Modals */}
      <AddCourseModal
        isOpen={state.modals.addCourse}
        onClose={() => actions.closeModal("addCourse")}
      />
      
      {/* Toast Notifications */}
      <ToastContainer />
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

export default App;
