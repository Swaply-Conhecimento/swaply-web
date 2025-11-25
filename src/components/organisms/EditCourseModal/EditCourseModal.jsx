import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  BookOpen, 
  Coins,
  Plus,
  Trash,
  FileText,
  X,
  Upload,
  Image as ImageIcon
} from '@phosphor-icons/react';
import { useApp } from '../../../contexts';
import { useCourses } from '../../../hooks/useCourses';
import Modal from '../../atoms/Modal';
import Button from '../../atoms/Button';
import FormField from '../../molecules/FormField';
import './EditCourseModal.css';

const EditCourseModal = ({
  isOpen,
  onClose,
  course,
  className = '',
}) => {
  const { actions } = useApp();
  const { updateCourse, loading } = useCourses();
  
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
    requirements: [],
    objectives: [],
    status: 'draft'
  });

  const [newTag, setNewTag] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Carregar dados do curso quando o modal abrir
  useEffect(() => {
    if (isOpen && course) {
      setFormData({
        title: course.title || '',
        description: course.description || '',
        category: course.category || '',
        subcategory: course.subcategory || '',
        level: course.level || 'Iniciante',
        language: course.language || course.courseLanguage || 'Português',
        pricePerHour: course.pricePerHour || 10,
        totalHours: course.totalHours || 10,
        maxStudents: course.maxStudents || 30,
        tags: course.tags || [],
        features: course.features || [],
        requirements: course.requirements || [],
        objectives: course.objectives || [],
        status: course.status || 'draft'
      });
      setImagePreview(course.image || null);
      setImageFile(null);
      setError('');
    }
  }, [isOpen, course]);

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

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        setError('Por favor, selecione um arquivo de imagem válido.');
        return;
      }
      
      // Validar tamanho (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('A imagem deve ter no máximo 10MB.');
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
    setImagePreview(course?.image || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!course || !course.id && !course._id) {
      setError('Curso não encontrado.');
      return;
    }

    const courseId = course.id || course._id;

    // Validações
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

    if (Number.isNaN(pricePerHourNum) || pricePerHourNum < 1 || pricePerHourNum > 100) {
      setError('O preço por hora deve ser um número entre 1 e 100 créditos.');
      return;
    }
    if (Number.isNaN(totalHoursNum) || totalHoursNum < 1 || totalHoursNum > 100) {
      setError('O total de horas deve ser entre 1 e 100 horas.');
      return;
    }

    try {
      // Preparar dados para atualização conforme documentação da API
      const courseData = {
        title: titleTrimmed,
        description: descriptionTrimmed,
        category: formData.category.trim(),
        level: formData.level,
        language: formData.language,
        pricePerHour: pricePerHourNum,
        totalHours: totalHoursNum,
        status: formData.status || 'draft',
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

      if (formData.requirements && formData.requirements.length > 0) {
        courseData.requirements = formData.requirements;
      }

      if (formData.objectives && formData.objectives.length > 0) {
        courseData.objectives = formData.objectives;
      }

      if (formData.tags && formData.tags.length > 0) {
        courseData.tags = formData.tags;
      }

      console.log('📤 Atualizando curso:', courseId, courseData, imageFile ? 'com imagem' : 'sem imagem');

      const result = await updateCourse(courseId, courseData, imageFile);

      if (result.success) {
        // Recarregar dados do usuário para atualizar estatísticas
        await actions.refreshUser();
        
        // Mostrar mensagem de sucesso
        actions.showToast(
          `Curso "${formData.title}" atualizado com sucesso!`,
          'success',
          4000
        );
        
        // Fechar modal após um pequeno delay
        setTimeout(() => {
          onClose();
          // Recarregar a página de detalhes do curso se necessário
          if (actions.setSelectedCourse && result.course) {
            actions.setSelectedCourse({
              id: result.course._id || result.course.id,
              ...result.course
            });
          }
        }, 500);
      }
    } catch (err) {
      console.error('❌ Erro ao atualizar curso:', err);
      
      let errorMessage = 'Erro ao atualizar curso. Tente novamente.';
      
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

  if (!course) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Curso"
      size="large"
      className={`edit-course-modal ${className}`}
    >
      <form onSubmit={handleSubmit} className="edit-course-form">
        {/* Mensagem de erro */}
        {error && (
          <div className="edit-course-error">
            ⚠️ {error}
          </div>
        )}

        {/* Basic Information */}
        <div className="edit-course-section">
          <h3 className="edit-course-section__title">
            <BookOpen size={20} />
            Informações Básicas
          </h3>
          
          <div className="edit-course-fields">
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

            <div className="edit-course-row">
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

            <div className="edit-course-row">
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

        {/* Upload de Imagem */}
        <div className="edit-course-section">
          <h3 className="edit-course-section__title">
            <ImageIcon size={20} />
            Imagem do Curso (Capa)
          </h3>
          
          <div className="edit-course-upload">
            {imagePreview ? (
              <div className="edit-course-upload-preview">
                <img src={imagePreview} alt="Preview" className="edit-course-upload-image" />
                <div className="edit-course-upload-actions">
                  <label className="edit-course-upload-change">
                    <Upload size={20} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                    Alterar Imagem
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="small"
                    onClick={handleRemoveImage}
                  >
                    <X size={16} />
                    Remover
                  </Button>
                </div>
              </div>
            ) : (
              <label className="edit-course-upload-area">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                <div className="edit-course-upload-content">
                  <Upload size={48} className="edit-course-upload-icon" />
                  <p className="edit-course-upload-text">
                    Clique para fazer upload de uma imagem
                  </p>
                  <p className="edit-course-upload-hint">
                    JPG, PNG ou WEBP (máx. 10MB)
                  </p>
                </div>
              </label>
            )}
          </div>
        </div>

        {/* Preços e Limites */}
        <div className="edit-course-section">
          <h3 className="edit-course-section__title">
            <Coins size={20} />
            Preços e Limites
          </h3>
          
          <div className="edit-course-row">
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

        {/* Status */}
        <div className="edit-course-section">
          <h3 className="edit-course-section__title">
            <FileText size={20} />
            Status do Curso
          </h3>
          
          <FormField
            label="Status"
            name="status"
            type="select"
            value={formData.status}
            onChange={handleInputChange}
            fullWidth
          >
            <option value="draft">Rascunho</option>
            <option value="active">Ativo</option>
            <option value="completed">Completo</option>
            <option value="cancelled">Cancelado</option>
          </FormField>
        </div>

        {/* Tags */}
        <div className="edit-course-section">
          <h3 className="edit-course-section__title">
            <FileText size={20} />
            Tags (palavras-chave)
          </h3>
          
          <div className="edit-course-categories">
            <div className="edit-course-category-input">
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
              <div className="edit-course-category-list">
                {formData.tags.map((tag, index) => (
                  <div key={index} className="edit-course-category-tag">
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="edit-course-category-remove"
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
        <div className="edit-course-section">
          <h3 className="edit-course-section__title">
            <Plus size={20} />
            Recursos do Curso
          </h3>
          
          <div className="edit-course-categories">
            <div className="edit-course-category-input">
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
              <div className="edit-course-category-list">
                {formData.features.map((feature, index) => (
                  <div key={index} className="edit-course-category-tag">
                    <span>{feature}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(feature)}
                      className="edit-course-category-remove"
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
        <div className="edit-course-actions">
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
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

EditCourseModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  course: PropTypes.object,
  className: PropTypes.string,
};

export default EditCourseModal;

