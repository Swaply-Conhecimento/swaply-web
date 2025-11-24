import React from 'react';
import { Heart, BookOpen, Star } from '@phosphor-icons/react';
import { useApp } from '../../../contexts';
import DashboardTemplate from '../../templates/DashboardTemplate';
import CourseGrid from '../../organisms/CourseGrid';
import Card from '../../molecules/Card';
import Button from '../../atoms/Button';
import './Favorites.css';

const Favorites = () => {
  const { state, actions } = useApp();

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

  // Filtrar apenas os cursos favoritos
  const favoriteCourses = allCourses.filter(course => 
    state.user?.favorites?.includes(course.id)
  );

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
    actions.toggleFavorite(courseId);
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
            {/* Quick Stats */}
            <div className="favorites__stats">
              <Card className="favorites__stat-card" padding="medium">
                <div className="favorites__stat-content">
                  <div className="favorites__stat-icon">
                    <Heart size={24} weight="fill" />
                  </div>
                  <div className="favorites__stat-info">
                    <div className="favorites__stat-value">{favoriteCourses.length}</div>
                    <div className="favorites__stat-label">Favoritos</div>
                  </div>
                </div>
              </Card>

              <Card className="favorites__stat-card" padding="medium">
                <div className="favorites__stat-content">
                  <div className="favorites__stat-icon">
                    <Star size={24} weight="fill" />
                  </div>
                  <div className="favorites__stat-info">
                    <div className="favorites__stat-value">
                      {(favoriteCourses.reduce((acc, course) => acc + course.rating, 0) / favoriteCourses.length).toFixed(1)}
                    </div>
                    <div className="favorites__stat-label">Avaliação Média</div>
                  </div>
                </div>
              </Card>

              <Card className="favorites__stat-card" padding="medium">
                <div className="favorites__stat-content">
                  <div className="favorites__stat-icon">
                    <BookOpen size={24} />
                  </div>
                  <div className="favorites__stat-info">
                    <div className="favorites__stat-value">
                      {favoriteCourses.reduce((acc, course) => acc + course.price, 0)}
                    </div>
                    <div className="favorites__stat-label">Total em Créditos</div>
                  </div>
                </div>
              </Card>
            </div>

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
