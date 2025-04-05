import React from "react";
import "../styles/Cart.css";
import { useNavigate } from "react-router-dom";

function Cart({ cart, setCart, isAuthenticated }) {
  console.log("Current Cart State:", cart);
  const navigate = useNavigate();

  const handleRemove = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    console.log(`Removed item at index ${index}. New cart:`, updatedCart);
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
      console.warn("Order not placed. Missing data:", {
        userId,
        cart,
        restaurantId: cart[0]?.restaurant_id,
      });
      return;
    }

    console.log("Placing order for user:", userId);
    console.log("Cart items being ordered:", cart.map((item) => item.dish_name));

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
        console.log("Order result:", result);
        alert("Order placed successfully!");
        setCart([]);

        // Navigate to confirmation page with delivery person info
        navigate("/confirmation", {
          state: {
            deliveryPerson: result.deliveryPerson,
          },
        });
      } else {
        alert("Failed to place order: " + result.error);
        console.error("Order failed:", result);
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
        <p className="empty-msg">
          Your cart is empty. Start adding delicious items!
        </p>
      ) : (
        <>
          <ul className="cart-list">
            {cart.map((item, index) => (
              <li key={index} className="cart-item">
                <img
                  src={item.image_url}
                  alt={item.dish_name}
                  className="cart-img"
                />
                <div className="cart-info">
                  <h3>{item.dish_name}</h3>
                  <p>₹{item.price}</p>
                </div>
                <button
                  className="remove-btn"
                  onClick={() => handleRemove(index)}
                >
                  Remove
                </button>
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
