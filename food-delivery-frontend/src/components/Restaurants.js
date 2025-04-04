import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Restaurants.css";

function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/restaurants")
      .then(response => setRestaurants(response.data))
      .catch(error => console.error("Error fetching restaurants:", error));
  }, []);

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to FoodExpress</h1>
        <p>Browse restaurants and delicious meals</p>
      </header>

      <div className="restaurant-grid">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className="restaurant-card"
            onClick={() => navigate(`/menu/${restaurant.id}`)}
          >
            <img
              src={restaurant.image_url}
              alt={restaurant.name}
              className="restaurant-image"
            />
            <h3>{restaurant.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Restaurants;
