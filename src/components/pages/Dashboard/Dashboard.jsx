import React, { useState, useEffect } from "react";
import { useApp } from "../../../contexts";
import { useCourses } from "../../../hooks";
import DashboardTemplate from "../../templates/DashboardTemplate";
import CourseGrid from "../../organisms/CourseGrid";
import Card from "../../molecules/Card";
import Button from "../../atoms/Button";
import "./Dashboard.css";

const Dashboard = () => {
  const { state, actions } = useApp();
  const { getPopularCourses, getFeaturedCourses, getCourses, loading, error } =
    useCourses();
  const isAuthenticated = state.isAuthenticated;

  const [popularCourses, setPopularCourses] = useState([]);
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);

  // Carregar cursos da API ao montar o componente
  useEffect(() => {
    const loadCourses = async () => {
      setIsLoadingCourses(true);
      try {
        console.log("🔄 Iniciando carregamento de cursos...");

        // Adaptar formato da API para o formato esperado pelos componentes
        const adaptCourse = (course) => ({
          id: course._id,
          title: course.title,
          instructor: course.instructor?.name || "Instrutor",
          category: course.category,
          rating: course.rating || 0,
          students: course.currentStudents || 0,
          price: course.pricePerHour,
          image: course.image,
        });

        let hasLoadedAnyCourses = false;

        // Tentar carregar cursos populares
        try {
          console.log("📊 Buscando cursos populares...");
          const popularResult = await getPopularCourses(6);
          console.log(
            "✅ Cursos populares carregados:",
            popularResult.courses.length
          );
          if (popularResult.courses.length > 0) {
            setPopularCourses(popularResult.courses.map(adaptCourse));
            hasLoadedAnyCourses = true;
          }
        } catch (popularError) {
          console.warn(
            "⚠️ Erro ao carregar cursos populares:",
            popularError.message
          );
        }

        // Tentar carregar cursos em destaque
        try {
          console.log("⭐ Buscando cursos em destaque...");
          const featuredResult = await getFeaturedCourses(6);
          console.log(
            "✅ Cursos em destaque carregados:",
            featuredResult.courses.length
          );
          if (featuredResult.courses.length > 0) {
            setFeaturedCourses(featuredResult.courses.map(adaptCourse));
            hasLoadedAnyCourses = true;
          }
        } catch (featuredError) {
          console.warn(
            "⚠️ Erro ao carregar cursos em destaque:",
            featuredError.message
          );
        }

        // Se não conseguiu carregar nenhum curso específico, tentar carregar cursos gerais
        if (!hasLoadedAnyCourses) {
          console.log("🔄 Tentando fallback: carregar cursos gerais...");
          try {
            const generalResult = await getCourses({
              page: 1,
              limit: 12,
              status: "active",
            });

            if (generalResult.courses && generalResult.courses.length > 0) {
              console.log(
                "✅ Cursos gerais carregados:",
                generalResult.courses.length
              );
              const adaptedCourses = generalResult.courses.map(adaptCourse);
              setPopularCourses(adaptedCourses.slice(0, 6));
              setFeaturedCourses(adaptedCourses.slice(6, 12));
            }
          } catch (fallbackError) {
            console.error("❌ Fallback também falhou:", fallbackError.message);
          }
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
  }, [getPopularCourses, getFeaturedCourses, getCourses]);

  const handleCourseClick = (course) => {
    actions.setSelectedCourse(course);
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

        {/* Call to Action */}
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
      </div>
    </DashboardTemplate>
  );
};

export default Dashboard;
