import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Dishes.css";

function Dishes({ cart, setCart }) {
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

  const handleAddToCart = (item) => {
    const itemWithRestaurant = { ...item, restaurant_id: item.restaurant_id }; // assuming restaurant_id is included

    if (cart.length > 0 && cart[0].restaurant_id !== item.restaurant_id) {
      alert("You can order from only one restaurant at a time.");
      return;
    }

    const updatedCart = [...(cart || []), itemWithRestaurant];
    setCart(updatedCart);
    alert(`${item.dish_name} added to cart`);
  };

  return (
    <div className="dishes-container">
      <h2 className="dish-heading">Explore Dishes</h2>

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
            <p>${dish.price}</p>
            <p className="dish-restaurant">{dish.restaurant_name}</p>
            <button className="add-cart-btn" onClick={() => handleAddToCart(dish)}>
              Add to Cart
            </button>
          </div>
        )) : <p className="no-result">No dishes found.</p>}
      </div>
    </div>
  );
}

export default Dishes;
