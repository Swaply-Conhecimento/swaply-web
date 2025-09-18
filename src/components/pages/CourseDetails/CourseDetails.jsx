import React from 'react';
import { 
  Star, 
  Users, 
  Clock, 
  User,
  Coins,
  Play,
  BookOpen,
  Trophy,
  Calendar,
  ArrowLeft,
  VideoCamera
} from '@phosphor-icons/react';
import { useApp } from '../../../contexts/AppContext';
import DashboardTemplate from '../../templates/DashboardTemplate';
import Card from '../../molecules/Card';
import Button from '../../atoms/Button';
import './CourseDetails.css';

const CourseDetails = () => {
  const { state, actions } = useApp();

  // Mock data - em uma aplicação real, isso viria de uma API baseada no courseId
  const courseData = {
    id: 1,
    title: 'Desenvolvimento Web Completo com React e Node.js',
    instructor: {
      name: 'Enzo Fernandes',
      avatar: '/instructor-avatar.jpg',
      rating: 4.3,
      totalStudents: 2000,
      bio: 'Especialista em cálculo e álgebra com 10 anos de experiência. Formado pela USP com mestrado em Matemática Aplicada.'
    },
    description: 'Aprenda desenvolvimento web completo em aulas ao vivo! Este curso abrangente cobre tanto frontend quanto backend, com aulas interativas via Zoom onde você pode tirar dúvidas em tempo real. Usando as tecnologias mais modernas e demandadas pelo mercado, você sairá preparado para criar aplicações web completas.',
    rating: 4.3,
    totalRatings: 1080,
    totalStudents: 2000,
    pricePerHour: 1, // 1 moeda = 1 hora
    totalHours: 40,
    category: 'Desenvolvimento',
    level: 'Intermediário',
    language: 'Português',
    features: [
      '🎥 Aulas ao vivo via Zoom',
      '👨‍🏫 Suporte direto com o instrutor',
      '💻 Projetos práticos hands-on',
      '🏆 Certificado de conclusão',
      '♾️ Acesso vitalício ao material',
      '👥 Comunidade exclusiva de alunos',
      '📱 Gravações disponíveis por 30 dias',
      '💬 Chat ao vivo durante as aulas'
    ],
    curriculum: [
      {
        id: 1,
        title: 'Introdução ao Desenvolvimento Web',
        duration: 2,
        lessons: [
          'O que é desenvolvimento web',
          'Configuração do ambiente',
          'HTML e CSS básico'
        ]
      },
      {
        id: 2,
        title: 'JavaScript Fundamentals',
        duration: 4,
        lessons: [
          'Sintaxe básica do JavaScript',
          'DOM Manipulation',
          'Eventos e interatividade',
          'ES6+ Features'
        ]
      },
      {
        id: 3,
        title: 'React.js',
        duration: 8,
        lessons: [
          'Introdução ao React',
          'Components e Props',
          'State e Lifecycle',
          'Hooks',
          'Context API',
          'Roteamento',
          'Projeto prático'
        ]
      },
      {
        id: 4,
        title: 'Node.js e Backend',
        duration: 6,
        lessons: [
          'Introdução ao Node.js',
          'Express.js',
          'APIs RESTful',
          'Banco de dados',
          'Autenticação',
          'Deploy'
        ]
      }
    ],
    schedule: [
      { day: 'Segunda', time: '19:00-21:00' },
      { day: 'Quarta', time: '19:00-21:00' },
      { day: 'Sexta', time: '19:00-21:00' }
    ]
  };

  const totalCost = courseData.pricePerHour * courseData.totalHours;
  const canAfford = state.user.credits >= totalCost;

  const handlePurchaseCourse = () => {
    if (canAfford) {
      actions.updateCredits(-totalCost);
      console.log(`Curso comprado! ${totalCost} moedas debitadas.`);
      // Aqui você redirecionaria para a página de confirmação ou aula
    } else {
      console.log('Moedas insuficientes!');
      // Aqui você mostraria uma modal ou redirecionaria para comprar moedas
    }
  };

  const handlePurchaseHour = (hours = 1) => {
    const cost = courseData.pricePerHour * hours;
    if (state.user.credits >= cost) {
      // Definir o curso selecionado e navegar para página de agendamento
      actions.setSelectedCourse({
        id: courseData.id,
        title: courseData.title,
        instructor: courseData.instructor.name,
        price: courseData.pricePerHour
      });
      actions.setCurrentPage('schedule-class');
    } else {
      console.log('Moedas insuficientes!');
    }
  };

  const handleGoBack = () => {
    actions.setCurrentPage('dashboard');
  };

  return (
    <DashboardTemplate>
      <div className="course-details">
        {/* Header */}
        <div className="course-details__header">
          <Button variant="ghost" onClick={handleGoBack} className="course-details__back">
            <ArrowLeft size={20} />
            Voltar aos cursos
          </Button>
        </div>

        {/* Hero Section */}
        <Card className="course-details__hero" padding="large">
          <div className="course-details__hero-content">
            <div className="course-details__hero-left">
              <div className="course-details__category">{courseData.category}</div>
              <h1 className="course-details__title">{courseData.title}</h1>
              <p className="course-details__description">{courseData.description}</p>
              
              <div className="course-details__meta">
                <div className="course-details__meta-item">
                  <Star size={20} weight="fill" />
                  <span>{courseData.rating} ({courseData.totalRatings} avaliações)</span>
                </div>
                <div className="course-details__meta-item">
                  <Users size={20} />
                  <span>{courseData.totalStudents} alunos</span>
                </div>
                <div className="course-details__meta-item">
                  <Clock size={20} />
                  <span>{courseData.totalHours} horas</span>
                </div>
              </div>
            </div>

            <div className="course-details__hero-right">
              <Card className="course-details__purchase-card" padding="large">
                <div className="course-details__price">
                <div className="course-details__price-main">
                  <Coins size={24} weight="fill" />
                  <span className="course-details__price-value">{totalCost}</span>
                  <span className="course-details__price-label">créditos</span>
                </div>
                  <div className="course-details__price-detail">
                    {courseData.pricePerHour} crédito por hora
                  </div>
                </div>

                <div className="course-details__purchase-options">
                  <Button 
                    variant="primary" 
                    size="large" 
                    fullWidth
                    onClick={handlePurchaseCourse}
                    disabled={!canAfford}
                  >
                    <Coins size={20} weight="fill" />
                    Comprar Curso Completo - {totalCost} Créditos
                  </Button>
                  
                  <div className="course-details__divider">ou</div>
                  
                  <Button 
                    variant="outline" 
                    size="large" 
                    fullWidth
                    onClick={() => handlePurchaseHour(1)}
                    disabled={state.user.credits < courseData.pricePerHour}
                  >
                    <Play size={20} />
                    Comprar 1 Hora
                  </Button>
                </div>

                {!canAfford && (
                  <div className="course-details__insufficient-funds">
                    <p>Você precisa de {totalCost - state.user.credits} moedas a mais</p>
                    <Button variant="secondary" size="small" fullWidth>
                      Ganhar Moedas Ensinando
                    </Button>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </Card>

        {/* Course Content */}
        <div className="course-details__content">
          {/* Instructor */}
          <Card className="course-details__instructor" padding="large">
            <h2 className="course-details__section-title">
              <User size={24} />
              Sobre o Instrutor
            </h2>
            <div className="course-details__instructor-content">
              <div className="course-details__instructor-avatar">
                <img 
                  src={courseData.instructor.avatar}
                  alt={courseData.instructor.name}
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(courseData.instructor.name)}&background=52357B&color=fff&size=80`;
                  }}
                />
              </div>
              <div className="course-details__instructor-info">
                <h3 className="course-details__instructor-name">{courseData.instructor.name}</h3>
                <p className="course-details__instructor-bio">{courseData.instructor.bio}</p>
                <div className="course-details__instructor-stats">
                  <div className="course-details__instructor-stat">
                    <Star size={16} weight="fill" />
                    <span>{courseData.instructor.rating}</span>
                  </div>
                  <div className="course-details__instructor-stat">
                    <Users size={16} />
                    <span>{courseData.instructor.totalStudents} alunos</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Curriculum */}
          <Card className="course-details__curriculum" padding="large">
            <h2 className="course-details__section-title">
              <BookOpen size={24} />
              Conteúdo do Curso
            </h2>
            <div className="course-details__curriculum-list">
              {courseData.curriculum.map((module) => (
                <div key={module.id} className="course-details__module">
                  <div className="course-details__module-header">
                    <h3 className="course-details__module-title">{module.title}</h3>
                    <div className="course-details__module-duration">
                      <Clock size={16} />
                      <span>{module.duration}h</span>
                    </div>
                  </div>
                  <ul className="course-details__lesson-list">
                    {module.lessons.map((lesson, index) => (
                      <li key={index} className="course-details__lesson">
                        <Play size={14} />
                        <span>{lesson}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Card>

          {/* Schedule */}
          <Card className="course-details__schedule" padding="large">
            <h2 className="course-details__section-title">
              <Calendar size={24} />
              Horários Disponíveis
            </h2>
            <div className="course-details__schedule-list">
              {courseData.schedule.map((slot, index) => (
                <div key={index} className="course-details__schedule-item">
                  <div className="course-details__schedule-day">{slot.day}</div>
                  <div className="course-details__schedule-time">{slot.time}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Live Classes Info */}
          <Card className="course-details__live-info" padding="large">
            <h2 className="course-details__section-title">
              <VideoCamera size={24} />
              Aulas ao Vivo
            </h2>
            <div className="course-details__live-content">
              <div className="course-details__live-feature">
                <div className="course-details__live-icon">🎥</div>
                <div className="course-details__live-text">
                  <strong>Transmissão via Zoom</strong>
                  <p>Aulas interativas com vídeo e áudio de alta qualidade</p>
                </div>
              </div>
              <div className="course-details__live-feature">
                <div className="course-details__live-icon">💬</div>
                <div className="course-details__live-text">
                  <strong>Interação em Tempo Real</strong>
                  <p>Tire dúvidas diretamente com o instrutor durante a aula</p>
                </div>
              </div>
              <div className="course-details__live-feature">
                <div className="course-details__live-icon">📹</div>
                <div className="course-details__live-text">
                  <strong>Gravações Disponíveis</strong>
                  <p>Acesse as gravações por 30 dias após cada aula</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Features */}
          <Card className="course-details__features" padding="large">
            <h2 className="course-details__section-title">
              <Trophy size={24} />
              O que você vai receber
            </h2>
            <ul className="course-details__features-list">
              {courseData.features.map((feature, index) => (
                <li key={index} className="course-details__feature">
                  <div className="course-details__feature-icon">✓</div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </DashboardTemplate>
  );
};

export default CourseDetails;
