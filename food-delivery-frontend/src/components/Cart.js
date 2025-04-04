import React from "react";
import "../styles/Cart.css";

function Cart({ cart, setCart, isAuthenticated }) {
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
  
    try {
      const userId = localStorage.getItem("userId"); // Assuming you saved userId on login
  
      const response = await fetch("http://localhost:5000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          restaurant_id: cart[0]?.restaurant_id, // assuming all items are from the same restaurant
          items: cart,
        }),
      });
  
      const result = await response.json();
  
      if (result.success) {
        alert("Order placed successfully!");
        setCart([]);
      } else {
        alert("Failed to place order.");
      }
    } catch (error) {
      console.error("Order error:", error);
      alert("Error placing order.");
    }
  };
  

  const total = cart.reduce((sum, item) => sum + Number(item.price), 0);

  return (
    <div className="cart-container">
      <h2 className="cart-heading">🛒 Your Cart</h2>

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
            <button
              className="place-order-btn"
              onClick={handlePlaceOrder}
              disabled={!isAuthenticated}
            >
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
