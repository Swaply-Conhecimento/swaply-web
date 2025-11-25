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
import { useScheduling } from '../../../hooks/useScheduling';
import { useAvailability } from '../../../hooks';
import Modal from '../../atoms/Modal';
import Button from '../../atoms/Button';
import Card from '../../molecules/Card';
import './ScheduleModal.css';

const ScheduleModal = ({ isOpen, onClose, course }) => {
  const { state, actions } = useApp();
  const { scheduleClass, loading } = useScheduling();
  const { getCourseAvailabilitySlots, getAvailableSlots } = useAvailability();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [step, setStep] = useState(1); // 1: Selecionar Data, 2: Selecionar Horário, 3: Confirmação
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [monthSlots, setMonthSlots] = useState({}); // Slots agrupados por data do mês atual

  // Resetar estado quando modal abre
  useEffect(() => {
    if (isOpen) {
      setSelectedDate(null);
      setSelectedTime(null);
      setStep(1);
      setCurrentMonth(new Date());
      setAvailableSlots([]);
      setMonthSlots({});
    }
  }, [isOpen]);

  // Carregar disponibilidade do mês quando o mês muda ou o curso muda
  useEffect(() => {
    if (isOpen && course && currentMonth) {
      loadMonthAvailability();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMonth, course, isOpen]);

  // Carregar disponibilidade quando uma data é selecionada
  useEffect(() => {
    if (selectedDate && course) {
      loadAvailability();
    }
  }, [selectedDate, course]);

  // Carregar disponibilidade do mês inteiro
  const loadMonthAvailability = async () => {
    if (!course || !currentMonth) return;

    try {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      
      const startDate = firstDay.toISOString().split('T')[0];
      const endDate = lastDay.toISOString().split('T')[0];

      // Tentar primeiro com a rota pública (recomendada para estudantes)
      // Se o curso tiver instructorId, usar getAvailableSlots
      const instructorId = course.instructor?._id || course.instructor?.id || course.instructorId;
      
      let result;
      if (instructorId) {
        // Usar rota pública GET /api/availability/slots (recomendada)
        result = await getAvailableSlots({
          instructorId: instructorId,
          courseId: course._id || course.id,
          startDate,
          endDate
        });
      } else {
        // Fallback: usar rota específica do curso
        result = await getCourseAvailabilitySlots(
          course._id || course.id,
          startDate,
          endDate
        );
      }

      if (result.success && result.slots) {
        // Agrupar slots por data
        const slotsByDate = {};
        result.slots.forEach(slot => {
          const dateStr = slot.date;
          if (!slotsByDate[dateStr]) {
            slotsByDate[dateStr] = [];
          }
          slotsByDate[dateStr].push(slot);
        });
        
        setMonthSlots(slotsByDate);
      } else {
        setMonthSlots({});
      }
    } catch (err) {
      console.error('Erro ao carregar disponibilidade do mês:', err);
      setMonthSlots({});
    }
  };

  const loadAvailability = async () => {
    if (!course || !selectedDate) return;

    setLoadingAvailability(true);
    try {
      const selectedDateStr = selectedDate.toISOString().split('T')[0];
      
      // Usar os slots já carregados do mês, se disponíveis
      if (monthSlots[selectedDateStr]) {
        const times = monthSlots[selectedDateStr]
          .map(slot => slot.time)
          .filter((time, index, self) => self.indexOf(time) === index) // Remover duplicatas
          .sort();
        
        setAvailableSlots(times);
        setLoadingAvailability(false);
        return;
      }

      // Se não estiver no cache, buscar apenas para esta data
      const startDate = new Date(selectedDate);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(selectedDate);
      endDate.setHours(23, 59, 59, 999);

      // Tentar primeiro com a rota pública (recomendada para estudantes)
      const instructorId = course.instructor?._id || course.instructor?.id || course.instructorId;
      
      let result;
      if (instructorId) {
        // Usar rota pública GET /api/availability/slots (recomendada)
        result = await getAvailableSlots({
          instructorId: instructorId,
          courseId: course._id || course.id,
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0]
        });
      } else {
        // Fallback: usar rota específica do curso
        result = await getCourseAvailabilitySlots(
          course._id || course.id,
          startDate.toISOString().split('T')[0],
          endDate.toISOString().split('T')[0]
        );
      }

      if (result.success && result.slots) {
        // Filtrar slots para a data selecionada e extrair horários
        const slotsForDate = result.slots.filter(slot => slot.date === selectedDateStr);
        const times = slotsForDate
          .map(slot => slot.time)
          .filter((time, index, self) => self.indexOf(time) === index) // Remover duplicatas
          .sort();
        
        setAvailableSlots(times);
      } else {
        setAvailableSlots([]);
      }
    } catch (err) {
      console.error('Erro ao carregar disponibilidade:', err);
      setAvailableSlots([]);
    } finally {
      setLoadingAvailability(false);
    }
  };

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
      
      // Verificar se há slots disponíveis reais para esta data
      const dateStr = date.toISOString().split('T')[0];
      const hasAvailableSlots = isCurrentMonth && !isPast && monthSlots[dateStr] && monthSlots[dateStr].length > 0;

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

      if (result.success) {
        // Adicionar aula agendada ao estado
        actions.addScheduledClass(result.class || result.data);
        
        // Recarregar perfil do usuário para atualizar créditos
        await actions.refreshUser();
        
        // Fechar modal
        onClose();
        
        // Mostrar notificação de sucesso
        actions.showNotification({
          type: 'success',
          message: `Aula agendada com sucesso! Data: ${selectedDate.toLocaleDateString('pt-BR')} às ${selectedTime}`
        });
      } else {
        actions.showNotification({
          type: 'error',
          message: result.error || 'Erro ao agendar aula'
        });
      }
    } catch (err) {
      console.error('Erro ao agendar aula:', err);
      actions.showNotification({
        type: 'error',
        message: err.message || 'Erro ao agendar aula. Tente novamente.'
      });
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
        {loadingAvailability ? (
          <div className="schedule-modal__loading">
            <p>Carregando horários disponíveis...</p>
          </div>
        ) : availableSlots.length === 0 ? (
          <div className="schedule-modal__no-slots">
            <p>Nenhum horário disponível para esta data.</p>
            <Button variant="outline" onClick={() => setStep(1)}>
              Escolher outra data
            </Button>
          </div>
        ) : (
          availableSlots.map((time) => (
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
          ))
        )}
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
