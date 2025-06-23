import React, { useState, useEffect } from "react";
import { API_BASE_URL } from './config';
import "../styles/Cart.css";
import { useNavigate } from "react-router-dom";

function Cart({ cart, setCart, isAuthenticated }) {
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [state, setState] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (isAuthenticated && userId) {
      fetch(`${API_BASE_URL}/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setAddress(data.address || "");
          setPincode(data.pincode || "");
          setState(data.state || "");
        })
        .catch((err) => console.error("Failed to fetch address:", err));
    } else {
      setAddress("");
      setPincode("");
      setState("");
    }
  }, [isAuthenticated]);

  const handleRemove = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      alert("You need to log in to place an order.");
      return;
    }

    const userId = localStorage.getItem("userId");

    if (!userId || cart.length === 0 || !cart[0].restaurant_id) {
      alert("Missing user, cart items, or restaurant.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          restaurant_id: cart[0].restaurant_id,
          items: cart.map((item) => item.dish_name),
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Order placed successfully!");
        setCart([]);
        navigate("/confirmation", {
          state: {
            deliveryPerson: result.deliveryPerson,
          },
        });
      } else {
        alert("Failed to place order: " + result.error);
      }
    } catch (error) {
      console.error("Order error:", error);
      alert("Error placing order.");
    }
  };

  const handleSaveAddress = async () => {
    const userId = localStorage.getItem("userId");

    try {
      const response = await fetch(`http://localhost:5000/user/${userId}/address`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address, pincode, state }),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Address updated successfully!");
        setEditing(false);
      } else {
        alert("Failed to update address.");
        console.error(result);
      }
    } catch (error) {
      console.error("Address update error:", error);
    }
  };

  const total = cart.reduce((sum, item) => sum + Number(item.price), 0);

  return (
    <div className="cart-container">
      <h2 className="cart-heading">🛒 Your Cart</h2>

      {isAuthenticated && (
        <div className="address-section">
          <h3>Delivery Address</h3>
          {!editing ? (
            <>
              <p><strong>Address:</strong> {address}</p>
              <p><strong>Pincode:</strong> {pincode}</p>
              <p><strong>State:</strong> {state}</p>
              <button onClick={() => setEditing(true)} className="edit-btn">Edit Address</button>
            </>
          ) : (
            <>
              <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" />
              <input value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="Pincode" />
              <input value={state} onChange={(e) => setState(e.target.value)} placeholder="State" />
              <button onClick={handleSaveAddress} className="save-btn">Save</button>
              <button onClick={() => setEditing(false)} className="cancel-btn">Cancel</button>
            </>
          )}
        </div>
      )}

      {cart.length === 0 ? (
        <p className="empty-msg">Your cart is empty. Start adding delicious items!</p>
      ) : (
        <>
          <ul className="cart-list">
            {cart.map((item, index) => (
              <li key={index} className="cart-item">
                <img src={item.image_url} alt={item.dish_name} className="cart-img" />
                <div className="cart-info">
                  <h3>{item.dish_name}</h3>
                  <p>₹{item.price}</p>
                </div>
                <button className="remove-btn" onClick={() => handleRemove(index)}>Remove</button>
              </li>
            ))}
          </ul>

          <div className="cart-summary">
            <h3>Total: ₹{total}</h3>
            <button className="place-order-btn" onClick={handlePlaceOrder} disabled={!isAuthenticated}>
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
