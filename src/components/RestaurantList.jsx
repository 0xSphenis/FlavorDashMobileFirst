import RestaurantCard from "./RestaurantCard";
import "./RestaurantList.css";

const RestaurantList = ({ restaurantData, favorites = [], onToggleFavorite }) => {
  if (!restaurantData || restaurantData.length === 0) {
    return <p className="empty-message">não conseguimos encontrar restaurantes para você :/</p>;
  }

  return (
    <section className="restaurant-list">
      {restaurantData.map((restaurant) => (
        <RestaurantCard
          key={restaurant.id}
          {...restaurant}
          isFavorite={favorites.includes(restaurant.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </section>
  );
};

export default RestaurantList;
