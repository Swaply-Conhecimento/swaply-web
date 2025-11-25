import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  BookOpen, 
  User, 
  Clock, 
  Plus,
  Trash,
  FileText,
  Upload,
  X,
  Coins,
  Calendar,
  PencilSimple
} from '@phosphor-icons/react';
import { useApp } from '../../../contexts';
import { useCourses } from '../../../hooks/useCourses';
import Modal from '../../atoms/Modal';
import Button from '../../atoms/Button';
import FormField from '../../molecules/FormField';
import Card from '../../molecules/Card';
import './AddCourseModal.css';

const AddCourseModal = ({
  isOpen,
  onClose,
  className = '',
}) => {
  const { actions, state } = useApp();
  const { createCourse, loading } = useCourses();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    subcategory: '',
    level: 'Iniciante',
    language: 'Português',
    pricePerHour: 10,
    totalHours: 10,
    maxStudents: 30,
    pricing: {
      singleClass: 10,
      fullCourse: 100
    },
    tags: [],
    features: [],
    curriculum: [],
    schedule: [],
    requirements: [],
    objectives: [],
    status: 'active'
  });

  const [availability, setAvailability] = useState({
    recurringAvailability: [],
    specificSlots: [],
    minAdvanceBooking: 2,
    maxAdvanceBooking: 60,
    slotDuration: 1,
    bufferTime: 0,
    timezone: 'America/Sao_Paulo'
  });

  const [newTag, setNewTag] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [newFeatureDescription, setNewFeatureDescription] = useState('');
  const [editingFeatureIndex, setEditingFeatureIndex] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showAddRecurring, setShowAddRecurring] = useState(false);
  const [showAddSpecific, setShowAddSpecific] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [recurringForm, setRecurringForm] = useState({
    dayOfWeek: 1,
    startTime: '09:00',
    endTime: '18:00'
  });

  const [specificForm, setSpecificForm] = useState({
    date: '',
    startTime: '09:00',
    endTime: '18:00',
    reason: ''
  });

  const daysOfWeek = [
    { value: 0, label: 'Domingo' },
    { value: 1, label: 'Segunda-feira' },
    { value: 2, label: 'Terça-feira' },
    { value: 3, label: 'Quarta-feira' },
    { value: 4, label: 'Quinta-feira' },
    { value: 5, label: 'Sexta-feira' },
    { value: 6, label: 'Sábado' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        setError('Por favor, selecione um arquivo de imagem válido.');
        return;
      }
      
      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('A imagem deve ter no máximo 5MB.');
        return;
      }
      
      setImageFile(file);
      setError('');
      
      // Criar preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    
    // Permitir adicionar múltiplas tags separadas por vírgula
    const tagsToAdd = newTag
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0 && !formData.tags.includes(tag));
    
    if (tagsToAdd.length > 0) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, ...tagsToAdd]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddFeature = () => {
    if (!newFeature.trim()) return;
    
    const featureTitle = newFeature.trim();
    const featureDescription = newFeatureDescription.trim();
    
    // Verificar se já existe (comparando apenas o título)
    const exists = formData.features.some(f => {
      const title = typeof f === 'string' ? f : f.title || f.name;
      return title === featureTitle;
    });
    
    if (exists) {
      setError('Este recurso já foi adicionado.');
      return;
    }
    
    // Criar objeto de recurso com título e descrição opcional
    const newFeatureObj = featureDescription 
      ? { title: featureTitle, description: featureDescription }
      : featureTitle;
    
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, newFeatureObj]
    }));
    
    setNewFeature('');
    setNewFeatureDescription('');
  };

  const handleEditFeature = (index) => {
    const feature = formData.features[index];
    if (typeof feature === 'string') {
      setNewFeature(feature);
      setNewFeatureDescription('');
    } else {
      setNewFeature(feature.title || feature.name || '');
      setNewFeatureDescription(feature.description || '');
    }
    setEditingFeatureIndex(index);
  };

  const handleUpdateFeature = () => {
    if (!newFeature.trim() || editingFeatureIndex === null) return;
    
    const featureTitle = newFeature.trim();
    const featureDescription = newFeatureDescription.trim();
    
    const updatedFeature = featureDescription 
      ? { title: featureTitle, description: featureDescription }
      : featureTitle;
    
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((f, i) => i === editingFeatureIndex ? updatedFeature : f)
    }));
    
    setNewFeature('');
    setNewFeatureDescription('');
    setEditingFeatureIndex(null);
  };

  const handleCancelEditFeature = () => {
    setNewFeature('');
    setNewFeatureDescription('');
    setEditingFeatureIndex(null);
  };

  const handleRemoveFeature = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== indexToRemove)
    }));
    if (editingFeatureIndex === indexToRemove) {
      setEditingFeatureIndex(null);
      setNewFeature('');
      setNewFeatureDescription('');
    }
  };

  const handleAddRecurringSlot = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const newSlot = {
      dayOfWeek: recurringForm.dayOfWeek,
      startTime: recurringForm.startTime,
      endTime: recurringForm.endTime,
      isActive: true
    };
    
    setAvailability(prev => ({
      ...prev,
      recurringAvailability: [...prev.recurringAvailability, newSlot]
    }));
    
    setRecurringForm({
      dayOfWeek: 1,
      startTime: '09:00',
      endTime: '18:00'
    });
    setShowAddRecurring(false);
  };

  const handleRemoveRecurringSlot = (index) => {
    setAvailability(prev => ({
      ...prev,
      recurringAvailability: prev.recurringAvailability.filter((_, i) => i !== index)
    }));
  };

  const handleAddSpecificSlot = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!specificForm.date) {
      setError('Por favor, selecione uma data.');
      return;
    }
    
    const newSlot = {
      date: specificForm.date,
      startTime: specificForm.startTime,
      endTime: specificForm.endTime,
      isAvailable: true,
      reason: specificForm.reason || undefined
    };
    
    setAvailability(prev => ({
      ...prev,
      specificSlots: [...prev.specificSlots, newSlot]
    }));
    
    setSpecificForm({
      date: '',
      startTime: '09:00',
      endTime: '18:00',
      reason: ''
    });
    setShowAddSpecific(false);
    setError('');
  };

  const handleRemoveSpecificSlot = (index) => {
    setAvailability(prev => ({
      ...prev,
      specificSlots: prev.specificSlots.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validações conforme documentação da API (criaçãoCursos.md)
    const titleTrimmed = formData.title.trim();
    if (!titleTrimmed || titleTrimmed.length < 5) {
      setError('O título deve ter no mínimo 5 caracteres.');
      return;
    }
    if (titleTrimmed.length > 200) {
      setError('O título deve ter no máximo 200 caracteres.');
      return;
    }

    const descriptionTrimmed = formData.description.trim();
    if (!descriptionTrimmed || descriptionTrimmed.length < 20) {
      setError('A descrição deve ter no mínimo 20 caracteres.');
      return;
    }
    if (descriptionTrimmed.length > 2000) {
      setError('A descrição deve ter no máximo 2000 caracteres.');
      return;
    }

    if (!formData.category || formData.category.trim().length === 0) {
      setError('A categoria é obrigatória.');
      return;
    }

    const allowedLevels = ['Iniciante', 'Intermediário', 'Avançado'];
    if (!allowedLevels.includes(formData.level)) {
      setError('Nível inválido. Use: Iniciante, Intermediário ou Avançado.');
      return;
    }

    const pricePerHourNum = Number(formData.pricePerHour);
    const totalHoursNum = Number(formData.totalHours);
    const singleClassPrice = Number(formData.pricing?.singleClass || formData.pricePerHour);
    const fullCoursePrice = Number(formData.pricing?.fullCourse || (formData.pricePerHour * formData.totalHours));

    if (Number.isNaN(pricePerHourNum) || pricePerHourNum < 1 || pricePerHourNum > 100) {
      setError('O preço por hora deve ser um número entre 1 e 100 créditos.');
      return;
    }
    if (Number.isNaN(totalHoursNum) || totalHoursNum < 1 || totalHoursNum > 100) {
      setError('O total de horas deve ser entre 1 e 100 horas.');
      return;
    }
    if (Number.isNaN(singleClassPrice) || singleClassPrice < 1) {
      setError('Preço da aula avulsa deve ser maior que 0.');
      return;
    }
    if (Number.isNaN(fullCoursePrice) || fullCoursePrice < 1) {
      setError('Preço do curso completo deve ser maior que 0.');
      return;
    }

    try {
      // ✅ Criar curso via API real - conforme documentação (criaçãoCursos.md)
      const courseData = {
        title: titleTrimmed,
        description: descriptionTrimmed,
        category: formData.category.trim(),
        level: formData.level,
        language: formData.language,
        pricePerHour: pricePerHourNum,
        totalHours: totalHoursNum,
        pricing: {
          singleClass: singleClassPrice,
          fullCourse: fullCoursePrice
        },
        status: formData.status || 'active',
      };

      // Campos opcionais - adicionar apenas se preenchidos
      if (formData.subcategory && formData.subcategory.trim()) {
        courseData.subcategory = formData.subcategory.trim();
      }

      if (formData.maxStudents && formData.maxStudents > 0) {
        courseData.maxStudents = Number(formData.maxStudents);
      }

      if (formData.features && formData.features.length > 0) {
        courseData.features = formData.features;
      }

      if (formData.curriculum && formData.curriculum.length > 0) {
        courseData.curriculum = formData.curriculum;
      }

      if (formData.schedule && formData.schedule.length > 0) {
        courseData.schedule = formData.schedule;
      }

      if (formData.requirements && formData.requirements.length > 0) {
        courseData.requirements = formData.requirements;
      }

      if (formData.objectives && formData.objectives.length > 0) {
        courseData.objectives = formData.objectives;
      }

      if (formData.tags && formData.tags.length > 0) {
        courseData.tags = formData.tags;
      }

      // Adicionar disponibilidade (obrigatória)
      // Sempre incluir disponibilidade, mesmo que vazia, para complementar o payload
      const availabilityData = {
        recurringAvailability: availability.recurringAvailability || [],
        minAdvanceBooking: availability.minAdvanceBooking || 2,
        maxAdvanceBooking: availability.maxAdvanceBooking || 60,
        slotDuration: availability.slotDuration || 1,
        bufferTime: availability.bufferTime || 0,
        timezone: availability.timezone || 'America/Sao_Paulo'
      };
      
      // Adicionar specificSlots apenas se houver
      if (availability.specificSlots && availability.specificSlots.length > 0) {
        availabilityData.specificSlots = availability.specificSlots;
      }
      
      courseData.availability = availabilityData;

      // Limpar campos undefined do payload
      const cleanPayload = JSON.parse(JSON.stringify(courseData));

      // Debug: Log do payload (apenas campos suportados pela API)
      console.log('📤 Enviando dados do curso:', JSON.stringify(cleanPayload, null, 2));

      const result = await createCourse(cleanPayload, imageFile);

      if (result.success) {
        setSuccess(true);
        
        // Recarregar dados do usuário para atualizar estatísticas
        await actions.refreshUser();
        
        // Mostrar mensagem de sucesso com Toast estilizado
        actions.showToast(
          `Curso "${formData.title}" criado com sucesso! Você pode editá-lo depois em "Minhas Aulas".`,
          'success',
          6000
        );
        
        // Resetar formulário
        resetForm();
        
        // Fechar modal após um pequeno delay para o usuário ver o toast
        setTimeout(() => {
          onClose();
        }, 500);
      }
    } catch (err) {
      console.error('❌ Erro ao criar curso:', err);
      console.error('📥 Status do erro:', err.status);
      console.error('📥 Resposta do erro:', err.response?.data || err.data);
      console.error('📥 Erro completo:', JSON.stringify({
        message: err.message,
        status: err.status,
        data: err.data,
        response: err.response
      }, null, 2));
      
      // Extrair mensagem de erro mais detalhada
      let errorMessage = 'Erro ao criar curso. Tente novamente.';
      
      const errorData = err.response?.data || err.data;
      
      if (errorData?.message) {
        errorMessage = errorData.message;
      } else if (errorData?.errors) {
        errorMessage = Array.isArray(errorData.errors) 
          ? errorData.errors.join(', ')
          : errorData.errors;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      subcategory: '',
      level: 'Iniciante',
      language: 'Português',
      pricePerHour: 10,
      totalHours: 10,
      maxStudents: 30,
      pricing: {
        singleClass: 10,
        fullCourse: 100
      },
      tags: [],
      features: [],
      curriculum: [],
      schedule: [],
      requirements: [],
      objectives: [],
      status: 'active'
    });
    setAvailability({
      recurringAvailability: [],
      specificSlots: [],
      minAdvanceBooking: 2,
      maxAdvanceBooking: 60,
      slotDuration: 1,
      bufferTime: 0,
      timezone: 'America/Sao_Paulo'
    });
    setNewTag('');
    setNewFeature('');
    setError('');
    setSuccess(false);
    setShowAddRecurring(false);
    setShowAddSpecific(false);
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Criando seu Novo Curso"
      size="large"
      className={`add-course-modal ${className}`}
    >
      <form onSubmit={handleSubmit} className="add-course-form">
        {/* Mensagem de erro */}
        {error && (
          <div className="add-course-error">
            ⚠️ {error}
          </div>
        )}

        {/* Basic Information */}
        <div className="add-course-section">
          <h3 className="add-course-section__title">
            <BookOpen size={20} />
            Informações Básicas
          </h3>
          
          <div className="add-course-fields">
            <FormField
              label="Nome do Curso *"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Ex: Desenvolvimento Web com React"
              required
              fullWidth
            />

            <FormField
              label="Descrição *"
              name="description"
              type="textarea"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Descreva seu curso e o que os alunos vão aprender..."
              required
              fullWidth
            />

            <div className="add-course-row">
              <FormField
                label="Categoria *"
                name="category"
                type="text"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="Ex: Programação, Design, Marketing"
                required
                fullWidth
              />

              <FormField
                label="Subcategoria"
                name="subcategory"
                type="text"
                value={formData.subcategory}
                onChange={handleInputChange}
                placeholder="Ex: Frontend, UI/UX"
                fullWidth
              />
            </div>

            <div className="add-course-row">
              <FormField
                label="Nível"
                name="level"
                type="select"
                value={formData.level}
                onChange={handleInputChange}
                fullWidth
              >
                <option value="Iniciante">Iniciante</option>
                <option value="Intermediário">Intermediário</option>
                <option value="Avançado">Avançado</option>
              </FormField>

              <FormField
                label="Idioma"
                name="language"
                type="select"
                value={formData.language}
                onChange={handleInputChange}
                fullWidth
              >
                <option value="Português">Português</option>
                <option value="Inglês">Inglês</option>
                <option value="Espanhol">Espanhol</option>
              </FormField>
            </div>

            {/* Image Upload */}
            <div className="add-course-image-upload">
              <label className="add-course-image-label">
                <Upload size={20} />
                Imagem do Curso
              </label>
              <div className="add-course-image-container">
                {imagePreview ? (
                  <>
                    <div className="add-course-image-preview">
                      <img src={imagePreview} alt="Preview" />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="add-course-image-remove"
                        title="Remover imagem"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="add-course-image-actions">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="add-course-image-input"
                        id="course-image-input"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="medium"
                        onClick={() => document.getElementById('course-image-input').click()}
                      >
                        <Upload size={18} />
                        Alterar Imagem
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="add-course-image-input"
                      id="course-image-input"
                    />
                    <label htmlFor="course-image-input" className="add-course-image-placeholder">
                      <Upload size={32} />
                      <p>Clique para selecionar uma imagem</p>
                      <p className="add-course-image-hint">Formatos: JPG, PNG, GIF (máx. 5MB)</p>
                    </label>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Preços e Limites */}
        <div className="add-course-section">
          <h3 className="add-course-section__title">
            <Coins size={20} />
            Preços e Limites
          </h3>
          
          <div className="add-course-row">
            <FormField
              label="Preço por Hora (Créditos)"
              name="pricePerHour"
              type="number"
              value={formData.pricePerHour}
              onChange={handleInputChange}
              min="1"
              fullWidth
            />

            <FormField
              label="Total de Horas"
              name="totalHours"
              type="number"
              value={formData.totalHours}
              onChange={handleInputChange}
              min="1"
              fullWidth
            />

            <FormField
              label="Máximo de Alunos"
              name="maxStudents"
              type="number"
              value={formData.maxStudents}
              onChange={handleInputChange}
              min="1"
              fullWidth
            />
          </div>

          <div className="add-course-row" style={{ marginTop: '1rem' }}>
            <FormField
              label="Preço Aula Avulsa (Créditos)"
              name="pricing.singleClass"
              type="number"
              value={formData.pricing?.singleClass || formData.pricePerHour}
              onChange={(e) => {
                const value = e.target.value;
                setFormData(prev => ({
                  ...prev,
                  pricing: {
                    ...prev.pricing,
                    singleClass: value ? Number(value) : prev.pricePerHour
                  }
                }));
              }}
              min="1"
              fullWidth
            />

            <FormField
              label="Preço Curso Completo (Créditos)"
              name="pricing.fullCourse"
              type="number"
              value={formData.pricing?.fullCourse || (formData.pricePerHour * formData.totalHours)}
              onChange={(e) => {
                const value = e.target.value;
                setFormData(prev => ({
                  ...prev,
                  pricing: {
                    ...prev.pricing,
                    fullCourse: value ? Number(value) : (prev.pricePerHour * prev.totalHours)
                  }
                }));
              }}
              min="1"
              fullWidth
            />
          </div>
        </div>

        {/* Tags */}
        <div className="add-course-section">
          <h3 className="add-course-section__title">
            <FileText size={20} />
            Tags (palavras-chave)
          </h3>
          
          <div className="add-course-categories">
            <div className="add-course-category-input">
              <FormField
                name="newTag"
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Ex: react, javascript, web (separadas por vírgula)"
                fullWidth
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleAddTag}
                disabled={!newTag.trim() || loading}
              >
                + Adicionar
              </Button>
            </div>
            <p className="add-course-category-hint">
              💡 Dica: Você pode adicionar múltiplas tags de uma vez, separadas por vírgula
            </p>
            
            {formData.tags.length > 0 && (
              <div className="add-course-category-list">
                {formData.tags.map((tag, index) => (
                  <div key={index} className="add-course-category-tag">
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="add-course-category-remove"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="add-course-section">
          <h3 className="add-course-section__title">
            <Plus size={20} />
            Recursos do Curso
          </h3>
          
          <div className="add-course-categories">
            <div className="add-course-feature-form">
              <FormField
                label="Título do Recurso *"
                name="newFeature"
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Ex: Certificado, Material complementar"
                fullWidth
              />
              <FormField
                label="Descrição/Subtópicos (opcional)"
                name="newFeatureDescription"
                type="textarea"
                value={newFeatureDescription}
                onChange={(e) => setNewFeatureDescription(e.target.value)}
                placeholder="Ex: Certificado reconhecido internacionalmente, Material em PDF e vídeos complementares..."
                fullWidth
              />
              <div className="add-course-feature-actions">
                {editingFeatureIndex !== null ? (
                  <>
                    <Button 
                      type="button" 
                      variant="primary" 
                      onClick={handleUpdateFeature}
                      disabled={!newFeature.trim() || loading}
                    >
                      Atualizar
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleCancelEditFeature}
                      disabled={loading}
                    >
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleAddFeature}
                    disabled={!newFeature.trim() || loading}
                  >
                    + Adicionar Recurso
                  </Button>
                )}
              </div>
            </div>
            
            {formData.features.length > 0 && (
              <div className="add-course-feature-list">
                {formData.features.map((feature, index) => {
                  const featureTitle = typeof feature === 'string' ? feature : feature.title || feature.name || '';
                  const featureDescription = typeof feature === 'object' ? feature.description : null;
                  
                  return (
                    <div key={index} className="add-course-feature-item">
                      <div className="add-course-feature-content">
                        <div className="add-course-feature-title">
                          <span>{featureTitle}</span>
                          {featureDescription && (
                            <span className="add-course-feature-has-desc">📝</span>
                          )}
                        </div>
                        {featureDescription && (
                          <div className="add-course-feature-desc-preview">
                            {featureDescription.substring(0, 50)}{featureDescription.length > 50 ? '...' : ''}
                          </div>
                        )}
                      </div>
                      <div className="add-course-feature-actions">
                        <button
                          type="button"
                          onClick={() => handleEditFeature(index)}
                          className="add-course-feature-edit"
                          title="Editar"
                        >
                          <PencilSimple size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(index)}
                          className="add-course-category-remove"
                          title="Remover"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Availability Section */}
        <div className="add-course-section">
          <h3 className="add-course-section__title">
            <Calendar size={20} />
            Configurar Disponibilidade
          </h3>

          <>
              {/* Recurring Availability */}
              <div className="add-course-availability-subsection">
                <div className="add-course-availability-header">
                  <h4 className="add-course-availability-title">
                    <Clock size={18} />
                    Horários Recorrentes
                  </h4>
                  <Button
                    type="button"
                    variant="primary"
                    size="small"
                    onClick={() => setShowAddRecurring(!showAddRecurring)}
                  >
                    <Plus size={16} />
                    Adicionar
                  </Button>
                </div>

                {showAddRecurring && (
                  <div className="add-course-availability-form">
                    <div className="add-course-row">
                      <FormField
                        label="Dia da Semana"
                        name="dayOfWeek"
                        type="select"
                        value={recurringForm.dayOfWeek}
                        onChange={(e) => setRecurringForm({ ...recurringForm, dayOfWeek: parseInt(e.target.value) })}
                        fullWidth
                      >
                        {daysOfWeek.map((day) => (
                          <option key={day.value} value={day.value}>
                            {day.label}
                          </option>
                        ))}
                      </FormField>
                      <FormField
                        label="Horário Inicial"
                        name="startTime"
                        type="time"
                        value={recurringForm.startTime}
                        onChange={(e) => setRecurringForm({ ...recurringForm, startTime: e.target.value })}
                        fullWidth
                      />
                      <FormField
                        label="Horário Final"
                        name="endTime"
                        type="time"
                        value={recurringForm.endTime}
                        onChange={(e) => setRecurringForm({ ...recurringForm, endTime: e.target.value })}
                        fullWidth
                      />
                    </div>
                    <div className="add-course-availability-form-actions">
                      <Button 
                        type="button" 
                        variant="primary" 
                        size="small"
                        onClick={handleAddRecurringSlot}
                      >
                        Adicionar
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="small"
                        onClick={() => setShowAddRecurring(false)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}

                {availability.recurringAvailability.length > 0 && (
                  <div className="add-course-availability-list">
                    {availability.recurringAvailability.map((slot, index) => (
                      <div key={index} className="add-course-availability-item">
                        <span>
                          {daysOfWeek.find(d => d.value === slot.dayOfWeek)?.label} - {slot.startTime} às {slot.endTime}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveRecurringSlot(index)}
                          className="add-course-category-remove"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Specific Slots */}
              <div className="add-course-availability-subsection">
                <div className="add-course-availability-header">
                  <h4 className="add-course-availability-title">
                    <Calendar size={18} />
                    Horários Específicos
                  </h4>
                  <Button
                    type="button"
                    variant="primary"
                    size="small"
                    onClick={() => setShowAddSpecific(!showAddSpecific)}
                  >
                    <Plus size={16} />
                    Adicionar
                  </Button>
                </div>

                {showAddSpecific && (
                  <div className="add-course-availability-form">
                    <div className="add-course-row">
                      <FormField
                        label="Data"
                        name="date"
                        type="date"
                        value={specificForm.date}
                        onChange={(e) => setSpecificForm({ ...specificForm, date: e.target.value })}
                        fullWidth
                      />
                      <FormField
                        label="Horário Inicial"
                        name="startTime"
                        type="time"
                        value={specificForm.startTime}
                        onChange={(e) => setSpecificForm({ ...specificForm, startTime: e.target.value })}
                        fullWidth
                      />
                      <FormField
                        label="Horário Final"
                        name="endTime"
                        type="time"
                        value={specificForm.endTime}
                        onChange={(e) => setSpecificForm({ ...specificForm, endTime: e.target.value })}
                        fullWidth
                      />
                    </div>
                    <div className="add-course-row">
                      <FormField
                        label="Motivo (opcional)"
                        name="reason"
                        type="text"
                        value={specificForm.reason}
                        onChange={(e) => setSpecificForm({ ...specificForm, reason: e.target.value })}
                        placeholder="Ex: Feriado, Evento especial"
                        fullWidth
                      />
                    </div>
                    <div className="add-course-availability-form-actions">
                      <Button 
                        type="button" 
                        variant="primary" 
                        size="small"
                        onClick={handleAddSpecificSlot}
                      >
                        Adicionar
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="small"
                        onClick={() => setShowAddSpecific(false)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}

                {availability.specificSlots.length > 0 && (
                  <div className="add-course-availability-list">
                    {availability.specificSlots.map((slot, index) => (
                      <div key={index} className="add-course-availability-item">
                        <span>
                          {new Date(slot.date).toLocaleDateString('pt-BR')} - {slot.startTime} às {slot.endTime}
                          {slot.reason && ` - ${slot.reason}`}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSpecificSlot(index)}
                          className="add-course-category-remove"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Availability Settings */}
              <div className="add-course-availability-subsection">
                <h4 className="add-course-availability-title">
                  Configurações Gerais
                </h4>
                <div className="add-course-row">
                  <FormField
                    label="Antecedência Mínima (horas)"
                    name="minAdvanceBooking"
                    type="number"
                    value={availability.minAdvanceBooking}
                    onChange={(e) => setAvailability({ ...availability, minAdvanceBooking: parseInt(e.target.value) || 2 })}
                    min="0"
                    fullWidth
                  />
                  <FormField
                    label="Antecedência Máxima (dias)"
                    name="maxAdvanceBooking"
                    type="number"
                    value={availability.maxAdvanceBooking}
                    onChange={(e) => setAvailability({ ...availability, maxAdvanceBooking: parseInt(e.target.value) || 60 })}
                    min="1"
                    fullWidth
                  />
                  <FormField
                    label="Duração da Aula (horas)"
                    name="slotDuration"
                    type="number"
                    value={availability.slotDuration}
                    onChange={(e) => setAvailability({ ...availability, slotDuration: parseFloat(e.target.value) || 1 })}
                    min="0.5"
                    step="0.5"
                    fullWidth
                  />
                  <FormField
                    label="Tempo de Buffer (minutos)"
                    name="bufferTime"
                    type="number"
                    value={availability.bufferTime}
                    onChange={(e) => setAvailability({ ...availability, bufferTime: parseInt(e.target.value) || 0 })}
                    min="0"
                    fullWidth
                  />
                </div>
              </div>
          </>
        </div>

        {/* Form Actions */}
        <div className="add-course-actions">
          <Button
            type="button"
            variant="outline"
            size="large"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="large"
            loading={loading}
            disabled={loading || !formData.title || !formData.description || !formData.category}
          >
            {loading ? 'Criando Curso...' : 'Criar Curso'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

AddCourseModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default AddCourseModal;
