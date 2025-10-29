import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User,
  VideoCamera,
  CaretLeft,
  CaretRight,
  Coins,
  Check,
  BookOpen
} from '@phosphor-icons/react';
import { useApp } from '../../../contexts/AppContext';
import { useScheduling } from '../../../hooks/useScheduling';
import DashboardTemplate from '../../templates/DashboardTemplate';
import Card from '../../molecules/Card';
import Button from '../../atoms/Button';
import './ScheduleClass.css';

const ScheduleClass = () => {
  const { state, actions } = useApp();
  const { scheduleClass, loading, error } = useScheduling();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [step, setStep] = useState(1); // 1: Selecionar Data, 2: Selecionar Horário, 3: Confirmação

  const course = state.selectedCourse;

  // Resetar estado quando página carrega
  useEffect(() => {
    setSelectedDate(null);
    setSelectedTime(null);
    setStep(1);
    setCurrentMonth(new Date());
  }, []);

  // Dados de horários disponíveis (simulados)
  const availableTimes = [
    '08:00', '09:00', '10:00', '11:00', 
    '14:00', '15:00', '16:00', '17:00', 
    '19:00', '20:00', '21:00'
  ];

  // Gerar dias do calendário
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === month;
      const isPast = date < today;
      const isToday = date.getTime() === today.getTime();
      const isSelected = selectedDate && date.getTime() === selectedDate.getTime();
      
      // Simular alguns dias com horários disponíveis
      const hasAvailableSlots = isCurrentMonth && !isPast && 
        (date.getDay() !== 0 && date.getDay() !== 6); // Não domingos e sábados

      days.push({
        date,
        day: date.getDate(),
        isCurrentMonth,
        isPast,
        isToday,
        isSelected,
        hasAvailableSlots
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateSelect = (day) => {
    if (day.isPast || !day.hasAvailableSlots || !day.isCurrentMonth) return;
    setSelectedDate(day.date);
    setStep(2);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setStep(3);
  };

  const handleConfirmSchedule = async () => {
    if (!selectedDate || !selectedTime || !course) return;

    try {
      // Formatar data para o formato esperado pela API (YYYY-MM-DD)
      const formattedDate = selectedDate.toISOString().split('T')[0];

      // Chamar API real para agendar aula
      const result = await scheduleClass({
        courseId: course._id || course.id,
        date: formattedDate,
        time: selectedTime,
        duration: 1,
      });

      // Adicionar aula agendada ao estado
      actions.addScheduledClass(result.class);

      // Recarregar perfil do usuário para atualizar créditos
      await actions.refreshUser();

      // Voltar ao dashboard
      actions.setCurrentPage('dashboard');
      
      // Mostrar notificação de sucesso
      alert(`Aula agendada com sucesso!\nData: ${selectedDate.toLocaleDateString('pt-BR')}\nHorário: ${selectedTime}\n\nUm email de confirmação será enviado em breve.`);
    } catch (err) {
      // Tratar erro
      console.error('Erro ao agendar aula:', err);
      alert(`Erro ao agendar aula: ${err.message || 'Tente novamente mais tarde.'}`);
    }
  };

  const handleBackStep = () => {
    if (step > 1) {
      setStep(step - 1);
      if (step === 2) {
        setSelectedTime(null);
      }
    }
  };

  const handleGoBack = () => {
    actions.setCurrentPage('course-details');
  };

  const formatSelectedDate = () => {
    if (!selectedDate) return '';
    return selectedDate.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const renderStepIndicator = () => (
    <div className="schedule-class__steps">
      <div className={`schedule-class__step ${step >= 1 ? 'schedule-class__step--active' : ''}`}>
        <div className="schedule-class__step-number">1</div>
        <span>Selecionar Data</span>
      </div>
      <div className={`schedule-class__step ${step >= 2 ? 'schedule-class__step--active' : ''}`}>
        <div className="schedule-class__step-number">2</div>
        <span>Escolher Horário</span>
      </div>
      <div className={`schedule-class__step ${step >= 3 ? 'schedule-class__step--active' : ''}`}>
        <div className="schedule-class__step-number">3</div>
        <span>Confirmar</span>
      </div>
    </div>
  );

  const renderDateSelection = () => (
    <Card className="schedule-class__card" padding="large">
      <h2 className="schedule-class__card-title">
        <Calendar size={24} />
        Selecione a data da sua aula
      </h2>
      
      <div className="schedule-class__calendar">
        <div className="schedule-class__calendar-header">
          <button 
            className="schedule-class__nav-btn"
            onClick={handlePrevMonth}
          >
            <CaretLeft size={20} />
          </button>
          <h3 className="schedule-class__month-year">
            {currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </h3>
          <button 
            className="schedule-class__nav-btn"
            onClick={handleNextMonth}
          >
            <CaretRight size={20} />
          </button>
        </div>

        <div className="schedule-class__calendar-grid">
          <div className="schedule-class__weekdays">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
              <div key={day} className="schedule-class__weekday">{day}</div>
            ))}
          </div>
          <div className="schedule-class__days">
            {calendarDays.map((day, index) => (
              <button
                key={index}
                className={`schedule-class__day ${
                  !day.isCurrentMonth ? 'schedule-class__day--other-month' : ''
                } ${
                  day.isPast || !day.hasAvailableSlots ? 'schedule-class__day--disabled' : ''
                } ${
                  day.isSelected ? 'schedule-class__day--selected' : ''
                } ${
                  day.isToday ? 'schedule-class__day--today' : ''
                }`}
                onClick={() => handleDateSelect(day)}
                disabled={day.isPast || !day.hasAvailableSlots || !day.isCurrentMonth}
              >
                {day.day}
              </button>
            ))}
          </div>
        </div>

        <div className="schedule-class__legend">
          <div className="schedule-class__legend-item">
            <div className="schedule-class__legend-color schedule-class__legend-color--available"></div>
            <span>Disponível</span>
          </div>
          <div className="schedule-class__legend-item">
            <div className="schedule-class__legend-color schedule-class__legend-color--unavailable"></div>
            <span>Indisponível</span>
          </div>
        </div>
      </div>
    </Card>
  );

  const renderTimeSelection = () => (
    <Card className="schedule-class__card" padding="large">
      <h2 className="schedule-class__card-title">
        <Clock size={24} />
        Escolha o horário
      </h2>
      
      <div className="schedule-class__selected-date">
        <Calendar size={20} />
        <span>{formatSelectedDate()}</span>
      </div>

      <div className="schedule-class__time-grid">
        {availableTimes.map((time) => (
          <button
            key={time}
            className={`schedule-class__time-slot ${
              selectedTime === time ? 'schedule-class__time-slot--selected' : ''
            }`}
            onClick={() => handleTimeSelect(time)}
          >
            <Clock size={16} />
            {time}
          </button>
        ))}
      </div>

      <div className="schedule-class__actions">
        <Button variant="ghost" onClick={handleBackStep}>
          <ArrowLeft size={16} />
          Voltar
        </Button>
      </div>
    </Card>
  );

  const renderConfirmation = () => (
    <Card className="schedule-class__card" padding="large">
      <div className="schedule-class__confirmation">
        <div className="schedule-class__confirmation-icon">
          <Check size={48} />
        </div>
        
        <h2 className="schedule-class__card-title">Confirmar Agendamento</h2>
        
        <div className="schedule-class__summary">
          <div className="schedule-class__summary-item">
            <BookOpen size={20} />
            <div>
              <strong>Curso:</strong>
              <span>{course?.title}</span>
            </div>
          </div>
          <div className="schedule-class__summary-item">
            <User size={20} />
            <div>
              <strong>Instrutor:</strong>
              <span>{course?.instructor}</span>
            </div>
          </div>
          <div className="schedule-class__summary-item">
            <Calendar size={20} />
            <div>
              <strong>Data:</strong>
              <span>{formatSelectedDate()}</span>
            </div>
          </div>
          <div className="schedule-class__summary-item">
            <Clock size={20} />
            <div>
              <strong>Horário:</strong>
              <span>{selectedTime}</span>
            </div>
          </div>
          <div className="schedule-class__summary-item">
            <VideoCamera size={20} />
            <div>
              <strong>Plataforma:</strong>
              <span>Zoom (link será enviado por email)</span>
            </div>
          </div>
        </div>

        <div className="schedule-class__cost">
          <Coins size={24} weight="fill" />
          <div>
            <div className="schedule-class__cost-amount">1 crédito</div>
            <div className="schedule-class__cost-balance">Seus créditos: {state.user?.credits || 0}</div>
          </div>
        </div>

        <div className="schedule-class__actions">
          <Button variant="ghost" onClick={handleBackStep}>
            <ArrowLeft size={16} />
            Voltar
          </Button>
          <Button 
            variant="primary" 
            size="large"
            onClick={handleConfirmSchedule}
            disabled={(state.user?.credits || 0) < 1 || loading}
          >
            <Coins size={16} weight="fill" />
            {loading ? 'Agendando...' : 'Confirmar Agendamento'}
          </Button>
        </div>
      </div>
    </Card>
  );

  const renderContent = () => {
    switch (step) {
      case 1:
        return renderDateSelection();
      case 2:
        return renderTimeSelection();
      case 3:
        return renderConfirmation();
      default:
        return renderDateSelection();
    }
  };

  if (!course) {
    return (
      <DashboardTemplate>
        <div className="schedule-class">
          <div className="schedule-class__header">
            <Button variant="ghost" onClick={handleGoBack}>
              <ArrowLeft size={20} />
              Voltar
            </Button>
            <h1>Curso não encontrado</h1>
          </div>
        </div>
      </DashboardTemplate>
    );
  }

  return (
    <DashboardTemplate>
      <div className="schedule-class">
        {/* Header */}
        <div className="schedule-class__header">
          <Button variant="ghost" onClick={handleGoBack} className="schedule-class__back">
            <ArrowLeft size={20} />
            Voltar aos Detalhes
          </Button>
          
          <div className="schedule-class__header-content">
            <h1 className="schedule-class__title">Agendar Aula</h1>
            <p className="schedule-class__subtitle">
              {course.title} - {course.instructor}
            </p>
          </div>
        </div>

        {/* Steps Indicator */}
        {renderStepIndicator()}

        {/* Content */}
        <div className="schedule-class__content">
          {renderContent()}
        </div>
      </div>
    </DashboardTemplate>
  );
};

export default ScheduleClass;
