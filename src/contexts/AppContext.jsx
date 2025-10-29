import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService, userService } from '../services/api';

// Initial State
const initialState = {
  // Autenticação
  isAuthenticated: false,
  isLoading: true,
  token: null,
  refreshToken: null,

  // Usuário
  currentPage: 'dashboard',
  user: null,

  // Settings
  settings: {
    theme: 'light',
    fontSize: 'medium',
    accessibility: {
      fontSizeControl: true,
      screenReader: false,
      audioDescription: false,
      vlibras: false
    },
    notifications: {
      classNotifications: true,
      interestNotifications: true,
      newCoursesNotifications: true
    }
  },

  // Modals
  modals: {
    editProfile: false,
    addCourse: false,
    courseDetails: false,
    confirmDelete: false
  },

  // UI State
  selectedCourse: null,
  sidebarOpen: true,
  isReading: false,
  scheduledClasses: [],
  notifications: [],
  unreadNotificationsCount: 0,
};

// Action Types
const actionTypes = {
  // Auth
  SET_AUTH: 'SET_AUTH',
  SET_LOADING: 'SET_LOADING',
  LOGOUT: 'LOGOUT',
  
  // User
  SET_USER: 'SET_USER',
  UPDATE_USER: 'UPDATE_USER',
  UPDATE_CREDITS: 'UPDATE_CREDITS',
  
  // Navigation
  SET_CURRENT_PAGE: 'SET_CURRENT_PAGE',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  
  // Modals
  OPEN_MODAL: 'OPEN_MODAL',
  CLOSE_MODAL: 'CLOSE_MODAL',
  
  // Settings
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  
  // Courses
  SET_SELECTED_COURSE: 'SET_SELECTED_COURSE',
  TOGGLE_FAVORITE: 'TOGGLE_FAVORITE',
  
  // Classes
  ADD_SCHEDULED_CLASS: 'ADD_SCHEDULED_CLASS',
  SET_SCHEDULED_CLASSES: 'SET_SCHEDULED_CLASSES',
  REMOVE_SCHEDULED_CLASS: 'REMOVE_SCHEDULED_CLASS',
  
  // Notifications
  SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',
  SET_UNREAD_COUNT: 'SET_UNREAD_COUNT',
  MARK_NOTIFICATION_AS_READ: 'MARK_NOTIFICATION_AS_READ',
  MARK_ALL_NOTIFICATIONS_AS_READ: 'MARK_ALL_NOTIFICATIONS_AS_READ',
  DELETE_NOTIFICATION: 'DELETE_NOTIFICATION',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  
  // Accessibility
  SET_READING: 'SET_READING',
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_AUTH:
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        isLoading: false,
      };
    
    case actionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    
    case actionTypes.LOGOUT:
      return {
        ...initialState,
        isLoading: false,
        isAuthenticated: false,
        currentPage: 'auth',
      };
    
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.payload,
      };
    
    case actionTypes.UPDATE_USER:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
      };
    
    case actionTypes.UPDATE_CREDITS:
      return {
        ...state,
        user: {
          ...state.user,
          credits: state.user.credits + action.payload,
        },
      };
    
    case actionTypes.SET_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.payload,
      };
    
    case actionTypes.TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen,
      };
    
    case actionTypes.OPEN_MODAL:
      return {
        ...state,
        modals: {
          ...state.modals,
          [action.payload]: true,
        },
      };
    
    case actionTypes.CLOSE_MODAL:
      return {
        ...state,
        modals: {
          ...state.modals,
          [action.payload]: false,
        },
      };
    
    case actionTypes.UPDATE_SETTINGS:
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload,
        },
      };
    
    case actionTypes.SET_SELECTED_COURSE:
      return {
        ...state,
        selectedCourse: action.payload,
      };
    
    case actionTypes.TOGGLE_FAVORITE:
      const courseId = action.payload;
      const favorites = state.user?.favorites?.includes(courseId)
        ? state.user.favorites.filter(id => id !== courseId)
        : [...(state.user?.favorites || []), courseId];
      
      return {
        ...state,
        user: {
          ...state.user,
          favorites,
        },
      };
    
    case actionTypes.ADD_SCHEDULED_CLASS:
      return {
        ...state,
        scheduledClasses: [...state.scheduledClasses, action.payload],
      };
    
    case actionTypes.SET_SCHEDULED_CLASSES:
      return {
        ...state,
        scheduledClasses: action.payload,
      };
    
    case actionTypes.REMOVE_SCHEDULED_CLASS:
      return {
        ...state,
        scheduledClasses: state.scheduledClasses.filter(
          cls => cls._id !== action.payload && cls.id !== action.payload
        ),
      };
    
    case actionTypes.SET_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload,
      };
    
    case actionTypes.SET_UNREAD_COUNT:
      return {
        ...state,
        unreadNotificationsCount: action.payload,
      };
    
    case actionTypes.MARK_NOTIFICATION_AS_READ:
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification._id === action.payload || notification.id === action.payload
            ? { ...notification, isRead: true }
            : notification
        ),
        unreadNotificationsCount: Math.max(0, state.unreadNotificationsCount - 1),
      };
    
    case actionTypes.MARK_ALL_NOTIFICATIONS_AS_READ:
      return {
        ...state,
        notifications: state.notifications.map(notification => ({
          ...notification,
          isRead: true,
        })),
        unreadNotificationsCount: 0,
      };
    
    case actionTypes.DELETE_NOTIFICATION:
      const notificationToDelete = state.notifications.find(
        n => n._id === action.payload || n.id === action.payload
      );
      const wasUnread = notificationToDelete && !notificationToDelete.isRead;
      
      return {
        ...state,
        notifications: state.notifications.filter(
          notification => notification._id !== action.payload && notification.id !== action.payload
        ),
        unreadNotificationsCount: wasUnread 
          ? Math.max(0, state.unreadNotificationsCount - 1) 
          : state.unreadNotificationsCount,
      };
    
    case actionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadNotificationsCount: !action.payload.isRead 
          ? state.unreadNotificationsCount + 1 
          : state.unreadNotificationsCount,
      };
    
    case actionTypes.SET_READING:
      return {
        ...state,
        isReading: action.payload,
      };
    
    default:
      return state;
  }
};

// Context
const AppContext = createContext();

// Provider Component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Verificar autenticação ao carregar
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        // Sem token - usuário começa deslogado no dashboard (catálogo)
        dispatch({ type: actionTypes.SET_LOADING, payload: false });
        dispatch({ type: actionTypes.SET_CURRENT_PAGE, payload: 'dashboard' });
        return;
      }

      try {
        const { user } = await authService.verifyToken();
        
        dispatch({
          type: actionTypes.SET_AUTH,
          payload: {
            isAuthenticated: true,
            token,
            refreshToken: localStorage.getItem('refreshToken'),
          },
        });
        
        dispatch({ type: actionTypes.SET_USER, payload: user });

        // Carregar notificações recentes
        try {
          const { notifications, unreadCount } = await import('../services/api').then(
            mod => mod.notificationService.getRecentNotifications()
          );
          dispatch({ type: actionTypes.SET_NOTIFICATIONS, payload: notifications });
          dispatch({ type: actionTypes.SET_UNREAD_COUNT, payload: unreadCount });
        } catch (error) {
          console.error('Erro ao carregar notificações:', error);
        }

        // Carregar aulas agendadas
        try {
          const classService = await import('../services/api/classes').then(mod => mod.default);
          const { classes } = await classService.getScheduledClasses();
          dispatch({ type: actionTypes.SET_SCHEDULED_CLASSES, payload: classes });
        } catch (error) {
          console.error('Erro ao carregar aulas agendadas:', error);
        }
      } catch (error) {
        console.error('Token inválido:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        dispatch({ type: actionTypes.SET_LOADING, payload: false });
      }
    };

    checkAuth();
  }, []);

  // Actions com integração da API
  const actions = {
    // Auth Actions
    login: async (credentials) => {
      try {
        console.log('🔑 AppContext: Iniciando login...', credentials.email);
        const { user, token, refreshToken } = await authService.login(credentials);
        
        console.log('✅ AppContext: Login bem-sucedido, atualizando estado...');
        
        dispatch({
          type: actionTypes.SET_AUTH,
          payload: { isAuthenticated: true, token, refreshToken },
        });
        
        dispatch({ type: actionTypes.SET_USER, payload: user });
        dispatch({ type: actionTypes.SET_CURRENT_PAGE, payload: 'dashboard' });
        
        console.log('✅ AppContext: Estado atualizado, usuário autenticado');
        return { success: true };
      } catch (error) {
        console.error('❌ AppContext: Erro no login:', error.message);
        
        // Garantir que não há autenticação
        dispatch({
          type: actionTypes.SET_AUTH,
          payload: { isAuthenticated: false, token: null, refreshToken: null },
        });
        
        // Manter na página de auth
        dispatch({ type: actionTypes.SET_CURRENT_PAGE, payload: 'auth' });
        
        return { success: false, error: error.message };
      }
    },

    register: async (userData) => {
      try {
        console.log('📝 AppContext: Iniciando registro...', userData.email);
        const { user, token, refreshToken } = await authService.register(userData);
        
        console.log('✅ AppContext: Registro bem-sucedido, atualizando estado...');
        
        dispatch({
          type: actionTypes.SET_AUTH,
          payload: { isAuthenticated: true, token, refreshToken },
        });
        
        dispatch({ type: actionTypes.SET_USER, payload: user });
        dispatch({ type: actionTypes.SET_CURRENT_PAGE, payload: 'dashboard' });
        
        console.log('✅ AppContext: Estado atualizado, usuário registrado e autenticado');
        return { success: true };
      } catch (error) {
        console.error('❌ AppContext: Erro no registro:', error.message);
        
        // Garantir que não há autenticação
        dispatch({
          type: actionTypes.SET_AUTH,
          payload: { isAuthenticated: false, token: null, refreshToken: null },
        });
        
        // Manter na página de auth
        dispatch({ type: actionTypes.SET_CURRENT_PAGE, payload: 'auth' });
        
        return { success: false, error: error.message };
      }
    },

    logout: async () => {
      try {
        await authService.logout();
      } catch (error) {
        console.error('Erro ao fazer logout:', error);
      } finally {
        dispatch({ type: actionTypes.LOGOUT });
      }
    },

    // User Actions
    updateProfile: async (profileData) => {
      try {
        const { user } = await userService.updateProfile(profileData);
        dispatch({ type: actionTypes.UPDATE_USER, payload: user });
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    uploadAvatar: async (file) => {
      try {
        const { avatar } = await userService.uploadAvatar(file);
        dispatch({ type: actionTypes.UPDATE_USER, payload: { avatar } });
        return { success: true, avatar };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    updateSettings: async (settings) => {
      try {
        const { settings: updatedSettings } = await userService.updateSettings(settings);
        dispatch({ type: actionTypes.UPDATE_SETTINGS, payload: updatedSettings });
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    refreshUser: async () => {
      try {
        const { user } = await userService.getProfile();
        dispatch({ type: actionTypes.SET_USER, payload: user });
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    // Navigation Actions
    setCurrentPage: (page) => dispatch({ type: actionTypes.SET_CURRENT_PAGE, payload: page }),
    toggleSidebar: () => dispatch({ type: actionTypes.TOGGLE_SIDEBAR }),

    // Modal Actions
    openModal: (modalName) => dispatch({ type: actionTypes.OPEN_MODAL, payload: modalName }),
    closeModal: (modalName) => dispatch({ type: actionTypes.CLOSE_MODAL, payload: modalName }),

    // Course Actions
    setSelectedCourse: (course) => dispatch({ type: actionTypes.SET_SELECTED_COURSE, payload: course }),
    
    toggleFavorite: async (courseId) => {
      const isFavorite = state.user?.favorites?.includes(courseId);
      
      try {
        await userService.toggleFavorite(courseId, isFavorite);
        dispatch({ type: actionTypes.TOGGLE_FAVORITE, payload: courseId });
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    // Notification Actions
    loadNotifications: async (params) => {
      try {
        const { notifications, unreadCount } = await import('../services/api').then(
          mod => mod.notificationService.getNotifications(params)
        );
        dispatch({ type: actionTypes.SET_NOTIFICATIONS, payload: notifications });
        dispatch({ type: actionTypes.SET_UNREAD_COUNT, payload: unreadCount });
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    markNotificationAsRead: async (notificationId) => {
      try {
        await import('../services/api').then(
          mod => mod.notificationService.markAsRead(notificationId)
        );
        dispatch({ type: actionTypes.MARK_NOTIFICATION_AS_READ, payload: notificationId });
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    markAllNotificationsAsRead: async () => {
      try {
        await import('../services/api').then(
          mod => mod.notificationService.markAllAsRead()
        );
        dispatch({ type: actionTypes.MARK_ALL_NOTIFICATIONS_AS_READ });
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    deleteNotification: async (notificationId) => {
      try {
        await import('../services/api').then(
          mod => mod.notificationService.deleteNotification(notificationId)
        );
        dispatch({ type: actionTypes.DELETE_NOTIFICATION, payload: notificationId });
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    addNotification: (notification) => dispatch({ type: actionTypes.ADD_NOTIFICATION, payload: notification }),

    // Class Actions
    loadScheduledClasses: async () => {
      try {
        const classService = await import('../services/api/classes').then(mod => mod.default);
        const { classes } = await classService.getScheduledClasses();
        dispatch({ type: actionTypes.SET_SCHEDULED_CLASSES, payload: classes });
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    addScheduledClass: (classData) => {
      dispatch({ type: actionTypes.ADD_SCHEDULED_CLASS, payload: classData });
    },

    removeScheduledClass: (classId) => {
      dispatch({ type: actionTypes.REMOVE_SCHEDULED_CLASS, payload: classId });
    },

    // Other Actions
    updateCredits: (amount) => dispatch({ type: actionTypes.UPDATE_CREDITS, payload: amount }),
    setReading: (isReading) => dispatch({ type: actionTypes.SET_READING, payload: isReading }),
  };

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
};

// Hook
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
