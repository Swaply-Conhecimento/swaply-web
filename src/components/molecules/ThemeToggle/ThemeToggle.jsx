import React from "react";
import { useTheme } from "../../../hooks/useTheme";
import { Sun, Moon, Desktop } from "@phosphor-icons/react";
import "./ThemeToggle.css";

function ThemeToggle() {
  const { currentTheme, setTheme } = useTheme();

  const getThemeIcon = () => {
    switch (currentTheme) {
      case "light":
        return <Sun size={18} />;
      case "dark":
        return <Moon size={18} />;
      case "system":
        return <Desktop size={18} />;
      default:
        return <Sun size={18} />;
    }
  };

  const getThemeLabel = () => {
    switch (currentTheme) {
      case "light":
        return "Claro";
      case "dark":
        return "Escuro";
      case "system":
        return "Sistema";
      default:
        return "Tema";
    }
  };

  const toggleTheme = () => {
    const themes = ["light", "dark", "system"];
    const currentIndex = themes.indexOf(currentTheme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
  };

  return (
    <button
      className="theme-toggle-button"
      onClick={toggleTheme}
      aria-label={`Alternar tema. Tema atual: ${getThemeLabel()}`}
      title={`Tema atual: ${getThemeLabel()}`}
    >
      {getThemeIcon()}
      <span>{getThemeLabel()}</span>
    </button>
  );
}

export default ThemeToggle;
