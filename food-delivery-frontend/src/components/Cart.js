import { useNavigate } from "react-router-dom";
import axios from "axios";

function Cart({ cart, setCart }) {
    const navigate = useNavigate();

    // Calculate total price
    const totalPrice = cart.reduce((sum, item) => sum + Number(item.price), 0);


    // Remove item from cart
    const handleRemoveItem = (index) => {
        const updatedCart = cart.filter((_, i) => i !== index);
        setCart(updatedCart);
    };

    // Place order function
    const handlePlaceOrder = () => {
        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }
    
        axios.post("http://localhost:5000/place-order", { items: cart })
            .then(res => {
                alert("Order placed successfully!");
                console.log("Order Response:", res.data);
                setCart([]); // Clear cart after order
                navigate("/");
            })
            .catch(err => {
                console.error("Order Error:", err.response ? err.response.data : err);
                alert("Failed to place order: " + (err.response?.data?.error || "Unknown error"));
            });
    };
    
    

    return (
        <div className="cart">
            <h2>Your Cart</h2>
            
            {cart.length === 0 ? <p>Cart is empty.</p> : (
                <>
                    {cart.map((item, index) => (
                        <div key={index} className="cart-item">
                            <p>{item.dish_name} - ₹{item.price}</p>
                            <button className="remove-btn" onClick={() => handleRemoveItem(index) }>Remove</button>
                        </div>
                    ))}
                    
                    <h3>Total Price: ₹{totalPrice}</h3>

                    <button onClick={handlePlaceOrder} disabled={cart.length === 0}>Place Order</button>
                </>
            )}

            <button onClick={() => navigate("/")}>Continue Shopping</button>
        </div>
    );
}

export default Cart;
