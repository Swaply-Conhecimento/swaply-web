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
  X
} from '@phosphor-icons/react';
import { useApp } from '../../../contexts/AppContext';
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
  const { actions } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categories: [],
    curriculum: '',
    lessons: [
      {
        id: 1,
        title: 'Introdução ao Curso',
        description: 'Aula introdutória de apresentação do curso'
      }
    ]
  });

  const [newCategory, setNewCategory] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !formData.categories.includes(newCategory.trim())) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, newCategory.trim()]
      }));
      setNewCategory('');
    }
  };

  const handleRemoveCategory = (categoryToRemove) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter(cat => cat !== categoryToRemove)
    }));
  };

  const handleAddLesson = () => {
    const newLesson = {
      id: Date.now(),
      title: '',
      description: ''
    };
    setFormData(prev => ({
      ...prev,
      lessons: [...prev.lessons, newLesson]
    }));
  };

  const handleUpdateLesson = (lessonId, field, value) => {
    setFormData(prev => ({
      ...prev,
      lessons: prev.lessons.map(lesson =>
        lesson.id === lessonId
          ? { ...lesson, [field]: value }
          : lesson
      )
    }));
  };

  const handleRemoveLesson = (lessonId) => {
    setFormData(prev => ({
      ...prev,
      lessons: prev.lessons.filter(lesson => lesson.id !== lessonId)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Creating course:', formData);
    
    // Simulate course creation
    const newCourse = {
      id: Date.now(),
      ...formData,
      instructor: 'Você',
      createdAt: new Date().toISOString(),
      status: 'draft'
    };
    
    // Here you would send to API
    console.log('Course created:', newCourse);
    
    // Reset form and close modal
    setFormData({
      name: '',
      description: '',
      categories: [],
      curriculum: '',
      lessons: [
        {
          id: 1,
          title: 'Introdução ao Curso',
          description: 'Aula introdutória de apresentação do curso'
        }
      ]
    });
    
    onClose();
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
        {/* Basic Information */}
        <div className="add-course-section">
          <h3 className="add-course-section__title">
            <BookOpen size={20} />
            Informações Básicas
          </h3>
          
          <div className="add-course-fields">
            <FormField
              label="Nome do Curso:"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Ex: Desenvolvimento Web com React"
              required
              fullWidth
            />

            <FormField
              label="Descrição:"
              name="description"
              type="textarea"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Descreva seu curso e o que os alunos vão aprender..."
              required
              fullWidth
            />
          </div>
        </div>

        {/* Categories */}
        <div className="add-course-section">
          <h3 className="add-course-section__title">
            <FileText size={20} />
            Categoria(s):
          </h3>
          
          <div className="add-course-categories">
            <div className="add-course-category-input">
              <FormField
                name="newCategory"
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Digite uma categoria"
                fullWidth
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleAddCategory}
                disabled={!newCategory.trim()}
              >
                + Adicionar
              </Button>
            </div>
            
            {formData.categories.length > 0 && (
              <div className="add-course-category-list">
                {formData.categories.map((category, index) => (
                  <div key={index} className="add-course-category-tag">
                    <span>{category}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCategory(category)}
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

        {/* Lessons */}
        <div className="add-course-section">
          <h3 className="add-course-section__title">
            <Clock size={20} />
            Aulas:
          </h3>
          
          <div className="add-course-lessons">
            {formData.lessons.map((lesson, index) => (
              <Card key={lesson.id} className="add-course-lesson-card" padding="medium">
                <div className="add-course-lesson-header">
                  <span className="add-course-lesson-number">
                    {index + 1} - {lesson.title || 'Nova Aula'}
                  </span>
                  {formData.lessons.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="small"
                      onClick={() => handleRemoveLesson(lesson.id)}
                    >
                      <Trash size={16} />
                    </Button>
                  )}
                </div>
                
                <div className="add-course-lesson-fields">
                  <FormField
                    label="Título da Aula"
                    name={`lesson-title-${lesson.id}`}
                    type="text"
                    value={lesson.title}
                    onChange={(e) => handleUpdateLesson(lesson.id, 'title', e.target.value)}
                    placeholder="Ex: Introdução ao React"
                    fullWidth
                  />
                  
                  <FormField
                    label="Descrição"
                    name={`lesson-description-${lesson.id}`}
                    type="textarea"
                    value={lesson.description}
                    onChange={(e) => handleUpdateLesson(lesson.id, 'description', e.target.value)}
                    placeholder="Aula introdutória de apresentação do curso"
                    fullWidth
                  />
                </div>
                
                <div className="add-course-lesson-details">
                  <Button variant="ghost" size="small">
                    Ver detalhes
                  </Button>
                </div>
              </Card>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={handleAddLesson}
              className="add-course-add-lesson"
            >
              <Plus size={20} />
              + Criar aula
            </Button>
          </div>
        </div>

        {/* Form Actions */}
        <div className="add-course-actions">
          <Button
            type="button"
            variant="outline"
            size="large"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="large"
          >
            Criar Curso
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
