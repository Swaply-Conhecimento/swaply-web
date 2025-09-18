import React from 'react';
import { 
  Star, 
  Users, 
  Clock, 
  BookOpen,
  Coins,
  Calendar,
  Trophy,
  GraduationCap
} from '@phosphor-icons/react';
import { useApp } from '../../../contexts/AppContext';
import DashboardTemplate from '../../templates/DashboardTemplate';
import Card from '../../molecules/Card';
import Button from '../../atoms/Button';
import './Profile.css';

const Profile = () => {
  const { state } = useApp();
  
  // Merge context data with additional profile data
  const userProfile = {
    ...state.user,
    avatar: '/avatar-placeholder.jpg',
    coursesCompleted: [
      {
        id: 1,
        title: 'Italiano Básico',
        category: 'Idiomas',
        completedAt: '2024-01-15',
        rating: 5,
        instructor: 'Maria Silva'
      },
      {
        id: 2,
        title: 'LIBRAS Intermediário',
        category: 'Idiomas',
        completedAt: '2024-02-20',
        rating: 4,
        instructor: 'João Santos'
      }
    ],
    coursesTeaching: [
      {
        id: 3,
        title: 'RPG para Iniciantes',
        category: 'Hobbies',
        students: 25,
        rating: 4.8,
        totalHours: 10
      },
      {
        id: 4,
        title: 'Jardinagem Urbana',
        category: 'Hobbies',
        students: 18,
        rating: 4.6,
        totalHours: 8
      }
    ]
  };

  const handleEditProfile = () => {
    console.log('Edit profile');
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
    // Simular dados do curso para navegação
    const courseData = {
      id: course.id,
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
                  src={userProfile.avatar} 
                  alt={userProfile.name}
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile.name)}&background=52357B&color=fff&size=120`;
                  }}
                />
              </div>
              <div className="profile__basic-info">
                <h1 className="profile__name">{userProfile.name}</h1>
                <p className="profile__bio">{userProfile.bio}</p>
                <div className="profile__join-date">
                  <Calendar size={16} />
                  <span>Aluno/Instrutor desde: {userProfile.joinDate}</span>
                </div>
              </div>
            </div>
            <div className="profile__actions">
              <Button variant="primary" onClick={handleEditProfile}>
                Editar Perfil
              </Button>
              <Button variant="outline" onClick={handleViewSchedule}>
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
                <div className="profile__stat-value">{userProfile.credits}</div>
                <div className="profile__stat-label">Moedas</div>
              </div>
            </div>
          </Card>

          <Card className="profile__stat-card" padding="medium">
            <div className="profile__stat-content">
              <div className="profile__stat-icon profile__stat-icon--completed">
                <GraduationCap size={24} />
              </div>
              <div className="profile__stat-info">
                <div className="profile__stat-value">{userProfile.stats.coursesCompleted}</div>
                <div className="profile__stat-label">Aulas Assistidas</div>
              </div>
            </div>
          </Card>

          <Card className="profile__stat-card" padding="medium">
            <div className="profile__stat-content">
              <div className="profile__stat-icon profile__stat-icon--teaching">
                <BookOpen size={24} />
              </div>
              <div className="profile__stat-info">
                <div className="profile__stat-value">{userProfile.stats.coursesTeaching}</div>
                <div className="profile__stat-label">Aulas Instruídas</div>
              </div>
            </div>
          </Card>

          <Card className="profile__stat-card" padding="medium">
            <div className="profile__stat-content">
              <div className="profile__stat-icon profile__stat-icon--hours">
                <Clock size={24} />
              </div>
              <div className="profile__stat-info">
                <div className="profile__stat-value">{userProfile.stats.totalHours}h</div>
                <div className="profile__stat-label">Total de Horas</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Skills Section */}
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

        {/* Courses Section */}
        <div className="profile__courses">
          {/* Completed Courses */}
          <Card className="profile__course-section" padding="large">
            <h2 className="profile__section-title">
              <Star size={24} />
              Aulas Feitas
            </h2>
            <div className="profile__course-list">
              {userProfile.coursesCompleted.map((course) => (
                <div key={course.id} className="profile__course-item">
                  <div className="profile__course-flag">
                    <span className="profile__course-flag-icon">🇮🇹</span>
                  </div>
                  <div className="profile__course-info">
                    <h3 className="profile__course-title">{course.title}</h3>
                    <p className="profile__course-category">{course.category}</p>
                    <button 
                      className="profile__course-meta"
                      onClick={() => handleViewCourse(course)}
                    >
                      Ver curso
                    </button>
                  </div>
                  <div className="profile__course-actions">
                    <Button variant="ghost" size="small">
                      🗑️
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="profile__section-footer">
              <Button variant="ghost" onClick={handleViewMoreCompleted}>Ver Mais</Button>
            </div>
          </Card>

          {/* Teaching Courses */}
          <Card className="profile__course-section" padding="large">
            <h2 className="profile__section-title">
              <BookOpen size={24} />
              Minhas Aulas
            </h2>
            <div className="profile__course-list">
              {userProfile.coursesTeaching.map((course) => (
                <div key={course.id} className="profile__course-item">
                  <div className="profile__course-flag">
                    <span className="profile__course-flag-icon">🎲</span>
                  </div>
                  <div className="profile__course-info">
                    <h3 className="profile__course-title">{course.title}</h3>
                    <p className="profile__course-category">{course.category}</p>
                    <button 
                      className="profile__course-meta"
                      onClick={() => handleViewCourse(course)}
                    >
                      Ver curso
                    </button>
                  </div>
                  <div className="profile__course-actions">
                    <Button variant="ghost" size="small">
                      ✏️
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="profile__section-footer">
              <Button variant="ghost" onClick={handleViewMoreTeaching}>Ver Mais</Button>
            </div>
          </Card>
        </div>

        {/* Scheduled Courses */}
        <Card className="profile__course-section" padding="large">
          <h2 className="profile__section-title">
            <Calendar size={24} />
            Aulas Agendadas
          </h2>
          <div className="profile__course-list">
            <div className="profile__course-item">
              <div className="profile__course-flag">
                <span className="profile__course-flag-icon">🇮🇹</span>
              </div>
              <div className="profile__course-info">
                <h3 className="profile__course-title">Italiano Básico</h3>
                <p className="profile__course-category">Idiomas</p>
                <div className="profile__course-meta">
                  <span>Ver curso</span>
                </div>
              </div>
              <div className="profile__course-actions">
                <Button variant="ghost" size="small">
                  ❌
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardTemplate>
  );
};

export default Profile;
