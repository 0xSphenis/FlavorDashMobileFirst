import "./Pagination.css";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}) => {
  if (totalPages <= 1 && (!totalItems || totalItems <= itemsPerPage)) {
    return null;
  }

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems || 0);

  return (
    <div className="pagination-container">
      {totalItems !== undefined && totalItems > 0 && (
        <span className="pagination-info">
          Mostrando {startItem} a {endItem} de {totalItems} restaurantes
        </span>
      )}

      <div className="pagination-controls">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-btn nav-btn"
        >
          ← Anterior
        </button>

        <div className="pagination-pages">
          {pageNumbers.map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`pagination-btn page-btn ${
                currentPage === page ? "active" : ""
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-btn nav-btn"
        >
          Próximo →
        </button>
      </div>

      <span className="pagination-indicator">
        Página {currentPage} de {totalPages}
      </span>
    </div>
  );
};

export default Pagination;
