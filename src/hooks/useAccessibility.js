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
    root.setAttribute("data-font-size", state.settings.fontSize);

    // Apply theme and high contrast preference
    try {
      if (state.settings?.accessibility?.highContrast) {
        root.setAttribute('data-theme', 'high-contrast');
      } else if (state.settings?.theme === 'dark') {
        root.setAttribute('data-theme', 'dark');
      } else {
        root.removeAttribute('data-theme');
      }
    } catch (err) {
      console.warn('Error applying theme/high-contrast:', err);
    }

    // VLibras control - show/hide the existing widget
    const vlibrasWidget = document.querySelector("div[vw]");
    if (vlibrasWidget) {
      if (state.settings.accessibility.vlibras) {
        console.log("Showing VLibras widget");
        vlibrasWidget.classList.remove("vlibras-hidden");
      } else {
        console.log("Hiding VLibras widget");
        vlibrasWidget.classList.add("vlibras-hidden");
      }
    }

    console.log("Accessibility settings:", state.settings.accessibility);
  }, [state.settings]);

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
