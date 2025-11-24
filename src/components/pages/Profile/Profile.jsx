import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Users, 
  Clock, 
  BookOpen,
  Coins,
  Calendar,
  Trophy,
  GraduationCap,
  PencilSimple
} from '@phosphor-icons/react';
import { useApp } from '../../../contexts';
import { useUser } from '../../../hooks/useUser';
import DashboardTemplate from '../../templates/DashboardTemplate';
import Card from '../../molecules/Card';
import Button from '../../atoms/Button';
import './Profile.css';

const Profile = () => {
  const { state, actions } = useApp();
  const { getEnrolledCourses, getTeachingCourses, getStats, loading } = useUser();
  
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [teachingCourses, setTeachingCourses] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);

  // Carregar dados do usuário ao montar componente
  useEffect(() => {
    const loadUserData = async () => {
      setIsLoadingCourses(true);
      
      try {
        // Carregar estatísticas
        const statsResult = await getStats();
        if (statsResult.stats) {
          setUserStats(statsResult.stats);
        }

        // Carregar cursos matriculados
        const enrolledResult = await getEnrolledCourses({ limit: 5 });
        if (enrolledResult.courses) {
          setEnrolledCourses(enrolledResult.courses);
        }

        // Carregar cursos ensinando
        const teachingResult = await getTeachingCourses({ limit: 5 });
        if (teachingResult.courses) {
          setTeachingCourses(teachingResult.courses);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do perfil:', error);
      } finally {
        setIsLoadingCourses(false);
      }
    };

    if (state.user) {
      loadUserData();
    }
  }, [state.user]);

  // Dados do usuário vindos do contexto (já carregados na autenticação)
  const userProfile = state.user || {};
  
  // Avatar: usar do usuário ou gerar com iniciais
  const avatarUrl = userProfile.avatar || 
    `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile.name || 'User')}&background=52357B&color=fff&size=200`;
  
  // Formatar data de entrada
  const joinDate = userProfile.joinDate 
    ? new Date(userProfile.joinDate).toLocaleDateString('pt-BR')
    : 'N/A';
  
  // Stats com fallback
  const stats = userStats || userProfile.stats || {
    coursesCompleted: 0,
    coursesTeaching: 0,
    totalHours: 0,
    totalEarnings: 0
  };

  const handleEditProfile = () => {
    actions.setCurrentPage('edit-profile');
  };

  const handleViewSchedule = () => {
    actions.setCurrentPage('calendar');
  };

  const handleViewMoreCompleted = () => {
    actions.setCurrentPage('my-courses-completed');
  };

  const handleViewMoreTeaching = () => {
    actions.setCurrentPage('my-courses-teaching');
  };

  const handleViewCourse = (course) => {
    // Garantir que o curso tem ID
    const courseId = course.id || course._id;
    if (!courseId) {
      console.error('❌ Erro: Curso sem ID no Profile', course);
      return;
    }
    
    // Simular dados do curso para navegação
    const courseData = {
      id: courseId,
      _id: courseId,
      title: course.title,
      instructor: course.instructor || 'Você',
      category: course.category,
      rating: course.rating || 4.5,
      students: course.students || 0,
      price: 1
    };
    actions.setSelectedCourse(courseData);
    actions.setCurrentPage('course-details');
  };

  return (
    <DashboardTemplate>
      <div className="profile">
        {/* Profile Header */}
        <Card className="profile__header" padding="large">
          <div className="profile__header-content">
            <div className="profile__avatar-section">
              <div className="profile__avatar">
                <img 
                  src={avatarUrl} 
                  alt={userProfile.name || 'Usuário'}
                />
              </div>
              <div className="profile__basic-info">
                <h1 className="profile__name">{userProfile.name || 'Nome do Usuário'}</h1>
                <p className="profile__bio">{userProfile.bio || 'Sem biografia cadastrada'}</p>
                <div className="profile__join-date">
                  <Calendar size={16} />
                  <span>Membro desde: {joinDate}</span>
                </div>
              </div>
            </div>
            <div className="profile__actions">
              <Button variant="primary" onClick={handleEditProfile}>
                <PencilSimple size={18} />
                Editar Perfil
              </Button>
              <Button variant="outline" onClick={handleViewSchedule}>
                <Calendar size={18} />
                Minha Agenda
              </Button>
            </div>
          </div>
        </Card>

        {/* Stats Cards */}
        <div className="profile__stats">
          <Card className="profile__stat-card" padding="medium">
            <div className="profile__stat-content">
              <div className="profile__stat-icon profile__stat-icon--coins">
                <Coins size={24} weight="fill" />
              </div>
              <div className="profile__stat-info">
                <div className="profile__stat-value">{userProfile.credits || 0}</div>
                <div className="profile__stat-label">Créditos</div>
              </div>
            </div>
          </Card>

          <Card className="profile__stat-card" padding="medium">
            <div className="profile__stat-content">
              <div className="profile__stat-icon profile__stat-icon--completed">
                <GraduationCap size={24} />
              </div>
              <div className="profile__stat-info">
                <div className="profile__stat-value">{stats.coursesCompleted || 0}</div>
                <div className="profile__stat-label">Cursos Concluídos</div>
              </div>
            </div>
          </Card>

          <Card className="profile__stat-card" padding="medium">
            <div className="profile__stat-content">
              <div className="profile__stat-icon profile__stat-icon--teaching">
                <BookOpen size={24} />
              </div>
              <div className="profile__stat-info">
                <div className="profile__stat-value">{stats.coursesTeaching || 0}</div>
                <div className="profile__stat-label">Cursos Ensinando</div>
              </div>
            </div>
          </Card>

          <Card className="profile__stat-card" padding="medium">
            <div className="profile__stat-content">
              <div className="profile__stat-icon profile__stat-icon--hours">
                <Clock size={24} />
              </div>
              <div className="profile__stat-info">
                <div className="profile__stat-value">{stats.totalHours || 0}h</div>
                <div className="profile__stat-label">Total de Horas</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Skills Section */}
        {userProfile.skills && userProfile.skills.length > 0 && (
          <Card className="profile__skills" padding="large">
            <h2 className="profile__section-title">
              <Trophy size={24} />
              Habilidades
            </h2>
            <div className="profile__skills-list">
              {userProfile.skills.map((skill, index) => (
                <span key={index} className="profile__skill-tag">
                  {skill}
                </span>
              ))}
            </div>
          </Card>
        )}

        {/* Courses Section */}
        <div className="profile__courses">
          {/* Enrolled Courses */}
          <Card className="profile__course-section" padding="large">
            <h2 className="profile__section-title">
              <Star size={24} />
              Cursos Matriculados
            </h2>
            
            {isLoadingCourses ? (
              <div className="profile__loading">
                <p>Carregando cursos...</p>
              </div>
            ) : enrolledCourses.length > 0 ? (
              <>
                <div className="profile__course-list">
                  {enrolledCourses.map((course) => (
                    <div key={course._id || course.id} className="profile__course-item">
                      <div className="profile__course-flag">
                        <span className="profile__course-flag-icon">📚</span>
                      </div>
                      <div className="profile__course-info">
                        <h3 className="profile__course-title">{course.title}</h3>
                        <p className="profile__course-category">{course.category || 'Sem categoria'}</p>
                        <button 
                          className="profile__course-meta"
                          onClick={() => handleViewCourse(course)}
                        >
                          Ver curso
                        </button>
                      </div>
                      <div className="profile__course-rating">
                        {course.rating && (
                          <div className="profile__course-rating-display">
                            <Star size={16} weight="fill" />
                            <span>{course.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="profile__section-footer">
                  <Button variant="ghost" onClick={handleViewMoreCompleted}>
                    Ver Todos os Cursos
                  </Button>
                </div>
              </>
            ) : (
              <div className="profile__empty-state">
                <GraduationCap size={48} weight="duotone" />
                <p>Você ainda não está matriculado em nenhum curso</p>
                <Button variant="primary" onClick={() => actions.setCurrentPage('dashboard')}>
                  Explorar Cursos
                </Button>
              </div>
            )}
          </Card>

          {/* Teaching Courses */}
          {userProfile.isInstructor && (
            <Card className="profile__course-section" padding="large">
              <h2 className="profile__section-title">
                <BookOpen size={24} />
                Meus Cursos
              </h2>
              
              {isLoadingCourses ? (
                <div className="profile__loading">
                  <p>Carregando cursos...</p>
                </div>
              ) : teachingCourses.length > 0 ? (
                <>
                  <div className="profile__course-list">
                    {teachingCourses.map((course) => (
                      <div key={course._id || course.id} className="profile__course-item">
                        <div className="profile__course-flag">
                          <span className="profile__course-flag-icon">👨‍🏫</span>
                        </div>
                        <div className="profile__course-info">
                          <h3 className="profile__course-title">{course.title}</h3>
                          <p className="profile__course-category">{course.category || 'Sem categoria'}</p>
                          <div className="profile__course-stats">
                            <span><Users size={14} /> {course.currentStudents || 0} alunos</span>
                            {course.rating && (
                              <span><Star size={14} weight="fill" /> {course.rating.toFixed(1)}</span>
                            )}
                          </div>
                        </div>
                        <div className="profile__course-actions">
                          <Button 
                            variant="ghost" 
                            size="small"
                            onClick={() => handleViewCourse(course)}
                          >
                            <PencilSimple size={18} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="profile__section-footer">
                    <Button variant="ghost" onClick={handleViewMoreTeaching}>
                      Ver Todos os Meus Cursos
                    </Button>
                  </div>
                </>
              ) : (
                <div className="profile__empty-state">
                  <BookOpen size={48} weight="duotone" />
                  <p>Você ainda não criou nenhum curso</p>
                  <Button variant="primary" onClick={() => actions.openModal('addCourse')}>
                    Criar Primeiro Curso
                  </Button>
                </div>
              )}
            </Card>
          )}
        </div>

        {/* Scheduled Classes */}
        {state.scheduledClasses && state.scheduledClasses.length > 0 && (
          <Card className="profile__course-section" padding="large">
            <h2 className="profile__section-title">
              <Calendar size={24} />
              Aulas Agendadas
            </h2>
            <div className="profile__course-list">
              {state.scheduledClasses.slice(0, 3).map((scheduledClass) => (
                <div key={scheduledClass._id || scheduledClass.id} className="profile__course-item">
                  <div className="profile__course-flag">
                    <span className="profile__course-flag-icon">📅</span>
                  </div>
                  <div className="profile__course-info">
                    <h3 className="profile__course-title">
                      {scheduledClass.course?.title || scheduledClass.courseTitle || 'Aula'}
                    </h3>
                    <p className="profile__course-category">
                      {scheduledClass.date ? new Date(scheduledClass.date).toLocaleDateString('pt-BR') : 'Data não definida'} 
                      {' - '}
                      {scheduledClass.time || 'Horário não definido'}
                    </p>
                    <div className="profile__course-meta">
                      <span>Status: {scheduledClass.status || 'agendado'}</span>
                    </div>
                  </div>
                  <div className="profile__course-actions">
                    <Button variant="ghost" size="small">
                      <Calendar size={18} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="profile__section-footer">
              <Button variant="ghost" onClick={handleViewSchedule}>
                Ver Todas as Aulas Agendadas
              </Button>
            </div>
          </Card>
        )}
      </div>
    </DashboardTemplate>
  );
};

export default Profile;
