import { useState } from "react";
import "./RestaurantCard.css";

const RestaurantCard = ({
  id,
  name,
  cuisine,
  isOpen,
  _lastUpdate,
  description,
  rating = 4.8,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const [details, setDetails] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchRestaurantDetails() {
    if (details) {
      setDetails(null);
      setMenu([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const detailsResponse = await fetch(`/restaurantDetails${id}.json`);
      if (!detailsResponse.ok) {
        throw new Error("Não foi possível carregar os detalhes.");
      }
      const detailsData = await detailsResponse.json();
      setDetails(detailsData);

      const menuResponse = await fetch(`/restaurantMenu${id}.json`);
      if (!menuResponse.ok) {
        throw new Error("Não foi possível carregar o cardápio.");
      }
      const menuData = await menuResponse.json();
      setMenu(menuData);
    } catch (err) {
      setError(err.message || "Erro ao carregar informações do restaurante.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <article className="restaurant-card">
      <div className="card-badges">
        <span className={`badge-status ${isOpen ? "aberto" : "fechado"}`}>
          <span className="status-dot"></span>
          {isOpen ? "aberto" : "fechado"}
        </span>
        <span className="badge-cuisine">{cuisine}</span>
      </div>

      <div className="card-body">
        <div className="card-header">
          <h2 className="card-title">{name}</h2>
          <div className="card-header-actions">
            <button
              type="button"
              className={`favorite-btn ${isFavorite ? "active" : ""}`}
              onClick={() => onToggleFavorite && onToggleFavorite(id)}
              aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            >
              {isFavorite ? "★" : "☆"}
            </button>
            <span className="card-rating">★ {rating}</span>
          </div>
        </div>

        <p className="card-description">{description}</p>

        {loading && <p className="details-loading">Carregando detalhes e cardápio...</p>}

        {error && <p className="details-error">{error}</p>}

        {details && (
          <div className="card-details">
            <p><strong>Endereço:</strong> {details.address}</p>
            <p><strong>Horário:</strong> {details.openingHours}</p>
            <p><strong>Telefone:</strong> {details.phone}</p>
            <p><strong>Destaque:</strong> {details.highlight}</p>

            {menu.length > 0 && (
              <div className="card-menu">
                <h3 className="menu-title">Cardápio</h3>
                <ul className="menu-list">
                  {menu.map((item) => (
                    <li key={item.id} className="menu-item">
                      <div className="menu-item-header">
                        <span className="menu-item-name">{item.name}</span>
                        <span className="menu-item-price">
                          R$ {item.price.toFixed(2).replace(".", ",")}
                        </span>
                      </div>
                      <p className="menu-item-description">{item.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="card-footer">
          <button
            type="button"
            onClick={fetchRestaurantDetails}
            className="details-btn"
            disabled={loading}
          >
            {details ? "Ocultar detalhes" : "Ver detalhes →"}
          </button>
        </div>
      </div>
    </article>
  );
};

export default RestaurantCard;