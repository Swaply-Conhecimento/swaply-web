import axios from 'axios';

// Base URL da API - usa variável de ambiente ou fallback
// Para desenvolvimento local, crie um arquivo .env.local com:
// VITE_API_BASE_URL=http://localhost:5000/api
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.DEV ? 'http://localhost:5000/api' : 'https://swaply-api.onrender.com/api');

// Criar instância do axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 segundos - aumentado para lidar com cold start do servidor
});

// Flag para evitar loop infinito de refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Interceptor de requisição - adicionar token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Se o body for FormData, remover Content-Type para o browser definir automaticamente com boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de resposta - refresh token automático
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se erro 401 e não é uma requisição de refresh/login
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Se for erro no login ou registro, apenas rejeitar o erro sem redirecionar
      // O componente Auth vai tratar o erro e mostrar a mensagem
      if (originalRequest.url.includes('/auth/login') || 
          originalRequest.url.includes('/auth/register')) {
        // Não fazer logout nem redirecionar - apenas rejeitar o erro
        return Promise.reject(error);
      }
      
      // Se falhou no refresh token, fazer logout
      if (originalRequest.url.includes('/auth/refresh-token')) {
        // Só remover token se realmente for erro 401 (token inválido)
        // Não remover por timeout ou erros de rede
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.href = '/';
        }
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Se já está fazendo refresh, adicionar à fila
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        // Só remover e redirecionar se realmente não houver refreshToken
        localStorage.removeItem('token');
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
          refreshToken,
        });

        const { token, refreshToken: newRefreshToken } = data.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', newRefreshToken);
        
        apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
        originalRequest.headers.Authorization = `Bearer ${token}`;
        
        processQueue(null, token);
        
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Só remover tokens se refresh falhou com 401 (token realmente inválido)
        if (refreshError.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.href = '/';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Helper para extrair mensagem de erro
export const getErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.errors) {
    return error.response.data.errors.join(', ');
  }
  if (error.message) {
    return error.message;
  }
  return 'Ocorreu um erro inesperado';
};

// Helper para verificar se está autenticado
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Helper para fazer logout
export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
};

export default apiClient;



