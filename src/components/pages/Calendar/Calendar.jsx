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
import JoinClassButton from '../../molecules/JoinClassButton';
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

  // Carregar dados do calendário ao mudar o mês
  useEffect(() => {
    loadCalendarData();
  }, [currentDate]);

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
      setCalendarData(result);
    } catch (err) {
      console.error('Erro ao carregar calendário:', err);
      // Se houver erro, usar aulas do contexto como fallback
      setCalendarData({
        events: state.scheduledClasses || [],
        summary: {
          totalClasses: state.scheduledClasses?.length || 0,
          completedClasses: 0,
          upcomingClasses: state.scheduledClasses?.length || 0,
          cancelledClasses: 0
        }
      });
    }
  };

  // Usar dados reais do calendário ou aulas do contexto como fallback
  const upcomingClasses = upcomingClassesList.length > 0 
    ? upcomingClassesList 
    : (calendarData?.events || state.scheduledClasses || []);

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
    // Só seleciona se houver aula agendada nesse dia
    if (hasClassOnDate(day)) {
      setSelectedDate(day);
    } else {
      setSelectedDate(null);
    }
  };

  const getClassesForDate = (day) => {
    if (!calendarData?.events) return [];
    
    return calendarData.events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === day && 
             eventDate.getMonth() === currentDate.getMonth() &&
             eventDate.getFullYear() === currentDate.getFullYear();
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
                          {cls._id && (
                            <div className="calendar-page__upcoming-actions">
                              <JoinClassButton 
                                classId={cls._id}
                                disabled={!cls.canJoin}
                              />
                            </div>
                          )}
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
              
              const selectedClass = classes[0]; // Pega o primeiro agendamento do dia
              const eventDate = new Date(selectedClass.date);
              
              return (
                <Card className="calendar-page__summary-card" padding="medium">
                  <h3 className="calendar-page__card-title">
                    Resumo do Agendamento
                  </h3>
                  <div className="calendar-page__summary-content">
                    {selectedClass.course && (
                      <div className="calendar-page__summary-row">
                        <span>Curso:</span>
                        <span>{selectedClass.course}</span>
                      </div>
                    )}
                    {selectedClass.instructor && (
                      <div className="calendar-page__summary-row">
                        <span>Instrutor:</span>
                        <span>{typeof selectedClass.instructor === 'object' && selectedClass.instructor !== null 
                          ? (selectedClass.instructor.name || selectedClass.instructor.username || 'Instrutor')
                          : selectedClass.instructor}</span>
                      </div>
                    )}
                    {selectedClass.student && (
                      <div className="calendar-page__summary-row">
                        <span>Aluno:</span>
                        <span>{selectedClass.student}</span>
                      </div>
                    )}
                    <div className="calendar-page__summary-row">
                      <span>Data:</span>
                      <span>{eventDate.toLocaleDateString('pt-BR')}</span>
                    </div>
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
                    {selectedClass._id && (
                      <div className="calendar-page__summary-actions">
                        <JoinClassButton 
                          classId={selectedClass._id}
                          disabled={!selectedClass.canJoin}
                        />
                      </div>
                    )}
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
