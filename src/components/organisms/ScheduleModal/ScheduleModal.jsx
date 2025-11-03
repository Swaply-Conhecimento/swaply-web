import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  X, 
  Calendar, 
  Clock, 
  User,
  VideoCamera,
  CaretLeft,
  CaretRight,
  Coins,
  Check
} from '@phosphor-icons/react';
import { useApp } from '../../../contexts';
import Modal from '../../atoms/Modal';
import Button from '../../atoms/Button';
import Card from '../../molecules/Card';
import './ScheduleModal.css';

const ScheduleModal = ({ isOpen, onClose, course }) => {
  const { state, actions } = useApp();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [step, setStep] = useState(1); // 1: Selecionar Data, 2: Selecionar Horário, 3: Confirmação

  // Resetar estado quando modal abre
  useEffect(() => {
    if (isOpen) {
      setSelectedDate(null);
      setSelectedTime(null);
      setStep(1);
      setCurrentMonth(new Date());
    }
  }, [isOpen]);

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

  const handleConfirmSchedule = () => {
    if (!selectedDate || !selectedTime || !course) return;

    // Simular agendamento
    const scheduledClass = {
      id: Date.now(),
      courseId: course.id,
      courseTitle: course.title,
      instructor: course.instructor,
      date: selectedDate,
      time: selectedTime,
      duration: 1, // 1 hora
      zoomLink: `https://zoom.us/j/${Math.random().toString().substr(2, 9)}`,
      status: 'scheduled'
    };

    // Deduzir crédito
    actions.updateCredits(-1);

    // Adicionar à agenda
    actions.addScheduledClass(scheduledClass);

    // Fechar modal
    onClose();
    
    // Opcional: Mostrar notificação de sucesso
    alert(`Aula agendada com sucesso!\nData: ${selectedDate.toLocaleDateString('pt-BR')}\nHorário: ${selectedTime}\nLink do Zoom será enviado por email.`);
  };

  const handleBackStep = () => {
    if (step > 1) {
      setStep(step - 1);
      if (step === 2) {
        setSelectedTime(null);
      }
    }
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
    <div className="schedule-modal__steps">
      <div className={`schedule-modal__step ${step >= 1 ? 'schedule-modal__step--active' : ''}`}>
        <div className="schedule-modal__step-number">1</div>
        <span>Data</span>
      </div>
      <div className={`schedule-modal__step ${step >= 2 ? 'schedule-modal__step--active' : ''}`}>
        <div className="schedule-modal__step-number">2</div>
        <span>Horário</span>
      </div>
      <div className={`schedule-modal__step ${step >= 3 ? 'schedule-modal__step--active' : ''}`}>
        <div className="schedule-modal__step-number">3</div>
        <span>Confirmar</span>
      </div>
    </div>
  );

  const renderDateSelection = () => (
    <div className="schedule-modal__calendar-section">
      <div className="schedule-modal__calendar-header">
        <button 
          className="schedule-modal__nav-btn"
          onClick={handlePrevMonth}
        >
          <CaretLeft size={20} />
        </button>
        <h3 className="schedule-modal__month-year">
          {currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </h3>
        <button 
          className="schedule-modal__nav-btn"
          onClick={handleNextMonth}
        >
          <CaretRight size={20} />
        </button>
      </div>

      <div className="schedule-modal__calendar-grid">
        <div className="schedule-modal__weekdays">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
            <div key={day} className="schedule-modal__weekday">{day}</div>
          ))}
        </div>
        <div className="schedule-modal__days">
          {calendarDays.map((day, index) => (
            <button
              key={index}
              className={`schedule-modal__day ${
                !day.isCurrentMonth ? 'schedule-modal__day--other-month' : ''
              } ${
                day.isPast || !day.hasAvailableSlots ? 'schedule-modal__day--disabled' : ''
              } ${
                day.isSelected ? 'schedule-modal__day--selected' : ''
              } ${
                day.isToday ? 'schedule-modal__day--today' : ''
              }`}
              onClick={() => handleDateSelect(day)}
              disabled={day.isPast || !day.hasAvailableSlots || !day.isCurrentMonth}
            >
              {day.day}
            </button>
          ))}
        </div>
      </div>

      <div className="schedule-modal__legend">
        <div className="schedule-modal__legend-item">
          <div className="schedule-modal__legend-color schedule-modal__legend-color--available"></div>
          <span>Disponível</span>
        </div>
        <div className="schedule-modal__legend-item">
          <div className="schedule-modal__legend-color schedule-modal__legend-color--unavailable"></div>
          <span>Indisponível</span>
        </div>
      </div>
    </div>
  );

  const renderTimeSelection = () => (
    <div className="schedule-modal__time-section">
      <div className="schedule-modal__selected-date">
        <Calendar size={20} />
        <span>{formatSelectedDate()}</span>
      </div>

      <h3 className="schedule-modal__time-title">Selecione o horário:</h3>
      
      <div className="schedule-modal__time-grid">
        {availableTimes.map((time) => (
          <button
            key={time}
            className={`schedule-modal__time-slot ${
              selectedTime === time ? 'schedule-modal__time-slot--selected' : ''
            }`}
            onClick={() => handleTimeSelect(time)}
          >
            <Clock size={16} />
            {time}
          </button>
        ))}
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="schedule-modal__confirmation">
      <div className="schedule-modal__confirmation-icon">
        <Check size={48} />
      </div>
      
      <h3 className="schedule-modal__confirmation-title">Confirmar Agendamento</h3>
      
      <Card className="schedule-modal__summary" padding="large">
        <div className="schedule-modal__summary-item">
          <strong>Curso:</strong>
          <span>{course?.title}</span>
        </div>
        <div className="schedule-modal__summary-item">
          <strong>Instrutor:</strong>
          <span>{course?.instructor}</span>
        </div>
        <div className="schedule-modal__summary-item">
          <strong>Data:</strong>
          <span>{formatSelectedDate()}</span>
        </div>
        <div className="schedule-modal__summary-item">
          <strong>Horário:</strong>
          <span>{selectedTime}</span>
        </div>
        <div className="schedule-modal__summary-item">
          <strong>Duração:</strong>
          <span>1 hora</span>
        </div>
        <div className="schedule-modal__summary-item">
          <strong>Plataforma:</strong>
          <span><VideoCamera size={16} /> Zoom (link será enviado por email)</span>
        </div>
      </Card>

      <div className="schedule-modal__cost">
        <Coins size={20} weight="fill" />
        <span>Custo: 1 crédito</span>
        <div className="schedule-modal__credits">
          Seus créditos: {state.user?.credits || 0}
        </div>
      </div>
    </div>
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

  const renderFooter = () => (
    <div className="schedule-modal__footer">
      {step > 1 && (
        <Button variant="ghost" onClick={handleBackStep}>
          Voltar
        </Button>
      )}
      
      <div className="schedule-modal__footer-actions">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        
        {step === 3 && (
          <Button 
            variant="primary" 
            onClick={handleConfirmSchedule}
            disabled={(state.user?.credits || 0) < 1}
          >
            <Coins size={16} weight="fill" />
            Confirmar Agendamento
          </Button>
        )}
      </div>
    </div>
  );

  if (!course) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Agendar Aula"
      size="large"
      className="schedule-modal"
    >
      <div className="schedule-modal__content">
        {renderStepIndicator()}
        {renderContent()}
      </div>
      {renderFooter()}
    </Modal>
  );
};

ScheduleModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  course: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    instructor: PropTypes.string,
    price: PropTypes.number
  })
};

export default ScheduleModal;
