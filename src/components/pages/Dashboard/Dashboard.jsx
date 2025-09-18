import React from 'react';
import { useApp } from '../../../contexts/AppContext';
import DashboardTemplate from '../../templates/DashboardTemplate';
import CourseGrid from '../../organisms/CourseGrid';
import Card from '../../molecules/Card';
import Button from '../../atoms/Button';
import './Dashboard.css';

const Dashboard = () => {
  const { state, actions } = useApp();
  // Mock data - em uma aplicação real, isso viria de uma API
  const mockCourses = [
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
    {
      id: 6,
      title: 'Python para Iniciantes',
      instructor: 'Carlos Mendes',
      category: 'Tecnologia',
      rating: 4.4,
      students: 1800,
      price: 1,
      image: null,
    },
  ];

  const handleCourseClick = (course) => {
    actions.setSelectedCourse(course);
    actions.setCurrentPage('course-details');
  };

  const handleShowAllCourses = () => {
    console.log('Show all courses');
    // Aqui você navegaria para a página de todos os cursos
  };

  return (
    <DashboardTemplate>
      <div className="dashboard">
        {/* Welcome Banner */}
        <div className="dashboard__welcome">
          <div className="dashboard__welcome-content">
            <h1 className="dashboard__welcome-title">
              Aprenda Ensinando - Ensine Aprendendo
            </h1>
            <p className="dashboard__welcome-text">
              Descubra novos conhecimentos e compartilhe sua expertise. 
              <strong>🪙 1 crédito = 1 hora de curso</strong> - Ensine para ganhar!
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="dashboard__stats">
          <Card className="dashboard__stat-card">
            <div className="dashboard__stat-content">
              <div className="dashboard__stat-icon">📚</div>
              <div className="dashboard__stat-info">
                <div className="dashboard__stat-value">150+</div>
                <div className="dashboard__stat-label">Cursos Disponíveis</div>
              </div>
            </div>
          </Card>
          
          <Card className="dashboard__stat-card">
            <div className="dashboard__stat-content">
              <div className="dashboard__stat-icon">👥</div>
              <div className="dashboard__stat-info">
                <div className="dashboard__stat-value">5.2k</div>
                <div className="dashboard__stat-label">Estudantes Ativos</div>
              </div>
            </div>
          </Card>
          
          <Card className="dashboard__stat-card">
            <div className="dashboard__stat-content">
              <div className="dashboard__stat-icon">🏆</div>
              <div className="dashboard__stat-info">
                <div className="dashboard__stat-value">98%</div>
                <div className="dashboard__stat-label">Satisfação</div>
              </div>
            </div>
          </Card>
          
          <Card className="dashboard__stat-card">
            <div className="dashboard__stat-content">
              <div className="dashboard__stat-icon">🪙</div>
              <div className="dashboard__stat-info">
                <div className="dashboard__stat-value">{state.user.credits}</div>
                <div className="dashboard__stat-label">Seus Créditos</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Course Grids */}
        <CourseGrid
          title="Cursos mais acessados"
          courses={mockCourses}
          onCourseClick={handleCourseClick}
          onShowAllClick={handleShowAllCourses}
        />

        <CourseGrid
          title="Recomendados para você"
          courses={mockCourses.slice(0, 3)}
          onCourseClick={handleCourseClick}
          onShowAllClick={handleShowAllCourses}
        />


        {/* Call to Action */}
        <Card className="dashboard__cta" padding="large">
          <div className="dashboard__cta-content">
            <h2 className="dashboard__cta-title">
              Pronto para compartilhar seu conhecimento?
            </h2>
            <p className="dashboard__cta-text">
              Crie seu primeiro curso e comece a ensinar milhares de pessoas ao redor do mundo.
              <br />A cada hora de aula, você ganha 1 moeda para usar em outros cursos!
            </p>
            <div className="dashboard__cta-actions">
              <Button variant="primary" size="large">
                Criar Novo Curso
              </Button>
              <Button variant="outline" size="large">
                Saiba Mais
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardTemplate>
  );
};

export default Dashboard;
