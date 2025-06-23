import React, { useEffect, useState } from "react";
import { API_BASE_URL } from './config';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Restaurants.css";

function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_BASE_URL}/restaurants`)
      .then(response => setRestaurants(response.data))
      .catch(error => console.error("Error fetching restaurants:", error));
  }, []);

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to FoodExpress</h1>
        <p>Browse Restaurants & Delicious Meals</p>
      </header>

      <input
        type="text"
        placeholder="Search Restaurants..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />

      <div className="restaurant-grid">
        {filteredRestaurants.length > 0 ? filteredRestaurants.map((restaurant) => (
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
        )) : <p className="no-result">No restaurants found.</p>}
      </div>
    </div>
  );
}

export default Restaurants;
