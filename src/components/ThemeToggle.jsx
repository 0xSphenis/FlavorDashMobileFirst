import "./ThemeToggle.css";

/**
 * ThemeToggle
 * Botão com ícone ☀️/🌙 que alterna entre modo claro e escuro.
 */
const ThemeToggle = ({ isDark, onToggle }) => {
  return (
    <button
      type="button"
      className={`theme-toggle ${isDark ? "theme-toggle--dark" : "theme-toggle--light"}`}
      onClick={onToggle}
      aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
      title={isDark ? "Modo claro" : "Modo escuro"}
    >
      {/* Ícone lua */}
      <span className="theme-icon theme-icon--moon" aria-hidden="true">
        🌙
      </span>
      {/* Ícone sol */}
      <span className="theme-icon theme-icon--sun" aria-hidden="true">
        ☀️
      </span>
    </button>
  );
};

export default ThemeToggle;
