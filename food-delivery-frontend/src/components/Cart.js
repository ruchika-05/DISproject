import React from "react";
import "../styles/Cart.css";

function Cart({ cart, setCart, isLoggedIn }) {
  const handleRemove = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
  };

  const handlePlaceOrder = () => {
    if (!isLoggedIn) {
      alert("You need to log in to place an order.");
      return;
    }
    alert("Order placed successfully!");
    setCart([]);
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

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
              disabled={!isLoggedIn}
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
