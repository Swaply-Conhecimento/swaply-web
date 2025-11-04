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
  Coins
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
    tags: [],
    features: [],
    curriculum: [],
    schedule: [],
    requirements: [],
    objectives: [],
    status: 'draft'
  });

  const [newTag, setNewTag] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
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
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (featureToRemove) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== featureToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validações básicas
    if (!formData.title.trim()) {
      setError('O título do curso é obrigatório');
      return;
    }

    if (!formData.description.trim()) {
      setError('A descrição do curso é obrigatória');
      return;
    }

    if (!formData.category.trim()) {
      setError('A categoria é obrigatória');
      return;
    }

    // Validar números
    if (formData.pricePerHour < 1) {
      setError('O preço por hora deve ser no mínimo 1 crédito');
      return;
    }

    // Validações conforme documentação da API
    if (!formData.title || formData.title.trim().length === 0) {
      setError('O título é obrigatório.');
      return;
    }
    if (formData.title.trim().length > 200) {
      setError('O título deve ter no máximo 200 caracteres.');
      return;
    }
    if (!formData.description || formData.description.trim().length === 0) {
      setError('A descrição é obrigatória.');
      return;
    }
    if (formData.description.trim().length > 2000) {
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

    if (Number.isNaN(pricePerHourNum) || pricePerHourNum < 1) {
      setError('O preço por hora deve ser um número maior ou igual a 1.');
      return;
    }
    if (Number.isNaN(totalHoursNum) || totalHoursNum < 1) {
      setError('O total de horas deve ser no mínimo 1 hora');
      return;
    }

    try {
      // ✅ Criar curso via API real
      const courseData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category.trim(),
        level: formData.level,
        language: formData.language,
        pricePerHour: pricePerHourNum,
        totalHours: totalHoursNum,
        // Campos opcionais conforme doc
        curriculum: formData.curriculum.length > 0 ? formData.curriculum : [
          {
            id: 1,
            title: 'Introdução',
            duration: Math.min(totalHoursNum, 2),
            lessons: ['Apresentação', 'Objetivos']
          }
        ],
        schedule: formData.schedule.length > 0 ? formData.schedule : [
          { day: 'Segunda', time: '09:00-11:00' }
        ],
      };

      // Adicionar subcategoria apenas se preenchida
      if (formData.subcategory && formData.subcategory.trim()) {
        courseData.subcategory = formData.subcategory.trim();
      }

      // Debug: Log do payload (apenas campos suportados pela API)
      console.log('📤 Enviando dados do curso:', JSON.stringify(courseData, null, 2));

      const result = await createCourse(courseData);

      if (result.success) {
        setSuccess(true);
        
        // Recarregar dados do usuário para atualizar estatísticas
        await actions.refreshUser();
        
        // Mostrar mensagem de sucesso
        alert(`Curso "${formData.title}" criado com sucesso!\n\nVocê pode editá-lo depois em "Minhas Aulas".`);
        
        // Resetar formulário
        resetForm();
        
        // Fechar modal
        onClose();
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
      tags: [],
      features: [],
      curriculum: [],
      schedule: [],
      requirements: [],
      objectives: [],
      status: 'draft'
    });
    setNewTag('');
    setNewFeature('');
    setError('');
    setSuccess(false);
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
                placeholder="Ex: react, javascript, web"
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
            <div className="add-course-category-input">
              <FormField
                name="newFeature"
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Ex: Certificado, Material complementar"
                fullWidth
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleAddFeature}
                disabled={!newFeature.trim() || loading}
              >
                + Adicionar
              </Button>
            </div>
            
            {formData.features.length > 0 && (
              <div className="add-course-category-list">
                {formData.features.map((feature, index) => (
                  <div key={index} className="add-course-category-tag">
                    <span>{feature}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(feature)}
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
