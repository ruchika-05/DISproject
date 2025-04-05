import React, { useState } from "react";
import axios from "axios";
import "../styles/AddDish.css";

function AddDish({ onDishAdded }) {
  const [dishName, setDishName] = useState("");
  const [price, setPrice] = useState("");
  const [availability, setAvailability] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const restaurantId = localStorage.getItem("restaurantId");

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:5000/restaurant/add-dish", {
        restaurant_id: restaurantId,
        dish_name: dishName,
        price,
        image_url: imageUrl,
        availability: availability ? 1 : 0,
      })
      .then((res) => {
        alert("Dish added successfully!");
        setDishName("");
        setPrice("");
        setImageUrl("");
        setAvailability(true);
        if (onDishAdded) onDishAdded();
      })
      .catch((err) => {
        console.error("Error adding dish", err);
        alert("Failed to add dish");
      });
  };

  return (
    <div className="add-dish-container">
      <h2 className="title">Add New Dish</h2>
      <form onSubmit={handleSubmit} className="add-dish-form">
        <input
          type="text"
          placeholder="Dish Name"
          value={dishName}
          onChange={(e) => setDishName(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />

        <div className="checkbox-container">
          <input
            type="checkbox"
            checked={availability}
            onChange={(e) => setAvailability(e.target.checked)}
            id="availability"
          />
          <label htmlFor="availability">Available</label>
        </div>

        <button type="submit" className="add-btn">
          Add Dish
        </button>
      </form>
    </div>
  );
}

export default AddDish;
