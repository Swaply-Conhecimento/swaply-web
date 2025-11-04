import { useEffect } from 'react';
import { useApp } from '../contexts';

export const useTheme = () => {
  const { state, actions } = useApp();

  useEffect(() => {
    // Don't apply theme if high contrast is active
    if (state.settings?.accessibility?.highContrast) {
      return;
    }

    const applyTheme = (theme) => {
      const root = document.documentElement;
      
      // Remove existing theme classes
      root.classList.remove('theme-light', 'theme-dark');
      
      // Only change data-theme if it's not high-contrast
      if (root.getAttribute('data-theme') !== 'high-contrast') {
        root.removeAttribute('data-theme');
      }
      
      if (theme === 'system') {
        // Use system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const actualTheme = prefersDark ? 'dark' : 'light';
        root.classList.add(`theme-${actualTheme}`);
        // Only set data-theme if high-contrast is not active
        if (!state.settings?.accessibility?.highContrast) {
          root.setAttribute('data-theme', actualTheme);
        }
      } else {
        root.classList.add(`theme-${theme}`);
        // Only set data-theme if high-contrast is not active
        if (!state.settings?.accessibility?.highContrast) {
          root.setAttribute('data-theme', theme);
        }
      }
    };

    applyTheme(state.settings.theme);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      if (state.settings.theme === 'system' && !state.settings?.accessibility?.highContrast) {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [state.settings.theme, state.settings?.accessibility?.highContrast]);

  const setTheme = (theme) => {
    actions.updateSettings({ theme });
  };

  return {
    currentTheme: state.settings.theme,
    setTheme
  };
};
