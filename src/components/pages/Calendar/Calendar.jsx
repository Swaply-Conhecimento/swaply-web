import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  CaretLeft, 
  CaretRight,
  Clock,
  User,
  BookOpen,
  Star,
  Users
} from '@phosphor-icons/react';
import { useApp } from '../../../contexts';
import { useScheduling } from '../../../hooks/useScheduling';
import { useClasses } from '../../../hooks';
import DashboardTemplate from '../../templates/DashboardTemplate';
import Card from '../../molecules/Card';
import Button from '../../atoms/Button';
import Toggle from '../../atoms/Toggle';
import './Calendar.css';

const Calendar = () => {
  const { state } = useApp();
  const { getUserCalendar, loading } = useScheduling();
  const { getUpcomingClasses } = useClasses();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('student'); // 'student' ou 'instructor'
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarData, setCalendarData] = useState(null);
  const [upcomingClassesList, setUpcomingClassesList] = useState([]);
  const [loadingUpcoming, setLoadingUpcoming] = useState(false);

  // Carregar dados do calendário ao mudar o mês ou viewMode
  useEffect(() => {
    loadCalendarData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate, viewMode, state.user?._id]);

  const loadUpcomingClasses = async () => {
    setLoadingUpcoming(true);
    try {
      const result = await getUpcomingClasses(5);
      if (result.success) {
        setUpcomingClassesList(result.classes || []);
      }
    } catch (err) {
      console.error('Erro ao carregar próximas aulas:', err);
      setUpcomingClassesList([]);
    } finally {
      setLoadingUpcoming(false);
    }
  };

  // Carregar próximas aulas
  useEffect(() => {
    if (viewMode === 'instructor' || viewMode === 'student') {
      loadUpcomingClasses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode]);

  const loadCalendarData = async () => {
    try {
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      
      const result = await getUserCalendar(month, year, 'month');
      
      // Filtrar aulas baseado no viewMode (aluno vs instrutor)
      if (result && result.events && state.user?._id) {
        const filteredEvents = result.events.filter(event => {
          if (viewMode === 'instructor') {
            // Mostrar apenas aulas onde o usuário é o instrutor
            const instructorId = event.instructorId?._id || event.instructorId || event.instructor?._id || event.instructor;
            return instructorId === state.user._id || instructorId === state.user.id;
          } else {
            // Mostrar apenas aulas onde o usuário é o aluno
            const studentId = event.studentId?._id || event.studentId || event.student?._id || event.student;
            return studentId === state.user._id || studentId === state.user.id;
          }
        });
        
        setCalendarData({
          ...result,
          events: filteredEvents
        });
      } else {
        setCalendarData(result);
      }
    } catch (err) {
      console.error('Erro ao carregar calendário:', err);
      // Se houver erro, usar aulas do contexto como fallback
      const fallbackEvents = (state.scheduledClasses || []).filter(event => {
        if (!state.user?._id) return true;
        if (viewMode === 'instructor') {
          const instructorId = event.instructorId?._id || event.instructorId || event.instructor?._id || event.instructor;
          return instructorId === state.user._id || instructorId === state.user.id;
        } else {
          const studentId = event.studentId?._id || event.studentId || event.student?._id || event.student;
          return studentId === state.user._id || studentId === state.user.id;
        }
      });
      
      setCalendarData({
        events: fallbackEvents,
        summary: {
          totalClasses: fallbackEvents.length,
          completedClasses: 0,
          upcomingClasses: fallbackEvents.length,
          cancelledClasses: 0
        }
      });
    }
  };

  // Usar dados reais do calendário ou aulas do contexto como fallback
  // Filtrar baseado no viewMode
  const allUpcomingClasses = upcomingClassesList.length > 0 
    ? upcomingClassesList 
    : (calendarData?.events || state.scheduledClasses || []);
  
  // Filtrar aulas baseado no viewMode
  const upcomingClasses = allUpcomingClasses.filter(cls => {
    if (!state.user?._id) return true;
    
    if (viewMode === 'instructor') {
      const instructorId = cls.instructorId?._id || cls.instructorId || cls.instructor?._id || cls.instructor;
      return instructorId === state.user._id || instructorId === state.user.id;
    } else {
      const studentId = cls.studentId?._id || cls.studentId || cls.student?._id || cls.student;
      return studentId === state.user._id || studentId === state.user.id;
    }
  });

  // Horários disponíveis serão carregados da API quando necessário
  const availableSlots = [];

  // Calendar logic
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day) => {
    const classes = getClassesForDate(day);
    // Seleciona o dia se houver aulas, ou deseleciona se já estava selecionado
    if (classes.length > 0) {
      setSelectedDate(day);
    } else if (selectedDate === day) {
      setSelectedDate(null);
    }
  };

  const getClassesForDate = (day) => {
    if (!calendarData?.events || !Array.isArray(calendarData.events)) return [];
    
    return calendarData.events.filter(event => {
      if (!event.date) return false;
      
      // Normalizar a data do evento
      const eventDate = new Date(event.date);
      if (isNaN(eventDate.getTime())) return false;
      
      // Criar data de referência para o dia selecionado
      const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      
      // Comparar apenas dia, mês e ano (ignorar hora)
      return eventDate.getDate() === targetDate.getDate() && 
             eventDate.getMonth() === targetDate.getMonth() &&
             eventDate.getFullYear() === targetDate.getFullYear();
    });
  };

  const hasClassOnDate = (day) => {
    return getClassesForDate(day).length > 0;
  };

  const renderCalendarDays = () => {
    const days = [];
    const today = new Date();
    const isCurrentMonth = today.getMonth() === currentDate.getMonth() && 
                          today.getFullYear() === currentDate.getFullYear();
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-before-${i}`} className="calendar__day calendar__day--empty"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const hasClass = hasClassOnDate(day);
      const isSelected = selectedDate === day;
      const isToday = isCurrentMonth && day === today.getDate();
      
      days.push(
        <button
          key={day}
          className={`calendar__day ${hasClass ? 'calendar__day--has-class' : ''} ${isSelected ? 'calendar__day--selected' : ''} ${isToday ? 'calendar__day--today' : ''}`}
          onClick={() => handleDateClick(day)}
        >
          {day}
        </button>
      );
    }
    
    // Empty cells for days after the last day of the month
    // Calcular quantos dias faltam para completar a grade (42 células = 6 semanas)
    const totalCells = 42; // 7 dias × 6 semanas
    const filledCells = firstDayOfMonth + daysInMonth;
    const emptyAfter = totalCells - filledCells;
    
    for (let i = 0; i < emptyAfter; i++) {
      days.push(<div key={`empty-after-${i}`} className="calendar__day calendar__day--empty"></div>);
    }
    
    return days;
  };

  return (
    <DashboardTemplate>
      <div className="calendar-page">
        {/* Header */}
        <div className="calendar-page__header">
          <div className="calendar-page__header-content">
            <div className="calendar-page__header-info">
              <h1 className="calendar-page__title">
                <CalendarIcon size={32} />
                Minha Agenda
              </h1>
              <p className="calendar-page__subtitle">
                {viewMode === 'instructor' 
                  ? 'Configure seus horários como instrutor' 
                  : 'Visualize suas aulas agendadas'}
              </p>
            </div>
            
            <div className="calendar-page__mode-toggle">
              <div className="calendar-page__toggle-label">Aluno</div>
              <Toggle
                checked={viewMode === 'instructor'}
                onChange={(checked) => setViewMode(checked ? 'instructor' : 'student')}
                size="medium"
              />
              <div className="calendar-page__toggle-label">Instrutor</div>
            </div>
          </div>
        </div>

        <div className="calendar-page__content">
          {/* Calendar */}
          <Card className="calendar-page__calendar-card" padding="large">
            {/* Calendar Header */}
            <div className="calendar__header">
            <button className="calendar__nav-btn" onClick={handlePrevMonth}>
              <CaretLeft size={20} />
            </button>
              <h2 className="calendar__month-year">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
            <button className="calendar__nav-btn" onClick={handleNextMonth}>
              <CaretRight size={20} />
            </button>
            </div>

            {/* Calendar Grid */}
            <div className="calendar__grid">
              {/* Day Headers */}
              {dayNames.map(day => (
                <div key={day} className="calendar__day-header">
                  {day}
                </div>
              ))}
              
              {/* Calendar Days */}
              {renderCalendarDays()}
            </div>

            {/* Legend */}
            <div className="calendar__legend">
              <div className="calendar__legend-item">
                <div className="calendar__legend-dot calendar__legend-dot--available"></div>
                <span>Horário Livre</span>
              </div>
              <div className="calendar__legend-item">
                <div className="calendar__legend-dot calendar__legend-dot--scheduled"></div>
                <span>Aulas Agendadas</span>
              </div>
            </div>
          </Card>

          {/* Side Panel */}
          <div className="calendar-page__side-panel">
            {/* Available Hours - Só mostra para instrutor */}
            {viewMode === 'instructor' && (
              <Card className="calendar-page__hours-card" padding="medium">
                <h3 className="calendar-page__card-title">
                  <Clock size={20} />
                  Horários Disponíveis
                </h3>
                {availableSlots.length > 0 ? (
                  <>
                    <div className="calendar-page__time-slots">
                      {availableSlots.map(time => (
                        <button key={time} className="calendar-page__time-slot">
                          {time}
                        </button>
                      ))}
                    </div>
                    <Button variant="primary" size="small" fullWidth>
                      Salvar Horários
                    </Button>
                  </>
                ) : (
                  <p style={{ color: 'var(--color-neutral-600)', fontSize: 'var(--font-size-sm)' }}>
                    Nenhum horário disponível configurado
                  </p>
                )}
              </Card>
            )}

            {/* Upcoming Classes */}
            <Card className="calendar-page__upcoming-card" padding="medium">
              <h3 className="calendar-page__card-title">
                <BookOpen size={20} />
                Próximas Aulas
              </h3>
              <div className="calendar-page__upcoming-list">
                {upcomingClasses.length > 0 ? (
                  upcomingClasses.slice(0, 5).map((cls, index) => {
                    const eventDate = cls.date ? new Date(cls.date) : null;
                    const courseTitle = cls.courseId?.title || cls.course?.title || cls.courseTitle || cls.title || 'Aula';
                    const instructorName = cls.instructorId?.name || cls.instructor?.name || cls.instructorName || '';
                    const studentName = cls.studentId?.name || cls.student?.name || cls.studentName || '';
                    
                    return (
                      <div key={cls._id || cls.id || index} className="calendar-page__upcoming-item">
                        <div className="calendar-page__upcoming-info">
                          <div className="calendar-page__upcoming-course">{courseTitle}</div>
                          <div className="calendar-page__upcoming-meta">
                            {viewMode === 'student' && instructorName && (
                              <span>Prof. {instructorName}</span>
                            )}
                            {viewMode === 'instructor' && studentName && (
                              <span>Aluno: {studentName}</span>
                            )}
                          </div>
                          <div className="calendar-page__upcoming-time">
                            {eventDate ? eventDate.toLocaleDateString('pt-BR') : 'Data não definida'}
                            {cls.time && ` às ${cls.time}`}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p style={{ color: 'var(--color-neutral-600)', fontSize: 'var(--font-size-sm)', textAlign: 'center', padding: 'var(--spacing-4)' }}>
                    Nenhuma aula agendada
                  </p>
                )}
              </div>
            </Card>

            {/* Schedule Summary - Só aparece quando há agendamento selecionado */}
            {selectedDate && (() => {
              const classes = getClassesForDate(selectedDate);
              if (classes.length === 0) return null;
              
              return (
                <Card className="calendar-page__summary-card" padding="medium">
                  <h3 className="calendar-page__card-title">
                    Aulas do Dia {selectedDate}
                  </h3>
                  <div className="calendar-page__summary-content">
                    {classes.map((selectedClass, index) => {
                      const eventDate = selectedClass.date ? new Date(selectedClass.date) : null;
                      const courseTitle = selectedClass.courseId?.title || selectedClass.course?.title || selectedClass.courseTitle || selectedClass.course || 'Aula';
                      const instructorName = selectedClass.instructorId?.name || selectedClass.instructor?.name || selectedClass.instructorName || (typeof selectedClass.instructor === 'string' ? selectedClass.instructor : '');
                      const studentName = selectedClass.studentId?.name || selectedClass.student?.name || selectedClass.studentName || (typeof selectedClass.student === 'string' ? selectedClass.student : '');
                      
                      return (
                        <div key={selectedClass._id || selectedClass.id || index} className="calendar-page__summary-item" style={{ marginBottom: index < classes.length - 1 ? 'var(--spacing-4)' : 0, paddingBottom: index < classes.length - 1 ? 'var(--spacing-4)' : 0, borderBottom: index < classes.length - 1 ? '1px solid var(--color-neutral-200)' : 'none' }}>
                          <div className="calendar-page__summary-row">
                            <span>Curso:</span>
                            <span>{courseTitle}</span>
                          </div>
                          {viewMode === 'student' && instructorName && (
                            <div className="calendar-page__summary-row">
                              <span>Instrutor:</span>
                              <span>{instructorName}</span>
                            </div>
                          )}
                          {viewMode === 'instructor' && studentName && (
                            <div className="calendar-page__summary-row">
                              <span>Aluno:</span>
                              <span>{studentName}</span>
                            </div>
                          )}
                          {eventDate && (
                            <div className="calendar-page__summary-row">
                              <span>Data:</span>
                              <span>{eventDate.toLocaleDateString('pt-BR')}</span>
                            </div>
                          )}
                          {selectedClass.time && (
                            <div className="calendar-page__summary-row">
                              <span>Horário:</span>
                              <span>{selectedClass.time}</span>
                            </div>
                          )}
                          {selectedClass.duration && (
                            <div className="calendar-page__summary-row">
                              <span>Duração:</span>
                              <span>{selectedClass.duration}h</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </Card>
              );
            })()}
          </div>
        </div>
      </div>
    </DashboardTemplate>
  );
};

export default Calendar;
