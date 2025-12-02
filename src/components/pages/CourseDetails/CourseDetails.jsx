import React, { useState, useEffect } from "react";
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
  Globe,
  PencilSimple,
  CaretDown,
  CaretUp,
} from "@phosphor-icons/react";
import { useApp } from "../../../contexts";
import { useCourses } from "../../../hooks/useCourses";
import { useAvailability, useEnrollments } from "../../../hooks";
import DashboardTemplate from "../../templates/DashboardTemplate";
import Card from "../../molecules/Card";
import Button from "../../atoms/Button";
import LoadingScreen from "../../atoms/LoadingScreen";
import CourseReviewModal from "../../organisms/CourseReviewModal";
import { CourseReviews } from "../../organisms";
import "./CourseDetails.css";

// Componente para Feature com dropdown
const FeatureItem = ({ title, description, hasDescription }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!hasDescription) {
    return (
      <li className="course-details__feature">
        <div className="course-details__feature-icon">✓</div>
        <span>{title}</span>
      </li>
    );
  }

  return (
    <li className="course-details__feature course-details__feature--expandable">
      <div 
        className="course-details__feature-header"
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ cursor: 'pointer' }}
      >
        <div className="course-details__feature-content">
          <div className="course-details__feature-icon">✓</div>
          <span className="course-details__feature-title">{title}</span>
        </div>
        <div className="course-details__feature-toggle">
          {isExpanded ? <CaretUp size={20} /> : <CaretDown size={20} />}
        </div>
      </div>
      {isExpanded && (
        <div className="course-details__feature-description">
          {description.split('\n').map((line, idx) => (
            <p key={idx} style={{ margin: '0.5rem 0', lineHeight: '1.6' }}>
              {line.trim() || '\u00A0'}
            </p>
          ))}
        </div>
      )}
    </li>
  );
};

const CourseDetails = () => {
  const { state, actions } = useApp();
  const {
    getCourseById,
    loading: courseLoading,
    error: courseError,
  } = useCourses();
  const { getAvailableSlots } = useAvailability();
  const {
    checkEnrollmentStatus,
    enrollInFullCourse,
    loading: enrollmentLoading,
  } = useEnrollments();
  
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [enrollmentStatus, setEnrollmentStatus] = useState(null);

  // Obter ID do curso do selectedCourse
  // Pode vir como id ou _id, e pode ser string ou objeto
  const courseId =
    state.selectedCourse?.id ||
                   state.selectedCourse?._id || 
    (typeof state.selectedCourse === "string" ? state.selectedCourse : null);
  
  // Debug: Log para verificar o que está sendo recebido
  useEffect(() => {
    if (state.selectedCourse) {
      console.log(
        "📋 CourseDetails - selectedCourse recebido:",
        state.selectedCourse
      );
      console.log("📋 CourseDetails - courseId extraído:", courseId);
      console.log(
        "📋 CourseDetails - Tipo do selectedCourse:",
        typeof state.selectedCourse
      );
      console.log(
        "📋 CourseDetails - Keys do selectedCourse:",
        Object.keys(state.selectedCourse || {})
      );
      
      // Se não tem ID, tentar encontrar em outros lugares
      if (!courseId) {
        console.warn(
          "⚠️ CourseDetails - Nenhum ID encontrado! Tentando alternativas..."
        );
        // Se o instructor for um ID (string de 24 caracteres), pode ser que esteja confundido
        const instructorValue = state.selectedCourse?.instructor;
        if (
          instructorValue &&
          typeof instructorValue === "string" &&
          instructorValue.length === 24
        ) {
          console.warn(
            "⚠️ CourseDetails - Instructor parece ser um ID MongoDB:",
            instructorValue
          );
          console.warn(
            "⚠️ CourseDetails - Isso pode indicar que o curso não tem ID próprio"
          );
        }
      }
    }
  }, [state.selectedCourse, courseId]);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) {
        setError("Nenhum curso selecionado");
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
            description: course.description || "",
            instructor: {
              _id: course.instructor?._id || course.instructor?.id,
              name: course.instructor?.name || "Instrutor",
              avatar: course.instructor?.avatar || "",
              rating: course.instructor?.rating || 0,
              // A API retorna instructor.stats, não instructor.totalStudents
              totalStudents:
                course.instructor?.stats?.coursesTeaching ||
                            course.instructor?.totalStudents || 
                course.currentStudents ||
                0,
              bio: course.instructor?.bio || "",
              stats: course.instructor?.stats || {},
            },
            rating: course.rating || 0,
            totalRatings: course.totalRatings || 0,
            // A API retorna currentStudents, não totalStudents
            totalStudents: course.currentStudents || 0,
            pricePerHour: course.pricePerHour || 0,
            totalHours: course.totalHours || 0,
            // Usar totalPrice calculado pela API se disponível
            totalPrice:
              course.totalPrice || course.pricePerHour * course.totalHours,
            category: course.category || "",
            subcategory: course.subcategory || "",
            level: course.level || "Iniciante",
            // A API mapeia courseLanguage de volta para language
            language: course.language || course.courseLanguage || "Português",
            image: course.image || "",
            features: course.features || [],
            curriculum: course.curriculum || [],
            schedule: course.schedule || [],
            requirements: course.requirements || [],
            objectives: course.objectives || [],
            tags: course.tags || [],
            status: course.status || "draft",
            maxStudents: course.maxStudents || 50,
            // Usar spotsAvailable calculado pela API se disponível
            spotsAvailable:
              course.spotsAvailable ||
              course.maxStudents - (course.currentStudents || 0),
            isLive: course.isLive !== undefined ? course.isLive : true,
            // Campos adicionais da API (se autenticado)
            isEnrolled: course.isEnrolled || false,
            isFavorite: course.isFavorite || false,
            // Lista de estudantes matriculados
            enrolledStudents: course.enrolledStudents || [],
            // Disponibilidade do curso
            availability: course.availability || null,
            // Preços separados (novo sistema)
            pricing: course.pricing || {
              singleClass: course.pricePerHour || 0,
              fullCourse: (course.pricePerHour || 0) * (course.totalHours || 1),
            },
          });
        } else {
          setError("Curso não encontrado");
        }
      } catch (err) {
        console.error("Erro ao carregar curso:", err);
        setError(err.message || "Erro ao carregar detalhes do curso");
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

  // Verificar status de matrícula quando o curso for carregado
  useEffect(() => {
    const checkEnrollment = async () => {
      if (!courseData || !state.user) return;

      try {
        const result = await checkEnrollmentStatus(courseData.id);
        if (result.success) {
          setEnrollmentStatus(result);
        }
      } catch (err) {
        console.error("Erro ao verificar matrícula:", err);
      }
    };

    checkEnrollment();
  }, [courseData, state.user, checkEnrollmentStatus]);

  // Carregar slots disponíveis quando o curso for carregado
  useEffect(() => {
    const loadAvailableSlots = async () => {
      if (!courseData || !courseData.instructor?._id) return;

      setLoadingSlots(true);
      try {
        // Buscar próximos 30 dias
        const startDate = new Date().toISOString().split("T")[0];
        const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0];

        const result = await getAvailableSlots({
          instructorId: courseData.instructor._id,
          courseId: courseData.id,
          startDate,
          endDate,
        });

        if (result.success && result.slots) {
          // Agrupar slots por data e mostrar próximos horários
          const slotsByDate = {};
          result.slots.forEach((slot) => {
            const dateStr = slot.date;
            if (!slotsByDate[dateStr]) {
              slotsByDate[dateStr] = [];
            }
            slotsByDate[dateStr].push(slot);
          });

          // Pegar os próximos 10 slots disponíveis
          const upcomingSlots = result.slots
            .filter((slot) => {
              const slotDate = new Date(slot.start);
              return slotDate >= new Date();
            })
            .sort((a, b) => new Date(a.start) - new Date(b.start))
            .slice(0, 10);

          setAvailableSlots(upcomingSlots);
        } else {
          setAvailableSlots([]);
        }
      } catch (err) {
        console.error("Erro ao carregar horários disponíveis:", err);
        setAvailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    loadAvailableSlots();
  }, [courseData, getAvailableSlots]);

  // Comprar curso completo
  const handlePurchaseFullCourse = async () => {
    if (!courseData) return;
    
    const fullCoursePrice =
      courseData.pricing?.fullCourse ||
      courseData.pricePerHour * courseData.totalHours;
    const canAfford = (state.user?.credits || 0) >= fullCoursePrice;
    
    if (!canAfford) {
      actions.showToast(
        `Créditos insuficientes! Você precisa de ${fullCoursePrice} créditos.`,
        "error"
      );
      return;
    }

      try {
      const result = await enrollInFullCourse(courseData.id);
      if (result.success) {
        await actions.refreshUser(); // Atualizar dados do usuário após matrícula
        setEnrollmentStatus({
          enrolled: true,
          enrollmentType: "full_course",
          enrollment: result.enrollment,
        });
        actions.showToast(
          result.message || "Curso comprado com sucesso!",
          "success"
        );
      } else {
        actions.showToast(
          result.error || "Erro ao comprar curso. Tente novamente.",
          "error"
        );
      }
      } catch (err) {
      console.error("Erro ao comprar curso:", err);
      actions.showToast(
        err.message || "Erro ao comprar curso. Tente novamente.",
        "error"
      );
    }
  };

  // Navegar para comprar aula avulsa
  const handlePurchaseSingleClass = () => {
    if (!courseData) return;
    
    const singleClassPrice =
      courseData.pricing?.singleClass || courseData.pricePerHour;
    if ((state.user?.credits || 0) < singleClassPrice) {
      actions.showToast(
        `Créditos insuficientes! Você precisa de ${singleClassPrice} créditos.`,
        "error"
      );
      return;
    }

    // Definir o curso selecionado e navegar para página de agendamento (aula avulsa)
      actions.setSelectedCourse({
        id: courseData.id,
      _id: courseData.id,
        title: courseData.title,
      instructor: courseData.instructor, // Passar objeto completo do instrutor
      instructorId: courseData.instructor._id || courseData.instructor.id,
      pricing: courseData.pricing,
      price: singleClassPrice,
      });
    actions.setCurrentPage("schedule-class");
  };

  const handleGoBack = () => {
    actions.setCurrentPage("dashboard");
  };

  const handleReviewSuccess = () => {
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
            <Button
              variant="ghost"
              onClick={handleGoBack}
              className="course-details__back"
            >
              <ArrowLeft size={20} />
              Voltar aos cursos
            </Button>
          </div>
          <Card padding="large">
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <h2>Erro ao carregar curso</h2>
              <p>{error || courseError || "Curso não encontrado"}</p>
              <Button
                variant="primary"
                onClick={handleGoBack}
                style={{ marginTop: "1rem" }}
              >
                Voltar ao Dashboard
              </Button>
            </div>
          </Card>
        </div>
      </DashboardTemplate>
    );
  }

  // Preços do curso
  const fullCoursePrice =
    courseData?.pricing?.fullCourse ||
    courseData?.pricePerHour * courseData?.totalHours ||
    0;
  const singleClassPrice =
    courseData?.pricing?.singleClass || courseData?.pricePerHour || 0;
  const canAffordFullCourse = (state.user?.credits || 0) >= fullCoursePrice;
  const canAffordSingleClass = (state.user?.credits || 0) >= singleClassPrice;

  // Verificar se o usuário é o dono do curso
  const isCourseOwner =
    state.user &&
    courseData &&
    courseData.instructor &&
    ((courseData.instructor._id &&
      courseData.instructor._id === state.user._id) ||
      (courseData.instructor.id &&
        courseData.instructor.id === state.user._id) ||
      (typeof courseData.instructor === "string" &&
        courseData.instructor === state.user._id));

  const handleEditCourse = () => {
    if (courseData) {
      actions.setSelectedCourse(courseData);
      actions.openModal("editCourse");
    }
  };

  return (
    <DashboardTemplate>
      <div className="course-details">
        {/* Header */}
        <div className="course-details__header">
          <Button
            variant="ghost"
            onClick={handleGoBack}
            className="course-details__back"
          >
            <ArrowLeft size={20} />
            Voltar aos cursos
          </Button>
          {isCourseOwner && (
            <Button
              variant="primary"
              onClick={handleEditCourse}
              className="course-details__edit"
            >
              <PencilSimple size={20} />
              Editar Curso
            </Button>
          )}
        </div>

        {/* Hero Section */}
        <Card className="course-details__hero" padding="large">
          {courseData.image && (
            <div className="course-details__hero-image">
              <img 
                src={courseData.image} 
                alt={courseData.title}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          )}
          <div className="course-details__hero-content">
            <div className="course-details__hero-left">
              <div className="course-details__category">
                {courseData.category}
              </div>
              <h1 className="course-details__title">{courseData.title}</h1>
              <p className="course-details__description">
                {courseData.description}
              </p>
              
              <div className="course-details__meta">
                {courseData.rating > 0 && (
                  <div className="course-details__meta-item">
                    <Star size={20} weight="fill" />
                    <span>
                      {courseData.rating.toFixed(1)} ({courseData.totalRatings}{" "}
                      avaliações)
                    </span>
                  </div>
                )}
                <div className="course-details__meta-item">
                  <Users size={20} />
                  <span>
                    {courseData.totalStudents} aluno
                    {courseData.totalStudents !== 1 ? "s" : ""}
                  </span>
                  {courseData.spotsAvailable !== undefined &&
                    courseData.spotsAvailable > 0 && (
                      <span className="course-details__spots">
                        {" "}
                        ({courseData.spotsAvailable} vagas)
                      </span>
                  )}
                </div>
                <div className="course-details__meta-item">
                  <Clock size={20} />
                  <span>
                    {courseData.totalHours} hora
                    {courseData.totalHours !== 1 ? "s" : ""}
                  </span>
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
          </div>
        </Card>

        {/* Purchase Options - Apenas se não for o dono do curso, abaixo do hero */}
        {!isCourseOwner && (
          <Card className="course-details__purchase-card course-details__purchase-card--horizontal" padding="large">
            {enrollmentStatus?.enrolled ? (
              // Já matriculado
              enrollmentStatus.enrollmentType === "full_course" ? (
                <>
                <div className="course-details__price">
                <div className="course-details__price-main">
                      <BookOpen size={24} weight="fill" />
                      <span className="course-details__price-label">
                        Você está matriculado
                      </span>
                </div>
                  <div className="course-details__price-detail">
                      Acesso ilimitado para agendar aulas
                  </div>
                </div>
                <div className="course-details__purchase-options">
                  <Button 
                    variant="primary" 
                    size="large" 
                      onClick={() => {
                        actions.setSelectedCourse({
                          id: courseData.id,
                          _id: courseData.id,
                          title: courseData.title,
                          instructor: courseData.instructor, // Passar objeto completo do instrutor
                          instructorId: courseData.instructor._id || courseData.instructor.id,
                          pricing: courseData.pricing,
                        });
                        actions.setCurrentPage("schedule-class");
                      }}
                  >
                      <Calendar size={20} />
                      Agendar Aula
                    </Button>
                  </div>
                </>
              ) : null
            ) : (
              // Não matriculado - Mostrar opções de compra horizontal
              <>
                <div className="course-details__purchase-options-horizontal">
                  {/* Opção: Aula Avulsa */}
                  <div className="course-details__purchase-option">
                    <div className="course-details__purchase-option-header">
                      <h3 className="course-details__purchase-option-title">
                        Aula Avulsa
                      </h3>
                      <p className="course-details__purchase-option-desc">
                        Compre uma aula específica
                      </p>
                      <p className="course-details__purchase-option-price">
                        {singleClassPrice} créditos
                      </p>
                    </div>
                  <Button 
                    variant="outline" 
                    size="large" 
                    fullWidth
                      onClick={handlePurchaseSingleClass}
                      disabled={!canAffordSingleClass || enrollmentLoading}
                  >
                    <Play size={20} />
                      Escolher Horário
                  </Button>
                </div>

                  <div className="course-details__divider-vertical">
                    <span>ou</span>
                  </div>

                  {/* Opção: Curso Completo */}
                  <div className="course-details__purchase-option course-details__purchase-option--highlighted">
                    <div className="course-details__purchase-option-badge">
                      Melhor Valor
                    </div>
                    <div className="course-details__purchase-option-header">
                      <h3 className="course-details__purchase-option-title">
                        Curso Completo
                      </h3>
                      <p className="course-details__purchase-option-desc">
                        Acesso ilimitado para agendar aulas
                      </p>
                      <p className="course-details__purchase-option-price">
                        {fullCoursePrice} créditos
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      size="large"
                      fullWidth
                      onClick={handlePurchaseFullCourse}
                      disabled={!canAffordFullCourse || enrollmentLoading}
                      loading={enrollmentLoading}
                    >
                      <Coins size={20} weight="fill" />
                      Comprar Curso Completo
                    </Button>
                  </div>
                </div>

                {(!canAffordFullCourse || !canAffordSingleClass) && (
                  <div className="course-details__insufficient-funds">
                    <p>
                      {!canAffordFullCourse && !canAffordSingleClass
                        ? `Você precisa de mais créditos. Curso completo: ${
                            fullCoursePrice - (state.user?.credits || 0)
                          } créditos a mais.`
                        : !canAffordFullCourse
                        ? `Você precisa de ${
                            fullCoursePrice - (state.user?.credits || 0)
                          } créditos a mais para o curso completo.`
                        : ""}
                    </p>
                    <Button variant="secondary" size="small" fullWidth>
                      Ganhar Créditos Ensinando
                    </Button>
                  </div>
                )}
              </>
                )}
              </Card>
        )}

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
                  src={
                    courseData.instructor.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      courseData.instructor.name
                    )}&background=52357B&color=fff&size=80`
                  }
                  alt={courseData.instructor.name}
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      courseData.instructor.name
                    )}&background=52357B&color=fff&size=80`;
                  }}
                />
              </div>
              <div className="course-details__instructor-info">
                <h3 className="course-details__instructor-name">
                  {courseData.instructor.name}
                </h3>
                {courseData.instructor.bio && (
                  <p className="course-details__instructor-bio">
                    {courseData.instructor.bio}
                  </p>
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
                      <span>
                        {courseData.instructor.totalStudents} aluno
                        {courseData.instructor.totalStudents !== 1 ? "s" : ""}
                      </span>
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
                  <div
                    key={module.id || module._id || index}
                    className="course-details__module"
                  >
                    <div className="course-details__module-header">
                      <h3 className="course-details__module-title">
                        {module.title || module.name}
                      </h3>
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
                          <li
                            key={lessonIndex}
                            className="course-details__lesson"
                          >
                            <Play size={14} />
                            <span>
                              {typeof lesson === "string"
                                ? lesson
                                : lesson.title || lesson.name}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Available Slots - Horários Disponíveis Reais */}
            <Card className="course-details__schedule" padding="large">
              <h2 className="course-details__section-title">
                <Calendar size={24} />
                Horários Disponíveis
              </h2>
            {loadingSlots ? (
              <div style={{ textAlign: "center", padding: "2rem" }}>
                <p>Carregando horários disponíveis...</p>
              </div>
            ) : availableSlots.length > 0 ? (
              <div className="course-details__schedule-list">
                {availableSlots.map((slot, index) => {
                  const slotDate = new Date(slot.start);
                  return (
                  <div key={index} className="course-details__schedule-item">
                      <div className="course-details__schedule-day">
                        {slotDate.toLocaleDateString("pt-BR", {
                          weekday: "long",
                          day: "2-digit",
                          month: "long",
                        })}
                      </div>
                      <div className="course-details__schedule-time">
                        {slot.time} ({slot.duration}h)
                      </div>
                    </div>
                  );
                })}
                  </div>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  color: "var(--color-neutral-600)",
                }}
              >
                <p>Nenhum horário disponível no momento.</p>
                <p
                  style={{
                    fontSize: "var(--font-size-sm)",
                    marginTop: "0.5rem",
                  }}
                >
                  Entre em contato com o instrutor para mais informações.
                </p>
              </div>
            )}
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
          {courseData.features && courseData.features.length > 0 && (
            <Card className="course-details__features" padding="large">
              <h2 className="course-details__section-title">
                <Trophy size={24} />O que você vai receber
              </h2>
              <ul className="course-details__features-list">
                {courseData.features.map((feature, index) => {
                  const featureTitle = typeof feature === 'string' ? feature : feature.title || feature.name || '';
                  const featureDescription = typeof feature === 'object' ? feature.description : null;
                  const hasDescription = featureDescription && featureDescription.trim().length > 0;
                  
                  return (
                    <FeatureItem 
                      key={index} 
                      title={featureTitle} 
                      description={featureDescription}
                      hasDescription={hasDescription}
                    />
                  );
                })}
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

          {/* Reviews Section - Apenas se não for o dono do curso */}
          {!(
            courseData.instructor &&
            ((courseData.instructor._id &&
              courseData.instructor._id === state.user?._id) ||
              (courseData.instructor.id &&
                courseData.instructor.id === state.user?._id) ||
              (typeof courseData.instructor === "string" &&
                courseData.instructor === state.user?._id))
          ) && (
            <CourseReviews
              courseId={courseData._id || courseData.id}
              onReviewSubmit={async () => {
                // Atualizar dados do curso após nova avaliação
                if (!courseId) return;
                try {
                  const result = await getCourseById(courseId);
                  if (result.success && result.course) {
                    const course = result.course;
                    setCourseData((prev) => ({
                      ...prev,
                      rating: course.rating || prev.rating,
                      totalRatings: course.totalRatings || prev.totalRatings,
                    }));
                  }
                } catch (err) {
                  console.error("Erro ao recarregar curso:", err);
                }
              }}
            />
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
