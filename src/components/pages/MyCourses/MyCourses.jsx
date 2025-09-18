import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Star, 
  Clock, 
  Users,
  Play,
  BookOpen,
  GraduationCap,
  Trophy,
  Calendar,
  VideoCamera
} from '@phosphor-icons/react';
import { useApp } from '../../../contexts/AppContext';
import DashboardTemplate from '../../templates/DashboardTemplate';
import Card from '../../molecules/Card';
import Button from '../../atoms/Button';
import './MyCourses.css';

const MyCourses = ({ initialTab = 'completed' }) => {
  const { state, actions } = useApp();
  const [activeTab, setActiveTab] = useState(initialTab); // 'completed' ou 'teaching'

  // Mock data expandido
  const coursesData = {
    completed: [
      {
        id: 1,
        title: 'Italiano Básico',
        category: 'Idiomas',
        instructor: 'Maria Silva',
        completedAt: '15/01/2024',
        rating: 5,
        totalHours: 20,
        progress: 100,
        certificate: true,
        flag: '🇮🇹',
        nextLevel: 'Italiano Intermediário'
      },
      {
        id: 2,
        title: 'LIBRAS Intermediário',
        category: 'Idiomas',
        instructor: 'João Santos',
        completedAt: '20/02/2024',
        rating: 4,
        totalHours: 15,
        progress: 100,
        certificate: true,
        flag: '🤟',
        nextLevel: 'LIBRAS Avançado'
      },
      {
        id: 3,
        title: 'Matemática Básica',
        category: 'Educação',
        instructor: 'Prof. Carlos',
        completedAt: '10/03/2024',
        rating: 5,
        totalHours: 25,
        progress: 100,
        certificate: true,
        flag: '📊',
        nextLevel: null
      }
    ],
    teaching: [
      {
        id: 4,
        title: 'RPG para Iniciantes',
        category: 'Hobbies',
        students: 25,
        rating: 4.8,
        totalHours: 30,
        earnings: 30, // moedas ganhas
        status: 'active',
        flag: '🎲',
        nextClass: '25/01/2024 19:00',
        zoomLink: 'https://zoom.us/j/123456789'
      },
      {
        id: 5,
        title: 'Jardinagem Urbana',
        category: 'Hobbies',
        students: 18,
        rating: 4.6,
        totalHours: 20,
        earnings: 20,
        status: 'active',
        flag: '🌱',
        nextClass: '26/01/2024 15:00',
        zoomLink: 'https://zoom.us/j/987654321'
      },
      {
        id: 6,
        title: 'Culinária Italiana',
        category: 'Culinária',
        students: 12,
        rating: 4.9,
        totalHours: 15,
        earnings: 15,
        status: 'completed',
        flag: '🍝',
        nextClass: null,
        zoomLink: null
      }
    ]
  };

  const currentCourses = coursesData[activeTab];

  const handleGoBack = () => {
    actions.setCurrentPage('profile');
  };

  const handleCourseClick = (course) => {
    actions.setSelectedCourse(course);
    actions.setCurrentPage('course-details');
  };

  const handleStartClass = (course) => {
    if (course.zoomLink) {
      window.open(course.zoomLink, '_blank');
      console.log(`Iniciando aula: ${course.title}`);
    }
  };

  const handleScheduleClass = (course) => {
    console.log(`Agendando aula: ${course.title}`);
    actions.setCurrentPage('calendar');
  };

  const renderCompletedCourses = () => (
    <div className="my-courses__grid">
      {currentCourses.map((course) => (
        <Card key={course.id} className="my-courses__course-card" padding="large" hover>
          <div className="my-courses__course-header">
            <div className="my-courses__course-flag">{course.flag}</div>
            <div className="my-courses__course-badge">
              <GraduationCap size={16} />
              <span>Concluído</span>
            </div>
          </div>

          <div className="my-courses__course-content">
            <h3 className="my-courses__course-title">{course.title}</h3>
            <p className="my-courses__course-category">{course.category}</p>
            <p className="my-courses__course-instructor">
              <User size={16} />
              {course.instructor}
            </p>

            <div className="my-courses__course-stats">
              <div className="my-courses__stat">
                <Star size={16} weight="fill" />
                <span>Sua avaliação: {course.rating}/5</span>
              </div>
              <div className="my-courses__stat">
                <Clock size={16} />
                <span>{course.totalHours}h concluídas</span>
              </div>
              <div className="my-courses__stat">
                <Calendar size={16} />
                <span>Concluído em {course.completedAt}</span>
              </div>
            </div>

            {course.certificate && (
              <div className="my-courses__certificate">
                <Trophy size={16} />
                <span>Certificado disponível</span>
              </div>
            )}

            <div className="my-courses__course-actions">
              <Button 
                variant="primary" 
                size="small"
                onClick={() => handleCourseClick(course)}
              >
                Ver Curso
              </Button>
              {course.certificate && (
                <Button variant="outline" size="small">
                  Baixar Certificado
                </Button>
              )}
              {course.nextLevel && (
                <Button variant="ghost" size="small">
                  Próximo Nível
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderTeachingCourses = () => (
    <div className="my-courses__grid">
      {currentCourses.map((course) => (
        <Card key={course.id} className="my-courses__course-card" padding="large" hover>
          <div className="my-courses__course-header">
            <div className="my-courses__course-flag">{course.flag}</div>
            <div className={`my-courses__course-badge my-courses__course-badge--${course.status}`}>
              <BookOpen size={16} />
              <span>{course.status === 'active' ? 'Ativo' : 'Concluído'}</span>
            </div>
          </div>

          <div className="my-courses__course-content">
            <h3 className="my-courses__course-title">{course.title}</h3>
            <p className="my-courses__course-category">{course.category}</p>

            <div className="my-courses__course-stats">
              <div className="my-courses__stat">
                <Users size={16} />
                <span>{course.students} alunos</span>
              </div>
              <div className="my-courses__stat">
                <Star size={16} weight="fill" />
                <span>Avaliação: {course.rating}/5</span>
              </div>
              <div className="my-courses__stat">
                <Clock size={16} />
                <span>{course.totalHours}h ministradas</span>
              </div>
            </div>

            <div className="my-courses__earnings">
              <div className="my-courses__earnings-icon">💰</div>
              <span>Ganhou {course.earnings} moedas</span>
            </div>

            {course.nextClass && (
              <div className="my-courses__next-class">
                <VideoCamera size={16} />
                <span>Próxima aula: {course.nextClass}</span>
              </div>
            )}

            <div className="my-courses__course-actions">
              <Button 
                variant="primary" 
                size="small"
                onClick={() => handleCourseClick(course)}
              >
                Ver Curso
              </Button>
              {course.status === 'active' && course.nextClass && (
                <Button 
                  variant="outline" 
                  size="small"
                  onClick={() => handleStartClass(course)}
                >
                  <VideoCamera size={16} />
                  Iniciar Aula
                </Button>
              )}
              {course.status === 'active' && (
                <Button 
                  variant="ghost" 
                  size="small"
                  onClick={() => handleScheduleClass(course)}
                >
                  Agendar
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <DashboardTemplate>
      <div className="my-courses">
        {/* Header */}
        <div className="my-courses__header">
          <Button variant="ghost" onClick={handleGoBack} className="my-courses__back">
            <ArrowLeft size={20} />
            Voltar ao Perfil
          </Button>
          
          <div className="my-courses__header-content">
            <h1 className="my-courses__title">
              {activeTab === 'completed' ? 'Aulas Feitas' : 'Minhas Aulas'}
            </h1>
            <p className="my-courses__subtitle">
              {activeTab === 'completed' 
                ? 'Cursos que você completou com sucesso'
                : 'Cursos que você está ministrando'
              }
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="my-courses__tabs">
          <button
            className={`my-courses__tab ${activeTab === 'completed' ? 'my-courses__tab--active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            <GraduationCap size={20} />
            <span>Aulas Feitas ({coursesData.completed.length})</span>
          </button>
          <button
            className={`my-courses__tab ${activeTab === 'teaching' ? 'my-courses__tab--active' : ''}`}
            onClick={() => setActiveTab('teaching')}
          >
            <BookOpen size={20} />
            <span>Minhas Aulas ({coursesData.teaching.length})</span>
          </button>
        </div>

        {/* Content */}
        <div className="my-courses__content">
          {activeTab === 'completed' ? renderCompletedCourses() : renderTeachingCourses()}
        </div>

        {/* Stats Summary */}
        <Card className="my-courses__summary" padding="large">
          <h2 className="my-courses__summary-title">Resumo</h2>
          <div className="my-courses__summary-stats">
            {activeTab === 'completed' ? (
              <>
                <div className="my-courses__summary-stat">
                  <div className="my-courses__summary-stat-value">
                    {coursesData.completed.length}
                  </div>
                  <div className="my-courses__summary-stat-label">Cursos Concluídos</div>
                </div>
                <div className="my-courses__summary-stat">
                  <div className="my-courses__summary-stat-value">
                    {coursesData.completed.reduce((acc, course) => acc + course.totalHours, 0)}h
                  </div>
                  <div className="my-courses__summary-stat-label">Horas Estudadas</div>
                </div>
                <div className="my-courses__summary-stat">
                  <div className="my-courses__summary-stat-value">
                    {coursesData.completed.filter(course => course.certificate).length}
                  </div>
                  <div className="my-courses__summary-stat-label">Certificados</div>
                </div>
              </>
            ) : (
              <>
                <div className="my-courses__summary-stat">
                  <div className="my-courses__summary-stat-value">
                    {coursesData.teaching.length}
                  </div>
                  <div className="my-courses__summary-stat-label">Cursos Ministrados</div>
                </div>
                <div className="my-courses__summary-stat">
                  <div className="my-courses__summary-stat-value">
                    {coursesData.teaching.reduce((acc, course) => acc + course.students, 0)}
                  </div>
                  <div className="my-courses__summary-stat-label">Total de Alunos</div>
                </div>
                <div className="my-courses__summary-stat">
                  <div className="my-courses__summary-stat-value">
                    {coursesData.teaching.reduce((acc, course) => acc + course.earnings, 0)}
                  </div>
                  <div className="my-courses__summary-stat-label">Moedas Ganhas</div>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    </DashboardTemplate>
  );
};

export default MyCourses;
