import React, { useEffect, useState } from 'react';
import { Heart, BookOpen } from '@phosphor-icons/react';
import { useApp } from '../../../contexts';
import { useUser } from '../../../hooks/useUser';
import DashboardTemplate from '../../templates/DashboardTemplate';
import CourseGrid from '../../organisms/CourseGrid';
import Card from '../../molecules/Card';
import Button from '../../atoms/Button';
import './Favorites.css';

const Favorites = () => {
  const { state, actions } = useApp();
  const { getFavorites } = useUser();

  const [favoriteCoursesFromApi, setFavoriteCoursesFromApi] = useState(null);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [favoritesError, setFavoritesError] = useState(null);

  // Mock data - em uma aplicação real, isso viria de uma API
  const allCourses = [
    {
      id: 1,
      title: 'Desenvolvimento Web Completo com React e Node.js',
      instructor: 'Enzo Fernandes',
      category: 'Empreendedorismo',
      rating: 4.3,
      students: 2000,
      price: 1,
      image: null,
    },
    {
      id: 2,
      title: 'Italiano Básico',
      instructor: 'Maria Silva',
      category: 'Idiomas',
      rating: 4.7,
      students: 1500,
      price: 2,
      image: null,
    },
    {
      id: 3,
      title: 'LIBRAS Intermediário',
      instructor: 'João Santos',
      category: 'Idiomas',
      rating: 4.5,
      students: 800,
      price: 1,
      image: null,
    },
    {
      id: 4,
      title: 'Matemática para Concursos',
      instructor: 'Ana Costa',
      category: 'Educação',
      rating: 4.2,
      students: 1200,
      price: 3,
      image: null,
    },
    {
      id: 5,
      title: 'Marketing Digital',
      instructor: 'Pedro Oliveira',
      category: 'Empreendedorismo',
      rating: 4.6,
      students: 900,
      price: 2,
      image: null,
    },
  ];

  // Preferir usar os cursos retornados pela API de favoritos quando autenticado
  useEffect(() => {
    let isMounted = true;
    const loadFavorites = async () => {
      setFavoritesError(null);
      if (!state.isAuthenticated) {
        // Não autenticado: não tentar carregar do backend
        setFavoriteCoursesFromApi(null);
        return;
      }
      setLoadingFavorites(true);
      try {
        const result = await getFavorites();
        // result.favorites segue o formato retornado por userService.getFavorites
        if (isMounted && result && result.favorites) {
          setFavoriteCoursesFromApi(result.favorites);
        }
      } catch (err) {
        console.error('Erro ao carregar favoritos:', err);
        if (isMounted) setFavoritesError(err.message || 'Erro ao carregar favoritos');
      } finally {
        if (isMounted) setLoadingFavorites(false);
      }
    };

    loadFavorites();

    return () => { isMounted = false; };
  }, [state.isAuthenticated, getFavorites]);

  // Filtrar apenas os cursos favoritos
  // Se a API retornou favoritos, use-os; caso contrário, use o mock/allCourses com base em state.user.favorites
  const favoriteCourses = favoriteCoursesFromApi && favoriteCoursesFromApi.length > 0
    ? favoriteCoursesFromApi
    : allCourses.filter(course => (
        typeof course.isFavorite === 'boolean' ? course.isFavorite : state.user?.favorites?.includes(course.id)
      ));

  const handleCourseClick = (course) => {
    // Garantir que o curso tem ID
    const courseId = course.id || course._id;
    if (!courseId) {
      console.error('❌ Erro: Curso sem ID no Favorites', course);
      return;
    }
    
    const courseWithId = {
      ...course,
      id: courseId,
      _id: courseId,
    };
    actions.setSelectedCourse(courseWithId);
    actions.setCurrentPage('course-details');
  };

  const handleRemoveFavorite = (courseId, e) => {
    e.stopPropagation(); // Evita navegação para detalhes
    // Otimista: atualizar UI localmente
    if (favoriteCoursesFromApi) {
      setFavoriteCoursesFromApi(prev => prev.filter(c => (c.id || c._id || c._id) !== courseId && (c.id || c._id) !== courseId));
    }
    actions.toggleFavorite(courseId).then((res) => {
      if (!res.success) {
        actions.showToast?.('Não foi possível remover dos favoritos. Tente novamente.', 'error');
        // Recarregar favoritos para garantir consistência
        getFavorites().then(r => r?.favorites && setFavoriteCoursesFromApi(r.favorites)).catch(() => {});
      }
    }).catch(() => {
      actions.showToast?.('Erro de rede ao remover favorito.', 'error');
      getFavorites().then(r => r?.favorites && setFavoriteCoursesFromApi(r.favorites)).catch(() => {});
    });
  };

  const handleExploreCourses = () => {
    actions.setCurrentPage('dashboard');
  };

  return (
    <DashboardTemplate>
      <div className="favorites">
        {/* Header */}
        <div className="favorites__header">
          <div className="favorites__header-content">
            <div className="favorites__header-info">
              <h1 className="favorites__title">
                <Heart size={32} weight="fill" />
                Meus Cursos Favoritos
              </h1>
              <p className="favorites__subtitle">
                Seus cursos salvos para assistir mais tarde. 
                {favoriteCourses.length > 0 && (
                  <span className="favorites__count">
                    {favoriteCourses.length} curso{favoriteCourses.length !== 1 ? 's' : ''} favorito{favoriteCourses.length !== 1 ? 's' : ''}
                  </span>
                )}
              </p>
            </div>
            <div className="favorites__header-actions">
              <Button variant="outline" onClick={handleExploreCourses}>
                <BookOpen size={20} />
                Explorar Cursos
              </Button>
            </div>
          </div>
        </div>

        {/* Favorites Content */}
        {favoriteCourses.length > 0 ? (
          <div className="favorites__content">
            {/* Quick Stats removed as requested */}

            {/* Course Grid */}
            <CourseGrid
              title="Seus Cursos Favoritos"
              courses={favoriteCourses}
              onCourseClick={handleCourseClick}
              showAll={true}
            />
          </div>
        ) : (
          /* Empty State */
          <div className="favorites__empty">
            <Card className="favorites__empty-card" padding="large">
              <div className="favorites__empty-content">
                <div className="favorites__empty-icon">
                  <Heart size={64} />
                </div>
                <h2 className="favorites__empty-title">
                  Nenhum curso favorito ainda
                </h2>
                <p className="favorites__empty-text">
                  Explore nossa biblioteca de cursos e adicione seus favoritos clicando no ❤️ 
                  nos cards dos cursos. Seus cursos salvos aparecerão aqui para fácil acesso.
                </p>
                <div className="favorites__empty-actions">
                  <Button variant="primary" size="large" onClick={handleExploreCourses}>
                    <BookOpen size={20} />
                    Explorar Cursos
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </DashboardTemplate>
  );
};

export default Favorites;
