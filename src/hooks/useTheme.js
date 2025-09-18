import { useEffect } from 'react';
import { useApp } from '../contexts/AppContext';

export const useTheme = () => {
  const { state, actions } = useApp();

  useEffect(() => {
    const applyTheme = (theme) => {
      const root = document.documentElement;
      
      // Remove existing theme classes
      root.classList.remove('theme-light', 'theme-dark');
      root.removeAttribute('data-theme');
      
      if (theme === 'system') {
        // Use system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const actualTheme = prefersDark ? 'dark' : 'light';
        root.classList.add(`theme-${actualTheme}`);
        root.setAttribute('data-theme', actualTheme);
      } else {
        root.classList.add(`theme-${theme}`);
        root.setAttribute('data-theme', theme);
      }
    };

    applyTheme(state.settings.theme);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      if (state.settings.theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [state.settings.theme]);

  const setTheme = (theme) => {
    actions.updateSettings({ theme });
  };

  return {
    currentTheme: state.settings.theme,
    setTheme
  };
};
