import apiClient, { getErrorMessage } from './client';

/**
 * Serviços de Cursos
 */
const courseService = {
  /**
   * GET /courses
   * Listar todos os cursos com filtros
   */
  getCourses: async (params = {}) => {
    try {
      const { data } = await apiClient.get('/courses', { params });
      return {
        success: true,
        courses: data.data,
        pagination: data.pagination,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * GET /courses/search
   * Buscar cursos por termo
   */
  searchCourses: async (searchTerm, params = {}) => {
    try {
      const { data } = await apiClient.get('/courses/search', {
        params: { q: searchTerm, ...params },
      });
      return {
        success: true,
        courses: data.data,
        pagination: data.pagination,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * GET /courses/categories
   * Obter lista de categorias e subcategorias
   */
  getCategories: async () => {
    try {
      const { data } = await apiClient.get('/courses/categories');
      return {
        success: true,
        categories: data.data,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * GET /courses/featured
   * Obter cursos em destaque
   */
  getFeaturedCourses: async (limit = 6) => {
    try {
      const { data } = await apiClient.get('/courses/featured', {
        params: { limit },
      });
      return {
        success: true,
        courses: data.data,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * GET /courses/popular
   * Obter cursos populares
   */
  getPopularCourses: async (limit = 6) => {
    try {
      const { data } = await apiClient.get('/courses/popular', {
        params: { limit },
      });
      return {
        success: true,
        courses: data.data,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * GET /courses/recommended/:userId
   * Obter cursos recomendados para um usuário
   */
  getRecommendedCourses: async (userId, limit = 6) => {
    try {
      const { data } = await apiClient.get(`/courses/recommended/${userId}`, {
        params: { limit },
      });
      return {
        success: true,
        courses: data.data,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * GET /courses/:id
   * Obter detalhes de um curso
   */
  getCourseById: async (courseId) => {
    try {
      const { data } = await apiClient.get(`/courses/${courseId}`);
      return {
        success: true,
        course: data.data,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * GET /courses/:id/reviews
   * Obter avaliações de um curso
   */
  getCourseReviews: async (courseId, params = {}) => {
    try {
      const { data } = await apiClient.get(`/courses/${courseId}/reviews`, {
        params,
      });
      return {
        success: true,
        reviews: data.data.reviews,
        stats: data.data.stats,
        pagination: data.pagination,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * GET /courses/:id/students
   * Listar estudantes do curso (apenas para instrutor do curso)
   */
  getCourseStudents: async (courseId, params = {}) => {
    try {
      const { data } = await apiClient.get(`/courses/${courseId}/students`, {
        params,
      });
      return {
        success: true,
        students: data.data,
        pagination: data.pagination,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * POST /courses
   * Criar novo curso
   */
  createCourse: async (courseData) => {
    try {
      const { data } = await apiClient.post('/courses', courseData);
      return {
        success: true,
        course: data.data,
        message: data.message,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * PUT /courses/:id
   * Atualizar curso
   */
  updateCourse: async (courseId, courseData) => {
    try {
      const { data } = await apiClient.put(`/courses/${courseId}`, courseData);
      return {
        success: true,
        course: data.data,
        message: data.message,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * DELETE /courses/:id
   * Deletar curso
   */
  deleteCourse: async (courseId) => {
    try {
      const { data } = await apiClient.delete(`/courses/${courseId}`);
      return {
        success: true,
        message: data.message,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * POST /courses/:id/image
   * Upload de imagem do curso
   */
  uploadCourseImage: async (courseId, file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const { data } = await apiClient.post(
        `/courses/${courseId}/image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return {
        success: true,
        image: data.data.image,
        message: data.message,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * POST /courses/:id/enroll
   * Matricular-se em um curso
   */
  enrollInCourse: async (courseId) => {
    try {
      const { data } = await apiClient.post(`/courses/${courseId}/enroll`);
      return {
        success: true,
        message: data.message,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * DELETE /courses/:id/unenroll
   * Cancelar matrícula em um curso
   */
  unenrollFromCourse: async (courseId) => {
    try {
      const { data } = await apiClient.delete(`/courses/${courseId}/unenroll`);
      return {
        success: true,
        message: data.message,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Helper para filtros avançados
   */
  getCoursesWithFilters: async (filters) => {
    const params = {};

    // Paginação
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;

    // Filtros
    if (filters.category) params.category = filters.category;
    if (filters.subcategory) params.subcategory = filters.subcategory;
    if (filters.level) params.level = filters.level;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.search) params.search = filters.search;
    if (filters.instructor) params.instructor = filters.instructor;
    if (filters.status) params.status = filters.status;

    // Ordenação
    if (filters.sortBy) params.sortBy = filters.sortBy;
    if (filters.sortOrder) params.sortOrder = filters.sortOrder;

    return await courseService.getCourses(params);
  },
};

export default courseService;




