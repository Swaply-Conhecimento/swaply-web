import React from 'react';
import PropTypes from 'prop-types';
import CourseCard from '../../molecules/CourseCard';
import './CourseGrid.css';

const CourseGrid = ({
  courses = [],
  loading = false,
  title = 'Cursos mais acessados',
  showAll = false,
  onCourseClick,
  onShowAllClick,
  className = '',
  ...props
}) => {
  const displayedCourses = showAll ? courses : courses.slice(0, 6);

  if (loading) {
    return (
      <section className={`course-grid ${className}`} {...props}>
        <div className="course-grid__header">
          <h2 className="course-grid__title">{title}</h2>
        </div>
        <div className="course-grid__container">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="course-grid__item">
              <CourseCard
                title="Carregando..."
                instructor="Carregando..."
                className="course-card--loading"
              />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!courses.length) {
    return (
      <section className={`course-grid ${className}`} {...props}>
        <div className="course-grid__header">
          <h2 className="course-grid__title">{title}</h2>
        </div>
        <div className="course-grid__empty">
          <div className="course-grid__empty-icon">📚</div>
          <h3 className="course-grid__empty-title">Nenhum curso encontrado</h3>
          <p className="course-grid__empty-text">
            Não há cursos disponíveis no momento. Tente novamente mais tarde.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className={`course-grid ${className}`} {...props}>
      <div className="course-grid__header">
        <h2 className="course-grid__title">{title}</h2>
        {courses.length > 6 && !showAll && (
          <button
            className="course-grid__show-all"
            onClick={onShowAllClick}
          >
            Ver Mais
          </button>
        )}
      </div>

      <div className="course-grid__container">
        {displayedCourses.map((course, index) => (
          <div key={course.id || index} className="course-grid__item">
            <CourseCard
              id={course.id}
              title={course.title}
              instructor={course.instructor}
              category={course.category}
              rating={course.rating}
              students={course.students}
              price={course.price}
              image={course.image}
              onClick={() => onCourseClick && onCourseClick(course)}
            />
          </div>
        ))}
      </div>

      {showAll && courses.length > displayedCourses.length && (
        <div className="course-grid__load-more">
          <button
            className="course-grid__load-more-btn"
            onClick={() => console.log('Load more courses')}
          >
            Carregar Mais Cursos
          </button>
        </div>
      )}
    </section>
  );
};

CourseGrid.propTypes = {
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      title: PropTypes.string.isRequired,
      instructor: PropTypes.string.isRequired,
      category: PropTypes.string,
      rating: PropTypes.number,
      students: PropTypes.number,
      price: PropTypes.number,
      image: PropTypes.string,
    })
  ),
  loading: PropTypes.bool,
  title: PropTypes.string,
  showAll: PropTypes.bool,
  onCourseClick: PropTypes.func,
  onShowAllClick: PropTypes.func,
  className: PropTypes.string,
};

export default CourseGrid;
