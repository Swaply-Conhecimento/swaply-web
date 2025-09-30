import { useEffect } from "react";
import { useApp } from "../contexts/AppContext";

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

    // Apply audio reading setup
    if (state.settings.accessibility.audioDescription) {
      setupAudioReading();
    }

    console.log("Accessibility settings:", state.settings.accessibility);
  }, [state.settings]);

  const setupAudioReading = () => {
    // Setup Speech Synthesis for audio reading
    if ("speechSynthesis" in window) {
      console.log("Speech synthesis available");
    }
  };

  const readText = (text) => {
    if (!state.settings.accessibility.audioDescription) {
      console.log("Audio reading is disabled");
      return;
    }

    if ("speechSynthesis" in window) {
      try {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "pt-BR";
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;

        utterance.onstart = () => {
          console.log("Started reading:", text);
          actions.setReading(true);
        };

        utterance.onend = () => {
          console.log("Finished reading");
          actions.setReading(false);
        };

        utterance.onerror = (event) => {
          console.error("Speech synthesis error:", event);
          actions.setReading(false);
        };

        // Small delay to ensure previous speech is cancelled
        setTimeout(() => {
          window.speechSynthesis.speak(utterance);
        }, 100);
      } catch (error) {
        console.error("Error in readText:", error);
        actions.setReading(false);
      }
    } else {
      console.log("Speech synthesis not supported");
    }
  };

  const stopReading = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      actions.setReading(false);
    }
  };

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

  const toggleAudioReading = (enabled) => {
    actions.updateSettings({
      accessibility: {
        ...state.settings.accessibility,
        audioDescription: enabled,
      },
    });

    if (!enabled) {
      stopReading();
    }
  };

  return {
    readText,
    stopReading,
    setFontSize,
    toggleVLibras,
    toggleAudioReading,
    isReading: state.isReading,
    settings: state.settings.accessibility,
    fontSize: state.settings.fontSize,
  };
};
