import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/Menu.css";

function Menu({ cart, setCart }) {
    const { restaurantId } = useParams();
    const [menuItems, setMenuItems] = useState([]);
    const [restaurantName, setRestaurantName] = useState("");
  
    useEffect(() => {
      axios.get(`http://localhost:5000/menu/${restaurantId}`)
        .then((res) => {
          setMenuItems(res.data);
          if (res.data.length > 0) {
            setRestaurantName(res.data[0].restaurant_name);
          }
        })
        .catch((err) => console.error("Error fetching menu:", err));
    }, [restaurantId]);
  
    const handleAddToCart = (item) => {
      const updatedCart = [...(cart || []), item];
      setCart(updatedCart);
      alert(`${item.dish_name} added to cart`);
    };
  
    return (
      <div className="menu-container">
        <header className="menu-header">
          <h2>Menu - {restaurantName || "Restaurant"}</h2>
        </header>
  
        <div className="menu-grid">
          {menuItems.map((item) => (
            <div key={item.id} className="menu-card">
              <img src={item.image_url} alt={item.dish_name} className="menu-img" />
              <h3>{item.dish_name}</h3>
              <p>₹{item.price}</p>
              <button className="add-btn" onClick={() => handleAddToCart(item)}>Add to Cart</button>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
export default Menu;