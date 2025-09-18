import React, { createContext, useContext, useReducer } from 'react';

// Initial State
const initialState = {
  currentPage: 'dashboard',
  user: {
    name: 'Murilo Celegatto Oliveira',
    email: 'murilo@swaply.com',
    avatar: null,
    credits: 10,
    bio: 'Amo aprender novos idiomas e hobbies. Falo italiano a 3 anos e LIBRAS a 2. Jogo RPG a 7 anos.',
    skills: ['RPG', 'Figma', 'SQL', 'Jardinagem', 'Oratória', 'Cabeleireiro'],
    joinDate: '04/09/2025',
    stats: {
      coursesCompleted: 4,
      coursesTeaching: 7,
      totalHours: 45
    },
    favorites: [1, 3, 5] // IDs dos cursos favoritos
  },
  settings: {
    theme: 'light', // 'light', 'dark', 'system'
    fontSize: 'medium', // 'small', 'medium', 'large'
    accessibility: {
      fontSizeControl: true,
      screenReader: true,
      audioDescription: true,
      vlibras: false
    },
    notifications: {
      classNotifications: true,
      interestNotifications: true,
      newCoursesNotifications: true
    }
  },
    modals: {
      editProfile: false,
      addCourse: false,
      courseDetails: false,
      confirmDelete: false
    },
  selectedCourse: null,
  sidebarOpen: true,
  isReading: false, // Para controle de leitura de áudio
  scheduledClasses: [], // Para armazenar aulas agendadas
  notifications: [
    {
      id: 1,
      type: 'class_reminder',
      title: 'Lembrete de Aula',
      message: 'Você tem uma aula de "Matemática para Concursos" em 30 minutos com Prof. Ana Costa.',
      isRead: false,
      createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutos atrás
      data: {
        courseId: 4,
        classId: 'class-123'
      }
    },
    {
      id: 2,
      type: 'credit_earned',
      title: 'Créditos Recebidos',
      message: 'Você ganhou 2 créditos por ensinar a aula de "RPG para Iniciantes".',
      isRead: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
      data: {
        credits: 2,
        courseId: 4
      }
    },
    {
      id: 3,
      type: 'new_course',
      title: 'Novo Curso Disponível',
      message: 'Um novo curso "Python Avançado" foi adicionado na categoria Tecnologia.',
      isRead: true,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 horas atrás
      data: {
        courseId: 7
      }
    },
    {
      id: 4,
      type: 'class_scheduled',
      title: 'Aula Agendada',
      message: 'Sua aula de "Italiano Básico" foi agendada para amanhã às 14:00.',
      isRead: true,
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 horas atrás
      data: {
        courseId: 2,
        classId: 'class-456'
      }
    },
    {
      id: 5,
      type: 'new_student',
      title: 'Novo Aluno',
      message: 'João Silva se inscreveu no seu curso "Jardinagem Urbana".',
      isRead: false,
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 horas atrás
      data: {
        courseId: 5,
        studentId: 'student-789'
      }
    },
    {
      id: 6,
      type: 'credit_spent',
      title: 'Créditos Utilizados',
      message: 'Você utilizou 1 crédito para agendar uma aula de "LIBRAS Intermediário".',
      isRead: true,
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 horas atrás
      data: {
        credits: 1,
        courseId: 3
      }
    },
    {
      id: 7,
      type: 'class_cancelled',
      title: 'Aula Cancelada',
      message: 'A aula de "Marketing Digital" de hoje foi cancelada pelo instrutor. Seus créditos foram reembolsados.',
      isRead: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 dia atrás
      data: {
        courseId: 5,
        classId: 'class-999',
        refundedCredits: 2
      }
    },
    {
      id: 8,
      type: 'system',
      title: 'Atualização do Sistema',
      message: 'Nova funcionalidade: Agora você pode favoritar cursos para acessá-los mais rapidamente!',
      isRead: true,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 dias atrás
      data: {
        page: 'favorites'
      }
    }
  ]
};

// Action Types
const actionTypes = {
  SET_CURRENT_PAGE: 'SET_CURRENT_PAGE',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  OPEN_MODAL: 'OPEN_MODAL',
  CLOSE_MODAL: 'CLOSE_MODAL',
  UPDATE_USER: 'UPDATE_USER',
  UPDATE_CREDITS: 'UPDATE_CREDITS',
  SET_SELECTED_COURSE: 'SET_SELECTED_COURSE',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  TOGGLE_FAVORITE: 'TOGGLE_FAVORITE',
  SET_READING: 'SET_READING',
  ADD_SCHEDULED_CLASS: 'ADD_SCHEDULED_CLASS',
  MARK_NOTIFICATION_AS_READ: 'MARK_NOTIFICATION_AS_READ',
  MARK_ALL_NOTIFICATIONS_AS_READ: 'MARK_ALL_NOTIFICATIONS_AS_READ',
  DELETE_NOTIFICATION: 'DELETE_NOTIFICATION',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION'
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.payload
      };
    
    case actionTypes.TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen
      };
    
    case actionTypes.OPEN_MODAL:
      return {
        ...state,
        modals: {
          ...state.modals,
          [action.payload]: true
        }
      };
    
    case actionTypes.CLOSE_MODAL:
      return {
        ...state,
        modals: {
          ...state.modals,
          [action.payload]: false
        }
      };
    
    case actionTypes.UPDATE_USER:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload
        }
      };
    
    case actionTypes.UPDATE_CREDITS:
      return {
        ...state,
        user: {
          ...state.user,
          credits: state.user.credits + action.payload
        }
      };
    
    case actionTypes.SET_SELECTED_COURSE:
      return {
        ...state,
        selectedCourse: action.payload
      };
    
    case actionTypes.UPDATE_SETTINGS:
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload
        }
      };
    
    case actionTypes.TOGGLE_FAVORITE:
      const courseId = action.payload;
      const favorites = state.user.favorites.includes(courseId)
        ? state.user.favorites.filter(id => id !== courseId)
        : [...state.user.favorites, courseId];
      
      return {
        ...state,
        user: {
          ...state.user,
          favorites
        }
      };
    
    case actionTypes.SET_READING:
      return {
        ...state,
        isReading: action.payload
      };
    case actionTypes.ADD_SCHEDULED_CLASS:
      return {
        ...state,
        scheduledClasses: [...state.scheduledClasses, action.payload]
      };
    
    case actionTypes.MARK_NOTIFICATION_AS_READ:
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload
            ? { ...notification, isRead: true }
            : notification
        )
      };
    
    case actionTypes.MARK_ALL_NOTIFICATIONS_AS_READ:
      return {
        ...state,
        notifications: state.notifications.map(notification => ({
          ...notification,
          isRead: true
        }))
      };
    
    case actionTypes.DELETE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(notification => 
          notification.id !== action.payload
        )
      };
    
    case actionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [action.payload, ...state.notifications]
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

  const actions = {
    setCurrentPage: (page) => dispatch({ type: actionTypes.SET_CURRENT_PAGE, payload: page }),
    toggleSidebar: () => dispatch({ type: actionTypes.TOGGLE_SIDEBAR }),
    openModal: (modalName) => dispatch({ type: actionTypes.OPEN_MODAL, payload: modalName }),
    closeModal: (modalName) => dispatch({ type: actionTypes.CLOSE_MODAL, payload: modalName }),
    updateUser: (userData) => dispatch({ type: actionTypes.UPDATE_USER, payload: userData }),
    updateCredits: (amount) => dispatch({ type: actionTypes.UPDATE_CREDITS, payload: amount }),
      setSelectedCourse: (course) => dispatch({ type: actionTypes.SET_SELECTED_COURSE, payload: course }),
      updateSettings: (settings) => dispatch({ type: actionTypes.UPDATE_SETTINGS, payload: settings }),
      toggleFavorite: (courseId) => dispatch({ type: actionTypes.TOGGLE_FAVORITE, payload: courseId }),
      setReading: (isReading) => dispatch({ type: actionTypes.SET_READING, payload: isReading }),
      addScheduledClass: (classData) => dispatch({ type: actionTypes.ADD_SCHEDULED_CLASS, payload: classData }),
      markNotificationAsRead: (notificationId) => dispatch({ type: actionTypes.MARK_NOTIFICATION_AS_READ, payload: notificationId }),
      markAllNotificationsAsRead: () => dispatch({ type: actionTypes.MARK_ALL_NOTIFICATIONS_AS_READ }),
      deleteNotification: (notificationId) => dispatch({ type: actionTypes.DELETE_NOTIFICATION, payload: notificationId }),
      addNotification: (notification) => dispatch({ type: actionTypes.ADD_NOTIFICATION, payload: notification })
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
