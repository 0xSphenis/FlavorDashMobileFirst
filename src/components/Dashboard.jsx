import { useState, useEffect } from "react";
import "./Dashboard.css";
import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";
import SortControls from "./SortControls";
import Pagination from "./Pagination";
import RestaurantList from "./RestaurantList";
import RestaurantAdd from "./RestaurantAdd";

const Dashboard = () => {
  const [restaurantsData, setRestaurantsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("Todos");
  const [selectedStatus, setSelectedStatus] = useState("todos");
  const [selectedPrice, setSelectedPrice] = useState("todos");
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const itemsPerPage = 2;

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  useEffect(() => {
    async function fetchRestaurantsData() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/restaurants.json");
        if (!response.ok) {
          throw new Error("Erro ao buscar os dados dos restaurantes");
        }
        const data = await response.json();

        const dataWithMenu = await Promise.all(
          data.map(async (restaurant) => {
            let menu = [];
            let averagePrice = 0;

            try {
              const menuResponse = await fetch(`/restaurantMenu${restaurant.id}.json`);
              if (menuResponse.ok) {
                menu = await menuResponse.json();
                if (Array.isArray(menu) && menu.length > 0) {
                  const sum = menu.reduce((acc, item) => acc + item.price, 0);
                  averagePrice = sum / menu.length;
                }
              }
            } catch {
            }

            if (averagePrice === 0) {
              if (restaurant.id === 3) {
                averagePrice = 52;
              } else if (restaurant.id === 4) {
                averagePrice = 24;
              } else {
                averagePrice = 30;
              }
            }

            return {
              ...restaurant,
              menu,
              menuCount: menu.length,
              averagePrice,
            };
          })
        );

        setRestaurantsData(dataWithMenu);
      } catch (err) {
        setError(err.message || "Falha na requisição");
      } finally {
        setLoading(false);
      }
    }

    fetchRestaurantsData();
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  function toggleForm() {
    setIsFormVisible((prev) => !prev);
  }

  function addRestaurant(newRestaurant) {
    const restaurantWithDefaults = {
      ...newRestaurant,
      menu: [],
      menuCount: 0,
      averagePrice: 30,
    };
    setRestaurantsData((prev) => [...prev, restaurantWithDefaults]);
  }

  function toggleFavorite(id) {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((favId) => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  }

  function handleSearchChange(value) {
    setSearchTerm(value);
    setCurrentPage(1);
  }

  function handleCuisineChange(cuisine) {
    setSelectedCuisine(cuisine);
    setCurrentPage(1);
  }

  function handleStatusChange(status) {
    setSelectedStatus(status);
    setCurrentPage(1);
  }

  function handlePriceChange(price) {
    setSelectedPrice(price);
    setCurrentPage(1);
  }

  function handleToggleFavoritesView() {
    setShowOnlyFavorites((prev) => !prev);
    setCurrentPage(1);
  }

  function handleSortChange(criterion) {
    if (sortBy === criterion) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(criterion);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  }

  function handleToggleDirection() {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    setCurrentPage(1);
  }

  function handlePageChange(newPage) {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) {
      return;
    }
    setIsPageLoading(true);
    setTimeout(() => {
      setCurrentPage(newPage);
      setIsPageLoading(false);
    }, 300);
  }

  const filteredRestaurants = restaurantsData.filter((restaurant) => {
    const term = searchTerm.toLowerCase().trim();

    const matchesSearch =
      !term ||
      [restaurant.name, restaurant.cuisine, restaurant.description].some(
        (field) => field && field.toLowerCase().includes(term)
      ) ||
      (restaurant.menu &&
        restaurant.menu.some(
          (dish) =>
            dish.name?.toLowerCase().includes(term) ||
            dish.description?.toLowerCase().includes(term)
        ));

    const matchesCuisine =
      selectedCuisine === "Todos" ||
      restaurant.cuisine?.toLowerCase() === selectedCuisine.toLowerCase();

    const matchesStatus =
      selectedStatus === "todos" ||
      (selectedStatus === "aberto" && restaurant.isOpen) ||
      (selectedStatus === "fechado" && !restaurant.isOpen);

    const matchesFavorite =
      !showOnlyFavorites || favorites.includes(restaurant.id);

    const avgPrice = restaurant.averagePrice || 0;
    const matchesPrice =
      selectedPrice === "todos" ||
      (selectedPrice === "baixo" &&
        (avgPrice <= 30 ||
          (restaurant.menu && restaurant.menu.some((dish) => dish.price <= 30)))) ||
      (selectedPrice === "medio" &&
        ((avgPrice > 30 && avgPrice <= 45) ||
          (restaurant.menu &&
            restaurant.menu.some(
              (dish) => dish.price > 30 && dish.price <= 45
            )))) ||
      (selectedPrice === "alto" &&
        (avgPrice > 45 ||
          (restaurant.menu && restaurant.menu.some((dish) => dish.price > 45))));

    return (
      matchesSearch &&
      matchesCuisine &&
      matchesStatus &&
      matchesFavorite &&
      matchesPrice
    );
  });

  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    let comparison = 0;

    if (sortBy === "name") {
      comparison = (a.name || "").localeCompare(b.name || "");
    } else if (sortBy === "cuisine") {
      comparison = (a.cuisine || "").localeCompare(b.cuisine || "");
    } else if (sortBy === "lastUpdate") {
      const dateA = new Date(a.lastUpdate || 0).getTime();
      const dateB = new Date(b.lastUpdate || 0).getTime();
      comparison = dateA - dateB;
    } else if (sortBy === "isOpen") {
      comparison = (b.isOpen ? 1 : 0) - (a.isOpen ? 1 : 0);
    } else if (sortBy === "menuCount") {
      const countA = a.menuCount || (Array.isArray(a.menu) ? a.menu.length : 0);
      const countB = b.menuCount || (Array.isArray(b.menu) ? b.menu.length : 0);
      comparison = countA - countB;
    }

    return sortDirection === "asc" ? comparison : -comparison;
  });

  const totalPages = Math.ceil(sortedRestaurants.length / itemsPerPage) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const paginatedRestaurants = sortedRestaurants.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <main className="main-content">
      <div className="dashboard-actions">
        <button
          onClick={toggleForm}
          className={`toggle-form-btn ${isFormVisible ? "cancel" : ""}`}
        >
          {isFormVisible ? "Cancelar" : "+ Adicionar Restaurante"}
        </button>

        <button
          type="button"
          onClick={handleToggleFavoritesView}
          className={`toggle-favorites-btn ${showOnlyFavorites ? "active" : ""}`}
        >
          {showOnlyFavorites ? "Ver todos os restaurantes" : `Ver favoritos (${favorites.length})`}
        </button>
      </div>

      {isFormVisible && (
        <RestaurantAdd
          onAddRestaurant={addRestaurant}
          addRestaurant={addRestaurant}
        />
      )}

      {showOnlyFavorites && (
        <h2 className="view-title">Restaurantes Favoritos ({filteredRestaurants.length})</h2>
      )}

      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />

      <FilterBar
        selectedCuisine={selectedCuisine}
        onSelectCuisine={handleCuisineChange}
        selectedStatus={selectedStatus}
        onSelectStatus={handleStatusChange}
        selectedPrice={selectedPrice}
        onSelectPrice={handlePriceChange}
      />

      <SortControls
        sortBy={sortBy}
        onSortChange={handleSortChange}
        sortDirection={sortDirection}
        onToggleDirection={handleToggleDirection}
      />

      {loading && <p className="dashboard-loading">Carregando restaurantes...</p>}

      {error && <p className="dashboard-error">{error}</p>}

      {!loading && !error && (
        <>
          {isPageLoading ? (
            <p className="page-loading-message">Carregando restaurantes...</p>
          ) : (
            <RestaurantList
              restaurantData={paginatedRestaurants}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          )}

          <Pagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={sortedRestaurants.length}
            itemsPerPage={itemsPerPage}
          />
        </>
      )}
    </main>
  );
};

export default Dashboard;
