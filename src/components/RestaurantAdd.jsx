import { useState } from "react";
import "./RestaurantAdd.css";

const RestaurantAdd = ({ onAddRestaurant, addRestaurant }) => {
  const [name, setName] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [description, setDescription] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  function handleSubmit(event) {
    event.preventDefault();
    const newRestaurant = {
      id: Date.now(),
      name,
      cuisine,
      isOpen,
      lastUpdate: new Date().toISOString(),
      description,
    };

    console.log("Novo restaurante criado:", newRestaurant);
    if (onAddRestaurant) {
      onAddRestaurant(newRestaurant);
    } else if (addRestaurant) {
      addRestaurant(newRestaurant);
    }
    
    setName("");
    setCuisine("");
    setDescription("");
    setIsOpen(true);
  }

  return (
    <form className="restaurant-form" onSubmit={handleSubmit}>
      <h2 className="form-title">Novo Restaurante</h2>

      <div className="form-group">
        <label htmlFor="name">Nome do restaurante</label>
        <input
          id="name"
          type="text"
          placeholder="Ex: Verde Veg"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="cuisine">Tipo de cozinha</label>
        <input
          id="cuisine"
          type="text"
          placeholder="Ex: Brasileira, Italiana, Vegana..."
          value={cuisine}
          onChange={(e) => setCuisine(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Descrição</label>
        <textarea
          id="description"
          rows="3"
          placeholder="Conte brevemente sobre os pratos..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div className="form-checkbox">
        <input
          id="isOpen"
          type="checkbox"
          checked={isOpen}
          onChange={(e) => setIsOpen(e.target.checked)}
        />
        <label htmlFor="isOpen">Aberto no momento</label>
      </div>

      <button type="submit" className="submit-btn">
        Cadastrar Restaurante
      </button>
    </form>
  );
};

export default RestaurantAdd;