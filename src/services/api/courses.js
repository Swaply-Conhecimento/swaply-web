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
   * Suporta tanto JSON quanto FormData (quando há imagem)
   */
  createCourse: async (courseData, imageFile = null) => {
    try {
      let dataToSend = courseData;
      let headers = {};

      // Se houver imagem (arquivo), usar FormData
      if (imageFile) {
        const formData = new FormData();
        
        // Adicionar campos do curso (remover 'image' se existir, pois será enviado como arquivo)
        Object.keys(courseData).forEach(key => {
          // Pular o campo 'image' do courseData, pois será enviado como arquivo
          if (key === 'image') return;
          
          const value = courseData[key];
          
          // Tratar objetos aninhados (como pricing e availability)
          // Todos os objetos e arrays devem ser enviados como JSON string
          // O backend deve fazer o parse dessas strings JSON
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else if (typeof value === 'object' && value !== null) {
            formData.append(key, JSON.stringify(value));
          } else {
            // Valores primitivos
            formData.append(key, value);
          }
        });
        
        // Adicionar imagem como arquivo
        formData.append('image', imageFile);
        
        dataToSend = formData;
        // Não definir Content-Type manualmente - deixar o browser definir com boundary
        headers = {};
      } else {
        // Quando não há imageFile, remover o campo 'image' do JSON para evitar enviar image: {}
        const { image, ...dataWithoutImage } = courseData;
        dataToSend = dataWithoutImage;
        headers = {
          'Content-Type': 'application/json',
        };
      }

      const { data } = await apiClient.post('/courses', dataToSend, { headers });
      return {
        success: true,
        course: data.data,
        message: data.message,
      };
    } catch (error) {
      // Preservar a resposta original do erro
      const err = new Error(getErrorMessage(error));
      err.response = error.response;
      err.status = error.response?.status;
      err.data = error.response?.data;
      throw err;
    }
  },

  /**
   * PUT /courses/:id
   * Atualizar curso
   * Suporta tanto JSON quanto FormData (quando há imagem)
   */
  updateCourse: async (courseId, courseData, imageFile = null) => {
    try {
      // Debug: verificar o que está sendo recebido
      console.log('📤 updateCourse - imageFile recebido:', imageFile);
      console.log('📤 updateCourse - Tipo de imageFile:', typeof imageFile);
      if (imageFile) {
        console.log('📤 updateCourse - imageFile é File?', imageFile instanceof File);
        console.log('📤 updateCourse - imageFile.name:', imageFile.name);
        console.log('📤 updateCourse - imageFile.size:', imageFile.size);
      }
      
      let dataToSend = courseData;
      let headers = {};

      // Se houver imagem (arquivo), usar FormData
      // Se imageFile for undefined, usar JSON normal (sem campo image)
      if (imageFile !== null && imageFile !== undefined) {
        console.log('📤 updateCourse - Usando FormData para enviar imagem');
        const formData = new FormData();
        
        // Adicionar campos do curso (remover 'image' se existir, pois será enviado como arquivo)
        Object.keys(courseData).forEach(key => {
          // Pular o campo 'image' do courseData, pois será enviado como arquivo
          if (key === 'image') return;
          
          const value = courseData[key];
          
          // Tratar objetos aninhados (como pricing e availability)
          // Todos os objetos e arrays devem ser enviados como JSON string
          // O backend deve fazer o parse dessas strings JSON
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else if (typeof value === 'object' && value !== null) {
            formData.append(key, JSON.stringify(value));
          } else {
            // Valores primitivos
            formData.append(key, value);
          }
        });
        
        // Adicionar imagem como arquivo
        formData.append('image', imageFile);
        
        // Debug: verificar se a imagem foi adicionada ao FormData
        console.log('📤 updateCourse - FormData criado, verificando se image foi adicionado...');
        for (let pair of formData.entries()) {
          console.log('📤 updateCourse - FormData entry:', pair[0], pair[1] instanceof File ? `File: ${pair[1].name} (${pair[1].size} bytes)` : pair[1]);
        }
        
        dataToSend = formData;
        // Não definir Content-Type manualmente - deixar o browser definir com boundary
        headers = {};
      } else {
        // Quando não há imageFile, remover o campo 'image' do JSON para evitar enviar image: {}
        const { image, ...dataWithoutImage } = courseData;
        dataToSend = dataWithoutImage;
        headers = {
          'Content-Type': 'application/json',
        };
      }

      const { data } = await apiClient.put(`/courses/${courseId}`, dataToSend, { headers });
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
   * DELETE /courses/:id/image
   * Remover imagem do curso
   */
  deleteCourseImage: async (courseId) => {
    try {
      const { data } = await apiClient.delete(`/courses/${courseId}/image`);
      return {
        success: true,
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




