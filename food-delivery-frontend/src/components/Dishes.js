import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Dishes.css";

function Dishes() {
  const [dishes, setDishes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/dishes")
      .then((res) => setDishes(res.data))
      .catch((err) => console.error("Error fetching dishes:", err));
  }, []);

  const filteredDishes = dishes.filter(dish =>
    dish.dish_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dishes-container">
      <h2>Explore Dishes</h2>

      <input
        type="text"
        placeholder="Search Dishes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />

      <div className="dishes-grid">
        {filteredDishes.length > 0 ? filteredDishes.map((dish) => (
          <div key={dish.id} className="dish-card">
            <img src={dish.image_url} alt={dish.dish_name} className="dish-img" />
            <h3>{dish.dish_name}</h3>
            <p>₹{dish.price}</p>
            <p className="dish-restaurant">{dish.restaurant_name}</p>
          </div>
        )) : <p className="no-result">No dishes found.</p>}
      </div>
    </div>
  );
}

export default Dishes;
