import { useEffect } from "react";
import { useApp } from "../contexts";

export const useAccessibility = () => {
  const { state, actions } = useApp();

  useEffect(() => {
    const root = document.documentElement;
    // Ensure language is pt-BR for accessibility tools
    try {
      root.setAttribute("lang", "pt-BR");
    } catch (error) {
      console.warn("Error setting language:", error);
    }

    // Apply font size
    root.setAttribute("data-font-size", state.settings.fontSize || 'medium');
  }, [state.settings.fontSize]);

  // Separate effect for high contrast theme (doesn't interfere with useTheme)
  useEffect(() => {
    const root = document.documentElement;
    try {
      if (state.settings?.accessibility?.highContrast) {
        root.setAttribute('data-theme', 'high-contrast');
      } else {
        // Remove high-contrast and let useTheme reapply the correct theme
        if (root.getAttribute('data-theme') === 'high-contrast') {
          root.removeAttribute('data-theme');
          // Trigger a re-render by dispatching a custom event that useTheme can listen to
          // Or just let React's state update handle it - the useTheme effect will run
          // because state.settings.accessibility.highContrast changed
        }
      }
    } catch (err) {
      console.warn('Error applying high-contrast:', err);
    }
  }, [state.settings?.accessibility?.highContrast, state.settings?.theme]);

  // Separate effect for VLibras to ensure it updates correctly
  useEffect(() => {
    const updateVLibras = () => {
      const vlibrasWidget = document.querySelector("div[vw]");
      if (vlibrasWidget) {
        const shouldShow = state.settings?.accessibility?.vlibras !== false;
        if (shouldShow) {
          vlibrasWidget.classList.remove("vlibras-hidden");
          vlibrasWidget.style.display = 'block';
          vlibrasWidget.style.visibility = 'visible';
        } else {
          vlibrasWidget.classList.add("vlibras-hidden");
          vlibrasWidget.style.display = 'none';
          vlibrasWidget.style.visibility = 'hidden';
        }
      }
    };

    // Try immediately
    updateVLibras();

    // Also try after a short delay in case widget loads later
    const timeout = setTimeout(updateVLibras, 100);
    
    return () => clearTimeout(timeout);
  }, [state.settings?.accessibility?.vlibras]);

  const setFontSize = (size) => {
    actions.updateSettings({ fontSize: size });
  };

  const toggleVLibras = (enabled) => {
    console.log("toggleVLibras called with:", enabled);
    actions.updateSettings({
      accessibility: {
        ...state.settings.accessibility,
        vlibras: enabled,
      },
    });
  };

  return {
    setFontSize,
    toggleVLibras,
    settings: state.settings.accessibility,
    fontSize: state.settings.fontSize,
  };
};
