import React, { useState, useEffect } from 'react';
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
  VideoCamera,
  Globe
} from '@phosphor-icons/react';
import { useApp } from '../../../contexts';
import { useCourses } from '../../../hooks/useCourses';
import DashboardTemplate from '../../templates/DashboardTemplate';
import Card from '../../molecules/Card';
import Button from '../../atoms/Button';
import LoadingScreen from '../../atoms/LoadingScreen';
import CourseReviewModal from '../../organisms/CourseReviewModal';
import './CourseDetails.css';

const CourseDetails = () => {
  const { state, actions } = useApp();
  const { getCourseById, enrollInCourse, loading: courseLoading, error: courseError } = useCourses();
  
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  // Obter ID do curso do selectedCourse
  // Pode vir como id ou _id, e pode ser string ou objeto
  const courseId = state.selectedCourse?.id || 
                   state.selectedCourse?._id || 
                   (typeof state.selectedCourse === 'string' ? state.selectedCourse : null);
  
  // Debug: Log para verificar o que está sendo recebido
  useEffect(() => {
    if (state.selectedCourse) {
      console.log('📋 CourseDetails - selectedCourse recebido:', state.selectedCourse);
      console.log('📋 CourseDetails - courseId extraído:', courseId);
      console.log('📋 CourseDetails - Tipo do selectedCourse:', typeof state.selectedCourse);
      console.log('📋 CourseDetails - Keys do selectedCourse:', Object.keys(state.selectedCourse || {}));
      
      // Se não tem ID, tentar encontrar em outros lugares
      if (!courseId) {
        console.warn('⚠️ CourseDetails - Nenhum ID encontrado! Tentando alternativas...');
        // Se o instructor for um ID (string de 24 caracteres), pode ser que esteja confundido
        const instructorValue = state.selectedCourse?.instructor;
        if (instructorValue && typeof instructorValue === 'string' && instructorValue.length === 24) {
          console.warn('⚠️ CourseDetails - Instructor parece ser um ID MongoDB:', instructorValue);
          console.warn('⚠️ CourseDetails - Isso pode indicar que o curso não tem ID próprio');
        }
      }
    }
  }, [state.selectedCourse, courseId]);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) {
        setError('Nenhum curso selecionado');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const result = await getCourseById(courseId);
        
        if (result.success && result.course) {
          // Mapear dados da API para o formato esperado
          // Conforme documentação: criaçãoCursos.md linhas 776-858
          const course = result.course;
          
          setCourseData({
            id: course._id || course.id,
            title: course.title,
            description: course.description || '',
            instructor: {
              _id: course.instructor?._id || course.instructor?.id,
              name: course.instructor?.name || 'Instrutor',
              avatar: course.instructor?.avatar || '',
              rating: course.instructor?.rating || 0,
              // A API retorna instructor.stats, não instructor.totalStudents
              totalStudents: course.instructor?.stats?.coursesTeaching || 
                            course.instructor?.totalStudents || 
                            course.currentStudents || 0,
              bio: course.instructor?.bio || '',
              stats: course.instructor?.stats || {}
            },
            rating: course.rating || 0,
            totalRatings: course.totalRatings || 0,
            // A API retorna currentStudents, não totalStudents
            totalStudents: course.currentStudents || 0,
            pricePerHour: course.pricePerHour || 0,
            totalHours: course.totalHours || 0,
            // Usar totalPrice calculado pela API se disponível
            totalPrice: course.totalPrice || (course.pricePerHour * course.totalHours),
            category: course.category || '',
            subcategory: course.subcategory || '',
            level: course.level || 'Iniciante',
            // A API mapeia courseLanguage de volta para language
            language: course.language || course.courseLanguage || 'Português',
            image: course.image || '',
            features: course.features || [],
            curriculum: course.curriculum || [],
            schedule: course.schedule || [],
            requirements: course.requirements || [],
            objectives: course.objectives || [],
            tags: course.tags || [],
            status: course.status || 'draft',
            maxStudents: course.maxStudents || 50,
            // Usar spotsAvailable calculado pela API se disponível
            spotsAvailable: course.spotsAvailable || (course.maxStudents - (course.currentStudents || 0)),
            isLive: course.isLive !== undefined ? course.isLive : true,
            // Campos adicionais da API (se autenticado)
            isEnrolled: course.isEnrolled || false,
            isFavorite: course.isFavorite || false,
            // Lista de estudantes matriculados
            enrolledStudents: course.enrolledStudents || []
          });
        } else {
          setError('Curso não encontrado');
        }
      } catch (err) {
        console.error('Erro ao carregar curso:', err);
        setError(err.message || 'Erro ao carregar detalhes do curso');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, getCourseById]);

  // Verificar se deve abrir modal de avaliação
  useEffect(() => {
    const shouldOpenReview = sessionStorage.getItem('openReviewModal') === 'true';
    if (shouldOpenReview && courseData) {
      setReviewModalOpen(true);
      // Remover flag do sessionStorage
      sessionStorage.removeItem('openReviewModal');
    }
  }, [courseData]);

  const handlePurchaseCourse = async () => {
    if (!courseData) return;
    
    // Usar totalPrice da API se disponível, senão calcular
    const totalCost = courseData.totalPrice || (courseData.pricePerHour * courseData.totalHours);
    const canAfford = (state.user?.credits || 0) >= totalCost;
    
    if (canAfford) {
      try {
        await enrollInCourse(courseData.id);
        await actions.refreshUser(); // Atualizar dados do usuário após matrícula
        actions.showToast('Curso comprado com sucesso!', 'success');
        // Redirecionar para página de confirmação ou aula
      } catch (err) {
        console.error('Erro ao comprar curso:', err);
        actions.showToast(err.message || 'Erro ao comprar curso. Tente novamente.', 'error');
      }
    } else {
      actions.showToast('Créditos insuficientes!', 'error');
    }
  };

  const handlePurchaseHour = (hours = 1) => {
    if (!courseData) return;
    
    const cost = courseData.pricePerHour * hours;
    if ((state.user?.credits || 0) >= cost) {
      // Definir o curso selecionado e navegar para página de agendamento
      actions.setSelectedCourse({
        id: courseData.id,
        title: courseData.title,
        instructor: courseData.instructor.name,
        price: courseData.pricePerHour
      });
      actions.setCurrentPage('schedule-class');
    } else {
      actions.showToast('Créditos insuficientes!', 'error');
    }
  };

  const handleGoBack = () => {
    actions.setCurrentPage('dashboard');
  };

  const handleReviewSuccess = (reviewData) => {
    // Atualizar dados do curso se necessário
    // Por exemplo, recarregar avaliações ou atualizar rating
    if (courseData) {
      // Pode atualizar o rating localmente se necessário
      // Ou recarregar o curso completo
    }
  };

  // Loading state
  if (loading || courseLoading) {
    return (
      <DashboardTemplate>
        <LoadingScreen />
      </DashboardTemplate>
    );
  }

  // Error state
  if (error || courseError || !courseData) {
    return (
      <DashboardTemplate>
        <div className="course-details">
          <div className="course-details__header">
            <Button variant="ghost" onClick={handleGoBack} className="course-details__back">
              <ArrowLeft size={20} />
              Voltar aos cursos
            </Button>
          </div>
          <Card padding="large">
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <h2>Erro ao carregar curso</h2>
              <p>{error || courseError || 'Curso não encontrado'}</p>
              <Button variant="primary" onClick={handleGoBack} style={{ marginTop: '1rem' }}>
                Voltar ao Dashboard
              </Button>
            </div>
          </Card>
        </div>
      </DashboardTemplate>
    );
  }

  // Usar totalPrice da API se disponível, senão calcular
  const totalCost = courseData.totalPrice || (courseData.pricePerHour * courseData.totalHours);
  const canAfford = (state.user?.credits || 0) >= totalCost;

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
          {courseData.image && (
            <div className="course-details__hero-image">
              <img 
                src={courseData.image} 
                alt={courseData.title}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
          <div className="course-details__hero-content">
            <div className="course-details__hero-left">
              <div className="course-details__category">{courseData.category}</div>
              <h1 className="course-details__title">{courseData.title}</h1>
              <p className="course-details__description">{courseData.description}</p>
              
              <div className="course-details__meta">
                {courseData.rating > 0 && (
                  <div className="course-details__meta-item">
                    <Star size={20} weight="fill" />
                    <span>{courseData.rating.toFixed(1)} ({courseData.totalRatings} avaliações)</span>
                  </div>
                )}
                <div className="course-details__meta-item">
                  <Users size={20} />
                  <span>{courseData.totalStudents} aluno{courseData.totalStudents !== 1 ? 's' : ''}</span>
                  {courseData.spotsAvailable !== undefined && courseData.spotsAvailable > 0 && (
                    <span className="course-details__spots"> ({courseData.spotsAvailable} vagas)</span>
                  )}
                </div>
                <div className="course-details__meta-item">
                  <Clock size={20} />
                  <span>{courseData.totalHours} hora{courseData.totalHours !== 1 ? 's' : ''}</span>
                </div>
                {courseData.language && (
                  <div className="course-details__meta-item">
                    <Globe size={20} />
                    <span>{courseData.language}</span>
                  </div>
                )}
                {courseData.level && (
                  <div className="course-details__meta-item">
                    <Trophy size={20} />
                    <span>{courseData.level}</span>
                  </div>
                )}
                {courseData.isEnrolled && (
                  <div className="course-details__meta-item course-details__meta-item--enrolled">
                    <Play size={20} weight="fill" />
                    <span>Você está matriculado</span>
                  </div>
                )}
                {courseData.isFavorite && (
                  <div className="course-details__meta-item course-details__meta-item--favorite">
                    <Star size={20} weight="fill" />
                    <span>Nos seus favoritos</span>
                  </div>
                )}
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
                    disabled={(state.user?.credits || 0) < courseData.pricePerHour}
                  >
                    <Play size={20} />
                    Comprar 1 Hora
                  </Button>
                </div>

                {!canAfford && (
                  <div className="course-details__insufficient-funds">
                    <p>Você precisa de {totalCost - (state.user?.credits || 0)} moedas a mais</p>
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
                  src={courseData.instructor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(courseData.instructor.name)}&background=52357B&color=fff&size=80`}
                  alt={courseData.instructor.name}
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(courseData.instructor.name)}&background=52357B&color=fff&size=80`;
                  }}
                />
              </div>
              <div className="course-details__instructor-info">
                <h3 className="course-details__instructor-name">{courseData.instructor.name}</h3>
                {courseData.instructor.bio && (
                  <p className="course-details__instructor-bio">{courseData.instructor.bio}</p>
                )}
                <div className="course-details__instructor-stats">
                  {courseData.instructor.rating > 0 && (
                    <div className="course-details__instructor-stat">
                      <Star size={16} weight="fill" />
                      <span>{courseData.instructor.rating.toFixed(1)}</span>
                    </div>
                  )}
                  {courseData.instructor.totalStudents > 0 && (
                    <div className="course-details__instructor-stat">
                      <Users size={16} />
                      <span>{courseData.instructor.totalStudents} aluno{courseData.instructor.totalStudents !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Curriculum */}
          {courseData.curriculum && courseData.curriculum.length > 0 && (
            <Card className="course-details__curriculum" padding="large">
              <h2 className="course-details__section-title">
                <BookOpen size={24} />
                Conteúdo do Curso
              </h2>
              <div className="course-details__curriculum-list">
                {courseData.curriculum.map((module, index) => (
                  <div key={module.id || module._id || index} className="course-details__module">
                    <div className="course-details__module-header">
                      <h3 className="course-details__module-title">{module.title || module.name}</h3>
                      {module.duration && (
                        <div className="course-details__module-duration">
                          <Clock size={16} />
                          <span>{module.duration}h</span>
                        </div>
                      )}
                    </div>
                    {module.lessons && module.lessons.length > 0 && (
                      <ul className="course-details__lesson-list">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <li key={lessonIndex} className="course-details__lesson">
                            <Play size={14} />
                            <span>{typeof lesson === 'string' ? lesson : lesson.title || lesson.name}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Schedule */}
          {courseData.schedule && courseData.schedule.length > 0 && (
            <Card className="course-details__schedule" padding="large">
              <h2 className="course-details__section-title">
                <Calendar size={24} />
                Horários Disponíveis
              </h2>
              <div className="course-details__schedule-list">
                {courseData.schedule.map((slot, index) => (
                  <div key={index} className="course-details__schedule-item">
                    <div className="course-details__schedule-day">{slot.day || slot}</div>
                    {slot.time && (
                      <div className="course-details__schedule-time">{slot.time}</div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

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
          {courseData.features && courseData.features.length > 0 && (
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
          )}

          {/* Requirements */}
          {courseData.requirements && courseData.requirements.length > 0 && (
            <Card className="course-details__requirements" padding="large">
              <h2 className="course-details__section-title">
                <BookOpen size={24} />
                Pré-requisitos
              </h2>
              <ul className="course-details__features-list">
                {courseData.requirements.map((requirement, index) => (
                  <li key={index} className="course-details__feature">
                    <div className="course-details__feature-icon">•</div>
                    <span>{requirement}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Objectives */}
          {courseData.objectives && courseData.objectives.length > 0 && (
            <Card className="course-details__objectives" padding="large">
              <h2 className="course-details__section-title">
                <Trophy size={24} />
                Objetivos do Curso
              </h2>
              <ul className="course-details__features-list">
                {courseData.objectives.map((objective, index) => (
                  <li key={index} className="course-details__feature">
                    <div className="course-details__feature-icon">✓</div>
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </div>

      {/* Modal de Avaliação */}
      {courseData && (
        <CourseReviewModal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          courseId={courseData.id}
          courseTitle={courseData.title}
          onSuccess={handleReviewSuccess}
        />
      )}
    </DashboardTemplate>
  );
};

export default CourseDetails;
