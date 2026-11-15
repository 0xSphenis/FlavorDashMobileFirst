import "./SortControls.css";

const SORT_OPTIONS = [
  { label: "Nome", value: "name" },
  { label: "Tipo de Cozinha", value: "cuisine" },
  { label: "Última Atualização", value: "lastUpdate" },
  { label: "Status de Funcionamento", value: "isOpen" },
  { label: "Nº de Pratos no Cardápio", value: "menuCount" },
];

const SortControls = ({
  sortBy,
  onSortChange,
  onChange,
  sortDirection = "asc",
  onToggleDirection,
}) => {
  const handleSort = onSortChange || onChange;

  return (
    <section className="sort-controls" aria-label="Controles de ordenação">
      <div className="sort-group">
        <span className="sort-label">Ordenar por:</span>
        <div className="sort-options">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSort && handleSort(option.value)}
              className={`sort-pill ${sortBy === option.value ? "active" : ""}`}
            >
              {option.label}
              {sortBy === option.value && (
                <span className="sort-indicator">
                  {sortDirection === "asc" ? " ↑" : " ↓"}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onToggleDirection}
        className="sort-direction-btn"
      >
        {sortDirection === "asc" ? "Crescente ↑" : "Decrescente ↓"}
      </button>
    </section>
  );
};

export default SortControls;
