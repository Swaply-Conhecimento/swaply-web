import React, { useState } from 'react';
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
import { useApp } from '../../../contexts/AppContext';
import DashboardTemplate from '../../templates/DashboardTemplate';
import Card from '../../molecules/Card';
import Button from '../../atoms/Button';
import Toggle from '../../atoms/Toggle';
import './Calendar.css';

const Calendar = () => {
  const { state } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 1)); // Janeiro 2024
  const [viewMode, setViewMode] = useState('student'); // 'student' ou 'instructor'
  const [selectedDate, setSelectedDate] = useState(null);

  // Mock data para agendamentos
  const mockScheduledClasses = {
    student: [
      { date: 15, course: 'Matemática', instructor: 'Prof. João Silva', time: '09:00', status: 'confirmed' },
      { date: 16, course: 'Física', instructor: 'Prof. Maria Santos', time: '14:00', status: 'confirmed' },
      { date: 18, course: 'Matemática', instructor: 'Prof. João Silva', time: '09:00', status: 'confirmed' },
      { date: 22, course: 'Física', instructor: 'Prof. Maria Santos', time: '14:00', status: 'confirmed' },
      { date: 23, course: 'Matemática', instructor: 'Prof. João Silva', time: '09:00', status: 'confirmed' },
      { date: 25, course: 'Física', instructor: 'Prof. Maria Santos', time: '14:00', status: 'confirmed' },
    ],
    instructor: [
      { date: 17, course: 'RPG Iniciante', student: 'Ana Silva', time: '19:00', status: 'confirmed' },
      { date: 18, course: 'Jardinagem', student: 'Carlos Santos', time: '15:00', status: 'confirmed' },
      { date: 24, course: 'RPG Iniciante', student: 'Maria Costa', time: '19:00', status: 'confirmed' },
      { date: 26, course: 'Jardinagem', student: 'Pedro Lima', time: '15:00', status: 'confirmed' },
      { date: 31, course: 'RPG Iniciante', student: 'Julia Oliveira', time: '19:00', status: 'confirmed' },
    ]
  };

  // Mock data - próximas aulas
  const mockClasses = [
    { date: '17/01/2024', course: 'Matemática', instructor: 'Prof. João Silva', time: '09:00', type: 'student' },
    { date: '24/01/2024', course: 'Física', instructor: 'Prof. Maria Santos', time: '14:00', type: 'student' },
    { date: '26/01/2024', course: 'Jardinagem', student: 'Pedro Lima', time: '15:00', type: 'instructor' },
    { date: '30/01/2024', course: 'RPG Iniciante', student: 'Julia Oliveira', time: '19:00', type: 'instructor' },
    { date: '16/02/2024', course: 'Matemática', instructor: 'Prof. João Silva', time: '09:00', type: 'student' },
  ];

  // Converter aulas agendadas do contexto para formato do calendário
  const scheduledClasses = state.scheduledClasses.map(scheduledClass => ({
    date: scheduledClass.date.toLocaleDateString('pt-BR'),
    course: scheduledClass.courseTitle,
    instructor: scheduledClass.instructor,
    time: scheduledClass.time,
    type: 'student',
    zoomLink: scheduledClass.zoomLink,
    status: scheduledClass.status
  }));

  // Combinar todas as aulas
  const upcomingClasses = [...mockClasses, ...scheduledClasses];

  const availableSlots = [
    '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'
  ];

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
    setSelectedDate(day);
  };

  const getClassesForDate = (day) => {
    return mockScheduledClasses[viewMode].filter(cls => cls.date === day);
  };

  const hasClassOnDate = (day) => {
    return getClassesForDate(day).length > 0;
  };

  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar__day calendar__day--empty"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const hasClass = hasClassOnDate(day);
      const isSelected = selectedDate === day;
      
      days.push(
        <button
          key={day}
          className={`calendar__day ${hasClass ? 'calendar__day--has-class' : ''} ${isSelected ? 'calendar__day--selected' : ''}`}
          onClick={() => handleDateClick(day)}
        >
          {day}
        </button>
      );
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
                Configure seus horários como instrutor
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
            {/* Available Hours */}
            <Card className="calendar-page__hours-card" padding="medium">
              <h3 className="calendar-page__card-title">
                <Clock size={20} />
                Horários Disponíveis
              </h3>
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
            </Card>

            {/* Upcoming Classes */}
            <Card className="calendar-page__upcoming-card" padding="medium">
              <h3 className="calendar-page__card-title">
                <BookOpen size={20} />
                Próximas Aulas
              </h3>
              <div className="calendar-page__upcoming-list">
                {upcomingClasses.slice(0, 5).map((cls, index) => (
                  <div key={index} className="calendar-page__upcoming-item">
                    <div className="calendar-page__upcoming-info">
                      <div className="calendar-page__upcoming-course">{cls.course}</div>
                      <div className="calendar-page__upcoming-meta">
                        {cls.type === 'student' ? (
                          <span>Prof. {cls.instructor}</span>
                        ) : (
                          <span>Aluno: {cls.student}</span>
                        )}
                      </div>
                      <div className="calendar-page__upcoming-time">
                        {cls.date} às {cls.time}
                      </div>
                      {cls.zoomLink && (
                        <button 
                          className="calendar-page__zoom-btn"
                          onClick={() => window.open(cls.zoomLink, '_blank')}
                        >
                          🎥 Entrar na Aula
                        </button>
                      )}
                    </div>
                    <Button variant="ghost" size="small">
                      confirmar
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Schedule Summary */}
            {selectedDate && (
              <Card className="calendar-page__summary-card" padding="medium">
                <h3 className="calendar-page__card-title">
                  Resumo do Agendamento
                </h3>
                <div className="calendar-page__summary-content">
                  <div className="calendar-page__summary-row">
                    <span>Instrutor:</span>
                    <span>Prof. João Silva</span>
                  </div>
                  <div className="calendar-page__summary-row">
                    <span>Matéria:</span>
                    <span>Matemática</span>
                  </div>
                  <div className="calendar-page__summary-row">
                    <span>Data:</span>
                    <span>25/01/2024</span>
                  </div>
                  <div className="calendar-page__summary-row">
                    <span>Horário:</span>
                    <span>09:00</span>
                  </div>
                  <div className="calendar-page__summary-row">
                    <span>Valor:</span>
                    <span>1 crédito</span>
                  </div>
                </div>
                <Button variant="primary" size="medium" fullWidth>
                  Confirmar Agendamento
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardTemplate>
  );
};

export default Calendar;
