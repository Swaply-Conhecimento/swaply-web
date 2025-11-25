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
import { useApp } from '../../../contexts';
import { useScheduling } from '../../../hooks/useScheduling';
import { useAvailability, useEnrollments } from '../../../hooks';
import DashboardTemplate from '../../templates/DashboardTemplate';
import Card from '../../molecules/Card';
import Button from '../../atoms/Button';
import './ScheduleClass.css';

const ScheduleClass = () => {
  const { state, actions } = useApp();
  const { scheduleClass, loading, error } = useScheduling();
  const { getCourseAvailabilitySlots, getAvailableSlots } = useAvailability();
  const { checkEnrollmentStatus, enrollInSingleClass, loading: enrollmentLoading } = useEnrollments();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [step, setStep] = useState(1); // 1: Selecionar Data, 2: Selecionar Horário, 3: Confirmação
  const [availability, setAvailability] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [monthSlots, setMonthSlots] = useState({}); // Slots agrupados por data do mês atual
  const [enrollmentStatus, setEnrollmentStatus] = useState(null);

  const course = state.selectedCourse;

  // Resetar estado quando página carrega
  useEffect(() => {
    setSelectedDate(null);
    setSelectedTime(null);
    setStep(1);
    // Garantir que currentMonth seja o mês atual
    const now = new Date();
    setCurrentMonth(new Date(now.getFullYear(), now.getMonth(), 1));
    setAvailability(null);
    setAvailableSlots([]);
    setMonthSlots({});
  }, []);

  // Verificar status de matrícula quando o curso for carregado
  useEffect(() => {
    const checkEnrollment = async () => {
      if (!course?.id && !course?._id) return;

      try {
        const result = await checkEnrollmentStatus(course._id || course.id);
        if (result.success) {
          setEnrollmentStatus(result);
        }
      } catch (err) {
        console.error('Erro ao verificar matrícula:', err);
        setEnrollmentStatus({ enrolled: false });
      }
    };

    checkEnrollment();
  }, [course, checkEnrollmentStatus]);

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
      // Verificar múltiplas formas de obter o instructorId
      // Prioridade: instructorObject > instructor (objeto) > instructorId direto
      const instructorId = 
        (course.instructorObject && (course.instructorObject._id || course.instructorObject.id)) ||
        (typeof course.instructor === 'object' && course.instructor !== null && (course.instructor._id || course.instructor.id)) ||
        course.instructorId;
      
      console.log('📅 ScheduleClass - Buscando slots:', {
        instructorId,
        courseId: course._id || course.id,
        startDate,
        endDate,
        courseInstructor: course.instructor,
        courseInstructorObject: course.instructorObject,
        courseInstructorId: course.instructorId,
        courseKeys: Object.keys(course)
      });
      
      let result;
      if (instructorId) {
        // Usar rota pública GET /api/availability/slots (recomendada)
        result = await getAvailableSlots({
          instructorId: instructorId,
          courseId: course._id || course.id,
          startDate,
          endDate
        });
        console.log('📅 ScheduleClass - Resultado getAvailableSlots:', result);
        console.log('📅 ScheduleClass - Número de slots retornados:', result.slots?.length || 0);
      } else {
        console.warn('📅 ScheduleClass - Nenhum instructorId encontrado, usando fallback');
        // Fallback: usar rota específica do curso
        result = await getCourseAvailabilitySlots(
          course._id || course.id,
          startDate,
          endDate
        );
        console.log('📅 ScheduleClass - Resultado getCourseAvailabilitySlots:', result);
      }

      if (result.success && result.slots && result.slots.length > 0) {
        // Agrupar slots por data
        const slotsByDate = {};
        result.slots.forEach(slot => {
          const dateStr = slot.date;
          if (!slotsByDate[dateStr]) {
            slotsByDate[dateStr] = [];
          }
          slotsByDate[dateStr].push(slot);
        });
        
        console.log('📅 ScheduleClass - Slots agrupados por data:', slotsByDate);
        console.log('📅 ScheduleClass - Total de datas com slots:', Object.keys(slotsByDate).length);
        console.log('📅 ScheduleClass - Primeiras 5 datas com slots:', Object.keys(slotsByDate).slice(0, 5));
        setMonthSlots(slotsByDate);
      } else {
        console.log('📅 ScheduleClass - Nenhum slot retornado ou resultado sem sucesso', {
          success: result.success,
          slotsCount: result.slots?.length || 0,
          result: result
        });
        setMonthSlots({});
      }
    } catch (err) {
      console.error('Erro ao carregar disponibilidade do mês:', err);
      setMonthSlots({});
    }
  };

  // Carregar disponibilidade do mês quando o mês muda ou o curso muda
  useEffect(() => {
    if (course && currentMonth) {
      loadMonthAvailability();
    }
  }, [currentMonth, course, getAvailableSlots, getCourseAvailabilitySlots]);

  // Carregar disponibilidade quando uma data é selecionada
  useEffect(() => {
    if (selectedDate && course) {
      loadAvailability();
    }
  }, [selectedDate, course, getAvailableSlots, getCourseAvailabilitySlots]);

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
      // Verificar múltiplas formas de obter o instructorId
      const instructorId = 
        (course.instructorObject && (course.instructorObject._id || course.instructorObject.id)) ||
        (typeof course.instructor === 'object' && course.instructor !== null && (course.instructor._id || course.instructor.id)) ||
        course.instructorId;
      
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
        setAvailability(result);
        
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
      
      // Debug apenas para o primeiro dia do mês
      if (i === 0) {
        console.log('📅 ScheduleClass - Debug primeiro dia:', {
          dateStr,
          isCurrentMonth,
          isPast,
          hasSlotsInMonth: !!monthSlots[dateStr],
          slotsCount: monthSlots[dateStr]?.length || 0,
          hasAvailableSlots,
          monthSlotsKeys: Object.keys(monthSlots).slice(0, 5) // Primeiras 5 datas
        });
      }

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

      let result;
      let message;

      // Verificar se está matriculado em curso completo
      if (enrollmentStatus?.enrolled && enrollmentStatus.enrollmentType === 'full_course') {
        // Curso completo: usar POST /api/classes/schedule (sem cobrar)
        result = await scheduleClass({
          courseId: course._id || course.id,
          date: formattedDate,
          time: selectedTime,
          duration: 1,
        });

        if (result.success) {
          actions.addScheduledClass(result.class);
          await actions.refreshUser();
          message = `Aula agendada com sucesso!\nData: ${selectedDate.toLocaleDateString('pt-BR')}\nHorário: ${selectedTime}\n\nSem custo adicional - você está matriculado no curso completo.`;
        }
      } else {
        // Aula avulsa: usar POST /api/enrollments/single-class (comprar e agendar)
        result = await enrollInSingleClass({
          courseId: course._id || course.id,
          date: formattedDate,
          time: selectedTime,
          duration: 1,
        });

        if (result.success) {
          actions.addScheduledClass(result.scheduledClass);
          await actions.refreshUser();
          const price = course.pricing?.singleClass || course.price || 0;
          message = `Aula avulsa comprada e agendada com sucesso!\nData: ${selectedDate.toLocaleDateString('pt-BR')}\nHorário: ${selectedTime}\n\n${price} créditos foram deduzidos da sua conta.`;
        }
      }

      if (result.success) {
        // Voltar ao dashboard
        actions.setCurrentPage('dashboard');
        actions.showToast(message || 'Aula agendada com sucesso!', 'success');
      } else {
        actions.showToast(result.error || 'Erro ao agendar aula. Tente novamente.', 'error');
      }
    } catch (err) {
      // Tratar erro
      console.error('Erro ao agendar aula:', err);
      actions.showToast(err.message || 'Erro ao agendar aula. Tente novamente mais tarde.', 'error');
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

  const renderDateSelection = () => {
    const hasAnySlots = Object.keys(monthSlots).length > 0;
    
    return (
      <Card className="schedule-class__card" padding="large">
        <h2 className="schedule-class__card-title">
          <Calendar size={24} />
          Selecione a data da sua aula
        </h2>
        
        {!hasAnySlots && (
          <div className="schedule-class__no-availability" style={{
            padding: 'var(--spacing-4)',
            marginBottom: 'var(--spacing-4)',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center'
          }}>
            <p style={{ margin: 0, color: 'var(--color-error)', fontWeight: 500 }}>
              ⚠️ Nenhum horário disponível encontrado para este mês.
            </p>
            <p style={{ margin: 'var(--spacing-2) 0 0 0', fontSize: 'var(--font-size-sm)', color: 'var(--color-neutral-600)' }}>
              Tente navegar para outro mês ou entre em contato com o instrutor.
            </p>
          </div>
        )}
        
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
  };

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
        {loadingAvailability ? (
          <div className="schedule-class__loading">
            <p>Carregando horários disponíveis...</p>
          </div>
        ) : availableSlots.length === 0 ? (
          <div className="schedule-class__no-slots">
            <p>Nenhum horário disponível para esta data.</p>
            <Button variant="outline" onClick={() => setStep(1)}>
              Escolher outra data
            </Button>
          </div>
        ) : (
          availableSlots.map((time) => (
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
          ))
        )}
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
              <span>{typeof course?.instructor === 'object' && course?.instructor !== null 
                ? (course.instructor.name || course.instructor.username || 'Instrutor')
                : course?.instructor || 'Instrutor'}</span>
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

        {enrollmentStatus?.enrolled && enrollmentStatus.enrollmentType === 'full_course' ? (
          <div className="schedule-class__cost" style={{ background: 'var(--color-primary-50)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <BookOpen size={24} weight="fill" />
            <div>
              <div className="schedule-class__cost-amount" style={{ color: 'var(--color-primary-700)' }}>
                Sem custo adicional
              </div>
              <div className="schedule-class__cost-balance">
                Você está matriculado no curso completo
              </div>
            </div>
          </div>
        ) : (
          <div className="schedule-class__cost">
            <Coins size={24} weight="fill" />
            <div>
              <div className="schedule-class__cost-amount">
                {course?.pricing?.singleClass || course?.price || 0} créditos
              </div>
              <div className="schedule-class__cost-balance">
                Seus créditos: {state.user?.credits || 0}
              </div>
            </div>
          </div>
        )}

        <div className="schedule-class__actions">
          <Button variant="ghost" onClick={handleBackStep}>
            <ArrowLeft size={16} />
            Voltar
          </Button>
          <Button 
            variant="primary" 
            size="large"
            onClick={handleConfirmSchedule}
            disabled={
              (enrollmentStatus?.enrolled && enrollmentStatus.enrollmentType === 'full_course')
                ? (loading || enrollmentLoading)
                : ((state.user?.credits || 0) < (course?.pricing?.singleClass || course?.price || 0) || loading || enrollmentLoading)
            }
            loading={loading || enrollmentLoading}
          >
            {enrollmentStatus?.enrolled && enrollmentStatus.enrollmentType === 'full_course' ? (
              <>
                <Check size={16} weight="fill" />
                {loading ? 'Agendando...' : 'Agendar Aula (Sem custo adicional)'}
              </>
            ) : (
              <>
                <Coins size={16} weight="fill" />
                {loading || enrollmentLoading ? 'Comprando e agendando...' : `Comprar e Agendar (${course?.pricing?.singleClass || course?.price || 0} créditos)`}
              </>
            )}
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
                {course.title} - {typeof course?.instructor === 'object' && course?.instructor !== null 
                  ? (course.instructor.name || course.instructor.username || 'Instrutor')
                  : course?.instructor || 'Instrutor'}
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
