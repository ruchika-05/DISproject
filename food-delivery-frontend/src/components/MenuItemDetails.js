import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function MenuItemDetails({ cart, setCart }) {
    const { menuId } = useParams();
    const navigate = useNavigate();
    const [menuItem, setMenuItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:5000/menu-item/${menuId}`)
            .then(res => {
                setMenuItem(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("API Error:", err);
                setError("Failed to load menu item");
                setLoading(false);
            });
    }, [menuId]);

    const handleAddToCart = () => {
        const updatedCart = [...cart, menuItem]; // Add item to cart
        setCart(updatedCart);
        alert(`${menuItem.dish_name} added to cart!`);
    };

    if (loading) return <h2>Loading...</h2>;
    if (error) return <h2 style={{ color: "red" }}>{error}</h2>;

    return (
        <div className="menu-item-details">
            <img src={menuItem.image_url} alt={menuItem.dish_name} className="menu-item-img" />
            <h2>{menuItem.dish_name}</h2>
            <p><strong>Price:</strong> ₹{menuItem.price}</p>
            <p><strong>Availability:</strong> {menuItem.availability ? "Available" : "Out of Stock"}</p>

            <button onClick={handleAddToCart}>Add to Cart</button>
            <button onClick={() => navigate("/cart")}>Go to Cart</button>
        </div>
    );
}

export default MenuItemDetails;
