import { useState, useEffect } from "react";
import "./ColorBlindFilter.css";

const FILTERS = {
  normal: "none",
  protanopia: "url(#protanopia)",
  deuteranopia: "url(#deuteranopia)",
  tritanopia: "url(#tritanopia)",
  grayscale: "grayscale(100%)",
};

export default function ColorBlindFilter() {
  const [filter, setFilter] = useState(() => {
    return localStorage.getItem("colorblind-filter") || "normal";
  });

  useEffect(() => {
    document.documentElement.style.filter = FILTERS[filter];
    localStorage.setItem("colorblind-filter", filter);
  }, [filter]);

  return (
    <div id="colorblind-controls">
      <label htmlFor="colorblind-select">Filtro de Cores:</label>
      <select
        id="colorblind-select"
        aria-label="Selecionar filtro de cor para daltonismo"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="normal">Normal</option>
        <option value="protanopia">Protanopia</option>
        <option value="deuteranopia">Deuteranopia</option>
        <option value="tritanopia">Tritanopia</option>
        <option value="grayscale">Escala de Cinza</option>
      </select>
    </div>
  );
}
