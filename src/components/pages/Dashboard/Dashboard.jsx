import React, { useState, useEffect } from "react";
import { useApp } from "../../../contexts";
import { useCourses } from "../../../hooks";
import { useUser } from "../../../hooks/useUser";
import DashboardTemplate from "../../templates/DashboardTemplate";
import CourseGrid from "../../organisms/CourseGrid";
import Card from "../../molecules/Card";
import Button from "../../atoms/Button";
import "./Dashboard.css";

const Dashboard = () => {
  const { state, actions } = useApp();
  const { getPopularCourses, getFeaturedCourses, getCourses, loading, error } =
    useCourses();
  const { getTeachingCourses } = useUser();
  const isAuthenticated = state.isAuthenticated;

  const [popularCourses, setPopularCourses] = useState([]);
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [hasUserCourses, setHasUserCourses] = useState(false);

  // Carregar cursos da API ao montar o componente
  useEffect(() => {
    const loadCourses = async () => {
      setIsLoadingCourses(true);
      try {
        console.log("🔄 Iniciando carregamento de cursos...");

        // Adaptar formato da API para o formato esperado pelos componentes
        const adaptCourse = (course) => {
          // Garantir que temos um ID válido
          const courseId = course._id || course.id;
          if (!courseId) {
            console.warn('⚠️ Curso sem ID:', course);
            return null;
          }

          // O instructor pode vir como objeto populado ou apenas como ID
          let instructorName = "Instrutor";
          let instructorId = null;
          let instructorObject = null;
          
          if (typeof course.instructor === 'object' && course.instructor !== null) {
            instructorName = course.instructor.name || course.instructor.username || "Instrutor";
            instructorId = course.instructor._id || course.instructor.id;
            instructorObject = course.instructor;
          } else if (typeof course.instructor === 'string') {
            // Se for apenas um ID, manter o ID mas não usar como nome
            instructorName = "Instrutor";
            instructorId = course.instructor;
          }

          return {
            id: courseId,
            _id: courseId, // Garantir que _id também está presente
            title: course.title || 'Sem título',
            instructor: instructorName, // Nome do instrutor para exibição
            instructorId: instructorId, // ID do instrutor para verificação de propriedade
            instructorObject: instructorObject, // Objeto completo do instrutor se disponível
            category: course.category || '',
            rating: course.rating || null,
            students: course.currentStudents || course.students || null,
            price: course.pricePerHour || course.price || 0,
            image: course.image || '',
            // Manter outros campos importantes para o CourseDetails
            status: course.status,
            level: course.level,
            language: course.language || course.courseLanguage,
          };
        };

        let hasLoadedAnyCourses = false;

        // Tentar carregar cursos populares
        try {
          console.log("📊 Buscando cursos populares...");
          const popularResult = await getPopularCourses(6);
          console.log("📊 Resposta completa de cursos populares:", popularResult);
          console.log(
            "✅ Cursos populares carregados:",
            popularResult.courses?.length || 0,
            popularResult.courses
          );
          if (popularResult.courses && popularResult.courses.length > 0) {
            console.log("📊 Primeiro curso (exemplo):", popularResult.courses[0]);
            const adapted = popularResult.courses.map(adaptCourse).filter(c => c !== null);
            console.log("📊 Cursos adaptados:", adapted);
            if (adapted.length > 0) {
              setPopularCourses(adapted);
              hasLoadedAnyCourses = true;
            }
          } else {
            console.warn("⚠️ Nenhum curso popular retornado pela API");
          }
        } catch (popularError) {
          console.error(
            "❌ Erro ao carregar cursos populares:",
            popularError.message,
            popularError
          );
        }

        // Tentar carregar cursos em destaque
        try {
          console.log("⭐ Buscando cursos em destaque...");
          const featuredResult = await getFeaturedCourses(6);
          console.log("⭐ Resposta completa de cursos em destaque:", featuredResult);
          console.log(
            "✅ Cursos em destaque carregados:",
            featuredResult.courses?.length || 0,
            featuredResult.courses
          );
          if (featuredResult.courses && featuredResult.courses.length > 0) {
            console.log("⭐ Primeiro curso (exemplo):", featuredResult.courses[0]);
            const adapted = featuredResult.courses.map(adaptCourse).filter(c => c !== null);
            console.log("⭐ Cursos adaptados:", adapted);
            if (adapted.length > 0) {
              setFeaturedCourses(adapted);
              hasLoadedAnyCourses = true;
            }
          } else {
            console.warn("⚠️ Nenhum curso em destaque retornado pela API");
          }
        } catch (featuredError) {
          console.error(
            "❌ Erro ao carregar cursos em destaque:",
            featuredError.message,
            featuredError
          );
        }

        // Se usuário está autenticado, tentar carregar seus próprios cursos (inclui "draft")
        if (isAuthenticated) {
          try {
            console.log("👤 Buscando cursos do usuário autenticado...");
            const teachingResult = await getTeachingCourses({ limit: 12 });
            console.log("👤 Cursos do usuário:", teachingResult.courses?.length || 0, teachingResult.courses);
            
            // Verificar se o usuário tem cursos criados
            const userHasCourses = teachingResult.courses && teachingResult.courses.length > 0;
            setHasUserCourses(userHasCourses);
            
            if (userHasCourses) {
              const adapted = teachingResult.courses.map(adaptCourse).filter(c => c !== null);
              if (adapted.length > 0) {
                console.log("✅ Usando cursos do usuário como principal");
                setPopularCourses(adapted.slice(0, 6));
                setFeaturedCourses(adapted.slice(6, 12));
                hasLoadedAnyCourses = true;
              }
            }
          } catch (teachingError) {
            console.warn("⚠️ Erro ao carregar cursos do usuário:", teachingError.message);
            setHasUserCourses(false);
          }
        } else {
          setHasUserCourses(false);
        }

        // Carregar todos os cursos criados com status active
        // GET /api/courses?page=1&limit=20&status=active
        console.log("🔄 Carregando todos os cursos criados (status=active)...");
        try {
          const allCoursesResult = await getCourses({
            page: 1,
            limit: 20,
            status: 'active'
          });

          console.log("🔄 Resposta completa de todos os cursos:", allCoursesResult);
          console.log("🔄 Número de cursos retornados:", allCoursesResult.courses?.length || 0);

          if (allCoursesResult.courses && allCoursesResult.courses.length > 0) {
            console.log("🔄 Primeiro curso (exemplo):", allCoursesResult.courses[0]);
            const adaptedCourses = allCoursesResult.courses.map(adaptCourse).filter(c => c !== null);
            console.log("🔄 Cursos adaptados:", adaptedCourses);
            
            if (adaptedCourses.length > 0) {
              // Usar os cursos como principal, dividindo entre populares e em destaque
              console.log("✅ Usando todos os cursos criados como principal");
              setPopularCourses(adaptedCourses.slice(0, 10));
              setFeaturedCourses(adaptedCourses.slice(10, 20));
              hasLoadedAnyCourses = true;
            }
          } else {
            console.warn("⚠️ Nenhum curso 'active' retornado pela API");
            
            // Fallback: tentar sem filtro de status se não encontrou cursos active
            if (!hasLoadedAnyCourses) {
              console.log("🔄 Tentando buscar cursos sem filtro de status...");
              const fallbackResult = await getCourses({
                page: 1,
                limit: 20,
              });
              
              if (fallbackResult.courses && fallbackResult.courses.length > 0) {
                const adaptedCourses = fallbackResult.courses.map(adaptCourse).filter(c => c !== null);
                if (adaptedCourses.length > 0) {
                  setPopularCourses(adaptedCourses.slice(0, 10));
                  setFeaturedCourses(adaptedCourses.slice(10, 20));
                  hasLoadedAnyCourses = true;
                }
              }
            }
          }
        } catch (allCoursesError) {
          console.error("❌ Erro ao carregar todos os cursos:", allCoursesError.message, allCoursesError);
        }

        console.log("✨ Carregamento de cursos concluído");
      } catch (err) {
        console.error("❌ Erro geral ao carregar cursos:", err);
        console.error("Detalhes do erro:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
      } finally {
        setIsLoadingCourses(false);
      }
    };

    loadCourses();
  }, [getPopularCourses, getFeaturedCourses, getCourses, getTeachingCourses, isAuthenticated, state.user?._id]);

  const handleCourseClick = (course) => {
    console.log('🖱️ Curso clicado (raw):', course);
    
    // Tentar extrair o ID de várias formas possíveis
    const courseId = course.id || 
                     course._id || 
                     (course.instructor && typeof course.instructor === 'string' ? course.instructor : null) ||
                     null;
    
    if (!courseId) {
      console.error('❌ Erro: Curso sem ID válido', course);
      console.error('❌ Estrutura completa do curso:', JSON.stringify(course, null, 2));
      actions.showToast?.('Erro: Curso sem ID. Tente novamente.', 'error');
      return;
    }
    
    console.log('✅ ID do curso extraído:', courseId);
    
    // Passar o curso completo com ID garantido para o CourseDetails
    const courseWithId = {
      ...course,
      // Garantir que o ID não seja sobrescrito
      id: courseId,
      _id: courseId,
    };
    
    console.log('📤 Enviando curso para CourseDetails:', courseWithId);
    
    actions.setSelectedCourse(courseWithId);
    actions.setCurrentPage("course-details");
  };

  const handleShowAllCourses = () => {
    console.log("Show all courses");
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
            </p>
            <p className="dashboard__welcome-text">
              <strong>1 crédito = 1 hora de curso 🪙</strong>
              <br />
              Ensine para ganhar!
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

          {isAuthenticated && (
            <Card className="dashboard__stat-card">
              <div className="dashboard__stat-content">
                <div className="dashboard__stat-icon">🪙</div>
                <div className="dashboard__stat-info">
                  <div className="dashboard__stat-value">
                    {state.user?.credits || 0}
                  </div>
                  <div className="dashboard__stat-label">Seus Créditos</div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Loading State */}
        {isLoadingCourses && (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p>Carregando cursos...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoadingCourses && (
          <div style={{ textAlign: "center", padding: "40px", color: "red" }}>
            <p>Erro ao carregar cursos: {error}</p>
          </div>
        )}

        {/* Course Grids - Só mostra se não estiver carregando */}
        {!isLoadingCourses && (
          <>
            {/* Cursos Populares */}
            {popularCourses.length > 0 && (
              <CourseGrid
                title="Cursos mais populares"
                courses={popularCourses}
                onCourseClick={handleCourseClick}
                onShowAllClick={handleShowAllCourses}
              />
            )}

            {/* Cursos em Destaque */}
            {featuredCourses.length > 0 && (
              <CourseGrid
                title="Cursos em destaque"
                courses={featuredCourses}
                onCourseClick={handleCourseClick}
                onShowAllClick={handleShowAllCourses}
              />
            )}

            {/* Mensagem se não há cursos */}
            {popularCourses.length === 0 && featuredCourses.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <p>Nenhum curso disponível no momento.</p>
              </div>
            )}
          </>
        )}

        {/* Call to Action - Só mostra se usuário não tiver cursos criados */}
        {(!isAuthenticated || !hasUserCourses) && (
          <Card className="dashboard__cta" padding="large">
            <div className="dashboard__cta-content">
              {isAuthenticated ? (
                <>
                  <h2 className="dashboard__cta-title">
                    Pronto para compartilhar seu conhecimento?
                  </h2>
                  <p className="dashboard__cta-text">
                    Crie seu primeiro curso e comece a ensinar milhares de pessoas
                    ao redor do mundo.
                    <br />A cada hora de aula, você ganha 1 crédito para usar em
                    outros cursos!
                  </p>
                  <div className="dashboard__cta-actions">
                    <Button
                      variant="primary"
                      size="large"
                      onClick={() => actions.openModal("addCourse")}
                    >
                      Criar Novo Curso
                    </Button>
                  </div>
                </>
              ) : (
              <>
                <h2 className="dashboard__cta-title">
                  Comece a aprender e ensinar hoje!
                </h2>
                <p className="dashboard__cta-text">
                  Crie sua conta gratuita e tenha acesso a centenas de cursos.
                  <br />
                  Ensine o que você sabe e ganhe créditos para aprender ainda
                  mais!
                </p>
                <div className="dashboard__cta-actions">
                  <Button
                    variant="primary"
                    size="large"
                    onClick={() => {
                      localStorage.setItem("authMode", "register");
                      actions.setCurrentPage("auth");
                    }}
                  >
                    Criar Conta Grátis
                  </Button>
                  <Button
                    variant="outline"
                    size="large"
                    onClick={() => {
                      localStorage.setItem("authMode", "login");
                      actions.setCurrentPage("auth");
                    }}
                  >
                    Já tenho conta
                  </Button>
                </div>
              </>
            )}
          </div>
        </Card>
        )}
      </div>
    </DashboardTemplate>
  );
};

export default Dashboard;
