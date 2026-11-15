import "./Filterbar.css";

const CUISINES = [
  "Todos",
  "Brasileira",
  "Italiana",
  "Japonesa",
  "Mediterrânea",
  "Asiática",
  "Saladas & Bowls",
  "Fast Food",
];

const STATUS_OPTIONS = [
  { label: "Todos", value: "todos" },
  { label: "Abertos", value: "aberto" },
  { label: "Fechados", value: "fechado" },
];

const PRICE_RANGES = [
  { label: "Todos", value: "todos" },
  { label: "Até R$ 30", value: "baixo" },
  { label: "R$ 30 a R$ 45", value: "medio" },
  { label: "Acima de R$ 45", value: "alto" },
];

const FilterBar = ({
  selectedCuisine,
  onSelectCuisine,
  selectedStatus,
  onSelectStatus,
  selectedPrice = "todos",
  onSelectPrice,
  searchTerm,
  onSearchChange,
}) => {
  return (
    <section className="filter-bar" aria-label="Filtros de restaurantes">
      {onSearchChange && (
        <div className="filter-search-box">
          <input
            type="text"
            value={searchTerm || ""}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por nome, cozinha ou descrição..."
            className="filter-search-input"
          />
        </div>
      )}

      <div className="filter-group">
        <span className="filter-label">Cozinha:</span>
        <div className="filter-options">
          {CUISINES.map((cuisine) => (
            <button
              key={cuisine}
              type="button"
              onClick={() => onSelectCuisine(cuisine)}
              className={`filter-pill ${
                selectedCuisine === cuisine ? "active" : ""
              }`}
            >
              {cuisine}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <span className="filter-label">Status:</span>
        <div className="filter-options">
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onSelectStatus(option.value)}
              className={`filter-pill ${
                selectedStatus === option.value ? "active" : ""
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <span className="filter-label">Preço Médio:</span>
        <div className="filter-options">
          {PRICE_RANGES.map((range) => (
            <button
              key={range.value}
              type="button"
              onClick={() => onSelectPrice && onSelectPrice(range.value)}
              className={`filter-pill ${
                selectedPrice === range.value ? "active" : ""
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FilterBar;
