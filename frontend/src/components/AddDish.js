import React, { useState } from "react";
import { API_BASE_URL } from './config';
import axios from "axios";
import "../styles/AddDish.css";

function AddDish({ onDishAdded }) {
  const [dishName, setDishName] = useState("");
  const [price, setPrice] = useState("");
  const [availability, setAvailability] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const restaurantId = localStorage.getItem("restaurantId");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/restaurant/add-dish`,
        {
          restaurant_id: restaurantId,
          dish_name: dishName,
          price: parseFloat(price), // Ensure price is a number
          image_url: imageUrl,
          availability: availability ? 1 : 0,
        }
      );

      alert("Dish added successfully!");
      setDishName("");
      setPrice("");
      setImageUrl("");
      setAvailability(true);
      if (onDishAdded) onDishAdded();
    } catch (err) {
      console.error("Error adding dish", err);
      setError(err.response?.data?.message || "Failed to add dish");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-dish-container">
      <h2 className="title">Add New Dish</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="add-dish-form">
        <input
          type="text"
          placeholder="Dish Name"
          value={dishName}
          onChange={(e) => setDishName(e.target.value)}
          required
          minLength="2"
          maxLength="50"
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          min="0.01"
          step="0.01"
        />

        <input
          type="url"
          placeholder="Image URL (optional)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          pattern="https?://.+"
          title="Include http:// or https://"
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

        <button 
          type="submit" 
          className="add-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding..." : "Add Dish"}
        </button>
      </form>
    </div>
  );
}

export default AddDish;