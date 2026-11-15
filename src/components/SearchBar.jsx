import "./SearchBar.css";

const SearchBar = ({
  searchTerm,
  onSearchChange,
  onChange,
  placeholder = "Buscar por nome, cozinha ou descrição...",
}) => {
  const handleChange = onSearchChange || onChange;

  return (
    <div className="search-bar">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => handleChange && handleChange(e.target.value)}
        placeholder={placeholder}
        className="search-input"
        aria-label="Buscar restaurantes"
      />
      {searchTerm && (
        <button
          type="button"
          onClick={() => handleChange && handleChange("")}
          className="search-clear-btn"
          aria-label="Limpar busca"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBar;
