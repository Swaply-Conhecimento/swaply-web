import { useState, useEffect } from "react";
import { useApp } from "../../../contexts";
import "./FontControls.css";

export default function FontControls() {
  const { state, actions } = useApp();
  const [fontSize, setFontSize] = useState(() => {
    const fontSizes = { small: 90, medium: 100, large: 110 };
    return fontSizes[state.settings.fontSize] || 100;
  });

  // Apply font size to the whole page
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
  }, [fontSize]);

  const increaseFont = () => {
    const newSize = Math.min(fontSize + 10, 130);
    setFontSize(newSize);

    // Update context based on size ranges
    let contextSize = "medium";
    if (newSize <= 90) contextSize = "small";
    else if (newSize >= 110) contextSize = "large";

    actions.updateSettings({ fontSize: contextSize });
  };

  const decreaseFont = () => {
    const newSize = Math.max(fontSize - 10, 70);
    setFontSize(newSize);

    // Update context based on size ranges
    let contextSize = "medium";
    if (newSize <= 90) contextSize = "small";
    else if (newSize >= 110) contextSize = "large";

    actions.updateSettings({ fontSize: contextSize });
  };

  const resetFont = () => {
    setFontSize(100);
    actions.updateSettings({ fontSize: "medium" });
  };

  return (
    <div id="accessibility-controls" aria-label="Controles de tamanho de fonte">
      <button
        onClick={increaseFont}
        aria-label="Aumentar tamanho do texto"
        title="Aumentar fonte"
      >
        A+
      </button>
      <button
        onClick={decreaseFont}
        aria-label="Diminuir tamanho do texto"
        title="Diminuir fonte"
      >
        A-
      </button>
      <button
        onClick={resetFont}
        aria-label="Resetar tamanho do texto"
        title="Resetar fonte"
      >
        A
      </button>
    </div>
  );
}
