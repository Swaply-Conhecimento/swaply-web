# 🎨 Melhorias de UX/UI e Acessibilidade - Swaply

Documento completo de análise e melhorias propostas para a plataforma Swaply, focando em experiência do usuário, interface moderna e acessibilidade.

---

## 📊 Análise Atual

### ✅ Pontos Fortes Identificados

1. **Sistema de Design Tokens** - Bem estruturado com variáveis CSS
2. **Dark Theme** - Implementado e funcional
3. **Acessibilidade Básica** - VLibras, leitura de áudio, controle de fonte
4. **Estrutura de Componentes** - Atomic Design bem aplicado
5. **Responsividade Parcial** - Alguns breakpoints implementados

### ⚠️ Oportunidades de Melhoria

1. **Acessibilidade ARIA** - Faltam atributos em muitos componentes
2. **Navegação por Teclado** - Limitada ou ausente em alguns componentes
3. **Feedback Visual** - Estados de loading e erro podem ser melhorados
4. **Contraste de Cores** - Algumas cores podem não atender WCAG AA
5. **Landmarks e Estrutura Semântica** - Falta hierarquia semântica clara
6. **Gerenciamento de Foco** - Melhorias necessárias em modais e navegação
7. **Animações e Transições** - Podem ser mais suaves e consistentes

---

## 🎯 Melhorias Prioritárias

### 1. Acessibilidade (WCAG 2.1 AA)

#### 1.1 Estrutura Semântica e Landmarks

**Problema:** Falta de landmarks e estrutura semântica adequada.

**Solução:** Adicionar landmarks ARIA e elementos semânticos HTML5.

**Arquivos a modificar:**
- `src/components/templates/DashboardTemplate.jsx`
- `src/components/organisms/Sidebar/Sidebar.jsx`
- `src/components/pages/Dashboard/Dashboard.jsx`

**Código exemplo:**

```jsx
// DashboardTemplate.jsx
<main role="main" aria-label="Conteúdo principal">
  <aside role="complementary" aria-label="Barra lateral">
    <Sidebar />
  </aside>
  <div className="dashboard-content" role="region" aria-label="Área de conteúdo">
    {children}
  </div>
</main>

// Skip Links para navegação por teclado
<a href="#main-content" className="skip-link">
  Ir para conteúdo principal
</a>
```

---

#### 1.2 Atributos ARIA Completos

**Problema:** Muitos componentes não têm atributos ARIA adequados.

**Soluções por componente:**

**Button.jsx:**
```jsx
<button
  type={type}
  className={buttonClass}
  disabled={disabled || loading}
  onClick={onClick}
  aria-busy={loading}
  aria-disabled={disabled || loading}
  aria-label={loading ? `${children} - Carregando...` : undefined}
  {...props}
>
```

**Toggle.jsx:**
```jsx
<div 
  className={toggleClass}
  role="switch"
  aria-checked={checked}
  aria-disabled={disabled}
  aria-labelledby={labelId}
  onClick={handleToggle}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  }}
  tabIndex={disabled ? -1 : 0}
>
```

**Modal.jsx:**
```jsx
<div
  className="modal-overlay"
  onClick={handleOverlayClick}
  role="dialog"
  aria-modal="true"
  aria-labelledby={titleId}
  aria-describedby={contentId}
>
  <div className={modalClass}>
    {/* ... */}
  </div>
</div>
```

**FormField.jsx:**
```jsx
<div className="form-field" role="group">
  <label htmlFor={inputId} id={`${inputId}-label`}>
    {label}
    {required && <span aria-label="obrigatório">*</span>}
  </label>
  <input
    id={inputId}
    aria-labelledby={`${inputId}-label`}
    aria-describedby={errorId}
    aria-invalid={!!displayError}
    aria-required={required}
    {...props}
  />
  {displayError && (
    <div id={errorId} role="alert" aria-live="polite">
      {displayError}
    </div>
  )}
</div>
```

---

#### 1.3 Navegação por Teclado

**Problema:** Navegação por teclado limitada.

**Solução:** Implementar navegação completa por teclado.

**Sidebar.jsx - Melhorias:**
```jsx
const handleKeyDown = (e, item) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    handleMenuClick(item);
  }
  
  // Navegação com setas
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    const currentIndex = menuItems.findIndex(i => i.id === item.id);
    const nextIndex = e.key === 'ArrowDown' 
      ? (currentIndex + 1) % menuItems.length
      : (currentIndex - 1 + menuItems.length) % menuItems.length;
    const nextItem = menuItems[nextIndex];
    document.getElementById(`menu-item-${nextItem.id}`)?.focus();
  }
};

<button
  id={`menu-item-${item.id}`}
  className={`sidebar__menu-button ${...}`}
  onClick={() => handleMenuClick(item)}
  onKeyDown={(e) => handleKeyDown(e, item)}
  aria-current={state.currentPage === item.page ? 'page' : undefined}
  role="menuitem"
>
```

---

#### 1.4 Gerenciamento de Foco

**Problema:** Foco não é gerenciado adequadamente em modais e transições.

**Solução:** Implementar focus trap e gerenciamento de foco.

**Modal.jsx - Melhorias:**
```jsx
import { useEffect, useRef } from 'react';

const Modal = ({ isOpen, onClose, ... }) => {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Salvar elemento que tinha foco
      previousFocusRef.current = document.activeElement;
      
      // Focar no modal
      setTimeout(() => {
        modalRef.current?.focus();
      }, 100);

      // Focus trap
      const handleTab = (e) => {
        if (e.key !== 'Tab') return;
        
        const focusableElements = modalRef.current?.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input:not([disabled]), select, [tabindex]:not([tabindex="-1"])'
        );
        
        if (!focusableElements?.length) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      };

      document.addEventListener('keydown', handleTab);
      
      return () => {
        document.removeEventListener('keydown', handleTab);
        // Restaurar foco anterior
        previousFocusRef.current?.focus();
      };
    }
  }, [isOpen]);

  return (
    <div
      ref={modalRef}
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      {...props}
    >
      {/* ... */}
    </div>
  );
};
```

---

### 2. Melhorias de UX

#### 2.1 Estados de Loading Melhorados

**Problema:** Estados de loading genéricos e pouco informativos.

**Solução:** Implementar skeleton loaders e loading states mais específicos.

**Novo componente: SkeletonLoader.jsx**

```jsx
import React from 'react';
import PropTypes from 'prop-types';
import './SkeletonLoader.css';

const SkeletonLoader = ({ 
  variant = 'text', 
  width, 
  height, 
  className = '',
  count = 1 
}) => {
  const variants = {
    text: 'skeleton--text',
    circular: 'skeleton--circular',
    rectangular: 'skeleton--rectangular',
    card: 'skeleton--card',
  };

  const items = Array.from({ length: count });

  return (
    <>
      {items.map((_, index) => (
        <div
          key={index}
          className={`skeleton ${variants[variant]} ${className}`}
          style={{ width, height }}
          aria-label="Carregando conteúdo"
          role="status"
          aria-live="polite"
        >
          <span className="sr-only">Carregando...</span>
        </div>
      ))}
    </>
  );
};

export default SkeletonLoader;
```

**SkeletonLoader.css:**
```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-neutral-200) 0%,
    var(--color-neutral-100) 50%,
    var(--color-neutral-200) 100%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  border-radius: var(--radius-base);
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.skeleton--text {
  height: 1em;
  width: 100%;
  margin-bottom: 0.5em;
}

.skeleton--circular {
  border-radius: 50%;
  aspect-ratio: 1;
}

.skeleton--card {
  height: 300px;
  border-radius: var(--radius-lg);
}

[data-theme="dark"] .skeleton {
  background: linear-gradient(
    90deg,
    var(--color-neutral-700) 0%,
    var(--color-neutral-600) 50%,
    var(--color-neutral-700) 100%
  );
  background-size: 200% 100%;
}
```

**Uso no CourseGrid:**
```jsx
{loading && (
  <div className="course-grid__container">
    {Array.from({ length: 6 }).map((_, index) => (
      <SkeletonLoader key={index} variant="card" />
    ))}
  </div>
)}
```

---

#### 2.2 Sistema de Notificações Toast

**Problema:** Não há feedback visual para ações do usuário (sucesso, erro, etc).

**Solução:** Criar sistema de toast notifications.

**Novo componente: Toast.jsx**

```jsx
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { CheckCircle, XCircle, Warning, Info, X } from '@phosphor-icons/react';
import './Toast.css';

const Toast = ({ 
  id,
  message, 
  type = 'info', 
  duration = 5000, 
  onClose 
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle size={20} />,
    error: <XCircle size={20} />,
    warning: <Warning size={20} />,
    info: <Info size={20} />,
  };

  return (
    <div 
      className={`toast toast--${type}`}
      role="alert"
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      aria-atomic="true"
    >
      <div className="toast__icon">{icons[type]}</div>
      <div className="toast__message">{message}</div>
      <button
        className="toast__close"
        onClick={onClose}
        aria-label="Fechar notificação"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
```

**ToastContainer.jsx:**
```jsx
import React from 'react';
import { useApp } from '../../contexts';
import Toast from '../atoms/Toast';
import './ToastContainer.css';

const ToastContainer = () => {
  const { state } = useApp();
  const toasts = state.toasts || [];

  return (
    <div 
      className="toast-container"
      role="region"
      aria-label="Notificações"
      aria-live="polite"
    >
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
};

export default ToastContainer;
```

**Adicionar ao AppContext:**
```jsx
// Action types
ADD_TOAST: 'ADD_TOAST',
REMOVE_TOAST: 'REMOVE_TOAST',

// Reducer
case actionTypes.ADD_TOAST:
  return {
    ...state,
    toasts: [...state.toasts, action.payload],
  };

case actionTypes.REMOVE_TOAST:
  return {
    ...state,
    toasts: state.toasts.filter(t => t.id !== action.payload),
  };

// Actions
showToast: (message, type = 'info', duration = 5000) => {
  const id = Date.now().toString();
  dispatch({
    type: actionTypes.ADD_TOAST,
    payload: { id, message, type, duration },
  });
  return id;
},

removeToast: (id) => {
  dispatch({ type: actionTypes.REMOVE_TOAST, payload: id });
},
```

---

#### 2.3 Empty States Melhorados

**Problema:** Empty states genéricos e pouco informativos.

**Solução:** Criar componente de empty state reutilizável.

**EmptyState.jsx:**
```jsx
import React from 'react';
import PropTypes from 'prop-types';
import Button from '../atoms/Button';
import './EmptyState.css';

const EmptyState = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`empty-state ${className}`} role="status">
      <div className="empty-state__icon" aria-hidden="true">
        {icon || '📭'}
      </div>
      <h3 className="empty-state__title">{title}</h3>
      {description && (
        <p className="empty-state__description">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button
          variant="primary"
          onClick={onAction}
          className="empty-state__action"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
```

**Uso:**
```jsx
{courses.length === 0 && (
  <EmptyState
    icon="📚"
    title="Nenhum curso encontrado"
    description="Não há cursos disponíveis no momento. Que tal criar um?"
    actionLabel="Criar Curso"
    onAction={() => actions.openModal('addCourse')}
  />
)}
```

---

#### 2.4 Melhorias de Feedback Visual

**Problema:** Falta feedback visual em interações.

**Soluções:**

**1. Botões com estados visuais:**
```css
.btn {
  position: relative;
  overflow: hidden;
}

.btn::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.btn:active::after {
  width: 300px;
  height: 300px;
}
```

**2. Cards com hover melhorado:**
```css
.course-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.course-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.course-card:active {
  transform: translateY(-2px);
}
```

---

### 3. Melhorias de Design

#### 3.1 Contraste de Cores (WCAG AA)

**Problema:** Algumas cores podem não atender ao contraste mínimo.

**Solução:** Verificar e ajustar contraste.

**Verificação e ajustes em globals.css:**
```css
/* Melhorar contraste em texto sobre fundo claro */
--color-text-primary: var(--color-neutral-900); /* 4.5:1 mínimo */
--color-text-secondary: var(--color-neutral-700); /* 4.5:1 mínimo */
--color-text-disabled: var(--color-neutral-400); /* 3:1 mínimo para desabilitado */

/* Melhorar contraste em botões */
--color-primary-800: #5459AC; /* Verificar se atende 4.5:1 sobre branco */
--color-primary-900: #52357B; /* Para melhor contraste */

/* Adicionar variáveis de contraste garantido */
--color-text-on-primary: #FFFFFF; /* Garantir contraste sobre primário */
--color-text-on-dark: #F8FAFC; /* Garantir contraste sobre dark theme */
```

**Adicionar classes utilitárias:**
```css
.text-primary {
  color: var(--color-text-primary);
}

.text-secondary {
  color: var(--color-text-secondary);
}

.bg-primary-contrast {
  background-color: var(--color-primary-900);
  color: var(--color-text-on-primary);
}
```

---

#### 3.2 Espaçamento Consistente

**Problema:** Espaçamento inconsistente em alguns componentes.

**Solução:** Usar sistema de espaçamento consistente.

**Melhorias em componentes:**
```css
/* Adicionar espaçamento consistente */
.section {
  padding: var(--spacing-8) var(--spacing-4);
}

.section--compact {
  padding: var(--spacing-4);
}

.section--spacious {
  padding: var(--spacing-12) var(--spacing-6);
}

/* Grid gaps consistentes */
.grid {
  display: grid;
  gap: var(--spacing-6);
}

.grid--compact {
  gap: var(--spacing-4);
}

.grid--spacious {
  gap: var(--spacing-8);
}
```

---

#### 3.3 Tipografia Melhorada

**Problema:** Hierarquia tipográfica pode ser mais clara.

**Solução:** Melhorar sistema tipográfico.

**Adicionar em globals.css:**
```css
/* Tipografia melhorada */
.heading-1 {
  font-size: var(--font-size-4xl);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.heading-2 {
  font-size: var(--font-size-3xl);
  font-weight: 600;
  line-height: 1.25;
  letter-spacing: -0.01em;
}

.heading-3 {
  font-size: var(--font-size-2xl);
  font-weight: 600;
  line-height: 1.3;
}

.body-large {
  font-size: var(--font-size-lg);
  line-height: 1.6;
}

.body-base {
  font-size: var(--font-size-base);
  line-height: 1.6;
}

.body-small {
  font-size: var(--font-size-sm);
  line-height: 1.5;
}

.caption {
  font-size: var(--font-size-xs);
  line-height: 1.4;
  color: var(--color-neutral-600);
}
```

---

### 4. Responsividade

#### 4.1 Breakpoints Consistentes

**Problema:** Breakpoints podem ser mais consistentes.

**Solução:** Usar breakpoints do design system.

**Melhorias:**
```css
/* Breakpoints consistentes */
@media (max-width: 640px) {
  /* Mobile */
}

@media (min-width: 641px) and (max-width: 1024px) {
  /* Tablet */
}

@media (min-width: 1025px) {
  /* Desktop */
}

/* Utilities responsivas */
.responsive-grid {
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .responsive-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .responsive-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1280px) {
  .responsive-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

---

#### 4.2 Sidebar Responsiva

**Problema:** Sidebar pode melhorar em mobile.

**Solução:** Implementar sidebar mobile com overlay.

**Melhorias em Sidebar.css:**
```css
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    z-index: var(--z-index-fixed);
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .sidebar--open {
    transform: translateX(0);
  }

  .sidebar-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: calc(var(--z-index-fixed) - 1);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }

  .sidebar-overlay--visible {
    opacity: 1;
    pointer-events: auto;
  }
}
```

---

### 5. Performance e Otimização

#### 5.1 Lazy Loading de Imagens

**Problema:** Imagens podem ser carregadas de forma não otimizada.

**Solução:** Implementar lazy loading.

**Melhorias em CourseCard:**
```jsx
<img 
  src={image} 
  alt={title}
  className="course-card__image"
  loading="lazy"
  decoding="async"
  onError={(e) => {
    e.target.src = '/placeholder-course.jpg';
  }}
/>
```

---

#### 5.2 Code Splitting

**Problema:** Bundle pode ser otimizado.

**Solução:** Implementar code splitting por rotas.

**Melhorias em App.jsx:**
```jsx
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./components/pages/Dashboard'));
const Profile = lazy(() => import('./components/pages/Profile'));
// ... outros componentes

const renderCurrentPage = () => {
  return (
    <Suspense fallback={<LoadingScreen message="Carregando página..." />}>
      {/* ... */}
    </Suspense>
  );
};
```

---

## 📝 Checklist de Implementação

### Fase 1: Acessibilidade Crítica (Prioridade Alta)
- [ ] Adicionar landmarks ARIA em todos os templates
- [ ] Implementar skip links
- [ ] Adicionar atributos ARIA em todos os componentes interativos
- [ ] Implementar navegação por teclado completa
- [ ] Adicionar focus trap em modais
- [ ] Melhorar contraste de cores (WCAG AA)
- [ ] Adicionar aria-live regions para feedback

### Fase 2: UX Básica (Prioridade Alta)
- [ ] Criar componente Toast
- [ ] Implementar sistema de notificações
- [ ] Criar SkeletonLoader
- [ ] Melhorar estados de loading
- [ ] Criar EmptyState component
- [ ] Adicionar feedback visual em ações

### Fase 3: Design System (Prioridade Média)
- [ ] Melhorar sistema tipográfico
- [ ] Padronizar espaçamento
- [ ] Adicionar animações suaves
- [ ] Melhorar estados hover/focus
- [ ] Criar componentes de feedback (toast, alert, etc)

### Fase 4: Responsividade (Prioridade Média)
- [ ] Melhorar sidebar mobile
- [ ] Otimizar grid responsivo
- [ ] Ajustar breakpoints
- [ ] Melhorar touch targets (mínimo 44x44px)

### Fase 5: Performance (Prioridade Baixa)
- [ ] Implementar lazy loading de imagens
- [ ] Code splitting por rotas
- [ ] Otimizar re-renders
- [ ] Adicionar memoização onde necessário

---

## 🎨 Componentes Novos a Criar

### 1. Toast/ToastContainer
**Localização:** `src/components/molecules/Toast/`
**Prioridade:** Alta
**Complexidade:** Baixa

### 2. SkeletonLoader
**Localização:** `src/components/atoms/SkeletonLoader/`
**Prioridade:** Alta
**Complexidade:** Baixa

### 3. EmptyState
**Localização:** `src/components/molecules/EmptyState/`
**Prioridade:** Média
**Complexidade:** Baixa

### 4. SkipLink
**Localização:** `src/components/atoms/SkipLink/`
**Prioridade:** Alta
**Complexidade:** Muito Baixa

### 5. ErrorBoundary
**Localização:** `src/components/molecules/ErrorBoundary/`
**Prioridade:** Média
**Complexidade:** Média

---

## 🔧 Utilitários e Helpers

### useKeyboardNavigation Hook
```jsx
// src/hooks/useKeyboardNavigation.js
export const useKeyboardNavigation = (items, onSelect) => {
  const [focusedIndex, setFocusedIndex] = useState(0);

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => (prev + 1) % items.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => (prev - 1 + items.length) % items.length);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        onSelect(items[focusedIndex]);
        break;
      case 'Home':
        e.preventDefault();
        setFocusedIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setFocusedIndex(items.length - 1);
        break;
    }
  };

  return { focusedIndex, handleKeyDown };
};
```

### useFocusTrap Hook
```jsx
// src/hooks/useFocusTrap.js
export const useFocusTrap = (containerRef, isActive) => {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const focusableElements = containerRef.current.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input:not([disabled]), select, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTab = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    firstElement.focus();
    document.addEventListener('keydown', handleTab);

    return () => {
      document.removeEventListener('keydown', handleTab);
    };
  }, [isActive, containerRef]);
};
```

---

## 📱 Melhorias Mobile-First

### 1. Touch Targets
Todos os elementos interativos devem ter no mínimo 44x44px (WCAG 2.1).

```css
.btn--small {
  min-height: 44px;
  min-width: 44px;
}

@media (max-width: 768px) {
  .btn {
    min-height: 48px; /* Aumentar em mobile */
    padding: var(--spacing-3) var(--spacing-5);
  }
}
```

### 2. Gestos
Adicionar suporte a gestos touch onde apropriado.

```jsx
// Swipe para fechar sidebar em mobile
const useSwipe = (onSwipeLeft, onSwipeRight) => {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) onSwipeLeft();
    if (isRightSwipe) onSwipeRight();
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
};
```

---

## 🎭 Animações e Transições

### 1. Micro-interações
Adicionar micro-interações para melhorar feedback.

```css
/* Hover suave */
.interactive {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.interactive:hover {
  transform: translateY(-2px);
}

.interactive:active {
  transform: translateY(0);
}

/* Loading spinner melhorado */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.spinner {
  animation: spin 1s linear infinite;
}
```

### 2. Transições de Página
```jsx
// Adicionar transições suaves entre páginas
import { AnimatePresence, motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

<AnimatePresence mode="wait">
  <motion.div
    key={state.currentPage}
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={{ duration: 0.3 }}
  >
    {renderCurrentPage()}
  </motion.div>
</AnimatePresence>
```

---

## 📊 Métricas de Sucesso

### Acessibilidade
- [ ] Score Lighthouse Acessibilidade: 100
- [ ] WCAG 2.1 AA compliance
- [ ] Navegação completa por teclado
- [ ] Screen reader friendly

### Performance
- [ ] Lighthouse Performance: > 90
- [ ] First Contentful Paint: < 1.5s
- [ ] Time to Interactive: < 3s

### UX
- [ ] Taxa de erro reduzida
- [ ] Tempo de tarefa reduzido
- [ ] Satisfação do usuário aumentada

---

## 🚀 Próximos Passos

1. **Implementar melhorias de acessibilidade** (Fase 1)
2. **Criar componentes de feedback** (Fase 2)
3. **Melhorar design system** (Fase 3)
4. **Otimizar responsividade** (Fase 4)
5. **Implementar otimizações de performance** (Fase 5)

---

**Data:** 2025-01-22  
**Versão:** 1.0.0  
**Status:** Proposto

