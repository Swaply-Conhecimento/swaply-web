import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  Camera, 
  X, 
  Check,
  Trash,
  ArrowLeft
} from '@phosphor-icons/react';
import { useApp } from '../../../contexts';
import { useUser } from '../../../hooks/useUser';
import DashboardTemplate from '../../templates/DashboardTemplate';
import Card from '../../molecules/Card';
import Button from '../../atoms/Button';
import FormField from '../../molecules/FormField';
import './EditProfile.css';

const EditProfile = () => {
  const { state, actions } = useApp();
  const { updateProfile, uploadAvatar, deleteAvatar } = useUser();
  
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    skills: [],
  });
  
  const [newSkill, setNewSkill] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [hasAvatarChanges, setHasAvatarChanges] = useState(false);

  // Carregar dados do usuário ao montar
  useEffect(() => {
    if (state.user) {
      setFormData({
        name: state.user.name || '',
        bio: state.user.bio || '',
        skills: state.user.skills || [],
      });
      
      if (state.user.avatar) {
        setAvatarPreview(state.user.avatar);
      } else {
        // Gerar avatar com iniciais
        const initials = (state.user.name || 'User')
          .split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);
        setAvatarPreview(`https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=52357B&color=fff&size=200`);
      }
    }
  }, [state.user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleAddSkill = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const trimmedSkill = newSkill.trim();
    if (trimmedSkill && !formData.skills.includes(trimmedSkill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, trimmedSkill],
      }));
      setNewSkill('');
      setError('');
    } else if (trimmedSkill && formData.skills.includes(trimmedSkill)) {
      setError('Esta habilidade já foi adicionada.');
    } else {
      setError('Por favor, digite uma habilidade.');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove),
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
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
      
      setAvatarFile(file);
      setHasAvatarChanges(true);
      
      // Criar preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      setLoading(true);
      await deleteAvatar();
      setAvatarPreview(null);
      setAvatarFile(null);
      setHasAvatarChanges(false);
      setSuccess('Avatar removido com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Erro ao remover avatar.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      // Validar dados
      if (formData.name && formData.name.length < 2) {
        setError('O nome deve ter pelo menos 2 caracteres.');
        setSaving(false);
        return;
      }

      if (formData.name && formData.name.length > 100) {
        setError('O nome deve ter no máximo 100 caracteres.');
        setSaving(false);
        return;
      }

      if (formData.bio && formData.bio.length > 500) {
        setError('A biografia deve ter no máximo 500 caracteres.');
        setSaving(false);
        return;
      }

      // Upload avatar se houver mudanças
      if (hasAvatarChanges && avatarFile) {
        try {
          const avatarResult = await uploadAvatar(avatarFile);
          if (avatarResult.success && avatarResult.avatar) {
            setAvatarPreview(avatarResult.avatar);
            setHasAvatarChanges(false);
            setAvatarFile(null);
          }
        } catch (avatarError) {
          setError(avatarError.message || 'Erro ao fazer upload do avatar.');
          setSaving(false);
          return;
        }
      }

      // Atualizar perfil
      const profileData = {};
      
      if (formData.name !== state.user?.name) {
        profileData.name = formData.name;
      }
      
      if (formData.bio !== (state.user?.bio || '')) {
        profileData.bio = formData.bio;
      }
      
      if (JSON.stringify(formData.skills) !== JSON.stringify(state.user?.skills || [])) {
        profileData.skills = formData.skills;
      }

      // Só atualizar se houver mudanças
      if (Object.keys(profileData).length > 0) {
        const result = await updateProfile(profileData);
        
        if (result.success) {
          setSuccess('Perfil atualizado com sucesso!');
          actions.showToast('Perfil atualizado com sucesso!', 'success');
          
          // Atualizar dados do usuário no contexto
          await actions.refreshUser();
          
          setTimeout(() => {
            actions.setCurrentPage('profile');
          }, 1500);
        } else {
          setError(result.error || 'Erro ao atualizar perfil.');
        }
      } else {
        setSuccess('Nenhuma alteração foi feita.');
        setTimeout(() => {
          actions.setCurrentPage('profile');
        }, 1500);
      }
    } catch (err) {
      setError(err.message || 'Erro ao salvar perfil.');
      actions.showToast(err.message || 'Erro ao salvar perfil.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    actions.setCurrentPage('profile');
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <DashboardTemplate>
      <div className="edit-profile">
        {/* Header */}
        <div className="edit-profile__header">
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="edit-profile__back-button"
          >
            <ArrowLeft size={20} />
            Voltar
          </Button>
          <h1 className="edit-profile__title">Editar Perfil</h1>
        </div>

        <form onSubmit={handleSubmit} className="edit-profile__form">
          {/* Avatar Section */}
          <Card className="edit-profile__card" padding="large">
            <div className="edit-profile__avatar-section">
              <div className="edit-profile__avatar-container">
                <div className="edit-profile__avatar">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" />
                  ) : (
                    <User size={64} weight="duotone" />
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="edit-profile__file-input"
                  aria-label="Selecionar imagem de perfil"
                />
                <div className="edit-profile__avatar-actions">
                  <Button
                    type="button"
                    variant="outline"
                    size="small"
                    onClick={handleAvatarClick}
                  >
                    <Camera size={18} />
                    Alterar Foto
                  </Button>
                  {state.user?.avatar && (
                    <Button
                      type="button"
                      variant="danger"
                      size="small"
                      onClick={handleRemoveAvatar}
                      disabled={loading}
                      loading={loading}
                    >
                      <Trash size={18} />
                      Remover
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Personal Information */}
          <Card className="edit-profile__card" padding="large">
            <h2 className="edit-profile__section-title">Informações Pessoais</h2>
            
            <FormField
              label="Nome"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Seu nome completo"
              helperText="Mínimo 2 caracteres, máximo 100 caracteres"
              maxLength={100}
            />

            <FormField
              label="Biografia"
              name="bio"
              type="textarea"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Conte um pouco sobre você..."
              helperText={`${formData.bio.length}/500 caracteres`}
              rows={5}
              maxLength={500}
            />
          </Card>

          {/* Skills Section */}
          <Card className="edit-profile__card" padding="large">
            <h2 className="edit-profile__section-title">Habilidades</h2>
            <p className="edit-profile__section-description">
              Adicione suas habilidades e áreas de expertise
            </p>

            <div className="edit-profile__skills-input">
              <div className="edit-profile__skills-input-wrapper">
                <FormField
                  label="Nova Habilidade"
                  name="newSkill"
                  type="text"
                  value={newSkill}
                  onChange={(e) => {
                    setNewSkill(e.target.value);
                    setError('');
                  }}
                  placeholder="Ex: JavaScript, React, Design..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill(e);
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="primary"
                  size="medium"
                  onClick={handleAddSkill}
                  disabled={!newSkill.trim()}
                  className="edit-profile__add-skill-button"
                  aria-label="Adicionar habilidade"
                >
                  <Check size={18} />
                  Adicionar
                </Button>
              </div>
            </div>

            {formData.skills.length > 0 && (
              <div className="edit-profile__skills-list">
                {formData.skills.map((skill, index) => (
                  <div key={index} className="edit-profile__skill-tag">
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="edit-profile__skill-remove"
                      aria-label={`Remover habilidade ${skill}`}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {formData.skills.length === 0 && (
              <div className="edit-profile__empty-skills">
                <p>Nenhuma habilidade adicionada ainda.</p>
              </div>
            )}
          </Card>

          {/* Messages */}
          {error && (
            <div className="edit-profile__error" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="edit-profile__success" role="alert">
              {success}
            </div>
          )}

          {/* Actions */}
          <div className="edit-profile__actions">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={saving}
              disabled={saving}
            >
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardTemplate>
  );
};

export default EditProfile;

