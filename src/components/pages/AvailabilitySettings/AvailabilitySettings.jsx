import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Trash, 
  X,
  FloppyDisk,
  ArrowLeft
} from '@phosphor-icons/react';
import { useApp } from '../../../contexts';
import { useAvailability } from '../../../hooks';
import { useUser } from '../../../hooks/useUser';
import DashboardTemplate from '../../templates/DashboardTemplate';
import Card from '../../molecules/Card';
import Button from '../../atoms/Button';
import './AvailabilitySettings.css';

const AvailabilitySettings = () => {
  const { state, actions } = useApp();
  const {
    getInstructorAvailability,
    addRecurringAvailability,
    removeRecurringAvailability,
    addSpecificSlot,
    blockDate,
    updateSettings,
    loading,
    error
  } = useAvailability();
  const { getTeachingCourses } = useUser();

  const [availability, setAvailability] = useState(null);
  const [showAddRecurring, setShowAddRecurring] = useState(false);
  const [showAddSpecific, setShowAddSpecific] = useState(false);
  const [showBlockDate, setShowBlockDate] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [teachingCourses, setTeachingCourses] = useState([]);
  
  const [recurringForm, setRecurringForm] = useState({
    dayOfWeek: 1,
    startTime: '09:00',
    endTime: '17:00',
  });

  const [specificForm, setSpecificForm] = useState({
    date: '',
    startTime: '09:00',
    endTime: '17:00',
    isAvailable: true,
    reason: '',
  });

  const [blockForm, setBlockForm] = useState({
    date: '',
    reason: '',
  });

  const [settingsForm, setSettingsForm] = useState({
    minAdvanceBooking: 2,
    maxAdvanceBooking: 60,
    slotDuration: 1,
    bufferTime: 0,
    timezone: 'America/Sao_Paulo',
  });

  const daysOfWeek = [
    { value: 0, label: 'Domingo' },
    { value: 1, label: 'Segunda-feira' },
    { value: 2, label: 'Terça-feira' },
    { value: 3, label: 'Quarta-feira' },
    { value: 4, label: 'Quinta-feira' },
    { value: 5, label: 'Sexta-feira' },
    { value: 6, label: 'Sábado' },
  ];

  useEffect(() => {
    // Só carregar disponibilidade se um curso estiver selecionado
    // Se selectedCourseId for null, não buscar (disponibilidade geral não é suportada)
    if (selectedCourseId) {
      loadAvailability();
    } else {
      // Limpar disponibilidade quando nenhum curso está selecionado
      setAvailability(null);
    }
  }, [selectedCourseId]);

  useEffect(() => {
    const loadCourses = async () => {
      if (state.user?.isInstructor) {
        try {
          const result = await getTeachingCourses({ limit: 100 });
          if (result.courses) {
            setTeachingCourses(result.courses);
          }
        } catch (error) {
          console.error('Erro ao carregar cursos:', error);
        }
      }
    };
    loadCourses();
  }, [state.user]);

  const loadAvailability = async () => {
    if (!selectedCourseId) {
      console.warn('⚠️ Nenhum curso selecionado. Selecione um curso para ver a disponibilidade.');
      return;
    }

    try {
      // Passar undefined em vez de null se não houver courseId
      const result = await getInstructorAvailability(selectedCourseId || undefined);
      if (result.success) {
        setAvailability(result.availability);
        if (result.availability) {
          setSettingsForm({
            minAdvanceBooking: result.availability.minAdvanceBooking || 2,
            maxAdvanceBooking: result.availability.maxAdvanceBooking || 60,
            slotDuration: result.availability.slotDuration || 1,
            bufferTime: result.availability.bufferTime || 0,
            timezone: result.availability.timezone || 'America/Sao_Paulo',
          });
        }
      }
    } catch (err) {
      console.error('Erro ao carregar disponibilidade:', err);
      // Não mostrar erro se for apenas porque nenhum curso está selecionado
      if (selectedCourseId) {
        actions.showToast('Erro ao carregar disponibilidade. Tente novamente.', 'error');
      }
    }
  };

  const handleAddRecurring = async (e) => {
    e.preventDefault();
    
    // Validar se um curso está selecionado
    if (!selectedCourseId) {
      actions.showToast('Por favor, selecione um curso antes de adicionar disponibilidade.', 'error');
      return;
    }

    try {
      const result = await addRecurringAvailability({
        ...recurringForm,
        courseId: selectedCourseId,
      });
      if (result.success) {
        setAvailability(result.availability);
        setShowAddRecurring(false);
        setRecurringForm({ dayOfWeek: 1, startTime: '09:00', endTime: '17:00' });
        actions.showToast('Horário recorrente adicionado com sucesso!', 'success');
      } else {
        actions.showToast(result.error || 'Erro ao adicionar horário recorrente.', 'error');
      }
    } catch (err) {
      console.error('Erro ao adicionar horário recorrente:', err);
      actions.showToast(err.message || 'Erro ao adicionar horário recorrente.', 'error');
    }
  };

  const handleRemoveRecurring = async (slotId) => {
    if (window.confirm('Tem certeza que deseja remover esta disponibilidade?')) {
      const result = await removeRecurringAvailability(slotId, selectedCourseId);
      if (result.success) {
        setAvailability(result.availability);
      }
    }
  };

  const handleAddSpecific = async (e) => {
    e.preventDefault();
    
    // Validar se um curso está selecionado
    if (!selectedCourseId) {
      actions.showToast('Por favor, selecione um curso antes de adicionar disponibilidade.', 'error');
      return;
    }

    try {
      const result = await addSpecificSlot({
        ...specificForm,
        courseId: selectedCourseId,
      });
      if (result.success) {
        setAvailability(result.availability);
        setShowAddSpecific(false);
        setSpecificForm({
          date: '',
          startTime: '09:00',
          endTime: '17:00',
          isAvailable: true,
          reason: '',
        });
        actions.showToast('Horário específico adicionado com sucesso!', 'success');
      } else {
        actions.showToast(result.error || 'Erro ao adicionar horário específico.', 'error');
      }
    } catch (err) {
      console.error('Erro ao adicionar horário específico:', err);
      actions.showToast(err.message || 'Erro ao adicionar horário específico.', 'error');
    }
  };

  const handleBlockDate = async (e) => {
    e.preventDefault();
    
    // Validar se um curso está selecionado
    if (!selectedCourseId) {
      actions.showToast('Por favor, selecione um curso antes de bloquear uma data.', 'error');
      return;
    }

    try {
      const result = await blockDate({
        ...blockForm,
        courseId: selectedCourseId,
      });
      if (result.success) {
        setAvailability(result.availability);
        setShowBlockDate(false);
        setBlockForm({ date: '', reason: '' });
        actions.showToast('Data bloqueada com sucesso!', 'success');
      } else {
        actions.showToast(result.error || 'Erro ao bloquear data.', 'error');
      }
    } catch (err) {
      console.error('Erro ao bloquear data:', err);
      actions.showToast(err.message || 'Erro ao bloquear data.', 'error');
    }
  };

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    
    // Validar se um curso está selecionado
    if (!selectedCourseId) {
      actions.showToast('Por favor, selecione um curso antes de atualizar as configurações.', 'error');
      return;
    }

    try {
      const result = await updateSettings({
        ...settingsForm,
        courseId: selectedCourseId,
      });
      if (result.success) {
        setAvailability(result.availability);
        actions.showToast('Configurações atualizadas com sucesso!', 'success');
      } else {
        actions.showToast(result.error || 'Erro ao atualizar configurações.', 'error');
      }
    } catch (err) {
      console.error('Erro ao atualizar configurações:', err);
      actions.showToast(err.message || 'Erro ao atualizar configurações.', 'error');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <DashboardTemplate>
      <div className="availability-settings">
        <div className="availability-settings__header">
          <Button
            variant="ghost"
            onClick={() => actions.setCurrentPage('profile')}
            className="availability-settings__back"
          >
            <ArrowLeft size={20} />
            Voltar
          </Button>
          <h1 className="availability-settings__title">
            <Calendar size={32} />
            Configurar Disponibilidade
          </h1>
        </div>

        {error && (
          <Card className="availability-settings__error" padding="medium">
            <p>{error}</p>
          </Card>
        )}

        {/* Filtro por Curso */}
        <Card className="availability-settings__filter" padding="medium">
          <label className="availability-settings__filter-label">
            Selecionar curso (obrigatório):
          </label>
          <select
            value={selectedCourseId || ''}
            onChange={(e) => setSelectedCourseId(e.target.value || null)}
            className="availability-settings__filter-select"
            required
          >
            <option value="">-- Selecione um curso --</option>
            {teachingCourses.map((course) => (
              <option key={course._id || course.id} value={course._id || course.id}>
                {course.title}
              </option>
            ))}
          </select>
          {!selectedCourseId && (
            <p className="availability-settings__filter-hint">
              ⚠️ Selecione um curso para gerenciar sua disponibilidade
            </p>
          )}
        </Card>

        {/* Disponibilidade Recorrente */}
        <Card className="availability-settings__section" padding="large">
          <div className="availability-settings__section-header">
            <h2 className="availability-settings__section-title">
              <Clock size={24} />
              Horários Recorrentes
            </h2>
            <Button
              variant="primary"
              size="small"
              onClick={() => setShowAddRecurring(true)}
            >
              <Plus size={16} />
              Adicionar
            </Button>
          </div>

          {showAddRecurring && (
            <Card className="availability-settings__form-card" padding="medium">
              <form onSubmit={handleAddRecurring}>
                <div className="availability-settings__form-row">
                  <div className="availability-settings__form-group">
                    <label>Dia da Semana</label>
                    <select
                      value={recurringForm.dayOfWeek}
                      onChange={(e) =>
                        setRecurringForm({ ...recurringForm, dayOfWeek: parseInt(e.target.value) })
                      }
                      required
                    >
                      {daysOfWeek.map((day) => (
                        <option key={day.value} value={day.value}>
                          {day.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="availability-settings__form-group">
                    <label>Horário Inicial</label>
                    <input
                      type="time"
                      value={recurringForm.startTime}
                      onChange={(e) =>
                        setRecurringForm({ ...recurringForm, startTime: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="availability-settings__form-group">
                    <label>Horário Final</label>
                    <input
                      type="time"
                      value={recurringForm.endTime}
                      onChange={(e) =>
                        setRecurringForm({ ...recurringForm, endTime: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="availability-settings__form-actions">
                  <Button type="submit" variant="primary" disabled={loading}>
                    Adicionar
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddRecurring(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {!selectedCourseId ? (
            <p className="availability-settings__empty">
              Selecione um curso para ver os horários recorrentes
            </p>
          ) : (
            <div className="availability-settings__list">
              {availability?.recurringAvailability?.filter(slot => slot.isActive !== false).map((slot) => (
                <div key={slot._id} className="availability-settings__list-item">
                  <div className="availability-settings__item-info">
                    <span className="availability-settings__item-day">
                      {daysOfWeek.find((d) => d.value === slot.dayOfWeek)?.label}
                    </span>
                    <span className="availability-settings__item-time">
                      {slot.startTime} - {slot.endTime}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => handleRemoveRecurring(slot._id)}
                    disabled={loading}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              ))}
              {(!availability?.recurringAvailability || availability.recurringAvailability.filter(slot => slot.isActive !== false).length === 0) && (
                <p className="availability-settings__empty">
                  Nenhum horário recorrente configurado
                </p>
              )}
            </div>
          )}
        </Card>

        {/* Slots Específicos */}
        <Card className="availability-settings__section" padding="large">
          <div className="availability-settings__section-header">
            <h2 className="availability-settings__section-title">
              <Calendar size={24} />
              Horários Específicos
            </h2>
            <Button
              variant="primary"
              size="small"
              onClick={() => setShowAddSpecific(true)}
            >
              <Plus size={16} />
              Adicionar
            </Button>
          </div>

          {showAddSpecific && (
            <Card className="availability-settings__form-card" padding="medium">
              <form onSubmit={handleAddSpecific}>
                <div className="availability-settings__form-row">
                  <div className="availability-settings__form-group">
                    <label>Data</label>
                    <input
                      type="date"
                      value={specificForm.date}
                      onChange={(e) =>
                        setSpecificForm({ ...specificForm, date: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="availability-settings__form-group">
                    <label>Horário Inicial</label>
                    <input
                      type="time"
                      value={specificForm.startTime}
                      onChange={(e) =>
                        setSpecificForm({ ...specificForm, startTime: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="availability-settings__form-group">
                    <label>Horário Final</label>
                    <input
                      type="time"
                      value={specificForm.endTime}
                      onChange={(e) =>
                        setSpecificForm({ ...specificForm, endTime: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="availability-settings__form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={specificForm.isAvailable}
                      onChange={(e) =>
                        setSpecificForm({ ...specificForm, isAvailable: e.target.checked })
                      }
                    />
                    Disponível
                  </label>
                </div>
                <div className="availability-settings__form-group">
                  <label>Motivo (opcional)</label>
                  <input
                    type="text"
                    value={specificForm.reason}
                    onChange={(e) =>
                      setSpecificForm({ ...specificForm, reason: e.target.value })
                    }
                    placeholder="Ex: Horário extra, Evento especial..."
                  />
                </div>
                <div className="availability-settings__form-actions">
                  <Button type="submit" variant="primary" disabled={loading}>
                    Adicionar
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddSpecific(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {!selectedCourseId ? (
            <p className="availability-settings__empty">
              Selecione um curso para ver os horários específicos
            </p>
          ) : (
            <div className="availability-settings__list">
              {availability?.specificSlots?.map((slot) => (
                <div key={slot._id} className="availability-settings__list-item">
                  <div className="availability-settings__item-info">
                    <span className="availability-settings__item-date">
                      {formatDate(slot.date)}
                    </span>
                    <span className="availability-settings__item-time">
                      {slot.startTime} - {slot.endTime}
                    </span>
                    {slot.reason && (
                      <span className="availability-settings__item-reason">
                        {slot.reason}
                      </span>
                    )}
                    <span
                      className={`availability-settings__item-status ${
                        slot.isAvailable
                          ? 'availability-settings__item-status--available'
                          : 'availability-settings__item-status--blocked'
                      }`}
                    >
                      {slot.isAvailable ? 'Disponível' : 'Bloqueado'}
                    </span>
                  </div>
                </div>
              ))}
              {(!availability?.specificSlots || availability.specificSlots.length === 0) && (
                <p className="availability-settings__empty">
                  Nenhum horário específico configurado
                </p>
              )}
            </div>
          )}
        </Card>

        {/* Bloquear Datas */}
        <Card className="availability-settings__section" padding="large">
          <div className="availability-settings__section-header">
            <h2 className="availability-settings__section-title">
              <X size={24} />
              Bloquear Datas
            </h2>
            <Button
              variant="outline"
              size="small"
              onClick={() => setShowBlockDate(true)}
            >
              <Plus size={16} />
              Bloquear Data
            </Button>
          </div>

          {showBlockDate && (
            <Card className="availability-settings__form-card" padding="medium">
              <form onSubmit={handleBlockDate}>
                <div className="availability-settings__form-row">
                  <div className="availability-settings__form-group">
                    <label>Data</label>
                    <input
                      type="date"
                      value={blockForm.date}
                      onChange={(e) =>
                        setBlockForm({ ...blockForm, date: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="availability-settings__form-group">
                    <label>Motivo</label>
                    <input
                      type="text"
                      value={blockForm.reason}
                      onChange={(e) =>
                        setBlockForm({ ...blockForm, reason: e.target.value })
                      }
                      placeholder="Ex: Feriado, Férias..."
                      required
                    />
                  </div>
                </div>
                <div className="availability-settings__form-actions">
                  <Button type="submit" variant="primary" disabled={loading}>
                    Bloquear
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowBlockDate(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </Card>
          )}
        </Card>

        {/* Configurações */}
        <Card className="availability-settings__section" padding="large">
          <h2 className="availability-settings__section-title">
            <FloppyDisk size={24} />
            Configurações
          </h2>
          <form onSubmit={handleUpdateSettings}>
            <div className="availability-settings__settings-grid">
              <div className="availability-settings__form-group">
                <label>Antecedência Mínima (horas)</label>
                <input
                  type="number"
                  min="0"
                  max="24"
                  value={settingsForm.minAdvanceBooking}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      minAdvanceBooking: parseInt(e.target.value),
                    })
                  }
                  required
                />
                <small>Mínimo de horas antes do horário para agendar</small>
              </div>
              <div className="availability-settings__form-group">
                <label>Antecedência Máxima (dias)</label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={settingsForm.maxAdvanceBooking}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      maxAdvanceBooking: parseInt(e.target.value),
                    })
                  }
                  required
                />
                <small>Máximo de dias no futuro para agendar</small>
              </div>
              <div className="availability-settings__form-group">
                <label>Duração do Slot (horas)</label>
                <input
                  type="number"
                  min="0.5"
                  max="8"
                  step="0.5"
                  value={settingsForm.slotDuration}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      slotDuration: parseFloat(e.target.value),
                    })
                  }
                  required
                />
                <small>Duração padrão de cada aula</small>
              </div>
              <div className="availability-settings__form-group">
                <label>Tempo de Buffer (minutos)</label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={settingsForm.bufferTime}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      bufferTime: parseInt(e.target.value),
                    })
                  }
                  required
                />
                <small>Intervalo entre aulas consecutivas</small>
              </div>
            </div>
            <div className="availability-settings__form-actions">
              <Button type="submit" variant="primary" disabled={loading}>
                <FloppyDisk size={16} />
                Salvar Configurações
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardTemplate>
  );
};

export default AvailabilitySettings;



