import { useEffect } from 'react';
import { useApp } from '../contexts/AppContext';

export const useAccessibility = () => {
  const { state, actions } = useApp();

  useEffect(() => {
    const root = document.documentElement;
    
    // Apply font size
    root.setAttribute('data-font-size', state.settings.fontSize);
    
    // Apply VLibras if enabled
    if (state.settings.accessibility.vlibras) {
      loadVLibras();
    }
    
    // Apply audio reading setup
    if (state.settings.accessibility.audioDescription) {
      setupAudioReading();
    }
    
    // Log current settings for debugging
    console.log('Accessibility settings:', state.settings.accessibility);
  }, [state.settings]);

  const loadVLibras = () => {
    // Check if VLibras is already loaded
    if (window.VLibras) {
      return;
    }

    // Create VLibras script
    const script = document.createElement('script');
    script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
    script.async = true;
    script.onload = () => {
      if (window.VLibras) {
        new window.VLibras.Widget('https://vlibras.gov.br/app');
      }
    };
    document.head.appendChild(script);
  };

  const setupAudioReading = () => {
    // Setup Speech Synthesis for audio reading
    if ('speechSynthesis' in window) {
      // Audio reading is available
      console.log('Speech synthesis available');
    }
  };

  const readText = (text) => {
    if (!state.settings.accessibility.audioDescription) {
      console.log('Audio reading is disabled');
      return;
    }

    if ('speechSynthesis' in window) {
      try {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        utterance.onstart = () => {
          console.log('Started reading:', text);
          actions.setReading(true);
        };
        
        utterance.onend = () => {
          console.log('Finished reading');
          actions.setReading(false);
        };
        
        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event);
          actions.setReading(false);
        };
        
        // Small delay to ensure previous speech is cancelled
        setTimeout(() => {
          window.speechSynthesis.speak(utterance);
        }, 100);
        
      } catch (error) {
        console.error('Error in readText:', error);
        actions.setReading(false);
      }
    } else {
      console.log('Speech synthesis not supported');
    }
  };

  const stopReading = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      actions.setReading(false);
    }
  };

  const setFontSize = (size) => {
    actions.updateSettings({ fontSize: size });
  };

  const toggleVLibras = (enabled) => {
    actions.updateSettings({ 
      accessibility: { 
        ...state.settings.accessibility, 
        vlibras: enabled 
      } 
    });
  };

  const toggleAudioReading = (enabled) => {
    actions.updateSettings({ 
      accessibility: { 
        ...state.settings.accessibility, 
        audioDescription: enabled 
      } 
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
    fontSize: state.settings.fontSize
  };
};
