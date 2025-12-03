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
  PlatformReview,
  AvailabilitySettings,
} from "./components/pages";
import { AddCourseModal, EditCourseModal } from "./components/organisms";
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

  // Processar URLs diretas quando a aplicação carrega
  // Converte URLs como /feedback/plataforma para o sistema de roteamento interno
  React.useEffect(() => {
    // Só processar após o loading terminar para não interferir com a restauração de token
    if (state.isLoading) return;

    // Verificar se já processamos a URL (evitar processar múltiplas vezes)
    const urlProcessed = sessionStorage.getItem('urlProcessed');
    if (urlProcessed === 'true') return;

    // Mapeamento de URLs para páginas internas
    const urlToPageMap = {
      '/feedback/plataforma': 'platform-review',
      '/platform-review': 'platform-review',
      '/dashboard': 'dashboard',
      '/auth': 'auth',
      '/login': 'auth',
      '/register': 'auth',
      '/profile': 'profile',
      '/edit-profile': 'edit-profile',
      '/settings': 'settings',
      '/favorites': 'favorites',
      '/calendar': 'calendar',
      '/my-courses': 'my-courses-completed',
      '/notifications': 'notifications',
      '/schedule-class': 'schedule-class',
      '/terms': 'terms',
      '/forgot-password': 'forgot-password',
      '/reset-password': 'reset-password',
      '/availability-settings': 'availability-settings',
    };

    // Obter pathname e query params da URL
    const pathname = window.location.pathname.toLowerCase();
    const searchParams = new URLSearchParams(window.location.search);
    const reviewParam = searchParams.get('review');
    
    // Processar URLs de cursos com review: /courses/:id?review=1
    const courseReviewMatch = pathname.match(/^\/courses\/([^/]+)$/);
    if (courseReviewMatch && reviewParam === '1') {
      const courseId = courseReviewMatch[1];
      console.log(`🔄 Detectada URL de avaliação de curso: /courses/${courseId}?review=1`);
      
      // Se a página requer autenticação e o usuário não está autenticado,
      // salvar dados para redirecionar após login
      if (!state.isAuthenticated) {
        sessionStorage.setItem('redirectAfterLogin', 'course-details');
        sessionStorage.setItem('redirectCourseId', courseId);
        sessionStorage.setItem('openReviewModal', 'true');
      } else {
        // Navegar para o curso e abrir modal de avaliação
        actions.setSelectedCourse({ id: courseId });
        actions.setCurrentPage('course-details');
        sessionStorage.setItem('openReviewModal', 'true');
      }
      
      // Limpar a URL do navegador
      window.history.replaceState({}, '', '/');
      sessionStorage.setItem('urlProcessed', 'true');
      return;
    }
    
    // Processar outras URLs de cursos: /courses/:id (sem review)
    if (courseReviewMatch && !reviewParam) {
      const courseId = courseReviewMatch[1];
      console.log(`🔄 Detectada URL de curso: /courses/${courseId}`);
      
      if (!state.isAuthenticated) {
        sessionStorage.setItem('redirectAfterLogin', 'course-details');
        sessionStorage.setItem('redirectCourseId', courseId);
      } else {
        actions.setSelectedCourse({ id: courseId });
        actions.setCurrentPage('course-details');
      }
      
      window.history.replaceState({}, '', '/');
      sessionStorage.setItem('urlProcessed', 'true');
      return;
    }
    
    // Se encontrar uma correspondência no mapa, navegar para a página
    if (urlToPageMap[pathname] && urlToPageMap[pathname] !== state.currentPage) {
      console.log(`🔄 Convertendo URL ${pathname} para página: ${urlToPageMap[pathname]}`);
      
      // Se a página requer autenticação e o usuário não está autenticado,
      // salvar a página desejada para redirecionar após login
      if (protectedPages.includes(urlToPageMap[pathname]) && !state.isAuthenticated) {
        sessionStorage.setItem('redirectAfterLogin', urlToPageMap[pathname]);
      }
      
      // Limpar a URL do navegador para manter limpa
      window.history.replaceState({}, '', '/');
      
      // Marcar que já processamos a URL
      sessionStorage.setItem('urlProcessed', 'true');
      
      actions.setCurrentPage(urlToPageMap[pathname]);
    } else {
      // Mesmo que não encontre correspondência, marcar como processado
      sessionStorage.setItem('urlProcessed', 'true');
    }
  }, [state.isLoading, state.currentPage, state.isAuthenticated, actions, protectedPages]);

  // Não precisa mais dessa função, o AppContext cuida do redirecionamento
  const handleLogin = () => {
    // Função vazia mantida para compatibilidade, mas não faz nada
    // O redirecionamento é feito automaticamente pelo AppContext após login bem-sucedido
  };

  // Rotas protegidas que exigem autenticação
  const protectedPages = React.useMemo(() => [
    'profile',
    'edit-profile',
    'favorites', 
    'calendar',
    'my-courses-completed',
    'my-courses-teaching',
    'schedule-class',
    'notifications',
    'platform-review'
  ], []);

  // Verificar se usuário está tentando acessar rota protegida sem autenticação
  // Só executar depois que o loading terminar para não interferir na restauração do token
  React.useEffect(() => {
    // Aguardar o loading terminar antes de verificar autenticação
    if (state.isLoading) return;
    
    if (!state.isAuthenticated && protectedPages.includes(state.currentPage)) {
      // Redirecionar para login se tentar acessar área protegida
      actions.setCurrentPage('auth');
    }
  }, [state.isAuthenticated, state.currentPage, state.isLoading, protectedPages, actions]);

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
      case "platform-review":
        return <PlatformReview />;
      case "availability-settings":
        return <AvailabilitySettings />;
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
      <EditCourseModal
        isOpen={state.modals.editCourse}
        onClose={() => actions.closeModal("editCourse")}
        course={state.selectedCourse}
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
